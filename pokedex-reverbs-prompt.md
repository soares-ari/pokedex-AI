# Prompt para Claude Code - Desenvolvimento da Pokédex Reverbs

Este documento contém os prompts estruturados em sprints para desenvolvimento da aplicação Pokédex completa usando NestJS e Next.js.

---

## 🎯 PROMPT INICIAL (Contexto Geral)

```
Você irá me auxiliar no desenvolvimento de uma aplicação Pokédex completa para um desafio técnico. A aplicação consiste em:

**Backend**: NestJS + TypeScript + PostgreSQL
**Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
**IA**: OpenAI GPT-4 para simulação de batalhas

**Requisitos principais**:
- Backend deve consumir PokeAPI e tratar dados antes de enviar ao frontend
- Frontend consome APENAS a API backend (nunca diretamente a PokeAPI)
- Sistema de batalha entre pokémons com IA
- Registro de batalhas em banco de dados PostgreSQL
- Páginas: listagem, detalhes individuais e batalha

**Estrutura de pastas desejada**:
```
pokedex-reverbs/
├── backend/          # NestJS API
└── frontend/         # Next.js App
```

Vamos desenvolver em 5 sprints. Confirme o entendimento e aguarde instruções da Sprint 1.
```

---

## 📋 SPRINT 1: Setup e Estrutura Base do Backend

```
**SPRINT 1: Configuração Backend NestJS**

Crie a estrutura inicial do backend com as seguintes especificações:

1. **Inicialização do projeto**:
   - Criar pasta `backend` e inicializar projeto NestJS
   - Configurar TypeScript com strict mode
   - Instalar dependências: @nestjs/axios, @nestjs/config, @nestjs/typeorm, pg, class-validator, class-transformer, openai

2. **Estrutura de módulos**:
   - Module: `pokemon` (consumir PokeAPI)
   - Module: `battle` (lógica de batalhas)
   - Module: `ai` (integração OpenAI)
   - Module: `database` (TypeORM + PostgreSQL)

3. **Configuração do banco de dados**:
   - Configurar TypeORM com PostgreSQL
   - Criar entity `Battle` com campos:
     * id (uuid)
     * pokemon1Id, pokemon1Name
     * pokemon2Id, pokemon2Name
     * winnerId, winnerName
     * battleLog (jsonb - detalhes da batalha)
     * createdAt
   - Gerar migration

4. **Variáveis de ambiente**:
   - Criar `.env.example` com:
     * DATABASE_URL
     * POKEAPI_BASE_URL
     * OPENAI_API_KEY
     * PORT

5. **Docker setup**:
   - Criar `docker-compose.yml` com PostgreSQL
   - Criar `Dockerfile` para o backend

6. **Configurações gerais**:
   - CORS habilitado para localhost:3000
   - Global validation pipe
   - Global exception filter

Entregue a estrutura completa com todos os arquivos de configuração e aguarde aprovação para Sprint 2.
```

---

## 📋 SPRINT 2: Implementação dos Endpoints do Pokémon

```
**SPRINT 2: Módulo Pokémon e Integração com PokeAPI**

Implemente o módulo de pokémons com os seguintes requisitos:

1. **PokemonService**:
   - Método `findAll(limit: number, offset: number)` 
     * Consumir endpoint: https://pokeapi.co/api/v2/pokemon?limit=X&offset=Y
     * Retornar lista tratada com: id, name, image, types
   
   - Método `findOne(id: string | number)`
     * Consumir endpoint: https://pokeapi.co/api/v2/pokemon/{id}
     * Retornar objeto completo com pelo menos 6 características:
       - name, id, height, weight, types, abilities, stats (hp, attack, defense, speed)
       - sprites (imagens)
   
   - Implementar cache em memória (Map) para evitar chamadas repetidas à PokeAPI
   - Tratamento de erros caso pokémon não exista

2. **DTOs**:
   - `PokemonListResponseDto`
   - `PokemonDetailResponseDto`
   - `GetPokemonsQueryDto` (com validação de limit e offset)

3. **PokemonController**:
   - GET `/api/pokemon?limit=20&offset=0` (listagem paginada)
   - GET `/api/pokemon/:id` (detalhes)
   - Documentar endpoints com comentários

4. **Testes**:
   - Criar arquivo de teste unitário para PokemonService
   - Mockar chamadas HTTP à PokeAPI
   - Testar cenários de sucesso e erro

5. **Validações**:
   - Limit: min 1, max 100
   - Offset: min 0
   - ID: pode ser número ou nome do pokémon

Entregue o módulo completo, testado e funcional. Aguarde aprovação para Sprint 3.
```

---

## 📋 SPRINT 3: Sistema de Batalhas com IA

