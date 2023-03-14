/**
    @brief The map of the input parameters and type of transactions (command id)
	key					- key name
	value				- store place for the UI input value
	mutuallyExclusive	- exclude those fields if the value is not empty
	related				- include fields if value is not empty
	convertValue		- function(value) {return the converted value}
	alwaysSend			- if true send a parameter even if value is empty
	input				- string represents the html input ui
	customRequest		- if true - convert the text form input to the json and returns back as result
	aplicableFor		- array of applicable transaction types
 **/

var purchaseLevel2Map = [
{
	key:"tax_indicator",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Tax Indicator:</td><td><input class="form-control" type="text" id="tax_indicator"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "pre_auth", "tab_open", "force", "tab_open_force","force_pre_auth", ]
},{
	key:"tax_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Tax amount:</td><td><input class="form-control" type="text" id="tax_amount"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth" ]
},{
	key:"vat_tax_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">VAT TAX Amount:</td><td><input class="form-control" type="text" id="vat_tax_amount"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth" ]
},{
	key:"vat_tax_rate",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">VAT TAX Rate:</td><td><input class="form-control" type="text" id="vat_tax_rate"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth" ]
},{
	key:"discount_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Discount amount:</td><td><input class="form-control" type="text" id="discount_amount"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"freight_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Freight amount:</td><td><input class="form-control" type="text" id="freight_amount"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"duty_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Duty amount:</td><td><input class="form-control" type="text" id="duty_amount"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"purchase_identifier",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Purchase Id:</td><td><input class="form-control" type="text" id="purchase_identifier"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"destination_postal_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Dest. Postal Code:</td><td><input class="form-control" type="text" id="destination_postal_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth" ]
},{
	key:"destination_country_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Dest. Country Code:</td><td><input class="form-control" type="text" id="destination_country_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth" ]
},{
	key:"ship_from_postal_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Origin Post. Code:</td><td><input class="form-control" type="text" id="ship_from_postal_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"merchant_tax_id",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Merchant Tax Id:</td><td><input class="form-control" type="text" id="merchant_tax_id"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"product_description",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Product Description:</td><td><input class="form-control" type="text" id="product_description"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"purchase_card_3_details",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Purchase Card3:</td><td><input class="form-control" type="text" id="purchase_card_3_details"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
}
];


var tokenRelated = [
{
	key:"token",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Token:</td><td><input class="form-control" type="text" id="token"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","force","card_balance_inquiry","auth_only","open_pre_auth","pre_auth_completion",
				  "tab_open","tab_open_force","force_pre_auth","tab_close","force_tab_close","tab_delete","verification"]
}, {
	key:"token_exp_date",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Token Exp Date:</td><td><input class="form-control" type="text" id="token_exp_date"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","card_balance_inquiry","pre_auth_completion","verification"]
},{
	key:"token_card_brand_value",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Token card brand:</td> \
			<td> \
				<select class="form-control" id="token_card_brand_value"> \
					<option value="">None</option> \
					<option value="0">Debit</option> \
					<option value="1">Visa</option> \
					<option value="2">Mastercard</option> \
					<option value="3">Amex</option> \
					<option value="4">Dinerclub</option> \
					<option value="5">Discover</option> \
					<option value="6">JCB</option> \
					<option value="7">Unionpay</option> \
					<option value="8">Other credit</option> \
					<option value="9">Gift</option> \
					<option value="10">Cash</option> \
					<option value="11">EBT food stamp</option> \
					<option value="12">EBT cashbenefit</option> \
					<option value="13">PayPal</option> \
				</select> \
			</td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","card_balance_inquiry","pre_auth_completion","verification"]
}
];

