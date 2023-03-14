function Signature() {}

Signature.init = function() {
  $('#signature_modal_view').on('show.bs.modal', Signature.onShow)
};

Signature.show = function(image) {
  Signature.image = '<img src="data:image/bmp;base64,' + image + '">';
  $('#signature_modal_view').modal();
}

Signature.onShow = function() {
  $('#signatureImage').html(Signature.image);
}
