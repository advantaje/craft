import tornado.ioloop
import tornado.web
from datetime import datetime
import json
import sys
import os
import io
from os import getenv

# Add the backend directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Environment configuration
HOST = getenv('HOST', '0.0.0.0')
PORT = int(getenv('PORT', 8888))

from services.generation_service import GenerationService
from services.document_generation_service import DocumentGenerationService
from services.review_data_service import get_raw_review_data

# In-memory storage for uploaded templates
uploaded_templates = {}


class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self):
        self.set_status(204)
        self.finish()


class HelloHandler(BaseHandler):
    def get(self):
        response = {
            "result": {
                "message": "Hello World from Tornado!",
                "timestamp": datetime.now().isoformat()
            }
        }
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(response))


class ReviewLookupHandler(BaseHandler):
    # Field mapping from internal names to display-friendly names for frontend
    DISPLAY_FIELD_MAPPING = {
        'review_id': 'Review ID',
        'model_name': 'Model Name', 
        'author': 'Author',
        'department': 'Department',
        'created_date': 'Creation Date',
        'status': 'Status',
        'priority': 'Priority',
        'review_type': 'Review Type'
    }
    
    def post(self):
        try:
            body = json.loads(self.request.body)
            review_id = body.get('id', '')
            
            if not review_id.strip():
                self.set_status(400)
                self.write(json.dumps({"error": "Review ID is required"}))
                return
            
            # Get review data using shared helper function
            review_data = self.get_review_data(review_id)
            
            response = {"result": review_data}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def get_review_data(self, review_id):
        """
        Get review data with display-friendly field names for frontend
        Uses the shared get_raw_review_data function and applies field mapping
        """
        # Get raw data with internal field names
        raw_data = get_raw_review_data(review_id)
        
        # Apply field mapping for display-friendly names
        mapped_data = {}
        for internal_field, value in raw_data.items():
            display_field = self.DISPLAY_FIELD_MAPPING.get(internal_field, internal_field)
            mapped_data[display_field] = value
        
        return mapped_data


class GenerateOutlineHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generation_service = GenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            notes = body.get('notes', '')
            section_name = body.get('sectionName', 'Section')
            section_type = body.get('sectionType', 'default')
            
            # Use generation service with section context
            outline = self.generation_service.generate_outline_from_notes(
                notes, section_name, section_type
            )
            
            response = {"result": outline}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateDraftFromOutlineHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generation_service = GenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            notes = body.get('notes', '')
            outline = body.get('outline', '')
            section_name = body.get('sectionName', 'Section')
            section_type = body.get('sectionType', 'default')
            
            # Use generation service with section context
            draft = self.generation_service.generate_draft_from_outline(
                notes, outline, section_name, section_type
            )
            
            response = {"result": draft}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateDraftFromReviewHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generation_service = GenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            draft = body.get('draft', '')
            review_notes = body.get('reviewNotes', '')
            section_name = body.get('sectionName', 'Section')
            section_type = body.get('sectionType', 'default')
            
            # Use generation service with section context
            updated_draft = self.generation_service.apply_review_notes(
                draft, review_notes, section_name, section_type
            )
            
            response = {"result": updated_draft}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateReviewHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generation_service = GenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            draft = body.get('draft', '')
            section_name = body.get('sectionName', 'Section')
            section_type = body.get('sectionType', 'default')
            
            # Use generation service with section context
            review = self.generation_service.generate_review_suggestions(
                draft, section_name, section_type
            )
            
            response = {"result": review}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateDocumentHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.document_service = DocumentGenerationService(uploaded_templates)

    def post(self):
        try:
            body = json.loads(self.request.body)
            document_id = body.get('documentId', '')
            document_data = body.get('documentData', {})
            sections = body.get('sections', [])
            template_info = body.get('templateInfo', {})
            
            if not document_id:
                self.set_status(400)
                self.write(json.dumps({"error": "Document ID is required"}))
                return
            
            if not sections:
                self.set_status(400)
                self.write(json.dumps({"error": "At least one completed section is required"}))
                return
            
            # Generate the document content
            doc_buffer = self.document_service.generate_docx_document(
                document_id, document_data, sections, template_info
            )
            
            if doc_buffer is None:
                self.set_status(500)
                self.write(json.dumps({"error": "Failed to generate document"}))
                return
            
            # Generate filename
            filename = self.document_service.get_filename(document_id, 'docx')
            
            # Get the document content as bytes
            doc_content = doc_buffer.getvalue()
            
            # Set headers for file download
            self.set_header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            self.set_header("Content-Disposition", f"attachment; filename={filename}")
            self.set_header("Content-Length", str(len(doc_content)))
            
            # Write the file content
            self.write(doc_content)
            
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))



class UploadTemplateHandler(BaseHandler):
    def post(self):
        try:
            if 'template' not in self.request.files:
                self.set_status(400)
                self.write(json.dumps({"error": "No template file provided"}))
                return
            
            file_info = self.request.files['template'][0]
            filename = file_info['filename']
            
            if not filename.lower().endswith('.docx'):
                self.set_status(400)
                self.write(json.dumps({"error": "File must be a .docx document"}))
                return
            
            # Store template content in memory
            template_content = file_info['body']
            template_key = f"custom_template_{datetime.now().timestamp()}"
            
            uploaded_templates[template_key] = {
                'filename': filename,
                'content': template_content,
                'uploaded_at': datetime.now().isoformat()
            }
            
            response = {
                "result": {
                    "message": "Template uploaded successfully",
                    "templateKey": template_key,
                    "filename": filename
                }
            }
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
            
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


def make_app():
    return tornado.web.Application([
        (r"/api/hello", HelloHandler),
        (r"/api/review-lookup", ReviewLookupHandler),
        (r"/api/generate-outline", GenerateOutlineHandler),
        (r"/api/generate-draft-from-outline", GenerateDraftFromOutlineHandler),
        (r"/api/generate-draft-from-review", GenerateDraftFromReviewHandler),
        (r"/api/generate-review", GenerateReviewHandler),
        (r"/api/generate-document", GenerateDocumentHandler),
        (r"/api/upload-template", UploadTemplateHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(PORT, HOST)
    print(f"Server running on http://{HOST}:{PORT}")
    tornado.ioloop.IOLoop.current().start()