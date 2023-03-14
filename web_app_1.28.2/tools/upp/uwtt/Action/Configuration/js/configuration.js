
class Configuration{
  constructor(jsonFrameViewer){
    this.tracer = new Tracer(jsonFrameViewer);
    $( "div" ).remove(".modal-backdrop");
  }

  process(){
    var that = this;
    $('#modal_content').load('Action/Configuration/configuration.html', function(){
      $('#modal_dlg').one('hidden.bs.modal', function(){
        $('#modal_content').empty();
      });
      that.onLoad();
      $('#modal_dlg').modal();
    });

  }

  prepareResource(){
    var that = this;
    that.tags = {};

    if(that.type === "vas_config"){
      if ($('#vasConfigCommand').prop("value") == "getMerchantsCount"){
        that.tags["command"]="get_merchants_count";
      }else if ($('#vasConfigCommand').prop("value") == "clearMerchants"){
        that.tags["command"]="clear_merchants";
      }else if ($('#vasConfigCommand').prop("value") == "addMerchants"){
        that.tags["command"]="add_merchants";
        var merchants = []
        var table = document.getElementById("apple_merch_table");
        if(table.rows.length > 1 ){
          for (var i = 1, row; row = table.rows[i]; i++) {
            var merch = {}
            merch["type"] = "apple";
            merch["id"] = row.cells[0].innerHTML;
            merch["url"] = row.cells[1].innerHTML;
            merch["category_filter"] = row.cells[2].innerHTML;
            merch["return_decrypt_pass_data"] = row.cells[3].innerHTML;
            merchants.push( merch )
          }
        }

        var table = document.getElementById("google_merch_table");
        if(table.rows.length > 1 ){
          for (var i = 1, row; row = table.rows[i]; i++) {
            var merch = {}
            merch["type"] = "google";
            merch["id"] = row.cells[0].innerHTML;
            merch["store_location"] = row.cells[1].innerHTML;
            merch["pinpad_id"] = row.cells[2].innerHTML;
            merch["name"] = row.cells[3].innerHTML;
            merch["name_language"] = row.cells[4].innerHTML;
            merch["category_code"] = row.cells[5].innerHTML;
            merch["filter"] = row.cells[6].innerHTML;
            merchants.push( merch )
          }
        }
        that.tags["merchants"] = merchants;
      }else{
        console.log("No vas Config Command ");
      }

      return;
    }

    if(that.type === "config_emv"){
      var fileName = $("#emvFileName").val();
      if(fileName != ""){
        that.tags["file_name"] = fileName.toUpperCase();
      } else {
        alert("File Name isn't set");
        return;
      }

      if($('#contactCheck').is(':checked')){ 
        that.tags["emv_interface"] = "contact";
      } else {
        that.tags["emv_interface"] = "contactless";
      }

      if($('#systemCheck').is(':checked')){ 
        that.tags["file_location"] = "system";
      } else {
        that.tags["file_location"] = "host";
      }

      return;
    }

    var tags = [];

    var table_id;
    var cellNames;

    if(that.type === "config_read"){
      cellNames = ['group', 'key'];
      table_id ='#tab_config_read tr';
    }else if(that.type === "config_write"){
      cellNames = ['group', 'key', 'value'];
      table_id ='#tab_config_write tr';
    }
    else {
      console.log("No config data");
      return;
    }

    $(table_id).each(function () {
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
        tags.push(obj);
      }
    });

