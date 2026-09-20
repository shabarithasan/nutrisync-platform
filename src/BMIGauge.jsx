import React, { useState, useEffect } from 'react';

export default function BMIGauge({ profile }) {
  const [age, setAge] = useState(profile?.age || 25);
  const [height, setHeight] = useState(profile?.height || 153.52);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weight, setWeight] = useState(profile?.weight || 0);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [gender, setGender] = useState(profile?.gender || 'female');

  // Convert inputs
  const wKg = parseFloat(weight) || 0;
  const wActualKg = weightUnit === 'lb' ? wKg * 0.453592 : wKg;
  const hM = parseFloat(height) || 0;
  const hActualM = heightUnit === 'cm' ? hM / 100 : hM;

  // Calculate BMI
  let bmi = 0;
  if (wActualKg > 0 && hActualM > 0) {
    bmi = wActualKg / (hActualM * hActualM);
  }

  // Clamped BMI for gauge
  const minBmi = 15.0;
  const maxBmi = 38.0;
  const clampedBmi = bmi > 0 ? Math.max(minBmi, Math.min(maxBmi, bmi)) : minBmi;
  
  // Angle (-90 to 90)
  const percent = (clampedBmi - minBmi) / (maxBmi - minBmi);
  const angle = (percent * 180) - 90;

  // Determine Zone
  let zoneName = 'Underweight';
  let zoneColor = '#3b82f6'; // blue-500
  if (bmi >= 17.1 && bmi < 23.2) {
    zoneName = 'Normal';
    zoneColor = '#22c55e'; // green-500
  } else if (bmi >= 23.2) {
    zoneName = 'Overweight';
    zoneColor = '#ef4444'; // red-500
  }
  if (bmi === 0) {
    zoneName = 'Enter Weight';
    zoneColor = '#9ca3af'; // gray-400
  }

  return (
    <div style={{
      width: '100%', maxWidth: '440px', margin: '0 auto 32px auto',
      background: '#111827', color: '#fff', borderRadius: '24px',
      padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button style={{ padding: '8px', background: '#1f2937', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
          <svg style={{ width: '20px', height: '20px', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>BMI Calculator</h1>
        <button style={{ padding: '8px', background: '#1f2937', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
          <svg style={{ width: '20px', height: '20px', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </button>
      </div>

      {/* Top Inputs: Age & Height */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Age</label>
          <input 
            type="number" 
            value={age}
            onChange={e => setAge(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #374151', color: '#fff', fontSize: '30px', fontWeight: '600', outline: 'none', padding: '0 0 4px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flex: 1.5 }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Height</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              value={height}
              onChange={e => setHeight(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #374151', color: '#fff', fontSize: '30px', fontWeight: '600', outline: 'none', padding: '0 48px 4px 0', boxSizing: 'border-box' }}
            />
            <select 
              value={heightUnit} 
              onChange={e => setHeightUnit(e.target.value)}
              style={{ position: 'absolute', right: 0, bottom: '8px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '16px', fontWeight: '500', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="cm" style={{ color: '#000' }}>cm</option>
              <option value="m" style={{ color: '#000' }}>m</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle Inputs: Gender & Weight */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Gender</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setGender('female')}
              style={{ flex: 1, padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', background: gender === 'female' ? 'rgba(20, 184, 166, 0.2)' : '#1f2937', color: gender === 'female' ? '#2dd4bf' : '#9ca3af', border: gender === 'female' ? '1px solid rgba(20, 184, 166, 0.5)' : '1px solid transparent', cursor: 'pointer' }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm1 4.93V19h3a1 1 0 110 2h-3v2a1 1 0 11-2 0v-2H8a1 1 0 110-2h3v-4.07A7.001 7.001 0 015 8a1 1 0 012 0 5 5 0 1010 0 1 1 0 012 0 7.001 7.001 0 01-6 6.93z"></path></svg>
            </button>
            <button 
              onClick={() => setGender('male')}
              style={{ flex: 1, padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', background: gender === 'male' ? 'rgba(20, 184, 166, 0.2)' : '#1f2937', color: gender === 'male' ? '#2dd4bf' : '#9ca3af', border: gender === 'male' ? '1px solid rgba(20, 184, 166, 0.5)' : '1px solid transparent', cursor: 'pointer' }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-4a1 1 0 100 2h1.59l-4.22 4.22A7 7 0 1014.78 11.6L19 7.41V9a1 1 0 102 0V5a1 1 0 00-1-1zM11 18a5 5 0 110-10 5 5 0 010 10z"></path></svg>
            </button>
          </div>
        </div>
        <div style={{ flex: 1.5 }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Weight</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              value={weight}
              onChange={e => setWeight(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #374151', color: '#fff', fontSize: '30px', fontWeight: '600', outline: 'none', padding: '0 48px 4px 0', boxSizing: 'border-box' }}
            />
            <select 
              value={weightUnit} 
              onChange={e => setWeightUnit(e.target.value)}
              style={{ position: 'absolute', right: 0, bottom: '8px', background: 'transparent', color: '#9ca3af', border: 'none', fontSize: '16px', fontWeight: '500', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="kg" style={{ color: '#000' }}>kg</option>
              <option value="lb" style={{ color: '#000' }}>lb</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gauge Area */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '50%', marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Background track */}
          <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="#374151" strokeWidth="16" strokeLinecap="round" />
          
          {/* Blue Zone: 15.0 to 17.1 (9.13%) */}
          <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" 
                pathLength="100" strokeDasharray="9.13 100" strokeDashoffset="0" />
                
          {/* Green Zone: 17.1 to 23.2 (26.52%) */}
          <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="#22c55e" strokeWidth="16" 
                pathLength="100" strokeDasharray="26.52 100" strokeDashoffset="-9.13" />
                
          {/* Red Zone: 23.2 to 38.0 (64.35%) */}
          <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" 
                pathLength="100" strokeDasharray="64.35 100" strokeDashoffset="-35.65" />

          {/* Scale Labels */}
          <text x="25" y="80" fill="#9ca3af" fontSize="7" fontWeight="600">15.0</text>
          <text x="50" y="38" fill="#9ca3af" fontSize="7" fontWeight="600">17.1</text>
          <text x="135" y="25" fill="#9ca3af" fontSize="7" fontWeight="600">23.2</text>
          <text x="175" y="80" fill="#9ca3af" fontSize="7" fontWeight="600">38.0</text>

          {/* Animated Needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 95px', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <polygon points="98,95 102,95 100,15" fill="#ffffff" />
            <circle cx="100" cy="95" r="5" fill="#ffffff" />
            <circle cx="100" cy="95" r="2" fill="#1f2937" />
          </g>
        </svg>

        {/* BMI Readout overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', paddingBottom: '8px' }}>
          <div style={{ color: '#9ca3af', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>BMI</div>
          <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.05em', color: zoneColor, lineHeight: '1' }}>
            {bmi > 0 ? bmi.toFixed(1) : '0.0'}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px', color: zoneColor }}>
            {zoneName}
          </div>
        </div>
      </div>
    </div>
  );
}
