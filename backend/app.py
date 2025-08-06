import tornado.ioloop
import tornado.web
from datetime import datetime
import json


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


class GenerateOutlineHandler(BaseHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            notes = body.get('notes', '')
            
            # Simple wrapper function for outline generation
            outline = self.generate_outline_from_notes(notes)
            
            response = {"outline": outline}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def generate_outline_from_notes(self, notes):
        # Simple processing function - can be replaced with LLM call
        if not notes.strip():
            return "Please provide notes to generate an outline."
        
        lines = [line.strip() for line in notes.split('\n') if line.strip()]
        outline_points = []
        
        for i, line in enumerate(lines[:5]):  # Take first 5 non-empty lines
            outline_points.append(f"{i+1}. {line.capitalize()}")
        
        if not outline_points:
            outline_points = ["1. Main point from your notes", "2. Supporting details", "3. Conclusion"]
        
        return "\n".join(outline_points) + "\n\n[Generated from your notes - edit as needed]"


class GenerateDraftFromOutlineHandler(BaseHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            notes = body.get('notes', '')
            outline = body.get('outline', '')
            
            # Simple wrapper function for draft generation from outline
            draft = self.generate_draft_from_outline(notes, outline)
            
            response = {"draft": draft}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def generate_draft_from_outline(self, notes, outline):
        # Simple processing function - can be replaced with LLM call
        if not outline.strip():
            return "Please provide an outline to generate a draft."
        
        outline_lines = [line.strip() for line in outline.split('\n') if line.strip() and not line.startswith('[')]
        draft_paragraphs = []
        
        for line in outline_lines:
            if line and not line.startswith('['):
                # Remove numbering and expand into a paragraph
                clean_line = line.lstrip('0123456789. ').strip()
                if clean_line:
                    paragraph = f"{clean_line}. This section would elaborate on the key points and provide detailed information to support this topic. Additional context and examples would be included here to create a comprehensive discussion of this aspect."
                    draft_paragraphs.append(paragraph)
        
        if not draft_paragraphs:
            draft_paragraphs = ["This section provides an overview of the main topic. Key points and supporting details would be elaborated here with comprehensive coverage of the subject matter."]
        
        return "\n\n".join(draft_paragraphs) + "\n\n[Generated draft from outline - review and refine as needed]"


class GenerateDraftFromReviewHandler(BaseHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            draft = body.get('draft', '')
            review_notes = body.get('reviewNotes', '')
            
            # Generate updated draft from review notes
            updated_draft = self.apply_review_notes(draft, review_notes)
            
            response = {"draft": updated_draft}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def apply_review_notes(self, draft, review_notes):
        # Simple processing function - can be replaced with LLM call
        if not draft.strip():
            return "Please provide a draft to revise."
        if not review_notes.strip():
            return "Please provide review notes to apply."
        
        # Simple revision - append review-based improvements
        revised_draft = draft.replace("[Generated draft - review and refine as needed]", "")
        revised_draft = revised_draft.replace("[Generated draft from outline - review and refine as needed]", "")
        revised_draft += f"\n\n[REVISED based on feedback: {review_notes[:100]}{'...' if len(review_notes) > 100 else ''}]"
        
        return revised_draft


class GenerateReviewHandler(BaseHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            draft = body.get('draft', '')
            
            # Generate review suggestions from draft
            review = self.generate_review_suggestions(draft)
            
            response = {"review": review}
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(response))
        except Exception as e:
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
    
    def generate_review_suggestions(self, draft):
        # Simple processing function - can be replaced with LLM call
        if not draft.strip():
            return "Please provide a draft to review."
        
        suggestions = [
            "Consider adding more specific examples to support your points.",
            "The flow between paragraphs could be improved with better transitions.",
            "Some sections might benefit from more detailed explanations.",
            "Check for clarity and conciseness in your writing.",
            "Ensure all key points are adequately supported with evidence."
        ]
        
        return "Review Suggestions:\n\n" + "\n".join([f"• {suggestion}" for suggestion in suggestions]) + "\n\n[AI-generated review suggestions - use as guidance for improvements]"


def make_app():
    return tornado.web.Application([
        (r"/api/hello", HelloHandler),
        (r"/api/generate-outline", GenerateOutlineHandler),
        (r"/api/generate-draft-from-outline", GenerateDraftFromOutlineHandler),
        (r"/api/generate-draft-from-review", GenerateDraftFromReviewHandler),
        (r"/api/generate-review", GenerateReviewHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()