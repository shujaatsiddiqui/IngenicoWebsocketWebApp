/**
FlowId manipulation class
*/

function FlowId()
{

}

FlowId.generate = function()
{
	FlowId.current = Math.floor(Math.random() * Math.floor(1000000)).toString();
	return FlowId.current;
}

FlowId.getCurrent = function()
{
	return FlowId.current;
}

FlowId.setCurrent = function(message)
{
	var obj = message.request;
	if(obj === undefined){
		obj = message.event;
	}

	if(obj === undefined ){
		return false;
	}

	if(obj.flow_id != undefined){
		FlowId.current = obj.flow_id;
		return true;
	}

	return false;
}

FlowId.current = FlowId.generate();
