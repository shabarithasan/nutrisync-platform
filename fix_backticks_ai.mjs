import fs from 'fs';
let code = fs.readFileSync('src/AIChat.jsx', 'utf8');
code = code.replace(/\\`/g, '`');
fs.writeFileSync('src/AIChat.jsx', code);
