# Kubernetes — AWS EKS Manifests

All Kubernetes manifests for deploying TaskFlow to AWS EKS.

## Files

```
kubernetes/
├── 00-namespace.yaml     # todo-app namespace
├── 01-secrets.yaml       # DB credentials + app secret key
├── 02-postgres.yaml      # PVC + Deployment + ClusterIP Service
├── 03-backend.yaml       # Flask API Deployment + HPA (2→8) + Service
├── 04-frontend.yaml      # React/Nginx Deployment + HPA (2→6) + Service
├── 05-ingress.yaml       # AWS ALB Ingress with HTTPS redirect
└── kustomization.yaml    # Kustomize overlay for image tagging
```

## Architecture

```
Internet
   │  HTTPS
   ▼
AWS ALB (Ingress)
   ├── /api/*  ──► Backend Service :5000 ──► Flask Pods (x2-8)
   │                                              │
   │                                         PostgreSQL Pod
   │                                         (PVC 10Gi gp2)
   └── /*      ──► Frontend Service :80  ──► Nginx Pods  (x2-6)
```

## Prerequisites

```bash
# 1. AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=YOUR_CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# 2. metrics-server (for HPA)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Deploy

```bash
# Set environment substitution vars
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1
export IMAGE_TAG=abc1234

# Apply all manifests
for f in kubernetes/*.yaml; do
  envsubst < "$f" | kubectl apply -f -
done

# Or with Kustomize
kustomize edit set image \
  todo-backend=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-backend:$IMAGE_TAG \
  todo-frontend=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-frontend:$IMAGE_TAG
kubectl apply -k kubernetes/
```

## Secrets (production)

Never commit real secrets. Create them directly:
```bash
kubectl create secret generic todo-secrets \
  --from-literal=DB_HOST=your-rds-endpoint.rds.amazonaws.com \
  --from-literal=DB_PORT=5432 \
  --from-literal=DB_NAME=tododb \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASSWORD='your-strong-password' \
  --from-literal=SECRET_KEY='your-random-secret' \
  -n todo-app
```

## Verify deployment

```bash
kubectl get pods,svc,ingress -n todo-app
kubectl logs -l app=todo-backend -n todo-app --tail=50
kubectl top pods -n todo-app
```

## Rollback

```bash
kubectl rollout undo deployment/todo-backend  -n todo-app
kubectl rollout undo deployment/todo-frontend -n todo-app
```
