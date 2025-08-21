# 🚀 CRAFT Developer Guide for Python Developers

Welcome to CRAFT! If you're here, you're probably a Python developer who needs to work with this full-stack application. Don't worry - while the frontend might look intimidating at first, it's really just Python concepts with different syntax. This guide will get you productive quickly.

## 📋 Table of Contents

1. [Introduction & Mindset](#-introduction--mindset)
2. [Frontend Crash Course for Python Developers](#-frontend-crash-course-for-python-developers)
3. [Understanding the Full-Stack Architecture](#-understanding-the-full-stack-architecture)
4. [Essential Frontend Concepts (Python Analogies)](#-essential-frontend-concepts-python-analogies)
5. [Step-by-Step Practical Examples](#-step-by-step-practical-examples)
6. [Configuration System Explained](#-configuration-system-explained)
7. [Debugging Guide for Python Developers](#-debugging-guide-for-python-developers)
8. [Development Workflow](#-development-workflow)
9. [Common Pitfalls & Solutions](#-common-pitfalls--solutions)
10. [Quick Reference Tables](#-quick-reference-tables)
11. [Advanced Topics](#-advanced-topics)
12. [Resources & Next Steps](#-resources--next-steps)

## 🎯 Introduction & Mindset

As a Python developer, you already understand:
- ✅ Classes, objects, and inheritance
- ✅ Functions and parameters
- ✅ Data structures (lists, dicts)
- ✅ API design and HTTP communication
- ✅ Async/await patterns
- ✅ Error handling and debugging

**Good news**: The frontend uses all these same concepts! React components are just classes that return HTML. State management is like instance variables. API calls work exactly like `requests.post()`.

**Your advantage**: You understand the backend completely, so you only need to learn how the frontend talks to it.

## ⚛️ Frontend Crash Course for Python Developers

### JavaScript/TypeScript Basics (30 seconds)

```python
# Python
def my_function(param):
    my_var = "hello"
    my_list = [1, 2, 3]
    my_dict = {"key": "value"}
    return f"{my_var} {param}"

# JavaScript/TypeScript (same logic, different syntax)
function myFunction(param: string): string {
    const myVar = "hello";
    const myList = [1, 2, 3];
    const myDict = {"key": "value"};
    return `${myVar} ${param}`;
}
```

### React Components = Python Classes That Return HTML

```python
# Python class
class DocumentSection:
    def __init__(self, title, content):
        self.title = title
        self.content = content
        self.is_completed = False
    
    def render(self):
        status = "✅" if self.is_completed else "⏳"
        return f"<h2>{status} {self.title}</h2><p>{self.content}</p>"
```

```typescript
// React component (same concept!)
const DocumentSection: React.FC = () => {
    const [title, setTitle] = useState('Background');
    const [content, setContent] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    
    // This "returns HTML" like your Python render method
    return (
        <div>
            <h2>{isCompleted ? '✅' : '⏳'} {title}</h2>
            <p>{content}</p>
        </div>
    );
};
```

### Key Insight: State = Instance Variables + Auto-Refresh

In Python, if you change an instance variable, nothing happens visually. In React, when you change state, the UI automatically updates.

```python
# Python - changes don't update UI automatically
class MyClass:
    def __init__(self):
        self.count = 0
    
    def increment(self):
        self.count += 1  # UI doesn't know this changed
```

```typescript
// React - changes automatically update UI
const MyComponent = () => {
    const [count, setCount] = useState(0);
    
    const increment = () => {
        setCount(count + 1);  // UI automatically re-renders!
    };
};
```

## 🏗️ Understanding the Full-Stack Architecture

Think of it like this:

```python
# Your familiar backend world
@app.route('/api/generate-draft', methods=['POST'])
def generate_draft():
    data = request.get_json()
    result = ai_service.generate_content(data)
    return jsonify({"result": result})
```

```typescript
// Frontend makes the same call you would with requests.post()
const generateDraft = async (data) => {
    const response = await axios.post('/api/generate-draft', data);
    return response.data.result;
};
```

### Data Flow (Familiar Pattern)

1. **User clicks button** (like calling a Python function)
2. **Frontend makes HTTP request** (like `requests.post()`)
3. **Backend processes request** (your familiar Python code)
4. **Backend returns JSON** (like returning a dict)
5. **Frontend updates UI** (like printing the result, but prettier)

## 💡 Essential Frontend Concepts (Python Analogies)

### Components = Classes
```typescript
// This is basically a Python class that returns HTML
const SectionWorkflow: React.FC<Props> = ({ section, onUpdate }) => {
    // Class body equivalent
    const [loading, setLoading] = useState(false);
    
    // Class method equivalent
    const handleSubmit = () => {
        // Method logic here
    };
    
    // __str__ method equivalent (returns what to display)
    return <div>HTML content here</div>;
};
```

### Props = Function Parameters
```python
# Python function parameters
def process_section(section_data, callback_function):
    # Use section_data and callback_function
```

```typescript
// React props (same concept)
interface Props {
    sectionData: SectionData;
    onUpdate: (data: string) => void;
}

const MyComponent: React.FC<Props> = ({ sectionData, onUpdate }) => {
    // Use sectionData and onUpdate
};
```

### Hooks = Reusable Logic (Like Decorators)
```python
# Python decorator/context manager pattern
@with_database
@with_logging
def my_function():
    pass
```

```typescript
// React hooks (same reusability concept)
const MyComponent = () => {
    const { sections, updateSection } = useDocumentSections();  // Reusable logic
    const [data, setData] = useLocalStorage('key', defaultValue);  // Reusable logic
};
```

## 📝 Step-by-Step Practical Examples

Let's work through real tasks you'll need to do, with both backend and frontend changes.

### Example 1: Adding a New Section Type ("Executive Summary")

**What you want**: Add an "Executive Summary" section that works like Background/Product/Usage.

**Step 1: Backend Changes (Familiar Territory)**

```python
# backend/prompts/section_prompts.py - No changes needed!
# The system already handles custom section types

# backend/services/json_schema_service.py - No changes needed!
# Unless it's a table section
```

**Step 2: Frontend Changes (New Territory)**

```typescript
// frontend/src/hooks/useDocumentSections.ts
// Add to DEFAULT_SECTIONS array (like adding to a Python list)
const DEFAULT_SECTIONS: DocumentSection[] = [
  // ... existing sections
  { 
    id: '6',  // Next available ID
    name: 'Executive Summary', 
    type: 'executive_summary',  // Snake_case like Python
    templateTag: 'executive_summary',  // For Word template
    guidelines: getSectionDefaultGuidelines('executive_summary'),
    data: { notes: '', draft: '', reviewNotes: '' }, 
    isCompleted: false 
  }
];
```

**Step 3: Add AI Guidelines**

```typescript
// frontend/src/config/defaultGuidelines.ts
// Add to DEFAULT_GUIDELINES object (like a Python dict)
export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  // ... existing guidelines
  executive_summary: {
    draft: `Create a compelling executive summary that:
- Summarizes key points concisely
- Highlights main recommendations
- Provides clear value proposition`,
    
    review: `Review the executive summary for:
- Clarity and impact
- Completeness of key points
- Professional tone and structure`,
    
    revision: `Improve the summary while maintaining its core message.`
  }
};
```

**Step 4: Test Your Changes**

1. Restart frontend (`npm start`)
2. Look for new "Executive Summary" tab
3. Test the AI workflow: Notes → Draft → Review → Apply

**Why this works**: The system is designed to handle new section types automatically!

### Example 2: Adding a Table Column ("Priority" to Model Limitations)

**What you want**: Add a "Priority" dropdown (High/Medium/Low) to the Model Limitations table.

**⚠️ Critical**: Frontend and backend configurations MUST match exactly.

**Step 1: Backend Schema (Like defining a database schema)**

```python
# backend/services/json_schema_service.py
TABLE_CONFIGS = {
    'model_limitations': {
        'description': 'Model limitations table with title, description, category, and priority',
        'columns': [
            {'id': 'title', 'type': 'text', 'required': True, 'description': 'Brief, clear title of the limitation'},
            {'id': 'description', 'type': 'text', 'description': 'Detailed explanation of the limitation'},
            {'id': 'category', 'type': 'select', 'options': ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], 'description': 'Classification category'},
            # ADD THIS NEW COLUMN
            {'id': 'priority', 'type': 'select', 'options': ['High', 'Medium', 'Low'], 'description': 'Priority level for addressing this limitation'}
        ]
    }
}
```

**Step 2: Frontend Table Config (Must match backend exactly)**

```typescript
// frontend/src/config/tableConfigurations.ts
export const MODEL_LIMITATIONS_CONFIG: TableConfiguration = {
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '350px' },
    { id: 'category', label: 'Category', type: 'select', 
      options: ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], 
      width: '180px' },
    // ADD THIS NEW COLUMN (must match backend exactly!)
    { id: 'priority', label: 'Priority', type: 'select',
      options: ['High', 'Medium', 'Low'],  // Same options as backend!
      width: '120px' }
  ]
};
```

**Step 3: Update Field Order (For consistent display)**

```python
# backend/services/generation_service.py
FIELD_ORDER_MAPPING = {
    'model_limitations': ['title', 'description', 'category', 'priority'],  # Add 'priority'
    'model_risk_issues': ['title', 'description', 'category', 'importance']
}
```

**Step 4: Test Your Changes**

1. Restart backend (`python server.py`)
2. Restart frontend (`npm start`)
3. Go to Model Limitations tab
4. Add a new row - should see Priority dropdown
5. Test AI generation - should populate Priority field

**Common Mistake**: Forgetting to match frontend and backend exactly. The AI will fail if schemas don't match!

### Example 3: Customizing AI Behavior

**What you want**: Make the Background section focus more on technical details.

**Easy Method: Guidelines Only (No Code Changes)**

```typescript
// frontend/src/config/defaultGuidelines.ts
export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  background: {
    draft: `Create a technical background section that:
- Provides detailed technical context and architecture
- References specific technologies, frameworks, and methodologies
- Explains technical challenges and constraints
- Includes relevant technical specifications
- Focuses on implementation details rather than business context`,
    
    review: `Analyze the draft for:
- Technical accuracy and depth
- Appropriate level of technical detail
- Clear explanation of technical concepts
- Relevance to technical audience`,
    
    revision: `Enhance technical details while maintaining clarity.`
  }
};
```

**Advanced Method: Custom Prompts (Backend Changes)**

```python
# backend/prompts/section_prompts.py
# You can override the base prompts for specific section types

@classmethod
def get_prompt(cls, operation: str, section_type: str, section_name: str, guidelines: str = None, **kwargs) -> str:
    # Add custom logic for specific section types
    if section_type == 'background' and operation == 'draft':
        custom_prompt = f"""
Write a highly technical background section for {section_name}.

Focus on:
- Technical architecture and design patterns
- Implementation methodologies
- Technical constraints and limitations
- Technology stack details

Notes: {kwargs.get('notes', '')}

Generate technical content:
"""
        return custom_prompt + (f"\n\nGuidelines:\n{guidelines}" if guidelines else "")
    
    # Fall back to default behavior
    return cls.BASE_PROMPTS.get(operation, cls.BASE_PROMPTS["draft"]).format(section_name=section_name, **kwargs)
```

### Example 4: Adding a New API Endpoint

**What you want**: Add an endpoint to get AI suggestions for section names.

**Step 1: Backend Handler (Like adding a Flask route)**

```python
# backend/server.py
class SuggestSectionNamesHandler(ServiceHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            document_type = body.get('documentType', 'general')
            existing_sections = body.get('existingSections', [])
            
            # Use generation service
            generation_service = GenerationService()
            suggestions = generation_service.suggest_section_names(document_type, existing_sections)
            
            response = {"result": suggestions}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))

# Add to make_app() function
def make_app():
    return tornado.web.Application([
        # ... existing routes
        (r"/api/suggest-section-names", SuggestSectionNamesHandler),
    ])
```

**Step 2: Backend Service Method**

```python
# backend/services/generation_service.py
def suggest_section_names(self, document_type: str, existing_sections: list) -> list:
    """Generate AI suggestions for section names"""
    prompt = f"""
    Suggest 3-5 additional section names for a {document_type} document.
    
    Existing sections: {', '.join(existing_sections)}
    
    Provide concise, professional section names that would complement the existing sections.
    Return as a JSON array of strings.
    """
    
    try:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a document structure expert. Return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        suggestions = json.loads(response.choices[0].message.content.strip())
        return suggestions if isinstance(suggestions, list) else []
        
    except Exception as e:
        print(f"Error generating section name suggestions: {e}")
        return ["Analysis", "Methodology", "Results", "Recommendations"]  # Fallback
```

**Step 3: Frontend API Function (Like requests.post())**

```typescript
// frontend/src/services/api.service.ts
export async function suggestSectionNames(documentType: string, existingSections: string[]): Promise<string[]> {
    const response = await axiosInstance.post<ApiResponse<string[]>>('/api/suggest-section-names', {
        documentType,
        existingSections
    });
    return response.data.result;
}
```

**Step 4: Use in Component**

```typescript
// frontend/src/components/Craft.tsx (in the add section dialog)
const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);

const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
        const suggestions = await suggestSectionNames('technical', sections.map(s => s.name));
        setSuggestedNames(suggestions);
    } catch (error) {
        console.error('Failed to get suggestions:', error);
    } finally {
        setLoadingSuggestions(false);
    }
};

// In the JSX (HTML part):
<Button onClick={handleGetSuggestions} disabled={loadingSuggestions}>
    {loadingSuggestions ? 'Getting suggestions...' : 'AI Suggestions'}
</Button>

{suggestedNames.map(name => (
    <Chip
        key={name}
        label={name}
        onClick={() => setNewTabName(name)}
        style={{ margin: '4px' }}
    />
))}
```

### Example 5: Converting Text Field to Dropdown

**What you want**: Change the "Category" field in Model Risk Issues from a dropdown to a text field (to allow custom categories).

**Step 1: Backend Schema Change**

```python
# backend/services/json_schema_service.py
TABLE_CONFIGS = {
    'model_risk_issues': {
        'columns': [
            {'id': 'title', 'type': 'text', 'required': True, 'description': 'Risk title'},
            {'id': 'description', 'type': 'text', 'description': 'Risk description'},
            # CHANGE FROM 'select' TO 'text'
            {'id': 'category', 'type': 'text', 'description': 'Risk category (custom entry allowed)'},
            {'id': 'importance', 'type': 'select', 'options': ['Critical', 'High', 'Low'], 'description': 'Priority level'}
        ]
    }
}
```

**Step 2: Frontend Configuration Change**

```typescript
// frontend/src/config/tableConfigurations.ts
export const MODEL_RISK_CONFIG: TableConfiguration = {
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '400px' },
    // CHANGE FROM 'select' TO 'text' AND REMOVE 'options'
    { id: 'category', label: 'Category', type: 'text', width: '150px' },
    { id: 'importance', label: 'Importance', type: 'select', 
      options: ['Critical', 'High', 'Low'], width: '120px' }
  ]
};
```

**Step 3: Test**
- Restart both servers
- Go to Model Risk Issues tab
- Category should now be a text input instead of dropdown

**Why this works**: The TableEditor component automatically renders different input types based on the `type` field!

## ⚙️ Configuration System Explained

Understanding which files control what behavior:

### Frontend Configuration Files

| File | Controls | Example Change |
|------|----------|----------------|
| `useDocumentSections.ts` | Default sections, section IDs | Add new section types |
| `defaultGuidelines.ts` | AI behavior per section | Change how AI writes Background sections |
| `tableConfigurations.ts` | Table columns, field types | Add dropdown options, change field types |
| `modelConfigurations.ts` | Available AI models | Add new model options |

### Backend Configuration Files

| File | Controls | Example Change |
|------|----------|----------------|
| `section_prompts.py` | Base AI prompts | Change fundamental AI behavior |
| `json_schema_service.py` | Table schemas for AI | Must match frontend table configs |
| `generation_service.py` | AI model settings, field order | Change temperature, model selection |

### Critical Synchronization Points

These **MUST** match between frontend and backend:

```python
# backend/services/json_schema_service.py
'model_limitations': {
    'columns': [
        {'id': 'title', 'type': 'text'},
        {'id': 'category', 'type': 'select', 'options': ['Data', 'Technical']}
    ]
}
```

```typescript
// frontend/src/config/tableConfigurations.ts  
export const MODEL_LIMITATIONS_CONFIG: TableConfiguration = {
  columns: [
    { id: 'title', type: 'text' },              // Same ID, same type
    { id: 'category', type: 'select',           // Same ID, same type
      options: ['Data', 'Technical'] }          // Exact same options!
  ]
};
```

**If they don't match**: AI generation will fail with validation errors.

## 🐛 Debugging Guide for Python Developers

### Browser DevTools = Python Debugger

**Opening DevTools**: F12 key (like opening Python REPL)

**Console Tab**: Your new `print()` statement
```typescript
console.log("Debug info:", variable);  // Same as print(f"Debug info: {variable}")
console.error("Something went wrong:", error);  // Same as print("ERROR:", error)
```

**Network Tab**: See all HTTP requests (like watching your API calls)
- Look for failed requests (red status codes)
- Check request/response data
- Verify correct endpoints are being called

### Common Error Patterns

**1. "Cannot read property 'name' of undefined"**
```python
# Python equivalent
user = None
print(user.name)  # AttributeError: 'NoneType' object has no attribute 'name'
```

```typescript
// TypeScript - same error, different message
const user = undefined;
console.log(user.name);  // Cannot read property 'name' of undefined

// Solution: Optional chaining (like Python's getattr with default)
console.log(user?.name);  // Returns undefined instead of crashing
console.log(user?.name || 'Default Name');  // With default value
```

**2. "State not updating" (Common React gotcha)**
```typescript
// ❌ Wrong (mutating state directly)
sections[0].data.draft = newContent;  // UI won't update!

// ✅ Right (creating new objects)
setSections(sections.map(s => 
  s.id === targetId 
    ? { ...s, data: { ...s.data, draft: newContent } }
    : s
));
```

Think of it like: "In Python, if you modify a variable, nothing automatically happens. In React, you need to 'announce' the change using the setter function."

**3. "API call failing"**
```typescript
// Check the browser Network tab for:
// - Correct URL being called
// - Request data being sent
// - Response status and error message

// Add debugging:
console.log('Making API call with:', requestData);
try {
  const response = await api.generateDraft(requestData);
  console.log('API response:', response);
} catch (error) {
  console.error('API error:', error.response?.data || error.message);
}
```

**4. "Configuration not working"**
- Check that you restarted both frontend and backend
- Verify frontend and backend table configs match exactly
- Check for typos in section types and field names
- Look for JSON syntax errors in configuration files

### Debugging Workflow

1. **Check Browser Console** (F12 → Console) for error messages
2. **Add console.log()** statements (like Python print())
3. **Check Network tab** for API call failures
4. **Verify configuration files** for typos and mismatches
5. **Restart both servers** after configuration changes

## 🔧 Development Workflow

### Setting Up for Development

1. **Backend Setup** (Familiar)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Frontend Setup** (New)
```bash
cd frontend
npm install  # Like pip install -r requirements.txt
```

### Making Changes Efficiently

1. **Backend Changes**: Edit Python files, restart `python server.py`
2. **Frontend Changes**: Edit TypeScript files, save (auto-reloads!)
3. **Configuration Changes**: Edit config files, restart both servers

### Hot Reload Explained

**Backend**: Like Python - you need to restart the server to see changes
**Frontend**: Magic! Save a file, browser automatically updates

### Testing Your Changes

1. **Manual Testing**: Use the application in your browser
2. **Check Console**: Look for JavaScript errors
3. **Test AI Operations**: Notes → Draft → Review → Apply
4. **Test Table Operations**: Add/edit/delete rows
5. **Test Document Generation**: Create a Word document

### Useful Commands

```bash
# Backend
python server.py                    # Start server
python -c "import json; print(json.loads('...'))"  # Validate JSON

# Frontend  
npm start                          # Start development server
npm run build                      # Build for production
npm run test                       # Run tests (if any)

# Both
git status                         # Check what files changed
git diff                          # See actual changes
```

## ❗ Common Pitfalls & Solutions

### 1. Configuration Mismatch (Most Common!)

**Problem**: AI generation fails with validation errors
**Cause**: Frontend and backend table configurations don't match

```typescript
// Frontend says column is 'select' with options A, B, C
{ id: 'category', type: 'select', options: ['A', 'B', 'C'] }
```

```python
# Backend says column is 'text' 
{'id': 'category', 'type': 'text'}  # MISMATCH!
```

**Solution**: Always update both files together. Check spelling and options exactly.

### 2. Forgetting to Restart Servers

**Problem**: Changes don't appear
**Cause**: Backend changes require restart, configuration changes require both restarts

**Solution**: When in doubt, restart both servers.

### 3. Case Sensitivity Issues

**Problem**: API calls fail or sections don't work
**Cause**: JavaScript is case-sensitive

```typescript
// These are different!
sectionType: 'background'      // ✅ Correct
sectionType: 'Background'      // ❌ Won't work
```

**Solution**: Use snake_case for section types, just like Python.

### 4. Async/Await Confusion

```typescript
// ❌ Wrong - not waiting for API call
const handleSubmit = () => {
    const result = generateDraft(data);  // This returns a Promise, not the result!
    console.log(result);  // Will print Promise object
};

// ✅ Right - using async/await (same as Python!)
const handleSubmit = async () => {
    const result = await generateDraft(data);  // Wait for result
    console.log(result);  // Will print actual result
};
```

### 5. State Mutation (React-Specific)

**Problem**: UI doesn't update when data changes
**Cause**: Modifying state objects directly

```typescript
// ❌ Wrong - mutating state directly
section.data.draft = newContent;

// ✅ Right - creating new objects
setSectionData({...section.data, draft: newContent});
```

**Think of it**: React needs to detect changes. If you modify an object in-place, React doesn't know it changed.

## 📋 Quick Reference Tables

### Python → JavaScript/React Equivalents

| Python Concept | JavaScript/React | Example |
|----------------|------------------|---------|
| `print(value)` | `console.log(value)` | Debug output |
| `def function(param):` | `const function = (param) => {` | Function definition |
| `self.variable = value` | `const [variable, setVariable] = useState(value)` | Instance variable |
| `try/except` | `try/catch` | Error handling |
| `f"{variable}"` | `` `${variable}` `` | String interpolation |
| `for item in items:` | `{items.map(item => <Component />)}` | Iteration |
| `if condition:` | `{condition && <Component />}` | Conditional rendering |
| `import module` | `import { Component } from 'module'` | Imports |
| `dict.get('key', default)` | `dict?.key ?? default` | Safe property access |

### File Responsibility Mapping

| Task | Backend File | Frontend File |
|------|--------------|---------------|
| Add section type | `useDocumentSections.ts` | `useDocumentSections.ts` |
| Change AI behavior | `section_prompts.py` OR `defaultGuidelines.ts` | `defaultGuidelines.ts` |
| Add table column | `json_schema_service.py` | `tableConfigurations.ts` |
| Add API endpoint | `server.py` | `api.service.ts` |
| Change AI model | `generation_service.py` | `modelConfigurations.ts` |
| Add table section | `json_schema_service.py` + `section_prompts.py` | `tableConfigurations.ts` + `useDocumentSections.ts` |

### Common Patterns

| Pattern | Python | TypeScript |
|---------|--------|------------|
| Check if exists | `if item:` | `if (item) {` |
| Default value | `value or 'default'` | `value || 'default'` |
| Safe access | `getattr(obj, 'prop', default)` | `obj?.prop ?? default` |
| List comprehension | `[x.name for x in items]` | `items.map(x => x.name)` |
| Dictionary merge | `{**dict1, **dict2}` | `{...dict1, ...dict2}` |

## 🎓 Advanced Topics

### Adding New Table Section Types

Want to add a "Project Tasks" table? Here's the full process:

**1. Backend Schema**
```python
# backend/services/json_schema_service.py
TABLE_CONFIGS = {
    # ... existing configs
    'project_tasks': {
        'description': 'Project tasks with status and deadlines',
        'columns': [
            {'id': 'task', 'type': 'text', 'required': True, 'description': 'Task name'},
            {'id': 'status', 'type': 'select', 'options': ['Not Started', 'In Progress', 'Complete'], 'description': 'Current status'},
            {'id': 'deadline', 'type': 'date', 'description': 'Due date'}
        ]
    }
}
```

**2. Register as Table Section**
```python
# backend/prompts/section_prompts.py
TABLE_SECTIONS = {'model_limitations', 'model_risk_issues', 'project_tasks'}
```

**3. Frontend Table Config**
```typescript
// frontend/src/config/tableConfigurations.ts
export const PROJECT_TASKS_CONFIG: TableConfiguration = {
  columns: [
    { id: 'task', label: 'Task', type: 'text', required: true, width: '300px' },
    { id: 'status', label: 'Status', type: 'select', 
      options: ['Not Started', 'In Progress', 'Complete'], width: '150px' },
    { id: 'deadline', label: 'Deadline', type: 'date', width: '120px' }
  ]
};

// Add to getTableConfiguration function
export function getTableConfiguration(sectionType: string): TableConfiguration {
  switch (sectionType) {
    case 'model_limitations':
      return MODEL_LIMITATIONS_CONFIG;
    case 'model_risk_issues':
      return MODEL_RISK_CONFIG;
    case 'project_tasks':
      return PROJECT_TASKS_CONFIG;  // Add this line
    default:
      throw new Error(`Unknown table section type: ${sectionType}`);
  }
}
```

**4. Add to Default Sections**
```typescript
// frontend/src/hooks/useDocumentSections.ts
const DEFAULT_SECTIONS: DocumentSection[] = [
  // ... existing sections
  { 
    id: '7', 
    name: 'Project Tasks', 
    type: 'project_tasks',
    templateTag: 'project_tasks',
    guidelines: getSectionDefaultGuidelines('project_tasks'),
    data: { notes: '', draft: '{"rows":[]}', reviewNotes: '' },  // Note the JSON format
    isCompleted: false 
  }
];
```

**5. Add Guidelines**
```typescript
// frontend/src/config/defaultGuidelines.ts
export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  // ... existing guidelines
  project_tasks: {
    draft: `Generate a comprehensive project tasks table with:
- Clear, actionable task descriptions
- Appropriate status assignments
- Realistic deadline estimates
- IMPORTANT: Return data in JSON format: {"rows": [{"task": "Task name", "status": "Not Started", "deadline": "2025-01-01"}]}`,
    
    review: `Review the project tasks for:
- Task completeness and clarity
- Realistic status and deadlines
- Proper prioritization`,
    
    revision: `Improve the tasks based on feedback while maintaining JSON structure.`
  }
};
```

### Custom Validation Rules

Want to add custom validation for table data?

```typescript
// frontend/src/config/tableConfigurations.ts
export const PROJECT_TASKS_CONFIG: TableConfiguration = {
  columns: [
    { 
      id: 'deadline', 
      label: 'Deadline', 
      type: 'date', 
      width: '120px',
      validate: (value: string) => {
        const date = new Date(value);
        const today = new Date();
        if (date < today) {
          return 'Deadline cannot be in the past';
        }
        return null;  // No error
      }
    }
  ]
};
```

### Performance Considerations

**Large Documents**: 
- The system stores everything in browser localStorage
- Very large documents (>50 sections) may be slow
- Consider pagination for tables with many rows

**AI Response Time**:
- GPT-4 calls take 3-10 seconds
- Show loading indicators for better UX
- Consider implementing request timeouts

## 📚 Resources & Next Steps

### Essential Learning (If You Want to Go Deeper)

**Minimal JavaScript/TypeScript** (1-2 hours):
- Variables: `const`, `let`
- Functions: Arrow functions `() => {}`
- Objects and arrays: `{key: value}` and `[1, 2, 3]`
- Async/await: Same as Python!

**React Basics** (2-3 hours):
- Components as functions that return HTML
- State with `useState`
- Event handlers: `onClick`, `onChange`
- Conditional rendering: `{condition && <div>}</div>}`

**Material-UI** (30 minutes):
- Pre-built components: `<Button>`, `<TextField>`, `<Table>`
- Just look at existing code for examples

### Recommended Learning Path

1. **Start with Configuration Changes** (0 code, just editing config files)
2. **Try Adding New Sections** (mostly configuration)
3. **Modify Table Columns** (configuration + understanding schema sync)
4. **Add Simple API Endpoints** (mostly backend work you already know)
5. **Customize AI Behavior** (prompts and guidelines)

### Useful Tools

**VS Code Extensions**:
- **TypeScript Hero**: Auto-imports
- **Bracket Pair Colorizer**: Match brackets like Python indentation
- **ES7+ React/Redux/React-Native snippets**: Code shortcuts

**Browser Extensions**:
- **React Developer Tools**: Inspect React components (like Python debugger)

### Learning Resources

**Don't Over-Learn**: You don't need to become a React expert. Focus on:
- Understanding component structure
- Reading existing code patterns
- Following configuration examples

**When Stuck**: 
- Look at existing similar code in the project
- Copy and modify existing patterns
- Focus on configuration over custom code

## 🎯 Final Tips for Python Developers

1. **Leverage Your Strengths**: You understand the backend completely. Use that knowledge.

2. **Configuration Over Code**: Most changes are in config files, not complex React code.

3. **Pattern Recognition**: Once you see the patterns (components, props, state), it's just Python with different syntax.

4. **Start Small**: Begin with configuration changes, work up to more complex modifications.

5. **Use the Browser**: DevTools console is your friend, just like Python REPL.

6. **Don't Fear the Frontend**: It's not magic - it's just Python concepts with curly braces instead of colons.

Remember: You're not learning to be a frontend developer. You're learning just enough to be productive with this specific codebase. Focus on understanding the patterns and configurations that matter for CRAFT.

Happy coding! 🚀