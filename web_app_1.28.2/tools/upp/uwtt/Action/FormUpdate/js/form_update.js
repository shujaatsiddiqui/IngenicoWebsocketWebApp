class FormUpdate{
  constructor(jsonFrameViewer, formAction){
    this.tracer = new Tracer(jsonFrameViewer);
    this.prompts = [];
    this.formAction = formAction;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/FormUpdate/form_update.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        that.prepareData();
        $('#modal_content').empty();
        that.onSend();
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });
  }

  onLoad(){
    var that = this;

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#sendBtn").click();
      }
    });


    $("#prompt_add_row").click(function() {
      var type = Table.ELEMENT;
      var id = $('#elementId').val();
      FormUpdate.table.addRow(type, id, that.selected_element_prompt);
    });

    $('#tab_logic').on('click', '.remove_table_data_tag', function() {
      var rowId = $(this).closest("tr").attr('id');
      $(this).closest("tr").remove();
      FormUpdate.table.removeRow(rowId);
    });

    $("#delete_all").click(function() {
      FormUpdate.table.removeAllRows();
    });

    $("#btn_add_row").click(function() {
      var type = Table.BUTTON;
      var id = $('#buttonId').val();
      var value = $('#buttonText').val();
      FormUpdate.table.addRow(type, id, value, function(){
        var visibility = "hide";
        if( $('#buttonVisibility').prop( "checked" )){
          visibility = "show";
        }
        return {"visibility": visibility};
      });
    });

    $("#img_add_row").click(function() {
      var type = Table.IMAGE;
      var id = $('#imgId').val();
      var value = $('#imgFile').val();
      FormUpdate.table.addRow(type, id, value, function(){
        var visibility = "hide";
        if( $('#imageVisibility').prop( "checked" )){
          visibility = "show";
        }
        return {"visibility": visibility};
      });
    });

    $("#selected_prompt").on('input', function(e) {
      if (that.prompts[$(this).val()] === undefined) {
        that.selected_element_prompt = $(this).val();
      } else {
        that.selected_element_prompt = that.prompts[$(this).val()];
      }
    });

    $("#sendBtn").click(function() {
      that.sendClicked = true;
    });

   //----------------------------------

   var uri = location.pathname;
   var home_folder = uri.replace(uri.split("/").pop(), "");
   var promptFilePath = 'file://' + home_folder + 'data/PROMPT.XML';

   TextFile.read(promptFilePath, function(text) {
     that.parsePrompts(text, that);
   });

   FormUpdate.table.build();
  }

  prepareData(){
    var that = this;
    if(!that.sendClicked){
      return;
    }

    that.resource = {"type":"update"};
    FormUpdate.table.addElements(that.resource);
  }

  sendFormUpdateRequest(){
    var that = this;
    var session = new RequestSession(Settings.host, Settings.version, "form",
    function() {       // On connect
      session.send(that.resource);
    }, function(evt) { // On Rx
      console.log("Rx", evt.data);
      that.tracer.traceJsonData(JSON.parse(evt.data), session.endpoint, true);
      var msg = new Message(evt.data);
      if(msg.isEvent()){
        that.viewEventInfo(msg, that.resource);
      }
    }, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), session.endpoint);
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", session.endpoint)
    });
  }

  onSend(){
    var that = this;
    if(!that.sendClicked){
      return;
    }

    if(that.formAction == null){
      that.sendFormUpdateRequest(); // creating session and sending requets
    }else if(that.formAction.formEntryDone){
      that.formAction.session.send(that.resource); // sending request within current session
    }else{ //event
      that.formAction.session.sendEvent(that.resource); // sending event within current session
    }
  }

  addPrompt(id, msg) {
    var that = this;
    if (id.value == "0") return;
    var opt_val = id.value + " " + msg.value;
    $('#prompts').append('<option id=' + id.value + ' ' + 'value="' + opt_val + '">');
    that.prompts[opt_val] = id.value;
  }

  parsePrompts(xml){
    var that = this;
    var en = $("Lang1", xml); //en
    var en_entires = $("NonEntry", en);
    var en_prompts = $("prompt", en_entires);

    $.each(en_prompts, function(i, curItem) {
      that.addPrompt(curItem.attributes.id, curItem.attributes.message);
    });
  }

}

FormUpdate.defaultPaymentForm = undefined;
FormUpdate.table = new Table(false);
