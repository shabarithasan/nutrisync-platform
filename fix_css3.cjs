const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');
const lines = code.split('\n');
const fontLineIndex = lines.findIndex(l => l.includes('fonts.googleapis.com'));
const tailwindIndex = lines.findIndex(l => l.includes('"tailwindcss"'));
if (fontLineIndex > -1 && tailwindIndex > -1 && tailwindIndex < fontLineIndex) {
  const temp = lines[tailwindIndex];
  lines[tailwindIndex] = lines[fontLineIndex];
  lines[fontLineIndex] = temp;
  fs.writeFileSync('src/styles.css', lines.join('\n'));
}
