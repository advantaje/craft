"""
Document generation service with section-aware processing
"""

from services.openai_tools import create_azure_openai_client
from prompts.section_prompts import SectionPrompts
from services.diff_service import DocumentDiffService


class GenerationService:
    """Handles document generation with unified, guidelines-based approach"""
    
    # Field order mappings to match frontend table configurations
    FIELD_ORDER_MAPPING = {
        'model_limitations': ['title', 'description', 'category'],
        'model_risk_issues': ['title', 'description', 'category', 'importance']
    }
    
    # System prompts for different content types
    SYSTEM_PROMPTS = {
        'text': "You are an expert document writer. Create clear, well-structured content.",
        'json': "You are an expert at generating structured table data. Always return valid JSON.",
        'review': "You are an expert editor. Provide constructive, specific feedback to improve documents.",
        'revision': "You are an expert writer. Revise documents based on feedback while maintaining the original intent."
    }
    
    def __init__(self):
        self.prompts = SectionPrompts()
        self.client = create_azure_openai_client()
        self.model = 'gpt-4.1-nano-2025-04-14'
        self.diff_service = DocumentDiffService()
    
    def _generate_content(self, operation: str, section_type: str, section_name: str, guidelines: str = None, prompt_override: str = None, **prompt_kwargs) -> str:
        """Unified content generation method for all operations"""
        try:
            # Use override prompt or generate using unified method
            if prompt_override:
                prompt = prompt_override
            else:
                prompt = self.prompts.get_prompt(operation, section_type, section_name, guidelines, **prompt_kwargs)
            
            # Determine content type and system prompt
            is_table_section = section_type in ['model_limitations', 'model_risk_issues']
            requires_json = is_table_section and operation in ['draft', 'revision']
            
            if requires_json:
                system_prompt = self.SYSTEM_PROMPTS['json']
                response_format = {"type": "json_object"}
                max_tokens = 2500
            elif operation == 'review':
                system_prompt = self.SYSTEM_PROMPTS['review']
                response_format = None
                max_tokens = 1500
            elif operation == 'revision':
                system_prompt = self.SYSTEM_PROMPTS['revision']
                response_format = None
                max_tokens = 2500
            else:
                system_prompt = self.SYSTEM_PROMPTS['text']
                response_format = None
                max_tokens = 2000 if operation == 'draft' else 1000
            
            # For row review with override prompt, use simpler system prompt
            if prompt_override:
                system_prompt = "You are an expert at improving table data based on feedback. Return data in the same format as provided."
                max_tokens = 1000
            
            # Make API call
            call_kwargs = {
                'model': self.model,
                'messages': [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                'temperature': 0.6 if operation == 'review' else 0.7,
                'max_tokens': max_tokens
            }
            
            if response_format:
                call_kwargs['response_format'] = response_format
            
            response = self.client.chat.completions.create(**call_kwargs)
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error in {operation} generation: {e}")
            return f"Error in {operation} generation: {str(e)}. Please check your API configuration."
    
    def generate_outline_from_notes(self, notes: str, section_name: str, section_type: str, guidelines: str = None) -> str:
        """Generate outline using unified generation method"""
        if not notes.strip():
            return "Please provide notes to generate an outline."
        
        return self._generate_content('outline', section_type, section_name, guidelines, notes=notes)
    
    def generate_draft_from_outline(self, notes: str, outline: str, section_name: str, section_type: str, guidelines: str = None) -> str:
        """Generate draft using unified generation method"""
        if not outline.strip():
            return "Please provide an outline to generate a draft."
        
        return self._generate_content('draft', section_type, section_name, guidelines, notes=notes, outline=outline)
    
    def generate_review_suggestions(self, draft: str, section_name: str, section_type: str, guidelines: str = None) -> str:
        """Generate review suggestions using unified generation method"""
        if not draft.strip():
            return "Please provide a draft to review."
        
        return self._generate_content('review', section_type, section_name, guidelines, draft=draft)
    
    def apply_review_notes(self, draft: str, review_notes: str, section_name: str, section_type: str, guidelines: str = None) -> str:
        """Apply review notes using unified generation method"""
        if not draft.strip():
            return "Please provide a draft to revise."
        if not review_notes.strip():
            return "Please provide review notes to apply."
        
        return self._generate_content('revision', section_type, section_name, guidelines, draft=draft, review_notes=review_notes)
    
    def generate_draft_from_notes(self, notes: str, section_name: str, section_type: str, guidelines: str = None) -> str:
        """Generate draft directly from notes using internal two-step process (notes -> outline -> draft)
        
        Note: The 'guidelines' parameter contains the draft guidelines from the frontend.
        These guidelines are intentionally used for both outline and draft generation steps
        to ensure consistency. The outline generation is an internal implementation detail
        not exposed to users.
        """
        if not notes.strip():
            return "Please provide notes to generate a draft."
        
        try:
            # Step 1: Generate outline internally (not returned to user)
            # Uses draft guidelines to ensure outline aligns with desired draft output
            outline = self.generate_outline_from_notes(notes, section_name, section_type, guidelines)
            
            # Check if outline generation failed
            if outline.startswith("Error generating outline:"):
                return f"Error in draft generation: {outline}"
            
            # Step 2: Generate draft from the internal outline
            # Uses same draft guidelines for consistency
            draft = self.generate_draft_from_outline(notes, outline, section_name, section_type, guidelines)
            
            return draft
            
        except Exception as e:
            print(f"Error generating draft from notes: {e}")
            return f"Error generating draft: {str(e)}. Please check your API configuration."
    
    def apply_review_notes_with_diff(self, draft: str, review_notes: str, section_name: str, section_type: str, guidelines: str = None) -> dict:
        """Apply review notes and return both new draft and diff data"""
        if not draft.strip():
            return {"error": "Please provide a draft to revise."}
        if not review_notes.strip():
            return {"error": "Please provide review notes to apply."}
        
        try:
            # Generate the new draft first
            new_draft = self.apply_review_notes(draft, review_notes, section_name, section_type, guidelines)
            
            # Check if generation failed
            if new_draft.startswith("Error"):
                return {"error": new_draft}
            
            # Compute diff between original and new draft
            diff_segments, diff_summary, formatted_original, formatted_new = self._compute_diff_data(draft, new_draft, section_type)
            
            # Return result with optional formatted strings for table sections
            result = {
                "new_draft": new_draft,
                "diff_segments": diff_segments,
                "diff_summary": diff_summary
            }
            
            if formatted_original:
                result["original_formatted"] = formatted_original
            if formatted_new:
                result["new_formatted"] = formatted_new
            
            return result
            
        except Exception as e:
            print(f"Error applying review notes with diff: {e}")
            return {"error": f"Error applying review notes: {str(e)}. Please check your API configuration."}
    
    def review_table_row_with_diff(self, row_data: dict, review_notes: str, columns: list, section_name: str, section_type: str = None, guidelines: str = None) -> dict:
        """Review a single table row and return updated row with diff data"""
        if not row_data:
            return {"error": "Please provide row data to review."}
        if not review_notes.strip():
            return {"error": "Please provide review notes to apply."}
        
        try:
            # Convert row to readable format for LLM
            row_text = self.format_row_for_llm(row_data, columns)
            
            # Create a focused prompt for row review
            prompt = f"""
Review and improve this table row based on the feedback provided.

Row data:
{row_text}

Feedback to apply:
{review_notes}

Please return the improved row data in the same format, maintaining the structure but improving the content based on the feedback."""
            
            # Add guidelines if provided
            if guidelines and guidelines.strip():
                prompt += f"\n\nGuidelines for reviewing:\n{guidelines.strip()}"
            
            # Generate improved row using unified error handling
            improved_row_text = self._generate_content('revision', section_type or 'default', section_name, None, prompt_override=prompt)
            
            if improved_row_text.startswith("Error"):
                return {"error": improved_row_text}
            
            # Parse back to row format
            improved_row = self.parse_llm_response_to_row(improved_row_text, row_data, columns)
            
            # Compute diff between original and improved row using formatted JSON
            field_order = self.FIELD_ORDER_MAPPING.get(section_type, None) if section_type else None
            original_json = self._format_json_with_order(row_data, field_order, is_table=False)
            improved_json = self._format_json_with_order(improved_row, field_order, is_table=False)
            
            diff_segments = self.diff_service.compute_document_diff(original_json, improved_json)
            diff_summary = self.diff_service.compute_diff_summary(diff_segments)
            
            return {
                "new_row": improved_row,
                "original_formatted": original_json,
                "new_formatted": improved_json,
                "diff_segments": diff_segments,
                "diff_summary": diff_summary
            }
            
        except Exception as e:
            print(f"Error reviewing table row: {e}")
            return {"error": f"Error reviewing table row: {str(e)}. Please check your API configuration."}
    
    def format_row_for_llm(self, row_data: dict, columns: list) -> str:
        """Convert row data to human-readable format for LLM"""
        formatted_fields = []
        for col in columns:
            col_id = col.get('id', '')
            col_label = col.get('label', col_id)
            value = row_data.get(col_id, '')
            formatted_fields.append(f"{col_label}: {value}")
        return "\n".join(formatted_fields)
    
    def parse_llm_response_to_row(self, response_text: str, original_row: dict, columns: list) -> dict:
        """Parse LLM response back to row format"""
        improved_row = original_row.copy()
        
        # Try to extract field values from the response
        lines = response_text.strip().split('\n')
        for line in lines:
            if ':' in line:
                parts = line.split(':', 1)
                if len(parts) == 2:
                    field_name = parts[0].strip()
                    field_value = parts[1].strip()
                    
                    # Find matching column
                    for col in columns:
                        if col.get('label', '').lower() == field_name.lower() or col.get('id', '').lower() == field_name.lower():
                            col_id = col.get('id')
                            if col_id:
                                # Convert to appropriate type
                                if col.get('type') == 'number':
                                    try:
                                        improved_row[col_id] = float(field_value) if '.' in field_value else int(field_value)
                                    except ValueError:
                                        improved_row[col_id] = field_value
                                else:
                                    improved_row[col_id] = field_value
                            break
        
        return improved_row
    
    def _format_json_with_order(self, data: dict, field_order: list = None, is_table: bool = False) -> str:
        """
        Unified JSON formatter for consistent formatting across all use cases
        
        Args:
            data: The data to format (can be a single row or full table structure)
            field_order: Optional field ordering for objects
            is_table: Whether this is a full table structure (applies ordering to row objects)
        """
        import json
        
        def format_recursive(obj, indent=0):
            indent_str = '  ' * indent
            next_indent_str = '  ' * (indent + 1)
            
            if obj is None:
                return 'null'
            elif isinstance(obj, bool):
                return str(obj).lower()
            elif isinstance(obj, (int, float)):
                return str(obj)
            elif isinstance(obj, str):
                return json.dumps(obj)
            elif isinstance(obj, list):
                if not obj:
                    return '[]'
                items = [next_indent_str + format_recursive(item, indent + 1) for item in obj]
                return '[\n' + ',\n'.join(items) + '\n' + indent_str + ']'
            elif isinstance(obj, dict):
                if not obj:
                    return '{}'
                
                # Apply field ordering logic
                should_order = False
                if field_order:
                    if is_table and indent == 2:  # Row objects in table structure
                        should_order = True
                    elif not is_table and indent == 0:  # Top-level object for single row
                        should_order = True
                
                if should_order:
                    ordered_keys = []
                    # First add keys in the specified order
                    for key in field_order:
                        if key in obj:
                            ordered_keys.append(key)
                    # Then add any remaining keys that weren't in the field order
                    for key in obj:
                        if key not in ordered_keys:
                            ordered_keys.append(key)
                    keys = ordered_keys
                else:
                    keys = list(obj.keys())
                    
                items = []
                for key in keys:
                    value = format_recursive(obj[key], indent + 1)
                    items.append(f'{next_indent_str}"{key}": {value}')
                return '{\n' + ',\n'.join(items) + '\n' + indent_str + '}'
            else:
                return json.dumps(obj)
        
        return format_recursive(data)
    
    def _compute_diff_data(self, original: str, revised: str, section_type: str) -> tuple:
        """Unified diff computation for both text and JSON content"""
        formatted_original = None
        formatted_new = None
        
        # For table sections, format JSON before computing diff
        if section_type in ['model_limitations', 'model_risk_issues']:
            try:
                import json
                original_parsed = json.loads(original)
                revised_parsed = json.loads(revised)
                
                field_order = self.FIELD_ORDER_MAPPING.get(section_type, None)
                formatted_original = self._format_json_with_order(original_parsed, field_order, is_table=True)
                formatted_new = self._format_json_with_order(revised_parsed, field_order, is_table=True)
                
                diff_segments = self.diff_service.compute_document_diff(formatted_original, formatted_new)
            except (json.JSONDecodeError, KeyError):
                # Fallback to regular diff if JSON parsing fails
                diff_segments = self.diff_service.compute_document_diff(original, revised)
        else:
            # Regular text diff for non-table sections
            diff_segments = self.diff_service.compute_document_diff(original, revised)
        
        diff_summary = self.diff_service.compute_diff_summary(diff_segments)
        return diff_segments, diff_summary, formatted_original, formatted_new