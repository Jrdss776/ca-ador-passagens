import { MapPin, Plane } from "lucide-react";
import {
  airportLabel,
  matchAirport,
  nearbyAirports,
  searchAirports,
} from "../data/airports";
export function AirportInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const suggestions = searchAirports(value);
  const selected = matchAirport(value);
  const nearby = selected ? nearbyAirports(selected) : [];
  return (
    <label className="airport-field">
      {label}
      <div className="airport-input">
        <MapPin size={17} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cidade ou código IATA"
          required
        />
      </div>
      {value && !selected && (
        <div className="airport-options">
          {suggestions.length ? (
            suggestions.map((a) => (
              <button
                type="button"
                key={a.iata}
                onClick={() => onChange(airportLabel(a))}
              >
                <Plane size={15} />
                <span>
                  <strong>
                    {a.city} · {a.iata}
                  </strong>
                  <small>
                    {a.name}, {a.state}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <p>Nenhum aeroporto encontrado.</p>
          )}
        </div>
      )}
      {selected && nearby.length > 0 && (
        <small className="nearby">
          Alternativos:{" "}
          {nearby.map(({ airport, distance }) => (
            <button
              type="button"
              key={airport.iata}
              onClick={() => onChange(airportLabel(airport))}
            >
              {airport.iata} ({distance} km)
            </button>
          ))}
        </small>
      )}
    </label>
  );
}
