import BMIGauge from './BMIGauge.jsx';
import AIChat from './AIChat.jsx';
import LiveSensors from './LiveSensors.jsx';
import MacOSDock from './MacOSDock.jsx';
import React, { useMemo, useState, useEffect, Component } from 'react';

import {
  AreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  AreaSeries,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline
} from 'reaviz';
import { createRoot } from 'react-dom/client';
import NutritionCalculator from './NutritionCalculator.jsx';
import './styles.css';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return <div className="app" style={{padding:'60px',textAlign:'center',fontFamily:'DM Sans,sans-serif'}}>
        <h2 style={{color:'#111827'}}>Something went wrong</h2>
        <p style={{color:'#6b7280'}}>{this.state.error.message}</p>
        <button onClick={() => { this.setState({ error: null }); window.location.reload(); }}
          style={{marginTop:'20px',padding:'10px 24px',background:'#22c55e',color:'#fff',border:0,borderRadius:'8px',cursor:'pointer'}}>Reload</button>
      </div>;
    }
    return this.props.children;
  }
}

const nav = [['overview','◫','Overview'],['progress','↗','Progress'],['water','◒','Water tracker'],['scan','⛶','Food scanner'],['reports','▤','Reports'],['calculator','◈','Calculator']];
const Ring = ({ value, color='#22c55e', label, sub }) => <div className="ring-wrap"><div className="ring" style={{'--value':`${value}%`, '--ring':color}}><b>{value}%</b></div><div><strong>{label}</strong><small>{sub}</small></div></div>;
const Bar = ({ label, amount, total, color }) => <div className="macro"><span>{label}</span><div><i style={{width:`${Math.min(100,amount/(total||1)*100)}%`,background:color}} /></div><b>{amount}g</b></div>;
const calculateDailyNutrition=(p)=>{const r=(x,m=1)=>Math.round(x*m);const w=parseFloat(p.weight)||0,h=parseFloat(p.height)||0,a=parseInt(p.age)||0,f=p.gender==='female';const hh=h/100;const bmi=hh>0&&w>0?r(w/(hh*hh),10)/10:0;const cat=bmi<18.5?'Underweight':bmi<25?'Healthy weight':bmi<30?'Overweight':'Obese';const bmr=r(10*w+6.25*h-5*a+(f?-161:5));const factors={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.725,extra_active:1.9};const factor=factors[p.activity]||1.2;const tdee=r(bmr*factor);const isMinor=a>0&&a<18;const hasHealth=p.health&&p.health!=='Normal';if(isMinor){const cal=f?1800:2000;const protein=r(w*1.0);const fat=r(cal*0.30/9);const carbs=r((cal-protein*4-fat*9)/4);const water=Math.max(6,r(w*30/250));return {date:todayKey(),calories:cal,protein,carbohydrates:Math.max(0,carbs),fat,sugar:r(cal*0.10/4),fiber:r(cal/1000*14),water,waterGlasses:water,steps:8000,bmi,bmiCategory:cat,bmr,tdee,activity:factor,calculationStatus:'general_guidance',isPersonalized:false,isMinor,hasHealth,goal:p.goal||'maintenance',message:'General guidance for ages under 18. Consult a healthcare professional for personalized targets.'};}const adj=p.goal==='loss'?-500:p.goal==='gain'?500:0;const cal=Math.max(f?1200:1500,tdee+adj);const basis=Math.max(w,parseFloat(p.targetWeight)||w,0);const pf=p.goal==='gain'?2.0:bmi>0&&bmi<18.5?2.0:bmi>=25?1.6:1.8;const protein=r(basis*pf);const fat=r(cal*0.25/9);const carbs=Math.max(0,r((cal-protein*4-fat*9)/4));const sugar=r(cal*0.10/4);const fiber=r(cal/1000*14);const waterGlasses=Math.max(6,r(w*35/250));const waterLitres=+(waterGlasses*0.25).toFixed(1);return {date:todayKey(),calories:cal,protein,carbohydrates:carbs,fat,sugar,fiber,water:waterLitres,waterGlasses,steps:10000,bmi,bmiCategory:cat,bmr,tdee,activity:factor,calculationStatus:hasHealth?'health_note':'personalized',isPersonalized:true,isMinor:false,hasHealth:!!hasHealth,goal:p.goal||'maintenance',message:hasHealth?'Individualized nutrition advice should come from a qualified healthcare professional.':''};};
const calcTargets=calculateDailyNutrition;

const dd=n=>n<10?'0'+n:''+n;
const keyOf=d=>d.getFullYear()+'-'+dd(d.getMonth()+1)+'-'+dd(d.getDate());
const todayKey=()=>keyOf(new Date());
const agoKey=n=>{const d=new Date();d.setDate(d.getDate()-n);return keyOf(d)};
const wkName=k=>{const p=k.split('-');return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(+p[0],+p[1]-1,+p[2]).getDay()]};
const shortLabel=k=>{const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-GB',{day:'numeric',month:'short'})};
const LOGKEY='nts-daily';
function loadLog(){try{return JSON.parse(localStorage.getItem(LOGKEY))||{}}catch{return{}}}
function saveLog(m){localStorage.setItem(LOGKEY,JSON.stringify(m))}
function useLog(){const [m,setM]=useState(loadLog);const patch=(k,o)=>setM(prev=>{const next={...prev,[k]:{...(prev[k]||{}),...o}};saveLog(next);return next});return {m,upd:patch}}
function currentStreak(m){const today=todayKey();const keys=new Set(Object.keys(m).filter(k=>m[k]&&(m[k].water||m[k].kcal||m[k].steps||(m[k].work&&m[k].work.length))));let s=0;let cur=new Date();if(!keys.has(keyOf(cur)))cur.setDate(cur.getDate()-1);while(keys.has(keyOf(cur))){s++;cur.setDate(cur.getDate()-1)}return s}
function bestStreak(m){const keys=Object.keys(m).filter(k=>m[k]&&(m[k].water||m[k].kcal||m[k].steps||(m[k].work&&m[k].work.length))).sort();let run=0,best=0,prev=null;keys.forEach(k=>{const p=k.split('-');const d=new Date(+p[0],+p[1]-1,+p[2]).getTime();const diff=prev?(d-prev)/86400000:0;run=diff===1?run+1:1;best=Math.max(best,run);prev=d});return best}
const stTime=()=>new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});

