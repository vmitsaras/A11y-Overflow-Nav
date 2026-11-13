from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse,parse_qs
import json
root=Path('/Users/vasilis/Documents/GitHub/A11y-Overflow-Nav')
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(root),**k)
 def do_GET(self):
  url=urlparse(self.path)
  if url.path=='/__trace.js':
   b=Path('/private/tmp/ovn-rh03-trace.js').read_bytes()
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(b);return
  full=Path(self.translate_path(url.path))
  if full.is_file() and full.suffix=='.html':
   s=full.read_text();css=''
   if parse_qs(url.query).get('variant')==['bounded']:
    css='<style>[data-overflow-nav-menu]>div{max-block-size:min(60vh,var(--_panel-max-height,60vh))}[data-overflow-nav-menu][data-placement^="top"]>div{inset-block-start:auto;inset-block-end:calc(100% + .25rem)}</style>'
   s=s.replace('</head>',css+'</head>').replace('</body>','<script type="module" src="/__trace.js"></script></body>')
   self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(s.encode());return
  super().do_GET()
 def do_POST(self):
  if self.path!='/__trace':self.send_error(404);return
  b=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
  with (root/'output/playwright/rh03-classification-2026-10-27/events.jsonl').open('a') as f:f.write(json.dumps(b)+'\n')
  self.send_response(204);self.end_headers()
ThreadingHTTPServer(('127.0.0.1',8878),Handler).serve_forever()
