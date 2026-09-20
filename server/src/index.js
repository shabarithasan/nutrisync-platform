import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { z } from 'zod';
import { prisma, requireAuth, requireRole } from './auth.js';
import { accessToken, expiresInDays, hashPassword, hashToken, publicUser, randomToken, tokenCookie, verifyPassword } from './lib.js';
import { sendEmail, verificationEmailBody, resetEmailBody } from './mail.js';
import { foodRouter } from './food.js';
import { nutritionRouter } from './nutrition.js';

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowedOrigins = new Set([clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173']);
const isLocalOrigin = origin => /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);
app.use(helmet());
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowedOrigins.has(origin) || (process.env.NODE_ENV !== 'production' && isLocalOrigin(origin))), credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false }));
app.use('/api/food', foodRouter);
app.use('/api/nutrition', nutritionRouter);

const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(190), password: z.string().min(8).max(128) });
const credentialsSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });
const passwordSchema = z.object({ password: z.string().min(8).max(128) });
const parse = (schema, value, res) => { const result = schema.safeParse(value); if (!result.success) { res.status(422).json({ error: result.error.issues[0].message }); return null; } return result.data; };
const autoVerify = process.env.NODE_ENV !== 'production' || process.env.AUTO_VERIFY_EMAIL === 'true';
const devToken = (key, token) => process.env.NODE_ENV !== 'production' ? { [key]: token } : {};

async function createSession(user, req, res) {
  const refreshToken = randomToken();
  await prisma.session.create({ data: { userId: user.id, refreshTokenHash: hashToken(refreshToken), userAgent: req.get('user-agent') || null, ipAddress: req.ip, expiresAt: expiresInDays(Number(process.env.REFRESH_TOKEN_DAYS || 7)) } });
  res.cookie('refreshToken', refreshToken, tokenCookie(refreshToken));
  return { accessToken: accessToken(user), user: publicUser(user) };
}

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const body = parse(registerSchema, req.body, res); if (!body) return;
    const email = body.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ error: 'An account with that email already exists.' });
    const user = await prisma.user.create({ data: { name: body.name, email, passwordHash: await hashPassword(body.password), isEmailVerified: autoVerify } });
    const verificationToken = randomToken();
    await prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash: hashToken(verificationToken), expiresAt: expiresInDays(1) } });
    sendEmail({ to: email, subject: 'Verify your NutriSync account', text: verificationEmailBody(verificationToken) }).catch(()=>{});
    res.status(201).json({ message: autoVerify ? 'Account created. You can now sign in.' : 'Account created. Check your email to verify it.', ...devToken('verificationToken', verificationToken) });
  } catch (error) { next(error); }
});

app.post('/api/auth/verify-email', async (req, res, next) => {
  try {
    const token = req.body?.token; if (!token || typeof token !== 'string') return res.status(422).json({ error: 'A verification token is required.' });
    const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
    if (!record || record.usedAt || record.expiresAt < new Date()) return res.status(400).json({ error: 'This verification link is invalid or expired.' });
    await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { isEmailVerified: true } }), prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
    res.json({ message: 'Email verified. You can now sign in.' });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const body = parse(credentialsSchema, req.body, res); if (!body) return;
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
    if (!user.isEmailVerified) {
      if (!autoVerify) return res.status(403).json({ error: 'Please verify your email before signing in.' });
      await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
    }
    res.json(await createSession(user, req, res));
  } catch (error) { next(error); }
});

