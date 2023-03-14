/**
    @brief The map of the end-points and type of transactions (command id)
	endPoint		- end-point string
	endPointName	- UI title for end-point
	uiTypeTitle		- Title show on UI for set of the types (command ids)
	types.value		- the array of available types (commands) for this endPoint
	types.name		- the array of Ui title for each typeValue (command id)
 **/

var endPointMap = [
{
	endPoint:"/tsi/v1/payment",
	endPointName:"Payment",
	uiTypeTitle:"Payment type:",
	types:[	{value:"sale",					name:"Sale"},
			{value:"refund",				name:"Refund"},
			{value:"force",					name:"Force"},
			{value:"void",					name:"Void"},
			{value:"card_balance_inquiry",	name:"Card Balance Inquiry"},
			{value:"reprint_receipt",		name:"Reprint Last Receipt"},
			{value:"pre_auth",				name:"Pre Authorization"},
			{value:"settlement",			name:"Settlement"},
			{value:"auto_settlement",		name:"Auto Settlement"},
			{value:"pre_auth_completion",	name:"Pre Authorization Completion"},
			{value:"auth_only",				name:"Authorization Only"},
			{value:"recall_last_transaction",		name:"Recall Last Transaction"},
			{value:"open_pre_auth",			name:"Open Pre Authorization"},
			{value:"reload",				name:"Reload"},
			{value:"activation",			name:"Activation"},
			{value:"deactivation",			name:"Deactivation"},
			{value:"block_activation",		name:"Block Activation"},
			{value:"block_deactivation",	name:"Block Deactivation"},
			{value:"reactivation",			name:"Reactivation"},
			{value:"block_reactivation",	name:"Block Reactivation"},
			{value:"redemption",			name:"Redemption"},
			{value:"add_tip",				name:"Add Tip"},
			{value:"force_issuance",		name:"Force Issuance"},
			{value:"force_activation",		name:"Force Activation"},
			{value:"force_redemption",		name:"Force Redemption"},
			{value:"zero_gift_card_balance",name:"Zero Gift Card Balance"},
			{value:"tab_open",				name:"Tab Open"},
			{value:"tab_open_force",		name:"Tab Open Force"},
			{value:"tab_close",				name:"Tab Close"},
			{value:"tab_delete",			name:"Tab Delete"},
			{value:"tip_adjust",			name:"Tip Adjust"},
			{value:"verification",			name:"Verification"},
			{value:"get_token",				name:"Get Token"},
			{value:"transaction_adjustment",name:"Transaction Adjustment"},
			{value:"incremental_authorization",name:"Incremental Authorization"},
			{value:"force_pre_auth",        name:"Force Pre-Auth"},
			{value:"force_incremental_authorization", name:"Force Incremental Authorization"},
			{value:"force_tab_close",       name:"Force Tab Close"},
			{value:"custom_request",		name:"Custom request"}
		]
},{
	endPoint:"/tsi/v1/reports",
	endPointName:"Reports",
	uiTypeTitle:"Report Id:",
	types:[	{value:"detail_report",			name:"Detailed"},
			{value:"summary_report",		name:"Summary"},
			{value:"emv_last_tx_report",	name:"EMV Last Transaction"},
			{value:"clerk_summary_report",	name:"Clerk Summary"},
			{value:"parameters_report",		name:"Parameters"},
			{value:"activity_report",		name:"Activity Report"},
			{value:"recent_error",			name:"Recent Error"},
			{value:"clerk_id_list",			name:"Clerk ID List"},
			{value:"emv_key_date_report",	name:"EMV Key Date"},
			{value:"custom_request",		name:"Custom request"}
		]
},{
	endPoint:"/tsi/v1/info",
	endPointName:"Info",
	uiTypeTitle:"Info:",
	types:[	{value:"terminal_info",			name:"Terminal Info"},
			{value:"emv_parameters",		name:"EMV Parameters"},
			{value:"emv_statistic",			name:"EMV Statistics"},
			{value:"emv_public_key",		name:"EMV Public Key"},
			{value:"cd_status",				name:"CD Status"},
			{value:"cd_capability",			name:"CD Capability"},
			{value:"cd_open",				name:"CD Open"},
		 	{value:"saf_indicator",			name:"SAF Indicator"},
		 	{value:"printing_status",		name:"Printing Status"},
			{value:"custom_request",		name:"Custom request"}
		]
},{
	endPoint:"/tsi/v1/config",
	endPointName:"Config",
	uiTypeTitle:"Config:",
	types:[	{value:"software_update",		name:"Software Update"},
			{value:"set_date_time",			name:"Set Date/Time"},
			{value:"custom_request",		name:"Custom request"}
		]
}
];
