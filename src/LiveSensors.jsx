import React, { useState, useEffect, useRef } from 'react';

export default function LiveSensors({ upd, m }) {
  const [active, setActive] = useState(false);
  const [granted, setGranted] = useState(false);
  const [steps, setSteps] = useState(0);
  const [posture, setPosture] = useState('Good');
  const [tilt, setTilt] = useState(0);

  const requestPermissions = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const p1 = await DeviceMotionEvent.requestPermission();
        if (p1 !== 'granted') throw new Error('Motion denied');
      }
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const p2 = await DeviceOrientationEvent.requestPermission();
        if (p2 !== 'granted') throw new Error('Orientation denied');
      }
      setGranted(true);
      setActive(true);
    } catch (err) {
      alert('Sensors permission denied or unsupported on this device. Note: Accelerometer requires HTTPS or localhost, and a mobile device.');
      setGranted(true);
      setActive(true); // Fallback for desktop testing (will just show 0)
    }
  };

  useEffect(() => {
    if (!active) return;
    let lastMag = 0;
    let lastTime = 0;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      const mag = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2);
      
      // Simple step detection
      if (mag > 11.5 && lastMag <= 11.5) {
        const now = Date.now();
        if (now - lastTime > 300) {
          setSteps(s => s + 1);
          lastTime = now;
        }
      }
      lastMag = mag;
    };

    const handleOrientation = (e) => {
      if (e.beta === null) return;
      // beta is front-to-back tilt. 0 is flat, 90 is straight up.
      // If user is looking down at phone, beta is usually > 60
      setTilt(Math.round(e.beta));
      if (e.beta > 70) {
        setPosture('Text Neck! ⚠️');
      } else {
        setPosture('Good Posture ✅');
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('deviceorientation', handleOrientation);

    // Parallax effect on body
    const handleParallax = (e) => {
      if (!e.gamma || !e.beta) return;
      document.documentElement.style.setProperty('--rot-x', `\${e.beta / 10}deg`);
      document.documentElement.style.setProperty('--rot-y', `\${e.gamma / 10}deg`);
    };
    window.addEventListener('deviceorientation', handleParallax);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientation', handleParallax);
    };
  }, [active]);

  if (!active) {
    return (
      <div style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 10000 }}>
        <button 
          onClick={requestPermissions}
          style={{
            background: 'var(--brand, #16a34a)', color: '#fff', border: 'none', padding: '12px 20px', 
            borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', animation: 'softPulse 2s infinite'
          }}
        >
          <span>🛰️</span> Enable Live Sensors
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', bottom: '100px', right: '24px', zIndex: 10000,
      background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '24px',
      padding: '20px', width: '220px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      transform: 'perspective(1000px) rotateX(var(--rot-x, 0deg)) rotateY(var(--rot-y, 0deg))',
      transition: 'transform 0.1s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--brand)' }}>🛰️ Live Sensors</h4>
        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e', animation: 'blink 1s infinite' }} />
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Steps</div>
        <div style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          {steps} <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--muted)' }}>steps</span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Posture</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: posture.includes('Good') ? '#22c55e' : '#ef4444' }}>
          {posture} <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '4px' }}>({tilt}°)</span>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}
