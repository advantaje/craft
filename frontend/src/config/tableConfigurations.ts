import { TableColumn } from '../types/document.types';

export interface TableConfiguration {
  columns: TableColumn[];
  sectionType: string;
}

// Model Limitations table configuration
export const MODEL_LIMITATIONS_CONFIG: TableConfiguration = {
  sectionType: 'model_limitations',
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '450px' },
    { id: 'category', label: 'Category', type: 'select', options: ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], width: '180px' }
  ]
};

// Model Risk Issues table configuration
export const MODEL_RISK_CONFIG: TableConfiguration = {
  sectionType: 'model_risk_issues',
  columns: [
    { id: 'title', label: 'Title', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '400px' },
    { id: 'category', label: 'Category', type: 'select', options: ['Operational Risk', 'Market Risk', 'Credit Risk'], width: '150px' },
    { id: 'importance', label: 'Importance', type: 'select', options: ['Critical', 'High', 'Low'], width: '120px' }
  ]
};

// Helper function to get configuration by section type
export function getTableConfiguration(sectionType: string): TableConfiguration {
  switch (sectionType) {
    case 'model_limitations':
      return MODEL_LIMITATIONS_CONFIG;
    case 'model_risk_issues':
      return MODEL_RISK_CONFIG;
    default:
      return MODEL_LIMITATIONS_CONFIG; // Default fallback
  }
}