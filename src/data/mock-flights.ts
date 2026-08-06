import type { FlightOffer } from '@/types/flight';

type MockFlightTemplate = Omit<
  FlightOffer,
  'origin' | 'destination' | 'checkedAt'
>;

export const mockFlightTemplates: MockFlightTemplate[] = [
  {
    id: 'mock-001',
    airline: 'Azul',
    airlineCode: 'AD',
    outbound: {
      departureTime: '06:10',
      arrivalTime: '08:25',
      duration: '2h 15min',
    },
    stops: 0,
    price: 589,
    currency: 'BRL',
    score: 94,
    priceKind: 'estimate',
    fareNote: 'Bagagem despachada não incluída na estimativa.',
    fare: {
      name: 'Tarifa econômica estimada',
      cabin: 'Econômica',
      cabinBaggage: {
        status: 'included',
        description: '1 item de mão (estimativa)',
      },
      checkedBaggage: {
        status: 'not-included',
        description: 'Não incluída na estimativa',
      },
    },
    supplier: {
      websiteUrl: 'https://www.voeazul.com.br/home/br/pt/home',
      supportUrl: 'https://www.voeazul.com.br/home/br/pt/home',
    },
  },
  {
    id: 'mock-002',
    airline: 'LATAM',
    airlineCode: 'LA',
    outbound: {
      departureTime: '09:40',
      arrivalTime: '12:20',
      duration: '2h 40min',
    },
    stops: 0,
    price: 649,
    currency: 'BRL',
    score: 91,
    priceKind: 'estimate',
    fareNote: 'Bagagem despachada não incluída na estimativa.',
    fare: {
      name: 'Tarifa econômica estimada',
      cabin: 'Econômica',
      cabinBaggage: {
        status: 'included',
        description: '1 item de mão (estimativa)',
      },
      checkedBaggage: {
        status: 'not-included',
        description: 'Não incluída na estimativa',
      },
    },
    supplier: {
      websiteUrl: 'https://www.latamairlines.com/br/pt',
      supportUrl: 'https://www.latamairlines.com/br/pt/central-ajuda',
    },
  },
  {
    id: 'mock-003',
    airline: 'GOL',
    airlineCode: 'G3',
    outbound: {
      departureTime: '13:15',
      arrivalTime: '17:35',
      duration: '4h 20min',
    },
    stops: 1,
    price: 478,
    currency: 'BRL',
    score: 86,
    priceKind: 'estimate',
    fareNote: 'Bagagem despachada não incluída na estimativa.',
    fare: {
      name: 'Tarifa econômica estimada',
      cabin: 'Econômica',
      cabinBaggage: {
        status: 'included',
        description: '1 item de mão (estimativa)',
      },
      checkedBaggage: {
        status: 'not-included',
        description: 'Não incluída na estimativa',
      },
    },
    supplier: {
      websiteUrl: 'https://www.voegol.com.br/',
      supportUrl: 'https://www.voegol.com.br/atendimento/canais-oficiais-gol',
    },
  },
  {
    id: 'mock-004',
    airline: 'Azul',
    airlineCode: 'AD',
    outbound: {
      departureTime: '18:30',
      arrivalTime: '23:20',
      duration: '4h 50min',
    },
    stops: 1,
    price: 529,
    currency: 'BRL',
    score: 82,
    priceKind: 'estimate',
    fareNote: 'Bagagem despachada não incluída na estimativa.',
    fare: {
      name: 'Tarifa econômica estimada',
      cabin: 'Econômica',
      cabinBaggage: {
        status: 'included',
        description: '1 item de mão (estimativa)',
      },
      checkedBaggage: {
        status: 'not-included',
        description: 'Não incluída na estimativa',
      },
    },
    supplier: {
      websiteUrl: 'https://www.voeazul.com.br/home/br/pt/home',
      supportUrl: 'https://www.voeazul.com.br/home/br/pt/home',
    },
  },
  {
    id: 'mock-005',
    airline: 'LATAM',
    airlineCode: 'LA',
    outbound: {
      departureTime: '21:05',
      arrivalTime: '23:15',
      duration: '2h 10min',
    },
    stops: 0,
    price: 715,
    currency: 'BRL',
    score: 88,
    priceKind: 'estimate',
    fareNote: 'Bagagem despachada não incluída na estimativa.',
    fare: {
      name: 'Tarifa econômica estimada',
      cabin: 'Econômica',
      cabinBaggage: {
        status: 'included',
        description: '1 item de mão (estimativa)',
      },
      checkedBaggage: {
        status: 'not-included',
        description: 'Não incluída na estimativa',
      },
    },
    supplier: {
      websiteUrl: 'https://www.latamairlines.com/br/pt',
      supportUrl: 'https://www.latamairlines.com/br/pt/central-ajuda',
    },
  },
];
