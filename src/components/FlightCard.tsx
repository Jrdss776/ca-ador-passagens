import { Heart, Luggage, Plane, Timer } from 'lucide-react';
import type { FlightOffer } from '../types/flight';

type Props = { offer: FlightOffer; onFavorite: (offer: FlightOffer) => void; favorite: boolean };
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function FlightCard({ offer, onFavorite, favorite }: Props) {
  return <article className="flight-card">
    <div className="flight-top"><span className="tag">{offer.tag}</span><button className="heart" onClick={() => onFavorite(offer)} aria-label="Favoritar"><Heart fill={favorite ? 'currentColor' : 'none'} size={20}/></button></div>
    <div className="flight-main"><div><strong>{offer.airline}</strong><small>{offer.flightNumber}</small></div><div className="route"><b>{new Date(offer.departure).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</b><span><Plane size={18}/>{offer.stops ? `${offer.stops} escala` : 'Direto'}</span><b>{new Date(offer.arrival).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</b></div><div className="price"><del>{money(offer.originalPrice)}</del><strong>{money(offer.price)}</strong><small>por passageiro</small></div></div>
    <div className="flight-meta"><span><Timer size={16}/>{offer.duration}</span><span><Luggage size={16}/>{offer.baggageIncluded ? 'Bagagem incluída' : 'Sem bagagem'}</span><span>Nota {offer.score}/100</span></div>
    <div className="source">{offer.source} · preço estimado, confirme antes da compra.</div>
  </article>;
}
