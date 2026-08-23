import {describe,expect,it} from 'vitest';
import {airports,matchAirport,nearbyAirports,searchAirports} from './airports';
describe('catálogo de aeroportos',()=>{
  it('mantém códigos IATA únicos',()=>{expect(new Set(airports.map(a=>a.iata)).size).toBe(airports.length)});
  it('localiza por cidade, IATA e ICAO',()=>{expect(searchAirports('Recife')[0]?.iata).toBe('REC');expect(searchAirports('GRU')[0]?.city).toBe('São Paulo');expect(searchAirports('SBGL')[0]?.iata).toBe('GIG')});
  it('reconhece o rótulo selecionado',()=>{expect(matchAirport('São Paulo (GRU)')?.iata).toBe('GRU')});
  it('sugere aeroportos próximos sem repetir o selecionado',()=>{const gru=matchAirport('GRU')!;const nearby=nearbyAirports(gru);expect(nearby.some(item=>item.airport.iata==='CGH')).toBe(true);expect(nearby.every(item=>item.airport.iata!=='GRU'&&item.distance<=250)).toBe(true)});
});
