
class Log {
  constructor(jsonFrameViewer) {
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process() {
    var that = this;
    $('#modal_content').load('Action/USI/Log/log.html', function () {
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
    if ($('#requestType').prop("value") == "getLoggingConfig") {
      that.resource["type"] = "config";
    } else if ($('#requestType').prop("value") == "startLogging") {
      that.resource["type"] = "start";
    } else if ($('#requestType').prop("value") == "stopLogging") {
      that.resource["type"] = "stop";
    } else if ($('#requestType').prop("value") == "deleteLogsFiles") {
      that.resource["type"] = "delete";
    }

  }

  sendData() {
    var that = this;
    that.session = new RequestSession(Settings.host, Settings.version, "log",
      function () {       // On connect
        that.session.send(that.resource);
      }, function (evt) { // On Rx
        that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
        that.session.disconnect();
      }, function (msg) { // On Tx
        that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
      }, function (err) { // On error
        that.tracer.traceText("WebSocket error", that.session.endpoint)
      });
  }

  onLoad() {
    var that = this;
    that.type = "";

    $(document).unbind("keyup").keyup(function (e) {
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if (code == 13) {
        $("#btn_log_send").click();
      }
    });

    $('#btn_log_send').on('click', function () {
      that.prepareResource();
      if (!jQuery.isEmptyObject(that.resource)) {
        that.sendData();
      }
    });

  }
}
