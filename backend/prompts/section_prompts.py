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
        "limitations": """
You are planning a Model Limitations table with the following fixed columns:
- Limitation (text): Name or type of the limitation
- Description (text): Detailed description of the limitation
- Severity (select): One of [Low, Medium, High, Critical]
- Impact (select): One of [Performance, Accuracy, Reliability, Usability]
- Mitigation (text): Strategies to address or mitigate the limitation

Based on the following requirements, describe what limitations should be documented in the table:

Notes: {notes}

Create an outline that describes:
1. What types of model limitations should be included
2. How many limitations approximately
3. What categories of limitations to cover (e.g., data-related, algorithmic, computational)
4. Any specific limitation patterns or concerns to address

Provide a clear plan for documenting model limitations:
""",
        "risk": """
You are planning a Model Risk Issues table with the following fixed columns:
- Risk Issue (text): Name or type of the risk issue
- Description (text): Detailed description of the risk issue
- Likelihood (select): One of [Very Low, Low, Medium, High, Very High]
- Risk Level (select): One of [Low, Medium, High, Critical]
- Controls (text): Risk controls or mitigation measures

Based on the following requirements, describe what risk issues should be documented in the table:

Notes: {notes}

Create an outline that describes:
1. What types of model risk issues should be included
2. How many risk issues approximately
3. What categories of risks to cover (e.g., operational, credit, market, regulatory)
4. Any specific risk patterns or concerns to address

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
        "limitations": """
You are generating Model Limitations table data with these exact columns:
- item (text): Name or type of the limitation
- description (text): Detailed description of the limitation
- quantity (select): Must be one of exactly: "Low", "Medium", "High", or "Critical" (severity level)
- status (select): Must be one of exactly: "Performance", "Accuracy", "Reliability", or "Usability" (impact area)
- notes (text): Mitigation strategies or notes

Based on the notes and outline provided, generate appropriate model limitations data.

Notes: {notes}
Outline: {outline}

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{{"rows": [
  {{"item": "Data Bias", "description": "Training data may contain inherent biases", "quantity": "High", "status": "Accuracy", "notes": "Implement bias detection and diverse training data"}},
  {{"item": "Overfitting", "description": "Model may not generalize well to new data", "quantity": "Medium", "status": "Performance", "notes": "Use cross-validation and regularization techniques"}}
]}}

Generate the model limitations data as JSON:
""",
        "risk": """
You are generating Model Risk Issues table data with these exact columns:
- item (text): Name or type of the risk issue
- description (text): Detailed description of the risk issue
- quantity (select): Must be one of exactly: "Very Low", "Low", "Medium", "High", or "Very High" (likelihood)
- status (select): Must be one of exactly: "Low", "Medium", "High", or "Critical" (risk level)
- notes (text): Risk controls or mitigation measures

Based on the notes and outline provided, generate appropriate model risk issues data.

Notes: {notes}
Outline: {outline}

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{{"rows": [
  {{"item": "Model Drift", "description": "Model performance degrades over time due to data changes", "quantity": "Medium", "status": "High", "notes": "Implement regular model monitoring and retraining schedules"}},
  {{"item": "Data Quality Issues", "description": "Poor input data quality affects model predictions", "quantity": "High", "status": "Critical", "notes": "Establish data validation pipelines and quality checks"}}
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
        "limitations": """
You are reviewing Model Limitations table data. The table should have these columns: item (limitation), description, quantity (severity), status (impact), notes (mitigation).

Analyze the limitations data and provide feedback on:
- Completeness: Are all critical model limitations covered?
- Severity assessment: Are severity levels (Low/Medium/High/Critical) appropriate?
- Impact categorization: Are impact areas (Performance/Accuracy/Reliability/Usability) correctly assigned?
- Mitigation strategies: Are the proposed mitigations practical and effective?
- Coverage: Are there missing limitation categories or specific concerns?
- Clarity: Are descriptions clear and actionable for stakeholders?

Table data: {draft}

Provide specific feedback to improve the model limitations documentation:
""",
        "risk": """
You are reviewing Model Risk Issues table data. The table should have these columns: item (risk issue), description, quantity (likelihood), status (risk level), notes (controls).

Analyze the risk issues data and provide feedback on:
- Risk coverage: Are all critical model risk issues covered?
- Likelihood assessment: Are likelihood levels (Very Low/Low/Medium/High/Very High) appropriate?
- Risk level evaluation: Are risk levels (Low/Medium/High/Critical) correctly assigned?
- Control effectiveness: Are the proposed risk controls practical and comprehensive?
- Risk categorization: Are there missing risk categories or specific concerns?
- Regulatory alignment: Do the risks align with regulatory expectations for model risk management?

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
        "limitations": """
You are updating Model Limitations table data based on review feedback. The table must maintain these exact columns:
- item (text): Name or type of limitation
- description (text): Detailed description of the limitation
- quantity (select): Must be "Low", "Medium", "High", or "Critical" (severity)
- status (select): Must be "Performance", "Accuracy", "Reliability", or "Usability" (impact)
- notes (text): Mitigation strategies

Current limitations data: {draft}

Review feedback to address: {review_notes}

IMPORTANT: Return ONLY valid JSON in the exact format:
{{"rows": [
  {{"item": "...", "description": "...", "quantity": "Medium", "status": "Accuracy", "notes": "..."}}
]}}

Generate the improved model limitations data as JSON:
""",
        "risk": """
You are updating Model Risk Issues table data based on review feedback. The table must maintain these exact columns:
- item (text): Name or type of risk issue
- description (text): Detailed description of the risk issue
- quantity (select): Must be "Very Low", "Low", "Medium", "High", or "Very High" (likelihood)
- status (select): Must be "Low", "Medium", "High", or "Critical" (risk level)
- notes (text): Risk controls or mitigation measures

Current risk issues data: {draft}

Review feedback to address: {review_notes}

IMPORTANT: Return ONLY valid JSON in the exact format:
{{"rows": [
  {{"item": "...", "description": "...", "quantity": "Medium", "status": "High", "notes": "..."}}
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