markdown# Phase V: Cloud Native Deployment

## Overview
Phase V deploys the Todo App with AI Chatbot to the cloud
using containerized Docker services.

## Architecture
Internet
↓
Vercel (Frontend - Next.js)
↓
Hugging Face Spaces (Backend - Docker Container)
↓                    ↓
Neon PostgreSQL      Groq AI API

## Cloud Services Used

### Frontend
- Platform: Vercel
- Framework: Next.js 15
- URL: https://phase-iii-to-do-app.vercel.app
- Auto-deploys from GitHub

### Backend
- Platform: Hugging Face Spaces (Docker)
- Framework: FastAPI
- URL: https://sanashakeel0821-todo-backend-phase3.hf.space
- Runs inside a Docker container

### Database
- Platform: Neon Serverless PostgreSQL
- Managed cloud database
- Auto-scales with usage

### AI Service
- Platform: Groq API
- Model: llama-3.3-70b-versatile
- Free tier

## Environment Variables

### Backend (Hugging Face Secrets)
- DATABASE_URL — Neon connection string
- BETTER_AUTH_SECRET — JWT signing secret
- GROQ_API_KEY — Groq API key

### Frontend (Vercel)
- NEXT_PUBLIC_API_URL — Hugging Face backend URL

## Deployment Pipeline
1. Developer pushes code to GitHub
2. Code is pushed to Hugging Face Space
3. Hugging Face builds Docker container automatically
4. Vercel detects GitHub change and rebuilds frontend
5. Both services update and go live

## Kubernetes Equivalents

| Kubernetes Concept | Our Implementation |
|-------------------|-------------------|
| Pod | Hugging Face Docker container |
| Service | Hugging Face Space URL |
| ConfigMap | Hugging Face environment variables |
| Secret | Hugging Face secret variables |
| Deployment | Hugging Face Space deployment |
| Ingress | Vercel/HF routing |

## Comparison: DigitalOcean vs Hugging Face

| Feature | DigitalOcean DOKS | Hugging Face Spaces |
|---------|------------------|---------------------|
| Cost | ~$12/month | Free |
| Container support | Yes (Kubernetes) | Yes (Docker) |
| Auto-deploy | Yes | Yes |
| Custom domains | Yes | Yes |
| Best for | Production | Demo/Development |