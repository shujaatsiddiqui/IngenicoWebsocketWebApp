if (selectedItems == undefined) {
    var selectedItems = [];
}

if (totalPrice == undefined) {
    var totalPrice = 0;
}

if (salesTax == undefined) {
    var salesTax = 0;
}


var getIndexIfObjectWithAttr = function (array, attr, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] != undefined) {
            if (array[i][attr] === value) {
                return i;
            }
        }
    }
    return -1;
};

var emptyCart = function () {
    if (confirm('Do you really want to cancel this order?')) {
        clearCart();
    }
};

function clearCart() {
    selectedItems = [];
    totalPrice = 0.0;
    salesTax = 0.85;
    var html = "<div id='cart'>" +
        "<div class='panel-body'>ITEMS / RECEIPT</div>" +
        "<h3>Your cart is empty</h3>" +
        "<p>Please, click on the product icon for adding it to the cart.</p>" +
        "</div>";
    $(html).replaceAll("#cart");
}

var updateItem = function (itemIndex) {
    var currentItem = selectedItems[itemIndex];
    selectedItems[itemIndex]["html"] = ("<div id='" + selectedItems[itemIndex]["id"] + "' class='item_in_cart'>" +
        "<span class='item_title'>" + selectedItems[itemIndex]["title"] + "</span>" +
        "<span item_index='" + itemIndex + "' class='items_count'> x" + selectedItems[itemIndex]["count"] + "</span>" +
        "<span item_index='" + itemIndex + "' class='items_price'> $ " + (selectedItems[itemIndex]["count"] * selectedItems[itemIndex]["price"]).toFixed(2) + "</span> " +
        ("</div>"));
    var decreaseSpan = '<a href="javascript:void(0)" onclick="decreaseCount(' + itemIndex + ')"><span class="glyphicon glyphicon-minus"></span></a>';
    var increaseSpan = '<a href="javascript:void(0)" onclick="increaseCount(' + itemIndex + ')"><span class="glyphicon glyphicon-plus"></span></a>';
    var itemsCountHTML = " <span item_index='" + itemIndex + "' class='items_count'>" + decreaseSpan + " x" + currentItem["count"] + " " + increaseSpan + "</span> ";
    var itemsPriceHTML = " <span item_index='" + itemIndex + "' class='items_price'> $ " + (currentItem["count"] * currentItem["price"]).toFixed(2) + "</span>";
    $(itemsCountHTML).replaceAll('#' + currentItem["id"] + ' span.items_count');
    $(itemsPriceHTML).replaceAll('#' + currentItem["id"] + ' span.items_price');
};

var editCart = function () {
    $("    <a href='javascript:void(0)' id='apply_edited_cart' onclick='applyEdit()'>Apply</a>").replaceAll("#cart_edit_order");
    $.each(selectedItems, function (_, el) {
        if (el != undefined) {
            var itemIndex = $('#' + el["id"] + ' span.items_count').attr("item_index");
            var decreaseSpan = '<a href="javascript:void(0)" onclick="decreaseCount(' + itemIndex + ')"><span class="glyphicon glyphicon-minus"></span></a>';
            var increaseSpan = '<a href="javascript:void(0)" onclick="increaseCount(' + itemIndex + ')"><span class="glyphicon glyphicon-plus"></span></a>';
            var removeSpan = '<a href="javascript:void(0)" onclick="removeItem(' + itemIndex + ')"><span class="glyphicon glyphicon-remove"></span></a>';
            var itemsCountHTML = " <span item_index='" + itemIndex + "' class='items_count'>" + decreaseSpan + " x" + el["count"] + " " + increaseSpan + "</span> ";
            $(itemsCountHTML).replaceAll('#' + el["id"] + ' span.items_count');
            $(removeSpan).appendTo('#' + el["id"]);
        }
    });
};

var applyEdit = function () {
    $("    <a href='javascript:void(0)' id='cart_edit_order' onclick='editCart()'>Edit</a>").replaceAll("#aplly_edited_cart");
    redrawCart();
};

