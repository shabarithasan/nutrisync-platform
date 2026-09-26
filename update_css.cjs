const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');
code = code.replace(/body \{\s*font-family: var\(--font-sans\);\s*background: var\(--color-cream\);\s*color: var\(--color-ink\);\s*-webkit-font-smoothing: antialiased;\s*text-rendering: optimizeLegibility;\s*\}/g, '');
code = code.replace(/html,\s*body \{\s*height: 100%;\s*\}/g, '');
fs.writeFileSync('src/styles.css', code);

