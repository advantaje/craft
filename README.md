# CRAFT - Document Planning & Drafting System

## Technical Architecture Overview

CRAFT is a sophisticated document generation system that combines React frontend with Python backend to create AI-powered document drafting workflows. This README explains the internal code structure and architectural decisions.

## System Architecture

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   React Frontend │ ──────────────→ │  Python Backend  │
│   (TypeScript)   │ ←────────────── │   (Tornado)      │
└─────────────────┘                 └──────────────────┘
         │                                    │
         │                                    │
    ┌────▼────┐                          ┌───▼────┐
    │Material │                          │OpenAI  │
    │   UI    │                          │  API   │
    └─────────┘                          └────────┘
                                              │
                                         ┌────▼─────┐
                                         │ DocX     │
                                         │Generation│
                                         └──────────┘
```

## Core Data Flow

### 1. Document Lifecycle
```
User Input → Section Notes → AI Outline → AI Draft → AI Review → Document Generation
     │             │            │          │         │              │
     │             │            │          │         │              │
  Setup Phase   Content     Structure   Content   Refinement    Export
             Generation   Generation  Generation  Generation   Generation
```

### 2. Section State Management
Each document section maintains state through the workflow:
```typescript
interface DocumentSection {
  id: string;           // Unique identifier
  name: string;         // Display name
  type: string;         // Determines AI prompts
  templateTag?: string; // Word template placeholder
  data: {
    notes: string;      // User input
    outline: string;    // AI-generated structure
    draft: string;      // AI-generated content
    reviewNotes: string;// AI-generated feedback
  };
  isCompleted: boolean;     // Workflow completion status
  completionType?: 'normal' | 'empty'; // Completion method
}
```

## Frontend Architecture

### Component Hierarchy
```
App
├── HashRouter
    └── Craft (Main Container)
        ├── DocumentSetup (Review lookup + Template selection)
        ├── SectionWorkflow[] (Text-based sections)
        │   ├── Notes Input
        │   ├── Outline Generation
        │   ├── Draft Generation
        │   └── Review Cycle
        ├── TableWorkflow[] (Structured data sections)
        │   ├── Table Editor
        │   ├── JSON Data Management
        │   └── AI Table Generation
        └── FileGenerationModal (Document export)
```

### Key Design Patterns

#### 1. Custom Hooks Pattern
The `useDocumentSections` hook encapsulates all section state logic:
```typescript
export function useDocumentSections() {
  const [sections, setSections] = useState<DocumentSection[]>(DEFAULT_SECTIONS);
  
  // State management methods
  const updateSectionData = useCallback(/* ... */);
  const toggleSectionCompletion = useCallback(/* ... */);
  const addSection = useCallback(/* ... */);
  
  return {
    sections,
    updateSectionData,
    toggleSectionCompletion,
    // ... other methods
  };
}
```

#### 2. Workflow State Machine
Each section follows a defined state progression:
```
Empty → Notes Added → Outline Generated → Draft Generated → Review Applied → Complete
  │         │              │                 │                 │             │
  │         │              │                 │                 │             │
  ▼         ▼              ▼                 ▼                 ▼             ▼
Setup   Content         Structure        Content           Refinement    Ready
Phase   Collection      Planning         Creation          Cycle         Export
```

#### 3. Type-Safe API Layer
All API interactions are strongly typed:
```typescript
// Request/Response interfaces ensure type safety
export async function generateOutline(request: GenerateOutlineRequest): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<string>>('/generate-outline', request);
  return response.data.result;
}
```

### Section Type System

#### Standard Sections (Text-based)
- **Background**: Historical context and previous work
- **Product**: products and recommendations  
- **Usage**: Implementation instructions
- **Custom**: User-defined sections

#### Structured Sections (Table-based)
- **Model Limitations**: Technical constraints and scope
- **Model Risk Issues**: Risk assessment and categorization

Each type has specialized AI prompts and rendering logic.

## Backend Architecture

### Service Layer Design

#### 1. Generation Service (`generation_service.py`)
Handles AI content generation with section-aware processing:
```python
class GenerationService:
    def __init__(self):
        self.prompts = SectionPrompts()    # Section-specific prompts
        self.client = create_azure_openai_client()
        self.model = 'gpt-4.1-mini-2025-04-14'
    
    def generate_outline_from_notes(self, notes, section_name, section_type):
        prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
        # AI generation logic
        
    def generate_draft_from_outline(self, notes, outline, section_name, section_type):
        # Handles both text and JSON generation based on section_type
        if section_type in ['model_limitations', 'model_risk_issues']:
            # JSON mode for structured data
        else:
            # Standard text generation
```

#### 2. Document Generation Service (`document_generation_service.py`)
Transforms section data into Word documents:
```python
class DocumentGenerationService:
    def generate_docx_document(self, document_id, document_data, sections, template_info):
        # Load template (default or custom)
        # Process each section
        # Map content to template tags
        # Generate final document
