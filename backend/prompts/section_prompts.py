"""
Section-specific prompt templates for document generation
"""

class SectionPrompts:
    """Contains prompt templates for different section types"""
    
    OUTLINE_PROMPTS = {
        "introduction": """
You are creating an outline for an Introduction section. Based on the following notes, create a structured outline that:
- Introduces the main topic or purpose
- Provides necessary background context
- States the objectives or goals
- Outlines the structure of what follows

Notes: {notes}

Create a clear, logical outline for an Introduction section:
""",
        "background": """
You are creating an outline for a Background section. Based on the following notes, create a structured outline that:
- Provides historical context or previous work
- Explains the current state of the topic
- Identifies gaps or opportunities
- Sets up the need for the current work

Notes: {notes}

Create a comprehensive outline for a Background section:
""",
        "usage": """
You are creating an outline for a Usage section. Based on the following notes, create a structured outline that:
- Explains how to use or implement something
- Provides step-by-step instructions
- Includes examples or use cases
- Covers common scenarios and edge cases

Notes: {notes}

Create a practical outline for a Usage section:
""",
        "conclusion": """
You are creating an outline for a Conclusion section. Based on the following notes, create a structured outline that:
- Summarizes key points and findings
- Discusses implications or significance
- Suggests future work or next steps
- Provides final thoughts or recommendations

Notes: {notes}

Create a compelling outline for a Conclusion section:
""",
        "default": """
You are creating an outline for a {section_name} section. Based on the following notes, create a structured outline that is appropriate for this type of section:

Notes: {notes}

Create a clear, logical outline:
"""
    }
    
    DRAFT_PROMPTS = {
        "introduction": """
You are writing an Introduction section. Based on the notes and outline provided, create engaging content that:
- Captures the reader's attention
- Clearly introduces the main topic
- Provides essential context
- States objectives clearly

Notes: {notes}
Outline: {outline}

Write a compelling Introduction section:
""",
        "background": """
You are writing a Background section. Based on the notes and outline provided, create informative content that:
- Provides comprehensive context
- References relevant previous work
- Explains the current landscape
- Justifies the need for this work

Notes: {notes}
Outline: {outline}

Write a thorough Background section:
""",
        "usage": """
You are writing a Usage section. Based on the notes and outline provided, create practical content that:
- Provides clear, actionable instructions
- Includes relevant examples
- Covers common use cases
- Is easy to follow and implement

Notes: {notes}
Outline: {outline}

Write a helpful Usage section:
""",
        "conclusion": """
You are writing a Conclusion section. Based on the notes and outline provided, create impactful content that:
- Effectively summarizes key points
- Highlights important implications
- Suggests actionable next steps
- Leaves the reader with clear takeaways

Notes: {notes}
Outline: {outline}

Write a strong Conclusion section:
""",
        "default": """
You are writing a {section_name} section. Based on the notes and outline provided, create appropriate content for this section:

Notes: {notes}
Outline: {outline}

Write the {section_name} section:
"""
    }
    
    REVIEW_PROMPTS = {
        "introduction": """
You are reviewing an Introduction section. Analyze the draft and provide specific feedback on:
- Hook effectiveness and reader engagement
- Clarity of topic introduction
- Adequacy of background context
- Clear statement of objectives
- Flow and logical progression

Draft: {draft}

Provide constructive review feedback for this Introduction:
""",
        "background": """
You are reviewing a Background section. Analyze the draft and provide specific feedback on:
- Comprehensiveness of context
- Accuracy and relevance of information
- Logical flow of ideas
- Appropriate level of detail
- Connection to the main work

Draft: {draft}

Provide constructive review feedback for this Background:
""",
        "usage": """
You are reviewing a Usage section. Analyze the draft and provide specific feedback on:
- Clarity of instructions
- Completeness of steps
- Usefulness of examples
- Ease of implementation
- Coverage of important scenarios

Draft: {draft}

Provide constructive review feedback for this Usage section:
""",
        "conclusion": """
You are reviewing a Conclusion section. Analyze the draft and provide specific feedback on:
- Effectiveness of summary
- Strength of final message
- Clarity of implications
- Actionability of next steps
- Overall impact and closure

Draft: {draft}

Provide constructive review feedback for this Conclusion:
""",
        "default": """
You are reviewing a {section_name} section. Analyze the draft and provide specific, constructive feedback appropriate for this type of section:

Draft: {draft}

Provide review feedback:
"""
    }
    
    REVISION_PROMPTS = {
        "introduction": """
You are revising an Introduction section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the Introduction section incorporating the feedback:
""",
        "background": """
You are revising a Background section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the Background section incorporating the feedback:
""",
        "usage": """
You are revising a Usage section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the Usage section incorporating the feedback:
""",
        "conclusion": """
You are revising a Conclusion section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the Conclusion section incorporating the feedback:
""",
        "default": """
You are revising a {section_name} section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the {section_name} section incorporating the feedback:
"""
    }
    
    @classmethod
    def get_outline_prompt(cls, section_type: str, section_name: str, notes: str) -> str:
        """Get outline prompt for a specific section type"""
        section_key = section_type.lower()
        template = cls.OUTLINE_PROMPTS.get(section_key, cls.OUTLINE_PROMPTS["default"])
        return template.format(notes=notes, section_name=section_name)
    
    @classmethod
    def get_draft_prompt(cls, section_type: str, section_name: str, notes: str, outline: str) -> str:
        """Get draft prompt for a specific section type"""
        section_key = section_type.lower()
        template = cls.DRAFT_PROMPTS.get(section_key, cls.DRAFT_PROMPTS["default"])
        return template.format(notes=notes, outline=outline, section_name=section_name)
    
    @classmethod
    def get_review_prompt(cls, section_type: str, section_name: str, draft: str) -> str:
        """Get review prompt for a specific section type"""
        section_key = section_type.lower()
        template = cls.REVIEW_PROMPTS.get(section_key, cls.REVIEW_PROMPTS["default"])
        return template.format(draft=draft, section_name=section_name)
    
    @classmethod
    def get_revision_prompt(cls, section_type: str, section_name: str, draft: str, review_notes: str) -> str:
        """Get revision prompt for a specific section type"""
        section_key = section_type.lower()
        template = cls.REVISION_PROMPTS.get(section_key, cls.REVISION_PROMPTS["default"])
        return template.format(draft=draft, review_notes=review_notes, section_name=section_name)