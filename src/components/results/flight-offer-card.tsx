import { Clock3, Plane, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { FlightOffer } from '@/types/flight';

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function FlightOfferCard({ offer }: { offer: FlightOffer }) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="grid gap-5 p-5 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(16rem,2fr)_minmax(8rem,0.8fr)] sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {offer.airlineCode}
            </span>
            <div>
              <p className="font-semibold">{offer.airline}</p>
              <p className="text-xs text-muted-foreground">
                Oferta demonstrativa
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

          <div className="border-t pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3" /> Nota {offer.score}
            </span>
            <p className="mt-2 text-2xl font-bold text-primary">
              {priceFormatter.format(offer.price)}
            </p>
            <p className="text-xs text-muted-foreground">total da viagem</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
