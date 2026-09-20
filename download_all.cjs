const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public/framerusercontent.com/images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const regex = /\/framerusercontent\.com\/images\/([a-zA-Z0-9_-]+)\.(png|jpg|jpeg|webp|svg)/g;
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
    const fileName = path.basename(urlPath);
    const localPath = path.join(dir, fileName);
    if (!fs.existsSync(localPath)) {
      console.log('Downloading ' + fileName);
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
download().then(() => console.log('Done downloading all images.'));
