/**
    @brief Provides UI function
 **/

function uiInit()
{
	// initialize the screen panels
	InputPanel.init();
	OutputPanel.init();
	LogPanel.init();

	// initialize settings dialog by default value
	Settings.init();

	// initialize signature dialog
	Signature.init();

	// initialize the end-points commbo-box
	initEndPoints();
}

/**
    @brief initialize the list of end-points for gui
 **/
 function initEndPoints()
 {
 	// Init the "endPoint" list from endPointMap
 	var savedEndPoint = Cookie.get("endPoint");
 	var dropdownMenuButton = document.getElementById('endPoint');
 	var endPoints = document.getElementById("endPoints");
 	for (i = 0; i < endPointMap.length; i++) {
         var a = '<a class="dropdown-item" \
 					href="#" \
 					onclick="document.getElementById(\'endPoint\').innerHTML=this.innerHTML; onEndPointChanged()" \>'
 					+endPointMap[i].endPointName+'</a>';
 		endPoints.innerHTML+=a;
 		if( savedEndPoint == endPointMap[i].endPoint )
 			dropdownMenuButton.innerHTML = endPointMap[i].endPointName;
 	}
 	if( dropdownMenuButton.innerHTML == "")
 		dropdownMenuButton.innerHTML = endPointMap[0].endPointName;

 	onEndPointChanged();
 }

/**
    @brief update list of available types for particular end-point
 **/
function onEndPointChanged()
{
	var selectedEndPointName = document.getElementById("endPoint").innerHTML;
	var types    = document.getElementById("type");
	// clean type list
	types.length = 0;

	// add types (command id) coresponding to the selected end-point
	// forEach version
	endPointMap.forEach(function(endpItem) {
		if( endpItem.endPointName == selectedEndPointName ) {
			document.getElementById("typeTitle").innerHTML = endpItem.uiTypeTitle;
			endpItem.types.forEach(function(type) {
				var option = document.createElement("option");
				option.value = type.value;
				option.text  = type.name;
				types.add(option);
			});
		}
	});
	// update GUI input fields
	onTypeChanged();
}

/**
    @brief update the InputPanel with inputs element for particular type
 **/
function onTypeChanged()
{
	InputPanel.clean();

	// show the input parameters related to the particular type
	var type = document.getElementById("type").value;
	insertInputParam(0, type, rootParamMap);
}

/**
    @brief update the InputPanel with elements related to type "purchase_level_2"
 **/
function onPurchaseLevel2Changed()
{
	var id = "purchase_level_2";
	var htmlElem = document.getElementById(id);
	var type     = document.getElementById("type").value;
	var elem     = rootParamMap.filter(function(inpt) {return inpt.key == id;});
	var inputs   = filterInputParamApplicableFor(type, elem[0].object);

	if( htmlElem.value == "") {
		var index = InputPanel.getIndex(inputs[0].key);
		InputPanel.cleanRange(index, index+inputs.length-1);
	}
	else {
		var index = InputPanel.getIndex(id);
		insertInputParam(index+1, type, inputs);
	}
}

/**
    @brief update the InputPanel with elements related to type "token_request"
 **/
function onTokenRequestChanged()
{
	var id = "token_request";
	var htmlElem     = document.getElementById(id);
	var type         = document.getElementById("type").value;
	var elem         = rootParamMap.filter(function(inpt) {return inpt.key == id;});
	var exclusive    = filterInputParamApplicableFor(type, elem[0].mutuallyExclusive);
	var related      = filterInputParamApplicableFor(type, elem[0].related);

	if( htmlElem.value == "") { // None
		// remove related fields
		if( related.length > 0 ) {
			var index = InputPanel.getIndex(related[0].key);
			InputPanel.cleanRange(index, index+related.length-1);
		}
		// insert exclusive fields
		if( exclusive.length > 0 ) {
			var index = InputPanel.getIndex(id);
			insertInputParam(index+1, type, exclusive);
		}
	}
	else {						// Yes
		// remove exclusive fields
		if( exclusive.length > 0 ) {
			var index = InputPanel.getIndex(exclusive[0].key);
			InputPanel.cleanRange(index, index+exclusive.length-1);
		}
		// insert related fields
		if( related.length > 0 ) {
			var index = InputPanel.getIndex(id);
			insertInputParam(index+1, type, related);
		}
	}
}

