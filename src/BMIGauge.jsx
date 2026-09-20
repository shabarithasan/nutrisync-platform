import React, { useState, useEffect } from 'react';

const Label = ({ angle, text }) => (
  <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px' }}>
    <text x={100 - 38} y={100} fill="#aaa" fontSize="5.5" textAnchor="middle" style={{ transform: 'rotate(-90deg)', transformOrigin: `${100 - 38}px 100px` }}>
      {text}
    </text>
  </g>
);

export default function BMIGauge({ profile }) {
  const [age, setAge] = useState(profile?.age || 14);
  const [height, setHeight] = useState(profile?.height || '');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weight, setWeight] = useState(profile?.weight || '');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [gender, setGender] = useState(profile?.gender || 'female');

  const wKg = parseFloat(weight) || 0;
  const wActualKg = weightUnit === 'lb' ? wKg * 0.453592 : wKg;
  const hM = parseFloat(height) || 0;
  const hActualM = heightUnit === 'cm' ? hM / 100 : hM;

  let bmi = 0;
  if (wActualKg > 0 && hActualM > 0) {
    bmi = wActualKg / (hActualM * hActualM);
  }

  let angle = 0;
  let needleColor = '#2d88ff';
  
  if (bmi === 0) {
    angle = 0;
    needleColor = '#2d88ff';
  } else if (bmi <= 15) {
    angle = 0;
    needleColor = '#2d88ff';
  } else if (bmi < 17.1) {
    angle = ((bmi - 15) / 2.1) * 55;
    needleColor = '#2d88ff';
  } else if (bmi < 23.2) {
    angle = 55 + ((bmi - 17.1) / 6.1) * 70;
    needleColor = '#4cd964';
  } else if (bmi <= 38) {
    angle = 125 + ((bmi - 23.2) / 14.8) * 55;
    needleColor = '#ff3b30';
  } else {
    angle = 180;
    needleColor = '#ff3b30';
  }

  return (
    <div style={{
      width: '100%', maxWidth: '440px', margin: '0 auto 32px auto',
      background: '#202124', color: '#fff', borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        .bmi-input::-webkit-outer-spin-button,
        .bmi-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .bmi-input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#2c2e30', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: '500', margin: 0, color: '#e8eaed' }}>BMI Calculator</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <svg style={{ width: '20px', height: '20px', color: '#9aa0a6', cursor: 'pointer' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
          <svg style={{ width: '20px', height: '20px', color: '#9aa0a6', cursor: 'pointer' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Top Row: Age & Height */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: '40px' }}>
          {/* Age */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
            <span style={{ color: '#6fb2e3', fontSize: '14px', marginBottom: '8px' }}>Age</span>
            <input 
              type="number" 
              value={age}
              onChange={e => setAge(e.target.value)}
              className="bmi-input"
              style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', borderBottom: '2px solid #6fb2e3', color: '#fff', fontSize: '18px', outline: 'none', paddingBottom: '6px' }} 
            />
          </div>

          {/* Height */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
            <span style={{ color: '#e8eaed', fontSize: '14px', marginBottom: '8px' }}>Height</span>
            <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid #5f6368', paddingBottom: '6px', width: '100%' }}>
              <input 
                type="number" 
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="bmi-input"
                style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none' }} 
              />
              <div style={{ position: 'relative' }}>
                <select 
                  value={heightUnit} 
                  onChange={e => setHeightUnit(e.target.value)}
                  style={{ background: 'transparent', color: '#81c995', border: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '12px' }}
                >
                  <option value="cm" style={{color:'#000'}}>c m</option>
                  <option value="m" style={{color:'#000'}}>m</option>
                </select>
                <svg style={{ width: '8px', height: '8px', position: 'absolute', right: 0, top: '6px', pointerEvents: 'none', color: '#5f6368' }} fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Gender & Weight */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: '40px' }}>
          {/* Gender Icons */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: '90px', justifyContent: 'center' }}>
            <svg onClick={() => setGender('female')} style={{ width: '32px', height: '32px', cursor: 'pointer', color: gender === 'female' ? '#81c995' : '#5f6368' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm1 4.93V19h3a1 1 0 110 2h-3v2a1 1 0 11-2 0v-2H8a1 1 0 110-2h3v-4.07A7.001 7.001 0 015 8a1 1 0 012 0 5 5 0 1010 0 1 1 0 012 0 7.001 7.001 0 01-6 6.93z"></path></svg>
            <svg onClick={() => setGender('male')} style={{ width: '32px', height: '32px', cursor: 'pointer', color: gender === 'male' ? '#81c995' : '#5f6368' }} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4h-4a1 1 0 100 2h1.59l-4.22 4.22A7 7 0 1014.78 11.6L19 7.41V9a1 1 0 102 0V5a1 1 0 00-1-1zM11 18a5 5 0 110-10 5 5 0 010 10z"></path></svg>
          </div>

          {/* Weight */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
            <span style={{ color: '#e8eaed', fontSize: '14px', marginBottom: '8px' }}>Weight</span>
            <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid #5f6368', paddingBottom: '6px', width: '100%' }}>
              <input 
                type="number" 
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="bmi-input"
                style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none' }} 
              />
              <div style={{ position: 'relative' }}>
                <select 
                  value={weightUnit} 
                  onChange={e => setWeightUnit(e.target.value)}
                  style={{ background: 'transparent', color: '#81c995', border: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '12px' }}
                >
                  <option value="kg" style={{color:'#000'}}>k g</option>
                  <option value="lb" style={{color:'#000'}}>l b</option>
                </select>
                <svg style={{ width: '8px', height: '8px', position: 'absolute', right: 0, top: '6px', pointerEvents: 'none', color: '#5f6368' }} fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gauge Area */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '50%', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 110" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <path id="textCurve" d="M 35 100 A 65 65 0 0 1 165 100" fill="none" />
          </defs>

          {/* Blue: 0 to 55 */}
          <path d="M 35 100 A 65 65 0 0 1 165 100" fill="none" stroke="#2d88ff" strokeWidth="40" strokeLinecap="butt" 
                pathLength="180" strokeDasharray="55 180" strokeDashoffset="0" />
                
          {/* Green: 55 to 125 */}
          <path d="M 35 100 A 65 65 0 0 1 165 100" fill="none" stroke="#4cd964" strokeWidth="40" strokeLinecap="butt" 
                pathLength="180" strokeDasharray="70 180" strokeDashoffset="-55" />
                
          {/* Red: 125 to 180 */}
          <path d="M 35 100 A 65 65 0 0 1 165 100" fill="none" stroke="#ff3b30" strokeWidth="40" strokeLinecap="butt" 
                pathLength="180" strokeDasharray="55 180" strokeDashoffset="-125" />

          {/* Texts along the arc */}
          <text fill="#000" fontSize="9" fontWeight="500">
            <textPath href="#textCurve" startOffset="15.2%" textAnchor="middle">Underweight</textPath>
            <textPath href="#textCurve" startOffset="50%" textAnchor="middle">Normal</textPath>
            <textPath href="#textCurve" startOffset="84.7%" textAnchor="middle">Overweight</textPath>
          </text>

          {/* Inner Scale Labels */}
          <Label angle={0} text="15.0" />
          <Label angle={55} text="17.1" />
          <Label angle={125} text="23.2" />
          <Label angle={180} text="38.0" />

          {/* Animated Inner Triangle Needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <polygon points="55,100 62,96 62,104" fill={needleColor} />
          </g>
        </svg>

        {/* BMI Readout overlay */}
        <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', textAlign: 'center', paddingBottom: '0' }}>
          <div style={{ color: '#9aa0a6', fontSize: '13px', marginBottom: '2px' }}>BMI</div>
          <div style={{ fontSize: '32px', fontWeight: '500', color: '#fff', lineHeight: '1' }}>
            {bmi > 0 ? bmi.toFixed(1) : '0.0'}
          </div>
        </div>
      </div>
    </div>
  );
}
