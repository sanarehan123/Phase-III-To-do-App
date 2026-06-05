# Feature: Task CRUD Operations

## Overview
Authenticated users can create, read, update, delete and complete tasks.
Each task belongs to one user and is never visible to other users.

## User Stories
- As a user, I can create a task with a title and optional description
- As a user, I can see all my tasks in a list
- As a user, I can filter tasks by: All, Pending, Completed
- As a user, I can edit a task's title and description
- As a user, I can delete a task permanently
- As a user, I can mark a task complete or incomplete

## Acceptance Criteria

### Create Task
- Title is required (max 200 characters)
- Description is optional (max 1000 characters)
- Task is linked to the authenticated user's ID
- New task appears immediately in the list

### View Tasks
- Only tasks belonging to the current user are shown
- Each task shows: title, description, completion status, created date
- Default view shows all tasks
- Filter options: All | Pending | Completed

### Edit Task
- User can update title and/or description
- Changes are saved to the database immediately
- Only the task owner can edit it

### Delete Task
- Task is permanently removed from the database
- Only the task owner can delete it
- Task disappears from list immediately

### Complete Task
- Clicking the circle button toggles completed status
- Completed tasks show green checkmark and strikethrough title
- Only the task owner can toggle completion

## UI Behaviour
- Add Task button opens an inline form
- Edit opens a modal dialog
- All actions update the UI immediately without full page reload


