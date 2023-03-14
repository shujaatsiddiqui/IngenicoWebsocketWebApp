class UsiSuspended{
  constructor(jsonFrameViewer, session, resume_send_cb){
    this.tracer = new Tracer(jsonFrameViewer);
    this.session = session;
    this.resume_send_cb = resume_send_cb;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/USI/UsiPayment/Type/UsiRegular/suspended.html', function(){
      that.prepareData();
      $('#modal_dlg').one('hidden.bs.modal', function(){
        $('#modal_content').empty();
        that.onSend();
      });

      that.onLoad();
      $('#modal_dlg').modal();
    });
  }

  prepareData(){
    $('#suspend_cashback').val( Cookie.get("cashback") );
    $('#suspend_surcharge').val( Cookie.get("surcharge") );
    $('#suspend_tax').val( Cookie.get("tax") );
    $('#suspend_vat').val( Cookie.get("vat") );
    $('#suspend_tip').val( Cookie.get("tip") );
    $('#suspend_total').val( Cookie.get("total") );
  }

  onSend(){
  }

  onLoad(){
    var that = this;

    $('#resume_btn').click(function() {
      that.session.sendEvent( that.buildResource() );
      that.resume_send_cb();
    });
  }

  buildResource(){
    var res;

    res = {"type":"resume"};
    
    var amounts = {};
    var cashback = $('#suspend_cashback').val();
    if(cashback !== ''){ // not empty{
      amounts["cashback"] = Number( cashback );
    }

    var surcharge = $('#suspend_surcharge').val();
    if(surcharge !== ''){ // not empty{
      amounts["surcharge"] = Number( surcharge );
    }

    var tax = $('#suspend_tax').val();
    if(tax !== ''){ // not empty{
      amounts["tax"] = Number( tax );
    }

    var vat = $('#suspend_vat').val();
    if(vat !== ''){ // not empty{
      amounts["vat"] = Number( vat );
    }

    var tip = $('#suspend_tip').val();
    if(tip !== ''){ // not empty{
      amounts["tip"] = Number( tip );
    }

    var total = $('#suspend_total').val();
    if(total !== ''){ // not empty{
      amounts["total"] = Number( total );
    }
    var payment_type = $('#payment_paymen_type').prop("value");
    if(payment_type !== ''){ // not empty{
      res["payment_type"] = payment_type;
    }
    res["amount"] = amounts;
    return res;
  }
}
