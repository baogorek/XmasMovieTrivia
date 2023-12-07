from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = 3000

httpd = HTTPServer(('', PORT), SimpleHTTPRequestHandler)
print(f"Serving at http://localhost:{PORT}")
httpd.serve_forever()