```

### AI Prompt Architecture

#### Prompt Template System
The `SectionPrompts` class contains specialized templates for each section type and workflow stage:
```python
class SectionPrompts:
    OUTLINE_PROMPTS = {
        "introduction": "...",     # Section-specific outline guidance
        "background": "...",       # Historical context prompts
        "model_limitations": "...", # Table structure prompts
        # ... other section types
    }
    
    DRAFT_PROMPTS = {
        # Content generation templates
    }
    
    REVIEW_PROMPTS = {
        # Improvement feedback templates
    }
    
    REVISION_PROMPTS = {
        # Content refinement templates
    }
```

#### AI Generation Modes
1. **Text Mode**: Standard content generation for narrative sections
2. **JSON Mode**: Structured data generation for table sections
3. **Review Mode**: Analysis and feedback generation
4. **Revision Mode**: Content improvement based on feedback

### Document Processing Pipeline

#### 1. Template System
Uses custom DocxTemplate implementation with Jinja2:
```python
# Template tags map to section content
context = {
    'background': cleaned_background_content,
    'product': cleaned_product_content,
    'model_limitations': formatted_table_data,
    # ... other sections
}

doc.render(context)  # Jinja2 template rendering
```

#### 2. Content Processing
- **Text Sections**: Cleaned and formatted for Word
- **Table Sections**: JSON data converted to formatted tables
- **Template Tags**: Dynamic mapping based on section configuration

#### 3. File Generation
```python
def generate_docx_document_with_progress(self, document_id, document_data, sections, progress_callback, template_info):
    # 1. Load template (default or custom)
    # 2. Process section content
    # 3. Build context dictionary
    # 4. Render template with content
    # 5. Return BytesIO buffer
```

## Data Models

### Core Interfaces
```typescript
// Section data structure
interface SectionData {
  notes: string;        // User input
  outline: string;      // AI-generated structure  
  draft: string;        // AI-generated content
  reviewNotes: string;  // AI-generated feedback
}

// Document metadata
interface DocumentInfo {
  [key: string]: string; // Flexible document properties
}

// Template configuration
interface TemplateInfo {
  name: string;
  type: 'default' | 'custom';
  isUploaded?: boolean;
}

// Table configuration for structured sections
interface TableConfiguration {
  columns: TableColumn[];
  sectionType: string;
}
```

### API Request/Response Types
All API endpoints use strongly-typed interfaces:
- `GenerateOutlineRequest`
- `GenerateDraftFromOutlineRequest` 
- `GenerateReviewRequest`
- `GenerateDocumentRequest`

## Key Technical Decisions

### 1. Section-Based Architecture
- **Modular Design**: Each section is independent and reusable
- **Type Safety**: Strong typing throughout the stack
- **State Isolation**: Section state is managed independently

### 2. AI Integration Strategy
- **Prompt Engineering**: Section-specific prompts for better results
- **Mode Selection**: Different generation modes for text vs. structured data
- **Error Handling**: Graceful degradation for AI service issues

### 3. Document Generation Pipeline
- **Template Abstraction**: Flexible template system supporting custom uploads
- **Content Mapping**: Dynamic mapping of section content to template placeholders
- **Format Support**: Extensible to support multiple output formats

### 4. State Management
- **Custom Hooks**: Encapsulated state logic with React hooks
- **Immutable Updates**: Functional state updates for predictability
- **Completion Tracking**: Sophisticated completion state with exclusion support

## File Organization

```
craft/
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Craft.tsx        # Main container
│   │   │   ├── DocumentSetup.tsx # Setup workflow
│   │   │   ├── SectionWorkflow.tsx # Text sections
│   │   │   ├── TableWorkflow.tsx # Table sections
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useDocumentSections.ts
│   │   ├── services/            # API layer
│   │   │   └── api.service.ts
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── document.types.ts
│   │   └── config/              # Configuration
│   │       └── tableConfigurations.ts
│   └── package.json
├── backend/
│   ├── app.py                   # Tornado web server
│   ├── services/                # Business logic
│   │   ├── generation_service.py # AI generation
│   │   ├── document_generation_service.py # Document creation
│   │   └── openai_tools.py      # AI client
│   ├── prompts/                 # AI prompt templates
│   │   └── section_prompts.py
│   ├── template.py              # DocX template engine
│   └── template-tagged.docx     # Default Word template
└── README.md                    # This file
```

## Development Workflow

### 1. Adding New Section Types
1. Define section type in `useDocumentSections.ts`
2. Add prompts in `section_prompts.py`
3. Create component logic (text or table-based)
4. Update generation service handling
5. Add template tags to Word template

### 2. Extending AI Capabilities
1. Add prompt templates in `SectionPrompts`
2. Update generation service methods
3. Handle new data formats in document generation
4. Add API endpoints if needed

### 3. Document Format Support
1. Extend document generation service
2. Add format-specific processing logic
3. Update template handling
4. Add new API endpoints for format selection

## Performance Considerations

- **Lazy Loading**: Components load on-demand
- **State Optimization**: useCallback for expensive operations
- **API Batching**: Parallel API calls where possible
- **Memory Management**: Template caching with cleanup

## Security Features

- **Input Validation**: Comprehensive validation on both client and server
- **Template Security**: Safe template processing with validation
- **API Security**: CORS configuration and error handling
- **File Upload**: Restricted file types and validation

This architecture provides a solid foundation for AI-powered document generation while maintaining code quality, type safety, and extensibility.