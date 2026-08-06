import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { brazilianAirports, type AirportOption } from '@/data/airports';

interface AirportFieldProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function matches(option: AirportOption, query: string) {
  const searchable =
    `${option.code} ${option.city} ${option.name}`.toLocaleLowerCase('pt-BR');
  return searchable.includes(query.toLocaleLowerCase('pt-BR'));
}

export function AirportField({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
}: AirportFieldProps) {
  const [remoteOptions, setRemoteOptions] = useState<AirportOption[]>([]);
  const listId = `${id}-suggestions`;

  useEffect(() => {
    if (value.trim().length < 2) {
      setRemoteOptions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetch(`/api/locations?keyword=${encodeURIComponent(value.trim())}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : { locations: [] }))
        .then((payload: { locations: AirportOption[] }) =>
          setRemoteOptions(payload.locations),
        )
        .catch(() => setRemoteOptions([]));
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value]);

  const options = useMemo(() => {
    const local = value.trim()
      ? brazilianAirports.filter((option) => matches(option, value)).slice(0, 8)
      : brazilianAirports.slice(0, 8);
    return [...local, ...remoteOptions].filter(
      (option, index, all) =>
        all.findIndex((item) => item.code === option.code) === index,
    );
  }, [remoteOptions, value]);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="pl-10 uppercase placeholder:normal-case"
          autoComplete="off"
          list={listId}
          required
        />
        <datalist id={listId}>
          {options.map((option) => (
            <option
              key={option.code}
              value={option.code}
              label={`${option.city} — ${option.name}, ${option.country}`}
            />
          ))}
        </datalist>
      </div>
      <p className="text-xs text-muted-foreground">
        Digite uma cidade ou código IATA.
      </p>
    </div>
  );
}
