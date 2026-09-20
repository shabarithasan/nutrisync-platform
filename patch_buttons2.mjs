import fs from 'fs';

let html = fs.readFileSync('public/landing.html', 'utf8');

// Replace the old forceLogin function with the setTimeout one
html = html.replace(/window\.forceLogin = function\(e\) \{[\s\S]*?return false;\s*\};/g, `
  window.forceLogin = function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Use setTimeout to run AFTER Framer finishes its internal routing/pushState
    setTimeout(function() {
      window.location.href = window.LOGIN_URL;
    }, 10);
    return false;
  };
`.trim());

fs.writeFileSync('public/landing.html', html);
console.log('Script updated with setTimeout.');
