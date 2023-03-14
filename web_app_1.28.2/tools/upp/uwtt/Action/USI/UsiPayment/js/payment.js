class UsiPayment{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer, ["emv_tags", "app_tags", "event_ack", "balance"]);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/USI/UsiPayment/payment.html', function(){
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

    this.disableFields();
    if( $('#payment_tnx_type').prop("value") == "sale"){
      document.getElementById("qsr_limit").disabled = false;
    }
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
      that.disableFields();
      if (event.target.value == "update") {
        that.payment_type = new UpdateAmount();
        $('#payment_use_default_form').prop("checked", true);
      } else {
        that.payment_type = new UsiRegular(that);
        $('#payment_use_default_form').prop("checked", true);
      }

      if ($('#payment_tnx_type').prop("value") == "force_sale") {
        document.getElementById("host_approval_code").disabled = false;
      }
      if ($('#payment_tnx_type').prop("value") == "preauth_completion") {
        document.getElementById("host_approval_code").disabled = false;
        document.getElementById("host_txn_id").disabled = false;
        document.getElementById("original_client_txn_id").disabled = false;
        document.getElementById("original_txn_type").disabled = false;
        document.getElementById("host_retrieval_ref_num").disabled = false;
        document.getElementById("pan").disabled = false;
      }
      if ($('#payment_tnx_type').prop("value") == "void") {
        document.getElementById("host_txn_id").disabled = false;
        document.getElementById("host_approval_code").disabled = false;
        document.getElementById("original_client_txn_id").disabled = false;
        document.getElementById("original_txn_type").disabled = false;
        document.getElementById("host_retrieval_ref_num").disabled = false;
        document.getElementById("pan").disabled = false;
      }
      if( $('#payment_tnx_type').prop("value") == "sale"){
        document.getElementById("qsr_limit").disabled = false;
      }
      that.payment_type.process();
    });

    that.payment_type = new UsiRegular(that);
    that.payment_type.process();

  }

  prepareData(){
    if(!this.sendClicked){
      return;
    }

    this.resource = this.payment_type.buildResource();
    this.defForm = false;

    if($('#payment_use_default_form').prop( "checked" )){
      this.defForm = true;
    }
  }

  onSend(){
    if(!this.sendClicked){
      return;
    }

    var that = this;

    if(that.defForm){
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
      UsiPaymentStatus.updateText("Reseting internal states");
      that.device_session.send({"type":"reset"});
    }, function(evt) { // On Rx
      that.tracer.traceJsonData(JSON.parse(evt.data), that.device_session.endpoint, true);
      var msg = new Message(evt.data);
      if(msg.isEvent() && (msg.status == "completed")){
        that.continueAfterReset = true;
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
      UsiPaymentStatus.updateText("Setting default form");
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
          UsiPaymentStatus.error('Error: ' + error_info.text);
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
      UsiPaymentStatus.updateText("Starting Payment");
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

  disableFields() {
    document.getElementById("host_approval_code").disabled = true;
    document.getElementById("host_txn_id").disabled = true;
    document.getElementById("original_client_txn_id").disabled = true;
    document.getElementById("original_txn_type").disabled = true;
    document.getElementById("host_retrieval_ref_num").disabled = true;
    document.getElementById("pan").disabled = true;
    document.getElementById("qsr_limit").disabled = true;

    document.getElementById("host_approval_code").value = "";
    document.getElementById("host_txn_id").value = "";
    document.getElementById("original_client_txn_id").value = "";
    document.getElementById("original_txn_type").value = "";
    document.getElementById("host_retrieval_ref_num").value = "";
    document.getElementById("pan").value = "";
    document.getElementById("qsr_limit").value = "";
  }
}
