import {
  BadgeDollarSign,
  CloudSun,
  Cloudy,
  Droplets,
  RefreshCw,
  Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FrankfurterProvider,
  OpenMeteoProvider,
} from '@/services/integrations';
import type { CurrencyConversion } from '@/services/integrations/frankfurter-provider';
import type { WeatherSummary } from '@/services/integrations/open-meteo-provider';

interface PublicApiInsightsProps {
  destination: string;
  lowestPrice: number;
}

interface InsightState<T> {
  status: 'loading' | 'success' | 'error';
  data?: T;
}

const weatherProvider = new OpenMeteoProvider();
const currencyProvider = new FrankfurterProvider();

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PublicApiInsights({
  destination,
  lowestPrice,
}: PublicApiInsightsProps) {
  const [weather, setWeather] = useState<InsightState<WeatherSummary>>({
    status: 'loading',
  });
  const [currencies, setCurrencies] = useState<
    InsightState<CurrencyConversion[]>
  >({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setWeather({ status: 'loading' });
    setCurrencies({ status: 'loading' });

    weatherProvider
      .execute({ location: destination })
      .then((data) => active && setWeather({ status: 'success', data }))
      .catch(() => active && setWeather({ status: 'error' }));

    currencyProvider
      .convertMany(lowestPrice, 'BRL', ['USD', 'EUR'])
      .then((data) => active && setCurrencies({ status: 'success', data }))
      .catch(() => active && setCurrencies({ status: 'error' }));

    return () => {
      active = false;
    };
  }, [destination, lowestPrice]);

  return (
    <section
      className="grid gap-4 md:grid-cols-2"
      aria-label="Informações de APIs públicas"
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="inline-flex items-center gap-2">
            <CloudSun className="size-5 text-primary" /> Clima no destino
          </CardTitle>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <Wifi className="size-3.5" /> Open-Meteo
          </span>
        </CardHeader>
        <CardContent aria-live="polite">
          {weather.status === 'loading' && (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin" /> Consultando previsão
              pública...
            </p>
          )}
          {weather.status === 'error' && (
            <p className="text-sm text-muted-foreground">
              Previsão indisponível agora. A busca de passagens continua
              funcionando.
            </p>
          )}
          {weather.status === 'success' && weather.data && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold">
                  {weather.data.location}
                  {weather.data.country ? `, ${weather.data.country}` : ''}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Previsão para hoje
                </p>
              </div>
              <div className="flex gap-5 sm:justify-end">
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Cloudy className="size-4 text-primary" />{' '}
                  {Math.round(weather.data.minimumCelsius)}°–
                  {Math.round(weather.data.maximumCelsius)}°C
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <Droplets className="size-4 text-primary" />{' '}
                  {Math.round(weather.data.precipitationProbability)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="inline-flex items-center gap-2">
            <BadgeDollarSign className="size-5 text-primary" /> Preço em outras
            moedas
          </CardTitle>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <Wifi className="size-3.5" /> Frankfurter
          </span>
        </CardHeader>
        <CardContent aria-live="polite">
          {currencies.status === 'loading' && (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin" /> Consultando câmbio
              público...
            </p>
          )}
          {currencies.status === 'error' && (
            <p className="text-sm text-muted-foreground">
              Câmbio indisponível agora. Os preços em reais não foram alterados.
            </p>
          )}
          {currencies.status === 'success' && currencies.data && (
            <div>
              <p className="text-sm text-muted-foreground">
                Menor oferta, conversão indicativa
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currencies.data.map((conversion) => (
                  <span
                    key={conversion.to}
                    className="rounded-lg bg-muted px-3 py-2 font-semibold"
                  >
                    {formatCurrency(conversion.convertedAmount, conversion.to)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
