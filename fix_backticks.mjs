import fs from 'fs';
let code = fs.readFileSync('src/LiveSensors.jsx', 'utf8');
code = code.replace(/\\`/g, '`');
fs.writeFileSync('src/LiveSensors.jsx', code);
