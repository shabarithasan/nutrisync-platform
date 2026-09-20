import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

// 1. Replace :root
const oldRoot = `:root{--bg:#070707;--card:#121212;--ink:#ffffff;--muted:#8c8c8c;--line:#262626;--green:#ff8000;--mint:#ff80001a;--cream:#0c0c0c;--shadow:0 12px 38px #00000099}`;
const newRoot = `:root{--bg:#f9fafb;--card:#ffffff;--ink:#1f2937;--muted:#6b7280;--line:#e5e7eb;--green:#ff8000;--mint:#ff80001a;--cream:#f3f4f6;--shadow:0 4px 20px -2px #00000010,0 4px 6px -1px #0000000a;--side-bg:#ffffff;--side-shadow:6px 0 32px -14px #00000015;--side-hover:#f3f4f6;--side-text-hover:#1f2937;--side-nav-text:#6b7280;--tip-bg:#fffbeb;--tip-border:#fde68a;--tip-text:#b45309}
.dark{--bg:#070707;--card:#121212;--ink:#ffffff;--muted:#8c8c8c;--line:#262626;--green:#ff8000;--mint:#ff80001a;--cream:#0c0c0c;--shadow:0 12px 38px #00000099;--side-bg:linear-gradient(180deg,#123c23,#0c2b18 58%,#092112);--side-shadow:6px 0 32px -14px #00000066;--side-hover:#ffffff14;--side-text-hover:#fff;--side-nav-text:#8c8c8c;--tip-bg:linear-gradient(135deg,#166534,#000000);--tip-border:#ff800038;--tip-text:#fff}`;
css = css.replace(oldRoot, newRoot);

// 2. Replace .side
css = css.replace(
  /\.side\{background:linear-gradient\(180deg,#123c23,#0c2b18 58%,#092112\);width:264px;box-shadow:6px 0 32px -14px #00000066\}/g,
  '.side{background:var(--side-bg);width:264px;box-shadow:var(--side-shadow)}'
);
css = css.replace(
  /@media\(max-width:720px\)\{\.side\{background:#123c23f0;backdrop-filter:blur\(14px\);-webkit-backdrop-filter:blur\(14px\)\}\}/g,
  '@media(max-width:720px){.side{background:var(--side-bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}}'
);

// 3. Replace .nav button text color and hover
css = css.replace(
  /\.nav button\{position:relative;transition:background \.2s,color \.2s,transform \.15s,box-shadow \.2s\}/g,
  '.nav button{position:relative;transition:background .2s,color .2s,transform .15s,box-shadow .2s;color:var(--side-nav-text)}'
);
css = css.replace(
  /\.nav button:hover:not\(\.selected\)\{background:#ffffff14;color:#fff;transform:translateX\(3px\)\}/g,
  '.nav button:hover:not(.selected){background:var(--side-hover);color:var(--side-text-hover);transform:translateX(3px)}'
);

// 4. Replace .tip
css = css.replace(
  /\.tip\{background:linear-gradient\(135deg,#166534,#000000\);border:1px solid #ff800038\}/g,
  '.tip{background:var(--tip-bg);border:1px solid var(--tip-border);color:var(--tip-text)}'
);

// 5. Replace .hero-card light and dark mode colors
css = css.replace(
  /\.hero-card\{position:relative;border-radius:24px;background:linear-gradient\(120deg,#111111,#ff80001a 55%,#cffafe\);border:1px solid #ffffffcc;box-shadow:0 26px 52px -26px #0000004d\}/g,
  '.hero-card{position:relative;border-radius:24px;background:linear-gradient(120deg,var(--card),#ff80001a 55%,#cffafe);border:1px solid var(--line);box-shadow:var(--shadow)}'
);
// Replace the other instance if any
css = css.replace(
  /\.hero-card\{background:radial-gradient\(640px 300px at 88% 0%,#ff8000334d,transparent\),linear-gradient\(135deg,#111111,#ff80001a\);box-shadow:0 16px 34px -18px #00000033\}/g,
  '.hero-card{background:radial-gradient(640px 300px at 88% 0%,#ff800033,transparent),linear-gradient(135deg,var(--card),#ff80001a);box-shadow:var(--shadow)}'
);

// Remove the hardcoded .dark .hero-card since the background now uses var(--card) which automatically toggles!
// But wait, it had a different gradient `#152e25`. We can just keep it or remove it and let var(--card) do the job.
// Let's replace the .dark .hero-card to use the dark gradient but only on .dark
css = css.replace(
  /\.dark \.hero-card\{background:linear-gradient\(120deg,#152e25,#173a2b 60%,#123a33\);border-color:#2e4a3f\}/g,
  '.dark .hero-card{background:linear-gradient(120deg,#152e25,#173a2b 60%,#123a33);border-color:#2e4a3f}' // actually no change needed here if it's specific to dark
);

fs.writeFileSync('src/styles.css', css);
console.log("Updated styles.css for full theme toggle!");
