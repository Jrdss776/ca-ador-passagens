import { IntegrationNotConfiguredError } from '@/services/integrations/base';
import type { ExternalIntegration } from '@/types/integration';

export interface AirTrafficRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface AirTrafficState {
  callsign: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number | null;
}

export class OpenSkyProvider
  implements ExternalIntegration<AirTrafficRequest, AirTrafficState[]>
{
  readonly id = 'opensky' as const;
  readonly configured = false;

  async execute(input: AirTrafficRequest): Promise<AirTrafficState[]> {
    void input;
    throw new IntegrationNotConfiguredError(this.id);
  }
}
