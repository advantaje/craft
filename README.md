# 🎨 CRAFT - AI-Powered Document Planning & Drafting System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-blue.svg)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-17+-blue.svg)](https://reactjs.org)
[![Material-UI](https://img.shields.io/badge/Material--UI-4.12+-blue.svg)](https://mui.com)

CRAFT is a sophisticated full-stack application that transforms document creation through AI-powered assistance. It combines intelligent content generation with iterative improvement cycles to produce high-quality professional documents efficiently.

## ✨ Key Features

- **🤖 AI-Powered Content Generation** - Generate drafts from simple notes using GPT-4
- **🔄 Iterative Improvement Cycle** - AI reviews, suggests improvements, and applies feedback
- **📊 Structured Table Management** - Create and manage complex data tables with AI assistance
- **🎯 Section-Based Workflow** - Organize documents into manageable, focused sections
- **📝 Intelligent Diff Visualization** - See exactly what changes before applying them
- **📄 Professional Document Export** - Generate polished Word documents with custom templates
- **⚙️ Customizable AI Guidelines** - Fine-tune AI behavior for different section types
- **🎨 Rich User Interface** - Intuitive Material-UI components with progress tracking

## 🏗️ Architecture

CRAFT is built as a modern full-stack application with clear separation of concerns:

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

### Frontend Stack
- **React 17** with TypeScript for type safety
- **Material-UI v4** for consistent, professional UI components
- **Custom hooks** for state management and business logic
- **Axios** for HTTP communication
- **Real-time diff visualization** with multiple viewing modes

### Backend Stack
- **Python 3.8+** with Tornado web framework
- **OpenAI GPT-4** integration for content generation
- **Structured JSON schemas** for table data validation
- **Word document generation** with Jinja2 templating
- **Modular service architecture** for maintainability

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 14+** with npm
- **OpenAI API Key** (for AI functionality)

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
   ```bash
   # Backend: Create .env file in backend/
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=8888
   
   # Frontend: Create .env file in frontend/
   REACT_APP_API_BASE_URL=http://localhost:8888
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Open http://localhost:3000 in your browser
   - The backend API will be running on http://localhost:8888

## 📖 How It Works

### Document Creation Workflow

1. **📋 Document Setup**
   - Enter Review ID to fetch document metadata
   - Choose default or custom Word template
   - Setup must be complete before proceeding

2. **📝 Section-Based Content Creation**
   CRAFT organizes documents into focused sections:
   
   **Text Sections:**
   - **Background**: Historical context and previous work
   - **Product**: Key findings and recommendations
   - **Usage**: Step-by-step implementation instructions
   
   **Table Sections:**
   - **Model Limitations**: Technical constraints and scope boundaries
   - **Model Risk Issues**: Risk assessment with categorization and importance levels

3. **🔄 AI-Powered Iterative Improvement**
   Each section follows a sophisticated 4-step workflow:
   
   ```
   Notes Input → AI Draft Generation → AI Review & Feedback → Apply Improvements
   ```
   
   - **Notes**: User provides initial thoughts and requirements
   - **Draft**: AI generates structured content from notes
   - **Review**: AI analyzes draft and suggests specific improvements
   - **Revision**: AI applies feedback with diff preview for user approval

4. **📄 Professional Document Export**
   - Generate Word documents using default or custom templates
   - Automatic placeholder mapping (e.g., `{{background}}`, `{{model_limitations}}`)
   - Support for both text content and formatted tables

### Advanced Features

#### 🎯 Text Selection & Targeted Review
- Select specific text portions for focused AI review
- Apply improvements only to selected content
- Context-aware AI considers surrounding text

#### 📊 Smart Table Management
- Interactive table editor with validation
- Multi-row selection for batch operations
- AI-powered table generation from natural language descriptions
- Support for different data types (text, select dropdowns, numbers, dates)

#### 🔍 Intelligent Diff Visualization
Multiple viewing modes for reviewing changes:
- **Unified View**: Single pane with highlighted additions/deletions
- **Side by Side**: Clean comparison view
- **Side by Side (Highlighted)**: Detailed change visualization

#### ⚙️ Customizable AI Guidelines
- Section-specific AI behavior customization
- Three operation types: Draft Writing, Review & Feedback, Revision Process
- Per-section guidelines with reset to defaults option

## 📁 Project Structure

```
craft/
├── backend/                    # Python Tornado backend
│   ├── app.py                 # Main application entry point
│   ├── prompts/               # AI prompt templates
│   │   └── section_prompts.py # Section-specific prompt logic
│   └── services/              # Business logic modules
│       ├── generation_service.py      # Core AI generation
│       ├── document_generation_service.py  # Word doc creation
│       ├── diff_service.py           # Text comparison utilities
│       ├── json_schema_service.py    # Table structure definitions
│       ├── openai_tools.py           # OpenAI API integration
│       ├── review_data_service.py    # Data retrieval
│       └── template_service.py       # Word template processing
│
├── frontend/                   # React TypeScript frontend
│   └── src/
│       ├── components/        # React UI components
│       │   ├── About.tsx     # User guide and help
│       │   ├── Craft.tsx     # Main application shell
│       │   ├── DocumentSetup.tsx     # Review lookup & template selection
│       │   ├── SectionWorkflow.tsx   # Text section handler
│       │   ├── TableWorkflow.tsx     # Table section handler
│       │   ├── DiffViewer.tsx        # Change visualization
│       │   └── [other components]
│       ├── hooks/             # Custom React hooks
│       │   └── useDocumentSections.ts # Section state management
│       ├── services/          # API communication layer
│       │   └── api.service.ts # HTTP client for backend APIs
│       ├── types/             # TypeScript type definitions
│       │   └── document.types.ts     # Core data structures
│       ├── config/            # Configuration files
│       │   ├── defaultGuidelines.ts  # AI behavior guidelines
│       │   └── tableConfigurations.ts # Table column definitions
│       └── utils/             # Utility functions
│
├── CONFIGURATION.md           # Customization guide
├── DEVELOPER_GUIDE.md         # Developer onboarding
└── README.md                  # This file
```

## 🎛️ Configuration & Customization

CRAFT is highly customizable through configuration files:

### Adding New Sections
- **Frontend**: Modify `useDocumentSections.ts` and `defaultGuidelines.ts`
- **Backend**: Update `section_prompts.py` for new section types

### Table Structure Customization
- **Frontend**: Edit `tableConfigurations.ts` for UI definitions
- **Backend**: Update `json_schema_service.py` for validation schemas
- **⚠️ Important**: Frontend and backend table configs must match exactly

### AI Behavior Modification
- **Guidelines**: Customize `defaultGuidelines.ts` for section-specific behavior
- **Prompts**: Modify `section_prompts.py` for fundamental prompt changes

See [CONFIGURATION.md](./CONFIGURATION.md) for detailed customization instructions.

## 🛠️ Development

### For New Developers
If you're new to this codebase, especially coming from a Python background, see our comprehensive [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) which includes:

- Full-stack architecture explanation
- Frontend concepts for Python developers
- Data flow walkthroughs
- Common debugging techniques
- Step-by-step feature addition guides

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/review-lookup` | POST | Fetch document metadata by Review ID |
| `/api/generate-draft-from-notes` | POST | Generate initial content from user notes |
| `/api/generate-review` | POST | AI analysis and feedback generation |
| `/api/generate-draft-from-review-with-diff` | POST | Apply feedback with diff tracking |
| `/api/generate-document` | POST | Create final Word document |
| `/api/upload-template` | POST | Upload custom Word templates |

### Technology Choices

**Frontend:**
- **React 17**: Mature, stable version with excellent ecosystem
- **TypeScript**: Static typing for better development experience
- **Material-UI v4**: Consistent, professional UI components
- **Custom hooks**: Clean separation of business logic from UI

**Backend:**
- **Tornado**: High-performance async Python web framework
- **OpenAI GPT-4**: State-of-the-art language model for content generation
- **python-docx**: Word document manipulation
- **Jinja2**: Template rendering for document generation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed
4. **Test thoroughly**
   - Test both frontend and backend changes
   - Verify AI generation still works
   - Check document export functionality
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

### Manual Testing
1. Complete document creation workflow
2. Test all AI generation features
3. Verify Word document export
4. Test custom template upload
5. Validate table operations

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Network**: Stable internet connection for OpenAI API calls

### Performance Considerations
- AI generation typically takes 3-10 seconds per operation
- Document export is nearly instantaneous
- Frontend is optimized for modern browsers (Chrome, Firefox, Safari, Edge)

## 🔒 Security & Privacy

- **API Keys**: Never commit OpenAI API keys to version control
- **Data Storage**: All document data is stored locally in browser storage
- **Network**: All AI requests are made server-side to protect API credentials
- **Templates**: Custom templates are processed securely without executing macros

## 📈 Roadmap

- [ ] **Enhanced AI Models**: Support for different OpenAI models and providers
- [ ] **Collaboration Features**: Multi-user document editing
- [ ] **Version Control**: Document history and branching
- [ ] **Advanced Templates**: More sophisticated template customization
- [ ] **Export Formats**: PDF, HTML, and Markdown export options
- [ ] **Offline Mode**: Basic functionality without AI assistance

## 🐛 Known Issues

- **Large Documents**: Performance may degrade with very large documents (>50 sections)
- **Internet Dependency**: AI features require stable internet connection
- **Browser Storage**: Clearing browser data will lose unsaved work
- **Template Complexity**: Very complex Word templates may not render perfectly

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API that powers our AI features
- **Material-UI Team** for the excellent React component library
- **Tornado Team** for the robust async Python web framework
- **React Team** for the incredible frontend framework

## 📞 Support

- **Documentation**: See [CONFIGURATION.md](./CONFIGURATION.md) and [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Issues**: Please report bugs and feature requests through GitHub issues
- **Questions**: For general questions about usage or development

---

**Built with ❤️ for creating better documents through AI assistance.**