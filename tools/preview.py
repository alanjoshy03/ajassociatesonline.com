"""Local preview of the site, behaving like the live one (clean addresses such as /services/taxation).

Run:  python tools/preview.py      (or double-click tools/PREVIEW.bat)
Then open http://localhost:8123 . Press Ctrl+C in the window to stop.
Opening index.html straight from the folder no longer works, because the pages now use root-absolute links.
"""
import http.server, os, sys, webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
PORT = 8123
rules = []
for ln in open('_redirects', encoding='utf-8'):
    p = ln.split('#')[0].split()
    if len(p) >= 3 and '*' not in p[0] and not p[0].startswith('http'):
        rules.append((p[0], p[1], p[2]))


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        q = self.path[len(path):]
        for src, dst, code in rules:
            if path == src:
                if code.startswith('301'):
                    self.send_response(301)
                    self.send_header('Location', dst + q)
                    self.end_headers()
                    return
                if code == '200':
                    self.path = dst + q
                    break
        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404 and os.path.exists('404.html'):      # like the live site: the custom 404 page, same address
            body = open('404.html', 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, *a):
        pass


print(f'AJ Associates preview running at http://localhost:{PORT}  (Ctrl+C to stop)')
webbrowser.open(f'http://localhost:{PORT}')
try:
    http.server.ThreadingHTTPServer(('', PORT), Handler).serve_forever()
except KeyboardInterrupt:
    sys.exit(0)
