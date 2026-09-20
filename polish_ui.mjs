import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

// 1. Better shadows and active states for buttons globally (if not exists)
if (!css.includes('button:active')) {
  css += '\nbutton:active{transform:scale(0.97)!important;transition:transform .1s}';
}

// 2. Refine .dt-card (Daily Target Cards)
css = css.replace(
  /\.dt-card\{background:var\(--card\);border:1px solid var\(--line\);border-radius:14px;padding:14px;transition:transform \.15s,box-shadow \.15s\}/g,
  '.dt-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;transition:all .2s cubic-bezier(.2,.8,.2,1);box-shadow:0 1px 2px rgba(0,0,0,0.04)}'
);
css = css.replace(
  /\.dt-card:hover\{transform:translateY\(-2px\);box-shadow:0 8px 20px -8px #00000018\}/g,
  '.dt-card:hover{transform:translateY(-2px);box-shadow:0 12px 24px -10px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.05);border-color:#d1d5db}'
);

// 3. Fix .dt-status for dark mode (already fine in light mode)
if (!css.includes('.dark .dt-status')) {
  css += '\n.dark .dt-status{background:#1e293b;color:#94a3b8}';
}

// 4. Refine .kpis article hover (Key metrics cards)
css = css.replace(
  /\.kpis article\{position:relative;border-radius:14px;box-shadow:0 10px 22px -16px #00000026;transition:transform \.18s,box-shadow \.18s,overflow \.18s;overflow:hidden\}/g,
  '.kpis article{position:relative;border-radius:14px;box-shadow:0 2px 5px rgba(0,0,0,0.04);transition:all .2s cubic-bezier(.2,.8,.2,1);overflow:hidden}'
);
css = css.replace(
  /\.kpis article:hover\{transform:translateY\(-2px\);box-shadow:0 16px 28px -16px #00000040\}/g,
  '.kpis article:hover{transform:translateY(-2px);box-shadow:0 12px 24px -10px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.05);border-color:#d1d5db}'
);
css = css.replace(
  /\.kpis article\{border-radius:18px;border:1px solid var\(--line\);background:var\(--card\)\}/g,
  '.kpis article{border-radius:18px;border:1px solid var(--line);background:var(--card)}'
);

// 5. Update hero card to have a subtle frosted/mesh gradient in light mode
css = css.replace(
  /\.hero-card\{position:relative;border-radius:24px;background:linear-gradient\(120deg,var\(--card\),#ff80001a 55%,#cffafe\);border:1px solid var\(--line\);box-shadow:var\(--shadow\)\}/g,
  '.hero-card{position:relative;border-radius:24px;background:radial-gradient(ellipse at top left, #fff7ed, transparent 60%), radial-gradient(ellipse at bottom right, #eff6ff, transparent 60%), var(--card);border:1px solid var(--line);box-shadow:0 8px 30px -10px rgba(0,0,0,0.08);backdrop-filter:blur(8px)}'
);

// Dark mode hero card override
if (!css.includes('.dark .hero-card{background:radial-gradient')) {
  css = css.replace(
    /\.dark \.hero-card\{background:linear-gradient\(120deg,#152e25,#173a2b 60%,#123a33\);border-color:#2e4a3f\}/g,
    '.dark .hero-card{background:radial-gradient(ellipse at top left, #123c23, transparent 60%), radial-gradient(ellipse at bottom right, #092112, transparent 60%), var(--card);border-color:#2e4a3f;box-shadow:0 8px 30px -10px rgba(0,0,0,0.3)}'
  );
}

fs.writeFileSync('src/styles.css', css);
console.log("Updated styles.css with 21st.dev UI polish!");
