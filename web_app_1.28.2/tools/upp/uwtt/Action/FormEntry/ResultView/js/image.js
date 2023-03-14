class ViewImage{
  constructor(image){
    this.image = '<img src="data:image/bmp;base64,' + image + '" style="width:640px;">';
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/FormEntry/ResultView/image.html', function(){
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
    $('#userImage').html(this.image);
  }
}
