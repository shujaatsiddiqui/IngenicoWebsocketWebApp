INTRODUCING.

WsProxy is a simple command line utility to test iConnect WS client mode with the single WebSocket client and a single terminal.

On the start-up iConnect WS app sends a message with various information including endpoints it supports, terminal serial number, etc. to a WsProxy. 
WsProxy which is configured using command line options sends back a message including infomation on enabled endpoints and their connection settings (ip, port, SSL profile).
When the negotiation phase is done terminal connects to a enabled endpoints and waits requests. At this phase WsProxy acts like a bridge between terminal and WebSocket client.


COMMAND LINE OPTION DESCRIPTION.

--host					Sets the listen interface i.e. localhost. Default value is localhost
--ep_port				Sets the endpoint TCP port which will be used to connect the terminal endpoints with the WsProxy. Default is 50001.
--init_port				Sets negotiation phase TCP port which will be used when the terminal retrieves information form WsProxy on enabled endpoint and connection settings. Default is 50002.
--ssl					Sets the SSL mode. When in SSL mode WsProxy sends to a terminal the wss scheme in connection settings and an SSL profile to be used on the terminal. In SSL mode the STUNNEL application should be used. Default is a non-SSL mode.
--pongdisabled  		If enabled WsProxy won't send WebSocket PONG frame on PING receive. Default - disabled.
--enabled_endpoints		Sets the enabled endpoints (comma separated). By default all endpoints sent form the terminal will be enabled.
--custom_data           Custom data string will be sent in registration response
--disconnect_timeout    If provided number of seconds random endpoint will be disconnected
--send_authorization    If set to 1 then random data will be sent in Authorization header in registration response
--http_401_probability  probability of HTTP 401 response when endpoint connecting 0 - 100

COMMAND LINE OPTION EXAMPLES:

1. WsProxy		#W/o arguments default values will be used
2. WsProxy --ep_port=60001  --init_port=60002 --ssl=1
3. WsProxy --enabled_endpoints="/upp/v1/file,/"		#Here only root "/" and "/upp/v1/file" endpoints will be enabled. That is only two connections from the terminal will be active.