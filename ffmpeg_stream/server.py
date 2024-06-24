from http.server import SimpleHTTPRequestHandler, HTTPServer
from json import dumps
import os
from os.path import dirname, abspath
root = abspath(dirname(__file__))
print(root)
class RequestHandler(SimpleHTTPRequestHandler):
    def _send_cors_headers(self):
        """ Sets headers required for CORS """
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "x-api-key,Content-Type")

    def send_dict_response(self, d):
        """ Sends a dictionary (JSON) back to the client """
        self.wfile.write(bytes(dumps(d), "utf8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()
        SimpleHTTPRequestHandler.do_GET(self)
        print(os.path.normpath(root + self.path))
        f = open(os.path.normpath(root + self.path), "rb")
        self.wfile.write(f.read())
        f.close()
        response = {}
        response["status"] = "OK"
        # response["mimetype"] = "video/mp4"
        # response["path"] = "/input/flopa.mp4"
        self.send_dict_response(response)
    # def do_GET(self):
    #     if self.path == '/up':
    #         self.send_response(200)
    #         self.end_headers()
    #         self.wfile.write(b'up')
    #     else:
    #         self.send_response(200)
    #         self._send_cors_headers()

    # def do_GET(self):
    #     self.send_response(200)
    #     self.send_header('Content-type', 'video/mp4')
    #     self.end_headers()
    #     self.wfile.write(open(os.path.join(os.path.dirname(__file__), self.path), "rb") as wfile)

    def do_POST(self):
        self.send_response(200)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        dataLength = int(self.headers["Content-Length"])
        data = self.rfile.read(dataLength)

        print(data)

        response = {}
        response["status"] = "OK"
        self.send_dict_response(response)



print("Starting server")
web_dir = os.path.join(os.path.dirname(__file__), '/')
httpd = HTTPServer(("127.0.0.1", 8000), RequestHandler)
print("Hosting server on port 8000")
httpd.serve_forever()