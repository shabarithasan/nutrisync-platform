const fs = require('fs');
const appCode = fs.readFileSync('C:\\Users\\shaba\\Downloads\\enhance-login-page-design (1)\\src\\App.tsx', 'utf8');
const lines = appCode.split('\n');
const start = lines.findIndex(l => l.includes('function StatTile'));
const end = lines.findIndex((l, i) => i > start && l === '}');
let code = lines.slice(start, end + 1).join('\n');
let finalCode = `import React from 'react';\nimport { cn } from '../utils/cn';\n\n` + code;
finalCode = finalCode.replace(/function StatTile/, 'export function StatTile');
finalCode = finalCode.replace(/:\s*\{[\s\S]*?\}\)\s*\{/, ') {'); // strip type definition for props
fs.writeFileSync('src/components/StatTile.tsx', finalCode);
