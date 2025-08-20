"""
Document generation service with section-aware processing
"""

import json
from services.openai_tools import create_azure_openai_client
from prompts.section_prompts import SectionPrompts
from services.diff_service import DocumentDiffService
from services.json_schema_service import JsonSchemaService


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
    
    def __init__(self, model_id: str = None):
        self.prompts = SectionPrompts()
        self.client = create_azure_openai_client()
        # Use provided model ID or fallback to default
        self.model = model_id or 'gpt-4.1-2025-04-14'
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
            is_table_section = JsonSchemaService.is_table_section(section_type)
            requires_json = is_table_section and operation in ['draft', 'revision']
            
            if requires_json:
                system_prompt = self.SYSTEM_PROMPTS['json']
                response_format = JsonSchemaService.get_structured_output_format(section_type)
            elif operation == 'review':
                system_prompt = self.SYSTEM_PROMPTS['review']
                response_format = None
            elif operation == 'revision':
                system_prompt = self.SYSTEM_PROMPTS['revision']
                response_format = None
            else:
                system_prompt = self.SYSTEM_PROMPTS['text']
                response_format = None
            
            # For override prompts, determine the type of operation
            if prompt_override:
                # Check if this is a text selection operation
                if "SELECTION START" in prompt_override and "SELECTION END" in prompt_override:
                    system_prompt = "You are a precise text editor. You must return ONLY the improved version of the selected text, without adding ANY text before or after it. The returned text must be a direct replacement for the selection - no more, no less."
                else:
                    # Table data or other operations
                    system_prompt = "You are an expert at improving table data based on feedback. Return data in the same format as provided."
            
            # Set temperature based on model
            temperature = 1.0 if self.model == 'o4-mini-2025-04-16' else 0.0
            
            # Make API call with direct parameters
            if response_format:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=temperature,
                    response_format=response_format
                )
            else:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=temperature
                )
                
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
    
    def review_table_row_with_diff(self, row_data: dict, review_notes: str, columns: list, section_name: str, section_type: str = None, guidelines: str = None, full_table_data: dict = None) -> dict:
        """Review a single table row and return updated row with diff data"""
        if not row_data:
            return {"error": "Please provide row data to review."}
        if not review_notes.strip():
            return {"error": "Please provide review notes to apply."}
        
        try:
            # Format both full table and specific row for LLM context
            full_context = ""
            if full_table_data and full_table_data.get('rows'):
                full_context = f"""
Full table for context:
{json.dumps(full_table_data, indent=2)}

"""
            
            row_json = json.dumps({"rows": [row_data]}, indent=2)
            
            # Create a focused prompt for row review using JSON format
            prompt = f"""
{full_context}Specific row to review and improve (Row #{len([r for r in (full_table_data.get('rows', []) if full_table_data else [])]) if full_table_data else 1}):
{row_json}

Feedback to apply:
{review_notes}

IMPORTANT: Return the improved table data in the EXACT same JSON format. You may return one or more rows based on the feedback - if the feedback suggests splitting, expanding, or adding related entries, feel free to return multiple rows. If it's just improvements to the existing row, return one row. Maintain consistency with the full table context shown above."""
            
            # Add guidelines if provided
            if guidelines and guidelines.strip():
                prompt += f"\n\nGuidelines for reviewing:\n{guidelines.strip()}"
            
            # Generate improved row using JSON format
            # We need to ensure JSON response format for table data
            
            # Make direct API call with structured output format
            system_prompt = "You are an expert at improving table data based on feedback. Always return valid JSON in the exact format requested."
            
            # Set temperature based on model
            temperature = 1.0 if self.model == 'o4-mini-2025-04-16' else 0.0
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                response_format=JsonSchemaService.get_structured_output_format(section_type, "row_update")
            )
            
            improved_json_text = response.choices[0].message.content.strip()
            
            if improved_json_text.startswith("Error"):
                return {"error": improved_json_text}
            
            # Parse JSON response and extract all rows
            # Structured outputs guarantee valid JSON, so no need for fallbacks
            improved_table = json.loads(improved_json_text)
            improved_rows = improved_table['rows']
            
            # Compute diff between original single row and new rows using formatted JSON
            # Always format both as table structure for consistent diff display
            field_order = self.FIELD_ORDER_MAPPING.get(section_type, None) if section_type else None
            original_json = self._format_json_with_order({"rows": [row_data]}, field_order, is_table=True)
            new_formatted = self._format_json_with_order({"rows": improved_rows}, field_order, is_table=True)
            
            diff_segments = self.diff_service.compute_document_diff(original_json, new_formatted)
            diff_summary = self.diff_service.compute_diff_summary(diff_segments)
            
            return {
                "new_rows": improved_rows,  # Return all rows as array
                "original_formatted": original_json,
                "new_formatted": new_formatted,
                "diff_segments": diff_segments,
                "diff_summary": diff_summary
            }
            
        except Exception as e:
            print(f"Error reviewing table row: {e}")
            return {"error": f"Error reviewing table row: {str(e)}. Please check your API configuration."}
    
    def review_table_with_diff(self, table_data: str, review_notes: str, section_name: str, section_type: str = None, guidelines: str = None) -> dict:
        """Review entire table and return updated table with diff data"""
        if not table_data:
            return {"error": "Please provide table data to review."}
        if not review_notes.strip():
            return {"error": "Please provide review notes to apply."}
        
        try:
            # Parse table data to ensure it's valid JSON
            import json
            try:
                parsed_table = json.loads(table_data)
                if 'rows' not in parsed_table or not isinstance(parsed_table['rows'], list):
                    return {"error": "Invalid table format. Expected JSON with 'rows' array."}
            except json.JSONDecodeError:
                return {"error": "Invalid JSON format for table data."}
            
            # Format table for LLM prompt
            table_json = json.dumps(parsed_table, indent=2)
            
            # Create focused prompt for table review
            prompt = f"""
Review and improve this entire table based on the feedback provided.

Current table data:
{table_json}

Feedback to apply to ALL rows:
{review_notes}

IMPORTANT: Return the improved table data in the EXACT same JSON format with all rows updated based on the feedback. Apply the feedback consistently across all rows where applicable."""
            
            # Add guidelines if provided
            if guidelines and guidelines.strip():
                prompt += f"\n\nGuidelines for reviewing:\n{guidelines.strip()}"
            
            # Make API call with structured output format
            system_prompt = "You are an expert at improving table data based on feedback. Always return valid JSON in the exact format requested."
            
            # Set temperature based on model
            temperature = 1.0 if self.model == 'o4-mini-2025-04-16' else 0.0
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                response_format=JsonSchemaService.get_structured_output_format(section_type, "table_update")
            )
            
            improved_json_text = response.choices[0].message.content.strip()
            
            if improved_json_text.startswith("Error"):
                return {"error": improved_json_text}
            
            # Parse JSON response - structured outputs guarantee valid JSON
            improved_table = json.loads(improved_json_text)
            
            # Format both JSON strings for proper diff computation
            formatted_original = json.dumps(json.loads(table_data), indent=2)
            formatted_improved = json.dumps(improved_table, indent=2)
            
            # Compute diff between formatted JSON strings
            diff_segments = self.diff_service.compute_document_diff(formatted_original, formatted_improved)
            diff_summary = self.diff_service.compute_diff_summary(diff_segments)
            
            return {
                "new_draft": formatted_improved,
                "diff_segments": diff_segments,
                "diff_summary": diff_summary
            }
            
        except Exception as e:
            print(f"Error reviewing table: {e}")
            return {"error": f"Error reviewing table: {str(e)}. Please check your API configuration."}
    
    
    
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
        if JsonSchemaService.is_table_section(section_type):
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
    
    def review_text_selection(self, selected_text: str, section_name: str, section_type: str = None, guidelines: str = None, full_draft: str = None) -> str:
        """Generate review for a selected text fragment"""
        if not selected_text.strip():
            return "Error: Please provide text to review."
            
        try:
            # Create prompt with full document context for better understanding
            prompt = ""
            
            if full_draft and full_draft.strip():
                prompt = f"""
Full document for context:
{full_draft}

"""
            
            prompt += f"""Text selection to review:

>>> SELECTION START <<<
{selected_text}
>>> SELECTION END <<<

Please provide specific, actionable feedback for improving ONLY the selected text shown between the markers above. Focus on:
- Clarity and readability
- Accuracy and completeness
- Style and tone consistency with the full document
- Any factual or logical issues

Provide your feedback in a clear, structured format."""
            
            # Add guidelines if provided
            if guidelines and guidelines.strip():
                prompt += f"\n\nGuidelines for reviewing:\n{guidelines.strip()}"
            
            # Generate review using unified error handling
            review = self._generate_content('review', section_type or 'default', section_name, None, prompt_override=prompt)
            
            return review
            
        except Exception as e:
            print(f"Error reviewing text selection: {e}")
            return f"Error reviewing text selection: {str(e)}. Please check your API configuration."
    
    def apply_review_to_selection_with_diff(self, full_draft: str, selected_text: str, selection_start: int, selection_end: int, review_notes: str, section_name: str, section_type: str = None, guidelines: str = None) -> dict:
        """Apply review to a text selection and return updated draft with diff data"""
        if not full_draft.strip():
            return {"error": "Please provide a draft to work with."}
        if not selected_text.strip():
            return {"error": "Please provide selected text to improve."}
        if not review_notes.strip():
            return {"error": "Please provide review notes to apply."}
        
        try:
            # Create a focused prompt for improving the selection with full document context
            selected_char_count = len(selected_text)
            prompt = f"""
Full document for context:
{full_draft}

TEXT SELECTION TO IMPROVE (Original: {selected_char_count} characters):

>>> SELECTION START <<<
{selected_text}
>>> SELECTION END <<<

FEEDBACK TO APPLY:
{review_notes}

CRITICAL INSTRUCTIONS:
- Return EXACTLY the replacement text for the selection between the markers
- Your response must be a direct replacement for ONLY the selected text
- Do NOT add any text that was not originally selected
- Do NOT include text before or after the selection boundaries
- Do NOT include explanations, context, or additional sentences
- Focus solely on improving the selected text within its boundaries"""
            
            # Add guidelines if provided
            if guidelines and guidelines.strip():
                prompt += f"\n\nGuidelines for improvement:\n{guidelines.strip()}"
            
            # Generate improved selection using unified error handling
            improved_selection = self._generate_content('revision', section_type or 'default', section_name, None, prompt_override=prompt)
            
            if improved_selection.startswith("Error"):
                return {"error": improved_selection}
            
            # Replace the selection in the full draft
            new_draft = full_draft[:selection_start] + improved_selection + full_draft[selection_end:]
            
            # Compute diff between original and new draft
            diff_segments = self.diff_service.compute_document_diff(full_draft, new_draft)
            diff_summary = self.diff_service.compute_diff_summary(diff_segments)
            
            return {
                "new_draft": new_draft,
                "original_selection": selected_text,
                "new_selection": improved_selection,
                "diff_segments": diff_segments,
                "diff_summary": diff_summary
            }
            
        except Exception as e:
            print(f"Error applying review to selection: {e}")
            return {"error": f"Error applying review to selection: {str(e)}. Please check your API configuration."}