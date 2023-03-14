/**
    @brief Set of functions for popup Settings window
 **/

 var EndpointModeEnum = {
    SINGLE:    0,
    MULTIPLE:  1
 };

function Settings(){
}

/*public static member*/
Settings.server             = "ws://localhost:50000";
Settings.responseTimeoutSec = "5";
Settings.eventTimeoutSec    = "60";
Settings.endpointMode       = EndpointModeEnum.MULTIPLE;

/*public static methods*/
Settings.init = function ()
{
	console.log("Settings:Read cookies");
	Cookie.log();
	var server = Cookie.get("server");
	if( server != "")
		$('#settingsServer').val(server);
	else
		$('#settingsServer').val(Settings.server);
	Settings.server = $('#settingsServer').val();

	var responseTimeoutSec = Cookie.get("responseTimeoutSec");
	if( responseTimeoutSec != "")
		$('#settingsRespTimeoutSec').val(responseTimeoutSec);
	else
		$('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
	Settings.responseTimeoutSec = $('#settingsRespTimeoutSec').val();

	var eventTimeoutSec = Cookie.get("eventTimeoutSec");
	if( eventTimeoutSec != "" )
		$('#settingsEventTimeoutSec').val(eventTimeoutSec);
	else
		$('#settingsEventTimeoutSec').val(Settings.eventTimeoutSec);
	Settings.eventTimeoutSec = $('#settingsEventTimeoutSec').val();

  var endpointMode = Cookie.get("endpointMode");
  if( endpointMode == "" )
    endpointMode = EndpointModeEnum.MULTIPLE;
  Settings.endpointMode = endpointMode;
}

Settings.onShow = function()
{
	$('#settingsServer').val(Settings.server);
	$('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
	$('#settingsEventTimeoutSec').val(Settings.eventTimeoutSec);
  document.getElementById("settingsEndpointMode").selectedIndex = Settings.endpointMode;
}

Settings.onSave = function()
{
  Settings.server             = $('#settingsServer').val();
  Settings.responseTimeoutSec = $('#settingsRespTimeoutSec').val();
  Settings.eventTimeoutSec    = $('#settingsEventTimeoutSec').val();
  Settings.endpointMode       = document.getElementById("settingsEndpointMode").selectedIndex;

  Cookie.set("server", Settings.server);
  Cookie.set("responseTimeoutSec", Settings.responseTimeoutSec);
  Cookie.set("eventTimeoutSec", Settings.eventTimeoutSec);
  Cookie.set("endpointMode", Settings.endpointMode);
	
  console.log("Settings: Save cookies");
	Cookie.log();

  $('#settings').modal('hide');
}
