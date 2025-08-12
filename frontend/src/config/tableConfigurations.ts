import { TableColumn } from '../types/document.types';

export interface TableConfiguration {
  columns: TableColumn[];
  sectionType: string;
}

// Model Limitations table configuration
export const MODEL_LIMITATIONS_CONFIG: TableConfiguration = {
  sectionType: 'model_limitations',
  columns: [
    { id: 'item', label: 'Limitation', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '300px' },
    { id: 'quantity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], width: '100px' },
    { id: 'status', label: 'Impact', type: 'select', options: ['Performance', 'Accuracy', 'Reliability', 'Usability'], width: '150px' },
    { id: 'notes', label: 'Mitigation', type: 'text', width: '200px' }
  ]
};

// Model Risk Issues table configuration
export const MODEL_RISK_CONFIG: TableConfiguration = {
  sectionType: 'model_risk_issues',
  columns: [
    { id: 'item', label: 'Risk Issue', type: 'text', required: true, width: '200px' },
    { id: 'description', label: 'Description', type: 'text', width: '300px' },
    { id: 'quantity', label: 'Likelihood', type: 'select', options: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], width: '120px' },
    { id: 'status', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], width: '120px' },
    { id: 'notes', label: 'Controls', type: 'text', width: '200px' }
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