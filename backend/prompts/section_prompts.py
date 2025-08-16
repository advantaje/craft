"""
Simplified prompt templates using guidelines for customization
"""

class SectionPrompts:
    """Unified prompt templates that rely on guidelines for section-specific behavior"""
    
    # Base prompt templates - guidelines provide the specific instructions
    BASE_PROMPTS = {
        "outline": """
Create a structured outline for the {section_name} section based on the following notes.

Notes: {notes}

Generate a clear, logical outline:
""",
        "draft": """
Write content for the {section_name} section based on the notes and outline provided.

Notes: {notes}
Outline: {outline}

Generate the section content:
""",
        "review": """
Review and analyze the following {section_name} section content. Provide specific, constructive feedback.

Content: {draft}

Provide detailed review feedback:
""",
        "revision": """
Revise the {section_name} section based on the review feedback provided. Maintain the core message while addressing the feedback.

Original Content: {draft}
Review Feedback: {review_notes}

Generate the revised content:
"""
    }
    
    # Table-specific JSON format instructions
    TABLE_FORMATS = {
        "model_limitations": {
            "columns": "title (text), description (text), category (select: Data Limitations/Technical Limitations/Scope Limitations)",
            "example": '{"rows": [{"title": "Limited Training Data", "description": "Description here", "category": "Data Limitations"}]}'
        },
        "model_risk_issues": {
            "columns": "title (text), description (text), category (select: Operational Risk/Market Risk/Credit Risk), importance (select: Critical/High/Low)", 
            "example": '{"rows": [{"title": "Model Drift", "description": "Description here", "category": "Operational Risk", "importance": "Critical"}]}'
        }
    }
    
    @classmethod
    def get_prompt(cls, operation: str, section_type: str, section_name: str, guidelines: str = None, **kwargs) -> str:
        """Unified method to get prompts for any operation"""
        # Get base prompt template
        template = cls.BASE_PROMPTS.get(operation, cls.BASE_PROMPTS["draft"])
        
        # Format with provided parameters
        base_prompt = template.format(section_name=section_name, **kwargs)
        
        # Add table formatting for JSON sections
        if section_type in cls.TABLE_FORMATS and operation in ['draft', 'revision']:
            table_info = cls.TABLE_FORMATS[section_type]
            base_prompt += f"\n\nTable Format:\nColumns: {table_info['columns']}\nReturn ONLY valid JSON: {table_info['example']}"
        
        # Add guidelines if provided
        if guidelines and guidelines.strip():
            action_map = {
                'outline': 'creating the outline',
                'draft': 'writing the content', 
                'review': 'providing feedback',
                'revision': 'revising the content'
            }
            action = action_map.get(operation, 'completing this task')
            base_prompt += f"\n\nGuidelines for {action}:\n{guidelines.strip()}"
        
        return base_prompt
    
    # Legacy method wrappers for compatibility
    @classmethod
    def get_outline_prompt(cls, section_type: str, section_name: str, notes: str, guidelines: str = None) -> str:
        return cls.get_prompt('outline', section_type, section_name, guidelines, notes=notes)
    
    @classmethod 
    def get_draft_prompt(cls, section_type: str, section_name: str, notes: str, outline: str, guidelines: str = None) -> str:
        return cls.get_prompt('draft', section_type, section_name, guidelines, notes=notes, outline=outline)
    
    @classmethod
    def get_review_prompt(cls, section_type: str, section_name: str, draft: str, guidelines: str = None) -> str:
        return cls.get_prompt('review', section_type, section_name, guidelines, draft=draft)
    
    @classmethod
    def get_revision_prompt(cls, section_type: str, section_name: str, draft: str, review_notes: str, guidelines: str = None) -> str:
        return cls.get_prompt('revision', section_type, section_name, guidelines, draft=draft, review_notes=review_notes)