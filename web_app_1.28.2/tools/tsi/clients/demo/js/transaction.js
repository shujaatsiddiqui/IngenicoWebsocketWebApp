/**
    @brief do one transaction per connection
    @usage:
		Transaction.execute(server, endPoint, parameters, callbacks);
    	var callbacks = { progress:          function(text)       {},
                          printReceipt:      function(jsonResult) {},
                          printErrorMessage: function(text)       {}
                        };
		Function opens the connection with server/endPoint,
		Sends the request with parameters and 
		Waiting the response within responseTimeoutMsec.
		If response received and status is "started", procedure is waiting the Event within eventTimeoutMsec.

		At the end of the transaction the socket will be closed.
 **/

function Transaction()
{
	
}

Transaction.openConnection = function(url, onConnect, callbacks)
{
	try {
		// Create the websocket with callbacks.
		console.log("Open url="+url);
		var socket     = new WebSocket(url);
		socket.onerror = function() { console.log("socket.onerror"); callbacks.printErrorMessage("Connection error");};
		socket.onopen  = function() { onConnect(socket); };
		socket.onclose = function() { console.log("socket.onclose"); callbacks.printErrorMessage("Connection error"); };
	}
	catch(err) {
		callbacks.printErrorMessage("EXCEPTION IN WEBSOCKET:"+err);
	}
}

Transaction.onDisconnectByPeer = function(responseTimer, eventTimer, callbacks)
{
	return function()
	{
		stopTimer(responseTimer);
		stopTimer(eventTimer);
		callbacks.printErrorMessage("Connection error");
	}
}

Transaction.do = function(server, endPoint, parameters, callbacks)
{
	var responseTimeoutMsec = 5000;
	var eventTimeoutMsec    = -1;
	
	// validate server, endPoint patterns
	if( /^ws:\/\/.+/.test(server) == false )
		server = "ws://" + server;
	if( endPoint[0] != '/' )
		endPoint = "/" + endPoint;
	
	// Open the connection for server+endpoint with a callback with an onopen event.
	Transaction.openConnection(server+endPoint, function(socket) {
		// create the flow wrapper to send/receive messages to the server
	    var flow = new Flow(socket);
		// start the flow, and provides the callbacks for response and events
		var responseTimer = {handler:0};
		var eventTimer    = {handler:0};
		var flow_id = flow.request(parameters, Transaction.onResponse(flow, responseTimer, eventTimer, eventTimeoutMsec, callbacks), Transaction.onEvent(flow, eventTimer, callbacks));
		// overwrite the onclose 
		socket.onclose = Transaction.onDisconnectByPeer(responseTimer, eventTimer, callbacks);
		// set timeout for "no response received"
		if( responseTimeoutMsec > 0 )
			responseTimer.handler = setTimeout( function() { Transaction.onResponseTimeout(flow, flow_id, callbacks) }, responseTimeoutMsec);
	}, callbacks);
}

Transaction.onResponse = function(flow, responseTimer, eventTimer, eventTimeoutMsec, callbacks)
{
	return function (flow_id, response) {
		stopTimer(responseTimer);
		
		if( response.status == "started" ) {
			// set timeout for Event received
			if( eventTimeoutMsec > 0 )
				eventTimer.handler = setTimeout( function() { Transaction.onEventTimeout(flow, flow_id, callbacks) }, eventTimeoutMsec);
		} else if( response.status == "completed" ) {
			callbacks.printReceipt(response);
			return {closeSocket:true};
		}
		else {
			callbacks.printErrorMessage("TRANSACTION FAILED");
			return {closeSocket:true};
		}
	}
}

Transaction.onEvent = function(flow, eventTimer, callbacks)
{
	return function (flow_id, resource) {
		switch(resource.status)
		{
			case "completed":
				stopTimer(eventTimer);
				callbacks.printReceipt(resource.results[0]);
				return {resource:{status:"ok"}, closeSocket:true};
			case "proceed":
				callbacks.progress("proceed ...");
				return {resource:{status:"ok"}};
			case "error":
				stopTimer(eventTimer);
				callbacks.printErrorMessage("TRANSACTION FAILED");
				return {resource:{status:"ok"}, closeSocket:true};
			default:
				stopTimer(eventTimer);
				callbacks.printErrorMessage("TRANSACTION FAILED");
				return {resource:{status:"ok"}, closeSocket:true};
		}
	}
}

Transaction.onResponseTimeout = function(flow, flow_id, callbacks)
{
	callbacks.printErrorMessage("TRANSACTION FAILED. TIME OUT");
	flow.close();
}

Transaction.onEventTimeout = function(flow, flow_id, callbacks)
{
	callbacks.printErrorMessage("TRANSACTION FAILED. TIME OUT");
	flow.close();
}

function stopTimer(timer)
{
	if( timer.handler != 0 )
		clearTimeout(timer.handler);
	timer.handler = 0;
}

