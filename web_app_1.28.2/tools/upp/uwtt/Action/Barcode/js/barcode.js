class Barcode{
  
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    this.endpoint = "barcode";
    this.config_pressed = false;
    this.generate_pressed - false;
    this.jsonFrameViewer = jsonFrameViewer;
    $( "div" ).remove(".modal-backdrop");
  }
  
  
  process(){
    var that = this;
    $('#modal_content').load('Action/Barcode/barcode.html', function(){
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
    var that = this;
    
    if( that.config_pressed )
    {
      var action = new BarcodeConfig(that.jsonFrameViewer);
        action.process();
    }

    if( that.generate_pressed )
    {
      var action = new GenerateBarcode(that.jsonFrameViewer);
        action.process();
    } 
  }

  onLoad(){

    var that = this;

    $('#barcode_start_btn').click(function() {
      that.session = new RequestSession(Settings.host, Settings.version, that.endpoint,
      function() {       // On connect
        that.session.send({ "type" : "start" });
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });

    $('#barcode_on_btn').click(function() {
      that.session = new RequestSession(Settings.host, Settings.version, that.endpoint,
      function() {       // On connect
        that.session.send({ "type" : "on" });
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });

    $('#barcode_off_btn').click(function() {
      that.session = new RequestSession(Settings.host, Settings.version, that.endpoint,
      function() {       // On connect
        that.session.send({ "type" : "off" });
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });

    $('#barcode_stop_btn').click(function() {
      if(that.session == null){
        alert('Scanning not started yet');
        return;
      }
      var resource = { "type" : "stop", "off" : true };
      that.session.sendEvent(resource);
    }); 
    
    $('#barcode_config_btn').click(function() {
      that.config_pressed = true;
    });

    $('#barcode_generate_btn').click(function() {
      that.generate_pressed = true;
    });
  }
}
