class ViewSignaturePad {
    constructor(image){
        this.image = image;
        $( "div" ).remove(".modal-backdrop");
    }

    process(){
        var that = this;
        $('#modal_content').load('Action/FormEntry/ResultView/signature_pad.html', function(){
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
    }

    onSend(){
    }

    onLoad(){
        $('#points_array').val(this.image);
        try {
            var canvas = document.getElementById("signaturePanel");
            var signaturePad = new SignaturePad(canvas);
            signaturePad.off();
            console.log(this.image)
            console.log(JSON.parse(this.image))
            signaturePad.clear();
            signaturePad.fromData(JSON.parse(this.image));
        } catch(err) {
            alert("Unable to show point array data: " + err.message)
        }

    }
}
