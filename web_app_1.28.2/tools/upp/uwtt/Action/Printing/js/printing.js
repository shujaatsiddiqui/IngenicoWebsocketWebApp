class Printing{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Printing/printing.html', function(){
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
    $('#printing_send_btn').click(function() {
      var resource = that.buildResource();
      that.session = new RequestSession(Settings.host, Settings.version, "printer",
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
    var text = $('#printing_text_lines').val();
    var lines = text.split('\n');
    var res = {"type":"print", "text":lines};


    if($('#reportProgress').prop( "checked" )){
      res["report_progress"] = true;
    }

    if(!$('#autoCut').prop( "checked" )){
      res["auto_cut"] = false;
    }

    return res;
  }
}
