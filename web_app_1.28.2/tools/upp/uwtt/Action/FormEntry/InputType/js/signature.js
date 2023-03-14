class Signature{
  constructor(table){
    var that = this;
    this.table_ = table;
    $("#input_add_row").click(function() {
      var prompt = $("#signaturePrompt").val();
	  var format =$("#signatureFormat").val();
	  var tbl_val = prompt + ";" + format;
      that.table_.addRow(Table.INPUT, Table.SIGNATURE, tbl_val, function(){
        return {"prompt": prompt, "format": format};
      });
    });
  }
}