    if(that.type === "config_read"){
      for (let tag of tags) {
        if(that.tags[tag.group] === undefined ){
          that.tags[tag.group] = [];
        }
        that.tags[tag.group].push(tag.key);
      }
    }else if(that.type === "config_write"){
      for (let tag of tags) {
        if(that.tags[tag.group] === undefined ){
          that.tags[tag.group] = {};
        }
        that.tags[tag.group][tag.key] = tag.value;
      }
    }
  }

  sendData(){
    var that = this;
    that.session = new RequestSession(Settings.host, Settings.version, "device",
    function() {       // On connect
      if(that.type == "vas_config"){
        that.session.send({"type":that.type, "vas":that.tags});
      }else{
        that.session.send({"type":that.type, "config":that.tags});
      }
    }, function(evt) { // On Rx
      that.tracer.traceJsonData(JSON.parse(evt.data), that.session.endpoint, true);
      that.session.disconnect();
    }, function(msg) { // On Tx
      that.tracer.traceJsonData(JSON.parse(msg), that.session.endpoint);
    }, function(err) { // On error
      that.tracer.traceText("WebSocket error", that.session.endpoint)
    });
  }

  onLoad(){
    var that = this;
    that.type = "";
    if (Settings.protocol == ProtocolEnum.UPP){
      document.getElementById("vasConfSection").style.display = "none";
    }
    if ($('#vasConfigCommand').prop("value") == "addMerchants") {
      document.getElementById("addMerchantsCommand").style.display = "block";
    } else {
      document.getElementById("addMerchantsCommand").style.display = "none";
    }
    $(document).unbind("keyup").keyup(function(e){
      var code = e.which; // recommended to use e.which, it's normalized across browsers
      if(code == 13)
      {
        $("#btn_config_send").click();
      }
    });

    // event listeners
    $('#confRead').on('shown.bs.collapse', function () {
      that.type = "config_read";
      $("#btn_config_send").removeAttr("disabled");
    });

    $('#confWrite').on('shown.bs.collapse', function () {
      that.type = "config_write";
      $("#btn_config_send").removeAttr("disabled");
    });

    $('#emvConf').on('shown.bs.collapse', function () {
      that.type = "config_emv";
      $("#btn_config_send").removeAttr("disabled");
    });

    $('#vasConf').on('shown.bs.collapse', function () {
      that.type = "vas_config";
    });

    $('#vasConfigCommand').on('change', function (event) {
      if (event.target.value == "addMerchants") {
        document.getElementById("addMerchantsCommand").style.display = "block";

        var appleTable = document.getElementById("apple_merch_table");
        var googleTable = document.getElementById("google_merch_table");
        if (appleTable.rows.length == 1 && googleTable.rows.length == 1) {
          $("#btn_config_send").attr("disabled", "disabled");
        } else {
          $("#btn_config_send").removeAttr("disabled");
        }
      } else {
        document.getElementById("addMerchantsCommand").style.display = "none";
        $("#btn_config_send").removeAttr("disabled");
      }
    });

    $('#config_read_add_more').on('click', function() {
      var row = `<tr>
        <td><input type="text" name="group[]" class="form-control"></td>
        <td><input type="text" name="key[]" class="form-control"></td>
        <td class="text-center align-middle"><a href="javascript:void(0);" class="remove" title="Remove"><span class="oi oi-minus"></span></a></td>
      </tr>`;
      $('#tab_config_read').append(row);
    });

    $('#tab_config_read').on('click', '.remove', function() {
      var trIndex = $(this).closest("tr").index();
      $(this).closest("tr").remove();
    });

    $('#config_write_add_more').on('click', function() {
      var row = `<tr>
        <td><input type="text" name="group[]" class="form-control"></td>
        <td><input type="text" name="key[]" class="form-control"></td>
        <td><input type="text" name="value[]" class="form-control"></td>
        <td class="text-center align-middle"><a href="javascript:void(0);" class="remove" title="Remove"><span class="oi oi-minus"></span></a></td>
      </tr>`;
      $('#tab_config_write').append(row);
    });

    $('#tab_config_write').on('click', '.remove', function() {
      var trIndex = $(this).closest("tr").index();
      $(this).closest("tr").remove();
    });

    $('#btn_config_send').on('click', function() {
      that.prepareResource();
      if(!jQuery.isEmptyObject(that.tags))
      {
        that.sendData();
      }
    });

    // VAS config command
    var actions = `<a href="javascript:void(0);" class="remove" style="font-size:18px;" title="Remove" ><span class="oi oi-minus"></span></a>
    <a href="javascript:void(0);" class="edit" style="font-size:18px;"  title="Edit" ><span class="oi oi-pencil"></span></a>
    <a href="javascript:void(0);" class="add" style="font-size:18px;"  title="Add" ><span class="oi oi-plus"></span></a>`

    //apple merchant
    $(".add-new-apple").click(function(){
      $("#btn_config_send").attr("disabled", "disabled");
      $(this).attr("disabled", "disabled");
      var index = $("#apple-table-grid tr:last-child").index();
          var row = '<tr>' +
              '<td><input type="text" class="form-control" name="id" id="id"></td>' +
              '<td><input type="text" class="form-control" name="url" id="url"></td>' +
              '<td><input type="text" class="form-control" name="filter" id="filter"></td>' +
              '<td><input type="text" class="form-control" name="encrypt" id="encrypt"></td>' +
        '<td>' + actions + '</td>' +
          '</tr>';
      $("#apple_merch_table").append(row);		
      $("#apple-table-grid tr").eq(index + 1).find(".add, .edit").toggle();
      $("#apple-table-grid tr").eq(index + 1).find(".add, .add").toggle();
      $('[data-toggle="tooltip"]').tooltip();
    });

    $('#apple_merch_table').on('click','.remove', function() {
      $(this).parents("tr").remove();
      $(".add-new-apple").removeAttr("disabled");
      var appleTable = document.getElementById("apple_merch_table");
      var googleTable = document.getElementById("google_merch_table");
      if(appleTable.rows.length == 1 && googleTable.rows.length == 1 ){
        $("#btn_config_send").attr("disabled", "disabled");
      }else{
        $("#btn_config_send").removeAttr("disabled");
      }
    });

    $('#apple_merch_table').on("click", ".edit", function(){	
      $("#btn_config_send").attr("disabled", "disabled");	
      $(this).parents("tr").find("td:not(:last-child)").each(function(){
        $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
      });
      $(".add-new-apple").attr("disabled", "disabled");
      $(this).parents("tr").find(".add").toggle();
      $(this).parents("tr").find(".edit").toggle();
    })	

    $('#apple_merch_table').on("click", ".add", function(){
    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
      if(!$(this).val()){
        $(this).addClass("error");
        empty = true;
        } else{
          $(this).removeClass("error");
        }
      });
      $(this).parents("tr").find(".error").first().focus();
      if(!empty){
        input.each(function(){
          $(this).parent("td").html($(this).val());
        });			
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new-apple").removeAttr("disabled");
        $("#btn_config_send").removeAttr("disabled");
      }		
    });

    // google merchant
    $(".add-new-google").click(function(){
      $("#btn_config_send").attr("disabled", "disabled");
      $(this).attr("disabled", "disabled");
      var index = $("#google-table-grid tr:last-child").index();
          var row = '<tr>' +
              '<td><input type="text" class="form-control" name="id" id="id"></td>' +
              '<td><input type="text" class="form-control" name="store" id="store"></td>' +
              '<td><input type="text" class="form-control" name="pinpad" id="pinpad"></td>' +
              '<td><input type="text" class="form-control" name="name" id="name"></td>' +
              '<td><input type="text" class="form-control" name="language" id="language"></td>' +
              '<td><input type="text" class="form-control" name="category" id="category"></td>' +
              '<td><input type="text" class="form-control" name="filter" id="filter"></td>' +
        '<td>' + actions + '</td>' +
          '</tr>';
      $("#google_merch_table").append(row);		
      $("#google-table-grid tr").eq(index + 1).find(".edit").toggle();
          $('[data-toggle="tooltip"]').tooltip();
    });

    $('#google_merch_table').on("click", ".add", function(){
      var empty = false;
      var input = $(this).parents("tr").find('input[type="text"]');
          input.each(function(){
        if(!$(this).val()){
          $(this).addClass("error");
          empty = true;
          } else{
            $(this).removeClass("error");
          }
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
          input.each(function(){
            $(this).parent("td").html($(this).val());
          });			
          $(this).parents("tr").find(".add").toggle();
          $(this).parents("tr").find(".edit").toggle();
          $("#btn_config_send").removeAttr("disabled");
         // $(".add-new-google").removeAttr("disabled");
        }		
      });

      $('#google_merch_table').on('click','.remove', function() {
        $(this).parents("tr").remove();
        $(".add-new-google").removeAttr("disabled");
        var appleTable = document.getElementById("apple_merch_table");
        var googleTable = document.getElementById("google_merch_table");
        if(appleTable.rows.length == 1 && googleTable.rows.length == 1 ){
          $("#btn_config_send").attr("disabled", "disabled");
        }else{
          $("#btn_config_send").removeAttr("disabled");
        }
      });

      $('#google_merch_table').on("click", ".edit", function(){	
        $("#btn_config_send").attr("disabled", "disabled");	
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
          $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
          $(this).parents("tr").find(".edit").toggle();
          $(this).parents("tr").find(".add").toggle();
          $(".add-new-google").attr("disabled", "disabled");
        });	
      });

  }
}
