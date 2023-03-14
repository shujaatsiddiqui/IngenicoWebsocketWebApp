function ViewText() {}

ViewText.init = function() {
  $('#small_modal_dlg').on('show.bs.modal', ViewText.onShow)
  $('#small_modal_dlg').on('click', '.btn-primary', function() {})
};

ViewText.show = function(text) {
  ViewText.text = text;
  $('#small_modal_dlg_content').load('View/text.html', function() {
    $('#small_modal_dlg').modal();
  });
}

ViewText.onShow = function() {
  //local variable definitions
  //----------------------------------

  //local funtion definitions
  //----------------------------------

  // event listeners
  //----------------------------------
  
  $('#userText').val(ViewText.text);
}
