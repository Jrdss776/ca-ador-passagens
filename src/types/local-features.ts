import type { FlightOffer, FlightSearchParams } from '@/types/flight';

export interface SearchHistoryItem {
  id: string;
  createdAt: string;
  search: FlightSearchParams;
}

export interface PriceAlert {
  id: string;
  createdAt: string;
  search: FlightSearchParams;
  targetPrice: number;
  active: boolean;
}

export interface LocalSettings {
  homeAirport: string;
  directFlightsOnly: boolean;
  compactResults: boolean;
}

export interface LocalFeatureState {
  favorites: FlightOffer[];
  history: SearchHistoryItem[];
  alerts: PriceAlert[];
  settings: LocalSettings;
}
