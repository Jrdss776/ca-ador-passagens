import type { FlightOffer, FlightSearch } from '../types/flight';

const airlines = ['LATAM', 'GOL', 'Azul', 'Voepass'];

export function createMockFlights(search: FlightSearch): FlightOffer[] {
  const base = search.highSeason ? 1350 : 850;
  const flexDiscount = Math.min(search.flexibility * 32, 320);
  const baggageFee = search.baggage ? 140 : 0;

  return Array.from({ length: 6 }, (_, index) => {
    const price = Math.max(420, base + index * 115 - flexDiscount + baggageFee + (index % 2) * 90);
    const originalPrice = Math.round(price * (1.12 + index * 0.02));
    const stops = search.directOnly ? 0 : index % 3 === 0 ? 1 : 0;
    const score = Math.max(62, 96 - index * 5 - stops * 4);
    return {
      id: `mock-${index + 1}`,
      airline: airlines[index % airlines.length],
      flightNumber: `${['LA', 'G3', 'AD', '2Z'][index % 4]}${1200 + index * 37}`,
      origin: search.origin.toUpperCase(),
      destination: search.destination.toUpperCase(),
      departure: `${search.departureDate}T${String(6 + index * 2).padStart(2, '0')}:20`,
      arrival: `${search.departureDate}T${String(8 + index * 2).padStart(2, '0')}:45`,
      duration: stops ? '4h 15min' : `${2 + (index % 2)}h 25min`,
      stops,
      price,
      originalPrice,
      baggageIncluded: search.baggage || index % 2 === 0,
      score,
      source: 'Modo demonstração',
      tag: index === 0 ? 'Melhor preço' : index === 1 ? 'Melhor custo-benefício' : index === 2 ? 'Mais rápido' : 'Melhor custo-benefício'
    };
  });
}
