
class WicMissingData{
  constructor(session){
    this.session = session;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Payment/Type/WIC/wic_missing_data.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        that.prepareData();
        $('#modal_content').empty();
        that.onSend();
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });

  }

  prepareData(){
    var that = this;
    this.resource = {[Payment.eventTypeFieldName]:"update"};
    Wic.addTableDataToResource(that.resource, true);
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
    Wic.buildItemTable();
  }
}
