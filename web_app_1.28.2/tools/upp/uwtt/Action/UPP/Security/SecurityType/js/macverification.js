class MacVerification {

    constructor(sec_type) {
        this.sec_type = sec_type;
    }

    formJson() {

        var res = {"type": "mac_verification"};
        res["mac_buffer"] = $("#mac_buffer").val();
        res["DUKPT_or_MS"] = $("#DUKPT_or_MS").val();
        res["mac_key_index"] = $("#mac_key_index").val();
        res["mac_session_key"] = $("#mac_session_key").val();
        res["mac_value"] = $("#mac_value").val();
        res["DUKPT_or_MS"] = $("#DUKPT_or_MS").val();
        if ($("#mac_key_check_value").val() != "") {
            res["mac_key_check_value"] = $("#mac_key_check_value").val();
        }

        return res;
    }
}