function insertInputParam(index, type, inputs)
{
	var filteredInputs = filterInputParamApplicableFor(type, inputs);
	var totalLen = filteredInputs.length;

	// show it on the screen
	for (var i = 0; i < filteredInputs.length; i++) {
		var inputElement = filteredInputs[i];
		var key               = inputElement.key;
		var value             = inputElement.value;
		var input             = inputElement.input;
		var object            = inputElement.object;
		var mutuallyExclusive = inputElement.mutuallyExclusive;

		InputPanel.insertTheElement(index, input);
		index++;

		var elm = document.getElementById(key);
		elm.value = value;

		if( inputElement.onLoad ){
			inputElement.onLoad( value );
		}

		// mutuallyExclusive param
		if( value == "" && mutuallyExclusive != undefined ) {
			var insertLen = insertInputParam(index,type, mutuallyExclusive);
			totalLen += insertLen;
			index += insertLen;
		}

		// insert fields if this is an object
		if( value != "" && object != undefined) {
			var insertLen = insertInputParam(index,type, object);
			totalLen += insertLen;
			index += insertLen;
		}
	}
	return totalLen;
}

function generateInputResourceFor(type, resource, inputs)
{
	// get the input parameters related to the transaction type
	var filteredInputs = filterInputParamApplicableFor(type, inputs);

	// provides the input parameters for specific transaction type
	// values take from UI or set default if no UI defined

	for (var i = 0; i < filteredInputs.length; i++) {		// for all parameters
		var inputElement = filteredInputs[i];
		var key   = inputElement.key;
		var value = document.getElementById(key).value		// value from GUI
		//inputElement.value = value;						// store the value

		if( inputElement.customRequest ) {
			try {
				return inputElement.convertValue == undefined ? JSON.parse(value) : inputElement.convertValue(value);
			}
			catch(err) {
				OutputPanel.showError(err);
			}
			throw "Exception during the parse the custom request";
		}
		if( value == "" && inputElement.mutuallyExclusive != undefined) {
			resource = generateInputResourceFor(type, resource, inputElement.mutuallyExclusive);
		}
		if( value != "" && inputElement.related != undefined) {
			resource = generateInputResourceFor(type, resource, inputElement.related);
		}

		if( value != "") {
			value = inputElement.convertValue == undefined ? value : inputElement.convertValue(value);
			if( inputElement.object == undefined ) {
				resource[key]=value;						// set key:value
			} else {										// else set key:object
				resource[key]=generateInputResourceFor(type, {}, inputElement.object);
			}
		}
		else if( inputElement.alwaysSend == true || inputElement.emptyZero == true ) {		// always add the key:value
			resource[key] = inputElement.convertValue == undefined ? value : inputElement.convertValue(value);
		}
	}

	return resource;
}

function filterInputParamApplicableFor(type, inputs)
{
	//filtering and return the array of elements only for corresponding transaction type

	// unfortunatly not all version of javascript supports this short line
	//return inputMap.filter(inpt => inpt.aplicableFor.find(t => t==type) == type);

	// use this instead
    if(inputs === undefined || inputs.length === 0) {
        return [];
    }
	return inputs.filter(function(inpt) {return inpt.aplicableFor.find(function(t) {return t==type;}) == type;});
}

/**
    @brief do a transaction with input elements
 **/
function getInputAndDoTransaction()
{
	// Get server parameters

	var parameters;
	var server              = Settings.server;
	var endPointName        = document.getElementById("endPoint").innerHTML;
	var endPoint			= (endPointMap.find(function(elem) {return elem.endPointName==endPointName;})).endPoint;
	var responseTimeoutSec  = Settings.responseTimeoutSec;
	var eventTimeoutSec     = Settings.eventTimeoutSec;

	Cookie.set("endPoint",endPoint);

	// Get input parameters from GUI

	OutputPanel.clean();
	LogPanel.clean();

	try {
		var type       = document.getElementById("type").value;
		var parameters = generateInputResourceFor(type, {type:type}, rootParamMap);

		var customRequest = (parameters.hasOwnProperty('request') || parameters.hasOwnProperty('event')) ? true : false;
		// Do transaction
		Transaction.do(server, endPoint, parameters, responseTimeoutSec*1000, eventTimeoutSec*1000, customRequest);
	}
	catch(err) {OutputPanel.showError(err)};
}


function setInputMask(id) {
	id = "#" + id;
	$(id).inputmask({ alias : "currency",  groupSeparator : "", prefix : "", rightAlign : false });
}

function unmaskAmount(id) {
	id = "#" + id;
	var val = $(id).inputmask('unmaskedvalue');
	return val ? ( val * 100 ).toFixed() : 0;
}
