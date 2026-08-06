# Caçador de Passagens

Mini app para planejamento e comparação de passagens. A base técnica da Sprint 1 e a interface da **Sprint 2** estão concluídas. O formulário ainda não consulta ofertas: dados simulados, motor de busca e integrações não fazem parte desta versão.

## Tecnologias

- React 18 + Vite 5 + TypeScript;
- Tailwind CSS;
- shadcn/ui, com aliases e componentes base configurados;
- ESLint e Prettier;
- tema claro/escuro com preferência persistida.
- página inicial e formulário responsivo de pesquisa.

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

## Comandos disponíveis

| Comando                | Finalidade                                 |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | inicia o ambiente local                    |
| `npm run build`        | valida tipos e gera a versão de produção   |
| `npm run preview`      | abre localmente o build gerado             |
| `npm run lint`         | executa as regras de qualidade             |
| `npm run format`       | formata o código                           |
| `npm run format:check` | verifica a formatação sem alterar arquivos |
| `npm run typecheck`    | valida os tipos TypeScript                 |

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

Copie `.env.example` para `.env`. Nesta sprint existe apenas `VITE_APP_NAME`, sem credenciais ou chamadas externas. Nunca envie o arquivo `.env` ao repositório.

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

## Próxima etapa

A Sprint 3 implementará o contrato `FlightProvider`, um provider mock, resultados simulados, filtros e ordenação. Nenhuma API ou busca real foi adicionada nesta entrega.
