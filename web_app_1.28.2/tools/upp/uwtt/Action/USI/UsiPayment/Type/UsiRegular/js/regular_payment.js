class UsiRegular{
  constructor(basePayment){
    this.basePayment = basePayment;
  }
  process(){
    var that = this;
    $('#type_container').load('Action/USI/UsiPayment/Type/UsiRegular/regular_payment.html', function(){
      that.onLoad();
    });
  }

  onSuspendDataSent(){
    // Hide resume button on every send if transacrion have been completed.
    // If suspend event will be received it will be shown.
    if(this.transactionCompleted){ 
      UsiPaymentStatus.updateText("Transaction Completed " + this.completionText);
      $('#resume_suspended_btn').hide();
    }
  }

  onLoad(){

    var that = this;

    $('#cashback').val( Cookie.get("cashback") );
    $('#surcharge').val( Cookie.get("surcharge") );
    $('#tax').val( Cookie.get("tax") );
    $('#vat').val( Cookie.get("vat") );
    $('#tip').val( Cookie.get("tip") );
    $('#total').val( Cookie.get("total") );

    if( $('#payment_tnx_type').prop("value") == "get_token"){
      document.getElementById("cashback").disabled = true;
      document.getElementById("surcharge").disabled = true;
      document.getElementById("tax").disabled = true;
      document.getElementById("vat").disabled = true;
      document.getElementById("tip").disabled = true;
      document.getElementById("total").disabled = true;
      document.getElementById("token").disabled = true;
      document.getElementById("payment_paymen_type").disabled = true;
    } else {
      document.getElementById("cashback").disabled = false;
      document.getElementById("surcharge").disabled = false;
      document.getElementById("tax").disabled = false;
      document.getElementById("vat").disabled = false;
      document.getElementById("tip").disabled = false;
      document.getElementById("total").disabled = false;
      document.getElementById("token").disabled = false;
      document.getElementById("payment_paymen_type").disabled = false;
    }

    $('#resume_suspended_btn').click(function() {
      var action = new UsiSuspended(that.jsonFrameViewer, that.basePayment.session, function(){
        $('#resume_suspended_btn').hide();
      });
      action.process();
    });

    $('#refresh_example_btn').click(function() {
      that.updateExample();
    });

    this.updateExample();
    // jsonFrameViewer staff
  }

  updateExample(){
    var res = this.buildResource()
    $('#json_example').val(JSON.stringify(res, null, "\t"));
  }

  buildResource(){

    var res;
    
    if( $('#send_example').prop( "checked" ) ){
      res = JSON.parse($('#json_example').val()); 
      return res;
    }
    
    var tnx_type = $('#payment_tnx_type').prop("value");
    var payment_type = $('#payment_paymen_type').prop("value");
    var vas_mode = $('#vas_mode').prop("value");
    //var cless_mode = $('#payment_cless_mode').prop("value");

    res = {"txn_type":tnx_type};

    if (tnx_type != "get_token") {
      if (payment_type !== '') {
        res["payment_type"] = payment_type;
      }
    }

    if (vas_mode !== '') {
      res["vas_mode"] = vas_mode;
    }

    var qsrLimit = $('#qsr_limit').val();
    if(qsrLimit !== ''){ // not empty{
      res["qsr_limit"] = Number( qsrLimit );
    }

    var amounts = {};
    var cashback = $('#cashback').val();
    if(cashback !== ''){ // not empty{
      amounts["cashback"] = Number( cashback );
    }

    var surcharge = $('#surcharge').val();
    if(surcharge !== ''){ // not empty{
      amounts["surcharge"] = Number( surcharge );
    }

    var tax = $('#tax').val();
    if(tax !== ''){ // not empty{
      amounts["tax"] = Number( tax );
    }

    var vat = $('#vat').val();
    if(vat !== ''){ // not empty{
      amounts["vat"] = Number( vat );
    }

    var tip = $('#tip').val();
    if(tip !== ''){ // not empty{
      amounts["tip"] = Number( tip );
    }


    var total = $('#total').val();
    if(total !== ''){ // not empty{
      amounts["total"] = Number( total );
    }

    var init_on_error = $('#prompt_card_removal_on_error').val();
    if(init_on_error !== ''){ // not empty{
      res["prompt_card_removal_on_error"] = init_on_error == 'true' ? 'true' : 'false';
    }

    if (tnx_type != "get_token") {
      res["amount"] = amounts;

      if($('#token').prop("value") != ""){
        res["token"] = { value: $('#token').prop("value"),
          exp: $('#token_exp_date').prop("value"),
          card_mnemonic: $('#token_card_mnemonic').prop("value")
        }
      }
    }

    var host_approval_code = $('#host_approval_code').prop("value");
    if(host_approval_code != ""){
      res["host_approval_code"] = host_approval_code;
    }

    var host_retrieval_ref_num = $('#host_retrieval_ref_num').prop("value");
    if(host_retrieval_ref_num != ""){
      res["host_retrieval_ref_num"] = host_retrieval_ref_num;
    }

    var pan = $('#pan').prop("value");
    if(pan != ""){
      res["pan"] = pan;
    }

    var host_txn_id = $('#host_txn_id').prop("value");
    if(host_txn_id != ""){
      res["host_txn_id"] = host_txn_id;
    }

    var original_client_txn_id = $('#original_client_txn_id').prop("value");
    if(original_client_txn_id != ""){
      res["original_client_txn_id"] = original_client_txn_id;
    }

    var original_txn_type = $('#original_txn_type').prop("value");
    if(original_txn_type != ""){
      res["original_txn_type"] = original_txn_type;
    }

    var host_approval_code = $('#host_approval_code').prop("value");
    if(host_approval_code != ""){
      res["host_approval_code"] = host_approval_code;
    }

    res["txn_status_events"] = $('#status_events').prop( "checked" );
    res["display_txn_result"] = $('#display_txn_result').prop( "checked" );
    if (tnx_type != "get_token") {
      res["confirm_amount"] = $('#confirm_amount').prop( "checked" );

      if( $('#card_read_suspend').prop( "checked" ) || $('#cashback_suspend').prop( "checked" ) || $('#payemnt_type_suspend').prop( "checked" ) ){
        var suspend = []
        if(  $('#card_read_suspend').prop( "checked" ) ){
          suspend.push("card_read")
        }
        if(  $('#cashback_suspend').prop( "checked" ) ){
          suspend.push("cashback")
        }
        if(  $('#payemnt_type_suspend').prop( "checked" ) ){
          suspend.push("payment_type")
        }
        res["txn_suspend"] = suspend;
      }
      if( $('#token_request').prop( "checked" ) ){
        res["token_request"] = true;
      }
    }
    res["manual_entry"] = $('#manual_entry').prop( "checked" );

    if(language.value != "empty"){
      res["language"] = Number( language.value );
    }

    if( $('#demo_mode').prop( "checked" ) ){
      res["demo_mode"] = true;
    }

    //if(form.value != ""){
    if($('#form').val() != ""){
      res["form"] = $('#form').val();
    }

    Cookie.set("cashback", cashback);
    Cookie.set("surcharge", surcharge);
    Cookie.set("tax", tax);
    Cookie.set("vat", vat);
    Cookie.set("tip", tip);
    Cookie.set("total", total);
    Cookie.set("txn_status_events", $('#status_events').prop( "checked" ) );
    Cookie.set("display_txn_result", $('#display_txn_result').prop( "checked" ) );
    Cookie.set("manual_entry", $('#manual_entry').prop( "checked" ) );
    Cookie.set("confirm_amount", $('#confirm_amount').prop( "checked" ));
    
    console.log("Settings: Save cookies");
    Cookie.log();

    return res;
  }

  processPaymentData(data){
    var basePayment = this.basePayment;
    var msg = new Message(data);
    if(msg.isEvent()){
      this.processPaymentEvent(msg)
    } else if(msg.isResponse()){
      if(msg.status == "error"){
        var error_info = msg.jsonObject.response.resource.error_info;
        UsiPaymentStatus.error('Error: ' + error_info.text);
      }
      else if(msg.status == "not_allowed"){
        UsiPaymentStatus.error('Not Allowed!!!');
      }
    } else if (msg.isEventAck()){
      if (basePayment.pendingAuth) {
          // we received ACK on outgoing event but Authorization is still pending.
          // Hence, show the Authorization dialog again.
          UsiPaymentStatus.updateText("Processing Authorization");
          basePayment.modal = new UsiAuthRequest(basePayment);
          basePayment.modal.process();
      }
    }
  }

  processPaymentEvent(evt){
    var that = this;
    var basePayment = this.basePayment;
    this.completionText = '';
    basePayment.modal = undefined;
    if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'suspend' || evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'txn_status_event'){
      $('#resume_suspended_btn').show();
      UsiPaymentStatus.updateText("Transaction Suspended");
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_completed'){
      $('#resume_suspended_btn').hide();
      UsiPaymentStatus.updateText("Transaction Completed");
    }else if(evt.jsonObject.event.resource["status"] == 'not_allowed'){
      $('#resume_suspended_btn').hide();
      UsiPaymentStatus.updateText("Not Allowed");
    }else if(evt.jsonObject.event.resource["status"] == 'invalid_transaction'){
      $('#resume_suspended_btn').hide();
      UsiPaymentStatus.updateText("Invalid transaction");
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_error') {
      var error_info = evt.jsonObject.event.resource["error_info"];
      if (typeof  error_info.text == 'undefined') {
        UsiPaymentStatus.error('Error: ' + error_info.facility);
      } else {
        UsiPaymentStatus.error('Error: ' + error_info.text);
      }
      UsiPaymentStatus.updateText("Transaction Completed");
    }
    if (evt.jsonObject.event.resource["receipt"]) {
      basePayment.modal = new UsiReceipt(basePayment.session, evt.jsonObject.event.resource);
    }
    if(basePayment.modal){
      basePayment.modal.process();
    }
  }
}

