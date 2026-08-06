import { IntegrationNotConfiguredError } from '@/services/integrations/base';
import type { ExternalIntegration } from '@/types/integration';

export interface WeatherRequest {
  latitude: number;
  longitude: number;
  date: string;
}

export interface WeatherSummary {
  minimumCelsius: number;
  maximumCelsius: number;
  precipitationProbability: number;
}

export class OpenMeteoProvider
  implements ExternalIntegration<WeatherRequest, WeatherSummary>
{
  readonly id = 'open-meteo' as const;
  readonly configured = false;

  async execute(input: WeatherRequest): Promise<WeatherSummary> {
    void input;
    throw new IntegrationNotConfiguredError(this.id);
  }
}
