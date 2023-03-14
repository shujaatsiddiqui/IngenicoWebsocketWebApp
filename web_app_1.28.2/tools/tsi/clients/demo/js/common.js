
var baseURL = "http://localhost:8080";
var bpoll = false;
function getBaseURL()
{
	return baseURL;
}
var cookie = null;
function HTTPCall(method, url, msg, reqID, resID)
{
	var xmlHttp;
	try
	{    // Firefox, Opera 8.0+, Safari IE8   
		xmlHttp=new XMLHttpRequest();    
	}
	catch (e)
	{    // Internet Explorer    
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");     
		}
		catch (e)
		{      
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");     
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");        
				return false;        
			}      
		}    
	}  
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			// Get the data from the server's response
			addStringToResponse(resID, xmlHttp.responseText, xmlHttp.status);
			cookie = xmlHttp.getResponseHeader("Cookie");
		}
	};

	addStringToRequest(reqID, msg);
	xmlHttp.open(method, url, true);
	xmlHttp.setRequestHeader("Accept", "application/json");
	if(msg != null)
		xmlHttp.setRequestHeader("Content-Type", "application/json");
	if(false)
	{
		xmlHttp.setRequestHeader("Cookie", cookie);
		xmlHttp.setRequestHeader("Range", cookie);
		xmlHttp.setRequestHeader("drgdfgdfgddds", "header1");
	}
//	xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "localhost");
	xmlHttp.setRequestHeader("Expires", "Mon, 12 Jul 2010 03:00:00 GMT");
	xmlHttp.setRequestHeader("cache-Control", "no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma", "no-cache");
	xmlHttp.send(msg);
}

function GetData(method, url, msg, reqID, resID, func)
{
	var xmlHttp;
	try
	{    // Firefox, Opera 8.0+, Safari IE8   
		xmlHttp=new XMLHttpRequest();    
	}
	catch (e)
	{    // Internet Explorer    
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");     
		}
		catch (e)
		{      
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");     
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");        
				return false;        
			}      
		}    
	}  
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			// Get the data from the server's response
			addStringToResponse(resID, xmlHttp.responseText, xmlHttp.status);
			func(xmlHttp.status);
		}
	};

	xmlHttp.open(method, url, true);
	xmlHttp.setRequestHeader("Accept", "application/json");
	if(msg != null)
		xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.setRequestHeader("Expires", "Mon, 12 Jul 2010 03:00:00 GMT");
	xmlHttp.setRequestHeader("cache-Control", "no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma", "no-cache");
	xmlHttp.send(msg);
}

function addStringToRequest(reqID, str)
{ 
	var textArea = document.getElementById(reqID).value;
	document.getElementById(reqID).value = str + '\n' + textArea;
}

