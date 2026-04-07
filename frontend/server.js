const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
    const filePath = path.join(DIST, req.url.split('?')[0]);

    let target = filePath;
    if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
        target = path.join(DIST, 'index.html');
    }

    const ext = path.extname(target);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=31536000');
    fs.createReadStream(target).pipe(res);
}).listen(PORT, '0.0.0.0', () => {
    console.log(`Serving on port ${PORT}`);
});
