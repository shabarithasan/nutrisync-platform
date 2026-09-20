import fs from 'fs';
let code = fs.readFileSync('src/AIChat.jsx', 'utf8');

// Replace any incorrectly escaped backticks
code = code.replace(/\\`Bearer/g, '`Bearer');
code = code.replace(/\}\\\`/g, '}`');
code = code.replace(/\\`/g, '`');

fs.writeFileSync('src/AIChat.jsx', code);
console.log("Fixed backticks");
