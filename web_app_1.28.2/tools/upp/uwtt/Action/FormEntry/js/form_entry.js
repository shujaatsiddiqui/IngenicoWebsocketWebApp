class FormEntry{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    this.prompts = [];
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/FormEntry/form_entry.html', function(){
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
      FormEntry.table.addRow(type, id, that.selected_element_prompt);
    });

    $('#tab_logic').on('click', '.remove_table_data_tag', function() {
      var rowId = $(this).closest("tr").attr('id');
      $(this).closest("tr").remove();
      FormEntry.table.removeRow(rowId);
    });

    $("#delete_all").click(function() {
      FormEntry.table.removeAllRows();
    });

    $("#btn_add_row").click(function() {
      var type = Table.BUTTON;
      var id = $('#buttonId').val();
      var value = $('#buttonText').val();
      FormEntry.table.addRow(type, id, value, function(){
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
      FormEntry.table.addRow(type, id, value, function(){
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

    $("#selected_form").on('input', function(e) {
      FormEntry.table.generalData[Table.FORM] = $(this).val();
    });

    $('#qty_input').prop('disabled', true);
    $('#plus-btn').click(function() {
      $('#qty_input').val(parseInt($('#qty_input').val()) + 1);
      FormEntry.table.generalData[Table.TIMEOUT] = $('#qty_input').val();
    });

    $('#minus-btn').click(function() {
      $('#qty_input').val(parseInt($('#qty_input').val()) - 1);
      if ($('#qty_input').val() == 0) {
        $('#qty_input').val(1);
      }
      FormEntry.table.generalData[Table.TIMEOUT] = $('#qty_input').val();
    });

    $("#selected_input_type").on('input', function(e) {
      var selected = $(this).val();
      $('#typeSpecificRow').load('Action/FormEntry/InputType/' + selected + '.html', function(){
        that.inputType = InputTypeFactory.create(FormEntry.table, selected);
      });
    });

    $("#default_payment_form_btn").click(function() {
      FormEntry.defaultPaymentForm = FormEntry.table.buildResource();
    });

    $("#sendBtn").click(function() {
      that.sendClicked = true;
    });

   //----------------------------------
   if(FormEntry.table.generalData[Table.FORM]){
     $("#selected_form").val(FormEntry.table.generalData[Table.FORM]);
   }else {
     $("#selected_form").val('CELSWIPE.K3Z');
     FormEntry.table.generalData[Table.FORM] = $("#selected_form").val();
   }

   $('#typeSpecificRow').load('Action/FormEntry/InputType/' + $('#selected_input_type').val() + '.html', function(){
     that.inputType = InputTypeFactory.create(FormEntry.table, $('#selected_input_type').val());
   });

   var uri = location.pathname;
   var home_folder = uri.replace(uri.split("/").pop(), "");
   var promptFilePath = 'file://' + home_folder + 'data/PROMPT.XML';

   TextFile.read(promptFilePath, function(text) {
     that.parsePrompts(text, that);
   });

   FormEntry.table.build();
   that.updateGeneralFormFields();
  }

  prepareData(){
    var that = this;
    if(!that.sendClicked){
      return;
    }

    FormEntry.table.generalData[Table.TIMEOUT] = $('#qty_input').val();
    FormEntry.table.generalData[Table.FORM] = $('#selected_form').val();
    that.resource = FormEntry.table.buildResource();
  }

  onSend(){
    var that = this;
    if(!that.sendClicked){
      return;
    }

    that.session = new RequestSession(Settings.host, Settings.version, "form",
    function() {       // On connect
      that.session.send(that.resource);
    }, function(evt) { // On Rx
      console.log("Rx", evt.data);
      that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      var msg = new Message(evt.data);
      if(msg.isEvent()){
        that.viewEventInfo(msg, that.resource);
      }

      if(msg.status == "error" || msg.status == "completed"){ //form session is done
        that.formEntryDone = true;
      }
    }, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", that.session.endpoint)
    });

  }

  updateGeneralFormFields(){
    var that = this;
    if(FormEntry.table.generalData[Table.TIMEOUT] !== undefined){
        $('#qty_input').val(FormEntry.table.generalData[Table.TIMEOUT]);
    }

    if(FormEntry.table.generalData[Table.FORM] !== undefined){
        $('#selected_form').val(FormEntry.table.generalData[Table.FORM]);
    }
  }

  addPrompt(id, msg) {
    var that = this;
    if (id.value == "0") return;
    var opt_val = id.value + " " + msg.value;
    $('#prompts').append('<option id=' + id.value + ' ' + 'value="' + opt_val + '">');
    that.prompts[opt_val] = id.value;
  }


  viewEventInfo(msg, resource){
    if(msg.status == "completed"){
      if(resource.input){
        var view;
        if(resource.input.id == Table.PIN){
          view = new ViewText(msg.jsonObject.event.resource.pin_data);
        }else if(resource.input.id == Table.NUMERIC || resource.input.id == Table.ALPHANUMERIC){
          view = new ViewText(msg.jsonObject.event.resource.input_data);
        }else if(resource.input.id == Table.SIGNATURE && msg.jsonObject.event.resource.format == 'html5_png_base64'){
          view = new ViewImage(msg.jsonObject.event.resource.signature_captured);
        }else if(resource.input.id == Table.SIGNATURE && msg.jsonObject.event.resource.format == 'html5_point_array'){
          view = new ViewSignaturePad(msg.jsonObject.event.resource.signature_captured);
        }else if(resource.input.id == Table.SIGNATURE && msg.jsonObject.event.resource.format == 'legacy_3byte_ascii'){
          view = new ViewCanvas(msg.jsonObject.event.resource.signature_captured);
        } else if (resource.input.id == Table.SIGNATURE) {
          view = new ViewImage(msg.jsonObject.event.resource.signature_captured);
        }

        if(view){
          view.process();
        }
      }
    }
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

FormEntry.defaultPaymentForm = {
    "form": "CESWIPE.K3Z",
    "texts": [
        {
            "id": "PROMPT312",
            "label": "Please use card"
        }
    ]
};

FormEntry.table = new Table(false);
