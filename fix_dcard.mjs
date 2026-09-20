import fs from 'fs';
let main = fs.readFileSync('src/main.jsx', 'utf8');

const overviewStart = main.indexOf('function Overview');
const overviewEnd = main.indexOf('function Progress', overviewStart);
let overviewBody = main.substring(overviewStart, overviewEnd);

const dCardStart = overviewBody.indexOf('const dCard=tgts.map(item=>{');
if (dCardStart !== -1) {
  const returnStart = overviewBody.indexOf('return React.createElement(React.Fragment', dCardStart);
  if (returnStart !== -1) {
    const oldDcard = overviewBody.substring(dCardStart, returnStart);
    console.log('Found dCard block to replace');
    
    const newDCardJSX = `
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
            <input 
              autoFocus
              type="number" 
              placeholder={\`Add \${item.unit}\`} 
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
`;

    overviewBody = overviewBody.replace(oldDcard, newDCardJSX);
    main = main.substring(0, overviewStart) + overviewBody + main.substring(overviewEnd);
    fs.writeFileSync('src/main.jsx', main);
    console.log('Successfully replaced dCard logic!');
  }
}
