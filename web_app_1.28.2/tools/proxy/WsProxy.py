import signal
import sys
import ssl
import json
import threading
import random
from decimal import Decimal
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
import pickle
import base64
import string
import random
import re
from urllib import parse

# pip install colorama
from colorama import init as colorama_init
from colorama import Fore

DEFAULT_ENPOINT_FILE = "registered_endpoints.p"
registered_endpoints = {}
enabled_endpoints = []

CONNECTION_SCHEME = "ws://"
# CONNECTION_IP = "192.168.1.12:50001/igo-term/connect/8065666700/202427313091041116618351/1610728177?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjAwMSJ9.eyJjbGllbnQiOiI4MDY1NjY2NzAwIiwiaHNuIjoiMjAyNDI3MzEzMDkxMDQxMTE2NjE4MzUxIiwiaXNzIjoiaWdvLXRlcm1pbmFsLXNlcnZpY2UiLCJleHAiOjE2MTA3MjgxNzd9.2LIRqNjG7dJFg7c_ZXLqygENumKlR4rZd2N8xbegPD8"
CONNECTION_IP = "192.168.1.12:50001"

CONNECTION_URL = CONNECTION_SCHEME + CONNECTION_IP
CONNECTION_SSL_PROFILE = ""


def load_default_endpoints():
    global registered_endpoints
    try:
        registered_endpoints = pickle.load(open(DEFAULT_ENPOINT_FILE, "rb"))
        print("Loading default endpoints from the file", registered_endpoints)
    except:
        registered_endpoints = {"/Tsi/v1/payment": None, "/Tsi/v1/reports": None, "/Tsi/v1/info": None, "/Tsi/v1/config": None}
        print("Setting pre-defined default endpoints:", registered_endpoints)


class WsInitClient(WebSocket):

    def handleConnected(self):
        print('<<<>>> WsInitClient:    ', self.address, ':' + self.request.path + ' connected')

    def sendJsonMessage(self, message):
        messageStr = json.dumps(message, ensure_ascii=False)
        print("<<<>>> WsInitClient:     sending\n", Fore.GREEN + messageStr)
        self.sendMessage(messageStr)

    def receivedJsonMessage(self):
        msg = json.loads(self.data, parse_float=Decimal)
        if "request" in msg:
            flow_id = msg["request"]["flow_id"]
            resources = msg["request"]["resource"]

            if "endpoints" in resources:
                global registered_endpoints
                registered_endpoints.clear()
            elif "tsn" in resources:
                return
            else:
                print("                  Invalid init request")
                self.close()
                return

            if not enabled_endpoints:
                for ep in msg["request"]["resource"]["endpoints"]:
                    print("                  Registering ep: ", ep)
                    registered_endpoints[ep] = None
            else:
                for ep in enabled_endpoints:
                    print("                  Registering enabled ep: ", ep)
                    registered_endpoints[ep] = None	    

            pickle.dump(registered_endpoints, open(DEFAULT_ENPOINT_FILE, "wb"))

            global CONNECTION_URL
            global CONNECTION_SSL_PRFILE
            resource = {"status": "ok", "connection_url": CONNECTION_URL, "connection_ssl_profile": CONNECTION_SSL_PROFILE, "endpoints": enabled_endpoints}
            if options.custom_data != "":
                resource["custom_data"] = options.custom_data

            if options.send_authorization == 1:
                random_auth_str = base64.b64encode(
                    ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(64)).encode('ascii'))
                resource["authorization_header"] = {"Authorization": "Bearer " + str(random_auth_str, 'utf-8')}

            response = {"flow_id": flow_id, "resource": resource}
            msg = {"response": response}
            self.sendJsonMessage(msg)

    def handleMessage(self):
        try:
            if type(self.data) == str:
                print("<<<>>> WsInitClient:     RX:\n", Fore.GREEN + self.data)
            else:
                print("<<<>>> WsInitClient:     RX:", Fore.GREEN + " Binary data")
            self.receivedJsonMessage()
        except:
            print("<<<>>> WsInitClient:     Unexpected error:", Fore.RED + sys.exc_info()[0])
            raise

    def handleClose(self):
        print('<<<>>> WsInitClient:     close:', self.address)


