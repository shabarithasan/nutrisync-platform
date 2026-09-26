const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');
code = code.replace(/<LoginForm onAuth=\{onAuth\} \/>/g, '<LoginForm onAuth={onAuth} apiBase={apiBase} />');
fs.writeFileSync('src/main.jsx', code);

