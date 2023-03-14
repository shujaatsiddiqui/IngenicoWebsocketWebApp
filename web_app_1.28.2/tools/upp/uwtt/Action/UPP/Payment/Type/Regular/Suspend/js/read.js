class Read{
  constructor(session, onSend){

    $(document).unbind("keyup").keyup(function(e){
    });

    $("#suspend_send_btn").click(function() {
      var resource = {[Payment.eventTypeFieldName]:"read"};

      var text = $('#readTagItems').val();
      //remove trailing line breaks to avoid empty tag sending
      text = text.replace(/\n+$/, "");

      var tags = text.split('\n');

      if(tags.length){
        resource["tags"] = tags;
      }

      session.sendEvent(resource);
      onSend();
    });
  }
}
