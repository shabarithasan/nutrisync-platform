import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  calculateProteinRange,
  calculateFatRange,
  calculateCarbRange,
  calculateFiber,
  calculateWater,
  calculateAll,
  getMinCalories,
  isMinor,
} from '../src/nutrition.js';

describe('BMI', () => {
  it('calculates BMI correctly', () => {
    const { bmi } = calculateBMI(70, 175);
    assert.equal(bmi, 22.9);
  });
  it('returns 0 for invalid height', () => {
    assert.equal(calculateBMI(70, 0).bmi, 0);
  });
  it('returns 0 for invalid weight', () => {
    assert.equal(calculateBMI(0, 175).bmi, 0);
  });
});

describe('BMI Category', () => {
  it('Underweight < 18.5', () => {
    assert.equal(calculateBMI(50, 170).category, 'Underweight');
  });
  it('Normal weight 18.5-24.9', () => {
    assert.equal(calculateBMI(70, 175).category, 'Normal weight');
  });
  it('Overweight 25-29.9', () => {
    assert.equal(calculateBMI(90, 175).category, 'Overweight');
  });
  it('Obesity 30+', () => {
    assert.equal(calculateBMI(110, 175).category, 'Obesity');
  });
});

describe('BMR', () => {
  it('calculates male BMR (no rounding)', () => {
    const bmr = calculateBMR(70, 175, 25, 'male');
    assert.ok(Math.abs(bmr - 1673.75) < 0.01);
  });
  it('calculates female BMR (no rounding)', () => {
    const bmr = calculateBMR(60, 165, 30, 'female');
    assert.ok(Math.abs(bmr - 1320.25) < 0.01);
  });
});

describe('TDEE', () => {
  it('sedentary factor 1.2', () => {
    const tdee = calculateTDEE(1648, 'sedentary');
    assert.ok(Math.abs(tdee - 1977.6) < 0.01);
  });
  it('moderately active factor 1.55', () => {
    const tdee = calculateTDEE(1648, 'moderately_active');
    assert.ok(Math.abs(tdee - 2554.4) < 0.01);
  });
});

describe('Calories', () => {
  it('maintenance = TDEE', () => {
    assert.equal(calculateCalories(2500, 'maintenance'), 2500);
  });
  it('loss = TDEE - 500', () => {
    assert.equal(calculateCalories(2500, 'loss'), 2000);
  });
  it('gain = TDEE + 300', () => {
    assert.equal(calculateCalories(2500, 'gain'), 2800);
  });
});

describe('Protein Range', () => {
  it('loss: 1.2-1.6 x weight', () => {
    const p = calculateProteinRange(70, 'loss');
    assert.ok(Math.abs(p.min - 84) < 0.01);
    assert.ok(Math.abs(p.max - 112) < 0.01);
  });
  it('maintenance: 1.0-1.2 x weight', () => {
    const p = calculateProteinRange(70, 'maintenance');
    assert.ok(Math.abs(p.min - 70) < 0.01);
    assert.ok(Math.abs(p.max - 84) < 0.01);
  });
  it('gain: 1.2-1.6 x weight', () => {
    const p = calculateProteinRange(70, 'gain');
    assert.ok(Math.abs(p.min - 84) < 0.01);
    assert.ok(Math.abs(p.max - 112) < 0.01);
  });
  it('protein changes with weight', () => {
    const p70 = calculateProteinRange(70, 'loss');
    const p65 = calculateProteinRange(65, 'loss');
    assert.ok(p65.min < p70.min);
    assert.ok(p65.max < p70.max);
  });
});

describe('Fat Range', () => {
  it('25% of calories / 9', () => {
    const f = calculateFatRange(2000);
    assert.ok(Math.abs(f.min - 55.56) < 0.1);
  });
});

describe('Carb Range', () => {
  it('remaining calories / 4', () => {
    const c = calculateCarbRange(2000, 84, 112, 56);
    assert.ok(c.min >= 0);
    assert.ok(c.max >= c.min);
  });
});

describe('Fiber', () => {
  it('calories / 1000 * 14', () => {
    assert.equal(Math.round(calculateFiber(2000)), 28);
  });
});

