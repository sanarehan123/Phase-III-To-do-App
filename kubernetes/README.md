# Kubernetes Deployment Guide

## Local Deployment (Minikube)

### Prerequisites
- Docker Desktop installed
- Minikube installed
- kubectl installed

### Steps

1. Start Minikube:
minikube start --driver=docker --memory=4096

2. Build Docker images:
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

3. Load images into Minikube:
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

4. Apply Kubernetes configs:
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml

5. Check pods are running:
kubectl get pods

6. Access the app:
minikube service frontend-service

## Cloud Deployment (DigitalOcean Kubernetes)

### Prerequisites
- DigitalOcean account
- doctl CLI installed
- kubectl configured for DOKS

### Steps

1. Create DOKS cluster on DigitalOcean dashboard

2. Connect kubectl to cluster:
doctl kubernetes cluster kubeconfig save your-cluster-name

3. Push images to DigitalOcean Container Registry:
doctl registry create todo-app-registry
docker tag todo-backend:latest registry.digitalocean.com/todo-app-registry/backend:latest
docker push registry.digitalocean.com/todo-app-registry/backend:latest

4. Apply configs same as Minikube steps above

## Production (Current)
- Frontend: Vercel
- Backend: Hugging Face Spaces (Docker)
- Database: Neon PostgreSQL