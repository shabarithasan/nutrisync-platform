const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');

code = code.replace(/<Overview profile=\{profile\} setPage=\{setPage\}\/>/g, '<OverviewEnhanced profile={profile} today={m[todayKey()]||{}} m={m} upd={upd} todayKey={todayKey} setPage={setPage} />');
code = code.replace(/<Reports profile=\{profile\}\/>/g, '<ReportsEnhanced />');

fs.writeFileSync('src/main.jsx', code);
