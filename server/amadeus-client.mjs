const DEFAULT_BASE_URL = 'https://test.api.amadeus.com';
const REQUEST_TIMEOUT_MS = 12_000;

let cachedToken;

function fetchWithTimeout(url, options = {}) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function getAccessToken(config) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.apiKey,
    client_secret: config.apiSecret,
  });
  const response = await fetchWithTimeout(
    `${config.baseUrl}/v1/security/oauth2/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  );
  if (!response.ok)
    throw new Error(`Falha de autenticação Amadeus (${response.status}).`);

  const token = await response.json();
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1_000,
  };
  return cachedToken.value;
}

function durationLabel(value) {
  return value.replace('PT', '').replace('H', 'h ').replace('M', 'min').trim();
}

function timeLabel(value) {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const suppliers = {
  AD: {
    name: 'Azul',
    websiteUrl: 'https://www.voeazul.com.br/home/br/pt/home',
    supportUrl: 'https://www.voeazul.com.br/home/br/pt/home',
  },
  G3: {
    name: 'GOL',
    websiteUrl: 'https://www.voegol.com.br/',
    supportUrl: 'https://www.voegol.com.br/atendimento/canais-oficiais-gol',
  },
  LA: {
    name: 'LATAM',
    websiteUrl: 'https://www.latamairlines.com/br/pt',
    supportUrl: 'https://www.latamairlines.com/br/pt/central-ajuda',
  },
};

const cabinLabels = {
  ECONOMY: 'Econômica',
  PREMIUM_ECONOMY: 'Econômica premium',
  BUSINESS: 'Executiva',
  FIRST: 'Primeira classe',
};

function baggageAllowance(baggage) {
  if (!baggage) {
    return { status: 'unknown', description: 'Não informado pelo provedor' };
  }
  if (Number.isFinite(baggage.quantity)) {
    return baggage.quantity > 0
      ? {
          status: 'included',
          description: `${baggage.quantity} volume${baggage.quantity > 1 ? 's' : ''}`,
        }
      : { status: 'not-included', description: 'Não incluída' };
  }
  if (Number.isFinite(baggage.weight)) {
    return {
      status: baggage.weight > 0 ? 'included' : 'not-included',
      description:
        baggage.weight > 0
          ? `Até ${baggage.weight} ${baggage.weightUnit ?? 'kg'}`
          : 'Não incluída',
    };
  }
  return { status: 'unknown', description: 'Regra não detalhada' };
}

function mapOffer(offer, dictionaries, index) {
  const itinerary = offer.itineraries[0];
  const first = itinerary.segments[0];
  const last = itinerary.segments.at(-1);
  const airlineCode = offer.validatingAirlineCodes?.[0] ?? first.carrierCode;
  const knownSupplier = suppliers[airlineCode];
  if (!knownSupplier) return null;
  const airline =
    dictionaries?.carriers?.[airlineCode] ?? knownSupplier.name ?? airlineCode;
  const fareSegments =
    offer.travelerPricings?.flatMap(
      (traveler) => traveler.fareDetailsBySegment ?? [],
    ) ?? [];
  const primaryFare = fareSegments[0];
  const checkedBaggage = fareSegments.find(
    (fare) => fare.includedCheckedBags,
  )?.includedCheckedBags;
  const cabinBaggage = fareSegments.find(
    (fare) => fare.includedCabinBags,
  )?.includedCabinBags;

  return {
    id: `amadeus-${offer.id}-${index}`,
    airline,
    airlineCode,
    origin: first.departure.iataCode,
    destination: last.arrival.iataCode,
    outbound: {
      departureTime: timeLabel(first.departure.at),
      arrivalTime: timeLabel(last.arrival.at),
      duration: durationLabel(itinerary.duration),
    },
    stops: Math.max(0, itinerary.segments.length - 1),
    price: Number(offer.price.grandTotal),
    currency: offer.price.currency,
    score: Math.max(70, 96 - index * 3),
    priceKind: 'live',
    checkedAt: new Date().toISOString(),
    fareNote:
      'Dados retornados pela busca; regras podem variar entre os trechos.',
    fare: {
      name:
        primaryFare?.brandedFareLabel ??
        primaryFare?.brandedFare ??
        'Tarifa informada pelo provedor',
      cabin:
        cabinLabels[primaryFare?.cabin] ??
        primaryFare?.cabin ??
        'Não informada',
      bookingClass: primaryFare?.class,
      cabinBaggage: baggageAllowance(cabinBaggage),
      checkedBaggage: baggageAllowance(checkedBaggage),
    },
    supplier: {
      websiteUrl: knownSupplier.websiteUrl,
      supportUrl: knownSupplier.supportUrl,
    },
  };
}

export function getAmadeusConfig() {
  const apiKey = process.env.AMADEUS_API_KEY;
  const apiSecret = process.env.AMADEUS_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  return {
    apiKey,
    apiSecret,
    baseUrl: process.env.AMADEUS_API_BASE_URL || DEFAULT_BASE_URL,
  };
}

export async function searchAmadeusFlights(params, config) {
  const token = await getAccessToken(config);
  const travelClasses = {
    economy: 'ECONOMY',
    'premium-economy': 'PREMIUM_ECONOMY',
    business: 'BUSINESS',
    first: 'FIRST',
  };
  const query = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: String(params.travelers),
    currencyCode: 'BRL',
    travelClass: travelClasses[params.cabinClass] ?? 'ECONOMY',
    max: '10',
  });
  const response = await fetchWithTimeout(
    `${config.baseUrl}/v2/shopping/flight-offers?${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok)
    throw new Error(`Falha na busca Amadeus (${response.status}).`);

  const payload = await response.json();
  return payload.data
    .map((offer, index) => mapOffer(offer, payload.dictionaries, index))
    .filter(Boolean);
}

export async function searchAmadeusLocations(keyword, config) {
  const token = await getAccessToken(config);
  const query = new URLSearchParams({
    subType: 'CITY,AIRPORT',
    keyword: keyword.slice(0, 10),
    view: 'LIGHT',
    'page[limit]': '8',
  });
  const response = await fetchWithTimeout(
    `${config.baseUrl}/v1/reference-data/locations?${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok)
    throw new Error(`Falha na busca de aeroportos (${response.status}).`);

  const payload = await response.json();
  return payload.data.map((location) => ({
    code: location.iataCode,
    city: location.address?.cityName ?? location.name,
    name: location.name,
    country: location.address?.countryName ?? '',
  }));
}
