# pip install websocket
# pip install websocket-client
import signal
import sys
import websocket
import random
import time
import optparse
try:
    import thread
except ImportError:
    import _thread as thread

flowid = random.randint(11111,99999)

def on_message(ws, message):
    trace(message)

def on_error(ws, error):
    trace(error)

def on_close(ws):
    trace("### closed ###")

def on_open(ws):
    trace("### opened ###")
    def run(*args):
        msg = "{\"request\":{\"flow_id\":\""+str(flowid)+"\",\"resource\":{\"action\":\"start\"}}}"
        trace(msg)
        ws.send(msg)
    thread.start_new_thread(run, ())

def trace(msg):
    print(msg)
    file = open("ws.log", "a")
    file.write(msg + "\n")
    file.close()

if __name__ == "__main__":

    parser = optparse.OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
    parser.add_option("--host", type='string', action="store", dest="host", help="hostname or ip address")
    parser.add_option("--port", default=50000, type='int', action="store", dest="port", help="port (50000)")
    parser.add_option("--flowid", default=flowid, type='int', action="store", dest="flowid", help="flow_id (random.randint(11111,99999))")
    (options, args) = parser.parse_args()
    if options.host is None:
        print("Missing --host parameter")
        sys.exit() 
	
    connection_url = "ws://"+options.host+":"+str(options.port)+"/log/v1/trace"
    flowid = options.flowid
	
    trace("### connecting to "+connection_url+" ###")

    websocket.enableTrace(False)
    ws = websocket.WebSocketApp(connection_url,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open

    def close_sig_handler(signal, frame):
        trace("### signal.SIGINT ###")
        trace("### stop trace ###")
        msg = "{\"request\":{\"flow_id\":\""+str(flowid)+"\",\"resource\":{\"action\":\"stop\"}}}"
        trace(msg)
        ws.send(msg)
        trace("### sleep 2 sec ###")
        time.sleep(2)
        ws.close()
        trace("### exit ###")
        sys.exit()

    signal.signal(signal.SIGINT, close_sig_handler)

    ws.run_forever()
