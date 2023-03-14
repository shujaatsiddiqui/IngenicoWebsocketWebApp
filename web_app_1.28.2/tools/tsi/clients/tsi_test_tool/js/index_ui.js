function WsUi() {

}

WsUi.init = function() {

    // Defining variables
    var resourceEditor;
    var jsonFrameViewer;

    var session;
    var responseTmeout;
    
    var initResource = { "type":"sale", "amount":100, "tender_type":"credit" }; 
    var initialReq = { "request": { "flow_id": "109569", "resource":{} } };
    var defaultAck = { "event_ack": { "flow_id": "", "resource": { "status": "ok" } } };

    var sentTnxCount = 0;
    var terminalInfoTnxCount = 0;
    var sendTermInfo = false;
    var sendRequestTmeout;
    var sendRequestTmeoutSec = 0;

    var firstRamAvailable = 0;
    var currentRamAvailable = 0;
    var deltaRamAvailable = 0;

    var graphicData = [];
    graphicData.push([new Date(), 0]);
    var graphic = new Dygraph(document.getElementById("ram_chart"), graphicData,
                                {
                                    drawPoints: true,
                                    showRoller: true,
                                    valueRange: [-21000, 230000],
                                    labels: ['Time', 'Delta RAM / 10']
                                });
    var graphicTmeout;

    var sendRequest = function(){
        var json_resource;
        if(sendTermInfo){
            json_resource = { "type": "terminal_info" };
        } else {
            json_resource = resourceEditor.get();
        }
        
        var json_request = { "request": { "flow_id": FlowId.generate(), "resource":json_resource } };
        FlowId.setCurrent(json_request);
        var json = JSON.stringify(json_request);
        session.send(json);
        var msg = new Message(json);
        if(msg.isEvent()){
          var onEventAckTimeout;
          var cnt = 0;
          onEventAckTimeout = function(){
            console.log("onEventAckTimeout cnt ", cnt);
            if( cnt < 3 ){
              cnt++;
              session.send(json);
              responseTmeout = setTimeout(onEventAckTimeout, Settings.responseTimeoutSec * 1000);
            }else{
              onLog("Error: Response Timeout");
            }
          }
          responseTmeout = setTimeout(onEventAckTimeout, Settings.responseTimeoutSec * 1000);
        }else{ //assuming request
          responseTmeout = setTimeout(function() { onLog("Error: Response Timeout"); }, Settings.responseTimeoutSec * 1000);
        }
    }

    var onSendRequestTmeout = function(){
        console.log("onSendRequestTmeout");
        sendRequest();
    }

    var updated_connected_ui = function() {
        $("#connect_btn").text('Disconnect');
        $("#connect_btn").addClass('btn-danger').removeClass('btn-secondary');
        $("#send_request_btn").prop("disabled", false);
        $("#host_ctrl").prop("disabled", true);
        $("#selected_endpoint").prop("disabled", true);
        $("#send_request_btn").text('Start');
    }
     
    var updated_disconnected_ui = function() {
        $("#connect_btn").text('Connect');
        $("#connect_btn").addClass('btn-secondary').removeClass('btn-danger');
        $("#send_request_btn").prop("disabled", true);
        $("#host_ctrl").prop("disabled", false);
        $("#selected_endpoint").prop("disabled", false);
    }

    var onConnect = function() {
        console.log("onConnect");

        if ($("#connect_btn").text() == "Connect") {
            updated_connected_ui();
        } else {
            updated_disconnected_ui();
        }
    }

    var onDisconnect = function() {
        clearTimeout(sendRequestTmeout);
        clearTimeout(graphicTmeout);
        updated_disconnected_ui();
    }

    var onError = function(err) {
        console.log("onError");
        clearTimeout(sendRequestTmeout);
        clearTimeout(graphicTmeout);

        if (typeof err == "string") {
            onLog(err);
            updated_disconnected_ui();
        } else {
            onLog("WebSocket error");
            updated_disconnected_ui();
        }

        if ($("#connect_btn").text() == "Disconnect") {
            updated_disconnected_ui();
        }
    }

    var date = function() {
        var d = new Date();
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " +
            ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2)  + "." + ("0" + d.getMilliseconds()).slice(-3);
        return datestring;
    };

    var onLog = function(msg) {
        msg = '"[' + date() + '] ' + session.endpoint + ' TRACE: ' + msg + '"';
        jsonFrameViewer.append_info(msg);
    };

    var onSend = function(msg) {
        jsonFrameViewer.append_info('"[' + date() + '] [Client --> Terminal] ' + session.endpoint + '"');
        jsonFrameViewer.append(JSON.parse(msg));
    };


    var onReceive = function(evt) {
        var msg = new Message(evt.data);

        if (!msg.isValid()) {
            onLog("ERROR: Invalid incoming JSON message");
            return;
        }

        jsonFrameViewer.append_info('"[' + date() + '] [Terminal --> Client] ' + session.endpoint + '"');
        jsonFrameViewer.append(msg.get());

        if (msg.getFlowId() != FlowId.getCurrent()) {
            onLog("ERROR: Incorrect incoming flow_id");
            return;
        }

        if (msg.isResponse() || msg.isEventAck()) {
            console.log("Response or EventAck received");
            clearTimeout(responseTmeout);
        } else { //event
            defaultAck.event_ack.flow_id = FlowId.getCurrent();
            session.send(JSON.stringify(defaultAck));
            var jmsg = msg.get()

            if(jmsg.event.resource.results && jmsg.event.resource.results[0].parameters){
                currentRamAvailable = jmsg.event.resource.results[0].parameters["RAM Available:"];
                if(!currentRamAvailable){
                    if(jmsg.event.resource.results[0].type == "terminal_info"){
                        for (const obj of jmsg.event.resource.results[0].unknown){
                            if(obj.report_tag_label == "RAM Available:"){
                                currentRamAvailable = obj.report_tag_value;
                                break;
                            }
                        }
                    }
                }

                if( firstRamAvailable == 0 ){
                    firstRamAvailable = currentRamAvailable;
                    $('#ram_first').val(firstRamAvailable);
                }
                deltaRamAvailable = currentRamAvailable - firstRamAvailable;
                $('#ram_cur').val(currentRamAvailable);
                $('#ram_delta').val(deltaRamAvailable);

                graphicData.push([new Date(), deltaRamAvailable/10]);
            }

            if(jmsg.event.resource.status == "completed"){
                if(sendTermInfo){
                    sendTermInfo = false;
                }
                else{
                    sentTnxCount++;
                }
                
                terminalInfoTnxCount = parseInt($("#term_info_cnt").val());
                if( terminalInfoTnxCount > 0 && sentTnxCount >= terminalInfoTnxCount ){
                    sentTnxCount = 0;
                    sendTermInfo = true;
                }

                if($("#send_request_btn").text() == "Stop"){
                    sendRequestTmeoutSec = parseInt($("#request_timeut").val());
                    if( sendRequestTmeoutSec > 0 ) {
                        sendRequestTmeout = setTimeout(onSendRequestTmeout, sendRequestTmeoutSec * 1000);
                    }
                }
            }
        }
    }

    var graphInterval = function(){
        graphic.updateOptions( { 'file': graphicData } );
        graphicTmeout = setTimeout(graphInterval, 5*1000);
    }

    
    ///

    resourceEditor = new JsonEditor("request_editor", $('#request_editor_content'), false);
    jsonFrameViewer = new JsonEditor("json_viewer", $('#json_viewer_content'), true);

    initialReq.request.flow_id = FlowId.getCurrent();
    initialReq.request.resource = initResource;
    resourceEditor.set(initResource);

    jsonFrameViewer.set(); //clear editor
    jsonFrameViewer.setAutoScroll(true);

    $("#send_request_btn").prop("disabled", true);

    $("#connect_btn").on('click', function() {
        if ($("#connect_btn").text() == "Connect") {
            var endpoint = $("#host_ctrl").val() + $("#selected_endpoint").val();
            console.log("connecting to " + endpoint);
            session = new Session(onConnect, onDisconnect, onReceive, onSend, onError);
            session.connect(endpoint);
        } else {
            console.log("disconnecting");
            session.disconnect();
        }
    });

    $("#send_request_btn").on('click', function() {
        if($("#send_request_btn").text() == "Stop"){
            clearTimeout(sendRequestTmeout);
            clearTimeout(graphicTmeout);
            $("#send_request_btn").text('Start');
        }else if($("#send_request_btn").text() == "Start"){
            sentTnxCount = 0;
            sendTermInfo = false;

            firstRamAvailable = 0;
            currentRamAvailable = 0;
            deltaRamAvailable = 0;
            $('#ram_first').val(firstRamAvailable);
            $('#ram_cur').val(currentRamAvailable);
            $('#ram_delta').val(deltaRamAvailable);

            sendRequest();
            $("#send_request_btn").text('Stop');
            graphicTmeout = setTimeout(graphInterval, 1000);
            //

        }
        
    });

    $("#clear_btn").on('click', function() {
        jsonFrameViewer.set();
    });

    $("#auto_scroll_chbx").change(function() {
        if (this.checked) {
            jsonFrameViewer.setAutoScroll(true);
        } else {
            jsonFrameViewer.setAutoScroll(false);
        }
    });
};