var rootParamMap = [
{
	key:"amount",
	value:1,
	alwaysSend:false,
	input:'<td class="input-group-text">Amount $:</td><td><input class="form-control" type="text" id="amount"/></td>',
	object:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","force","pre_auth_completion","auth_only","reload",
				  "activation","block_activation","redemption","add_tip","force_issuance","force_activation","force_redemption",
				  "reactivation","block_reactivation","tab_open","tab_open_force","force_pre_auth","tab_close","force_tab_close","transaction_adjustment","incremental_authorization","force_incremental_authorization"],
	onLoad:function(){ setInputMask(this.key); },
	convertValue:function(){return unmaskAmount(this.key);},
	emptyZero : true
},{
	key:"dcc_conversion_rate",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">DCC conv. rate:</td><td><input class="form-control" type="text" id="dcc_conversion_rate"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["refund"]
},{
	key:"dcc_card_holder_currency_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">DCC currence code:</td><td><input class="form-control" type="text" id="dcc_card_holder_currency_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["refund"]
},{
	key:"dcc_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">DCC Amount $:</td><td><input class="form-control" type="text" id="dcc_amount"/></td>',
	object:undefined,
	customRequest:false,
	aplicableFor:["refund"],
	onLoad:function(){ setInputMask(this.key); },
	convertValue:function(){return unmaskAmount(this.key);}
},{
	key:"tender_type",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Tender:</td> \
			<td> \
				<select class="form-control" id="tender_type"> \
					<option value="">None</option> \
					<option value="all">All</option> \
					<option value="cash">Cash</option> \
					<option value="credit">Credit</option> \
					<option value="debit">Debit</option> \
					<option value="ebt">Ebt</option> \
					<option value="gift">Gift</option> \
				</select> \
			</td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","refund","force"]
},{
	key:"tender_type",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Tender:</td> \
			<td> \
				<select class="form-control" id="tender_type"> \
					<option value="">None</option> \
					<option value="credit">Credit</option> \
					<option value="debit">Debit</option> \
					<option value="ebt">Ebt</option> \
					<option value="gift">Gift</option> \
				</select> \
			</td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["card_balance_inquiry"]
},{
	key:"clerk_id",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Clerk id:</td><td><input class="form-control" type="text" id="clerk_id"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","force","card_balance_inquiry","auth_only","reload","activation",
			      "block_activation","redemption","add_tip","force_issuance","force_activation","force_redemption",
	              "deactivation","block_deactivation","reactivation","zero_gift_card_balance","block_reactivation",
				  "tab_open","tab_open_force","force_pre_auth","tip_adjust"]
},{
	key:"invoice_no",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Invoice #:</td><td><input class="form-control" type="text" id="invoice_no"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","refund","force","pre_auth_completion","auth_only","reload","activation","block_activation",
				  "redemption","add_tip","force_issuance","force_activation","force_redemption","deactivation","block_deactivation",
				  "reactivation","zero_gift_card_balance","block_reactivation","tab_open","tab_open_force","force_pre_auth","tip_adjust","pre_auth"]
},{
	key:"merchant_id",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Merchant:</td><td><input class="form-control" type="text" id="merchant_id"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","settlement","auto_settlement","force","card_balance_inquiry","pre_auth_completion",
			      "void","auth_only","detail_report","summary_report","clerk_summary_report","open_pre_auth","reload","activation",
				  "block_activation","redemption","add_tip","force_issuance","force_activation","force_redemption","deactivation",
				  "block_deactivation","reactivation","zero_gift_card_balance","block_reactivation","tab_open","printing_status",
				  "tab_open_force","force_pre_auth","tab_close","force_tab_close","tab_delete","tip_adjust","verification"]
},{
	key:"merchant_tax_id",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Merchant Tax Id:</td><td><input class="form-control" type="text" id="merchant_tax_id"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion"]
},{
	key:"tip_amount",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Tip amount $:</td><td><input class="form-control" type="text" id="tip_amount"/></td>',
	object:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","card_balance_inquiry","tip_adjust","verification","transaction_adjustment"],
	onLoad:function(){ setInputMask(this.key); },
	convertValue:function(){return unmaskAmount(this.key);}
},{
	key:"commercial_card_indicator",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Com. Card Indctr:</td><td><input class="form-control" type="text" id="commercial_card_indicator"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","card_balance_inquiry","verification", "tab_open"]
},{
	key:"supplier_no",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Supplier #:</td><td><input class="form-control" type="text" id="supplier_no"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion"]
},{
	key:"host_transaction_id",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Host trns. Id:</td><td><input class="form-control" type="text" id="host_transaction_id"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["refund"]
},{
	key:"ebt_voucher_no",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">EBT Vaucher #:</td><td><input class="form-control" type="text" id="ebt_voucher_no"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["force"]
},{
	key:"ebt_voucher_app_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">EBT Vaucher App Code:</td><td><input class="form-control" type="text" id="ebt_voucher_app_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["force"]
},{
	key:"reference_no",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Ref #:</td><td><input class="form-control" type="text" id="reference_no"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["void","pre_auth_completion","tab_close","force_tab_close","tab_delete","tip_adjust","transaction_adjustment","incremental_authorization","force_incremental_authorization"]
},{
	key:"host_approval_code",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text">Host App Code:</td><td><input class="form-control" type="text" id="host_approval_code"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["force_incremental_authorization","force_tab_close"]
},{
	key:"token_request",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Token req:</td> \
			<td> \
				<select class="form-control" id="token_request" onchange="onTokenRequestChanged()"> \
					<option value="1">Yes</option> \
					<option value="">None</option> \
				</select> \
			</td>',
	object:undefined,
	related:undefined,
    mutuallyExclusive:tokenRelated,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth","refund","force","card_balance_inquiry","auth_only","open_pre_auth","pre_auth_completion","tab_open",
				  "tab_open_force","force_pre_auth","tab_close","force_tab_close","verification"]
},{
	key:"order_number",
	value:"",
	alwaysSend:false,
	input:'<td class="input-group-text" style="text-align: left">Order Number:</td><td><input class="form-control" type="text" id="order_number"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"purchase_level_2",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text" style="vertical-align:top">Purch. lev2:</td> \
			<td style="vertical-align:top"> \
				<select class="form-control" id="purchase_level_2" onchange="onPurchaseLevel2Changed()"> \
					<option value="">None</option> \
					<option value="include">Include</option> \
				</select> \
			</td>',
	object:purchaseLevel2Map,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["sale","pre_auth_completion", "tab_open", "pre_auth", "force", "tab_open_force","force_pre_auth"]
},{
	key:"parameter_type",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Parameter Type:</td>\
			<td> \
				<select class="form-control" id="parameter_type"> \
					<option value="">None</option> \
					<option value="all">All</option> \
					<option value="clerk">Clerk</option> \
					<option value="communication">Communication</option> \
					<option value="download_only">Download Only</option> \
					<option value="receipt">Receipt</option> \
					<option value="security">Security</option> \
					<option value="semi_integrated">Semi Integrated</option> \
					<option value="setup">Setup</option> \
					<option value="terminal_settings">Terminal Settings</option> \
					<option value="transaction_options">Transaction Options</option> \
				</select> \
			</td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["parameters_report"]
},{
	key:"date",
	value:"YYMMDD",
	alwaysSend:false,
	input:'<td class="input-group-text">Date:</td><td><input class="form-control" type="text" id="date"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["set_date_time"]
},{
	key:"time",
	value:"HHMMSS",
	alwaysSend:false,
	input:'<td class="input-group-text">Time:</td><td><input class="form-control" type="text" id="time"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["set_date_time"]
},{
	key:"reprint_type",
	value:"",
	alwaysSend:false,
	input: '<td class="input-group-text">Reprint Type:</td> \
			<td> \
				<select class="form-control" id="reprint_type"> \
					<option value="merchant_copy">Merchant</option> \
					<option value="customer_copy">Customer</option> \
				</select> \
			</td>',
	object:undefined,
	convertValue:undefined,
	customRequest:false,
	aplicableFor:["reprint_receipt"]
},{
	key:"custom_request",
	value:"",
	alwaysSend:false,
	input:'<td></td><td><textarea class="form-control" style="overflow:auto; width:100%" rows="10" id="custom_request"/></td>',
	object:undefined,
	convertValue:undefined,
	customRequest:true,
	aplicableFor:["custom_request"]
}
];
