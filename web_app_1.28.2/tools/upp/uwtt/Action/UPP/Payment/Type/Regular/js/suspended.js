class Suspended{
  constructor(session, stepName, onSuspendDataSentCb){
    this.session = session;
    this.stepName = stepName;
    this.onSuspendDataSentCb = onSuspendDataSentCb;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Payment/Type/Regular/suspended.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        $('#modal_content').empty();
      });

      //that.onLoad();
      //$('#modal_dlg').modal();
      that.onLoad(function(){
        $('#modal_dlg').modal();
      });

    });

  }

  onLoad(onLoaded){
    var that = this;
    if(that.stepName == ''){
      $("#suspendLabel").html('Transaction');
    }else{
        $("#suspendLabel").html('Suspended at: ' + that.stepName);
    }

    $("#suspended_cmd_type").on('input', function(e) {
      var selected = $(this).prop("value");
      $('#suspended_cmd_type_specific_row').load('Action/UPP/Payment/Type/Regular/Suspend/' + that.getTypeHtmlName(selected) + '.html', function(){
        that.view = that.createObject(selected);
      });
    });

    $('#suspended_cmd_type_specific_row').load('Action/UPP/Payment/Type/Regular/Suspend/' + that.getTypeHtmlName($('#suspended_cmd_type').prop("value")) + '.html', function(){
      that.view = that.createObject($('#suspended_cmd_type').prop("value"));
      onLoaded();
    });
  }

  getTypeHtmlName(type){
    switch(type){
      case "read":      return "read";
      case "bin_check": return "bin_check";
      default: return "update";
    }
  }

  createObject(type){
    switch(type){
      case "read" :      return new Read(this.session, this.onSuspendDataSent);
      case "bin_check" : return new BinCheckSuspend(this.session, this.onSuspendDataSent);
      default :
        var that = this;
        return new Update(that.session, type, function(){
          if(that.onSuspendDataSentCb){
            console.log( "Suspended::Update::onSuspendDataSentCb");
            that.onSuspendDataSentCb();
          }
        });
    }
  }

  onSuspendDataSent(){
  }

}
