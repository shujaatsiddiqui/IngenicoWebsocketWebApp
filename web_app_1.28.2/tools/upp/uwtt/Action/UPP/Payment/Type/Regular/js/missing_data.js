
class MissingData{
  constructor(session, missingDataArray){
    this.session = session;
    this.missingDataArray = missingDataArray;

    var that = this;
    that.manualEntryMode = false;
    $.each(that.missingDataArray, function(i, value) {
      if(value == "fields"){
        that.manualEntryMode = true;
        return false;
      }
    });
    $( "div" ).remove( ".modal-backdrop" );
  }

  process(){
    var that = this;
    var content = 'Action/UPP/Payment/Type/Regular/missing_data.html';
    if(that.manualEntryMode){
      content = 'Action/UPP/Payment/Type/Manual/manual_entry_missing_data.html';
    }


    $('#modal_content').load(content, function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        if(that.manualEntryMode){
          that.prepareManulaEntryData();
        }else {
          that.prepareData();
        }

        $('#modal_content').empty();

        that.onSend();
      });

      if(that.manualEntryMode){
        that.onManualEntryLoad();
      }else {
        that.onLoad();
      }

      $('#modal_dlg').modal();
    });

  }

  prepareManulaEntryData(){
    this.resource = {[Payment.eventTypeFieldName]:"update"};
    var fields = $('#missing_manual_entry_type').val();
    this.resource["fields"] = fields.split(',');
  }

  onManualEntryLoad(){
    this.bindEnterKey();
  }

  prepareData(){
    this.resource = {[Payment.eventTypeFieldName]:"update"};
    var amount = $('#missing_amount_text').val();
    var cashback = $('#missing_cashback_text').val();
    var payment_type = $('#missing_payment_type').prop("value");

    if(amount !== ''){
      this.resource["amount"] = amount;
    }
    if(cashback !== ''){
      this.resource["cashback"] = cashback;
    }
    if(payment_type !== ''){
      this.resource["payment_type"] = payment_type;
    }

    //Table staff
    var cellNames = ['tag', 'encoding', 'data'];
    var tags = [];
    $('#missingTb tr').each(function () {
      var obj = {};
      var index = 0;
      $('td', this).each(function () {
        var value = $(this).find(":input").val();
        if(cellNames[index]){
          obj[cellNames[index]] = value;
        }
        index++;
      });

      if(!jQuery.isEmptyObject(obj)){
        tags.push(obj);
      }
    });

    if(tags.length){
      this.resource["emv_tags"] = tags;
    }

  }

  onSend(){
    this.session.sendEvent(this.resource);
  }

  bindEnterKey(){
    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#missing_data_send_btn").click();
      }
    });
  }

  onLoad(){
    this.bindEnterKey();

    $('#missing_amount_text').val('');
    $('#missing_cashback_text').val('');
    $('#missing_payment_type').val('');

    $('#missing_amount_label').css('color', 'black');
    $('#missing_cashback_label').css('color', 'black');
    $('#missing_type_label').css('color', 'black');
    $('#tag_table_label').css('color', 'black');

    $.each(this.missingDataArray, function(i, value) {
      if(value == "amount"){
        $('#missing_amount_label').css('color', 'red');
      }
      if(value == "cashback"){
        $('#missing_cashback_label').css('color', 'red');
      }
      if(value == "payment_type"){
        $('#missing_type_label').css('color', 'red');
      }
      if(value == "emv_tags"){
        $('#tag_table_label').css('color', 'red');
      }
    });

    // Tag table staff
    $('#missingAddMore').on('click', function() {
      var row = `<tr>
        <td><input type="text" name="tag[]" class="form-control"></td>
        <td><input type="text" name="type[]" class="form-control"></td>
        <td><input type="text" name="format[]" class="form-control"></td>
        <td><input type="text" name="data[]" class="form-control"></td>
        <td><a href="javascript:void(0);" class="remove_missing_data_tag" title="Remove Tag"><span class="oi oi-minus"></span></a></td>
      </tr>`;
      $('#missingTb').append(row);
    });

    $('#missingTb').on('click', '.remove_missing_data_tag', function() {
      var trIndex = $(this).closest("tr").index();
      if (trIndex > 0) {
        $(this).closest("tr").remove();
      }
    });
  }
}
