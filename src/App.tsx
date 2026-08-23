import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Heart,
  History,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";
import { SearchForm } from "./components/SearchForm";
import { FlightCard } from "./components/FlightCard";
import { TripContextCard } from "./components/TripContextCard";
import { mockProvider } from "./services/mockProvider";
import { getTripContext, type TripContext } from "./services/tripContext";
import type {
  FlightOffer,
  FlightSearch,
  SearchHistoryItem,
} from "./types/flight";
import "./styles.css";
type View = "search" | "history" | "calendar" | "favorites";
const read = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};
const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function App() {
  const [view, setView] = useState<View>("search");
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [tripContext, setTripContext] = useState<TripContext | null>(null);
  const [favorites, setFavorites] = useState<FlightOffer[]>(() =>
    read("favorites", []),
  );
  const [history, setHistory] = useState<SearchHistoryItem[]>(() =>
    read("searchHistory", []),
  );
  const [lastSearch, setLastSearch] = useState<FlightSearch | null>(() =>
    read("lastSearch", null),
  );
  const [sort, setSort] = useState("price");
  useEffect(
    () => localStorage.setItem("favorites", JSON.stringify(favorites)),
    [favorites],
  );
  useEffect(
    () => localStorage.setItem("searchHistory", JSON.stringify(history)),
    [history],
  );
  async function handleSearch(search: FlightSearch) {
    setView("search");
    setLoading(true);
    setContextLoading(true);
    setTripContext(null);
    setLastSearch(search);
    const [result, context] = await Promise.all([
      mockProvider.searchFlights(search),
      getTripContext(search.destination, search.departureDate),
    ]);
    setOffers(result);
    setTripContext(context);
    setLoading(false);
    setContextLoading(false);
    localStorage.setItem("lastSearch", JSON.stringify(search));
    setHistory((p) =>
      [
        {
          id: crypto.randomUUID(),
          searchedAt: new Date().toISOString(),
          search,
          resultCount: result.length,
          lowestPrice: Math.min(...result.map((x) => x.price)),
        },
        ...p,
      ].slice(0, 20),
    );
  }
  function toggleFavorite(o: FlightOffer) {
    setFavorites((p) =>
      p.some((x) => x.id === o.id) ? p.filter((x) => x.id !== o.id) : [...p, o],
    );
  }
  const sorted = useMemo(
    () =>
      [...offers].sort((a, b) =>
        sort === "duration"
          ? a.duration.localeCompare(b.duration)
          : sort === "score"
            ? b.score - a.score
            : a.price - b.price,
      ),
    [offers, sort],
  );
  return (
    <div className="app-shell">
      <header>
        <button
          className="brand brand-button"
          onClick={() => setView("search")}
        >
          <span className="logo">
            <Plane size={24} />
          </span>
          <span>
            <strong>Caçador de Passagens</strong>
            <small>Economize até na alta temporada</small>
          </span>
        </button>
        <nav aria-label="Navegação principal">
          <button
            className={view === "search" ? "active" : ""}
            onClick={() => setView("search")}
          >
            <Search size={17} />
            Buscar
          </button>
          <button
            className={view === "history" ? "active" : ""}
            onClick={() => setView("history")}
          >
            <History size={17} />
            Histórico
          </button>
          <button
            className={view === "calendar" ? "active" : ""}
            onClick={() => setView("calendar")}
          >
            <CalendarDays size={17} />
            Datas flexíveis
          </button>
          <button
            className={view === "favorites" ? "active" : ""}
            onClick={() => setView("favorites")}
          >
            <Heart size={17} />
            Favoritos <i>{favorites.length}</i>
          </button>
        </nav>
      </header>
      <main>
        {view === "search" && (
          <>
            <section className="hero">
              <div>
                <span className="eyebrow">
                  <Sparkles size={16} />
                  Busca inteligente
                </span>
                <h1>
                  Descubra rotas mais baratas sem depender de uma única
                  companhia.
                </h1>
                <p>
                  Compare datas flexíveis, aeroportos alternativos, escalas e
                  horários menos disputados.
                </p>
              </div>
              <div className="hero-stat">
                <strong>Modo demonstração</strong>
                <span>Pronto para APIs públicas</span>
              </div>
            </section>
            <SearchForm
              onSearch={handleSearch}
              loading={loading}
              initialSearch={lastSearch}
            />
            <TripContextCard context={tripContext} loading={contextLoading} />
            {lastSearch && (
              <section className="insight">
                <Sparkles size={20} />
                <div>
                  <strong>Análise da busca</strong>
                  <p>
                    {lastSearch.highSeason
                      ? "Alta temporada: ampliar datas e aceitar uma escala pode reduzir o preço."
                      : "Período regular: compare pelo menos três dias próximos."}
                  </p>
                </div>
              </section>
            )}
            <section className="results">
              <div className="results-head">
                <div>
                  <h2>Melhores opções</h2>
                  <p>
                    {offers.length
                      ? `${offers.length} ofertas simuladas encontradas`
                      : "Faça uma pesquisa para visualizar as ofertas"}
                  </p>
                </div>
                {offers.length > 0 && (
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="price">Menor preço</option>
                    <option value="score">Melhor custo-benefício</option>
                    <option value="duration">Menor duração</option>
                  </select>
                )}
              </div>
              <div className="offers">
                {sorted.map((o) => (
                  <FlightCard
                    key={o.id}
                    offer={o}
                    onFavorite={toggleFavorite}
                    favorite={favorites.some((x) => x.id === o.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
        {view === "history" && (
          <Page
            title="Histórico de pesquisas"
            subtitle="Suas últimas 20 buscas ficam apenas neste dispositivo."
          >
            {history.length ? (
              <div className="list">
                {history.map((item) => (
                  <article className="list-card" key={item.id}>
                    <div>
                      <strong>
                        {item.search.origin} → {item.search.destination}
                      </strong>
                      <p>
                        {new Date(
                          item.search.departureDate + "T12:00",
                        ).toLocaleDateString("pt-BR")}{" "}
                        · {item.search.passengers} passageiro(s) · flexibilidade
                        de {item.search.flexibility} dia(s)
                      </p>
                    </div>
                    <div className="list-action">
                      <b>A partir de {money(item.lowestPrice)}</b>
                      <button onClick={() => handleSearch(item.search)}>
                        Pesquisar novamente
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                icon={<History />}
                text="Nenhuma pesquisa realizada ainda."
              />
            )}
          </Page>
        )}
        {view === "calendar" && (
          <Page
            title="Datas flexíveis"
            subtitle="A comparação considera a flexibilidade escolhida na busca."
          >
            {lastSearch ? (
              <div className="calendar-grid">
                {[-3, -2, -1, 0, 1, 2, 3].map((delta, i) => {
                  const d = new Date(lastSearch.departureDate + "T12:00");
                  d.setDate(d.getDate() + delta);
                  const value = Math.max(
                    420,
                    (lastSearch.highSeason ? 1350 : 850) -
                      Math.abs(delta) * 38 +
                      i * 17,
                  );
                  return (
                    <button
                      key={delta}
                      onClick={() =>
                        handleSearch({
                          ...lastSearch,
                          departureDate: d.toISOString().slice(0, 10),
                        })
                      }
                    >
                      <span>
                        {d.toLocaleDateString("pt-BR", { weekday: "short" })}
                      </span>
                      <strong>
                        {d.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </strong>
                      <b>{money(value)}</b>
                    </button>
                  );
                })}
              </div>
            ) : (
              <Empty
                icon={<CalendarDays />}
                text="Faça uma busca para comparar datas próximas."
              />
            )}
          </Page>
        )}
        {view === "favorites" && (
          <Page
            title="Favoritos"
            subtitle="Ofertas salvas neste dispositivo; preços continuam sujeitos a alteração."
          >
            {favorites.length ? (
              <div className="offers">
                {favorites.map((o) => (
                  <FlightCard
                    key={o.id}
                    offer={o}
                    onFavorite={toggleFavorite}
                    favorite
                  />
                ))}
              </div>
            ) : (
              <Empty icon={<Bell />} text="Nenhuma oferta favorita ainda." />
            )}
          </Page>
        )}
      </main>
      <footer>
        Caçador de Passagens · tarifas mudam rapidamente · nenhuma compra é
        realizada dentro do aplicativo.
      </footer>
    </div>
  );
}
function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page">
      <div className="page-head">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="empty">
      {icon}
      <strong>{text}</strong>
      <button onClick={() => location.reload()}>Ir para pesquisa</button>
    </div>
  );
}
