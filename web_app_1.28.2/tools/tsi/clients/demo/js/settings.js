/**
    @brief Set of functions for popup Settings window
 **/

function Settings(){
}

Settings.server  = "ws://localhost:50000";

Settings.onShow = function()
{
	console.log("Settings.onShow $.cookie('server') ="+$.cookie("server") );
	if( $.cookie("server") != undefined && $.cookie("server") != '')
		Settings.server = $.cookie("server");
	$('#settingsServer').val(Settings.server);
}

Settings.onSave = function()
{
    Settings.server  = $('#settingsServer').val();
	$.cookie("server", Settings.server);
    $('#settings').modal('hide');
}

