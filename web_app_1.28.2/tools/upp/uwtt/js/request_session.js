class RequestSession {
  constructor(host, version, endpoint, onConnect, onReceive, OnSend, OnError) {
    var that = this;
    this.flowId_ = FlowId.generate();

    function onSessionConnect(){
      if(onConnect)
        onConnect();
    }

    function onSessionReceive(evt){
      var msg = new Message(evt.data);
      if(msg.isResponse() || msg.isEventAck()){
        if(msg.getFlowId() == that.flowId_){
          clearTimeout(that.responseTimeout);
        }
      }

      if(onReceive)
        onReceive(evt);

      if(msg.isEvent()){
        if((that.endpointMode_ == EndpointModeEnum.SINGLE)){
          var evtFlowId=msg.getFlowId();
          var evtEndpoint=msg.getEndpoint();
          var ack = {"event_ack":{"flow_id":evtFlowId, "endpoint": evtEndpoint, "resource":{"status":"ok"}}};
          that.session_.send(JSON.stringify(ack));
        }
        else {
          if(msg.getFlowId()==that.flowId_){
          var ack = {"event_ack":{"flow_id":that.flowId_, "resource":{"status":"ok"}}};
          that.session_.send(JSON.stringify(ack));
          }
        }
        if(msg.status == "error"){
          var error_info = msg.jsonObject.event.resource.error_info;
          if (typeof  error_info.text == 'undefined') {
            alert('Error: ' + error_info.facility);
          } else {
            alert('Error: ' + error_info.text);
          }
        }
      }
    }

    function onSessionSend(msg){
      if(OnSend)
        OnSend(msg);
    }

    function onSessionError(err){
      console.log("RequestSession error ", that.connectionUrl_);
      if(OnError)
        OnError(err);
    }

    function onSessionDisconnect(){
      console.log("RequestSession disconnect from ", that.connectionUrl_);
    }

    this.session_ = new Session(onSessionConnect, onSessionDisconnect, onSessionReceive, onSessionSend, onSessionError);
    if (endpoint == null) {
      this.endpoint_ = '/';
    } else {
      this.endpoint_ = (( Settings.protocol == ProtocolEnum.UPP ) ? '/upp/' : '/usi/' ) + version + '/' + endpoint;
    }
    this.endpointMode_ = ((Settings.endpointMode == EndpointModeEnum.SINGLE) &&
                          (endpoint != "file"))
      ? EndpointModeEnum.SINGLE
      : EndpointModeEnum.MULTIPLE;
    this.connectionUrl_ = (this.endpointMode_ == EndpointModeEnum.SINGLE)
      ? host + '/'
      : host + this.endpoint_;
    console.log("Connecting to ", this.connectionUrl_);
    this.session_.connect(this.connectionUrl_);
  }

  get session() {
    return this.session_;
  }

  send(resource) {
    var that = this;
    var request = (this.endpointMode_ == EndpointModeEnum.SINGLE)
      ? { "request":{"flow_id":this.flowId_, "endpoint":this.endpoint_, "resource":resource}}
      : { "request":{"flow_id":this.flowId_, "resource":resource}};
    this.session_.send(JSON.stringify(request));

    this.responseTimeout = setTimeout(function() {
      console.log("Error: Response Timeout", that.connectionUrl_, request);
      that.disconnect();
    }, Settings.responseTimeoutSec * 1000);
  }

  sendEvent(resource) {
    var that = this;
    var request = (this.endpointMode_ == EndpointModeEnum.SINGLE)
      ? { "event":{"flow_id":this.flowId_, "endpoint":this.endpoint_, "resource":resource}}
      : { "event":{"flow_id":this.flowId_, "resource":resource}};
    this.session_.send(JSON.stringify(request));

    this.responseTimeout = setTimeout(function() {
      console.log("Error: Event Ack Response Timeout", that.connectionUrl_, request);
      that.disconnect();
    }, Settings.responseTimeoutSec * 1000);
  }

  get endpoint() {
    return this.connectionUrl_;
  }

  disconnect(){
    this.session_.socket.close();
  }

}

function sendRequest(owner, endpoint, onSend, closeOnRx = true) {
  owner.session = new RequestSession(Settings.host, Settings.version, endpoint,
    function() {       // On connect
      onSend(owner.session);
    }, function(evt) { // On Rx
      owner.tracer.traceJsonData(JSON.parse(evt.data), owner.session.endpoint, true);
      if (closeOnRx) {
        owner.session.disconnect();
      }
      owner.onDone();
    }, function(msg) { // On Tx
      owner.tracer.traceJsonData(JSON.parse(msg), owner.session.endpoint);
    }, function(err) { // On error
      owner.tracer.traceText("WebSocket error", owner.session.endpoint)
    });
}
