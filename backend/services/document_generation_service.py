"""
Document generation service for creating downloadable files
"""

from datetime import datetime
import os
import json
from template import DocxTemplate
import io
from .review_data_service import get_raw_review_data


class DocumentGenerationService:
    """Handles document file generation from section data"""
    
    def __init__(self, uploaded_templates=None):
        self.uploaded_templates = uploaded_templates or {}
    
    
    def generate_docx_document_with_progress(self, document_id: str, document_data: dict, sections: list, progress_callback=None, template_info=None):
        """
        Generate a Word document from document data and sections
        
        Args:
            document_id: The document ID from the lookup
            document_data: Dictionary of document metadata
            sections: List of completed sections with draft content
            progress_callback: Function to call with progress updates (unused, kept for compatibility)
            template_info: Dictionary with template information (type, name, etc.)
            
        Returns:
            BytesIO object containing the Word document
        """
        if not sections:
            return None
        
        try:
            # Load the template based on template_info
            if template_info and template_info.get('type') == 'custom':
                # Look for uploaded template in memory
                template_name = template_info.get('name', '')
                template_found = False
                
                for template_key, template_data in self.uploaded_templates.items():
                    if template_data.get('filename') == template_name:
                        # Load template from memory
                        template_content = template_data['content']
                        doc = DocxTemplate(io.BytesIO(template_content))
                        template_found = True
                        break
                
                if not template_found:
                    return None
            else:
                # Load default template - try template-tagged.docx first, then fallback to other names
                template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'template-tagged.docx')
                if not os.path.exists(template_path):
                    # Fallback to alternative template names
                    template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'template-tagged.docx.docx')
                    if not os.path.exists(template_path):
                        template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'template-tagged-v2.docx')
                
                doc = DocxTemplate(template_path)
            
            # Create context dictionary with template tags
            context = {}
            
            # Add review data to context for template use
            try:
                review_data = get_raw_review_data(document_id)
                # Add all review fields to context (using internal field names)
                for field, value in review_data.items():
                    context[field] = value
            except Exception as e:
                print(f"Warning: Could not fetch review data for document generation: {e}")
                # Continue without review data if lookup fails
            
            # Process each section
            for section in sections:
                section_name = section.get('name', 'Untitled Section')
                section_draft = section.get('data', {}).get('draft', '')
                section_type = section.get('type', 'default')
                template_tag = section.get('templateTag')
                
                if not section_draft.strip():
                    continue
                
                # Use template tag directly from section data
                if template_tag and template_tag.strip():
                    # Clean and format section content
                    cleaned_content = self._clean_section_content(section_draft, section_type)
                    context[template_tag.strip()] = cleaned_content
            
            # Render the document with context
            doc.render(context)
            
            # Save to BytesIO
            doc_buffer = io.BytesIO()
            doc.save(doc_buffer)
            doc_buffer.seek(0)
            
            return doc_buffer
            
        except Exception as e:
            return None
    
    def generate_docx_document(self, document_id: str, document_data: dict, sections: list, template_info=None):
        """
        Generate a Word document from document data and sections (legacy method)
        """
        return self.generate_docx_document_with_progress(document_id, document_data, sections, None, template_info)
    
    
    def _clean_section_content(self, content: str, section_type: str = 'default') -> str:
        """
        Clean section content by removing generation markers and formatting
        
        Args:
            content: Raw section draft content
            section_type: Type of section for appropriate formatting
            
        Returns:
            Cleaned and formatted content
        """
        # Check if content is JSON (for model_limitations and model_risk_issues sections)
        try:
            table_data = json.loads(content)
            if 'rows' in table_data:
                # Format table data as a text table with appropriate columns
                return self._format_table_as_text(table_data, section_type)
        except (json.JSONDecodeError, TypeError):
            # Not JSON, process as regular text
            pass
        
        lines = content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove generation markers like [Generated draft - review and refine as needed]
            if line.strip().startswith('[') and line.strip().endswith(']'):
                continue
            
            # Clean any other markers
            cleaned_line = line.strip()
            if cleaned_line:
                cleaned_lines.append(cleaned_line)
            elif cleaned_lines and cleaned_lines[-1]:  # Preserve paragraph breaks
                cleaned_lines.append("")
        
        # Join with proper paragraph spacing
        formatted_content = []
        for i, line in enumerate(cleaned_lines):
            if line == "":
                if formatted_content and formatted_content[-1] != "":
                    formatted_content.append("")
            else:
                formatted_content.append(line)
        
        return "\n".join(formatted_content)
    
    def _format_table_as_text(self, table_data: dict, section_type: str = 'table') -> str:
        """
        Format table JSON data as a text table
        
        Args:
            table_data: Dictionary with 'rows' containing table data
            section_type: Type of section ('model_limitations' for limitations, 'model_risk_issues' for risk issues)
            
        Returns:
            Formatted text table
        """
        if not table_data.get('rows'):
            return "Empty table"
        
        # Define column headers, keys, and widths based on section type
        if section_type == 'model_risk_issues':
            # Model Risk Issues columns: (display_name, json_key, width)
            columns = [
                ('Title', 'title', 25),
                ('Description', 'description', 50),
                ('Category', 'category', 20),
                ('Importance', 'importance', 12)
            ]
        elif section_type == 'model_limitations':
            # Model Limitations columns: (display_name, json_key, width)
            columns = [
                ('Title', 'title', 25),
                ('Description', 'description', 55),
                ('Category', 'category', 25)
            ]
        else:
            # Default fallback columns
            columns = [
                ('Item', 'item', 25),
                ('Description', 'description', 50),
                ('Status', 'status', 25)
            ]
        
        lines = []
        
        # Calculate the maximum width needed for each column
        column_widths = []
        for col_name, col_key, min_width in columns:
            # Start with header width and minimum width
            max_width = max(len(col_name), min_width)
            # Check all data values for this column
            for row in table_data['rows']:
                value = str(row.get(col_key, '-'))
                max_width = max(max_width, len(value))
            column_widths.append(max_width)
        
        # Create header row
        header = "|"
        separator = "|"
        for i, (col_name, col_key, min_width) in enumerate(columns):
            width = column_widths[i]
            header += f" {col_name.ljust(width)} |"
            separator += "-" * (width + 2) + "|"
        
        lines.append(header)
        lines.append(separator)
        
        # Add data rows
        for row in table_data['rows']:
            row_line = "|"
            for i, (col_name, col_key, min_width) in enumerate(columns):
                width = column_widths[i]
                value = str(row.get(col_key, '-'))
                row_line += f" {value.ljust(width)} |"
            lines.append(row_line)
        
        # Add footer with row count
        lines.append(separator)
        lines.append(f"Total rows: {len(table_data['rows'])}")
        
        return "\n".join(lines)
    
    
    def get_filename(self, document_id: str, file_type: str = 'docx') -> str:
        """
        Generate a filename for the document
        
        Args:
            document_id: The document ID
            file_type: File extension (always 'docx')
            
        Returns:
            Suggested filename
        """
        safe_id = "".join(c for c in document_id if c.isalnum() or c in ('-', '_'))
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return f"document_{safe_id}_{timestamp}.docx"