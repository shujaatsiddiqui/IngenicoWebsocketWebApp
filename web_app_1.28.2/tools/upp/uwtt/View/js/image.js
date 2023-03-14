function ViewImage() {}

ViewImage.init = function() {
  $('#modal_dlg').on('show.bs.modal', ViewImage.onShow)
  $('#modal_dlg').on('click', '.btn-primary', function() {})
};

ViewImage.show = function(image) {
  //ViewImage.image = '<img src="data:image/jpeg;base64,' + image + '" style="width:640px;height:320px;">';
  ViewImage.image = '<img src="data:image/bmp;base64,' + image + '">';
  $('#modal_dlg_content').load('View/image.html', function() {
    $('#modal_dlg').modal();
  });
}

ViewImage.onShow = function() {
  //local variable definitions
  //----------------------------------

  //local funtion definitions
  //----------------------------------

  // event listeners
  //----------------------------------

  $('#userImage').html(ViewImage.image);
}
