# Project Instructions for Claude

## Development Workflow

### Build and Start Commands
- **NEVER** automatically run start/build commands (npm start, python app.py, etc.)
- The user prefers to run these commands manually
- Only provide instructions on which commands to run, don't execute them

## Project Structure
- Frontend: React TypeScript with Material-UI v4 (port 3000)
- Backend: Python Tornado server (port 8888)
- Document planning and drafting application with 4-step workflow

## API Endpoints
- `GET /api/hello` - Health check
- `POST /api/generate-outline` - Creates outline from notes
- `POST /api/generate-draft-from-outline` - Generates initial draft from outline and notes
- `POST /api/generate-draft-from-review` - Updates draft based on review feedback
- `POST /api/generate-review` - Generates review suggestions from draft

## UI Design
- All workflow steps shown on one screen using card-based layout
- Steps 1-2: Notes → Outline (side by side)
- Step 3: Draft ↔ Review (cyclical process in same step)