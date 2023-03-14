
class UppFlowId {
    constructor(jsonFrameViewer, onDone){
        this.tracer = new Tracer(jsonFrameViewer);
        this.onDone = onDone;
        $( "div" ).remove(".modal-backdrop");
    }

    process(){
        var that = this;
        $('#modal_content').load('Action/UPP/FlowId/flow_id.html', function(){
            $('#modal_dlg').one('hidden.bs.modal', function(){
                that.prepareData();
                $('#modal_content').empty();
                that.onSend();
            });

            that.onLoad();
            $('#modal_dlg').modal();
        });

    }

    prepareData(){

    }

    onSend(){

    }

    buildResource(){
        var res = {"flow_id_status": []};
        if ($("#flow_ids").val().length > 0) {
            res["flow_id_status"] = $("#flow_ids").val().split(",")
        }
        return res;
    }

    onLoad(){
        var that = this;


        $('#flow_id_send_btn').click(function() {

            var json = that.buildResource();
            that.session = new RequestSession(Settings.host, Settings.version, $("#flow_id_endpoint :selected").val(),
                function() {       // On connect
                    that.session.send(json);
                }, function(evt) { // On Rx
                    that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
                    //that.session.disconnect();
                }, function(msg) { // On Tx
                    that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
                }, function(err) { // On error
                    that.tracer.traceText("WebSocket error", that.session.endpoint)
                });
        });
    }
}
