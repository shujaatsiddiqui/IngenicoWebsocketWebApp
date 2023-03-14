class Voltage {

  constructor(sec_type) {
    this.sec_type = sec_type;
  }

  formJson() {
      return {"type":this.sec_type};
  }
}
