function JsonEditor(editorId, editorContent, readOnly, height) {
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


JsonEditor.prototype = {
    constructor: JsonEditor,
    get: function() {
        return JSON.parse(this.editorContent.val());

    },
    set: function(message) {
        if (message != undefined) {
            ace.edit(this.editorId).setValue(JSON.stringify(message, null, "\t"));
            if (this.autoScroll) {
                ace.edit(this.editorId).scrollPageDown();
            }
        } else {
            ace.edit(this.editorId).setValue("");
        }
    },
    append: function(message) {
        var session = ace.edit(this.editorId).session;
        session.insert({
            row: session.getLength(),
            column: 0
        }, "\n" + JSON.stringify(message, null, "\t") + "\n");

        var l = session.getLength();
        var maxSize = 10000;
        if(l > maxSize) {
          ace.edit(this.editorId).setValue("");
        }

        if (this.autoScroll) {
            ace.edit(this.editorId).scrollPageDown();
        }
    },
    append_info: function(message) {
        var session = ace.edit(this.editorId).session;
        session.insert({
            row: session.getLength(),
            column: 0
        }, "\n" + message);
        if (this.autoScroll) {
            ace.edit(this.editorId).scrollPageDown();
        }
    },
    setAutoScroll: function(autoScroll) {
        this.autoScroll = autoScroll;
    }
}