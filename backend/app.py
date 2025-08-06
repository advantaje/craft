import tornado.ioloop
import tornado.web
from datetime import datetime
import json


class HelloHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self):
        self.set_status(204)
        self.finish()

    def get(self):
        response = {
            "message": "Hello World from Tornado!",
            "timestamp": datetime.now().isoformat()
        }
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(response))


def make_app():
    return tornado.web.Application([
        (r"/api/hello", HelloHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()