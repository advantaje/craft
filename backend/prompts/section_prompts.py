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
You are creating an outline for a Product section. Based on the following notes, create a structured outline that:
- Summarizes key points and findings
- Discusses implications or significance
- Suggests future work or next steps
- Provides final thoughts or recommendations

Notes: {notes}

Create a compelling outline for a Product section:
""",
        "default": """
You are creating an outline for a {section_name} section. Based on the following notes, create a structured outline that is appropriate for this type of section:

Notes: {notes}

Create a clear, logical outline:
""",
        "model_limitations": """
You are planning a Model Limitations table with the following fixed columns:
- Title (text): Brief title of the limitation
- Description (text): Detailed description of the limitation
- Category (select): One of [Data Limitations, Technical Limitations, Scope Limitations]

Based on the following requirements, describe what limitations should be documented in the table:

Notes: {notes}

Create an outline that describes:
1. What types of model limitations should be included
2. How many limitations approximately (aim for 3-6 items)
3. Distribution across categories (Data Limitations, Technical Limitations, Scope Limitations)
4. Key limitation areas that must be addressed

Provide a clear plan for documenting model limitations:
""",
        "model_risk_issues": """
You are planning a Model Risk Issues table with the following fixed columns:
- Title (text): Brief title of the risk issue
- Description (text): Detailed description of the risk issue
- Category (select): One of [Operational Risk, Market Risk, Credit Risk]
- Importance (select): One of [Critical, High, Low]

Based on the following requirements, describe what risk issues should be documented in the table:

Notes: {notes}

Create an outline that describes:
1. What types of model risk issues should be included
2. How many risk issues approximately (aim for 3-7 items)
3. Which categories to focus on (Operational Risk, Market Risk, or Credit Risk)
4. The importance levels to assign based on potential impact

Provide a clear plan for documenting model risk issues:
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
You are writing a Product section. Based on the notes and outline provided, create impactful content that:
- Effectively summarizes key points
- Highlights important implications
- Suggests actionable next steps
- Leaves the reader with clear takeaways

Notes: {notes}
Outline: {outline}

Write a strong Product section:
""",
        "default": """
You are writing a {section_name} section. Based on the notes and outline provided, create appropriate content for this section:

Notes: {notes}
Outline: {outline}

Write the {section_name} section:
""",
        "model_limitations": """
You are generating Model Limitations table data with these exact columns:
- title (text): Brief title of the limitation
- description (text): Detailed description of the limitation and its implications
- category (select): Must be one of exactly: "Data Limitations", "Technical Limitations", or "Scope Limitations"

Based on the notes and outline provided, generate appropriate model limitations data.

Notes: {notes}
Outline: {outline}

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{{"rows": [
  {{"title": "Limited Training Data", "description": "The model was trained on a dataset that may not fully represent all possible scenarios, potentially affecting performance on edge cases", "category": "Data Limitations"}},
  {{"title": "Computational Constraints", "description": "Model inference requires significant computational resources which may limit real-time applications", "category": "Technical Limitations"}},
  {{"title": "Domain Specificity", "description": "The model is optimized for specific use cases and may not generalize well to other domains", "category": "Scope Limitations"}}
]}}

Generate the model limitations data as JSON:
""",
        "model_risk_issues": """
You are generating Model Risk Issues table data with these exact columns:
- title (text): Brief title of the risk issue
- description (text): Detailed description of the risk issue (can be longer and more comprehensive)
- category (select): Must be one of exactly: "Operational Risk", "Market Risk", or "Credit Risk"
- importance (select): Must be one of exactly: "Critical", "High", or "Low"

Based on the notes and outline provided, generate appropriate model risk issues data.

