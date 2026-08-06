import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { createAppServer } from './index.mjs';

let server;
let baseUrl;

before(async () => {
  server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test('health check não expõe credenciais e inclui cabeçalhos seguros', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, 'ok');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(JSON.stringify(payload).includes('AMADEUS_API_SECRET'), false);
});

test('rota de API desconhecida retorna JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/inexistente`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Rota não encontrada.' });
});

test('pesquisa rejeita uma rota inválida antes de consultar o provedor', async () => {
  const response = await fetch(`${baseUrl}/api/flights/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin: 'SAO',
      destination: 'SAO',
      departureDate: '2099-09-10',
      returnDate: '2099-09-17',
      travelers: 1,
    }),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /diferentes/);
});
