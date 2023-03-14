class BinCheck{
  constructor(){
  }
  process(){
    var that = this;
    $('#type_container').load('Action/UPP/Payment/Type/BinCheck/bin_check.html', function(){
      that.onLoad();
    });
  }

  onLoad(){
    var that = this;
  }

  buildResource(){
    var res = {"type": $('#payment_tnx_type').prop("value")};
    var payment_type = $('#payment_paymen_type').prop("value");
    if(payment_type !== ''){
      res["payment_type"] = payment_type;
    }
    var bin_ranges = $('#bin_ranges').val();
    var bin_ranges_array = bin_ranges.split(',');
    res["bin_ranges"] = bin_ranges_array;

    return res;
  }

  processPaymentData(data){
    var msg = new Message(data);
    if(msg.isEvent()){
      this.processPaymentEvent(msg)
    } else if(msg.isResponse()){
      if(msg.status == "started"){
        PaymentStatus.updateText("Waiting For Card");
      }
      else if(msg.status == "error"){
        var error_info = msg.jsonObject.response.resource.error_info;
        PaymentStatus.error('Error: ' + error_info.text);
      }
    }
  }

  processPaymentEvent(evt){
    var that = this;
    this.completionText = '';
    if(evt.jsonObject.event.resource.info){
      if(evt.jsonObject.event.resource.info.step_name){
        this.stepName = evt.jsonObject.event.resource.info.step_name;
      }
    }

    if(evt.status == "completed"){
      $('#resume_suspended_btn').hide();
      PaymentStatus.updateText("Payment Completed " + this.completionText);
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_completed'){
      this.transactionCompleted = true;
      PaymentStatus.updateText("Transaction Completed");
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_started'){
      PaymentStatus.updateText("Transaction Started");
    }

  }

}

Payment.eventTypeFieldName = "type";
