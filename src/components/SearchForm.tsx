import { useState } from "react";
import { PlaneTakeoff, Search } from "lucide-react";
import type { FlightSearch } from "../types/flight";
import { AirportInput } from "./AirportInput";
type Props = {
  onSearch: (search: FlightSearch) => void;
  loading: boolean;
  initialSearch?: FlightSearch | null;
};
const defaultForm = (): FlightSearch => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return {
    origin: "São Paulo (GRU)",
    destination: "Recife (REC)",
    departureDate: d.toISOString().slice(0, 10),
    passengers: 1,
    cabin: "Econômica",
    baggage: false,
    directOnly: false,
    flexibility: 3,
    highSeason: true,
  };
};
export function SearchForm({ onSearch, loading, initialSearch }: Props) {
  const [form, setForm] = useState<FlightSearch>(
    initialSearch || defaultForm(),
  );
  const [roundTrip, setRoundTrip] = useState(
    Boolean(initialSearch?.returnDate),
  );
  const update = <K extends keyof FlightSearch>(
    key: K,
    value: FlightSearch[K],
  ) => setForm((p) => ({ ...p, [key]: value }));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(form);
  }
  return (
    <form className="search-card" onSubmit={submit}>
      <div className="section-title">
        <PlaneTakeoff size={22} />
        <div>
          <h2>Encontre a melhor tarifa</h2>
          <p>Mesmo em períodos de alta temporada</p>
        </div>
      </div>
      <div className="grid">
        <AirportInput
          label="Origem"
          value={form.origin}
          onChange={(value) => update("origin", value)}
        />
        <AirportInput
          label="Destino"
          value={form.destination}
          onChange={(value) => update("destination", value)}
        />
        <label>
          Data de ida
          <input
            type="date"
            value={form.departureDate}
            onChange={(e) => update("departureDate", e.target.value)}
            required
          />
        </label>
        {roundTrip && (
          <label>
            Data de volta
            <input
              type="date"
              min={form.departureDate}
              value={form.returnDate || ""}
              onChange={(e) => update("returnDate", e.target.value)}
              required
            />
          </label>
        )}
        <label>
          Passageiros
          <input
            type="number"
            min="1"
            max="9"
            value={form.passengers}
            onChange={(e) => update("passengers", Number(e.target.value))}
          />
        </label>
        <label>
          Classe
          <select
            value={form.cabin}
            onChange={(e) =>
              update("cabin", e.target.value as FlightSearch["cabin"])
            }
          >
            <option>Econômica</option>
            <option>Premium</option>
            <option>Executiva</option>
          </select>
        </label>
        <label>
          Flexibilidade
          <select
            value={form.flexibility}
            onChange={(e) => update("flexibility", Number(e.target.value))}
          >
            <option value="0">Data exata</option>
            <option value="1">± 1 dia</option>
            <option value="3">± 3 dias</option>
            <option value="7">± 7 dias</option>
            <option value="15">± 15 dias</option>
          </select>
        </label>
      </div>
      <div className="checks">
        <label>
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => {
              setRoundTrip(e.target.checked);
              if (!e.target.checked) update("returnDate", undefined);
            }}
          />{" "}
          Ida e volta
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.baggage}
            onChange={(e) => update("baggage", e.target.checked)}
          />{" "}
          Com bagagem
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.directOnly}
            onChange={(e) => update("directOnly", e.target.checked)}
          />{" "}
          Apenas voos diretos
        </label>
        <label className="season">
          <input
            type="checkbox"
            checked={form.highSeason}
            onChange={(e) => update("highSeason", e.target.checked)}
          />{" "}
          Modo Alta Temporada
        </label>
      </div>
      <button className="primary" disabled={loading}>
        <Search size={18} />
        {loading ? "Pesquisando..." : "Encontrar melhor oferta"}
      </button>
    </form>
  );
}
