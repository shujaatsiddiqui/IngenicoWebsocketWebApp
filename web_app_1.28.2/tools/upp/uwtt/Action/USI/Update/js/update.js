
//Used only with USI 
class UpdateRequestType {
  constructor(jsonFrameViewer) {
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process() {
    var that = this;
    $('#modal_content').load('Action/USI/Update/update.html', function () {
      $('#modal_dlg').one('hidden.bs.modal', function () {
        $('#modal_content').empty();
      });
      that.onLoad();
      $('#modal_dlg').modal();
    });

  }

  prepareResource() {
    var that = this;
    that.resource = {};
    if ($('#requestType').prop("value") == "getTmsParameters") {
      that.resource["type"] = "config";
    } else if ($('#requestType').prop("value") == "lastCall") {
      that.resource["type"] = "last_call";
    } else if ($('#requestType').prop("value") == "emCall") {
      that.resource["type"] = "em_call";
    } else if ($('#requestType').prop("value") == "setTmsParameters") {
      that.resource["type"] = "config";
      that.resource["tms_address"] = $('#tms_address').prop("value");
      that.resource["tcp_port"] = $('#tcp_port').prop("value");
      that.resource["ssl_profile"] = $('#ssl_profile').prop("value");
      that.resource["phone_number"] = $('#phone_number').prop("value");
      that.resource["network_type"] = $('#network_type').prop("value");
      that.resource["gprs_apn"] = $('#gprs_apn').prop("value");
      that.resource["ppp_login"] = $('#ppp_login').prop("value");
      that.resource["ppp_password"] = $('#ppp_password').prop("value");
      that.resource["contract_number"] = $('#contract_number').prop("value");

    }

  }

  sendData() {
    var that = this;
    that.continueAfterReset = false;
    that.session = new RequestSession(Settings.host, Settings.version, "update",
      function () {       // On connect
        that.session.send(that.resource);
      }, function (evt) { // On Rx
        var msg = new Message(evt.data);
        if (msg.isResponse()){
          if (msg.message.response.resource.error_info != undefined) {
            alert(msg.message.response.resource.error_info.facility);
          } 
        }
        if(msg.isEvent() && ((msg.status == "completed") || (msg.status == "error"))){
          that.continueAfterReset = true;
        }
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      }, function (msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
        if (that.continueAfterReset){
          that.session.disconnect();
        }
      }, function (err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
  }

  onLoad() {
    var that = this;
    that.type = "";

    if ($('#requestType').prop("value") == "setTmsParameters") {
      document.getElementById("SetTmsParametersCommand").style.display = "block";
    } else {
      document.getElementById("SetTmsParametersCommand").style.display = "none";
    }

    $('#requestType').on('change', function (event) {
      if (event.target.value == "setTmsParameters") {
        document.getElementById("SetTmsParametersCommand").style.display = "block";
      } else {
        document.getElementById("SetTmsParametersCommand").style.display = "none";
      }
    });

    $(document).unbind("keyup").keyup(function (e) {
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if (code == 13) {
        $("#btn_update_type_send").click();
      }
    });

    $('#btn_update_type_send').on('click', function () {
      that.prepareResource();
      if (!jQuery.isEmptyObject(that.resource)) {
        that.sendData();
      }
    });

  }
}
