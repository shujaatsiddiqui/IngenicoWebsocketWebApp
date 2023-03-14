class JsonEditor{
  constructor(editorId, editorContent, readOnly, height){
    this.editorId = editorId;
    this.editorContent = editorContent;
    this.autoScroll = false;

    ace.edit(editorId).setTheme("ace/theme/monokai");
    ace.edit(editorId).getSession().setMode("ace/mode/json");
    ace.edit(editorId).getSession().on('change', function() {
        editorContent.val(ace.edit(editorId).getSession().getValue());
    });

    ace.edit(editorId).setShowPrintMargin(false);

    editorContent.val(ace.edit(editorId).getSession().getValue());
    if (readOnly === true) {
        ace.edit(editorId).setReadOnly(true);
        ace.edit(editorId).getSession().setUseWorker(false); //disbale syntax check
    }
  }

  editor(){
    return ace.edit(this.editorId);
  }

  get() {
      return JSON.parse(this.editorContent.val());
  }

  set(message) {
      if (message != undefined) {
          ace.edit(this.editorId).setValue(JSON.stringify(message, null, "\t"));
          if (this.autoScroll) {
              ace.edit(this.editorId).scrollPageDown();
          }
      } else {
          ace.edit(this.editorId).setValue("");
      }
  }

  append(message) {
      var session = ace.edit(this.editorId).session;
      var startLine = session.getLength();
      session.insert({
          row: session.getLength(),
          column: 0
      }, "\n" + JSON.stringify(message, null, "\t") + "\n");
      if (this.autoScroll) {
          ace.edit(this.editorId).scrollPageDown();
      }

      return startLine;
  }

  append_info(message) {
      var session = ace.edit(this.editorId).session;
      session.insert({
          row: session.getLength(),
          column: 0
      }, "\n" + message);
      if (this.autoScroll) {
          ace.edit(this.editorId).scrollPageDown();
      }
  }

  setAutoScroll(autoScroll) {
      this.autoScroll = autoScroll;
  }
}
