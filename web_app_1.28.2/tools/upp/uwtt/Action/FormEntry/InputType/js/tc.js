class TC{
  constructor(table){
    var that = this;
    this.table_ = table;

    $('#tcTextFieldId').focusin(function() {
      $(document).unbind("keyup");
    });

    $('#tcTextFieldId').focusout( function() {
      $(document).unbind("keyup").keyup(function(e){
        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if(code == 13)
        {
          $("#sendBtn").click();
        }
      });
    });

    $("#input_add_row").click(function() {
      var textFieldId = $('#tcTextFieldId').val();
      var json = {"text_file_id" : textFieldId} 
      that.table_.addRow(Table.INPUT, Table.TC, "TC"+textFieldId+".XML", function(){
        return json;
      });
    });
  }
}
