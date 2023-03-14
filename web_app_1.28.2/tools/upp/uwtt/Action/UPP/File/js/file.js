class File{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/File/file.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        that.prepareData();
        $('#modal_content').empty();
        that.onSend();
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });

  }

  prepareData(){

  }

  onSend(){

  }

  onLoad(){
    var that = this;
    $('#btnDone').on('click', function() {
      if(that.link) {
        that.link.session.disconnect();
        that.link = null;
      }
    });

    $('#binFilePath').on('change', function() {
        //get the file fileName
        that.fileList = $(this)[0].files;
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(that.fileList[0].name);
    });


    $("#btnSendMiscFile").on('click', function() {
      that.disableUi();
      that.link = new RequestSession(Settings.host, Settings.version, "file",
      function() {       // On connect
        that.link.send(that.buildMiscResource());
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.link.endpoint, true);
        var msg = new Message(evt.data);
        if((msg.isResponse() && msg.status != "started") || msg.isEvent()){
          that.enableUi();
        }
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.link.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.link.endpoint)
        that.enableUi();
      });
    });

    $("#btnReadBinFile").on('click', function() {
      that.disableUi();
      that.progress = new Progress('#fileReadProgress');
      var zeroLength = true;
      that.link = new RequestSession(Settings.host, Settings.version, "file",
      function() {       // On connect
        that.link.send(that.buildReadResource());
        that.progress.set(100, "Reading...");
      }, function(evt) { // On Rx
        var msg = new Message(evt.data);
        if(msg.isBinary()) {
          zeroLength = false;
          that.saveBinary(msg.get());
        }else{
          that.tracer.traceJsonData(JSON.parse(evt.data), that.link.endpoint, true);
          if(msg.isResponse() && msg.status != "started" ){
            that.enableUi();
            that.progress.failed("Failed");
          }else if( msg.isEvent() && msg.status == "completed" && zeroLength ){
            that.saveBinary("");
          }
        }
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.link.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.link.endpoint)
        that.enableUi();
      });
    });

    $("#btnUploadBinFile").on('click', function() {
      if(that.fileList === undefined || that.fileList[0] === '')
      {
        alert('Please select the file to upload')
        return;
      }

      that.disableUi();
      that.progress = new Progress('#fileProgress');
      that.link = new RequestSession(Settings.host, Settings.version, "file",
      function() {       // On connect
        that.link.send(that.buildWriteResource());
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.link.endpoint, true);

        var msg = new Message(evt.data);
        if(msg.isResponse()){
          var file = that.fileList[0];
          that.sendBinaryFile(file, function(bytesNotSent) {
              if (bytesNotSent < 0) {
                that.enableUi();
                that.tracer.traceText('Failed', that.link.endpoint);
                that.progress.failed("Failed");
              } else {
                var loaded = file.size - bytesNotSent;
                var progress = Math.round((loaded * 100) / file.size);
                that.progress.set(progress, "Uploading");
              }
          });
        }
        else if(msg.isEvent()){
          that.sendBinaryFileDone();
        }
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.link.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.link.endpoint)
        that.enableUi();
      });
    });
  }

  saveBinary(data){
    var binData = new BinaryData();
    binData.makeFile(data);

    var localFileName = $('#readLocalPath').val();
    if(localFileName == ""){
      if(this.terminalPath){
        localFileName = this.terminalPath.split('/').pop();
      }else{
        localFileName = "data.dat";
      }
    }

    binData.save(localFileName);
    this.enableUi();
    this.progress.done("Success");
  }

  sendBinaryFile(binMsg, callback) {
    var that = this;
    var ws = that.link.session.socket;
    ws.binaryType = "arraybuffer";
    ws.send(binMsg);

    if (callback != null) {
        that.interval = setInterval(function() {
            if (ws.readyState !== WebSocket.OPEN) {
                callback(-1)
                clearInterval(that.interval);
            } else if (ws.bufferedAmount > 0) {
                callback(ws.bufferedAmount)
            } else {
                callback(0)
                clearInterval(that.interval);
            }
        }, 100);
    }
  }

  sendBinaryFileDone(){
    if(this.interval){
      clearInterval(this.interval)
    }
    this.tracer.traceText('File uploaded', this.link.endpoint);
    this.progress.done("File uploaded");
    this.enableUi();
  }

  buildMiscResource()
  {
    var type = $('#fileActionType').val();
    var path = $('#miscDstPath').val();
    if(type == "find_crc32"){
      return {"type" : "find", "destination":path, "calc_crc32":true};
    }
    return {"type" : type, "destination":path};
  }

  buildWriteResource(){
    var path = $('#dstPath').val();
    if(path === ""){
      path = '/HOST/DATA.TMP';
    }
    return {"type" : "write", "destination":path};
  }

  buildReadResource(){
    var path = $('#readDstPath').val();
    if(path === ""){
      path = '/HOST/DATA.TMP';
    }
    this.terminalPath = path;
    return {"type" : "read", "destination":path};
  }

  disableUi(){
    $("#dstPath").prop("disabled", true);
    $("#binFilePath").prop("disabled", true);
    $("#btnUploadBinFile").prop("disabled", true);
    $("#btnDone").prop("disabled", true);
    $("#btnReadBinFile").prop("disabled", true);
    $("#btnSendMiscFile").prop("disabled", true);
  }

  enableUi(){
    $("#dstPath").prop("disabled", false);
    $("#binFilePath").prop("disabled", false);
    $("#btnUploadBinFile").prop("disabled", false);
    $("#btnDone").prop("disabled", false);
    $("#btnReadBinFile").prop("disabled", false);
    $("#btnSendMiscFile").prop("disabled", false);
  }
}