def get_endpoint_name(path_long):
    for key in registered_endpoints.keys():
        if registered_endpoints[key] is not None:
            continue
            #if key == "/" and not path_long.endswith("/v1/"):
        if key == "/" and not re.match(r'.+/v1/.*$', path_long):
            return "/"
        elif key != "/" and path_long.endswith(key):
            return key


class WsEndpointClient(WebSocket):

    def handleConnected(self):
        path = parse.urlsplit(self.request.path).path
        print('<<<>>> WsEndpointClient:', self.address, ':' + self.request.path + ' connected')

        # if (path != "/") and (path not in registered_endpoints):
        if (path != "/") and (not path.endswith(tuple(registered_endpoints.keys()))):
            print('<<<>>> WsEndpointClient: Endpoint', path, ' is not registered')
            self.close()
        else:
            path_short = get_endpoint_name(path)
            print('<<<>>> WsEndpointClient: Adding endpoint client ', self.address, ':' + path, ' => ' + path_short)
            self.ws_client = None
            registered_endpoints[path_short] = self

            if self.request.headers["Authorization"] is not None:
                print(Fore.YELLOW + "Authorization: ", self.request.headers["Authorization"])

            connected_endpoints = []
            for ele in registered_endpoints:
                if registered_endpoints[ele] is not None:
                    connected_endpoints.append(ele)
            print("<<<>>> Connected endpoints %s" % connected_endpoints)

    def client(self):
        return self.ws_client

    def handleMessage(self):
        print(Fore.YELLOW + '<<<>>> WsEndpointClient: Receiving for ws_client', self.ws_client.address)
        if self.ws_client is not None:
            if type(self.data) == str:
                print(Fore.YELLOW + '<<<>>> WsEndpointClient: Sending   to  ws_client', self.ws_client.address, ":\n", Fore.YELLOW + self.data.strip())
            else:
                print(Fore.YELLOW + '<<<>>> WsEndpointClient: Sending   to  ws_client', self.ws_client.address, Fore.YELLOW + ": Binary data")
            self.ws_client.sendMessage(self.data)
        else:
            print('<<<>>> WsEndpointClient: Invalid ws_client')

    def handleClose(self):
        print('<<<>>> WsEndpointClient: close:', self.address)
        self.ws_client = None
        if self.request.path in registered_endpoints:
            registered_endpoints[self.request.path] = None


class WsClient(WebSocket):

    def handleMessage(self):
        path = self.request.path.lower()
        ep_client = registered_endpoints[path]
        print(Fore.GREEN + "<<<>>> WsClient:         Receiving for",  ep_client.address, path, "endpoint")
        if ep_client is not None:
            if type(self.data) == str:
                print(Fore.GREEN + "<<<>>> WsClient:         Sending   to ", ep_client.address, path, "endpoint:\n", Fore.GREEN + self.data)
            else:
                print(Fore.GREEN + "<<<>>> WsClient:         Sending   to ", ep_client.address, path, "endpoint: ", Fore.GREEN + 'Binary data')
            ep_client.sendMessage(self.data)
        else:
            print(Fore.RED + "<<<>>> WsClient:         Endpoint client isn't found")
            self.close()

    def handleConnected(self):
        path = self.request.path.lower()
        if path not in registered_endpoints:
            print('<<<>>> WsClient:         Endpoint', path, ' is not registered')
            self.close()
        else:
            if registered_endpoints[path] is None:
                print('<<<>>> WsClient:         Endpoint', path, ' has no endpoint client')
                self.close()
            else:
                print('<<<>>> WsClient:        ', self.address, ':' + path + ' connected')
                registered_endpoints[path].ws_client = self

    def handleClose(self):
        path = self.request.path.lower()
        print('<<<>>> WsClient:         close:', self.address)
        if path in registered_endpoints:
            registered_endpoints[path].ws_client = None


