import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const locationAliases = new Map([
  ['SAO PAULO', 'SAO'],
  ['SÃO PAULO', 'SAO'],
  ['RIO DE JANEIRO', 'RIO'],
  ['BELO HORIZONTE', 'BHZ'],
  ['BRASILIA', 'BSB'],
  ['BRASÍLIA', 'BSB'],
  ['RECIFE', 'REC'],
]);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};
const rateWindows = new Map();

function locationCode(value) {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();
  return (
    locationAliases.get(normalized) ??
    (/^[A-Z]{3}$/.test(normalized) ? normalized : null)
  );
}

function validateSearch(input, origin, destination) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const travelers = Number(input.travelers);

  if (!origin || !destination)
    return 'Origem e destino precisam usar códigos IATA válidos.';
  if (origin === destination)
    return 'Origem e destino precisam ser diferentes.';
  if (
    !datePattern.test(input.departureDate) ||
    !datePattern.test(input.returnDate)
  ) {
    return 'As datas precisam usar o formato AAAA-MM-DD.';
  }
  if (input.departureDate < new Date().toISOString().split('T')[0]) {
    return 'A data de ida não pode estar no passado.';
  }
  if (input.returnDate < input.departureDate) {
    return 'A data de volta deve ser igual ou posterior à ida.';
  }
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 9) {
    return 'A quantidade de viajantes deve estar entre 1 e 9.';
  }
  return null;
}

function securityHeaders(contentType) {
  return {
    'Content-Type': contentType,
    'Content-Security-Policy':
      "default-src 'self'; connect-src 'self' https://api.open-meteo.com https://geocoding-api.open-meteo.com https://api.frankfurter.app; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function send(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    ...securityHeaders('application/json; charset=utf-8'),
    'Cache-Control': 'no-store',
    ...extraHeaders,
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

function isRateLimited(request) {
  const address = request.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const current = rateWindows.get(address);
  if (!current || current.resetAt <= now) {
    rateWindows.set(address, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 60;
}

async function serveStatic(request, response) {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) return false;

  const pathname = decodeURIComponent(
    new URL(request.url ?? '/', 'http://localhost').pathname,
  );
  const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
  let filePath = resolve(distDirectory, requestedPath);
  if (!filePath.startsWith(`${resolve(distDirectory)}${sep}`)) {
    send(response, 400, { error: 'Caminho inválido.' });
    return true;
  }

  try {
    if (!(await stat(filePath)).isFile()) throw new Error('Not a file');
  } catch {
    if (extname(requestedPath)) return false;
    filePath = resolve(distDirectory, 'index.html');
  }

  if (!existsSync(filePath)) return false;
  const extension = extname(filePath);
  response.writeHead(200, {
    ...securityHeaders(mimeTypes[extension] ?? 'application/octet-stream'),
    'Cache-Control':
      extension === '.html'
        ? 'no-cache'
        : 'public, max-age=31536000, immutable',
  });
  if (request.method === 'HEAD') return response.end();
  createReadStream(filePath).pipe(response);
  return true;
}

export function createAppServer() {
  return createServer(async (request, response) => {
    request.setTimeout(15_000);

    if (request.url?.startsWith('/api/') && isRateLimited(request)) {
      return send(
        response,
        429,
        { error: 'Muitas solicitações. Tente novamente em instantes.' },
        { 'Retry-After': '60' },
      );
    }

    if (request.method === 'GET' && request.url === '/api/health') {
      const configured = Boolean(getAmadeusConfig());
      return send(response, 200, {
        status: 'ok',
        flightProvider: configured ? 'amadeus' : 'mock-fallback',
        uptimeSeconds: Math.round(process.uptime()),
      });
    }

    if (
      request.method === 'GET' &&
      request.url?.startsWith('/api/locations?')
    ) {
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

    if (request.method === 'POST' && request.url === '/api/flights/search') {
      try {
        const input = await readJson(request);
        const origin = locationCode(input.origin);
        const destination = locationCode(input.destination);
        const validationError = validateSearch(input, origin, destination);
        if (validationError)
          return send(response, 400, { error: validationError });

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
    }

    if (request.url?.startsWith('/api/')) {
      return send(response, 404, { error: 'Rota não encontrada.' });
    }

    if (await serveStatic(request, response)) return;
    return send(response, 404, { error: 'Aplicação não encontrada.' });
  });
}

function startServer() {
  const port = Number(process.env.PORT || process.env.API_PORT || 8787);
  const host = process.env.API_HOST || '127.0.0.1';
  const server = createAppServer();
  server.listen(port, host, () => {
    console.log(`Caçador de Passagens disponível em http://${host}:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} recebido; encerrando servidor.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

const entryPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (entryPath === fileURLToPath(import.meta.url)) startServer();
