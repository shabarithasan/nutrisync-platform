const fs = require('fs');
let code = fs.readFileSync('src/main.jsx', 'utf8');

// Replace FoodScan function definition completely
code = code.replace(/function FoodScan\(\{profile\}\)\{[\s\S]*?<canvas ref=\{canvasRef\} style=\{\{display:'none'\}\}\/><\/>\);\}/m, '');

if (!code.includes('ScannerPanel')) {
  code = code.replace(/import \{ LoginForm \} from '\.\/components\/LoginForm';/, "import { LoginForm } from './components/LoginForm';\nimport { ScannerPanel } from './components/ScannerPanel';");
}

code = code.replace(/<FoodScan profile=\{profile\} \/>/g, '<div className="mx-auto max-w-2xl mt-8"><ScannerPanel m={m} upd={upd} todayKey={todayKey} apiBase={apiBase} /></div>');

fs.writeFileSync('src/main.jsx', code);
