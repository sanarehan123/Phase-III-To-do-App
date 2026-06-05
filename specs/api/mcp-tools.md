# AI Chatbot API & MCP Tools

## Endpoint

### POST /api/chat
Send a message to the AI chatbot.

Request headers:
  Authorization: Bearer <token>

Request body:
  {
    "message": "Add a task to call my doctor",
    "user_id": "abc123"
  }

Response:
  {
    "reply": "Done! I've added the task 'Call my doctor' for you.",
    "action_taken": "create_task"
  }

## OpenAI Function Definitions (MCP Tools)

### create_task
Creates a new task for the user.
Parameters:
  - title: string (required)
  - description: string (optional)

### list_tasks
Lists tasks for the user.
Parameters:
  - status: "all" | "pending" | "completed" (default: "all")

### delete_task
Deletes a task by matching title.
Parameters:
  - title: string (required)

### complete_task
Marks a task as complete by matching title.
Parameters:
  - title: string (required)

## How Function Calling Works
1. User sends message to /api/chat
2. Backend sends message + function definitions to OpenAI
3. OpenAI decides which function to call
4. Backend executes the function (creates/deletes/etc task in DB)
5. Backend sends result back to OpenAI
6. OpenAI generates a friendly response
7. Backend returns the response to frontend