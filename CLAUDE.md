# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pokédex Reverbs** - A full-stack Pokémon application built for a technical challenge. The application consists of a NestJS backend that consumes the PokeAPI, a Next.js frontend, and an AI-powered battle system using OpenAI GPT-4.

### Technology Stack

**Backend:**
- NestJS + TypeScript (strict mode)
- PostgreSQL + TypeORM
- OpenAI GPT-4 integration
- PokeAPI consumption with in-memory caching

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)

### Project Structure

```
pokedex-reverbs/
├── backend/          # NestJS API
└── frontend/         # Next.js App
```

## Architecture & Key Decisions

### Backend Architecture

The backend is organized into **4 main modules**:

1. **Pokemon Module**: Consumes PokeAPI and caches responses in memory (Map) to avoid repeated calls
2. **Battle Module**: Handles battle simulation logic and persistence
3. **AI Module**: Integrates with OpenAI GPT-4 for battle simulation
4. **Database Module**: TypeORM configuration with PostgreSQL

**Important constraints:**
- Frontend must NEVER call PokeAPI directly - all data flows through backend
- Backend treats/transforms PokeAPI data before sending to frontend
- All battle results must be persisted to PostgreSQL

### Database (PostgreSQL)

**Database System:** PostgreSQL (required)
- Managed via TypeORM migrations
- Connection configured through DATABASE_URL environment variable
- Run via Docker Compose or local PostgreSQL instance

**Battle Entity Schema:**
- `id` (uuid, primary key)
- `pokemon1Id` (varchar) - ID or name of first pokemon
- `pokemon1Name` (varchar)
- `pokemon2Id` (varchar) - ID or name of second pokemon
- `pokemon2Name` (varchar)
- `winnerId` (varchar) - ID of the winning pokemon
- `winnerName` (varchar)
- `battleLog` (jsonb) - stores detailed battle narrative and AI reasoning
- `createdAt` (timestamp)

### AI Battle System

The battle simulation uses OpenAI GPT-4 with the following approach:

**Prompt structure:**
```
Analyze two pokémons considering:
- Types and elemental advantages
- Stats (HP, Attack, Defense, Speed)
- Return JSON with: winner, reasoning, battleNarrative
```

**Fallback logic** (when AI fails):
- Calculate score: HP + Attack + Defense + Speed
- Apply type advantage multiplier
- Highest score wins

### API Endpoints

**Pokemon:**
- `GET /api/pokemon?limit=20&offset=0` - Paginated list (min 1, max 100)
- `GET /api/pokemon/:id` - Details (accepts number or name)

**Battle:**
- `POST /api/battle/simulate` - Body: `{ pokemon1Id, pokemon2Id }`
- `GET /api/battle/history?limit=10` - Recent battles

### Frontend Architecture

**Pages:**
- `/` - Pokemon listing (grid, pagination)
- `/pokemon/[id]` - Details page (min 6 characteristics displayed)
- `/battle` - Battle arena with selectors and history

**Required characteristics to display:**
- Name, ID, Height, Weight, Types, Abilities, Stats (HP, Attack, Defense, Speed)

**Key components:**
- `PokemonCard` - List view card
- `PokemonDetail` - Detail page layout
- `BattleArena` - Battle simulation UI
- `TypeBadge` - Styled type badges with Pokemon type colors

## Development Commands

### Initial Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure DATABASE_URL, POKEAPI_BASE_URL, OPENAI_API_KEY
npm run migration:run
npm run start:dev     # Runs on port 4000 (or PORT from .env)

# Frontend
cd frontend
npm install
cp .env.local.example .env.local  # Configure NEXT_PUBLIC_API_URL
npm run dev           # Runs on port 3000
```

### Docker Setup

```bash
# From project root
docker-compose up -d postgres    # Start PostgreSQL only
docker-compose up                # Start all services (PostgreSQL + Backend + Frontend)
docker-compose down              # Stop all services
docker-compose logs postgres     # View PostgreSQL logs
```

### PostgreSQL Database

```bash
# Access PostgreSQL directly (if running in Docker)
docker-compose exec postgres psql -U postgres -d pokedex

# Manual connection
psql postgresql://user:pass@localhost:5432/pokedex
```

### Testing

```bash
# Backend
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report (target: 50%+)

# Frontend
cd frontend
npm run test
```

### Database Migrations

```bash
cd backend
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
```

## Development Workflow (Sprints)

The project is designed to be built in 5 sequential sprints:

1. **Sprint 1**: Backend setup, database, modules structure
2. **Sprint 2**: Pokemon endpoints with PokeAPI integration and caching
3. **Sprint 3**: Battle system with AI integration and fallback
4. **Sprint 4**: Complete frontend with all pages
5. **Sprint 5**: Documentation, Docker Compose, E2E tests, refinements

## Important Constraints & Validations

**Pokemon endpoints:**
- Limit: min 1, max 100 (use class-validator)
- Offset: min 0
- ID parameter: accepts both number and string (pokemon name)

**Battle validations:**
- Both pokemon IDs are required
- Cannot battle the same pokemon against itself
- Both pokemons must exist in PokeAPI

**CORS:**
- Backend must enable CORS for `localhost:3000`

**Global pipes:**
- Use Global ValidationPipe for all DTOs
- Use Global Exception Filter for consistent error responses

## Cache Strategy

Pokemon data from PokeAPI is cached in-memory using a Map to avoid unnecessary API calls. Cache is at service level in PokemonService.

## Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/pokedex
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
OPENAI_API_KEY=sk-...
PORT=4000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Code Style & Standards

- TypeScript strict mode enabled
- Use class-validator and class-transformer for DTOs
- All entities use UUIDs for primary keys
- Follow NestJS module pattern (controller → service → repository)
- Frontend uses App Router (not Pages Router)
- Mobile-first responsive design
- Type colors should match official Pokemon type colors