var responseCount = 0;
function addStringToResponse(resID, str, status)
{
	if(str==null)
		str = "no response";
	if ( str!= null && str.length == 0)
	{
		str = "empty response";
	}
	strCount = "" + (++responseCount);
	var textArea = document.getElementById(resID).value;
	document.getElementById(resID).value = strCount + ". " + str + "\nstatus=" + status + '\n' + textArea;
}
var timer;
function doCommandBase(fid, url, req, res)
{
	switch(fid)
	{
	case 0:
		url = url + "/Open";
		HTTPCall("POST", url, "", req, res);
		break;
	case 1:
		url = url + "/Close";
		HTTPCall("DELETE", url, null, req, res);
		break;
	case 2:
		url = url + "/Claim/50000";
		HTTPCall("PUT", url, "", req, res);
		break;
	case 3:
		url = url + "/Release";
		HTTPCall("PUT", url, "", req, res);
		break;
	case 4:
		url = url + "/DeviceEnabled/true";
		HTTPCall("PUT", url, "", req, res);
		break;
	case 5:
		url = url + "/DeviceEnabled/false";
		HTTPCall("PUT", url, "", req, res);
		break;
	case 6:
		url = url + "/Claim";
		HTTPCall("GET", url, null, req, res);
		break;
	case 7:
		url = url + "/DeviceEnabled";
		HTTPCall("GET", url, null, req, res);
		break;
	case 8:
		url = url + "/DirectIO/";
		HTTPCall("PUT", url, "", req, res);
		break;
	case 9:
		url = url + "/CheckHealthText";
		HTTPCall("GET", url, null, req, res);
		break;
	case 10:
		url = url + "/DeviceControlDescription";
		HTTPCall("GET", url, null, req, res);
		break;
	case 11:
		url = url + "/DeviceControlVersion";
		HTTPCall("GET", url, null, req, res);
		break;
	case 12:
		url = url + "/DeviceServiceDescription";
		HTTPCall("GET", url, null, req, res);
		break;
	case 13:
		url = url + "/DeviceServiceVersion";
		HTTPCall("GET", url, null, req, res);
		break;
	case 14:
		url = url + "/FreezeEvents/true";
		HTTPCall("PUT", url, null, req, res);
		break;
	case 15:
		url = url + "/FreezeEvents/false";
		HTTPCall("PUT", url, null, req, res);
		break;
	case 16:
		url = url + "/FreezeEvents";
		HTTPCall("GET", url, null, req, res);
		break;
	case 17:
		url = url + "/PhysicalDeviceDescription";
		HTTPCall("GET", url, null, req, res);
		break;
	case 18:////////EVENTS EVENTS////////////////////////////////////////////////////////
		url = url + "/pollUPOSEvent";
		bpoll = true;
		timer = setInterval(function(){StartPollingEvents(url);}, 1000);
		break;
	case 19:
		url = url + "/PhysicalDeviceName";
		HTTPCall("GET", url, null, req, res);
		break;
	case 20:
		url = url + "/State";
		HTTPCall("GET", url, null, req, res);
		break;
	case 21:
		var txt = document.getElementById('param1').value;
		url = url + "/CheckHealth/" + txt;
		HTTPCall("GET", url, null, req, res);
		break;
	default:
		alert("not implemented");

	}
}

function callBack(obj)
{
	var sel = document.getElementById("sel_ln");
	if (sel == null)
	{
		alert("select is null");
	}
	for( var i = 0; i < obj.JposEntry.length; i++)
	{
		var option = document.createElement("option");
		option.text = obj.JposEntry[i].logicalName;
		try
		{	
			sel.add(option, 0);
		}
		catch (e)
		{
			sel.add(option, null);
		}
	}
}

function GetLogicalNames(path)
{
	url = baseURL + path + "/ListDevice";
	GetData("GET", url, null, "reqID", "resID", "callBack");
}


function PollEvents(method, url, msg, str)
{
	var xmlHttp;
	try
	{    // Firefox, Opera 8.0+, Safari IE8   
		xmlHttp = new XMLHttpRequest();    
	}
	catch (e)
	{    // Internet Explorer    
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");     
		}
		catch (e)
		{      
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");     
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");        
				return false;        
			}      
		}    
	}  
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			// Get the data from the server's response
		//	eval(func + "(" + xmlHttp.responseText + ")");
		//	addStringToResponse(resID, xmlHttp.responseText, xmlHttp.status);
		}
	};
	xmlHttp.open(method, url, true);
	xmlHttp.setRequestHeader("Accept", "application/json");
	if(msg != null)
		xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.setRequestHeader("Expires", "Mon, 12 Jul 2010 03:00:00 GMT");
	xmlHttp.setRequestHeader("cache-Control", "no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma", "no-cache");
	xmlHttp.send(msg);
}


var count = 0;
function StartPollingEvents(url)
{
	HTTPCall("GET", url, null, "reqID", "resID");
	if(!bpoll)
	{
		clearInterval(timer);
	}
}

function stopPoll()
{
	bpoll = false;
}