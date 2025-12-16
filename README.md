# Pokédex Reverbs

Uma aplicação full-stack de Pokémon com sistema de batalhas alimentado por IA (OpenAI GPT-4).

![Pokemon](https://img.shields.io/badge/Pokemon-FFCB05?style=for-the-badge&logo=pokemon&logoColor=3D7DCA)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
  - [Com Docker (Recomendado)](#com-docker-recomendado)
  - [Sem Docker](#sem-docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Uso](#uso)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)

## 🎮 Sobre o Projeto

**Pokédex Reverbs** é uma aplicação web completa que permite explorar informações sobre Pokémons e simular batalhas entre eles usando inteligência artificial. O projeto foi desenvolvido seguindo metodologia ágil em 5 sprints, com foco em qualidade de código, testes e boas práticas.

### Destaques

- ✨ Interface moderna com tema inspirado nos jogos Pokémon
- 🤖 Sistema de batalhas com IA (OpenAI GPT-4)
- 📊 Visualização detalhada de stats e características
- 🔍 Busca e filtros de Pokémons
- 📱 Design responsivo (mobile-first)
- 🐳 Totalmente containerizado com Docker
- 🎨 Acessibilidade (WCAG AA)

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js escalável
- **TypeScript** - Linguagem com tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript
- **OpenAI GPT-4** - IA para simulação de batalhas
- **PokeAPI** - API pública de dados de Pokémons

### Frontend
- **Next.js 14+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **React Query (TanStack Query)** - Gerenciamento de estado de servidor
- **Axios** - Cliente HTTP

### DevOps
- **Docker & Docker Compose** - Containerização
- **PostgreSQL 16** - Banco de dados em container

## 🎯 Funcionalidades

### 1. Listagem de Pokémons
- Grid responsivo com 20 Pokémons por página
- Paginação funcional
- Cards com imagem, nome, número e tipos
- Loading states com skeleton

### 2. Detalhes do Pokémon
Exibe mais de 6 características:
- Nome e ID
- Altura e Peso
- Tipos
- Habilidades
- Stats (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed)

### 3. Battle Arena
- Seleção de 2 Pokémons para batalha
- **Busca por nome** (digite ou selecione)
- Simulação com IA (GPT-4)
- Narrativa detalhada da batalha
- Histórico das últimas 10 batalhas
- Sistema de fallback (caso a IA falhe)

### 4. Persistência de Dados
- Todas as batalhas são salvas no PostgreSQL
- Histórico completo com timestamps
- Logs JSON detalhados

## 🏗️ Arquitetura

```
pokedex-reverbs/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── pokemon/      # Módulo de Pokémons
│   │   ├── battle/       # Módulo de Batalhas
│   │   ├── ai/           # Integração OpenAI
│   │   └── database/     # Configuração TypeORM
│   └── test/             # Testes unitários
│
├── frontend/             # App Next.js
│   ├── app/              # App Router (páginas)
│   ├── components/       # Componentes React
│   └── lib/              # Utilitários (API, providers)
│
├── docker/               # Dockerfiles
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── docker-compose.yml    # Orquestração de containers
```

### Fluxo de Dados

1. **Frontend** nunca chama a PokeAPI diretamente
2. Todas as requisições passam pelo **Backend**
3. **Backend** faz cache em memória dos dados da PokeAPI
4. **Batalhas** são processadas pela IA e salvas no **PostgreSQL**

## 📦 Instalação

### Pré-requisitos

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **OpenAI API Key** ([Obter chave](https://platform.openai.com/api-keys))

### Com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/pokedex-reverbs.git
cd pokedex-reverbs
```

2. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione sua chave OpenAI
# OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

3. **Suba toda a stack com Docker**
```bash
docker-compose up
```

Pronto! A aplicação estará rodando em:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api
- PostgreSQL: localhost:5432

### Sem Docker

#### Backend

1. **Instale as dependências**
```bash
cd backend
npm install
```

2. **Configure o ambiente**
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

3. **Inicie o PostgreSQL** (localmente ou Docker)
```bash
# Com Docker (apenas PostgreSQL)
docker-compose up -d postgres
```

4. **Rode as migrations**
```bash
npm run migration:run
```

5. **Inicie o servidor**
```bash
npm run start:dev
```

#### Frontend

1. **Instale as dependências**
```bash
cd frontend
npm install
```

2. **Configure o ambiente**
```bash
cp .env.local.example .env.local
# Certifique-se que NEXT_PUBLIC_API_URL aponta para o backend
```

3. **Inicie o servidor**
```bash
npm run dev
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pokedex
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
OPENAI_API_KEY=sk-proj-sua-chave-aqui
PORT=4000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🎮 Uso

### Explorar Pokémons
1. Acesse http://localhost:3000
2. Navegue pela lista de Pokémons
3. Clique em um card para ver detalhes

### Simular Batalhas
1. Acesse http://localhost:3000/battle
2. Digite ou selecione o **Pokémon 1**
3. Digite ou selecione o **Pokémon 2**
4. Clique em **"⚔️ Iniciar Batalha!"**
5. Veja a narrativa gerada pela IA

### Visualizar Histórico
- O histórico das últimas 10 batalhas aparece automaticamente na página Battle Arena

## 🧪 Testes

### Backend
```bash
cd backend

# Rodar todos os testes
npm run test

# Testes em watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov
```

### Frontend
```bash
cd frontend

# Rodar testes
npm run test
```

## 📚 API Endpoints

### Pokémons

**GET** `/api/pokemon`
- Query params: `limit` (1-100), `offset` (min 0)
- Retorna lista paginada de Pokémons

**GET** `/api/pokemon/:id`
- Param: `id` (número ou nome)
- Retorna detalhes completos do Pokémon

### Batalhas

**POST** `/api/battle/simulate`
- Body: `{ pokemon1Id: string, pokemon2Id: string }`
- Retorna resultado da batalha com narrativa da IA

**GET** `/api/battle/history`
- Query params: `limit` (padrão: 10)
- Retorna histórico de batalhas

## 📝 Estrutura do Projeto

```
pokedex-reverbs/
├── backend/
│   ├── src/
│   │   ├── pokemon/
│   │   │   ├── dto/
│   │   │   ├── pokemon.controller.ts
│   │   │   └── pokemon.service.ts
│   │   ├── battle/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── battle.controller.ts
│   │   │   └── battle.service.ts
│   │   ├── ai/
│   │   │   └── ai.service.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Listagem
│   │   ├── pokemon/[id]/page.tsx       # Detalhes
│   │   └── battle/page.tsx             # Battle Arena
│   ├── components/
│   │   ├── PokemonCard.tsx
│   │   └── TypeBadge.tsx
│   ├── lib/
│   │   ├── api.ts                      # Cliente HTTP
│   │   └── providers.tsx               # React Query
│   └── package.json
│
└── docker-compose.yml
```

## 🎨 Design e Acessibilidade

- Paleta de cores inspirada nos jogos Pokémon (vermelho/azul)
- Contraste WCAG AA em todos os textos
- Design responsivo (mobile, tablet, desktop)
- Loading states e skeleton loaders
- Feedback visual em todas as interações

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido com ⚡ por [Seu Nome]

---

**Pokédex Reverbs** - Desafio técnico desenvolvido com foco em qualidade, performance e boas práticas.
