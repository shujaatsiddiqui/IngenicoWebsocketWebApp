class Regular{
  constructor(basePayment){
    this.basePayment = basePayment;
    this.stepName = '';
	this.txnCloseSession=false;
    $( "div" ).remove(".modal-backdrop");
  }
  process(){
    var that = this;
    $('#type_container').load('Action/UPP/Payment/Type/Regular/regular_payment.html', function(){
      that.onLoad();
    });
  }

  onSuspendDataSent(){
    // Hide resume button on every send if transacrion have been completed.
    // If suspend event will be received it will be shown.
    if(this.transactionCompleted){ 
      PaymentStatus.updateText("Transaction Completed " + this.completionText);
      $('#resume_suspended_btn').hide();
    }
  }

  onLoad(){
    var actions = $("#apple-table-grid td:last-child").html();
    var that = this;
    var basePayment = this.basePayment;

    $('#vas_mode').on('change', function(event) {
      if (event.target.value == "signup") {
        $('#vas_push_data').show();
      } else {
        $('#vas_push_data').hide();
      }
    });

    $("#apple-table-grid tr").find(".add, .add").toggle();  

    $('#payment_smc_reader').click(function() {
      $("#suspendStepsRow").toggle();
      if(this.checked == true){
        $('#suspendStepsRow').toggleClass('hide', false);
      }else{
        $('#suspendStepsRow').toggleClass('hide', true);
      }
    });

    $('#resume_suspended_btn').unbind('click').click(function(event) {
      that.modal = new Suspended(basePayment.session, that.stepName, function(){
        that.onSuspendDataSent();
      });
      that.modal.process();
    });

    $('#apple_merch_table').on('click','.remove', function() {
      $(this).parents("tr").remove();
      $(".add-new-apple").removeAttr("disabled");
    });

    $('#apple_merch_table').on("click", ".edit", function(){		
      $(this).parents("tr").find("td:not(:last-child)").each(function(){
        $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
      });
      $(".add-new-apple").attr("disabled", "disabled");
      $(this).parents("tr").find(".add").toggle();
      $(this).parents("tr").find(".edit").toggle();
    })	

    $('#apple_merch_table').on("click", ".add", function(){
    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
      if(!$(this).val()){
        $(this).addClass("error");
        empty = true;
        } else{
          $(this).removeClass("error");
        }
      });
      $(this).parents("tr").find(".error").first().focus();
      if(!empty){
        input.each(function(){
          $(this).parent("td").html($(this).val());
        });			
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new-apple").removeAttr("disabled");
      }		
    });

    $(".add-new-apple").click(function(){
      $(this).attr("disabled", "disabled");
      var index = $("#apple-table-grid tr:last-child").index();
          var row = '<tr>' +
              '<td><input type="text" class="form-control" name="id" id="id"></td>' +
              '<td><input type="text" class="form-control" name="url" id="url"></td>' +
              '<td><input type="text" class="form-control" name="filter" id="filter"></td>' +
              '<td><input type="text" class="form-control" name="encrypt" id="encrypt"></td>' +
        '<td>' + actions + '</td>' +
          '</tr>';
      $("#apple_merch_table").append(row);		
      $("#apple-table-grid tr").eq(index + 1).find(".add, .edit").toggle();
      $("#apple-table-grid tr").eq(index + 1).find(".add, .add").toggle();
          $('[data-toggle="tooltip"]').tooltip();
    });

    $(".add-new-google").click(function(){
      $(this).attr("disabled", "disabled");
      var index = $("#google-table-grid tr:last-child").index();
          var row = '<tr>' +
              '<td><input type="text" class="form-control" name="id" id="id"></td>' +
              '<td><input type="text" class="form-control" name="store" id="store"></td>' +
              '<td><input type="text" class="form-control" name="pinpad" id="pinpad"></td>' +
              '<td><input type="text" class="form-control" name="name" id="name"></td>' +
              '<td><input type="text" class="form-control" name="language" id="language"></td>' +
              '<td><input type="text" class="form-control" name="category" id="category"></td>' +
              '<td><input type="text" class="form-control" name="filter" id="filter"></td>' +
        '<td>' + actions + '</td>' +
          '</tr>';
      $("#google_merch_table").append(row);		
      $("#google-table-grid tr").eq(index + 1).find(".edit").toggle();
          $('[data-toggle="tooltip"]').tooltip();
    });

    $('#google_merch_table').on("click", ".add", function(){
      var empty = false;
      var input = $(this).parents("tr").find('input[type="text"]');
          input.each(function(){
        if(!$(this).val()){
          $(this).addClass("error");
          empty = true;
          } else{
            $(this).removeClass("error");
          }
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
          input.each(function(){
            $(this).parent("td").html($(this).val());
          });			
          $(this).parents("tr").find(".add").toggle();
          $(this).parents("tr").find(".edit").toggle();
          //$(".add-new-google").removeAttr("disabled");
        }		
      });

      $('#google_merch_table').on('click','.remove', function() {
        $(this).parents("tr").remove();
        $(".add-new-google").removeAttr("disabled");
      });

      $('#google_merch_table').on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
          $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
          $(this).parents("tr").find(".edit").toggle();
          $(this).parents("tr").find(".add").toggle();
          $(".add-new-google").attr("disabled", "disabled");
        });	
      })	

    this.populateSuspendSteps();
  }

  buildResource(){

    var res;
    var tnx_type = $('#payment_tnx_type').prop("value");
    var payment_type = $('#payment_paymen_type').prop("value");
    var cless_mode = $('#payment_cless_mode').prop("value");
    var vas_mode = $('#vas_mode').prop("value");

    res = {"type":tnx_type};

    if(payment_type !== ''){
      res["payment_type"] = payment_type;
    }

    if(cless_mode !== ''){
      res["cless_mode"] = cless_mode;
    }

    if(vas_mode !== ''){
      var vas = {}
      vas["mode"] = vas_mode;
      var merchants = []
      var table = document.getElementById("apple_merch_table");
      if(table.rows.length > 1 ){
        for (var i = 1, row; row = table.rows[i]; i++) {
          var merch = {}
          merch["type"] = "apple";
          merch["id"] = row.cells[0].innerHTML;
          merch["url"] = row.cells[1].innerHTML;
          merch["category_filter"] = row.cells[2].innerHTML;
          merch["return_decrypt_pass_data"] = row.cells[3].innerHTML;
          merchants.push( merch )
        }
      }

      var table = document.getElementById("google_merch_table");
      if(table.rows.length > 1 ){
        for (var i = 1, row; row = table.rows[i]; i++) {
          var merch = {}
          merch["type"] = "google";
          merch["id"] = row.cells[0].innerHTML;
          merch["store_location"] = row.cells[1].innerHTML;
          merch["pinpad_id"] = row.cells[2].innerHTML;
          merch["name"] = row.cells[3].innerHTML;
          merch["name_language"] = row.cells[4].innerHTML;
          merch["category_code"] = row.cells[5].innerHTML;
          merch["filter"] = row.cells[6].innerHTML;
          merchants.push( merch )
        }
      }
      vas["merchants"] = merchants;

      if (vas_mode == 'signup') {
        var push_data = {}
        push_data["service_type"] = $('#vas_push_data_type').val();
        push_data["service_title"] = $('#vas_push_data_title').val();
        push_data["service_title_language"] = $('#vas_push_data_language').val();
        push_data["service_url"] = $('#vas_push_data_url').val();
        vas["push_data"] = [push_data];
      }

      res["vas"] = vas;
    }

    var amnt = $('#payment_amount').val();
    if(amnt !== ''){ // not empty{
      res["amount"] = amnt;
    }

    var cshbk = $('#payment_cashback').val();
    if(cshbk !== ''){ // not empty{
      res["cashback"] = cshbk;
    }

    var init_on_error = $('#prompt_card_removal_on_error').val();
    if(init_on_error !== ''){ // not empty{
      res["prompt_card_removal_on_error"] = init_on_error == 'true' ? true : false;
    }

    var readers = []; //"msr", "cless", "smartcard"
    if($('#payment_msr_reader').prop( "checked" )){
      readers.push("msr");
    }
    if($('#payment_cless_reader').prop( "checked" )){
      readers.push("cless");
    }
    if($('#payment_smc_reader').prop( "checked" )){
      readers.push("smartcard");
    }

    if(readers.length){
      res["enable_readers"] = readers;
    }

    var suspendSteps = "";
    $.each(this.suspendStepCheckBoxes, function( index, checkBox ) {
      if(checkBox.prop( "checked" )){
        var step = String.fromCharCode(65 + index);
        if(step == "T"){
          step = "U";
        }
        suspendSteps += step;
      }
    });

    if(suspendSteps != ""){
      res["suspend_steps"] = suspendSteps;
    }

    return res;
  }

  processPaymentData(data){
    var basePayment = this.basePayment;
    var msg = new Message(data);
    if(msg.isEvent()){
      this.processPaymentEvent(msg)
    } else if(msg.isResponse()){
      if(msg.status == "started"){
        this.txnCloseSession=false;
		PaymentStatus.updateText("Waiting For Card");
      }
      else if(msg.status == "error"){
        var error_info = msg.jsonObject.response.resource.error_info;
        PaymentStatus.error('Error: ' + error_info.text);
      }
    } else if (msg.isEventAck()){
      if (basePayment.pendingAuth) {
          // we received ACK on outgoing event but Authorization is still pending.
          // Hence, show the Authorization dialog again.
          PaymentStatus.updateText("Processing Authorization");
          basePayment.modal = new AuthRequest(basePayment);
          basePayment.modal.process();
      }
    }
  }

  processPaymentEvent(evt){
    var that = this;
    var basePayment = this.basePayment;
    this.completionText = '';
    basePayment.modal = undefined;
    if(evt.jsonObject.event.resource.info){
      if(evt.jsonObject.event.resource.info.step_name){
        this.stepName = evt.jsonObject.event.resource.info.step_name;
      }
    }
    if(evt.status == "completed"){
      $('#resume_suspended_btn').hide();
        if(evt.jsonObject.event.resource.source == 'msr'){  
          PaymentStatus.updateText("Payment Completed " + this.completionText);
          basePayment.closeSession = false;
        }
      else if(Settings.endpointMode == EndpointModeEnum.SINGLE){
        if(this.txnCloseSession){ 
            PaymentStatus.updateText("Payment Completed " + this.completionText);
            basePayment.closeSession = true;
        }
            this.txnCloseSession=true;
      }
      else{
          PaymentStatus.updateText("Payment Completed " + this.completionText);
          basePayment.closeSession = true;
        }
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'missing_data'){
      PaymentStatus.updateText("Processing Missing Data");
      $('#resume_suspended_btn').hide();
      basePayment.modal = new MissingData(basePayment.session, evt.jsonObject.event.resource.missing_data);
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'auth_request'){
      basePayment.pendingAuth = true;
      $('#resume_suspended_btn').hide();
      this.txnCloseSession=true;
      PaymentStatus.updateText("Processing Authorization");
      basePayment.modal = new AuthRequest(basePayment);
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_completed'){
      this.transactionCompleted = true;
      $('#resume_suspended_btn').hide();
      var emv_tags = evt.jsonObject.event.resource.emv_tags;
      if(Array.isArray(emv_tags)){
        for (let tag of emv_tags) {
          if(tag.tag == "8A"){
            for(let t of Payment.tags["8A"]){
              if(t.value == tag.data){
                this.completionText = t.text;
                PaymentStatus.updateText("Transaction Completed " + this.completionText);
                break;
              }
            }
            break;
          }
        }
      }else{
        PaymentStatus.updateText("Transaction Completed");
      }
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'suspend'){
      $('#resume_suspended_btn').show();
      PaymentStatus.updateText("Transaction Suspended at: " + evt.jsonObject.event.resource.info.step_name);
      basePayment.modal = new Suspended(basePayment.session, this.stepName, function(){
        that.onSuspendDataSent();
      });
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'card_read'){
      PaymentStatus.updateText("Card Processing");
      $('#resume_suspended_btn').hide();
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_started'){
      PaymentStatus.updateText("Transaction Started");
      $('#resume_suspended_btn').hide();
    } else if (evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'update_terminal_capabilities') {
      $('#resume_suspended_btn').hide();
      PaymentStatus.updateText("Processing update terminal capabilities");
      basePayment.modal = new UpdateTerminalCapabilities(basePayment.session);
    }

    if(basePayment.modal){
      basePayment.modal.process();
    }
  }

  populateSuspendSteps(){
    var columnCount = 3; //MAx 12
    var initCharCode = "A".charCodeAt(0);
    var suspendStepNames = [
      "(A) EMV Start",
      "(B) Select language service",
      "(C) Select AID service",
      "(D) Cardholder AID confirmation",
      "(E) Application final selection",
      "(F) Get amount application selection",
      "(G) Set proprietary tags at application selection",
      "(H) Read application data PAN ready",
      "(I) Set payment type",
      "(J) Get cash back amount",
      "(K) Read application data change amount",
      "(L) Amount confirmation",
      "(M) Account selection",
      "(N) Offline PIN entry",
      "(O) Online PIN entry",
      "(P) Last transaction data request",
      "(Q) Terminal action analysis",
      "(R) Online authorization in progress",
      "(S) EMV stop",
      "(U) EMV completion"
    ];

    var suspendId = 0;
    var rowCount = Math.ceil(suspendStepNames.length / columnCount);

    for (var row = 0; row < rowCount; row++) {
      var rowHtml = '<div class="row">'
      for (var col = 0; col < columnCount; col++) {
        if(suspendStepNames[suspendId]){
          rowHtml += '<div class="col-sm-' + 12/columnCount + '"><div class="custom-control custom-checkbox">';
          rowHtml += '<input type="checkbox" class="custom-control-input" id="suspendStep' + suspendId + '"/>';
          rowHtml += '<label class="custom-control-label" for="suspendStep' + suspendId + '">' + suspendStepNames[suspendId] + '</label>';
          rowHtml += '</div></div>';
        }
        suspendId++;
      }
      rowHtml += '</div>';
      $('#suspendStepContainer').append(rowHtml);
    }

    this.suspendStepCheckBoxes = [];
    for (var chb = 0; chb < suspendStepNames.length; chb++) {
      this.suspendStepCheckBoxes.push($('#suspendStep' + chb));
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
    {"value":"78", "text":"NO ACCOUNT—account suspended, cancelled, or inactive."},
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
