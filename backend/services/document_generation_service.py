"""
Document generation service for creating downloadable files
"""

from datetime import datetime
import os
import json
from template import DocxTemplate
import io
from .review_data_service import get_raw_review_data
from .template_service import create_default_template


class DocumentGenerationService:
    """Handles document file generation from section data"""
    
    def __init__(self, uploaded_templates):
        self.uploaded_templates = uploaded_templates
    
    
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
                # Create default template programmatically (no file system dependency)
                template_buffer = create_default_template()
                doc = DocxTemplate(template_buffer)
            
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
                    # Handle table sections differently from text sections
                    if section_type in ['model_limitations', 'model_risk_issues']:
                        # For table sections, pass raw JSON data as list of dictionaries
                        try:
                            table_data = json.loads(section_draft)
                            if 'rows' in table_data:
                                # Add id field to each row (1-indexed) and pass to DocxTemplate
                                rows_with_id = []
                                for index, row in enumerate(table_data['rows']):
                                    row_with_id = row.copy()  # Create a copy to avoid modifying original
                                    row_with_id['id'] = index + 1  # Add 1-indexed ID
                                    rows_with_id.append(row_with_id)
                                context[template_tag.strip()] = rows_with_id
                            else:
                                context[template_tag.strip()] = []
                        except (json.JSONDecodeError, TypeError):
                            # If JSON parsing fails, pass empty list
                            context[template_tag.strip()] = []
                    else:
                        # For text sections, clean and format the content
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
        Clean text section content by removing generation markers and formatting
        Note: This method is only used for text sections, not table sections
        
        Args:
            content: Raw section draft content (text only)
            section_type: Type of section for appropriate formatting
            
        Returns:
            Cleaned and formatted content
        """
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