# Requisitos – Plataforma de Oráculo de Crédito Privado Tokenizado

## Funcionais

1. Criação de mercados de crédito
   - RF‑01: Permitir criar mercados com base em parâmetros (poolName, metricType, threshold, deadline).
   - RF‑02: Gerar automaticamente uma pergunta em inglês institucional usando o QuestionBuilder.
   - RF‑03: Salvar a pergunta e o resolveTimestamp no contrato `SimpleMarket`.

2. Participação em mercados
   - RF‑04: Usuários podem abrir posições YES/NO em cada mercado.
   - RF‑05: O contrato registra stakes e calcula payoff conforme o resultado.

3. Resolução de mercados via AI
   - RF‑06: Quando `SettlementRequested` é emitido, um workflow CRE deve ser disparado.
   - RF‑07: O workflow deve chamar `askMinimax` com uma pergunta enriquecida (contexto de crédito/RWA).
   - RF‑08: Se a confiança da AI for inferior a um threshold (ex.: 5000), o workflow deve abortar o settlement automático.
   - RF‑09: Se a confiança for suficiente, o workflow deve chamar `settleMarket` onchain com YES/NO.
   - RF‑10: O workflow deve enviar webhook para o backend com marketId, question, result, confidence, txHash.

4. Dashboard institucional
   - RF‑11: Exibir cards com métricas agregadas de crédito (default rate, credit spread, tokenized debt TVL, liquidation buffer).
   - RF‑12: Exibir tabela de mercados resolvidos com AI (pergunta, resultado, confiança, txHash, data).
   - RF‑13: Exibir lista de mercados abertos com contagem regressiva até o resolveTimestamp.

5. Segurança e governança
   - RF‑14: Administradores podem pausar operações críticas (circuit breaker).
   - RF‑15: Endereço(s) autorizado(s) para acionar settlement automático devem ser configuráveis (onlySettler / roles).
   - RF‑16: Webhook `/api/settlements` deve validar um segredo de autenticação.

## Não funcionais

1. Desempenho
   - RNF‑01: Resolução de mercado via workflow + AI deve ocorrer em poucos segundos em ambiente de demo.
2. Observabilidade
   - RNF‑02: Logs suficientes em workflows CRE para debugar falhas (AI, HTTP, EVM).
   - RNF‑03: Eventos onchain bem definidos para auditar mercado e settlements.
3. Manutenibilidade
   - RNF‑04: Código organizado por domínios (contracts, workflows, frontend, api, infra).
   - RNF‑05: Documentação atualizada em `/docs` deve refletir o estado atual do sistema.

## Requisitos futuros (backlog)

- RF‑17: Suporte a múltiplos tipos de ativos (treasuries, crédito privado, real estate).
- RF‑18: Modelo de disputa de resolução (challenge window) para eventos de crédito.
- RF‑19: Integração com feeds reais de RWA (por exemplo, preços, AUM, ratings).
