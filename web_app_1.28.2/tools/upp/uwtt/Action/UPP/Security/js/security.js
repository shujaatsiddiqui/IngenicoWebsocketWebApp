
class Security{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Security/security.html', function(){
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

      $("#security_type").on('input', function(e) {
      var selected = $(this).val();
      var type = selected.split('_')[0];
      $('#typeSpecificRow').load('Action/UPP/Security/SecurityType/' + type + '.html', function(){
          that.sec_type = SecurityTypeFactory.create(selected);
      });
    });

    $('#security_send_btn').click(function() {
      var json = that.sec_type.formJson();
      that.session = new RequestSession(Settings.host, Settings.version, "security",
      function() {       // On connect
         that.session.send(json);
      }, function(evt) { // On Rx
         that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
         that.session.disconnect();
      }, function(msg) { // On Tx
         that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function(err) { // On error
         that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
    });
    $("#security_type").trigger('input');
  }
}