function Sidebar({ page, setPage, dark, setDark, onLogout }) { return <aside className="side"><div className="logo">nutri<span>sync</span><em>PRO</em></div><div className="nav">{nav.map(([id,ico,label])=><button key={id} onClick={()=>setPage(id)} className={page===id?'selected':''}><i>{ico}</i>{label}</button>)}</div><div className="side-bottom"><button onClick={()=>setDark(!dark)}>◐ {dark?'Light appearance':'Dark appearance'}</button><button onClick={onLogout}>⇥ Sign out</button></div></aside> }
function Header({ title, desc, profile }) {
  const initials = profile?.name ? profile.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() : '?';
  const todayLabel = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => { const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const [auth] = useState(() => { try { return JSON.parse(sessionStorage.getItem('nts-auth')); } catch { return null; } });
  const user = auth?.user || {};
  const doLogout = () => { sessionStorage.removeItem('nts-auth'); window.location.reload(); };
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const saveName = () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    try {
      const a = JSON.parse(sessionStorage.getItem('nts-auth'));
      if (a) { a.user = { ...a.user, name: trimmed }; sessionStorage.setItem('nts-auth', JSON.stringify(a)); }
      const p = JSON.parse(localStorage.getItem('nutrisync-profile'));
      if (p) { p.name = trimmed; localStorage.setItem('nutrisync-profile', JSON.stringify(p)); }
      window.location.reload();
    } catch {}
  };
  return <div className="page-head"><div><p className="eyebrow">{todayLabel}</p><h1>{title}</h1>{desc&&<p className="desc">{desc}</p>}</div><div className="head-actions"><div className="hdr-profile" ref={ref}><button className="avatar" onClick={()=>setOpen(!open)}>{initials}</button>{open&&<div className="profile-dropdown"><div className="pd-user"><div className="pd-avatar">{initials}</div><div><b>{user.name||'User'}</b><small>{user.email||''}</small></div></div><div className="pd-sep"/>{!editing?<button onClick={()=>{setEditing(true);setEditName(user.name||'')}}>✏️ Edit Name</button>:<div className="pd-edit"><input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus/><div className="pd-edit-btns"><button className="pd-save" onClick={()=>{setEditing(false);saveName()}}>Save</button><button className="pd-cancel" onClick={()=>setEditing(false)}>Cancel</button></div></div>}<button onClick={()=>{setOpen(false);doLogout()}}>🔑 Login</button><button onClick={()=>{setOpen(false);doLogout()}}>👥 Another Account</button><div className="pd-sep"/><button className="pd-logout" onClick={()=>{setOpen(false);doLogout()}}>🚪 Logout</button></div>}</div></div></div> }
