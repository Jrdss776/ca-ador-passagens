# Publicação em produção

A Sprint 13 prepara o mini app para uma hospedagem Node.js ou para um serviço compatível com contêineres. A interface e a API são entregues pelo mesmo processo, evitando a exposição de credenciais no navegador e dispensando configuração de CORS.

## Antes de publicar

1. Execute `npm ci`, `npm test` e `npm run build`.
2. Conecte o repositório ao Render usando o arquivo `render.yaml`.
3. Mantenha `API_HOST=0.0.0.0` e use a variável `PORT` fornecida pela hospedagem.
4. Acompanhe `GET /api/health` depois da publicação.

As credenciais Amadeus são opcionais. Caso sejam obtidas futuramente, cadastre `AMADEUS_API_KEY`, `AMADEUS_API_SECRET` e `AMADEUS_API_BASE_URL` como segredos do serviço, nunca como variáveis `VITE_`.

Sem credenciais Amadeus, a aplicação continua operacional em modo demonstrativo e mostra um aviso antes das estimativas.

## Publicação simplificada no Render

1. Acesse o painel do Render e escolha **New → Blueprint**.
2. Conecte o repositório `Jrdss776/ca-ador-passagens`.
3. Selecione a branch principal e confirme o Blueprint encontrado.
4. Aguarde as verificações do GitHub e a construção da imagem.
5. Abra o endereço `onrender.com` criado pelo serviço.

O arquivo `render.yaml` usa o plano gratuito, Docker, verificação em `/api/health` e publicação somente depois que as verificações automatizadas forem aprovadas. O plano gratuito pode entrar em suspensão após períodos sem acesso.

## Execução Node.js

```bash
npm ci
npm run build
npm start
```

O processo serve os arquivos em `dist/` e as rotas `/api/*`. A porta padrão local é `8787`.

## Execução com contêiner

```bash
docker build -t cacador-passagens .
docker run --rm -p 8787:8787 --env-file .env cacador-passagens
```

O contêiner executa com usuário sem privilégios e inclui uma verificação de saúde.

## Proteções incluídas

- credenciais restritas ao servidor;
- política de segurança de conteúdo e bloqueio de incorporação em frames;
- respostas de API sem cache e limite de 16 KB para requisições JSON;
- limite básico de 60 solicitações de API por minuto por endereço;
- timeout de requisições e encerramento controlado do processo;
- assets versionados com cache longo e HTML sem cache;
- endpoint de saúde sem informações sensíveis.

O limite em memória é adequado a uma instância pequena. Em múltiplas instâncias, substitua-o por um serviço compartilhado na infraestrutura de hospedagem.

## Checklist depois da publicação

- confirmar que `/api/health` responde com `status: ok`;
- pesquisar uma rota válida e verificar se a origem da oferta está clara;
- testar os links oficiais das companhias;
- revisar os logs sem registrar tokens ou segredos;
- configurar alertas de disponibilidade e renovação de credenciais.
