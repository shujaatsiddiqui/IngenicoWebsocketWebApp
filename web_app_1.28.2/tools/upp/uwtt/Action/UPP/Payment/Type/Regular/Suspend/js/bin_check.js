class BinCheckSuspend{
  constructor(session, type, onSend){

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#suspend_send_btn").click();
      }
    });

    $("#suspend_send_btn").click(function() {
      
      var res = {"type": $('#payment_tnx_type').prop("value")};
      res["type"] = "bin_range_check";
      
      var bin_ranges = $('#bin_ranges').val();
      var bin_ranges_array = bin_ranges.split(',');
      res["bin_ranges"] = bin_ranges_array;

      session.sendEvent(res);
      onSend();
    });
  }
}
