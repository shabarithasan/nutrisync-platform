
const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');
code = code.replace(/<input\s+type=\"number\"/g, '<input ref={el => { if(el && !el.dataset.focused) { el.focus(); el.dataset.focused = true; } }} type=\"number\"');
fs.writeFileSync('src/main.jsx', code);

