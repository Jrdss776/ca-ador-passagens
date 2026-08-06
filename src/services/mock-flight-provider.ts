import { mockFlightTemplates } from '@/data/mock-flights';
import type { FlightProvider } from '@/services/flight-provider';
import type { FlightOffer, FlightSearchParams } from '@/types/flight';

function normalizeAirport(value: string) {
  return value.trim().slice(0, 3).toUpperCase();
}

export const mockFlightProvider: FlightProvider = {
  async search(params: FlightSearchParams): Promise<FlightOffer[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    const origin = normalizeAirport(params.origin);
    const destination = normalizeAirport(params.destination);

    return mockFlightTemplates.map((offer) => ({
      ...offer,
      id: `${offer.id}-${origin}-${destination}`,
      origin,
      destination,
      price: offer.price * params.travelers,
    }));
  },
};
