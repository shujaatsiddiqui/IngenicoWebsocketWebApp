/**

    @brief Shows the transaction obhect on the screen as a table
 **/

var output;

function uiInit()
{
	output = document.getElementById("output");
}

function showArray(title, array)
{
	for (i = 0; i < array.length; i++)
		showObject(title,array[i]);
}

function showObject(title, obj, color)
{
	var table = '<table style="width:50%"><caption style="text-align:left">'+title+'</caption>';
	table = addRowsTo(table, obj, 1) + '</table>';
	showMessage(table, color);
}
function addRowsTo(table, obj, indent)
{
	for( var prop in obj) {
		if( typeof obj[prop] == "function" || typeof obj[prop] === null) {
			continue;
		}
		else if (typeof obj[prop] == 'object') {
			table = table + '<tr><td style="text-indent: '+indent+'em;"><b>'+prop.toUpperCase()+'</b>:</td></tr>';
			table = addRowsTo(table, obj[prop], indent+1);
		} else {
			table = table + '<tr><td style="text-indent: '+(indent+1)+'em;">'+prop+'</td><td>'+obj[prop]+'</td></tr>';
		}
	}
	return table;
}

function showMessage(message, color)
{
	if( color == undefined )
		writeToScreen('<span style="color: green;">'+message+'</span>');
	else
		writeToScreen('<span style="color: '+color+';">'+message+'</span>');
}
function writeToScreen(message)
{
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}
function cleanScreen()
{
	output.innerHTML = "";
}
