class GenerateBarcode{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Barcode/generate_barcode.html', function(){
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

    $('#barcode_generate_send_btn').click(function() {
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
  }

  buildResource(){
    var code_type = $('#selected_code_type').val();
    var file_name = $('#file_name').val();
    var width = $('#width').val();
    var height = $('#height').val();
    var data = $('#data').val();
    
    var res = {"type" : "generate"};

    res["file_name"] = file_name;
    res["data"] = data;
    res["width_px"] = width;
    res["height_px"] = height;
    res["code_type"] = code_type;
 
    return res;
  }
}
