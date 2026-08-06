import { ArrowRightLeft, CalendarDays, MapPin, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const today = new Date().toISOString().split('T')[0];

export function FlightSearchForm() {
  return (
    <Card
      id="buscar"
      className="relative -mt-14 scroll-mt-24 border-0 shadow-xl ring-1 ring-border"
    >
      <CardHeader className="gap-1 pb-5">
        <CardTitle className="text-2xl">Para onde vamos?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha os dados da viagem. A consulta de ofertas será ativada na
          Sprint 3.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" aria-label="Pesquisa de passagens">
          <fieldset className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <legend className="sr-only">Trecho da viagem</legend>
            <div className="grid gap-2">
              <Label htmlFor="origin">Origem</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="origin"
                  name="origin"
                  placeholder="Cidade ou aeroporto"
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="hidden rounded-full lg:inline-flex"
              aria-label="Inverter origem e destino"
              disabled
            >
              <ArrowRightLeft className="size-4" />
            </Button>

            <div className="grid gap-2">
              <Label htmlFor="destination">Destino</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Cidade ou aeroporto"
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <legend className="sr-only">Datas e preferências</legend>
            <div className="grid gap-2">
              <Label htmlFor="departure">Ida</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="departure"
                  name="departure"
                  type="date"
                  min={today}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="return">Volta</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <Input
                  id="return"
                  name="return"
                  type="date"
                  min={today}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="travelers">Viajantes</Label>
              <select
                id="travelers"
                name="travelers"
                className="h-11 rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option>1 adulto</option>
                <option>2 adultos</option>
                <option>3 adultos</option>
                <option>4 adultos</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cabin">Classe</Label>
              <select
                id="cabin"
                name="cabin"
                className="h-11 rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option>Econômica</option>
                <option>Econômica premium</option>
                <option>Executiva</option>
                <option>Primeira classe</option>
              </select>
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-4 accent-primary" />
              Tenho flexibilidade nas datas
            </label>
            <Button
              type="button"
              className="h-11 sm:min-w-44"
              disabled
              title="Disponível na Sprint 3"
            >
              <Search className="size-4" />
              Buscar passagens
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
