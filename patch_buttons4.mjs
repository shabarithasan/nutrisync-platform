import fs from 'fs';

let html = fs.readFileSync('public/landing.html', 'utf8');

// Strip out ALL variations of the old inline script I added
html = html.replace(/<script>\s*window\.LOGIN_URL[\s\S]*?<\/script>/g, '');
html = html.replace(/<script>\s*\(function\(\)\s*\{\s*var LOGIN_URL[\s\S]*?<\/script>/g, '');

// Also remove any previous patch.js injection just to be clean
html = html.replace(/<script src="\/patch\.js"><\/script>/g, '');

// Add the external script reference
html = html.replace('<head>', '<head>\n<script src="/patch.js"></script>');

fs.writeFileSync('public/landing.html', html);
console.log('landing.html updated to use external patch.js');
