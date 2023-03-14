/**
    @brief Provides UI function to show input parameters
 **/

function InputPanel()
{
}

InputPanel.init = function()
{
	InputPanel.table = document.getElementById("input");
	InputPanel.initialRows = InputPanel.table.rows.length;
}

InputPanel.len = function()
{
	return InputPanel.table.rows.length;
}

InputPanel.addTheElement = function(inpt)
{
	InputPanel.insertTheElement(InputPanel.len(), inpt)
}

InputPanel.insertTheElement = function(idx, inpt)
{
	InputPanel.table.insertRow(idx).innerHTML=inpt;
}

InputPanel.getIndex = function(id)
{
	for(var idx = 0; idx<InputPanel.len(); idx++) {
		var input = InputPanel.table.rows[idx].cells[1].innerHTML.trim();
		var div = document.createElement('div');
		div.innerHTML = input;
		if( div.firstChild.id == id)
			return idx;
	}
	return -1;
}

InputPanel.clean = function()
{
	var rows = InputPanel.len();
	while(rows>InputPanel.initialRows) {
		InputPanel.table.deleteRow(rows-1);
		rows = InputPanel.len();
	}
}
InputPanel.cleanRange = function(fromRowIdx, toRowIdx)
{
	if( toRowIdx < InputPanel.len() )
		for(var i=toRowIdx; i>=fromRowIdx; i--)
			InputPanel.table.deleteRow(i);
}
