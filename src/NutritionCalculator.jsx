import React, { useState } from 'react';

const apiBase = '';

function Header({ title, desc, profile }) {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-left">
          <h1 className="header-title">{title}</h1>
          <p className="header-desc">{desc}</p>
        </div>
        <div className="header-right">
          {profile && <div className="header-pill">{profile.name || 'User'}</div>}
        </div>
      </div>
    </div>
  );
}

const ACT_OPTS = [
  ['sedentary', 'Sedentary'],
  ['lightly_active', 'Lightly Active'],
  ['moderately_active', 'Moderately Active'],
  ['very_active', 'Very Active'],
  ['extra_active', 'Extra Active'],
];

function determineGoal(current, target) {
  if (!current || !target) return null;
  if (target < current) return 'loss';
  if (target > current) return 'gain';
  return 'maintenance';
}

function calcProgress(starting, current, target, goal) {
  if (!starting || !current || !target) return 0;
  if (goal === 'maintenance') return current === target ? 100 : 0;
  if (goal === 'loss') {
    const total = starting - target;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, ((starting - current) / total) * 100));
  }
  if (goal === 'gain') {
    const total = target - starting;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, ((current - starting) / total) * 100));
  }
  return 0;
}

export default function NutritionCalculator({ profile }) {
  const [age, setAge] = useState(profile.age || '');
  const [gender, setGender] = useState(profile.gender || 'male');
  const [height, setHeight] = useState(profile.height || '');
  const [weight, setWeight] = useState(profile.weight || '');
  const [targetWeight, setTargetWeight] = useState('');
  const [activity, setActivity] = useState('moderately_active');
  const [result, setResult] = useState(null);
  const [startingWeight, setStartingWeight] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentW = parseFloat(weight) || 0;
  const targetW = parseFloat(targetWeight) || 0;
  const goal = determineGoal(currentW, targetW);
  const goalLabel = goal === 'loss' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : goal === 'maintenance' ? 'Weight Maintenance' : null;
  const remaining = goal === 'loss' ? currentW - targetW : goal === 'gain' ? targetW - currentW : 0;
  const progress = startingWeight && goal ? calcProgress(startingWeight, currentW, targetW, goal) : 0;

  const validate = () => {
    const errs = [];
    const a = parseInt(age);
    if (!a || a < 10 || a > 120) errs.push('Age must be between 10 and 120');
    if (!gender) errs.push('Gender is required');
    const h = parseFloat(height);
    if (!h || h < 100 || h > 250) errs.push('Height must be between 100 and 250 cm');
    const w = parseFloat(weight);
    if (!w || w < 25 || w > 400) errs.push('Weight must be between 25 and 400 kg');
    const tw = parseFloat(targetWeight);
    if (!tw || tw <= 0) errs.push('Target Weight must be greater than 0');
    if (!activity) errs.push('Activity level is required');
    if (!goal) errs.push('Target Weight must be different from Current Weight');
    return errs;
  };

  const doCalculate = async () => {
    const errs = validate();
    if (errs.length) { setError(errs.join('. ')); return; }
    setError('');
    setLoading(true);
    if (!startingWeight) setStartingWeight(currentW);
    try {
      const input = {
        age: parseInt(age), gender,
        heightCm: parseFloat(height),
        weightKg: currentW,
        activityLevel: activity, goal,
      };
      const r = await fetch(apiBase + '/api/nutrition/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Calculation failed'); return; }
      setResult(d);
    } catch (e) {
      setError('Could not reach the server. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  const r = result;

  return (
    <>
      <Header title="Personal Nutrition & Health Calculator" desc="Enter your details to get personalized daily nutrition targets." profile={profile} />
      <section className="calc-page">
        <div className="calc-form-card">
          <div className="calc-head">
            <div className="calc-icon">{'\u25c8'}</div>
            <div>
              <h3>Nutrition Calculator</h3>
              <p>Fill in your details below</p>
            </div>
          </div>

          <div className="calc-grid">
            <label>
              Age
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" min="10" max="120" />
            </label>
            <label>
              Height (cm)
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" step="0.1" min="100" max="250" />
            </label>
            <label>
              Current Weight (kg)
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" step="0.1" min="25" max="400" />
            </label>
            <label>
              Target Weight (kg)
              <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="65" step="0.1" min="1" max="400" />
            </label>
          </div>

          <div className="calc-section">
            <b>Gender</b>
            <div className="calc-toggle">
              <button className={gender === 'female' ? 'on' : ''} onClick={() => setGender('female')}>Female</button>
              <button className={gender === 'male' ? 'on' : ''} onClick={() => setGender('male')}>Male</button>
            </div>
          </div>

          <div className="calc-section">
            <b>Activity Level</b>
            <div className="calc-select">
              {ACT_OPTS.map(([v, l]) => (
                <button key={v} className={activity === v ? 'on' : ''} onClick={() => setActivity(v)}>{l}</button>
              ))}
            </div>
          </div>

          {goalLabel && (
            <div className="calc-goal-display">
              <b>Detected Goal: </b>
              <span className={goal === 'loss' ? 'calc-goal-loss' : goal === 'gain' ? 'calc-goal-gain' : 'calc-goal-maint'}>
                {goalLabel}
              </span>
              {goal !== 'maintenance' && <span className="calc-goal-remaining">{remaining.toFixed(1)} kg to {goal === 'loss' ? 'lose' : 'gain'}</span>}
              {goal === 'maintenance' && <span className="calc-goal-remaining">Target weight maintained</span>}
            </div>
          )}

          {startingWeight && goal && goal !== 'maintenance' && (
            <div className="calc-progress">
              <div className="calc-progress-header">
                <span>Weight Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="calc-progress-bar">
                <div className="calc-progress-fill" style={{ width: progress + '%' }} />
              </div>
              <div className="calc-progress-detail">
                <span>Starting: {startingWeight} kg</span>
                <span>Current: {currentW} kg</span>
                <span>Target: {targetW} kg</span>
              </div>
            </div>
          )}

          {error && <div className="calc-error">{error}</div>}

          <button className="primary calc-btn" onClick={doCalculate} disabled={loading}>
            {loading ? 'Calculating\u2026' : 'Calculate My Daily Targets'}
          </button>
        </div>

        {r && (
          <div className="calc-results">
            <h3>Your Daily Nutrition Target</h3>
            {r.under18 && (
              <div className="calc-warning">
                Because nutrition needs during adolescence depend on growth and development, please discuss your nutrition goals with a parent/guardian and a qualified healthcare professional.
              </div>
            )}
            {goalLabel && (
              <div className="calc-weight-summary">
                <div className="calc-ws-item">
                  <span className="calc-ws-label">Current Weight</span>
                  <b className="calc-ws-value">{currentW} kg</b>
                </div>
                <div className="calc-ws-item">
                  <span className="calc-ws-label">Target Weight</span>
                  <b className="calc-ws-value">{targetW} kg</b>
                </div>
                <div className="calc-ws-item">
                  <span className="calc-ws-label">Goal</span>
                  <b className="calc-ws-value">{goalLabel}</b>
                </div>
                <div className="calc-ws-item">
                  <span className="calc-ws-label">{goal === 'maintenance' ? 'Status' : 'Remaining'}</span>
                  <b className="calc-ws-value">{goal === 'maintenance' ? 'Target weight maintained' : remaining.toFixed(1) + ' kg to ' + (goal === 'loss' ? 'lose' : 'gain')}</b>
                </div>
              </div>
            )}
            <div className="calc-result-grid">
              <div className="calc-result-card">
                <span className="calc-r-label">BMI</span>
                <b className="calc-r-value">{r.bmi}</b>
                <small className="calc-r-sub">{r.bmiCategory}</small>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">BMR</span>
                <b className="calc-r-value">{r.bmr} <small>kcal/day</small></b>
                <small className="calc-r-sub">Basal Metabolic Rate</small>
              </div>
              <div className="calc-result-card calc-result-highlight">
                <span className="calc-r-label">Daily Calories</span>
                <b className="calc-r-value">{r.calorieTargetMin} <small>kcal/day</small></b>
                <small className="calc-r-sub">{r.goal}</small>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">Protein</span>
                <b className="calc-r-value">{r.proteinMin} <small>g/day</small></b>
                <small className="calc-r-sub">Based on current weight: {r.weightKg} kg</small>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">Fat</span>
                <b className="calc-r-value">{r.fatMin} <small>g/day</small></b>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">Carbohydrates</span>
                <b className="calc-r-value">{r.carbohydrateMin} <small>g/day</small></b>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">Fiber</span>
                <b className="calc-r-value">{r.fiber} <small>g/day</small></b>
              </div>
              <div className="calc-result-card">
                <span className="calc-r-label">Water</span>
                <b className="calc-r-value">{r.waterLitres} <small>L/day</small></b>
                <small className="calc-r-sub">{r.waterMl} ml/day</small>
              </div>
            </div>
            <div className="calc-meta">
              <span>Goal: <b>{r.goal}</b></span>
              <span>Activity: <b>{r.activity}</b></span>
            </div>
            <p className="calc-disclaimer">{r.disclaimer}</p>
          </div>
        )}
      </section>
    </>
  );
}