```
**SPRINT 3: Módulo de Batalhas e Integração com OpenAI**

Implemente o sistema de batalhas com os seguintes componentes:

1. **AIService** (módulo separado):
   - Integrar com OpenAI SDK
   - Método `simulateBattle(pokemon1: PokemonData, pokemon2: PokemonData): Promise<BattleResult>`
   - Prompt para GPT-4:
     ```
     Você é um juiz de batalha Pokémon. Analise os seguintes pokémons e determine o vencedor:
     
     Pokémon 1: {name, types, stats}
     Pokémon 2: {name, types, stats}
     
     Considere: tipos, estatísticas, vantagens elementais.
     Retorne JSON: {
       winner: "pokemon1" | "pokemon2",
       reasoning: "explicação detalhada",
       battleNarrative: "narrativa da batalha"
     }
     ```
   - Implementar fallback caso IA falhe (lógica baseada em stats)

2. **BattleService**:
   - Método `simulateBattle(pokemon1Id: string, pokemon2Id: string)`
     * Buscar dados dos 2 pokémons via PokemonService
     * Chamar AIService para simular
     * Salvar resultado no banco via BattleRepository
     * Retornar resultado completo
   
   - Método `getBattleHistory(limit?: number)`
     * Retornar últimas batalhas do banco

3. **BattleController**:
   - POST `/api/battle/simulate` 
     * Body: { pokemon1Id: string, pokemon2Id: string }
   - GET `/api/battle/history?limit=10`

4. **DTOs**:
   - `SimulateBattleDto` (validar IDs obrigatórios)
   - `BattleResultDto`
   - `BattleHistoryDto`

5. **Lógica de fallback** (caso IA falhe):
   - Calcular score baseado em: HP + Attack + Defense + Speed
   - Aplicar multiplicador de vantagem de tipo
   - Pokémon com maior score vence

6. **Tratamento de erros**:
   - Validar se ambos pokémons existem
   - Validar se não são o mesmo pokémon
   - Tratar erros da API OpenAI

Entregue o sistema de batalhas completo e testado. Aguarde aprovação para Sprint 4.
```

---

## 📋 SPRINT 4: Desenvolvimento do Frontend Next.js

```
**SPRINT 4: Interface Frontend com Next.js**

Desenvolva o frontend completo com as seguintes especificações:

1. **Setup inicial**:
   - Criar projeto Next.js 14+ com App Router
   - Configurar Tailwind CSS
   - Instalar: axios, react-query (TanStack Query), lucide-react (ícones)
   - Criar `.env.local` com NEXT_PUBLIC_API_URL=http://localhost:4000/api

2. **Estrutura de pastas**:
   ```
   frontend/
   ├── app/
   │   ├── page.tsx              # Home com listagem
   │   ├── pokemon/[id]/page.tsx # Detalhes
   │   ├── battle/page.tsx       # Página de batalha
   │   └── layout.tsx            # Layout global
   ├── components/
   │   ├── PokemonCard.tsx
   │   ├── PokemonDetail.tsx
   │   ├── BattleArena.tsx
   │   └── Navbar.tsx
   ├── lib/
   │   ├── api.ts                # Cliente HTTP
   │   └── types.ts              # TypeScript interfaces
   └── hooks/
       └── usePokemon.ts
   ```

3. **Página Home (listagem)**:
   - Grid responsivo de cards de pokémons
   - Paginação (botões Anterior/Próximo)
   - Card mostra: imagem, nome, tipos
   - Click no card navega para detalhes
   - Loading state e error handling

4. **Página de Detalhes**:
   - Layout atraente com imagem grande
   - Exibir no mínimo 6 características:
     * Nome, ID, Altura, Peso
     * Tipos (com badges coloridas)
     * Habilidades
     * Stats (HP, Attack, Defense, Speed) com progress bars
   - Botão "Voltar para listagem"
   - Botão "Usar em batalha" (redireciona para /battle com query param)

5. **Página de Batalha**:
   - Dois seletores de pokémon (dropdowns ou search)
   - Botão "Iniciar Batalha"
   - Área de resultado mostrando:
     * Vencedor destacado
     * Narrativa da batalha
     * Reasoning da IA
   - Botão "Nova Batalha"
   - Seção "Histórico de Batalhas" (últimas 5)

6. **Componentes reutilizáveis**:
   - `<PokemonCard />` - card da listagem
   - `<PokemonSelect />` - dropdown de seleção
   - `<BattleResult />` - resultado visual da batalha
   - `<TypeBadge />` - badge de tipo pokémon

7. **Estilização**:
   - Design limpo e moderno
   - Cores baseadas nos tipos pokémon
   - Responsivo (mobile-first)
   - Animações sutis (hover, loading)

8. **Validações**:
   - Não permitir batalha com pokémon vazio
   - Não permitir batalha entre o mesmo pokémon
   - Feedback visual durante loading

Entregue o frontend completo e funcional. Aguarde aprovação para Sprint 5.
```

---

## 📋 SPRINT 5: Documentação, Testes e Finalização

