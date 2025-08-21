# 🎨 CRAFT - AI-Powered Document Planning & Drafting System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-17+-blue.svg)](https://reactjs.org)
[![Material-UI](https://img.shields.io/badge/Material--UI-4.12+-blue.svg)](https://mui.com)

CRAFT is a sophisticated full-stack application that revolutionizes document creation through AI-powered assistance. It combines intelligent content generation with iterative improvement cycles to produce high-quality professional documents efficiently.

## ✨ Key Features

- **🤖 AI-Powered Content Generation** - Generate drafts from simple notes using GPT-4 and other OpenAI models
- **🔄 Iterative Improvement Cycle** - AI reviews, suggests improvements, and applies feedback with user approval
- **📊 Structured Table Management** - Create and manage complex data tables with AI assistance
- **🎯 Section-Based Workflow** - Organize documents into manageable, focused sections
- **📝 Intelligent Diff Visualization** - See exactly what changes before applying them with multiple view modes
- **📄 Professional Document Export** - Generate polished Word documents with custom templates
- **⚙️ Customizable AI Guidelines** - Fine-tune AI behavior for different section types
- **🎨 Rich User Interface** - Intuitive Material-UI components with progress tracking
- **🎯 Text Selection Review** - Target specific portions of text for AI improvement
- **📱 Persistent Sessions** - Auto-save progress with browser localStorage

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 14+** with npm
- **OpenAI API Key** (required for AI functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd craft
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `backend/` directory (or set environment variables):
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   HOST=0.0.0.0
   PORT=8888
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python server.py
   ```
   Server will start on `http://localhost:8888`

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Application will open at `http://localhost:3000`

## 📖 How It Works

### Document Creation Workflow

CRAFT follows a structured, AI-assisted approach to document creation:

#### 1. **📋 Document Setup**
- Enter Review ID to fetch document metadata (or work without metadata)
- Choose default template or upload custom Word template
- Configure AI model selection (GPT-4, GPT-4-mini, etc.)

#### 2. **📝 Section-Based Content Creation**
CRAFT organizes documents into focused sections:

**Text Sections:**
- **Background**: Historical context and previous work
- **Product**: Key findings and recommendations  
- **Usage**: Step-by-step implementation instructions
- **Custom Sections**: Add your own section types

**Table Sections:**
- **Model Limitations**: Technical constraints with categorization
- **Model Risk Issues**: Risk assessment with importance levels
- **Extensible**: Easy to add new table types

#### 3. **🔄 AI-Powered Iterative Improvement**
Each section follows a sophisticated 4-step workflow:

```
User Notes → AI Draft Generation → AI Review & Feedback → Apply Improvements → Finalize
```

- **Notes**: Provide initial thoughts and requirements
- **Draft**: AI generates structured content from notes
- **Review**: AI analyzes draft and suggests specific improvements
- **Revision**: AI applies feedback with diff preview for user approval

#### 4. **📄 Professional Document Export**
- Generate Word documents using default or custom templates
- Automatic placeholder mapping (e.g., `{{background}}`, `{{model_limitations}}`)
- Support for both text content and formatted tables

## 🏗️ Architecture

CRAFT is built as a modern full-stack application:

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React/TypeScript)              │
│  Material-UI Components │ State Management │ API Client    │
├─────────────────────────────────────────────────────────────┤
│                   HTTP/JSON API Layer                      │
│              RESTful Endpoints │ Request/Response           │
├─────────────────────────────────────────────────────────────┤
│                   Backend (Python/Tornado)                 │
│  Business Logic │ OpenAI Integration │ Document Generation │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **React 17** with TypeScript for type safety
- **Material-UI v4** for consistent, professional UI components
- **Custom hooks** for state management and business logic
- **Axios** for HTTP communication
- **Real-time diff visualization** with multiple viewing modes

**Backend:**
- **Python 3.8+** with Tornado async web framework
- **OpenAI GPT-4** integration for content generation
- **Structured JSON schemas** for table data validation
- **Word document generation** with template processing
- **Modular service architecture** for maintainability

## 📁 Project Structure

```
craft/
├── frontend/                   # React TypeScript frontend
│   └── src/
│       ├── components/        # React UI components
│       │   ├── Craft.tsx     # Main application shell
│       │   ├── DocumentSetup.tsx     # Review lookup & template selection
│       │   ├── SectionWorkflow.tsx   # Text section handler
│       │   ├── TableWorkflow.tsx     # Table section handler
│       │   └── DiffViewer.tsx        # Change visualization
│       ├── hooks/             # Custom React hooks
│       │   ├── useDocumentSections.ts # Section state management
│       │   └── useLocalStorage.ts     # Persistent storage
│       ├── services/          # API communication layer
│       │   └── api.service.ts # HTTP client for backend APIs
│       ├── types/             # TypeScript type definitions
│       ├── config/            # Configuration files
│       │   ├── defaultGuidelines.ts  # AI behavior guidelines
│       │   ├── tableConfigurations.ts # Table column definitions
│       │   └── modelConfigurations.ts # AI model settings
│       └── utils/             # Utility functions
│
├── backend/                    # Python Tornado backend
│   ├── server.py              # Main application entry point
│   ├── prompts/               # AI prompt templates
│   │   └── section_prompts.py # Section-specific prompt logic
│   └── services/              # Business logic modules
│       ├── generation_service.py      # Core AI generation
│       ├── document_generation_service.py  # Word doc creation
│       ├── diff_service.py           # Text comparison utilities
│       ├── json_schema_service.py    # Table structure definitions
│       ├── openai_tools.py           # OpenAI API integration
│       ├── review_data_service.py    # Data retrieval services
│       └── template_service.py       # Word template processing
│
├── CONFIGURATION.md           # Customization guide
└── README.md                  # This file
```

## ⚙️ Configuration

CRAFT is highly customizable through configuration files:

### AI Model Selection
- Support for multiple OpenAI models (GPT-4, GPT-4-mini, o4-mini)
- User-selectable model in the UI
- Model-specific optimizations (temperature, response format)

### Section Types
- Add new text sections in `frontend/src/hooks/useDocumentSections.ts`
- Define table sections in `frontend/src/config/tableConfigurations.ts`
- Configure AI guidelines in `frontend/src/config/defaultGuidelines.ts`

### Table Customization
- Modify column definitions in both frontend and backend configurations
- Support for text, number, select, and date field types
- Custom validation rules and requirements

**⚠️ Important**: Frontend and backend table configurations must match exactly.

## 🔧 Development

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/review-lookup` | GET | Fetch document metadata by Review ID |
| `/api/generate-draft-from-notes` | POST | Generate initial content from user notes |
| `/api/generate-review` | POST | AI analysis and feedback generation |
| `/api/generate-draft-from-review-with-diff` | POST | Apply feedback with diff tracking |
| `/api/generate-row-from-review-with-diff` | POST | Apply feedback to table rows |
| `/api/generate-table-from-review-with-diff` | POST | Apply feedback to entire tables |
| `/api/generate-review-for-selection` | POST | Review selected text portions |
| `/api/apply-review-to-selection-with-diff` | POST | Apply review to text selections |
| `/api/generate-document` | POST | Create final Word document |
| `/api/upload-template` | POST | Upload custom Word templates |

### Adding New Features

1. **New Section Types**: Modify configuration files in both frontend and backend
2. **Custom AI Guidelines**: Update `defaultGuidelines.ts` for section-specific behavior
3. **Table Columns**: Ensure frontend and backend configurations stay synchronized
4. **New Endpoints**: Follow the existing pattern in `server.py` and corresponding frontend services

## 🔒 Security & Privacy

- **API Key Security**: OpenAI keys stored server-side only, never exposed to frontend
- **Data Privacy**: All document data stored locally in browser storage only
- **No Server Persistence**: Backend doesn't permanently store user data
- **Template Safety**: Custom templates processed without macro execution
- **CORS Protection**: Properly configured cross-origin resource sharing

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended for large documents)
- **Storage**: 2GB free space for dependencies
- **Network**: Stable internet connection for OpenAI API calls

### Performance Notes
- AI generation typically takes 3-10 seconds per operation
- Document export is nearly instantaneous  
- Frontend optimized for modern browsers (Chrome, Firefox, Safari, Edge)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following existing code patterns
4. **Test thoroughly** (both frontend and backend)
5. **Submit a pull request**

### Code Style

**Python (Backend):**
- Follow PEP 8 conventions
- Use type hints where appropriate
- Document complex functions with docstrings

**TypeScript (Frontend):**
- Use functional components with hooks
- Prefer `const` assertions and explicit typing
- Follow React best practices for state management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT models that power our AI features
- **Material-UI Team** for the excellent React component library
- **Tornado Team** for the robust async Python web framework
- **React Team** for the incredible frontend framework

---

**Built with ❤️ for creating better documents through AI assistance.**

For detailed configuration and customization instructions, see [CONFIGURATION.md](./CONFIGURATION.md).