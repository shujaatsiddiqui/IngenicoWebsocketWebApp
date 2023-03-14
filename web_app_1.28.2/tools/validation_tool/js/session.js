class Session {
  constructor(onConnect, onClose, onReceive, onSend, onError) {
    this.onConnect = onConnect;
    this.onClose = onClose;
    this.onReceive = onReceive;
    this.onSend = onSend;
    this.onError = onError;
  }

  connect(endpoint) {
    try {
      this.endpoint_ = endpoint;
      this.webSocket = new WebSocket(endpoint);
      this.webSocket.onerror = this.onError;
      this.webSocket.onopen = this.onConnect;
      this.webSocket.onclose = this.onClose

      this.webSocket.onmessage = this.onReceive;
    } catch (err) {
      this.onError("EXCEPTION IN WEBSOCKET:" + err);
    }
  }

  disconnect() {
    this.webSocket.close();
  }

  send(data) {
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
