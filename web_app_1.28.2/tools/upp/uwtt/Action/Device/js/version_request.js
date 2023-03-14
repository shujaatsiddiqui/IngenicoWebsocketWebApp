class VersionRequest {
    constructor(jsonFrameViewer){
        this.tracer = new Tracer(jsonFrameViewer);
        $( "div" ).remove(".modal-backdrop");
    }

    process(){
        var that = this;

        var resource = that.buildResource();
        that.session = new RequestSession(Settings.host, Settings.version, null,
            function() {       // On connect
                that.session.send(resource);
            }, function(evt) { // On Rx
                that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
            }, function(msg) { // On Tx
                that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
            }, function(err) { // On error
                that.tracer.traceText("WebSocket error", that.session.endpoint)
            });
    }

    prepareData(){
    }

    onSend(){
    }

    onLoad(){
    }

    buildResource(){
        var res = {};
        return res;
    }
}
