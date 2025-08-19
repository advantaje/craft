# 🚀 CRAFT Developer Guide

Welcome to CRAFT! This guide is designed for developers with strong Python backgrounds who are new to frontend development or this codebase. We'll walk through the entire stack architecture, how components work together, and provide practical guidance for working with this TypeScript React + Python system.

## 📋 Table of Contents

1. [System Overview](#-system-overview)
2. [Backend Architecture (Python)](#-backend-architecture-python)
3. [Frontend Architecture (TypeScript React)](#-frontend-architecture-typescript-react)
4. [Communication Layer](#-communication-layer)
5. [Data Flow Walkthrough](#-data-flow-walkthrough)
6. [Key Concepts for Python Developers](#-key-concepts-for-python-developers)
7. [Development Workflow](#-development-workflow)
8. [Debugging & Troubleshooting](#-debugging--troubleshooting)
9. [Common Tasks](#-common-tasks)

## 🎯 System Overview

CRAFT is a full-stack AI-powered document generation system with a clean separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  React Components (TypeScript) - Material-UI               │
├─────────────────────────────────────────────────────────────┤
│                    API LAYER                                │
│  HTTP Requests (Axios) ↔ Tornado REST API                  │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LOGIC                           │
│  Python Services - OpenAI Integration - Document Gen       │
└─────────────────────────────────────────────────────────────┘
```

**Think of it like this (Python analogy):**
- **Frontend** = A rich GUI client (like a desktop app with forms, buttons, tables)
- **Backend** = Your familiar Python web service with API endpoints
- **Communication** = JSON over HTTP (just like calling `requests.post()`)

## 🐍 Backend Architecture (Python)

The backend will feel familiar - it's organized like a typical Python web service:

### Directory Structure
```
backend/
├── app.py                          # Main Tornado application (like Flask app.py)
├── prompts/
│   └── section_prompts.py         # Prompt templates (like Jinja2 templates)
└── services/                      # Business logic modules
    ├── generation_service.py      # Core AI generation logic
    ├── document_generation_service.py  # Word document creation
    ├── diff_service.py           # Text comparison utilities
    ├── json_schema_service.py    # Table structure definitions
    ├── openai_tools.py           # OpenAI API wrapper
    ├── review_data_service.py    # Database-like data retrieval
    └── template_service.py       # Word template processing
```

### Core Components

#### 1. Main Application (`app.py`)
```python
# Similar to Flask setup
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/api/generate-draft-from-notes", GenerateDraftFromNotesHandler),
            (r"/api/generate-review", GenerateReviewHandler),
            # ... more endpoints
        ]
        super().__init__(handlers, **settings)

# Request handlers - like Flask routes
class GenerateDraftFromNotesHandler(tornado.web.RequestHandler):
    async def post(self):
        data = json.loads(self.request.body)
        result = await generation_service.generate_draft_from_notes(data)
        self.write({"content": result})
```

#### 2. Service Layer (`services/`)
**This is where your Python skills shine!** Services are organized like typical Python modules:

```python
# generation_service.py - Main AI logic
async def generate_draft_from_notes(request_data):
    """Like a typical Python function that processes data"""
    notes = request_data.get('notes')
    section_type = request_data.get('sectionType')
    
    # Build prompt using template
    prompt = SectionPrompts.get_draft_prompt(section_type, notes)
    
    # Call AI service
    result = await openai_tools.generate_content(prompt)
    return result

# openai_tools.py - External API wrapper
async def generate_content(prompt, schema=None):
    """Wrapper around OpenAI API - like requests.post() but async"""
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format=schema if schema else None
    )
    
    return response.choices[0].message.content
```

#### 3. Key Patterns You'll Recognize

**Configuration Objects** (like Python dataclasses):
```python
# json_schema_service.py
TABLE_CONFIGS = {
    'model_limitations': {
        'description': 'Model limitations table...',
        'columns': [
            {'id': 'title', 'type': 'text', 'required': True},
            {'id': 'category', 'type': 'select', 'options': ['Data', 'Technical']}
        ]
    }
}
```

**Service Methods** (like typical Python class methods):
```python
class JsonSchemaService:
    @classmethod
    def get_table_schema(cls, section_type: str) -> dict:
        """Returns JSON schema for OpenAI structured output"""
        config = cls.TABLE_CONFIGS[section_type]
        # Build schema dict...
        return schema
```

## ⚛️ Frontend Architecture (TypeScript React)

Here's where it gets different from Python, but we'll explain it in familiar terms:

### Directory Structure
```
frontend/src/
├── components/          # UI components (like Python classes, but for display)
│   ├── About.tsx       # About page component
│   ├── Craft.tsx       # Main application shell
│   ├── SectionWorkflow.tsx    # Text section handler
│   ├── TableWorkflow.tsx      # Table section handler
│   └── [other components]
├── hooks/              # Reusable state logic (like Python utility functions)
│   └── useDocumentSections.ts
├── services/           # API communication (like requests.py)
│   └── api.service.ts
├── types/              # Type definitions (like Python dataclasses/TypedDict)
│   └── document.types.ts
├── config/             # Configuration files (like Python config.py)
│   ├── defaultGuidelines.ts
│   └── tableConfigurations.ts
└── utils/              # Utility functions (like Python utils.py)
```

### Key Concepts for Python Developers

#### 1. **Components = Python Classes with UI**
Think of React components like Python classes that render HTML:

```typescript
// Like a Python class, but it returns HTML
const DocumentSetup: React.FC = () => {
  // State variables (like instance variables)
  const [reviewId, setReviewId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Methods (like class methods)
  const handleLookupReview = async () => {
    setLoading(true);
    try {
      const result = await lookupReview(reviewId);  // API call
      setDocumentData(result);
    } catch (error) {
      console.error('Lookup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Return HTML (like __str__ but returns UI)
  return (
    <div>
      <TextField 
        value={reviewId} 
        onChange={(e) => setReviewId(e.target.value)} 
      />
      <Button onClick={handleLookupReview} disabled={loading}>
        {loading ? 'Loading...' : 'Lookup Review'}
      </Button>
    </div>
  );
};
```

#### 2. **State = Instance Variables That Trigger Re-rendering**
```typescript
// Like Python instance variables, but when they change, UI updates
const [sections, setSections] = useState<DocumentSection[]>(DEFAULT_SECTIONS);

// Similar to: self.sections = new_sections, but triggers UI refresh
setSections(newSections);
```

#### 3. **Props = Function Parameters**
```typescript
interface SectionWorkflowProps {
  section: DocumentSection;           // Like function parameter
  onSectionUpdate: (id: string, field: string, value: string) => void;  // Callback function
}

// Usage: <SectionWorkflow section={mySection} onSectionUpdate={myHandler} />
```

#### 4. **Hooks = Reusable Logic (Like Python Decorators/Context Managers)**
```typescript
// Custom hook - like a Python utility function that manages state
export function useDocumentSections() {
  const [sections, setSections] = useState<DocumentSection[]>(DEFAULT_SECTIONS);
  
  const updateSectionData = useCallback((sectionId: string, field: string, value: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, data: { ...section.data, [field]: value } }
          : section
      )
    );
  }, []);

  return { sections, updateSectionData };  // Return object with data & methods
}

// Usage in component:
const { sections, updateSectionData } = useDocumentSections();
```

### Key Frontend Files Explained

#### 1. **Main App Structure** (`Craft.tsx`)
```typescript
// Main application - like your Python main() function
const Craft: React.FC = () => {
  // Global state management
  const { sections, updateSectionData, /* ... */ } = useDocumentSections();
  const [documentData, setDocumentData] = useState<DocumentInfo | null>(null);

  // Render tabbed interface
  return (
    <Container>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Home" />
        {sections.map(section => (
          <Tab key={section.id} label={section.name} />
        ))}
      </Tabs>
      
      {/* Conditional rendering based on active tab */}
      {activeTab === 0 && <DocumentSetup />}
      {sections.map((section, index) => (
        activeTab === index + 1 && (
          section.type === 'model_limitations' || section.type === 'model_risk_issues' ? (
            <TableWorkflow section={section} onSectionUpdate={updateSectionData} />
          ) : (
            <SectionWorkflow section={section} onSectionUpdate={updateSectionData} />
          )
        )
      ))}
    </Container>
  );
};
```

#### 2. **API Service** (`api.service.ts`)
```typescript
// Like your requests.py - handles HTTP communication
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';

export const generateDraftFromNotes = async (data: {
  notes: string;
  sectionName: string;
  sectionType: string;
  guidelines?: string;
}) => {
  // Like requests.post() in Python
  const response = await axios.post(`${API_BASE_URL}/api/generate-draft-from-notes`, data);
  return response.data;
};
```

#### 3. **Type Definitions** (`document.types.ts`)
```typescript
// Like Python dataclasses or TypedDict
export interface DocumentSection {
  id: string;
  name: string;
  type: string;
  templateTag?: string;
  guidelines?: SectionGuidelines;
  data: SectionData;
  isCompleted: boolean;
  completionType?: 'normal' | 'empty';
}

export interface SectionData {
  notes: string;
  draft: string;
  reviewNotes: string;
}
```

## 🔌 Communication Layer

The frontend and backend communicate via HTTP JSON APIs, just like any Python web service:

### Request/Response Flow
```typescript
// Frontend makes request (like requests.post in Python)
const generateDraft = async () => {
  const requestData = {
    notes: "User's input notes...",
    sectionName: "Background",
    sectionType: "background",
    guidelines: "Custom AI instructions..."
  };
  
  try {
    const response = await axios.post('/api/generate-draft-from-notes', requestData);
    const generatedContent = response.data;
    // Update UI with response
  } catch (error) {
    // Handle error
  }
};
```

```python
# Backend handles request (familiar Tornado/Flask pattern)
class GenerateDraftFromNotesHandler(tornado.web.RequestHandler):
    async def post(self):
        try:
            # Parse request (like request.json in Flask)
            data = json.loads(self.request.body)
            
            # Process with service layer
            result = await generation_service.generate_draft_from_notes(data)
            
            # Return JSON response
            self.write({"content": result})
            
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})
```

### Key API Endpoints
| Endpoint | Purpose | Frontend Trigger | Backend Service |
|----------|---------|------------------|-----------------|
| `/api/generate-draft-from-notes` | Create initial content | User clicks "Generate Draft" | `generation_service.py` |
| `/api/generate-review` | Get AI feedback | User clicks "Generate Review" | `generation_service.py` |
| `/api/generate-draft-from-review-with-diff` | Apply feedback | User clicks "Apply Review" | `generation_service.py` |
| `/api/generate-document` | Create Word file | User clicks "Generate Document" | `document_generation_service.py` |
| `/api/review-lookup` | Fetch metadata | User enters Review ID | `review_data_service.py` |

## 🔄 Data Flow Walkthrough

Let's trace a complete user interaction from frontend to backend and back:

### Scenario: User Generates a Draft from Notes

#### Step 1: User Input (Frontend)
```typescript
// SectionWorkflow.tsx - User types notes and clicks button
const handleGenerateDraft = async () => {
  setLoading(true);
  try {
    const result = await generateDraftFromNotes({
      notes: section.data.notes,           // "Write about risk assessment..."
      sectionName: section.name,           // "Background" 
      sectionType: section.type,           // "background"
      guidelines: section.guidelines?.draft  // AI instructions
    });
    
    onSectionUpdate(section.id, 'draft', result);  // Update UI
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

#### Step 2: HTTP Request (API Layer)
```typescript
// api.service.ts - Makes HTTP call
export const generateDraftFromNotes = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/generate-draft-from-notes`, {
    notes: data.notes,
    sectionName: data.sectionName,
    sectionType: data.sectionType,
    guidelines: data.guidelines
  });
  return response.data;  // Returns the generated content
};
```

#### Step 3: Backend Processing (Python)
```python
# app.py - Request handler
class GenerateDraftFromNotesHandler(tornado.web.RequestHandler):
    async def post(self):
        data = json.loads(self.request.body)
        result = await generation_service.generate_draft_from_notes(data)
        self.write(result)

# generation_service.py - Business logic
async def generate_draft_from_notes(request_data):
    notes = request_data.get('notes')
    section_type = request_data.get('sectionType')
    section_name = request_data.get('sectionName')
    guidelines = request_data.get('guidelines')
    
    # Build AI prompt
    prompt = SectionPrompts.get_draft_prompt(
        section_type, section_name, notes, guidelines
    )
    
    # Call OpenAI
    content = await openai_tools.generate_content(prompt)
    
    return content
```

#### Step 4: UI Update (Frontend)
```typescript
// Back in SectionWorkflow.tsx - Update state triggers re-render
onSectionUpdate(section.id, 'draft', result);

// This calls the hook function:
const updateSectionData = (sectionId: string, field: string, value: string) => {
  setSections(prevSections =>
    prevSections.map(section =>
      section.id === sectionId
        ? { ...section, data: { ...section.data, [field]: value } }
        : section
    )
  );
};

// UI automatically re-renders with new draft content
```

## 💡 Key Concepts for Python Developers

### 1. **Async/Await (Same as Python!)**
```typescript
// TypeScript async/await works just like Python
const fetchData = async () => {
  try {
    const response = await api.getData();  // Like await requests.get()
    setData(response);
  } catch (error) {
    console.error(error);
  }
};
```

### 2. **Immutable Updates (Different from Python)**
```typescript
// In React, you don't mutate state directly (unlike Python lists/dicts)

// ❌ Don't do this (like list.append() in Python)
sections.push(newSection);

// ✅ Do this (create new array)
setSections([...sections, newSection]);

// ❌ Don't modify object directly
section.data.draft = newContent;

// ✅ Create new object
setSections(sections.map(s => 
  s.id === sectionId 
    ? { ...s, data: { ...s.data, draft: newContent } }
    : s
));
```

### 3. **Event Handling (Like Python Callbacks)**
```typescript
// Event handlers are like callback functions in Python
const handleButtonClick = (event: React.MouseEvent) => {
  // Do something when button is clicked
  console.log('Button clicked!');
};

// Attach to UI element
<Button onClick={handleButtonClick}>Click Me</Button>

// With parameters (like Python lambda)
<Button onClick={() => handleDelete(itemId)}>Delete</Button>
```

### 4. **Conditional Rendering (Like Python if/else in templates)**
```typescript
// Like Jinja2 {% if %} blocks
return (
  <div>
    {loading ? (
      <CircularProgress />  // Show spinner if loading
    ) : (
      <Button onClick={handleSubmit}>Submit</Button>  // Show button if not loading
    )}
    
    {/* Like {% for item in items %} */}
    {sections.map(section => (
      <SectionComponent key={section.id} section={section} />
    ))}
  </div>
);
```

## 🛠️ Development Workflow

### Setting Up Development Environment

1. **Backend Setup** (Familiar Python workflow):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

2. **Frontend Setup** (Node.js/npm - like pip but for JavaScript):
```bash
cd frontend
npm install          # Like pip install -r requirements.txt
npm start           # Like python app.py
```

### Making Changes

#### Backend Changes (Python - You Know This!)
1. Edit Python files in `backend/services/`
2. Test with Python directly or via API calls
3. Restart `python app.py` to reload changes

#### Frontend Changes (New Territory)
1. Edit TypeScript files in `frontend/src/`
2. Save file - changes appear automatically (hot reload)
3. Check browser console for errors (like Python traceback)

### Development Tools

#### Backend (Familiar Tools)
- **Python debugger**: `import pdb; pdb.set_trace()`
- **Logging**: `print()` or proper `logging` module
- **API testing**: Postman, curl, or Python `requests`

#### Frontend (New Tools)
- **Browser DevTools**: F12 → Console tab (like Python REPL)
- **React DevTools**: Browser extension for inspecting components
- **TypeScript errors**: Show up in VS Code and browser console

## 🐛 Debugging & Troubleshooting

### Common Issues for Python Developers

#### 1. **"Cannot read property of undefined"**
```typescript
// Python equivalent: AttributeError: 'NoneType' object has no attribute 'name'
// TypeScript: Cannot read property 'name' of undefined

// Problem:
const name = user.name;  // user might be undefined

// Solution: Optional chaining (like Python's getattr with default)
const name = user?.name;  // Returns undefined if user is undefined
const name = user?.name || 'Default Name';  // With default value
```

#### 2. **State Not Updating**
```typescript
// Problem: Mutating state directly (like modifying Python list in-place)
sections[0].data.draft = newContent;  // UI won't update

// Solution: Immutable update
setSections(sections.map(s => 
  s.id === targetId 
    ? { ...s, data: { ...s.data, draft: newContent } }
    : s
));
```

#### 3. **Infinite Re-renders**
```typescript
// Problem: Function recreated on every render
const MyComponent = () => {
  const handleClick = () => {  // New function every render
    console.log('clicked');
  };
  
  return <Button onClick={handleClick}>Click</Button>;
};

// Solution: useCallback (like memoization)
const MyComponent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // Dependencies array - like functools.lru_cache
  
  return <Button onClick={handleClick}>Click</Button>;
};
```

### Debugging Steps

#### Backend Issues (Standard Python Debugging)
1. Check Python console for errors
2. Add `print()` statements or use debugger
3. Test endpoints with curl/Postman
4. Check environment variables and API keys

#### Frontend Issues
1. **Open Browser DevTools** (F12 → Console)
2. **Check for TypeScript errors** (red squiggly lines in VS Code)
3. **Add console.log()** (like Python `print()`)
4. **Use React DevTools** to inspect component state
5. **Check Network tab** for failed API calls

## 📝 Common Tasks

### Adding a New API Endpoint

#### 1. Backend (Python - Familiar)
```python
# app.py - Add route
(r"/api/my-new-endpoint", MyNewHandler),

# Add handler class
class MyNewHandler(tornado.web.RequestHandler):
    async def post(self):
        data = json.loads(self.request.body)
        result = await my_service.process_data(data)
        self.write({"result": result})

# services/my_service.py - Business logic
async def process_data(data):
    # Your Python logic here
    return processed_result
```

#### 2. Frontend (TypeScript)
```typescript
// api.service.ts - Add API function
export const callMyNewEndpoint = async (data: MyDataType) => {
  const response = await axios.post(`${API_BASE_URL}/api/my-new-endpoint`, data);
  return response.data;
};

// Use in component
const handleAction = async () => {
  try {
    const result = await callMyNewEndpoint({ /* data */ });
    // Handle result
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

### Adding a New UI Component

```typescript
// components/MyNewComponent.tsx
interface MyNewComponentProps {
  title: string;
  onSave: (data: string) => void;
}

const MyNewComponent: React.FC<MyNewComponentProps> = ({ title, onSave }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSave(inputValue);
  };

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <TextField 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Save</Button>
    </Box>
  );
};

export default MyNewComponent;

// Usage in parent component:
<MyNewComponent 
  title="My Form" 
  onSave={(data) => console.log('Saved:', data)} 
/>
```

### Modifying Existing Functionality

#### 1. **Find the Component**: Look in `frontend/src/components/`
#### 2. **Find the Backend Logic**: Look in `backend/services/`
#### 3. **Trace the Data Flow**:
   - User interaction (component)
   - API call (api.service.ts)
   - Backend handler (app.py)
   - Business logic (services/)
   - Response back to frontend

## 🎓 Learning Resources for Python Developers

### Essential Concepts to Learn
1. **JavaScript/TypeScript Basics**:
   - Variables: `let`, `const` (like Python variables)
   - Functions: `function` and arrow functions `() => {}`
   - Objects: `{key: value}` (like Python dicts)
   - Arrays: `[1, 2, 3]` (like Python lists)

2. **React Fundamentals**:
   - Components (like Python classes that return HTML)
   - State (like instance variables that trigger UI updates)
   - Props (like function parameters)
   - Hooks (like decorators/context managers for state)

3. **TypeScript Benefits**:
   - Static typing (like Python type hints but enforced)
   - Better IDE support and error catching
   - Interfaces (like Python dataclasses)

### Recommended Learning Path
1. **JavaScript ES6+ Basics** (1-2 days)
2. **TypeScript Fundamentals** (1 day)
3. **React Basics** (2-3 days)
4. **Material-UI Components** (1 day)
5. **Practice with CRAFT codebase** (ongoing)

### Quick Reference

#### Python → TypeScript/React Equivalents
| Python | TypeScript/React |
|--------|------------------|
| `class MyClass:` | `const MyComponent: React.FC = () => {` |
| `self.variable = value` | `const [variable, setVariable] = useState(value)` |
| `def method(self, param):` | `const method = (param) => {` |
| `if condition:` | `{condition && <Component />}` |
| `for item in items:` | `{items.map(item => <Component key={item.id} />)}` |
| `try/except` | `try/catch` |
| `import module` | `import { Component } from 'module'` |
| `print(value)` | `console.log(value)` |

## 🔍 Understanding the CRAFT Workflow

Now that you understand the technical pieces, here's how they come together in CRAFT's document generation workflow:

1. **Document Setup** (DocumentSetup.tsx ↔ review_data_service.py)
2. **Section Creation** (useDocumentSections.ts hook manages state)
3. **Content Generation** (SectionWorkflow.tsx ↔ generation_service.py ↔ OpenAI)
4. **Review Cycle** (AI feedback ↔ diff visualization ↔ user approval)
5. **Table Management** (TableWorkflow.tsx ↔ json_schema_service.py)
6. **Document Export** (FileGenerationModal.tsx ↔ document_generation_service.py)

Each step involves the frontend managing UI state and the backend processing business logic, with clean API boundaries between them.

---

## 🚀 You're Ready to Contribute!

As a Python developer, you already understand:
- ✅ The backend architecture (it's just Python!)
- ✅ API design and HTTP communication
- ✅ Service-oriented architecture
- ✅ Error handling and debugging

You just need to learn:
- 🎯 React component patterns (think: Python classes that return HTML)
- 🎯 TypeScript syntax (Python with static typing for the web)
- 🎯 State management (like instance variables that trigger UI updates)

Start by making small changes to existing components, and gradually work up to creating new features. The Python backend will feel like home, and the frontend will become familiar with practice!

Happy coding! 🎉