var increaseCount = function (itemIndex) {
    selectedItems[itemIndex]["count"] = selectedItems[itemIndex]["count"] + 1;
    //console.log(selectedItems);
    updateItem(itemIndex);
    updateTotals();
};

var decreaseCount = function (itemIndex) {
    if (selectedItems[itemIndex]["count"] > 1) {
        selectedItems[itemIndex]["count"] = selectedItems[itemIndex]["count"] - 1;
        updateItem(itemIndex);
        updateTotals();
    } else if (selectedItems[itemIndex]["count"] == 1) {
        updateItem(itemIndex);
        updateTotals();
    }
};

var redrawCart = function () {
    $("#cart").empty();
    drawCart();
};

var updateTotals = function () {
    var items_price = 0;
    totalPrice = 0;
    $.each(selectedItems, function (_, el) {
        if (el != undefined) {
            items_price = items_price + (el["price"] * el["count"]);
        }
    });
    totalPrice = totalPrice + items_price;
    salesTax = totalPrice * 0.085;
    var salesTaxHTML = ("<div id='sales_tax'><span style='width: 70%; display: inline-block; margin-top: 20px;'>Sales tax @ .085: </span><span style='color: #808080; text-align: right; display: inline-block;'> $ " + salesTax.toFixed(2) + "</span></div>");
    var totalPriceHTML = ("<div id='total_price' style='border-top: 1px solid #8e8e93'><span style='color: #00c00c; width: 70%; display: inline-block;'><h4>Total with tax: </h4></span><span style='color: #00c00c; text-align: right; display: inline-block;'><h4> $ " + (totalPrice + salesTax).toFixed(2) + "</h4></span></div>");
    $(salesTaxHTML).replaceAll("#sales_tax");
    $(totalPriceHTML).replaceAll("#total_price");
};

var dateTimeNow = function () {
    var date = "";
    var d = new Date();
    var DD = d.getDay();
    var MM = d.getMonth() + 1; //Months are zero based
    var YYYY = d.getFullYear();
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    DD = DD < 10 ? "0" + DD : DD;
    MM = MM < 10 ? "0" + MM : MM;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    h = h < 10 ? "0" + h : h;
    date = MM + "-" + DD + "-" + YYYY + " " + h + ":" + m

    /* if you want to add seconds
     date  += ":"+s;  */
    date += dd;
    return date;
};

var drawCart = function () {
    var d = new Date();


    var html = "<div id='cart'>" +
        "<div class='panel-body'><h4>ITEMS / RECEIPT</h4></div>" +
        "    <div id='cart_controls' class='cart-controls'>" +
        "       <div class='cart-control-link'>" +
        "           <div class='link-wrap' style='text-align: left'><a href='javascript:void(0)' id='cart_cancel_order' onclick='emptyCart()'><h4>Cancel order</h4></a></div>" +
        "           <div class='link-wrap' style='text-align: right'><a href='javascript:void(0)' id='cart_edit_order' onclick='editCart()'><h4>Edit</h4></a></div>" +
        "       </div>" +
        "    </div>" +
        "<hr style='margin-top: 0;'/>" +
//        "<div class='ticket_logo'><img src='images/ticket_logo.png'></div>" +
//        "<div class='ticket_logo'>" +
//        "Booth 3339 - #INGNRF14," + "</br>" +
//        "Jacob K. Javits Convention center" + "</br>" +
//        "New York City, United States" + "</br>" +
//        "(678) 456-1200" + "</br>" +
//        "</div>" +
//        "<div class='ticket-timestamp'>" + dateTimeNow() + "</div>" +
        "<div class='cart-borders top'></div>" +
        "<div class='cart-borders center'>";

    //$.removeCookie("cart");
    //$.cookie("cart", JSON.stringify(items));

    $.each(selectedItems, function (_, el) {
        if (el != undefined) {
            //console.log(el)
            html = html + el["html"];
        }
    });

    html = html +
        "   <div id='sales_tax'><span style='width: 70%; display: inline-block; margin-top: 20px;'>Sales tax @ .085: </span><span style='color: #808080; text-align: right; display: inline-block;'> $ " + salesTax.toFixed(2) + "</span></div>" +
        "   <div id='total_price' style='border-top: 1px solid #8e8e93'><span style='color: #00c00c; width: 70%; display: inline-block;'><h4>Total with tax: </h4></span><span style='color: #00c00c; text-align: right; display: inline-block;'><h4> $ " + (totalPrice + salesTax).toFixed(2) + "</h4></span></div>" +
        "   </div>" +
        "   <div class='cart-borders bottom'></div>" +
        "   <div class='bottom-controls'>" +
        "       <div class='checkout'>" +
        "           <a href='javascript:void(0)' onclick='checkoutCart(this)'>Check Out</a>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    $(html).replaceAll("#cart");
};

