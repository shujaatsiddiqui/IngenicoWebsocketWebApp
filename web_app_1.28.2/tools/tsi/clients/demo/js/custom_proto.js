/**

 @author Roman Lishtaba

 @prototype String, Total, Element, Layout

 @usage: Simple structures for handling JS

 **/


/** @prototype: String **/

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

/** ------------------------ @prototype: Total ------------------------ **/

function Total() {
    this.price = 0.0;
    this.counter = 0;
    this.title = 'Total:';
    this.taxes_correlation = 0.085;
    this.taxes = 0.0;
    this.taxes_title = 'Sales tax @';

}

Total.prototype = {

    computeTaxes: function()
    {
        this.taxes = (this.price * this.taxes_correlation).toFixed(2);
    },

    subTotal: function()
    {
        this.computeTaxes();

        return parseFloat(this.taxes) + parseFloat(this.price.toFixed(2));
    },

    toTaxesLine: function(ld_size, currency_char)
    {
        this.computeTaxes();

        var char_buffer = ld_size - (this.taxes_title.length + this.taxes.length + currency_char.length);

        return this.taxes_title + '.'.repeat(char_buffer) + currency_char + this.taxes
    },

    toTotalLine: function(ld_size, currency_char)
    {
        var char_buffer = ld_size - (this.title.length + this.subTotal().toString().length + currency_char.length);

        return this.title + '.'.repeat(char_buffer) + currency_char + this.subTotal();

    }

};

/** ------------------------ @prototype: Element ------------------------ **/

function Element() {
    this.title = '';
    this.delimiter = 'x';
    this.counter = 0;
    this.currency = '......$';
    this.price = 0.0;
}

Element.prototype = {

    toLine: function(diff)
    {
        return this.title + '.'.repeat(diff) + this.delimiter + this.counter + this.currency + this.price.toString();
    }
};

/** ------------------------ @prototype: Layout ------------------------ **/

function Layout(element) {

    this.title = element.title.length;
    this.delimiter = element.delimiter.length;
    this.counter = element.counter.toString().length;
    this.currency = element.currency.length;
    this.price = element.price.length;
}

Layout.prototype = {

    toLength: function()
    {
        return this.title + this.delimiter + this.counter + this.currency + this.price;
    }
};
