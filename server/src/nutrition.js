import { Router } from 'express';
import { z } from 'zod';
import { prisma, requireAuth } from './auth.js';

const router = Router();

const CALORIE_DEFICIT = 500;
const CALORIE_SURPLUS = 300;
const MIN_CALORIES_MALE = 1500;
const MIN_CALORIES_FEMALE = 1200;

const PROTEIN_RANGE = { loss: [1.2, 1.6], maintenance: [1.0, 1.2], gain: [1.2, 1.6] };
const FAT_PERCENTAGE = 0.25;
const FAT_CALORIE_DIVISOR = 9;
const PROTEIN_CALORIE_DIVISOR = 4;
const CARB_CALORIE_DIVISOR = 4;
const FIBER_FACTOR = 14;
const WATER_FACTOR_ML_PER_KG = 35;
const UNDER_18_AGE = 18;

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const ACTIVITY_LABELS = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extra_active: 'Extra Active',
};

const GOAL_LABELS = {
  loss: 'Weight Loss',
  maintenance: 'Weight Maintenance',
  gain: 'Weight Gain',
};

const calculateInput = z.object({
  age: z.coerce.number().int().min(10).max(120),
  gender: z.enum(['male', 'female']),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(25).max(400),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
  goal: z.enum(['loss', 'maintenance', 'gain']),
});

export function calculateBMI(weightKg, heightCm) {
  if (heightCm <= 0 || weightKg <= 0) return { bmi: 0, category: 'Unknown' };
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;
  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obesity';
  return { bmi: rounded, category };
}

export function calculateBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return base + (gender === 'female' ? -161 : 5);
}

export function calculateTDEE(bmr, activityLevel) {
  const factor = ACTIVITY_FACTORS[activityLevel] || 1.2;
  return bmr * factor;
}

export function calculateCalories(tdee, goal) {
  if (goal === 'loss') return tdee - CALORIE_DEFICIT;
  if (goal === 'gain') return tdee + CALORIE_SURPLUS;
  return tdee;
}

export function calculateProteinRange(weightKg, goal) {
  const [minF, maxF] = PROTEIN_RANGE[goal] || PROTEIN_RANGE.maintenance;
  return { min: weightKg * minF, max: weightKg * maxF };
}

export function calculateFatRange(calories) {
  const fatCal = calories * FAT_PERCENTAGE;
  return { min: fatCal / FAT_CALORIE_DIVISOR, max: fatCal / FAT_CALORIE_DIVISOR };
}

export function calculateCarbRange(calories, proteinMin, proteinMax, fatG) {
  const fatCal = fatG * FAT_CALORIE_DIVISOR;
  const maxCarbs = Math.max(0, (calories - proteinMin * PROTEIN_CALORIE_DIVISOR - fatCal) / CARB_CALORIE_DIVISOR);
  const minCarbs = Math.max(0, (calories - proteinMax * PROTEIN_CALORIE_DIVISOR - fatCal) / CARB_CALORIE_DIVISOR);
  return { min: minCarbs, max: maxCarbs };
}

export function calculateFiber(calories) {
  return (calories / 1000) * FIBER_FACTOR;
}

export function calculateWater(weightKg) {
  const ml = weightKg * WATER_FACTOR_ML_PER_KG;
  return { ml, litres: +(ml / 1000).toFixed(2) };
}

export function getMinCalories(gender) {
  return gender === 'female' ? MIN_CALORIES_FEMALE : MIN_CALORIES_MALE;
}

export function isMinor(age) {
  return age > 0 && age < UNDER_18_AGE;
}

export function calculateAll(input) {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = input;

  const { bmi, category } = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const rawCalories = calculateCalories(tdee, goal);
  const minCal = getMinCalories(gender);
  const safetyWarning = rawCalories < minCal;
  const calories = safetyWarning ? minCal : rawCalories;

  const protein = calculateProteinRange(weightKg, goal);
  const fat = calculateFatRange(calories);
  const carbs = calculateCarbRange(calories, protein.min, protein.max, fat.min);
  const fiber = calculateFiber(calories);
  const water = calculateWater(weightKg);
  const under18 = isMinor(age);

  return {
    bmi,
    bmiCategory: category,
    bmr: Math.round(bmr * 10) / 10,
    tdee: Math.round(tdee),
    calorieTargetMin: safetyWarning ? minCal : Math.round(rawCalories),
    calorieTargetMax: safetyWarning ? minCal : Math.round(rawCalories),
    proteinMin: Math.round(protein.min),
    proteinMax: Math.round(protein.max),
    fatMin: Math.round(fat.min),
    fatMax: Math.round(fat.max),
    carbohydrateMin: Math.round(carbs.min),
    carbohydrateMax: Math.round(carbs.max),
    fiber: Math.round(fiber),
    waterMl: water.ml,
    waterLitres: water.litres,
    activity: ACTIVITY_LABELS[activityLevel] || activityLevel,
    goal: GOAL_LABELS[goal] || goal,
    safetyWarning,
    under18,
    weightKg,
    disclaimer: 'These values are estimates for general nutrition planning and are not a medical diagnosis. Individual needs may vary.',
    minorMessage: 'Because nutrition needs during adolescence depend on growth and development, please discuss your nutrition goals with a parent/guardian and a qualified healthcare professional.',
  };
}

router.post('/calculate', (req, res) => {
  const parsed = calculateInput.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => i.message).join('; ');
    return res.status(422).json({ error: msg });
  }
  const result = calculateAll(parsed.data);
  res.json(result);
});

router.post('/history', requireAuth, async (req, res) => {
  try {
    const parsed = calculateInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: 'Invalid input.' });
    }
    const result = calculateAll(parsed.data);
    const record = await prisma.nutritionHistory.create({
      data: {
        userId: req.auth.sub,
        age: parsed.data.age,
        gender: parsed.data.gender,
        heightCm: parsed.data.heightCm,
        weightKg: parsed.data.weightKg,
        activityLevel: parsed.data.activityLevel,
        goal: parsed.data.goal,
        bmi: result.bmi,
        bmiCategory: result.bmiCategory,
        bmr: result.bmr,
        tdee: result.tdee,
        calorieTargetMin: result.calorieTargetMin,
        calorieTargetMax: result.calorieTargetMax,
        proteinMin: result.proteinMin,
        proteinMax: result.proteinMax,
        fatMin: result.fatMin,
        fatMax: result.fatMax,
        carbohydrateMin: result.carbohydrateMin,
        carbohydrateMax: result.carbohydrateMax,
        fiber: result.fiber,
        waterMl: result.waterMl,
        waterLitres: result.waterLitres,
      },
    });
    res.status(201).json({ record, result });
  } catch (e) { next(e); }
});

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const records = await prisma.nutritionHistory.findMany({
      where: { userId: req.auth.sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ records });
  } catch (e) { next(e); }
});

export { router as nutritionRouter };
