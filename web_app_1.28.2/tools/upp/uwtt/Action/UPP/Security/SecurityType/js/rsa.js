class Rsa {

  constructor(sec_type) {
    this.sec_type = sec_type;
    var enabledStatus = (this.sec_type != 'rsa_update_public_key') ? true : false;
    $("#rsaKeyDataRow").prop( "hidden", enabledStatus );
    $("#rsaSigDataRow").prop( "hidden", enabledStatus );
  }

  formJson() {
      var keyName = $("#rsaKeyName").val();
      var res = {"type":this.sec_type};
      res["key_name"] = keyName;
      if(this.sec_type == 'rsa_update_public_key') {
          var keyData = $("#rsaKeyData").val();
          var sigData = $("#rsaSigData").val();
          res["key_data"] = keyData;
          res["sig_data"] = sigData;
      }
      return res;
  }
}
