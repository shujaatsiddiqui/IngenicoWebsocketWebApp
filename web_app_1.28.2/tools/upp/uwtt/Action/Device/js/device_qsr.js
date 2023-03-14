class Qsr{
    constructor(jsonFrameViewer){
      this.tracer = new Tracer(jsonFrameViewer);
        $( "div" ).remove(".modal-backdrop");
    }
  
    process(){
      var that = this;
      $('#modal_content').load('Action/Device/device_qsr.html', function(){
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
      $('#device_QSR_send_btn').click(function() {
        var resource = that.buildResource();
        that.session = new RequestSession(Settings.host, Settings.version, "device",
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
      var res = {"type":"qsr_limit"};
        if ($('#QSR_limit_amount_field').val()) {
            res["amount"] = Number($('#QSR_limit_amount_field').val());
        }
      return res;
    }
  }
  