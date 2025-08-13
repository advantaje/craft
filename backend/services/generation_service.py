"""
Document generation service with section-aware processing
"""

from services.openai_tools import create_azure_openai_client
from prompts.section_prompts import SectionPrompts


class GenerationService:
    """Handles document generation with section-specific prompts"""
    
    def __init__(self):
        self.prompts = SectionPrompts()
        self.client = create_azure_openai_client()
        self.model = 'gpt-4.1-mini-2025-04-14'
    
    def generate_outline_from_notes(self, notes: str, section_name: str, section_type: str) -> str:
        """Generate outline using section-specific prompt"""
        if not notes.strip():
            return "Please provide notes to generate an outline."
        
        try:
            # Get section-specific prompt
            prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert document writer. Create clear, structured outlines from notes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating outline: {e}")
            return f"Error generating outline: {str(e)}. Please check your API configuration."
    
    def generate_draft_from_outline(self, notes: str, outline: str, section_name: str, section_type: str) -> str:
        """Generate draft using section-specific prompt"""
        if not outline.strip():
            return "Please provide an outline to generate a draft."
        
        try:
            # Get section-specific prompt
            prompt = self.prompts.get_draft_prompt(section_type, section_name, notes, outline)
            
            # For model_limitations and model_risk_issues sections, use JSON mode
            if section_type in ['model_limitations', 'model_risk_issues']:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at generating structured table data. Always return valid JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                    max_tokens=2000
                )
            else:
                # Regular text generation for other sections
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert document writer. Create comprehensive, well-structured content from outlines and notes."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating draft: {e}")
            return f"Error generating draft: {str(e)}. Please check your API configuration."
    
    def generate_review_suggestions(self, draft: str, section_name: str, section_type: str) -> str:
        """Generate review suggestions using section-specific prompt"""
        if not draft.strip():
            return "Please provide a draft to review."
        
        try:
            # Get section-specific prompt
            prompt = self.prompts.get_review_prompt(section_type, section_name, draft)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert editor. Provide constructive, specific feedback to improve documents."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=1500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating review: {e}")
            return f"Error generating review: {str(e)}. Please check your API configuration."
    
    def apply_review_notes(self, draft: str, review_notes: str, section_name: str, section_type: str) -> str:
        """Apply review notes to update draft"""
        if not draft.strip():
            return "Please provide a draft to revise."
        if not review_notes.strip():
            return "Please provide review notes to apply."
        
        try:
            # Get section-specific revision prompt
            prompt = self.prompts.get_revision_prompt(section_type, section_name, draft, review_notes)
            
            # For model_limitations and model_risk_issues sections, use JSON mode
            if section_type in ['model_limitations', 'model_risk_issues']:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at revising table data. Always return valid JSON matching the specified format."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                    max_tokens=2500
                )
            else:
                # Regular text generation for other sections
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert writer. Revise documents based on feedback while maintaining the original intent and structure."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2500
                )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error applying review notes: {e}")
            return f"Error applying review notes: {str(e)}. Please check your API configuration."