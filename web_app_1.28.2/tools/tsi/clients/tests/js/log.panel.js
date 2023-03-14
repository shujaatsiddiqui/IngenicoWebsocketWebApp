/**
    @brief show message on the log screen
 **/

function LogPanel()
{
	
}

LogPanel.init = function()
{
	LogPanel.view = document.getElementById("log");
}


LogPanel.write = function(message)
{
	var div = document.createElement("div");
	div.innerHTML = message;
	LogPanel.view.appendChild(div);
}

LogPanel.clean = function()
{
	LogPanel.view.innerHTML = "";
}
