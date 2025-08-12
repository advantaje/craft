# 🚀 Deployment Configuration Guide

This guide explains how to configure the Craft application for different deployment scenarios using environment variables.

## 📋 Overview

The application now uses environment variables for host/port configuration, enabling flexible deployment across different environments.

## 🔧 Backend Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Backend Environment Configuration
# Host configuration - 0.0.0.0 means listen on all interfaces  
HOST=0.0.0.0

# Port for the backend server
PORT=8888

# Frontend URL for CORS configuration
FRONTEND_URL=http://localhost:3000
```

### Configuration Examples

#### 🏠 Local Development
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=http://localhost:3000
```

#### 🌐 Production Deployment
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=https://your-frontend-domain.com
```

#### 🏢 Internal Network
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=http://192.168.1.100:3000
```

## 🎨 Frontend Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Frontend Environment Configuration
# API Base URL for backend communication
# In React, env vars must start with REACT_APP_ to be accessible
REACT_APP_API_BASE_URL=http://localhost:8888/api
```

### Configuration Examples

#### 🏠 Local Development
```bash
REACT_APP_API_BASE_URL=http://localhost:8888/api
```

#### 🌐 Production Deployment
```bash
REACT_APP_API_BASE_URL=https://api.your-backend-domain.com/api
```

#### 🏢 Internal Network
```bash
REACT_APP_API_BASE_URL=http://192.168.1.200:8888/api
```

#### ☁️ Cloud Deployment
```bash
REACT_APP_API_BASE_URL=http://your-server-ip:8888/api
```

## 📦 Deployment Scenarios

### 1. Same Machine Deployment

Both frontend and backend on the same server:

**Backend `.env`:**
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=http://your-server-ip:3000
```

**Frontend `.env`:**
```bash
REACT_APP_API_BASE_URL=http://your-server-ip:8888/api
```

### 2. Separate Servers

Frontend and backend on different servers:

**Backend `.env`:**
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=http://frontend-server-ip:3000
```

**Frontend `.env`:**
```bash
REACT_APP_API_BASE_URL=http://backend-server-ip:8888/api
```

### 3. Docker Deployment

**Backend `.env`:**
```bash
HOST=0.0.0.0
PORT=8888
FRONTEND_URL=http://frontend-container:3000
```

**Frontend `.env`:**
```bash
REACT_APP_API_BASE_URL=http://backend-container:8888/api
```

## 🔄 API Unification

All API calls now use a centralized configuration:

- ✅ **Unified axios instance** for consistent API communication
- ✅ **Environment-based URL configuration** 
- ✅ **Centralized error handling**
- ✅ **Proper CORS configuration**

### Key Changes Made:

1. **Backend (`app.py`):**
   - Server listens on `0.0.0.0` (all interfaces)
   - CORS origins configurable via `FRONTEND_URL`
   - Host/port configurable via environment variables

2. **Frontend API Service (`api.service.ts`):**
   - Base URL from `REACT_APP_API_BASE_URL` environment variable
   - Added `uploadTemplate()` function using axios
   - All API calls use the centralized axios instance

3. **Components Updated:**
   - `FileGenerationModal.tsx`: Uses environment variable for streaming endpoint
   - `DocumentSetup.tsx`: Converted to use axios for file upload

## 🚀 Quick Start

1. **Copy the example .env files:**
   ```bash
   # Backend
   cp backend/.env backend/.env.local
   
   # Frontend  
   cp frontend/.env frontend/.env.local
   ```

2. **Modify the URLs in your `.env.local` files** to match your deployment setup

3. **Restart both servers** to pick up the new environment variables

## 🛠️ Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that both servers are accessible from each other

### Connection Refused
- Verify backend is listening on `0.0.0.0` not `127.0.0.1`
- Check firewall rules allow connections on the specified port

### Environment Variables Not Loading
- Restart the development server after changing `.env` files
- Ensure React env vars start with `REACT_APP_`

## 📝 Notes

- Environment variables take precedence over hardcoded values
- The backend will fallback to default values if env vars aren't set
- CORS is properly configured for cross-origin requests
- All API communication is now centralized through axios