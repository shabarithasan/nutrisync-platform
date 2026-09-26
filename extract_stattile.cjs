const fs = require('fs');
const appCode = fs.readFileSync('C:\\Users\\shaba\\Downloads\\enhance-login-page-design (1)\\src\\App.tsx', 'utf8');

const statTileMatch = appCode.match(/function StatTile\(\{[\s\S]*?return \([\s\S]*?\}\);\n\}/);
if (statTileMatch) {
  let code = `import React from 'react';\nimport { cn } from '../utils/cn';\n\n` + statTileMatch[0];
  code = code.replace(/function StatTile/, 'export function StatTile');
  code = code.replace(/: \{[^}]+\}/g, ''); // remove typescript types
  fs.writeFileSync('src/components/StatTile.tsx', code);
}
