import type { FlightProvider } from '@/services/flight-provider';
import { AmadeusFlightProvider } from '@/services/integrations/amadeus-provider';
import { mockFlightProvider } from '@/services/mock-flight-provider';
import type { FlightSearchParams } from '@/types/flight';

const amadeusProvider = new AmadeusFlightProvider();

export const resilientFlightProvider: FlightProvider = {
  async search(params: FlightSearchParams) {
    try {
      const offers = await amadeusProvider.search(params);
      return offers.length > 0 ? offers : mockFlightProvider.search(params);
    } catch {
      return mockFlightProvider.search(params);
    }
  },
};