function printReceipt(payment_json_data)
{
    this.payment_result = new PaymentResult(payment_json_data);
    
    var d = new Date();
    html = '<div class="panel-body"><h4>RECEIPT</h4></div>' +                                            // Title
        '<div class="cart-borders top"></div><div class="cart-borders center">' +                        // 
        '<div style="text-align: center"><h4>SPORT STORE</h4></div>' +                                   // Merchant
        '<div style="text-align: center;"><h2>' + this.payment_result.TransactionType() + '</h2></div>'  // Transaction type
      + '<div class="item_in_cart">'
            + '<span class="item_title">MID: </span><span class="item_title">' + this.payment_result.MerchantID() + '</span>&nbsp;'   // MID
            + '<span class="item_title">TID: </span><span class="item_title">' + this.payment_result.TerminalID() + '</span>&nbsp;'   // TID
            + '<span class="item_title">REF: </span><span class="item_title">' + this.payment_result.ReferenceNumber() + '</span>'    // Ref Number
            + '</div>'
      + '<div class="item_in_cart">'
            + '<span class="item_title">Date/Time </span><span class="item_title">' + this.payment_result.TransactionDate() + '/' + this.payment_result.TransactionTime() + '</span></div>'   // Date/Time
      + '<div class="item_in_cart">'

    $.each(selectedItems, function (_, el)
    {
        if (el != undefined) {
            html = html + el["html"];
        }
    });

    html = html + "<div id='sales_tax'><span style='width: 70%; display: inline-block; margin-top: 20px;'>Sales tax @ .085: </span><span style='color: #808080; text-align: right; display: inline-block;'> $ " + salesTax.toFixed(2) + "</span></div>" +
        "<div id='total_price' style='border-top: 1px solid #8e8e93'><span style='color: #00c00c; width: 70%; display: inline-block;'><h4>AMOUNT: </h4></span><span style='color: #00c00c; text-align: right; display: inline-block;'><h4> $ " + (totalPrice + salesTax).toFixed(2) + "</h4></span></div>";

	if( this.payment_result.EntryMode() != "")
    	html = html + '<span class="item_title">Entry Mode: </span><span class="items_price">' + this.payment_result.EntryMode() + '</span>';
	if( this.payment_result.EMV_AID() != "")
    	html = html + '<span class="item_title">EMV AID: </span><span class="items_price">' + this.payment_result.EMV_AID() + '</span>';
	if( this.payment_result.EMV_ApplicationName() != "")
    	html = html + '<span class="item_title">EMV APP: </span><span class="items_price">' + this.payment_result.EMV_ApplicationName() + '</span>';
	if( this.payment_result.EMV_TVR() != "")
    	html = html + '<span class="item_title">EMV TVR: </span><span class="items_price">' + this.payment_result.EMV_TVR() + '</span>';
	if( this.payment_result.CustomerName() != "")
    	html = html + '<span class="item_title">CUSTOMER: </span><span class="items_price">' + this.payment_result.CustomerName() + '</span>';
	if( this.payment_result.MaskedPAN() != "")
    	html = html + '<span class="item_title">PAN: </span><span class="items_price">' + this.payment_result.MaskedPAN() + '</span>';
	if( this.payment_result.HostReferenceNumber() != "")
    	html = html + '<span class="item_title">Host Ref Number: </span><span class="items_price">' + this.payment_result.HostReferenceNumber() + '</span>'                

    html = html+ '</div>';
            
    if ( this.payment_result.SignatureData().length > 0 )
    {
        html = html
                + '<div class="item_in_cart" style="text-align: center">'
                +   '<img style="width: 80%" src="data:image/jpeg;base64,' + this.payment_result.SignatureData() + '" alt="Signature"/>'
                + '</div>';
    }

           
    html = html + '<div style="text-align: center;"><h4>' + this.payment_result.HostResponseText() + '</h4></div>' +
        '<div class="item_in_cart receipt_agreement" style="text-align: center;">I AGREE TO PAY ABOVE TOTAL AMOUNT<br/>IN ACCORDANCE WITH CARD ISSUER\'S AGREEMENT</div>' +
        '<div class="item_in_cart" style="text-align: center;">Thank You<br/>Please Come Again</div>' +
        '</div><div class="cart-borders bottom"></div>' +
        '<div class="checkout"><a href="javascript:void(0)" onclick="clearCart()">Place New Order</a></div></div>';

    return html;
}

