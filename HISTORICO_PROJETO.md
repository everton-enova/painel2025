# Histórico do Projeto - Painel IDEB Bahia

> Documento de registro de todas as decisões, implementações e ajustes realizados no projeto.
> Última atualização: 2026-08-05

---

## 1. Visão Geral

**Objetivo:** Dashboard web para acompanhamento dos indicadores educacionais (IDEB) dos municípios da Bahia.

**Stack:**
- Next.js 16.3.0 (App Router) + TypeScript
- Tailwind CSS para estilização
- Recharts para gráficos
- Deploy via Vercel (conectado ao branch `main`)
- Repositório: `everton-enova/painel2025`
- URL de produção: https://painel2025.vercel.app/

**Fonte de dados:** Google Sheets (exportação CSV) com fallback para dados mock quando a planilha não está acessível.

---

## 2. Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal (composição dos componentes)
│   └── api/dados-ideb/
│       └── route.ts          # API proxy para Google Sheets (cache 5 min)
├── components/
│   ├── Header.tsx            # Cabeçalho com título e status dos dados
│   ├── Filters.tsx           # Barra de filtros + pesquisa de município
│   ├── SummaryCards.tsx      # 5 cards KPI (IDEB, Nota Pad., Prof. MAT/LP, Ind. Rend.)
│   ├── ChartIndicador.tsx    # Gráfico individual por indicador (série histórica)
│   ├── DataTable.tsx         # Tabela de dados com ordenação
│   ├── RankingTable.tsx      # Ranking por variação 2023→2025
│   ├── EmptyState.tsx        # Estado vazio customizável
│   └── LoadingSpinner.tsx    # Indicador de carregamento
├── hooks/
│   ├── useIdebData.ts        # Hook para buscar dados da API
│   └── useFilters.ts         # Hook de estado de filtros + pesquisa
├── lib/
│   ├── normalize.ts          # Normalização de registros CSV → IdebRecord
│   ├── aggregations.ts       # Cálculos de KPI e variação
│   ├── parseCSV.ts           # Parser CSV customizado
│   ├── constants.ts          # Configuração da planilha (SHEET_ID, GIDs)
│   └── fetchSheetData.ts     # Fetch server-side com cache e fallback mock
├── types/
│   └── ideb.ts               # Tipos TypeScript (IdebRecord, FilterState, KPIData, etc.)
└── data/
    └── mock-data.ts          # Dados de demonstração (9 municípios, 2017-2025)
