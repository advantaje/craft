"""
Simplified prompt templates using guidelines for customization
"""

class SectionPrompts:
    """Unified prompt templates that rely on guidelines for section-specific behavior"""
    
    # Base prompt templates - guidelines provide the specific instructions
    BASE_PROMPTS = {
        "outline": """
Create a structured outline for the {section_name} section based on the following notes.
This outline will serve as the foundation for drafting the content.

The final content should meet the objectives described in the guidelines below.
Plan your outline to ensure these goals can be achieved.

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
    
    # Table section types that use structured output schemas
    TABLE_SECTIONS = {'model_limitations', 'model_risk_issues'}
    
    @classmethod
    def get_prompt(cls, operation: str, section_type: str, section_name: str, guidelines: str = None, **kwargs) -> str:
        """Unified method to get prompts for any operation"""
        # Get base prompt template
        template = cls.BASE_PROMPTS.get(operation, cls.BASE_PROMPTS["draft"])
        
        # Format with provided parameters
        base_prompt = template.format(section_name=section_name, **kwargs)
        
        # Add guidelines if provided
        if guidelines and guidelines.strip():
            # For table sections in outline mode, provide cleaner guidance
            if operation == 'outline' and section_type in cls.TABLE_SECTIONS:
                # Extract the conceptual part of guidelines before JSON formatting
                guidelines_lines = guidelines.strip().split('\n')
                conceptual_guidelines = []
                for line in guidelines_lines:
                    if 'JSON' in line or '{"rows"' in line or line.startswith('IMPORTANT:'):
                        break
                    conceptual_guidelines.append(line)
                guidelines = '\n'.join(conceptual_guidelines).strip()
                action = 'the table content (plan what data to include)'
            else:
                action_map = {
                    'outline': 'the final content (create an outline that will achieve these goals)',
                    'draft': 'writing the content', 
                    'review': 'providing feedback',
                    'revision': 'revising the content'
                }
                action = action_map.get(operation, 'completing this task')
            
            if guidelines:  # Only add if we still have guidelines after filtering
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