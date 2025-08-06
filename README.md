# Craft - Document Planning & Drafting

A full-stack document planning and drafting application with React TypeScript frontend and Python Tornado backend. Craft helps users create structured documents through a guided 4-step workflow with AI-powered processing.

## Features

- **Frontend**: React with TypeScript, Material-UI v4, React Router
- **Backend**: Python Tornado web server with document processing endpoints
- **4-Step Workflow**: Notes → Draft Outline → Initial Draft → Review Notes
- **Section-Based Organization**: Pre-defined sections (Introduction, Background, Usage, Conclusion) with ability to add custom sections
- **AI-Powered Processing**: Generate outlines from notes, drafts from outlines, and review suggestions
- **Tabbed Interface**: Work on multiple document sections simultaneously
- **Modern Material Design UI**

## Setup and Running

### Backend (Tornado)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Tornado server:
   ```bash
   python app.py
   ```

   The backend will run on http://localhost:8888

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on http://localhost:3000

## Usage

1. Open your browser to http://localhost:3000
2. Use the tabbed interface to work on different document sections
3. Follow the 4-step workflow:
   - **Step 1 - Notes**: Write initial notes and thoughts
   - **Step 2 - Draft Outline**: Generate or write an outline (can be AI-generated from notes)
   - **Step 3 - Initial Draft**: Create the first draft (can be AI-generated from outline)
   - **Step 4 - Review Notes**: Add review feedback and revise the draft
4. Add custom sections using the "+" tab
5. Navigate between steps using the stepper interface and control buttons
6. Visit the About page for more detailed feature information

## API Endpoints

- `GET /api/hello` - Returns a hello world message with timestamp
- `POST /api/generate-outline` - Generates an outline from provided notes
- `POST /api/generate-draft` - Creates a draft from notes and outline
- `POST /api/generate-review` - Provides review suggestions or applies review feedback to update drafts