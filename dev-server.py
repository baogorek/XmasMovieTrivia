from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        """Translate URL paths to filesystem paths."""
        # Route /XmasMovieTrivia to the current directory
        if path.startswith('/XmasMovieTrivia'):
            path = path[len('/XmasMovieTrivia'):]  # Remove the /XmasMovieTrivia part
            if not path or path == '/':
                path = '/index.html'  # Default to index.html
        return os.path.join(os.getcwd(), path.lstrip('/'))

PORT = 3000

httpd = HTTPServer(('', PORT), CustomHandler)
print(f"Serving at http://localhost:{PORT}/XmasMovieTrivia")
httpd.serve_forever()
