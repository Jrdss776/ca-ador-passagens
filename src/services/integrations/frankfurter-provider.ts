import { fetchJson } from '@/services/integrations/http';
import type { ExternalIntegration } from '@/types/integration';

export interface CurrencyRequest {
  amount: number;
  from: string;
  to: string;
}

export interface CurrencyConversion {
  date: string;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
}

interface FrankfurterRateResponse {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

interface FrankfurterLatestResponse {
  date: string;
  base: string;
  rates: Record<string, number>;
}

export class FrankfurterProvider
  implements ExternalIntegration<CurrencyRequest, CurrencyConversion>
{
  readonly id = 'frankfurter' as const;
  readonly configured = true;

  async execute(input: CurrencyRequest): Promise<CurrencyConversion> {
    const from = input.from.toUpperCase();
    const to = input.to.toUpperCase();
    const response = await fetchJson<FrankfurterRateResponse>(
      `https://api.frankfurter.dev/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
    );

    return {
      date: response.date,
      from: response.base,
      to: response.quote,
      amount: input.amount,
      rate: response.rate,
      convertedAmount: input.amount * response.rate,
    };
  }

  async convertMany(
    amount: number,
    fromCurrency: string,
    targetCurrencies: string[],
  ): Promise<CurrencyConversion[]> {
    const from = fromCurrency.toUpperCase();
    const targets = targetCurrencies.map((currency) => currency.toUpperCase());
    const url = new URL('https://api.frankfurter.app/latest');
    url.search = new URLSearchParams({
      from,
      to: targets.join(','),
    }).toString();

    const response = await fetchJson<FrankfurterLatestResponse>(url.toString());
    return targets.map((target) => ({
      date: response.date,
      from: response.base,
      to: target,
      amount,
      rate: response.rates[target],
      convertedAmount: amount * response.rates[target],
    }));
  }
}
