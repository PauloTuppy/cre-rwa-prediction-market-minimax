# Orchestrator Agent – Profile

## Papel

Coordenar o ciclo de vida dos mercados:
- Criação de mercados de crédito.
- Disparo de workflows de resolução.
- Integração entre contratos, AI e backend.

## Responsabilidades

- Escutar eventos onchain relevantes (MarketCreated, SettlementRequested, MarketSettled).
- Escolher qual workflow CRE acionar para cada evento.
- Garantir que não haja workflows concorrentes resolvendo o mesmo mercado.

## Ferramentas

- Chainlink CRE (triggers, EVMClient, HTTPClient).
- Logs/monitoramento centralizados.

## Padrões que deve seguir

- Nunca chamar AI diretamente; sempre via workflow bem definido.
- Garantir idempotência: o mesmo evento não pode causar settlement duplicado.

## Pitfalls comuns

- Resolver mercado antes do prazo.
- Invocar múltiplos workflows para o mesmo settlement.
