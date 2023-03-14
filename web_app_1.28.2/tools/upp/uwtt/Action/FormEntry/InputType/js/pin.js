class Pin{
  constructor(table){
    var that = this;
    this.table_ = table;
    $("#input_add_row").click(function() {
      var prompt = $("#inputPrompt").val();
      var pan = $("#inputPan").val();
      var keyType = $("#inputKeyType").val();

      var keyIndex = $('#inputKeyIndex').val();
      keyIndex = parseInt(keyIndex);
      if(isNaN(keyIndex)){
        keyIndex = undefined;
      }

      var res = {"prompt": prompt, "pan":pan};
      var tbl_val = prompt + '; ' + pan + '; ';
      if(keyType != ''){
        res['key_type'] = keyType;
        tbl_val += keyType + '; ';
      }

      if(keyIndex){
        res['key_index'] = keyIndex;
        tbl_val += keyIndex;
      }

      that.table_.addRow(Table.INPUT, Table.PIN, tbl_val, function(){
        return res;
      });
    });
  }
}
