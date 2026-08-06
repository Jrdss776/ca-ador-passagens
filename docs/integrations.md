# Integrações externas

Esta pasta documenta a fronteira de integrações atualizada na Sprint 6. A aplicação continua usando `mockFlightProvider` para ofertas de voo, enquanto Open-Meteo e Frankfurter fornecem informações públicas complementares.

## Regra de segurança

O Vite expõe ao navegador variáveis prefixadas com `VITE_`. Por isso, `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`, `OPENSKY_USERNAME` e `OPENSKY_PASSWORD` não podem receber esse prefixo nem ser importadas pelo código em `src/`.

As credenciais deverão ser lidas por uma futura API própria ou função serverless. Essa camada fará autenticação com o fornecedor e devolverá ao frontend somente os dados necessários.

```text
Navegador → API própria → Provider externo
                  └── credenciais server-side
```

## Providers preparados

| Provider             | Objetivo            | Autenticação prevista      | Estado             |
| -------------------- | ------------------- | -------------------------- | ------------------ |
| Amadeus Self-Service | ofertas de voos     | segredo no servidor        | backend preparado  |
| OpenSky Network      | tráfego aéreo       | conta opcional no servidor | contrato preparado |
| Open-Meteo           | previsão do tempo   | pública                    | ativa no navegador |
| Frankfurter          | conversão de moedas | pública                    | ativa no navegador |

## APIs públicas ativas

- [Open-Meteo](https://open-meteo.com/en/docs): geocodifica o destino e consulta a previsão diária de temperatura e probabilidade de chuva.
- [Frankfurter](https://frankfurter.dev/): converte a menor oferta simulada de BRL para USD e EUR usando a cotação mais recente disponível.

As duas consultas têm timeout e tratamento de falha independente. Se uma API estiver indisponível, a aplicação mantém as ofertas em reais e informa que o dado complementar não pôde ser carregado.

## Backend de dados de voo

O servidor em `server/` expõe `POST /api/flights/search`, solicita um token OAuth pelo fluxo Client Credentials e consulta o Flight Offers Search. A resposta é convertida para o mesmo contrato usado pelos cartões do frontend.

O token é mantido temporariamente em memória, as chamadas possuem timeout e as credenciais nunca são devolvidas ao navegador. Se o servidor, as credenciais ou o provedor estiverem indisponíveis, `resilientFlightProvider` usa automaticamente o provider demonstrativo.

Para ativar o ambiente de testes:

1. criar uma aplicação no portal Amadeus for Developers;
2. preencher `AMADEUS_API_KEY` e `AMADEUS_API_SECRET` no arquivo `.env` local;
3. iniciar `npm run dev:api` e `npm run dev` em terminais separados;
4. pesquisar usando cidades conhecidas ou códigos IATA de três letras.

Esta etapa consulta ofertas, mas não confirma preço final nem cria pedidos. A API Flight Offers Price será necessária antes de qualquer fluxo futuro de reserva.
