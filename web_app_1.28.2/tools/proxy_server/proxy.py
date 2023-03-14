import logging
from websocket_server_jwt import WebsocketServerJwt
import websocket
from threading import Thread
import yaml

wss = {}

OPCODE_TEXT = 0x01
OPCODE_BINARY = 0x02

with open('config.yml') as f:
    config = yaml.load(f, Loader=yaml.FullLoader)

def client_recv(ws, client):
    try:
        while True:
            if ws.connected:
                response = ws.recv()
                print("Receive %s" % response)
                server.send_message(client, response)
    except (Exception, KeyboardInterrupt, SystemExit) as e:
        print("Client %d %s" % (client['id'], e))


def new_client(client, server):
    print("New client")
    print(client)

def message_received(client, server, message):
    #if len(message) > 200:
    #    message = message[:200]+'..'
    print("Client(%d) said: %s" % (client['id'], message))
    if not client['id'] in wss.keys():
        wss[client['id']] = websocket.WebSocket()
        print("Create connection %s%s" % (config["host"], client["path"]))

        if len(config['jwt_token']) > 0:
            print("Using JWT token from config")
            wss[client['id']].connect(config["host"] + client["path"],
                                      header = ["Authorization: Token %s" % config['jwt_token']])
        else:
            wss[client['id']].connect(config["host"] + client["path"])

        thread = Thread(target=client_recv, args = (wss[client['id']], client))
        thread.start()


    if client['handler'].get_opcode() == OPCODE_BINARY:
        print("\nSending binary %s" % message)
        wss[client['id']].send(message, websocket.ABNF.OPCODE_BINARY)
    else:
        print("\nSending text %s" % message)
        wss[client['id']].send(message)

def close_client_connection():
    print("Closing client connection")

server = WebsocketServerJwt(int(config['local_port']), host='127.0.0.1')
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_close_client_connection(close_client_connection)
server.run_forever()
