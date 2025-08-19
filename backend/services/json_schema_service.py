"""
JSON Schema service for building structured output schemas from table configurations
"""

class JsonSchemaService:
    """Service for creating JSON schemas for structured outputs based on table configurations"""
    
    # Static table configurations mapping (mirrors frontend configurations)
    TABLE_CONFIGS = {
        'model_limitations': {
            'description': 'Model limitations table with title, description, and categorization',
            'columns': [
                {'id': 'title', 'type': 'text', 'required': True, 'description': 'Brief, clear title of the limitation'},
                {'id': 'description', 'type': 'text', 'description': 'Detailed explanation of the limitation and its implications'},
                {'id': 'category', 'type': 'select', 'options': ['Data Limitations', 'Technical Limitations', 'Scope Limitations'], 'description': 'Classification category for the limitation type'}
            ]
        },
        'model_risk_issues': {
            'description': 'Model risk issues table with title, description, category, and importance level',
            'columns': [
                {'id': 'title', 'type': 'text', 'required': True, 'description': 'Concise title identifying the specific risk issue'},
                {'id': 'description', 'type': 'text', 'description': 'Comprehensive description of the risk, its potential impact, and mitigation considerations'},
                {'id': 'category', 'type': 'select', 'options': ['Operational Risk', 'Market Risk', 'Credit Risk'], 'description': 'Primary risk category classification'},
                {'id': 'importance', 'type': 'select', 'options': ['Critical', 'High', 'Low'], 'description': 'Priority level indicating the severity and urgency of addressing this risk'}
            ]
        }
    }
    
    @classmethod
    def get_table_schema(cls, section_type: str) -> dict:
        """Get JSON schema for a specific table section type"""
        if section_type not in cls.TABLE_CONFIGS:
            raise ValueError(f"Unknown section type: {section_type}")
        
        config = cls.TABLE_CONFIGS[section_type]
        
        # Build schema for a single row
        row_properties = {}
        # For strict mode, ALL properties must be in required array
        required_fields = []
        
        for column in config['columns']:
            col_id = column['id']
            col_type = column['type']
            col_description = column.get('description', f'{col_id} field')
            
            if col_type == 'text':
                row_properties[col_id] = {
                    "type": "string",
                    "description": col_description
                }
            elif col_type == 'number':
                row_properties[col_id] = {
                    "type": "number",
                    "description": col_description
                }
            elif col_type == 'select':
                row_properties[col_id] = {
                    "type": "string",
                    "enum": column['options'],
                    "description": f"{col_description}. Valid options: {', '.join(column['options'])}"
                }
            else:
                # Default to string for unknown types
                row_properties[col_id] = {
                    "type": "string",
                    "description": col_description
                }
            
            # For strict mode, all fields must be required
            required_fields.append(col_id)
        
        # Build complete table schema
        schema = {
            "type": "object",
            "description": config.get('description', f'Table data for {section_type}'),
            "properties": {
                "rows": {
                    "type": "array",
                    "description": f"Array of rows containing {section_type} data. Each row represents one entry with all required fields filled.",
                    "items": {
                        "type": "object",
                        "description": f"Single row entry for {section_type} with all required fields",
                        "properties": row_properties,
                        "required": required_fields,
                        "additionalProperties": False
                    }
                }
            },
            "required": ["rows"],
            "additionalProperties": False
        }
        
        return schema
    
    @classmethod
    def get_structured_output_format(cls, section_type: str, schema_name: str = None) -> dict:
        """Get the response_format dict for OpenAI structured outputs"""
        schema = cls.get_table_schema(section_type)
        
        if schema_name is None:
            schema_name = f"{section_type}_table"
        
        return {
            "type": "json_schema",
            "json_schema": {
                "name": schema_name,
                "schema": schema,
                "strict": True
            }
        }
    
    @classmethod
    def is_table_section(cls, section_type: str) -> bool:
        """Check if a section type requires table JSON format"""
        return section_type in cls.TABLE_CONFIGS
    
    @classmethod
    def get_available_sections(cls) -> list:
        """Get list of all available table section types"""
        return list(cls.TABLE_CONFIGS.keys())