// Post-cutover monitoring script (frontend + critical backend endpoints)
// Usage: node post_cutover_monitor.js
const https = require('https');

const CHECKS = [
  { name: 'frontend', url: 'https://speed-pro.vercel.app/inicio', expected: [200] },
  { name: 'roles', url: 'https://apispeed-i7gp.onrender.com/api/roles', expected: [200] },
  { name: 'taller', url: 'https://apispeed-i7gp.onrender.com/api/taller', expected: [200] },
  { name: 'sucursales', url: 'https://apispeed-i7gp.onrender.com/api/sucursales', expected: [200] },
  { name: 'servicios', url: 'https://apispeed-i7gp.onrender.com/api/servicios', expected: [200] },
  { name: 'marcas', url: 'https://apispeed-i7gp.onrender.com/api/marcas', expected: [200] },
  { name: 'modelos', url: 'https://apispeed-i7gp.onrender.com/api/modelos', expected: [200] },
  {
    name: 'auth_login',
    url: 'https://apispeed-i7gp.onrender.com/api/auth/login?correo=admin%40speedpro.com&password=123456',
    expected: [200],
  },
];

function get(url) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const req = https.get(url, { timeout: 20000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body,
          latencyMs: Date.now() - started,
        });
      });
    });

    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

async function run() {
  const results = [];

  for (const check of CHECKS) {
    try {
      const res = await get(check.url);
      const ok = check.expected.includes(res.status);
      results.push({
        name: check.name,
        status: res.status,
        latencyMs: res.latencyMs,
        ok,
      });
    } catch (error) {
      results.push({
        name: check.name,
        status: 'ERR',
        latencyMs: null,
        ok: false,
        error: error.message,
      });
    }
  }

  console.table(results);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log('POST-CUTOVER MONITOR: FAIL');
    console.log('Failed checks:', failed.map((f) => f.name).join(', '));
    process.exitCode = 1;
    return;
  }

  const worstLatency = Math.max(...results.map((r) => r.latencyMs || 0));
  console.log('POST-CUTOVER MONITOR: PASS');
  console.log(`Worst latency: ${worstLatency} ms`);
}

run().catch((error) => {
  console.error('Monitor execution failed:', error.message);
  process.exit(1);
});
