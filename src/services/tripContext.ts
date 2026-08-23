export type TripContext = {
  destinationLabel: string;
  weather: {
    max: number;
    min: number;
    rainChance: number;
    code: number;
  } | null;
  holiday: { name: string; localName: string } | null;
  status: "live" | "partial" | "unavailable";
};
type GeoResult = {
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
};
type GeoResponse = { results?: GeoResult[] };
type ForecastResponse = {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
};
type Holiday = { date: string; localName: string; name: string };
const signal = () => AbortSignal.timeout(6000);
export async function getTripContext(
  destination: string,
  departureDate: string,
): Promise<TripContext> {
  try {
    const destinationCity = destination.replace(/\s*\([A-Z]{3}\)\s*$/, "");
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.search = new URLSearchParams({
      name: destinationCity,
      count: "1",
      language: "pt",
      format: "json",
    }).toString();
    const geo = await fetch(geoUrl, { signal: signal() });
    if (!geo.ok) throw new Error();
    const place = ((await geo.json()) as GeoResponse).results?.[0];
    if (!place) throw new Error();
    const label = [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(", ");
    const requested = new Date(`${departureDate}T12:00:00`);
    const daysAway = Math.ceil((requested.getTime() - Date.now()) / 86_400_000);
    const weatherPromise =
      daysAway >= 0 && daysAway <= 15
        ? getWeather(place, departureDate)
        : Promise.resolve(null);
    const [weather, holiday] = await Promise.all([
      weatherPromise,
      getHoliday(place.country_code || "BR", departureDate),
    ]);
    return {
      destinationLabel: label,
      weather,
      holiday,
      status: weather || holiday ? "live" : "partial",
    };
  } catch {
    return {
      destinationLabel: destination,
      weather: null,
      holiday: null,
      status: "unavailable",
    };
  }
}
async function getWeather(place: GeoResult, date: string) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    start_date: date,
    end_date: date,
  }).toString();
  const response = await fetch(url, { signal: signal() });
  if (!response.ok) return null;
  const daily = ((await response.json()) as ForecastResponse).daily;
  if (!daily?.time.length) return null;
  return {
    max: Math.round(daily.temperature_2m_max[0]),
    min: Math.round(daily.temperature_2m_min[0]),
    rainChance: Math.round(daily.precipitation_probability_max[0] || 0),
    code: daily.weather_code[0],
  };
}
async function getHoliday(country: string, date: string) {
  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${date.slice(0, 4)}/${country.toUpperCase()}`,
    { signal: signal() },
  );
  if (!response.ok) return null;
  return (
    ((await response.json()) as Holiday[]).find((item) => item.date === date) ||
    null
  );
}