Payment.eventTypeFieldName = "type";
Payment.tags = {
  "8A" : [
    {"value":"00", "text":"Online approval"},
    {"value":"01", "text":"Referral requested by issuer"},
    {"value":"02", "text":"Refer to Issuer's special conditions"},
    {"value":"03", "text":"Invalid Merchant"},
    {"value":"04", "text":"Capture card"},
    {"value":"05", "text":"Online decline"},
    {"value":"06", "text":"Error"},
    {"value":"07", "text":"Pick Up Card, Special Conditions"},
    {"value":"08", "text":"Honor with identification"},
    {"value":"09", "text":"Request in Progress"},
    {"value":"10", "text":"Partial Amount Approved"},
    {"value":"11", "text":"VIP Approval"},
    {"value":"12", "text":"Invalid Transaction"},
    {"value":"13", "text":"Invalid Amount"},
    {"value":"14", "text":"Invalid Card Number"},
    {"value":"15", "text":"No Such Issuer"},
    {"value":"16", "text":"Approved, update track 3"},
    {"value":"17", "text":"Customer Cancellation"},
    {"value":"18", "text":"Customer Dispute"},
    {"value":"19", "text":"Re-enter Transaction"},
    {"value":"20", "text":"Invalid Response"},
    {"value":"21", "text":"No Action Taken (no match)"},
    {"value":"22", "text":"Suspected Malfunction"},
    {"value":"23", "text":"Unacceptable Transaction Fee"},
    {"value":"24", "text":"File Update not Supported by Receiver"},
    {"value":"25", "text":"Unable to Locate Record on File"},
    {"value":"26", "text":"Duplicate File Update Record"},
    {"value":"27", "text":"File Update Field Edit Error"},
    {"value":"28", "text":"File Update File Locked Out"},
    {"value":"29", "text":"File Update not Successful"},
    {"value":"30", "text":"Format Error"},
    {"value":"31", "text":"Bank not Supported by Switch"},
    {"value":"32", "text":"Completed Partially"},
    {"value":"33", "text":"Expired Card - Pick Up"},
    {"value":"34", "text":"Suspected Fraud - Pick Up"},
    {"value":"35", "text":"Contact Acquirer - Pick Up"},
    {"value":"36", "text":"Restricted Card - Pick Up"},
    {"value":"37", "text":"Call Acquirer Security - Pick Up"},
    {"value":"38", "text":"Allowable PIN Tries Exceeded"},
    {"value":"39", "text":"No CREDIT Account"},
    {"value":"40", "text":"Requested Function not Supported"},
    {"value":"41", "text":"Lost Card - Pick Up"},
    {"value":"42", "text":"No Universal Amount"},
    {"value":"43", "text":"Stolen Card - Pick Up"},
    {"value":"44", "text":"No Investment Account"},
    {"value":"51", "text":"Insufficient Funds"},
    {"value":"52", "text":"No Cheque Account"},
    {"value":"53", "text":"No Savings Account"},
    {"value":"54", "text":"Expired Card"},
    {"value":"55", "text":"Incorrect PIN"},
    {"value":"56", "text":"No Card Record"},
    {"value":"57", "text":"Trans. not Permitted to Cardholder"},
    {"value":"58", "text":"Transaction not Permitted to Terminal"},
    {"value":"59", "text":"Suspected Fraud"},
    {"value":"60", "text":"Card Acceptor Contact Acquirer"},
    {"value":"61", "text":"Exceeds Withdrawal Amount Limits"},
    {"value":"62", "text":"Restricted Card"},
    {"value":"63", "text":"Security Violation"},
    {"value":"64", "text":"Original Amount Incorrect"},
    {"value":"65", "text":"Exceeds Withdrawal Frequency Limit"},
    {"value":"66", "text":"Card Acceptor Call Acquirer Security"},
    {"value":"67", "text":"Hard Capture - Pick Up Card at ATM"},
    {"value":"68", "text":"Response Received Too Late"},
    {"value":"75", "text":"Allowable PIN Tries Exceeded"},
    {"value":"76", "text":"Previous message not found"},
    {"value":"77", "text":"Data does not match original message"},
    {"value":"78", "text":"NO ACCOUNT—account usisuspended, cancelled, or inactive."},
    {"value":"79", "text":"Already reversed (by Switch)"},
    {"value":"80", "text":"Invalid Date"},
    {"value":"81", "text":"Cryptographic failure"},
    {"value":"82", "text":"Incorrect CVV"},
    {"value":"83", "text":"Unable to verify PIN"},
    {"value":"84", "text":"Invalid authorization life cycle"},
    {"value":"85", "text":"No reason to decline"},
    {"value":"86", "text":"ATM Malfunction"},
    {"value":"87", "text":"No Envelope Inserted"},
    {"value":"88", "text":"Unable to Dispense"},
    {"value":"89", "text":"Administration Error"},
    {"value":"90", "text":"Cut-off in Progress"},
    {"value":"91", "text":"Issuer or Switch is Inoperative"},
    {"value":"92", "text":"Financial Institution Not Found"},
    {"value":"93", "text":"Trans Cannot be Completed"},
    {"value":"94", "text":"Duplicate Transmission"},
    {"value":"95", "text":"Reconcile Error"},
    {"value":"96", "text":"System Malfunction"},
    {"value":"97", "text":"Reconciliation Totals Reset"},
    {"value":"98", "text":"MAC Error"},
    {"value":"99", "text":"Reserved for National Use"},
    {"value":"B2", "text":"Surcharge amount not supported by debit network issuer."},
    {"value":"EB", "text":"CHECK DIGIT ERR"},
    {"value":"EC", "text":"CID FORMAT ERROR—format error."},
    {"value":"FR", "text":"FRAUD—Transaction declined because possible fraud was detected by Heartland."},
    {"value":"N0", "text":"Force STIP (VISA)"},
    {"value":"N3", "text":"Cash Service Not Available (VISA)"},
    {"value":"N4", "text":"Cash request exceeds issuer limit (VISA)"},
    {"value":"N5", "text":"Ineligible for resubmission"},
    {"value":"N7", "text":"Decline for CVV2 failure (VISA)"},
    {"value":"N8", "text":"Transaction amount exceeds preauthorized approval amount"},
    {"value":"P2", "text":"Invalid biller information (VISA)"},
    {"value":"P5", "text":"PIN Change Unblock Declined (VISA)"},
    {"value":"P6", "text":"Unsafe PIN (VISA)"},
    {"value":"PD", "text":"PARAMETER DOWNLOAD—EMV PDL system response. Response text indicates EMV PDL status code."},
    {"value":"Q1", "text":"Card Authentication failed"},
    {"value":"R0", "text":"Stop Payment Order"},
    {"value":"XA", "text":"Forward to issuer"},
    {"value":"XD", "text":"Forward to issuer"},
    {"value":"Y1", "text":"Offline approved"},
    {"value":"Y3", "text":"Unable to go online, offline approved"},
    {"value":"Z1", "text":"Offline declined"},
    {"value":"Z3", "text":"Unable to go online, offline declined"}
  ]
}
