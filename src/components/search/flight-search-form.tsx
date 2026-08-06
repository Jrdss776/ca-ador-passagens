import {
  ArrowRightLeft,
  CalendarDays,
  LoaderCircle,
  MapPin,
  Search,
} from 'lucide-react';
import { useRef, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CabinClass, FlightSearchParams } from '@/types/flight';

interface FlightSearchFormProps {
  loading: boolean;
  onSearch: (params: FlightSearchParams) => void;
}

const today = new Date().toISOString().split('T')[0];

export function FlightSearchForm({ loading, onSearch }: FlightSearchFormProps) {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  function handleSwap() {
    if (!originRef.current || !destinationRef.current) return;
    const origin = originRef.current.value;
    originRef.current.value = destinationRef.current.value;
    destinationRef.current.value = origin;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    onSearch({
      origin: String(data.get('origin')),
      destination: String(data.get('destination')),
      departureDate: String(data.get('departureDate')),
      returnDate: String(data.get('returnDate')),
      travelers: Number(data.get('travelers')),
      cabinClass: String(data.get('cabinClass')) as CabinClass,
      flexibleDates: data.get('flexibleDates') === 'on',
    });
  }

  return (
    <Card
      id="buscar"
      className="relative -mt-14 scroll-mt-24 border-0 shadow-xl ring-1 ring-border"
    >
      <CardHeader className="gap-1 pb-5">
        <CardTitle className="text-2xl">Para onde vamos?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare ofertas simuladas e descubra boas possibilidades para sua
          viagem.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          aria-label="Pesquisa de passagens"
          onSubmit={handleSubmit}
        >
          <fieldset
            className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end"
            disabled={loading}
          >
            <legend className="sr-only">Trecho da viagem</legend>
            <div className="grid gap-2">
              <Label htmlFor="origin">Origem</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  ref={originRef}
                  id="origin"
                  name="origin"
                  placeholder="Ex.: São Paulo"
                  className="pl-10"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="hidden rounded-full lg:inline-flex"
              aria-label="Inverter origem e destino"
              onClick={handleSwap}
            >
              <ArrowRightLeft className="size-4" />
            </Button>

            <div className="grid gap-2">
              <Label htmlFor="destination">Destino</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  ref={destinationRef}
                  id="destination"
                  name="destination"
                  placeholder="Ex.: Recife"
                  className="pl-10"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            disabled={loading}
          >
            <legend className="sr-only">Datas e preferências</legend>
            <div className="grid gap-2">
              <Label htmlFor="departureDate">Ida</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  min={today}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="returnDate">Volta</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="returnDate"
                  name="returnDate"
                  type="date"
                  min={today}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="travelers">Viajantes</Label>
              <select
                id="travelers"
                name="travelers"
                className="h-11 rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                defaultValue="1"
              >
                <option value="1">1 adulto</option>
                <option value="2">2 adultos</option>
                <option value="3">3 adultos</option>
                <option value="4">4 adultos</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cabinClass">Classe</Label>
              <select
                id="cabinClass"
                name="cabinClass"
                className="h-11 rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                defaultValue="economy"
              >
                <option value="economy">Econômica</option>
                <option value="premium-economy">Econômica premium</option>
                <option value="business">Executiva</option>
                <option value="first">Primeira classe</option>
              </select>
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="flexibleDates"
                className="size-4 accent-primary"
                disabled={loading}
              />
              Tenho flexibilidade nas datas
            </label>
            <Button
              type="submit"
              className="h-11 sm:min-w-44"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {loading ? 'Comparando...' : 'Buscar passagens'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
