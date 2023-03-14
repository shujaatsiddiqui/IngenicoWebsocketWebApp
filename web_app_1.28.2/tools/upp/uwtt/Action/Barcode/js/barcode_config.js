class BarcodeConfig{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Barcode/barcode_config.html', function(){
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

    $('#barcode_config_send_btn').click(function() {
      var resource = that.buildResource();
      that.session = new RequestSession(Settings.host, Settings.version, "barcode",
      function() {       // On connect
        that.session.send(resource);
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });

    $('#barcode_config_reset_btn').click(function() {
      sendRequest(that, "barcode", function(session) {       // onSend
        session.send({"type":"reset"});
      });
    });
  }

  buildResource(){
    var selected_scan_mode = $('#selected_scan_mode').val();
    var selected_lighting_mode = $('#selected_lighting_mode').val();
    var selected_image_mode = $('#selected_image_mode').val();
    var selected_illumination_mode = $('#selected_illumination_mode').val();
    var selected_trigger_mode = $('#selected_trigger_mode').val();
    
    var res = {"type" : "config"};

    var configs = {};
    if(selected_scan_mode !== "NotSet"){
      configs["scan_mode"] = selected_scan_mode;
    }

    if(selected_lighting_mode !== "NotSet"){
      configs[ "lighting_mode"] = selected_lighting_mode;
    }

    if(selected_image_mode !== "NotSet"){
      configs[ "image_mode"] = selected_image_mode;
    }

    if(selected_illumination_mode !== "NotSet"){
      configs[ "illumination_mode"] = selected_illumination_mode;
    }

    if(selected_trigger_mode !== "NotSet"){
      configs[ "trigger_mode"] = ( selected_trigger_mode == "true" );
    }
    
    res["config"] = configs;
    return res;
  }
}
