import {
  CalendarRange,
  MapPinned,
  PlaneTakeoff,
  Route,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { useState } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { IntegrationsPanel } from '@/components/integrations/integrations-panel';
import { LocalDashboard } from '@/components/local/local-dashboard';
import { FlightResults } from '@/components/results/flight-results';
import { FlightSearchForm } from '@/components/search/flight-search-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { mockFlightProvider } from '@/services/mock-flight-provider';
import type { FlightOffer, FlightSearchParams } from '@/types/flight';
import type {
  LocalSettings,
  PriceAlert,
  SearchHistoryItem,
} from '@/types/local-features';

const defaultSettings: LocalSettings = {
  homeAirport: '',
  directFlightsOnly: false,
  compactResults: false,
};

const benefits = [
  {
    icon: CalendarRange,
    title: 'Datas flexíveis',
    description:
      'Compare períodos próximos para planejar uma viagem mais econômica.',
  },
  {
    icon: MapPinned,
    title: 'Aeroportos alternativos',
    description:
      'Considere pontos de partida e chegada próximos ao seu destino.',
  },
  {
    icon: Route,
    title: 'Rotas inteligentes',
    description:
      'Prepare-se para avaliar duração, horários e número de escalas.',
  },
];

export default function App() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [lastSearch, setLastSearch] = useState<FlightSearchParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<FlightOffer[]>(
    'flight-hunter:favorites',
    [],
  );
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    'flight-hunter:history',
    [],
  );
  const [alerts, setAlerts] = useLocalStorage<PriceAlert[]>(
    'flight-hunter:alerts',
    [],
  );
  const [settings, setSettings] = useLocalStorage<LocalSettings>(
    'flight-hunter:settings',
    defaultSettings,
  );

  async function handleSearch(params: FlightSearchParams) {
    setLoading(true);
    const results = await mockFlightProvider.search(params);
    setOffers(results);
    setLastSearch(params);
    setHistory((current) =>
      [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          search: params,
        },
        ...current,
      ].slice(0, 8),
    );
    setLoading(false);
    window.setTimeout(
      () =>
        document
          .querySelector('#resultados')
          ?.scrollIntoView({ behavior: 'smooth' }),
      0,
    );
  }

  function toggleFavorite(offer: FlightOffer) {
    setFavorites((current) =>
      current.some((item) => item.id === offer.id)
        ? current.filter((item) => item.id !== offer.id)
        : [offer, ...current],
    );
  }

  function createAlert(targetPrice: number) {
    if (!lastSearch) return;
    setAlerts((current) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        search: lastSearch,
        targetPrice,
        active: true,
      },
      ...current,
    ]);
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-800 px-6 pb-28 pt-14 text-white shadow-xl sm:px-10 lg:px-16 lg:py-20 lg:pb-32">
        <div
          className="absolute -right-20 -top-24 size-80 rounded-full bg-cyan-300/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-emerald-300/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20">
            <Sparkles className="size-4" />
            Planejamento inteligente de viagens
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Encontre o melhor caminho para sua próxima viagem.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-50 sm:text-xl">
            Uma experiência simples para comparar possibilidades, explorar datas
            e tomar decisões com mais confiança.
          </p>
        </div>
      </section>

      <FlightSearchForm loading={loading} onSearch={handleSearch} />

      {lastSearch && (
        <FlightResults
          key={`${lastSearch.origin}-${lastSearch.destination}`}
          offers={offers}
          search={lastSearch}
          favoriteIds={favorites.map((offer) => offer.id)}
          directFlightsOnly={settings.directFlightsOnly}
          compact={settings.compactResults}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <LocalDashboard
        favorites={favorites}
        history={history}
        alerts={alerts}
        settings={settings}
        currentSearch={lastSearch}
        onRemoveFavorite={(id) =>
          setFavorites((current) => current.filter((offer) => offer.id !== id))
        }
        onRepeatSearch={handleSearch}
        onClearHistory={() => setHistory([])}
        onCreateAlert={createAlert}
        onToggleAlert={(id) =>
          setAlerts((current) =>
            current.map((alert) =>
              alert.id === id ? { ...alert, active: !alert.active } : alert,
            ),
          )
        }
        onRemoveAlert={(id) =>
          setAlerts((current) => current.filter((alert) => alert.id !== id))
        }
        onUpdateSettings={setSettings}
      />

      <IntegrationsPanel />

      <section
        id="recursos"
        className="scroll-mt-24 py-8"
        aria-labelledby="benefits-title"
      >
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Mais possibilidades
          </span>
          <h2
            id="benefits-title"
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Planeje além do preço
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            A interface foi preparada para transformar diferentes critérios em
            uma comparação clara nas próximas sprints.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="transition-transform duration-200 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-2 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="sobre"
        className="scroll-mt-24 rounded-3xl border bg-card px-6 py-10 sm:px-10"
        aria-labelledby="about-title"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <PlaneTakeoff className="size-4" />
              Construído por etapas
            </span>
            <h2
              id="about-title"
              className="mt-3 text-2xl font-bold sm:text-3xl"
            >
              Uma interface pronta para evoluir
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              O motor de comparação continua usando dados simulados. Clima e
              câmbio já usam APIs públicas; dados reais de voos dependerão de
              uma futura camada de backend segura.
            </p>
          </div>
          <div
            className="grid size-20 place-items-center rounded-2xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <WalletCards className="size-9" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
