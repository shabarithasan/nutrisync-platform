const fs = require('fs');
let code = fs.readFileSync('server/src/index.js', 'utf8');
code = code.replace(/if \(req\.method === 'GET' && !req\.path\.startsWith\('\/api\/'\)\) \{\s*return res\.sendFile\(path\.join\(distPath, 'index\.html'\)\);\s*\}/, 
`if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      return res.sendFile(path.join(distPath, 'index.html'));
    }`);
fs.writeFileSync('server/src/index.js', code);
