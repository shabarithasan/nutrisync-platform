const fs = require('fs');
let code = fs.readFileSync('src/components/ScannerPanel.tsx', 'utf8');

code = code.replace(/export function ScannerPanel\(\{ m, upd, todayKey, apiBase \}\) \{/, 'import { useLog, todayKey, apiBase } from "../main";\n\nexport function ScannerPanel() {\n  const { m, upd } = useLog();');

fs.writeFileSync('src/components/ScannerPanel.tsx', code);
