class InjectSessionKey {

    constructor(sec_type) {
        this.sec_type = sec_type;
    }

    formJson() {
        var res = {"type": "inject_session_key"};
        res["pin_session_key"] = $("#pinSessionKey").val();
        return res;
    }
}
