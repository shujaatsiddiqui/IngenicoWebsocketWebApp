function WsUi() {
}

WsUi.init = function() {
    // Defining variables
    var requestEditor;
    var eventAckEditor;
    var jsonFrameViewer;

    var session;
    var responseTmeout;
    var benchmark;

    var fileList;

    var initialReq = { "request": { "flow_id": "109569", "resource": {} } };
    var initialTraceReq = { "request": { "flow_id": "109569", "resource": {"action":"start"} } };
    var defaultAck = { "event_ack": { "flow_id": "", "resource": { "status": "ok" } } };
    var sem = null;

    var benchmarkIsRunning = false;

    var updated_run_benchmark_ui = function() {
      $("#connect_btn").prop("disabled", true);
      $("#send_request_btn").prop("disabled", true);
      $("#request_tmpl_btn").prop("disabled", true);
      $("#send_ack_btn").prop("disabled", true);
      $("#btnUploadBinFile").prop("disabled", true);
    }

    var updated_abort_benchmark_ui = function() {
      $("#connect_btn").prop("disabled", false);
      $("#send_request_btn").prop("disabled", false);
      $("#request_tmpl_btn").prop("disabled", false);
      $("#send_ack_btn").prop("disabled", false);
      $("#btnUploadBinFile").prop("disabled", false);
    }

    var updated_connected_ui = function() {
        $("#connect_btn").text('Disconnect');
        $("#connect_btn").addClass('btn-danger').removeClass('btn-secondary');
        $("#send_request_btn").prop("disabled", false);
        $("#run_benchmark_btn").prop("disabled", false);
        $("#send_ack_btn").prop("disabled", false);
        $("#host_ctrl").prop("disabled", true);
        $("#selected_endpoint").prop("disabled", true);
        $("#btnUploadBinFile").prop("disabled", false);
    }

    var updated_disconnected_ui = function() {
        $("#connect_btn").text('Connect');
        $("#connect_btn").addClass('btn-secondary').removeClass('btn-danger');
        $("#send_request_btn").prop("disabled", true);
        $("#run_benchmark_btn").prop("disabled", true);
        $("#send_ack_btn").prop("disabled", true);
        $("#host_ctrl").prop("disabled", false);
        $("#selected_endpoint").prop("disabled", false);
        $("#btnUploadBinFile").prop("disabled", true);
    }

    var updated_file_loading_ui = function() {
        $("#send_request_btn").prop("disabled", true);
        $("#run_benchmark_btn").prop("disabled", true);
        $("#send_ack_btn").prop("disabled", true);
        $("#btnUploadBinFile").prop("disabled", true);
    }

    var updated_file_loading_done_ui = function() {
        $("#send_request_btn").prop("disabled", false);
        $("#run_benchmark_btn").prop("disabled", false);
        $("#send_ack_btn").prop("disabled", false);
        $("#btnUploadBinFile").prop("disabled", false);
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
        updated_disconnected_ui();
    }

    var onError = function(err) {
        console.log("onError");
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

        abort_benchmark_execution();
    }

    var date = function(d) {
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " +
            ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2)  + "." + ("0" + d.getMilliseconds()).slice(-3);
        return datestring;
    };

    var onLog = function(msg) {
        var currentDate = new Date();
        msg = '"[' + date(currentDate) + '] ' + session.endpoint + ' TRACE: ' + msg + '"';
        jsonFrameViewer.append_info(msg);
    };

    var onBenchmarkResult = function(text, duration) {
      var milliseconds = parseInt(duration % 1000),
          seconds = parseInt((duration / 1000) % 60),
          minutes = parseInt((duration / (1000 * 60)) % 60);

      milliseconds = (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      var msg = text + ": " + minutes + " min " + seconds + " sec " + milliseconds + " ms";
      jsonFrameViewer.append_info(msg);
    }

    var onSend = function(msg) {
        var currentDate = new Date();
        if(benchmarkIsRunning) {
          benchmark.setStartTime(currentDate);
        }
        jsonFrameViewer.append_info('"[' + date(currentDate) + '] [Client --> Terminal] ' + session.endpoint + '"');
        jsonFrameViewer.append(JSON.parse(msg));
    };

    var onReceive = function(evt) {
        var msg = new Message(evt.data);

        if (msg.isBinary()) {
            onLog("Processing incoming binary message");

            $('#saveFile').on('show.bs.modal', function(e) {
                BinaryData.onShow(msg.get());
            });

            $('#saveFile').modal();
            onLog("Incoming binary message processed");
            return;
        }

        if (!msg.isValid()) {
            onLog("ERROR: Invalid incoming JSON message");
            abort_benchmark_execution();
            return;
        }

        var currentDate = new Date();
        if(benchmarkIsRunning) {
          if(msg.getStatus() == "completed") {
            benchmark.addTimestamp(currentDate);
          }
        }
        jsonFrameViewer.append_info('"[' + date(currentDate) + '] [Terminal --> Client] ' + session.endpoint + '"');
        jsonFrameViewer.append(msg.get());
        if (sem && (sem != msg.get_endpoint() && (sem =! "/log/v1/trace")) && msg.event == false) {
            onLog("ERROR: Incorrect incoming endpoint " + msg.get_endpoint() + " " + sem);
            abort_benchmark_execution();
            return;
        }

        if (msg.getFlowId() != FlowId.getCurrent() && !msg.getFlowId().endsWith(FlowId.getCurrent()) && msg.event == false) {
            onLog("ERROR: Incorrect incoming flow_id");
            abort_benchmark_execution();
            return;
        }

        if (msg.isResponse() || msg.isEventAck()) {
            console.log("Response or EventAck received");
            clearTimeout(responseTmeout);
        } else { //event
            if ($('#auto_send_chbx').prop('checked')) {
                if (msg.getFlowId() != FlowId.getCurrent() && sem && (sem != msg.get_endpoint())) {
                    console.log(msg);
                    console.log(eventAckEditor);
                    console.log(FlowId.getCurrent());
                    var event_ack = eventAckEditor.get();
                    event_ack['event_ack']['flow_id'] = msg.getFlowId();
                    event_ack['event_ack']['endpoint'] = msg.get_endpoint();
                    session.send(JSON.stringify(event_ack));
                } else {
                    session.send(JSON.stringify(eventAckEditor.get()));
                }
            }
        }

        if(benchmarkIsRunning) {
          if(msg.getStatus() == "completed") {
            benchmark.run();
          }
          else if(msg.getStatus() == "error") {
            abort_benchmark_execution();
          }
        }
    }

    requestEditor = new JsonEditor("request_editor", $('#request_editor_content'), false);
    eventAckEditor = new JsonEditor("evt_response_editor", $('#evt_response_editor_content'), false);
    jsonFrameViewer = new JsonEditor("json_viewer", $('#json_viewer_content'), true);

    initialReq.request.flow_id = FlowId.getCurrent();
    requestEditor.set(initialReq);

    jsonFrameViewer.set(); //clear editor
    jsonFrameViewer.setAutoScroll(true);

    $("#send_request_btn").prop("disabled", true);
    $("#run_benchmark_btn").prop("disabled", true);
    $("#send_ack_btn").prop("disabled", true);
    $("#btnUploadBinFile").prop("disabled", true);

    if ($("#sel_event_response :selected").text() == "Default ACK") {
        defaultAck.event_ack.flow_id = FlowId.getCurrent();
        eventAckEditor.set(defaultAck);
    }

    $("#sel_event_response").on('change', function() {
        if ($("#sel_event_response :selected").text() == "Default ACK") {
            defaultAck.event_ack.flow_id = FlowId.getCurrent();
            eventAckEditor.set(defaultAck);
        }
    });

    $("#connect_btn").on('click', function() {
        if ($("#connect_btn").text() == "Connect") {
            if( $("#selected_endpoint").val().includes('trace')){
              $("#auto_send_chbx").prop('checked', false);
              initialTraceReq.request.flow_id = FlowId.getCurrent();
              requestEditor.set(initialTraceReq);
            }
            var endpoint = $("#host_ctrl").val() + $("#selected_endpoint").val();
            console.log("connecting to " + endpoint);
            session = new Session(onConnect, onDisconnect, onReceive, onSend, onError);
            session.connect(endpoint);
        } else {
            if( $("#selected_endpoint").val().includes('trace')){
              $("#auto_send_chbx").prop('checked', true);
            }
            console.log("disconnecting");
            session.disconnect();
        }
    });

    var send_request_btn_click = function() {
      var json_request = requestEditor.get();
      if (FlowId.setCurrent(json_request) && !json_request.event ) {
          if ($("#sel_event_response :selected").text() == "Default ACK") {
              var content = eventAckEditor.get();
              if (content != undefined && content.event_ack != undefined && content.event_ack.flow_id != undefined) {
                  content.event_ack.flow_id = FlowId.getCurrent();
                  if(json_request.request.endpoint){
                      content.event_ack.endpoint = json_request.request.endpoint;
                      sem = json_request.request.endpoint;
                  } else if(content.event_ack.endpoint) {
                      delete content.event_ack.endpoint;
                      sem = null;
                  }
                  eventAckEditor.set(content);
              }
          }
      }
      var json = JSON.stringify(requestEditor.get());
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
            abort_benchmark_execution();
          }
        }
        responseTmeout = setTimeout(onEventAckTimeout, Settings.responseTimeoutSec * 1000);
      }else{ //assuming request
        responseTmeout = setTimeout(function() { onLog("Error: Response Timeout"); }, Settings.responseTimeoutSec * 1000);
      }
    }

    $("#send_request_btn").on('click', send_request_btn_click);

    $("#run_benchmark_btn").on('click', function() {
      if ($("#run_benchmark_btn").text() == "Run benchmark") {
        updated_run_benchmark_ui();
        $("#run_benchmark_btn").text('Abort benchmark');
        $("#run_benchmark_btn").addClass('btn-danger').removeClass('btn-success');

        benchmark = new Benchmark(Settings.benchmarkExecutionCount, send_request_btn_click, abort_benchmark_execution);
        benchmarkIsRunning = true;
        benchmark.run();
      }
      else {
        abort_benchmark_execution();
      }
    });

    var abort_benchmark_execution = function() {
      if(benchmarkIsRunning) {
        benchmarkIsRunning = false;

        onBenchmarkResult("Minimum", benchmark.minimum);
        onBenchmarkResult("Maximum", benchmark.maximum);
        onBenchmarkResult("Average", benchmark.average);

        $("#run_benchmark_btn").text('Run benchmark');
        $("#run_benchmark_btn").addClass('btn-success').removeClass('btn-danger');
        updated_abort_benchmark_ui();
      }
    }

    $("#request_tmpl_btn").on('click', function() {
        initialReq.request.flow_id = FlowId.generate();
        requestEditor.set(initialReq);
        if ($("#sel_event_response :selected").text() == "Default ACK") {
            defaultAck.event_ack.flow_id = FlowId.getCurrent();
            eventAckEditor.set(defaultAck);
        }
    });

    $("#send_ack_btn").on('click', function() {
        session.send(JSON.stringify(eventAckEditor.get()));
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

    $('#binFilePath').on('change', function() {
        //get the file fileName
        fileList = $(this)[0].files;
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileList[0].name);
    });


    var sendBinaryFile = function(binMsg, callback) {
        var ws = session.socket;
        ws.binaryType = "arraybuffer";
        ws.send(binMsg);

        if (callback != null) {
            var interval = setInterval(function() {
                if (ws.readyState !== WebSocket.OPEN) {
                    callback(-1)
                    clearInterval(interval);
                } else if (ws.bufferedAmount > 0) {
                    callback(ws.bufferedAmount)
                } else {
                    callback(0)
                    clearInterval(interval);
                }
            }, 100);
        }
    }

    $("#btnUploadBinFile").on('click', function() {
        updated_file_loading_ui();
        onLog('Uploading file');
        jsonFrameViewer.append_info("");
        var file = fileList[0];
        sendBinaryFile(file, function(bytesNotSent) {
            if (bytesNotSent == 0) {
                updated_file_loading_done_ui();
                onLog('File uploaded');
                Progress.done("File uploaded");

            } else if (bytesNotSent < 0) {
                onLog('Failed');
                Progress.failed("Failed");
            } else {
                var loaded = file.size - bytesNotSent;
                var progress = Math.round((loaded * 100) / file.size);
                console.log("Uploading");
                Progress.set(progress, "Uploading");
            }
        });
    });

    $('#saveFile').on('click', '.btn-primary', BinaryData.onSave);
};
