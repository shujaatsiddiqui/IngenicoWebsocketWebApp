/**

    @prototype Flow
    @brief Wrapper for iConnect WS protocol
    @usage:
        var socket     = new WebSocket("ws://localhost:port/<end-point>");
        var flow       = new Flow(socket, onResponse, onEvent);
        var parameters = {...};
        // the start function prepares and sends the request with parameters
        var flow_id = flow.request(parameters);

        function onResponse(flow_id, response)
        {
            // do something with response
        }
        function onEvent(flow_id, result)
        {
            // do something with result
            // Flow will send eventAck message with returned object
            return {status:"ok"};
        }
 **/

function Flow(socket, onresponse, onevent, onlog)
{
	var that = this;
	this.socket = socket;
    if( onlog === undefined )
        this.onlog = function(line) {console.log(line);};
    else
        this.onlog = onlog;
	if( onresponse == undefined)
        this.onresponse = function() {};
	else
		this.onresponse = onresponse;
	if( onevent == undefined)
        this.onevent = function() {};
	else
		this.onevent = onevent;
	this.socket.onmessage = function(evt)
	{
		//console.log("onmessage:"+evt.data);
		var flow_id;
		var msg = JSON.parse( evt.data );
		that.onlog(new Date());
		that.onlog("Flow <-- "+JSON.stringify(msg, null, 2));
		var resource;
		if( msg.hasOwnProperty("response") ) {
			// call a response handler
			flow_id = msg.response.flow_id;
			resource = that.onresponse(flow_id, msg.response.resource);
		}
		else if( msg.hasOwnProperty("event") ) {
			// call an event handler
			flow_id = msg.event.flow_id;
			resource = that.onevent(flow_id, msg.event.resource);
			// prepare and send eventAck back to the server
			var body = {};
			var header = (Settings.endpointMode == EndpointModeEnum.SINGLE)
				? {flow_id: flow_id, endpoint: msg.event.endpoint}
				: {flow_id: flow_id};
			if( resource.hasOwnProperty("resource") ) {
				Object.assign(body, header, {resource:resource.resource});
			}
			else {
				Object.assign(body, header, {resource:resource});
			}
			var ack = { event_ack:body };
			that.send(ack);
		}
		else {
			that.onlog("Flow: ERROR: unknow message type received.")
		}
		// close socket if required
		if( resource !== undefined ) {
			if( resource.hasOwnProperty("closeSocket") && resource.closeSocket === true ) {
				that.close();
			}
		}
	}
}
Flow.prototype = (function() {
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
	function getFlowId()
	{
		return getRandomInt(1000000).toString();
	}
	return {
		constructor: Flow,
		request: function(resource, endpoint, onresponse, onevent) {
			if( onresponse != undefined)
				this.onresponse = onresponse;
			if( onevent != undefined)
				this.onevent = onevent;

			// create the message object
			var that = this;
			var flow_id = getFlowId();
			var header = (Settings.endpointMode == EndpointModeEnum.SINGLE)
        ? {flow_id: flow_id, endpoint: endpoint}
        : {flow_id: flow_id};
			var body = {};
			Object.assign(body, header, {resource:resource});
			var message = { request:body };
			// send a message to the server
			if( this.send(message) == true )
				return flow_id;
			return null;
		},
		message: function(msg, onresponse, onevent) {
			if( onresponse != undefined)
				this.onresponse = onresponse;
			if( onevent != undefined)
				this.onevent = onevent;
			var flow_id = msg.hasOwnProperty('request') ? msg.request.flow_id : msg.event.flow_id;
			if( this.send(msg) == true )
				return flow_id;
			return null;
		},
		close:function() {
			this.socket.onclose = function() {};
			this.onlog(new Date());
			this.onlog("Flow::close socket");
			this.socket.close();
		},
		send:function(object) {
			this.onlog(new Date());
			var logMsg  = JSON.stringify(object, null, 2);
			var sendMsg = JSON.stringify(object);
			this.onlog("Flow --> "+logMsg);
			if(this.socket.readyState === this.socket.OPEN){
				this.socket.send(sendMsg);
				return true;
			}
			this.onlog("Flow:socket is not connected");
			this.socket.onerror();
			return false;
		}
	};
}());
