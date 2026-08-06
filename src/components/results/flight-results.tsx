import { Filter, ListFilter } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FlightOfferCard } from '@/components/results/flight-offer-card';
import { Label } from '@/components/ui/label';
import type {
  FlightOffer,
  FlightSearchParams,
  FlightSort,
} from '@/types/flight';

interface FlightResultsProps {
  offers: FlightOffer[];
  search: FlightSearchParams;
  favoriteIds: string[];
  directFlightsOnly: boolean;
  compact: boolean;
  onToggleFavorite: (offer: FlightOffer) => void;
}

function durationInMinutes(duration: string) {
  const hours = Number(duration.match(/(\d+)h/)?.[1] ?? 0);
  const minutes = Number(duration.match(/(\d+)min/)?.[1] ?? 0);
  return hours * 60 + minutes;
}

export function FlightResults({
  offers,
  search,
  favoriteIds,
  directFlightsOnly,
  compact,
  onToggleFavorite,
}: FlightResultsProps) {
  const [sort, setSort] = useState<FlightSort>('recommended');
  const [stops, setStops] = useState<'all' | 'direct' | 'one'>('all');
  const [airline, setAirline] = useState('all');

  const airlines = useMemo(
    () => [...new Set(offers.map((offer) => offer.airline))],
    [offers],
  );

  const visibleOffers = useMemo(() => {
    const filtered = offers.filter((offer) => {
      const matchesStops =
        directFlightsOnly || stops === 'direct'
          ? offer.stops === 0
          : stops === 'one'
            ? offer.stops === 1
            : true;
      const matchesAirline = airline === 'all' || offer.airline === airline;
      return matchesStops && matchesAirline;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'duration')
        return (
          durationInMinutes(a.outbound.duration) -
          durationInMinutes(b.outbound.duration)
        );
      return b.score - a.score;
    });
  }, [airline, directFlightsOnly, offers, sort, stops]);

  return (
    <section
      id="resultados"
      className="scroll-mt-24 space-y-5"
      aria-labelledby="results-title"
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Modo demonstração
          </span>
          <h2
            id="results-title"
            className="mt-2 text-3xl font-bold tracking-tight"
          >
            Opções para {search.destination}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {visibleOffers.length} de {offers.length} ofertas simuladas para
            comparar
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label
              htmlFor="stops-filter"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Filter className="size-3.5" /> Escalas
            </Label>
            <select
              id="stops-filter"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={directFlightsOnly ? 'direct' : stops}
              onChange={(event) => setStops(event.target.value as typeof stops)}
              disabled={directFlightsOnly}
            >
              <option value="all">Todas</option>
              <option value="direct">Somente diretos</option>
              <option value="one">Até 1 escala</option>
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label
              htmlFor="airline-filter"
              className="text-xs text-muted-foreground"
            >
              Companhia
            </Label>
            <select
              id="airline-filter"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={airline}
              onChange={(event) => setAirline(event.target.value)}
            >
              <option value="all">Todas</option>
              {airlines.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label
              htmlFor="sort-results"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <ListFilter className="size-3.5" /> Ordenar
            </Label>
            <select
              id="sort-results"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={sort}
              onChange={(event) => setSort(event.target.value as FlightSort)}
            >
              <option value="recommended">Recomendados</option>
              <option value="price">Menor preço</option>
              <option value="duration">Menor duração</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {visibleOffers.map((offer) => (
          <FlightOfferCard
            key={offer.id}
            offer={offer}
            favorite={favoriteIds.includes(offer.id)}
            compact={compact}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {visibleOffers.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-semibold">
            Nenhuma oferta corresponde aos filtros.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste companhia ou número de escalas para ver mais opções.
          </p>
        </div>
      )}
    </section>
  );
}
