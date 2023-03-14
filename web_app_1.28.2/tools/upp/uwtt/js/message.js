class Message{
  constructor(message){

    this.response = false;
    this.request = false;
    this.event = false;
    this.flowId = "";
    this.status_ = "";
	this.endpoint="";
	this.type_="";
    if(message){
      if (typeof(message) == "string") {
        try {
          this.message = JSON.parse(message);
        } catch (error) {
          console.log("Message: failed to parse JSON");
          return;
        }

        this.binary = false;
        if (this.message.hasOwnProperty("response")) {
          this.response = true;
          this.flowId = this.message.response.flow_id;
          this.status_ = this.message.response.resource.status;
        } else if (this.message.hasOwnProperty("event")) {
          this.event = true;
          this.flowId = this.message.event.flow_id;
          this.status_ = this.message.event.resource.status;
		  this.endpoint=this.message.event.endpoint;
		  this.type_=this.message.event.resource.type;
        }else if (this.message.hasOwnProperty("event_ack")) {
          this.event_ack = true;
          this.flowId = this.message.event_ack.flow_id;
          this.status_ = this.message.event_ack.status;
        }else if (this.message.hasOwnProperty("request")) {
          this.request = true;
          this.flowId = this.message.request.flow_id;
        }
      } else {
        this.message = message;
        this.binary = true;
      }
    }
  }

  setMessage(msg){
    this.message = msg;

    this.binary = false;
    if (this.message.hasOwnProperty("response")) {
        this.response = true;
        this.flowId = this.message.response.flow_id;
        this.status_ = this.message.response.resource.status;
    } else if (this.message.hasOwnProperty("event")) {
        this.event = true;
        this.flowId = this.message.event.flow_id;
        this.status_ = this.message.event.resource.status;
		this.endpoint=this.message.event.endpoint;
    }else if (this.message.hasOwnProperty("event_ack")) {
        this.event_ack = true;
        this.flowId = this.message.event_ack.flow_id;
        this.status_ = this.message.event_ack.status;
    }else if (this.message.hasOwnProperty("request")) {
        this.request = true;
        this.flowId = this.message.request.flow_id;
    }

  }

  get status(){
    return this.status_;
  }

  isEvent(){
    return this.event;
  }

  isEventAck(){
    return this.event_ack;
  }

  isResponse() {
      return this.response;
  }

  isRequest() {
      return this.request;
  }

  getFlowId() {
      return this.flowId;
  }

  isValid() {
      return this.event || this.response || this.event_ack || this.request;
  }

  isBinary() {
      return this.binary;
  }

  get() {
      return this.message;
  }

  get jsonObject(){
    return this.message;
  }
  
  getEndpoint(){
    return this.endpoint;
  }
  getType(){
    return this.type_;
  }
}
