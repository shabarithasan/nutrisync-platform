import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

// 1. Fix .logo color
css = css.replace(
  /\.logo\{font-size:25px;font-weight:700;letter-spacing:-1\.5px;padding:0 14px 45px;color:#fff\}/g,
  '.logo{font-size:25px;font-weight:700;letter-spacing:-1.5px;padding:0 14px 45px;color:var(--side-text-hover)}'
);

// 2. Fix .logo:before color
css = css.replace(
  /\.logo:before\{content:"n";color:#fff\}/g,
  '.logo:before{content:"n";color:var(--side-text-hover)}'
);

// 3. Fix .side-bottom button color
css = css.replace(
  /\.side-bottom button\{padding:12px 13px;border-radius:9px;text-align:left;color:#d3eedd;font-weight:500;display:flex;align-items:center;gap:13px\}/g,
  '.side-bottom button{padding:12px 13px;border-radius:9px;text-align:left;color:var(--side-nav-text);font-weight:500;display:flex;align-items:center;gap:13px;transition:all .2s;}'
);

// 4. Add hover for .side-bottom button
if (!css.includes('.side-bottom button:hover')) {
  css += '\n.side-bottom button:hover{background:var(--side-hover);color:var(--side-text-hover);transform:translateX(3px)}';
}

fs.writeFileSync('src/styles.css', css);
console.log("Updated styles.css for visible text in sidebar!");
