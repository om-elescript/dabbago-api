const http = require('http');
const PORT = process.env.PORT || 8080;
const VERSION = process.env.VERSION || 'v1';
const menu = [
  { dish: 'Misal', price: 80 },
  { dish: 'Poha', price: 40 },
  { dish: 'Vada pav', price: 20 },
];
const log = (severity, message, extra = {}) =>
  console.log(JSON.stringify({ severity, message, ...extra }));

function handler(req, res) {
  if (req.url === '/health') {
    if (process.env.BROKEN === 'true') { res.writeHead(500); return res.end('broken'); }
    res.writeHead(200); return res.end('ok');
  }
  if (req.url === '/menu') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ version: VERSION, menu }));
  }
  if (req.url.startsWith('/orders/')) {
    const order_id = req.url.split('/')[2];
    if (order_id === '8812') {
      log('ERROR', 'payment declined', { order_id, error_code: 'CARD_DECLINED' });
      res.writeHead(402); return res.end('payment declined');
    }
    log('INFO', 'order placed', { order_id });
    res.writeHead(200); return res.end(`order ${order_id} placed`);
  }
  if (req.url === '/slow') {
    return setTimeout(() => { res.writeHead(200); res.end('slow ok'); }, 1500);
  }
  if (req.url === '/crash') { throw new Error('Unhandled crash in checkout'); }
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`<h1>DabbaGo API ${VERSION}</h1>`);
  }
  res.writeHead(404); res.end('not found');
}

module.exports = handler;
if (require.main === module) {
  http.createServer((req, res) => {
    try { handler(req, res); }
    catch (e) { console.error(e.stack); res.writeHead(500); res.end('error'); }
  }).listen(PORT, () => log('INFO', `DabbaGo API ${VERSION} listening on ${PORT}`));
}
