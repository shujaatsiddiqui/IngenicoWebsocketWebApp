class ViewText{
  constructor(text){
    this.text = text;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/FormEntry/ResultView/text.html', function(){
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

  onLoad(){
    $('#userText').val(this.text);
  }
}
