"""
Document generation service with section-aware processing
"""

from prompts.section_prompts import SectionPrompts


class GenerationService:
    """Handles document generation with section-specific prompts"""
    
    def __init__(self):
        self.prompts = SectionPrompts()
    
    def generate_outline_from_notes(self, notes: str, section_name: str, section_type: str) -> str:
        """Generate outline using section-specific prompt"""
        if not notes.strip():
            return "Please provide notes to generate an outline."
        
        # Get section-specific prompt
        prompt = self.prompts.get_outline_prompt(section_type, section_name, notes)
        
        # For now, return a simple transformation
        # In production, this would call an LLM with the section-specific prompt
        lines = [line.strip() for line in notes.split('\n') if line.strip()]
        outline_points = []
        
        # Add section-specific structure based on type
        if section_type.lower() == "introduction":
            outline_points.extend([
                f"1. Introduction to {section_name}",
                "2. Context and Background",
                "3. Objectives and Goals",
                "4. Document Structure"
            ])
        elif section_type.lower() == "background":
            outline_points.extend([
                "1. Historical Context",
                "2. Current State",
                "3. Key Challenges",
                "4. Opportunities"
            ])
        elif section_type.lower() == "usage":
            outline_points.extend([
                "1. Getting Started",
                "2. Basic Usage",
                "3. Advanced Features",
                "4. Common Use Cases",
                "5. Troubleshooting"
            ])
        elif section_type.lower() == "conclusion":
            outline_points.extend([
                "1. Summary of Key Points",
                "2. Implications",
                "3. Future Considerations",
                "4. Final Recommendations"
            ])
        else:
            # Generic outline for custom sections
            for i, line in enumerate(lines[:5]):
                outline_points.append(f"{i+1}. {line.capitalize()}")
        
        if not outline_points:
            outline_points = ["1. Main point", "2. Supporting details", "3. Summary"]
        
        return "\n".join(outline_points) + f"\n\n[Generated outline for {section_name} section - edit as needed]"
    
    def generate_draft_from_outline(self, notes: str, outline: str, section_name: str, section_type: str) -> str:
        """Generate draft using section-specific prompt"""
        if not outline.strip():
            return "Please provide an outline to generate a draft."
        
        # Get section-specific prompt
        prompt = self.prompts.get_draft_prompt(section_type, section_name, notes, outline)
        
        # For now, return a simple transformation with section-specific content
        # In production, this would call an LLM with the section-specific prompt
        outline_lines = [line.strip() for line in outline.split('\n') if line.strip() and not line.startswith('[')]
        draft_paragraphs = []
        
        # Section-specific content generation
        if section_type.lower() == "introduction":
            draft_paragraphs.append(f"This {section_name} section introduces the main topic and provides essential context for understanding the subsequent content.")
        elif section_type.lower() == "background":
            draft_paragraphs.append(f"This {section_name} section provides the necessary background information and context for understanding the current work.")
        elif section_type.lower() == "usage":
            draft_paragraphs.append(f"This {section_name} section provides practical instructions and examples for implementation.")
        elif section_type.lower() == "conclusion":
            draft_paragraphs.append(f"This {section_name} section summarizes the key points and provides final thoughts.")
        else:
            draft_paragraphs.append(f"This {section_name} section covers the following topics:")
        
        for line in outline_lines:
            if line and not line.startswith('['):
                clean_line = line.lstrip('0123456789. ').strip()
                if clean_line:
                    paragraph = f"{clean_line}. This subsection would elaborate on the key points and provide detailed information to support this topic. Additional context and examples would be included here to create a comprehensive discussion."
                    draft_paragraphs.append(paragraph)
        
        return "\n\n".join(draft_paragraphs) + f"\n\n[Generated {section_name} draft - review and refine as needed]"
    
    def generate_review_suggestions(self, draft: str, section_name: str, section_type: str) -> str:
        """Generate review suggestions using section-specific prompt"""
        if not draft.strip():
            return "Please provide a draft to review."
        
        # Get section-specific prompt
        prompt = self.prompts.get_review_prompt(section_type, section_name, draft)
        
        # Section-specific review suggestions
        base_suggestions = []
        
        if section_type.lower() == "introduction":
            base_suggestions.extend([
                "Consider starting with a more engaging hook to capture reader interest",
                "Ensure the main topic is clearly stated early in the section",
                "Check that sufficient context is provided for the target audience",
                "Verify that objectives are clearly articulated"
            ])
        elif section_type.lower() == "background":
            base_suggestions.extend([
                "Ensure all relevant background information is included",
                "Check that sources and references are appropriate",
                "Verify the logical flow from historical to current context",
                "Consider if the level of detail is appropriate for the audience"
            ])
        elif section_type.lower() == "usage":
            base_suggestions.extend([
                "Ensure instructions are clear and actionable",
                "Add more specific examples where helpful",
                "Check that all necessary steps are included",
                "Consider adding troubleshooting information"
            ])
        elif section_type.lower() == "conclusion":
            base_suggestions.extend([
                "Ensure key points are effectively summarized",
                "Check that implications are clearly stated",
                "Consider adding more specific next steps",
                "Verify the conclusion provides satisfying closure"
            ])
        else:
            base_suggestions.extend([
                "Consider adding more specific examples to support your points",
                "Check for clarity and conciseness in your writing",
                "Ensure all key points are adequately supported"
            ])
        
        return f"Review Suggestions for {section_name}:\n\n" + "\n".join([f"• {suggestion}" for suggestion in base_suggestions]) + f"\n\n[Section-specific review for {section_name} - use as guidance for improvements]"
    
    def apply_review_notes(self, draft: str, review_notes: str, section_name: str, section_type: str) -> str:
        """Apply review notes to update draft"""
        if not draft.strip():
            return "Please provide a draft to revise."
        if not review_notes.strip():
            return "Please provide review notes to apply."
        
        # Simple revision - append review-based improvements
        revised_draft = draft.replace("[Generated draft - review and refine as needed]", "")
        revised_draft = revised_draft.replace(f"[Generated {section_name} draft - review and refine as needed]", "")
        revised_draft += f"\n\n[REVISED {section_name} based on feedback: {review_notes[:100]}{'...' if len(review_notes) > 100 else ''}]"
        
        return revised_draft