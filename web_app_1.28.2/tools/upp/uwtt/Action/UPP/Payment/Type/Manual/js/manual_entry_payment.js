class ManualEntry{
  constructor(basePayment){
    this.basePayment = basePayment;
	this.txnCloseSession=false;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#type_container').load('Action/UPP/Payment/Type/Manual/manual_entry_payment.html', function(){
      that.onLoad();
    });
  }

  onLoad(){
  }

  buildResource(){
    var ret;
    var tnx_type = $('#payment_tnx_type').prop("value");
    var payment_type = $('#payment_paymen_type').prop("value");

    ret = {"type":tnx_type};

    if(payment_type !== ''){
      ret["payment_type"] = payment_type;
    }

    var amnt = $('#payment_amount').val();
    if(amnt !== ''){ // not empty{
      ret["amount"] = amnt;
    }

    var cshbk = $('#payment_cashback').val();
    if(cshbk !== ''){ // not empty{
      ret["cashback"] = cshbk;
    }

    var fields = $('#manual_entry_type').val();
    if(fields != "none"){
      ret["fields"] = fields.split(',');
    }
    return ret;
  }

  processPaymentData(data){
    var msg = new Message(data);
    if(msg.isEvent()){
      this.processPaymentEvent(msg)
    } else if(msg.isResponse()){
      if(msg.status == "started"){
      }
      else if(msg.status == "error"){
        var error_info = msg.jsonObject.response.resource.error_info;
        alert('Error: ' + error_info.text);
      }
    }
  }

  processPaymentEvent(evt){
    var basePayment = this.basePayment;
    basePayment.modal = undefined;
	this.completionText = '';
    if(evt.status == "completed"){
      if(Settings.endpointMode == EndpointModeEnum.SINGLE){
        if(this.txnCloseSession){ 
            $('#resume_suspended_btn').hide();
            PaymentStatus.updateText("Payment Completed "+this.completionText);
            basePayment.closeSession = true;
        }
            this.txnCloseSession=true;
      }
      else{
	  PaymentStatus.updateText("Payment Completed "+this.completionText);
      basePayment.closeSession = true;
      }
    }
    else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'missing_data'){
      basePayment.modal = new MissingData(basePayment.session, evt.jsonObject.event.resource.missing_data);
    }

    if(basePayment.modal){
      basePayment.modal.process();
    }
  }
}
