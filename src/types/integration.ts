export type IntegrationId =
  | 'amadeus'
  | 'opensky'
  | 'open-meteo'
  | 'frankfurter';
export type IntegrationAuth = 'server-secret' | 'optional-account' | 'public';
export type IntegrationCapability =
  | 'flights'
  | 'air-traffic'
  | 'weather'
  | 'currency';

export interface IntegrationDefinition {
  id: IntegrationId;
  name: string;
  description: string;
  capability: IntegrationCapability;
  auth: IntegrationAuth;
  environmentVariables: string[];
  serverOnly: boolean;
  active: boolean;
}

export interface ExternalIntegration<TInput, TOutput> {
  readonly id: IntegrationId;
  readonly configured: boolean;
  execute(input: TInput): Promise<TOutput>;
}
