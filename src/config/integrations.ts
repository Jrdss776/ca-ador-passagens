import type { IntegrationDefinition } from '@/types/integration';

export const integrations: IntegrationDefinition[] = [
  {
    id: 'amadeus',
    name: 'Amadeus Self-Service',
    description:
      'Fonte opcional de ofertas reais; o app funciona sem cadastro corporativo usando estimativas.',
    capability: 'flights',
    auth: 'server-secret',
    environmentVariables: ['AMADEUS_API_KEY', 'AMADEUS_API_SECRET'],
    serverOnly: true,
    active: false,
  },
  {
    id: 'opensky',
    name: 'OpenSky Network',
    description:
      'Dados operacionais de tráfego aéreo e acompanhamento de voos.',
    capability: 'air-traffic',
    auth: 'optional-account',
    environmentVariables: ['OPENSKY_USERNAME', 'OPENSKY_PASSWORD'],
    serverOnly: true,
    active: false,
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo',
    description: 'Previsões meteorológicas para origem e destino da viagem.',
    capability: 'weather',
    auth: 'public',
    environmentVariables: [],
    serverOnly: false,
    active: true,
  },
  {
    id: 'frankfurter',
    name: 'Frankfurter',
    description: 'Conversão indicativa de moedas para comparação de preços.',
    capability: 'currency',
    auth: 'public',
    environmentVariables: [],
    serverOnly: false,
    active: true,
  },
];
