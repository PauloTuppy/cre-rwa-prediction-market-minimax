# Arquitetura – Oráculo de Crédito Privado Tokenizado

## Visão geral

Este projeto é uma plataforma de mercados de previsão para **crédito privado tokenizado**, onde:
- Contratos onchain modelam mercados de crédito e pools de RWAs.
- Workflows CRE orquestram eventos, AI e integrações externas.
- Um front-end Next.js expõe a interface institucional (dashboard de risco, mercados, histórico).

Objetivo principal: permitir que eventos de crédito (default, quebra de covenant, drawdown de colateral) sejam precificados via prediction markets e resolvidos por um oráculo AI auditável.

## Componentes principais

- **Smart Contracts**
  - `SimpleMarket`: contrato de prediction market para crédito privado (createMarket, requestSettlement, settleMarket).
  - `RWAPool` (ou equivalente): representa o pool de crédito privado tokenizado e expõe métricas onchain relevantes.
- **Workflows CRE**
  - `complete-workflow.ts`: escuta pedidos de settlement, chama MiniMax, escreve resultado onchain e notifica o backend.
  - `market-creator.ts`: expõe endpoint HTTP para criação de mercados de crédito usando o QuestionBuilder.
  - `creditQuestionBuilder.ts`: gera perguntas institucionais padronizadas a partir de parâmetros (poolName, metricType, threshold, deadline).
- **AI / Oráculo**
  - `minimax.ts`: integra com MiniMax (modelo M2.5) via API OpenAI‑compatible, com prompt de Analista de Crédito Institucional.
- **Front-end**
  - Next.js app com:
    - Dashboard de crédito (default rate, credit spread, tokenized debt TVL, liquidation buffer).
    - Histórico de settlements resolvidos pela AI.
    - Listagem de mercados abertos/fechados.
- **API / Backend**
  - Rotas `/api/settlements` para receber webhooks de settlement do workflow CRE e servir dados para o front.
  - (Opcional) Outras rotas para criação de mercados e dados de pools.

## Fluxos principais

1. **Criação de mercado de crédito**
   - Usuário/operador chama endpoint HTTP (`/create-credit-market`).
   - Workflow CRE usa `creditQuestionBuilder` para gerar a pergunta.
   - Workflow chama `SimpleMarket.createMarket(question, resolveTimestamp)` onchain.
   - Evento `MarketCreated` é emitido e o front passa a listar o mercado.

2. **Participação no mercado**
   - Usuários apostam em YES/NO no `SimpleMarket` de acordo com sua visão de risco.
   - Preços refletem probabilidade implícita do evento de crédito.

3. **Pedido de resolução**
   - Quando chega a data de resolução, alguém chama `requestSettlement(marketId)` no contrato.
   - Contrato emite `SettlementRequested(marketId, question)`.

4. **Resolução com AI**
   - Workflow CRE (`complete-workflow.ts`) é disparado pelo evento.
   - Ele enriquece a pergunta com contexto de RWA e crédito, chama `askMinimax`.
   - Se confiança ≥ threshold, chama `settleMarket(marketId, result)` no contrato.
   - Em seguida, envia um webhook para `/api/settlements` com marketId, question, result, confidence, txHash.

5. **Exibição no dashboard**
   - Front-end consome `/api/settlements` e atualiza a tabela de histórico.
   - Métricas de crédito e status do mercado são exibidos para o usuário.

## Decisões arquiteturais importantes

- **AI como oráculo de eventos, não de preço**: MiniMax decide apenas se o evento de crédito ocorreu (YES/NO), não fornece preços de ativos.
- **CRE como camada de orquestração**: toda automação entre onchain, AI e backend é centralizada em workflows CRE.
- **Padronização de perguntas**: `creditQuestionBuilder` garante consistência semântica entre mercados, alinhando linguagem humana e prompt da AI.
- **Separação clara de responsabilidades**:
  - Contratos: segurança, saldo, registros onchain.
  - Workflows: lógica offchain, integração e AI.
  - Front: visualização e UX institucional.
