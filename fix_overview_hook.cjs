const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');

// Export useLog and todayKey
code = code.replace(/function useLog\(\)/, 'export function useLog()');
code = code.replace(/const todayKey=\(\)/, 'export const todayKey=()');

// Remove the inline m, upd from App
code = code.replace(/<OverviewEnhanced profile=\{profile\} today=\{m\\[todayKey\(\)\\]\|\|\{\}\} m=\{m\} upd=\{upd\} todayKey=\{todayKey\} setPage=\{setPage\} \/>/g, '<OverviewEnhanced profile={profile} setPage={setPage} />');

fs.writeFileSync('src/main.jsx', code);

