import http.server
import socketserver
import webbrowser
from optparse import OptionParser
import _thread
import time
import signal

parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
parser.add_option("--port", default=12321, type='int', action="store", dest="port", help="port (12321)")
(options, args) = parser.parse_args()

run = True

def create_server():
    Handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", options.port), Handler)
    print("serving at port", options.port)
    httpd.serve_forever()
	
def handler_stop_signals(signum, frame):
    global run
    run = False
	
try:	
    _thread.start_new_thread(create_server,())
except:
    print("error happened when launching local webserver")
    raise
else:	
    time.sleep(3)
    url = 'http://localhost:{}/'
    webbrowser.open(url.format(options.port), new=1)

signal.signal(signal.SIGINT, handler_stop_signals)
signal.signal(signal.SIGTERM, handler_stop_signals)

while run:
    pass

_thread.exit()	


