    /**

    @author www.w3schools.com
	https://www.w3schools.com/js/js_cookies.asp
 **/
function Cookie()
{
	
}

Cookie.set = function(cname, cvalue, exdays) {
	if( exdays != undefined ) {
		var d = new Date();
    	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    	var expires = "expires="+d.toUTCString();
    	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	else
    	document.cookie = cname + "=" + cvalue + ";" + "path=/";
}

Cookie.get = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

Cookie.log = function()
{
	console.log("Cookies:"+document.cookie);
}