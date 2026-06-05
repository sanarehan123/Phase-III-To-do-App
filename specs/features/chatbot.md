# Feature: AI Chatbot

## Overview
A floating chat bubble on the tasks page that lets users
manage their todo list using natural language.
Powered by OpenAI GPT with Function Calling.

## User Stories
- As a user, I can click a chat bubble to open a chat window
- As a user, I can type natural language like:
  - "Add a task to call my doctor tomorrow"
  - "Show me all my pending tasks"
  - "Mark my homework task as complete"
  - "Delete the meeting task"
  - "What tasks do I have today?"
- As a user, the bot performs the action automatically
- As a user, my task list updates instantly after bot actions

## Acceptance Criteria

### Chat Bubble
- Fixed position button at bottom-right of tasks page
- Clicking opens a chat window
- Clicking again closes it

### Chat Window
- Shows conversation history (user + bot messages)
- Text input at the bottom
- Send button and Enter key both send message
- Loading indicator while bot is thinking

### Bot Capabilities (OpenAI Functions)
The bot can call these functions:
- create_task: creates a new task
- list_tasks: lists all tasks (with optional status filter)
- delete_task: deletes a task by title
- complete_task: marks a task complete by title

### Security
- JWT token sent with every chat request
- Backend verifies token before processing
- Bot only accesses tasks of authenticated user