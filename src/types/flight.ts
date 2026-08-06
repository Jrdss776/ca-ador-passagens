export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  cabinClass: CabinClass;
  flexibleDates: boolean;
}

export interface FlightSegment {
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  outbound: FlightSegment;
  stops: number;
  price: number;
  currency: 'BRL';
  score: number;
  priceKind: 'estimate' | 'live';
  checkedAt: string;
  fareNote: string;
  supplier: {
    websiteUrl: string;
    supportUrl: string;
  };
}

export type FlightSort = 'recommended' | 'price' | 'duration';
