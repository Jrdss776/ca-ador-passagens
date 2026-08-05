import { createMockFlights } from '../data/mockFlights';
import type { FlightProvider } from './flightProvider';
import type { FlightSearch } from '../types/flight';

export const mockProvider: FlightProvider = {
  async searchFlights(search: FlightSearch) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return createMockFlights(search);
  },
  async searchFlexibleDates(search: FlightSearch) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return createMockFlights({ ...search, flexibility: Math.max(search.flexibility, 3) });
  },
  async healthCheck() {
    return true;
  }
};
