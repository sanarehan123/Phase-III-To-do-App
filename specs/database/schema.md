# Database Schema

## Database
Neon Serverless PostgreSQL
Connection via DATABASE_URL environment variable.

## Tables

### users
Stores registered user accounts.

| Column          | Type      | Constraints                  |
|-----------------|-----------|------------------------------|
| id              | VARCHAR   | Primary Key (UUID)           |
| email           | VARCHAR   | Unique, Indexed, Not Null    |
| name            | VARCHAR   | Not Null                     |
| hashed_password | VARCHAR   | Not Null                     |
| created_at      | TIMESTAMP | Default: now()               |

### tasks
Stores todo tasks linked to users.

| Column      | Type      | Constraints                        |
|-------------|-----------|------------------------------------|
| id          | SERIAL    | Primary Key (auto-increment)       |
| user_id     | VARCHAR   | Foreign Key -> users.id, Indexed   |
| title       | VARCHAR   | Not Null, max 200 chars            |
| description | VARCHAR   | Nullable, max 1000 chars           |
| completed   | BOOLEAN   | Default: false                     |
| created_at  | TIMESTAMP | Default: now()                     |
| updated_at  | TIMESTAMP | Default: now(), updated on change  |

## Indexes
- users.email — for fast login lookup
- tasks.user_id — for filtering tasks by user
- tasks.completed — for filtering by status

## Relationships
- tasks.user_id references users.id
- One user can have many tasks
- Deleting a user would cascade to their tasks