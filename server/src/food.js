import { Router } from 'express';
import { z } from 'zod';
import { prisma, requireAuth } from './auth.js';
import { analyzeFoodImage } from './foodai.js';

const router = Router();
router.use(requireAuth);

const parse = (schema, value, res) => { const r = schema.safeParse(value); if (!r.success) { res.status(422).json({ error: r.error.issues[0].message }); return null; } return r.data; };
const mimeOf = raw => { const m = raw.match(/^data:([a-z0-9./+-]+);base64,/); return m ? m[1] : 'image/jpeg'; };
const base64Of = raw => raw.replace(/^data:[a-z0-9./+-]+;base64,/, '');

router.post('/analyze', async (req, res, next) => {
  try {
    const body = parse(z.object({ image: z.string().trim().min(200) }), req.body, res); if (!body) return;
    const image = base64Of(body.image);
    if (Buffer.byteLength(image, 'base64') > 10 * 1024 * 1024) return res.status(413).json({ error: 'Image is too large. Max size is 10 MB.' });
    let result;
    try { result = await analyzeFoodImage(image, mimeOf(body.image)); }
    catch (e) {
      const m = e.message || '';
      console.error('[food/analyze] provider error:', m.slice(0, 500));
      if (/not configured/.test(m)) return res.status(502).json({ error: m });
      if (e.status === 429 || /quota|rate\s*limit|exceeded you/.test(m)) return res.status(429).json({ error: 'The AI scanner is busy or out of quota right now. Try again in a moment.' });
      if (/timed out/.test(m)) return res.status(504).json({ error: 'Scanning took too long. Try a smaller, clearer photo of your food.' });
      if (/format|unsupported|not.*supported|inline|decode/i.test(m)) return res.status(422).json({ error: 'This photo format is not supported. Please use a JPG or PNG photo.' });
      return res.status(502).json({ error: 'The AI food scanner could not read this image right now. Try a well-lit, close-up photo of your food and try again.' });
    }
    if (result.quality.noFoodDetected || !result.foods.length) return res.status(422).json({ error: 'No food detected in this image. Point the camera at your meal and try again.' });
    if (result.quality.blurry) return res.status(422).json({ error: 'This image looks blurry. Retake it with steady hands and good lighting.' });
    res.json({ foods: result.foods.slice(0, 5), provider: result.provider, demo: result.demo });
  } catch (e) { next(e); }
});

const scanMealSchema = z.object({
  mealType: z.string().trim().min(1).max(40).optional().nullable(),
  foodName: z.string().trim().min(1).max(200),
  serving: z.string().trim().min(1).max(200),
  calories: z.coerce.number().int().min(0).max(10000),
  protein: z.coerce.number().min(0).max(1000),
  carbs: z.coerce.number().min(0).max(1000),
  fat: z.coerce.number().min(0).max(1000),
  fiber: z.coerce.number().min(0).max(1000).optional().nullable(),
  sugar: z.coerce.number().min(0).max(1000).optional().nullable(),
  confidence: z.coerce.number().int().min(0).max(100).optional().nullable(),
  imageUrl: z.string().max(5000).optional().nullable(),
  loggedAt: z.string().datetime().optional().nullable(),
});

router.post('/meals', async (req, res, next) => {
  try {
    const body = parse(scanMealSchema, req.body, res); if (!body) return;
    const { loggedAt, mealType, ...data } = body;
    const meal = await prisma.mealEntry.create({ data: { ...data, mealType: mealType || 'scanned', userId: req.auth.sub, loggedAt: loggedAt || undefined } });
    res.status(201).json({ meal });
  } catch (e) { next(e); }
});

router.get('/today', async (req, res, next) => {
  try {
    const d = String(req.query.date || '');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : new Date().toISOString().slice(0, 10);
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59.999`);
    const meals = await prisma.mealEntry.findMany({ where: { userId: req.auth.sub, loggedAt: { gte: start, lte: end } }, orderBy: { loggedAt: 'desc' } });
    const totals = meals.reduce((a, m) => { a.calories += m.calories || 0; a.protein += m.protein || 0; a.carbs += m.carbs || 0; a.fat += m.fat || 0; a.fiber += m.fiber || 0; a.sugar += m.sugar || 0; return a; }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });
    res.json({ date, meals, totals });
  } catch (e) { next(e); }
});

router.delete('/meals/:id', async (req, res, next) => {
  try {
    await prisma.mealEntry.deleteMany({ where: { id: req.params.id, userId: req.auth.sub } });
    res.json({ message: 'Meal deleted.' });
  } catch (e) { next(e); }
});

export const foodRouter = router;