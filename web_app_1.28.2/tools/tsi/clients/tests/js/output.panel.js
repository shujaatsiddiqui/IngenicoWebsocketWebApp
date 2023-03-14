/**
    @brief Shows data on output windows
 **/

function OutputPanel() {}

OutputPanel.init = function()
{
	OutputPanel.view = document.getElementById("output");
}

OutputPanel.showArray = function(title, array)
{
	OutputPanel.showMessage("<h4>"+title+"</h4");
	if( Array.isArray(array) ) {
		for (var i = 0; i < array.length; i++) {
			OutputPanel.showObject("",array[i]);
		}
	} else {
		OutputPanel.showObject("",array);
	}

}

OutputPanel.showObject = function(title, obj)
{
	OutputPanel.showMessage("<h4>"+title+"</h4");
	var table = '<table class="output" style="width:100%;">';
	table += '<tr><td class="rounded"><pre>'+JSON.stringify(obj, null, 4)+'</pre></td><tr></table>';
	OutputPanel.showMessage(table);
}

OutputPanel.showMessage = function(message)
{
	OutputPanel.write('<span>'+message+'</span>');
}

OutputPanel.showError = function(message)
{
	OutputPanel.write('<h4><span class="error-message">'+message+'</span></h4>');
}

OutputPanel.write = function(message)
{
	var pre = document.createElement("p");
	pre.innerHTML = message;
	OutputPanel.view.appendChild(pre);
}
OutputPanel.clean = function()
{
	OutputPanel.view.innerHTML = "";
}
