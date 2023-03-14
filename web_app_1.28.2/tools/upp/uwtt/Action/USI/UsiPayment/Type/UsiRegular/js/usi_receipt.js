
class UsiReceipt {
    constructor(basePayment, resource) {
        this.basePayment = basePayment;
        this.session = basePayment.session;
        this.resource = resource;
        this.receipt = resource.receipt;

        $("div").remove(".modal-backdrop");
    }

    process() {
        var that = this;
        $('#modal_content').load('Action/USI/UsiPayment/Type/UsiRegular/receipt.html', function () {
            $('#modal_dlg').one('hidden.bs.modal', function () {
                that.prepareData();
                $('#modal_content').empty();
                that.onSend();
            });

            that.onLoad();
            $('#modal_dlg').modal();
        });
    }

    prepareData() {
    }

    onSend() {
    }

    onLoad() {
        if (this.receipt.header) {
            this.receipt.header.forEach(function(line) {
                $('#usi_receipt .header').append('<div class="line">' + line + '</div>')
            });
            $('#usi_receipt .header').show();
        }
        if (this.receipt.date) {
            $('#usi_receipt .date').append('<span class="">' + moment(this.receipt.date, 'DDMMYY').format("MM/DD/YY") + '</span> ');
        }
        if (this.receipt.time) {
            $('#usi_receipt .date').append(' <span class="">' + moment(this.receipt.time, 'hhmmss').format("LT") + '</span>');
        }

        if (this.receipt.host) {
            if (this.receipt.host.mid) {
                $('#usi_receipt .host').append('<div class="mid">MID: ' + this.receipt.host.mid + '</div>');
            }
            if (this.receipt.host.tid) {
                $('#usi_receipt .host').append('<div class="tid">TID: ' + this.receipt.host.tid + '</div>');
            }
            if (this.receipt.host.batch_number) {
                $('#usi_receipt .host').append('<div class="batch">Batch #: ' + this.receipt.host.batch_number + '</div>');
            }
            if (this.receipt.host.response_text) {
                $('#usi_receipt .host').append('<div class="response">' + this.receipt.host.response_text + ' ' + this.receipt.host.approval_code + '</div>');
            } else if (this.receipt.host.customer_text) {
                $('#usi_receipt .response').append('<div class="response">' + this.receipt.host.customer_text + '</div>');
            }
        }
        if (this.receipt.payment_type) {
            if (this.receipt.payment_type == 'ebt_cash') {
                this.receipt.payment_type = "EBT Cash";
            } else if (this.receipt.payment_type == 'ebt_ewic') {
                this.receipt.payment_type = "EBT eWIC";
            }
            $('#usi_receipt .purchase').append(this.receipt.payment_type.charAt(0).toUpperCase() + this.receipt.payment_type.slice(1) + " ");
        }
        if (this.receipt.txn_type) {
            $('#usi_receipt .purchase').append(this.receipt.txn_type.charAt(0).toUpperCase() + this.receipt.txn_type.slice(1) + " ");
        }

        if (this.receipt.amount) {
            $('#usi_receipt .total').show();
            if (this.receipt.amount.currency) {
                $('#usi_receipt .total').append(" " + this.receipt.amount.currency + " ");
            }
            if (this.receipt.host && this.receipt.host.authorized_amount) {
                $('#usi_receipt .total').append(" $" + parseInt(this.receipt.host.authorized_amount) / 100 + " ");
            }
        }

        if (this.resource.status == 'error') {
            if (this.resource.error_info) {
                $('#usi_receipt .error').append('<div class="error">' + this.resource.error_info.text + '</div>');
                $('#usi_receipt .error').show();
            }
        }

        if (this.receipt.card) {
            if (this.receipt.card.brand) {
                $('#usi_receipt .ccard').append('<div class="brand">' + this.receipt.card.brand + '</div>');
            }
            if (this.receipt.card.pan) {
                $('#usi_receipt .ccard').append('<div class="pan">' + this.receipt.card.pan + '</div>');
            }
        }
        if (this.receipt.emv_data) {
            if (this.receipt.emv_data.aid) {
                $('#usi_receipt .aid').append('<div class="app_id">AID: ' + this.receipt.emv_data.aid + '</div>');
            }
            if (this.receipt.emv_data.app_name) {
                $('#usi_receipt .aid').append('<div class="app_name">' + this.receipt.emv_data.app_name + '</div>');
            }

            if (this.receipt.emv_data.offline_data) {
                //this.receipt.emv_data.offline_data.forEach(function(value, tag) {
                //    $('#usi_receipt .emv_data').append('<div class="line">' + tag.toUpperCase() + + value + '</div>');
                //});
                for(var tag in this.receipt.emv_data.offline_data) {
                    $('#usi_receipt .emv_data').append('<div class="line">' + tag.toUpperCase().replaceAll('_', ' ') + ": " + this.receipt.emv_data.offline_data[tag] + '</div>');
                }
                $('#usi_receipt .emv_data').show();
            }
        }
        if (this.receipt.card_entry_method) {
            $('#usi_receipt .ccard').append('<div class="card_entry_method">Mode: ' + this.receipt.card_entry_method + '</div>');
        } else if (this.receipt.source) {
            var mode = '';
            switch (this.receipt.source) {
                case 'contactless_quick_chip':
                    mode = 'Contactless';
                    break;
                case 'contact_quick_chip':
                    mode = 'Chip';
                    break;
                case 'msr':
                    mode = 'Swipe';
                    break;
                case 'msr':
                    mode = 'Manual Entry';
                    break;
                default:
                    mode = this.receipt.source;
            }
            $('#usi_receipt .ccard').append('<div class="source">Mode: ' + mode + '</div>');

        }
        if (this.receipt.pin_statement) {
            $('#usi_receipt .pin').append('<div class="pin">' + this.receipt.pin_statement + '</div>');
        }
        if (this.resource.app_tags) {
            if (this.resource.app_tags['1002']['data'] == "1") {
                $('#usi_receipt .signature').show();
            }
        }
        if (this.receipt.endorsement) {
            this.receipt.endorsement.forEach(function(line) {
                $('#usi_receipt .endorsement').append('<div class="line">' + line + '</div>')
            });
            $('#usi_receipt .endorsement').show();
        }
        if (this.receipt.footer) {
            this.receipt.footer.forEach(function(line) {
                $('#usi_receipt .footer').append('<div class="line">' + line + '</div>')
            });
            $('#usi_receipt .footer').show();
        }
    }
}
