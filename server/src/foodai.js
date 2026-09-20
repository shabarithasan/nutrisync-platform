import fs from 'node:fs';
const LOGFILE = process.env.TEMP ? process.env.TEMP + '\\opencode\\food.log' : 'food.log';
const foodLog = m => { try { fs.appendFileSync(LOGFILE, `[${new Date().toISOString()}] ${m}\n`); } catch {} };

const PROMPT = `You are a professional nutrition analyst. Analyze the food(s) in this image.
Return ONLY valid JSON with this exact shape (no markdown, no commentary):
{"foods":[{"name":"Food name","serving":"serving size e.g. 1 plate / 250 g","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0,"confidence":90}],"quality":{"blurry":false,"noFoodDetected":false}}
Rules:
- List ONLY foods that are clearly visible in the image. Never invent, guess, or add foods that are not actually present.
- If exactly one food is visible, return exactly one food. Never pad the list with extra items.
- Ignore the table, background, hands, cutlery, cups, or packaging.
- calories in kcal; protein, carbs, fat, fiber, sugar in grams; estimate for the single serving shown.
- If no food is visible in the image, set foods=[] and quality.noFoodDetected=true.
- If the image is too blurry or unreadable, set quality.blurry=true and foods=[].
- confidence is 0-100 how sure you are of the food and portion.`;

function parseJson(text) {
  let data;
  try { data = JSON.parse(text); }
  catch {
    const clean = String(text).replace(/^```json|^```|```$/g, '').trim();
    const m = clean.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Model returned no JSON.');
    try { data = JSON.parse(m[0]); }
    catch { data = JSON.parse(m[0].replace(/,\s*([}\]])/g, '$1')); }
  }
  const foods = (data.foods || []).map(f => ({
    name: String(f.name || 'Unknown food'),
    serving: String(f.serving || '1 serving'),
    calories: Math.max(0, Math.round(Number(f.calories) || 0)),
    protein: Math.max(0, Math.round((Number(f.protein) || 0) * 10) / 10),
    carbs: Math.max(0, Math.round((Number(f.carbs) || 0) * 10) / 10),
    fat: Math.max(0, Math.round((Number(f.fat) || 0) * 10) / 10),
    fiber: Math.max(0, Math.round((Number(f.fiber) || 0) * 10) / 10),
    sugar: Math.max(0, Math.round((Number(f.sugar) || 0) * 10) / 10),
    confidence: Math.max(0, Math.min(100, Math.round(Number(f.confidence) || 50))),
  })).filter(f => f.name !== 'Unknown food' || f.calories > 0);
  return { foods, quality: { blurry: !!data.quality?.blurry, noFoodDetected: !!data.quality?.noFoodDetected } };
}

async function withTimeout(ms, promise) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('AI request timed out.')), ms); });
  try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function openRouterOnce(model, b64, mime) {
  const key = process.env.OPENROUTER_API_KEY;
  const res = await withTimeout(40000, fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'HTTP-Referer': 'http://localhost:5173', 'X-Title': 'NutriSync' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: [{ type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } }] },
      ],
      max_tokens: 2000,
    }),
  }));
  const body = await res.text();
  if (!res.ok) {
    const err = new Error(`OpenRouter error ${res.status}: ${body.slice(0, 200)}`);
    err.status = res.status;
    err.retryAfterMs = Math.min(15000, Math.max(3000, Number(res.headers.get('retry-after') || 5000) * 1000));
    throw err;
  }
  const data = JSON.parse(body);
  const content = data.choices?.[0]?.message?.content || '{}';
  try { return parseJson(typeof content === 'string' ? content : JSON.stringify(content)); }
  catch (parseError) { const wrapped = new Error(`OpenRouter parse failure: ${parseError.message} | raw: ${String(typeof content === 'string' ? content : JSON.stringify(content)).slice(0, 300)}`); wrapped.status = 502; throw wrapped; }
}

async function openRouterRetry(model, b64, mime) {
  try { return await openRouterOnce(model, b64, mime); }
  catch (e) {
    if (!e.status && /fetch failed|network|ECONN|ENOTFOUND|ETIMEDOUT/i.test(e.message || '')) { await delay(2500); return openRouterOnce(model, b64, mime); }
    throw e;
  }
}

async function viaOpenRouter(b64, mime) {
  const primary = process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';
  const chain = [primary, ...['google/gemma-4-31b-it:free', 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', 'dots-studio/dots-3-note-preview:free'].filter(m => m !== primary)];
  let lastResult = null;
  let lastError = null;
  for (const model of chain) {
    try {
      const result = await openRouterRetry(model, b64, mime);
      foodLog(`model=${model} foods=${result.foods.length} noFood=${result.quality.noFoodDetected}`);
      if (result.foods.length > 0) return result;
      lastResult = result;
      foodLog(`model=${model} saw no food - trying next model`);
    } catch (e) {
      lastError = e;
      foodLog(`model=${model} failed: ${(e.message || '').slice(0, 200)}`);
      if (e.status === 429 && e.retryAfterMs > 0 && e.retryAfterMs <= 15000) { await delay(e.retryAfterMs); try { lastResult = await openRouterRetry(model, b64, mime); foodLog(`model=${model} retried foods=${lastResult.foods.length}`); if (lastResult.foods.length > 0) return lastResult; } catch (e2) { lastError = e2; } }
    }
  }
  if (lastResult) return lastResult;
  throw lastError || new Error('All AI models failed.');
}

export async function analyzeFoodImage(b64, mime = 'image/jpeg') {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('Food scanner is not configured yet. Add OPENROUTER_API_KEY to the server .env file.');
  return { ...await viaOpenRouter(b64, mime), provider: 'openrouter', demo: false };
}