# Feature: Authentication

## Overview
Users sign up and sign in using email and password.
The backend issues JWT tokens on login.
All API requests require a valid JWT token.

## User Stories
- As a visitor, I can sign up with name, email and password
- As a user, I can sign in with email and password
- As a user, I am redirected to /tasks after login
- As a user, I can sign out and my session is cleared

## Acceptance Criteria

### Signup
- Name, email and password are required
- Email must be unique — duplicate email returns 400 error
- Password is hashed before storing in database
- JWT token is returned on successful signup

### Signin
- Email and password are validated against database
- Wrong credentials return 401 Unauthorized
- JWT token is returned on successful signin

### JWT Token
- Token contains user_id and email
- Token expires after 7 days
- Token is signed with BETTER_AUTH_SECRET env variable
- Frontend stores token in localStorage
- Frontend attaches token to every API request as:
  Authorization: Bearer <token>

### Backend Verification
- Every /api/* route requires valid JWT token
- Missing or invalid token returns 401 Unauthorized
- Token is decoded to extract user_id for data filtering

## Pages
- /signup — signup form
- /signin — signin form
- /tasks — protected, redirects to /signin if not authenticated