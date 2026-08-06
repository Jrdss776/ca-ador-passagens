import { describe, expect, it, vi } from 'vitest';

import {
  resolveLocationCode,
  validateFlightSearch,
} from '@/lib/search-validation';
import type { FlightSearchParams } from '@/types/flight';

const validSearch: FlightSearchParams = {
  origin: 'São Paulo',
  destination: 'REC',
  departureDate: '2099-09-10',
  returnDate: '2099-09-17',
  travelers: 1,
  cabinClass: 'economy',
  flexibleDates: false,
};

describe('resolveLocationCode', () => {
  it('preserva códigos IATA válidos', () => {
    expect(resolveLocationCode(' gru ')).toBe('GRU');
  });

  it('resolve cidades sem depender de acentos', () => {
    expect(resolveLocationCode('Sao Paulo')).toBe('SAO');
  });

  it('recusa local desconhecido', () => {
    expect(resolveLocationCode('Cidade inexistente')).toBeNull();
  });
});

describe('validateFlightSearch', () => {
  it('normaliza uma pesquisa válida', () => {
    expect(validateFlightSearch(validSearch)).toMatchObject({
      ok: true,
      value: { origin: 'SAO', destination: 'REC' },
    });
  });

  it('recusa origem e destino iguais', () => {
    expect(
      validateFlightSearch({ ...validSearch, destination: 'SAO' }),
    ).toMatchObject({
      ok: false,
      error: expect.stringContaining('diferentes'),
    });
  });

  it('recusa volta anterior à ida', () => {
    expect(
      validateFlightSearch({ ...validSearch, returnDate: '2099-09-09' }),
    ).toMatchObject({ ok: false, error: expect.stringContaining('posterior') });
  });

  it('recusa ida no passado', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-06T12:00:00Z'));
    expect(
      validateFlightSearch({ ...validSearch, departureDate: '2026-08-05' }),
    ).toMatchObject({ ok: false, error: expect.stringContaining('passado') });
    vi.useRealTimers();
  });

  it('recusa quantidade inválida de viajantes', () => {
    expect(
      validateFlightSearch({ ...validSearch, travelers: 10 }),
    ).toMatchObject({ ok: false, error: expect.stringContaining('1 e 9') });
  });
});
