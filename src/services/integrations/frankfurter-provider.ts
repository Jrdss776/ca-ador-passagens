import { IntegrationNotConfiguredError } from '@/services/integrations/base';
import type { ExternalIntegration } from '@/types/integration';

export interface CurrencyRequest {
  amount: number;
  from: string;
  to: string;
}

export interface CurrencyConversion {
  amount: number;
  rate: number;
  convertedAmount: number;
}

export class FrankfurterProvider
  implements ExternalIntegration<CurrencyRequest, CurrencyConversion>
{
  readonly id = 'frankfurter' as const;
  readonly configured = false;

  async execute(input: CurrencyRequest): Promise<CurrencyConversion> {
    void input;
    throw new IntegrationNotConfiguredError(this.id);
  }
}
