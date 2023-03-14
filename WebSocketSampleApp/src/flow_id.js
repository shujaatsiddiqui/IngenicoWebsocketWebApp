/**
FlowId manipulation class
*/

function FlowId()
{
	
}

FlowId.generate = function()
{
	if (typeof Settings.flowIdLength == 'undefined') {
		Settings.flowIdLength = 6;
	} else if (parseInt(Settings.flowIdLength) == 0) {
		Settings.flowIdLength = 6;
	}

	Settings.flowIdLength = parseInt(Settings.flowIdLength);

	var firstNum = Math.floor(Math.random() * Math.floor(10));
	if (firstNum == 0) {
		firstNum = 1;
	}
	FlowId.current = firstNum.toString();
	for (i = 1; i < Settings.flowIdLength; i++) {
		FlowId.current += Math.floor(Math.random() * Math.floor(10)).toString();
	}

	return FlowId.current;
}

FlowId.getCurrent = function()
{
	return FlowId.current;
}

FlowId.setCurrent = function(message)
{
	if (message.request.flow_id != undefined){
		FlowId.current = message.request.flow_id;
		return true;
	}
	
	return false;
}

FlowId.current = FlowId.generate();



