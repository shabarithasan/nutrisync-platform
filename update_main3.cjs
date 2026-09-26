const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');

if (!code.includes('OverviewEnhanced')) {
  code = code.replace(/import \{ ScannerPanel \} from '\.\/components\/ScannerPanel';/, "import { ScannerPanel } from './components/ScannerPanel';\nimport { OverviewEnhanced } from './components/OverviewEnhanced';\nimport { ReportsEnhanced } from './components/ReportsEnhanced';");
}

code = code.replace(/<Overview profile=\{profile\} \/>/g, '<OverviewEnhanced profile={profile} today={m[tk]||{}} m={m} upd={upd} todayKey={todayKey} setPage={setPage} />');
code = code.replace(/<Reports \/>/g, '<ReportsEnhanced />');

fs.writeFileSync('src/main.jsx', code);
