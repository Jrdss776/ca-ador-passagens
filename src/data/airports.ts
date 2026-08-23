export type Airport = {
  iata: string;
  icao: string;
  city: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
};
export const airports: Airport[] = [
  {
    iata: "GRU",
    icao: "SBGR",
    city: "São Paulo",
    name: "Guarulhos",
    state: "SP",
    latitude: -23.4356,
    longitude: -46.4731,
  },
  {
    iata: "CGH",
    icao: "SBSP",
    city: "São Paulo",
    name: "Congonhas",
    state: "SP",
    latitude: -23.6261,
    longitude: -46.6564,
  },
  {
    iata: "VCP",
    icao: "SBKP",
    city: "Campinas",
    name: "Viracopos",
    state: "SP",
    latitude: -23.0074,
    longitude: -47.1345,
  },
  {
    iata: "GIG",
    icao: "SBGL",
    city: "Rio de Janeiro",
    name: "Galeão",
    state: "RJ",
    latitude: -22.809,
    longitude: -43.2506,
  },
  {
    iata: "SDU",
    icao: "SBRJ",
    city: "Rio de Janeiro",
    name: "Santos Dumont",
    state: "RJ",
    latitude: -22.9105,
    longitude: -43.1631,
  },
  {
    iata: "CNF",
    icao: "SBCF",
    city: "Belo Horizonte",
    name: "Confins",
    state: "MG",
    latitude: -19.6244,
    longitude: -43.9719,
  },
  {
    iata: "BSB",
    icao: "SBBR",
    city: "Brasília",
    name: "Presidente Juscelino Kubitschek",
    state: "DF",
    latitude: -15.8697,
    longitude: -47.9208,
  },
  {
    iata: "SSA",
    icao: "SBSV",
    city: "Salvador",
    name: "Deputado Luís Eduardo Magalhães",
    state: "BA",
    latitude: -12.9086,
    longitude: -38.3225,
  },
  {
    iata: "REC",
    icao: "SBRF",
    city: "Recife",
    name: "Guararapes",
    state: "PE",
    latitude: -8.1265,
    longitude: -34.9236,
  },
  {
    iata: "FOR",
    icao: "SBFZ",
    city: "Fortaleza",
    name: "Pinto Martins",
    state: "CE",
    latitude: -3.7763,
    longitude: -38.5326,
  },
  {
    iata: "POA",
    icao: "SBPA",
    city: "Porto Alegre",
    name: "Salgado Filho",
    state: "RS",
    latitude: -29.9944,
    longitude: -51.1714,
  },
  {
    iata: "CWB",
    icao: "SBCT",
    city: "Curitiba",
    name: "Afonso Pena",
    state: "PR",
    latitude: -25.5285,
    longitude: -49.1758,
  },
  {
    iata: "FLN",
    icao: "SBFL",
    city: "Florianópolis",
    name: "Hercílio Luz",
    state: "SC",
    latitude: -27.6703,
    longitude: -48.5525,
  },
  {
    iata: "MAO",
    icao: "SBEG",
    city: "Manaus",
    name: "Eduardo Gomes",
    state: "AM",
    latitude: -3.0386,
    longitude: -60.0497,
  },
  {
    iata: "BEL",
    icao: "SBBE",
    city: "Belém",
    name: "Val de Cans",
    state: "PA",
    latitude: -1.3793,
    longitude: -48.4763,
  },
  {
    iata: "NAT",
    icao: "SBSG",
    city: "Natal",
    name: "Governador Aluízio Alves",
    state: "RN",
    latitude: -5.7681,
    longitude: -35.3761,
  },
  {
    iata: "MCZ",
    icao: "SBMO",
    city: "Maceió",
    name: "Zumbi dos Palmares",
    state: "AL",
    latitude: -9.5108,
    longitude: -35.7917,
  },
  {
    iata: "AJU",
    icao: "SBAR",
    city: "Aracaju",
    name: "Santa Maria",
    state: "SE",
    latitude: -10.984,
    longitude: -37.0703,
  },
  {
    iata: "JPA",
    icao: "SBJP",
    city: "João Pessoa",
    name: "Presidente Castro Pinto",
    state: "PB",
    latitude: -7.1458,
    longitude: -34.9486,
  },
  {
    iata: "CGB",
    icao: "SBCY",
    city: "Cuiabá",
    name: "Marechal Rondon",
    state: "MT",
    latitude: -15.6529,
    longitude: -56.1167,
  },
  {
    iata: "CGR",
    icao: "SBCG",
    city: "Campo Grande",
    name: "Campo Grande",
    state: "MS",
    latitude: -20.4687,
    longitude: -54.6725,
  },
  {
    iata: "GYN",
    icao: "SBGO",
    city: "Goiânia",
    name: "Santa Genoveva",
    state: "GO",
    latitude: -16.632,
    longitude: -49.2207,
  },
  {
    iata: "VIX",
    icao: "SBVT",
    city: "Vitória",
    name: "Eurico de Aguiar Salles",
    state: "ES",
    latitude: -20.2581,
    longitude: -40.2864,
  },
  {
    iata: "THE",
    icao: "SBTE",
    city: "Teresina",
    name: "Senador Petrônio Portella",
    state: "PI",
    latitude: -5.0603,
    longitude: -42.8235,
  },
  {
    iata: "SLZ",
    icao: "SBSL",
    city: "São Luís",
    name: "Marechal Cunha Machado",
    state: "MA",
    latitude: -2.5854,
    longitude: -44.2341,
  },
];
export const airportLabel = (airport: Airport) =>
  `${airport.city} (${airport.iata})`;
export function matchAirport(value: string) {
  const normalized = value.toLocaleLowerCase("pt-BR");
  return airports.find((a) =>
    [a.iata, a.icao, a.city, airportLabel(a)].some(
      (x) => x.toLocaleLowerCase("pt-BR") === normalized,
    ),
  );
}
export function searchAirports(value: string) {
  const query = value.trim().toLocaleLowerCase("pt-BR");
  if (!query) return airports.slice(0, 6);
  return airports
    .filter((a) =>
      `${a.iata} ${a.icao} ${a.city} ${a.name} ${a.state}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    )
    .slice(0, 6);
}
const radians = (value: number) => (value * Math.PI) / 180;
export function nearbyAirports(airport: Airport, limit = 2) {
  return airports
    .filter((a) => a.iata !== airport.iata)
    .map((a) => {
      const dLat = radians(a.latitude - airport.latitude);
      const dLon = radians(a.longitude - airport.longitude);
      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(radians(airport.latitude)) *
          Math.cos(radians(a.latitude)) *
          Math.sin(dLon / 2) ** 2;
      return {
        airport: a,
        distance: Math.round(
          6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)),
        ),
      };
    })
    .filter((x) => x.distance <= 250)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
