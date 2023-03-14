class UpdateTerminalCapabilities {
    constructor(session) {
        this.session = session;
        $( "div" ).remove(".modal-backdrop");
    }

    process() {
        var that = this;
        var content = 'Action/UPP/Payment/Type/Regular/update_terminal_capabilities.html';

        $('#modal_content').load(content, function () {
            $('#modal_dlg').one('hidden.bs.modal', function () {
                that.prepareData();
                $('#modal_content').empty();

                that.onSend();
            });

            that.onLoad();
            $('#modal_dlg').modal();
        });

    }

    prepareData() {
        this.resource = { [Payment.eventTypeFieldName]: "update_terminal_capabilities" };
    }

    onSend() {
        var byte1 = ["0", "0", "0", "0", "0", "0", "0", "0"];//max 1110 0000 ==> E0
        var byte2 = ["0", "0", "0", "0", "0", "0", "0", "0"];//max 1111 1000 ==> F8
        var byte3 = ["0", "0", "0", "0", "0", "0", "0", "0"];//max 1110 1000 ==> E8
        $.each(this.capabilitieCheckBoxes, function (index, checkBox) {
            if (checkBox.prop("checked")) {
                switch (index) {
                    case 0:
                        // manual_key_entry (8th bit in byte 1)
                        byte1[0] = "1";
                        break;
                    case 1:
                        // Magnetic_stripe (7th bit in byte 1)
                        byte1[1] = "1";
                        break;
                    case 2:
                        // IC_with_contacts (6th bit in byte 1)
                        byte1[2] = "1";
                        break;
                    case 3:
                        // Plaintext_PIN_for_ICC_verification (8th bit in byte 2)
                        byte2[0] = "1";
                        break;
                    case 4:
                        // Enciphered_PIN_for_online_verification (7th bit in byte 2)
                        byte2[1] = "1";
                        break;
                    case 5:
                        // Signature (6th bit in byte 2)
                        byte2[2] = "1";
                        break;
                    case 6:
                        // Enciphered_PIN_for_offline_verification (5th bit in byte 2)
                        byte2[3] = "1";
                        break;
                    case 7:
                        // No_CVM_required (4th bit in byte 2)
                        byte2[4] = "1";
                        break;
                    case 8:
                        // SDA (8th bit in byte 3)
                        byte3[0] = "1";
                        break;
                    case 9:
                        // DDA (7th bit in byte 3)
                        byte3[1] = "1";
                        break;
                    case 10:
                        // Card_capture (6th bit in byte 3)
                        byte3[2] = "1";
                        break;
                    case 11:
                        // CDA (4th bit in byte 3)
                        byte3[4] = "1";
                        break;
                    default:

                }
            }
        });
        var data = this.convertNumber(byte1.join(""), 2, 16) + "" + this.convertNumber(byte2.join(""), 2, 16) + "" + this.convertNumber(byte3.join(""), 2, 16);
        var res = {};
        res["tag"] = "9F33";
        res["type"] = "emv";
        res["encoding"] = "hex";
        res["data"] = data;
        this.resource["emv_tags"] = [res];
        this.session.sendEvent(this.resource);
    }

    convertNumber(n, fromBase, toBase) {
        if (fromBase === void 0) {
            fromBase = 10;
        }
        if (toBase === void 0) {
            toBase = 10;
        }
        var result = parseInt(n.toString(), fromBase).toString(toBase).toUpperCase();
        if (result.length === 1)
            return "0" + result;
        else {
            return result;
        }
    }

    bindEnterKey() {
        $(document).unbind("keyup").keyup(function (e) {
            var code = e.which; // recommended to use e.which, it's normalized across browsers
            if (code == 13) {
                $("#update_terminal_capabilities_btn").click();
            }
        });
    }

    onLoad() {
        this.bindEnterKey();

        this.capabilitieCheckBoxes = [
            $('#manual_key_entry'),
            $('#Magnetic_stripe'),
            $("#IC_with_contacts"),
            $("#Plaintext_PIN_for_ICC_verification"),
            $("#Enciphered_PIN_for_online_verification"),
            $("#Signature"),
            $("#Enciphered_PIN_for_offline_verification"),
            $("#No_CVM_required"),
            $("#SDA"),
            $("#DDA"),
            $("#Card_capture"),
            $("#CDA")
        ];

    }
}
