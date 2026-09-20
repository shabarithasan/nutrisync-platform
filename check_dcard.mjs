import fs from 'fs';
const main = fs.readFileSync('src/main.jsx', 'utf8');
const start = main.indexOf('const dCard');
console.log(main.substring(start, start + 500));
