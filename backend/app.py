import tornado.ioloop
import tornado.web
from datetime import datetime
import json
import sys
import os

# Add the backend directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.generation_service import GenerationService
from services.document_generation_service import DocumentGenerationService


class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self):
        self.set_status(204)
        self.finish()


class HelloHandler(BaseHandler):
    def get(self):
        response = {
            "message": "Hello World from Tornado!",
            "timestamp": datetime.now().isoformat()
        }
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(response))


class DocumentLookupHandler(BaseHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            document_id = body.get('id', '')
            
            if not document_id.strip():
                self.set_status(400)
                self.write(json.dumps({"error": "Document ID is required"}))
                return
            
            # Simulate database lookup with arbitrary data
            document_data = self.get_document_data(document_id)
            
            response = {"data": document_data}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def get_document_data(self, document_id):
        # Simulate database lookup - replace with actual database query
        import random
        
        # Generate different data based on ID for variety
        data_variations = [
            {
                "Document Owner": "Sarah Johnson",
                "Document Lead": "Michael Chen",
                "Project Name": "Q4 Strategy Review",
                "Department": "Strategy & Planning",
                "Created Date": "2024-01-15",
                "Last Modified": "2024-02-03",
                "Status": "In Progress",
                "Priority": "High",
                "Reviewers": "Alice Smith, Bob Wilson",
                "Document Type": "Strategic Plan"
            },
            {
                "Document Owner": "Robert Davis",
                "Document Lead": "Emma Thompson",
                "Project Name": "Product Roadmap 2024",
                "Department": "Product Management",
                "Created Date": "2024-01-08",
                "Last Modified": "2024-01-28",
                "Status": "Under Review",
                "Priority": "Medium",
                "Reviewers": "David Kim, Lisa Brown",
                "Document Type": "Roadmap",
                "Target Audience": "Executive Team",
                "Deadline": "2024-03-15"
            },
            {
                "Document Owner": "Jennifer Lee",
                "Document Lead": "Alex Rodriguez",
                "Project Name": "Market Analysis Report",
                "Department": "Business Intelligence",
                "Created Date": "2024-01-22",
                "Last Modified": "2024-02-01",
                "Status": "Draft",
                "Priority": "Low",
                "Reviewers": "Mark Johnson",
                "Document Type": "Analysis Report",
                "Data Sources": "Internal Analytics, Market Research",
                "Confidentiality": "Internal Only",
                "Version": "2.1"
            }
        ]
        
        # Use document_id to determine which variation to return
        variation_index = hash(document_id) % len(data_variations)
        return data_variations[variation_index]


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
            
            response = {"outline": outline}
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
            
            response = {"draft": draft}
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
            
            response = {"draft": updated_draft}
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
            
            response = {"review": review}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateDocumentHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.document_service = DocumentGenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            document_id = body.get('documentId', '')
            document_data = body.get('documentData', {})
            sections = body.get('sections', [])
            
            if not document_id:
                self.set_status(400)
                self.write(json.dumps({"error": "Document ID is required"}))
                return
            
            if not sections:
                self.set_status(400)
                self.write(json.dumps({"error": "At least one completed section is required"}))
                return
            
            # Generate the document content
            content = self.document_service.generate_txt_document(
                document_id, document_data, sections
            )
            
            # Generate filename
            filename = self.document_service.get_filename(document_id)
            
            # Set headers for file download
            self.set_header("Content-Type", "text/plain; charset=utf-8")
            self.set_header("Content-Disposition", f"attachment; filename={filename}")
            self.set_header("Content-Length", str(len(content.encode('utf-8'))))
            
            # Write the file content
            self.write(content.encode('utf-8'))
            
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


class GenerateDocumentStreamHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.document_service = DocumentGenerationService()

    def post(self):
        try:
            body = json.loads(self.request.body)
            document_id = body.get('documentId', '')
            document_data = body.get('documentData', {})
            sections = body.get('sections', [])
            
            if not document_id:
                self.set_status(400)
                self.write(json.dumps({"error": "Document ID is required"}))
                return
            
            if not sections:
                self.set_status(400)
                self.write(json.dumps({"error": "At least one completed section is required"}))
                return
            
            # Set up SSE headers
            self.set_header("Content-Type", "text/event-stream")
            self.set_header("Cache-Control", "no-cache")
            self.set_header("Connection", "keep-alive")
            self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")
            self.set_header("Access-Control-Allow-Headers", "Content-Type")
            
            # Progress callback function
            def send_progress(status: str, message: str, progress: int = 0):
                event_data = {
                    "status": status,
                    "message": message,
                    "progress": progress
                }
                self.write(f"data: {json.dumps(event_data)}\n\n")
                self.flush()
            
            # Generate the document with progress updates
            try:
                content = self.document_service.generate_txt_document_with_progress(
                    document_id, document_data, sections, send_progress
                )
                
                if content is None:
                    send_progress("error", "Failed to generate document", 0)
                    return
                
                # Create the download blob
                filename = self.document_service.get_filename(document_id)
                
                # Send final completion event with download data
                completion_data = {
                    "status": "ready",
                    "message": "Document ready for download!",
                    "progress": 100,
                    "downloadData": {
                        "content": content,
                        "filename": filename,
                        "contentType": "text/plain; charset=utf-8"
                    }
                }
                self.write(f"data: {json.dumps(completion_data)}\n\n")
                self.flush()
                
            except Exception as e:
                send_progress("error", f"Generation failed: {str(e)}", 0)
            
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))


def make_app():
    return tornado.web.Application([
        (r"/api/hello", HelloHandler),
        (r"/api/document-lookup", DocumentLookupHandler),
        (r"/api/generate-outline", GenerateOutlineHandler),
        (r"/api/generate-draft-from-outline", GenerateDraftFromOutlineHandler),
        (r"/api/generate-draft-from-review", GenerateDraftFromReviewHandler),
        (r"/api/generate-review", GenerateReviewHandler),
        (r"/api/generate-document", GenerateDocumentHandler),
        (r"/api/generate-document-stream", GenerateDocumentStreamHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running on http://localhost:8888")
    print("Server now supports section-specific prompts!")
    tornado.ioloop.IOLoop.current().start()