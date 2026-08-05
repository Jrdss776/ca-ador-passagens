import type { FlightOffer, FlightSearch } from '../types/flight';

export interface FlightProvider {
  searchFlights(search: FlightSearch): Promise<FlightOffer[]>;
  searchFlexibleDates(search: FlightSearch): Promise<FlightOffer[]>;
  healthCheck(): Promise<boolean>;
}
