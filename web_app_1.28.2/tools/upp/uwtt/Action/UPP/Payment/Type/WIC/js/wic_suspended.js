class WicSuspended{
  constructor(session, stepName){
    this.session = session;
    this.stepName = stepName;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Payment/Type/WIC/wic_suspended.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        that.prepareData();
        $('#modal_content').empty();
        if(that.sendClicked){
          that.onSend();
        }
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });
  }

  onLoad(onLoaded){
    var that = this;
    that.sendClicked = false;

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#suspend_send_btn").click();
      }
    });

    $('#suspend_send_btn').click(function() {
      that.sendClicked = true;
    });

    if(that.stepName == ''){
      $("#suspendLabel").html('Transaction');
    }else{
        $("#suspendLabel").html('Suspended at: ' + that.stepName);
    }


    $("#suspended_cmd_type").on('input', function(e) {
      var type = $(this).prop("value");
      if(type != 'void' && type != 'block_card'){
        $('#suspendFieldContainer').load('Action/UPP/Payment/Type/WIC/wic_suspended_normal.html', function(){
          Wic.buildItemTable();
          Wic.populateSuspendSteps();
        });
      }else if(type == 'void'){
        $('#suspendFieldContainer').load('Action/UPP/Payment/Type/WIC/wic_suspended_void.html');
      }else if(type == 'block_card'){
        $('#suspendFieldContainer').load('Action/UPP/Payment/Type/WIC/wic_suspended_abort.html');
      }
    });

    $('#suspendFieldContainer').load('Action/UPP/Payment/Type/WIC/wic_suspended_normal.html', function(){
      Wic.buildItemTable();
      Wic.populateSuspendSteps();
    });

  }

  prepareData(){
    var type = $('#suspended_cmd_type').prop("value");
    this.resource = {[Payment.eventTypeFieldName]:type};

    if(type != 'void' && type != 'block_card'){
      var val = $('#wicDateTime').val();
      if(val !== ''){ // not empty
        this.resource["datetime"] = val;
      }

      Wic.addSuspendStepsToResource(this.resource);
      Wic.addTableDataToResource(this.resource);
    }else if(type == 'block_card'){
      this.resource["block_reason_code"] = $('#blockReason').val();
      var datetime = $('#reasonDateTime').val();
      if(datetime != ''){
        this.resource["datetime"] = $('#reasonDateTime').val();
      }
    }
  }

  onSend(){
    this.session.sendEvent(this.resource);
  }

}
