'''
The MIT License (MIT)
Copyright (c) 2013 Dave P.
'''

import signal
import sys
import ssl
import json
from decimal import Decimal
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser

class iTsiWebServer(WebSocket):

   type = ""

   def generateOneResult(self, type, amount, merchantId):
      results = []
      results.append(self.generateResult(type, amount, merchantId))
      return results

   def generateTwoResults(self, type, amount, merchantId):
      results = []
      results.append(self.generateResult(type, amount, merchantId))
      results.append(self.generateResult(type, amount, merchantId))
      return results

   def generateResult(self, type, amount, merchantId):
      card = { "account_no":"************7702",
               "entry_mode":{"code":"0", "text":"magnetic_strip"},
               "type":{"code":"02","text":"mastercard"}
             }
      network = {"id":"X","name":"NETWORK/DISCOVER"}
      emvData = {"82":"78 00","5F2A":"08 40","9F07":"FF80","9F12":"Discover Credit","9F37":"FBAF5578"}
      emv = {"aid":"A0000001523010","application_label":"Discover Credit","tsi":"2000","tvr":"0000000000","cvm_result":"0","data":emvData}
      result = {"authorization_no":"191509",
                "batch_no":"1",
                "card":card,
                "host_response_text":"APPROVED 191509",
                "merchant_id" : merchantId,
                "reference_no" : "3",
                "status" : "approved",
                "terminal_id" : "001",
                "total_amount" : amount,
                "transaction_amount" : amount,
                "transaction_date" : "18/03/14",
                "transaction_time" : "04:21:22",
                "type" : type,
                "emv":emv}
      return result

   def sendJsonMessage(self, message):
      #messageStr = json.dumps(message, ensure_ascii=False, indent=4)
      messageStr = json.dumps(message, ensure_ascii=False)
      print("CL <-- SRV " + messageStr)
      self.sendMessage(messageStr)

   def receivedJsonMessage(self):
      print("CL --> SRV " + self.data)
      msg = json.loads(self.data, parse_float=Decimal)
      if "request" in msg:
         body = msg["request"]
         id = body["flow_id"]
         resources = body["resource"]
         self.type = resources["type"]
         amount = 10
         tenderType = "debit"
         merchantId = "VISAMID0123"
         if( self.type == "auto_settlement" ) :
             resource = {"status":"error","error_info":{"code": "0","code_extended": "0","text": "TSI busy","time": "2018-04-05 04:25:47"}}
         else :
             resource = {"status":"started"}
         response = {"flow_id":id, "resource":resource}
         msg = {"response":response}
         self.sendJsonMessage(msg)
         if( self.type == "auto_settlement" ) :
             return
         # send result via Event
         results = self.generateOneResult(self.type, amount, merchantId)
         if( self.type == "settlement" ) :
             resource ={"status":"proceed","results":results}
         elif ( self.type == "void" ) :
             resource ={"status":"error","error_info":{"code": "0","code_extended": "0","text": "JsonMapper error: Facility [JsonMapper], code [13], details: No key 930 found when processing emv","time": "2018-05-22 15:27:25"}}
         else :
             resource ={"status":"completed","results":results}
         event = {"flow_id":id,"resource":resource}
         msg = {"event":event}
         self.sendJsonMessage(msg)
      elif "event_ack" in msg:
         body = msg["event_ack"]
         id = body["flow_id"]
         if( self.type == "settlement" ) :
             self.type = ""
             results = self.generateTwoResults(self.type, 100, "VISAMID0123")
             resource = {"status":"completed","results":results}
             event = {"flow_id":id,"resource":resource}
             msg = {"event":event}
             self.sendJsonMessage(msg)

   def handleMessage(self):
      try:
         self.receivedJsonMessage()
      except:
         print("Unexpected error:", sys.exc_info()[0])
         raise

   def handleConnected(self):
      print (self.address,':'+self.request.path+' connected')

   def handleClose(self):
      print (self.address, 'closed')

if __name__ == "__main__":
   
   assert sys.version_info >= (3,0)
   
   parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
   parser.add_option("--host", default='', type='string', action="store", dest="host", help="hostname (localhost)")
   parser.add_option("--port", default=50000, type='int', action="store", dest="port", help="port (50000)")
   parser.add_option("--example", default='echo', type='string', action="store", dest="example", help="echo, chat")
   parser.add_option("--ssl", default=0, type='int', action="store", dest="ssl", help="ssl (1: on, 0: off (default))")
   parser.add_option("--cert", default='./cert.pem', type='string', action="store", dest="cert", help="cert (./cert.pem)")
   parser.add_option("--key", default='./key.pem', type='string', action="store", dest="key", help="key (./key.pem)")
   parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1, type=int, action="store", dest="ver", help="ssl version")

   (options, args) = parser.parse_args()

   if options.ssl == 1:
      server = SimpleSSLWebSocketServer(options.host, options.port, iTsiWebServer, options.cert, options.key, version=options.ver)
   else:
      server = SimpleWebSocketServer(options.host, options.port, iTsiWebServer)

   def close_sig_handler(signal, frame):
      server.close()
      sys.exit()

   signal.signal(signal.SIGINT, close_sig_handler)

   server.serveforever()
