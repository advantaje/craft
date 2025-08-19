/**
 * Default section guidelines extracted from backend prompts
 * These provide the standard instructions for how each section type should be generated
 */

export interface SectionGuidelines {
  draft: string;
  review: string;
  revision: string;
}

export const DEFAULT_GUIDELINES: Record<string, SectionGuidelines> = {
  background: {
    draft: `The content should:
- Provide comprehensive historical context
- Reference relevant previous work and research
- Explain the current state and landscape
- Identify gaps or opportunities
- Justify the need for this work`,
    
    review: `Analyze the draft and provide specific feedback on:
- Comprehensiveness of context
- Accuracy and relevance of information
- Logical flow of ideas
- Appropriate level of detail
- Connection to the main work`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  product: {
    draft: `The content should:
- Effectively summarize key points and findings
- Highlight important implications and significance
- Suggest actionable next steps and recommendations
- Provide clear takeaways and conclusions
- Leave lasting impact on the reader`,
    
    review: `Analyze the draft and provide specific feedback on:
- Effectiveness of summary
- Strength of final message
- Clarity of implications
- Actionability of next steps
- Overall impact and closure`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  usage: {
    draft: `The content should:
- Provide clear, step-by-step instructions
- Include relevant examples and use cases
- Cover common scenarios and edge cases
- Be easy to follow and implement
- Enable practical application`,
    
    review: `Analyze the draft and provide specific feedback on:
- Clarity of instructions
- Completeness of steps
- Usefulness of examples
- Ease of implementation
- Coverage of important scenarios`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  introduction: {
    draft: `The content should:
- Capture the reader's attention from the start
- Clearly introduce the main topic or purpose
- Provide necessary background context
- State objectives and goals clearly
- Outline the structure of what follows`,
    
    review: `Analyze the draft and provide specific feedback on:
- Hook effectiveness and reader engagement
- Clarity of topic introduction
- Adequacy of background context
- Clear statement of objectives
- Flow and logical progression`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  },

  model_limitations: {
    draft: `The Model Limitations table should:
- Include 3-6 key limitations that users need to understand
- Cover data, technical, and scope limitations appropriately
- Provide clear descriptions of each limitation's impact
- Help stakeholders understand model boundaries
- Focus on limitations that directly affect model reliability and business decisions`,
    
    review: `Analyze the limitations data and provide feedback on:
- Completeness: Are all critical model limitations covered?
- Category distribution: Is there appropriate coverage across Data, Technical, and Scope limitation categories?
- Description quality: Are descriptions clear, comprehensive, and explain the implications?
- Missing limitations: Are there obvious limitations that should be included?
- Clarity: Are titles concise and descriptions informative for stakeholders?
- Balance: Is there a good distribution across different limitation types?`,
    
    revision: `Update the Model Limitations table data based on review feedback while maintaining focus on:
- Critical limitations that affect model reliability
- Clear, stakeholder-friendly descriptions
- Proper categorization across limitation types
- Actionable insights for model users`
  },

  model_risk_issues: {
    draft: `The Model Risk Issues table should:
- Identify 3-7 critical risk issues for stakeholder awareness
- Cover operational, market, and credit risks as appropriate
- Assess importance levels based on potential business impact
- Provide comprehensive descriptions of each risk and its potential consequences
- Help with risk mitigation planning and decision-making
- Focus on risks that could significantly impact business outcomes`,
    
    review: `Analyze the risk issues data and provide feedback on:
- Risk coverage: Are all critical model risk issues covered?
- Category distribution: Is there appropriate coverage across Operational, Market, and Credit risk categories?
- Importance assessment: Are importance levels (Critical/High/Low) appropriately assigned based on potential impact?
- Description quality: Are descriptions comprehensive and clear about the potential impact?
- Missing risks: Are there any obvious risk issues that should be included?
- Balance: Is there a good balance of risk types and importance levels?`,
    
    revision: `Update the Model Risk Issues table data based on review feedback while ensuring:
- Comprehensive coverage of critical model risks
- Appropriate importance level assignments
- Clear descriptions of potential business impact
- Proper risk categorization and balance
- Actionable insights for risk management`
  },

  default: {
    draft: `The content should be appropriate for this type of section, well-structured, and address the key points from the notes.`,
    
    review: `Analyze the draft and provide specific, constructive feedback appropriate for this type of section.`,
    
    revision: `Improve the draft while maintaining its core message and structure by addressing the review feedback.`
  }
};

/**
 * Get default guidelines for a section type and operation
 */
export function getDefaultGuidelines(sectionType: string, operation: 'draft' | 'review' | 'revision'): string {
  const guidelines = DEFAULT_GUIDELINES[sectionType] || DEFAULT_GUIDELINES.default;
  return guidelines[operation];
}

/**
 * Get all default guidelines for a section type
 */
export function getSectionDefaultGuidelines(sectionType: string): SectionGuidelines {
  return DEFAULT_GUIDELINES[sectionType] || DEFAULT_GUIDELINES.default;
}