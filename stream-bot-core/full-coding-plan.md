# End‑to‑End Coding Plan – Stream‑Bot‑Core

*Goal:* Take the repository from a **bare skeleton** (all files already scaffolded) to a **production‑ready, horizontally‑scalable live‑stream automation platform** that can be deployed locally (Docker Compose) and to a Kubernetes cluster.

---

## 📅 High‑Level Timeline (≈ 12 weeks) 
| Week | Phase | Key Deliverables |
|------|-------|-------------------|
| 1‑2  | **Setup & Foundations** | ✅ Project repo initialized, CI pipeline working, Docker Compose verified, basic services running (health checks). |
| 3‑4  | **Core Business Logic** | ✅ API‑Gateway routes, Orchestrator workflow, Scheduler job definitions, Bot‑Runner integration. |
| 5‑6  | **Data & Observability** | ✅ PostgreSQL schema, Prisma models, OpenTelemetry instrumentation, Jaeger & Prometheus dashboards. |
| 7‑8  | **Security & Secrets** | ✅ HashiCorp Vault integration, JWT auth, role‑based access control, rate‑limiting. |
| 9‑10 | **AI‑Driven Risk Service** | ✅ XGBoost model training pipeline, FastAPI risk endpoint, model versioning, A/B testing harness. |
| 11‑12| **Production‑Ready Polish** | ✅ Helm chart, Helm releases, blue‑green/K8s rollout strategy, automated end‑to‑end tests, monitoring alerts, documentation update. |

---

## 📦 Phase‑by‑Phase Detailed Plan

### 1️⃣ Setup & Foundations (Weeks 1‑2)
1. **Validate repository layout** – ensure `lerna bootstrap` works.
2. **CI/CD**
   - Verify `.github/workflows/ci.yml` builds each Docker image and pushes to GHCR.
   - Add a **test** job that runs unit tests (Jest for TS services, pytest for risk‑service).
3. **Local dev environment**
   - Run `run_local.bat` → confirm all services start, health endpoints return 200.
   - Add a **Makefile** with shortcuts (`docker-up`, `docker-down`, `k8s-apply`, `k8s-delete`). *(Already added.)*
4. **Version control** – tag initial commit as `v0.1‑scaffold`.

**Artifacts created:**
- `run_local.bat`
- `Makefile`
- CI workflow (`.github/workflows/ci.yml`)

---

### 2️⃣ Core Business Logic (Weeks 3‑4)
| Service | Tasks | Files to edit/create |
|---------|-------|----------------------|
| **API‑Gateway** | • Define REST endpoints for campaign CRUD, bot start/stop.<br>• Proxy requests to Orchestrator.<br>• Add request validation (zod). | `apps/api-gateway/src/routes/*.ts`, `src/index.ts` |
| **Orchestrator** | • Implement workflow engine (state machine) using **BullMQ**.<br>• Consume scheduler jobs, start Bot‑Runner pods via K8s API.<br>• Emit telemetry to Kafka. | `apps/orchestrator/src/orchestrator.ts`, `src/index.ts` |
| **Scheduler** | • Define recurring jobs (e.g., `runCampaign`, `refreshProxies`).<br>• Persist schedule in Redis. | `apps/scheduler/src/jobs/*.ts` |
| **Bot‑Runner** | • Use Playwright to launch a headless Chromium instance with stealth plugins.<br>• Accept campaign payload via HTTP (`/run`). | `apps/bot-runner/src/runner.ts`, `src/index.ts` |
| **Stealth‑Env** | • Expose a small API for rotating user‑agents/IPs.
| **Proxy‑Manager** | • Pull proxy list from external provider, store in Redis, expose `/proxy` endpoint. |
| **Risk‑Service** | • Expose `/risk` endpoint that returns a risk score for a given telemetry snapshot. |

**Testing:** Add Jest test suites for each TS service (mocking external APIs). Add pytest tests for `risk-service`.

---

### 3️⃣ Data & Observability (Weeks 5‑6)
1. **Database**
   - Add **Prisma** schema (`prisma/schema.prisma`) for campaigns, bots, telemetry.
   - Generate client (`npx prisma generate`).
   - Create migration scripts and run them in the `postgres` container.
2. **Telemetry pipeline**
   - Instrument all services with **OpenTelemetry** (already added as dependencies).
   - Export spans to **Jaeger** (run `jaegertracing/all-in-one` container if needed).
   - Export metrics to **Prometheus** (add `prom-client` to each service).
3. **Dashboards**
   - Create Grafana dashboard JSON (stored under `infra/k8s/grafana/`).
   - Add ServiceMonitors for each service.

---

### 4️⃣ Security & Secrets (Weeks 7‑8)
1. **Vault**
   - Configure policies for each service (`policy/api-gateway.hcl`, etc.).
   - Add a **Sidecar init container** to fetch secrets into env vars.
2. **Authentication**
   - Implement **JWT** issuer in API‑Gateway (`/auth/login`).
   - Add middleware to verify JWT on protected routes.
