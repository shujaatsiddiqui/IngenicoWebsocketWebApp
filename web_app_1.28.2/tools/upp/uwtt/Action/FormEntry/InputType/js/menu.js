class Menu{
  constructor(table){
    var that = this;
    this.table_ = table;

    $('#menuItems').focusin(function() {
      $(document).unbind("keyup");
    });

    $('#menuItems').focusout( function() {
      $(document).unbind("keyup").keyup(function(e){
        var code = e.which; // recommended to use e.which, it's normalized across browsers
        if(code == 13)
        {
          $("#sendBtn").click();
        }
      });
    });

    $("#input_add_row").click(function() {
      var text = $('#menuItems').val();
      var prompt = $('#inputPrompt').val();
      var items = text.split('\n');

      var defEntry = $('#defSelEntry').val();
      defEntry = parseInt(defEntry);
      if(isNaN(defEntry)){
        defEntry = 0;
      }

      that.table_.addRow(Table.INPUT, Table.MENU, prompt + '; ' + text, function(){
        return {"prompt":prompt, "default_selected_entry" : defEntry, "menu_items": items};
      });
    });
  }
}
