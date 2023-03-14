class Wic{
  constructor(basePayment){
    this.basePayment = basePayment;
    this.stepName = '';
  }
  process(){
    var that = this;
    $('#type_container').load('Action/UPP/Payment/Type/WIC/wic_payment.html', function(){
      that.onLoad();
    });
  }

  onLoad(){
    var that = this;
    var basePayment = this.basePayment;

    $('#wicStates').focusin(function() {
      $(document).unbind("keyup");
    });

    $('#wicStates').focusout( function() {
      $(document).unbind("keyup").keyup(function(e){
        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if(code == 13)
        {
          $("#payment_send_btn").click();
        }
      });
    });


    $('#wicDateTime').val(Wic.date);

    var st = '';
    $.each( Wic.states, function( i, val ) {
      if(i != 0 ){
          st += '\n';
      }
      st += val;
    });
    $('#wicStates').val(st);

    $('#resume_suspended_btn').unbind('click').click(function(event) {
      that.modal = new WicSuspended(basePayment.session, that.stepName);
      that.modal.process();
    });


    Wic.buildItemTable();
    Wic.populateSuspendSteps(true);
  }

  buildResource(){
    var res;
    var tnx_type = $('#payment_tnx_type').prop("value");
    var wic_mode = $('#wicMode').prop("value");

    res = {"type":tnx_type};

    if(wic_mode !== ''){
      res["mode"] = wic_mode;
    }

    var val = $('#wicDateTime').val();
    if(val !== ''){ // not empty
      res["datetime"] = val;
      Wic.date = val;
    }

    val = $('#wicStates').val();
    if(val !== ''){ // not empty
      Wic.states = val.split('\n');
      res["states"] = Wic.states;
    }

    Wic.addSuspendStepsToResource(res, true);
    Wic.addTableDataToResource(res);

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
    var basePayment = this.basePayment;
    this.completionText = '';
    basePayment.modal = undefined;

    if(evt.status == "completed"){
      PaymentStatus.updateText("WIC Payment Completed " + this.completionText);
      basePayment.closeSession = true;
      $('#resume_suspended_btn').hide();
    }
    else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'missing_data'){
      PaymentStatus.updateText("Processing WIC Missing Data");
      basePayment.modal = new WicMissingData(basePayment.session);
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_completed'){
      PaymentStatus.updateText("WIC Transaction Completed");
      $('#resume_suspended_btn').hide();
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'suspend'){
      this.stepName = evt.jsonObject.event.resource.info.step_name;
      PaymentStatus.updateText("WIC Transaction Suspended at: " + this.stepName);
      basePayment.modal = new WicSuspended(basePayment.session, this.stepName);
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'card_read'){
      PaymentStatus.updateText("Card Processing");
    }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_started'){
      PaymentStatus.updateText("WIC Transaction Started");
      $('#resume_suspended_btn').show();
    }

    if(basePayment.modal){
      basePayment.modal.process();
    }
  }
}

Wic.populateSuspendSteps = function(restore){
  var columnCount = 3; //MAx 12
  var suspendStepNames = [
    "PIN", "Balance", "Debit", "End Balance", "End", "Remove"
  ];

  var suspendStepValues = [
    "pin", "balance", "debit", "end_balance", "end", "remove"
  ];

  var suspendId = 0;
  var rowCount = Math.ceil(suspendStepNames.length / columnCount);

  for (var row = 0; row < rowCount; row++) {
    var rowHtml = '<div class="row">'
    for (var col = 0; col < columnCount; col++) {
      if(suspendStepNames[suspendId]){
        rowHtml += '<div class="col-sm-' + 12/columnCount + '"><div class="custom-control custom-checkbox">';
        rowHtml += '<input type="checkbox" class="custom-control-input" id="suspendStep' + suspendId + '" value="' + suspendStepValues[suspendId] + '"/>';
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
    var checkbox = $('#suspendStep' + chb);
    if(restore){
      if(Wic.suspendSteps.includes(checkbox.val())){
        checkbox.prop('checked', true);
      }
    }
    this.suspendStepCheckBoxes.push(checkbox);
  }
}

Wic.buildItemTable = function(){
  // Tag table staff
  $('#wicMissingAddMore').on('click', function() {
    var row = `<tr>
      <td><input type="text" name="item[]" class="form-control"></td>
      <td><input type="number" name="value[]" class="form-control"></td>
      <td><a href="javascript:void(0);" class="remove_wic_tag" title="Remove Item"><span class="oi oi-minus"></span></a></td>
    </tr>`;
    $('#wicDebitTb').append(row);
  });

  $('#wicDebitTb').on('click', '.remove_wic_tag', function() {
    var trIndex = $(this).closest("tr").index();
    if (trIndex > 0) {
      $(this).closest("tr").remove();
    }
  });
}

Wic.addTableDataToResource = function(data, allowEmpty){
  //Table staff
  var cellNames = ['item', 'value'];
  $('#wicDebitTb tr').each(function () {
    var col = 0;
    var item = '';
    $('td', this).each(function () {
      var value = $(this).find(":input").val();
      if(col == 0){
        item = value;
      }
      else{
        var parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          if(data["debit"] == undefined ){
            data["debit"] = {};
          }
          data["debit"][item] = parsed;
        }
      }
      col++;
    });
  });

  if(data["debit"] == undefined && allowEmpty ){
    data["debit"] = {};
  }
}

Wic.addSuspendStepsToResource = function(data, save){
  var suspendSteps = [];
  $.each(this.suspendStepCheckBoxes, function( index, checkBox ) {
    if(checkBox.prop( "checked" )){
      suspendSteps.push(checkBox.val());
    }
  });

  if(save){
      Wic.suspendSteps = suspendSteps;
  }

  if(suspendSteps.length){
    data["suspend_steps"] = suspendSteps;
  }

}

Wic.date = '';
Wic.states = [];
Wic.suspendSteps = [];
