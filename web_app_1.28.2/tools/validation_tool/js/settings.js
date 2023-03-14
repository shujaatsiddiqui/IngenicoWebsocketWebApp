/**
    @brief Set of functions for popup Settings window
 **/

function Settings(){
}

/*public static member*/
Settings.responseTimeoutSec = "5";
Settings.benchmarkExecutionCount = "100";

/*public static methods*/

Settings.onShow = function()
{
	$('#settingsRespTimeoutSec').val(Settings.responseTimeoutSec);
  $('#settingsBenchmarkExecutionCount').val(Settings.benchmarkExecutionCount);
}

Settings.onSave = function()
{
    Settings.responseTimeoutSec = $('#settingsRespTimeoutSec').val();
    Settings.benchmarkExecutionCount = $('#settingsBenchmarkExecutionCount').val();
    $('#settings').modal('hide');
}
