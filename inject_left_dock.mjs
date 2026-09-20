import fs from 'fs';

const makeSvg = (path, color1, color2) => {
  const raw = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="120" height="120" x="4" y="4" rx="30" fill="url(#g)" filter="url(#shadow)"/>
      <rect width="120" height="120" x="4" y="4" rx="30" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4"/>
      ${path}
    </svg>
  `.replace(/\n/g, '').trim();
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(raw);
};

const apps = [
  { id: 'overview', name: 'Dashboard', icon: makeSvg('<path d="M64 28 L24 60 h12 v40 h20 V72 h16 v28 h20 V60 h12 Z" fill="#fff"/>', '#f97316', '#ea580c') },
  { id: 'progress', name: 'Progress', icon: makeSvg('<path d="M24 100 h80 v8 H24 z M32 84 h16 V44 H32 z M56 84 h16 V28 H56 z M80 84 h16 V60 H80 z" fill="#fff"/>', '#3b82f6', '#2563eb') },
  { id: 'water', name: 'Water Tracker', icon: makeSvg('<path d="M64 28 C64 28 36 56 36 76 A28 28 0 0 0 92 76 C92 56 64 28 64 28 Z" fill="#fff"/>', '#06b6d4', '#0891b2') },
  { id: 'scan', name: 'Food Scanner', icon: makeSvg('<path d="M28 44 h16 l8 -12 h24 l8 12 h16 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 H28 a8 8 0 0 1 -8 -8 V52 a8 8 0 0 1 8 -8 z M64 92 a20 20 0 1 0 0 -40 a20 20 0 0 0 0 40 z" fill="#fff"/>', '#10b981', '#059669') },
  { id: 'reports', name: 'Reports', icon: makeSvg('<path d="M36 20 h36 l28 28 v52 a8 8 0 0 1 -8 8 H36 a8 8 0 0 1 -8 -8 V28 a8 8 0 0 1 8 -8 z M68 24 v24 h24 M44 64 h40 M44 80 h24" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>', '#8b5cf6', '#7c3aed') },
  { id: 'calculator', name: 'Calculator', icon: makeSvg('<rect x="28" y="20" width="72" height="88" rx="8" fill="none" stroke="#fff" stroke-width="8"/><rect x="40" y="36" width="48" height="20" rx="4" fill="#fff"/><circle cx="44" cy="72" r="6" fill="#fff"/><circle cx="64" cy="72" r="6" fill="#fff"/><circle cx="84" cy="72" r="6" fill="#fff"/><circle cx="44" cy="92" r="6" fill="#fff"/><circle cx="64" cy="92" r="6" fill="#fff"/><circle cx="84" cy="92" r="6" fill="#fff"/>', '#ec4899', '#db2777') },
  { id: 'theme', name: 'Toggle Theme', icon: makeSvg('<path d="M64 20 A44 44 0 1 0 108 64 A32 32 0 1 1 64 20 Z" fill="#fff"/>', '#64748b', '#475569') }
];

let main = fs.readFileSync('src/main.jsx', 'utf8');

const replacementStr = `<div style={{position:'fixed',top:'50%',left:24,transform:'translateY(-50%)',zIndex:999}}><MacOSDock apps={${JSON.stringify(apps)}} onAppClick={(id) => { if(id==='theme') setDark(!dark); else setPage(id); }} openApps={[page]} /></div>`;

// Replace the previous dock string
main = main.replace(
  /<div style=\{\{position:'fixed',bottom:24,left:'50%',transform:'translateX\(-50%\)',zIndex:999\}\}><MacOSDock apps=\{\[\s*\{ id: 'overview'[^<]+\]\} onAppClick=\{\(id\)[^<]+\]\} \/><\/div>/g,
  replacementStr
);

fs.writeFileSync('src/main.jsx', main);

// Update padding in styles.css
let css = fs.readFileSync('src/styles.css', 'utf8');
css = css.replace('padding-bottom: 120px !important;', 'padding-left: 100px !important;');
fs.writeFileSync('src/styles.css', css);

console.log('Injected custom SVG icons and moved dock to left side!');
