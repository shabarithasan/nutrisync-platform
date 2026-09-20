import fs from 'fs';
let css = fs.readFileSync('src/styles.css', 'utf8');

css = css.replace(
  /:root \{\s*--card: rgba\(255, 255, 255, 0\.6\);\s*--line: rgba\(255, 255, 255, 0\.4\);\s*\}/,
  `/* Liquid Glass & Modern Clean UI Styling Override */
:root {
  --card: rgba(255, 255, 255, 0.95);
  --line: rgba(226, 232, 240, 1);
}`
);

css = css.replace(
  /\.dark \{\s*--card: rgba\(0, 0, 0, 0\.5\);\s*--line: rgba\(255, 255, 255, 0\.1\);\s*\}/,
  `.dark {
  --card: rgba(15, 23, 42, 0.9);
  --line: rgba(51, 65, 85, 1);
}`
);

css = css.replace(
  /\.app \{\s*background: radial-gradient\(circle at top right, #e0f2fe, transparent 60%\),\s*radial-gradient\(circle at bottom left, #fdf4ff, transparent 60%\),\s*#f8fafc !important;\s*background-image: radial-gradient\(var\(--line\) 1px, transparent 1px\) !important;\s*background-size: 32px 32px, 32px 32px, 32px 32px !important;\s*\}/,
  `.app {
  background: radial-gradient(circle at top right, #f0f9ff, transparent 80%),
              radial-gradient(circle at bottom left, #fdf4ff, transparent 80%),
              #f8fafc !important;
}`
);

css = css.replace(
  /\.dark \.app \{\s*background: radial-gradient\(circle at top right, #1e1b4b, transparent 60%\),\s*radial-gradient\(circle at bottom left, #064e3b, transparent 60%\),\s*#0f172a !important;\s*background-image: radial-gradient\(rgba\(255,255,255,0\.05\) 1px, transparent 1px\) !important;\s*\}/,
  `.dark .app {
  background: radial-gradient(circle at top right, #1e1b4b, transparent 60%),
              radial-gradient(circle at bottom left, #064e3b, transparent 60%),
              #0f172a !important;
}`
);

css = css.replace(
  /\.panel, \.kpis article, \.dt-card, \.profile-card, \.water-card, \.auth-card \{\s*backdrop-filter: blur\(24px\) saturate\(1\.2\) !important;\s*-webkit-backdrop-filter: blur\(24px\) saturate\(1\.2\) !important;\s*border: 1px solid rgba\(255, 255, 255, 0\.4\) !important;\s*background: var\(--card\) !important;\s*box-shadow: 0 8px 32px 0 rgba\(0, 0, 0, 0\.1\) !important;\s*\}/,
  `.panel, .kpis article, .dt-card, .profile-card, .water-card, .auth-card {
  backdrop-filter: blur(16px) saturate(1.8) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.8) !important;
  border: 1px solid var(--line) !important;
  background: var(--card) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  border-radius: 16px !important;
}`
);

css = css.replace(
  /\.dark \.panel, \.dark \.kpis article, \.dark \.dt-card, \.dark \.profile-card, \.dark \.water-card, \.dark \.auth-card \{\s*border: 1px solid rgba\(255, 255, 255, 0\.1\) !important;\s*box-shadow: 0 8px 32px 0 rgba\(0, 0, 0, 0\.3\) !important;\s*\}/,
  `.dark .panel, .dark .kpis article, .dark .dt-card, .dark .profile-card, .dark .water-card, .dark .auth-card {
  border: 1px solid var(--line) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
}`
);

css = css.replace(
  /\.hero-card\{position:relative;border-radius:24px;background:radial-gradient\(ellipse at top left, #fff7ed, transparent 60%\), radial-gradient\(ellipse at bottom right, #eff6ff, transparent 60%\), var\(--card\);border:1px solid var\(--line\);box-shadow:0 8px 30px -10px rgba\(0,0,0,0\.08\);backdrop-filter:blur\(8px\)\}/,
  `.hero-card{position:relative;border-radius:24px;background:linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.9) 100%);border:1px solid var(--line);box-shadow:0 10px 25px -5px rgba(0,0,0,0.05), 0 4px 10px -5px rgba(0,0,0,0.02);backdrop-filter:blur(12px)}`
);

css = css.replace(
  /\.hero-card:before\{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient\(500px 220px at 92% -10%,#fde68a59,transparent\),radial-gradient\(420px 210px at 3% 112%,#a7f3d066,transparent\);pointer-events:none\}/,
  `.hero-card:before{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(600px 600px at 100% 0%,rgba(59, 130, 246, 0.08),transparent),radial-gradient(400px 400px at 0% 100%,rgba(16, 185, 129, 0.06),transparent);pointer-events:none}`
);

css = css.replace(
  /\.dark \.hero-card\{background:radial-gradient\(ellipse at top left, #123c23, transparent 60%\), radial-gradient\(ellipse at bottom right, #092112, transparent 60%\), var\(--card\);border-color:#2e4a3f;box-shadow:0 8px 30px -10px rgba\(0,0,0,0\.3\)\}/,
  `.dark .hero-card{background:linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.9) 100%);border-color:var(--line);box-shadow:0 10px 25px -5px rgba(0,0,0,0.3)}`
);

fs.writeFileSync('src/styles.css', css);
console.log('Applied styles successfully');
