function PaymentStatus() {}

PaymentStatus.updateText = function(text) {
  $('#action_error_text').html('');
  $('#action_status_text').html(text);
}

PaymentStatus.error = function(text) {
  alert(text);
}
