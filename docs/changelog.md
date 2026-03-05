# Changelog – Oráculo de Crédito Privado Tokenizado

## [0.1.0] – MVP Hackathon

### Adicionado
- Contrato `SimpleMarket` para mercados de previsão de crédito privado com `resolveTimestamp`.
- Integração com Chainlink CRE via `@chainlink/cre-sdk`.
- Workflow de resolução `complete-workflow.ts`:
  - Trigger em `SettlementRequested`.
  - Chamada a MiniMax com prompt de Analista de Crédito Institucional.
  - Settlement onchain condicionado a threshold de confiança.
  - Webhook para backend `/api/settlements`.
- Workflow de criação `market-creator.ts` com QuestionBuilder para crédito privado.
- Utilitário `creditQuestionBuilder.ts` para gerar perguntas padronizadas (default, DSCR, LTV, downgrade, etc.).
- Front-end Next.js:
  - Dashboard de risco de crédito (default rate, spread, TVL, buffer).
  - Tabela de históricos de settlements.
- Script `bootstrap-markets.ts` para popular mercados de demo.

### Alterado
- Narrativa do projeto de “prediction genérico” para foco em **Crédito Privado Tokenizado**.
- Prompts de AI ajustados para papel de Analista de Crédito Institucional.

### Segurança
- Introdução de circuit breaker (`pause()`) em operações críticas.
- Início do checklist de segurança RWA em `/docs`.
