/**
    @brief Set of functions for popup Settings window
 **/

function Settings(){
}

/*public static member*/
Settings.responseTimeoutSec = "5";

/*public static methods*/

Settings.onShow = function()
{
	$('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
}

Settings.onSave = function()
{
    Settings.responseTimeoutSec = $('#settingsRespTimeoutSec').val();
    $('#settings').modal('hide');
}

