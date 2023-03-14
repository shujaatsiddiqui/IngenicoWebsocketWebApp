/**

 @prototype Config

 @usage:

 (new Config).server_ip = "192.168.1.72"
 (new Config).server_credentials #=>  http://192.168.1.72:12001

 **/

function Config()
{
}

Config.prototype = (function(){
    var server_protocol  = "ws://";
    var server_ip        = "XXXX.XXXX.XXXX.XXXX";
    var server_port      = "50000";
    return {
        constructor: Config,
        get server_credentials() 
        {
            return server_protocol + server_ip + ':' + server_port;
        },
        set server_ip(ip) 
        {
            server_ip = ip;
        }
    };
})();
