class BinaryData{
  makeFile(binData){
    var data = new Blob([binData], { type: 'application/octet-stream' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (this.file !== null) {
        window.URL.revokeObjectURL(BinaryData.file);
    }

    this.file = window.URL.createObjectURL(data);
  }

  save(localFileName){
    var link = document.getElementById('downloadlink');
    link.href = this.file;
    link.download = localFileName;
    link.click();
  }
}
