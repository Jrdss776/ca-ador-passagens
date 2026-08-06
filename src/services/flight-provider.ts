import type { FlightOffer, FlightSearchParams } from '@/types/flight';

export interface FlightProvider {
  search(params: FlightSearchParams): Promise<FlightOffer[]>;
}
