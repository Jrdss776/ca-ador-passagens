import type { FlightProvider } from '@/services/flight-provider';
import type { FlightOffer, FlightSearchParams } from '@/types/flight';

export class AmadeusFlightProvider implements FlightProvider {
  readonly configured = true;

  async search(params: FlightSearchParams): Promise<FlightOffer[]> {
    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(13_000),
    });

    if (!response.ok) {
      throw new Error(`A busca real respondeu com status ${response.status}.`);
    }

    const payload = (await response.json()) as { offers: FlightOffer[] };
    return payload.offers;
  }
}
