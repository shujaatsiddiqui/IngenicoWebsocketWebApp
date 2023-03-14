/**
    @brief Set of useful functions
 **/

function loadScript(url, callback)
{
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                script.readyState == "complete") { 
            		script.onreadystatechange = null;
                	callback();
            }
        };
    } else {  //Others
        script.onload = function(){callback();};
    }

    script.src = url;
	document.head.appendChild(script)
}

function stopTimer(timer)
{
	if( timer.handler != 0 )
		clearTimeout(timer.handler);
	timer.handler = 0;
}
