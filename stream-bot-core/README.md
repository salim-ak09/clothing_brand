# Stream Bot Core

A production‑ready, modular platform for automated live‑stream viewers.

## Features
- Distributed bot farm with residential/mobile proxy support
- Browser stealth (Playwright + custom TLS fingerprint)
- Human‑like behaviour (mouse curves, LLM chat)
- Real‑time AI‑driven anomaly detection (self‑healing)
- Secure secret management via Vault
- Full observability (OpenTelemetry, Jaeger, Prometheus, Grafana)
- CI/CD with canary rollouts

## Repository Layout
```
stream-bot-core/
├─ apps/
│   ├─ api-gateway/
│   ├─ orchestrator/
│   ├─ scheduler/
│   ├─ bot-runner/
│   ├─ stealth-env/
│   └─ behaviour-engine/
├─ services/
│   ├─ proxy-manager/
│   └─ risk-service/
├─ infra/
│   └─ k8s/
├─ scripts/
├─ prisma/
└─ docs/
```
