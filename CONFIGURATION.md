# 🎯 CRAFT Configuration & Constants Reference

This document provides a comprehensive guide to all the key constants and configuration files you need to modify to customize CRAFT's functionality, including section prompts, guidelines, schemas, table column categories, default section names, and more.

## 📂 Frontend Configuration Files

### 1. Default Section Definitions 
**File:** `frontend/src/hooks/useDocumentSections.ts` (lines 5-51)

```typescript
const DEFAULT_SECTIONS: DocumentSection[] = [
  { id: '1', name: 'Background', type: 'background', templateTag: 'background' },
  { id: '2', name: 'Product', type: 'product', templateTag: 'product' },
  { id: '3', name: 'Usage', type: 'usage', templateTag: 'usage' },
  { id: '4', name: 'Model Limitations', type: 'model_limitations', templateTag: 'model_limitations' },
  { id: '5', name: 'Model Risk Issues', type: 'model_risk_issues', templateTag: 'model_risk_issues' }
];
```

**What you can modify:**
- Add/remove/rename default sections
- Change section types
- Modify template tags for Word document placeholders
- Change the order sections appear in

### 2. AI Guidelines for Each Section
**File:** `frontend/src/config/defaultGuidelines.ts` (lines 12-140)

```typescript
export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  background: { 
    draft: "The content should: - Provide comprehensive historical context...", 
    review: "Analyze the draft and provide specific feedback on...", 
    revision: "Improve the draft while maintaining its core message..." 
  },
  product: { draft: "...", review: "...", revision: "..." },
  usage: { draft: "...", review: "...", revision: "..." },
  model_limitations: { draft: "...", review: "...", revision: "..." },
  model_risk_issues: { draft: "...", review: "...", revision: "..." },
  default: { draft: "...", review: "...", revision: "..." }
};
```

**What you can modify:**
- Change AI behavior for draft generation
- Modify review feedback style and focus areas
- Adjust revision process instructions
- Add guidelines for new section types

### 3. Table Column Configurations
**File:** `frontend/src/config/tableConfigurations.ts` (lines 9-27)

```typescript
export const MODEL_LIMITATIONS_CONFIG: TableConfiguration = {
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '450px' },
    { id: 'category', label: 'Category', type: 'select', 
      options: ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], 
      width: '180px' }
  ]
};

export const MODEL_RISK_CONFIG: TableConfiguration = {
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '400px' },
    { id: 'category', label: 'Category', type: 'select', 
      options: ['Operational Risk', 'Market Risk', 'Credit Risk'], width: '150px' },
    { id: 'importance', label: 'Importance', type: 'select', 
      options: ['Critical', 'High', 'Low'], width: '120px' }
  ]
};
```

**What you can modify:**
- Add/remove table columns
- Change dropdown options for select fields
- Modify field types (text, number, select, date)
- Adjust column widths
- Set required fields

**Available column types:**
- `text` - Single line text input
- `number` - Numeric input
- `select` - Dropdown with predefined options
- `date` - Date picker

## 🖥️ Backend Configuration Files

### 4. Section Prompts & Templates
**File:** `backend/prompts/section_prompts.py` (lines 9-47)

```python
BASE_PROMPTS = {
    "outline": """
Create a structured outline for the {section_name} section based on the following notes.
This outline will serve as the foundation for drafting the content...
""",
    "draft": """
Write content for the {section_name} section based on the notes and outline provided...
""",
    "review": """
Review and analyze the following {section_name} section content. Provide specific, constructive feedback...
""",
    "revision": """
Revise the {section_name} section based on the review feedback provided...
"""
}

TABLE_SECTIONS = {'model_limitations', 'model_risk_issues'}
```

**What you can modify:**
- Change base prompt templates that apply to all sections
- Add new table section types to `TABLE_SECTIONS`
- Modify the fundamental structure of AI interactions

### 5. JSON Schemas for Table Structure
**File:** `backend/services/json_schema_service.py` (lines 9-27)

```python
TABLE_CONFIGS = {
    'model_limitations': {
        'description': 'Model limitations table with title, description, and categorization',
        'columns': [
            {'id': 'title', 'type': 'text', 'required': True, 
             'description': 'Brief, clear title of the limitation'},
            {'id': 'description', 'type': 'text', 
             'description': 'Detailed explanation of the limitation and its implications'},
            {'id': 'category', 'type': 'select', 
             'options': ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], 
             'description': 'Classification category for the limitation type'}
        ]
    },
    'model_risk_issues': {
        'columns': [
            {'id': 'title', 'type': 'text', 'required': True, 
             'description': 'Concise title identifying the specific risk issue'},
            {'id': 'description', 'type': 'text', 
             'description': 'Comprehensive description of the risk, its potential impact...'},
            {'id': 'category', 'type': 'select', 
             'options': ['Operational Risk', 'Market Risk', 'Credit Risk'], 
             'description': 'Primary risk category classification'},
            {'id': 'importance', 'type': 'select', 
             'options': ['Critical', 'High', 'Low'], 
             'description': 'Priority level indicating the severity...'}
        ]
    }
}
```

**⚠️ Critical:** This configuration **must match** the frontend table configurations exactly. Any mismatch will cause validation errors.

