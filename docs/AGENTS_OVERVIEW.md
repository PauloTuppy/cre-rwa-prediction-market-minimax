# AGENTS_OVERVIEW – Agentes do Sistema

Esta seção descreve os agentes (humanos e de software) que compõem o sistema.

## Orchestrator Agent

Responsável por coordenar fluxos de trabalho entre contratos, AI e backend (nível CRE). Decide qual workflow rodar e em que ordem.

## Credit Analyst Agent (MiniMax)

LLM especializado em eventos de crédito privado. Toma decisões binárias YES/NO sobre claims de default, DSCR, LTV, downgrade, etc.

## Workflow Executor Agent

Agente responsável por executar workflows CRE:
- Dispara reads/writes onchain.
- Chama APIs externas.
- Garante que fluxos sejam atomizados e idempotentes.

## Risk Validator Agent

Responsável por verificar consistência das decisões:
- Confere thresholds de confiança da AI.
- Opcionalmente, aplica regras extras (ex.: não resolver se dados de entrada estiverem incompletos ou inconsistentes).