```

---

## 3. Modelo de Dados

### IdebRecord
| Campo | Tipo | Descrição |
|-------|------|-----------|
| ano | number | Ano da avaliação (2017, 2019, 2021, 2023, 2025) |
| codigo_municipio | string | Código IBGE do município |
| municipio | string | Nome do município |
| nte | string | Núcleo Territorial de Educação |
| rede | string | Municipal / Estadual |
| etapa | string | Anos Iniciais / Anos Finais / Ensino Médio |
| ideb | number \| null | Índice IDEB observado |
| nota_padronizada | number \| null | Nota padronizada |
| proficiencia_mat | number \| null | Proficiência em Matemática |
| proficiencia_lp | number \| null | Proficiência em Língua Portuguesa |
| indicador_rendimento | number \| null | Indicador de rendimento (fluxo) |

### FilterState
| Campo | Tipo |
|-------|------|
| municipio | string \| null |
| rede | string \| null |
| etapa | string \| null |

> **Nota:** O filtro de NTE foi removido da interface (mantido apenas nas tabelas de dados). Não há filtro de Ano — a análise é feita comparando 2023 e 2025 conjuntamente.

---

## 4. Cronologia de Implementações

### Fase 1 — Setup inicial
- Criação do projeto Next.js com TypeScript e Tailwind
- Estruturação de tipos, parser CSV, normalização de dados
- Integração com Google Sheets via exportação CSV pública
- Deploy inicial no Vercel

### Fase 2 — Correções pós-deploy
- **Vercel 404:** Build passava mas site retornava 404. Corrigido adicionando `vercel.json` com `"framework": "nextjs"`
- **GitHub vazio:** Push para `main` estava correto mas UI do GitHub cacheada — confirmado via `git log origin/main`
- **`.env.example` ignorado:** Pattern `.env*` no `.gitignore` bloqueava. Adicionada exceção `!.env.example`

### Fase 3 — Primeiro ajuste de requisitos
Solicitações do usuário:
1. ~~Remover os 3 quadros KPI iniciais~~ (posteriormente readicionados com novo design)
2. Integrar aba NTE da planilha (NTE + Cod Municipio + Municipio)
3. Incluir Ensino Médio como etapa
4. Não exibir dados no estado inicial (sem filtro selecionado)

### Fase 4 — Reestruturação do dashboard
Solicitações:
- Remover conceito de "metas"
- Sem filtro de Ano (análise conjunta 2023 × 2025, com série histórica opcional)
- "Aprendizado" = IDEB
- Cards KPI: Nota Padronizada, Proficiência MAT, Proficiência LP
- Tabelas: NTE, Município, Rede, Etapa, IDEB, Nota Pad., Prof. MAT, Prof. LP, Ind. Rendimento
- Ranking por variação: IDEB, Proficiência, Nota Padronizada, Indicador de Rendimento

### Fase 5 — Refinamento visual e funcional (atual)
Solicitações implementadas:
1. **Filtro NTE removido** — NTE mantido nas tabelas mas não como filtro
2. **Comportamento inicial:** Sem filtro → tabelas preenchidas com todos os municípios, cards e gráficos em branco
3. **Cards KPI redesenhados:** Layout mais limpo — valor 2025 em destaque + badge de variação (▲/▼) colorido + "vs 2023"
4. **Barra de pesquisa:** Campo de texto para buscar município por nome
5. **5 gráficos individuais por indicador:** Série histórica desde 2019
   - IDEB (azul)
   - Indicador de Rendimento (âmbar)
   - Nota Padronizada (roxo)
   - Proficiência Matemática (teal)
   - Proficiência Língua Portuguesa (rosa)
6. **Dados históricos expandidos:** Adicionados registros de 2019 e 2021 para todos os municípios mock

---

## 5. Situação dos Dados

### Status atual: DADOS MOCK (demonstração)

A planilha Google Sheets configurada retorna **401 (não autorizada)** porque está privada. O dashboard funciona com dados de demonstração cobrindo:
- **9 municípios:** Salvador, Feira de Santana, Vitória da Conquista, Juazeiro, Itabuna, Ilhéus, Barreiras, Lauro de Freitas, Camaçari, Teixeira de Freitas
- **Anos:** 2017, 2019, 2021, 2023, 2025 (série histórica variável por município)
- **Etapas:** Anos Iniciais, Anos Finais, Ensino Médio
- **Redes:** Municipal, Estadual

### Para conectar dados reais:
**Opção 1 — Publicar a planilha:**
1. Google Sheets → Arquivo → Compartilhar → Publicar na Web
2. Selecionar a aba correta → Publicar como CSV
3. Atualizar a URL em `src/lib/constants.ts`

**Opção 2 — API do Google Sheets:**
1. Criar projeto no Google Cloud Console
2. Habilitar Google Sheets API
3. Criar credenciais (API Key ou Service Account)
4. Configurar variáveis de ambiente no Vercel

### Campos esperados na planilha:
```
ano, codigo_municipio, municipio, rede, etapa, ideb (ou ideb_observado),
nota_padronizada, proficiencia_mat, proficiencia_lp,
indicador_rendimento (ou fluxo)
```

### Aba NTE (mapeamento):
```
codigo_municipio, municipio, nte
```

---

## 6. Configuração do Vercel

- **Framework:** Next.js (configurado em `vercel.json`)
- **Branch de deploy:** `main`
- **URL:** https://painel2025.vercel.app/
- **Variáveis de ambiente necessárias:** Nenhuma no momento (dados mock). Quando integrar com Google Sheets API, será necessário adicionar chaves de acesso.

---

## 7. Testes

O projeto possui testes unitários cobrindo:
- `__tests__/normalize.test.ts` — Parsing de decimais brasileiros, normalização de registros
- `__tests__/aggregations.test.ts` — Cálculo de KPIs e variação
- `__tests__/parseCSV.test.ts` — Parser CSV (BOM, campos entre aspas, newlines)

Executar: `npx jest`

---

## 8. Branches

| Branch | Propósito |
|--------|-----------|
| `main` | Produção (deploy automático Vercel) |
| `claude/painel-ideb-bahia-ld8bki` | Branch de desenvolvimento |

---

## 9. Pendências e Próximos Passos

- [ ] Conectar dados reais da planilha Google Sheets (publicar planilha ou configurar API)
- [ ] Validar completude dos dados (verificar se todos os municípios e etapas estão na planilha)
- [ ] Refinamentos visuais adicionais baseados em identidade visual (IDV)
- [ ] Possível adição de mais municípios nos dados mock para testes
- [ ] Considerar exportação de dados (CSV/PDF) a partir do dashboard
