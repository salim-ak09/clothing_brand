# Running Instructions for Stream Bot Core

## 📦 Local Development with Docker Compose

The repository ships a **docker‑compose.yml** that spins up the entire micro‑service stack along with lightweight supporting infrastructure (Redis, Postgres, Kafka/Zookeeper, Vault).

### Prerequisites
- Docker Engine (>= 20.10) and Docker Compose (v2 plugin) installed.
- Sufficient memory (≈ 4 GB) for all containers.

### Steps
1. Open a terminal at the project root:
   ```bash
   cd d:/work/mid-projects/Streaming bot/stream-bot-core
   ```
2. Build and start all services in the background:
   ```bash
   docker compose up -d
   ```
3. Verify containers are healthy:
   ```bash
   docker compose ps
   ```
   Look for `health: starting` → `healthy` on `postgres`, `kafka`, `vault`.
4. The main APIs expose the following ports (host → container):
   - API Gateway: **8000**
   - Orchestrator: **8001**
   - Scheduler:   **8002**
   - Bot Runner:  **8003**
   - Stealth Env: **8004**
   - Proxy Manager: **8005**
   - Risk Service: **8006**
5. To stop the stack:
   ```bash
   docker compose down
   ```

## ☸️ Deploy to a Kubernetes Cluster

If you prefer a Kubernetes‑based environment (e.g., Kind, Minikube, or a remote cluster), the repository contains ready‑to‑apply manifests under `infra/k8s/manifests`.

### Prerequisites
- `kubectl` configured to talk to your cluster.
- Optional: `helm` (the manifests are plain YAML, Helm chart meta is provided for future packaging).

### Steps
1. Apply the full stack:
   ```bash
   kubectl apply -k infra/k8s/manifests
   ```
2. Wait for pods to become ready:
   ```bash
   kubectl get pods -w
   ```
3. Expose services locally (Port‑Forward) if you don't have an Ingress controller:
   ```bash
   kubectl port-forward svc/api-gateway 8000:80
   # repeat for other services as needed
   ```
4. To tear down the deployment:
   ```bash
   kubectl delete -k infra/k8s/manifests
   ```

## 🛠️ Convenience Makefile

A small `Makefile` lives at the repository root to simplify the most common commands.
```bash
make docker-up      # docker compose up -d
make docker-down    # docker compose down
make k8s-apply      # kubectl apply -k infra/k8s/manifests
make k8s-delete     # kubectl delete -k infra/k8s/manifests
```

---

### 🎉 You're Ready!
Now you can run the entire platform locally with a single command or deploy it to any Kubernetes cluster. Feel free to extend the services, add business logic, or plug in your own AI models.
