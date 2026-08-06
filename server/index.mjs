import { createServer } from 'node:http';

import {
  getAmadeusConfig,
  searchAmadeusFlights,
  searchAmadeusLocations,
} from './amadeus-client.mjs';

try {
  process.loadEnvFile?.('.env');
} catch {
  // O arquivo .env é opcional; sem ele, o frontend usa o fallback demonstrativo.
}

const port = Number(process.env.API_PORT || 8787);
const locationAliases = new Map([
  ['SAO PAULO', 'SAO'],
  ['SÃO PAULO', 'SAO'],
  ['RIO DE JANEIRO', 'RIO'],
  ['BELO HORIZONTE', 'BHZ'],
  ['BRASILIA', 'BSB'],
  ['BRASÍLIA', 'BSB'],
  ['RECIFE', 'REC'],
]);

function locationCode(value) {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();
  return (
    locationAliases.get(normalized) ??
    (/^[A-Z]{3}$/.test(normalized) ? normalized : null)
  );
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new Error('Corpo da requisição excede o limite.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') {
    const configured = Boolean(getAmadeusConfig());
    return send(response, 200, {
      status: 'ok',
      flightProvider: configured ? 'amadeus' : 'mock-fallback',
    });
  }

  if (request.method === 'GET' && request.url?.startsWith('/api/locations?')) {
    const keyword = new URL(request.url, 'http://localhost').searchParams
      .get('keyword')
      ?.trim();
    if (!keyword || keyword.length < 2)
      return send(response, 200, { locations: [] });

    const config = getAmadeusConfig();
    if (!config) return send(response, 200, { locations: [] });

    try {
      const locations = await searchAmadeusLocations(keyword, config);
      return send(response, 200, { locations });
    } catch (error) {
      console.error(
        'Location search failed:',
        error instanceof Error ? error.message : error,
      );
      return send(response, 200, { locations: [] });
    }
  }

  if (request.method !== 'POST' || request.url !== '/api/flights/search') {
    return send(response, 404, { error: 'Rota não encontrada.' });
  }

  try {
    const input = await readJson(request);
    const origin = locationCode(input.origin);
    const destination = locationCode(input.destination);
    if (!origin || !destination || !input.departureDate || !input.returnDate) {
      return send(response, 400, {
        error: 'Origem, destino e datas são obrigatórios.',
      });
    }

    const config = getAmadeusConfig();
    if (!config)
      return send(response, 503, {
        error: 'Amadeus não configurado; use o fallback.',
      });

    const offers = await searchAmadeusFlights(
      { ...input, origin, destination },
      config,
    );
    return send(response, 200, { source: 'amadeus', offers });
  } catch (error) {
    console.error(
      'Flight search failed:',
      error instanceof Error ? error.message : error,
    );
    return send(response, 502, {
      error: 'Não foi possível consultar o provedor de voos.',
    });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Flight API listening on http://127.0.0.1:${port}`);
});
