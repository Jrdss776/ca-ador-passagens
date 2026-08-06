# Caçador de Passagens

Mini app para planejamento e comparação de passagens. As Sprints 1 a 12 estão concluídas: base técnica, interface responsiva, recursos pessoais, integrações públicas, fornecedores, backend seguro, aeroportos assistidos, validação, detalhes de tarifa e uma camada inicial de qualidade automatizada. Sem credenciais Amadeus, as ofertas continuam simuladas; clima e câmbio são consultados em APIs públicas.

## Tecnologias

- React 18 + Vite 5 + TypeScript;
- Tailwind CSS;
- shadcn/ui, com aliases e componentes base configurados;
- ESLint e Prettier;
- tema claro/escuro com preferência persistida.
- página inicial e formulário responsivo de pesquisa.
- provider mock, resultados demonstrativos, filtros e ordenação.
- favoritos, histórico, alertas e configurações persistidos localmente.
- Open-Meteo para previsão no destino e Frankfurter para conversão indicativa de moedas;
- contratos preparados para Amadeus e OpenSky, sem credenciais no navegador.

## Requisitos

- Node.js 20.19 ou superior (ou 22.12+);
- npm 10 ou superior.

## Como executar

```bash
npm install
copy .env.example .env
npm run dev
```

O servidor local usa `http://localhost:5173` por padrão. Em macOS ou Linux, substitua o segundo comando por `cp .env.example .env`.

Para testar a ponte de voos em outro terminal, execute `npm run dev:api`. Sem `AMADEUS_API_KEY` e `AMADEUS_API_SECRET`, essa API informa que o provedor não está configurado e o frontend retorna automaticamente às estimativas.

## Comandos disponíveis

| Comando                | Finalidade                                  |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | inicia o ambiente local                     |
| `npm run dev:api`      | inicia o backend de voos em desenvolvimento |
| `npm run start:api`    | inicia o backend de voos sem observação     |
| `npm test`             | executa os testes automatizados             |
| `npm run build`        | valida tipos e gera a versão de produção    |
| `npm run preview`      | abre localmente o build gerado              |
| `npm run lint`         | executa as regras de qualidade              |
| `npm run format`       | formata o código                            |
| `npm run format:check` | verifica a formatação sem alterar arquivos  |
| `npm run typecheck`    | valida os tipos TypeScript                  |

## Estrutura

```text
src/
├── components/
│   ├── layout/     # estrutura visual principal
│   ├── theme/      # provedor e controle de tema
│   └── ui/         # componentes base no padrão shadcn/ui
├── hooks/          # hooks reutilizáveis (próximas sprints)
├── lib/            # utilitários compartilhados
├── services/       # contratos e integrações futuras
├── styles/         # estilos globais e tokens do tema
└── types/          # tipos de domínio futuros
```

## Variáveis de ambiente

Copie `.env.example` para `.env`. Somente `VITE_APP_NAME` pode ser lida pelo frontend. As demais variáveis são reservadas a uma futura camada de backend e nunca devem receber o prefixo `VITE_`. Nunca envie o arquivo `.env` ao repositório.

Consulte [a documentação de integrações](docs/integrations.md) para a fronteira de segurança e os passos de ativação futura.

Consulte também [a política de links de fornecedores](docs/supplier-links.md) para entender a diferença entre estimativa, consulta oficial e compra.

## Escopo concluído

- base React + Vite + TypeScript;
- Tailwind e configuração shadcn/ui;
- ESLint e Prettier;
- organização inicial de pastas;
- ambiente documentado;
- componentes `Button` e `Card`;
- tema claro/escuro e layout responsivo principal.
- página inicial com navegação desktop e móvel;
- formulário visual de origem, destino, datas e preferências;
- seções informativas responsivas.
- contrato `FlightProvider` desacoplado da interface;
- provider local com cinco ofertas identificadas como demonstração;
- resultados com filtros de escalas e companhia;
- ordenação por recomendação, preço ou duração.
- favoritos de ofertas e histórico das oito pesquisas mais recentes;
- alertas de preço locais, com ativação, pausa e remoção;
- configurações de aeroporto, voos diretos e densidade dos resultados.
- catálogo visual de integrações e requisitos de autenticação;
- contratos tipados para quatro providers externos;
- variáveis server-side documentadas, sem segredos expostos ao Vite.
- previsão diária do destino consultada na API pública Open-Meteo;
- menor oferta convertida de BRL para USD e EUR pela API pública Frankfurter;
- tratamento independente de falhas: clima ou câmbio indisponíveis não interrompem os resultados.
- valores demonstrativos identificados como estimativas, com data e hora da simulação;
- acesso ao site e aos canais oficiais de atendimento de Azul, LATAM e GOL;
- aviso para confirmar preço, disponibilidade, bagagem e condições antes da compra.
- backend local sem dependências adicionais e com credenciais apenas no servidor;
- autenticação OAuth, cache temporário do token e consulta Flight Offers Search;
- fallback automático para estimativas quando a API não estiver configurada ou disponível.
- sugestões locais dos principais aeroportos e cidades brasileiras;
- busca por nome ou código IATA e inversão segura entre origem e destino;
- ampliação opcional das sugestões pela Airport & City Search do Amadeus.
- conversão de cidades brasileiras conhecidas para códigos IATA;
- validação de rota, ordem das datas e quantidade de viajantes no frontend e backend;
- envio da classe de cabine selecionada para a busca Amadeus.
- resumo visual da tarifa, cabine, classe de reserva e bagagens em cada oferta;
- leitura das franquias informadas pelo Amadeus, sem presumir dados ausentes;
- identificação explícita das regras simuladas e recomendação de confirmação no canal oficial.
- testes automatizados para resolução de aeroportos e regras críticas da pesquisa;
- aviso acessível quando a busca utiliza estimativas por indisponibilidade do provedor;
- estado de erro seguro, indicador de carregamento e anúncios para leitores de tela.

## Próxima etapa

O próximo ciclo será dedicado à preparação de produção, segurança operacional e publicação. O aplicativo apenas direciona aos canais oficiais: nenhuma compra, reserva ou notificação externa foi adicionada.