**What you can modify:**
- Table structure and column definitions
- Field descriptions (used by AI for better understanding)
- Validation rules and requirements
- Add new table types

## 🔧 Key Constants & Settings

### Default Section IDs (Non-Removable Sections)
**File:** `frontend/src/hooks/useDocumentSections.ts` (line 128)
```typescript
const defaultSectionIds = ['1', '2', '3', '4', '5'];
```
**Purpose:** Controls which sections users cannot delete from the interface.

### Table Section Types
**File:** `backend/prompts/section_prompts.py` (line 47)
```python
TABLE_SECTIONS = {'model_limitations', 'model_risk_issues'}
```
**Purpose:** Determines which sections use structured JSON format vs plain text format.

### Available Table Types
**File:** `backend/services/json_schema_service.py` (method `get_available_sections`)
Must match the keys in the `TABLE_CONFIGS` dictionary.

## 📋 Common Customization Scenarios

### Adding a New Text Section

1. **Add to Default Sections** (`frontend/src/hooks/useDocumentSections.ts`):
   ```typescript
   { 
     id: '6', 
     name: 'Executive Summary', 
     type: 'executive_summary', 
     templateTag: 'executive_summary',
     guidelines: getSectionDefaultGuidelines('executive_summary'),
     data: { notes: '', draft: '', reviewNotes: '' }, 
     isCompleted: false 
   }
   ```

2. **Add Guidelines** (`frontend/src/config/defaultGuidelines.ts`):
   ```typescript
   executive_summary: {
     draft: "Create a concise executive summary that...",
     review: "Analyze the summary for clarity and impact...", 
     revision: "Refine the summary based on feedback..."
   }
   ```

3. **Update Non-Removable IDs** (if it should be permanent):
   ```typescript
   const defaultSectionIds = ['1', '2', '3', '4', '5', '6'];
   ```

### Adding a New Table Section

1. **Backend Schema** (`backend/services/json_schema_service.py`):
   ```python
   'project_tasks': {
       'description': 'Project tasks with status and deadlines',
       'columns': [
           {'id': 'task', 'type': 'text', 'required': True},
           {'id': 'status', 'type': 'select', 'options': ['Not Started', 'In Progress', 'Complete']},
           {'id': 'deadline', 'type': 'date'}
       ]
   }
   ```

2. **Frontend Configuration** (`frontend/src/config/tableConfigurations.ts`):
   ```typescript
   export const PROJECT_TASKS_CONFIG: TableConfiguration = {
     sectionType: 'project_tasks',
     columns: [
       { id: 'task', label: 'Task', type: 'text', required: true, width: '300px' },
       { id: 'status', label: 'Status', type: 'select', 
         options: ['Not Started', 'In Progress', 'Complete'], width: '150px' },
       { id: 'deadline', label: 'Deadline', type: 'date', width: '120px' }
     ]
   };
   ```

3. **Register as Table Section** (`backend/prompts/section_prompts.py`):
   ```python
   TABLE_SECTIONS = {'model_limitations', 'model_risk_issues', 'project_tasks'}
   ```

4. **Add to Default Sections** and **Add Guidelines** (same as text section steps above)

### Modifying Existing Table Categories

**⚠️ Must update both frontend and backend simultaneously:**

1. **Frontend** (`frontend/src/config/tableConfigurations.ts`):
   ```typescript
   options: ['New Category 1', 'New Category 2', 'New Category 3']
   ```

2. **Backend** (`backend/services/json_schema_service.py`):
   ```python
   'options': ['New Category 1', 'New Category 2', 'New Category 3']
   ```

### Changing AI Behavior

**For section-specific changes:**
- Modify guidelines in `frontend/src/config/defaultGuidelines.ts`

**For fundamental prompt changes:**
- Modify base prompts in `backend/prompts/section_prompts.py`

### Adding Custom Column Types

1. **Frontend Table Editor** (`frontend/src/components/TableEditor.tsx`):
   - Add rendering logic for new column type
   - Add validation if needed

2. **Backend Schema Generation** (`backend/services/json_schema_service.py`):
   - Add case for new type in `get_table_schema` method
   - Define appropriate JSON schema properties

3. **Update Configurations**:
   - Add new type option to both frontend and backend table configs

## 🚨 Important Notes

### Synchronization Requirements
- **Table configurations must be identical** between frontend and backend
- Column IDs, types, and options must match exactly
- Any mismatch will cause AI generation or validation errors

### Testing Changes
- Always test both AI generation and manual editing after configuration changes
- Verify that existing documents still load correctly
- Test document generation with new configurations

### Backup Considerations  
- Configuration changes affect the core behavior of CRAFT
- Consider backing up working configurations before making major changes
- Document your custom configurations for team members

## 🔄 Configuration Change Workflow

1. **Plan Changes**: Document what you want to modify and why
2. **Update Backend**: Make schema and prompt changes first
3. **Update Frontend**: Mirror backend changes in frontend configurations
4. **Test Thoroughly**: Verify AI generation, manual editing, and document export
5. **Deploy Together**: Always deploy frontend and backend changes together

This configuration system gives you complete control over CRAFT's behavior while maintaining the sophisticated AI-assisted document creation workflow.