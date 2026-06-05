@AGENTS.md

# Frontend Guidelines

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Axios for HTTP requests

## File Structure
- app/page.tsx — Root redirect (checks auth, goes to /tasks or /signin)
- app/signin/page.tsx — Sign in page
- app/signup/page.tsx — Sign up page
- app/tasks/page.tsx — Main tasks page (protected)
- lib/api.ts — All backend API calls using axios
- lib/auth.ts — localStorage helpers for token and user session

## Key Rules
- All pages marked "use client" (interactive UI)
- JWT token stored in localStorage under key "token"
- User info stored in localStorage under key "user"
- Every API call automatically attaches token via axios interceptor
- Protected pages check isAuthenticated() and redirect if false
- NEXT_PUBLIC_API_URL in .env.local points to backend

## Running
cd frontend
npm run dev
