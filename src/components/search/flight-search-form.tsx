import {
  ArrowRightLeft,
  CircleAlert,
  CalendarDays,
  LoaderCircle,
  Search,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { AirportField } from '@/components/search/airport-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateFlightSearch } from '@/lib/search-validation';
import type { CabinClass, FlightSearchParams } from '@/types/flight';

interface FlightSearchFormProps {
  loading: boolean;
  onSearch: (params: FlightSearchParams) => void;
}

const today = new Date().toISOString().split('T')[0];

export function FlightSearchForm({ loading, onSearch }: FlightSearchFormProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [validationError, setValidationError] = useState('');

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const validation = validateFlightSearch({
      origin: String(data.get('origin')),
      destination: String(data.get('destination')),
      departureDate: String(data.get('departureDate')),
      returnDate: String(data.get('returnDate')),
      travelers: Number(data.get('travelers')),
      cabinClass: String(data.get('cabinClass')) as CabinClass,
      flexibleDates: data.get('flexibleDates') === 'on',
    });

    if (!validation.ok) {
      setValidationError(validation.error);
      return;
    }

    setValidationError('');
    onSearch(validation.value);
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
            <AirportField
              id="origin"
              name="origin"
              label="Origem"
              placeholder="Ex.: São Paulo ou SAO"
              value={origin}
              onChange={setOrigin}
            />

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

            <AirportField
              id="destination"
              name="destination"
              label="Destino"
              placeholder="Ex.: Recife ou REC"
              value={destination}
              onChange={setDestination}
            />
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
                  value={departureDate}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setDepartureDate(nextDate);
                    if (returnDate && returnDate < nextDate) setReturnDate('');
                  }}
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
                  min={departureDate || today}
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
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

          {validationError && (
            <div
              className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
              role="alert"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {validationError}
            </div>
          )}

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
