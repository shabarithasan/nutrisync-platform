const fs = require('fs');
let code = fs.readFileSync('src/components/LoginForm.jsx', 'utf8');
code = code.replace(/import type \{.*?\} from \'.*?\'\;/g, '');
code = code.replace(/import type .*?;/g, '');
code = code.replace(/: React\.ReactNode/g, '');
code = code.replace(/e: React\.FormEvent/g, 'e');
code = code.replace(/e: FormEvent/g, 'e');
fs.writeFileSync('src/components/LoginForm.jsx', code);

let cnCode = fs.readFileSync('src/utils/cn.js', 'utf8');
cnCode = cnCode.replace(/import \{ type ClassValue, clsx \} from "clsx";/g, 'import { clsx } from "clsx";');
cnCode = cnCode.replace(/export function cn\(\.\.\.inputs: ClassValue\[\]\) \{/g, 'export function cn(...inputs) {');
fs.writeFileSync('src/utils/cn.js', cnCode);
