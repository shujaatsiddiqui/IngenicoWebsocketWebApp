class Tracer{
	constructor(jsonViewer, foldObjects){
		this.jsonViewer_ = jsonViewer;
		this.foldObjects = foldObjects;
	}

	date(){
		var d = new Date();
		var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " +
				("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2)  + "." + ("0" + d.getMilliseconds()).slice(-3);
		return datestring;
	}

	traceJsonData(data, endpoint, fromTerminal){
		var dir = "[Client --> Terminal]";
		if(fromTerminal){
			dir = "[Terminal --> Client]";
		}

		this.jsonViewer_.append_info('"[' + this.date() + '] ' + dir + ' ' + endpoint + '"');
		var row = this.jsonViewer_.append(data);

		if(this.foldObjects){
			var editor = this.jsonViewer_.editor();
			var session = editor.getSession();

			var Search = ace.require('ace/search').Search;

			var rg = session.getFoldWidgetRange(row);

			var search = new Search().set({
				backwards: false,
				wrap: false,
				caseSensitive: true,
				wholeWord: true,
				regExp: false,
				range: rg
			});

			for (var i in this.foldObjects) {
				search.set({
					needle : this.foldObjects[i],
				});

				rg = search.find(session);
				if(rg){
					rg = session.getFoldWidgetRange(rg.start.row);
					if(rg){
						session.addFold("...", rg);
					}
				}
			}
		}
	}

	traceText(text, endpoint){
		text = '"[' + this.date() + '] ' + endpoint + ' TRACE: ' + text + '"';
	this.jsonViewer_.append_info(text);
	}
}
