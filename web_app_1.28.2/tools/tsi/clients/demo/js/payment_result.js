/**

 @author Aliaksei Zayats

 @prototype Payment Result

 @usage:

 this.payment_result = new PaymentResult;

 **/
function PaymentResult(result)
{
    this.result = result;
}

PaymentResult.prototype =
{
    TransactionType: function()
    {
        return this.result.type;
    },

    TerminalID: function()
    {
        return this.result.terminal_id;
    },
    
    MerchantID: function()
    {
        return this.result.merchant_id;
    },
    
    TransactionDate: function()
    {
        return this.result.transaction_date;
    },
    
    TransactionTime: function()
    {
        return this.result.transaction_time;
    },
    
    TotalAmount: function()
    {
        return this.result.total_amount;
    },
    
    ReferenceNumber: function()
    {
        return this.result.reference_no;
    },

    CardType: function()
    {
        return this.result.card.type.text;
    },

    EntryMode: function()
    {
        return '';
    },
    
    MaskedPAN: function()
    {
        return this.result.card.account_no;
    },
	
    CustomerName: function()
    {
        if( this.result.customer_name != undefined )
			return this.result.customer_name.replace(/-/g,"_");;
        return '';
    },
    
    HostResponseCode: function()
    {
        if( this.result.host_response_code != undefined )
			return this.result.host_response_code;
        return '';
    },

    HostResponseText: function()
    {
        if( this.result.host_response_text != undefined )
			return this.result.host_response_text;
        return '';
    },
    
    HostReferenceNumber: function()
    {
       return '';
    },
    
    EMV_AID: function()
    {
        if( this.result.emv != undefined )
			return this.result.emv.aid;
		return '';
    },
    
    EMV_TVR: function()
    {
		if( this.result.emv != undefined )
			return this.result.emv.tvr;
		return '';
    },
    
    EMV_ApplicationName: function()
    {
		if( this.result.emv_application_label != undefined )
			return this.result.emv_application_label.replace(/ /g,"_");
		return '';
    },
    
    SignatureFormat: function()
    {
        if ( this.result.unknown != undefined ) {
			for (var i=0; i<this.result.unknown.length; i++) {
				if ( this.result.unknown[i].report_tag_label == "SignatureFormat" ) {
					return this.result.unknown[i].report_tag_value;
				}
			}
		}
        return '';
    },
    
    SignatureData: function()
    {
        if ( this.result.unknown != undefined ) {
			for (var i=0; i<this.result.unknown.length; i++) {
				if ( this.result.unknown[i].report_tag_label == "SignatureData" ) {
					return this.result.unknown[i].report_tag_value;
				}
			}
		}
        return '';
    }
};