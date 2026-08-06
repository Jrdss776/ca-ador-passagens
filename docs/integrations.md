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
| Amadeus Self-Service | ofertas de voos     | segredo no servidor        | contrato preparado |
| OpenSky Network      | tráfego aéreo       | conta opcional no servidor | contrato preparado |
| Open-Meteo           | previsão do tempo   | pública                    | ativa no navegador |
| Frankfurter          | conversão de moedas | pública                    | ativa no navegador |

## APIs públicas ativas

- [Open-Meteo](https://open-meteo.com/en/docs): geocodifica o destino e consulta a previsão diária de temperatura e probabilidade de chuva.
- [Frankfurter](https://frankfurter.dev/): converte a menor oferta simulada de BRL para USD e EUR usando a cotação mais recente disponível.

As duas consultas têm timeout e tratamento de falha independente. Se uma API estiver indisponível, a aplicação mantém as ofertas em reais e informa que o dado complementar não pôde ser carregado.

## Ativação futura de dados de voo

1. Criar a camada de backend e seu gerenciamento de segredos.
2. Implementar autenticação, limites, timeout e tratamento de erros por provider.
3. Normalizar as respostas externas para os tipos internos do aplicativo.
4. Adicionar testes de contrato e fallback para o provider mock.
5. Ativar Amadeus e OpenSky separadamente por configuração server-side.
