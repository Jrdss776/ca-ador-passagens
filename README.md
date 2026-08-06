# Caçador de Passagens

Mini app para planejamento e comparação de passagens. As Sprints 1 a 3 estão concluídas: base técnica, interface responsiva e motor de comparação demonstrativo. As ofertas são simuladas e nenhuma API externa é consultada nesta versão.

## Tecnologias

- React 18 + Vite 5 + TypeScript;
- Tailwind CSS;
- shadcn/ui, com aliases e componentes base configurados;
- ESLint e Prettier;
- tema claro/escuro com preferência persistida.
- página inicial e formulário responsivo de pesquisa.
- provider mock, resultados demonstrativos, filtros e ordenação.

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
- contrato `FlightProvider` desacoplado da interface;
- provider local com cinco ofertas identificadas como demonstração;
- resultados com filtros de escalas e companhia;
- ordenação por recomendação, preço ou duração.

## Próxima etapa

A Sprint 4 implementará favoritos, histórico, alertas e configurações locais. Nenhuma API real, compra ou reserva foi adicionada nesta entrega.
