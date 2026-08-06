import { fetchJson } from '@/services/integrations/http';
import type { ExternalIntegration } from '@/types/integration';

export interface WeatherRequest {
  location: string;
}

export interface WeatherSummary {
  location: string;
  country: string;
  date: string;
  minimumCelsius: number;
  maximumCelsius: number;
  precipitationProbability: number;
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

interface ForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export class OpenMeteoProvider
  implements ExternalIntegration<WeatherRequest, WeatherSummary>
{
  readonly id = 'open-meteo' as const;
  readonly configured = true;

  async execute(input: WeatherRequest): Promise<WeatherSummary> {
    const geocodingUrl = new URL(
      'https://geocoding-api.open-meteo.com/v1/search',
    );
    geocodingUrl.search = new URLSearchParams({
      name: input.location,
      count: '1',
      language: 'pt',
      format: 'json',
    }).toString();

    const geocoding = await fetchJson<GeocodingResponse>(
      geocodingUrl.toString(),
    );
    const place = geocoding.results?.[0];
    if (!place) throw new Error('Destino não encontrado na previsão do tempo.');

    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.search = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      daily:
        'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '1',
    }).toString();

    const forecast = await fetchJson<ForecastResponse>(forecastUrl.toString());
    return {
      location: place.name,
      country: place.country ?? '',
      date: forecast.daily.time[0],
      minimumCelsius: forecast.daily.temperature_2m_min[0],
      maximumCelsius: forecast.daily.temperature_2m_max[0],
      precipitationProbability: forecast.daily.precipitation_probability_max[0],
    };
  }
}
