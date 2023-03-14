function BinaryData() {}

/*public static member*/
BinaryData.fileName = "data.dat";
BinaryData.file = null;

/*public static methods*/

BinaryData.onShow = function(binData) {
    $('#downloadFileName').val(BinaryData.fileName);
    BinaryData.makeFile(binData);
}

BinaryData.makeFile = function(binData) {
    var data = new Blob([binData], { type: 'application/octet-stream' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (BinaryData.file !== null) {
        window.URL.revokeObjectURL(BinaryData.file);
    }

    BinaryData.file = window.URL.createObjectURL(binData);
};

BinaryData.onSave = function() {
    BinaryData.fileName = $('#downloadFileName').val();
    var link = document.getElementById('downloadlink');
    link.href = BinaryData.file;
    link.download = BinaryData.fileName;
    link.click();
    $('#saveFile').modal('hide');
}