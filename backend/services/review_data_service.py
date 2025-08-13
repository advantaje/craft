"""
Review data service - shared helper for review information lookup
Used by both API endpoints and document generation
"""

def get_raw_review_data(review_id):
    """
    Get raw review data with internal field names
    Used by both review lookup API and document generation
    """
    import random
    
    # Enhanced review data variations with internal field names
    data_variations = [
        {
            "review_id": "REV-2024-001",
            "model_name": "GPT-4",
            "author": "Dr. Sarah Chen",
            "department": "AI Research Division",
            "created_date": "2024-01-15",
            "status": "In Progress",
            "priority": "High",
            "review_type": "Model Validation"
        }
    ]
    
    # Use review_id hash to consistently return same data for same ID
    variation_index = hash(review_id) % len(data_variations)
    return data_variations[variation_index]