```
**SPRINT 5: Documentação, Refinamentos e Entrega**

Finalize o projeto com os seguintes itens:

1. **README.md principal** (raiz do projeto):
   ```markdown
   # Pokédex Reverbs - Desafio Técnico
   
   ## 📋 Sobre o Projeto
   [Descrição breve]
   
   ## 🚀 Tecnologias Utilizadas
   ### Backend
   - NestJS
   - TypeScript
   - PostgreSQL
   - OpenAI GPT-4
   - TypeORM
   
   ### Frontend
   - Next.js 14
   - TypeScript
   - Tailwind CSS
   - React Query
   
   ## 📦 Estrutura do Projeto
   [Árvore de diretórios]
   
   ## ⚙️ Configuração e Instalação
   [Instruções detalhadas]
   
   ## 🎮 Funcionalidades
   [Lista com screenshots]
   
   ## 🧪 Testes
   [Como executar]
   
   ## 📝 Decisões Técnicas
   [Justificativas importantes]
   ```

2. **README.md do Backend**:
   - Variáveis de ambiente detalhadas
   - Comandos para rodar migrations
   - Endpoints da API documentados
   - Como testar os endpoints

3. **README.md do Frontend**:
   - Variáveis de ambiente
   - Scripts disponíveis
   - Estrutura de componentes

4. **Scripts de setup**:
   - `setup.sh` para Linux/Mac (automatizar instalação)
   - Instruções para Windows
   - Script de seed (opcional: popular banco com batalhas exemplo)

5. **Docker Compose completo**:
   - Serviço PostgreSQL
   - Serviço Backend
   - Serviço Frontend
   - Comando único: `docker-compose up` deve subir tudo

6. **Refinamentos**:
   - Adicionar loading skeletons
   - Melhorar mensagens de erro
   - Adicionar toast notifications
   - Otimizar imagens
   - Adicionar favicon e metadados SEO

7. **Testes adicionais**:
   - Teste E2E de um fluxo completo (listagem → detalhes → batalha)
   - Testes unitários dos services principais
   - Cobertura mínima de 50%

8. **.gitignore e limpeza**:
   - Garantir que node_modules, .env, dist/ estão no .gitignore
   - Remover console.logs desnecessários
   - Remover códigos comentados

9. **Checklist final**:
   - [ ] Projeto roda com `docker-compose up`
   - [ ] Todas as páginas funcionam
   - [ ] Batalhas são salvas no banco
   - [ ] README está completo
   - [ ] Código está organizado
   - [ ] Não há erros no console
   - [ ] Responsividade funciona

10. **Vídeo/GIF de demonstração** (opcional mas recomendado):
    - Gravar 1-2 minutos mostrando a aplicação funcionando
    - Adicionar ao README

Entregue o projeto finalizado, documentado e pronto para avaliação.
```

---

## 💡 Dicas de Uso do Prompt com Claude Code

1. **Execute uma sprint por vez**: Cole o prompt de cada sprint, valide o resultado, e só então avance
2. **Revise o código gerado**: Claude Code é excelente, mas sempre revise especialmente configurações sensíveis
3. **Teste incrementalmente**: Teste cada funcionalidade antes de avançar
4. **Adapte conforme necessário**: Se quiser mudar alguma decisão técnica, peça explicitamente
5. **Peça explicações**: Se algo não estiver claro, pergunte "Explique a decisão X"

---

## 🎯 Ordem de Execução Recomendada

1. Cole o **Prompt Inicial** → aguarde confirmação
2. Cole **Sprint 1** → valide estrutura e suba o banco
3. Cole **Sprint 2** → teste endpoints de pokémon
4. Cole **Sprint 3** → teste sistema de batalhas (precisará de chave OpenAI)
5. Cole **Sprint 4** → valide todo o frontend
6. Cole **Sprint 5** → finalize documentação

**Tempo estimado total**: 8-12 horas de desenvolvimento focado

---

## 📌 Checklist de Validação por Sprint

### Sprint 1 ✅
- [ ] Backend inicia sem erros
- [ ] PostgreSQL conecta via Docker
- [ ] Migrations rodam com sucesso
- [ ] Estrutura de pastas criada

### Sprint 2 ✅
- [ ] GET /api/pokemon retorna lista paginada
- [ ] GET /api/pokemon/:id retorna detalhes
- [ ] Cache funciona (verificar logs)
- [ ] Validações funcionam

### Sprint 3 ✅
- [ ] POST /api/battle/simulate funciona
- [ ] Batalha é salva no banco
- [ ] GET /api/battle/history retorna histórico
- [ ] Fallback funciona sem OpenAI

### Sprint 4 ✅
- [ ] Página de listagem renderiza
- [ ] Navegação para detalhes funciona
- [ ] Página de batalha funciona
- [ ] Design responsivo

### Sprint 5 ✅
- [ ] README completo
- [ ] Docker Compose sobe tudo
- [ ] Projeto funciona end-to-end
- [ ] Código limpo e organizado

---

## 🚀 Comandos Rápidos

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev

# Docker (raiz do projeto)
docker-compose up -d
```

---

**Boa sorte no desafio técnico! 🎮⚡**
