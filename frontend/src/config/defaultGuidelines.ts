/**
 * Default section guidelines extracted from backend prompts
 * These provide the standard instructions for how each section type should be generated
 */

export interface SectionGuidelines {
  outline: string;
  draft: string;
  review: string;
  revision: string;
}

export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  background: {
    outline: `Create a structured outline that:
- Provides historical context or previous work
- Explains the current state of the topic
- Identifies gaps or opportunities
- Sets up the need for the current work`,
    
    draft: `Create informative content that:
- Provides comprehensive context
- References relevant previous work
- Explains the current landscape
- Justifies the need for this work`,
    
    review: `Analyze the draft and provide specific feedback on:
- Comprehensiveness of context
- Accuracy and relevance of information
- Logical flow of ideas
- Appropriate level of detail
- Connection to the main work`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  product: {
    outline: `Create a structured outline that:
- Summarizes key points and findings
- Discusses implications or significance
- Suggests future work or next steps
- Provides final thoughts or recommendations`,
    
    draft: `Create impactful content that:
- Effectively summarizes key points
- Highlights important implications
- Suggests actionable next steps
- Leaves the reader with clear takeaways`,
    
    review: `Analyze the draft and provide specific feedback on:
- Effectiveness of summary
- Strength of final message
- Clarity of implications
- Actionability of next steps
- Overall impact and closure`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  usage: {
    outline: `Create a structured outline that:
- Explains how to use or implement something
- Provides step-by-step instructions
- Includes examples or use cases
- Covers common scenarios and edge cases`,
    
    draft: `Create practical content that:
- Provides clear, actionable instructions
- Includes relevant examples
- Covers common use cases
- Is easy to follow and implement`,
    
    review: `Analyze the draft and provide specific feedback on:
- Clarity of instructions
- Completeness of steps
- Usefulness of examples
- Ease of implementation
- Coverage of important scenarios`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  introduction: {
    outline: `Create a structured outline that:
- Introduces the main topic or purpose
- Provides necessary background context
- States the objectives or goals
- Outlines the structure of what follows`,
    
    draft: `Create engaging content that:
- Captures the reader's attention
- Clearly introduces the main topic
- Provides essential context
- States objectives clearly`,
    
    review: `Analyze the draft and provide specific feedback on:
- Hook effectiveness and reader engagement
- Clarity of topic introduction
- Adequacy of background context
- Clear statement of objectives
- Flow and logical progression`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  model_limitations: {
    outline: `Plan a Model Limitations table that describes:
1. What types of model limitations should be included
2. How many limitations approximately (aim for 3-6 items)
3. Distribution across categories (Data Limitations, Technical Limitations, Scope Limitations)
4. Key limitation areas that must be addressed`,
    
    draft: `Generate Model Limitations table data with these exact columns:
- title (text): Brief title of the limitation
- description (text): Detailed description of the limitation and its implications
- category (select): Must be one of exactly: "Data Limitations", "Technical Limitations", or "Scope Limitations"

IMPORTANT: Return ONLY valid JSON in this exact format:
{"rows": [
  {"title": "Limited Training Data", "description": "The model was trained on a dataset that may not fully represent all possible scenarios, potentially affecting performance on edge cases", "category": "Data Limitations"}
]}`,
    
    review: `Analyze the limitations data and provide feedback on:
- Completeness: Are all critical model limitations covered?
- Category distribution: Is there appropriate coverage across Data, Technical, and Scope limitation categories?
- Description quality: Are descriptions clear, comprehensive, and explain the implications?
- Missing limitations: Are there obvious limitations that should be included?
- Clarity: Are titles concise and descriptions informative for stakeholders?
- Balance: Is there a good distribution across different limitation types?`,
    
    revision: `Update the Model Limitations table data based on review feedback. The table must maintain these exact columns:
- title (text): Brief title of the limitation
- description (text): Detailed description of the limitation and its implications
- category (select): Must be "Data Limitations", "Technical Limitations", or "Scope Limitations"

IMPORTANT: Return ONLY valid JSON in the exact format:
{"rows": [
  {"title": "...", "description": "...", "category": "Data Limitations"}
]}`
  },

  model_risk_issues: {
    outline: `Plan a Model Risk Issues table that describes:
1. What types of model risk issues should be included
2. How many risk issues approximately (aim for 3-7 items)
3. Which categories to focus on (Operational Risk, Market Risk, or Credit Risk)
4. The importance levels to assign based on potential impact`,
    
    draft: `Generate Model Risk Issues table data with these exact columns:
- title (text): Brief title of the risk issue
- description (text): Detailed description of the risk issue (can be longer and more comprehensive)
- category (select): Must be one of exactly: "Operational Risk", "Market Risk", or "Credit Risk"
- importance (select): Must be one of exactly: "Critical", "High", or "Low"

IMPORTANT: Return ONLY valid JSON in this exact format:
{"rows": [
  {"title": "Model Drift", "description": "Model performance may degrade over time as market conditions and data patterns evolve, potentially leading to inaccurate predictions and business decisions", "category": "Operational Risk", "importance": "Critical"}
]}`,
    
    review: `Analyze the risk issues data and provide feedback on:
- Risk coverage: Are all critical model risk issues covered?
- Category distribution: Is there appropriate coverage across Operational, Market, and Credit risk categories?
- Importance assessment: Are importance levels (Critical/High/Low) appropriately assigned based on potential impact?
- Description quality: Are descriptions comprehensive and clear about the potential impact?
- Missing risks: Are there any obvious risk issues that should be included?
- Balance: Is there a good balance of risk types and importance levels?`,
    
    revision: `Update the Model Risk Issues table data based on review feedback. The table must maintain these exact columns:
- title (text): Brief title of the risk issue
- description (text): Detailed description of the risk issue (can be longer and more comprehensive)
- category (select): Must be "Operational Risk", "Market Risk", or "Credit Risk"
- importance (select): Must be "Critical", "High", or "Low"

IMPORTANT: Return ONLY valid JSON in the exact format:
{"rows": [
  {"title": "...", "description": "...", "category": "Operational Risk", "importance": "Critical"}
]}`
  },

  default: {
    outline: `Create a structured outline that is appropriate for this type of section based on the provided notes.`,
    
    draft: `Create appropriate content for this section based on the notes and outline provided.`,
    
    review: `Analyze the draft and provide specific, constructive feedback appropriate for this type of section.`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  }
};

/**
 * Get default guidelines for a section type and operation
 */
export function getDefaultGuidelines(sectionType: string, operation: 'outline' | 'draft' | 'review' | 'revision'): string {
  const guidelines = DEFAULT_GUIDELINES[sectionType] || DEFAULT_GUIDELINES.default;
  return guidelines[operation];
}

/**
 * Get all default guidelines for a section type
 */
export function getSectionDefaultGuidelines(sectionType: string): SectionGuidelines {
  return DEFAULT_GUIDELINES[sectionType] || DEFAULT_GUIDELINES.default;
}