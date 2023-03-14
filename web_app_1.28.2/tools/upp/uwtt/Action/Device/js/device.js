class Device{
  constructor(jsonFrameViewer, onDone){
    this.tracer = new Tracer(jsonFrameViewer);
    this.onDone = onDone;
    this.endpoint = "device";
    this.jsonFrameViewer = jsonFrameViewer;
    this.date_btn_pressed = false;
    this.language_btn_pressed = false;
    this.beep_btn_pressed = false;
    this.card_read_btn_pressed = false;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Device/device.html', function(){
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

    if(that.date_btn_pressed){
      var action = new DateTime(that.jsonFrameViewer);
      action.process();
    }
    else if(that.language_btn_pressed){
      var action = new Language(that.jsonFrameViewer);
      action.process();
    }
    else if(that.beep_btn_pressed){
      var action = new Beep(that.jsonFrameViewer);
      action.process();
    }
    else if(that.card_read_btn_pressed){
      var action = new CardRead(that.jsonFrameViewer);
      action.process();
    }
    else if(that.qsr_btn){
      var action = new Qsr(that.jsonFrameViewer);
      action.process();
    }
    else if(that.variables_btn_btn_pressed){
      var action = new Variables(that.jsonFrameViewer);
      action.process();
    }
  }

  clearAll() {
    PaymentStatus.updateText("");
    $('#resume_suspended_btn').hide();
  }

  onLoad(){
    var that = this;
    if (Settings.protocol == ProtocolEnum.UPP){
      document.getElementById("qsr_btn").style.display = "none";
      document.getElementById("hosts_btn").style.display = "none";
    } else {
      document.getElementById("card_status_btn").style.display = "none";
      document.getElementById("fleet_card_prompts_btn").style.display = "none";
    }

    $('#card_status_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        session.send({"type":"card_status"});
      });
    });

    $('#device_info_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        session.send({"type":"info"});
      });
    });

    $('#fleet_card_prompts_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        session.send({"type":"get_fleet_prompts"});
      });
    });

    $('#profile_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        session.send({"type":"profile"});
      });
    });

    $('#hosts_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        session.send({"type":"host"});
      });
    });

    var onReset = function(keep_form) {
      that.clearAll();
      // if form is not kept, then wait for Offline event (don't close the session).
      var auto_close_session = keep_form;

      sendRequest(that, that.endpoint,
        function(session) {       // On send
          session.send({
            "type" : "reset",
            "keep_form" : keep_form
          });
        },
        auto_close_session
      );
    }
    $('#device_reset_btn').click(function() { onReset(false); } );
    $('#device_reset_keep_form_btn').click(function() { onReset(true); } );

    $('#device_disconnect_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        that.clearAll();
        session.send({"type":"disconnect"});
      });
    });

    $('#device_datetime_btn').on('click', function() {
      that.date_btn_pressed = true;
    });

    $('#device_language_btn').on('click', function() {
      that.language_btn_pressed = true;
    });

    $('#device_beep_btn').on('click', function() {
      that.beep_btn_pressed = true;
    });

    $('#device_card_read_btn').on('click', function() {
      that.card_read_btn_pressed = true;
    });

    $('#qsr_btn').on('click', function() {
      that.qsr_btn = true;
    });

    $('#variables_btn').on('click', function() {
      that.variables_btn_btn_pressed = true;
    });

    $('#device_reboot_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        that.clearAll();
        session.send({"type":"reboot"});
      });
    });

    $('#device_update_btn').click(function() {
      sendRequest(that, that.endpoint, function(session) {       // onSend
        that.clearAll();
        session.send({"type":"update"});
      });
    });
  }
}