function BMICalculator() {
  const [age, setAge] = useState('');
  const [ht, setHt] = useState('170');
  const [hU, setHU] = useState('cm');
  const [gen, setGen] = useState('female');
  const [wt, setWt] = useState('');
  const [wU, setWU] = useState('kg');
  const hM = hU === 'cm' ? (parseFloat(ht)||0)/100 : (parseFloat(ht)||0);
  const wKg = wU === 'lb' ? (parseFloat(wt)||0)*0.453592 : (parseFloat(wt)||0);
  const bmi = hM > 0 && wKg > 0 ? wKg / (hM * hM) : 0;
  const cl = Math.max(15, Math.min(38, bmi));
  const ang = -90 + ((cl - 15) / 23) * 180;
  const col = bmi > 0 ? bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#22c55e' : '#ef4444' : '#94a3b8';
  const CX = 150, CY = 148, R = 110;
  const aOf = b => 180 - ((b - 15) / 23) * 180;
  const arc = (b1, b2) => {
    const r = d => d * Math.PI / 180, a1 = aOf(b1), a2 = aOf(b2);
    return `M ${CX+R*Math.cos(r(a1))} ${CY+R*Math.sin(r(a1))} A ${R} ${R} 0 ${a1-a2>180?1:0} 0 ${CX+R*Math.cos(r(a2))} ${CY+R*Math.sin(r(a2))}`;
  };
  const ticks = [15, 18.5, 25, 30, 38];
  return (<section className="bmi-calc"><div className="bmi-card">
    <div className="bmi-head"><div className="bmi-icon">BMI</div><div><h3>BMI Calculator</h3><p>Enter your details below</p></div></div>
    <div className="bmi-row">
      <label>Age<input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="25" min="1" max="120"/></label>
      <label>Height<div className="bmi-ig"><input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" value={ht} onChange={e=>setHt(e.target.value)} step="0.1" placeholder="170"/><select value={hU} onChange={e=>setHU(e.target.value)}><option value="cm">cm</option><option value="m">m</option></select></div></label>
    </div>
    <div className="bmi-gender">
      <button className={gen==='female'?'on':''} onClick={()=>setGen('female')}>Female</button>
      <button className={gen==='male'?'on':''} onClick={()=>setGen('male')}>Male</button>
    </div>
    <label>Weight<div className="bmi-ig"><input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" value={wt} onChange={e=>setWt(e.target.value)} placeholder="65" step="0.1"/><select value={wU} onChange={e=>setWU(e.target.value)}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
    <div className="bmi-gauge-wrap">
      <svg viewBox="0 0 300 190" className="bmi-svg">
        <path d={arc(15,38)} fill="none" className="bmi-gauge-bg" strokeWidth="20" strokeLinecap="round"/>
        <path d={arc(15,18.5)} fill="none" stroke="#3b82f6" strokeWidth="20" strokeLinecap="round"/>
        <path d={arc(18.5,25)} fill="none" stroke="#22c55e" strokeWidth="20" strokeLinecap="round"/>
        <path d={arc(25,38)} fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round"/>
        {ticks.map(t => { const a=aOf(t),rd=a*Math.PI/180; const lx=CX+(R+14)*Math.cos(rd),ly=CY+(R+14)*Math.sin(rd); const tx=CX+(R+27)*Math.cos(rd),ty=CY+(R+27)*Math.sin(rd); return <g key={t}><line x1={CX+(R+10)*Math.cos(rd)} y1={CY+(R+10)*Math.sin(rd)} x2={lx} y2={ly} stroke="#9ca3af" strokeWidth="1.5"/><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#9ca3af" fontSize="9">{t}</text></g>; })}
        <g style={{transform:`rotate(${ang}deg)`,transformOrigin:`${CX}px ${CY}px`,transition:'transform 0.4s ease'}}>
          <polygon points={`${CX},${CY-88} ${CX-4},${CY+6} ${CX+4},${CY+6}`} fill="#1e293b"/>
          <circle cx={CX} cy={CY} r="7" fill="#475569" stroke="#e2e8f0" strokeWidth="2.5"/>
        </g>
        <text x={CX} y={CY+30} textAnchor="middle" fill={col} fontSize="32" fontWeight="700" fontFamily="Space Grotesk,sans-serif">{bmi>0?bmi.toFixed(1):'0.0'}</text>
        <text x={CX} y={CY+46} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="DM Sans,sans-serif">BMI</text>
      </svg>
      <div className="bmi-zones"><span className="bmi-z-under">Underweight</span><span className="bmi-z-normal">Normal</span><span className="bmi-z-over">Overweight</span></div>
    </div>
  </div></section>);
}
function LivePedometer({ m, upd, tk }) {
  const [active, setActive] = useState(false);
  const [localSteps, setLocalSteps] = useState(0);
  const day = m[tk] || {};
  const globalSteps = +(day.steps) || 0;
  
  // Sync local visually with global when it mounts
  useEffect(() => {
    if (!active) setLocalSteps(globalSteps);
  }, [globalSteps, active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      // Increment locally for smooth fast UI
      setLocalSteps(prev => {
        const next = prev + Math.floor(Math.random() * 5) + 3;
        // Only flush to global every few ticks to prevent spamming React global re-renders
        if (next % 4 === 0) upd(tk, { steps: next });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [active, tk, upd]);

  const displaySteps = active ? localSteps : globalSteps;

  return (
    <div className="panel live-sensor" style={{ position: 'relative', overflow: 'hidden', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: active ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--card)', color: active ? '#fff' : 'inherit', transition: 'all 0.3s ease' }}>
      <div 
        style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      >
        <span style={{ fontSize: '32px' }}>👟</span>
        {active && (
          <>
            <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
            <div style={{ position: 'absolute', inset: -8, border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.2s' }}></div>
          </>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: active ? '#fff' : 'inherit' }}>Smart Pedometer Sensor</h3>
        <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>{active ? 'Sensor connected. Walking detected!' : 'Connect device to track steps live.'}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '28px', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>{displaySteps.toLocaleString()}</div>
        <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Steps</div>
      </div>
      <button 
        onClick={() => {
          setActive(!active);
          if (active) upd(tk, { steps: localSteps }); // final flush
        }} 
        style={{ padding: '10px 16px', borderRadius: '20px', border: 'none', background: active ? '#fff' : '#10b981', color: active ? '#059669' : '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
      >
        {active ? 'Disconnect' : 'Connect'}
      </button>
      <style>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
    </div>
  );
}
function Overview({profile,setPage}){const {m,upd}=useLog();const t=calcTargets(profile);const tk=todayKey();const day=m[tk]||{};const cal=+day.kcal||0,water=+day.water||0,steps=+day.steps||0;const waterG=t.waterGlasses||Math.max(6,Math.round((+profile.weight||70)*35/250));const waterL=t.water||+(waterG*0.25).toFixed(1);const st=currentStreak(m),best=bestStreak(m);const [metric,setMetric]=useState('steps');const [sel,setSel]=useState(6); const [editKey,setEditKey]=useState(null); const [editVal,setEditVal]=useState('');const wm=[6,5,4,3,2,1,0].map(n=>({k:agoKey(n),v:+((m[agoKey(n)]||{})[metric])||0}));const wMax=Math.max(...wm.map(x=>x.v),1);const days=wm.map(x=>wkName(x.k));const sday=wm[sel];const heroPill=st>0?'\u2726 '+st+' DAY STREAK':water>0?'\u2726 HYDRATED TODAY':'\u2726 ON TRACK';const clr=(pct,over)=>pct>=100?'#22c55e':over?'#f59e0b':pct>0?'#3b82f6':'#94a3b8';const tgts=[{key:'calories',icon:'\ud83d\udd25',label:'Calories',val:cal,tgt:t.calories,unit:'kcal'},{key:'protein',icon:'\udc4a',label:'Protein',val:+(day.protein||0),tgt:t.protein,unit:'g'},{key:'carbs',icon:'\ud83c\udf5a',label:'Carbohydrates',val:+(day.carbs||0),tgt:t.carbohydrates,unit:'g'},{key:'fat',icon:'\ud83e\udd51',label:'Fat',val:+(day.fat||0),tgt:t.fat,unit:'g'},{key:'sugar',icon:'\ud83c\udf6c',label:'Sugar',val:+(day.sugar||0),tgt:t.sugar,unit:'g',isLimit:true},{key:'fiber',icon:'\ud83c\udf3e',label:'Fiber',val:+(day.fiber||0),tgt:t.fiber,unit:'g'},{key:'water',icon:'\ud83d\udca7',label:'Water',val:waterL,tgt:waterL>0?waterL:2.0,unit:'L',raw:water+' glasses'},{key:'steps',icon:'\ud83d\udc5f',label:'Steps',val:steps,tgt:t.steps,unit:'',raw:steps.toLocaleString()+' steps'}];const pOf=(v,tg)=>{if(!tg||tg<=0)return 0;return Math.min(100,Math.round(v/tg*100))};const sOf=(v,tg)=>{if(!v||v===0)return 'Not started';if(v>=tg)return 'Target reached';return 'In progress'};
  const handleSaveTgt = (key) => {
    if(!editVal) { setEditKey(null); return; }
    let parsed = parseFloat(editVal);
    if(isNaN(parsed)) parsed = 0;
    const curVal = +((m[tk] || {})[key]) || 0;
    upd(tk, { [key]: curVal + parsed });
    setEditKey(null);
    setEditVal('');
  };

  const dCard = tgts.map(item => {
    const pct = pOf(item.val, item.tgt);
    const status = sOf(item.val, item.tgt);
    const over = item.val > item.tgt;
    const bg = clr(pct, over);
    
    if (editKey === item.key) {
      return (
        <div className="dt-card edit-mode" key={item.key} style={{ padding: '16px', border: '2px solid var(--brand)', transform: 'scale(1.05)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="dt-icon">{item.icon}</span>
            <b style={{ flex: 1 }}>Log {item.label}</b>
            <button onClick={() => setEditKey(null)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" 
              placeholder={`Add ${item.unit}`} 
              value={editVal} 
              onChange={e => setEditVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveTgt(item.key)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--line)' }}
            />
            <button onClick={() => handleSaveTgt(item.key)} className="primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>Save</button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="dt-card" 
        key={item.key} 
        onClick={() => { setEditKey(item.key); setEditVal(''); }}
        style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
        title="Click to log intake"
      >
        <div className="dt-head" style={{ pointerEvents: 'none' }}>
          <span className="dt-icon">{item.icon}</span>
          <b>{item.label}</b>
          <span className={"dt-status" + (pct >= 100 ? " dt-reached" : pct > 0 ? " dt-progress" : "")}>{status}</span>
        </div>
        <div className="dt-stat" style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0', pointerEvents: 'none' }}>
          <strong style={{ fontSize: '24px' }}>{item.val}</strong>
          <small style={{ color: 'var(--muted)' }}>/ {item.tgt} {item.unit}</small>
        </div>
        <div className="dt-bar" style={{ pointerEvents: 'none' }}>
          <div style={{ width: Math.min(100, pct) + '%', backgroundColor: bg, height: '100%', borderRadius: 'inherit' }} />
        </div>
        
        <div className="dt-hover-hint" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', borderRadius: 'inherit', fontWeight: 'bold', color: 'var(--brand)', backdropFilter: 'blur(2px)' }}>
          + Log {item.label}
        </div>
      </div>
    );
  });
return React.createElement(React.Fragment,null,React.createElement(Header,{title:'Good morning \ud83d\udc4b',desc:'Here\u2019s how your nutrition journey is shaping up today.',profile:profile}),React.createElement('section',{className:'hero-card'},React.createElement('div',null,React.createElement('span',{className:'pill'},heroPill),React.createElement('h2',null,'Build a healthier rhythm,',React.createElement('br',null),React.createElement('i',null,'one day at a time.')),React.createElement('p',null,'Today you\u2019ve logged ',cal.toLocaleString(),' of ',t.calories.toLocaleString(),' kcal, ',water,' glasses of water and ',steps.toLocaleString(),' steps. Every habit you keep is a step toward your goal.'),React.createElement('span',{className:'hero-actions'},React.createElement('button',{onClick:()=>setPage('progress'),className:'primary'},'Log Food \u2192'),React.createElement('button',{onClick:()=>setPage('scan'),className:'ghost hero-scan'},'\u26f6 Scan food')))),t.message&&React.createElement('div',{className:'notice',style:{marginBottom:16}},'\u2139\ufe0f ',t.message),React.createElement(LivePedometer,{m,upd,tk}),React.createElement('section',{className:'daily-target'},React.createElement('h3',null,'Daily Target'),React.createElement('div',{className:'dt-grid'},dCard)),React.createElement('section',{className:'kpis'},React.createElement('article',null,React.createElement('span',null,'Streak'),React.createElement('strong',null,st,' days'),React.createElement('em',null,'best: ',best)),React.createElement('article',null,React.createElement('span',null,'BMI'),React.createElement('strong',null,t.bmi),React.createElement('em',null,t.bmiCategory)),React.createElement('article',null,React.createElement('span',null,'TDEE'),React.createElement('strong',null,t.tdee,' kcal'),React.createElement('em',null,t.goal,' goal'))))}
function DietProfile({profile,setProfile}){const [form,setForm]=useState(profile);const [saved,setSaved]=useState(false);const [generated,setGenerated]=useState(false);const [missing,setMissing]=useState([]);const target=useMemo(()=>calcTargets(form),[form]);const change=e=>setForm({...form,[e.target.name]:e.target.value});const save=e=>{e.preventDefault();setProfile(form);localStorage.setItem('nutrisync-profile',JSON.stringify(form));setSaved(true)};const generate=e=>{e.preventDefault();const need=[];if(!form.age)need.push('age is required');else if(form.age<10||form.age>100)need.push('age must be between 10 and 100');if(!form.gender)need.push('gender is required');if(!form.height)need.push('height is required');else if(form.height<120||form.height>220)need.push('height must be between 120 and 220 cm');if(!form.weight)need.push('weight is required');else if(form.weight<30||form.weight>300)need.push('weight must be between 30 and 300 kg');if(!form.goal)need.push('weight goal is required');if(!form.diet)need.push('food preference is required');setMissing(need);if(need.length)return;setGenerated(true);setTimeout(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}),50)};const hasHealth=form.health&&form.health!=='Normal';return <><Header title="Create your diet profile" desc="Fill in your details, then press Generate to see your diet estimate." profile={profile}/><BMICalculator/><form className="profile-form" onSubmit={save}><section><h3>1. Basic information</h3><div className="form-grid"><label>Full name<input name="name" value={form.name} onChange={change}/></label><label>Age<input name="age" type="number" value={form.age} onChange={change}/></label><label>Gender<select name="gender" value={form.gender} onChange={change}><option value="">Select gender</option><option value="female">Female</option><option value="male">Male</option></select></label><label>Height (cm)<input name="height" type="number" value={form.height} onChange={change}/></label><label>Current weight (kg)<input name="weight" type="number" value={form.weight} onChange={change}/></label></div></section><section><h3>2. Health condition</h3><div className="form-grid"><label>Health condition<select name="health" value={form.health} onChange={change}><option value="Normal">Normal / No conditions</option><option value="Diabetes">Diabetes</option><option value="Hypertension">Hypertension</option><option value="High Cholesterol">High Cholesterol</option><option value="Thyroid">Thyroid disorder</option><option value="PCOS">PCOS</option><option value="Kidney Disease">Kidney Disease</option><option value="Other">Other</option></select></label>{hasHealth&&<label>Details (optional)<input name="healthDetails" placeholder="Briefly describe your condition" value={form.healthDetails||''} onChange={change}/></label>}<label>Food allergies (optional)<input name="allergies" placeholder="e.g. peanuts, shellfish" value={form.allergies} onChange={change}/></label><label>Foods to avoid (optional)<input name="avoid" placeholder="e.g. dairy, gluten" value={form.avoid} onChange={change}/></label></div>{hasHealth&&<p className="health-note" style={{fontSize:11,color:'var(--muted)',marginTop:8,background:'#f0fdf4',border:'1px solid #dcfce7',borderRadius:8,padding:'8px 12px'}}>For medical conditions, nutrition goals should be confirmed with a qualified healthcare professional.</p>}</section><section><h3>3. What is your weight goal?</h3><p style={{fontSize:12,color:'var(--muted)',marginBottom:14}}>Select one option to personalize your calorie targets.</p><div className="goal-cards"><button type="button" className={'goal-card'+(form.goal==='loss'?' active':'')} onClick={()=>setForm({...form,goal:'loss'})}><div className="goal-icon">ðŸ“‰</div><b>Lose Weight</b><small>Calorie deficit Â· reduce body weight</small></button><button type="button" className={'goal-card'+(form.goal==='maintenance'?' active':'')} onClick={()=>setForm({...form,goal:'maintenance'})}><div className="goal-icon">âš–ï¸ </div><b>Maintain Weight</b><small>Maintenance calories Â· keep current weight</small></button><button type="button" className={'goal-card'+(form.goal==='gain'?' active':'')} onClick={()=>setForm({...form,goal:'gain'})}><div className="goal-icon">ðŸ“ˆ</div><b>Gain Weight</b><small>Calorie surplus Â· increase body weight</small></button></div></section><section><h3>4. Diet preferences</h3><div className="form-grid"><label>Food preference<select name="diet" value={form.diet} onChange={change}><option value="">Select food preference</option><option value="vegetarian">Vegetarian</option><option value="non_vegetarian">Non-Vegetarian</option><option value="vegan">Vegan</option><option value="eggetarian">Eggetarian</option></select></label><label>Meals per day<select name="mealsPerDay" value={form.mealsPerDay} onChange={change}><option value="">Select meals per day</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select></label><label>Preferred cuisine<input name="cuisine" value={form.cuisine} onChange={change}/></label></div></section>{missing.length>0&&<p className="notice" style={{color:'#ef4444'}}>Please fill in before generating: {missing.join(', ')}</p>}{generated&&<><button className="primary" style={{display:'block',margin:'0 auto',width:'min(100%,340px)'}}>Save profile</button>{saved&&<span className="saved">Profile saved.</span>}<section className="calculation"><h3>Your transparent nutrition estimate</h3><div className="calc-grid">{[['BMI',target.bmi+' ('+target.cat+')'],['Target BMI',target.targetBmi],['Target weight',target.targetWeight+' kg'],['BMR',target.bmr+' kcal'],['TDEE',target.tdee+' kcal'],['Daily calorie target',target.calories+' kcal'],['Protein',target.protein+' g'],['Protein basis',target.basis+' kg'],['Carbohydrates',target.carbs+' g'],['Fat',target.fat+' g']].map(x=><div key={x[0]}><small>{x[0]}</small><b>{x[1]}</b></div>)}</div></section></>}<button type="button" className="primary" onClick={generate} style={{display:'block',margin:'20px auto 0',width:'min(100%,340px)'}}>Generate Nutrition Estimate</button></form></>}
function Progress({ profile }) { const { m, upd } = useLog(); const tk = todayKey(); const day = m[tk] || {}; const t = calcTargets(profile); const [editKey, setEditKey] = useState(null); const [editVal, setEditVal] = useState(''); const handleSave = (key) => { if(!editVal) { setEditKey(null); return; } let parsed = parseFloat(editVal); if(isNaN(parsed)) parsed = 0; upd(tk, { [key]: (+day[key] || 0) + parsed }); setEditKey(null); setEditVal(''); }; const tgts = [ { key: 'kcal', icon: '🔥', label: 'Calories', val: +day.kcal||0, tgt: t.calories||2000, unit: 'kcal' }, { key: 'protein', icon: '🥩', label: 'Protein', val: +day.protein||0, tgt: t.protein||150, unit: 'g' }, { key: 'carbs', icon: '🍚', label: 'Carbs', val: +day.carbs||0, tgt: t.carbohydrates||200, unit: 'g' }, { key: 'fat', icon: '🥑', label: 'Fat', val: +day.fat||0, tgt: t.fat||60, unit: 'g' }, { key: 'water', icon: '💧', label: 'Water', val: +day.water||0, tgt: t.water||8, unit: 'glasses' }, { key: 'steps', icon: '👟', label: 'Steps', val: +day.steps||0, tgt: t.steps||10000, unit: 'steps' } ]; const start=+profile.weight||0; const goal=+profile.targetWeight||start; const h=+profile.height||0; const [weights,setWeights]=useState(()=>{try{return JSON.parse(localStorage.getItem('nts-progress'))||[]}catch{return[]}}); const [inp,setInp]=useState(''); const sorted=[...weights].sort((a,b)=>a.d<b.d?-1:1); const loggedToday=sorted.some(x=>x.d===tk); const cur=sorted.length?sorted[sorted.length-1].w:start; const addW=()=>{const v=parseFloat(inp);if(!v||v<20||v>300)return;const next=[...weights.filter(x=>x.d!==tk),{d:tk,w:v}].sort((a,b)=>a.d<b.d?-1:1);setWeights(next);localStorage.setItem('nts-progress',JSON.stringify(next));setInp('')}; const rmW=()=>{const next=weights.filter(x=>x.d!==tk);setWeights(next);localStorage.setItem('nts-progress',JSON.stringify(next))}; const ws=new Set(sorted.map(x=>x.d)); let ss=0,dd=new Date(); if(!ws.has(todayKey()))dd.setDate(dd.getDate()-1); while(ws.has(keyOf(dd))){ss++;dd.setDate(dd.getDate()-1)} let best=0,run=0,prev=null; sorted.forEach(x=>{const p=x.d.split('-');const ts=new Date(+p[0],+p[1]-1,+p[2]).getTime();const diffP=prev?(ts-prev)/86400000:0;run=diffP===1?run+1:1;best=Math.max(best,run);prev=ts}); const diff=Math.abs(start-goal); const pct=diff>0?Math.min(100,Math.round(Math.max(0,start-cur)/diff*100)):0; const bmiCur=h>0?Math.round(cur/((h/100)**2)*10)/10:0; const catC=bmiCur<18.5?'Underweight':bmiCur<25?'Healthy weight':bmiCur<30?'Overweight':'Obese'; const W0=56; const base=new Date(...agoKey(W0).split('-').map((x,i)=>+x-(i===1?1:0))); const real=sorted.map(x=>{const p=x.d.split('-').map(Number);const off=Math.round((new Date(p[0],p[1]-1,p[2])-base)/86400000);return off>=0&&off<=W0?{x:off/W0*700,w:x.w}:null}).filter(Boolean); const dots=real; const series=dots.length>1?dots:[{x:0,w:cur},{x:700,w:cur}]; const from=dots.length?dots[dots.length-1]:{x:0,w:cur}; const proj=[{x:from.x,w:from.w},{x:700,w:goal}]; const lo=Math.min(...series.map(p=>p.w),...proj.map(p=>p.w))-1,hi=Math.max(...series.map(p=>p.w),...proj.map(p=>p.w))+1; const y=v=>Math.min(230,190-((v-lo)/((hi-lo)||1))*150); const sm=arr=>{let d='M'+arr[0].x.toFixed(1)+' '+y(arr[0].w).toFixed(1);for(let i=0;i<arr.length-1;i++){const p0=arr[i-1]||arr[i],p1=arr[i],p2=arr[i+1],p3=arr[i+2]||p2;d+=' C'+((p1.x+(p2.x-p0.x)/6)).toFixed(1)+' '+y(p1.w+(p2.w-p0.w)/6).toFixed(1)+' '+((p2.x-(p3.x-p1.x)/6)).toFixed(1)+' '+y(p2.w-(p3.w-p1.w)/6).toFixed(1)+' '+p2.x.toFixed(1)+' '+y(p2.w).toFixed(1)}return d}; const path=sm(series); const pPath=sm(proj); return ( <><Header title="Log Food & Intake" desc="Track your daily nutrition and weight journey." profile={profile} /> <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}> {tgts.map(item => ( <div key={item.key} className="panel" style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '24px' }} onClick={() => { setEditKey(item.key); setEditVal(''); }}> <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}> <span style={{ fontSize: '38px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{item.icon}</span> <div> <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{item.label}</h3> <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}> {item.val} / {item.tgt} {item.unit} </p> </div> </div> {editKey === item.key ? ( <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}> <input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" placeholder={"Add " + item.unit} value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave(item.key)} style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink)', fontSize: '15px' }} /> <button onClick={() => handleSave(item.key)} className="primary" style={{ borderRadius: '10px', padding: '0 20px', fontWeight: '700' }}>Add</button> </div> ) : ( <div style={{ width: '100%', height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}> <div style={{ height: '100%', background: 'var(--green)', width: Math.min(100, (item.val / (item.tgt || 1)) * 100) + '%', transition: 'width 0.4s ease' }} /> </div> )} </div> ))} </div> <section className="kpis" style={{ marginTop: '20px' }}> <article><span>Current weight</span><strong>{cur} <small>kg</small></strong><em>{loggedToday?'✓ logged today':'enter today’s weight below'}</em></article> <article><span>Current BMI</span><strong>{bmiCur}</strong><em>● {catC}</em></article> <article><span>Check-in streak</span><strong>{ss}<small> days</small></strong><em>Best: {best} days · {pct}% to goal</em></article> </section> <section className="panel checkin"> <div className="panel-title"> <div> <h3>Log Weight</h3> <p>{loggedToday?'Nice — you’ve already checked in today.':`${diff.toFixed(1)} kg ${start>goal?'to lose':start<goal?'to gain':'to goal'} · Goal: ${goal} kg`}</p> </div> </div> {loggedToday ? <div className="checkin-done"><b>Today: {cur} kg</b><button className="ghost" onClick={rmW}>Undo check-in</button></div> : <div className="checkin-row"> <input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type="number" placeholder="Today’s weight (kg)" value={inp} onChange={e=>setInp(e.target.value)} min="20" max="300"/> <button className="primary" onClick={addW}>Log weight</button> </div> } {sorted.length>0&&<div className="checkin-history">{sorted.slice(-4).reverse().map(x=><span key={x.d}><b>{x.w} kg</b>{shortLabel(x.d)}</span>)}</div>} </section> <section className="panel big-chart"> <div className="panel-title"> <div> <h3>Weight journey</h3> <p>Projected path to {goal} kg · your logged days appear on it.</p> </div> <button>{sorted.length} log{sorted.length===1?'':'s'}</button> </div> 
  <div style={{ height: '240px', width: '100%', marginTop: '20px' }}>
    <AreaChart
      data={[
        { key: 'Weight', data: sorted.length ? sorted.map(x => ({ key: new Date(x.d), data: x.w })) : [{key: new Date(), data: cur}] },
        { key: 'Goal', data: sorted.length ? sorted.map(x => ({ key: new Date(x.d), data: goal })) : [{key: new Date(), data: goal}] }
      ]}
      xAxis={
        <LinearXAxis
          type="time"
          tickSeries={
            <LinearXAxisTickSeries
              label={
                <LinearXAxisTickLabel
                  format={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  fill="var(--muted)"
                />
              }
              tickSize={10}
            />
          }
        />
      }
      yAxis={
        <LinearYAxis
          axisLine={null}
          tickSeries={<LinearYAxisTickSeries line={null} label={null} tickSize={10} />}
        />
      }
      series={
        <AreaSeries
          type="grouped"
          interpolation="smooth"
          area={
            <Area
              gradient={
                <Gradient
                  stops={[
                    <GradientStop key={1} stopOpacity={0} />,
                    <GradientStop key={2} offset="100%" stopOpacity={0.4} />
                  ]}
                />
              }
            />
          }
          colorScheme={['#22c55e', '#f59e0b']}
        />
      }
      gridlines={<GridlineSeries line={<Gridline strokeColor="var(--line)" />} />}
    />
  </div>
</section>
 </> ); }
function Water({profile}){const {m,upd}=useLog();const target=Math.max(6,Math.round((+profile.weight||70)*35/250));const name=profile?.name?.split(' ')[0]||'there';const litres=(target*0.25).toFixed(1);const tk=todayKey();const day=m[tk]||{};const w=+day.water||0;const times=day.times||[];const setWater=n=>{const c=Math.max(0,Math.min(target,n));const t=n>w?[...times,new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})].slice(-8):times.slice(0,-1);upd(tk,{water:c,times:t})};const wk=[6,5,4,3,2,1,0].map(n=>+((m[agoKey(n)]||{}).water)||0);const wkMax=Math.max(...wk,1);const wkLabels=[...Array(7)].map((_,i)=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(new Date().getDay()-6+i+14)%7]);const mls=Math.round((+profile.weight||70)*35/6);const pct=target?Math.round(w/target*100):0;return (<><Header title="Hydrate with intention" desc="Every glass you log is saved — your streak survives tomorrow." profile={profile}/><section className="water-page"><div className="water-card"><div className="water-ring"><b>{w}</b><span>of {target} glasses</span></div><h2>Nice work, {name}!</h2><p>{w>=target?'You hit today’s hydration goal. Glowing from the inside out!':w<target*0.5?`Let’s get those first glasses in — you’ve got this.`:`You’re ${pct}% there — keep it flowing.`}</p><div className="ov-ctrl" style={{justifyContent:'center'}}><button onClick={()=>setWater(w+1)} className="primary">+ Add a glass</button><button onClick={()=>setWater(Math.max(0,w-1))} className="ghost">Undo</button></div><p className="water-note">{w} of {target} glasses · {pct}% today · {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'})}</p></div><div className="water-side panel"><h3>Your hydration rhythm</h3><p>Today’s goal: {litres} litres · {target} glasses (35 ml per kg of body weight)</p>{(times.length?times:['No drinks logged yet']).map((x,i)=><div className="water-log" key={i}><span>◒</span><b>{x==='No drinks logged yet'?'Tap “+ Add a glass” to start':x}</b><small>{x==='No drinks logged yet'?'':mls+' ml'}</small></div>)}<div className="chart">{wk.map((v,i)=><div key={i}><i style={{height:`${Math.round(v/wkMax*100)}%`,background:v>0?'#2563eb':'#f1f5f9'}}/><span>{wkLabels[i]}</span></div>)}</div><p className="water-note">Last 7 days of glasses</p></div></section></>);}
function Reports({profile}){
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
  
  const txt = `NUTRISYNC WELLNESS REPORT\nGenerated: ${new Date().toLocaleString('en-GB')}\nPeriod: ${period === 'week' ? 'last 7 days' : 'last 30 days'}\n\nDaily calories target: ${t.calories} kcal\nCalories logged (avg): ${avgKcal} kcal/day\nWater (avg): ${avgWater} glasses/day\nSteps (avg): ${avgSteps.toLocaleString()}/day\nWorkouts logged: ${workouts}\nWeight change: ${delta === null ? 'not enough check-ins' : (delta > 0 ? '+' : '') + delta + ' kg'}\nCheck-ins logged: ${ws.length}\n\nMade with NutriSync — small steps, big change.`;
  
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
    else if (workouts > 3) insights.push(`💪 Great consistency with ${workouts} workouts logged!`);
    
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
              <div style={{ height: '100%', width: `${Math.min(100, (avgKcal / (t.calories||1)) * 100)}%`, background: (avgKcal > t.calories) ? 'var(--orange)' : 'var(--mint)', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontWeight: 600 }}>💧 Water (Average)</span>
              <span style={{ color: 'var(--muted)' }}>{avgWater} / {t.water} glasses</span>
            </div>
            <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (avgWater / (t.water||1)) * 100)}%`, background: '#0ea5e9', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
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
}
function ProfilePage({auth, onLogout}) { const user = auth?.user || {}; const name = user.name || 'User'; const email = user.email || ''; const initials = name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase(); return (<><Header title="Profile" desc="Manage your account settings." profile={{name}}/><section className="profile-page"><div className="profile-card"><div className="profile-avatar">{initials}</div><h2>{name}</h2><p>{email}</p></div><div className="profile-actions"><button onClick={onLogout}><span className="pa-login">🔑</span><div>Login<small>Sign in with a different account</small></div></button><button onClick={onLogout}><span className="pa-switch">👥</span><div>Another Account<small>Switch to a different account</small></div></button><button onClick={onLogout}><span className="pa-logout">🚪</span><div>Logout<small>Sign out of your account</small></div></button></div></section></>); }
const adminKey='nts-admin-auth';
function AdminLogin({onSuccess}){const [form,setForm]=useState({email:'',password:''});const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [showPw,setShowPw]=useState(false);const ch=e=>setForm({...form,[e.target.name]:e.target.value});const sub=async()=>{setBusy(true);setError('');if(!form.email||!form.password){setError('Admin email and password are required.');setBusy(false);return}try{const r=await fetch(apiBase+'/api/auth/admin-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json().catch(()=>({}));if(!r.ok){setError(d.error||'Admin login failed.');return}localStorage.setItem(adminKey,JSON.stringify({accessToken:d.accessToken,user:d.user}));onSuccess()}catch{setError('Could not reach the API server. Make sure it is running.')}finally{setBusy(false)}};return <div className="auth-page"><div className="auth-card"><div className="auth-mark">⚙</div><div className="logo">nutri<span>sync</span><em>ADMIN</em></div><h1>Admin sign in</h1><p>Restricted area — authorized administrators only.</p><input name="email" type="email" placeholder="Admin email" value={form.email} onChange={ch}/><div className="pw-wrap"><input name="password" type={showPw?'text':'password'} placeholder="Admin password" value={form.password} onChange={ch}/><button type="button" className="pw-toggle" onClick={()=>setShowPw(!showPw)}>{showPw?'Hide':'Show'}</button></div>{error&&<p className="auth-error">{error}</p>}<button className="primary" onClick={sub} disabled={busy}>{busy?'Please wait…':'Sign in to Admin'}</button><button className="ghost" onClick={()=>{location.hash=''}}>← Back to NutriSync</button></div></div>}
function Admin({session,onLogout}){const [q,setQ]=useState('');const [users,setUsers]=useState([]);const [err,setErr]=useState('');useEffect(()=>{fetch(apiBase+'/api/admin/users',{headers:{Authorization:'Bearer '+session.accessToken}}).then(r=>r.json()).then(d=>setUsers(d.users||[])).catch(()=>setErr('Could not load members. Check that the API server is running.'))},[]);const filtered=users.filter(u=>(u.name||'').toLowerCase().includes(q)||(u.email||'').toLowerCase().includes(q));const verified=users.filter(u=>u.isEmailVerified).length;const admins=users.filter(u=>u.role==='ADMIN').length;return (<><Header title="Admin dashboard" desc="Restricted area — the NutriSync member community." profile={{name:'Administrator'}}/><div className="admin-bar"><input type="search" placeholder="Search members by name or email…" value={q} onChange={e=>setQ(e.target.value.toLowerCase())}/><button className="ghost" style={{marginLeft:'auto',width:'auto',padding:'10px 14px',whiteSpace:'nowrap'}} onClick={onLogout}>Sign out · {session.user.email}</button></div>{err&&<p className="notice" style={{color:'#ef4444',fontSize:12}}>{err}</p>}<section className="kpis"><article><span>Total members</span><strong>{users.length.toLocaleString()}</strong><em>{admins} admin · {users.length-admins} user</em></article><article><span>Active members</span><strong>{verified.toLocaleString()}</strong><em>email verified</em></article><article><span>Tracked profile</span><strong>{users.length}</strong><em>up to 100 shown</em></article></section><section className="panel admin-table"><div className="panel-title"><div><h3>Members</h3><p>{filtered.length} shown</p></div><button>{users.length} total</button></div>{filtered.map(u=><div key={u.id}><span className="avatar">{u.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}</span><b>{u.name}</b><small>{u.email}</small><button className={u.role==='ADMIN'?'active':'idle'}>{u.role==='ADMIN'?'● Admin':u.isEmailVerified?'● Active':'○ Unverified'}</button></div>)}{filtered.length===0&&<p className="water-note" style={{padding:'18px 0'}}>No members match your search.</p>}</section></>);}
function AdminApp(){const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem(adminKey))}catch{return null}});if(!session)return <AdminLogin onSuccess={()=>{try{setSession(JSON.parse(localStorage.getItem(adminKey)))}catch{setSession(null)}}}/>;return <Admin session={session} onLogout={()=>{localStorage.removeItem(adminKey);setSession(null);location.hash=''}}/>}
function FoodScan({profile}){const {m,upd}=useLog();const tk=todayKey();const [stage,setStage]=useState('idle');const [img,setImg]=useState('');const [foods,setFoods]=useState([]);const [error,setError]=useState('');const [note,setNote]=useState('');const [saved,setSaved]=useState([]);const [saving,setSaving]=useState(false);const [cameraActive,setCameraActive]=useState(false);const [cameraError,setCameraError]=useState('');const videoRef=React.useRef(null);const canvasRef=React.useRef(null);const streamRef=React.useRef(null);const stopCamera=()=>{if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null}setCameraActive(false)};React.useEffect(()=>()=>stopCamera(),[]);const startCamera=async()=>{setCameraError('');try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}}});streamRef.current=stream;setCameraActive(true);setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play().catch(()=>{})}},100)}catch(e){if(e.name==='NotAllowedError')setCameraError('Camera permission denied. Please allow camera access in your browser settings.');else if(e.name==='NotFoundError')setCameraError('No camera found on this device.');else setCameraError('Could not access camera: '+e.message)}};const capturePhoto=()=>{if(!videoRef.current||!canvasRef.current)return;const v=videoRef.current;const c=canvasRef.current;c.width=v.videoWidth||v.clientWidth;c.height=v.videoHeight||v.clientHeight;c.getContext('2d').drawImage(v,0,0,c.width,c.height);const dataUrl=c.toDataURL('image/jpeg',0.9);stopCamera();setImg(dataUrl);setFoods([]);setSaved([]);setError('');setNote('');setStage('captured')};const retake=()=>{setImg('');setFoods([]);setSaved([]);setStage('idle');startCamera()};const pick=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{const orig=rd.result;setImg(orig);setError('');setNote('');setFoods([]);setSaved([]);setStage('captured');const i=new Image();i.onload=()=>{const MAX=1600;const sc=Math.min(1,MAX/Math.max(i.naturalWidth,i.naturalHeight));if(sc>=1){analyzeDataUrl(orig);return}const cv=document.createElement('canvas');cv.width=Math.round(i.naturalWidth*sc);cv.height=Math.round(i.naturalHeight*sc);cv.getContext('2d').drawImage(i,0,0,cv.width,cv.height);analyzeDataUrl(cv.toDataURL('image/jpeg',0.9))};i.onerror=()=>analyzeDataUrl(orig);i.src=orig};rd.readAsDataURL(f)};const token=()=>{try{return JSON.parse(sessionStorage.getItem('nts-auth'))?.accessToken}catch{return null}};const refresh=async()=>{try{const r=await fetch(apiBase+'/api/auth/refresh',{method:'POST',credentials:'include'});const d=await r.json().catch(()=>({}));if(!r.ok||!d.accessToken)return null;sessionStorage.setItem('nts-auth',JSON.stringify({accessToken:d.accessToken,user:d.user}));return d.accessToken}catch{return null}};const authFetch=async(path,opts={})=>{const t=token()||'';let r=await fetch(apiBase+path,{...opts,headers:{...opts.headers,'Authorization':'Bearer '+t},credentials:'include'});if(r.status===401){const nt=await refresh();if(nt)r=await fetch(apiBase+path,{...opts,headers:{...opts.headers,'Authorization':'Bearer '+nt},credentials:'include'})}return r};const analyzeDataUrl=async(src)=>{if(!src)return;setStage('analyzing');setError('');setNote('');try{const r=await authFetch('/api/food/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:src})});const d=await r.json().catch(()=>({}));if(!r.ok){setError(d.error||'Analysis failed.');setStage('captured');return}if(d.quality&&(d.quality.blurry||d.quality.noFoodDetected)){setNote(d.quality.blurry?'Image appears blurry — results may be inaccurate.':'No food detected in the image.');if(!d.foods||!d.foods.length){setStage('captured');return}}setFoods((d.foods||[]).slice(0,5));setStage('results')}catch{setError('Could not analyze the image. Check your connection.');setStage('captured')}};const analyze=()=>{analyzeDataUrl(img)};const saveMeal=async(food,fi)=>{if(saved.includes(fi))return;setSaving(true);try{const r=await authFetch('/api/food/meals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mealType:'scanned',foodName:food.name,serving:food.serving,calories:food.calories,protein:food.protein,carbs:food.carbs,fat:food.fat,fiber:food.fiber||0,sugar:food.sugar||0,confidence:food.confidence||0,imageUrl:null,loggedAt:new Date().toISOString()})});if(r.ok){setSaved([...saved,fi]);const tk2=todayKey();const day=m[tk2]||{};upd(tk2,{kcal:(+day.kcal||0)+food.calories,protein:(+day.protein||0)+food.protein,carbs:(+day.carbs||0)+food.carbs,fat:(+day.fat||0)+food.fat,water:(+day.water||0)})}}catch{}setSaving(false)};return (<><Header title="Scan your food" desc="Take a photo or upload an image to identify what you're eating." profile={profile}/><section className="scan-card panel"><div className="scan-upload"><button className="scan-btn primary" onClick={()=>{if(cameraActive){stopCamera();setStage('idle')}else{setStage('idle');setImg('');setFoods([]);setSaved([]);startCamera()}}}>{cameraActive?'⏹ Stop Camera':'📷 Open Camera'}</button><label className="scan-btn">📁 Upload Image<input type="file" accept="image/*" capture="environment" onChange={pick} hidden/></label></div>{cameraError&&<p className="scan-error">{cameraError}</p>}{cameraActive&&stage==='idle'&&<div className="scan-camera"><video ref={videoRef} autoPlay playsInline muted className="scan-video"/><button className="primary scan-capture" onClick={capturePhoto}>📸 Capture Photo</button></div>}{stage==='idle'&&!cameraActive&&!img&&<div className="scan-empty"><b>Ready to scan</b><p>Open your camera or upload a photo of your meal</p></div>}{stage==='captured'&&img&&<div className="scan-preview-wrap"><img src={img} className="scan-preview" alt="Captured food"/><div className="scan-actions"><button className="primary" onClick={analyze}>🔍 Analyze Food</button><button className="ghost" onClick={retake}>↩ Retake</button></div></div>}{stage==='analyzing'&&<div className="scan-loading"><div className="scan-spin"/><b>Analyzing your food…</b><p>Our AI is identifying the items in your photo</p></div>}{error&&<p className="scan-error">{error}</p>}{note&&!error&&<p className="scan-note">{note}</p>}{stage==='results'&&foods.length>0&&<div className="scan-results">{foods.map((f,i)=><article key={i} className={saved.includes(i)?'saved-meal':''}><div className="scan-food-top"><b>{f.name}</b><span>{f.confidence||'–'}% match</span></div><small>{f.serving}</small><div className="scan-macros"><span>{f.calories} kcal</span><span>P {f.protein}g</span><span>C {f.carbs}g</span><span>F {f.fat}g</span>{f.fiber?<span>Fiber {f.fiber}g</span>:null}{f.sugar?<span>Sugar {f.sugar}g</span>:null}</div><button className={saved.includes(i)?'ghost':'primary'} disabled={saving||saved.includes(i)} onClick={()=>saveMeal(f,i)}>{saved.includes(i)?'✓ Saved':saving?'Saving…':'Save to meals'}</button></article>)}<p className="scan-disclaimer">Nutritional values are AI-estimated and may not be exact.</p></div>}{stage==='results'&&!foods.length&&!error&&<div className="scan-empty"><b>No food detected</b><p>Try a clearer photo or a different angle</p><button className="scan-btn" onClick={retake}>↩ Retake</button></div>}</section><canvas ref={canvasRef} style={{display:'none'}}/></>);}
function LoadingOverlay() { return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.15)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:99}}><div style={{background:'var(--card)',padding:'30px 40px',borderRadius:'16px',boxShadow:'0 8px 32px rgba(0,0,0,.1)'}}><div style={{width:28,height:28,border:'3px solid var(--line)',borderTopColor:'var(--green)',borderRadius:'50%',animation:'spin .6s linear infinite',margin:'0 auto 12px'}}/><span style={{color:'var(--muted)',fontSize:13}}>Loading…</span></div></div> }
const apiBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
const AuthPage=({onAuth})=>{const [mode,setMode]=useState('login');const [form,setForm]=useState({name:'',email:'',password:''});const [error,setError]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);const [showPw,setShowPw]=useState(false);const ch=e=>setForm({...form,[e.target.name]:e.target.value});const post=async(path,body)=>{try{const r=await fetch(apiBase+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),credentials:'include'});const d=await r.json().catch(()=>({}));return {ok:r.ok,d}}catch{return {ok:false,d:{error:'Could not reach the API server. Make sure it is running.'}}}};const finish=a=>{sessionStorage.setItem('nts-auth',JSON.stringify(a));onAuth(a)};const submit=async()=>{setBusy(true);setError('');try{if(mode==='register'&&form.name.trim().length<2){setError('Please enter your name.');setBusy(false);return}if(!form.email||!form.password){setError('Email and password are required.');setBusy(false);return}if(mode==='register'&&form.password.length<8){setError('Password must be at least 8 characters.');setBusy(false);return}let r=await post('/api/auth/login',{email:form.email,password:form.password});if(mode==='register'){const reg=await post('/api/auth/register',{name:form.name,email:form.email,password:form.password});if(!reg.ok){setError(reg.d.error||'Registration failed.');setBusy(false);return}setNotice('Account created — verifying…');if(reg.d.verificationToken){await post('/api/auth/verify-email',{token:reg.d.verificationToken})}r=await post('/api/auth/login',{email:form.email,password:form.password})}if(!r.ok){setError(r.d.error||'Sign in failed.');setBusy(false);return}finish({user:r.d.user,accessToken:r.d.accessToken})}catch{setError('Something went wrong while signing in. Please try again.');setBusy(false)}};const colors={login:['Welcome back','Sign in to continue your nutrition journey.','Sign in'],register:['Create your account','Start your personalized plan today.','Create account & sign in']}[mode];return <div className="auth-page"><div className="auth-card"><div className="auth-mark">🥗</div><div className="logo">nutri<span>sync</span></div><h1>{colors[0]}</h1><p>{colors[1]}</p>{mode==='register'&&<input name="name" placeholder="Full name" value={form.name} onChange={ch}/>}<input name="email" type="email" placeholder="Email address" value={form.email} onChange={ch}/><div className="pw-wrap"><input name="password" type={showPw?'text':'password'} placeholder={mode==='register'?'Password (min 8 characters)':'Password'} value={form.password} onChange={ch}/><button type="button" className="pw-toggle" onClick={()=>setShowPw(!showPw)}>{showPw?'Hide':'Show'}</button></div>{error&&<p className="auth-error">{error}</p>}{notice&&<p className="auth-notice">{notice}</p>}<button className="primary" onClick={submit} disabled={busy}>{busy?'Please wait…':colors[2]}</button><button className="ghost" onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setNotice('')}}>{mode==='login'?'New here? Create an account':'Already have an account? Sign in'}</button><p className="auth-tag">Small steps, big change.<br/><a style={{color:'#16a34a',fontWeight:700,cursor:'pointer'}} onClick={()=>location.hash='#admin'}>Admin sign in →</a></p></div></div>};
function App(){const defaults={name:'',age:'',gender:'',height:'',weight:'',targetWeight:'',activity:'',health:'Normal',healthDetails:'',allergies:'',avoid:'',goal:'loss',diet:'',mealsPerDay:'',cuisine:'',plan:'monthly'};const [page,setPage]=useState('overview'),[dark,setDark]=useState(false),[route,setRoute]=useState(()=>location.hash.startsWith('#admin')?'admin':'app');useEffect(()=>{const f=()=>setRoute(location.hash.startsWith('#admin')?'admin':'app');window.addEventListener('hashchange',f);return ()=>window.removeEventListener('hashchange',f)},[]);const [profile,setProfile]=useState(()=>{try{return {...defaults,...JSON.parse(localStorage.getItem('nutrisync-profile'))}}catch{return defaults}}),[auth,setAuth]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('nts-auth'))}catch{return null}}),[loading,setLoading]=useState(false);if(route==='admin')return <AdminApp/>;if(!auth)return <AuthPage onAuth={a=>{setAuth(a);setProfile(p=>({...p,name:a.user.name}))}}/>;const content={overview:<Overview profile={profile} setPage={setPage}/>,progress:<Progress profile={profile}/>,water:<Water profile={profile}/>,scan:<FoodScan profile={profile}/>,reports:<Reports profile={profile}/>,calculator:<><BMIGauge profile={profile}/><NutritionCalculator profile={profile}/></>}[page];return <div className={dark?'app dark':'app'}><div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:999}}><MacOSDock apps={[
  { id: 'overview', name: 'Dashboard', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316" /><stop offset="100%" stop-color="#ea580c" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g1)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></g></svg>') },
  { id: 'progress', name: 'Log Food', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6" /><stop offset="100%" stop-color="#2563eb" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g2)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></g></svg>') },
  { id: 'water', name: 'Water', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9" /><stop offset="100%" stop-color="#0284c7" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g3)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></g></svg>') },
  { id: 'scan', name: 'Scanner', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981" /><stop offset="100%" stop-color="#059669" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g4)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></g></svg>') },
  { id: 'reports', name: 'Reports', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6" /><stop offset="100%" stop-color="#7c3aed" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g5)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></g></svg>') },
  { id: 'calculator', name: 'Calculator', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899" /><stop offset="100%" stop-color="#db2777" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g6)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="16" y1="18" x2="16" y2="18"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="12" y1="18" x2="12" y2="18"></line></g></svg>') },
  { id: 'theme', name: 'Theme', icon: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b" /><stop offset="100%" stop-color="#475569" /></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g7)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/><g transform="translate(26, 26) scale(2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></g></svg>') }
]}
onAppClick={(id) => { if(id==='theme') setDark(!dark); else setPage(id); }} openApps={[page]} /></div><main className="content">{content}</main>{loading&&<LoadingOverlay/>}<LiveSensors /><AIChat /></div>}
createRoot(document.getElementById('root')).render(<ErrorBoundary><App/></ErrorBoundary>);

