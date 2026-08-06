import { IntegrationNotConfiguredError } from '@/services/integrations/base';
import type { FlightProvider } from '@/services/flight-provider';
import type { FlightOffer, FlightSearchParams } from '@/types/flight';

export class AmadeusFlightProvider implements FlightProvider {
  readonly configured = false;

  async search(params: FlightSearchParams): Promise<FlightOffer[]> {
    void params;
    throw new IntegrationNotConfiguredError('amadeus');
  }
}
