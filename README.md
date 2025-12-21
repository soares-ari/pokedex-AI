# Pokédex Reverbs - Teste Técnico

Uma aplicação full-stack de Pokémon com sistema de batalhas alimentado por IA, desenvolvida como resposta ao desafio técnico da Reverbs.

![Pokemon](https://img.shields.io/badge/Pokemon-FFCB05?style=for-the-badge&logo=pokemon&logoColor=3D7DCA)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

## 📋 Índice

- [Atendimento aos Requisitos do Desafio](#-atendimento-aos-requisitos-do-desafio)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Instalação e Execução](#-instalação-e-execução)
  - [Com Docker (Recomendado)](#com-docker-recomendado)
  - [Sem Docker](#sem-docker)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Uso da Aplicação](#-uso-da-aplicação)
- [Arquitetura e Decisões Técnicas](#%EF%B8%8F-arquitetura-e-decisões-técnicas)
- [API Endpoints](#-api-endpoints)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## ✅ Atendimento aos Requisitos do Desafio

### 🎯 Objetivo Geral
**✓ Criar uma aplicação capaz de exibir pokémons, visualizar detalhes individuais e realizar simulações de batalha entre dois pokémons, registrando o resultado em banco de dados.**

- ✅ **Listagem de Pokémons**: Grid paginado com 20 pokémons por página
- ✅ **Detalhes individuais**: Página dedicada mostrando 10+ características de cada pokémon
- ✅ **Simulação de batalhas**: Sistema completo com IA (OpenAI GPT-4)
- ✅ **Persistência**: Todas as batalhas são registradas no PostgreSQL

---

### 🧩 Requisitos da API (Backend)

#### ✅ Consumir a PokeAPI e tratar os dados
- Backend implementado em **NestJS** (tecnologia permitida)
- Módulo `PokemonService` consome a PokeAPI via HTTP
- **Cache em memória (Map)** para evitar chamadas repetidas
- Transformação completa dos dados antes de enviar ao frontend

**Arquivos relevantes:**
- [`backend/src/pokemon/pokemon.service.ts`](backend/src/pokemon/pokemon.service.ts) - Consumo da PokeAPI com cache

#### ✅ Servir integralmente o frontend
- **Frontend NUNCA acessa a PokeAPI diretamente**
- Todo o fluxo passa pelo backend: `PokeAPI → Backend → Frontend`
- Endpoints REST próprios com validação e tipagem

**Arquivos relevantes:**
- [`backend/src/pokemon/pokemon.controller.ts`](backend/src/pokemon/pokemon.controller.ts) - Endpoints de pokémons
- [`backend/src/battle/battle.controller.ts`](backend/src/battle/battle.controller.ts) - Endpoints de batalha

#### ✅ Integrar com IA para simulação de batalhas
- Integração com **OpenAI GPT-4** via SDK oficial
- Módulo dedicado `AiService` para comunicação com a IA
- Sistema de fallback caso a IA falhe

**Arquivos relevantes:**
- [`backend/src/ai/ai.service.ts`](backend/src/ai/ai.service.ts) - Integração OpenAI GPT-4

#### ✅ Simular batalhas entre pokémons
- Lógica de batalha coordenada pelo `BattleService`
- IA analisa tipos, stats, vantagens elementais
- Narrativa detalhada gerada pela IA
- Sistema de fallback com cálculo por stats

**Arquivos relevantes:**
- [`backend/src/battle/battle.service.ts`](backend/src/battle/battle.service.ts) - Orquestração de batalhas
- [`backend/src/battle/helpers/battle-fallback.helper.ts`](backend/src/battle/helpers/battle-fallback.helper.ts) - Lógica fallback

#### ✅ Registrar resultados no banco de dados
- PostgreSQL com TypeORM
- Tabela `battles` com migrations versionadas
- Campos: pokémons envolvidos, vencedor, timestamp, log completo (JSON)

**Arquivos relevantes:**
- [`backend/src/database/entities/battle.entity.ts`](backend/src/database/entities/battle.entity.ts) - Entity TypeORM
- [`backend/src/database/migrations/`](backend/src/database/migrations/) - Migrations

---

### 🖥️ Requisitos do Frontend

#### ✅ Consumir exclusivamente a API própria
- Cliente HTTP configurado em `lib/api.ts`
- **Zero referências à PokeAPI** no código frontend
- Toda comunicação via `http://localhost:4000/api`

**Arquivos relevantes:**
- [`frontend/lib/api.ts`](frontend/lib/api.ts) - Cliente API com Axios

#### ✅ Tratamento e validação dos dados
- TypeScript strict mode habilitado
- Interfaces tipadas para todas as respostas
- Validação com React Query (TanStack Query)
- Estados de loading, error e success

#### ✅ Páginas obrigatórias

**1. Página de listagem de pokémons (paginada)**
- ✅ Grid responsivo com 20 pokémons por página
- ✅ Paginação funcional (anterior/próxima)
- ✅ Cards com imagem, nome, número e tipos

**Arquivos relevantes:**
- [`frontend/app/page.tsx`](frontend/app/page.tsx) - Página de listagem

**2. Página individual com 6+ características**
- ✅ **10 características exibidas**: Nome, ID, Altura, Peso, Tipos (2), Habilidades (3+), Stats (6)
- ✅ Imagem oficial de alta qualidade
- ✅ Visualização de stats com barras de progresso

**Arquivos relevantes:**
- [`frontend/app/pokemon/[id]/page.tsx`](frontend/app/pokemon/[id]/page.tsx) - Página de detalhes

**3. Página de batalha**
- ✅ Seleção de 2 pokémons (dropdown com busca)
- ✅ Simulação com IA
- ✅ Exibição do resultado (vencedor + narrativa)
- ✅ Histórico das últimas 10 batalhas

**Arquivos relevantes:**
- [`frontend/app/battle/page.tsx`](frontend/app/battle/page.tsx) - Battle Arena

---

### 📦 Banco de Dados

#### ✅ PostgreSQL com dados completos de batalha
- **Tecnologia escolhida**: PostgreSQL 16
- **ORM**: TypeORM
- **Migrations**: Versionadas e reproduzíveis

**Campos armazenados:**
- ✅ `pokemon1Id` e `pokemon1Name`
- ✅ `pokemon2Id` e `pokemon2Name`
- ✅ `winnerId` e `winnerName`
- ✅ `createdAt` (timestamp automático)
- ✅ `battleLog` (JSON com reasoning, narrativa e stats completos)

**Arquivos relevantes:**
- [`backend/src/database/entities/battle.entity.ts`](backend/src/database/entities/battle.entity.ts)

---

### 🤖 Inteligência Artificial

#### ✅ Integração com OpenAI GPT-4
- **Modelo**: `gpt-4`
- **Temperature**: `0.3` (respostas determinísticas)
- **Prompt engineering**: Regras explícitas para formato JSON
- **Validação rigorosa**: Campo `winner` deve ser exatamente "pokemon1" ou "pokemon2"
- **Análise completa**: Tipos, stats, vantagens elementais, velocidade

**Exemplo de prompt:**
```
Analise a batalha considerando:
1. Vantagens/desvantagens de tipos elementais
2. Estatísticas base (HP, Attack, Defense, Speed)
3. Velocidade (quem ataca primeiro)
4. Resistências e fraquezas

Retorne JSON com: winner, reasoning, battleNarrative
```

**Arquivos relevantes:**
- [`backend/src/ai/ai.service.ts`](backend/src/ai/ai.service.ts:58-182)

---

## 🎮 Sobre o Projeto

**Pokédex Reverbs** é uma aplicação web completa desenvolvida em **5 sprints** seguindo metodologia ágil, com foco em:

- 📐 **Arquitetura modular** (NestJS modules pattern)
- 🧪 **Testes automatizados** (Jest)
- 🔒 **Segurança** (validação de DTOs, CORS configurado)
- ♿ **Acessibilidade** (WCAG AA)
- 🐳 **DevOps** (Docker Compose para desenvolvimento local)
- 📝 **Documentação** (código auto-documentado + README detalhado)

### Destaques Técnicos

- ✨ **Interface moderna** com tema Pokémon (paleta vermelho/azul/amarelo)
- 🤖 **IA com validação rigorosa** (temperatura 0.3, formato JSON estrito)
- 📊 **Visualização de stats** com barras de progresso animadas
- 🔍 **Busca inteligente** com lazy loading (suporta 1350+ pokémons)
- 📱 **Design responsivo** (mobile-first)
- 🐳 **Totalmente containerizado** (3 serviços: PostgreSQL, Backend, Frontend)
- 🎨 **TypeBadges** com cores oficiais dos tipos Pokémon

---

## 🚀 Tecnologias Utilizadas

### Backend (NestJS)
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **NestJS** | 10.x | Framework principal (escolha do desafio) |
| **TypeScript** | 5.x | Tipagem estática |
| **PostgreSQL** | 16.x | Banco de dados (escolha do desafio) |
| **TypeORM** | 0.3.x | ORM para TypeScript/JavaScript |
| **OpenAI** | 4.x | SDK oficial da OpenAI |
| **Axios** | 1.x | Cliente HTTP para PokeAPI |
| **class-validator** | 0.14.x | Validação de DTOs |
| **Jest** | 29.x | Framework de testes |

### Frontend (Next.js)
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 15.x | Framework React (escolha do desafio) |
| **React** | 19.x | Biblioteca UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.x | Framework CSS utility-first |
| **React Query** | 5.x | Gerenciamento de estado de servidor |
| **Axios** | 1.x | Cliente HTTP |

### DevOps
- **Docker** & **Docker Compose** - Containerização completa
- **PostgreSQL 16** - Banco de dados em container

---

## 🎯 Funcionalidades

### 1. Listagem de Pokémons
- ✅ Grid responsivo (1-4 colunas conforme tela)
- ✅ 20 pokémons por página
- ✅ Paginação (anterior/próxima + contador)
- ✅ Cards com hover effects
- ✅ Botão "Batalhar" em cada card
- ✅ Loading states com skeleton loaders

### 2. Detalhes do Pokémon
**10 características exibidas:**
1. Nome (capitalizado)
2. ID (formato #001)
3. Altura (em metros)
4. Peso (em quilogramas)
5. Tipo primário
6. Tipo secundário (se houver)
7-9. Habilidades (3+)
10-15. Stats completos (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed)

**Extras:**
- Total de stats calculado
- Barras de progresso para visualização
- Imagem oficial de alta qualidade

### 3. Battle Arena
- ✅ Input de busca com autocomplete
- ✅ Dropdown com lazy loading (até 1350 pokémons)
- ✅ Busca por nome ou ID
- ✅ Validação (não permite mesmo pokémon)
- ✅ Simulação com IA (GPT-4)
- ✅ Narrativa épica da batalha
- ✅ Explicação técnica do vencedor
- ✅ Histórico expansível das últimas 10 batalhas
- ✅ Avatares dos pokémons no histórico

### 4. Persistência de Dados
- ✅ Todas as batalhas salvas no PostgreSQL
- ✅ Histórico completo com timestamps
- ✅ Logs JSON detalhados (reasoning, narrativa, stats)
- ✅ UUID como chave primária

---

## 📦 Instalação e Execução

### Pré-requisitos

- ✅ **Node.js** 20+ ([Download](https://nodejs.org/))
- ✅ **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- ✅ **OpenAI API Key** ([Obter chave](https://platform.openai.com/api-keys))

---

### Com Docker (Recomendado)

Este é o método mais rápido para rodar o projeto localmente.

#### 1. Clone o repositório

```bash
git clone https://github.com/soares-ari/pokedex-AI.git
cd pokedex-AI
```

#### 2. Configure as variáveis de ambiente

```bash
# Crie o arquivo .env na raiz do projeto
cp .env.example .env

# Edite o arquivo .env e adicione sua chave OpenAI
# OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

> **⚠️ IMPORTANTE**: Sem a chave da OpenAI, as batalhas usarão apenas a lógica de fallback (cálculo por stats).

#### 3. Suba toda a stack com Docker Compose

```bash
docker-compose up
```

**Aguarde os 3 serviços iniciarem:**
- ✅ PostgreSQL (porta 5432)
- ✅ Backend NestJS (porta 4000)
- ✅ Frontend Next.js (porta 3000)

#### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **PostgreSQL**: `postgresql://postgres:postgres@localhost:5432/pokedex`

#### 5. Parar os serviços

```bash
# Parar containers (mantém dados do PostgreSQL)
docker-compose down

# Parar e remover volumes (apaga banco de dados)
docker-compose down -v
```

---

### Sem Docker

Se preferir rodar os serviços manualmente (útil para desenvolvimento).

#### Backend

##### 1. Instale as dependências

```bash
cd backend
npm install
```

##### 2. Configure o ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

**Arquivo `.env` do backend:**
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pokedex
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
OPENAI_API_KEY=sk-proj-sua-chave-aqui
PORT=4000
NODE_ENV=development
```

##### 3. Inicie o PostgreSQL

```bash
# Opção 1: PostgreSQL via Docker (recomendado)
docker-compose up -d postgres

# Opção 2: PostgreSQL instalado localmente
# Certifique-se de que está rodando na porta 5432
```

##### 4. Rode as migrations

```bash
npm run migration:run
```

##### 5. Inicie o servidor

```bash
npm run start:dev
```

**Backend estará rodando em**: http://localhost:4000

---

#### Frontend

##### 1. Instale as dependências

```bash
cd frontend
npm install
```

##### 2. Configure o ambiente

```bash
cp .env.local.example .env.local
```

**Arquivo `.env.local` do frontend:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

##### 3. Inicie o servidor

```bash
npm run dev
```

**Frontend estará rodando em**: http://localhost:3000

---

## 🗄️ Configuração do Banco de Dados

### Estrutura da Tabela `battles`

```sql
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pokemon1Id VARCHAR NOT NULL,
  pokemon1Name VARCHAR NOT NULL,
  pokemon2Id VARCHAR NOT NULL,
  pokemon2Name VARCHAR NOT NULL,
  winnerId VARCHAR NOT NULL,
  winnerName VARCHAR NOT NULL,
  battleLog JSONB NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Migrations

As migrations são versionadas e executadas automaticamente no Docker. Para rodar manualmente:

```bash
cd backend

# Criar nova migration
npm run migration:generate -- -n NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

### Acessar PostgreSQL diretamente

```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d pokedex

# Via cliente local
psql postgresql://postgres:postgres@localhost:5432/pokedex
```

**Comandos úteis:**
```sql
-- Listar todas as batalhas
SELECT * FROM battles ORDER BY "createdAt" DESC LIMIT 10;

-- Ver detalhes de uma batalha específica
SELECT * FROM battles WHERE id = 'uuid-aqui';

-- Contar total de batalhas
SELECT COUNT(*) FROM battles;
```

---

## 🔐 Variáveis de Ambiente

### Backend (`.env`)

| Variável | Obrigatório | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `DATABASE_URL` | ✅ | - | URL de conexão PostgreSQL |
| `POKEAPI_BASE_URL` | ✅ | `https://pokeapi.co/api/v2` | Base URL da PokeAPI |
| `OPENAI_API_KEY` | ⚠️ | - | Chave da OpenAI (fallback se ausente) |
| `PORT` | ❌ | `4000` | Porta do servidor NestJS |
| `NODE_ENV` | ❌ | `development` | Ambiente de execução |

### Frontend (`.env.local`)

| Variável | Obrigatório | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:4000/api` | URL da API backend |

---

## 🎮 Uso da Aplicação

### 1. Explorar Pokémons

1. Acesse http://localhost:3000
2. Navegue pela **lista paginada** de pokémons
3. Use os botões **"Anterior"** e **"Próxima"** para mudar de página
4. Clique em qualquer **card** para ver detalhes completos

### 2. Ver Detalhes de um Pokémon

1. Na listagem, clique em um pokémon
2. Veja as **10+ características**:
   - Informações básicas (nome, ID, altura, peso)
   - Tipos elementais com badges coloridos
   - Habilidades
   - Stats completos com barras de progresso
   - Total de stats calculado
3. Clique em **"Voltar para Pokédex"** para retornar

### 3. Simular uma Batalha

1. Acesse http://localhost:3000/battle
2. **Selecione o Pokémon 1**:
   - Digite o nome ou ID
   - Selecione da lista com autocomplete
3. **Selecione o Pokémon 2** da mesma forma
4. Clique em **"⚔️ Iniciar Batalha!"**
5. Aguarde a simulação da IA (5-10 segundos)
6. Veja o resultado:
   - **Vencedor** destacado
   - **Raciocínio técnico** da IA
   - **Narrativa épica** da batalha

### 4. Visualizar Histórico de Batalhas

- O histórico aparece **automaticamente** na página Battle Arena
- Mostra as **últimas 10 batalhas**
- Clique em qualquer batalha para expandir e ver:
  - Raciocínio da IA
  - Narrativa completa
  - Data/hora da batalha

### 5. Atalho Rápido para Batalhar

- Na listagem, passe o mouse sobre um pokémon
- Clique no botão **"Batalhar"** que aparece
- Você será redirecionado para Battle Arena com esse pokémon **pré-selecionado**

---

## 🏗️ Arquitetura e Decisões Técnicas

### Princípios Arquiteturais

1. **Separação de responsabilidades** (Clean Architecture)
2. **Módulos NestJS** (Pokemon, Battle, AI, Database)
3. **DTOs para validação** (class-validator)
4. **Repositórios para dados** (TypeORM)
5. **Cache em memória** (Map para PokeAPI)
6. **Fallback estratégico** (caso IA falhe)

### Fluxo de Dados

```
┌─────────┐      ┌──────────┐      ┌──────────┐      ┌────────────┐
│ PokeAPI │ ───> │  Backend │ ───> │ Frontend │ ───> │   Usuário  │
│         │      │ (NestJS) │      │(Next.js) │      │            │
└─────────┘      └──────────┘      └──────────┘      └────────────┘
                      │
                      ▼
                 ┌──────────┐
                 │PostgreSQL│
                 │ (Battles)│
                 └──────────┘
                      ▲
                      │
                 ┌──────────┐
                 │ OpenAI   │
                 │  GPT-4   │
                 └──────────┘
```

### Regras de Negócio Implementadas

#### Backend

1. **Cache de Pokémons**: Dados da PokeAPI são cacheados em memória para reduzir latência
2. **Validação de Entrada**: Limit (1-100), Offset (≥0), Pokémon ID (number|string)
3. **Batalhas**:
   - Não permite batalha do mesmo pokémon contra si mesmo
   - Ambos os pokémons devem existir na PokeAPI
   - IA analisa tipos, stats, vantagens elementais
   - Fallback automático se IA falhar
4. **Persistência**: Todas as batalhas são salvas com log completo

#### Frontend

1. **Nunca consome PokeAPI diretamente** (regra do desafio)
2. **Validação de estados**: Loading, Error, Success
3. **UX otimizada**:
   - Skeleton loaders durante carregamento
   - Mensagens de erro amigáveis
   - Feedback visual em todas as ações
4. **Acessibilidade**: Contraste WCAG AA, labels descritivos

### Sistema de Batalha com IA

#### Prompt Engineering

A IA recebe um prompt estruturado com:
- Dados completos dos 2 pokémons (tipos, stats)
- Instruções claras de análise
- Formato JSON estrito obrigatório
- Exemplos de resposta correta

#### Validação Rigorosa

Após receber resposta da IA, o backend valida:
1. ✅ Campo `winner` é exatamente "pokemon1" ou "pokemon2"
2. ✅ Campo `reasoning` existe e não está vazio
3. ✅ Campo `battleNarrative` existe e não está vazio
4. ✅ Nome do vencedor aparece na narrativa (consistência)

**Se alguma validação falhar**: Erro é lançado e log completo é exibido.

#### Sistema de Fallback

Se a IA falhar por qualquer motivo:
1. `BattleFallbackHelper` assume o controle
2. Calcula score baseado em stats: `HP + Attack + Defense + Speed`
3. Aplica multiplicador por vantagem de tipo (1.5x)
4. Gera narrativa básica mas funcional

---

## 🌐 API Endpoints

### Pokémons

#### `GET /api/pokemon`

Retorna lista paginada de pokémons.

**Query Parameters:**
- `limit` (number, 1-100): Quantidade de pokémons por página (padrão: 20)
- `offset` (number, ≥0): Offset para paginação (padrão: 0)

**Exemplo:**
```bash
GET http://localhost:4000/api/pokemon?limit=20&offset=0
```

**Resposta:**
```json
{
  "count": 1350,
  "next": "http://localhost:4000/api/pokemon?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "types": ["grass", "poison"],
      "image": "https://raw.githubusercontent.com/..."
    }
  ]
}
```

---

#### `GET /api/pokemon/:id`

Retorna detalhes completos de um pokémon.

**Path Parameters:**
- `id` (number | string): ID numérico ou nome do pokémon

**Exemplos:**
```bash
GET http://localhost:4000/api/pokemon/25
GET http://localhost:4000/api/pokemon/pikachu
```

**Resposta:**
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "types": ["electric"],
  "abilities": ["static", "lightning-rod"],
  "stats": {
    "hp": 35,
    "attack": 55,
    "defense": 40,
    "specialAttack": 50,
    "specialDefense": 50,
    "speed": 90
  },
  "sprites": {
    "front_default": "...",
    "other": {
      "official-artwork": {
        "front_default": "..."
      }
    }
  }
}
```

---

### Batalhas

#### `POST /api/battle/simulate`

Simula uma batalha entre dois pokémons usando IA.

**Body:**
```json
{
  "pokemon1Id": "25",
  "pokemon2Id": "1"
}
```

**Validações:**
- Ambos os IDs são obrigatórios
- IDs devem ser diferentes
- Pokémons devem existir na PokeAPI

**Resposta:**
```json
{
  "battleId": "uuid-da-batalha",
  "pokemon1": {
    "id": "25",
    "name": "pikachu"
  },
  "pokemon2": {
    "id": "1",
    "name": "bulbasaur"
  },
  "winner": {
    "id": "25",
    "name": "pikachu"
  },
  "reasoning": "Pikachu tem vantagem elementar sobre Bulbasaur...",
  "battleNarrative": "A batalha começa com Pikachu atacando...",
  "createdAt": "2025-12-21T19:30:00.000Z"
}
```

---

#### `GET /api/battle/history`

Retorna histórico de batalhas.

**Query Parameters:**
- `limit` (number): Quantidade de batalhas (padrão: 10)

**Exemplo:**
```bash
GET http://localhost:4000/api/battle/history?limit=10
```

**Resposta:**
```json
{
  "total": 156,
  "battles": [
    {
      "id": "uuid",
      "pokemon1Id": "25",
      "pokemon1Name": "pikachu",
      "pokemon1Image": "...",
      "pokemon2Id": "1",
      "pokemon2Name": "bulbasaur",
      "pokemon2Image": "...",
      "winnerId": "25",
      "winnerName": "pikachu",
      "createdAt": "2025-12-21T19:30:00.000Z",
      "battleLog": {
        "reasoning": "...",
        "battleNarrative": "..."
      }
    }
  ]
}
```

---

## 🧪 Testes

### Backend

```bash
cd backend

# Rodar todos os testes
npm run test

# Testes em watch mode
npm run test:watch

# Cobertura de testes (target: 50%+)
npm run test:cov
```

**Testes implementados:**
- ✅ Unit tests para `PokemonService`
- ✅ Unit tests para `BattleService`
- ✅ Unit tests para `AiService`
- ✅ Integration tests para controllers

### Frontend

```bash
cd frontend

# Rodar testes
npm run test
```

---

## 📝 Estrutura do Projeto

```
pokedex-reverbs/
│
├── backend/                          # API NestJS
│   ├── src/
│   │   ├── pokemon/                  # Módulo Pokémon
│   │   │   ├── dto/
│   │   │   │   ├── pokemon-list.dto.ts
│   │   │   │   └── pokemon-detail.dto.ts
│   │   │   ├── pokemon.controller.ts
│   │   │   ├── pokemon.service.ts
│   │   │   └── pokemon.module.ts
│   │   │
│   │   ├── battle/                   # Módulo Batalha
│   │   │   ├── dto/
│   │   │   │   ├── battle-simulate.dto.ts
│   │   │   │   ├── battle-result.dto.ts
│   │   │   │   └── battle-history.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── battle.entity.ts
│   │   │   ├── helpers/
│   │   │   │   └── battle-fallback.helper.ts
│   │   │   ├── battle.controller.ts
│   │   │   ├── battle.service.ts
│   │   │   └── battle.module.ts
│   │   │
│   │   ├── ai/                       # Módulo IA (OpenAI)
│   │   │   ├── ai.service.ts
│   │   │   └── ai.module.ts
│   │   │
│   │   ├── database/                 # Configuração TypeORM
│   │   │   ├── entities/
│   │   │   ├── migrations/
│   │   │   └── database.module.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # App Next.js
│   ├── app/
│   │   ├── layout.tsx                # Layout global
│   │   ├── page.tsx                  # Listagem (/)
│   │   ├── pokemon/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Detalhes (/pokemon/25)
│   │   └── battle/
│   │       └── page.tsx              # Battle Arena (/battle)
│   │
│   ├── components/
│   │   ├── PokemonCard.tsx           # Card na listagem
│   │   ├── PokemonSearchInput.tsx    # Input de busca
│   │   └── TypeBadge.tsx             # Badge de tipo
│   │
│   ├── lib/
│   │   ├── api.ts                    # Cliente HTTP + tipos
│   │   └── providers.tsx             # React Query provider
│   │
│   ├── .env.local.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docker/                           # Dockerfiles
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
├── docker-compose.yml                # Orquestração completa
├── .env.example                      # Template de variáveis
└── README.md                         # Este arquivo
```

---

## 🎨 Design e Acessibilidade

### Paleta de Cores

Inspirada na identidade visual dos jogos Pokémon:

- **Vermelho**: `#E3350D` (Pokébola, botões primários)
- **Azul**: `#0075BE` (Pokébola, botões secundários)
- **Amarelo**: `#FFCB05` (Pikachu, destaques)
- **Cinza**: Tons de `#F3F4F6` a `#1F2937`

### Tipos Pokémon (Badges)

Cada tipo tem sua cor oficial:
- 🔥 Fire: `#F08030`
- 💧 Water: `#6890F0`
- 🌿 Grass: `#78C850`
- ⚡ Electric: `#F8D030`
- 🧊 Ice: `#98D8D8`
- ✊ Fighting: `#C03028`
- 🦠 Poison: `#A040A0`
- 🌍 Ground: `#E0C068`
- 🕊️ Flying: `#A890F0`
- 🔮 Psychic: `#F85888`
- 🐛 Bug: `#A8B820`
- 🪨 Rock: `#B8A038`
- 👻 Ghost: `#705898`
- 🐉 Dragon: `#7038F8`
- 🌑 Dark: `#705848`
- ⚙️ Steel: `#B8B8D0`
- 🧚 Fairy: `#EE99AC`

### Acessibilidade (WCAG AA)

- ✅ Contraste mínimo 4.5:1 em todos os textos
- ✅ Labels descritivos em formulários
- ✅ Estados de foco visíveis
- ✅ Hierarquia de heading (h1, h2, h3)
- ✅ Alt text em todas as imagens
- ✅ Feedback visual em ações

### Responsividade

- 📱 **Mobile** (< 640px): 1 coluna
- 📱 **Tablet** (640-1024px): 2-3 colunas
- 🖥️ **Desktop** (> 1024px): 4 colunas

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Convenção de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de build/config

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

Desenvolvido com ⚡ como resposta ao **Teste Técnico Reverbs**.

**Repositório:** [github.com/soares-ari/pokedex-AI](https://github.com/soares-ari/pokedex-AI)

---

## 🎯 Checklist do Desafio

### Requisitos da API (Backend)
- [x] Consumir a PokeAPI e tratar dados
- [x] Servir integralmente o frontend (frontend não acessa PokeAPI)
- [x] Integrar com IA (OpenAI GPT-4)
- [x] Simular batalhas entre pokémons
- [x] Registrar resultados no banco de dados

### Requisitos do Frontend
- [x] Consumir exclusivamente a API própria
- [x] Tratar e validar dados recebidos
- [x] Página de listagem de pokémons (paginada)
- [x] Página individual com 6+ características
- [x] Página de batalha com seleção e resultado

### Banco de Dados
- [x] PostgreSQL configurado
- [x] Tabela de batalhas com campos obrigatórios
- [x] Migrations versionadas

### Inteligência Artificial
- [x] Integração com OpenAI GPT-4
- [x] IA auxilia/simula batalhas
- [x] Sistema de fallback implementado

### Entrega
- [x] Repositório com código completo
- [x] README com instruções claras
- [x] Scripts para configurar banco de dados
- [x] Docker Compose para facilitar execução

---

**Pokédex Reverbs** - Desenvolvido com foco em qualidade, performance e boas práticas. ⚡🎮
