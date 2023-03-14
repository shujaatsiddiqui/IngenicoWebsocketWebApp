class Session {
  constructor(onConect, onClose, onReceive, onSend, onError) {
    this.onConect = onConect;
    this.onClose = onClose;
    this.onReceive = onReceive;
    this.onSend = onSend;
    this.onError = onError;
  }

  connect(endpoint) {
    try {
      this.endpoint_ = endpoint;
      if (Settings.jwtToken != "") {
        this.webSocket = new WebSocket(endpoint, Settings.jwtToken);
      } else {
        this.webSocket = new WebSocket(endpoint);
      }
      this.webSocket.onerror = this.onError;
      this.webSocket.onopen = this.onConect;
      this.webSocket.onclose = this.onClose;

      this.webSocket.onmessage = this.onReceive;
    } catch (err) {
      this.onError("EXCEPTION IN WEBSOCKET:" + err);
    }
  }

  disconnect() {
    this.webSocket.close();
  }

  send(data) {
    debugger;
    this.webSocket.send(data);
    this.onSend(data);
  }

  get endpoint() {
    return this.endpoint_;
  }

  get socket() {
    return this.webSocket;
  }

}
