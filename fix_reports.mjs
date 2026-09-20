import fs from 'fs';

let main = fs.readFileSync('src/main.jsx', 'utf8');

const newReportsComponent = `function Reports({profile}){
  const {m} = useLog();
  const [period, setPeriod] = useState('week');
  const [copied, setCopied] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  const days = period === 'week' ? 7 : 30;
  const logs = [...Array(days)].map((_, i) => ({ k: agoKey(i), o: m[agoKey(i)] || {} }));
  const active = logs.filter(l => l.o.water || l.o.kcal || l.o.steps || (l.o.work && l.o.work.length));
  const n = active.length || 1;
  
  const avgWater = Math.round(active.reduce((a, l) => a + (+l.o.water || 0), 0) / n);
  const avgSteps = Math.round(active.reduce((a, l) => a + (+l.o.steps || 0), 0) / n);
  const avgKcal = Math.round(active.reduce((a, l) => a + (+l.o.kcal || 0), 0) / n);
  const workouts = active.reduce((a, l) => a + (l.o.work || []).length, 0);
  
  const t = calcTargets(profile);
  
  const [weights] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nts-progress')) || []; }
    catch { return []; }
  });
  const ws = [...weights].sort((a, b) => a.d < b.d ? -1 : 1);
  const delta = ws.length > 1 ? Math.round((ws[ws.length - 1].w - ws[0].w) * 10) / 10 : null;
  
  const txt = \`NUTRISYNC WELLNESS REPORT\\nGenerated: \${new Date().toLocaleString('en-GB')}\\nPeriod: \${period === 'week' ? 'last 7 days' : 'last 30 days'}\\n\\nDaily calories target: \${t.calories} kcal\\nCalories logged (avg): \${avgKcal} kcal/day\\nWater (avg): \${avgWater} glasses/day\\nSteps (avg): \${avgSteps.toLocaleString()}/day\\nWorkouts logged: \${workouts}\\nWeight change: \${delta === null ? 'not enough check-ins' : (delta > 0 ? '+' : '') + delta + ' kg'}\\nCheck-ins logged: \${ws.length}\\n\\nMade with NutriSync — small steps, big change.\`;
  
  const download = () => {
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutrisync-report-' + todayKey() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const generateAiInsights = () => {
    let insights = [];
    if (avgWater < t.water) insights.push("💧 You're averaging slightly below your water target. Try keeping a bottle visible at your desk.");
    else insights.push("💧 Excellent hydration! You're hitting your water goals consistently.");
    
    if (avgSteps < 5000) insights.push("🚶 Your step count is a bit low. A short 15-minute walk after lunch can drastically improve this.");
    else if (avgSteps >= 10000) insights.push("🚶 Outstanding step count! You are extremely active.");
    
    if (avgKcal > t.calories + 300) insights.push("🍎 You are averaging slightly above your calorie target. Watch out for hidden liquid calories.");
    else if (avgKcal < t.calories - 500 && avgKcal > 0) insights.push("🍎 You might be under-eating based on your goals. Make sure you fuel your body adequately.");
    else insights.push("🍎 Calorie intake looks perfectly aligned with your targets.");

    if (workouts === 0) insights.push("💪 No workouts logged in this period. Even 10 minutes of stretching counts!");
    else if (workouts > 3) insights.push(\`💪 Great consistency with \${workouts} workouts logged!\`);
    
    return insights;
  };

  return (
    <>
      <Header title="Wellness Reports & Insights" desc="Interactive analytics and AI-driven insights from your daily logs." profile={profile} />
      
      <section className="panel report-tool" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="panel-title">
          <div>
            <h3>Analytics Window</h3>
            <p>Switch periods to instantly visualize your health trends.</p>
          </div>
          <div className="metric-tabs" style={{ margin: 0, width: '220px' }}>
            <button className={period === 'week' ? 'on' : ''} onClick={() => setPeriod('week')}>Last 7 days</button>
            <button className={period === 'month' ? 'on' : ''} onClick={() => setPeriod('month')}>Last 30 days</button>
          </div>
        </div>

        <div className="report-visuals" style={{ display: 'grid', gap: '20px', marginTop: '24px' }}>
          
          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontWeight: 600 }}>🔥 Calories (Average)</span>
              <span style={{ color: 'var(--muted)' }}>{avgKcal.toLocaleString()} / {t.calories.toLocaleString()} kcal</span>
            </div>
            <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: \`\${Math.min(100, (avgKcal / (t.calories||1)) * 100)}%\`, background: (avgKcal > t.calories) ? 'var(--orange)' : 'var(--mint)', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontWeight: 600 }}>💧 Water (Average)</span>
              <span style={{ color: 'var(--muted)' }}>{avgWater} / {t.water} glasses</span>
            </div>
            <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: \`\${Math.min(100, (avgWater / (t.water||1)) * 100)}%\`, background: '#0ea5e9', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 100px', background: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand)' }}>{avgSteps.toLocaleString()}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Avg Steps/Day</div>
            </div>
            <div style={{ flex: '1 1 100px', background: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand)' }}>{workouts}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Workouts Logged</div>
            </div>
            <div style={{ flex: '1 1 100px', background: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand)' }}>{delta===null?'—':(delta>0?'+':'')+delta+'kg'}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Weight Change</div>
            </div>
          </div>

        </div>

        <div className="report-actions" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="primary" onClick={download}>Download Text Report ↓</button>
          <button className="ghost" onClick={copy}>{copied ? '✓ Copied!' : 'Copy to Clipboard'}</button>
          <button className="ghost" style={{ marginLeft: 'auto', background: 'var(--brand)', color: '#fff', border: 'none' }} onClick={() => setOpenModal('ai')}>✨ Generate AI Insights</button>
        </div>
      </section>

      <section className="report-list">
        <article style={{ cursor: 'pointer', transition: 'transform 0.2s', border: period==='week'?'1px solid var(--brand)':'' }} onClick={() => setPeriod('week')}>
          <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>📊</span>
          <div>
            <h3>Weekly Pulse</h3>
            <p>View your 7-day averages and adherence.</p>
          </div>
          <small style={{color: period==='week'?'var(--brand)':'var(--muted)'}}>{period==='week'?'Active':'View'}</small>
        </article>
        
        <article style={{ cursor: 'pointer', transition: 'transform 0.2s', border: period==='month'?'1px solid var(--brand)':'' }} onClick={() => setPeriod('month')}>
          <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>📈</span>
          <div>
            <h3>Monthly Trends</h3>
            <p>Analyze long-term progress and consistency.</p>
          </div>
          <small style={{color: period==='month'?'var(--brand)':'var(--muted)'}}>{period==='month'?'Active':'View'}</small>
        </article>

        <article style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setOpenModal('ai')}>
          <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>✨</span>
          <div>
            <h3>AI Health Summary</h3>
            <p>Get instant feedback based on your patterns.</p>
          </div>
          <small style={{color:'var(--brand)'}}>Recommended</small>
        </article>
      </section>

      {openModal === 'ai' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'slideUpCard 0.3s' }} onClick={() => setOpenModal(null)}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>✨ AI Health Insights</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Based on your {period === 'week' ? '7-day' : '30-day'} patterns.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {generateAiInsights().map((insight, idx) => (
                <div key={idx} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', fontSize: '15px', lineHeight: '1.5', border: '1px solid var(--line)' }}>
                  {insight}
                </div>
              ))}
            </div>

            <button className="primary" style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '12px' }} onClick={() => setOpenModal(null)}>Got it, thanks!</button>
          </div>
        </div>
      )}
    </>
  );
}`;

const startIndex = main.indexOf('function Reports({profile})');
if (startIndex !== -1) {
  // Find where the next function starts or the end of the file
  const endMarkers = ['function ProfilePage', 'function App', 'function AuthPage', 'function Header', 'function Admin'];
  let endIndex = main.length;
  
  for (const marker of endMarkers) {
    const idx = main.indexOf(marker, startIndex + 100);
    if (idx !== -1 && idx < endIndex) {
      endIndex = idx;
    }
  }

  main = main.substring(0, startIndex) + newReportsComponent + '\n' + main.substring(endIndex);
  fs.writeFileSync('src/main.jsx', main);
  console.log('Reports component completely overhauled!');
} else {
  console.log('Could not find Reports component!');
}
