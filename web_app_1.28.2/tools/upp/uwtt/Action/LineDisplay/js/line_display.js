class LineDisplay{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/LineDisplay/line_display.html', function(){
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
    $('#line_disp_send_btn').click(function() {
      var resource = that.buildResource();
      that.session = new RequestSession(Settings.host, Settings.version, "linedisplay",
      function() {       // On connect
        that.session.send(resource);
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
        that.session.disconnect();
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });

    //line_disp_clear_btn
    $('#line_disp_clear_btn').click(function() {
      that.session = new RequestSession(Settings.host, Settings.version, "linedisplay",
      function() {       // On connect
        that.session.send({"type":"clear"});
      }, function(evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
        that.session.disconnect();
      }, function(msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });
  }

  buildResource(){
    var text = $('#line_disp_text_lines').val();
    var lines = text.split('\n');
    var type = $("#line_disp_selected_type").val();
    var resource = {"type":type, text:lines};
    return resource;
  }
}
