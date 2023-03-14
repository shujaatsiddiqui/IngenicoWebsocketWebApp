class Table{
  constructor(test){

    this.tableData_ = [];
    this.generalData_ = {};
    this.row_ = 0;

    if(test){
      //Testing data.
      this.generalData_[Table.TIMEOUT] = 60;
      this.generalData_[Table.FORM] = "CELSWIPE.K3Z";

      this.tableData_.push({"type": "Element", "id": "PROMPT312", "label": "Insert/Swipe/Tap Card or Select Language", "row": 'id' + "id" + this.row_});
      this.row_++;

      this.tableData_.push({"type": "Button", "id": "btnl", "label": "LANGUAGE", "row": 'id' + this.row_, "extended":{"visibility": "show"}});
      this.row_++;
      this.tableData_.push({"type": "Button", "id": "btnm", "label":"", "row": 'id' + this.row_, "extended":{"visibility": "hide"}});
      this.row_++;

      this.tableData_.push({"type": "Image", "id": "image3", "label": "/HOST/B-PAYPAL-U.PNG", "row": 'id' + this.row_, "extended":{"visibility": "show"}});
      this.row_++;
      this.tableData_.push({"type": "Image", "id": "image4", "label":"", "row": 'id' + this.row_, "extended":{"visibility": "show"}});
      this.row_++;
    }
  }

  set generalData(id){
    this.generalData_ = id;
  }
  get generalData(){
    return this.generalData_;
  }

  build(){
    $("#tab_logic tbody tr").remove();
    for (var idx in this.tableData_) {
      var el = this.tableData_[idx];
      $('#tab_logic tbody').append('<tr class="text-center" id="' + el.row + '"></tr>');
      $('#'+el.row).html("<td>" + el.type + '</td><td style="word-break: break-all;">' + el.id + '</td><td style="word-break: break-all;">' + el.label + "</td>" +
        '<td><a href="javascript:void(0);" class="remove_table_data_tag" title="Remove element"><span class="oi oi-minus"></span></a></td>');
    }
  }

  addRow(type, id, value, getExtendedFields){
    var element = this.tableData_.find(item => {
      if(item["type"] == type){
        if(item["type"] == Table.INPUT || item["id"] == id ){
          return item;
        }
      }
    });

    if (element !== undefined) {
      if(element["type"] == Table.INPUT){
        element["id"] = id;
      }
      element["label"] = value;

    } else {
      element = {"type": type, "id": id, "label": value, "row": 'id' + this.row_};
      this.tableData_.push(element);
      this.row_++;
    }

    if(getExtendedFields){
      element["extended"] = getExtendedFields();
    }

    this.build();
  }

  removeRow(rowId) {
    var element = this.tableData_.find(item => {
      if (item["row"] == rowId) {
        return item;
      }
    });

    if(element !== undefined){
      var rm = this.tableData_.splice(this.tableData_.indexOf(element), 1);
    }

    this.build();
  }

  removeAllRows(){
    this.tableData_ = [];
    this.row_ = 0;
    this.build();
  }

  addElements(resource)
  {
    $.each(this.tableData_, function(index, element) {
      var obj = {"id":element.id};

      if(element.type == Table.ELEMENT){

        if(resource.texts === undefined){
            resource["texts"] = [];
        }
        obj["label"] = element.label;
        resource.texts.push(obj);

      }else if(element.type == Table.BUTTON){

        if(resource.buttons === undefined){
            resource["buttons"] = [];
        }

        if(element.label){
          obj["label"] = element.label;
        }
        if(element.extended.visibility){
          obj["visibility"] = element.extended.visibility;
        }
        resource.buttons.push(obj);

      }else if(element.type == Table.IMAGE){

        if(resource.images === undefined){
            resource["images"] = [];
        }

        if(element.label){
          obj["file"] = element.label;
        }
        if(element.extended.visibility){
          obj["visibility"] = element.extended.visibility;
        }
        resource.images.push(obj);
      }
    });
    return resource;
  }

  addInputs(resource)
  {
    $.each(this.tableData_, function(index, element) {
      var obj = {"id":element.id};
      if(element.type == Table.INPUT){
        if(obj.id == Table.NUMERIC){
          obj["prompt"] = element.extended.prompt;
          obj["min_input_length"] = element.extended.min_length;
          obj["max_input_length"] = element.extended.max_length;
          obj["input_display"] = element.extended.disp;
          obj["format_specifier"] = element.extended.format;
        }else if(obj.id == Table.ALPHANUMERIC){
          obj["prompt"] = element.extended.prompt;
          obj["min_input_length"] = element.extended.min_length;
          obj["max_input_length"] = element.extended.max_length;
          obj["input_display"] = element.extended.disp;
        }else if(obj.id == Table.SIGNATURE){
          obj["prompt"] = element.extended.prompt;
		  if(element.extended.format!=" ")
		  obj["format"] = element.extended.format;
        }else if(obj.id == Table.MENU){
          obj["prompt"] = element.extended.prompt;
          obj["default_selected_entry"] = element.extended.default_selected_entry;
          obj["menu_items"] = element.extended.menu_items;
        }else if(obj.id == Table.PIN){
          obj["prompt"] = element.extended.prompt;
          obj["pan"] = element.extended.pan;
          obj["key_type"] = element.extended.key_type;
          obj["key_index"] = element.extended.key_index;
        }else if(obj.id == Table.TC){
          obj["text_file_id"] = element.extended.text_file_id;
          if(element.extended.hasOwnProperty("form")) {
              obj["form"] = element.extended.form;
          }
        }

        resource["input"] = obj;
      }
    });
  }

  buildResource(){
    var resource = {[Table.FORM]:this.generalData_[Table.FORM]};
    if(this.generalData_[Table.TIMEOUT] != "0"){
      resource[Table.TIMEOUT] = this.generalData_[Table.TIMEOUT];
    }

    this.addElements(resource);
    this.addInputs(resource);

    return resource;
  }
}

// Form table entry types
Table.ELEMENT = "Element";
Table.INPUT = "Input";
Table.BUTTON  = "Button";
Table.IMAGE   = "Image";

// Form common fields
Table.TIMEOUT = "timeout";
Table.FORM = "form";

// Form table Input type IDs
Table.NUMERIC = "numeric";
Table.ALPHANUMERIC = "alphanumeric";
Table.SIGNATURE = "signature";
Table.MENU = "menu";
Table.PIN = "pin";
Table.TC = "tc";
