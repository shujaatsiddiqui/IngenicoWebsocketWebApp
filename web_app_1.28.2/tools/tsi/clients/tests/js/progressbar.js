/**
    @brief Set of functions for progress bar
 **/

function Progress(){
}
/*public static member*/
Progress.set = function(progress, text)
{
	// check space for text
	if( progress < 0 && $("#progressbar").attr("aria-valuenow") < 15)
		$("#progressbar")
			.css("width", 15 + "%")
			.attr("aria-valuenow", 15)
	// error
	if( progress < 0  ) {
		var errorText = text == undefined ? "Error" : text;
		$("#progressbar")
			.attr('class', 'progress-bar bar-danger')
			.text(errorText);
	}
	// completed
	else if( progress == 100 ) {
		var completedText = text == undefined ? "Completed" : text;
		$("#progressbar")
			.css("width", progress + "%")
			.attr("aria-valuenow", progress)
			.attr('class', 'progress-bar bar-success')
			.text(completedText);
	}
	// progress
	else {
		var processingText = text == undefined ? "Processing ..." : text;
		$("#progressbar")
			.attr('class', "progress-bar bar-progress progress-bar-striped progress-bar-animated")
			.css("width", progress + "%")
			.attr("aria-valuenow", progress)
			.text(processingText);
	}
}
