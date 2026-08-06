# Caçador de Passagens

Fundação do mini app para planejamento e comparação de passagens. Esta entrega corresponde exclusivamente à **Sprint 1**: infraestrutura, padrões visuais e componentes base. Busca, dados simulados e integrações com APIs ainda não fazem parte desta versão.

## Tecnologias

- React 18 + Vite 5 + TypeScript;
- Tailwind CSS;
- shadcn/ui, com aliases e componentes base configurados;
- ESLint e Prettier;
- tema claro/escuro com preferência persistida.

## Requisitos

- Node.js 20 ou superior;
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

## Escopo da Sprint 1

- base React + Vite + TypeScript;
- Tailwind e configuração shadcn/ui;
- ESLint e Prettier;
- organização inicial de pastas;
- ambiente documentado;
- componentes `Button` e `Card`;
- tema claro/escuro e layout responsivo principal.

## Próxima etapa

A Sprint 2 implementará a interface de pesquisa, navegação e refinamentos responsivos. Nenhuma API ou busca real foi adicionada nesta entrega.