Notes: {notes}
Outline: {outline}

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{{"rows": [
  {{"title": "Model Drift", "description": "Model performance may degrade over time as market conditions and data patterns evolve, potentially leading to inaccurate predictions and business decisions", "category": "Operational Risk", "importance": "Critical"}},
  {{"title": "Data Quality Issues", "description": "Input data may contain errors, missing values, or inconsistencies that affect model reliability and prediction accuracy", "category": "Operational Risk", "importance": "High"}},
  {{"title": "Market Volatility", "description": "Extreme market conditions may cause model assumptions to break down, leading to unexpected losses", "category": "Market Risk", "importance": "Critical"}}
]}}

Generate the model risk issues data as JSON:
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
You are reviewing a Product section. Analyze the draft and provide specific feedback on:
- Effectiveness of summary
- Strength of final message
- Clarity of implications
- Actionability of next steps
- Overall impact and closure

Draft: {draft}

Provide constructive review feedback for this Product:
""",
        "default": """
You are reviewing a {section_name} section. Analyze the draft and provide specific, constructive feedback appropriate for this type of section:

Draft: {draft}

Provide review feedback:
""",
        "model_limitations": """
You are reviewing Model Limitations table data. The table should have these columns: title, description, category (Data Limitations/Technical Limitations/Scope Limitations).

Analyze the limitations data and provide feedback on:
- Completeness: Are all critical model limitations covered?
- Category distribution: Is there appropriate coverage across Data, Technical, and Scope limitation categories?
- Description quality: Are descriptions clear, comprehensive, and explain the implications?
- Missing limitations: Are there obvious limitations that should be included?
- Clarity: Are titles concise and descriptions informative for stakeholders?
- Balance: Is there a good distribution across different limitation types?

Table data: {draft}

Provide specific feedback to improve the model limitations documentation:
""",
        "model_risk_issues": """
You are reviewing Model Risk Issues table data. The table should have these columns: title, description, category (Operational Risk/Market Risk/Credit Risk), importance (Critical/High/Low).

Analyze the risk issues data and provide feedback on:
- Risk coverage: Are all critical model risk issues covered?
- Category distribution: Is there appropriate coverage across Operational, Market, and Credit risk categories?
- Importance assessment: Are importance levels (Critical/High/Low) appropriately assigned based on potential impact?
- Description quality: Are descriptions comprehensive and clear about the potential impact?
- Missing risks: Are there any obvious risk issues that should be included?
- Balance: Is there a good balance of risk types and importance levels?

Table data: {draft}

Provide specific feedback to improve the model risk issues documentation:
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
You are revising a Product section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the Product section incorporating the feedback:
""",
        "default": """
You are revising a {section_name} section based on review feedback. Improve the draft while maintaining its core message and structure:

Original Draft: {draft}

Review Feedback: {review_notes}

Revise the {section_name} section incorporating the feedback:
""",
        "model_limitations": """
You are updating Model Limitations table data based on review feedback. The table must maintain these exact columns:
- title (text): Brief title of the limitation
- description (text): Detailed description of the limitation and its implications
- category (select): Must be "Data Limitations", "Technical Limitations", or "Scope Limitations"

Current limitations data: {draft}

Review feedback to address: {review_notes}

IMPORTANT: Return ONLY valid JSON in the exact format:
{{"rows": [
  {{"title": "...", "description": "...", "category": "Data Limitations"}}
]}}

Generate the improved model limitations data as JSON:
""",
        "model_risk_issues": """
You are updating Model Risk Issues table data based on review feedback. The table must maintain these exact columns:
- title (text): Brief title of the risk issue
- description (text): Detailed description of the risk issue (can be longer and more comprehensive)
- category (select): Must be "Operational Risk", "Market Risk", or "Credit Risk"
- importance (select): Must be "Critical", "High", or "Low"

Current risk issues data: {draft}

Review feedback to address: {review_notes}

IMPORTANT: Return ONLY valid JSON in the exact format:
{{"rows": [
  {{"title": "...", "description": "...", "category": "Operational Risk", "importance": "Critical"}}
]}}

Generate the improved model risk issues data as JSON:
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