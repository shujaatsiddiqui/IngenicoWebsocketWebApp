/**
    @brief do one transaction per connection
    @usage:
		Transaction.execute(server, endPoint, parameters, responseTimeoutMsec, eventTimeoutMsec);

		Function opens the connection with server/endPoint,
		Sends the request with parameters and
		Waiting the response within responseTimeoutMsec.
		If response received and status is "started", procedure is waiting the Event within eventTimeoutMsec.

		At the end of the transaction the socket will be closed.
 **/

function Transaction()
{

}
// https://www.w3schools.com/tags/ref_colornames.asp

Transaction.openConnection = function(url, onConnect)
{
	try {
		// Create the websocket with callbacks.
		LogPanel.write(new Date());
		LogPanel.write("Open web socket "+url);
		var socket     = new WebSocket(url);
		socket.onerror = function() { Progress.set(-1, "Connection error");
									  LogPanel.write("Web socket error");
									  OutputPanel.showError("ERROR ON WEBSOCKET"); };
		socket.onopen  = function() { onConnect(socket); };
		socket.onclose = function() { Progress.set(-1, "Connection error");
									  LogPanel.write("Connection closed");
									  OutputPanel.showError("WEBSOCKET CLOSED"); };
	}
	catch(err) {
		OutputPanel.showError("EXCEPTION IN WEBSOCKET:"+err);
	}
}

Transaction.onDisconnectByPeer = function(responseTimer, eventTimer)
{
	return function()
	{
		stopTimer(responseTimer);
		stopTimer(eventTimer);
		LogPanel.write("Error: connection closed by server");
		OutputPanel.showError("ERROR: CONNECTION CLOSED BY SERVER");
		Progress.set(-1,"Connection error");
	}
}

Transaction.do = function(server, endPoint, parameters, responseTimeoutMsec, eventTimeoutMsec, customRequest)
{
	Progress.set(15);	// space for text on progress-bar

	// validate server, endPoint patterns
	if( /^wss?:\/\/.+/.test(server) == false )
		server = "ws://" + server;
	if( endPoint[0] != '/' )
		endPoint = "/" + endPoint;

  var connectionUrl = (Settings.endpointMode == EndpointModeEnum.MULTIPLE)
    ? server + endPoint
    : server + "/";
	// Open the connection for server+endpoint with a callback with an onopen event.
	Transaction.openConnection(connectionUrl, function(socket) {
		// create the flow wrapper to send/receive messages to the server
	  var flow = new Flow(socket);
		flow.onlog = function(line){ LogPanel.write(line); };
		// start the flow, and provides the callbacks for response and events
		var responseTimer = {handler:0};
		var eventTimer    = {handler:0};
		var flow_id
		if( customRequest == true )
			flow_id = flow.message(parameters, Transaction.onResponse(flow, responseTimer, eventTimer, eventTimeoutMsec), Transaction.onEvent(flow, eventTimer));
		else
			flow_id = flow.request(parameters, endPoint, Transaction.onResponse(flow, responseTimer, eventTimer, eventTimeoutMsec), Transaction.onEvent(flow, eventTimer));
		Progress.set(25);
		// overwrite the onclose
		socket.onclose = Transaction.onDisconnectByPeer(responseTimer, eventTimer);
		// set timeout for "no response received"
		if( responseTimeoutMsec > 0 )
			responseTimer.handler = setTimeout( function() { Transaction.onResponseTimeout(flow, flow_id) }, responseTimeoutMsec);
	});
}

Transaction.onResponse = function(flow, responseTimer, eventTimer, eventTimeoutMsec)
{
	return function (flow_id, response) {
		stopTimer(responseTimer);
		Progress.set(50);

		if( response.status == "started" ) {
			// set timeout for Event received
			if( eventTimeoutMsec > 0 )
				eventTimer.handler = setTimeout( function() { Transaction.onEventTimeout(flow, flow_id) }, eventTimeoutMsec);
		} else if( response.status == "completed" ) {
			OutputPanel.showObject("RESULT",response);
			stopTimer(eventTimer);
			Progress.set(100);
			return {closeSocket:true};
		} else if( response.status == "error" ) {
			OutputPanel.showError("TRANSACTION FINISHED WITH ERROR");
			OutputPanel.showObject("RESULT",response);
			Progress.set(-1,"Error");
			return {closeSocket:true};
		}
		else {
			OutputPanel.showError("UNKNOWN STATUS");
			OutputPanel.showObject("RESULT",response);
			Progress.set(-1, "Failed");
			return {closeSocket:true};
		}
	}
}

Transaction.onEvent = function(flow, eventTimer)
{
	return function (flow_id, resource) {
		if( resource.status == "error" )
			OutputPanel.showObject("RESULT: "+resource.status, resource);
		else
			OutputPanel.showArray("RESULT: "+resource.status, resource.results);
		switch(resource.status)
		{
			case "completed":
				stopTimer(eventTimer);
				Progress.set(100);
				if(Array.isArray(resource.results)){
					for(let res of resource.results){
						if(res.parameters && res.parameters.SignatureData){
							Signature.show(res.parameters.SignatureData);
							break;
						}
					}
				}
				return {resource:{status:"ok"}, closeSocket:true};
			case "proceed":
				Progress.set(75);
				return {resource:{status:"ok"}};
			case "error":
				stopTimer(eventTimer);
				Progress.set(-1, "Error");
				return {resource:{status:"ok"}, closeSocket:true};
			default:
				stopTimer(eventTimer);
				Progress.set(-1, "Error");
				OutputPanel.showError('UNKNOW STATUS');
				return {resource:{status:"ok"}, closeSocket:true};
		}
	}
}

Transaction.onResponseTimeout = function(flow, flow_id)
{
	Progress.set(-1, "Time-out");
	LogPanel.write("Time-out: no response message received for flow_id "+flow_id);
	OutputPanel.showError('TIMEOUT: NO RESPONSE RECEIVED');
	flow.close();
}

Transaction.onEventTimeout = function(flow, flow_id)
{
	Progress.set(-1, "Time-out");
	LogPanel.write("Time-out: no event message received for flow id "+flow_id);
	OutputPanel.showError('TIMEOUT: NO EVENT RECEIVED');
	flow.close();
}
