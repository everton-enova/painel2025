# Bloco de Ideias — Painel IDEB Bahia

> Última atualização: 2026-08-13

---

## 1. Gestão de tarefas e produtividade

- Analisar a possibilidade de gerar um ambiente para organizar tarefas
- Pensar em como criar o hábito de alimentar mesmo em dias caóticos
- **Status:** a definir

## 2. Unificação de projetos

- Unir o `painelsh.vercel.app` (autoria própria) com o Painel IDEB Bahia
- Avaliar escopo, arquitetura e experiência unificada
- **Status:** a definir

## 3. Dados das escolas

- Abas já subidas no Google Sheets: `AI_ESCOLA` (6.515), `AF_ESCOLA` (3.938), `EM_ESCOLA` (1.366) — total ~11.800 escolas
- Campos: `SG_UF`, `CO_MUNICIPIO`, `NO_MUNICIPIO`, `ID_ESCOLA`, `NO_ESCOLA`, `REDE` + indicadores por ano
- Fluxo: município selecionado → lista de escolas → clica na escola → cards + gráficos dela
- Dado agregado da Bahia: subido manualmente numa aba separada (sem cálculo no painel)
- Carregamento sob demanda (fetch por município) para não pesar o carregamento inicial
- **Status:** abas prontas, aguardando aba da Bahia e sinal para implementar

## 4. Mapa da Bahia pintado

- Utilizar o TopoJSON já salvo (`public/geo/ba-municipios-topo.json`)
- Analisar a possibilidade de subir dados de risco
- Pintar o mapa de acordo com os municípios e seus indicadores
- **Status:** malha pronta, implementação pendente

## 5. Design Apple

- Repensar a interface com linguagem visual inspirada na Apple
- Foco em minimalismo, tipografia, espaçamento e micro-interações
- **Status:** implementado

---

> Para adicionar uma ideia nova, peça para incluir aqui.
