import {
  BaggageClaim,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  Headphones,
  Heart,
  Info,
  Plane,
  Sparkles,
  TicketCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FlightOffer } from '@/types/flight';

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

interface FlightOfferCardProps {
  offer: FlightOffer;
  favorite: boolean;
  compact: boolean;
  onToggleFavorite: (offer: FlightOffer) => void;
}

export function FlightOfferCard({
  offer,
  favorite,
  compact,
  onToggleFavorite,
}: FlightOfferCardProps) {
  const checkedAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(offer.checkedAt));
  const baggageTone = {
    included: 'text-emerald-700 dark:text-emerald-300',
    'not-included': 'text-amber-700 dark:text-amber-300',
    unknown: 'text-muted-foreground',
  } as const;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div
          className={cn(
            'grid gap-5 p-5 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(16rem,2fr)_minmax(8rem,0.8fr)] sm:items-center',
            compact ? 'sm:p-4' : 'sm:p-6',
          )}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {offer.airlineCode}
            </span>
            <div>
              <p className="font-semibold">{offer.airline}</p>
              <p className="text-xs text-muted-foreground">
                {offer.priceKind === 'live'
                  ? 'Oferta consultada'
                  : 'Oferta demonstrativa'}
              </p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div>
                <p className="text-xl font-bold">
                  {offer.outbound.departureTime}
                </p>
                <p className="text-sm text-muted-foreground">{offer.origin}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <Plane className="size-4" />
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {offer.outbound.arrivalTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  {offer.destination}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" />
                {offer.outbound.duration}
              </span>
              <span>
                {offer.stops === 0 ? 'Voo direto' : `${offer.stops} escala`}
              </span>
            </div>
          </div>

          <div className="relative border-t pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 size-8 sm:-top-4"
              onClick={() => onToggleFavorite(offer)}
              aria-label={
                favorite
                  ? `Remover ${offer.airline} dos favoritos`
                  : `Adicionar ${offer.airline} aos favoritos`
              }
            >
              <Heart
                className={cn(
                  'size-4',
                  favorite && 'fill-current text-rose-500',
                )}
              />
            </Button>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3" /> Nota {offer.score}
            </span>
            <p className="mt-2 text-2xl font-bold text-primary">
              {priceFormatter.format(offer.price)}
            </p>
            <p className="text-xs text-muted-foreground">total da viagem</p>
          </div>
        </div>
        <div className="grid gap-3 border-t bg-background px-5 py-4 text-sm sm:grid-cols-3 sm:px-6">
          <div className="flex items-start gap-2">
            <TicketCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{offer.fare.name}</p>
              <p className="text-xs text-muted-foreground">
                {offer.fare.cabin}
                {offer.fare.bookingClass
                  ? ` · Classe ${offer.fare.bookingClass}`
                  : ''}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Bagagem de mão</p>
              <p
                className={cn(
                  'text-xs',
                  baggageTone[offer.fare.cabinBaggage.status],
                )}
              >
                {offer.fare.cabinBaggage.description}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BaggageClaim className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Bagagem despachada</p>
              <p
                className={cn(
                  'text-xs',
                  baggageTone[offer.fare.checkedBaggage.status],
                )}
              >
                {offer.fare.checkedBaggage.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="max-w-2xl text-xs leading-5 text-muted-foreground">
            <p className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <Info className="size-3.5 text-primary" />{' '}
              {offer.priceKind === 'live'
                ? 'Preço consultado no provedor'
                : 'Estimativa demonstrativa'}
            </p>
            <p>
              {offer.priceKind === 'live' ? 'Consultado' : 'Simulada'} em{' '}
              {checkedAt}. {offer.fareNote} Confirme preço, disponibilidade e
              condições no site oficial antes de comprar.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" asChild>
              <a
                href={offer.supplier.supportUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Headphones className="size-4" /> Contatar companhia
              </a>
            </Button>
            <Button size="sm" asChild>
              <a
                href={offer.supplier.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver no site oficial <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
