class Payment{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer, ["emv_tags", "app_tags", "event_ack", "balance"]);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Payment/payment.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        that.prepareData();
        $('#modal_content').empty();
        that.onSend();
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });
  }

  onLoad(){
    var that = this;

    $('#payment_send_btn').click(function() {
      that.sendClicked = true;
    });

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#payment_send_btn").click();
      }
    });

    $('#payment_tnx_type').on('change', function(event) {
      if(event.target.value == "manual_entry"){
        that.payment_type = new ManualEntry(that);
        $('#payment_pre_reset').prop("checked", true);
        $('#payment_use_default_form').prop("checked", true);
      }else if(event.target.value == "wic"){
        that.payment_type = new Wic(that);
        $('#payment_pre_reset').prop("checked", true);
        $('#payment_use_default_form').prop("checked", true);
      }else if (event.target.value == "bin_range_check") {
        that.payment_type = new BinCheck();
        $('#payment_pre_reset').prop("checked", false);
        $('#payment_use_default_form').prop("checked", false);
      }else if (event.target.value == "add_on") {
        that.payment_type = new AddOn();
        $('#payment_pre_reset').prop("checked", false);
        $('#payment_use_default_form').prop("checked", false);
      }else {
        that.payment_type = new Regular(that);
        $('#payment_pre_reset').prop("checked", true);
        $('#payment_use_default_form').prop("checked", true);
      }

      that.payment_type.process();
    });

    that.payment_type = new Regular(that);
    that.payment_type.process();

  }

  prepareData(){
    if(!this.sendClicked){
      return;
    }

    this.resource = this.payment_type.buildResource();
    this.reset = false;
    this.defForm = false;

    if($('#payment_pre_reset').prop( "checked" )){
      this.reset = true;
    }
    if($('#payment_use_default_form').prop( "checked" )){
      this.defForm = true;
    }
  }

  onSend(){
    if(!this.sendClicked){
      return;
    }

    var that = this;

    if(that.reset){
      that.sendReset(function(){
        if(that.defForm){
          that.sendDefaultForm(function(){
            that.sendPayment();
          });
        }else{
          that.sendPayment();
        }
      });
    }else if(that.defForm){
      that.sendDefaultForm(function(){
        that.sendPayment();
      });
    }else{
      that.sendPayment();
    }
  }

  sendReset(onDone){
    var that = this;
    that.continueAfterReset = false;
    that.device_session = new RequestSession(Settings.host, Settings.version, "device",
    function() {       // On connect
      PaymentStatus.updateText("Reseting internal states");
      that.device_session.send({"type":"reset"});
    }, function(evt) { // On Rx
      that.tracer.traceJsonData(JSON.parse(evt.data), that.device_session.endpoint, true);
      var msg = new Message(evt.data);
      if(msg.isEvent() && (msg.status == "completed")){
		if(Settings.endpointMode == EndpointModeEnum.SINGLE){
            if(msg.getType()!='reset'){
              that.continueAfterReset = true;    
            }
        }
        else{
            that.continueAfterReset = true;
        }
     }
	}, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), that.device_session.endpoint);
      if(that.continueAfterReset){
        onDone();
        that.device_session.disconnect();
      }
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", that.device_session.endpoint);
    });
  }

  sendDefaultForm(onDone){
    if(!FormEntry.defaultPaymentForm){
      onDone();
      return;
    }

    var that = this;
    that.form_session = new RequestSession(Settings.host, Settings.version, "form",
    function() {       // On connect
      PaymentStatus.updateText("Setting default form");
      that.form_session.send(FormEntry.defaultPaymentForm);
    }, function(evt) { // On Rx
      that.tracer.traceJsonData(JSON.parse(evt.data), that.form_session.endpoint, true);
      var msg = new Message(evt.data);
      if(msg.isResponse()){
        if(msg.status == "started"){
          onDone();
        }
        else if(msg.status == "error"){
          var error_info = msg.jsonObject.response.resource.error_info;
          PaymentStatus.error('Error: ' + error_info.text);
        }
      }
    }, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), that.form_session.endpoint);
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", that.form_session.endpoint);
    });
  }

  sendPayment(){
    var that = this;
    that.session = new RequestSession(Settings.host, Settings.version, "transaction",
    function() {       // On connect
      PaymentStatus.updateText("Starting Payment");
      that.session.send(that.resource);
    }, function(evt) { // On Rx
      that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      that.processPaymentData(evt.data);
    }, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      if(that.closeSession){
        that.closeSession = false;
        that.session.disconnect();
        if(that.defForm)
        {
          that.form_session.disconnect();
        }
      }
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", that.session.endpoint);
    });
  }

  processPaymentData(data){
    this.payment_type.processPaymentData(data);
  }

  processPaymentEvent(evt){
    this.payment_type.processPaymentEvent(data);
  }
}
