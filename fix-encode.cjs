const fs = require('fs');
const cp1252 = {
  0x80: '\u20AC', 0x82: '\u201A', 0x83: '\u0192', 0x84: '\u201E', 0x85: '\u2026',
  0x86: '\u2020', 0x87: '\u2021', 0x88: '\u02C6', 0x89: '\u2030', 0x8A: '\u0160',
  0x8B: '\u2039', 0x8C: '\u0152', 0x8E: '\u017D', 0x91: '\u2018', 0x92: '\u2019',
  0x93: '\u201C', 0x94: '\u201D', 0x95: '\u2022', 0x96: '\u2013', 0x97: '\u2014',
  0x98: '\u02DC', 0x99: '\u2122', 0x9A: '\u0161', 0x9B: '\u203A', 0x9C: '\u0153',
  0x9E: '\u017E', 0x9F: '\u0178'
};
const toByte = new Map();
for (const b of Object.keys(cp1252)) toByte.set(cp1252[b], parseInt(b));
function cp1252Decode(buf) { let s = ''; for (const byte of buf) s += cp1252[byte] || (byte >= 0xA0 || byte < 0x80 ? String.fromCharCode(byte) : '\uFFFD'); return s; }
function fix(path) {
  const orig = fs.readFileSync(path);
  const mojibake = cp1252Decode(orig);
  const bytes = [];
  for (const ch of mojibake) {
    const b = toByte.get(ch);
    if (b !== undefined) bytes.push(b);
    else {
      const code = ch.codePointAt(0);
      if (code < 0x80 || (code >= 0xA0 && code <= 0xFF)) bytes.push(code);
      else throw new Error(path + ': unmappable char U+' + code.toString(16) + ' at byte ' + bytes.length);
    }
  }
  const fixed = Buffer.from(bytes).toString('utf8');
  if (fixed.includes('\uFFFD')) throw new Error(path + ': fixed output has U+FFFD');
  if (!fixed.includes('👋')) throw new Error(path + ': emoji check failed');
  fs.writeFileSync(path, fixed, 'utf8');
  console.log('FIXED', path, orig.length, '->', fixed.length);
}
fix('src/main.jsx');
const css = fs.readFileSync('src/styles.css').toString('utf8');
const nonAscii = [...css].filter(c => c.codePointAt(0) > 127);
console.log('styles.css non-ascii chars:', nonAscii.length);
