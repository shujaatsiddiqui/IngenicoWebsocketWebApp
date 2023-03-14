## Websocket proxy

This intended to listen for local Websocket connections (clients) and proxing requests responses to terminal Websocket server.

This will allow to modify HTTP handshake headers which is currently not possible in Websocket client in Browser.

Requirement Python 3 and pyyaml library install:

+ pip install pyyaml

Configure `config.yml`, set terminal IP in 'host', add JWT token if terminal require it to authorize connection, set local_port to listen on localhost.

Configure UWTT tool, set Host: ws://127.0.0.1:50000 (you may change local port in config.yml)

UWTT tool will connect to local proxy and messages will be proxied to terminal.

Start:

```
python proxy.py
```

