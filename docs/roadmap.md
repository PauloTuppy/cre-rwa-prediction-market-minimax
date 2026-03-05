# Roadmap – Oráculo de Crédito Privado Tokenizado

## Fase 1 – Demo Hackathon (MVP funcional)

- [ ] Contratos
  - [ ] SimpleMarket com resolveTimestamp, eventos e funções básicas de aposta e settlement.
  - [ ] RWAPool simplificado para exposição de métricas de crédito.
  - [ ] Implementar `pause()` para circuit breaker.
- [ ] Workflows CRE
  - [ ] Workflow de criação de mercados (`market-creator.ts`) com QuestionBuilder.
  - [ ] Workflow de resolução com MiniMax (`complete-workflow.ts`).
  - [ ] Enriquecimento de pergunta com contexto de crédito/RWA.
- [ ] Frontend
  - [ ] Dashboard with cards de risco de crédito.
  - [ ] Histórico de settlements com AI (tabela).
  - [ ] Listagem de mercados abertos com tempo restante.
- [ ] Infra/Segurança
  - [ ] Webhook `/api/settlements` protegido com segredo.
  - [ ] Configuração de secrets para MiniMax na CRE.

## Fase 2 – Robustez e dados reais

- [ ] Integração com feeds reais (ex.: yields, default rates, ratings).
- [ ] Refino de prompts e thresholds de confiança para cada tipo de métrica (default, DSCR, LTV).
- [ ] Melhorias de UX: filtros, detalhes de mercado, gráfico de preços.

## Fase 3 – Produção institucional (pós‑hackathon)

- [ ] Hardening de contratos (auditoria externa, testes formais).
- [ ] Modelo de disputa de resolução (challenge/appeal).
- [ ] Integração com estruturas legais de RWA (SPVs, trustees, custódia).
