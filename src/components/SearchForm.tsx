import { useState } from 'react';
import { PlaneTakeoff, Search } from 'lucide-react';
import type { FlightSearch } from '../types/flight';

type Props = { onSearch: (search: FlightSearch) => void; loading: boolean };

export function SearchForm({ onSearch, loading }: Props) {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().slice(0, 10);
  const [form, setForm] = useState<FlightSearch>({
    origin: 'São Paulo', destination: 'Recife', departureDate: nextMonth,
    passengers: 1, cabin: 'Econômica', baggage: false, directOnly: false,
    flexibility: 3, highSeason: true
  });

  const update = <K extends keyof FlightSearch>(key: K, value: FlightSearch[K]) => setForm(prev => ({ ...prev, [key]: value }));

  return <section className="search-card">
    <div className="section-title"><PlaneTakeoff size={22}/><div><h2>Encontre a melhor tarifa</h2><p>Mesmo em períodos de alta temporada</p></div></div>
    <div className="grid">
      <label>Origem<input value={form.origin} onChange={e => update('origin', e.target.value)} /></label>
      <label>Destino<input value={form.destination} onChange={e => update('destination', e.target.value)} /></label>
      <label>Data de ida<input type="date" value={form.departureDate} onChange={e => update('departureDate', e.target.value)} /></label>
      <label>Passageiros<input type="number" min="1" max="9" value={form.passengers} onChange={e => update('passengers', Number(e.target.value))} /></label>
      <label>Classe<select value={form.cabin} onChange={e => update('cabin', e.target.value as FlightSearch['cabin'])}><option>Econômica</option><option>Premium</option><option>Executiva</option></select></label>
      <label>Flexibilidade<select value={form.flexibility} onChange={e => update('flexibility', Number(e.target.value))}><option value="0">Data exata</option><option value="1">± 1 dia</option><option value="3">± 3 dias</option><option value="7">± 7 dias</option><option value="15">± 15 dias</option></select></label>
    </div>
    <div className="checks">
      <label><input type="checkbox" checked={form.baggage} onChange={e => update('baggage', e.target.checked)} /> Com bagagem</label>
      <label><input type="checkbox" checked={form.directOnly} onChange={e => update('directOnly', e.target.checked)} /> Apenas voos diretos</label>
      <label className="season"><input type="checkbox" checked={form.highSeason} onChange={e => update('highSeason', e.target.checked)} /> Modo Alta Temporada</label>
    </div>
    <button className="primary" onClick={() => onSearch(form)} disabled={loading || !form.origin || !form.destination}><Search size={18}/>{loading ? 'Pesquisando...' : 'Encontrar melhor oferta'}</button>
  </section>;
}
