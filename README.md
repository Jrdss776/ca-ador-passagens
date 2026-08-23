# Caçador de Passagens

Mini app React + TypeScript para pesquisa de passagens, com modo demonstração e arquitetura preparada para APIs públicas.

## Executar

```bash
npm install
npm run dev
```

## Sprint 2

- pesquisa responsiva e validação básica;
- navegação funcional entre Busca, Histórico, Datas flexíveis e Favoritos;
- histórico das 20 pesquisas mais recentes no dispositivo;
- repetição de uma pesquisa anterior;
- comparação visual de sete datas próximas;
- ordenação por preço, custo-benefício e duração;
- favoritos persistidos no LocalStorage.

Os resultados continuam explicitamente simulados. Nenhuma compra, login ou pagamento é realizado no aplicativo.

## Dados públicos do destino

- localização e previsão do tempo via Open-Meteo;
- feriados nacionais via Nager.Date;
- nenhuma chave de API necessária;
- falhas desses serviços não interrompem a pesquisa de tarifas.

## Sprint 3 — aeroportos e rotas

- autocomplete por cidade, nome, IATA ou ICAO;
- principais aeroportos brasileiros com dados derivados do OurAirports;
- aeroportos alternativos em um raio de até 250 km;
- pesquisa de ida ou ida e volta;
- tarifas demonstrativas ajustadas ao tipo de viagem.
