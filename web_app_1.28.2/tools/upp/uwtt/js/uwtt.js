function UWTT() {

}

UWTT.init = function() {

  // jsonFrameViewer staff
  var jsonFrameViewer = new JsonEditor("json_viewer", $('#json_viewer_content'), true);
  jsonFrameViewer.set(); //clear editor
  jsonFrameViewer.setAutoScroll(true);

  $("#clear_btn").on('click', function() {
    jsonFrameViewer.set();
  });

  $("#auto_scroll_chbx").change(function() {
    if (this.checked) {
      jsonFrameViewer.setAutoScroll(true);
    } else {
      jsonFrameViewer.setAutoScroll(false);
    }
  });
  //------------------------------------------------------------------------
  
  // action staff
  var action;
  var formAction;

  Settings.host = Cookie.get("host");
  Settings.version = Cookie.get("version");
  Settings.responseTimeoutSec = Cookie.get("responseTimeoutSec");
  Settings.endpointMode = Cookie.get("endpointMode");
  Settings.protocol = Cookie.get("protocol");

  var x = document.getElementById('security_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI) ? "none" : "block";

  var x = document.getElementById('file_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI) ? "none" : "block";

  var x = document.getElementById('update_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI) ? "block" : "none";

  var x = document.getElementById('log_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI) ? "block" : "none";

  var x = document.getElementById('upp_update_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

  var x = document.getElementById('upp_flow_id_section');
  x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

  $('#payment_entry_btn').on('click', function() {
    action = Settings.protocol == ProtocolEnum.UPP ? new Payment(jsonFrameViewer) : new UsiPayment(jsonFrameViewer);
    action.process();
  });

  $('#form_update_btn').on('click', function() {
    action = new FormUpdate(jsonFrameViewer, formAction);
    action.process();
  });

  $('#form_entry_btn').on('click', function() {
    formAction = new FormEntry(jsonFrameViewer);
    action = formAction;
    action.process();
  });


  $('#device_btn').on('click', function() {
    action = new Device(jsonFrameViewer, function(){
      formAction = null;
      console.log("Device action done");
    });
    action.process();
  });

  $('#line_disp_entry_btn').on('click', function() {
    action = new LineDisplay(jsonFrameViewer);
    action.process();
  });

  //Used only with UPP
  $('#file_btn').on('click', function() {
    action = new File(jsonFrameViewer);
    action.process();
  });

  //Used only with USI 
  $('#log_btn').on('click', function() {
    action = new Log(jsonFrameViewer);
    action.process();
  });

  $('#config_btn').on('click', function() {
    action = new Configuration(jsonFrameViewer);
    action.process();
  });

  //Used only with UPP
  $('#security_btn').on('click', function() {
    action = new Security(jsonFrameViewer);
    action.process();
  });

  //Used only with UPP
  $('#upp_update_btn').on('click', function() {
    action = new UppUpdate(jsonFrameViewer);
    action.process();
  });

  $('#upp_flow_id_btn').on('click', function() {
    action = new UppFlowId(jsonFrameViewer);
    action.process();
  });

  $('#printing_btn').on('click', function() {
    action = new Printing(jsonFrameViewer);
    action.process();
  });

  $('#audio_btn').on('click', function() {
    action = new Audio(jsonFrameViewer);
    action.process();
  });

  $('#barcode_btn').on('click', function() {
    action = new Barcode(jsonFrameViewer);
    action.process();
  });

  //Used only with USI 
  $('#update_btn').on('click', function() {
    action = new UpdateRequestType(jsonFrameViewer);
    action.process();
  });


  $('#version_btn').on('click', function() {
    action = new VersionRequest(jsonFrameViewer);
    action.process();
  });



  //------------------------------------------------------------------------

  // UWTT settings
  $('#settingsAnchor').on('click', function() {
    action = new Settings();
    action.process();
  });
  //------------------------------------------------------------------------

  // Hidding resume suspended button. It will be shown if payment will be suspended
  $('#resume_suspended_btn').hide();
  //------------------------------------------------------------------------

};
