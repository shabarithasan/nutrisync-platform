import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

// Replace global .auth-page background
css = css.replace(
  /\.auth-page\{position:relative;overflow:hidden;background:linear-gradient\(135deg,#111111 0%,#0a0a0a 45%,#141414 100%\)\}/,
  '.auth-page{position:relative;overflow:hidden;background:#f9fafb}'
);

// Replace mobile .auth-page background
css = css.replace(
  /\.auth-page\{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#050505;position:relative;overflow:hidden\}/,
  '.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f9fafb;position:relative;overflow:hidden}'
);

// Replace mobile .auth-card
css = css.replace(
  /\.auth-card\{position:relative;z-index:1;width:min\(100%,400px\);background:#0a0a0acc;backdrop-filter:blur\(30px\);-webkit-backdrop-filter:blur\(30px\);border:1px solid #ffffff14;border-radius:24px;padding:48px 40px;box-shadow:0 30px 70px -20px #000000,inset 0 1px 0 #ffffff0a;animation:fadeUp \.6s cubic-bezier\(\.22,\.68,0,1\.02\);text-align:center\}/,
  '.auth-card{position:relative;z-index:1;width:min(100%,400px);background:#ffffff;border:1px solid #e5e7eb;border-radius:24px;padding:48px 40px;box-shadow:0 20px 40px -10px #00000010,0 4px 10px #00000005;animation:fadeUp .6s cubic-bezier(.22,.68,0,1.02);text-align:center}'
);

// Replace global .auth-card
css = css.replace(
  /\.auth-card\{position:relative;z-index:1;width:min\(100%,420px\);background:#ffffffeb;backdrop-filter:blur\(18px\);-webkit-backdrop-filter:blur\(18px\);border:1px solid #ffffffc4;border-radius:24px;padding:38px 34px;box-shadow:0 30px 70px -20px #00000038,0 4px 18px #00000014;animation:fadeUp \.6s cubic-bezier\(\.22,\.68,0,1\.02\)\}/,
  '.auth-card{position:relative;z-index:1;width:min(100%,420px);background:#ffffff;border:1px solid #e5e7eb;border-radius:24px;padding:38px 34px;box-shadow:0 20px 40px -10px #00000010,0 4px 10px #00000005;animation:fadeUp .6s cubic-bezier(.22,.68,0,1.02)}'
);

// Replace h1 color inside auth-card
css = css.replace(
  /\.auth-card h1\{font-family:'Space Grotesk',sans-serif;margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;letter-spacing:-1px\}/,
  '.auth-card h1{font-family:\'Space Grotesk\',sans-serif;margin:0 0 8px;color:#1f2937;font-size:28px;font-weight:700;letter-spacing:-1px}'
);

// Replace p color
css = css.replace(
  /\.auth-card p\{color:#8c8c8c;font-size:13px;margin:0 0 28px\}/,
  '.auth-card p{color:#6b7280;font-size:13px;margin:0 0 28px}'
);

// Replace input styles
css = css.replace(
  /\.auth-card input\{width:100%;margin-bottom:14px;padding:14px 16px;border:1px solid #333;border-radius:12px;font-size:14px;color:#fff;background:#141414;box-sizing:border-box;transition:border-color \.15s,box-shadow \.15s\}/,
  '.auth-card input{width:100%;margin-bottom:14px;padding:14px 16px;border:1px solid #d1d5db;border-radius:12px;font-size:14px;color:#1f2937;background:#ffffff;box-sizing:border-box;transition:border-color .15s,box-shadow .15s}'
);

// Replace input focus
css = css.replace(
  /\.auth-card input:focus\{outline:none;border-color:#ff8000;background:#1a1a1a;box-shadow:0 0 0 3px #ff800026\}/,
  '.auth-card input:focus{outline:none;border-color:#ff8000;background:#ffffff;box-shadow:0 0 0 3px #ff800026}'
);

// Replace global input background (if any left)
css = css.replace(
  /\.auth-card input\{border-radius:12px;background:#f8fafc\}/,
  '.auth-card input{border-radius:12px;background:#ffffff;border:1px solid #d1d5db}'
);

// Replace toggle button
css = css.replace(
  /\.pw-toggle\{position:absolute!important;right:6px;top:50%;transform:translateY\(-50%\);width:auto!important;margin:0!important;padding:6px 10px!important;background:transparent;border:none;color:#ff8000;font-size:12px;font-weight:700;cursor:pointer\}/,
  '.pw-toggle{position:absolute!important;right:6px;top:50%;transform:translateY(-50%);width:auto!important;margin:0!important;padding:6px 10px!important;background:transparent;border:none;color:#ff8000;font-size:12px;font-weight:700;cursor:pointer}'
);

fs.writeFileSync('src/styles.css', css);
console.log("Replaced CSS values.");
