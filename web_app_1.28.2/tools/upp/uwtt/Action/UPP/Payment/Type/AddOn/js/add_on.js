class AddOn{
    constructor(){
    }
    process(){
        var that = this;
        $('#type_container').load('Action/UPP/Payment/Type/AddOn/add_on.html', function(){
            that.onLoad();
        });
    }

    onLoad(){
        var that = this;
        $('#add_on_request_type').on('change', function() {
            if($(this).prop("value") == 'register') {
                $('#add_on_message_data_box').hide();
                $('#addon_options_box').show();
                $('#addon_application_box').show();
            } else if ($(this).prop("value") == 'message') {
                $('#addon_options_box').hide();
                $('#addon_application_box').hide();
                $('#add_on_message_data_box').show();
            } else if ($(this).prop("value") == 'binary') {
                $('#addon_options_box').hide();
                $('#addon_application_box').hide();
                $('#add_on_message_data_box').show();
            } else if ($(this).prop("value") == 'unregister') {
                $('#add_on_message_data_box').hide();
                $('#addon_options_box').hide();
                $('#addon_application_box').hide();
            }
        });

        this.populateForm();
    }

    populateForm() {
        if($('#add_on_request_type').prop("value") == 'register') {
            $('#add_on_message_data_box').hide();
            $('#addon_options_box').show();
            $('#addon_application_box').show();
        } else if ($('#add_on_request_type').prop("value") == 'message') {
            $('#addon_options_box').hide();
            $('#addon_application_box').hide();
            $('#add_on_message_data_box').show();
        } else if ($('#add_on_request_type').prop("value") == 'binary') {
            $('#addon_options_box').hide();
            $('#addon_application_box').hide();
            $('#add_on_message_data_box').show();
        } else if ($('#add_on_request_type').prop("value") == 'unregister') {
            $('#add_on_message_data_box').hide();
            $('#addon_options_box').hide();
            $('#addon_application_box').hide();
        }
    }

    buildResource(){
        var res = {"type": "addon"};
        res["addon_type"] = $('#add_on_request_type').prop("value");
        if (res["addon_type"] == "register") {
            res["application"] = $('#addon_application').prop("value");
            var options = $('#addon_options').val();
            var options_array = options.split(',');
            res["options"] = options_array;
        } else if (res["addon_type"] == "message" || res["addon_type"] == "binary") {
            res["payload"] = $('#add_on_message_data').val();
        }

        return res;
    }

    processPaymentData(data){
        var msg = new Message(data);
        if(msg.isEvent()){
            this.processPaymentEvent(msg)
        } else if(msg.isResponse()){
            if(msg.status == "started"){
                PaymentStatus.updateText("Waiting For Card");
            }
            else if(msg.status == "error"){
                var error_info = msg.jsonObject.response.resource.error_info;
                PaymentStatus.error('Error: ' + error_info.text);
            }
        }
    }

    processPaymentEvent(evt){
        var that = this;
        this.completionText = '';
        if(evt.jsonObject.event.resource.info){
            if(evt.jsonObject.event.resource.info.step_name){
                this.stepName = evt.jsonObject.event.resource.info.step_name;
            }
        }

        if(evt.status == "completed"){
            $('#resume_suspended_btn').hide();
            PaymentStatus.updateText("Payment Completed " + this.completionText);
        }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_completed'){
            this.transactionCompleted = true;
            PaymentStatus.updateText("Transaction Completed");
        }else if(evt.jsonObject.event.resource[Payment.eventTypeFieldName] == 'transaction_started'){
            PaymentStatus.updateText("Transaction Started");
        }

    }

}

Payment.eventTypeFieldName = "type";
