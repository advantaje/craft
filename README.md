# Hello World Application

A simple full-stack application with React TypeScript frontend and Python Tornado backend.

## Features

- **Frontend**: React with TypeScript, Material-UI v4, React Router
- **Backend**: Python Tornado web server
- Hello World API endpoint with timestamp
- Modern Material Design UI

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
2. Click "Get Hello World" to fetch a message from the backend
3. Navigate to the About page using the navigation bar

## API Endpoints

- `GET /api/hello` - Returns a hello world message with timestamp