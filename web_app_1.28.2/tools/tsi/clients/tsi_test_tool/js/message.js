function Message(message) {
    this.response = false;
    this.event = false;
    this.eventAck = false;
    this.flowId = "";
    this.endpoint = null;

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
            this.endpoint = this.message.response.endpoint;
        } else if (this.message.hasOwnProperty("event")) {
            this.event = true;
            this.flowId = this.message.event.flow_id;
            this.endpoint = this.message.event.endpoint;
        }else if (this.message.hasOwnProperty("event_ack")) {
            this.eventAck = true;
            this.flowId = this.message.event_ack.flow_id;
            this.endpoint = this.message.event_ack.endpoint;
        }
    }
    else
    {
        this.message = message;
        this.binary = true;
    }
}


Message.prototype = {
    constructor: Message,
    isEvent: function() {
        return this.event;
    },
    isResponse: function() {
        return this.response;
    },
    getFlowId: function() {
        return this.flowId;
    },
    isValid: function() {
        return this.event || this.response || this.eventAck;
    },
    isBinary: function() {
        return this.binary;
    },
    get: function() {
        return this.message;
    },
    isEventAck: function() {
        return this.eventAck;
    },
    get_endpoint: function() {
        return this.endpoint;
    },
}
