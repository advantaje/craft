/**
 * Shared styles and constants for diff components
 */

import { CSSProperties } from 'react';

// Color constants for diff highlighting
export const DIFF_COLORS = {
  added: {
    background: '#d4f4dd',
    color: '#1b5e20',
    border: '#4caf50'
  },
  removed: {
    background: '#ffebee',
    color: '#b71c1c',
    border: '#f44336'
  },
  unchanged: {
    background: 'transparent',
    color: 'inherit',
    border: 'transparent'
  }
} as const;

// Common base style for diff content containers
export const baseDiffContainerStyle: CSSProperties = {
  whiteSpace: 'pre-wrap',
  padding: '12px',
  backgroundColor: '#fafafa',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  height: '100%',
  overflow: 'auto'
};

// Table-specific styles
export const tableDiffStyle: CSSProperties = {
  ...baseDiffContainerStyle,
  fontFamily: 'monospace',
  fontSize: '0.875rem'
};

// Text-specific styles
export const textDiffStyle: CSSProperties = {
  ...baseDiffContainerStyle,
  fontFamily: 'inherit',
  fontSize: 'inherit'
};

/**
 * Get style for diff content container based on content type
 */
export function getDiffContainerStyle(isTable: boolean): CSSProperties {
  return isTable ? tableDiffStyle : textDiffStyle;
}

/**
 * Get style for diff segment highlighting
 */
export function getDiffSegmentStyle(
  type: 'added' | 'removed' | 'unchanged',
  side?: 'left' | 'right'
): CSSProperties {
  // For side-by-side views, only highlight relevant changes on each side
  if (side) {
    const shouldHighlight = 
      (side === 'left' && type === 'removed') || 
      (side === 'right' && type === 'added') ||
      (type === 'unchanged');
    
    if (!shouldHighlight) {
      return {
        backgroundColor: DIFF_COLORS.unchanged.background,
        color: DIFF_COLORS.unchanged.color,
        textDecoration: 'none',
        borderBottom: 'none'
      };
    }
  }
  
  const colors = DIFF_COLORS[type];
  return {
    backgroundColor: colors.background,
    color: colors.color,
    textDecoration: type === 'removed' ? 'line-through' : 'none',
    borderBottom: type === 'added' ? `1px solid ${colors.border}` : 'none'
  };
}

/**
 * Common dialog styles
 */
export const dialogStyles = {
  dialog: {
    height: '80vh',
    maxHeight: '800px'
  },
  summary: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  viewModeSelector: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  }
} as const;