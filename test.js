const fs = require('fs'); let code = fs.readFileSync('src/main.jsx', 'utf8'); let m = code.match(/className=\"panel big-chart\"[\s\S]*?<\/section>/); if(m) console.log(m[0]);
