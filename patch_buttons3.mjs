import fs from 'fs';

let html = fs.readFileSync('public/landing.html', 'utf8');

html = html.replace(/function patchAllButtons\(\) \{/, `
  function patchAllButtons() {
    console.log("patchAllButtons executing...");
`);

fs.writeFileSync('public/landing.html', html);
console.log('Added console log to patchAllButtons');