describe('Water', () => {
  it('weight * 35 ml', () => {
    const w = calculateWater(70);
    assert.equal(w.ml, 2450);
    assert.equal(w.litres, 2.45);
  });
});

describe('Safety threshold', () => {
  it('returns 1500 for male', () => {
    assert.equal(getMinCalories('male'), 1500);
  });
  it('returns 1200 for female', () => {
    assert.equal(getMinCalories('female'), 1200);
  });
});

describe('Under-18', () => {
  it('age 17 is minor', () => {
    assert.equal(isMinor(17), true);
  });
  it('age 18 is not minor', () => {
    assert.equal(isMinor(18), false);
  });
  it('age 25 is not minor', () => {
    assert.equal(isMinor(25), false);
  });
});

describe('Full calculation integration', () => {
  it('returns ranges for all macros', () => {
    const r = calculateAll({ age: 25, gender: 'male', heightCm: 175, weightKg: 70, activityLevel: 'moderately_active', goal: 'loss' });
    assert.equal(r.bmi, 22.9);
    assert.equal(r.bmiCategory, 'Normal weight');
    assert.ok(r.bmr > 0);
    assert.ok(r.tdee > 0);
    assert.ok(r.proteinMin > 0);
    assert.ok(r.proteinMax >= r.proteinMin);
    assert.ok(r.fatMin > 0);
    assert.ok(r.carbohydrateMin >= 0);
    assert.equal(r.fiber, 29);
    assert.equal(r.waterLitres, 2.45);
    assert.equal(r.goal, 'Weight Loss');
    assert.equal(r.activity, 'Moderately Active');
    assert.equal(r.under18, false);
  });
  it('under-18 flagged', () => {
    const r = calculateAll({ age: 16, gender: 'male', heightCm: 170, weightKg: 60, activityLevel: 'moderately_active', goal: 'loss' });
    assert.equal(r.under18, true);
  });
  it('safety warning for low calories', () => {
    const r = calculateAll({ age: 25, gender: 'female', heightCm: 170, weightKg: 40, activityLevel: 'sedentary', goal: 'loss' });
    assert.equal(r.safetyWarning, true);
    assert.equal(r.calorieTargetMin, 1200);
  });
});

describe('Weight change consistency', () => {
  const base = { age: 25, gender: 'male', heightCm: 170, activityLevel: 'moderately_active', goal: 'loss' };

  it('all values change when weight changes from 70 to 65', () => {
    const r70 = calculateAll({ ...base, weightKg: 70 });
    const r65 = calculateAll({ ...base, weightKg: 65 });

    assert.ok(r65.bmi !== r70.bmi, 'BMI should change');
    assert.ok(r65.bmr !== r70.bmr, 'BMR should change');
    assert.ok(r65.tdee !== r70.tdee, 'TDEE should change');
    assert.ok(r65.calorieTargetMin !== r70.calorieTargetMin, 'Calories should change');
    assert.ok(r65.proteinMin !== r70.proteinMin, 'Protein min should change');
    assert.ok(r65.proteinMax !== r70.proteinMax, 'Protein max should change');
    assert.ok(r65.fatMin !== r70.fatMin, 'Fat should change');
    assert.ok(r65.carbohydrateMin !== r70.carbohydrateMin, 'Carbs should change');
  });

  it('protein always from current weight', () => {
    const r65 = calculateAll({ ...base, weightKg: 65 });
    const expectedMin = 65 * 1.2;
    const expectedMax = 65 * 1.6;
    assert.ok(Math.abs(r65.proteinMin - Math.round(expectedMin)) <= 1);
    assert.ok(Math.abs(r65.proteinMax - Math.round(expectedMax)) <= 1);
  });

  it('BMI lower for lower weight at same height', () => {
    const r70 = calculateAll({ ...base, weightKg: 70 });
    const r65 = calculateAll({ ...base, weightKg: 65 });
    assert.ok(r65.bmi < r70.bmi);
  });

  it('BMR lower for lower weight', () => {
    const r70 = calculateAll({ ...base, weightKg: 70 });
    const r65 = calculateAll({ ...base, weightKg: 65 });
    assert.ok(r65.bmr < r70.bmr);
  });
});
