class Progress{
  constructor(id){
    if(id == null){
      this.id = '#fileProgress';
    }else{
      this.id = id;
    }
  }

  set(progress, text){
    $(this.id)
        .attr('class', "progress-bar bar-progress progress-bar-striped progress-bar-animated")
        .css("width", progress + "%")
        .attr("aria-valuenow", progress)
        .text(text);
  }

  done(text){
    $(this.id)
        .css("width", 100 + "%")
        .attr("aria-valuenow", 100)
        .attr('class', 'progress-bar bg-success')
        .text(text);
  }

  failed(text){
      $(this.id)
          .attr('class', 'progress-bar bg-danger')
          .css("width", 100 + "%")
          .attr("aria-valuenow", 100)
          .text(text);
  }
}
