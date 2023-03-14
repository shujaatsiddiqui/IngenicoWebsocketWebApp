class Numeric{
  constructor(table){
    var that = this;
    this.table_ = table;
    $("#input_add_row").click(function() {
      var prompt = $("#inputPrompt").val();
      var minLen = $("#inputMinLen").val();
      var maxLen = $("#inputMaxLen").val();
      var disp = $("#inputDisp").val();
      var fmt = $("#inputFmt").val();

      var tbl_val = prompt + '; ' + minLen + '; ' + maxLen + '; ' + disp + '; ' + fmt;
      that.table_.addRow(Table.INPUT, Table.NUMERIC, tbl_val, function(){
        return {"prompt": prompt, "min_length":minLen, "max_length":maxLen, "disp":disp, "format":fmt};
      });
    });
  }
}
