import {describe,expect,it} from 'vitest';
import {createMockFlights} from './mockFlights';
import type {FlightSearch} from '../types/flight';
const search:FlightSearch={origin:'São Paulo (GRU)',destination:'Recife (REC)',departureDate:'2026-10-10',passengers:1,cabin:'Econômica',baggage:false,directOnly:false,flexibility:3,highSeason:false};
describe('ofertas demonstrativas',()=>{
  it('gera seis ofertas válidas',()=>{const offers=createMockFlights(search);expect(offers).toHaveLength(6);expect(offers.every(o=>o.price>0&&o.origin.includes('GRU')&&o.destination.includes('REC'))).toBe(true)});
  it('respeita apenas voos diretos',()=>{expect(createMockFlights({...search,directOnly:true}).every(o=>o.stops===0)).toBe(true)});
  it('considera ida e volta no preço',()=>{const oneWay=createMockFlights(search)[0].price;const roundTrip=createMockFlights({...search,returnDate:'2026-10-17'})[0].price;expect(roundTrip).toBeGreaterThan(oneWay)});
  it('reduz a estimativa quando há flexibilidade',()=>{const exact=createMockFlights({...search,flexibility:0})[0].price;const flexible=createMockFlights({...search,flexibility:7})[0].price;expect(flexible).toBeLessThan(exact)});
  it('varia por rota e data',()=>{const base=createMockFlights(search)[0].price;expect(createMockFlights({...search,destination:'Manaus (MAO)'})[0].price).not.toBe(base);expect(createMockFlights({...search,departureDate:'2026-10-17'})[0].price).not.toBe(base)});
  it('calcula o total para todos os passageiros',()=>{const offer=createMockFlights({...search,passengers:3})[0];expect(offer.totalPrice).toBe(offer.price*3)});
  it('considera a classe da cabine',()=>{const economy=createMockFlights(search)[0].price;const business=createMockFlights({...search,cabin:'Executiva'})[0].price;expect(business).toBeGreaterThan(economy)});
});