app.post('/api/auth/admin-login', async (req, res, next) => {
  try {
    const body = parse(credentialsSchema, req.body, res); if (!body) return;
    const email = body.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.role === 'ADMIN') {
      if (!(await verifyPassword(body.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid admin email or password.' });
      return res.json(await createSession(user, req, res));
    }
    const envEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const envPw = process.env.ADMIN_PASSWORD || '';
    if (envEmail && envPw && email === envEmail && body.password === envPw) {
      let admin = user;
      if (!admin) admin = await prisma.user.create({ data: { name: 'Administrator', email, passwordHash: await hashPassword(body.password), isEmailVerified: true, role: 'ADMIN' } });
      else admin = await prisma.user.update({ where: { id: admin.id }, data: { role: 'ADMIN', isEmailVerified: true } });
      return res.json(await createSession(admin, req, res));
    }
    return res.status(403).json({ error: 'Access denied. This account is not an administrator.' });
  } catch (error) { next(error); }
});

app.post('/api/auth/refresh', async (req, res, next) => {
  try {
    const oldToken = req.cookies.refreshToken; if (!oldToken) return res.status(401).json({ error: 'Refresh token missing.' });
    const oldHash = hashToken(oldToken);
    const session = await prisma.session.findFirst({ where: { refreshTokenHash: oldHash, expiresAt: { gt: new Date() } }, include: { user: true } });
    const clearRefreshCookie = () => {
      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/api/auth' });
    };
    if (!session) { clearRefreshCookie(); return res.status(401).json({ error: 'Refresh token is invalid or expired.' }); }
    if (!session.user.isEmailVerified) { await prisma.session.deleteMany({ where: { id: session.id } }); clearRefreshCookie(); return res.status(403).json({ error: 'Please verify your email before refreshing your session.' }); }
    const freshToken = randomToken();
    const replaced = await prisma.session.deleteMany({ where: { id: session.id, refreshTokenHash: oldHash } });
    if (!replaced.count) { clearRefreshCookie(); return res.status(401).json({ error: 'Refresh token has already been used.' }); }
    await prisma.session.create({ data: { userId: session.userId, refreshTokenHash: hashToken(freshToken), userAgent: req.get('user-agent') || null, ipAddress: req.ip, expiresAt: expiresInDays(Number(process.env.REFRESH_TOKEN_DAYS || 7)) } });
    res.cookie('refreshToken', freshToken, tokenCookie(freshToken)).json({ accessToken: accessToken(session.user), user: publicUser(session.user) });
  } catch (error) { next(error); }
});

app.post('/api/auth/logout', requireAuth, async (req, res, next) => { try { const token = req.cookies.refreshToken; if (token) await prisma.session.deleteMany({ where: { refreshTokenHash: hashToken(token), userId: req.auth.sub } }); res.clearCookie('refreshToken', { path: '/' }); res.clearCookie('refreshToken', { path: '/api/auth' }); res.json({ message: 'Signed out.' }); } catch (error) { next(error); } });
app.get('/api/auth/me', requireAuth, async (req, res, next) => { try { const user = await prisma.user.findUnique({ where: { id: req.auth.sub } }); if (!user) return res.status(401).json({ error: 'Account not found.' }); res.json({ user: publicUser(user) }); } catch (error) { next(error); } });

app.post('/api/auth/forgot-password', async (req, res, next) => { try { const parsed = z.string().email().safeParse(req.body?.email); if (!parsed.success) return res.status(422).json({ error: 'A valid email is required.' }); const email = parsed.data.toLowerCase(); const user = await prisma.user.findUnique({ where: { email } }); if (!user) return res.json({ message: 'If that account exists, a reset link has been sent.' }); const token = randomToken(); await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } }); sendEmail({ to: email, subject: 'Reset your NutriSync password', text: resetEmailBody(token) }).catch(()=>{}); res.json({ message: 'If that account exists, a reset link has been sent.', ...devToken('resetToken', token) }); } catch (error) { next(error); } });
app.post('/api/auth/reset-password', async (req, res, next) => { try { const body = parse(passwordSchema.extend({ token: z.string().min(1) }), req.body, res); if (!body) return; const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(body.token) } }); if (!record || record.usedAt || record.expiresAt < new Date()) return res.status(400).json({ error: 'This reset link is invalid or expired.' }); await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(body.password) } }), prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }), prisma.session.deleteMany({ where: { userId: record.userId } })]); res.json({ message: 'Password updated. Please sign in.' }); } catch (error) { next(error); } });
app.get('/api/admin/health', requireAuth, requireRole('ADMIN'), (req, res) => res.json({ message: 'Admin authorization confirmed.' }));
app.post('/api/admin/set-role', requireAuth, requireRole('ADMIN'), async (req,res,next)=>{try{const body=parse(z.object({userId:z.string().min(1),role:z.enum(['USER','ADMIN'])}),req.body,res);if(!body)return;const user=await prisma.user.update({where:{id:body.userId},data:{role:body.role}});res.json({user:publicUser(user)});}catch(e){next(e)}});
app.get('/api/admin/users', requireAuth, requireRole('ADMIN'), async (req,res,next)=>{try{const users=await prisma.user.findMany({orderBy:{createdAt:'desc'},take:100});res.json({users:users.map(publicUser)});}catch(e){next(e)}});
const profileSchema = z.object({ age:z.coerce.number().int().min(13).max(120), gender:z.string().min(1), heightCm:z.coerce.number().min(100).max(250), currentWeightKg:z.coerce.number().min(25).max(400), targetWeightKg:z.coerce.number().min(25).max(400), activityLevel:z.enum(['sedentary','light','moderate','active','very_active']), healthConditions:z.array(z.string()).optional(), healthDetails:z.string().max(500).optional().nullable(), allergies:z.string().max(500).optional().nullable(), foodsToAvoid:z.string().max(500).optional().nullable(), goal:z.enum(['loss','maintenance','gain']), dietPreference:z.enum(['vegetarian','non_vegetarian','vegan','eggetarian']), cuisinePreference:z.string().max(80).optional().nullable(), mealsPerDay:z.coerce.number().int().min(3).max(6), likedFoods:z.string().max(500).optional().nullable(), dislikedFoods:z.string().max(500).optional().nullable() });
const targets = p => { const bmi=+(p.currentWeightKg/((p.heightCm/100)**2)).toFixed(1); const base=(10*p.currentWeightKg)+(6.25*p.heightCm)-(5*p.age)+(p.gender==='female'?-161:5); const factors={sedentary:1.2,light:1.375,moderate:1.55,very_active:1.725}; const tdee=Math.round(base*(factors[p.activityLevel]||1.2)); const calorieTarget=Math.max(1200, tdee+(p.goal==='loss'?-350:p.goal==='gain'?300:0)); return { bmi,bmr:Math.round(base),tdee,calorieTarget,proteinTarget:Math.round(p.currentWeightKg*(p.goal==='gain'?1.8:1.5)),fatTarget:Math.round(calorieTarget*.27/9),carbTarget:Math.round((calorieTarget-(Math.round(p.currentWeightKg*(p.goal==='gain'?1.8:1.5))*4)-(Math.round(calorieTarget*.27/9)*9))/4) }; };
const planMeals = (p,t) => { const veg=p.dietPreference!=='non_vegetarian'; const main=veg?'Paneer tikka, brown rice & seasonal vegetables':'Grilled chicken, brown rice & seasonal vegetables'; return [['Breakfast',veg?'Vegetable oats with Greek yogurt':'Egg scramble with wholegrain toast',.22],['Morning snack','Fruit with a handful of nuts',.1],['Lunch',main,.28],['Evening snack',veg?'Roasted chickpeas & buttermilk':'Yogurt with berries',.1],['Dinner',veg?'Lentil dal, roti & salad':'Baked fish, roti & salad',.3]].map(([meal,food,ratio])=>({meal,food,serving:'1 balanced portion',calories:Math.round(t.calorieTarget*ratio),protein:Math.round(t.proteinTarget*ratio),carbs:Math.round(t.carbTarget*ratio),fat:Math.round(t.fatTarget*ratio)})); };
app.get('/api/profile', requireAuth, async (req,res,next)=>{try{const profile=await prisma.dietProfile.findUnique({where:{userId:req.auth.sub}});res.json({profile, targets:profile?targets(profile):null});}catch(e){next(e)}});
app.put('/api/profile', requireAuth, async (req,res,next)=>{try{const body=parse(profileSchema,req.body,res);if(!body)return;const profile=await prisma.dietProfile.upsert({where:{userId:req.auth.sub},create:{...body,userId:req.auth.sub},update:body});res.json({profile,targets:targets(profile)});}catch(e){next(e)}});
app.post('/api/diet-plans/generate', requireAuth, async (req,res,next)=>{try{const profile=await prisma.dietProfile.findUnique({where:{userId:req.auth.sub}});if(!profile)return res.status(422).json({error:'Create your diet profile first.'});const t=targets(profile);const plan=await prisma.dietPlan.create({data:{userId:req.auth.sub,...t,meals:planMeals(profile,t)}});res.status(201).json({plan,targets:t});}catch(e){next(e)}});
app.get('/api/diet-plans/latest', requireAuth, async (req,res,next)=>{try{res.json({plan:await prisma.dietPlan.findFirst({where:{userId:req.auth.sub},orderBy:{createdAt:'desc'}})});}catch(e){next(e)}});
app.post('/api/meals', requireAuth, async (req,res,next)=>{try{const mealSchema=z.object({mealType:z.string().min(1),foodName:z.string().min(1),serving:z.string().min(1),calories:z.coerce.number().int().min(0),protein:z.coerce.number().min(0),carbs:z.coerce.number().min(0),fat:z.coerce.number().min(0),loggedAt:z.string().datetime().optional()});const body=parse(mealSchema,req.body,res);if(!body)return;const {loggedAt,...data}=body;res.status(201).json({meal:await prisma.mealEntry.create({data:{...data,userId:req.auth.sub,loggedAt:loggedAt||undefined}})});}catch(e){next(e)}});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../../dist');

app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

app.use((error, req, res, next) => { console.error(error); res.status(500).json({ error: 'Unexpected server error.' }); });

const port = Number(process.env.PORT || 4000);
if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`NutriSync API listening on ${port}`));
export default app;
