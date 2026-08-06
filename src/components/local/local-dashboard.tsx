import {
  Bell,
  Heart,
  History,
  MapPin,
  Play,
  Settings,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FlightOffer, FlightSearchParams } from '@/types/flight';
import type {
  LocalSettings,
  PriceAlert,
  SearchHistoryItem,
} from '@/types/local-features';

interface LocalDashboardProps {
  favorites: FlightOffer[];
  history: SearchHistoryItem[];
  alerts: PriceAlert[];
  settings: LocalSettings;
  currentSearch: FlightSearchParams | null;
  onRemoveFavorite: (id: string) => void;
  onRepeatSearch: (search: FlightSearchParams) => void;
  onClearHistory: () => void;
  onCreateAlert: (targetPrice: number) => void;
  onToggleAlert: (id: string) => void;
  onRemoveAlert: (id: string) => void;
  onUpdateSettings: (settings: LocalSettings) => void;
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

function EmptyState({ children }: { children: string }) {
  return (
    <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function LocalDashboard({
  favorites,
  history,
  alerts,
  settings,
  currentSearch,
  onRemoveFavorite,
  onRepeatSearch,
  onClearHistory,
  onCreateAlert,
  onToggleAlert,
  onRemoveAlert,
  onUpdateSettings,
}: LocalDashboardProps) {
  const [targetPrice, setTargetPrice] = useState('500');

  return (
    <section
      id="minha-area"
      className="scroll-mt-24 space-y-6 py-6"
      aria-labelledby="local-title"
    >
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Salvo neste dispositivo
        </span>
        <h2 id="local-title" className="mt-2 text-3xl font-bold tracking-tight">
          Minha área
        </h2>
        <p className="mt-2 text-muted-foreground">
          Preferências e listas ficam somente neste navegador.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="inline-flex items-center gap-2">
              <Heart className="size-5 text-primary" /> Favoritos
            </CardTitle>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
              {favorites.length}
            </span>
          </CardHeader>
          <CardContent className="grid gap-3">
            {favorites.length === 0 && (
              <EmptyState>
                Favorite uma oferta nos resultados para encontrá-la aqui.
              </EmptyState>
            )}
            {favorites.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div>
                  <p className="font-semibold">
                    {offer.origin} → {offer.destination}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {offer.airline} · {priceFormatter.format(offer.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFavorite(offer.id)}
                  aria-label={`Remover favorito ${offer.airline}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="inline-flex items-center gap-2">
              <History className="size-5 text-primary" /> Histórico
            </CardTitle>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearHistory}>
                Limpar
              </Button>
            )}
          </CardHeader>
          <CardContent className="grid gap-3">
            {history.length === 0 && (
              <EmptyState>Suas pesquisas recentes aparecerão aqui.</EmptyState>
            )}
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div>
                  <p className="font-semibold">
                    {item.search.origin} → {item.search.destination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRepeatSearch(item.search)}
                >
                  <Play className="size-3.5" /> Repetir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Bell className="size-5 text-primary" /> Alertas locais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="target-price">Preço desejado</Label>
                <Input
                  id="target-price"
                  type="number"
                  min="1"
                  value={targetPrice}
                  onChange={(event) => setTargetPrice(event.target.value)}
                  disabled={!currentSearch}
                />
              </div>
              <Button
                onClick={() => onCreateAlert(Number(targetPrice))}
                disabled={!currentSearch || Number(targetPrice) <= 0}
              >
                Criar alerta
              </Button>
            </div>
            {!currentSearch && (
              <p className="text-xs text-muted-foreground">
                Faça uma pesquisa para criar um alerta para a rota.
              </p>
            )}
            {alerts.length === 0 && (
              <EmptyState>Nenhum alerta local criado.</EmptyState>
            )}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <button
                  className="min-w-0 text-left"
                  onClick={() => onToggleAlert(alert.id)}
                  aria-label={`${alert.active ? 'Pausar' : 'Ativar'} alerta`}
                >
                  <p className="truncate font-semibold">
                    {alert.search.origin} → {alert.search.destination}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Até {priceFormatter.format(alert.targetPrice)} ·{' '}
                    {alert.active ? 'Ativo' : 'Pausado'}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveAlert(alert.id)}
                  aria-label="Remover alerta"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Settings className="size-5 text-primary" /> Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label
                htmlFor="home-airport"
                className="inline-flex items-center gap-1.5"
              >
                <MapPin className="size-4" /> Aeroporto de preferência
              </Label>
              <Input
                id="home-airport"
                placeholder="Ex.: GRU"
                value={settings.homeAirport}
                maxLength={3}
                onChange={(event) =>
                  onUpdateSettings({
                    ...settings,
                    homeAirport: event.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <label className="flex items-center justify-between gap-4 rounded-xl border p-3 text-sm">
              Priorizar somente voos diretos
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={settings.directFlightsOnly}
                onChange={(event) =>
                  onUpdateSettings({
                    ...settings,
                    directFlightsOnly: event.target.checked,
                  })
                }
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border p-3 text-sm">
              Exibir resultados compactos
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={settings.compactResults}
                onChange={(event) =>
                  onUpdateSettings({
                    ...settings,
                    compactResults: event.target.checked,
                  })
                }
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
