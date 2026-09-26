const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');
code = code.replace(/@import "tailwindcss";/g, '');
fs.writeFileSync('src/styles.css', '@import "tailwindcss";\n' + code.trim());
