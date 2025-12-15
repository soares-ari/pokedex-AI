# Backend - Pokédex Reverbs

API backend construída com NestJS para o projeto Pokédex Reverbs.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem (strict mode)
- **PostgreSQL** - Banco de dados
- **TypeORM** - ORM para PostgreSQL
- **OpenAI GPT-4** - IA para simulação de batalhas
- **PokeAPI** - API externa de pokémons

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- Chave de API OpenAI

## ⚙️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `OPENAI_API_KEY`: Sua chave da API OpenAI
- `POKEAPI_BASE_URL`: https://pokeapi.co/api/v2
- `PORT`: 4000

3. Execute as migrations:
```bash
npm run migration:run
```

## 🎮 Executando a Aplicação

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 🐳 Docker

### Subir apenas o PostgreSQL
```bash
docker-compose up -d postgres
```

### Subir todos os serviços
```bash
docker-compose up
```

## 📚 Endpoints da API

Todos os endpoints têm o prefixo `/api`.

### Pokémon
- `GET /api/pokemon?limit=20&offset=0` - Lista pokémons paginada
- `GET /api/pokemon/:id` - Detalhes de um pokémon específico

### Batalha
- `POST /api/battle/simulate` - Simula uma batalha entre dois pokémons
  - Body: `{ pokemon1Id: string, pokemon2Id: string }`
- `GET /api/battle/history?limit=10` - Histórico de batalhas

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 🗄️ Migrations

```bash
# Gerar nova migration
npm run migration:generate -- -n NomeDaMigration

# Executar migrations
npm run migration:run

# Reverter última migration
npm run migration:revert
```

## 📁 Estrutura de Módulos

```
src/
├── ai/              # Integração com OpenAI
├── battle/          # Lógica de batalhas
├── pokemon/         # Consumo da PokeAPI
├── database/        # Configuração TypeORM e entidades
├── common/          # Filtros, pipes e utilitários
├── app.module.ts    # Módulo raiz
└── main.ts          # Bootstrap da aplicação
```

## 🔒 Variáveis de Ambiente

Veja o arquivo `.env.example` para todas as variáveis necessárias.

## 📝 Observações

- O backend possui cache em memória para requisições à PokeAPI
- Todas as batalhas são salvas no banco de dados PostgreSQL
- O frontend nunca deve chamar a PokeAPI diretamente
- TypeScript está configurado em modo strict
