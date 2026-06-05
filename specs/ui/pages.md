# UI Pages and Components

## Pages

### /signin
- Email and password input fields
- Sign In button with loading state
- Error message shown on invalid credentials
- Link to /signup page
- On success: saves token to localStorage, redirects to /tasks

### /signup
- Name, email and password input fields
- Create Account button with loading state
- Error message shown on duplicate email or failure
- Link to /signin page
- On success: saves token to localStorage, redirects to /tasks

### /tasks (protected)
Redirects to /signin if user is not authenticated.

#### Header
- App name and emoji logo on the left
- User greeting ("Hi, [name]") on the right
- Sign out button — clears localStorage, redirects to /signin

#### Filter Bar
- Three buttons: All | Pending | Completed
- Active filter is highlighted in blue
- Add Task button on the right

#### Add Task Form (inline, shown on button click)
- Title input (required)
- Description textarea (optional)
- Add Task button with loading state
- Cancel button

#### Task List
- Each task card shows:
  - Circle toggle button (green when completed)
  - Title (strikethrough when completed)
  - Description (if present)
  - Created date
  - Edit and Delete action buttons
- Empty state message when no tasks exist

#### Edit Task Modal
- Opens as overlay modal
- Pre-filled with current title and description
- Save and Cancel buttons

## Design Principles
- Clean minimal design using Tailwind CSS
- Responsive layout (works on mobile and desktop)
- Loading states on all async actions
- Error messages shown inline
- No full page reloads — all updates happen instantly