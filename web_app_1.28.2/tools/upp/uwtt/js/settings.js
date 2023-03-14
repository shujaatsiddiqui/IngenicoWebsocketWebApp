var EndpointModeEnum = {
   SINGLE:    0,
   MULTIPLE:  1
};

var ProtocolEnum = {
  UPP:   0,
  USI:   1
};

class Settings{
  constructor(){
  }

  process(){
    var that = this;
    fetch('config.txt')
      .then(response => response.text())
      .then(function(data){
        Settings.app = data})
      .then(function(){
        $('#modal_content').load('settings.html', function(){
          that.prepareData();
          $('#modal_dlg').one('hidden.bs.modal', function(){
            $('#modal_content').empty();
            that.onSend();
          });
          that.onLoad();
          $('#modal_dlg').modal();
        })
      })
  }

  prepareData(){
    if( Settings.app  == "USI" ){
      document.getElementById("settingsProtocol").selectedIndex = ProtocolEnum.USI;
      var x = document.getElementById("settingsProtocol");
      Settings.protocol = ProtocolEnum.USI;
      x.disabled = true;
      $("#application").text("USI");
      window.document.title = "UWTT - USI WS Test Tool";
    }else if( Settings.app  == "UPP" ){
      document.getElementById("settingsProtocol").selectedIndex = ProtocolEnum.UPP;
      var x = document.getElementById("settingsProtocol");
      Settings.protocol = ProtocolEnum.UPP; 
      x.disabled = true;
      $("#application").text("UPP");
      window.document.title = "UWTT - UPP WS Test Tool";
    }else{
      var x = document.getElementById("settingsProtocol");
      x.disabled = false;
      Settings.protocol = Cookie.get("protocol");
      if (Settings.protocol == 1) {
        // USI
        $("#application").text("USI");
        window.document.title = "UWTT - USI WS Test Tool";
      } else {
        // UPP
        $("#application").text("UPP");
        window.document.title = "UWTT - UPP WS Test Tool";
      }
    }

    Settings.host = Cookie.get("host");
    if( Settings.host == "" ){
      Settings.host = "ws://terminal:50000";
    }

    Settings.version = Cookie.get("version");
    if( Settings.version == ""){
      Settings.version = "v1";
    }

    Settings.responseTimeoutSec = Cookie.get("responseTimeoutSec");
    if( Settings.responseTimeoutSec == ""){
      Settings.responseTimeoutSec = "5";
    }

    Settings.flowIdLength = Cookie.get("flowIdLength");
    if( Settings.flowIdLength == ""){
      Settings.flowIdLength = "6";
    }

    Settings.jwtToken = Cookie.get("jwtToken");

    Settings.endpointMode = EndpointModeEnum.MULTIPLE;

    $('#settingHost').val(Settings.host);
    $('#settingVersion').val(Settings.version);
    $('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
    $('#flowIdLength').val(Settings.flowIdLength);
    $('#jwtToken').val(Settings.jwtToken);
    document.getElementById("settingsEndpointMode").selectedIndex = Settings.endpointMode;
    document.getElementById("settingsProtocol").selectedIndex = Settings.protocol;
  }

  onSend(){
  }

  onLoad(){
    $('#settingHost').val(Settings.host);
    $('#settingVersion').val(Settings.version);
    $('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
    $('#settingsFlowIDLength').val(Settings.flowIdLength);
    document.getElementById("settingsEndpointMode").selectedIndex = Settings.endpointMode;
    document.getElementById("settingsProtocol").selectedIndex = Settings.protocol;


    $('#saveBtn').on('click', function(){
      Settings.host = $('#settingHost').val();
      Settings.version = $('#settingVersion').val();
      Settings.responseTimeoutSec = $('#settingsRespTimeoutSec').val();
      Settings.endpointMode       = document.getElementById("settingsEndpointMode").selectedIndex;
      Settings.protocol           = document.getElementById("settingsProtocol").selectedIndex;
      Settings.flowIdLength       = $('#settingsFlowIDLength').val();
      Settings.jwtToken           = $('#jwtToken').val();
      if (Settings.protocol == 1) {
        $("#application").text("USI");
        window.document.title = "UWTT - USI WS Test Tool";
      } else {
        $("#application").text("UPP");
        window.document.title = "UWTT - UPP WS Test Tool";
      }

      var x = document.getElementById('security_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

      var x = document.getElementById('file_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

      var x = document.getElementById('update_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "block" : "none";

      var x = document.getElementById('log_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "block" : "none";

      var x = document.getElementById('upp_update_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

      var x = document.getElementById('upp_flow_id_section');
      x.style.display = (Settings.protocol == ProtocolEnum.USI ) ? "none" : "block";

      Cookie.set("host", Settings.host);
      Cookie.set("version", Settings.version);
      Cookie.set("responseTimeoutSec", Settings.responseTimeoutSec);
      Cookie.set("endpointMode", Settings.endpointMode);
      Cookie.set("protocol", Settings.protocol);
      Cookie.set("flowIdLength", Settings.flowIdLength);
      Cookie.set("jwtToken", Settings.jwtToken);

      console.log("Settings: Save cookies");
      Cookie.log();
    });
  }
}
Settings.app = "";
Settings.host = "ws://terminal:50000";
Settings.version = "v1";
Settings.responseTimeoutSec = "5";
Settings.endpointMode   = EndpointModeEnum.MULTIPLE;
Settings.protocol       = ProtocolEnum.UPP;
Settings.flowIdLength   = Cookie.get("flowIdLength");
Settings.jwtToken   = Cookie.get("jwtToken");

