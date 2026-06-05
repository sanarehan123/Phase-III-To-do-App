# REST API Endpoints

## Base URL
- Development: http://localhost:8000

## Authentication
All endpoints require JWT token in Authorization header:
  Authorization: Bearer <token>

Backend verifies the token and extracts user_id.
All queries are filtered to that user_id only.
Requests without a valid token receive 401 Unauthorized.

## Auth Endpoints

### POST /api/auth/signup
Create a new user account.
Request body: { name, email, password }
Response: { token, user_id, name, email }

### POST /api/auth/signin
Sign in with existing account.
Request body: { email, password }
Response: { token, user_id, name, email }

## Task Endpoints

### GET /api/{user_id}/tasks
List all tasks for the authenticated user.
Query params: status = all | pending | completed
Response: Array of Task objects

### POST /api/{user_id}/tasks
Create a new task.
Request body: { title, description? }
Response: Created Task object

### GET /api/{user_id}/tasks/{id}
Get a single task by ID.
Response: Task object or 404

### PUT /api/{user_id}/tasks/{id}
Update a task's title and/or description.
Request body: { title?, description? }
Response: Updated Task object

### DELETE /api/{user_id}/tasks/{id}
Permanently delete a task.
Response: { message: "Task deleted" }

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle task completion status.
Response: Updated Task object

## Error Responses
- 400: Bad request (e.g. duplicate email)
- 401: Missing or invalid JWT token
- 403: Task does not belong to authenticated user
- 404: Task not found
- 422: Validation error (missing required fields)
