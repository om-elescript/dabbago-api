const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const handler = require('../server');

test('health returns 200', async () => {
  const srv = http.createServer(handler).listen(0);
  const r = await fetch(`http://localhost:${srv.address().port}/health`);
  assert.strictEqual(r.status, 200);
  srv.close();
});
