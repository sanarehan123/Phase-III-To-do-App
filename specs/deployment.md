# Deployment Specification

## Overview
The Todo App is containerized using Docker and deployed on Kubernetes.
Each service runs in its own container for isolation and scalability.

## Services

### Frontend (Next.js)
- Container: Node.js 18 Alpine
- Port: 3000
- Deployed on: Vercel (production), Kubernetes (local)

### Backend (FastAPI)
- Container: Python 3.11 Slim
- Port: 7860
- Deployed on: Hugging Face Spaces (production), Kubernetes (local)

### Database
- Neon Serverless PostgreSQL (external managed service)
- Accessed via DATABASE_URL environment variable

## Docker Setup
- Each service has its own Dockerfile
- docker-compose.yml runs all services together locally
- Environment variables passed via .env files

## Kubernetes Setup
- Each service has a Deployment and Service YAML
- ConfigMap stores non-secret environment variables
- Secrets store sensitive environment variables
- Backend and frontend run as separate pods

## Deployment Targets
- Local: Minikube (docker driver)
- Cloud: DigitalOcean Kubernetes (DOKS)
- Current Production: Vercel + Hugging Face Spaces

## Scaling
- Backend: can scale to multiple replicas
- Frontend: stateless, scales horizontally
- Database: managed by Neon, scales automatically