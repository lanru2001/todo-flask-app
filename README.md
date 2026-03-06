# TaskFlow — Todo App

Full-stack todo application with Flask, ReactJS, PostgreSQL, Kubernetes on AWS EKS, and GitLab CI/CD.

## Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | ReactJS 18 + Nginx     |
| Backend    | Python Flask 3 + Gunicorn |
| Database   | PostgreSQL 16          |
| Container  | Docker + Docker Compose|
| Orchestration | Kubernetes (AWS EKS) |
| Registry   | AWS ECR                |
| CI/CD      | GitLab CI/CD           |

---

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Run with Docker Compose
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Postgres: localhost:5432

### Run individually

**Backend:**
```bash
cd backend
pip install -r requirements.txt
export DB_HOST=localhost DB_NAME=tododb DB_USER=postgres DB_PASSWORD=postgres
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
```

---

## API Endpoints

| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | /api/health               | Health check        |
| GET    | /api/todos                | List all todos      |
| GET    | /api/todos?status=pending | Filter by status    |
| GET    | /api/todos?priority=high  | Filter by priority  |
| POST   | /api/todos                | Create todo         |
| GET    | /api/todos/:id            | Get single todo     |
| PUT    | /api/todos/:id            | Update todo         |
| PATCH  | /api/todos/:id/toggle     | Toggle status       |
| DELETE | /api/todos/:id            | Delete todo         |

---

## Kubernetes Deployment (AWS EKS)

### Prerequisites
- AWS CLI configured
- EKS cluster running
- AWS Load Balancer Controller installed
- `kubectl` connected to cluster

### Manual Deploy
```bash
# Set variables
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1
export IMAGE_TAG=latest

# Apply manifests
for f in k8s/*.yaml; do envsubst < "$f" | kubectl apply -f -; done

# Check status
kubectl get pods -n todo-app
kubectl get ingress -n todo-app
```

### Secrets Setup (Production)
```bash
kubectl create secret generic todo-secrets \
  --from-literal=DB_HOST=your-rds-endpoint \
  --from-literal=DB_NAME=tododb \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASSWORD='strong-password' \
  --from-literal=SECRET_KEY='random-secret-key' \
  -n todo-app
```

---

## GitLab CI/CD Pipeline

### Required Variables (Settings → CI/CD → Variables)

| Variable              | Description                            |
|-----------------------|----------------------------------------|
| `AWS_ACCESS_KEY_ID`   | IAM user key                          |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret                     |
| `AWS_REGION`          | e.g. `us-east-1`                      |
| `AWS_ACCOUNT_ID`      | 12-digit AWS account ID               |
| `EKS_CLUSTER_NAME`    | Name of your EKS cluster              |
| `KUBECONFIG_BASE64`   | `base64 ~/.kube/config` output        |

### Pipeline Stages

```
test → build → push → deploy-staging → deploy-production (manual)
```

- `develop` branch → auto deploy to staging
- `main` branch → build + push, manual gate for production

### IAM Policy Required
```json
{
  "Effect": "Allow",
  "Action": [
    "ecr:GetAuthorizationToken",
    "ecr:BatchCheckLayerAvailability",
    "ecr:PutImage",
    "ecr:InitiateLayerUpload",
    "ecr:UploadLayerPart",
    "ecr:CompleteLayerUpload",
    "ecr:CreateRepository",
    "ecr:DescribeRepositories",
    "eks:DescribeCluster"
  ],
  "Resource": "*"
}
```

```bash
todo-app/
│
├── backend/                  # Python Flask REST API
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                 # ReactJS SPA + Nginx
│   ├── src/
│   │   ├── components/       # TodoForm, TodoItem, FilterBar
│   │   ├── pages/            # TodoPage
│   │   ├── services/         # todoService (API client)
│   │   ├── App.js / App.css
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
│
├── database/                 # PostgreSQL image + schema
│   ├── init.sql              # Schema, indexes, seed data
│   ├── migrations/           # V2+ incremental SQL migrations
│   ├── backup.sh             # pg_dump with retention
│   ├── Dockerfile
│   └── README.md
│
├── kubernetes/               # AWS EKS manifests
│   ├── 00-namespace.yaml
│   ├── 01-secrets.yaml
│   ├── 02-postgres.yaml      # PVC + Deployment + Service
│   ├── 03-backend.yaml       # Deployment + HPA + Service
│   ├── 04-frontend.yaml      # Deployment + HPA + Service
│   ├── 05-ingress.yaml       # AWS ALB + HTTPS
│   ├── kustomization.yaml
│   └── README.md
│
├── gitlab/                   # GitLab CI/CD
│   ├── .gitlab-ci.yml        # 5-stage pipeline (copy to root)
│   ├── variables.env.example # All required CI variables
│   ├── merge_request_template.md
│   └── README.md
│
├── docker-compose.yml        # Local dev (all 3 services)
└── README.md                 # ← you are here
```
