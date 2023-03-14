
class UppUpdate {
    constructor(jsonFrameViewer, onDone){
        this.tracer = new Tracer(jsonFrameViewer);
        this.onDone = onDone;
        $( "div" ).remove(".modal-backdrop");
    }

    process(){
        var that = this;
        $('#modal_content').load('Action/UPP/Update/update.html', function(){
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
        var res = {"type": ""};
        var command = $("#update_type_command :selected").val();

        if (command == "get_download_status") {
            res["type"] = "em_status";
            return res;
        } if (command == "configure") {
            res["type"] = "em_config";
            res["network_type"] = $("#update_configure_network_type :selected").val();
            res["contract_number"] = $("#update_configure_contract_number").val();
            res["tcp_port"] = $("#update_configure_tcp_port").val();
            res["tms_address"] = $("#update_configure_tms_address").val();
            res["ssl_profile"] = $("#update_configure_ssl_profile").val();
            return res;
        } else if (command == "start_download") {
            res["type"] = "em_call";
            if ($("#start_background_download").prop('checked')) {
                res["background"] = true;
            } else {
                res["background"] = false;
            }
            return res;
        }
        return res;
    }

    onLoad(){
        var that = this;


        if ($('#update_type_command').prop("value") == 'configure') {
            $("#commandConfigure").show();
            $("#commandStart").hide();
        } else if ($('#update_type_command').prop("value") == 'start_download') {
            $("#commandConfigure").hide();
            $("#commandStart").show();
        } else {
            $("#commandConfigure").hide();
            $("#commandStart").hide();
        }

        $('#update_type_command').on('change', function() {
            if ($(this).prop("value") == 'configure' || $(this).prop("value") == 'em_config') {
                $("#commandConfigure").show();
                $("#commandStart").hide();
            } else if ($(this).prop("value") == 'start_download') {
                $("#commandConfigure").hide();
                $("#commandStart").show();
            } else {
                $("#commandConfigure").hide();
                $("#commandStart").hide();
            }
        });

        $("#security_type").on('input', function(e) {
            var selected = $(this).val();
            var type = selected.split('_')[0];
            $('#typeSpecificRow').load('Action/UPP/Security/SecurityType/' + type + '.html', function(){
                that.sec_type = SecurityTypeFactory.create(selected);
            });
        });

        $('#update_send_btn').click(function() {

            var json = that.buildResource();

            that.session = new RequestSession(Settings.host, Settings.version, "update",
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
