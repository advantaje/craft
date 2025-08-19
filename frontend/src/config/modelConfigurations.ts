/**
 * OpenAI Model Configuration
 * Maps display names to OpenAI model IDs for the backend
 */

export interface ModelConfig {
  id: string;        // Backend OpenAI model ID
  displayName: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  { id: 'o4-mini-2025-04-16', displayName: 'o4-mini' },
  { id: 'gpt-4.1-2025-04-14', displayName: 'GPT-4.1' },
  { id: 'gpt-4o-2024-08-06', displayName: 'GPT-4o' },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

/**
 * Get display name for a model ID
 */
export function getModelDisplayName(modelId: string): string {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model?.displayName || modelId;
}

/**
 * Check if a model ID is valid
 */
export function isValidModelId(modelId: string): boolean {
  return AVAILABLE_MODELS.some(m => m.id === modelId);
}