function printErrorMessage(text)
{
    var d = new Date();
    html = '<div class="panel-body"><h4>RECEIPT</h4></div>' +                                                           // Title
        '<div class="cart-borders top"></div><div class="cart-borders center">' +                                       // 
        '<div style="text-align: center"><h4>'+text+'</h4></div>' +                                                         // Merchant
        '</div><div class="cart-borders bottom"></div>' +
        '<div class="checkout"><a href="javascript:void(0)" onclick="clearCart()">Place New Order</a></div></div>';
    return html;
}


var removeItem = function (itemIndex)
{
    delete selectedItems[itemIndex];
    redrawCart();
    updateTotals();
    editCart();
};

$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});

$("div.item").click(function () {
    var item = {};
    $(this).find("img").hide().fadeIn();
    item["title"] = $(this).attr("title");
    item["price"] = parseFloat($(this).attr("price")).toFixed(2);
    item["id"] = ("selected-") + $(this).attr('id');
    var itemIndex = getIndexIfObjectWithAttr(selectedItems, "title", item["title"]);

    if (itemIndex == -1) {
        selectedItems.push(item);
        itemIndex = selectedItems.length - 1;
        item["count"] = 1;
    } else {
        item["count"] = selectedItems[itemIndex]["count"] + 1;
    }

    item["html"] = ("<div id='" + item["id"] + "' class='item_in_cart'>" +
        "<span class='item_title'>" + item["title"] + "</span>" +
        "<span item_index='" + itemIndex + "' class='items_count'> x" + item["count"] + "</span>" +
        "<span item_index='" + itemIndex + "' class='items_price'> $ " + (item["count"] * item["price"]).toFixed(2) + "</span> " +
        ("</div>"));
    selectedItems[itemIndex] = item;
    drawCart();
    updateTotals();
});

function checkoutCart(link_obj)
{
    $( ".checkout" ).css( "background-color", "#777777" );
    link_obj.innerHTML = "See PinPad for Instructions";
    var paymentParameter = {amount:totalPrice + salesTax, type:"sale"};
    var callbacks = { progress:          function(text) {link_obj.innerHTML=text;},
                      printReceipt:      function(trResult) {$("#cart").html(printReceipt(trResult));},
                      printErrorMessage: function(text)     {$("#cart").html(printErrorMessage(text));}
                    };

	var cents = (paymentParameter.amount.toFixed(2)*100).toString();
	var payPar = {amount:cents, type:paymentParameter.type};
	
	Transaction.do(Settings.server, "/Tsi/v1/payment", payPar, callbacks);

	return selectedItems;
}
