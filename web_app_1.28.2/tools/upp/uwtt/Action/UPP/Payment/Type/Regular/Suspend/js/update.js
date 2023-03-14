class Update{
  constructor(session, type, onSend){

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#suspend_send_btn").click();
      }
    });

    // Tag table staff
    $('#commonAddMore').on('click', function() {
      var row = `<tr>
        <td><input type="text" name="tag[]" class="form-control"></td>
        <td><input type="text" name="encoding[]" class="form-control"></td>
        <td><input type="text" name="data[]" class="form-control"></td>
        <td><a href="javascript:void(0);" class="remove_update_tag" title="Remove Tag"><span class="oi oi-minus"></span></a></td>
      </tr>`;
      $('#common_tb').append(row);
    });

    $('#common_tb').on('click', '.remove_update_tag', function() {
      var trIndex = $(this).closest("tr").index();
      if (trIndex > 0) {
        $(this).closest("tr").remove();
      }
    });

    $("#suspend_send_btn").click(function() {

      var resource = {[Payment.eventTypeFieldName]:type};
      var amount = $('#common_amount_text').val();
      var cashback = $('#common_cashback_text').val();
      var payment_type = $('#common_payment_type').prop("value");

      if(amount !== ''){
        resource["amount"] = amount;
      }
      if(cashback !== ''){
        resource["cashback"] = cashback;
      }
      if(payment_type !== ''){
        resource["payment_type"] = payment_type;
      }

      //Table staff
      var cellNames = ['tag', 'encoding', 'data'];
      var tags = [];
      $('#common_tb tr').each(function () {
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
        resource["emv_tags"] = tags;
      }

      session.sendEvent(resource);
      onSend();
    });
  }
}
