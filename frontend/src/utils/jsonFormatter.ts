/**
 * Shared JSON formatting utility for consistent display across the application
 */

export interface JsonFormatterOptions {
  fieldOrder?: string[];
  indent?: number;
}

/**
 * Format JSON objects with consistent indentation and optional field ordering
 * @param obj - The object to format
 * @param options - Formatting options including field order and indentation
 * @returns Formatted JSON string
 */
export function formatJsonForDisplay(obj: any, options: JsonFormatterOptions = {}): string {
  const { fieldOrder, indent = 0 } = options;
  
  return formatJsonRecursive(obj, indent, fieldOrder);
}

function formatJsonRecursive(data: any, indent: number = 0, fieldOrder?: string[]): string {
  const indentStr = '  '.repeat(indent);
  const nextIndentStr = '  '.repeat(indent + 1);
  
  if (data === null) return 'null';
  if (typeof data === 'boolean') return data.toString().toLowerCase();
  if (typeof data === 'number') return data.toString();
  if (typeof data === 'string') return JSON.stringify(data);
  
  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    const items = data.map(item => nextIndentStr + formatJsonRecursive(item, indent + 1));
    return '[\n' + items.join(',\n') + '\n' + indentStr + ']';
  }
  
  if (typeof data === 'object') {
    // Apply field ordering only to top-level objects (indent === 0) if fieldOrder is provided
    let keys;
    if (fieldOrder && indent === 0) {
      const orderedKeys = [];
      // First add keys in the specified order
      for (const key of fieldOrder) {
        if (key in data) {
          orderedKeys.push(key);
        }
      }
      // Then add any remaining keys that weren't in the field order
      for (const key of Object.keys(data)) {
        if (!orderedKeys.includes(key)) {
          orderedKeys.push(key);
        }
      }
      keys = orderedKeys;
    } else {
      keys = Object.keys(data);
    }
    
    if (keys.length === 0) return '{}';
    const items = keys.map(key => {
      const value = formatJsonRecursive(data[key], indent + 1);
      return `${nextIndentStr}"${key}": ${value}`;
    });
    return '{\n' + items.join(',\n') + '\n' + indentStr + '}';
  }
  
  return JSON.stringify(data);
}

/**
 * Parse JSON string safely
 * @param content - JSON string to parse
 * @returns Parsed object or original string if parsing fails
 */
export function safeJsonParse(content: string): any {
  try {
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      return JSON.parse(content);
    }
    return content;
  } catch {
    return content;
  }
}

/**
 * Format content for display - handles both JSON and plain text
 * @param content - Content to format
 * @param isTable - Whether this is table content (should be formatted as JSON)
 * @param fieldOrder - Optional field ordering for JSON objects
 * @returns Formatted content string
 */
export function formatContent(content: string, isTable: boolean = false, fieldOrder?: string[]): string {
  if (!isTable) {
    return content;
  }
  
  const parsed = safeJsonParse(content);
  if (parsed === content) {
    return content; // Not valid JSON, return as-is
  }
  
  return formatJsonForDisplay(parsed, { fieldOrder });
}