import { useEffect, useState } from 'react';
import { Bell, CalendarDays, History, Plane, Settings, Sparkles } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { FlightCard } from './components/FlightCard';
import { mockProvider } from './services/mockProvider';
import type { FlightOffer, FlightSearch } from './types/flight';
import './styles.css';

export default function App() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<FlightOffer[]>(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [lastSearch, setLastSearch] = useState<FlightSearch | null>(null);

  useEffect(() => localStorage.setItem('favorites', JSON.stringify(favorites)), [favorites]);

  async function handleSearch(search: FlightSearch) {
    setLoading(true);
    setLastSearch(search);
    const result = await mockProvider.searchFlights(search);
    setOffers(result);
    setLoading(false);
    localStorage.setItem('lastSearch', JSON.stringify(search));
  }

  function toggleFavorite(offer: FlightOffer) {
    setFavorites(prev => prev.some(item => item.id === offer.id) ? prev.filter(item => item.id !== offer.id) : [...prev, offer]);
  }

  return <div className="app-shell">
    <header><div className="brand"><div className="logo"><Plane size={24}/></div><div><h1>Caçador de Passagens</h1><p>Economize até na alta temporada</p></div></div><nav><button><History size={17}/>Histórico</button><button><CalendarDays size={17}/>Calendário</button><button><Bell size={17}/>Alertas</button><button><Settings size={17}/>Integrações</button></nav></header>
    <main>
      <section className="hero"><div><span className="eyebrow"><Sparkles size={16}/>Busca inteligente</span><h2>Descubra rotas mais baratas sem depender de uma única companhia.</h2><p>Compare datas flexíveis, aeroportos alternativos, escalas e horários menos disputados.</p></div><div className="hero-stat"><strong>Modo demonstração</strong><span>Pronto para APIs públicas</span></div></section>
      <SearchForm onSearch={handleSearch} loading={loading}/>
      {lastSearch && <section className="insight"><Sparkles size={20}/><div><strong>Análise da busca</strong><p>{lastSearch.highSeason ? 'Alta temporada detectada: ampliar datas e aceitar uma escala pode reduzir bastante o preço.' : 'Período regular: compare pelo menos três dias próximos para encontrar melhores tarifas.'}</p></div></section>}
      <section className="results"><div className="results-head"><div><h2>Melhores opções</h2><p>{offers.length ? `${offers.length} ofertas simuladas encontradas` : 'Faça uma pesquisa para visualizar as ofertas'}</p></div>{offers.length > 0 && <select><option>Ordenar por menor preço</option><option>Melhor custo-benefício</option><option>Menor duração</option></select>}</div>
      <div className="offers">{offers.map(offer => <FlightCard key={offer.id} offer={offer} onFavorite={toggleFavorite} favorite={favorites.some(item => item.id === offer.id)}/>)}</div></section>
    </main>
    <footer>Caçador de Passagens · tarifas mudam rapidamente · nenhuma compra é realizada dentro do aplicativo.</footer>
  </div>;
}
