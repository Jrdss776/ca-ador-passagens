import { brazilianAirports } from '@/data/airports';
import type { FlightSearchParams } from '@/types/flight';

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleUpperCase('pt-BR');
}

export function resolveLocationCode(value: string) {
  const normalized = normalizeText(value);
  if (/^[A-Z]{3}$/.test(normalized)) return normalized;

  const matches = brazilianAirports.filter((airport) => {
    return (
      normalizeText(airport.city) === normalized ||
      normalizeText(airport.name) === normalized
    );
  });
  const cityOption = matches.find(
    (airport) => airport.name === 'Todos os aeroportos',
  );
  return cityOption?.code ?? matches[0]?.code ?? null;
}

export function validateFlightSearch(params: FlightSearchParams) {
  const origin = resolveLocationCode(params.origin);
  const destination = resolveLocationCode(params.destination);

  if (!origin || !destination) {
    return {
      ok: false,
      error: 'Escolha uma cidade ou um código IATA disponível nas sugestões.',
    } as const;
  }
  if (origin === destination) {
    return {
      ok: false,
      error: 'Origem e destino precisam ser diferentes.',
    } as const;
  }

  const today = new Date().toISOString().split('T')[0];
  if (params.departureDate < today) {
    return {
      ok: false,
      error: 'A data de ida não pode estar no passado.',
    } as const;
  }
  if (params.returnDate < params.departureDate) {
    return {
      ok: false,
      error: 'A data de volta deve ser igual ou posterior à data de ida.',
    } as const;
  }
  if (
    !Number.isInteger(params.travelers) ||
    params.travelers < 1 ||
    params.travelers > 9
  ) {
    return {
      ok: false,
      error: 'Informe entre 1 e 9 viajantes.',
    } as const;
  }

  return {
    ok: true,
    value: { ...params, origin, destination },
  } as const;
}
