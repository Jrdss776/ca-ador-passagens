import type { FlightProvider } from '@/services/flight-provider';
import { AmadeusFlightProvider } from '@/services/integrations/amadeus-provider';
import { mockFlightProvider } from '@/services/mock-flight-provider';
import type { FlightSearchParams } from '@/types/flight';

const amadeusProvider = new AmadeusFlightProvider();

export interface FlightSearchResult {
  offers: Awaited<ReturnType<FlightProvider['search']>>;
  source: 'live' | 'estimate';
  notice?: string;
}

export async function searchFlightOffers(
  params: FlightSearchParams,
): Promise<FlightSearchResult> {
  try {
    const offers = await amadeusProvider.search(params);
    if (offers.length > 0) return { offers, source: 'live' };

    return {
      offers: await mockFlightProvider.search(params),
      source: 'estimate',
      notice:
        'O provedor não encontrou ofertas para esta consulta. Exibimos estimativas para ajudar no planejamento.',
    };
  } catch {
    return {
      offers: await mockFlightProvider.search(params),
      source: 'estimate',
      notice:
        'A consulta de mercado está indisponível agora. Exibimos estimativas e recomendamos confirmar os valores no site oficial.',
    };
  }
}

export const resilientFlightProvider: FlightProvider = {
  async search(params: FlightSearchParams) {
    return (await searchFlightOffers(params)).offers;
  },
};
