// English
'use strict';
var en = function() {}
en.code = 'en';
en.data = {
Version:'&middot; v2.2.11 &middot;&nbsp;',
GP_Wait: 'Please wait… If this message persists, check your connection and click here',
GP_Wait_tran: 'Your request is being processed (approx. 30 sec.). You may click on the arrow and continue using the app.',
ID_placeholder: 'Type a public address here (ex..0x88b..)',
/* Navigation*/
NAV_AddWallet: 'Create a wallet',
NAV_OpenWallet: 'Import a wallet',
NAV_ViewWallet: 'Receive',
NAV_Transaction: 'Send',
NAV_Limites: 'Limits',
NAV_Help: 'Help',
NAV_Transactions: 'Transactions',
NAV_Contacts: 'Contacts',
NAV_roAutor: 'Consultation rights',
NAV_Close: 'Close the wallet',
NAV_OpenStorage: 'Open a wallet',
NAV_Billing: 'Positions\' changes',
NAV_Note: 'Bank Notes',
NAV_Exchange: 'Wallet',
NAV_Global: 'Overview',

FILE_pickWallet: 'Select a wallet file',
FILE_pickContact: 'Select a contact file',
FILE_pickMemo: 'Select a notes file',
FILE_selectedFile: 'Selected file',
FILE_open: 'Select',
FILE_NoFile:'No file available',


HELP_1: 'Wallet Management Help',
HELP_2: 'Wallet Content Help',

PDF_Private_title: 'Your Wallet',
PDF_Private_private: 'Private key',

PDF_Tag_file:'Tags',
PDF_Priv_file:'PrivateKey',
PDF_Pub_file:'PublicKey',



/* Generate Wallets */
GEN_Enter_Token: 'Insert your authorization code',
GEN_USE_BROWSER: 'In order to have multiple copy of the backup, we invite you to create your account using a browser.',
GEN_Scan: 'Scan your QR authorization code',
OPEN_Paper_selected: 'File backup selected.', 
GEN_Token_validation: 'Confirm the authorization code',
GEN_Token_validation_error: 'Please check your authorization code, it is either invalid or incomplete.',
GEN_Token_validation_KO: 'The server is either unavailable or the authorization code you typed is invalid',
GEN_Cancel: 'Cancel operation',
GEN_pswd: 'Type your password  (at least 8 characters, use a mix of upper/lower-case letters and numbers and one symbol)',
GEN_Placeholder_psw: 'Please immediately safely store this password!',
GEN_Enrollment_KO: 'The server is either unavailable or the creation of your wallet was denied.',
GEN_Enrollment_Error: 'An error occurred during the creation of your wallet.',
GEN_Warning_1: 'Beware: If you forget this password, you will lose all funds in this wallet.',
GEN_Create_1: 'Create my wallet',
GEN_Result: 'Your wallet has been created.',
GEN_Warning_2: 'Beware: If you lose your private key, you will lose all funds in this wallet', 
GEN_OK: 'OK',
GEN_ConfirmCreate: 'Conditions of Use',
GEN_GenCondRead: 'I have read and accept ',
GEN_GenCondLink: 'the conditions of use',
GEN_LostPass: 'I have understood that if my password or my backup file (private key) are lost, my funds in this wallet will be lost.',
GEN_Create: 'Create',
GEN_No_config: 'The code provided does not contain any reference to an existing server. Please check.',
GEN_No_server: 'There is no server as referenced in the code provided. Please check.',



/* Open Panel */
OPEN_Choose_bak: 'Select a backup file (example : LEM…..dat)',
OPEN_Choose_file: 'Select a file...',
OPEN_Scan_back: 'Scan a saved file or a printed copy...',
OPEN_Enter_psw: 'Your file is encrypted, please type its password',
OPEN_Placeholder_psw: 'Type the password',
OPEN_Access: 'Access your wallet',
OPEN_Open: 'Open the wallet',


OPEN_partial_scan_title:'Read wallet from partial QRs ',
OPEN_Scan_next_partial:'Scan next QR',
OPEN_cancel_partial:'Cancel',
OPEN_Frag_Wrong_ID:'This QR do not belong to the same wallet',
OPEN_Frag_Read:'The QR has been read',
OPEN_Frag_Already_Know:'This QR has already been read',
OPEN_Frag_Not_Frag:'This QR do not contains a wallet',

Acc_locked: 'Caution: this wallet is currently blocked.',

/* View Wallet*/
VIEW_address: 'Your wallet’s identicon',
VIEW_QR: 'Public QRcode of your wallet',
VIEW_Save_title: 'Backup options for this wallet',
VIEW_Save: 'DAT private key file backup (.dat)',
VIEW_print: 'PDF private key file backup (.pdf)',
VIEW_print_adr: 'Public address (.pdf)', 
VIEW_close_title: 'Close this wallet',
VIEW_close: 'Close',


GEN_Unlock_title: 'Request un-locking of this wallet',
GEN_btn_Unlock: 'Request',
GEN_Unlock_confirm: 'The un-locking request has been sent.',


QRS_title:'QR with reference and amount',
QRS_Description:'Reference:',
QRS_Description_holder:'Your reference',
QRS_amount:'Amount:',
QRS_Cancel:'Cancel',
QRS_Apply:'Apply',


QR_Full:"Full",
QR_1:"1/4",
QR_2:"2/4",
QR_3:"3/4",
QR_4:"4/4",
QR_1_5:"1/5",
QR_2_5:"2/5",
QR_3_5:"3/5",
QR_4_5:"4/5",
QR_5_5:"5/5",

VIEW_print_price: 'Notes',
TAG_Tag_generatio_title: 'Create tags with your public address',
TAG_prod_name: 'Product name',
TAG_Description: 'Product description',
TAG_amount: 'Price',
TAG_Cancel: 'Cancel',
TAG_Get: 'Create',

VIEW_Check_note:'Check a note',
BN_Check_Title:'Check a note',
BN_Close:'Close',
BN_Check:'Check',
BN_CheckingProgress:'Check in progress...',
BN_NotValid:'This address do not match a valid note.',
BN_Valid:'This address do match a valid note of ',


VIEW_Delegation_Allowance: 'Relation to Tiers',
VIEW_Delegate_btn: 'Power of Att.',
VIEW_Allowance_btn: 'Authorizations',
VIEW_CR_btn:        'Consultations',
WIEW_WrongPass: 'Wrong password!',

/* Decrypt */
DCRY_Enter_psw: 'Closed wallet, please enter its password',
DCRY_Placeholder_psw: 'Password',
DCRY_OK: 'OK',
DCRY_Close_title: 'Close this wallet and select another',
DCRY_Close_btn: 'Select another wallet',
DCRY_Close_Wrn: 'Beware! : If you close this wallet without any backed-up files, everything will be lost, including your funds)',
DCRY_Close_conf: 'I have backups\'. I wish to close this wallet.',
DCRY_Close_cancel: 'Keep this wallet open.',
DCRY_Missing_server: 'There is no server associated with this wallet. Please enter your authorization code. (For safety, backup again your files)',



/* Consultation of transactions */

CRI_wrongDates : 'Incompatible dates',
OPEN_not_right_sign : 'Invalid signature',
OPEN_right_not_for_you : 'This right was not issued for you',
OPEN_too_old_right : 'Outdated right',
OPEN_not_right_format : 'Incorrect format',
CRI_CreateBtn : 'Create',
CRI_ConsultRight_List : '',
CRI_Tab_Title:'Your Consultation Rights',
CRI_NoCR : 'No rights',
CRI_ValidityStart : 'From ',
CRI_ValidityEnd : ' To ',
CRI_delete : '&#x2718;',
CRI_confirmDelete : 'Delete consultation right',
CRI_ValidityRange : 'Validity',
CRI_cancel : 'Cancel',
CRI_deleteConfirm : 'Delete',
CRI_Create_title : 'Create a consultation right',
CRI_TargetAddress : 'Granted to',
CRI_DisplayBalance : 'With visible balances',
OPT_no : 'No',
OPT_yes : 'Yes',
CRI_olderTran : 'Can see older transactions',
CRI_create : 'Create',
CRI_QRTitle : 'Consultation right',
CRI_close : 'Close',
CRI_Import : 'Import a consultation right',
CRI_open_file : 'File',
CRI_scan_qr : 'Scan QR',
CRI_selected_wallet : 'Wallet',
CRI_change : 'Change',
ROTR_balances : 'Balances',
TRA_roTransactions : 'Transactions',
CRI_help:'?',
CRI_ERROR_FILE:'This is not a consultation right file.',
OPEN_right_not_right_server:'Thoses rights are not on the right server',
CRI_Help_title:'Consult transactions of another wallet',
CRI_Help_text:'In order to be able to consult transactions of another wallet, a Consultation Right must be granted to you and opened on the "My Account" page.  You can only select your account and accounts for which you have a valid Consultation Right.',
PDF_CR_Title:'Consultation Right',
PDF_CR_Validity:'Validity',
PDF_CR_On:'On wallet',
PDF_CR_Assigned:'Granted to',
CRI_Consult_Help_title:'Concerning Consultation Rights',
CRI_Consult_Help_text:'A Consultation Right gives the possibility to a third party to consult the history of your transactions for a given period, even the balance of your account. By engaging the "coffee mode" (bell), he can also be informed when you receive a payment. To give a Consultation Right, you must create it on this page and then send the file to the third party concerned. To receive a Consultation Right, it is necessary to obtain the file of creation from the third party and to import it on this page through the + button.',

WALL_missing_message_key:'The backup of this wallet is in an outdated format. Please save a new backup.',

/*Transaction*/
TRAN_Address: 'Your wallet',
TRAN_Solde: 'Balance',
TRAN_Dest: 'Recipient',
TRAN_PayShop: 'Payment for a store',
TRAN_ShopId: 'Store ID ',
TRAN_txId: 'Transaction ID ',
TRAN_cancelShop: 'Cancel',

TRAN_Amount: 'Amount',
TRAN_Send: 'Pay', 
TRAN_Confirm_text: 'You are transferring',
TRAN_To: 'to',
TRAN_Cancel: 'Cancel',
TRAN_Confirm: 'Send',
TRAN_Scan: 'Scan the QRcode ',
TRAN_ScanStart: 'Start scanning',
TRAN_OK: 'OK',
TRAN_Enter_pass: 'Please enter your password and confirm payment',

TRAN_Request: 'Invoice',
TRAN_Confirm_text_request: 'You are requesting the payment of',
TRAN_From: 'from',
TRAN_Enter_pass_request: 'Please enter your password and confirm your request',
TRAN_executed_request_text: 'You have sent your payment request',
TRAN_total: 'Total = ',

TRAN_Message_to:'Reference/Message',
TRAN_Message_to_Placeholder:'For the recipient',
TRAN_Message_from:'Note/Memo',
TRAN_Message_from_Placeholder:'For the sender',
TRAN_Message_copy:'Copy',

TRAN_Done: 'The transaction has been sent and is being processed',
TRAN_Wait: '(...)',
TRAN_Ongoing: 'Processing transaction  -',
TRAN_WrongPass: 'Wrong password!',
TRAN_executed_text: 'You have sent a payment order',
TRAN_rejected_request_text: 'You rejected a payment request',
TRAN_tans_id: 'Transaction ID:',
TRAN_NotPossible: 'Insufficient funding for payment',
TRAN_NotPossibleWithoutSplit: 'Online payment can not be made in several transactions. Insufficient funding for a single payment.',
TRAN_SplitedTrans: 'Payment will be made in several transactions',

TRAN_Origine: 'Source',
TRAN_choose_origine_btn: 'Change',

TRAN_Choose_Origine: 'Pay from',
TRAN_MyAccount: 'This wallet',
TRAN_MyDelegations: 'Another wallet',
DELEG_pick: 'Power of Att.',
DELEG_Lim: 'Limit: ',
DELEG_delete:'&#x2718;',
TRAN_Choose: 'Select',
TRAN_AskFrom: 'Payment request from',
TRAN_PAY_ASKED: 'Payment request',

CT_Filter: 'Filter',
CTC_export_mem:'&#x1f4be;',
TRA_Export: 'Export transactions',
TRA_Export_title: 'Export transactions',
TRA_Export_date: 'Transactions between',
TRA_Export_date_to: ' and ',
CVS_COL_id: 'ID',
CVS_COL_date: 'Date',
CVS_COL_hour: 'Hour',
CVS_COL_from: 'From',
CVS_COL_fromAdd:'From',
CVS_COL_to:'To',
CVS_COL_toAdd:'To',
CVS_COL_amount: 'Amount received',
CVS_COL_amount_send: 'Amount sent',
CVS_COL_curr: 'Currency',
CVS_COL_memo: 'Notes.',
CVS_COL_tax: 'Tax',
CVS_COL_del: 'Delegated',
CVS_COL_tr_id: 'Transaction ID',


CVS_COL_address: 'Account',
CVS_COL_Code: 'Id code',
CVS_COL_InPlNb: 'Nb pledge',
CVS_COL_InPlTot: 'Total pledge',
CVS_COL_InPerNaNb: 'Nb trans. nant. recieved from individuals',
CVS_COL_InPerNaTot: 'Total nant. recieved from individuals',
CVS_COL_InPerCmNb: 'Nb tran mutual credit recieved from individuals',
CVS_COL_InPerCmTot: 'Total mutual credit recieved from individuals',
CVS_COL_OutPerNaNb: 'Nb trans nant. send to individuals',
CVS_COL_OutPerNaTot: 'Total nant. send to individuals',
CVS_COL_OutPerCmNb: 'Nb trans mutual credit send to individuals',
CVS_COL_OutPerCmTot: 'Total mutual credit send to individuals',
CVS_COL_InProNaNb: 'Nb trans. nant. recieved from company',
CVS_COL_InProNaTot: 'Total nant. recieved from company',
CVS_COL_InProCmNb: 'Nb tran mutual credit recieved from company',
CVS_COL_InProCmTot: 'Total mutual credit recieved from company',
CVS_COL_OutProNaNb: 'Nb trans nant. send to company',
CVS_COL_OutProNaTot: 'Total nant. send to company',
CVS_COL_OutProCmNb: 'Nb trans mutual credit send to company',
CVS_COL_OutProCmTot: 'Total mutual credit send to company',


OPT_title:'Options:',
OPT_record_password: 'Remember the password for this wallet',
OPT_zero: 'never',
OPT_two_min: '2 min.',
OPT_five_min: '5 min.',
OPT_15_min: '15 min.',
OPT_hour: 'one hour',
OPT_warning: 'Beware! If you save the password, an unauthorized person may have access to this wallet and carry out transactions without any password confirmation.',
OPT_Enter_pass: 'Please enter your password to confirm this change',

/* Biletujo Admin Office*/ 
EXC_Wrong_Acc_Type: 'The selected account is not allowed to access this page',
EXC_Account: 'Account',
EXC_balances: 'Balance',
EXC_Refresh: 'Refresh',
EXC_AccStat: 'Account status',
EXC_LockUnlock: 'Block/ Activate ',
EXC_LockStatus: 'The account is currently ',
EXC_Unlocked: 'active',
EXC_Locked: 'blocked',
EXC_UpdateLim: 'Update',
EXC_Credit_1: 'Credit ',
EXC_Credit_2: ' on account', 
EXC_Credit_prefix: 'Credit ',
EXC_CreditAccount: 'Credit account',
EXC_GestionQR: 'QRcodes Management',

EXC_AccType: 'Account type',
EXC_Account_Type_physical: 'Individual',
EXC_Account_Type_legal: 'Business',
EXC_Account_Type_admin: 'Administrator',
EXC_Update: 'Change account',
EXC_New_type_not_compatible_with_bal: 'The balance is not compatible with an Individual account type.',
EXC_lim_not_compatible_with_bal: 'The balance is not compatible with the new limits.',
EXC_Account_updated: 'Account change request has been processed.',

EXC_ConfirmCreditAccountTitle: 'Confirm credit on account', 
EXC_CreditAmount: 'You credit the account of ',
EXC_Account_credited_with: 'You requested a credit order to this account of',

EXC_cancel: 'Cancel',
EXC_confirm: 'Confirm',


GLB_Connection_error: 'No connection. Check your internet access and reload this page.',
GLB_Loading_api_node: 'Accessing server (this operation may take some time)...',
GLB_No_valid_nodes_reload_them: 'No valid server in the configuration list',
GLB_Relaoad_nodes: 'Reload the list',

GLB_Not_owner: 'Only the account owner of the contract has access to this page',

GLB_tot_p:'Money supply',

GLB_Taxes: 'Transactions fee',
GLB_tax_amount: 'Fee amount in favor of an Individual account holder',
GLB_tax_amount_leg: 'Fee amount in favor of a Business account holder',
GLB_percent: ' per 10000',
GLB_update_tax: 'Change fee amount',
GLB_Change_tax: 'Change fee amount in favor of an Individual account holder',
GLB_NewTaxAmount: 'New fee amount on transactions',

GLB_Change_tax_leg: 'Change fee amount in favor of a Business account holder',

GLB_cancel: 'Cancel',
GLB_confirm: 'Confirm',
GLB_Tax_amount_not_updated: 'An error occurred, your order could not be processd.',
GLB_Tax_amount_updated: 'Your fee amount modification order has been processed.',

GLB_tax_account: 'Fees recipient',
GLB_update_tax_acc: 'Change account',
GLB_Change_tax_Account: 'New fees recipient',
GLB_Tax_account_not_updated: 'An error occurred, your order could not be processed.',
GLB_Tax_account_updated: 'Your recipient modification order has been processed.',

GLB_Ownership: 'Account ownership',
GLB_update_Own_acc: 'Change account ownership',
GLB_Change_owner_Account: 'New account ownership',
GLB_Owner_account_not_updated: 'An error occurred, your order could not be processed.',
GLB_Owner_account_updated: 'Your account ownership modification order has been processed.',

EXC_unknow_address: 'Invalid or unknown account address.',



BIL_Title: 'Positions\' changes for accounts',
BIL_Btn_getAdd:' From a code',
BIL_GetAdd_title:'Lookup account from a code',
BIL_code_input:'Code to search for',
BIL_Code_placeholder:'Code',
BIL_SearchAdd:'Search',
BIL_Close:'Close',
BIL_SearchingCode:'Searching...',
BIL_Between: 'Between',
BIL_and: ' and ',
BIL_Btn_Export: 'Compute positions\' changes',
BIL_Account_list: 'Account list',
BIL_ExpList: '&#x1f4be;',
BIL_ImpList: '&#x1f4c2;',
BIL_AddAdd: '&#x271A;',
BIL_NoAdd: 'No Account.',
BIL_DelAdd: '&#x2718;',

BIL_Progress_title: 'Computing ',
BIL_Cancel: 'Cancel',

BIL_Import_file_title: 'Import account list',
BIL_SelectFile: 'Select a file',
BIL_AddressToImport: ' accounts found',
BIL_ImportSave: 'Import',

BIL_selectedFile: 'Selected file',

BIL_AddAddress_title: 'Add an account',
BIL_chooseAddress: 'Enter the account',
BIL_Save: 'Add',
BIL_AlreadyInList:'Provided account is already in the list.',

BIL_DelAddress_title: 'Do you want to remove this account from the list?',
BIL_DelAllAddress_title: 'Do you want to empty the list of account?',
BIL_RemoveAdd: 'Remove',
BIL_NoValidAddress: 'Invalid file.',

/* Bank Notes */
NOT_Title: 'Adjust bank notes amount',
NOT_Btn_getList:'Load list from a file...',
NOT_amount:'Set note address value to ',
NOT_Btn_charge:'Process',
NOT_progress:'Processing in progress. Completed operations ',
NOT_Currently: ' Currently ',
NOT_Locking: 'Locking address ',
NOT_Pledging: 'Crediting ',
NOT_to: ' to address ',
NOT_completed:'Processing completed',
NOT_NoAdd:'No Note address',
NOT_ConfirmTitle:'Processing Confirmation',
NOT_confirm_text:'You are about to process the adress list setting the value to ',
NOT_Cancel:'Cancel',
NOT_btn_conf_run:'Process',
NOT_NoValidAddress:'Error while reading the file',
NOT_Locked:'Locked',
NOT_Unlocked:'Unlocked',
NOT_Processing_error:'Erroe ib the processing : ',

/* Balance */

BAL_balances: 'Balance:',

BAL_flem: 'Leman Funds: ',


BAL_Tooltip_opt: 'Option',
BAL_Tooltip_sav: 'Save .dat',
BAL_Tooltip_sav_qr: 'Save .pdf',

LIM_limites: 'Limits',
LIM_credit: 'Positive limit:',
LIM_debit: 'Negative limit:',

/* Delegation */
DELEG_Delegate_Tab_Title:'Your Powers of Attorney',
DELEG_CloseTab: 'Close',
DELEG_help: '?',
DELEG_add: '&#x271A;',
DELEG_noDeleg: 'There is no active power of attorney.',
DELEG_next: '>',
DELEG_prev: '<',
DELEG_NoMore: 'There is no further power of attorney.',


DELEG_Delegate_Help_title: 'Concerning Powers of Attorney',
DELEG_Delegate_Help_text: 'A power of attorney authorize a third party to make payments on your behalf. The limit of a power of attorney is the maximum amount that a third party can engage, per transaction, on your behalf.',
DELEG_Close: 'Close',

DELEG_Add_Deleg: 'Add a power of attorney',
DELEG_chooseAddress: 'Select a public address',
DELEG_set_Limit: 'Type a limit',
DELEG_Enter_pass: 'Type your password',
DELEG_cancel_Deleg: 'Cancel',
DELEG_Save_Deleg: 'Confirm',
DELEG_NotAcceptedAddress: 'Invalid public address, it cannot be used for a power of attorney.',
DELEG_InvalidDelegationLimit: 'Invalid power of attorney limit.',
DELEG_LimitAvailable: 'Limit: ',
DELEG_AmountBiggerThanDeleg: 'Typed amount exceeds limit.',

Deleg_order_create_send: 'The power of attorney creation request has been sent.',
Deleg_order_edit_send: 'The power of attorney modification request has been sent.',
Deleg_order_delete_send: 'The power of attorney deletion request has been sent.',


DELEG_Edit_Deleg: 'Transfer the power of attorney',
DELEG_Address: 'To public address',

DELEG_Delete_Deleg: 'Detele a power of attorney',
DELEG_Delete_cancel_Deleg: 'Cancel',
DELEG_Delete_conf_Deleg: 'Delete',

/* Allowance */
ALLOW_Allowance_Tab_Title: 'Your debit authorizations',
ALLOW_CloseTab: 'Close',
ALLOW_help: '?',
ALLOW_add: '&#x271A;',
ALLOW_noAllow: 'There is no active debit authorization.',

ALLOW_Allowance_Help_title: 'Concerning Debit Authorizations',
ALLOW_Allowance_Help_text: 'A debit authorization (direct debit) gives the authorized person the right to withdraw money from your account, up to the amount you specified. Beyond this limit, you will be asked to authorize the requested withdrawal.',
ALLOW_Close: 'Close',
ALLOW_Add_Allow: 'Add a debit authorization',
ALLOW_chooseAddress: 'Select a public address',
ALLOW_set_Amount: 'Enter withdrawal limit',
ALLOW_Enter_pass: 'Enter your password',
ALLOW_cancel_Allowance: 'Cancel',
ALLOW_Save_Allowance: 'Confirm',

ALLOW_Edit_Allowance: 'Transfer the debit authorization',
ALLOW_Address: 'To the following pubic address',

ALLOW_Delete_Allowance: 'Delete the debit authorization',
ALLOW_Delete_cancel_Allowance: 'Cancel',
ALLOW_Delete_conf_Allowance: 'Delete',

ALLOW_NotAcceptedAddress: 'Invalid public address, it cannot be used for a debit authorization.',
ALLOW_InvalidDelegationLimit: 'Invalid authorization amount limit.',

ALLOW_order_create_send: 'The debit authorization creation request has been sent.',
ALLOW_order_edit_send: 'The debit authorization modification request has been sent.',
ALLOW_order_delete_send: 'The debit authorization deletion request has been sent.',

Allow_NoMore: 'There is no further debit authorization.',

/* List des Transactions*/
TRA_Transactions: 'Your transactions',
TRA_Got: 'Received ',
TRA_InDateOf: ' on ',
TRA_From: ' from ',
TRA_Paid: 'Sent ',
TRA_To: ' to ',
TRA_Ammount: 'Amount / Date',
TRA_add: '>',
TRA_prev: '<',
TRA_next: '>',
TRA_check: '&#x2714;',
TRA_NoTrans: 'No transaction associated with this wallet.',
TRA_NoMore: 'No further transaction.',
TRA_Refresh: '&#x21BA;',
TRA_Watch: '&#x1f514;',
TRA_details_title: 'Transaction details',
TRA_details_block: 'Par of block number:',
TRA_details_date: 'Date',
TRA_details_amount: 'Amount transferred',
TRA_Registered: 'Transaction registered',
TRA_Confirmed: 'Transaction completed',
TRA_Close: 'Close',
TRA_memo_title: 'Notes',
TRA_no_valid_memo: 'This file does not contain valid Notes.',
TRA_Import_title: 'Import notes',
TRA_SelectFile: 'Select a file',
TRA_Import_FileNumber: ' Nb of notes in file',
TRA_Import_localNumber: ' Local notes',
TRA_Import_Conflict: ' Shared notes',
TRA_Import_merge: 'Import shared notes ',
TRA_Merge_their: 'Replace notes from file',
TRA_Merge_mine: 'Keep local notes ',
TRA_handle_memo: 'Export transactions ',
TRA_Number: 'Number of transactions par page', 
TRA_Date: 'Date',
TRA_TranId: 'Identifier',
TRA_Memo: 'Note',
TRA_Part: 'Business partner',
TRA_tot_column: 'Total amounts',
TRA_new_tra: 'New transaction',
TRA_not_found: 'No valid transaction corresponds to this QRcode', 
TRA_NotValidCode: 'Invalid QRcode !',

TRA_ToApprove: 'Awaiting validation',
TRA_PendingRequest: 'My requests',
TRA_CloseTab: 'Close',

TRA_pay: 'Pay',
TRA_reject: 'Reject',
TRAN_reject_text: 'You are currently rejecting a payment request of ',
TRAN_asked_by: 'from',
TRAN_Enter_pass_reject: 'Enter your password and confirm your refusal',
TRAN_Keep: 'Cancel',
TRAN_Reject: 'Confirm',

TRA_Approval_Tab_Title: 'Payment requests',
TRA_NoMoreApproval: 'No further payment requests',
TRA_Approval_Help_title: 'Concerning Payment Requests',
TRA_Approval_Help_text: 'This page lists the payment requests addressed to you,  and not yet processed.\n A payment request is generated:\n 1. either when a user requests a payment from you (an invoice to pay from your wallet to his),\n 2. or if you previously gave a debit authorization. In this case the requested amount exceeds the limit you authorized.\n You can reject this transaction and it will be removed from the list.\nIf you accept the request, payment will follow and the corresponding amount debited from your wallet. The transaction will appear, once processed, in your transactions list.',

TRA_Pending_Tab_Title: 'My payment requests',
TRA_NoMorePending: 'No pending request',
TRA_NoMoreAccepted: 'No further request',
TRA_NoMoreRejected: 'No further rejected request',
TRA_Pending_Help_title: 'Concerning my Payment Requests',
TRA_Pending_Help_text: 'This page lists the payment requests you have sent to third parties. The status of all your requests will be shown.',
TRA_Accepted_dissmissed: 'Your request to hide this information has been sent.',
TRA_Request_Rejected: 'Your payment request refusal has been sent.',
TRA_Request_Payed: 'Your payment order has been sent.',




/* Contacts */
CTC_yourContacts: 'Your contacts',
CTC_noContacts: 'No contact referenced.',

CTC_edit:  '&#x270E;',
CTC_editName: 'Change contact name',
CTC_editNameCancel: 'Cancel',
CTC_editNameSave: 'Confirm',
CTC_delete: '&#x2718;',
CTC_confirmDelete: 'Delete contact',
CTC_deleteCancel: 'Cancel',
CTC_deleteConfirm: 'Confirm',

CTC_confirmAdd: 'Add this public address to your contacts',
CTC_withName: 'Type a name',
CTC_addConfirm: 'Add',
CTC_AlreadyAdded: 'This public address already exists',
CTC_updateName: 'Would you like to change the name?',
CTC_addCancel: 'Cancel',
CTC_updateConfirm: 'Confirm',
CTC_no_valid_ctc:'This is not a valid contact file.',


CTC_add: '&#x271A;',


CTC_Tooltip_Ajout: 'Add',
CTC_Tooltip_Rafraichir:'Refresh',
CTC_Tooltip_verify: 'Check a transaction',
CTC_Tooltip_notify: 'Notify me when a new transaction arrives ',

CTC_Add_ctc: 'Add a contact',
CTC_chooseAddress: 'Select a public address',
CTC_chooseName: 'Enter a contact name',
CTC_addNameCancel: 'Cancel',
CTC_addNameSave: 'Confirm',

CTC_pick: 'Contacts',
CTC_pickContact: 'Select a contact',
CTC_cancelChoose: 'Cancel',
CTC_ConfirmChoose: 'Confirm',

CTC_NotSameCurrTitle: 'Incompatible currency',
CTC_NotSameCurrTxt: 'This contact is associated with a different currency from the one used in your wallet. This contact cannot be used as the recipient for a payment.',


CTC_import:  '&#x1f4c2;',
CTC_Tooltip_Import: 'Import',
CTC_export: '&#x1f4be;',
CTC_Tooltip_Export: 'Export',
CTC_Import_title: 'Import contacts',
CTC_SelectFile: 'Select a file',
CTC_Import_file: '',
CTC_Import_FileNumber: ' contacts in the file',
CTC_Import_localNumber:' contacts in your list',
CTC_Import_Conflict: ' contacts both in the file and your list',
CTC_Import_merge: 'Import contacts both in the file and your list ',
CTC_Merge_their: 'By using thoses in the file',
CTC_Merge_mine: 'By keeping mines ',

CTC_Import_save: 'Importer',

PDF_T_date: 'Export date ',
PDF_T_Address: 'Account ',
PDF_T_title: 'Transactions from ',
PDF_T_title_to: ' to ',
PDF_T_title_ext: '(cont.)',
PDF_T_initial_b: 'Initial balance ',
PDF_T_final_b: 'Final balance ',
PDF_T_col_date: 'Date',
PDF_T_col_text: 'Account',
PDF_T_col_memo: 'Memo',
PDF_T_col_send: 'Debit',
PDF_T_col_recieve: 'Credit',
PDF_T_col_balance: 'Balance',
PDF_T_diclaimer: '',
PDF_T_total: 'Total ',

STR_yourWallets: 'Your Portfolio',
STR_forget:'&#x2718;',
STR_editName: 'Assign a name to the wallet',
STR_WarningBrowser: 'You are currently using a web navigator',
STR_WarningQuestion: 'Caution: is this your electronic device?',
STR_No: 'No',
STR_Yes: 'Yes',
STR_logout: 'For your own security and when you wish to close this session, please:\n1. Close your account and return to this window.\n2. Make sure you have a secondary backup of the files related to this portfolio on a different medium (ex. USB key) than the hard disk of this computer.\n3. Eliminate backup copies from this computer (if you have saved any personal data during this session, check in the “Download” folder of this electronic device).\n4. Clear your browser’s history by clicking on the following icon.\n5. Clear your browser’s cache memory.',

STR_Clear: 'Clear history',
STR_NoWallet: 'No wallet',
STR_confirmDelete: 'Delete this wallet from memory',
STR_warning: 'Beware! you must keep a saved copy of the files to reopen your wallet. If it is not already done, you can save them by clicking here',

STR_Backup: 'Save this wallet',
STR_forgetConfirm: 'Cancel',

STR_Lock_wallet_title: 'Close this wallet',
STR_Lock_wallet: 'Close',
STR_Switch_title: 'Open another wallet',
STR_LockCancel: 'Cancel',
/********************************************************/

/* server Error Messages */
Account_Locked_Error: 'The other account is not active.',

  /* Error Messages */
  ERROR_1:              'Please enter valid amount.',
  ERROR_2:              'Your password must be at least 9 characters. Please ensure it is a strong password. ',
  ERROR_3:              'Sorry! We don\'t recognize this type of wallet file. ',
  ERROR_4:              'This is not a valid wallet file. ',
  ERROR_5:              'This unit doesn\'t exists, please use the one of the following units ',
  ERROR_6:              'Invalid address. ',
  ERROR_7:              'Invalid password. ',
  ERROR_8:              'Invalid amount. ',
  ERROR_9:              'Invalid gas limit. ',
  ERROR_10:             'Invalid data value. ',
  ERROR_11:             'Invalid gas amount. ',
  ERROR_12:             'Invalid nonce. ',
  ERROR_13:             'Invalid signed transaction. ',
  ERROR_14:             'A wallet with this nickname already exists. ',
  ERROR_15:             'Wallet not found. ',
  ERROR_16:             'It doesnt look like a proposal with this ID exists yet or there is an error reading this proposal. ',
  ERROR_17:             'A wallet with this address already exists in storage. Please check your wallets page. ',
  ERROR_18:             'You need to have at least 0.001 ETH in your account to cover the cost of gas. Please add some ETH and try again. ',
  ERROR_19:             'All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.',
  ERROR_20:             'Invalid symbol',
  SUCCESS_1:            'Valid address',
  SUCCESS_2:            'Wallet successfully decrypted',
  SUCCESS_3:            'Transaction submitted. TX ID ',
  SUCCESS_4:            'Your wallet was successfully added ',
  SUCCESS_5:            'You have successfully voted. Thank you for being an active participant in The DAO.',
  SUCCESS_6:            'File Selected ',

  /* Geth Error Messages */
  GETH_InvalidSender:      'Invalid sender',
  GETH_Nonce:              'Nonce too low',
  GETH_Cheap:              'Gas price too low for acceptance',
  GETH_Balance:            'Insufficient balance',
  GETH_NonExistentAccount: 'Account does not exist or account balance too low',
  GETH_InsufficientFunds:  'Insufficient funds for gas * price + value',
  GETH_IntrinsicGas:       'Intrinsic gas too low',
  GETH_GasLimit:           'Exceeds block gas limit',
  GETH_NegativeValue:      'Negative value',

 
};

module.exports = en;
