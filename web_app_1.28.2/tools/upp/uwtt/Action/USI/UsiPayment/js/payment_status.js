function UsiPaymentStatus() {}

UsiPaymentStatus.updateText = function(text) {
  $('#action_error_text').html('');
  $('#action_status_text').html(text);
}

UsiPaymentStatus.error = function(text) {
  alert(text);
}
