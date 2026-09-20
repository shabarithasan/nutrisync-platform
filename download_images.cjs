const fs = require('fs');
const https = require('https');
const path = require('path');

const html = fs.readFileSync('public/landing.html', 'utf8');
const regex = /\/framerusercontent\.com\/images\/([a-zA-Z0-9_-]+)\.(png|jpg|jpeg|webp|svg)/g;
const matches = [...html.matchAll(regex)];

const uniqueUrls = [...new Set(matches.map(m => m[0]))];
const dir = path.join(__dirname, 'public/framerusercontent.com/images');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

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
            console.log('Failed: ' + res.statusCode + ' ' + url);
            resolve();
          }
        }).on('error', (err) => {
          console.log('Error: ' + err.message);
          resolve();
        });
      });
    }
  }
}
download().then(() => console.log('Done downloading html images.'));
