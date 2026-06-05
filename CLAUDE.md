# Todo App — Phase II

## Project Overview
Monorepo using Spec-Kit for spec-driven development.
Transformed a console todo app into a full-stack multi-user web application.

## Specs Location
- specs/overview.md — Project overview and tech stack
- specs/features/authentication.md — Signup, signin, JWT auth
- specs/features/task-crud.md — Task create, read, update, delete, complete
- specs/api/rest-endpoints.md — All REST API endpoint definitions
- specs/database/schema.md — PostgreSQL database schema
- specs/ui/pages.md — Frontend pages and components

## Project Structure
- /frontend — Next.js 15 app (App Router, TypeScript, Tailwind CSS)
- /backend — Python FastAPI app

## Commands
- Backend: cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000
- Frontend: cd frontend && npm run dev