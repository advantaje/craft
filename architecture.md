# CRAFT - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Orchestration & Processing Flow](#data-orchestration--processing-flow)
5. [Section-Specific Prompt System](#section-specific-prompt-system)
6. [API Integration Patterns](#api-integration-patterns)
7. [LLM Integration Points](#llm-integration-points)
8. [Extension Points](#extension-points)
9. [Performance & Error Handling](#performance--error-handling)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

CRAFT is a full-stack document planning and drafting application built with React TypeScript frontend and Python Tornado backend. The system provides a 3-step workflow for document creation with AI-assisted section-specific content generation.

### Core Technologies
- **Frontend**: React 17, TypeScript, Material-UI v4, React Router v6
- **Backend**: Python Tornado (async), Section-specific prompt templates
- **Architecture**: REST API with CORS, Modular service-oriented design
- **State Management**: React Hooks with custom state management hooks

---

## Frontend Architecture

### Component Hierarchy Tree

```
App.tsx (Root)
├── Router (React Router v6)
│   ├── Route: "/" → Craft.tsx (Main Application)
│   └── Route: "/about" → About.tsx (About Page)
│
Craft.tsx (176 lines - Main Orchestrator)
├── AppBar & Navigation
├── TabPanel System
├── DocumentLookup.tsx (Home Tab)
│   ├── DocumentInfoDisplay Component (Internal)
│   └── API Integration → apiService.lookupDocument()
│
├── SectionWorkflow.tsx (Per Section Tab)
│   ├── FormattedDocument.tsx (Completed Sections)
│   ├── Step Cards:
│   │   ├── Notes Input → apiService.generateOutline()
│   │   ├── Outline Input → apiService.generateDraftFromOutline()
│   │   └── Draft/Review Cycle → apiService.generateReview()
│   │                          → apiService.generateDraftFromReview()
│   └── Progress Stepper (Focus-based)
│
└── Add Section Dialog (Dynamic Tab Creation)

Supporting Architecture:
├── hooks/
│   ├── useDocumentSections.ts (Section State Management)
│   └── useApiCall.ts (Generic API Call Hook)
├── services/
│   └── api.service.ts (Typed API Client)
└── types/
    └── document.types.ts (TypeScript Interfaces)
```

### Component Responsibility Matrix

| Component | Responsibility | State | Props |
|-----------|---------------|-------|-------|
| `App.tsx` | Application shell, routing, theming | None | None |
| `Craft.tsx` | Tab orchestration, section management | `currentTab`, `documentData` | None |
| `DocumentLookup.tsx` | Document ID lookup functionality | `documentId`, `isLoading`, `error` | `onDocumentFound` |
| `SectionWorkflow.tsx` | 3-step workflow per section | `focusedField`, `loading` | `section`, `onSectionUpdate`, `onToggleCompletion` |
| `FormattedDocument.tsx` | Final document display | None | `content`, `title` |

### Custom Hooks Architecture

```
useDocumentSections()
├── State: sections[] (DocumentSection[])
├── Actions:
│   ├── updateSectionData(sectionId, field, value)
│   ├── toggleSectionCompletion(sectionId)
│   ├── addSection(name) → creates type: 'custom'
│   └── getSectionById(sectionId)
└── Default Sections:
    ├── Introduction (type: 'introduction')
    ├── Background (type: 'background')
    ├── Usage (type: 'usage')
    └── Conclusion (type: 'conclusion')

useApiCall<T, P>(apiFunction)
├── State: data, loading, error
├── Methods: execute(params), reset()
└── Generic error handling & loading states
```

---

## Backend Architecture

### Modular Service Structure

```
backend/
├── app.py (Main Application - 230 lines)
│   ├── BaseHandler (CORS, Error Handling)
│   ├── HelloHandler (Health Check)
│   ├── DocumentLookupHandler (Mock Data)
│   └── Generation Handlers:
│       ├── GenerateOutlineHandler
│       ├── GenerateDraftFromOutlineHandler
│       ├── GenerateReviewHandler
│       └── GenerateDraftFromReviewHandler
│
├── services/
│   └── generation_service.py (Core Business Logic)
│       ├── GenerationService Class
│       ├── Section-aware content generation
│       └── Prompt template integration
│
├── prompts/
│   └── section_prompts.py (Prompt Templates)
│       ├── SectionPrompts Class
│       ├── OUTLINE_PROMPTS (by section type)
│       ├── DRAFT_PROMPTS (by section type)
│       ├── REVIEW_PROMPTS (by section type)
│       └── Template selection methods
│
└── requirements.txt (Dependencies)
```

### Handler Architecture Pattern

```python
class GenerateOutlineHandler(BaseHandler):
    def __init__(self):
        self.generation_service = GenerationService()  # Dependency Injection
    
    def post(self):
        # 1. Parse request body (notes, sectionName, sectionType)
        # 2. Call generation_service with section context
        # 3. Return structured response
        # 4. Handle errors uniformly
```

### Service Layer Pattern

```python
class GenerationService:
    def generate_outline_from_notes(self, notes, section_name, section_type):
        # 1. Get section-specific prompt template
        prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
        
        # 2. [FUTURE] Call LLM API with prompt
        # For now: Generate structured placeholder content
        
        # 3. Return section-appropriate outline structure
```

---

## Data Orchestration & Processing Flow

### User Text Processing Pipeline

```
USER INPUT FLOW:

1. Notes Input
   ┌─────────────────┐
   │ User types      │
   │ notes in        │ → SectionWorkflow.tsx
   │ TextField       │   (onSectionUpdate)
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ useDocumentSections│ → updateSectionData()
   │ updates section.data│   stores in state
   └─────────────────┘

2. Generate Outline
   ┌─────────────────┐
   │ User clicks     │
   │ "Generate       │ → SectionWorkflow.tsx
   │ Outline →"      │   (generateOutline)
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ API Call via    │ → apiService.generateOutline()
   │ api.service.ts  │   { notes, sectionName, sectionType }
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ HTTP POST to    │ → /api/generate-outline
   │ Backend Handler │   GenerateOutlineHandler.post()
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ GenerationService│ → generate_outline_from_notes()
   │ Section-specific │   gets prompt template for section type
   │ processing      │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ [FUTURE LLM]    │ → OpenAI/Anthropic API call
   │ For now:        │   with section-specific prompt
   │ Template-based  │
   │ generation      │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Response back   │ → { outline: "generated content" }
   │ through layers  │   HTTP → apiService → Component
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ UI Update       │ → outline TextArea populated
   │ Section state   │   onSectionUpdate called
   │ updated         │
   └─────────────────┘
```

### Complete 3-Step Workflow Orchestration

```
FULL WORKFLOW ORCHESTRATION:

Step 1: Notes → Outline
┌─────────────────────────────────────────────────────────────┐
│ Frontend: SectionWorkflow.tsx                               │
│ ┌─────────────┐ generateOutline() ┌─────────────────────┐   │
│ │ Notes Input │ ─────────────────→ │ API Call with       │   │
│ │ TextArea    │                   │ section context     │   │
│ └─────────────┘                   └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend: GenerateOutlineHandler + GenerationService        │
│ ┌─────────────────┐ section-specific ┌─────────────────┐   │
│ │ Extract section │ ─────────────────→ │ Get outline     │   │
│ │ context from    │                   │ prompt template │   │
│ │ request body    │                   │ for section type│   │
│ └─────────────────┘                   └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│ LLM Integration Point (Future)                             │
│ ┌─────────────────┐                 ┌─────────────────┐   │
│ │ Formatted prompt│ ──── [LLM] ────→ │ Generated       │   │
│ │ with section    │      API         │ outline content │   │
│ │ guidance        │                  │                 │   │
│ └─────────────────┘                 └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Step 2: Outline → Draft
[Similar pattern with generateDraftFromOutline()]

Step 3: Draft ↔ Review Cycle
┌─────────────────────────────────────────────────────────────┐
│ Cyclical Process:                                          │
│                                                             │
│ Draft ──generateReview()──→ Review Notes                   │
│   ▲                              │                         │
│   │                              │                         │
│   └──generateDraftFromReview()───┘                         │
│                                                             │
│ User can repeat this cycle multiple times for refinement   │
└─────────────────────────────────────────────────────────────┘
```

---

## Section-Specific Prompt System

### Prompt Template Architecture

```
prompts/section_prompts.py
│
├── SectionPrompts Class
│   ├── OUTLINE_PROMPTS = {
│   │   "introduction": "Prompt focused on topic intro, objectives..."
│   │   "background": "Prompt focused on context, history..."
│   │   "usage": "Prompt focused on practical instructions..."
│   │   "conclusion": "Prompt focused on summary, next steps..."
│   │   "default": "Generic prompt for custom sections"
│   │   }
│   │
│   ├── DRAFT_PROMPTS = {
│   │   [Similar structure with section-specific guidance]
│   │   }
│   │
│   └── REVIEW_PROMPTS = {
│       [Section-specific review criteria]
│       }
│
└── Template Selection Methods:
    ├── get_outline_prompt(section_type, section_name, notes)
    ├── get_draft_prompt(section_type, section_name, notes, outline)
    └── get_review_prompt(section_type, section_name, draft)
```

### Section Type Mapping

| Frontend Section | Backend Type | Prompt Characteristics |
|------------------|--------------|------------------------|
| Introduction | `"introduction"` | Focus on engagement, topic intro, objectives |
| Background | `"background"` | Historical context, current state, gaps |
| Usage | `"usage"` | Practical instructions, examples, implementation |
| Conclusion | `"conclusion"` | Summary, implications, next steps |
| Custom Sections | `"custom"` | Generic but appropriate guidance |

### Prompt Generation Flow

```
Prompt Selection Process:

1. Frontend Request:
   {
     notes: "user input text",
     sectionName: "Introduction", 
     sectionType: "introduction"
   }

2. Backend Processing:
   GenerationService.generate_outline_from_notes()
   └── SectionPrompts.get_outline_prompt("introduction", "Introduction", notes)
       └── Returns formatted prompt:
           "You are creating an outline for an Introduction section...
            Based on the following notes: [user notes]
            Create a clear, logical outline..."

3. [Future] LLM Integration:
   prompt → OpenAI/Anthropic API → section-appropriate response

4. Current Implementation:
   prompt → template-based generation → structured placeholder content
```

---

## API Integration Patterns

### TypeScript Type System

```typescript
// Complete Request/Response Type Chain

// Input Types
interface GenerateOutlineRequest {
  notes: string;
  sectionName: string;    // ← Section context added
  sectionType: string;    // ← Section context added
}

// Response Types  
interface GenerateOutlineResponse {
  outline: string;
}

// Error Types
interface ApiError {
  error: string;
}
```

### API Service Architecture

```typescript
class ApiService {
  // Centralized error handling
  private async fetchWithErrorHandling<T>(url, options): Promise<T>
  
  // Typed API methods
  async generateOutline(request: GenerateOutlineRequest): Promise<GenerateOutlineResponse>
  async generateDraftFromOutline(request: GenerateDraftFromOutlineRequest): Promise<GenerateDraftFromOutlineResponse>
  async generateReview(request: GenerateReviewRequest): Promise<GenerateReviewResponse>
  async generateDraftFromReview(request: GenerateDraftFromReviewRequest): Promise<GenerateDraftFromReviewResponse>
}

export const apiService = new ApiService(); // Singleton instance
```

### API Request Flow Pattern

```
API Request Lifecycle:

1. Component Event:
   SectionWorkflow.generateOutline() called

2. API Service Call:
   apiService.generateOutline({
     notes: section.data.notes,
     sectionName: section.name,      // ← Section context
     sectionType: section.type       // ← Section context  
   })

3. HTTP Request:
   POST /api/generate-outline
   Content-Type: application/json
   Body: { notes, sectionName, sectionType }

4. Backend Handler:
   GenerateOutlineHandler.post()
   ├── Parse JSON body
   ├── Extract section context
   ├── Call GenerationService
   └── Return structured response

5. Response Chain:
   Backend → HTTP Response → ApiService → Component → UI Update
```

---

## LLM Integration Points

### Current vs Future Architecture

```
CURRENT IMPLEMENTATION (Placeholder):
┌─────────────────────────────────────────────────────────────┐
│ GenerationService Methods                                  │
│ ┌─────────────────┐               ┌─────────────────────┐   │
│ │ Section-specific│ ────────────→ │ Template-based      │   │
│ │ prompt created  │               │ placeholder content │   │
│ └─────────────────┘               └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

FUTURE LLM INTEGRATION:
┌─────────────────────────────────────────────────────────────┐
│ GenerationService Methods                                  │
│ ┌─────────────────┐  LLM API Call  ┌─────────────────────┐   │
│ │ Section-specific│ ─────────────→ │ OpenAI/Anthropic    │   │
│ │ prompt ready    │    (HTTP)      │ Claude/GPT API      │   │
│ └─────────────────┘               └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### LLM Integration Implementation Guide

#### Where to Add LLM Calls

1. **File**: `backend/services/generation_service.py`
2. **Methods to Modify**:
   ```python
   def generate_outline_from_notes(self, notes, section_name, section_type):
       prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
       
       # REPLACE THIS SECTION:
       # [Current placeholder logic]
       
       # WITH LLM API CALL:
       response = await llm_client.generate(prompt)
       return response.text
   ```

#### LLM Integration Pattern

```python
# Example OpenAI Integration
import openai

class GenerationService:
    def __init__(self):
        self.prompts = SectionPrompts()
        self.llm_client = openai.OpenAI(api_key="your-key")
    
    async def generate_outline_from_notes(self, notes, section_name, section_type):
        # Get section-specific prompt
        prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
        
        # Call LLM with section-aware prompt
        response = await self.llm_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        
        return response.choices[0].message.content
```

#### Configuration Points for LLM Integration

```python
# backend/config.py (create this file)
class LLMConfig:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    MODEL_NAME = "gpt-4"
    MAX_TOKENS = 1000
    TEMPERATURE = 0.7
    
    # Different models for different operations
    OUTLINE_MODEL = "gpt-4"
    DRAFT_MODEL = "gpt-4"
    REVIEW_MODEL = "gpt-3.5-turbo"
```

---

## Extension Points

### Adding New Section Types

#### 1. Backend Extension

```python
# prompts/section_prompts.py - Add new prompts
OUTLINE_PROMPTS = {
    # ... existing prompts ...
    "methodology": """
    You are creating an outline for a Methodology section...
    [Custom prompt for methodology sections]
    """,
}
```

#### 2. Frontend Extension

```typescript
// hooks/useDocumentSections.ts - Add default section
const DEFAULT_SECTIONS: DocumentSection[] = [
  // ... existing sections ...
  { id: '5', name: 'Methodology', type: 'methodology', data: { ... }, isCompleted: false }
];
```

### Custom Prompt Templates

```python
# Create specialized prompt classes
class TechnicalDocumentPrompts(SectionPrompts):
    """Prompts optimized for technical documentation"""
    
    OUTLINE_PROMPTS = {
        "api_reference": "...",
        "installation": "...",
        "troubleshooting": "..."
    }

# Use in GenerationService
class GenerationService:
    def __init__(self, prompt_class=SectionPrompts):
        self.prompts = prompt_class()
```

### Multi-Language Support

```python
# prompts/multilingual_prompts.py
class MultilingualPrompts:
    def get_outline_prompt(self, section_type, section_name, notes, language="en"):
        if language == "es":
            return self.SPANISH_OUTLINE_PROMPTS[section_type]
        elif language == "fr":  
            return self.FRENCH_OUTLINE_PROMPTS[section_type]
        else:
            return self.ENGLISH_OUTLINE_PROMPTS[section_type]
```

---

## Performance & Error Handling

### Frontend Performance Patterns

```typescript
// Loading State Management
const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

const setLoadingState = (operation: string, state: boolean) => {
  setLoading(prev => ({ ...prev, [operation]: state }));
};

// Usage:
setLoadingState('outline', true);  // Show loading for outline generation
setLoadingState('outline', false); // Hide loading
```

### Error Handling Flow

```
Error Propagation Chain:

1. Backend Error:
   GenerationService throws exception
   
2. Handler Catches:
   try/except in Handler.post()
   └── Returns: { error: "error message" }
   
3. Frontend API Service:
   fetchWithErrorHandling checks response.ok
   └── Throws error if not ok
   
4. Component Catches:
   try/catch in component methods
   └── Logs error, doesn't break UI
   
5. User Experience:
   Operation fails gracefully, user can retry
```

### Performance Considerations

- **Debouncing**: Auto-save could be added with debouncing on text input
- **Memoization**: React.memo on FormattedDocument for expensive renders
- **Code Splitting**: Dynamic imports for less-used components
- **API Optimization**: Request batching for multiple operations

---

## Deployment Architecture

### Development Setup

```
Frontend Development:
├── npm start (Port 3000)
├── React development server
└── Hot reloading enabled

Backend Development:  
├── python app.py (Port 8888)
├── Tornado development server
└── CORS enabled for localhost:3000
```

### Production Considerations

```
Frontend Production:
├── npm run build → Static files
├── Serve via Nginx/Apache
└── Environment-based API URLs

Backend Production:
├── Gunicorn + Tornado workers
├── Environment variables for config
├── Logging configuration
├── Rate limiting middleware
└── Database integration (future)
```

### Environment Variables

```bash
# Frontend (.env)
REACT_APP_API_BASE_URL=http://localhost:8888/api

# Backend
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
DATABASE_URL=postgresql://...
LOG_LEVEL=INFO
```

---

## Conclusion

This architecture provides:

1. **Modular Design**: Clear separation between frontend components, backend services, and prompt templates
2. **Type Safety**: Full TypeScript integration with proper interfaces
3. **Section Awareness**: Context-driven content generation for different document sections
4. **Extensibility**: Easy addition of new section types and prompt templates
5. **LLM Ready**: Clean integration points for AI services
6. **Error Resilience**: Graceful error handling throughout the stack
7. **Performance Optimized**: Async operations with proper loading states

The system is designed to scale from the current placeholder implementation to a full LLM-powered document generation platform while maintaining clean architecture principles and developer experience.