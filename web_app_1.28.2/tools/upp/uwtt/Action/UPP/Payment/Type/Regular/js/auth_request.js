
class AuthRequest{
  constructor(basePayment){
    this.basePayment = basePayment;
    this.session = basePayment.session;
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/UPP/Payment/Type/Regular/auth_request.html', function(){
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
    var that = this;
    var cellNames = ['tag', 'encoding', 'data'];
    this.tags = [];
    $('#auth_req_tag_tb tr').each(function () {
      var obj = {};
      var index = 0;
      $('td', this).each(function () {
        var value = $(this).find(":input").val();
        if(cellNames[index]){
          obj[cellNames[index]] = value;
        }
        index++;
      });

      if(!jQuery.isEmptyObject(obj)){
        that.tags.push(obj);
      }
    });
  }

  onSend(){
    this.basePayment.pendingAuth = false;
    this.session.sendEvent({[Payment.eventTypeFieldName]: "auth_response", "emv_tags": this.tags});
  }

  onLoad(){
    var rowCnt = 0;

    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        if( !$("#auth_req_send_btn").prop("disabled") ){
          $("#auth_req_send_btn").click();
        }
      }
    });

    $("#auth_req_send_btn").prop("disabled", true);

    // event listeners
    $('#auth_req_add_more').on('click', function() {
      var row = `<tr>
        <td><input type="text" name="tag[]" class="form-control"></td>
        <td><input type="text" name="encoding[]" class="form-control"></td>
        <td><input type="text" name="data[]" class="form-control"></td>
        <td><a href="javascript:void(0);" class="remove" title="Remove Tag"><span class="oi oi-minus"></span></a></td>
      </tr>`;
      $('#auth_req_tag_tb').append(row);
      rowCnt++;
      $("#auth_req_send_btn").prop("disabled", false);

    });

    $('#auth_req_tag_tb').on('click', '.remove', function() {
      var trIndex = $(this).closest("tr").index();
      if (trIndex > 0) {
        $(this).closest("tr").remove();
        rowCnt--;
        if(rowCnt == 0 ){
          $("#auth_req_send_btn").prop("disabled", true);
        }
      }
    });

    $('#auth_req_add_btn').on('click', function() {
      var tag = $('#auth_req_tag').prop("value");

      if(tag !== ''){
        var data = $('#auth_req_tag_data').prop("value");
        var type = 'emv';
        var encoding = 'ascii';

        var row = '<tr>';
        row = row + '<td><input type="text" name="tag[]" class="form-control"    value="' + tag +'"></td>';
        row = row + '<td><input type="text" name="encoding[]" class="form-control" value="' + encoding +'"></td>';
        row = row + '<td><input type="text" name="data[]" class="form-control"   value="' + data +'"></td>';
        row = row + '<td><a href="javascript:void(0);" class="remove" title="Remove Tag"><span class="oi oi-minus"></span></a></td></tr>';

        $('#auth_req_tag_tb').append(row);
        rowCnt++;
        $("#auth_req_send_btn").prop("disabled", false);
      }
    });

    $('#auth_req_tag').on('change', function() {
      if($(this).prop("value") == '8A'){
        var html = "";
        for(let tag of Payment.tags["8A"]){
          html += '<option value="' + tag.value + '">(' + tag.value + ') ' + tag.text + '</option>';
        }
        $('#auth_req_tag_data').html(html);
      }
      else{
        $('#auth_req_tag_data').html('');
      }
    });
  }
}
