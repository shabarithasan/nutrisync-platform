const fs = require('fs');
let code = fs.readFileSync('src/styles.css', 'utf8');
code = code.replace('.content{width:calc(100% - 255px);margin-left:255px;max-width:1510px;padding:37px 5.5% 70px}', '.content{width:100%;margin-left:0;max-width:1510px;margin: 0 auto;padding:37px 5.5% 120px}');
code = code.replace(/padding-left:\s*\d+px\s*!important;/g, '');
fs.writeFileSync('src/styles.css', code);

