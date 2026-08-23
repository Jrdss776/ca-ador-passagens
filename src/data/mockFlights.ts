import type { FlightOffer, FlightSearch } from "../types/flight";
import { matchAirport } from "./airports";

const airlines = ["LATAM", "GOL", "Azul", "Voepass"];
const radians = (value: number) => (value * Math.PI) / 180;

function routeDistance(search: FlightSearch) {
  const origin = matchAirport(search.origin);
  const destination = matchAirport(search.destination);
  if (!origin || !destination) return 900;
  const dLat = radians(destination.latitude - origin.latitude);
  const dLon = radians(destination.longitude - origin.longitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(origin.latitude)) * Math.cos(radians(destination.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function stableVariation(value: string) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 0.88 + (hash % 25) / 100;
}

function differenceInDays(date: string) {
  const departure = new Date(`${date}T12:00:00`).getTime();
  return Math.max(0, Math.ceil((departure - Date.now()) / 86_400_000));
}

export function createMockFlights(search: FlightSearch): FlightOffer[] {
  const distance = routeDistance(search);
  const date = new Date(`${search.departureDate}T12:00:00`);
  const weekendFactor = [0, 5, 6].includes(date.getDay()) ? 1.12 : 1;
  const monthFactor = [0, 1, 6, 11].includes(date.getMonth()) ? 1.18 : 1;
  const advance = differenceInDays(search.departureDate);
  const advanceFactor = advance < 8 ? 1.42 : advance < 21 ? 1.2 : advance > 120 ? 1.08 : 1;
  const cabinFactor = { Econômica: 1, Premium: 1.55, Executiva: 2.45 }[search.cabin];
  const tripFactor = search.returnDate ? 1.82 : 1;
  const seasonFactor = search.highSeason ? 1.22 : 1;
  const flexDiscount = Math.min(search.flexibility * 0.012, 0.16);
  const baggageFee = search.baggage ? 140 * (search.returnDate ? 2 : 1) : 0;
  const routeBase = 210 + distance * 0.34;

  return Array.from({ length: 6 }, (_, index) => {
    const stops = search.directOnly ? 0 : distance > 1800 && index % 3 === 0 ? 1 : 0;
    const variation = stableVariation(`${search.origin}-${search.destination}-${search.departureDate}-${index}`);
    const airlineFactor = [1, 1.06, 0.96, 0.91][index % 4];
    const directFactor = search.directOnly ? 1.1 : stops ? 0.91 : 1.04;
    const price = Math.round(Math.max(260, routeBase * weekendFactor * monthFactor * advanceFactor * cabinFactor * tripFactor * seasonFactor * (1 - flexDiscount) * variation * airlineFactor * directFactor + baggageFee));
    const totalPrice = price * Math.max(1, search.passengers);
    const originalPrice = Math.round(price * (1.12 + index * 0.02));
    const durationMinutes = Math.round(distance / 12 + 55 + (stops ? 95 : 0));
    const duration = `${Math.floor(durationMinutes / 60)}h ${String(durationMinutes % 60).padStart(2, "0")}min`;
    return {
      id: `mock-${search.origin}-${search.destination}-${search.departureDate}-${index}`,
      airline: airlines[index % 4],
      flightNumber: `${["LA", "G3", "AD", "2Z"][index % 4]}${1200 + index * 37}`,
      origin: search.origin.toUpperCase(),
      destination: search.destination.toUpperCase(),
      departure: `${search.departureDate}T${String(6 + index * 2).padStart(2, "0")}:20`,
      arrival: `${search.departureDate}T${String(8 + index * 2).padStart(2, "0")}:45`,
      duration,
      stops,
      price,
      totalPrice,
      originalPrice,
      baggageIncluded: search.baggage || index % 2 === 0,
      score: Math.max(62, 96 - index * 5 - stops * 4),
      source: "Estimativa inteligente",
      tag: index === 0 ? "Melhor preço" : index === 1 ? "Melhor custo-benefício" : index === 2 ? "Mais rápido" : "Melhor custo-benefício",
    };
  });
}
