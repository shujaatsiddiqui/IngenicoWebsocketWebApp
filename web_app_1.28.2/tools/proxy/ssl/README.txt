SSL client mode setup PC side:

1) download stunnel from https://www.stunnel.org/downloads.html
2) edit config files as it in stunnel.conf file
3) point to the right path of the server.pem and server.key
4) reload stunnel configuration
5) run proxy script as following WsProxy.py --ep_port=60001 --init_port=60002 --ssl=1


SSL client mode setup Terminal side:
1) Enable client mode 
2) Edit ssl settings in the client mode i.e.:

		ws_client {
			ep_register_url: "wss://192.168.17.154:50002"
			
			enable_ssl: 1
			ssl_profile_name: "iWSPofile"
			ssl_profile_crt: "/HOST/server.pem"
		}