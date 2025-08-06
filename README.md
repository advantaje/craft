# Craft - Document Planning & Drafting

A full-stack document planning and drafting application with React TypeScript frontend and Python Tornado backend. Craft helps users create structured documents through a guided 3-step workflow with AI-powered processing and smart completion tracking.

## ✨ Key Features

### 📝 **Smart Workflow**
- **3-Step Process**: Notes → Draft Outline → Draft & Review Cycle
- **All-in-One View**: See all steps on one screen with card-based layout
- **Smart Progress Tracking**: Visual stepper shows active step based on focused textbox
- **Intelligent Checkmarks**: Steps marked complete only when next step has content

### 🎯 **Section Management**
- **Pre-defined Sections**: Introduction, Background, Usage, Conclusion
- **Custom Sections**: Add unlimited custom sections via "+" tab
- **Completion Tracking**: Mark sections as complete with visual checkmarks in tabs
- **Lock-out Protection**: Completed sections become read-only until reopened

### 🤖 **AI-Powered Processing**
- **Generate Outlines**: Create structured outlines from your notes
- **Draft Generation**: Generate initial drafts from outlines and notes
- **Review Suggestions**: AI-powered feedback and improvement suggestions  
- **Cyclical Revision**: Apply review feedback to continuously improve drafts

### 🎨 **Modern UI/UX**
- **Material-UI v4**: Professional, accessible interface
- **Focus-Based Highlighting**: Steps highlight only when text fields are focused
- **Error Handling**: Clear warnings for incomplete sections
- **Beautiful Document View**: Formatted final document display for completed sections
- **Responsive Design**: Works on desktop and tablet devices

### 🔧 **Technical Features**
- **React TypeScript**: Type-safe frontend development
- **Python Tornado**: High-performance async backend
- **Real-time Processing**: Instant API responses with loading states
- **State Management**: Persistent section data during session

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

## 🚀 Usage Guide

### Getting Started
1. Open your browser to **http://localhost:3000**
2. Choose a document section tab (Introduction, Background, Usage, Conclusion) or add a custom section with the **"+"** tab

### 3-Step Workflow
**Step 1: Notes**
- Write your initial thoughts, ideas, and research
- Click **"Generate Outline →"** to create a structured outline from your notes

**Step 2: Draft Outline** 
- Review and edit the AI-generated outline or write your own
- Click **"Generate Draft →"** to create an initial draft from your outline

**Step 3: Draft & Review Cycle** (Cyclical Process)
- **Left Side**: Your draft content appears here
- **Right Side**: Generate review suggestions or add your own feedback
- Use **"Generate Review →"** for AI-powered suggestions  
- Use **"← Apply & Update Draft"** to revise your draft based on feedback
- **Repeat the cycle** to continuously improve your content

### Section Completion
- Click **"Mark Complete"** when satisfied with a section (requires draft content)
- Completed sections show a **✓ checkmark** in the tab
- View the **beautifully formatted final document** for completed sections  
- Use **"Reopen Section"** to make further edits if needed

### Visual Feedback
- **Progress Stepper**: Shows which step you're currently working on (based on focused textbox)
- **Smart Checkmarks**: Steps show completion only when the next step has content
- **Warning Indicators**: Clear alerts when draft content is missing

## 🔌 API Endpoints

- **`GET /api/hello`** - Health check endpoint with timestamp
- **`POST /api/generate-outline`** - Creates structured outline from notes
  - Input: `{ notes: string }`
  - Output: `{ outline: string }`
- **`POST /api/generate-draft-from-outline`** - Generates initial draft from outline and notes
  - Input: `{ notes: string, outline: string }`
  - Output: `{ draft: string }`
- **`POST /api/generate-review`** - Provides AI-powered review suggestions
  - Input: `{ draft: string }`
  - Output: `{ review: string }`
- **`POST /api/generate-draft-from-review`** - Applies review feedback to update draft
  - Input: `{ draft: string, reviewNotes: string }`
  - Output: `{ draft: string }`

## 💡 Pro Tips

- **Focus-driven UI**: The stepper highlights the step corresponding to your currently focused textbox
- **Cyclical Process**: Step 3 is designed for iteration—generate reviews and apply feedback repeatedly  
- **Section Independence**: Each section maintains its own progress and can be worked on separately
- **Completion Benefits**: Completed sections display as professionally formatted documents
- **Custom Sections**: Add sections for any document type (Executive Summary, Methodology, etc.)