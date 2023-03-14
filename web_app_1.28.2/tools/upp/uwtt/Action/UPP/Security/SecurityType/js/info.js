class SecInfo {

  constructor(sec_type) {
    this.sec_type = sec_type;
  }

  formJson() {
      return {
        "type": this.sec_type,
        "check_keys": $('#check_keys').prop("checked")
      };
  }
}