if __name__ == "__main__":

    assert sys.version_info >= (3, 0)
    colorama_init(autoreset=True)

    print("Starting proxy")
    load_default_endpoints()

    parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
    parser.add_option("--host", default='', type='string', action="store", dest="host", help="hostname (localhost)")
    parser.add_option("--port", default=50000, type='int', action="store", dest="port", help="port (50000)")
    parser.add_option("--ep_port", default=50001, type='int', action="store", dest="ep_port", help="endpoint flow port (50001)")
    parser.add_option("--init_port", default=50002, type='int', action="store", dest="init_port", help="init flow port (50002)")
    parser.add_option("--example", default='echo', type='string', action="store", dest="example", help="echo, chat")
    parser.add_option("--ssl", default=0, type='int', action="store", dest="ssl", help="ssl (1: on, 0: off (default))")
    parser.add_option("--cert", default='./server.pem', type='string', action="store", dest="cert", help="cert (./server.pem)")
    parser.add_option("--key", default='./server.key', type='string', action="store", dest="key", help="key (./server.key)")
    parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1_2, type=int, action="store", dest="ver", help="ssl version")
    parser.add_option("--pongdisabled", default=0, type='int', action="store", dest="pongdisabled", help="Disbale PONG sending")
    parser.add_option("--enabled_endpoints", default='', type='string', action="store", dest="enabled_endpoints", help="List endpoints separated by comma")
    parser.add_option("--custom_data", default='', type='string', action="store", dest="custom_data", help="Custom data sent in registration response")
    parser.add_option("--disconnect_timeout", default='', type='string', action="store", dest="disconnect_timeout", help="If value set random endpoint will be disconnected each value seconds")
    parser.add_option("--send_authorization", default=0, type='int', action="store", dest="send_authorization", help="If set to 1 than register response have authorization header")
    parser.add_option("--http_401_probability", default=0, type='int', action="store", dest="http_401_probability", help="0 - 100, probability of HTTP 401 response when endpoint connecting")

    (options, args) = parser.parse_args()

    if options.enabled_endpoints:
        enabled_endpoints = options.enabled_endpoints.split(',')
    print('Enabled endpoints ', enabled_endpoints)

    if options.ssl == 1:
        CONNECTION_SCHEME = "wss://"
        CONNECTION_URL = CONNECTION_SCHEME + CONNECTION_IP
        CONNECTION_SSL_PROFILE = "iWSProfile"
        print("SSL mode. URL ", CONNECTION_URL, " profile ", CONNECTION_SSL_PROFILE)
        #server_init = SimpleSSLWebSocketServer(options.host, options.init_port, WsInitClient, options.cert, options.key, options.ver)
        #server_endpoint = SimpleSSLWebSocketServer(options.host, options.ep_port, WsEndpointClient, options.cert, options.key, options.ver)
    else:
        print("non-SSL mode. URL ", CONNECTION_URL)

    if options.http_401_probability > 0:
        WebSocket.http_401_probability = options.http_401_probability

    server_init = SimpleWebSocketServer(options.host, options.init_port, WsInitClient, options.pongdisabled)
    server_endpoint = SimpleWebSocketServer(options.host, options.ep_port, WsEndpointClient, options.pongdisabled)

    server = SimpleWebSocketServer(options.host, options.port, WsClient, options.pongdisabled)

    def close_sig_handler(signal, frame):
        server.close()
        server_endpoint.close()
        server_init.close()
        sys.exit()

    signal.signal(signal.SIGINT, close_sig_handler)

    def disconnect_endpoint():
        if len(registered_endpoints.keys()) > 0:
            #d_endpoint = random.choice(list(registered_endpoints.keys()))

            for desc, conn in server_endpoint.connections.items():
                print("<<<>>> Disconnect connection", conn.address)
                conn.close()
                break

            disconnect_timer = threading.Timer(int(options.disconnect_timeout), disconnect_endpoint)
            disconnect_timer.start()
        else:
            print("<<<>>> No endpoints to disconnect")


    if options.disconnect_timeout != '':
        disconnect_timer = threading.Timer(int(options.disconnect_timeout), disconnect_endpoint)
        disconnect_timer.start()

    while True:
        server_init.serveonce()
        server_endpoint.serveonce()
        server.serveonce()
