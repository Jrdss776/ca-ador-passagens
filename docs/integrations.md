# Integrações externas

Esta pasta documenta a fronteira preparada na Sprint 5. Nenhum provider externo está ativo nesta entrega; a aplicação continua usando `mockFlightProvider`.

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
| Open-Meteo           | previsão do tempo   | pública                    | contrato preparado |
| Frankfurter          | conversão de moedas | pública                    | contrato preparado |

## Ativação futura

1. Criar a camada de backend e seu gerenciamento de segredos.
2. Implementar autenticação, limites, timeout e tratamento de erros por provider.
3. Normalizar as respostas externas para os tipos internos do aplicativo.
4. Adicionar testes de contrato e fallback para o provider mock.
5. Ativar cada integração separadamente por configuração server-side.
