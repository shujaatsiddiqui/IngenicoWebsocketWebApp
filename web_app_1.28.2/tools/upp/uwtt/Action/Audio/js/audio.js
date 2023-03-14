class Audio{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Audio/audio.html', function(){
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

    $('#audio_play_btn').click(function() {
      var resource = that.buildResource();
      that.session = new RequestSession(Settings.host, Settings.version, "audio",
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

    $('#audio_stop_btn').click(function() {
      if(that.session == null){
        alert('Playing is not started yet!');
        return;
      }

      var resource = {"type":"stop"};
      that.session.sendEvent(resource);
    });
  }

  buildResource(){
    var playlist_text = $('#audio_playlist').val();
    var playlist_array = playlist_text.split('\n');
    var res = {"type":"play"};

    res["playlist"] = playlist_array;
    return res;
  }
}
