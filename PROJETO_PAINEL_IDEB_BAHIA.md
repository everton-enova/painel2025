# Projeto Painel IDEB Bahia

## 1. Escopo

Construir um painel web para acompanhamento de indicadores do IDEB na Bahia, consumindo dados mantidos em uma planilha Google Sheets e apresentando filtros, cartões de resumo, tabelas e visualizações para apoiar análise técnica e tomada de decisão.

## 2. Arquitetura proposta

- **Frontend:** aplicação web responsiva.
- **Fonte de dados:** Google Sheets publicado/compartilhado para leitura.
- **Camada de integração:** consumo dos dados da planilha por endpoint CSV/JSON ou API do Google Sheets.
- **Hospedagem:** Vercel.
- **Controle de versão:** GitHub.

## 3. Estrutura dos dados

A planilha deve manter uma linha de cabeçalho e registros tabulares normalizados. Campos esperados:

- `ano`
- `codigo_municipio`
- `municipio`
- `rede`
- `etapa`
- `ideb_observado`
- `meta_ideb`
- `aprendizado`
- `fluxo`
- `status_meta`

## 4. Regras de cálculo

- O IDEB observado deve ser tratado como número decimal.
- A meta deve ser tratada como número decimal.
- O status da meta deve ser calculado como:
  - `Atingiu` quando `ideb_observado >= meta_ideb`;
  - `Não atingiu` quando `ideb_observado < meta_ideb`;
  - `Sem informação` quando algum dos valores necessários estiver ausente.
- Agregações por município, rede, etapa e ano devem ignorar registros sem valor numérico válido.

## 5. Integração com Google Sheets

- A aplicação deve ler a planilha informada nas configurações do projeto.
- Recomenda-se publicar a aba como CSV ou usar a API do Google Sheets com credenciais adequadas.
- A rotina de carga deve validar cabeçalhos, normalizar números decimais e tratar campos vazios.

## 6. Interface

A interface deve conter:

- Cabeçalho com título do painel e data da última atualização.
- Filtros por ano, município, rede e etapa.
- Cartões de indicadores principais.
- Tabela detalhada dos registros filtrados.
- Gráficos para evolução temporal e comparação com metas.
- Estados de carregamento, erro e ausência de dados.

## 7. Testes

- Testes unitários para normalização de dados e regras de cálculo.
- Testes de integração para leitura da planilha.
- Testes de interface para filtros, renderização de cartões e tabela.
- Validação manual em ambiente de preview da Vercel antes de produção.

## 8. Deploy na Vercel

- Conectar o repositório GitHub à Vercel.
- Configurar variáveis de ambiente necessárias para leitura da planilha.
- Usar deploy automático por branch e preview para pull requests.
- Promover para produção após validação técnica e validação dos dados.

## 9. Prompt inicial sugerido para o Codex

Implemente o Painel IDEB Bahia conforme este documento. Configure a integração com Google Sheets usando os dados informados na seção “Informações finais para implementação”, crie componentes reutilizáveis para filtros, cartões, tabela e gráficos, adicione testes para as regras de cálculo e prepare o projeto para deploy na Vercel.

## 10. Informações finais para implementação

- **URL do repositório GitHub:** https://github.com/everton-enova/painel2025/
- **ID da planilha Google:** `1KY-_pTaFDJ41q9_eLaHLcZwmwx_TkS92TFe2TB-HnOY`
- **Nome da aba:** informar o nome da aba correspondente ao `gid=472115507`.
- **GID da aba:** `472115507`
- **Intervalo dos dados:** confirmar o intervalo usado na aba, por exemplo `A:Z` ou `A1:J`.
- **Domínio da Vercel:** informar após criação do projeto na Vercel.
- **Responsáveis técnicos:** informar responsável técnico pelo painel.
- **Responsáveis pelos dados:** informar responsável pela curadoria e atualização da planilha.

## 11. Observações de configuração

Como a URL recebida contém apenas o `gid`, o nome textual da aba e o intervalo exato precisam ser confirmados dentro do Google Sheets. Até essa confirmação, a integração deve manter esses valores configuráveis por variável de ambiente.
