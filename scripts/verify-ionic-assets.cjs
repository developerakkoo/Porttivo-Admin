/**
 * Serves the production build from www/ and GETs critical bundles to ensure
 * global CSS and Ionic lazy chunks return HTTP 200 (mirrors DevTools Network checks).
 *
 * Usage: from Porttivo-Admin/, run `npm run build` then `node scripts/verify-ionic-assets.cjs`
 * Or: `npm run verify:assets` (runs build unless SKIP_BUILD=1).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const wwwResolved = path.resolve(www);

function resolveFile(urlPath) {
  const clean = (urlPath || '/').split('?')[0];
  const rel = clean === '/' ? 'index.html' : clean.replace(/^\//, '');
  const full = path.resolve(www, rel);
  if (!full.startsWith(wwwResolved + path.sep) && full !== wwwResolved) {
    return null;
  }
  return full;
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const filePath = resolveFile(req.url || '/');
      if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function fetchUrl(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path: pathname, method: 'GET' },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks) })
        );
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  if (!process.env.SKIP_BUILD) {
    const { spawnSync } = require('child_process');
    const r = spawnSync('npx', ['ng', 'build'], { cwd: root, stdio: 'inherit', shell: true });
    if (r.status !== 0) process.exit(r.status || 1);
  }

  if (!fs.existsSync(path.join(www, 'index.html'))) {
    console.error('Missing www/index.html — run ng build first.');
    process.exit(1);
  }

  const ionicChunks = fs
    .readdirSync(www)
    .filter((f) => f.startsWith('node_modules_ionic_core_') && f.endsWith('.js'));

  const indexHtml = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
  const hrefs = [...indexHtml.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
  const scripts = [...indexHtml.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
  const fromIndex = [...new Set([...hrefs, ...scripts])].filter((p) => !p.startsWith('http'));

  const toPath = (p) => (p.startsWith('/') ? p : `/${p}`);
  const initialPaths = ['/', ...fromIndex.map(toPath)];

  const covered = new Set(fromIndex.map((p) => path.basename(p)));
  let lazySamplePath = null;
  if (ionicChunks.length > 0) {
    const sampleIonicChunk = ionicChunks.includes(
      'node_modules_ionic_core_dist_esm_ion-button_2_entry_js.js'
    )
      ? 'node_modules_ionic_core_dist_esm_ion-button_2_entry_js.js'
      : ionicChunks[0];
    if (!covered.has(sampleIonicChunk)) {
      lazySamplePath = toPath(sampleIonicChunk);
    }
  } else {
    const commonChunk = fs
      .readdirSync(www)
      .find((f) => f.startsWith('common.') && f.endsWith('.js') && !covered.has(f));
    if (commonChunk) {
      lazySamplePath = toPath(commonChunk);
    }
  }

  const pathsToCheck = [...new Set([...initialPaths, ...(lazySamplePath ? [lazySamplePath] : [])])];

  const server = await startServer();
  const port = server.address().port;

  try {
    for (const p of pathsToCheck) {
      const { status, body } = await fetchUrl(port, p);
      if (status !== 200) {
        console.error(`FAIL ${p} → HTTP ${status}`);
        process.exit(1);
      }
      if (p === '/' && body.length < 100) {
        console.error('FAIL index.html too small');
        process.exit(1);
      }
      console.log(`OK   ${p} → ${status} (${body.length} bytes)`);
    }
    const lazyNote =
      ionicChunks.length > 0
        ? `${ionicChunks.length} Ionic core chunk files on disk`
        : lazySamplePath
          ? `lazy sample ${lazySamplePath} (no separate node_modules_ionic_core_* — typical when chunks are hashed/bundled)`
          : 'no extra lazy chunk checked';
    console.log(`\nVerified ${pathsToCheck.length} URLs; ${lazyNote}.`);
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
