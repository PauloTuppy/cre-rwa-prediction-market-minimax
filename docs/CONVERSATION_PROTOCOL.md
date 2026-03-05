# CONVERSATION_PROTOCOL – Protocolo de Conversa entre Agentes

## Objetivo

Definir como os agentes (orchestrator, credit analyst, workflow executor, risk validator) interagem entre si e com o sistema.

## Mensagens básicas

- `SETTLEMENT_REQUEST`
  - Emissor: Orchestrator / contrato via evento.
  - Receptor: Workflow Executor.
  - Conteúdo: { marketId, question, resolveTimestamp }.

- `CREDIT_EVENT_EVAL`
  - Emissor: Workflow Executor.
  - Receptor: Credit Analyst (MiniMax).
  - Conteúdo: pergunta enriquecida com contexto de pool, métricas e prazos.

- `CREDIT_EVENT_DECISION`
  - Emissor: Credit Analyst.
  - Receptor: Risk Validator.
  - Conteúdo: { result: YES/NO, confidence }.

- `SETTLEMENT_DECISION`
  - Emissor: Risk Validator.
  - Receptor: Workflow Executor.
  - Conteúdo: decisão final de chamar ou não `settleMarket`.

## Regras gerais

- Toda decisão da AI deve ser acompanhada de um `confidence` numérico.
- Se `confidence` < threshold, Risk Validator deve rejeitar o settlement automático.
- Orchestrator deve logar todas as decisões em local auditável (eventos, logs CRE, ou backend).
