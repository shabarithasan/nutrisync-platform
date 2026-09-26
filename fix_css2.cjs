const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');

const fontsImportMatch = code.match(/@import url\('[^']+'\);\s*/g);
if (fontsImportMatch) {
  for (const m of fontsImportMatch) {
    code = code.replace(m, '');
  }
  code = fontsImportMatch.join('\n') + '\n' + code;
}

// Make sure tailwindcss is truly the FIRST line before anything else
code = code.replace(/@import "tailwindcss";\s*/g, '');
code = '@import "tailwindcss";\n' + code;

fs.writeFileSync('src/styles.css', code);
