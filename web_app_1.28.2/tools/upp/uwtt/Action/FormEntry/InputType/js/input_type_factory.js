function InputTypeFactory(){}
InputTypeFactory.create = function(table, name){
  if(name ===Table.NUMERIC){
    return new Numeric(table);
  }else if(name === Table.ALPHANUMERIC){
    return new AlphaNumeric(table);
  }else if(name === Table.SIGNATURE){
    return new Signature(table);
  }else if(name === Table.MENU){
    return new Menu(table);
  }
  else if(name === Table.PIN){
    return new Pin(table);
  }
  else if(name === Table.TC){
    return new TC(table);
  }
}
