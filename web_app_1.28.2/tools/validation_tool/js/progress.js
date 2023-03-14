function Progress() {}
Progress.set = function(progress, text) {
    $("#fileProgress")
        .attr('class', "progress-bar bar-progress progress-bar-striped progress-bar-animated")
        .css("width", progress + "%")
        .attr("aria-valuenow", progress)
        .text(text);
}

Progress.done = function(text) {
    $("#fileProgress")
        .css("width", 100 + "%")
        .attr("aria-valuenow", 100)
        .attr('class', 'progress-bar bg-success')
        .text(text);
}

Progress.failed = function(text) {
    $("#fileProgress")
        .attr('class', 'progress-bar bg-danger') 
        .css("width", 100 + "%")
        .attr("aria-valuenow", 100)
        .text(text);
}