class ViewCanvas{
    constructor(image){
        this.image = image;
        $( "div" ).remove(".modal-backdrop");
    }

    toShort(number) {
        var int16 = new Int16Array(1);
        int16[0] = number;
        return int16[0];
    }


    process(){
        var that = this;
        $('#modal_content').load('Action/FormEntry/ResultView/canvas.html', function(){
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
        $('#legacy3byteSig').val(this.image);

        var charArray = Array();
        for (var i = 0; i < this.image.length; i++) {
            charArray.push(this.image.charCodeAt(i));
        }

        var points = Array();
        var minP = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
        var maxP = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
        var curX = 0;
        var curY = 0;
        //console.log("length " + charArray.length);

        for (var i = 0; i < charArray.length; i++) {
            var byteI = charArray[i];
            var byteI1 = charArray[i + 1];
            var byteI2 = charArray[i + 2];
            var byteI3 = charArray[i + 3];

            if (byteI == 0x70) {
                //pen up
                points.push({x: -1, y: -1});
                continue;
            } else if (byteI >= 0x60 && byteI <= 0x6f) {
                curX = (((byteI - 0x60) & 0x0c) << 7) |
                    ((byteI1 - 0x20) << 3) |
                    (((byteI3 - 0x20) & 0x38) >> 3);

                curY = (((byteI - 0x60) & 0x03) << 9) |
                    ((byteI2 - 0x20) << 3) |
                    ((byteI3 - 0x20) & 0x07);

                i += 3;
            } else {
                var offsetX = this.toShort(((byteI - 0x20) << 3) | (((byteI2 - 0x20) & 0x38) >> 3));
                offsetX = this.toShort(this.toShort(offsetX << 7) >> 7);
                i++;
                var offsetY = this.toShort(((charArray[i] - 0x20) << 3) | ((charArray[i + 1] - 0x20) & 0x07));
                offsetY = this.toShort(this.toShort(offsetY << 7) >> 7);
                i++;
                curX += offsetX;
                curY += offsetY;
            }
            points.push({x: curX, y: curY});

            if (minP['x'] > curX) {
                minP['x'] = curX;
            }
            if (minP['y'] > curY) {
                minP['y'] = curY;
            }
            if (maxP['x'] < curX) {
                maxP['x'] = curX;
            }
            if (maxP['y'] < curY) {
                maxP['y'] = curY;
            }
        }

        maxP['x'] = maxP['x'] - minP['x'];
        maxP['y'] = maxP['y'] - minP['y'];

        var c = document.getElementById("signaturePanel");

        var ctx = c.getContext("2d");

        ctx.beginPath();
        var lastPoint = null;

        // center signature on canvas
        var centerX = c.getAttribute("width") / 2 - maxP['x'] / 2;
        var centerY = c.getAttribute("height") / 2 - maxP['y'] / 2;
        ctx.setTransform(1, 0, 0, 1, centerX, -centerY);

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if ((point['x'] == -1) && (point['y'] == -1)) {
                lastPoint = null;
            } else if (lastPoint == null) {
                lastPoint = point;
            } else {
                ctx.moveTo(point['x'] - minP['x'], c.getAttribute("height") - point['y'] - minP['y']);
                ctx.lineTo(lastPoint['x'] - minP['x'], c.getAttribute("height") - lastPoint['y'] - minP['y']);
                ctx.stroke();
                lastPoint = point;
            }
        }
    }
}