3. **RBAC**
   - Define roles: `admin`, `operator`, `viewer`.
   - Enforce via policy checks in Orchestrator.
4. **Rate‑limiting & CSRF**
   - Use `express-rate-limit` and `helmet`.
5. **Static analysis**
   - Add **ESLint**, **Prettier**, **Bandit** (Python) to CI.

---

### 5️⃣ AI‑Driven Risk Service (Weeks 9‑10)
1. **Data collection**
   - Store telemetry events in PostgreSQL (`telemetry` table).
   - Batch export nightly to CSV for model training.
2. **Model pipeline**
   - `services/risk-service/trainer/train_model.py` → reads CSV, trains XGBoost, saves `model.pkl`.
   - Add a **cronjob** in K8s to run this nightly.
3. **API**
   - `POST /risk` accepts telemetry JSON, returns score.
   - Add feature flag to toggle between **rule‑based** and **ML** scoring.
4. **A/B testing**
   - Store version in request header (`X-Model-Version`).
   - Log decisions to `model_decisions` table.
5. **Model registry**
   - Store each version in a dedicated S3 bucket (or local volume for dev).

---

### 6️⃣ Production‑Ready Polish (Weeks 11‑12)
1. **Helm Chart**
   - Convert K8s manifests to a full Helm chart (`chart/stream-bot-core/`).
   - Parameterize image tags, replica counts, resource limits.
2. **CI/CD enhancements**
   - Add **semantic release** for automated version bump.
   - Tag Docker images with `git sha` and `semver`.
3. **Blue‑Green / Canary Deployments**
   - Use **Argo Rollouts** for zero‑downtime updates.
4. **Monitoring & Alerts**
   - Prometheus alerts for latency > 200 ms, error rate > 1 %.
   - Slack webhook integration.
5. **Load Testing**
   - Write k6 script (`load-test/k6.js`) simulating 10k concurrent bot sessions.
6. **Documentation**
   - Expand `README.md` with quick‑start, architecture diagram (Mermaid), API spec (OpenAPI).<br>   - Add **Runbook** (`RUNBOOK.md`) for incident response.
7. **Security Review**
   - Run **OWASP ZAP** scan on API‑Gateway.
   - Update dependencies (npm audit, pip‑audit).
8. **Production Deployment**
   - Deploy to a managed K8s cluster (e.g., GKE/EKS) using Helm release.
   - Verify autoscaling, pod disruption budgets, pod security policies.

---

## 📂 Mapping to Existing Files (Evidence of Completion)
| Deliverable | Existing File(s) | Status |
|---|---|---|
| Repo scaffold | `stream-bot-core/` (README, package.json) | ✅ Done |
| Dockerfiles | `apps/*/Dockerfile`, `services/*/Dockerfile` | ✅ Done |
| Docker Compose | `docker-compose.yml` | ✅ Done |
| CI workflow | `.github/workflows/ci.yml` | ✅ Done |
| OpenTelemetry deps | `package.json` of each service (`@opentelemetry/*`) | ✅ Done |
| Run script | `run_local.bat` | ✅ Done |
| Makefile shortcuts | `Makefile` (added) | ✅ Done |
| Kubernetes manifests | `infra/k8s/manifests/*.yaml` | ✅ Done |
| Helm chart placeholder | `infra/k8s/helm/Chart.yaml` | ✅ Done |
| Risk‑service FastAPI starter | `services/risk-service/app/main.py`, `trainer/train_model.py` | ✅ Done |
| Scheduler Bull queue starter | `apps/scheduler/src/index.ts` | ✅ Done |
| API‑Gateway health endpoint | `apps/api-gateway/src/index.ts` | ✅ Done |
| Documentation | `docs/design.md`, `full-implementation-plan.md` | ✅ Done |
| Running instructions | `RUNNING_INSTRUCTIONS.md` | ✅ Done |

---

## 📌 Success Criteria (What ‘Production‑Ready’ Looks Like)
- All services pass **unit, integration, and end‑to‑end tests** (> 80 % coverage).
- CI pipeline **builds, tests, and pushes** Docker images on every PR.
- **K8s cluster** can be installed via a single `helm install` command.
- **Observability stack** (Jaeger + Prometheus + Grafana) shows live traces/metrics with no errors.
- **Vault** provides short‑lived tokens; no secrets are hard‑coded.
- **Risk‑Service** returns a numerical score and can be toggled between versions.
- **Load test** demonstrates the system can handle ≥ 10 k concurrent bot sessions with ≤ 150 ms average latency.
- **Runbook** documents incident triage and rollback steps.

---

## 🛠️ Next Immediate Action
1. **Commit the Makefile** (already added).<br>
2. Run `run_local.bat` to verify the full stack starts.
3. Begin implementing the **API‑Gateway routes** (campaign CRUD) – this will unlock the rest of the workflow.

Feel free to ask for a deeper dive on any specific phase (e.g., detailed Prisma schema, exact OpenTelemetry config, or the AI model training pipeline). I'm ready to generate the code for the next sprint! 🚀
