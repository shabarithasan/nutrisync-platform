const fs = require('fs');
const https = require('https');
const path = require('path');

const regex = /\/framerusercontent\.com\/(assets|images)\/([a-zA-Z0-9_-]+)\.(png|jpg|jpeg|webp|svg|woff2)/g;
let matches = [];

function walk(directory) {
  fs.readdirSync(directory).forEach(f => {
    let p = path.join(directory, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.mjs') || p.endsWith('.js') || p.endsWith('.html')) {
      const c = fs.readFileSync(p, 'utf8');
      matches.push(...c.matchAll(regex));
    }
  });
}
walk('public');

const uniqueUrls = [...new Set(matches.map(m => m[0]))];

async function download() {
  for (const urlPath of uniqueUrls) {
    const localPath = path.join(__dirname, 'public', urlPath);
    const localDir = path.dirname(localPath);
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

    if (!fs.existsSync(localPath)) {
      console.log('Downloading ' + urlPath);
      const url = 'https:/' + urlPath;
      await new Promise((resolve) => {
        https.get(url, (res) => {
          if (res.statusCode === 200) {
            const file = fs.createWriteStream(localPath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
          } else {
            resolve();
          }
        }).on('error', () => resolve());
      });
    }
  }
}
download().then(() => console.log('Done downloading ALL assets.'));
