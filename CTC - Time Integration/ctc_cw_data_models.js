//CONSTANTS
var CONTACT_REQ_STRING = 'company/contacts';
var COMPANY_REQ_STRING = 'company/companies';
var ITEM_REQ_STRING = 'procurement/catalog';
var INVITEM_REQ_STRING = 'procurement/products';
var PROJECT_REQ_STRING = 'project/projects';
var AGREEMENT_REQ_STRING = 'finance/agreements';
var EXPENSE_REQ_STRING = 'expense/entries';
var EXPENSETYPE_REQ_STRING = 'expense/types';
var TIME_REQ_STRING = 'time/entries';
var PROJECTTICKET_REQ_STRING = 'project/tickets';
var SERVICETICKET_REQ_STRING = 'service/tickets';
var INVOICE_REQ_STRING = 'finance/invoices';
var WORKTYPE_REQ_STRING = 'time/workTypes';
var CUSTOMFIELD_REQ_STRING = 'system/userDefinedFields';
var COMPANYTYPE_REQ_STRING = 'company/companies/types';
var PURCHASEORDERHEADER_REQ_STRING = 'procurement​/purchaseorders'
var PURCHASEORDERLINE_REQ_STRING = 'lineitems';
var SITE_REQ_STRING = 'sites';
var LOCATION_REQ_STRING = 'system/locations';
var STATE_REQ_STRING = 'company/states';
var AGREEMENT_TYPE_REQ_STRING = 'finance/agreements/types';
var CONFIGURATION_TYPE_REQ_STRING = 'company/configurations/types';
var CONFIGURATION_REQ_STRING = 'company/configurations';
var SALESORDER_REQ_STRING = 'sales/orders';
var AGREEMENTADDITION_REQ_STRING = 'additions';
var AGREEMENTADJUSTMENT_REQ_STRING = 'adjustments';
var AGREEMENTSITE_REQ_STRING = 'sites';
var MEMBER_REQ_STRING = 'system/members';
var COMPANY_STATUS_REQ_STRING = 'company​/companies​/statuses';
var CURRENCY_REQ_STRING = 'finance/currencies';
var TAXCODE_REQ_STRING = 'finance/taxCodes';
var BILLINGTERM_REQ_STRING = 'finance/billingTerms';
var COUNTRY_REQ_STRING = 'company/countries';
var CONTACTDEPARTMENT_REQ_STRING = 'company/contacts/departments';
var CONTACTRELATIONSHIP_REQ_STRING = 'company/contacts/relationships';
var CONTACTTYPE_REQ_STRING = 'company/contacts/types';
var BILLINGCYCLE_REQ_STRING = 'finance/billingCycles';
var WORKROLE_REQ_STRING = 'time/workRoles';
var BOARD_REQ_STRING = 'service/boards';
var EXPENSE_REPORT_REQ_STRING = 'expense/reports';
var DEPARTMENT_REQ_STRING = 'system/departments';

//Record Entity names used in Run Log mapped to IDs uses a custom list in Netsuite
var CONTACT_ENTITY_ID = 1;
var COMPANY_ENTITY_ID = 2;
var ITEM_ENTITY_ID = 3;
var EXPENSETYPE_ENTITY_ID = 4;
var WORKTYPE_ENTITY_ID = 5;
var INVITEM_ENTITY_ID = 6;
var EXPENSE_ENTITY_ID = 7;
var TIME_ENTITY_ID = 8;
var AGREEMENT_ENTITY_ID = 9;
var INVOICE_ENTITY_ID = 10;
var PROJECT_ENTITY_ID = 11;
var PROJECTTICKET_ENTITY_ID = 12;
var SERVICETICKET_ENTITY_ID = 13;
var PURCHASEORDER_ENTITY_ID = 14;
var PURCHASEORDERLINE_ENTITY_ID = 15;
var INVOICEPAYMENT_ENTITY_ID = 16;
var CONFIGURATION_ENTITY_ID = 17;
var SALESORDER_ENTITY_ID = 18;
var AGREEMENTADDITION_ENTITY_ID = 19;
var AGREEMENTADJUSTMENT_ENTITY_ID = 20;
var AGREEMENTSITE_ENTITY_ID = 21;
var MEMBER_ENTITY_ID = 22;
var MATRIX_MAPPING_ENTITY_ID = 23;
var SITE_ENTITY_ID = 24;
var WORKROLE_ENTITY_ID = 25;
var TIMEJE_ENTITY_ID = 26;
var EXPENSE_REPORT_ENTITY_ID = 27;
var EXPENSE_REPORT_LINE_ENTITY_ID = 28;
var CUSTOM_MAPPING_ENTITY_ID = 29;

//RUN LOG TYPE
var RUNLOG_TYPE_IMPORT = 1;
var RUNLOG_TYPE_CONVERT = 2;
var RUNLOG_TYPE_CREATE_ON_CW = 3;
var RUNLOG_TYPE_UPDATE_ON_CW = 4;

//RUN LOG STATUS
var RUNLOG_STATUS_QUEUE = 1;
var RUNLOG_STATUS_PROGRESS = 2;
var RUNLOG_STATUS_FINISHED = 3;

//CW MAXIMUM PAGE FETCH
var CW_MAXIMUM_PAGE_SIZE = 1000;

//CW CONVERT STATUS IDs
var CONVERT_STATUS_NOTSTARTED = 1;
var CONVERT_STATUS_FAILED = 2
var CONVERT_STATUS_CONVERTED = 3;
var CONVERT_STATUS_DONOTCONVERT = 4;

//CW RUN OPTION
var JOB_RUN_OPTION_DISABLED = 1;
var JOB_RUN_OPTION_IMPORT_AND_CONVERT = 2;
var JOB_RUN_OPTION_IMPORT_ONLY = 3;
var JOB_RUN_OPTION_CONVERT_ONLY = 4;

//CATALYST PRODUCT LICENSE KEY
var LICENSE_AES_SECRET_KEY = '636174616c79737434615870300B0B0B';
var LICENSE_PRODUCT_ID = 1; //Connectwise Manage Integrator

//IMPORT KEY DATE LIST
var IMPORT_KEYDATE_CURRENT_DAY = 1;
var IMPORT_KEYDATE_YESTERDAY = 2;
var IMPORT_KEYDATE_3DAYSAGO = 3;
var IMPORT_KEYDATE_7DAYSAGO = 4;
var IMPORT_KEYDATE_DAY_OF_CURR_MONTH = 5;
var IMPORT_KEYDATE_DAY_OF_PREV_MONTH = 6;
var IMPORT_KEYDATE_DAY_FROM_SIXMONTHSAGO = 7;
var IMPORT_KEYDATE_DAY_OF_CURRENT_YEAR = 8;
var IMPORT_KEYDATE_DAY_OF_LAST_YEAR = 9;

//TRANSACTION TAX LINE OPTION
var TAX_LINE_SETTING_LEAVE_SYSTEM_DEFAULT = 1;
var TAX_LINE_SETTING_FORCE_ENABLE = 2;
var TAX_LINE_SETTING_FORCE_DISABLE = 3;
var TAX_LINE_SETTING_USE_LINE_TAX = 4;

//SYNC BACK RECORDS
var SYNCBACK_RECORD_CUSTOMERPAYMENT = 'customerpayment';
var SYNCBACK_RECORD_CREATE_AGREEMENT = 'createagreement';
var SYNCBACK_RECORD_CREATE_CONFIGURATION = 'createconfiguration';
var SYNCBACK_RECORD_CREATE_PROJECT = 'createproject';
var SYNCBACK_RECORD_CREATE_SERVICETICKET = 'createserviceticket';
var SYNCBACK_RECORD_UPDATE_PROJECT = 'updateproject';
var SYNCBACK_RECORD_CREATE_COMPANY = 'createcompany'
var SYNCBACK_RECORD_CREATE_CONTACT = 'createcontact';
var SYNCBACK_RECORD_CREATE_INV_BATCH = 'createinvoicebatch';
var SYNCBACK_RECORD_CREATE_PO_BATCH = 'createpobatch';

//SYNC BACK SCHEDULED PARAMETERS
var SYNCBACK_RUN_SCHEDULED = 'SYNCSCHEDULED';

//INVOICE LINE BUNDLE OPTION SETTING
var BUNDLE_OP_REMOVE_PARENT_ADD_CHILD = 1; //Remove Parent Bundle and Add Children
var BUNDLE_OP_REMOVE_CHILD_ADD_PARENT = 2; //Remove Children and Add Parent Bundle
var BUNDLE_OP_ADD_PARENT_ZERO_ADD_CHILD = 3; //Add Parent Bundle but Zero it Out and Add Children
var BUNDLE_OP_ADD_CHILD_ZERO_ADD_PARENT = 4; //Add Parent Bundle but Zero it Out and Add Children

//INVOICE TIME ENTRY QUANTITY OPTION
var TIME_ENTRY_QTY_INVOICEHOURS = 1; //Use Invoice Hours as Quantity on Billable Time Entries
var TIME_ENTRY_QTY_BILLHOURS = 2; //Use Billed Hours as Quantity on Billable Time Entries
var TIME_ENTRY_QTY_ACTUALHOURS = 3; //Use Actual Hours as Quantity on Billable Time Entries

//DOWNPAYMENT BEHAVIOR
var DOWNPAYMENT_CONVERT_TO_DEPOSIT = 1; //Convert Downpayment Invoice as Customer Deposit
var DOWNPAYMENT_CONVERT_TO_INVOICE = 2; //Convert Downpayment Invoice as Invoice

//TIME ENTRY CONVERSION OPTIONS - ITEM
var TIME_ENTRY_CONVERSION_USEDEFAULTITEM = 1;
var TIME_ENTRY_CONVERSION_USETASKITEM = 2;
var TIME_ENTRY_CONVERSION_USEWORKTYPEITEM = 3;

//TIME ENTRY CONVERSION OPTIONS - BILLABLE OPTION
var TIME_ENTRY_CONVERSION_LEAVEDEFAULT = 1;
var TIME_ENTRY_CONVERSION_FORCEBILLABLE = 2;
var TIME_ENTRY_CONVERSION_FORCENOTBILLABLE = 3;
var TIME_ENTRY_CONVERSION_USECWBILLABLEOPTION = 4;

//INVOICE DESCRIPTION LINE CONVERSION BEHAVIOR
var INVOICE_LINE_DESC_CONVERSION_BLANK = 1;
var INVOICE_LINE_DESC_CONVERSION_NOTES = 2;
var INVOICE_LINE_DESC_CONVERSION_ITEMDESC = 3;
var INVOICE_LINE_DESC_CONVERSION_TICKET = 4;

//PLUGINS SCHEDULED SCRIPT TYPE
var PLUGINS_MATRIX_MAPPING_RUN = 1;

//INVOICE BLOCK TIME BEHAVIOR
var INVOICE_BLOCK_TIME_USE_INVOICE_TEMPLATE = 1;
var INVOICE_BLOCK_TIME_USE_AGREEMENT_TYPE = 2;

//INVOICE TIME ENTRY LINE BEHAVIOR
var INVOICE_LINE_TIME_USE_WORKTYPE = 1;
var INVOICE_LINE_TIME_USE_PLACEHOLDER = 2;
var INVOICE_LINE_TIME_USE_LUMPSUM = 3;
var INVOICE_LINE_TIME_USE_WORKROLE = 4;

//TIME JE: LABOR COST COMPUTATION BEHAVIOR
var TIMEJE_LABOR_COST_USE_CWMEMBER = 1;
var TIMEJE_LABOR_COST_USE_NSEMPLOYEE = 2;

//FORWARD PAGING OPTION
var FORWARD_PAGING_OPTION_HEADER = {"pagination-type": "forward-only"};

//NSCATALYST AZURE SERVER
var NSCATALYST_SERVER_URL = 'https://nscatalystserver.azurewebsites.net/';

function CWCompany() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.status = {id: null, name: null},
        this.type = {id: null, name: null},
        this.addressLine1 = null,
        this.addressLine2 = null,
        this.country = {id: null, name: null},
        this.city = null,
        this.state = null,
        this.zip = null,
        this.phoneNumber = null,
        this.website = null,
        this.territory = {id: null, name: null},
        this.defaultContact = {id: null, name: null, nsid: null},
        this.billingTerms = {id: null, name: null},
        this.invoiceDeliveryMethod = {id: null, name: null},
        this.leadFlag = null,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.vendorFlag = null,
        //new fields 7/8/2020
        this.identifier = null,
        this.taxCode = {id: null, name: null},
        this.billingContact = {id: null, name: null, nsid: null},
        this.market = {id: null, name: null},
        this.sicCode = {id: null, name: null},
        this.annualRevenue = null,
        this.accountNumber = null,
        this.leadSource = null,
        this.leadFlag = null,
        this.currency = {id: null, name: null, currencyCode: null},
        this.deletedFlag = null,
        //new fields 11/12/2020
        this.dateAcquired = null,
        this.numberOfEmployees = null,
        this.vendorIdentifier = null,
        this.taxIdentifier = null,
        this.territoryManager = {id: null, name: null},
        this.site = {id: null, name: null},
        this.payload = null,
        this.invoiceToEmailAddress = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.conversionstatus = null;
}

function CWContact() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.firstName = null,
        this.lastName = null,
        this.company = {id: null, identifier: null},
        this.title = null,
        this.communicationItems = {id: null, value: null, communicationType: null, defaultFlag: null},
        this.defaultPhone = null,
        this.lastUpdated = null,
        this.customFields = null,
        //new fields 9/17/2020
        this.addressLine1 = null,
        this.addressLine2 = null,
        this.country = {id: null, name: null},
        this.city = null,
        this.state = null,
        this.zip = null,
        this.site = {id: null, name: null},
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.types = {id: null, name: null},
        this.inactiveFlag = null,
        //new fields 7/14/2023
        this.defaultFlag = null,
        this.defaultBillingFlag = null,

        this.defaultEmail = null;
}


function CWItem() {
    this.internalid = null,
        this.id = null,
        this.identifier = null,
        this.description = null,
        this.quantity = null,
        this.price = null,
        this.cost = null,
        this.taxableFlag = null,
        this.dropshipFlag = null,
        this.specialOrderFlag = null,
        this.customerDescription = null,
        this.expenseaccount = null,
        this.expenseaccountName = null,
        this.incomeaccount = null,
        this.incomeaccountName = null,
        this.category = {id: null, name: null},
        this.subcategory = {id: null, name: null},
        this.type = {id: null, name: null},
        this.inactiveFlag = null,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        //new fields 11/30/2021
        this.serializedFlag = null,
        this.serializedCostFlag = null,
        this.phaseProductFlag = null,
        this.unitOfMeasure = {id: null, name: null},
        this.minStockLevel = null,
        this.priceAttribute = null,
        this.manufacturer = {id: null, name: null},
        this.manufacturerPartNumber = null,
        this.vendor = {id: null, name: null, nsid: null},
        this.vendorSku = null,
        this.notes = null,
        this.integrationXRef = null,
        this.recurringFlag = null,
        this.recurringRevenue = null,
        this.recurringCost = null,
        this.recurringOneTimeFlag = null,
        this.recurringBillCycle = {id: null, name: null},
        this.recurringCycleType = null,
        this.calculatedPriceFlag = null,
        this.calculatedCostFlag = null,
        this.calculatedPrice = null,
        this.calculatedCost = null,
        this.productClass = null; //non-inventory
}

function CWInvoice() {
    this.internalid = null,
        this.id = null,
        this.invoiceNumber = null,
        this.type = null,
        this.status = {id: null, name: null},
        this.company = {id: null, name: null, nsid: null, nameText: null},
        this.billToCompany = {id: null, name: null, nsid: null, nameText: null},
        this.shipToCompany = {id: null, name: null, nsid: null, nameText: null},
        this.applyToType = null,
        this.applyToId = null,
        this.attention = null,
        this.billingSite = {id: null, name: null, nsid: null},
        this.shippingSite = {id: null, name: null, nsid: null},
        this.billingTerms = {id: null, name: null},
        this.reference = null,
        this.date = null,
        this.locationId = null,
        this.departmentId = null,
        this.territoryId = null,
        this.serviceTotal = null,
        this.currency = null,
        this.dueDate = null,
        this.expenseTotal = null,
        this.productTotal = null,
        this.previousProgressApplied = null,
        this.serviceAdjustmentAmount = null,
        this.agreementAmount = null,
        this.downpaymentApplied = null,
        this.subtotal = null,
        this.total = null,
        this.salesTax = null,
        this.payments = null,
        this.credits = null,
        this.balance = null,
        this._info = {products_href: null, timeEntries_href: null, expenseEntries_href: null},
        this.lastUpdated = null,
        this.dateEntered = null,
        this.agreementapplink = null, //NS field
        this.agreementappamount = null, //NS Field
        //new fields 7/7/2020
        this.topComment = null,
        this.bottomComment = null,
        this.locationName = null,
        //new fields 11/17/2020
        this.customerPO = null,
        this.payload = null,
        this.agreement = {id: null, name: null},
        this.customFields = null,
        //new fields 1/11/2021
        this.billingSiteAddressLine1 = null,
        this.billingSiteAddressLine2 = null,
        this.billingSiteCity = null,
        this.billingSiteState = null,
        this.billingSiteZip = null,
        this.billingSiteCountry = null,
        this.shippingSiteAddressLine1 = null,
        this.shippingSiteAddressLine2 = null,
        this.shippingSiteCity = null,
        this.shippingSiteState = null,
        this.shippingSiteZip = null,
        this.shippingSiteCountry = null,
        this.taxCode = {id: null, name: null},
        this.enteredBy = null,
        this.updatedBy = null,
        //new fields 9/13/2021
        this.remainingDownpayment = null,
        //new fields 9/24/2021
        this.accountNumber = null,
        this.shipToAttention = null,
        this.templateSetupId = null,
        this.invoiceTemplate = {id: null, name: null},
        this.emailTemplateId = null,
        this.addToBatchEmailList = null,
        this.restrictDownpaymentFlag = null,
        this.taxableFlag = null,
        this.downpaymentPreviouslyTaxedFlag = null,
        this.overrideDownPaymentAmountFlag = null,
        this.adjustmentReason = null,
        this.adjustedBy = null,
        this.specialInvoiceFlag = null,
        this.billingSetupReference = {id: null, name: null},
        this.ticket = {id: null, summary: null},
        this.project = {id: null, name: null, nsid: null},
        this.phase = {id: null, name: null},
        this.salesOrder = {id: null, identifier: null, nsid: null}, //nsid will be used for future reference of SO
        this.departmentName = null, //added 9/26/2023
        this.conversionstatus = null;
}

function CWInvoiceLineItem() {
    this.internalid = null,
        this.id = null,
        this.catalogItem = {id: null, identifier: null, nsid: null},
        this.description = null,
        this.quantity = null,
        this.price = null,
        this.cost = null,
        this.locationId = null,
        this.businessUnitId = null,
        this.billableOption = null,
        this.taxableFlag = null,
        this.dropshipFlag = null,
        this.specialOrderFlag = null,
        this.customerDescription = null,
        this.warehouseId = null,
        this.warehouseBinId = null,
        this.listPrice = null,
        this.company = {id: null, name: null, nsid: null}, //default vendor
        this.productClass = null, //non-inventory
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        //new fields 12/17/2020
        this.discount = null,
        this.sequenceNumber = null,
        this.agreementAmount = null,
        this.priceMethod = null,
        this.agreement = {id: null, name: null, nsid: null},
        this.vendorSku = null,
        this.phaseProductFlag = null,
        this.cancelledFlag = null,
        this.quantityCancelled = null,
        this.cancelledReason = null,
        this.productSuppliedFlag = null,
        this.subContractorAmountLimit = null,
        this.salesOrder = {id: null, identifier: null, nsid: null}, //nsid will be used for future reference of SO
        this.opportunity = {id: null, name: null, nsid: null}, //nsid will be used for future reference of Opp
        this.calculatedPriceFlag = null,
        this.calculatedCostFlag = null,
        this.forecastDetailId = null,
        this.warehouse = null,
        this.warehouseBin = null,
        this.forecastStatus = {id: null, name: null},
        this.needToPurchaseFlag = null,
        this.minimumStockFlag = null,
        this.calculatedPrice = null,
        this.calculatedCost = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.invoice = {id: null, identifier: null}; //default invoice

}

function CWExpense() {
    this.internalid = null,
        this.id = null,
        this.expenseReport = {id: null, name: null, expenseReport_href: null, nsid: null},
        this.company = {id: null, name: null, nsid: null},
        this.chargeToId = null,
        this.chargeToType = null,
        this.type = {id: null, name: null, nsid: null},
        this.member = {id: null, name: null},
        this.paymentMethod = {id: null, name: null},
        this.classification = {id: null, name: null},
        this.amount = null,
        this.billableOption = null,
        this.locationId = null,
        this.businessUnitId = null,
        this.notes = null,
        this.invoiceAmount = null,
        this.invoice = {id: null, identifier: null},
        this.currency = {id: null, currencyCode: null},
        this.status = null,
        this.billAmount = null,
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        //new fields 12/17/2020
        this.agreement = {id: null, name: null, nsid: null},
        this.agreementAmount = null,
        this.date = null,
        this.ticket = {id: null, name: null, billingMethod: null, summary: null},
        this.enteredBy = null,
        this.updatedBy = null,
        //added 8/8/2023
        this.project = {id: null, name: null, billingMethod: null, nsid: null},
        this.phase = {id: null, name: null, billingMethod: null},
        this.invoiceId = null;
}

function CWTimeEntry() {
    this.internalid = null,
        this.id = null,
        this.company = {id: null, identifier: null, nsid: null},
        this.chargeToId = null,
        this.chargeToType = null,
        this.member = {id: null, name: null, identifier: null},
        this.locationId = null,
        this.businessUnitId = null,
        this.workType = {id: null, name: null, nsid: null},
        this.workRole = {id: null, name: null},
        this.agreement = {id: null, name: null, nsid: null},
        this.timeStart = null,
        this.timeEnd = null,
        this.actualHours = null,
        this.billableOption = null,
        this.notes = null,
        this.hoursBilled = null,
        this.invoice = {id: null, identifier: null},
        this.hourlyRate = null,
        this.timeSheet = {id: null, name: null, timeSheet_href: null},
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.payload = null,
        this.status = null,
        //new fields 11/29/2020
        this.internalNotes = null,
        this.hoursDeduct = null,
        this.overageRate = null,
        this.agreementHours = null,
        this.agreementAmount = null,
        this.ticket = {id: null, name: null, summary: null},
        this.project = {id: null, name: null, nsid: null},
        this.phase = {id: null, name: null},
        this.invoiceHours = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.cwInvoiceLink = null,
        this.conversionstatus = null,
        this.nsTimeLink = null,
        this.cwAccount = null;

}

function CWExpenseType() {
    this.internalid = null,
        this.id = null,
        this.name = {id: null, identifier: null},
        this.amountCaption = null,
        this.expenseaccount = null,
        this.expenseaccountName = null,
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.conversionstatus = null;
}

function CWProject() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.actualEnd = null,
        this.actualHours = null,
        this.actualStart = null,
        this.billExpenses = null,
        this.billingAmount = null,
        this.billingAttention = null,
        this.billingMethod = null,
        this.billingRateType = null,
        this.billProducts = null,
        this.billProjectAfterClosedFlag = null,
        this.billTime = null,
        this.billUnapprovedTimeAndExpense = null,
        this.board = {id: null, name: null, board_href: null},
        this.budgetAnalysis = null,
        this.budgetFlag = null,
        this.budgetHours = null,
        this.company = {id: null, name: null, nsid: null},
        this.contact = {id: null, name: null, nsid: null},
        this.customerPO = null,
        this.description = null,
        this.currency = {id: null, currencyCode: null},
        this.downpayment = null,
        this.estimatedEnd = null,
        this.estimatedExpenseRevenue = null,
        this.estimatedHours = null,
        this.estimatedProductRevenue = null,
        this.estimatedStart = null,
        this.estimatedTimeRevenue = null,
        this.includeDependenciesFlag = null,
        this.includeEstimatesFlag = null,
        this.location = {id: null, name: null},
        this.department = {id: null, name: null},
        this.manager = {id: null, name: null},
        this.restrictDownPaymentFlag = null,
        this.scheduledEnd = null,
        this.scheduledHours = null,
        this.scheduledStart = null,
        this.shipToCompany = {id: null, name: null, nsid: null},
        this.shipToSite = {id: null, name: null},
        this.site = {id: null, name: null},
        this.status = {id: null, name: null},
        this.type = {id: null, name: null},
        this.estimatedTimeCost = null,
        this.estimatedExpenseCost = null,
        this.estimatedProductCost = null,
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.shipToAttention = null,
        this.companyLocation = {id: null, name: null};
}

function CWAgreement() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.type = {id: null, name: null},
        this.company = {id: null, name: null, nsid: null},
        this.contact = {id: null, name: null, nsid: null},
        this.customerPO = null,
        this.location = {id: null, name: null},
        this.department = {id: null, name: null},
        this.restrictLocationFlag = null,
        this.restrictDepartmentFlag = null,
        this.startDate = null,
        this.noEndingDateFlag = null,
        this.cancelledFlag = null,
        this.reasonCancelled = null,
        this.workOrder = null,
        this.internalNotes = null,
        this.applicationUnits = null,
        this.applicationLimit = null,
        this.applicationUnlimitedFlag = null,
        this.oneTimeFlag = null,
        this.coverAgreementTime = null,
        this.coverAgreementProduct = null,
        this.coverAgreementExpense = null,
        this.coverSalesTax = null,
        this.carryOverUnused = null,
        this.allowOverruns = null,
        this.expiredDays = null,
        this.limit = null,
        this.expireWhenZero = null,
        this.chargeToFirm = null,
        this.employeeCompRate = null,
        this.compHourlyRate = null,
        this.compLimitAmount = null,
        this.billOneTimeFlag = null,
        this.invoicingCycle = null,
        this.billAmount = null,
        this.taxable = null,
        this.prorateFirstBill = null,
        this.billStartDate = null,
        this.restrictDownPayment = null,
        this.proRateFlag = null,
        this.invoiceDescription = null,
        this.billTime = null,
        this.billExpenses = null,
        this.billProducts = null,
        this.billableTimeInvoice = null,
        this.billableExpenseInvoice = null,
        this.billableProductInvoice = null,
        this.currency = null,
        this.autoInvoiceFlag = null,
        this.companyLocation = {id: null, name: null},
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.billingCycle = {id: null, name: null, nsid: null},
        this.agreementStatus = null;
}

function CWProjectTicket() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.summary = null,
        this.isIssueFlag = null,
        this.board = {id: null, name: null, nsid: null},
        this.status = {id: null, name: null, nsid: null},
        this.project = {id: null, name: null, nsid: null},
        this.phase = {id: null, name: null, nsid: null},
        this.wbsCode = null,
        this.company = {id: null, name: null, nsid: null},
        this.site = {id: null, name: null, nsid: null},
        //this.siteName = null,
        this.addressLine1 = null,
        this.addressLine2 = null,
        this.city = null,
        this.stateIdentifier = null,
        this.zip = null,
        this.country = null,
        this.contact = {id: null, name: null, nsid: null},
        this.requiredDate = null,
        //this.contactName = null,
        //this.contactPhoneNumber = null,
        //this.contactEmailAddress = null,
        this.type = {id: null, name: null},
        // this.subType = {id: null, name: null},
        this.item = {id: null, name: null},
        this.priority = {id: null, name: null, nsid: null},
        this.serviceLocation = {id: null, name: null, nsid: null},
        this.source = {id: null, name: null, nsid: null},
        this.budgetHours = null,
        this.opportunity = {id: null, name: null, nsid: null},
        this.agreement = {id: null, name: null, nsid: null},
        this.closedDate = null,
        this.closedBy = null,
        this.closedFlag = null,
        this.actualHours = null,
        this.approved = null,
        this.subBillingMethod = null,
        this.subBillingAmount = null,
        this.resources = null,
        this.billTime = null,
        this.billExpenses = null,
        this.billProducts = null,
        this.location = {id: null, name: null},
        this.department = {id: null, name: null},
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.currency = null;

}

function CWServiceTicket() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.summary = null,
        this.recordType = null,
        this.board = {id: null, name: null, nsid: null},
        this.status = {id: null, name: null, nsid: null},
        // this.project = {id: null, name: null, nsid: null},
        // this.phase = {id: null, name: null, nsid: null},
        // this.wbsCode = null,
        this.company = {id: null, name: null, nsid: null},
        this.site = {id: null, name: null, nsid: null},
        //this.siteName = null,
        this.addressLine1 = null,
        this.addressLine2 = null,
        this.city = null,
        this.stateIdentifier = null,
        this.zip = null,
        this.country = null,
        this.contact = {id: null, name: null, nsid: null},
        //this.contactName = null,
        //this.contactPhoneNumber = null,
        //this.contactEmailAddress = null,
        this.type = {id: null, name: null},
        // this.subType = {id: null, name: null},
        this.item = {id: null, name: null},
        this.team = {id: null, name: null, nsid: null},
        this.priority = {id: null, name: null, nsid: null},
        this.serviceLocation = {id: null, name: null, nsid: null},
        this.source = {id: null, name: null, nsid: null},
        this.requiredDate = null,
        this.severity = null,
        this.impact = null,
        this.budgetHours = null,
        this.opportunity = {id: null, name: null, nsid: null},
        this.agreement = {id: null, name: null, nsid: null},
        this.closedDate = null,
        this.closedBy = null,
        this.closedFlag = null,
        this.actualHours = null,
        this.approved = null,
        this.estimatedExpenseCost = null,
        this.estimatedExpenseRevenue = null,
        this.estimatedProductCost = null,
        this.estimatedProductRevenue = null,
        this.estimatedTimeCost = null,
        this.estimatedTimeRevenue = null,
        this.billingMethod = null,
        this.billingAmount = null,
        this.subBillingMethod = null,
        this.subBillingAmount = null,
        this.dateResolved = null,
        this.dateResplan = null,
        this.dateResponded = null,
        this.resolveMinutes = null,
        this.resPlanMinutes = null,
        this.respondMinutes = null,
        this.isInSla = null,
        this.hasChildTicket = null,
        this.hasMergedChildTicketFlag = null,
        this.billTime = null,
        this.billExpenses = null,
        this.billProducts = null,
        this.locationId = null,
        this.businessUnitId = null,
        this.sla = {id: null, name: null, nsid: null},
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.currency = null;

}

function CWWorkType() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.billTime = null,
        this.rateType = null,
        this.rate = null,
        this.hoursMin = null,
        this.hoursMax = null,
        this.costMultiplier = null,
        this.expenseaccount = null,
        this.expenseaccountName = null,
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.conversionstatus = null;
}

function CWWorkRole() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.hourlyRate = null,
        this.inactiveFlag = null,
        this.addAllLocations = null,
        this.removeAllLocations = null,
        this.addAllAgreementExclusions = null,
        this.locationIds = null
    this.incomeAccount = null,
        this.lastUpdated = null,
        this.customFields = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.conversionstatus = null;
}

function CWCustomField() {
    this.internalid = null,
        this.id = null,
        this.cwrecordtype = null,
        this.caption = null,
        this.helpText = null,
        this.fieldTypeIdentifier = null,
        this.numberDecimals = null,
        this.lastUpdated = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.nsfieldmapping = null;
}

function CWCompanyType() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.defaultFlag = null,
        this.vendorFlag = null,
        this.serviceAlertFlag = null,
        this.lastUpdated = null;
}

function CWBoard() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.projectFlag = null,
        this.lastUpdated = null;
}

function CWPurchaseOrder() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.businessUnitId = null,
        this.closedFlag = null,
        this.customerCompany = {id: null, name: null, nsid: null, nameText: null},
        this.customerContact = {id: null, name: null, nsid: null, nameText: null},
        this.customerSite = {id: null, name: null},
        this.dateClosed = null,
        this.dropShipCustomerFlag = null
    this.freightCost = null,
        this.freightPackingSlip = null,
        this.freightTaxTotal = null,
        this.internalNotes = null,
        this.locationId = null,
        this.poDate = null,
        this.poNumber = null,
        this.salesTax = null,
        this.shipmentDate = null,
        this.shipmentMethod = {id: null, name: null},
        this.shippingInstructions = null,
        this.status = {id: null, name: null},
        this.subTotal = null,
        this.taxCode = {id: null, name: null},
        this.taxFreightFlag = null,
        this.taxPoFlag = null,
        this.terms = {id: null, name: null},
        this.total = null,
        this.trackingNumber = null,
        this.vendorCompany = {id: null, name: null, nsid: null, nameText: null},
        this.vendorContact = {id: null, name: null, nsid: null, nameText: null},
        this.vendorInvoiceDate = null,
        this.vendorInvoiceNumber = null,
        this.vendorOrderNumber = null,
        this.vendorSite = {id: null, name: null},
        this.warehouse = {id: null, name: null},
        this.currency = null,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.customFields = null,
        this.polink = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        //1/12/2021 - new fields
        this.customerCity = null,
        this.customerExtension = null,
        this.customerName = null,
        this.customerPhone = null,
        this.customerSiteName = null,
        this.customerState = null,
        this.customerStreetLine1 = null,
        this.customerStreetLine2 = null,
        this.customerZip = null,
        this.customerCountry = {id: null, name: null}

    this.conversionstatus = null;
}

function CWPurchaseOrderLine() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.backOrderedFlag = null,
        this.canceledFlag = null,
        this.closedFlag = null,
        this.description = null,
        this.internalNotes = null,
        this.lineNumber = null,
        this.packingSlip = null,
        this.product = {id: null, identifier: null, nsid: null},
        this.purchaseOrderId = null,
        this.quantity = null,
        this.receivedQuantity = null,
        this.shipmentMethod = {id: null, name: null},
        this.tax = null,
        this.trackingNumber = null,
        this.unitCost = null,
        this.unitOfMeasure = {id: null, name: null},
        this.warehouse = {id: null, name: null},
        this.warehouseBin = {id: null, name: null},
        this.receivedStatus = null,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWSite() {
    this.internalid = null,
        this.id = null,
        this.name = null,
        this.addressLine1 = null,
        this.addressLine2 = null,
        this.city = null,
        this.stateReference = {id: null, name: null, identifier: null},
        this.zip = null,
        this.country = {id: null, name: null},
        this.phoneNumber = null,
        this.primaryAddressFlag = null,
        this.defaultShippingFlag = null,
        this.defaultBillingFlag = null,
        this.defaultMailingFlag = null,
        this.company = {id: null, name: null},
        this.lastUpdated = null,
        this.dateEntered = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWLocation() {
    this.internalid = null,
        this.id = null,
        this.ownerLevelId = null,
        this.structureLevel = {id: null, name: null},
        this.name = null,
        this.owaUrl = null,
        this.locationFlag = null,
        this.clientFlag = null,
        this.departmentIds = [],
        this.lastUpdated = null;
}

function CWAgreementType() {
    this.id = null,
        this.name = null,
        this.defaultFlag,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.billingCycle = {id: null, name: null},
        this.billTime = null,
        this.billExpenses = null,
        this.billProducts = null,
        this.billableTimeInvoiceFlag = null,
        this.billableExpenseInvoiceFlag = null,
        this.billableProductInvoiceFlag = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWConfigurationType() {
    this.id = null,
        this.name = null,
        this.inactiveFlag = null,
        this.systemFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWSalesOrder() {
    this.internalid = null,
        this.id = null,
        this.company = {id: null, name: null, nsid: null, nameText: null},
        this.contact = {id: null, name: null, nsid: null, nameText: null},
        this.phone = null,
        this.phoneExt = null,
        this.email = null,
        this.site = {id: null, name: null, nsid: null},
        this.status = {id: null, name: null},
        this.opportunity = {id: null, name: null, nsid: null},
        this.orderDate = null,
        this.dueDate = null,
        this.billingTerms = {id: null, name: null, nsid: null},
        this.taxCode = {id: null, name: null, nsid: null},
        this.poNumber = null,
        this.location = {id: null, name: null, nsid: null},
        this.department = {id: null, name: null, nsid: null},
        this.salesRep = {id: null, name: null, nsid: null},
        this.notes,
        this.billClosedFlag = null,
        this.billShippedFlag = null,
        this.restrictDownpaymentFlag = null,
        this.description = null,
        this.topCommentFlag = null,
        this.bottomCommentFlag = null,
        this.shipToCompany = {id: null, name: null, nsid: null, nameText: null},
        this.shipToContact = {id: null, name: null, nsid: null, nameText: null},
        this.shipToSite = {id: null, name: null, nsid: null, nameText: null},
        this.billToCompany = {id: null, name: null, nsid: null, nameText: null},
        this.billToContact = {id: null, name: null, nsid: null, nameText: null},
        this.billToSite = {id: null, name: null, nsid: null, nameText: null},
        this.productIds = null,
        this.documentIds = null,
        this.invoiceIds = null,
        this.configIds = null,
        this.total = null,
        this.taxTotal = null,
        this.currency = {id: null, name: null, currencyCode: null},
        this.companyLocation = {id: null, name: null},
        this.subTotal,
        this.lastUpdated = null,
        this.updatedBy = null,
        this.customFields = null,
        this.conversionstatus = null;
}

function CWAgreementAddition() {
    this.internalid = null,
        this.id = null,
        this.product = {id: null, name: null, nsid: null, serializedFlag: null, nameText: null},
        this.quantity = null,
        this.lessIncluded = null,
        this.unitPrice = null,
        this.unitCost = null,
        this.billCustomer = null,
        this.effectiveDate = null,
        this.cancelledDate = null,
        this.taxableFlag = null,
        this.serialNumber = null,
        this.invoiceDescription = null,
        this.purchaseItemFlag = null,
        this.specialOrderFlag = null,
        this.agreementId = null,
        this.description = null,
        this.billedQuantity = null,
        this.uom = null,
        this.extPrice = null,
        this.extCost = null,
        this.sequenceNumber = null,
        this.margin = null,
        this.prorateCost = null,
        this.proratePrice = null,
        this.extendedProrateCost = null,
        this.extendedProratePrice = null,
        this.prorateCurrentPeriodFlag = null,
        this.opportunity = {id: null, name: null, nsid: null},
        this.agreementStatus = null,
        this.invoiceGrouping = {
            id: null,
            name: null,
            description: null,
            nsid: null,
            showPriceFlag: null,
            showSubItemsFlag: null
        },
        this.lastUpdated = null,
        this.updatedBy = null,
        this.payload = null,
        this.customFields = null,
        this.conversionstatus = null;
}

function CWAgreementSite() {
    this.internalid = null,
        this.id = null,
        this.company = {id: null, name: null, nsid: null, nameText: null},
        this.site = {id: null, name: null, nsid: null},
        this.agreementId = null,
        this.lastUpdated = null,
        this.updatedBy = null,
        this.payload = null,
        this.customFields = null,
        this.conversionstatus = null;
}

function CWAgreementAdjustment() {
    this.internalid = null,
        this.id = null,
        this.amount = null,
        this.description = null,
        this.effectiveDate = null,
        this.agreementId = null,
        this.lastUpdated = null,
        this.updatedBy = null,
        this.payload = null,
        this.customFields = null,
        this.conversionstatus = null;
}

function CWMember() {
    this.internalid = null,
        this.id = null,
        this.identifier = null,
        this.password = null,
        this.firstName = null,
        this.middleInitial = null,
        this.lastName = null,
        this.title = null,
        this.reportCard = {id: null, name: null, nsid: null, nameText: null},
        this.licenseClass = null,
        this.disableOnlineFlag = null,
        this.enableMobileFlag = null,
        this.type = {id: null, name: null, nsid: null, nameText: null},
        this.employeeIdentifer = null,
        this.vendorNumber = null,
        this.notes = null,
        this.timeZone = {id: null, name: null, nsid: null, nameText: null},
        this.country = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.serviceBoardTeamIds = null,
        this.enableMobileGpsFlag = null,
        this.inactiveDate = null,
        this.inactiveFlag = null,
        this.lastLogin = null,
        this.photo = {id: null, name: null, nsid: null, nameText: null},
        this.partnerPortalFlag = null,
        this.clientId = null,
        this.stsUserAdminUrl = null,
        this.token = null,
        this.toastNotificationFlag = null,
        this.memberPersonas = null,
        this.office365 = {id: null, name: null, nsid: null, nameText: null},
        this.officeEmail = null,
        this.officePhone = null,
        this.officeExtension = null,
        this.mobileEmail = null,
        this.mobilePhone = null,
        this.mobileExtension = null,
        this.homeEmail = null,
        this.homePhone = null,
        this.homeExtension = null,
        this.defaultEmail = null,
        this.primaryEmail = null,
        this.defaultPhone = null,
        this.securityRole = {id: null, name: null, nsid: null, nameText: null},
        this.adminFlag = null,
        this.structureLevel = {id: null, name: null, nsid: null, nameText: null},
        this.securityLocation = {id: null, name: null, nsid: null, nameText: null},
        this.defaultLocation = {id: null, name: null, nsid: null, nameText: null},
        this.defaultDepartment = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.reportsTo = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.restrictLocationFlag = null,
        this.restrictDepartmentFlag = null,
        this.workRole = {id: null, name: null, nsid: null, nameText: null},
        this.workType = {id: null, name: null, nsid: null, nameText: null},
        this.timeApprover = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.expenseApprover = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.billableForecast = null,
        this.dailyCapacity = null,
        this.hourlyCost = null,
        this.hourlyRate = null,
        this.includeInUtilizationReportingFlag = null,
        this.requireExpenseEntryFlag = null,
        this.requireTimeSheetEntryFlag = null,
        this.requireStartAndEndTimeOnTimeEntryFlag = null,
        this.allowInCellEntryOnTimeSheet = null,
        this.enterTimeAgainstCompanyFlag = null,
        this.allowExpensesEnteredAgainstCompaniesFlag = null,
        this.timeReminderEmailFlag = null,
        this.daysTolerance = null,
        this.minimumHours = null,
        this.timeSheetStartDate = null,
        this.hireDate = null,
        this.serviceDefaultLocation = {id: null, name: null, nsid: null, nameText: null},
        this.serviceDefaultDepartment = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.serviceDefaultBoard = {id: null, name: null, nsid: null, nameText: null},
        this.restrictServiceDefaultLocationFlag = null,
        this.restrictServiceDefaultDepartmentFlag = null,
        this.excludedServiceBoardIds = null,
        this.projectDefaultLocation = {id: null, name: null, nsid: null, nameText: null},
        this.projectDefaultDepartment = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.projectDefaultBoard = {id: null, name: null, nsid: null, nameText: null},
        this.restrictProjectDefaultLocationFlag = null,
        this.restrictProjectDefaultDepartmentFlag = null,
        this.excludedProjectBoardIds = null,
        this.scheduleDefaultLocation = {id: null, name: null, nsid: null, nameText: null},
        this.scheduleDefaultDepartment = {id: null, name: null, identifier: null, nsid: null, nameText: null},
        this.scheduleCapacity = null,
        this.serviceLocation = {id: null, name: null, nsid: null, nameText: null},
        this.restrictScheduleFlag = null,
        this.hideMemberInDispatchPortalFlag = null,
        this.calendar = {id: null, name: null, nsid: null, nameText: null},
        this.salesDefaultLocation = {id: null, name: null, nsid: null, nameText: null},
        this.restrictDefaultSalesTerritoryFlag = null,
        this.warehouse = {id: null, name: null, lockedFlag: null, nsid: null, nameText: null},
        this.warehouseBin = {id: null, name: null, nsid: null, nameText: null},
        this.restrictDefaultWarehouseFlag = null,
        this.restrictDefaultWarehouseBinFlag = null,
        this.mapiName = null,
        this.calendarSyncIntegrationFlag = null,
        this.enableLdapAuthenticationFlag = null,
        this.ldapConfiguration = {id: null, name: null, server: null, nsid: null, nameText: null},
    this.ldapUserName = null,
    this.companyActivityTabFormat = null,
    this.invoiceTimeTabFormat = null,
    this.invoiceScreenDefaultTabFormat = null,
    this.invoicingDisplayOptions = null,
    this.agreementInvoicingDisplayOptions = null,
    this.authenticationServiceType = null,
    this.timebasedOneTimePasswordActivated = null,
    this.ssoSettings = {id: null, ssoUserId: null, userName: null, email: null, nsid: null, nameText: null},
    this.autoStartStopwatch = null,
    this.autoPopupQuickNotesWithStopwatch = null,
    this.signature = null,
    this.globalSearchDefaultTicketFilter = null,
    this.globalSearchDefaultSort = null,
    this.phoneSource = null,
    this.phoneIntegrationType = null,
    this.copyPodLayouts = null,
    this.copySharedDefaultViews = null,
    this.copyColumnLayoutsAndFilters = null,
    this.fromMemberRecId = null,

    this.lastUpdated = null,
    this.updatedBy = null,
    this.payload = null,
    this.customFields = null,
    this.conversionstatus = null;
}

function CWCompanyStatus() {
    this.id = null,
        this.name = null,
        this.defaultFlag = null,
        this.inactiveFlag = null,
        this.notifyFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWCurrency() {
    this.id = null,
        this.name = null,
        this.currencyIdentifier = null,
        this.currencyCode = {id: null, name: null},
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWTaxCode() {
    this.id = null,
        this.name = null,
        this.identifier = null,
        this.description = null,
        this.defaultFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWBillingTerm() {
    this.id = null,
        this.name = null,
        this.defaultFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWCountry() {
    this.id = null,
        this.name = null,
        this.defaultFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWState() {
    this.id = null,
        this.name = null,
        this.identifier = null,
        this.country = {id: null, name: null},
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWContactRelationship() {
    this.id = null,
        this.name = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWContactDepartment() {
    this.id = null,
        this.name = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWContactType() {
    this.id = null,
        this.description = null,
        this.defaultFlag = null,
        this.lastUpdated = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWBillingCycle() {
    this.id = null,
        this.name = null,
        this.identifier = null,
        this.billingOptions = null,
        this.defaultFlag = null,
        this.lastUpdated = null,
        this.dateEntered = null,
        this.payload = null,
        this.enteredBy = null,
        this.updatedBy = null,
        this.customFields = null;
}

function CWExpenseReport() {
    this.internalid = null,
        this.id = null,
        this.member = {id: null, name: null, nsid: null, nameText: null},
        this.year = null,
        this.period = null,
        this.dateStart = null,
        this.dateEnd = {id: null, name: null, nsid: null, nameText: null},
        this.status = null,
        this.total = null,
        this.dueDate = null,
        this.lastUpdated = null,
        this.updatedBy = null,
        this.payload = null,
        this.customFields = null,
        this.conversionstatus = null;

}

function getCustomField(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];

    var JSONData = getJSONData(CUSTOMFIELD_REQ_STRING, getPageCount(CUSTOMFIELD_REQ_STRING, pageSize, overrideKeyDate, cwAccountId).pageCount, pageSize, pageNumber, overrideKeyDate, null, null, cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCustomField();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.caption = JSONData[i].caption;

            if (JSONData[i].helpText) {
                CWObject.helpText = JSONData[i].helpText;
            } else {
                CWObject.helpText = '';
            }

            if (JSONData[i].fieldTypeIdentifier) {
                CWObject.fieldTypeIdentifier = JSONData[i].fieldTypeIdentifier;
            } else {
                CWObject.fieldTypeIdentifier = '';
            }

            if (JSONData[i].numberDecimals) {
                CWObject.numberDecimals = JSONData[i].numberDecimals;
            } else {
                CWObject.numberDecimals = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getCompany(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(COMPANY_REQ_STRING, getPageCount(COMPANY_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        //get CWCompanyTypes to determine which is vendor and a customer
        var CWCompanyTypeArray = getJSONData(COMPANYTYPE_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);


        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCompany();

            var isVendorFlag = 'F';

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            //nlapiLogExecution('DEBUG', 'Type IDS: ' + JSONData[i].typeIds)
            //fix for 2019.1 above, types.id instead of typeIds
            //assign default values first
            CWObject.type.id = '1';
            CWObject.type.name = 'Customer';

            //for api version 2019.1
            if (JSONData[i].typeIds) {

                if (JSONData[i].typeIds.length > 0) {
                    CWObject.type.name = '';
                    for (var x = 0; x < JSONData[i].typeIds.length; x++) {
                        //get all type names
                        if (x == 0) {
                            CWObject.type.name = findCompanyTypeName(CWCompanyTypeArray, JSONData[i].typeIds[x]);
                            CWObject.type.id = JSONData[i].typeIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.type.name = CWObject.type.name + '<br/>' + findCompanyTypeName(CWCompanyTypeArray, JSONData[i].typeIds[x]);
                            CWObject.type.id = CWObject.type.id + ',' + JSONData[i].typeIds[x].toFixed(0);
                        }
                        //check if at least 1 type is a vendor
                        if (checkIfVendor(CWCompanyTypeArray, JSONData[i].typeIds[x]) == true)
                            isVendorFlag = 'T';
                    }

                }
            } else {
                //for api version 2020.1 above
                if (JSONData[i].types) {
                    if (JSONData[i].types.length > 0) {
                        CWObject.type.name = '';
                        for (var x = 0; x < JSONData[i].types.length; x++) {
                            //get all type names
                            if (x == 0) {
                                CWObject.type.name = JSONData[i].types[x].name;
                                CWObject.type.id = JSONData[i].types[x].id;
                            }
                            if (x > 0) {
                                CWObject.type.name = CWObject.type.name + '<br/>' + JSONData[i].types[x].name;
                                CWObject.type.id = CWObject.type.id + ',' + JSONData[i].types[x].id.toFixed(0);
                            }
                            //check if at least 1 type is a vendor
                            //nlapiLogExecution('DEBUG', 'Iterating Types ID: ' + JSONData[i].types[x].id + ' ' + JSONData[i].types[x].name);
                            if (checkIfVendor(CWCompanyTypeArray, JSONData[i].types[x].id) == true)
                                isVendorFlag = 'T';
                        }
                    }
                }
            }

            CWObject.vendorFlag = isVendorFlag;

            if (JSONData[i].status) {
                if (JSONData[i].status.id) {
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                } else {
                    CWObject.status.id = '';
                }

                if (JSONData[i].status.name) {
                    CWObject.status.name = JSONData[i].status.name;
                } else {
                    CWObject.status.name = '';
                }
            }

            //put a website validator
            CWObject.website = JSONData[i].website;

            if (JSONData[i].territory) {
                if (JSONData[i].territory.id) {
                    CWObject.territory.id = JSONData[i].territory.id.toFixed(0);
                } else {
                    CWObject.territory.id = '';
                }

                if (JSONData[i].territory.name) {
                    CWObject.territory.name = JSONData[i].territory.name;
                } else {
                    CWObject.territory.name = '';
                }
            }

            CWObject.phoneNumber = JSONData[i].phoneNumber;

            if (JSONData[i].faxNumber) {
                CWObject.faxNumber = JSONData[i].faxNumber;
            } else {
                CWObject.faxNumber = '';
            }

            if (JSONData[i].addressLine1 != null)
                CWObject.addressLine1 = JSONData[i].addressLine1;
            if (JSONData[i].addressLine2 != null)
                CWObject.addressLine2 = JSONData[i].addressLine2;
            if (JSONData[i].city != null)
                CWObject.city = JSONData[i].city;
            if (JSONData[i].state != null)
                CWObject.state = JSONData[i].state;
            if (JSONData[i].zip != null)
                CWObject.zip = JSONData[i].zip;

            //nlapiLogExecution('DEBUG', 'Default Contact VAR: ' + JSONData[i].defaultContact);
            if (JSONData[i].defaultContact) {
                if (JSONData[i].defaultContact.id)
                    CWObject.defaultContact.id = JSONData[i].defaultContact.id.toFixed(0);


                if (JSONData[i].defaultContact.name)
                    CWObject.defaultContact.name = JSONData[i].defaultContact.name;

            }


            //new fields
            if (JSONData[i].billingTerms) {
                if (JSONData[i].billingTerms.id)
                    CWObject.billingTerms.id = JSONData[i].billingTerms.id.toFixed(0);
                if (JSONData[i].billingTerms.name)
                    CWObject.billingTerms.name = JSONData[i].billingTerms.name;
            }


            if (JSONData[i].country) {
                if (JSONData[i].country.id)
                    CWObject.country.id = JSONData[i].country.id.toFixed(0);
                if (JSONData[i].country.name)
                    CWObject.country.name = JSONData[i].country.name;
            }

            if (JSONData[i].invoiceDeliveryMethod) {
                if (JSONData[i].invoiceDeliveryMethod.name)
                    CWObject.invoiceDeliveryMethod.name = JSONData[i].invoiceDeliveryMethod.name;

                if (JSONData[i].invoiceDeliveryMethod.id)
                    CWObject.invoiceDeliveryMethod.id = JSONData[i].invoiceDeliveryMethod.id.toFixed(0);
            }

            //new fields 7/7/2020
            if (JSONData[i].identifier) {
                CWObject.identifier = JSONData[i].identifier;
            } else {
                CWObject.identifier = '';
            }

            if (JSONData[i].leadFlag == false) {
                CWObject.leadFlag = 'F'
            } else {
                CWObject.leadFlag = 'T'
            }

            if (JSONData[i].leadSource) {
                CWObject.leadSource = JSONData[i].leadSource;
            } else {
                CWObject.leadSource = '';
            }


            if (JSONData[i].taxCode) {
                if (JSONData[i].taxCode.id) {
                    CWObject.taxCode.id = JSONData[i].taxCode.id.toFixed(0);
                } else {
                    CWObject.taxCode.id = '';
                }
                if (JSONData[i].taxCode.name) {
                    CWObject.taxCode.name = JSONData[i].taxCode.name;
                } else {
                    CWObject.taxCode.name = '';
                }
            }


            if (JSONData[i].billingContact) {
                if (JSONData[i].billingContact.id) {
                    CWObject.billingContact.id = JSONData[i].billingContact.id.toFixed(0);
                } else {
                    CWObject.billingContact.id = '';
                }
                if (JSONData[i].billingContact.name) {
                    CWObject.billingContact.name = JSONData[i].billingContact.name;
                } else {
                    CWObject.billingContact.name = '';
                }
            }

            if (JSONData[i].market) {
                if (JSONData[i].market.id) {
                    CWObject.market.id = JSONData[i].market.id.toFixed(0);
                } else {
                    CWObject.market.id = '';
                }
                if (JSONData[i].market.name) {
                    CWObject.market.name = JSONData[i].market.name;
                } else {
                    CWObject.market.name = '';
                }
            }

            if (JSONData[i].sicCode) {
                if (JSONData[i].sicCode.id) {
                    CWObject.sicCode.id = JSONData[i].sicCode.id.toFixed(0);
                } else {
                    CWObject.sicCode.id = '';
                }
                if (JSONData[i].sicCode.name) {
                    CWObject.sicCode.name = JSONData[i].sicCode.name;
                } else {
                    CWObject.sicCode.name = '';
                }
            }

            if (JSONData[i].annualRevenue) {
                CWObject.annualRevenue = JSONData[i].annualRevenue;
            } else {
                CWObject.annualRevenue = 0;
            }

            if (JSONData[i].accountNumber) {
                CWObject.accountNumber = JSONData[i].accountNumber;
            } else {
                CWObject.accountNumber = '';
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.id) {
                    CWObject.currency.id = JSONData[i].currency.id.toFixed(0);
                } else {
                    CWObject.currency.id = '';
                }
                if (JSONData[i].currency.name) {
                    CWObject.currency.name = JSONData[i].currency.name;
                } else {
                    CWObject.currency.name = '';
                }
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency.currencyCode = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency.currencyCode = '';
                }
            }

            if (JSONData[i].deletedFlag == false) {
                CWObject.deletedFlag = 'F'
            } else {
                CWObject.deletedFlag = 'T'
            }

            //new fields 11/12/2020
            if (JSONData[i].numberOfEmployees) {
                CWObject.numberOfEmployees = JSONData[i].numberOfEmployees;
            } else {
                CWObject.numberOfEmployees = '';
            }

            if (JSONData[i].vendorIdentifier) {
                CWObject.vendorIdentifier = JSONData[i].vendorIdentifier;
            } else {
                CWObject.vendorIdentifier = '';
            }

            if (JSONData[i].taxIdentifier) {
                CWObject.taxIdentifier = JSONData[i].taxIdentifier;
            } else {
                CWObject.taxIdentifier = '';
            }

            if (JSONData[i].dateAcquired) {
                CWObject.dateAcquired = convertJSONStringToDate(JSONData[i].dateAcquired);
            } else {
                CWObject.dateAcquired = '';
            }

            if (JSONData[i].territoryManager) {
                if (JSONData[i].territoryManager.id) {
                    CWObject.territoryManager.id = JSONData[i].territoryManager.id.toFixed(0);
                } else {
                    CWObject.territoryManager.id = '';
                }
                if (JSONData[i].territoryManager.name) {
                    CWObject.territoryManager.name = JSONData[i].territoryManager.name;
                } else {
                    CWObject.territoryManager.name = '';
                }
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id) {
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                } else {
                    CWObject.site.id = '';
                }
                if (JSONData[i].site.name) {
                    CWObject.site.name = JSONData[i].site.name;
                } else {
                    CWObject.site.name = '';
                }
            }

            if (JSONData[i].invoiceToEmailAddress) {
                CWObject.invoiceToEmailAddress = JSONData[i].invoiceToEmailAddress;
            } else {
                CWObject.invoiceToEmailAddress = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Company ID: ' + i, stringErr);
            }


            // 1 = Not Started
            CWObject.conversionstatus = 1;

            // //collect all sites data
            // var CWCompanySitesArray = getJSONData('company/companies/' + CWObject.id + '/' + SITE_REQ_STRING, 1, 1000, 1, null);
            // nlapiLogExecution('DEBUG', 'CWCompanySitesArray Length', CWCompanySitesArray.length);
            // CWObject.sitesArray.push(CWCompanySitesArray);

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getSite(pageNumber, pageSize, overrideKeyDate, cwCompanyId, cwAccountId) {
    var JSONDataArray = [];

    var finalRequestString = '';

    var JSONData = getJSONData('company/companies/' + cwCompanyId + '/' + SITE_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);

    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWSite();
            nlapiLogExecution('DEBUG', 'Address Object Found: ' + JSONData[i].addressLine1);

            CWObject.id = JSONData[i].id.toFixed(0);
            if (JSONData[i].name) {
                CWObject.name = JSONData[i].name;
            } else {
                CWObject.name = 'No Label';
            }

            if (JSONData[i].addressLine1) {
                CWObject.addressLine1 = JSONData[i].addressLine1;
            } else {
                CWObject.addressLine1 = '';
            }
            if (JSONData[i].addressLine2) {
                CWObject.addressLine2 = JSONData[i].addressLine2;
            } else {
                CWObject.addressLine2 = '';
            }
            if (JSONData[i].city) {
                CWObject.city = JSONData[i].city;
            } else {
                CWObject.city = '';
            }
            if (JSONData[i].stateReference) {
                if (JSONData[i].stateReference.id) {
                    CWObject.stateReference.id = JSONData[i].stateReference.id.toFixed(0);
                } else {
                    CWObject.stateReference.id = '';
                }
                if (JSONData[i].stateReference.name) {
                    CWObject.stateReference.name = JSONData[i].stateReference.name;
                } else {
                    CWObject.stateReference.name = '';
                }
                if (JSONData[i].stateReference.identifier) {
                    CWObject.stateReference.identifier = JSONData[i].stateReference.identifier;
                } else {
                    CWObject.stateReference.identifier = '';
                }
            }

            if (JSONData[i].zip) {
                CWObject.zip = JSONData[i].zip;
            } else {
                CWObject.zip = '';
            }

            if (JSONData[i].country) {
                if (JSONData[i].country.id) {
                    CWObject.country.id = JSONData[i].country.id.toFixed(0);
                } else {
                    CWObject.country.id = '';
                }
                if (JSONData[i].country.name) {
                    CWObject.country.name = JSONData[i].country.name;
                } else {
                    CWObject.country.name = '';
                }
            }

            if (JSONData[i].phoneNumber) {
                CWObject.phoneNumber = JSONData[i].phoneNumber;
            } else {
                CWObject.phoneNumber = '';
            }

            if (JSONData[i].faxNumber) {
                CWObject.faxNumber = JSONData[i].faxNumber;
            } else {
                CWObject.faxNumber = '';
            }

            if (JSONData[i].primaryAddressFlag == true) {
                CWObject.primaryAddressFlag = 'T';
            } else {
                CWObject.primaryAddressFlag = 'F';
            }

            if (JSONData[i].defaultBillingFlag == true) {
                CWObject.defaultBillingFlag = 'T';
            } else {
                CWObject.defaultBillingFlag = 'F';
            }

            if (JSONData[i].defaultShippingFlag == true) {
                CWObject.defaultShippingFlag = 'T';
            } else {
                CWObject.defaultShippingFlag = 'F';
            }

            if (JSONData[i].defaultMailingFlag == true) {
                CWObject.defaultMailingFlag = 'T';
            } else {
                CWObject.defaultMailingFlag = 'F';
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                } else {
                    CWObject.company.id = '';
                }
                if (JSONData[i].company.name) {
                    CWObject.company.name = JSONData[i].company.name;
                } else {
                    CWObject.company.name = '';
                }
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Site ID: ' + i, stringErr);
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getStateCountry(cwStateId, cwAccountId) {
    var JSONData = getJSONData(STATE_REQ_STRING + '/' + cwStateId, 1, 1, 1, null, null, null, cwAccountId);
    if (JSONData) {
        //build cw object based on json JSONPayload
        var stateCountry = '';

        if (JSONData.country) {
            if (JSONData.country.name) {
                stateCountry = JSONData.country.name;
            } else {
                stateCountry = '';
            }
        }
    }
    return stateCountry;
}

function getAgreementAddition(pageNumber, pageSize, overrideKeyDate, cwAgreementId, cwAccountId) {

    //compute for page count via Agreement parent
    var agreementAdditionIDArray = [];
    var JSONDataArray = [];
    var JSONData;

    if (cwAgreementId != null) {
        //coming in from initial agreement import creation
        JSONData = getJSONData(AGREEMENT_REQ_STRING + '/' + cwAgreementId + '/' + AGREEMENTADDITION_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);
    } else {
        //else its null, this is coming from UI suitelet viewer
        var agreementAdditionHeaderTotals = getPageCount(AGREEMENT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId);
        var agreementAdditionHeaderPageCount = agreementAdditionHeaderTotals.pageCount;
        var agreementAdditionHeaderRecordCount = agreementAdditionHeaderTotals.recordCount;

        agreementAdditionIDArray = getCWDataHeaderIDArray(AGREEMENT_REQ_STRING, agreementAdditionHeaderPageCount, null, overrideKeyDate, cwAccountId);
        nlapiLogExecution('DEBUG', 'Agreement ID length: ' + agreementAdditionIDArray.length);
        var AGREEMENTADDITIONLINE_REQ_STRING = AGREEMENT_REQ_STRING + '/' + agreementAdditionIDArray[pageNumber - 1] + '/' + AGREEMENTADDITION_REQ_STRING;

        JSONData = getJSONData(AGREEMENTADDITIONLINE_REQ_STRING, 1, pageSize, 1, null, null, null, cwAccountId);
    }
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWAgreementAddition();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWAGAD' + CWObject.id + '-' + cwAccountId;

            if (JSONData[i].product) {
                if (JSONData[i].product.id) {
                    CWObject.product.id = JSONData[i].product.id.toFixed(0);
                } else {
                    CWObject.product.id = '';
                }
                if (JSONData[i].product.identifier) {
                    CWObject.product.identifier = JSONData[i].product.identifier;
                } else {
                    CWObject.product.identifier = '';
                }
                if (JSONData[i].product.serializedFlag) {
                    if (JSONData[i].product.serializedFlag == true) {
                        CWObject.product.serializedFlag = 'T';
                    } else {
                        CWObject.product.serializedFlag = 'F';
                    }
                } else {
                    CWObject.product.serializedFlag = 'F';
                }
            }

            if (JSONData[i].quantity) {
                CWObject.quantity = JSONData[i].quantity;
            } else {
                CWObject.quantity = 0;
            }

            if (JSONData[i].lessIncluded) {
                CWObject.lessIncluded = JSONData[i].lessIncluded;
            } else {
                CWObject.lessIncluded = 0;
            }

            if (JSONData[i].unitPrice) {
                CWObject.unitPrice = JSONData[i].unitPrice;
            } else {
                CWObject.unitPrice = 0;
            }

            if (JSONData[i].unitCost) {
                CWObject.unitCost = JSONData[i].unitCost;
            } else {
                CWObject.unitCost = 0;
            }

            if (JSONData[i].billCustomer) {
                CWObject.billCustomer = JSONData[i].billCustomer;
            } else {
                CWObject.billCustomer = '';
            }

            if (JSONData[i].effectiveDate) {
                CWObject.effectiveDate = convertJSONStringToDate(JSONData[i].effectiveDate);
            } else {
                CWObject.effectiveDate = '';
            }

            if (JSONData[i].cancelledDate) {
                CWObject.cancelledDate = convertJSONStringToDate(JSONData[i].cancelledDate);
            } else {
                CWObject.cancelledDate = '';
            }

            if (JSONData[i].taxableFlag == true) {
                CWObject.taxableFlag = 'T';
            } else {
                CWObject.taxableFlag = 'F';
            }

            if (JSONData[i].serialNumber) {
                CWObject.serialNumber = JSONData[i].serialNumber;
            } else {
                CWObject.serialNumber = '';
            }

            if (JSONData[i].invoiceDescription) {
                CWObject.invoiceDescription = JSONData[i].invoiceDescription;
            } else {
                CWObject.invoiceDescription = '';
            }

            if (JSONData[i].purchaseItemFlag == true) {
                CWObject.purchaseItemFlag = 'T';
            } else {
                CWObject.purchaseItemFlag = 'F';
            }

            if (JSONData[i].specialOrderFlag == true) {
                CWObject.specialOrderFlag = 'T';
            } else {
                CWObject.specialOrderFlag = 'F';
            }

            if (JSONData[i].agreementId) {
                CWObject.agreementId = JSONData[i].agreementId.toFixed(0);
            } else {
                CWObject.agreementId = '';
            }

            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].billedQuantity) {
                CWObject.billedQuantity = JSONData[i].billedQuantity;
            } else {
                CWObject.billedQuantity = 0;
            }

            if (JSONData[i].uom) {
                CWObject.uom = JSONData[i].uom;
            } else {
                CWObject.uom = '';
            }

            if (JSONData[i].extPrice) {
                CWObject.extPrice = JSONData[i].extPrice;
            } else {
                CWObject.extPrice = 0;
            }

            if (JSONData[i].extCost) {
                CWObject.extCost = JSONData[i].extCost;
            } else {
                CWObject.extCost = 0;
            }

            if (JSONData[i].sequenceNumber) {
                CWObject.sequenceNumber = JSONData[i].sequenceNumber;
            } else {
                CWObject.sequenceNumber = 0;
            }

            if (JSONData[i].margin) {
                CWObject.margin = JSONData[i].margin;
            } else {
                CWObject.margin = 0;
            }

            if (JSONData[i].prorateCost) {
                CWObject.prorateCost = JSONData[i].prorateCost;
            } else {
                CWObject.prorateCost = 0;
            }

            if (JSONData[i].proratePrice) {
                CWObject.proratePrice = JSONData[i].proratePrice;
            } else {
                CWObject.proratePrice = 0;
            }

            if (JSONData[i].prorateCurrentPeriodFlag == true) {
                CWObject.prorateCurrentPeriodFlag = 'T';
            } else {
                CWObject.prorateCurrentPeriodFlag = 'F';
            }

            if (JSONData[i].opportunity) {
                if (JSONData[i].opportunity.id) {
                    CWObject.opportunity.id = JSONData[i].opportunity.id.toFixed(0);
                } else {
                    CWObject.opportunity.id = '';
                }
                if (JSONData[i].opportunity.name) {
                    CWObject.opportunity.name = JSONData[i].opportunity.name;
                } else {
                    CWObject.opportunity.name = '';
                }
            }

            if (JSONData[i].agreementStatus) {
                CWObject.agreementStatus = JSONData[i].agreementStatus;
            } else {
                CWObject.agreementStatus = '';
            }

            if (JSONData[i].invoiceGrouping) {
                if (JSONData[i].invoiceGrouping.id) {
                    CWObject.invoiceGrouping.id = JSONData[i].invoiceGrouping.id.toFixed(0);
                } else {
                    CWObject.invoiceGrouping.id = '';
                }
                if (JSONData[i].invoiceGrouping.name) {
                    CWObject.invoiceGrouping.name = JSONData[i].invoiceGrouping.name;
                } else {
                    CWObject.invoiceGrouping.name = '';
                }
                if (JSONData[i].invoiceGrouping.description) {
                    CWObject.invoiceGrouping.description = JSONData[i].invoiceGrouping.description;
                } else {
                    CWObject.invoiceGrouping.description = '';
                }
                if (JSONData[i].invoiceGrouping.showSubItemsFlag) {
                    if (JSONData[i].invoiceGrouping.showSubItemsFlag == true) {
                        CWObject.invoiceGrouping.showSubItemsFlag = 'T';
                    } else {
                        CWObject.invoiceGrouping.showSubItemsFlag = 'F';
                    }
                } else {
                    CWObject.invoiceGrouping.showSubItemsFlag = 'F';
                }
                if (JSONData[i].invoiceGrouping.showPriceFlag) {
                    if (JSONData[i].invoiceGrouping.showPriceFlag == true) {
                        CWObject.invoiceGrouping.showPriceFlag = 'T';
                    } else {
                        CWObject.invoiceGrouping.showPriceFlag = 'F';
                    }
                } else {
                    CWObject.invoiceGrouping.showPriceFlag = 'F';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }


            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement Addition ID: ' + i, stringErr);
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getAgreementAdjustment(pageNumber, pageSize, overrideKeyDate, cwAgreementId, cwAccountId) {

    //compute for page count via Agreement parent
    var agreementAdjustmentIDArray = [];
    var JSONDataArray = [];
    var JSONData;

    if (cwAgreementId != null) {
        //coming in from initial agreement import creation
        JSONData = getJSONData(AGREEMENT_REQ_STRING + '/' + cwAgreementId + '/' + AGREEMENTADJUSTMENT_REQ_STRING, 1, 1000, 1, null, null, cwAccountId);
    } else {
        //else its null, this is coming from UI suitelet viewer
        var agreementAdjustmentHeaderTotals = getPageCount(AGREEMENT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId);
        var agreementAdjustmentHeaderPageCount = agreementAdjustmentHeaderTotals.pageCount;
        var agreementAdjustmentHeaderRecordCount = agreementAdjustmentHeaderTotals.recordCount;

        agreementAdjustmentIDArray = getCWDataHeaderIDArray(AGREEMENT_REQ_STRING, agreementAdjustmentHeaderPageCount, null, overrideKeyDate, cwAccountId);
        nlapiLogExecution('DEBUG', 'Agreement ID length: ' + agreementAdjustmentIDArray.length);
        var AGREEMENTADJUSTMENTLINE_REQ_STRING = AGREEMENT_REQ_STRING + '/' + agreementAdjustmentIDArray[pageNumber - 1] + '/' + AGREEMENTADJUSTMENT_REQ_STRING;

        JSONData = getJSONData(AGREEMENTADJUSTMENTLINE_REQ_STRING, 1, pageSize, 1, null, null, null, cwAccountId);
    }
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWAgreementAdjustment();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWAGAJ' + CWObject.id + '-' + cwAccountId;

            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].effectiveDate) {
                CWObject.effectiveDate = convertJSONStringToDate(JSONData[i].effectiveDate);
            } else {
                CWObject.effectiveDate = '';
            }

            if (JSONData[i].agreementId) {
                CWObject.agreementId = JSONData[i].agreementId.toFixed(0);
            } else {
                CWObject.agreementId = '';
            }

            if (JSONData[i].amount) {
                CWObject.amount = JSONData[i].amount;
            } else {
                CWObject.amount = 0;
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement Adjustment ID: ' + i, stringErr);
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getAgreementSite(pageNumber, pageSize, overrideKeyDate, cwAgreementId, cwAccountId) {

    //compute for page count via Agreement parent
    var agreementSiteIDArray = [];
    var JSONDataArray = [];
    var JSONData;

    if (cwAgreementId != null) {
        //coming in from initial agreement import creation
        JSONData = getJSONData(AGREEMENT_REQ_STRING + '/' + cwAgreementId + '/' + AGREEMENTSITE_REQ_STRING, 1, 1000, 1, null, null, cwAccountId);
    } else {
        //else its null, this is coming from UI suitelet viewer
        var agreementSiteHeaderTotals = getPageCount(AGREEMENT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId);
        var agreementSiteHeaderPageCount = agreementSiteHeaderTotals.pageCount;
        var agreementSiteHeaderRecordCount = agreementSiteHeaderTotals.recordCount;

        agreementSiteIDArray = getCWDataHeaderIDArray(AGREEMENT_REQ_STRING, agreementSiteHeaderPageCount, null, overrideKeyDate, cwAccountId);
        nlapiLogExecution('DEBUG', 'Agreement ID length: ' + agreementSiteIDArray.length);
        var AGREEMENTSITELINE_REQ_STRING = AGREEMENT_REQ_STRING + '/' + agreementSiteIDArray[pageNumber - 1] + '/' + AGREEMENTSITE_REQ_STRING;

        JSONData = getJSONData(AGREEMENTSITELINE_REQ_STRING, 1, pageSize, 1, null, null, null, cwAccountId);
    }
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWAgreementSite();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWAGST' + CWObject.id + '-' + cwAccountId;

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                } else {
                    CWObject.company.id = '';
                }
                if (JSONData[i].company.identifier) {
                    CWObject.company.identifier = JSONData[i].company.identifier;
                } else {
                    CWObject.company.identifier = '';
                }
                if (JSONData[i].company.name) {
                    CWObject.company.name = JSONData[i].company.name;
                } else {
                    CWObject.company.name = '';
                }
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id) {
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                } else {
                    CWObject.site.id = '';
                }
                if (JSONData[i].site.name) {
                    CWObject.site.name = JSONData[i].site.name;
                } else {
                    CWObject.site.name = '';
                }
            }

            if (JSONData[i].agreementId) {
                CWObject.agreementId = JSONData[i].agreementId.toFixed(0);
            } else {
                CWObject.agreementId = '';
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement Site ID: ' + i, stringErr);
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getImportKeyDateInternalId(dataRequestString) {
    var importKeyDateInternalId = '';
    var dateFieldFilter = 'dateEntered'; //this is the Date entered or date updated field name on Connectwise Manage records
    var returnObject = new Object();

    switch (dataRequestString) {
        case CONTACT_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_contkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case COMPANY_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_custkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case ITEM_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_itemkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case EXPENSETYPE_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_etkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case WORKTYPE_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_wtkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case INVITEM_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_itemenkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case EXPENSE_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_expenkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case TIME_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_timeenkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case INVOICE_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_invimpkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case AGREEMENT_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_agreekeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case PROJECT_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_projkeydate';
            dateFieldFilter = 'lastUpdated';
            break;
        case PROJECTTICKET_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_prtickkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case SERVICETICKET_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_servtkkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case PURCHASEORDERHEADER_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_pokeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case SALESORDER_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_sokeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case MEMBER_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_memkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        case EXPENSE_REPORT_REQ_STRING:
            importKeyDateInternalId = 'custrecord_ctc_cw_settings_exrkeydate';
            //dateFieldFilter = 'dateEntered'; //has date entered but will use lastUpdated instead for standardization
            dateFieldFilter = 'lastUpdated';
            break;
        // case PURCHASEORDERLINE_REQ_STRING:

        //     break;
        case CUSTOMFIELD_REQ_STRING:

            return null; //custom fields don't need last updated filter
            break;
    }

    returnObject.importkeyinternalid = importKeyDateInternalId;
    returnObject.datefieldfilter = dateFieldFilter;

    return returnObject;
}

function getPageCount(dataRequestString, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator) {
    var queryCount = {};
    var recordSettings = getImportKeyDateInternalId(dataRequestString);

    var importKeyDateInternalId;
    var dateFieldFilter;

    if (recordSettings) {
        importKeyDateInternalId = recordSettings.importkeyinternalid;
        dateFieldFilter = recordSettings.datefieldfilter;
    }

    var dateFilterString = '';

    if (importKeyDateInternalId) {
        var importKeyDate;

        if (overrideKeyDate) {
            importKeyDate = overrideKeyDate;
        } else {
            importKeyDate = getGlobalSetting(importKeyDateInternalId, cwAccountId);
        }

        if (importKeyDate) {
            var dateValue = formatDateToYYYYMMDD(importKeyDate);
            if (dateFilterOperator) {
                dateFilterString = 'conditions=' + dateFieldFilter + dateFilterOperator + '[' + dateValue + ']';
            } else {
                dateFilterString = 'conditions=' + dateFieldFilter + '>=[' + dateValue + ']';
            }
        }

    }

    if (customParameter) {
        if (dateFilterString) {
            customParameter = ' AND ' + customParameter.substring(12, customParameter.length);
        } else {
            customParameter = customParameter.substring(1, customParameter.length);
        }
    } else {
        nlapiLogExecution('AUDIT', 'No Custom Parameter Detected');
        customParameter = '';
    }

    if (pageSize == null) {
        nlapiLogExecution('DEBUG', 'Page Size is null, settings default page size...');
        pageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
    }
    var baseURL = getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId);

    var jsonCountRequest = baseURL + dataRequestString + '/count?' + dateFilterString + customParameter;
    var firstIndex = jsonCountRequest.indexOf("&conditions=");
    var lastIndex = jsonCountRequest.lastIndexOf("&conditions=");
    if (firstIndex != lastIndex) {
        jsonCountRequest = replaceLast("&conditions=", " AND ", jsonCountRequest);
        nlapiLogExecution('DEBUG', 'There are 2 &conditions= in the request URL string, removing one', 'Replaced URL: ' + jsonCountRequest);
    }

    jsonCountRequest = jsonCountRequest.replace('?undefined', '');
    jsonCountRequest = jsonCountRequest.replace('?null', '');

    nlapiLogExecution('DEBUG', 'JSON Count Request: ', jsonCountRequest);

    var jsonCountPayload = nlapiRequestURL(jsonCountRequest, null, getHeaderSettings(null, cwAccountId));

    var jsonCountData = JSON.parse(jsonCountPayload.getBody());
    var jsonCount = Number(jsonCountData.count);
    nlapiLogExecution('AUDIT', 'JSON Count Body: ', JSON.stringify(jsonCountData));
    nlapiLogExecution('AUDIT', 'JSON Count Raw Data: ' + jsonCount);

    queryCount.pageCount = Math.ceil(Number(jsonCount / pageSize));
    queryCount.recordCount = jsonCount;
    queryCount.recordCountJSON = jsonCountData;

    return queryCount;
}

// old page count before it was changed - 4/2/2022
// function getPageCount(dataRequestString, pageSize, overrideKeyDate, cwAccountId)
// {
//     var queryCount = {};
//     var recordSettings = getImportKeyDateInternalId(dataRequestString);
//
//     var importKeyDateInternalId;
//     var dateFieldFilter;
//
//     if(recordSettings)
//     {
//         importKeyDateInternalId = recordSettings.importkeyinternalid;
//         dateFieldFilter = recordSettings.datefieldfilter;
//     }
//
//     var dateFilterString = '';
//
//     if(importKeyDateInternalId) {
//         var importKeyDate;
//
//         if(overrideKeyDate) {
//             importKeyDate = overrideKeyDate;
//         } else {
//             importKeyDate = getGlobalSetting(importKeyDateInternalId, cwAccountId);
//         }
//
//         if(importKeyDate) {
//             var dateValue = formatDateToYYYYMMDD(importKeyDate);
//             dateFilterString = '?conditions='+dateFieldFilter+'>=['+dateValue+']';
//         }
//     }
//
//     if(pageSize == null) {
//         nlapiLogExecution('DEBUG', 'Page Size is null, settings default page size...');
//         pageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
//     }
//
//     var jsonCountPayload = nlapiRequestURL(getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId)+dataRequestString+'/count'+dateFilterString, null, getHeaderSettings(null, cwAccountId));
//
//     var jsonCountData = JSON.parse(jsonCountPayload.getBody());
//     var jsonCount = Number(jsonCountData.count);
//
//     queryCount.pageCount = Math.ceil(Number(jsonCount / pageSize));
//     queryCount.recordCount = jsonCount;
//
//     return queryCount;
// }

function getJSONData(dataRequestString, pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator, additionalHeaderParam, paginationIdParam) {
    nlapiLogExecution('DEBUG', 'JSON DATA GET - CW Account ID Selected: ' + cwAccountId);
    nlapiLogExecution('AUDIT', 'paginationIdParam on Data Models: ' + paginationIdParam);
    var cwBaseURL = getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId);
    var JSONPayload = '';
    var JSONStringData = '';
    var JSONData;
    var sortByLastUpdated = getGlobalSetting('custrecord_ctc_cw_lastpagefirst', cwAccountId); //added 8/17/22 - will make last updated data appear on first page

    var recordSettings = getImportKeyDateInternalId(dataRequestString);

    var importKeyDateInternalId;
    var dateFieldFilter;

    if (recordSettings) {
        importKeyDateInternalId = recordSettings.importkeyinternalid;
        dateFieldFilter = recordSettings.datefieldfilter;
    }

    var dateFilterString = '';

    if (importKeyDateInternalId) {
        var importKeyDate;

        if (overrideKeyDate) {
            importKeyDate = overrideKeyDate;
        } else {
            importKeyDate = getGlobalSetting(importKeyDateInternalId, cwAccountId);
        }

        if (importKeyDate) {
            var dateValue = formatDateToYYYYMMDD(importKeyDate);
            if (dateFilterOperator) {
                dateFilterString = '&conditions=' + dateFieldFilter + dateFilterOperator + '[' + dateValue + ']';
            } else {
                dateFilterString = '&conditions=' + dateFieldFilter + '>=[' + dateValue + ']';
            }
        }
    }

    if (customParameter == null) {
        customParameter = '';
    } else {
        nlapiLogExecution('DEBUG', 'JSON GET URL Custom parameter detected: ' + customParameter);
    }


    //set default page size if blank
    if (pageSize == null || pageSize == '') {
        pageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
    }
    //if pageNumber is blank or non-existent, that means fetch all JSONData
    if (pageNumber == 0 || pageNumber == null) {
        //get total count
        if (pageCount > 0) {
            JSONStringData = '[';
            for (var j = 1; j <= pageCount; j++) {
                //TODO: Added 3/1/2022 that fixes a rare bug where 2 &conditions= where injected on the request URL string, this code strips off the excess &conditions= on the request string
                var requestString = cwBaseURL + dataRequestString + '?pagesize=' + pageSize + '&page=' + j + dateFilterString + customParameter;
                //added for forward-page navigation 8/26/2022
                if (paginationIdParam) {
                    requestString = requestString + '&pageId=' + paginationIdParam;
                }
                var firstIndex = requestString.indexOf("&conditions=");
                var lastIndex = requestString.lastIndexOf("&conditions=");
                if (firstIndex != lastIndex) {
                    requestString = replaceLast("&conditions=", " AND ", requestString);
                    nlapiLogExecution('DEBUG', 'There are 2 &conditions= in the request URL string, removing one and adding AND keyword', 'Replaced URL: ' + requestString);
                }
                //JSONPayload = nlapiRequestURL(cwBaseURL+dataRequestString+'?pagesize='+pageSize+'&page=' + j + dateFilterString + customParameter, null, getHeaderSettings(null, cwAccountId)); //original request before fix
                JSONPayload = nlapiRequestURL(requestString, null, getHeaderSettings(additionalHeaderParam, cwAccountId));
                var rawDataTrimmed = '';
                var rawData = JSONPayload.getBody();

                if (rawData) {
                    rawDataTrimmed = rawData.substring(rawData.indexOf("[") + 1, rawData.lastIndexOf("]"));

                    if (j < pageCount)
                        rawDataTrimmed = rawDataTrimmed + ',';

                    JSONStringData = JSONStringData + rawDataTrimmed;
                }
            }
            JSONStringData = JSONStringData + ']';
        }
    } else {
        //specific page number requested, return 1000 results only
        nlapiLogExecution('DEBUG', 'page number value is: ' + pageNumber, 'page count: ' + pageCount);

        var requestURLString = getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId) + dataRequestString + '?pagesize=' + pageSize + '&page=' + pageNumber + dateFilterString;
        if (orderBy) {
            requestURLString = requestURLString + '&orderby=' + orderBy;
            if (orderByDescending == 'T') {
                requestURLString = requestURLString + ' desc'; //if set to true, then descending
            } else {
                requestURLString = requestURLString + ' asc'; //ascending by default or if set to false
            }
        } else {
            if (sortByLastUpdated == 'T') {
                requestURLString = requestURLString + '&orderby=_info/lastUpdated desc';
            }
        }
        //TODO: Added 3/1/2022 that fixes a rare bug where 2 &conditions= where injected on the request URL string, this code strips off the excess &conditions= on the request string
        var requestString = requestURLString + customParameter;
        //added for forward-page navigation 8/26/2022
        if (paginationIdParam) {
            requestString = requestString + '&pageId=' + paginationIdParam;
        }
        var firstIndex = requestString.indexOf("&conditions=");
        var lastIndex = requestString.lastIndexOf("&conditions=");
        if (firstIndex != lastIndex) {
            requestString = replaceLast("&conditions=", " AND ", requestString);
            nlapiLogExecution('DEBUG', 'There are 2 &conditions= in the request URL string, removing one', 'Replaced URL: ' + requestString);
        }

        nlapiLogExecution('AUDIT', 'Request URL formed:', requestString);
        //JSONPayload = nlapiRequestURL(requestURLString + customParameter, null, getHeaderSettings(null, cwAccountId)); //original request before fix
        JSONPayload = nlapiRequestURL(requestString, null, getHeaderSettings(additionalHeaderParam, cwAccountId));
        JSONStringData = JSONPayload.getBody();
        // var headers = JSONPayload.getAllHeaders();
        // for (var x = 0; x < headers.length; x++)
        // nlapiLogExecution('DEBUG', headers[x], JSONPayload.getHeader(headers[x]));
        // nlapiLogExecution('DEBUG', 'JSON Payload Content-Type', JSONPayload.getContentType());
        // nlapiLogExecution('DEBUG', 'JSONPayload', JSONStringData);
    }

    if (JSONStringData) {
        JSONData = JSON.parse(JSONStringData);
        //nlapiLogExecution('DEBUG', 'JSONPayload ID', JSONData[0].id);
    }
    //check if there is a forward-pagination link on the header, include it on JSONData object if there is
    var forwardPaginationLink = JSONPayload.getHeader('Link');
    nlapiLogExecution('AUDIT', 'Forward Pagination Link: ', forwardPaginationLink);

    if (forwardPaginationLink && forwardPaginationLink != '') {
        var paginationId = getPaginationId(forwardPaginationLink)
        if (paginationId && paginationId != '') {
            JSONData.paginationid = paginationId;
            nlapiLogExecution('AUDIT', 'Setting Pagination ID: ', paginationId);
        }
        nlapiLogExecution('AUDIT', 'Forward Pagination ID: ', paginationId);
    }
    return JSONData;
}

function postJSONData(dataPostString, jsonPostObject, additionalHeadersObject, httpMethod, cwAccountId) {
    var JSONResponse;
    var JSONResponseString;
    var cwBaseURL = getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId);
    var httpHeaders = getHeaderSettings(null, cwAccountId);
    nlapiLogExecution('DEBUG', 'POST URL formed:', cwBaseURL + dataPostString);

    //Stringifying JSON
    var JSONPostString = JSON.stringify(jsonPostObject, JSONReplacer);
    nlapiLogExecution('DEBUG', 'JSON Post String', JSONPostString);

    JSONResponse = nlapiRequestURL(getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId) + dataPostString, JSONPostString, getHeaderSettings(additionalHeadersObject, cwAccountId), httpMethod);
    JSONResponseString = JSONResponse.getBody();
    nlapiLogExecution("EMERGENCY", JSONResponseString);
    return JSONResponse;
}

function getContact(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(CONTACT_REQ_STRING, getPageCount(CONTACT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWContact();

            CWObject.id = JSONData[i].id.toFixed(0);
            if (JSONData[i].firstName != null && JSONData[i].firstName != 'undefined') {
                CWObject.name = JSONData[i].firstName;
            } else {
                CWObject.name = 'No Name';
            }

            if (JSONData[i].firstName != null && JSONData[i].firstName != 'undefined') {
                CWObject.firstName = JSONData[i].firstName;
            } else {
                CWObject.firstName = '';
            }


            if (JSONData[i].lastName != null && JSONData[i].lastName != 'undefined') {
                CWObject.name = CWObject.name + ' ' + JSONData[i].lastName;
                CWObject.lastName = JSONData[i].lastName;
            }


            if (JSONData[i].company) {
                if (JSONData[i].company.id != null) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                    CWObject.company.identifier = JSONData[i].company.identifier;
                } else {
                    CWObject.company.id = '';
                    CWObject.company.identifier = '';
                }

            }

            if (JSONData[i].title) {
                CWObject.title = JSONData[i].title;
            } else {
                CWObject.title = '';
            }

            //build communication items array
            CWObject.communicationItems = JSONData[i].communicationItems;

            //look for default phone
            //var defaultPhone = '';
            var defaultEmail = '';

            if (CWObject.communicationItems != null) {
                for (var j = 0; j < CWObject.communicationItems.length; j++) {
                    //11/17/2020 - replaced to defaultPhoneNbr
                    // if(CWObject.communicationItems[j].defaultFlag == true && CWObject.communicationItems[j].communicationType == 'Phone')
                    //     defaultPhone = CWObject.communicationItems[j].value;

                    if (CWObject.communicationItems[j].defaultFlag == true && CWObject.communicationItems[j].communicationType == 'Email')
                        defaultEmail = CWObject.communicationItems[j].value;
                }
            }

            if (JSONData[i].defaultPhoneNbr) {
                try {
                    var cleanPhoneNumber = JSONData[i].defaultPhoneNbr.replace(/\D/g, '');
                } catch (phoneErr) {
                    nlapiLogExecution('ERROR', 'Phone regexp error on Contacts', phoneErr);
                }
                CWObject.defaultPhone = JSONData[i].defaultPhoneNbr;
            } else {
                CWObject.defaultPhone = '';
            }

            CWObject.defaultEmail = defaultEmail;

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }
            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            //new fields 9/17/2020
            if (JSONData[i].site) {
                if (JSONData[i].site.id)
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                if (JSONData[i].site.name)
                    CWObject.site.name = JSONData[i].site.name;
            }

            //set default to blank just in case contact has no site address
            CWObject.addressLine1 = '';
            CWObject.addressLine2 = '';
            CWObject.city = '';
            CWObject.state = '';
            CWObject.zip = '';
            CWObject.country.name = '';
            CWObject.country.id = '';

            //added 11/20/2021
            if (JSONData[i].types) {
                if (JSONData[i].types.length > 0) {
                    CWObject.types.name = '';
                    for (var x = 0; x < JSONData[i].types.length; x++) {
                        //get all type names
                        if (x == 0) {
                            CWObject.types.name = JSONData[i].types[x].name;
                            CWObject.types.id = JSONData[i].types[x].id;
                        }
                        if (x > 0) {
                            CWObject.types.name = CWObject.types.name + '<br>' + JSONData[i].types[x].name;
                            CWObject.types.id = CWObject.types.id + ',' + JSONData[i].types[x].id.toFixed(0);
                        }
                    }
                }
            }

            if (JSONData[i].inactiveFlag == true) {
                CWObject.inactiveFlag = 'T';
            } else {
                CWObject.inactiveFlag = 'F';
            }

            if (JSONData[i].defaultFlag == true) {
                CWObject.defaultFlag = 'T';
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i].defaultBillingFlag == true) {
                CWObject.defaultBillingFlag = 'T';
            } else {
                CWObject.defaultBillingFlag = 'F';
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Contact ID: ' + i, stringErr);
            }


            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getItem(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(ITEM_REQ_STRING, getPageCount(ITEM_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWItem();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.identifier = JSONData[i].identifier;
            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].price) {
                CWObject.price = JSONData[i].price;
            } else {
                CWObject.price = 0;
            }

            if (JSONData[i].cost) {
                CWObject.cost = JSONData[i].cost;
            } else {
                CWObject.cost = 0;
            }

            if (JSONData[i].taxableFlag == true) {
                CWObject.taxableFlag = 'T';
            } else {
                CWObject.taxableFlag = 'F';
            }
            if (JSONData[i].dropshipFlag == true) {
                CWObject.dropshipFlag = 'T';
            } else {
                CWObject.dropshipFlag = 'F';
            }
            if (JSONData[i].specialOrderFlag == true) {
                CWObject.specialOrderFlag = 'T';
            } else {
                CWObject.specialOrderFlag = 'F';
            }
            if (JSONData[i].customerDescription) {
                CWObject.customerDescription = JSONData[i].customerDescription;
            } else {
                CWObject.customerDescription = '';
            }
            CWObject.productClass = JSONData[i].productClass;

            //new additions - 6/16/2020
            if (JSONData[i].type) {
                if (JSONData[i].type.id) {
                    CWObject.type.id = JSONData[i].type.id;
                } else {
                    CWObject.type.id = '';
                }
                if (JSONData[i].type.name) {
                    CWObject.type.name = JSONData[i].type.name;
                } else {
                    CWObject.type.name = '';
                }
            }

            if (JSONData[i].category) {
                if (JSONData[i].category.id) {
                    CWObject.category.id = JSONData[i].category.id;
                } else {
                    CWObject.category.id = '';
                }
                if (JSONData[i].category.name) {
                    CWObject.category.name = JSONData[i].category.name;
                } else {
                    CWObject.category.name = '';
                }
            }

            if (JSONData[i].subcategory) {
                if (JSONData[i].subcategory.id) {
                    CWObject.subcategory.id = JSONData[i].subcategory.id;
                } else {
                    CWObject.subcategory.id = '';
                }
                if (JSONData[i].subcategory.name) {
                    CWObject.subcategory.name = JSONData[i].subcategory.name;
                } else {
                    CWObject.subcategory.name = '';
                }
            }

            if (JSONData[i].inactiveFlag == true) {
                CWObject.inactiveFlag = 'T';
            } else {
                CWObject.inactiveFlag = 'F';
            }

            //new fields 11/30/2021
            if (JSONData[i].serializedFlag == true) {
                CWObject.serializedFlag = 'T';
            } else {
                CWObject.serializedFlag = 'F';
            }

            if (JSONData[i].serializedCostFlag == true) {
                CWObject.serializedCostFlag = 'T';
            } else {
                CWObject.serializedCostFlag = 'F';
            }

            if (JSONData[i].phaseProductFlag == true) {
                CWObject.phaseProductFlag = 'T';
            } else {
                CWObject.phaseProductFlag = 'F';
            }

            if (JSONData[i].unitOfMeasure) {
                if (JSONData[i].unitOfMeasure.id) {
                    CWObject.unitOfMeasure.id = JSONData[i].unitOfMeasure.id;
                } else {
                    CWObject.unitOfMeasure.id = '';
                }
                if (JSONData[i].unitOfMeasure.name) {
                    CWObject.unitOfMeasure.name = JSONData[i].unitOfMeasure.name;
                } else {
                    CWObject.unitOfMeasure.name = '';
                }
            }

            if (JSONData[i].minStockLevel) {
                CWObject.minStockLevel = JSONData[i].minStockLevel;
            } else {
                CWObject.minStockLevel = 0;
            }

            if (JSONData[i].priceAttribute) {
                CWObject.priceAttribute = JSONData[i].priceAttribute;
            } else {
                CWObject.priceAttribute = '';
            }

            if (JSONData[i].manufacturer) {
                if (JSONData[i].manufacturer.id) {
                    CWObject.manufacturer.id = JSONData[i].manufacturer.id;
                } else {
                    CWObject.manufacturer.id = '';
                }
                if (JSONData[i].manufacturer.name) {
                    CWObject.manufacturer.name = JSONData[i].manufacturer.name;
                } else {
                    CWObject.manufacturer.name = '';
                }
            }

            if (JSONData[i].manufacturerPartNumber) {
                CWObject.manufacturerPartNumber = JSONData[i].manufacturerPartNumber;
            } else {
                CWObject.manufacturerPartNumber = '';
            }

            if (JSONData[i].vendor) {
                if (JSONData[i].vendor.id) {
                    CWObject.vendor.id = JSONData[i].vendor.id;
                } else {
                    CWObject.vendor.id = '';
                }
                if (JSONData[i].vendor.name) {
                    CWObject.vendor.name = JSONData[i].vendor.name;
                } else {
                    CWObject.vendor.name = '';
                }
            }

            if (JSONData[i].vendorSku) {
                CWObject.vendorSku = JSONData[i].vendorSku;
            } else {
                CWObject.vendorSku = '';
            }

            if (JSONData[i].notes) {
                CWObject.notes = JSONData[i].notes;
            } else {
                CWObject.notes = '';
            }

            if (JSONData[i].integrationXRef) {
                CWObject.integrationXRef = JSONData[i].integrationXRef;
            } else {
                CWObject.integrationXRef = '';
            }

            if (JSONData[i].recurringFlag == true) {
                CWObject.recurringFlag = 'T';
            } else {
                CWObject.recurringFlag = 'F';
            }

            if (JSONData[i].recurringRevenue) {
                CWObject.recurringRevenue = JSONData[i].recurringRevenue;
            } else {
                CWObject.recurringRevenue = 0;
            }

            if (JSONData[i].recurringCost) {
                CWObject.recurringCost = JSONData[i].recurringCost;
            } else {
                CWObject.recurringCost = 0;
            }

            if (JSONData[i].recurringOneTimeFlag == true) {
                CWObject.recurringOneTimeFlag = 'T';
            } else {
                CWObject.recurringOneTimeFlag = 'F';
            }

            if (JSONData[i].recurringBillCycle) {
                if (JSONData[i].recurringBillCycle.id) {
                    CWObject.recurringBillCycle.id = JSONData[i].recurringBillCycle.id;
                } else {
                    CWObject.recurringBillCycle.id = '';
                }
                if (JSONData[i].recurringBillCycle.name) {
                    CWObject.recurringBillCycle.name = JSONData[i].recurringBillCycle.name;
                } else {
                    CWObject.recurringBillCycle.name = '';
                }
            }

            if (JSONData[i].recurringCycleType) {
                CWObject.recurringCycleType = JSONData[i].recurringCycleType;
            } else {
                CWObject.recurringCycleType = '';
            }

            if (JSONData[i].calculatedPriceFlag == true) {
                CWObject.calculatedPriceFlag = 'T';
            } else {
                CWObject.calculatedPriceFlag = 'F';
            }

            if (JSONData[i].calculatedCostFlag == true) {
                CWObject.calculatedCostFlag = 'T';
            } else {
                CWObject.calculatedCostFlag = 'F';
            }

            if (JSONData[i].calculatedPrice) {
                CWObject.calculatedPrice = JSONData[i].calculatedPrice;
            } else {
                CWObject.calculatedPrice = 0;
            }

            if (JSONData[i].calculatedCost) {
                CWObject.calculatedCost = JSONData[i].calculatedCost;
            } else {
                CWObject.calculatedCost = 0;
            }

            //itemUniqueIDListTemp.push(JSONData[i].catalogItem.id.toFixed(0));

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].dateEntered) {
                CWObject.dateEntered = JSONData[i].dateEntered;
            } else {
                CWObject.dateEntered = '';
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Item ID: ' + i, stringErr);
            }


            JSONDataArray.push(CWObject);
        }
    }

    return JSONDataArray;

}

function getInvoice(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(INVOICE_REQ_STRING, getPageCount(INVOICE_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        //specifically for Location Name, grab all locations in the system
        var CWLocationArray = getJSONData(LOCATION_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);
        var CWDepartmentArray = getJSONData(DEPARTMENT_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);
        //debug
        // for (var q = 0; q < CWLocationArray.length; q++)
        //     nlapiLogExecution('DEBUG', 'Loc Data', CWLocationArray[q].name);

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWInvoice();

            CWObject.internalid = null;
            CWObject.id = JSONData[i].id.toFixed(0);

            if (JSONData[i].invoiceNumber)
                CWObject.invoiceNumber = JSONData[i].invoiceNumber;

            if (JSONData[i]) {
                CWObject.type = JSONData[i].type;
            } else {
                CWObject.type = '';
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                }
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id)
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                if (JSONData[i].status.name)
                    CWObject.status.name = JSONData[i].status.name;
            }

            if (JSONData[i].billToCompany) {
                if (JSONData[i].billToCompany.id) {
                    CWObject.billToCompany.id = JSONData[i].billToCompany.id.toFixed(0);
                }
                if (JSONData[i].billToCompany.name)
                    CWObject.billToCompany.name = JSONData[i].billToCompany.name;
            }

            if (JSONData[i].shipToCompany) {
                if (JSONData[i].shipToCompany.id) {
                    CWObject.shipToCompany.id = JSONData[i].shipToCompany.id.toFixed(0);
                }
                if (JSONData[i].shipToCompany.name)
                    CWObject.shipToCompany.name = JSONData[i].shipToCompany.name;
            }

            if (JSONData[i].applyToType) {
                CWObject.applyToType = JSONData[i].applyToType;
            } else {
                CWObject.applyToType = '';
            }

            if (JSONData[i].applyToId)
                CWObject.applyToId = JSONData[i].applyToId.toFixed(0);

            if (JSONData[i].attention) {
                CWObject.attention = JSONData[i].attention;
            } else {
                CWObject.attention = '';
            }

            if (JSONData[i].billingSite) {
                if (JSONData[i].billingSite.id)
                    CWObject.billingSite.id = JSONData[i].billingSite.id.toFixed(0);
                if (JSONData[i].billingSite.name)
                    CWObject.billingSite.name = JSONData[i].billingSite.name;
            }

            if (JSONData[i].shippingSite) {
                if (JSONData[i].shippingSite.id)
                    CWObject.shippingSite.id = JSONData[i].shippingSite.id.toFixed(0);
                if (JSONData[i].shippingSite.name)
                    CWObject.shippingSite.name = JSONData[i].shippingSite.name;
            }

            if (JSONData[i].billingTerms) {
                if (JSONData[i].billingTerms.id) {
                    CWObject.billingTerms.id = JSONData[i].billingTerms.id.toFixed(0);
                } else {
                    CWObject.billingTerms.id = '';
                }
                if (JSONData[i].billingTerms.name) {
                    CWObject.billingTerms.name = JSONData[i].billingTerms.name;
                } else {
                    CWObject.billingTerms.name = '';
                }
            } else {
                CWObject.billingTerms.id = '';
                CWObject.billingTerms.name = '';
            }

            if (JSONData[i].reference) {
                CWObject.reference = JSONData[i].reference;
            } else {
                CWObject.reference = '';
            }

            if (JSONData[i].date) {
                CWObject.date = convertJSONStringToDate(JSONData[i].date);
            }

            if (JSONData[i].departmentId) {
                CWObject.departmentId = JSONData[i].departmentId.toFixed(0);
                //added 9/26/2023
                if (CWDepartmentArray)  //search for department name
                    CWObject.departmentName = findCWObjectName(CWDepartmentArray, CWObject.departmentId);
            } else {
                CWObject.departmentId = '';
            }


            if (JSONData[i].territoryId) {
                CWObject.territoryId = JSONData[i].territoryId.toFixed(0);
            } else {
                CWObject.territoryId = '';
            }

            CWObject.serviceTotal = JSONData[i].serviceTotal;

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            if (JSONData[i].dueDate) {
                CWObject.dueDate = convertJSONStringToDate(JSONData[i].dueDate);
            }

            CWObject.expenseTotal = JSONData[i].expenseTotal;
            CWObject.productTotal = JSONData[i].productTotal;

            if (JSONData[i].previousProgressApplied) {
                CWObject.previousProgressApplied = JSONData[i].previousProgressApplied;
            } else {
                CWObject.previousProgressApplied = 0;
            }

            if (JSONData[i].serviceAdjustmentAmount) {
                CWObject.serviceAdjustmentAmount = JSONData[i].serviceAdjustmentAmount;
            } else {
                CWObject.serviceAdjustmentAmount = 0;
            }

            if (JSONData[i].remainingDownpayment) {
                CWObject.remainingDownpayment = JSONData[i].remainingDownpayment;
            } else {
                CWObject.remainingDownpayment = 0;
            }

            if (JSONData[i].agreementAmount) {
                CWObject.agreementAmount = JSONData[i].agreementAmount;
            } else {
                CWObject.agreementAmount = 0;
            }

            CWObject.downpaymentApplied = JSONData[i].downpaymentApplied;//
            CWObject.subtotal = JSONData[i].subtotal;
            CWObject.total = JSONData[i].total;
            CWObject.salesTax = JSONData[i].salesTax;
            CWObject.payments = JSONData[i].payments;//
            CWObject.credits = JSONData[i].credits;//
            CWObject.balance = JSONData[i].balance;//
            CWObject._info.products_href = JSONData[i]._info.products_href;
            CWObject._info.timeEntries_href = JSONData[i]._info.timeEntries_href;
            CWObject._info.expenseEntries_href = JSONData[i]._info.expenseEntries_href;

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            //new fields 7/7/2020
            if (JSONData[i].locationId) {
                CWObject.locationId = JSONData[i].locationId.toFixed(0);
                if (CWLocationArray)  //search for location name
                    CWObject.locationName = findCWObjectName(CWLocationArray, CWObject.locationId);
            } else {
                CWObject.locationId = '';
            }

            //nlapiLogExecution('DEBUG', 'Inv Data Location Name', CWObject.locationName);

            if (JSONData[i].bottomComment) {
                CWObject.bottomComment = JSONData[i].bottomComment;
            } else {
                CWObject.bottomComment = '';
            }

            if (JSONData[i].topComment) {
                CWObject.topComment = JSONData[i].topComment;
            } else {
                CWObject.topComment = '';
            }

            if (JSONData[i].customerPO) {
                CWObject.customerPO = JSONData[i].customerPO;
            } else {
                CWObject.customerPO = '';
            }

            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id) {
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                } else {
                    CWObject.agreement.id = '';
                }
                if (JSONData[i].agreement.name) {
                    CWObject.agreement.name = JSONData[i].agreement.name;
                } else {
                    CWObject.agreement.name = '';
                }
            }

            //new fields 1/11/2021
            if (JSONData[i].billingSiteAddressLine1) {
                CWObject.billingSiteAddressLine1 = JSONData[i].billingSiteAddressLine1;
            } else {
                CWObject.billingSiteAddressLine1 = '';
            }

            if (JSONData[i].billingSiteAddressLine2) {
                CWObject.billingSiteAddressLine2 = JSONData[i].billingSiteAddressLine2;
            } else {
                CWObject.billingSiteAddressLine2 = '';
            }

            if (JSONData[i].billingSiteCity) {
                CWObject.billingSiteCity = JSONData[i].billingSiteCity;
            } else {
                CWObject.billingSiteCity = '';
            }

            if (JSONData[i].billingSiteState) {
                CWObject.billingSiteState = JSONData[i].billingSiteState;
            } else {
                CWObject.billingSiteState = '';
            }

            if (JSONData[i].billingSiteZip) {
                CWObject.billingSiteZip = JSONData[i].billingSiteZip;
            } else {
                CWObject.billingSiteZip = '';
            }

            if (JSONData[i].billingSiteCountry) {
                CWObject.billingSiteCountry = JSONData[i].billingSiteCountry;
            } else {
                CWObject.billingSiteCountry = '';
            }

            if (JSONData[i].shippingSiteAddressLine1) {
                CWObject.shippingSiteAddressLine1 = JSONData[i].shippingSiteAddressLine1;
            } else {
                CWObject.shippingSiteAddressLine1 = '';
            }

            if (JSONData[i].shippingSiteAddressLine2) {
                CWObject.shippingSiteAddressLine2 = JSONData[i].shippingSiteAddressLine2;
            } else {
                CWObject.shippingSiteAddressLine2 = '';
            }

            if (JSONData[i].shippingSiteCity) {
                CWObject.shippingSiteCity = JSONData[i].shippingSiteCity;
            } else {
                CWObject.shippingSiteCity = '';
            }

            if (JSONData[i].shippingSiteState) {
                CWObject.shippingSiteState = JSONData[i].shippingSiteState;
            } else {
                CWObject.shippingSiteState = '';
            }

            if (JSONData[i].shippingSiteZip) {
                CWObject.shippingSiteZip = JSONData[i].shippingSiteZip;
            } else {
                CWObject.shippingSiteZip = '';
            }

            if (JSONData[i].shippingSiteCountry) {
                CWObject.shippingSiteCountry = JSONData[i].shippingSiteCountry;
            } else {
                CWObject.shippingSiteCountry = '';
            }

            if (JSONData[i].shipToAttention) {
                CWObject.shipToAttention = JSONData[i].shipToAttention;
            } else {
                CWObject.shipToAttention = '';
            }

            //new fields 7/24/2021
            if (JSONData[i].taxCode) {
                if (JSONData[i].taxCode.id) {
                    CWObject.taxCode.id = JSONData[i].taxCode.id.toFixed(0);
                } else {
                    CWObject.taxCode.id = '';
                }
                if (JSONData[i].taxCode.name) {
                    CWObject.taxCode.name = JSONData[i].taxCode.name;
                } else {
                    CWObject.taxCode.name = '';
                }
            }

            //new fields 9/24/2021
            if (JSONData[i].accountNumber) {
                CWObject.accountNumber = JSONData[i].accountNumber;
            } else {
                CWObject.accountNumber = '';
            }

            if (JSONData[i].shipToAttention) {
                CWObject.shipToAttention = JSONData[i].shipToAttention;
            } else {
                CWObject.shipToAttention = '';
            }

            if (JSONData[i].templateSetupId) {
                CWObject.templateSetupId = JSONData[i].templateSetupId;
            } else {
                CWObject.templateSetupId = '';
            }

            if (JSONData[i].invoiceTemplate) {
                if (JSONData[i].invoiceTemplate.id) {
                    CWObject.invoiceTemplate.id = JSONData[i].invoiceTemplate.id.toFixed(0);
                } else {
                    CWObject.invoiceTemplate.id = '';
                }
                if (JSONData[i].invoiceTemplate.name) {
                    CWObject.invoiceTemplate.name = JSONData[i].invoiceTemplate.name;
                } else {
                    CWObject.invoiceTemplate.name = '';
                }
            }

            if (JSONData[i].emailTemplateId) {
                CWObject.emailTemplateId = JSONData[i].emailTemplateId;
            } else {
                CWObject.emailTemplateId = '';
            }

            if (JSONData[i].addToBatchEmailList == true) {
                CWObject.addToBatchEmailList = 'T';
            } else {
                CWObject.addToBatchEmailList = 'F';
            }

            if (JSONData[i].restrictDownpaymentFlag == true) {
                CWObject.restrictDownpaymentFlag = 'T';
            } else {
                CWObject.restrictDownpaymentFlag = 'F';
            }

            if (JSONData[i].taxableFlag == true) {
                CWObject.taxableFlag = 'T';
            } else {
                CWObject.taxableFlag = 'F';
            }

            if (JSONData[i].downpaymentPreviouslyTaxedFlag == true) {
                CWObject.downpaymentPreviouslyTaxedFlag = 'T';
            } else {
                CWObject.downpaymentPreviouslyTaxedFlag = 'F';
            }

            if (JSONData[i].overrideDownPaymentAmountFlag == true) {
                CWObject.overrideDownPaymentAmountFlag = 'T';
            } else {
                CWObject.overrideDownPaymentAmountFlag = 'F';
            }

            if (JSONData[i].adjustmentReason) {
                CWObject.adjustmentReason = JSONData[i].adjustmentReason;
            } else {
                CWObject.adjustmentReason = '';
            }

            if (JSONData[i].adjustedBy) {
                CWObject.adjustedBy = JSONData[i].adjustedBy;
            } else {
                CWObject.adjustedBy = '';
            }

            if (JSONData[i].specialInvoiceFlag == true) {
                CWObject.specialInvoiceFlag = 'T';
            } else {
                CWObject.specialInvoiceFlag = 'F';
            }

            if (JSONData[i].billingSetupReference) {
                if (JSONData[i].billingSetupReference.id) {
                    CWObject.billingSetupReference.id = JSONData[i].billingSetupReference.id.toFixed(0);
                } else {
                    CWObject.billingSetupReference.id = '';
                }
                if (JSONData[i].billingSetupReference.name) {
                    CWObject.billingSetupReference.name = JSONData[i].billingSetupReference.name;
                } else {
                    CWObject.billingSetupReference.name = '';
                }
            }

            if (JSONData[i].ticket) {
                if (JSONData[i].ticket.id) {
                    CWObject.ticket.id = JSONData[i].ticket.id.toFixed(0);
                } else {
                    CWObject.ticket.id = '';
                }
                if (JSONData[i].ticket.summary) {
                    CWObject.ticket.summary = JSONData[i].ticket.summary;
                } else {
                    CWObject.ticket.summary = '';
                }
            }

            if (JSONData[i].project) {
                if (JSONData[i].project.id) {
                    CWObject.project.id = JSONData[i].project.id.toFixed(0);
                } else {
                    CWObject.project.id = '';
                }
                if (JSONData[i].project.name) {
                    CWObject.project.name = JSONData[i].project.name;
                } else {
                    CWObject.project.name = '';
                }
            }

            if (JSONData[i].phase) {
                if (JSONData[i].phase.id) {
                    CWObject.phase.id = JSONData[i].phase.id.toFixed(0);
                } else {
                    CWObject.phase.id = '';
                }
                if (JSONData[i].phase.name) {
                    CWObject.phase.name = JSONData[i].phase.name;
                } else {
                    CWObject.phase.name = '';
                }
            }

            if (JSONData[i].salesOrder) {
                if (JSONData[i].salesOrder.id) {
                    CWObject.salesOrder.id = JSONData[i].salesOrder.id.toFixed(0);
                } else {
                    CWObject.salesOrder.id = '';
                }
                if (JSONData[i].salesOrder.identifier) {
                    CWObject.salesOrder.identifier = JSONData[i].salesOrder.identifier;
                } else {
                    CWObject.salesOrder.identifier = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Invoice ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getInvoiceLineItem(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator, additionalHeaderParam, paginationId) {
    var JSONDataArray = [];

    var JSONData = getJSONData(INVITEM_REQ_STRING, getPageCount(INVITEM_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator, additionalHeaderParam, paginationId); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWInvoiceLineItem();

            CWObject.id = JSONData[i].id.toFixed(0);

            if (JSONData[i].catalogItem) {
                if (JSONData[i].catalogItem.identifier)
                    CWObject.name = JSONData[i].catalogItem.identifier;

                if (JSONData[i].catalogItem.id) {
                    CWObject.catalogItem.id = JSONData[i].catalogItem.id.toFixed(0);
                }
            }

            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].quantity) {
                CWObject.quantity = JSONData[i].quantity;
            } else {
                CWObject.quantity = 0;
            }

            if (JSONData[i].price) {
                CWObject.price = JSONData[i].price;
            } else {
                CWObject.price = 0;
            }

            if (JSONData[i].cost) {
                CWObject.cost = JSONData[i].cost;
            } else {
                CWObject.cost = 0;
            }


            if (JSONData[i].billableOption != null) {
                CWObject.billableOption = JSONData[i].billableOption;
            } else {
                CWObject.billableOption = '';
            }

            if (JSONData[i].locationId != null) {
                CWObject.locationId = JSONData[i].locationId.toFixed(0);
            } else {
                CWObject.locationId = '';
            }
            if (JSONData[i].businessUnitId != null) {
                CWObject.businessUnitId = JSONData[i].businessUnitId.toFixed(0);
            } else {
                CWObject.businessUnitId = '';
            }

            if (JSONData[i].taxableFlag == true) {
                CWObject.taxableFlag = 'T';
            } else {
                CWObject.taxableFlag = 'F';
            }
            if (JSONData[i].dropshipFlag == true) {
                CWObject.dropshipFlag = 'T';
            } else {
                CWObject.dropshipFlag = 'F';
            }
            if (JSONData[i].specialOrderFlag == true) {
                CWObject.specialOrderFlag = 'T';
            } else {
                CWObject.specialOrderFlag = 'F';
            }

            CWObject.customerDescription = JSONData[i].customerDescription;

            if (JSONData[i].warehouseId != null) {
                CWObject.warehouseId = JSONData[i].warehouseId.toFixed(0);
            } else {
                CWObject.warehouseId = '';
            }
            if (JSONData[i].warehouseBinId != null) {
                CWObject.warehouseBinId = JSONData[i].warehouseBinId.toFixed(0);
            } else {
                CWObject.warehouseBinId = '';
            }

            if (JSONData[i].listPrice) {
                CWObject.listPrice = JSONData[i].listPrice;
            } else {
                CWObject.listPrice = 0;
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                } else {
                    CWObject.company.id = '';
                }
                if (JSONData[i].company.name) {
                    CWObject.company.name = JSONData[i].company.name;
                } else {
                    CWObject.company.name = '';
                }
            }

            if (JSONData[i].productClass) {
                CWObject.productClass = JSONData[i].productClass;
            } else {
                CWObject.productClass = '';
            }

            if (JSONData[i].invoice) {
                if (JSONData[i].invoice.id) {
                    CWObject.invoiceId = JSONData[i].invoice.id.toFixed(0);
                } else {
                    CWObject.invoiceId = '';
                }
                if (JSONData[i].invoice.identifier) {
                    CWObject.invoice.identifier = JSONData[i].invoice.identifier;
                } else {
                    CWObject.invoice.identifier = '';
                }
            } else {
                CWObject.invoiceId = '';
                CWObject.invoice.identifier = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Inv Line Item ID: ' + i, stringErr);
            }

            //new fields 12/17/2020
            if (JSONData[i].discount) {
                CWObject.discount = JSONData[i].discount;
            } else {
                CWObject.discount = 0;
            }

            if (JSONData[i].sequenceNumber) {
                CWObject.sequenceNumber = JSONData[i].sequenceNumber;
            } else {
                CWObject.sequenceNumber = '';
            }

            if (JSONData[i].agreementAmount) {
                CWObject.agreementAmount = JSONData[i].agreementAmount;
            } else {
                CWObject.agreementAmount = 0;
            }

            if (JSONData[i].priceMethod) {
                CWObject.priceMethod = JSONData[i].priceMethod;
            } else {
                CWObject.priceMethod = '';
            }

            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id) {
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                } else {
                    CWObject.agreement.id = '';
                }
                if (JSONData[i].agreement.name) {
                    CWObject.agreement.name = JSONData[i].agreement.name;
                } else {
                    CWObject.agreement.name = '';
                }
            }

            if (JSONData[i].vendorSku) {
                CWObject.vendorSku = JSONData[i].vendorSku;
            } else {
                CWObject.vendorSku = '';
            }

            if (JSONData[i].phaseProductFlag) {
                if (JSONData[i].phaseProductFlag == true) {
                    CWObject.phaseProductFlag = 'T';
                } else {
                    CWObject.phaseProductFlag = 'F';
                }
            }

            if (JSONData[i].cancelledFlag) {
                if (JSONData[i].cancelledFlag == true) {
                    CWObject.cancelledFlag = 'T';
                } else {
                    CWObject.cancelledFlag = 'F';
                }
            }

            if (JSONData[i].quantityCancelled) {
                CWObject.quantityCancelled = JSONData[i].quantityCancelled;
            } else {
                CWObject.quantityCancelled = 0;
            }

            if (JSONData[i].cancelledReason) {
                CWObject.cancelledReason = JSONData[i].cancelledReason;
            } else {
                CWObject.cancelledReason = '';
            }

            if (JSONData[i].productSuppliedFlag) {
                if (JSONData[i].productSuppliedFlag == true) {
                    CWObject.productSuppliedFlag = 'T';
                } else {
                    CWObject.productSuppliedFlag = 'F';
                }
            }

            if (JSONData[i].subContractorAmountLimit) {
                CWObject.subContractorAmountLimit = JSONData[i].subContractorAmountLimit;
            } else {
                CWObject.subContractorAmountLimit = 0;
            }

            if (JSONData[i].salesOrder) {
                if (JSONData[i].salesOrder.id) {
                    CWObject.salesOrder.id = JSONData[i].salesOrder.id.toFixed(0);
                } else {
                    CWObject.salesOrder.id = '';
                }
                if (JSONData[i].salesOrder.identifier) {
                    CWObject.salesOrder.identifier = JSONData[i].salesOrder.identifier;
                } else {
                    CWObject.salesOrder.identifier = '';
                }
            }

            if (JSONData[i].opportunity) {
                if (JSONData[i].opportunity.id) {
                    CWObject.opportunity.id = JSONData[i].opportunity.id.toFixed(0);
                } else {
                    CWObject.opportunity.id = '';
                }
                if (JSONData[i].opportunity.name) {
                    CWObject.opportunity.name = JSONData[i].opportunity.name;
                } else {
                    CWObject.opportunity.name = '';
                }
            }

            if (JSONData[i].calculatedPriceFlag) {
                if (JSONData[i].calculatedPriceFlag == true) {
                    CWObject.calculatedPriceFlag = 'T';
                } else {
                    CWObject.calculatedPriceFlag = 'F';
                }
            }

            if (JSONData[i].calculatedCostFlag) {
                if (JSONData[i].calculatedCostFlag == true) {
                    CWObject.calculatedCostFlag = 'T';
                } else {
                    CWObject.calculatedCostFlag = 'F';
                }
            }

            if (JSONData[i].forecastDetailId) {
                CWObject.forecastDetailId = JSONData[i].forecastDetailId;
            } else {
                CWObject.forecastDetailId = '';
            }

            if (JSONData[i].warehouse) {
                CWObject.warehouse = JSONData[i].warehouse;
            } else {
                CWObject.warehouse = '';
            }

            if (JSONData[i].warehouseBin) {
                CWObject.warehouseBin = JSONData[i].warehouseBin;
            } else {
                CWObject.warehouseBin = '';
            }

            if (JSONData[i].forecastStatus) {
                if (JSONData[i].forecastStatus.id) {
                    CWObject.forecastStatus.id = JSONData[i].forecastStatus.id.toFixed(0);
                } else {
                    CWObject.forecastStatus.id = '';
                }
                if (JSONData[i].forecastStatus.name) {
                    CWObject.forecastStatus.name = JSONData[i].forecastStatus.name;
                } else {
                    CWObject.forecastStatus.name = '';
                }
            }

            if (JSONData[i].needToPurchaseFlag) {
                if (JSONData[i].needToPurchaseFlag == true) {
                    CWObject.needToPurchaseFlag = 'T';
                } else {
                    CWObject.needToPurchaseFlag = 'F';
                }
            }

            if (JSONData[i].minimumStockFlag) {
                if (JSONData[i].minimumStockFlag == true) {
                    CWObject.minimumStockFlag = 'T';
                } else {
                    CWObject.minimumStockFlag = 'F';
                }
            }

            if (JSONData[i].calculatedPrice) {
                CWObject.calculatedPrice = JSONData[i].calculatedPrice;
            } else {
                CWObject.calculatedPrice = 0;
            }

            if (JSONData[i].calculatedCost) {
                CWObject.calculatedCost = JSONData[i].calculatedCost;
            } else {
                CWObject.calculatedCost = 0;
            }
            CWObject.paginationid = JSONData.paginationid; //added 8/26/2022 forward-navigation pagination
            //nlapiLogExecution('AUDIT', 'Pagination ID on Data Models: ' + JSONData.paginationid);
            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getExpense(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator, additionalHeaderParam, paginationId) {
    var JSONDataArray = [];

    var JSONData = getJSONData(EXPENSE_REQ_STRING, getPageCount(EXPENSE_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator, additionalHeaderParam, paginationId); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWExpense();

            CWObject.id = JSONData[i].id.toFixed(0);
            if (JSONData[i].expenseReport) {
                if (JSONData[i].expenseReport.id) {
                    CWObject.expenseReport.id = JSONData[i].expenseReport.id.toFixed(0);
                } else {
                    CWObject.expenseReport.id = '';
                }
                if (JSONData[i].expenseReport.name) {
                    CWObject.expenseReport.name = JSONData[i].expenseReport.name;
                } else {
                    CWObject.expenseReport.name = '';
                }
                if (JSONData[i].expenseReport.expenseReport_href)
                    CWObject.expenseReport.expenseReport_href = JSONData[i].expenseReport.expenseReport_href;
            }
            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                }
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].chargeToId) {
                CWObject.chargeToId = JSONData[i].chargeToId.toFixed(0);
            } else {
                CWObject.chargeToId = '';
            }

            if (JSONData[i].chargeToType) {
                CWObject.chargeToType = JSONData[i].chargeToType;
            } else {
                CWObject.chargeToType = '';
            }

            if (JSONData[i].type) {
                if (JSONData[i].type.id)
                    CWObject.type.id = JSONData[i].type.id.toFixed(0);
                if (JSONData[i].type.name)
                    CWObject.type.name = JSONData[i].type.name;
            }

            if (JSONData[i].member) {
                if (JSONData[i].member.id)
                    CWObject.member.id = JSONData[i].member.id.toFixed(0);
                if (JSONData[i].member.name)
                    CWObject.member.name = JSONData[i].member.name;
            }

            if (JSONData[i].paymentMethod) {
                if (JSONData[i].paymentMethod.id)
                    CWObject.paymentMethod.id = JSONData[i].paymentMethod.id.toFixed(0);
                if (JSONData[i].paymentMethod.name)
                    CWObject.paymentMethod.name = JSONData[i].paymentMethod.name;
            }

            if (JSONData[i].classification) {
                if (JSONData[i].classification.id)
                    CWObject.classification.id = JSONData[i].classification.id.toFixed(0);
                if (JSONData[i].classification.name)
                    CWObject.classification.name = JSONData[i].classification.name;
            }

            if (JSONData[i].amount) {
                CWObject.amount = JSONData[i].amount;
            } else {
                CWObject.amount = 0;
            }

            CWObject.billableOption = JSONData[i].billableOption;
            if (JSONData[i].locationId)
                CWObject.locationId = JSONData[i].locationId.toFixed(0);
            if (JSONData[i].businessUnitId)
                CWObject.businessUnitId = JSONData[i].businessUnitId.toFixed(0);

            if (JSONData[i].notes) {
                CWObject.notes = JSONData[i].notes;
            } else {
                CWObject.notes = '';
            }

            CWObject.invoiceAmount = JSONData[i].invoiceAmount;
            CWObject.currency = JSONData[i].currency;
            CWObject.status = JSONData[i].status;
            CWObject.billAmount = JSONData[i].billAmount;

            if (JSONData[i].invoice) {
                if (JSONData[i].invoice.id) {
                    CWObject.invoiceId = JSONData[i].invoice.id.toFixed(0);
                } else {
                    CWObject.invoiceId = '';
                }
                if (JSONData[i].invoice.identifier) {
                    CWObject.invoice.identifier = JSONData[i].invoice.identifier;
                } else {
                    CWObject.invoice.identifier = '';
                }
            } else {
                CWObject.invoiceId = '';
                CWObject.invoice.identifier = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Expense ID: ' + i, stringErr);
            }

            //new fields 12/17/2020
            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id) {
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                }
                if (JSONData[i].agreement.name)
                    CWObject.agreement.name = JSONData[i].agreement.name;
            }

            if (JSONData[i].date) {
                CWObject.date = convertJSONStringToDate(JSONData[i].date);
            } else {
                CWObject.date = '';
            }

            if (JSONData[i].ticket) {
                if (JSONData[i].ticket.id) {
                    CWObject.ticket.id = JSONData[i].ticket.id.toFixed(0);
                } else {
                    CWObject.ticket.id = '';
                }
                if (JSONData[i].ticket.summary) {
                    CWObject.ticket.summary = JSONData[i].ticket.summary;
                } else {
                    CWObject.ticket.summary = '';
                }
                if (JSONData[i].ticket._info != null) {
                    if (JSONData[i].ticket._info.billingMethod) {
                        CWObject.ticket.billingMethod = JSONData[i].ticket._info.billingMethod;
                    } else {
                        CWObject.ticket.billingMethod = '';
                    }
                } else {
                    CWObject.ticket.billingMethod = '';
                }
            } else {
                CWObject.ticket.id = '';
                CWObject.ticket.summary = '';
                CWObject.ticket.billingMethod = '';
            }

            if (JSONData[i].project) {
                if (JSONData[i].project.id) {
                    CWObject.project.id = JSONData[i].project.id.toFixed(0);
                } else {
                    CWObject.project.id = '';
                }
                if (JSONData[i].project.name) {
                    CWObject.project.name = JSONData[i].project.name
                } else {
                    CWObject.project.name = '';
                }
                if (JSONData[i].project._info) {
                    if (JSONData[i].project._info.billingMethod) {
                        CWObject.project.billingMethod = JSONData[i].project._info.billingMethod;
                    } else {
                        CWObject.project.billingMethod = '';
                    }
                } else {
                    CWObject.project.billingMethod = '';
                }
            } else {
                CWObject.project.name = '';
                CWObject.project.billingMethod = '';
            }

            if (JSONData[i].phase) {
                if (JSONData[i].phase.id) {
                    CWObject.phase.id = JSONData[i].phase.id.toFixed(0);
                } else {
                    CWObject.phase.id = '';
                }
                if (JSONData[i].phase.name) {
                    CWObject.phase.name = JSONData[i].phase.name;
                } else {
                    CWObject.phase.name = '';
                }
                if (JSONData[i].phase._info) {
                    if (JSONData[i].phase._info.billingMethod) {
                        CWObject.phase.billingMethod = JSONData[i].phase._info.billingMethod;
                    } else {
                        CWObject.phase.billingMethod = '';
                    }
                } else {
                    CWObject.phase.billingMethod = '';
                }
            } else {
                CWObject.phase.name = '';
                CWObject.phase.billingMethod = '';
            }

            if (JSONData[i].agreementAmount) {
                CWObject.agreementAmount = JSONData[i].agreementAmount;
            } else {
                CWObject.agreementAmount = 0;
            }
            CWObject.paginationid = JSONData.paginationid; //added 8/26/2022 forward-navigation pagination
            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getExpenseType(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(EXPENSETYPE_REQ_STRING, getPageCount(EXPENSETYPE_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWExpenseType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            CWObject.amountCaption = JSONData[i].amountCaption;

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Expense Type ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getTimeEntry(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator, additionalHeaderParam, paginationId) {
    var JSONDataArray = [];

    var JSONData = getJSONData(TIME_REQ_STRING, getPageCount(TIME_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator, additionalHeaderParam, paginationId); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWTimeEntry();

            CWObject.id = JSONData[i].id.toFixed(0);

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                }
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }
            if (JSONData[i].chargeToId)
                CWObject.chargeToId = JSONData[i].chargeToId.toFixed(0);

            CWObject.chargeToType = JSONData[i].chargeToType;

            if (JSONData[i].member) {
                if (JSONData[i].member.id)
                    CWObject.member.id = JSONData[i].member.id.toFixed(0);
                if (JSONData[i].member.name)
                    CWObject.member.name = JSONData[i].member.name;
            }

            if (JSONData[i].locationId)
                CWObject.locationId = JSONData[i].locationId.toFixed(0);

            if (JSONData[i].businessUnitId)
                CWObject.businessUnitId = JSONData[i].businessUnitId.toFixed(0);

            if (JSONData[i].workType) {
                if (JSONData[i].workType.id)
                    CWObject.workType.id = JSONData[i].workType.id.toFixed(0);
                if (JSONData[i].workType.name)
                    CWObject.workType.name = JSONData[i].workType.name;
            }

            if (JSONData[i].workRole) {
                if (JSONData[i].workRole.id)
                    CWObject.workRole.id = JSONData[i].workRole.id.toFixed(0);
                if (JSONData[i].workRole.name)
                    CWObject.workRole.name = JSONData[i].workRole.name;
            }

            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id) {
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                }
                if (JSONData[i].agreement.name)
                    CWObject.agreement.name = JSONData[i].agreement.name;
            }

            if (JSONData[i].timeStart) {
                CWObject.timeStart = JSONData[i].timeStart;
            } else {
                CWObject.timeStart = '';
            }

            if (JSONData[i].timeEnd) {
                CWObject.timeEnd = JSONData[i].timeEnd;
            } else {
                CWObject.timeEnd = '';
            }

            CWObject.actualHours = JSONData[i].actualHours;


            CWObject.billableOption = JSONData[i].billableOption;

            if (JSONData[i].notes) {
                CWObject.notes = JSONData[i].notes;
            } else {
                CWObject.notes = '';
            }

            CWObject.hoursBilled = JSONData[i].hoursBilled;
            CWObject.hourlyRate = JSONData[i].hourlyRate;
            CWObject.status = JSONData[i].status;

            if (JSONData[i].invoice) {
                if (JSONData[i].invoice.id) {
                    CWObject.invoiceId = JSONData[i].invoice.id.toFixed(0);
                } else {
                    CWObject.invoiceId = '';
                }
                if (JSONData[i].invoice.identifier) {
                    CWObject.invoice.identifier = JSONData[i].invoice.identifier;
                } else {
                    CWObject.invoice.identifier = '';
                }
            } else {
                CWObject.invoiceId = '';
                CWObject.invoice.identifier = '';
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            //new fields 11/29/2020

            if (JSONData[i].internalNotes) {
                CWObject.internalNotes = JSONData[i].internalNotes;
            } else {
                CWObject.internalNotes = '';
            }

            if (JSONData[i].hoursDeduct) {
                CWObject.hoursDeduct = JSONData[i].hoursDeduct;
            } else {
                CWObject.hoursDeduct = 0;
            }

            if (JSONData[i].overageRate) {
                CWObject.overageRate = JSONData[i].overageRate;
            } else {
                CWObject.overageRate = 0;
            }

            if (JSONData[i].agreementHours) {
                CWObject.agreementHours = JSONData[i].agreementHours;
            } else {
                CWObject.agreementHours = 0;
            }

            if (JSONData[i].agreementAmount) {
                CWObject.agreementAmount = JSONData[i].agreementAmount;
            } else {
                CWObject.agreementAmount = 0;
            }

            if (JSONData[i].ticket) {
                if (JSONData[i].ticket.id) {
                    CWObject.ticket.id = JSONData[i].ticket.id.toFixed(0);
                } else {
                    CWObject.ticket.id = '';
                }
                if (JSONData[i].ticket.summary) {
                    CWObject.ticket.summary = JSONData[i].ticket.summary;
                } else {
                    CWObject.ticket.summary = '';
                }
            }

            if (JSONData[i].timeSheet) {
                if (JSONData[i].timeSheet.id) {
                    CWObject.timeSheet.id = JSONData[i].timeSheet.id.toFixed(0);
                } else {
                    CWObject.timeSheet.id = '';
                }
                if (JSONData[i].timeSheet.name) {
                    CWObject.timeSheet.name = JSONData[i].timeSheet.name;
                } else {
                    CWObject.timeSheet.name = '';
                }
            }

            if (JSONData[i].project) {
                if (JSONData[i].project.id) {
                    CWObject.project.id = JSONData[i].project.id.toFixed(0);
                } else {
                    CWObject.project.id = '';
                }
                if (JSONData[i].project.name) {
                    CWObject.project.name = JSONData[i].project.name;
                } else {
                    CWObject.project.name = '';
                }
            }

            if (JSONData[i].phase) {
                if (JSONData[i].phase.id) {
                    CWObject.phase.id = JSONData[i].phase.id.toFixed(0);
                } else {
                    CWObject.phase.id = '';
                }
                if (JSONData[i].phase.name) {
                    CWObject.phase.name = JSONData[i].phase.name;
                } else {
                    CWObject.phase.name = '';
                }
            }

            if (JSONData[i].invoiceHours) {
                CWObject.invoiceHours = JSONData[i].invoiceHours;
            } else {
                CWObject.invoiceHours = 0;
            }

            if (JSONData[i].dateEntered) {
                CWObject.dateEntered = JSONData[i].dateEntered;
            } else {
                CWObject.dateEntered = '';
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Time ID: ' + i, stringErr);
            }
            CWObject.paginationid = JSONData.paginationid; //added 8/26/2022 forward-navigation pagination
            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getProject(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(PROJECT_REQ_STRING, getPageCount(PROJECT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWProject();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i].actualEnd) {
                CWObject.actualEnd = convertJSONStringToDate(JSONData[i].actualEnd);
            }

            if (JSONData[i].actualHours) {
                CWObject.actualHours = JSONData[i].actualHours;
            } else {
                JSONData[i].actualHours = 0;
            }

            if (JSONData[i].actualStart) {
                CWObject.actualStart = convertJSONStringToDate(JSONData[i].actualStart);
            }

            CWObject.billExpenses = JSONData[i].billExpenses;
            CWObject.billingAmount = JSONData[i].billingAmount;
            CWObject.billingAttention = JSONData[i].billingAttention;
            CWObject.billingMethod = JSONData[i].billingMethod;
            CWObject.billingRateType = JSONData[i].billingRateType;
            CWObject.billProducts = JSONData[i].billProducts;

            if (JSONData[i].billProjectAfterClosedFlag == true) {
                CWObject.billProjectAfterClosedFlag = 'T';
            } else {
                CWObject.billProjectAfterClosedFlag = 'F';
            }

            CWObject.billTime = JSONData[i].billTime;

            if (JSONData[i].billUnapprovedTimeAndExpense == true) {
                CWObject.billUnapprovedTimeAndExpense = 'T';
            } else {
                CWObject.billUnapprovedTimeAndExpense = 'F';
            }

            if (JSONData[i].board) {
                if (JSONData[i].board.id)
                    CWObject.board.id = JSONData[i].board.id.toFixed(0);
                if (JSONData[i].board.name)
                    CWObject.board.name = JSONData[i].board.name;
            }

            CWObject.budgetAnalysis = JSONData[i].budgetAnalysis;

            if (JSONData[i].budgetFlag == true) {
                CWObject.budgetFlag = 'T';
            } else {
                CWObject.budgetFlag = 'F';
            }

            if (JSONData[i].budgetHours) {
                CWObject.budgetHours = JSONData[i].budgetHours;
            } else {
                JSONData[i].budgetHours = '0.0';
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                }
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].contact) {
                if (JSONData[i].contact.id) {
                    CWObject.contact.id = JSONData[i].contact.id.toFixed(0);
                }
                if (JSONData[i].contact.name)
                    CWObject.contact.name = JSONData[i].contact.name;
            }
            if (JSONData[i].customerPO) {
                CWObject.customerPO = JSONData[i].customerPO;
            } else {
                CWObject.customerPO = '';
            }
            CWObject.description = JSONData[i].description;

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            CWObject.downpayment = JSONData[i].downpayment;

            if (JSONData[i].estimatedEnd) {
                CWObject.estimatedEnd = convertJSONStringToDate(JSONData[i].estimatedEnd);
            }

            CWObject.estimatedExpenseRevenue = JSONData[i].estimatedExpenseRevenue;
            CWObject.estimatedHours = JSONData[i].estimatedHours;
            CWObject.estimatedProductRevenue = JSONData[i].estimatedProductRevenue;

            if (JSONData[i].estimatedStart) {
                CWObject.estimatedStart = convertJSONStringToDate(JSONData[i].estimatedStart);
            }

            CWObject.estimatedTimeRevenue = JSONData[i].estimatedTimeRevenue;

            if (JSONData[i].includeDependenciesFlag == true) {
                CWObject.includeDependenciesFlag = 'T';
            } else {
                CWObject.includeDependenciesFlag = 'F';
            }

            if (JSONData[i].includeEstimatesFlag == true) {
                CWObject.includeEstimatesFlag = 'T';
            } else {
                CWObject.includeEstimatesFlag = 'F';
            }

            if (JSONData[i].department) {
                if (JSONData[i].department.id)
                    CWObject.department.id = JSONData[i].department.id.toFixed(0);
                if (JSONData[i].department.name)
                    CWObject.department.name = JSONData[i].department.name;
            }

            if (JSONData[i].manager) {
                if (JSONData[i].manager.id)
                    CWObject.manager.id = JSONData[i].manager.id.toFixed(0);
                if (JSONData[i].manager.name)
                    CWObject.manager.name = JSONData[i].manager.name;
            }

            if (JSONData[i].restrictDownpaymentFlag == true) {
                CWObject.restrictDownpaymentFlag = 'T';
            } else {
                CWObject.restrictDownpaymentFlag = 'F';
            }

            if (JSONData[i].scheduledEnd) {
                CWObject.scheduledEnd = convertJSONStringToDate(JSONData[i].scheduledEnd);
            }

            CWObject.scheduledHours = JSONData[i].scheduledHours;

            if (JSONData[i].scheduledStart) {
                CWObject.scheduledStart = convertJSONStringToDate(JSONData[i].scheduledStart);
            }


            if (JSONData[i].shipToCompany) {
                if (JSONData[i].shipToCompany.id) {
                    CWObject.shipToCompany.id = JSONData[i].shipToCompany.id.toFixed(0);
                }
                if (JSONData[i].shipToCompany.name)
                    CWObject.shipToCompany.name = JSONData[i].shipToCompany.name;
            }

            if (JSONData[i].shipToSite) {
                if (JSONData[i].shipToSite.id)
                    CWObject.shipToSite.id = JSONData[i].shipToSite.id.toFixed(0);
                if (JSONData[i].shipToSite.name)
                    CWObject.shipToSite.name = JSONData[i].shipToSite.name;
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id)
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                if (JSONData[i].site.name)
                    CWObject.site.name = JSONData[i].site.name;
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id)
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                if (JSONData[i].status.name)
                    CWObject.status.name = JSONData[i].status.name;
            }

            if (JSONData[i].type) {
                if (JSONData[i].type.id)
                    CWObject.type.id = JSONData[i].type.id.toFixed(0);
                if (JSONData[i].type.name)
                    CWObject.type.name = JSONData[i].type.name;
            }

            CWObject.estimatedTimeCost = JSONData[i].estimatedTimeCost;
            CWObject.estimatedExpenseCost = JSONData[i].estimatedExpenseCost;
            CWObject.estimatedProductCost = JSONData[i].estimatedProductCost;

            if (JSONData[i].companyLocation) {
                if (JSONData[i].companyLocation.id)
                    CWObject.companyLocation.id = JSONData[i].companyLocation.id.toFixed(0);
                if (JSONData[i].companyLocation.name)
                    CWObject.companyLocation.name = JSONData[i].companyLocation.name;
            }
            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Project ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getAgreement(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(AGREEMENT_REQ_STRING, getPageCount(AGREEMENT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWAgreement();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i].type) {
                if (JSONData[i].type.id)
                    CWObject.type.id = JSONData[i].type.id.toFixed(0);
                if (JSONData[i].type.name)
                    CWObject.type.name = JSONData[i].type.name;
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                }
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].contact) {
                if (JSONData[i].contact.id) {
                    CWObject.contact.id = JSONData[i].contact.id.toFixed(0);
                }
                if (JSONData[i].contact.name)
                    CWObject.contact.name = JSONData[i].contact.name;
            }

            if (JSONData[i].customerPO) {
                CWObject.customerPO = JSONData[i].customerPO;
            } else {
                CWObject.customerPO = '';
            }

            if (JSONData[i].location) {
                if (JSONData[i].location.id)
                    CWObject.location.id = JSONData[i].location.id.toFixed(0);
                if (JSONData[i].location.name)
                    CWObject.location.name = JSONData[i].location.name;
            }

            if (JSONData[i].department) {
                if (JSONData[i].department.id)
                    CWObject.department.id = JSONData[i].department.id.toFixed(0);
                if (JSONData[i].department.name)
                    CWObject.department.name = JSONData[i].department.name;
            }

            if (JSONData[i].restrictLocationFlag == true) {
                CWObject.restrictLocationFlag = 'T';
            } else {
                CWObject.restrictLocationFlag = 'F';
            }

            if (JSONData[i].restrictDepartmentFlag == true) {
                CWObject.restrictDepartmentFlag = 'T';
            } else {
                CWObject.restrictDepartmentFlag = 'F';
            }

            if (JSONData[i].startDate) {
                CWObject.startDate = convertJSONStringToDate(JSONData[i].startDate);
            }

            if (JSONData[i].noEndingDateFlag == true) {
                CWObject.noEndingDateFlag = 'T';
            } else {
                CWObject.noEndingDateFlag = 'F';
            }

            if (JSONData[i].cancelledFlag == true) {
                CWObject.cancelledFlag = 'T';
            } else {
                CWObject.cancelledFlag = 'F';
            }

            if (JSONData[i].reasonCancelled) {
                CWObject.reasonCancelled = JSONData[i].reasonCancelled;
            } else {
                CWObject.reasonCancelled = '';
            }

            if (JSONData[i].workOrder) {
                CWObject.workOrder = JSONData[i].workOrder;
            } else {
                CWObject.workOrder = '';
            }

            if (JSONData[i].internalNotes) {
                CWObject.internalNotes = JSONData[i].internalNotes;
            } else {
                CWObject.internalNotes = '';
            }

            CWObject.applicationUnits = JSONData[i].applicationUnits;
            CWObject.applicationLimit = JSONData[i].applicationLimit;

            if (JSONData[i].applicationUnlimitedFlag == true) {
                CWObject.applicationUnlimitedFlag = 'T';
            } else {
                CWObject.applicationUnlimitedFlag = 'F';
            }

            if (JSONData[i].oneTimeFlag == true) {
                CWObject.oneTimeFlag = 'T';
            } else {
                CWObject.oneTimeFlag = 'F';
            }

            if (JSONData[i].coverAgreementTime == true) {
                CWObject.coverAgreementTime = 'T';
            } else {
                CWObject.coverAgreementTime = 'F';
            }

            if (JSONData[i].coverAgreementProduct == true) {
                CWObject.coverAgreementProduct = 'T';
            } else {
                CWObject.coverAgreementProduct = 'F';
            }

            if (JSONData[i].coverAgreementExpense == true) {
                CWObject.coverAgreementExpense = 'T';
            } else {
                CWObject.coverAgreementExpense = 'F';
            }

            if (JSONData[i].coverSalesTax == true) {
                CWObject.coverSalesTax = 'T';
            } else {
                CWObject.coverSalesTax = 'F';
            }

            if (JSONData[i].carryOverUnused == true) {
                CWObject.carryOverUnused = 'T';
            } else {
                CWObject.carryOverUnused = 'F';
            }

            if (JSONData[i].allowOverruns == true) {
                CWObject.allowOverruns = 'T';
            } else {
                CWObject.allowOverruns = 'F';
            }

            if (JSONData[i].expiredDays) {
                CWObject.expiredDays = JSONData[i].expiredDays;
            } else {
                CWObject.expiredDays = '';
            }

            if (JSONData[i].limit) {
                CWObject.limit = JSONData[i].limit;
            } else {
                CWObject.limit = '';
            }

            if (JSONData[i].expireWhenZero == true) {
                CWObject.expireWhenZero = 'T';
            } else {
                CWObject.expireWhenZero = 'F';
            }

            if (JSONData[i].chargeToFirm == true) {
                CWObject.chargeToFirm = 'T';
            } else {
                CWObject.chargeToFirm = 'F';
            }

            CWObject.employeeCompRate = JSONData[i].employeeCompRate;
            CWObject.compHourlyRate = JSONData[i].compHourlyRate;
            CWObject.compLimitAmount = JSONData[i].compLimitAmount;

            if (JSONData[i].billOneTimeFlag == true) {
                CWObject.billOneTimeFlag = 'T';
            } else {
                CWObject.billOneTimeFlag = 'F';
            }

            CWObject.invoicingCycle = JSONData[i].invoicingCycle;

            if (JSONData[i].billAmount) {
                CWObject.billAmount = JSONData[i].billAmount;
            } else {
                CWObject.billAmount = 0;
            }

            if (JSONData[i].taxable == true) {
                CWObject.taxable = 'T';
            } else {
                CWObject.taxable = 'F';
            }
            if (JSONData[i].prorateFirstBill) {
                CWObject.prorateFirstBill = JSONData[i].prorateFirstBill;
            } else {
                CWObject.prorateFirstBill = '';
            }

            if (JSONData[i].billStartDate) {
                CWObject.billStartDate = convertJSONStringToDate(JSONData[i].billStartDate);
            }

            if (JSONData[i].restrictDownPayment == true) {
                CWObject.restrictDownPayment = 'T';
            } else {
                CWObject.restrictDownPayment = 'F';
            }

            if (JSONData[i].proRateFlag == true) {
                CWObject.proRateFlag = 'T';
            } else {
                CWObject.proRateFlag = 'F';
            }
            if (JSONData[i].invoiceDescription) {
                CWObject.invoiceDescription = JSONData[i].invoiceDescription;
            } else {
                CWObject.invoiceDescription = '';
            }

            CWObject.billTime = JSONData[i].billTime;
            CWObject.billExpenses = JSONData[i].billExpenses;
            CWObject.billProducts = JSONData[i].billProducts;

            if (JSONData[i].billableTimeInvoice == true) {
                CWObject.billableTimeInvoice = 'T';
            } else {
                CWObject.billableTimeInvoice = 'F';
            }

            if (JSONData[i].billableExpenseInvoice == true) {
                CWObject.billableExpenseInvoice = 'T';
            } else {
                CWObject.billableExpenseInvoice = 'F';
            }

            if (JSONData[i].billableProductInvoice == true) {
                CWObject.billableProductInvoice = 'T';
            } else {
                CWObject.billableProductInvoice = 'F';
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            if (JSONData[i].autoInvoiceFlag == true) {
                CWObject.autoInvoiceFlag = 'T';
            } else {
                CWObject.autoInvoiceFlag = 'F';
            }

            if (JSONData[i].companyLocation) {
                if (JSONData[i].companyLocation.id)
                    CWObject.companyLocation.id = JSONData[i].companyLocation.id.toFixed(0);
                if (JSONData[i].companyLocation.name)
                    CWObject.companyLocation.name = JSONData[i].companyLocation.name;
            }

            CWObject.agreementStatus = JSONData[i].agreementStatus;

            if (JSONData[i].billingCycle) {
                if (JSONData[i].billingCycle.id) {
                    CWObject.billingCycle.id = JSONData[i].billingCycle.id.toFixed(0);
                } else {
                    CWObject.billingCycle.id = '';
                }
                if (JSONData[i].billingCycle.name) {
                    CWObject.billingCycle.name = JSONData[i].billingCycle.name;
                } else {
                    CWObject.billingCycle.name = '';
                }
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getProjectTicket(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(PROJECTTICKET_REQ_STRING, getPageCount(PROJECTTICKET_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022

    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWProjectTicket();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWPRT' + JSONData[i].id.toFixed(0) + '-' + cwAccountId;

            if (JSONData[i].summary) {
                CWObject.summary = JSONData[i].summary;
            } else {
                CWObject.summary = '';
            }

            if (JSONData[i].isIssueFlag) {
                if (JSONData[i].isIssueFlag == true) {
                    CWObject.isIssueFlag = 'T';
                } else {
                    CWObject.isIssueFlag = 'F';
                }
            }

            if (JSONData[i].board) {
                if (JSONData[i].board.id)
                    CWObject.board.id = JSONData[i].board.id.toFixed(0);
                if (JSONData[i].board.name)
                    CWObject.board.name = JSONData[i].board.name;
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id)
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                if (JSONData[i].status.name)
                    CWObject.status.name = JSONData[i].status.name;
            }

            if (JSONData[i].project) {
                if (JSONData[i].project.id)
                    CWObject.project.id = JSONData[i].project.id.toFixed(0);
                if (JSONData[i].project.name)
                    CWObject.project.name = JSONData[i].project.name;
            }

            if (JSONData[i].phase) {
                if (JSONData[i].phase.id)
                    CWObject.phase.id = JSONData[i].phase.id.toFixed(0);
                if (JSONData[i].phase.name)
                    CWObject.phase.name = JSONData[i].phase.name;
            }

            if (JSONData[i].wbsCode) {
                CWObject.wbsCode = JSONData[i].wbsCode;
            } else {
                CWObject.wbsCode = '';
            }

            if (JSONData[i].company) {
                if (JSONData[i].company.id)
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id)
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                if (JSONData[i].site.name)
                    CWObject.site.name = JSONData[i].site.name;
            }

            if (JSONData[i].addressLine1) {
                CWObject.addressLine1 = JSONData[i].addressLine1;
            } else {
                CWObject.addressLine1 = '';
            }

            if (JSONData[i].addressLine2) {
                CWObject.addressLine2 = JSONData[i].addressLine2;
            } else {
                CWObject.addressLine2 = '';
            }

            if (JSONData[i].city) {
                CWObject.city = JSONData[i].city;
            } else {
                CWObject.city = '';
            }

            if (JSONData[i].stateIdentifier) {
                CWObject.stateIdentifier = JSONData[i].stateIdentifier;
            } else {
                CWObject.stateIdentifier = '';
            }

            if (JSONData[i].zip) {
                CWObject.zip = JSONData[i].zip;
            } else {
                CWObject.zip = '';
            }

            if (JSONData[i].country) {
                if (JSONData[i].country.name)
                    CWObject.country = JSONData[i].country.name;
            }

            if (JSONData[i].contact) {
                if (JSONData[i].contact.id)
                    CWObject.contact.id = JSONData[i].contact.id.toFixed(0);
                if (JSONData[i].contact.name)
                    CWObject.contact.name = JSONData[i].contact.name;
            }

            if (JSONData[i].priority) {
                if (JSONData[i].priority.id)
                    CWObject.priority.id = JSONData[i].priority.id.toFixed(0);
                if (JSONData[i].priority.name)
                    CWObject.priority.name = JSONData[i].priority.name;
            }

            if (JSONData[i].type) {
                if (JSONData[i].type.id)
                    CWObject.type.id = JSONData[i].type.id.toFixed(0);
                if (JSONData[i].type.name)
                    CWObject.type.name = JSONData[i].type.name;
            }

            if (JSONData[i].item) {
                if (JSONData[i].item.id)
                    CWObject.item.id = JSONData[i].item.id.toFixed(0);
                if (JSONData[i].item.name)
                    CWObject.item.name = JSONData[i].item.name;
            }

            if (JSONData[i].priority) {
                if (JSONData[i].priority.id)
                    CWObject.priority.id = JSONData[i].priority.id.toFixed(0);
                if (JSONData[i].priority.name)
                    CWObject.priority.name = JSONData[i].priority.name;
            }

            if (JSONData[i].serviceLocation) {
                if (JSONData[i].serviceLocation.id)
                    CWObject.serviceLocation.id = JSONData[i].serviceLocation.id.toFixed(0);
                if (JSONData[i].serviceLocation.name)
                    CWObject.serviceLocation.name = JSONData[i].serviceLocation.name;
            }


            if (JSONData[i].source) {
                if (JSONData[i].source.id)
                    CWObject.source.id = JSONData[i].source.id.toFixed(0);
                if (JSONData[i].source.name)
                    CWObject.source.name = JSONData[i].source.name;
            }

            if (JSONData[i].budgetHours) {
                CWObject.budgetHours = JSONData[i].budgetHours;
            } else {
                CWObject.budgetHours = '';
            }

            if (JSONData[i].opportunity) {
                if (JSONData[i].opportunity.id)
                    CWObject.opportunity.id = JSONData[i].opportunity.id.toFixed(0);
                if (JSONData[i].opportunity.name)
                    CWObject.opportunity.name = JSONData[i].opportunity.name;
            }

            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id)
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                if (JSONData[i].agreement.name)
                    CWObject.agreement.name = JSONData[i].agreement.name;
            }

            if (JSONData[i].requiredDate) {
                CWObject.requiredDate = convertJSONStringToDate(JSONData[i].requiredDate);
            } else {
                CWObject.requiredDate = '';
            }

            if (JSONData[i].closedDate) {
                CWObject.closedDate = convertJSONStringToDate(JSONData[i].closedDate);
            } else {
                CWObject.closedDate = '';
            }

            if (JSONData[i].closedBy) {
                CWObject.closedBy = JSONData[i].closedBy;
            } else {
                CWObject.closedBy = '';
            }

            if (JSONData[i].closedFlag) {
                if (JSONData[i].closedFlag == true) {
                    CWObject.closedFlag = 'T';
                } else {
                    CWObject.closedFlag = 'F';
                }
            }

            if (JSONData[i].actualHours) {
                CWObject.actualHours = JSONData[i].actualHours;
            } else {
                CWObject.actualHours = '';
            }

            if (JSONData[i].approved) {
                if (JSONData[i].approved == true) {
                    CWObject.approved = 'T';
                } else {
                    CWObject.approved = 'F';
                }
            }

            if (JSONData[i].subBillingMethod) {
                CWObject.subBillingMethod = JSONData[i].subBillingMethod;
            } else {
                CWObject.subBillingMethod = '';
            }

            if (JSONData[i].subBillingAmount) {
                CWObject.subBillingAmount = JSONData[i].subBillingAmount;
            } else {
                CWObject.subBillingAmount = '';
            }

            if (JSONData[i].resources) {
                CWObject.resources = JSONData[i].resources;
            } else {
                CWObject.resources = '';
            }

            if (JSONData[i].billTime) {
                CWObject.billTime = JSONData[i].billTime;
            } else {
                CWObject.billTime = '';
            }

            if (JSONData[i].billExpenses) {
                CWObject.billExpenses = JSONData[i].billExpenses;
            } else {
                CWObject.billExpenses = '';
            }

            if (JSONData[i].billProducts) {
                CWObject.billProducts = JSONData[i].billProducts;
            } else {
                CWObject.billProducts = '';
            }

            if (JSONData[i].location) {
                if (JSONData[i].location.id)
                    CWObject.location.id = JSONData[i].location.id.toFixed(0);
                if (JSONData[i].location.name)
                    CWObject.location.name = JSONData[i].location.name;
            }

            if (JSONData[i].department) {
                if (JSONData[i].department.id)
                    CWObject.department.id = JSONData[i].department.id.toFixed(0);
                if (JSONData[i].department.name)
                    CWObject.department.name = JSONData[i].department.name;
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Project Ticket ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }

    return JSONDataArray;
}

function getServiceTicket(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(SERVICETICKET_REQ_STRING, getPageCount(SERVICETICKET_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022

    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWServiceTicket();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWSRT' + JSONData[i].id.toFixed(0) + '-' + cwAccountId;

            if (JSONData[i].summary) {
                CWObject.summary = JSONData[i].summary;
            } else {
                CWObject.summary = '';
            }

            if (JSONData[i].recordType) {
                CWObject.recordType = JSONData[i].recordType;
            } else {
                CWObject.recordType = '';
            }

            if (JSONData[i].severity) {
                CWObject.severity = JSONData[i].severity;
            } else {
                CWObject.severity = '';
            }

            if (JSONData[i].impact) {
                CWObject.impact = JSONData[i].impact;
            } else {
                CWObject.impact = '';
            }

            if (JSONData[i].dateResolved) {
                CWObject.dateResolved = convertJSONStringToDate(JSONData[i].dateResolved);
            } else {
                CWObject.dateResolved = '';
            }

            if (JSONData[i].dateResplan) {
                CWObject.dateResplan = convertJSONStringToDate(JSONData[i].dateResplan);
            } else {
                CWObject.dateResplan = '';
            }

            if (JSONData[i].dateResponded) {
                CWObject.dateResponded = convertJSONStringToDate(JSONData[i].dateResponded);
            } else {
                CWObject.dateResponded = '';
            }

            if (JSONData[i].resolveMinutes) {
                CWObject.resolveMinutes = JSONData[i].resolveMinutes;
            } else {
                CWObject.resolveMinutes = '';
            }

            if (JSONData[i].resPlanMinutes) {
                CWObject.resPlanMinutes = JSONData[i].resPlanMinutes;
            } else {
                CWObject.resPlanMinutes = '';
            }

            if (JSONData[i].respondMinutes) {
                CWObject.respondMinutes = JSONData[i].respondMinutes;
            } else {
                CWObject.respondMinutes = '';
            }

            if (JSONData[i].isInSla) {
                if (JSONData[i].isInSla == true) {
                    CWObject.isInSla = 'T';
                } else {
                    CWObject.isInSla = 'F';
                }
            }

            if (JSONData[i].hasChildTicket) {
                if (JSONData[i].hasChildTicket == true) {
                    CWObject.hasChildTicket = 'T';
                } else {
                    CWObject.hasChildTicket = 'F';
                }
            }

            if (JSONData[i].hasMergedChildTicketFlag) {
                if (JSONData[i].hasMergedChildTicketFlag == true) {
                    CWObject.hasMergedChildTicketFlag = 'T';
                } else {
                    CWObject.hasMergedChildTicketFlag = 'F';
                }
            }

            if (JSONData[i].sla) {
                if (JSONData[i].sla.id)
                    CWObject.sla.id = JSONData[i].sla.id.toFixed(0);
                if (JSONData[i].sla.name)
                    CWObject.sla.name = JSONData[i].sla.name;
            }

            if (JSONData[i].estimatedExpenseCost) {
                CWObject.estimatedExpenseCost = JSONData[i].estimatedExpenseCost;
            } else {
                CWObject.estimatedExpenseCost = '';
            }

            if (JSONData[i].estimatedExpenseRevenue) {
                CWObject.estimatedExpenseRevenue = JSONData[i].estimatedExpenseRevenue;
            } else {
                CWObject.estimatedExpenseRevenue = '';
            }

            if (JSONData[i].estimatedProductCost) {
                CWObject.estimatedProductCost = JSONData[i].estimatedProductCost;
            } else {
                CWObject.estimatedProductCost = '';
            }

            if (JSONData[i].estimatedProductRevenue) {
                CWObject.estimatedProductRevenue = JSONData[i].estimatedProductRevenue;
            } else {
                CWObject.estimatedProductRevenue = '';
            }

            if (JSONData[i].estimatedTimeCost) {
                CWObject.estimatedTimeCost = JSONData[i].estimatedTimeCost;
            } else {
                CWObject.estimatedTimeCost = '';
            }

            if (JSONData[i].estimatedTimeRevenue) {
                CWObject.estimatedTimeRevenue = JSONData[i].estimatedTimeRevenue;
            } else {
                CWObject.estimatedTimeRevenue = '';
            }

            if (JSONData[i].board) {
                if (JSONData[i].board.id)
                    CWObject.board.id = JSONData[i].board.id.toFixed(0);
                if (JSONData[i].board.name)
                    CWObject.board.name = JSONData[i].board.name;
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id)
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                if (JSONData[i].status.name)
                    CWObject.status.name = JSONData[i].status.name;
            }

            // if (JSONData[i].project) {
            //     if (JSONData[i].project.id)
            //         CWObject.project.id = JSONData[i].project.id.toFixed(0);
            //     if (JSONData[i].project.name)
            //         CWObject.project.name = JSONData[i].project.name;
            // }
            //
            // if (JSONData[i].phase) {
            //     if (JSONData[i].phase.id)
            //         CWObject.phase.id = JSONData[i].phase.id.toFixed(0);
            //     if (JSONData[i].phase.name)
            //         CWObject.phase.name = JSONData[i].phase.name;
            // }
            //
            // if(JSONData[i].wbsCode) {
            //     CWObject.wbsCode = JSONData[i].wbsCode;
            // } else {
            //     CWObject.wbsCode = '';
            // }

            if (JSONData[i].company) {
                if (JSONData[i].company.id)
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                if (JSONData[i].company.name)
                    CWObject.company.name = JSONData[i].company.name;
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id)
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                if (JSONData[i].site.name)
                    CWObject.site.name = JSONData[i].site.name;
            }

            if (JSONData[i].addressLine1) {
                CWObject.addressLine1 = JSONData[i].addressLine1;
            } else {
                CWObject.addressLine1 = '';
            }

            if (JSONData[i].addressLine2) {
                CWObject.addressLine2 = JSONData[i].addressLine2;
            } else {
                CWObject.addressLine2 = '';
            }

            if (JSONData[i].city) {
                CWObject.city = JSONData[i].city;
            } else {
                CWObject.city = '';
            }

            if (JSONData[i].stateIdentifier) {
                CWObject.stateIdentifier = JSONData[i].stateIdentifier;
            } else {
                CWObject.stateIdentifier = '';
            }

            if (JSONData[i].zip) {
                CWObject.zip = JSONData[i].zip;
            } else {
                CWObject.zip = '';
            }

            if (JSONData[i].country) {
                if (JSONData[i].country.name)
                    CWObject.country = JSONData[i].country.name;
            }

            if (JSONData[i].contact) {
                if (JSONData[i].contact.id)
                    CWObject.contact.id = JSONData[i].contact.id.toFixed(0);
                if (JSONData[i].contact.name)
                    CWObject.contact.name = JSONData[i].contact.name;
            }

            if (JSONData[i].team) {
                if (JSONData[i].team.id)
                    CWObject.team.id = JSONData[i].team.id.toFixed(0);
                if (JSONData[i].team.name)
                    CWObject.team.name = JSONData[i].team.name;
            }


            if (JSONData[i].type) {
                if (JSONData[i].type.id)
                    CWObject.type.id = JSONData[i].type.id.toFixed(0);
                if (JSONData[i].type.name)
                    CWObject.type.name = JSONData[i].type.name;
            }

            if (JSONData[i].item) {
                if (JSONData[i].item.id)
                    CWObject.item.id = JSONData[i].item.id.toFixed(0);
                if (JSONData[i].item.name)
                    CWObject.item.name = JSONData[i].item.name;
            }

            if (JSONData[i].priority) {
                if (JSONData[i].priority.id)
                    CWObject.priority.id = JSONData[i].priority.id.toFixed(0);
                if (JSONData[i].priority.name)
                    CWObject.priority.name = JSONData[i].priority.name;
            }

            if (JSONData[i].serviceLocation) {
                if (JSONData[i].serviceLocation.id)
                    CWObject.serviceLocation.id = JSONData[i].serviceLocation.id.toFixed(0);
                if (JSONData[i].serviceLocation.name)
                    CWObject.serviceLocation.name = JSONData[i].serviceLocation.name;
            }


            if (JSONData[i].source) {
                if (JSONData[i].source.id)
                    CWObject.source.id = JSONData[i].source.id.toFixed(0);
                if (JSONData[i].source.name)
                    CWObject.source.name = JSONData[i].source.name;
            }

            if (JSONData[i].budgetHours) {
                CWObject.budgetHours = JSONData[i].budgetHours;
            } else {
                CWObject.budgetHours = '';
            }

            if (JSONData[i].opportunity) {
                if (JSONData[i].opportunity.id)
                    CWObject.opportunity.id = JSONData[i].opportunity.id.toFixed(0);
                if (JSONData[i].opportunity.name)
                    CWObject.opportunity.name = JSONData[i].opportunity.name;
            }

            if (JSONData[i].agreement) {
                if (JSONData[i].agreement.id)
                    CWObject.agreement.id = JSONData[i].agreement.id.toFixed(0);
                if (JSONData[i].agreement.name)
                    CWObject.agreement.name = JSONData[i].agreement.name;
            }

            if (JSONData[i].requiredDate) {
                CWObject.requiredDate = convertJSONStringToDate(JSONData[i].requiredDate);
            } else {
                CWObject.requiredDate = '';
            }

            if (JSONData[i].closedDate) {
                CWObject.closedDate = convertJSONStringToDate(JSONData[i].closedDate);
            } else {
                CWObject.closedDate = '';
            }

            if (JSONData[i].closedBy) {
                CWObject.closedBy = JSONData[i].closedBy;
            } else {
                CWObject.closedBy = '';
            }

            if (JSONData[i].closedFlag) {
                if (JSONData[i].closedFlag == true) {
                    CWObject.closedFlag = 'T';
                } else {
                    CWObject.closedFlag = 'F';
                }
            }

            if (JSONData[i].actualHours) {
                CWObject.actualHours = JSONData[i].actualHours;
            } else {
                CWObject.actualHours = '';
            }

            if (JSONData[i].approved) {
                if (JSONData[i].approved == true) {
                    CWObject.approved = 'T';
                } else {
                    CWObject.approved = 'F';
                }
            }

            if (JSONData[i].billingMethod) {
                CWObject.billingMethod = JSONData[i].billingMethod;
            } else {
                CWObject.billingMethod = '';
            }

            if (JSONData[i].billingAmount) {
                CWObject.billingAmount = JSONData[i].billingAmount;
            } else {
                CWObject.billingAmount = '';
            }

            if (JSONData[i].subBillingMethod) {
                CWObject.subBillingMethod = JSONData[i].subBillingMethod;
            } else {
                CWObject.subBillingMethod = '';
            }

            if (JSONData[i].subBillingAmount) {
                CWObject.subBillingAmount = JSONData[i].subBillingAmount;
            } else {
                CWObject.subBillingAmount = '';
            }

            if (JSONData[i].resources) {
                CWObject.resources = JSONData[i].resources;
            } else {
                CWObject.resources = '';
            }

            if (JSONData[i].billTime) {
                CWObject.billTime = JSONData[i].billTime;
            } else {
                CWObject.billTime = '';
            }

            if (JSONData[i].billExpenses) {
                CWObject.billExpenses = JSONData[i].billExpenses;
            } else {
                CWObject.billExpenses = '';
            }

            if (JSONData[i].billProducts) {
                CWObject.billProducts = JSONData[i].billProducts;
            } else {
                CWObject.billProducts = '';
            }

            if (JSONData[i].locationId) {
                CWObject.locationId = JSONData[i].locationId.toFixed(0);
            } else {
                CWObject.locationId = '';
            }

            if (JSONData[i].businessUnitId) {
                CWObject.businessUnitId = JSONData[i].businessUnitId.toFixed(0);
            } else {
                CWObject.businessUnitId = '';
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Service Ticket ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }

    return JSONDataArray;
}

function getWorkType(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(WORKTYPE_REQ_STRING, getPageCount(WORKTYPE_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWWorkType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i].billTime) {
                CWObject.billTime = JSONData[i].billTime;
            } else {
                CWObject.billTime = '';
            }

            if (JSONData[i].rateType) {
                CWObject.rateType = JSONData[i].rateType;
            } else {
                CWObject.rateType = '';
            }

            if (JSONData[i].rate) {
                CWObject.rate = JSONData[i].rate;
            } else {
                CWObject.rate = '';
            }

            if (JSONData[i].hoursMin) {
                CWObject.hoursMin = JSONData[i].hoursMin;
            } else {
                CWObject.hoursMin = '';
            }

            if (JSONData[i].hoursMax) {
                CWObject.hoursMax = JSONData[i].hoursMax;
            } else {
                CWObject.hoursMax = '';
            }

            if (JSONData[i].costMultiplier) {
                CWObject.costMultiplier = JSONData[i].costMultiplier;
            } else {
                CWObject.costMultiplier = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Work Type ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getWorkRole(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(WORKROLE_REQ_STRING, getPageCount(WORKROLE_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWWorkRole();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i].hourlyRate) {
                CWObject.hourlyRate = JSONData[i].hourlyRate;
            } else {
                CWObject.hourlyRate = '';
            }

            if (JSONData[i].inactiveFlag) {
                if (JSONData[i].inactiveFlag == true) {
                    CWObject.inactiveFlag = 'T';
                } else {
                    CWObject.inactiveFlag = 'F';
                }
            } else {
                CWObject.inactiveFlag = 'F';
            }

            if (JSONData[i].addAllLocations) {
                if (JSONData[i].addAllLocations == true) {
                    CWObject.addAllLocations = 'T';
                } else {
                    CWObject.addAllLocations = 'F';
                }
            } else {
                CWObject.addAllLocations = 'F';
            }

            if (JSONData[i].removeAllLocations) {
                if (JSONData[i].removeAllLocations == true) {
                    CWObject.removeAllLocations = 'T';
                } else {
                    CWObject.removeAllLocations = 'F';
                }
            } else {
                CWObject.removeAllLocations = 'F';
            }

            if (JSONData[i].addAllAgreementExclusions) {
                if (JSONData[i].addAllAgreementExclusions == true) {
                    CWObject.addAllAgreementExclusions = 'T';
                } else {
                    CWObject.addAllAgreementExclusions = 'F';
                }
            } else {
                CWObject.addAllAgreementExclusions = 'F';
            }

            if (JSONData[i].locationIds) {
                if (JSONData[i].locationIds.length > 0) {
                    for (var x = 0; x < JSONData[i].locationIds.length; x++) {
                        if (x == 0) {
                            CWObject.locationIds = JSONData[i].locationIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.locationIds = CWObject.locationIds + ',' + JSONData[i].locationIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.locationIds = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Work Role ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getPurchaseOrder(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(PURCHASEORDERHEADER_REQ_STRING, getPageCount(PURCHASEORDERHEADER_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWPurchaseOrder();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWPO' + JSONData[i].id + '-' + cwAccountId;

            if (JSONData[i].businessUnitId) {
                CWObject.businessUnitId = JSONData[i].businessUnitId;
            } else {
                CWObject.businessUnitId = '';
            }

            if (JSONData[i].closedFlag) {
                if (JSONData[i].closedFlag == true) {
                    CWObject.closedFlag = 'T';
                } else {
                    CWObject.closedFlag = 'F';
                }
            } else {
                CWObject.closedFlag = 'F';
            }

            if (JSONData[i].customerCompany) {
                if (JSONData[i].customerCompany.id)
                    CWObject.customerCompany.id = JSONData[i].customerCompany.id.toFixed(0);
                if (JSONData[i].customerCompany.name)
                    CWObject.customerCompany.name = JSONData[i].customerCompany.name;
            }

            if (JSONData[i].customerContact) {
                if (JSONData[i].customerContact.id)
                    CWObject.customerContact.id = JSONData[i].customerContact.id.toFixed(0);
                if (JSONData[i].customerContact.name)
                    CWObject.customerContact.name = JSONData[i].customerContact.name;
            }

            if (JSONData[i].customerSite) {
                if (JSONData[i].customerSite.id)
                    CWObject.customerSite.id = JSONData[i].customerSite.id.toFixed(0);
                if (JSONData[i].customerSite.name)
                    CWObject.customerSite.name = JSONData[i].customerSite.name;
            }

            if (JSONData[i].dateClosed) {
                CWObject.dateClosed = convertJSONStringToDate(JSONData[i].dateClosed);
            }

            if (JSONData[i].dropShipCustomerFlag) {
                if (JSONData[i].dropShipCustomerFlag == true) {
                    CWObject.dropShipCustomerFlag = 'T';
                } else {
                    CWObject.dropShipCustomerFlag = 'F';
                }
            } else {
                CWObject.dropShipCustomerFlag = 'F';
            }

            if (JSONData[i].freightCost) {
                CWObject.freightCost = JSONData[i].freightCost;
            } else {
                CWObject.freightCost = 0;
            }

            if (JSONData[i].freightPackingSlip) {
                CWObject.freightPackingSlip = JSONData[i].freightPackingSlip;
            } else {
                CWObject.freightPackingSlip = '';
            }

            if (JSONData[i].freightTaxTotal) {
                CWObject.freightTaxTotal = JSONData[i].freightTaxTotal;
            } else {
                CWObject.freightTaxTotal = 0;
            }

            if (JSONData[i].locationId) {
                CWObject.locationId = JSONData[i].locationId;
            } else {
                CWObject.locationId = '';
            }

            if (JSONData[i].internalNotes) {
                CWObject.internalNotes = JSONData[i].internalNotes;
            } else {
                CWObject.internalNotes = '';
            }

            if (JSONData[i].poDate) {
                CWObject.poDate = convertJSONStringToDate(JSONData[i].poDate);
            } else {
                CWObject.poDate = '';
            }

            if (JSONData[i].poNumber) {
                CWObject.poNumber = JSONData[i].poNumber;
            } else {
                CWObject.poNumber = '';
            }

            if (JSONData[i].salesTax) {
                CWObject.salesTax = JSONData[i].salesTax;
            } else {
                CWObject.salesTax = 0;
            }

            if (JSONData[i].shippingInstructions) {
                CWObject.shippingInstructions = JSONData[i].shippingInstructions;
            } else {
                CWObject.shippingInstructions = '';
            }

            if (JSONData[i].shipmentDate) {
                CWObject.shipmentDate = convertJSONStringToDate(JSONData[i].shipmentDate);
            } else {
                CWObject.shipmentDate = '';
            }

            if (JSONData[i].shipmentMethod) {
                if (JSONData[i].shipmentMethod.id)
                    CWObject.shipmentMethod.id = JSONData[i].shipmentMethod.id.toFixed(0);
                if (JSONData[i].shipmentMethod.name)
                    CWObject.shipmentMethod.name = JSONData[i].shipmentMethod.name;
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id)
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                if (JSONData[i].status.name)
                    CWObject.status.name = JSONData[i].status.name;
            }

            if (JSONData[i].subTotal) {
                CWObject.subTotal = JSONData[i].subTotal;
            } else {
                CWObject.subTotal = 0;
            }

            if (JSONData[i].taxCode) {
                if (JSONData[i].taxCode.id)
                    CWObject.taxCode.id = JSONData[i].taxCode.id.toFixed(0);
                if (JSONData[i].taxCode.name)
                    CWObject.taxCode.name = JSONData[i].taxCode.name;
            }

            if (JSONData[i].taxFreightFlag) {
                if (JSONData[i].taxFreightFlag == true) {
                    CWObject.taxFreightFlag = 'T';
                } else {
                    CWObject.taxFreightFlag = 'F';
                }
            } else {
                CWObject.taxFreightFlag = 'F';
            }

            if (JSONData[i].taxPoFlag) {
                if (JSONData[i].taxPoFlag == true) {
                    CWObject.taxPoFlag = 'T';
                } else {
                    CWObject.taxPoFlag = 'F';
                }
            } else {
                CWObject.taxPoFlag = 'F';
            }

            if (JSONData[i].terms) {
                if (JSONData[i].terms.id)
                    CWObject.terms.id = JSONData[i].terms.id.toFixed(0);
                if (JSONData[i].terms.name)
                    CWObject.terms.name = JSONData[i].terms.name;
            }

            if (JSONData[i].total) {
                CWObject.total = JSONData[i].total;
            } else {
                CWObject.total = 0;
            }

            if (JSONData[i].trackingNumber) {
                CWObject.trackingNumber = JSONData[i].trackingNumber;
            } else {
                CWObject.trackingNumber = '';
            }

            if (JSONData[i].vendorCompany) {
                if (JSONData[i].vendorCompany.id)
                    CWObject.vendorCompany.id = JSONData[i].vendorCompany.id.toFixed(0);
                if (JSONData[i].vendorCompany.name)
                    CWObject.vendorCompany.name = JSONData[i].vendorCompany.name;
            }

            if (JSONData[i].vendorContact) {
                if (JSONData[i].vendorContact.id)
                    CWObject.vendorContact.id = JSONData[i].vendorContact.id.toFixed(0);
                if (JSONData[i].vendorContact.name)
                    CWObject.vendorContact.name = JSONData[i].vendorContact.name;
            }

            if (JSONData[i].vendorInvoiceDate) {
                CWObject.vendorInvoiceDate = convertJSONStringToDate(JSONData[i].vendorInvoiceDate);
            } else {
                CWObject.vendorInvoiceDate = '';
            }

            if (JSONData[i].vendorInvoiceNumber) {
                CWObject.vendoerInvoiceNumber = JSONData[i].vendorInvoiceNumber;
            } else {
                CWObject.vendorInvoiceNumber = '';
            }

            if (JSONData[i].vendorOrderNumber) {
                CWObject.vendorOrderNumber = JSONData[i].vendorOrderNumber;
            } else {
                CWObject.vendorOrderNumber = '';
            }

            if (JSONData[i].vendorSite) {
                if (JSONData[i].vendorSite.id)
                    CWObject.vendorSite.id = JSONData[i].vendorSite.id.toFixed(0);
                if (JSONData[i].vendorSite.name)
                    CWObject.vendorSite.name = JSONData[i].vendorSite.name;
            }

            if (JSONData[i].warehouse) {
                if (JSONData[i].warehouse.id)
                    CWObject.warehouse.id = JSONData[i].warehouse.id.toFixed(0);
                if (JSONData[i].warehouse.name)
                    CWObject.warehouse.name = JSONData[i].warehouse.name;
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency = '';
                }
            }

            //new fields 1/12/2021
            if (JSONData[i].customerCity) {
                CWObject.customerCity = JSONData[i].customerCity;
            } else {
                CWObject.customerCity = '';
            }

            if (JSONData[i].customerExtension) {
                CWObject.customerExtension = JSONData[i].customerExtension;
            } else {
                CWObject.customerExtension = '';
            }

            if (JSONData[i].customerName) {
                CWObject.customerName = JSONData[i].customerName;
            } else {
                CWObject.customerName = '';
            }

            if (JSONData[i].customerPhone) {
                CWObject.customerPhone = JSONData[i].customerPhone;
            } else {
                CWObject.customerPhone = '';
            }

            if (JSONData[i].customerSiteName) {
                CWObject.customerSiteName = JSONData[i].customerSiteName;
            } else {
                CWObject.customerSiteName = '';
            }

            if (JSONData[i].customerState) {
                CWObject.customerState = JSONData[i].customerState;
            } else {
                CWObject.customerState = '';
            }

            if (JSONData[i].customerStreetLine1) {
                CWObject.customerStreetLine1 = JSONData[i].customerStreetLine1;
            } else {
                CWObject.customerStreetLine1 = '';
            }

            if (JSONData[i].customerStreetLine2) {
                CWObject.customerStreetLine2 = JSONData[i].customerStreetLine2;
            } else {
                CWObject.customerStreetLine2 = '';
            }

            if (JSONData[i].customerZip) {
                CWObject.customerZip = JSONData[i].customerZip;
            } else {
                CWObject.customerZip = '';
            }

            if (JSONData[i].customerCountry) {
                if (JSONData[i].customerCountry.name) {
                    CWObject.customerCountry = JSONData[i].customerCountry.name;
                } else {
                    CWObject.customerCountry = '';
                }
            } else {
                CWObject.customerCountry = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object PO ID: ' + i, stringErr);
            }


            // 1 = Not Started
            CWObject.conversionstatus = 1;

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getAgreementType(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(AGREEMENT_TYPE_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWAgreementType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }


            if (JSONData[i].billingCycle) {
                if (JSONData[i].billingCycle.id) {
                    CWObject.billingCycle.id = JSONData[i].billingCycle.id;
                } else {
                    CWObject.billingCycle.id = '';
                }
                if (JSONData[i].billingCycle.name) {
                    CWObject.billingCycle.name = JSONData[i].billingCycle.name;
                } else {
                    CWObject.billingCycle.name = '';
                }
            }

            if (JSONData[i].billTime) {
                if (JSONData[i].billTime == true) {
                    CWObject.billTime = 'T';
                } else {
                    CWObject.billTime = 'F';
                }
            } else {
                CWObject.billTime = 'F';
            }

            if (JSONData[i].billExpenses) {
                if (JSONData[i].billExpenses == true) {
                    CWObject.billExpenses = 'T';
                } else {
                    CWObject.billExpenses = 'F';
                }
            } else {
                CWObject.billExpenses = 'F';
            }

            if (JSONData[i].billProducts) {
                if (JSONData[i].billProducts == true) {
                    CWObject.billProducts = 'T';
                } else {
                    CWObject.billProducts = 'F';
                }
            } else {
                CWObject.billProducts = 'F';
            }

            if (JSONData[i].billableTimeInvoice) {
                if (JSONData[i].billableTimeInvoice == true) {
                    CWObject.billableTimeInvoice = 'T';
                } else {
                    CWObject.billableTimeInvoice = 'F';
                }
            } else {
                CWObject.billableTimeInvoice = 'F';
            }


            if (JSONData[i].billableExpenseInvoice) {
                if (JSONData[i].billableExpenseInvoice == true) {
                    CWObject.billableExpenseInvoice = 'T';
                } else {
                    CWObject.billableExpenseInvoice = 'F';
                }
            } else {
                CWObject.billableExpenseInvoice = 'F';
            }

            if (JSONData[i].billableProductInvoice) {
                if (JSONData[i].billableProductInvoice == true) {
                    CWObject.billableProductInvoice = 'T';
                } else {
                    CWObject.billableProductInvoice = 'F';
                }
            } else {
                CWObject.billableProductInvoice = 'F';
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement Type ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getBillingCycle(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(BILLINGCYCLE_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWBillingCycle();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            CWObject.identifier = JSONData[i].identifier;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i].billingOptions) {
                CWObject.billingOptions = JSONData[i].billingOptions;
            } else {
                CWObject.billingOptions = '';
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Billing Cycle ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getConfigurationType(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(CONFIGURATION_TYPE_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);

    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWConfigurationType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].inactiveFlag) {
                if (JSONData[i].inactiveFlag == true) {
                    CWObject.inactiveFlag = 'T';
                } else {
                    CWObject.inactiveFlag = 'F';
                }
            } else {
                CWObject.inactiveFlag = 'F';
            }

            if (JSONData[i].systemFlag) {
                if (JSONData[i].systemFlage == true) {
                    CWObject.systemFlag = 'T';
                } else {
                    CWObject.systemFlag = 'F';
                }
            } else {
                CWObject.systemFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }

                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Agreement Type ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getCompanyStatus(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(COMPANY_STATUS_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCompanyStatus();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i].inactiveFlag) {
                if (JSONData[i].inactiveFlag == true) {
                    CWObject.inactiveFlag = 'T';
                } else {
                    CWObject.inactiveFlag = 'F';
                }
            } else {
                CWObject.inactiveFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Company Status ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getBoardList(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(BOARD_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWBoard();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].projectFlag) {
                if (JSONData[i].projectFlag == true) {
                    CWObject.projectFlag = 'T';
                } else {
                    CWObject.projectFlag = 'F';
                }
            } else {
                CWObject.projectFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Board ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}


function getCompanyType(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(COMPANYTYPE_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCompanyType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            //nlapiLogExecution('DEBUG', 'Name', JSONData[i].name);
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i].vendorFlag) {
                if (JSONData[i].vendorFlag == true) {
                    CWObject.vendorFlag = 'T';
                } else {
                    CWObject.vendorFlag = 'F';
                }
            } else {
                CWObject.vendorFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Company Status ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getCurrency(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(CURRENCY_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCurrency();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            CWObject.currencyIdentifier = JSONData[i].currencyIdentifier;
            if (JSONData[i].currencyCode) {
                if (JSONData[i].currencyCode.id) {
                    CWObject.currencyCode.id = JSONData[i].currencyCode.id;
                } else {
                    CWObject.currencyCode.id = '';
                }
                if (JSONData[i].currencyCode.name) {
                    CWObject.currencyCode.name = JSONData[i].currencyCode.name;
                } else {
                    CWObject.currencyCode.name = '';
                }
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Currency ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getTaxCode(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(TAXCODE_REQ_STRING, 1, 1000, 1, null, 'identifier', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWTaxCode();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            CWObject.identifier = JSONData[i].identifier;
            CWObject.description = JSONData[i].description;
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Company Status ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getLocation(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(LOCATION_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWLocation();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Company Status ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getBillingTerm(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(BILLINGTERM_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWBillingTerm();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Billing Term ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getCountry(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(COUNTRY_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWCountry();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Country ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getState(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(STATE_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWState();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.identifier = JSONData[i].identifier;
            CWObject.name = JSONData[i].name;
            if (JSONData[i].country) {
                if (JSONData[i].country.id) {
                    CWObject.country.id = JSONData[i].country.id;
                } else {
                    CWObject.country.id = '';
                }
                if (JSONData[i].country.name) {
                    CWObject.country.name = JSONData[i].country.name;
                } else {
                    CWObject.country.name = '';
                }
            }
            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object State Status ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getContactDepartment(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(CONTACTDEPARTMENT_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWContactDepartment();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Department ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getContactRelationship(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(CONTACTRELATIONSHIP_REQ_STRING, 1, 1000, 1, null, 'name', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWContactRelationship();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = JSONData[i].name;

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Contact Relationship ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}

function getContactType(pageNumber, pageSize, overrideKeyDate, cwAccountId) {
    var JSONDataArray = [];
    var JSONData = getJSONData(CONTACTTYPE_REQ_STRING, 1, 1000, 1, null, 'description', 'F', cwAccountId);
    if (JSONData) {
        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWContactType();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.description = JSONData[i].description;
            if (JSONData[i].defaultFlag) {
                if (JSONData[i].defaultFlag == true) {
                    CWObject.defaultFlag = 'T';
                } else {
                    CWObject.defaultFlag = 'F';
                }
            } else {
                CWObject.defaultFlag = 'F';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object Contact Type ID: ' + i, stringErr);
            }

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;

}


//copy function of getJSONData but specifically for getting all POHeaderIDs for PO Header Line extraction, agreement additions and other parent/child relationship records
function getCWDataHeaderIDArray(dataRequestString, pageCount, pageSize, overrideKeyDate, cwAccountId) {
    var cwBaseURL = getGlobalSetting('custrecord_ctc_cw_api_baseurl', cwAccountId);
    var JSONPayload = '';
    var JSONStringData = '';
    var JSONData;
    var poIDArray = [];

    var recordSettings = getImportKeyDateInternalId(dataRequestString);

    var importKeyDateInternalId;
    var dateFieldFilter;

    if (recordSettings) {
        importKeyDateInternalId = recordSettings.importkeyinternalid;
        dateFieldFilter = recordSettings.datefieldfilter;
    }

    var dateFilterString = '';

    if (importKeyDateInternalId) {
        var importKeyDate;

        if (overrideKeyDate) {
            importKeyDate = overrideKeyDate;
        } else {
            importKeyDate = getGlobalSetting(importKeyDateInternalId, cwAccountId);
        }

        if (importKeyDate) {
            var dateValue = formatDateToYYYYMMDD(importKeyDate);
            dateFilterString = '&conditions=' + dateFieldFilter + '>=[' + dateValue + ']';
        }
    }

    //set default page size if blank
    if (pageSize == null || pageSize == '') {
        pageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
    }

    if (pageCount) {
        JSONStringData = '[';
        for (var j = 1; j <= pageCount; j++) {
            var JSONPayload = nlapiRequestURL(cwBaseURL + dataRequestString + '?fields=id&pagesize=' + pageSize + '&page=' + j + dateFilterString, null, getHeaderSettings(null, cwAccountId));
            var rawDataTrimmed = '';
            var rawData = JSONPayload.getBody();

            if (rawData) {
                rawDataTrimmed = rawData.substring(rawData.indexOf("[") + 1, rawData.lastIndexOf("]"));

                if (j < pageCount)
                    rawDataTrimmed = rawDataTrimmed + ',';

                JSONStringData = JSONStringData + rawDataTrimmed;
            }
        }
        JSONStringData = JSONStringData + ']';
    }
    if (JSONStringData) {
        JSONData = JSON.parse(JSONStringData);
        //nlapiLogExecution('DEBUG', 'JSONPayload ID', JSONData[0].id);
    }
    //transfer all PO Ids to array
    if (JSONData) {
        for (var x = 0; x < JSONData.length; x++) {
            var poID = JSONData[x].id.toFixed(0);
            //nlapiLogExecution('AUDIT', 'HEADER PO ID: ' + poID);
            poIDArray.push(poID);
        }
    }

    return poIDArray;
}

function getPurchaseOrderLine(pageNumber, pageSize, overrideKeyDate, cwAccountId, purchaseOrderHeaderId, customParameter) {
    //compute for page count via PO Header
    var poIDArray = [];
    var JSONDataArray = [];
    var JSONData;

    if (purchaseOrderHeaderId != null) {
        //single PO ID header fetch
        JSONData = getJSONData(PURCHASEORDERHEADER_REQ_STRING + '/' + purchaseOrderHeaderId + '/' + PURCHASEORDERLINE_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId, customParameter);
    } else {
        var poHeaderTotals = getPageCount(PURCHASEORDERHEADER_REQ_STRING, pageSize, overrideKeyDate, cwAccountId);
        var poHeaderPageCount = poHeaderTotals.pageCount;
        var poHeaderRecordCount = poHeaderTotals.recordCount;

        poIDArray = getCWDataHeaderIDArray(PURCHASEORDERHEADER_REQ_STRING, poHeaderPageCount, null, overrideKeyDate, cwAccountId);
        nlapiLogExecution('DEBUG', 'poIDarray length: ' + poIDArray.length);
        var POLINE_REQ_STRING = PURCHASEORDERHEADER_REQ_STRING + '/' + poIDArray[pageNumber - 1] + '/' + PURCHASEORDERLINE_REQ_STRING;

        JSONData = getJSONData(POLINE_REQ_STRING, 1, pageSize, 1, null, null, null, cwAccountId);
    }
    if (JSONData) {

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWPurchaseOrderLine();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWPOLNE' + JSONData[i].id + '-' + cwAccountId;

            if (JSONData[i].backOrderedFlag) {
                if (JSONData[i].backOrderedFlag == true) {
                    CWObject.backOrderedFlag = 'T';
                } else {
                    CWObject.backOrderedFlag = 'F';
                }
            } else {
                CWObject.backOrderedFlag = 'F';
            }

            if (JSONData[i].canceledFlag) {
                if (JSONData[i].canceledFlag == true) {
                    CWObject.canceledFlag = 'T';
                } else {
                    CWObject.canceledFlag = 'F';
                }
            } else {
                CWObject.canceledFlag = 'F';
            }

            if (JSONData[i].closedFlag) {
                if (JSONData[i].closedFlag == true) {
                    CWObject.closedFlag = 'T';
                } else {
                    CWObject.closedFlag = 'F';
                }
            } else {
                CWObject.closedFlag = 'F';
            }

            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].internalNotes) {
                CWObject.internalNotes = JSONData[i].internalNotes;
            } else {
                CWObject.internalNotes = '';
            }

            if (JSONData[i].lineNumber) {
                CWObject.lineNumber = JSONData[i].lineNumber.toFixed(0);
            } else {
                CWObject.lineNumber = 0;
            }

            if (JSONData[i].packingSlip) {
                CWObject.packingSlip = JSONData[i].packingSlip;
            } else {
                CWObject.packingSlip = '';
            }

            if (JSONData[i].product) {
                if (JSONData[i].product.id)
                    CWObject.product.id = JSONData[i].product.id.toFixed(0);
                if (JSONData[i].product.identifier)
                    CWObject.product.identifier = JSONData[i].product.identifier;
            }

            if (JSONData[i].purchaseOrderId) {
                CWObject.purchaseOrderId = JSONData[i].purchaseOrderId.toFixed(0);
            } else {
                CWObject.purchaseOrderId = '';
            }

            if (JSONData[i].quantity) {
                CWObject.quantity = JSONData[i].quantity;
            } else {
                CWObject.quantity = 0;
            }

            if (JSONData[i].receivedQuantity) {
                CWObject.receivedQuantity = JSONData[i].receivedQuantity;
            } else {
                CWObject.receivedQuantity = 0;
            }

            if (JSONData[i].shipmentMethod) {
                if (JSONData[i].shipmentMethod.id)
                    CWObject.shipmentMethod.id = JSONData[i].shipmentMethod.id.toFixed(0);
                if (JSONData[i].shipmentMethod.name)
                    CWObject.shipmentMethod.name = JSONData[i].shipmentMethod.name;
            }

            if (JSONData[i].tax) {
                CWObject.tax = JSONData[i].tax;
            } else {
                CWObject.tax = 0;
            }

            if (JSONData[i].trackingNumber) {
                CWObject.trackingNumber = JSONData[i].trackingNumber;
            } else {
                CWObject.trackingNumber = '';
            }

            if (JSONData[i].unitCost) {
                CWObject.unitCost = JSONData[i].unitCost;
            } else {
                CWObject.unitCost = 0;
            }

            if (JSONData[i].unitOfMeasure) {
                if (JSONData[i].unitOfMeasure.id)
                    CWObject.unitOfMeasure.id = JSONData[i].unitOfMeasure.id.toFixed(0);
                if (JSONData[i].unitOfMeasure.name)
                    CWObject.unitOfMeasure.name = JSONData[i].unitOfMeasure.name;
            }

            if (JSONData[i].receivedStatus) {
                CWObject.receivedStatus = JSONData[i].receivedStatus;
            } else {
                CWObject.receivedStatus = '';
            }

            if (JSONData[i].warehouse) {
                if (JSONData[i].warehouse.id)
                    CWObject.warehouse.id = JSONData[i].warehouse.id.toFixed(0);
                if (JSONData[i].warehouse.name)
                    CWObject.warehouse.name = JSONData[i].warehouse.name;
            }
            if (JSONData[i].warehouseBin) {
                if (JSONData[i].warehouseBin.id)
                    CWObject.warehouseBin.id = JSONData[i].warehouseBin.id.toFixed(0);
                if (JSONData[i].warehouseBin.name)
                    CWObject.warehouseBin.name = JSONData[i].warehouseBin.name;
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.dateEntered) {
                    CWObject.dateEntered = JSONData[i]._info.dateEntered;
                } else {
                    CWObject.dateEntered = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
                if (JSONData[i]._info.enteredBy) {
                    CWObject.enteredBy = JSONData[i]._info.enteredBy;
                } else {
                    CWObject.enteredBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object PO Line ID: ' + i, stringErr);
            }

            // 1 = Not Started
            CWObject.conversionstatus = 1;

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getSalesOrder(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(SALESORDER_REQ_STRING, getPageCount(SALESORDER_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWSalesOrder();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWSO' + JSONData[i].id + '-' + cwAccountId;

            if (JSONData[i].company) {
                if (JSONData[i].company.id) {
                    CWObject.company.id = JSONData[i].company.id.toFixed(0);
                } else {
                    CWObject.company.id = '';
                }
                if (JSONData[i].company.name) {
                    CWObject.company.name = JSONData[i].company.name;
                } else {
                    CWObject.company.name = '';
                }
            }

            if (JSONData[i].contact) {
                if (JSONData[i].contact.id) {
                    CWObject.contact.id = JSONData[i].contact.id.toFixed(0);
                } else {
                    CWObject.contact.id = '';
                }
                if (JSONData[i].contact.name) {
                    CWObject.contact.name = JSONData[i].contact.name;
                } else {
                    CWObject.contact.name = '';
                }
            }

            if (JSONData[i].phone) {
                CWObject.phone = JSONData[i].phone;
            } else {
                CWObject.phone = '';
            }

            if (JSONData[i].phoneExt) {
                CWObject.phoneExt = JSONData[i].phoneExt;
            } else {
                CWObject.phoneExt = '';
            }

            if (JSONData[i].email) {
                CWObject.email = JSONData[i].email;
            } else {
                CWObject.email = '';
            }

            if (JSONData[i].site) {
                if (JSONData[i].site.id) {
                    CWObject.site.id = JSONData[i].site.id.toFixed(0);
                } else {
                    CWObject.site.id = '';
                }
                if (JSONData[i].site.name) {
                    CWObject.site.name = JSONData[i].site.name;
                } else {
                    CWObject.site.name = '';
                }
            }

            if (JSONData[i].status) {
                if (JSONData[i].status.id) {
                    CWObject.status.id = JSONData[i].status.id.toFixed(0);
                } else {
                    CWObject.status.id = '';
                }
                if (JSONData[i].status.name) {
                    CWObject.status.name = JSONData[i].status.name;
                } else {
                    CWObject.status.name = '';
                }
            }

            if (JSONData[i].opportunity) {
                if (JSONData[i].opportunity.id) {
                    CWObject.opportunity.id = JSONData[i].opportunity.id.toFixed(0);
                } else {
                    CWObject.opportunity.id = '';
                }
                if (JSONData[i].opportunity.name) {
                    CWObject.opportunity.name = JSONData[i].opportunity.name;
                } else {
                    CWObject.opportunity.name = '';
                }
            }

            if (JSONData[i].orderDate) {
                CWObject.orderDate = convertJSONStringToDate(JSONData[i].orderDate);
            } else {
                CWObject.orderDate = '';
            }

            if (JSONData[i].dueDate) {
                CWObject.dueDate = convertJSONStringToDate(JSONData[i].dueDate);
            } else {
                CWObject.dueDate = '';
            }

            if (JSONData[i].billingTerms) {
                if (JSONData[i].billingTerms.id) {
                    CWObject.billingTerms.id = JSONData[i].billingTerms.id.toFixed(0);
                } else {
                    CWObject.billingTerms.id = '';
                }
                if (JSONData[i].billingTerms.name) {
                    CWObject.billingTerms.name = JSONData[i].billingTerms.name;
                } else {
                    CWObject.billingTerms.name = '';
                }
            }

            if (JSONData[i].taxCode) {
                if (JSONData[i].taxCode.id) {
                    CWObject.taxCode.id = JSONData[i].taxCode.id.toFixed(0);
                } else {
                    CWObject.taxCode.id = '';
                }
                if (JSONData[i].taxCode.name) {
                    CWObject.taxCode.name = JSONData[i].taxCode.name;
                } else {
                    CWObject.taxCode.name = '';
                }
            }

            if (JSONData[i].poNumber) {
                CWObject.poNumber = JSONData[i].poNumber;
            } else {
                CWObject.poNumber = '';
            }

            if (JSONData[i].location) {
                if (JSONData[i].location.id) {
                    CWObject.location.id = JSONData[i].location.id.toFixed(0);
                } else {
                    CWObject.location.id = '';
                }
                if (JSONData[i].location.name) {
                    CWObject.location.name = JSONData[i].location.name;
                } else {
                    CWObject.location.name = '';
                }
            }

            if (JSONData[i].department) {
                if (JSONData[i].department.id) {
                    CWObject.department.id = JSONData[i].department.id.toFixed(0);
                } else {
                    CWObject.department.id = '';
                }
                if (JSONData[i].department.name) {
                    CWObject.department.name = JSONData[i].department.name;
                } else {
                    CWObject.department.name = '';
                }
            }

            if (JSONData[i].salesRep) {
                if (JSONData[i].salesRep.id) {
                    CWObject.salesRep.id = JSONData[i].salesRep.id.toFixed(0);
                } else {
                    CWObject.salesRep.id = '';
                }
                if (JSONData[i].salesRep.name) {
                    CWObject.salesRep.name = JSONData[i].salesRep.name;
                } else {
                    CWObject.salesRep.name = '';
                }
            }

            if (JSONData[i].notes) {
                CWObject.notes = JSONData[i].notes;
            } else {
                CWObject.notes = '';
            }

            if (JSONData[i].billClosedFlag) {
                if (JSONData[i].billClosedFlag == true) {
                    CWObject.billClosedFlag = 'T';
                } else {
                    CWObject.billClosedFlag = 'F';
                }
            } else {
                CWObject.billClosedFlag = 'F';
            }

            if (JSONData[i].billShippedFlag) {
                if (JSONData[i].billShippedFlag == true) {
                    CWObject.billShippedFlag = 'T';
                } else {
                    CWObject.billShippedFlag = 'F';
                }
            } else {
                CWObject.billShippedFlag = 'F';
            }

            if (JSONData[i].restrictDownpaymentFlag) {
                if (JSONData[i].restrictDownpaymentFlag == true) {
                    CWObject.restrictDownpaymentFlag = 'T';
                } else {
                    CWObject.restrictDownpaymentFlag = 'F';
                }
            } else {
                CWObject.restrictDownpaymentFlag = 'F';
            }

            if (JSONData[i].description) {
                CWObject.description = JSONData[i].description;
            } else {
                CWObject.description = '';
            }

            if (JSONData[i].topCommentFlag) {
                if (JSONData[i].topCommentFlag == true) {
                    CWObject.topCommentFlag = 'T';
                } else {
                    CWObject.topCommentFlag = 'F';
                }
            } else {
                CWObject.topCommentFlag = 'F';
            }

            if (JSONData[i].bottomCommentFlag) {
                if (JSONData[i].bottomCommentFlag == true) {
                    CWObject.bottomCommentFlag = 'T';
                } else {
                    CWObject.bottomCommentFlag = 'F';
                }
            } else {
                CWObject.bottomCommentFlag = 'F';
            }

            if (JSONData[i].shipToCompany) {
                if (JSONData[i].shipToCompany.id) {
                    CWObject.shipToCompany.id = JSONData[i].shipToCompany.id.toFixed(0);
                } else {
                    CWObject.shipToCompany.id = '';
                }
                if (JSONData[i].shipToCompany.name) {
                    CWObject.shipToCompany.name = JSONData[i].shipToCompany.name;
                } else {
                    CWObject.shipToCompany.name = '';
                }
            }

            if (JSONData[i].shipToContact) {
                if (JSONData[i].shipToContact.id) {
                    CWObject.shipToContact.id = JSONData[i].shipToContact.id.toFixed(0);
                } else {
                    CWObject.shipToContact.id = '';
                }
                if (JSONData[i].shipToContact.name) {
                    CWObject.shipToContact.name = JSONData[i].shipToContact.name;
                } else {
                    CWObject.shipToContact.name = '';
                }
            }

            if (JSONData[i].shipToSite) {
                if (JSONData[i].shipToSite.id) {
                    CWObject.shipToSite.id = JSONData[i].shipToSite.id.toFixed(0);
                } else {
                    CWObject.shipToSite.id = '';
                }
                if (JSONData[i].shipToSite.name) {
                    CWObject.shipToSite.name = JSONData[i].shipToSite.name;
                } else {
                    CWObject.shipToSite.name = '';
                }
            }

            if (JSONData[i].billToCompany) {
                if (JSONData[i].billToCompany.id) {
                    CWObject.billToCompany.id = JSONData[i].billToCompany.id.toFixed(0);
                } else {
                    CWObject.billToCompany.id = '';
                }
                if (JSONData[i].billToCompany.name) {
                    CWObject.billToCompany.name = JSONData[i].billToCompany.name;
                } else {
                    CWObject.billToCompany.name = '';
                }
            }

            if (JSONData[i].billToContact) {
                if (JSONData[i].billToContact.id) {
                    CWObject.billToContact.id = JSONData[i].billToContact.id.toFixed(0);
                } else {
                    CWObject.billToContact.id = '';
                }
                if (JSONData[i].billToContact.name) {
                    CWObject.billToContact.name = JSONData[i].billToContact.name;
                } else {
                    CWObject.billToContact.name = '';
                }
            }

            if (JSONData[i].billToSite) {
                if (JSONData[i].billToSite.id) {
                    CWObject.billToSite.id = JSONData[i].billToSite.id.toFixed(0);
                } else {
                    CWObject.billToSite.id = '';
                }
                if (JSONData[i].billToSite.name) {
                    CWObject.billToSite.name = JSONData[i].billToSite.name;
                } else {
                    CWObject.billToSite.name = '';
                }
            }

            //for product ids list
            if (JSONData[i].productIds) {
                if (JSONData[i].productIds.length > 0) {
                    for (var x = 0; x < JSONData[i].productIds.length; x++) {
                        if (x == 0) {
                            CWObject.productIds = JSONData[i].productIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.productIds = CWObject.productIds + ',' + JSONData[i].productIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.productIds = '';
            }

            //for doc ids list
            if (JSONData[i].documentIds) {
                if (JSONData[i].documentIds.length > 0) {
                    for (var x = 0; x < JSONData[i].documentIds.length; x++) {
                        if (x == 0) {
                            CWObject.documentIds = JSONData[i].documentIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.documentIds = CWObject.documentIds + ',' + JSONData[i].documentIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.documentIds = '';
            }

            //for invoice ids list
            if (JSONData[i].invoiceIds) {
                if (JSONData[i].invoiceIds.length > 0) {
                    for (var x = 0; x < JSONData[i].invoiceIds.length; x++) {
                        if (x == 0) {
                            CWObject.invoiceIds = JSONData[i].invoiceIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.invoiceIds = CWObject.invoiceIds + ',' + JSONData[i].invoiceIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.invoiceIds = '';
            }

            //for config ids list
            if (JSONData[i].configIds) {
                if (JSONData[i].configIds.length > 0) {
                    for (var x = 0; x < JSONData[i].configIds.length; x++) {
                        if (x == 0) {
                            CWObject.configIds = JSONData[i].configIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.configIds = CWObject.configIds + ',' + JSONData[i].configIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.configIds = '';
            }

            if (JSONData[i].total) {
                CWObject.total = JSONData[i].total;
            } else {
                CWObject.total = 0;
            }

            if (JSONData[i].taxTotal) {
                CWObject.taxTotal = JSONData[i].taxTotal;
            } else {
                CWObject.taxTotal = 0;
            }

            if (JSONData[i].currency) {
                if (JSONData[i].currency.name) {
                    CWObject.currency.name = JSONData[i].currency.name;
                } else {
                    CWObject.currency.name = '';
                }
                if (JSONData[i].currency.currencyCode) {
                    CWObject.currency.currencyCode = JSONData[i].currency.currencyCode;
                } else {
                    CWObject.currency.currencyCode = '';
                }
            }

            if (JSONData[i].companyLocation) {
                if (JSONData[i].companyLocation.id) {
                    CWObject.companyLocation.id = JSONData[i].companyLocation.id.toFixed(0);
                } else {
                    CWObject.companyLocation.id = '';
                }
                if (JSONData[i].companyLocation.name) {
                    CWObject.companyLocation.name = JSONData[i].companyLocation.name;
                } else {
                    CWObject.companyLocation.name = '';
                }
            }


            if (JSONData[i].subTotal) {
                CWObject.subTotal = JSONData[i].subTotal;
            } else {
                CWObject.subTotal = 0;
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object SO ID: ' + i, stringErr);
            }


            // 1 = Not Started
            CWObject.conversionstatus = 1;

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getMember(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(MEMBER_REQ_STRING, getPageCount(MEMBER_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWMember();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWMEM' + JSONData[i].id + '-' + cwAccountId;

            if (JSONData[i].identifier) {
                CWObject.identifer = JSONData[i].identifier;
            } else {
                CWObject.identifer = '';
            }

            if (JSONData[i].firstName) {
                CWObject.firstName = JSONData[i].firstName;
            } else {
                CWObject.firstName = '';
            }
            if (JSONData[i].middleInitial) {
                CWObject.middleInitial = JSONData[i].middleInitial;
            } else {
                CWObject.middleInitial = '';
            }
            if (JSONData[i].lastName) {
                CWObject.lastName = JSONData[i].lastName;
            } else {
                CWObject.lastName = '';
            }

            if (JSONData[i].title) {
                CWObject.title = JSONData[i].title;
            } else {
                CWObject.title = '';
            }

            if (JSONData[i].licenseClass) {
                CWObject.licenseClass = JSONData[i].licenseClass;
            } else {
                CWObject.licenseClass = '';
            }

            if (JSONData[i].employeeIdentifer) {
                CWObject.employeeIdentifer = JSONData[i].employeeIdentifer;
            } else {
                CWObject.employeeIdentifer = '';
            }

            if (JSONData[i].vendorNumber) {
                CWObject.vendorNumber = JSONData[i].vendorNumber;
            } else {
                CWObject.vendorNumber = '';
            }

            if (JSONData[i].notes) {
                CWObject.notes = JSONData[i].notes;
            } else {
                CWObject.notes = '';
            }

            if (JSONData[i].disableOnlineFlag) {
                if (JSONData[i].disableOnlineFlag == true) {
                    CWObject.disableOnlineFlag = 'T';
                } else {
                    CWObject.disableOnlineFlag = 'F';
                }
            } else {
                CWObject.disableOnlineFlag = 'F';
            }

            if (JSONData[i].enableMobileFlag) {
                if (JSONData[i].enableMobileFlag == true) {
                    CWObject.enableMobileFlag = 'T';
                } else {
                    CWObject.enableMobileFlag = 'F';
                }
            } else {
                CWObject.enableMobileFlagg = 'F';
            }


            if (JSONData[i].timeZone) {
                if (JSONData[i].timeZone.id) {
                    CWObject.timeZone.id = JSONData[i].timeZone.id.toFixed(0);
                } else {
                    CWObject.timeZone.id = '';
                }
                if (JSONData[i].timeZone.name) {
                    CWObject.timeZone.name = JSONData[i].timeZone.name;
                } else {
                    CWObject.timeZone.name = '';
                }
            }

            if (JSONData[i].country) {
                if (JSONData[i].country.id) {
                    CWObject.country.id = JSONData[i].country.id.toFixed(0);
                } else {
                    CWObject.country.id = '';
                }
                if (JSONData[i].country.name) {
                    CWObject.country.name = JSONData[i].country.name;
                } else {
                    CWObject.country.name = '';
                }
            }

            //for service boards team ids
            if (JSONData[i].serviceBoardTeamIds) {
                if (JSONData[i].serviceBoardTeamIds.length > 0) {
                    for (var x = 0; x < JSONData[i].serviceBoardTeamIds.length; x++) {
                        if (x == 0) {
                            CWObject.serviceBoardTeamIds = JSONData[i].serviceBoardTeamIds[x].toFixed(0);
                        }
                        if (x > 0) {
                            CWObject.serviceBoardTeamIds = CWObject.serviceBoardTeamIds + ',' + JSONData[i].serviceBoardTeamIds[x].toFixed(0);
                        }
                    }
                }
            } else {
                CWObject.serviceBoardTeamIds = '';
            }

            if (JSONData[i].inactiveDate) {
                CWObject.inactiveDate = convertJSONStringToDate(JSONData[i].inactiveDate);
            } else {
                CWObject.inactiveDate = '';
            }

            if (JSONData[i].inactiveFlag) {
                if (JSONData[i].inactiveFlag == true) {
                    CWObject.inactiveFlag = 'T';
                } else {
                    CWObject.inactiveFlag = 'F';
                }
            } else {
                CWObject.inactiveFlag = 'F';
            }

            if (JSONData[i].lastLogin) {
                CWObject.lastLogin = JSONData[i].lastLogin;
            } else {
                CWObject.lastLogin = '';
            }

            if (JSONData[i].officeEmail) {
                CWObject.officeEmail = JSONData[i].officeEmail;
            } else {
                CWObject.officeEmail = '';
            }


            if (JSONData[i].officePhone) {
                CWObject.officePhone = JSONData[i].officePhone;
            } else {
                CWObject.officePhone = '';
            }

            if (JSONData[i].officeExtension) {
                CWObject.officeExtension = JSONData[i].officeExtension;
            } else {
                CWObject.officeExtension = '';
            }

            if (JSONData[i].mobileEmail) {
                CWObject.mobileEmail = JSONData[i].mobileEmail;
            } else {
                CWObject.mobileEmail = '';
            }

            if (JSONData[i].mobilePhone) {
                CWObject.mobilePhone = JSONData[i].mobilePhone;
            } else {
                CWObject.mobilePhone = '';
            }

            if (JSONData[i].mobileExtension) {
                CWObject.mobileExtension = JSONData[i].mobileExtension;
            } else {
                CWObject.mobileExtension = '';
            }

            if (JSONData[i].homeEmail) {
                CWObject.homeEmail = JSONData[i].homeEmail;
            } else {
                CWObject.homeEmail = '';
            }

            if (JSONData[i].homePhone) {
                CWObject.homePhone = JSONData[i].homePhone;
            } else {
                CWObject.homePhone = '';
            }

            if (JSONData[i].homeExtension) {
                CWObject.homeExtension = JSONData[i].homeExtension;
            } else {
                CWObject.homeExtension = '';
            }

            if (JSONData[i].defaultEmail) {
                CWObject.defaultEmail = JSONData[i].defaultEmail;
            } else {
                CWObject.defaultEmail = '';
            }

            if (JSONData[i].primaryEmail) {
                CWObject.primaryEmail = JSONData[i].primaryEmail;
            } else {
                CWObject.primaryEmail = '';
            }

            if (JSONData[i].defaultPhone) {
                CWObject.defaultPhone = JSONData[i].defaultPhone;
            } else {
                CWObject.defaultPhone = '';
            }

            if (JSONData[i].securityRole) {
                if (JSONData[i].securityRole.id) {
                    CWObject.securityRole.id = JSONData[i].securityRole.id.toFixed(0);
                } else {
                    CWObject.securityRole.id = '';
                }
                if (JSONData[i].securityRole.name) {
                    CWObject.securityRole.name = JSONData[i].securityRole.name;
                } else {
                    CWObject.securityRole.name = '';
                }
            }

            if (JSONData[i].securityLocation) {
                if (JSONData[i].securityLocation.id) {
                    CWObject.securityLocation.id = JSONData[i].securityLocation.id.toFixed(0);
                } else {
                    CWObject.securityLocation.id = '';
                }
                if (JSONData[i].securityLocation.name) {
                    CWObject.securityLocation.name = JSONData[i].securityLocation.name;
                } else {
                    CWObject.securityLocation.name = '';
                }
            }

            if (JSONData[i].defaultLocation) {
                if (JSONData[i].defaultLocation.id) {
                    CWObject.defaultLocation.id = JSONData[i].defaultLocation.id.toFixed(0);
                } else {
                    CWObject.defaultLocation.id = '';
                }
                if (JSONData[i].defaultLocation.name) {
                    CWObject.defaultLocation.name = JSONData[i].defaultLocation.name;
                } else {
                    CWObject.defaultLocation.name = '';
                }
            }

            if (JSONData[i].defaultDepartment) {
                if (JSONData[i].defaultDepartment.id) {
                    CWObject.defaultDepartment.id = JSONData[i].defaultDepartment.id.toFixed(0);
                } else {
                    CWObject.defaultDepartment.id = '';
                }
                if (JSONData[i].defaultDepartment.name) {
                    CWObject.defaultDepartment.name = JSONData[i].defaultDepartment.name;
                } else {
                    CWObject.defaultDepartment.name = '';
                }
            }

            if (JSONData[i].workRole) {
                if (JSONData[i].workRole.id) {
                    CWObject.workRole.id = JSONData[i].workRole.id.toFixed(0);
                } else {
                    CWObject.workRole.id = '';
                }
                if (JSONData[i].workRole.name) {
                    CWObject.workRole.name = JSONData[i].workRole.name;
                } else {
                    CWObject.workRole.name = '';
                }
            }

            if (JSONData[i].workType) {
                if (JSONData[i].workType.id) {
                    CWObject.workType.id = JSONData[i].workType.id.toFixed(0);
                } else {
                    CWObject.workType.id = '';
                }
                if (JSONData[i].workType.name) {
                    CWObject.workType.name = JSONData[i].workType.name;
                } else {
                    CWObject.workType.name = '';
                }
            }

            if (JSONData[i].billableForecast) {
                CWObject.billableForecast = JSONData[i].billableForecast;
            } else {
                CWObject.billableForecast = 0;
            }

            if (JSONData[i].dailyCapacity) {
                CWObject.dailyCapacity = JSONData[i].dailyCapacity;
            } else {
                CWObject.dailyCapacity = 0;
            }

            if (JSONData[i].hourlyCost) {
                CWObject.hourlyCost = JSONData[i].hourlyCost;
            } else {
                CWObject.hourlyCost = 0;
            }

            if (JSONData[i].hourlyRate) {
                CWObject.hourlyRate = JSONData[i].hourlyRate;
            } else {
                CWObject.hourlyRate = 0;
            }

            if (JSONData[i].daysTolerance) {
                CWObject.daysTolerance = JSONData[i].daysTolerance;
            } else {
                CWObject.daysTolerance = '';
            }

            if (JSONData[i].minimumHours) {
                CWObject.minimumHours = JSONData[i].minimumHours;
            } else {
                CWObject.minimumHours = 0;
            }

            if (JSONData[i].hireDate) {
                CWObject.hireDate = JSONData[i].hireDate;
            } else {
                CWObject.hireDate = '';
            }

            if (JSONData[i].serviceDefaultLocation) {
                if (JSONData[i].serviceDefaultLocation.id) {
                    CWObject.serviceDefaultLocation.id = JSONData[i].serviceDefaultLocation.id.toFixed(0);
                } else {
                    CWObject.serviceDefaultLocation.id = '';
                }
                if (JSONData[i].serviceDefaultLocation.name) {
                    CWObject.serviceDefaultLocation.name = JSONData[i].serviceDefaultLocation.name;
                } else {
                    CWObject.serviceDefaultLocation.name = '';
                }
            }

            if (JSONData[i].serviceDefaultDepartment) {
                if (JSONData[i].serviceDefaultDepartment.id) {
                    CWObject.serviceDefaultDepartment.id = JSONData[i].serviceDefaultDepartment.id.toFixed(0);
                } else {
                    CWObject.serviceDefaultDepartment.id = '';
                }
                if (JSONData[i].serviceDefaultDepartment.name) {
                    CWObject.serviceDefaultDepartment.name = JSONData[i].serviceDefaultDepartment.name;
                } else {
                    CWObject.serviceDefaultDepartment.name = '';
                }
            }

            if (JSONData[i].serviceDefaultBoard) {
                if (JSONData[i].serviceDefaultBoard.id) {
                    CWObject.serviceDefaultBoard.id = JSONData[i].serviceDefaultBoard.id.toFixed(0);
                } else {
                    CWObject.serviceDefaultBoard.id = '';
                }
                if (JSONData[i].serviceDefaultBoard.name) {
                    CWObject.serviceDefaultBoard.name = JSONData[i].serviceDefaultBoard.name;
                } else {
                    CWObject.serviceDefaultBoard.name = '';
                }
            }

            if (JSONData[i].projectDefaultLocation) {
                if (JSONData[i].projectDefaultLocation.id) {
                    CWObject.projectDefaultLocation.id = JSONData[i].projectDefaultLocation.id.toFixed(0);
                } else {
                    CWObject.projectDefaultLocation.id = '';
                }
                if (JSONData[i].projectDefaultLocation.name) {
                    CWObject.projectDefaultLocation.name = JSONData[i].projectDefaultLocation.name;
                } else {
                    CWObject.projectDefaultLocation.name = '';
                }
            }

            if (JSONData[i].projectDefaultDepartment) {
                if (JSONData[i].projectDefaultDepartment.id) {
                    CWObject.projectDefaultDepartment.id = JSONData[i].projectDefaultDepartment.id.toFixed(0);
                } else {
                    CWObject.projectDefaultDepartment.id = '';
                }
                if (JSONData[i].projectDefaultDepartment.name) {
                    CWObject.projectDefaultDepartment.name = JSONData[i].projectDefaultDepartment.name;
                } else {
                    CWObject.projectDefaultDepartment.name = '';
                }
            }

            if (JSONData[i].projectDefaultBoard) {
                if (JSONData[i].projectDefaultBoard.id) {
                    CWObject.projectDefaultBoard.id = JSONData[i].projectDefaultBoard.id.toFixed(0);
                } else {
                    CWObject.projectDefaultBoard.id = '';
                }
                if (JSONData[i].projectDefaultBoard.name) {
                    CWObject.projectDefaultBoard.name = JSONData[i].projectDefaultBoard.name;
                } else {
                    CWObject.projectDefaultBoard.name = '';
                }
            }

            if (JSONData[i].scheduleDefaultLocation) {
                if (JSONData[i].scheduleDefaultLocation.id) {
                    CWObject.scheduleDefaultLocation.id = JSONData[i].scheduleDefaultLocation.id.toFixed(0);
                } else {
                    CWObject.scheduleDefaultLocation.id = '';
                }
                if (JSONData[i].scheduleDefaultLocation.name) {
                    CWObject.scheduleDefaultLocation.name = JSONData[i].scheduleDefaultLocation.name;
                } else {
                    CWObject.scheduleDefaultLocation.name = '';
                }
            }

            if (JSONData[i].scheduleDefaultDepartment) {
                if (JSONData[i].scheduleDefaultDepartment.id) {
                    CWObject.scheduleDefaultDepartment.id = JSONData[i].scheduleDefaultDepartment.id.toFixed(0);
                } else {
                    CWObject.scheduleDefaultDepartment.id = '';
                }
                if (JSONData[i].scheduleDefaultDepartment.name) {
                    CWObject.scheduleDefaultDepartment.name = JSONData[i].scheduleDefaultDepartment.name;
                } else {
                    CWObject.scheduleDefaultDepartment.name = '';
                }
            }

            if (JSONData[i].serviceLocation) {
                if (JSONData[i].serviceLocation.id) {
                    CWObject.serviceLocation.id = JSONData[i].serviceLocation.id.toFixed(0);
                } else {
                    CWObject.serviceLocation.id = '';
                }
                if (JSONData[i].serviceLocation.name) {
                    CWObject.serviceLocation.name = JSONData[i].serviceLocation.name;
                } else {
                    CWObject.serviceLocation.name = '';
                }
            }

            if (JSONData[i].salesDefaultLocation) {
                if (JSONData[i].salesDefaultLocation.id) {
                    CWObject.salesDefaultLocation.id = JSONData[i].salesDefaultLocation.id.toFixed(0);
                } else {
                    CWObject.salesDefaultLocation.id = '';
                }
                if (JSONData[i].salesDefaultLocation.name) {
                    CWObject.salesDefaultLocation.name = JSONData[i].salesDefaultLocation.name;
                } else {
                    CWObject.salesDefaultLocation.name = '';
                }
            }

            if (JSONData[i].scheduleCapacity) {
                CWObject.scheduleCapacity = JSONData[i].scheduleCapacity;
            } else {
                CWObject.scheduleCapacity = '';
            }

            if (JSONData[i].timeSheetStartDate) {
                CWObject.timeSheetStartDate = JSONData[i].timeSheetStartDate;
            } else {
                CWObject.timeSheetStartDate = '';
            }

            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object SO ID: ' + i, stringErr);
            }


            // 1 = Not Started
            CWObject.conversionstatus = 1;

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getExpenseReport(pageNumber, pageSize, overrideKeyDate, cwAccountId, orderBy, orderByDescending, customParameter, dateFilterOperator) {
    var JSONDataArray = [];

    var JSONData = getJSONData(EXPENSE_REPORT_REQ_STRING, getPageCount(EXPENSE_REPORT_REQ_STRING, pageSize, overrideKeyDate, cwAccountId, customParameter, dateFilterOperator).pageCount, pageSize, pageNumber, overrideKeyDate, orderBy, orderByDescending, cwAccountId, customParameter, dateFilterOperator); //TODO: for new dashboard ui, changed 3/31/2022
    if (JSONData) {

        for (var i = 0; i < JSONData.length; i++) {

            //build cw object based on json JSONPayload
            var CWObject = new CWExpenseReport();

            CWObject.id = JSONData[i].id.toFixed(0);
            CWObject.name = 'CWEXR' + JSONData[i].id + '-' + cwAccountId;

            if (JSONData[i].member) {
                if (JSONData[i].member.id) {
                    CWObject.member.id = JSONData[i].member.id.toFixed(0);
                } else {
                    CWObject.member.id = '';
                }
                if (JSONData[i].member.name) {
                    CWObject.member.name = JSONData[i].member.name;
                } else {
                    CWObject.member.name = '';
                }
            }


            if (JSONData[i].year) {
                CWObject.year = JSONData[i].year.toFixed(0);
            } else {
                CWObject.year = '';
            }

            if (JSONData[i].period) {
                CWObject.period = JSONData[i].period.toFixed(0);
            } else {
                CWObject.period = '';
            }

            if (JSONData[i].status) {
                CWObject.status = JSONData[i].status;
            } else {
                CWObject.status = '';
            }

            if (JSONData[i].total) {
                CWObject.total = JSONData[i].total;
            } else {
                CWObject.total = 0;
            }


            if (JSONData[i].dateStart) {
                CWObject.dateStart = convertJSONStringToDate(JSONData[i].dateStart);
            } else {
                CWObject.dateStart = '';
            }


            if (JSONData[i].dateEnd) {
                CWObject.dateEnd = convertJSONStringToDate(JSONData[i].dateEnd);
            } else {
                CWObject.dateEnd = '';
            }


            if (JSONData[i].dueDate) {
                CWObject.dueDate = convertJSONStringToDate(JSONData[i].dueDate);
            } else {
                CWObject.dueDate = '';
            }


            if (JSONData[i]._info) {
                if (JSONData[i]._info.lastUpdated) {
                    CWObject.lastUpdated = JSONData[i]._info.lastUpdated;
                } else {
                    CWObject.lastUpdated = '';
                }
                if (JSONData[i]._info.updatedBy) {
                    CWObject.updatedBy = JSONData[i]._info.updatedBy;
                } else {
                    CWObject.updatedBy = '';
                }
            }

            if (JSONData[i].customFields) {
                CWObject.customFields = JSONData[i].customFields;
            }

            //extract entire payload to a field
            try {
                if (JSONData[i]) {
                    CWObject.payload = JSON.stringify(JSONData[i]);
                } else {
                    CWObject.payload = '';
                }
            } catch (stringErr) {
                nlapiLogExecution('ERROR', 'Could not stringify JSON Object SO ID: ' + i, stringErr);
            }

            // 1 = Not Started
            CWObject.conversionstatus = 1;

            JSONDataArray.push(CWObject);
        }
    }
    return JSONDataArray;
}

function getProjectConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('externalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_typename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_statusname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_description'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_companyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_depname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_billingamount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_billtime'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_billingmethod'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_esthours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_budgethours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_actualstart'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_actualhours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_actualend'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_convertstat'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_log'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_boardid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_contactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_departmentid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_managerid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_companylocid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_statusid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_typeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_schedstart'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_schedend'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_projects_esttimerev'));
    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_projects_convertstat', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_projects_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_projects_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_projects', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;


    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;
    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWCompany();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.externalid = (resultSet[i].getValue('externalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_projects_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.type.name = (resultSet[i].getValue('custrecord_ctc_cw_projects_typename'));
            CWObject.status.name = (resultSet[i].getValue('custrecord_ctc_cw_projects_statusname'));
            CWObject.description = (resultSet[i].getValue('custrecord_ctc_cw_projects_description'));
            CWObject.companyname = (resultSet[i].getValue('custrecord_ctc_cw_projects_companyname'));
            CWObject.companynametext = (resultSet[i].getText('custrecord_ctc_cw_projects_companyname'));
            CWObject.deptName = (resultSet[i].getValue('custrecord_ctc_cw_projects_depname'));
            CWObject.billingAmount = (resultSet[i].getValue('custrecord_ctc_cw_projects_billingamount'));
            CWObject.billTime = (resultSet[i].getValue('custrecord_ctc_cw_projects_billtime'));
            CWObject.billingMethod = (resultSet[i].getValue('custrecord_ctc_cw_projects_billingmethod'));
            CWObject.estHours = (resultSet[i].getValue('custrecord_ctc_cw_projects_esthours'));
            CWObject.budgetHours = (resultSet[i].getValue('custrecord_ctc_cw_projects_budgethours'));
            CWObject.actualStart = (resultSet[i].getValue('custrecord_ctc_cw_projects_actualstart'));
            CWObject.actualHours = (resultSet[i].getValue('custrecord_ctc_cw_projects_actualhours'));
            CWObject.actualEnd = (resultSet[i].getValue('custrecord_ctc_cw_projects_actualend'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_projects_convertstat'));
            CWObject.conversionlog = (resultSet[i].getValue('custrecord_ctc_cw_projects_log'));
            CWObject.boardId = (resultSet[i].getValue('custrecord_ctc_cw_projects_boardid'));
            CWObject.billingContactid = (resultSet[i].getValue('custrecord_ctc_cw_projects_contactid'));
            CWObject.departmentid = (resultSet[i].getValue('custrecord_ctc_cw_projects_departmentid'));
            CWObject.managerid = (resultSet[i].getValue('custrecord_ctc_cw_projects_managerid'));
            CWObject.locationid = (resultSet[i].getValue('custrecord_ctc_cw_projects_companylocid'));
            CWObject.companyid = (resultSet[i].getValue('custrecord_ctc_cw_projects_companyid'));
            CWObject.schedStart = (resultSet[i].getValue('custrecord_ctc_cw_projects_schedstart'));
            CWObject.schedEnd = (resultSet[i].getValue('custrecord_ctc_cw_projects_schedend'));
            CWObject.typeIds = (resultSet[i].getValue('custrecord_ctc_cw_projects_typeid'));
            CWObject.estRevenue = (resultSet[i].getValue('custrecord_ctc_cw_projects_esttimerev'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getAgreementConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_typename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_invoicedesc'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_companyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_locationname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_depname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_invoicecycle'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_billexpenses'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_billtime'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_billamount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_billdate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_comphrrate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_complimitamt'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_empcomprate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_convertstat'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_log'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_nsprojlink'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_contactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_depid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_billcycleid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_locationid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_typeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agreement_lastupdated'));
    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agreement_convertstat', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agreement_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agreement_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_agreement', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;


    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;
    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWCompany();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_agreement_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.typename = (resultSet[i].getValue('custrecord_ctc_cw_agreement_typename'));
            CWObject.status = (resultSet[i].getValue('custrecord_ctc_cw_agreement_status'));
            CWObject.description = (resultSet[i].getValue('custrecord_ctc_cw_agreement_invoicedesc'));
            CWObject.companyname = (resultSet[i].getValue('custrecord_ctc_cw_agreement_companyname'));
            CWObject.companynametext = (resultSet[i].getText('custrecord_ctc_cw_agreement_companyname'));
            CWObject.locName = (resultSet[i].getValue('custrecord_ctc_cw_agreement_locationname'));
            CWObject.deptName = (resultSet[i].getValue('custrecord_ctc_cw_agreement_depname'));
            CWObject.billExpense = (resultSet[i].getValue('custrecord_ctc_cw_agreement_billexpenses'));
            CWObject.billTime = (resultSet[i].getValue('custrecord_ctc_cw_agreement_billtime'));
            CWObject.billAmount = (resultSet[i].getValue('custrecord_ctc_cw_agreement_billamount'));
            CWObject.billDate = (resultSet[i].getValue('custrecord_ctc_cw_agreement_billdate'));
            CWObject.compRate = (resultSet[i].getValue('custrecord_ctc_cw_agreement_comphrrate'));
            CWObject.compLimitAmnt = (resultSet[i].getValue('custrecord_ctc_cw_agreement_complimitamt'));
            CWObject.empCompRate = (resultSet[i].getValue('custrecord_ctc_cw_agreement_empcomprate'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_agreement_convertstat'));
            CWObject.conversionlog = (resultSet[i].getValue('custrecord_ctc_cw_agreement_log'));
            CWObject.projLink = (resultSet[i].getValue('custrecord_ctc_cw_agreement_nsprojlink'));
            CWObject.companyid = (resultSet[i].getValue('custrecord_ctc_cw_agreement_companyid'));
            CWObject.contactid = (resultSet[i].getValue('custrecord_ctc_cw_agreement_contactid'));
            CWObject.depid = (resultSet[i].getValue('custrecord_ctc_cw_agreement_depid'));
            CWObject.billCycleId = (resultSet[i].getValue('custrecord_ctc_cw_agreement_billcycleid'));
            CWObject.locationid = (resultSet[i].getValue('custrecord_ctc_cw_agreement_locationid'));
            CWObject.typeIds = (resultSet[i].getValue('custrecord_ctc_cw_agreement_typeid'));
            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_agreement_lastupdated'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}


function getExpenseReportConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_duedate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_datestart'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_dateend'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_year'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_period'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_total'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_memberlink'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_memberid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_updatedby'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_lastupdated'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_conversionstat'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_convertmessage'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_exprep_dispname'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_exprep_conversionstat', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_exprep_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_exprep_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_expensereport', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;


    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;
    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWExpenseReport();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_exprep_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.member.id = (resultSet[i].getValue('custrecord_ctc_cw_exprep_memberid'));
            CWObject.member.name = (resultSet[i].getValue('custrecord_ctc_cw_exprep_memberlink'));
            CWObject.member.nameText = (resultSet[i].getText('custrecord_ctc_cw_exprep_memberlink'));
            CWObject.period = (resultSet[i].getValue('custrecord_ctc_cw_exprep_period'));
            CWObject.year = (resultSet[i].getValue('custrecord_ctc_cw_exprep_year'));
            CWObject.status = (resultSet[i].getValue('custrecord_ctc_cw_exprep_status'));
            CWObject.total = (resultSet[i].getValue('custrecord_ctc_cw_exprep_total'));
            CWObject.dateStart = (resultSet[i].getValue('custrecord_ctc_cw_exprep_datestart'));
            CWObject.dateEnd = (resultSet[i].getValue('custrecord_ctc_cw_exprep_dateend'));
            CWObject.dueDate = (resultSet[i].getValue('custrecord_ctc_cw_exprep_duedate'));
            CWObject.memberDisplayName = (resultSet[i].getValue('custrecord_ctc_cw_exprep_dispname'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getCompanyConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_type'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_website'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_territory'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_primaryphone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_addr1'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_addr2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_countryname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_city'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_state'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_zip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_contactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_contactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_conversionstatus'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_convertmessage'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_vendorflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_faxnumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_identifier'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_billcontactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_billcontactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_currencycode'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_typeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_dontconvertcus'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_invemail'));
    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_cmp_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_cmp_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_cmp_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_cmp', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;


    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;
    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWCompany();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_cmp_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.type.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_type'));
            CWObject.status.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_status'));
            CWObject.website = (resultSet[i].getValue('custrecord_ctc_cw_cmp_website'));
            CWObject.territory.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_territory'));
            CWObject.phoneNumber = (resultSet[i].getValue('custrecord_ctc_cw_cmp_primaryphone'));
            CWObject.addressLine1 = (resultSet[i].getValue('custrecord_ctc_cw_cmp_addr1'));
            CWObject.addressLine2 = (resultSet[i].getValue('custrecord_ctc_cw_cmp_addr2'));
            CWObject.country.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_countryname'));
            CWObject.city = (resultSet[i].getValue('custrecord_ctc_cw_cmp_city'));
            CWObject.state = (resultSet[i].getValue('custrecord_ctc_cw_cmp_state'));
            CWObject.zip = (resultSet[i].getValue('custrecord_ctc_cw_cmp_zip'));
            CWObject.defaultContact.id = (resultSet[i].getValue('custrecord_ctc_cw_cmp_contactid'));
            CWObject.defaultContact.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_contactname'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_cmp_conversionstatus'));
            CWObject.vendorFlag = (resultSet[i].getValue('custrecord_ctc_cw_cmp_vendorflag'));
            CWObject.faxNumber = (resultSet[i].getValue('custrecord_ctc_cw_cmp_faxnumber'));
            CWObject.identifier = (resultSet[i].getValue('custrecord_ctc_cw_cmp_identifier'));
            CWObject.billingContact.id = (resultSet[i].getValue('custrecord_ctc_cw_cmp_billcontactid'));
            CWObject.billingContact.name = (resultSet[i].getValue('custrecord_ctc_cw_cmp_billcontactname'));
            CWObject.currency.currencyCode = (resultSet[i].getValue('custrecord_ctc_cw_cmp_currencycode'));
            CWObject.typeIds = (resultSet[i].getValue('custrecord_ctc_cw_cmp_typeid'));
            CWObject.dontcnvcus = (resultSet[i].getValue('custrecord_ctc_cw_cmp_dontconvertcus'));
            CWObject.invoiceToEmailAddress = (resultSet[i].getValue('custrecord_ctc_cw_cmp_invemail'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getSavedSearchCount(searchType, convertStatusName, pageSize, invoiceDateParam, cwAccountIdSearchField, cwAccountId) {
    var queryCount = {};
    var recordCount = 0;
    var columns = [];

    columns.push(new nlobjSearchColumn('internalid', null, 'COUNT'));

    var convertStatus = [CONVERT_STATUS_NOTSTARTED, CONVERT_STATUS_FAILED]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter(convertStatusName, null, 'anyof', convertStatus));


    if (cwAccountIdSearchField && cwAccountId)
        filterArr.push(new nlobjSearchFilter(cwAccountIdSearchField, null, 'anyof', cwAccountId));

    //added 11/30/2023 - time entry conversion filter
    if (searchType == 'customrecord_ctc_cw_time') {
        var timeDateParam = invoiceDateParam;
        if (timeDateParam) {
            var timeDateParam_split = timeDateParam.split("|");
            //start date and end date
            if (timeDateParam_split) {
                if (timeDateParam_split.length > 0) {
                    if (timeDateParam_split[0] && timeDateParam_split[0] != '' && timeDateParam_split[0] != 'undefined' && timeDateParam_split[0] != 'null') {
                        var timeDateFormula1 = "CASE WHEN TO_DATE(REGEXP_SUBSTR({custrecord_ctc_cw_time_timestart}, '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])'), 'YYYY-MM-DD') >= '" + timeDateParam_split[0] + "' THEN 1 ELSE 0 END";
                        filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(timeDateFormula1));
                        nlapiLogExecution('AUDIT', '[count] Time Start Date Filter Detected', 'Formula to Use: ' + timeDateFormula1);
                    } else {
                        nlapiLogExecution('AUDIT', '[count] No Time Start Date filter');
                    }
                    if (timeDateParam_split[1] && timeDateParam_split[1] != '' && timeDateParam_split[1] != 'undefined' && timeDateParam_split[1] != 'null') {
                        var timeDateFormula2 = "CASE WHEN TO_DATE(REGEXP_SUBSTR({custrecord_ctc_cw_time_timestart}, '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])'), 'YYYY-MM-DD') <= '" + timeDateParam_split[1] + "' THEN 1 ELSE 0 END";
                        filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(timeDateFormula2));
                        nlapiLogExecution('AUDIT', '[count] Time End Date Filter Detected', 'Formula to Use: ' + timeDateFormula2);
                    } else {
                        nlapiLogExecution('AUDIT', '[count] No Time End Date filter');
                    }
                }
            }

        }
    }

    //specifically for invoice
    if (searchType == 'customrecord_ctc_cw_invoices') {
        if (invoiceDateParam)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_date', null, 'within', invoiceDateParam, new Date()));

        var downpaymentEnabled = getGlobalSetting('custrecord_ctc_cw_settings_dp_enableconv', cwAccountId);
        var creditMemoEnabled = getGlobalSetting('custrecord_ctc_cw_settings_cm_enableconv', cwAccountId);
        var downpaymentIdentifier = getGlobalSetting('custrecord_ctc_cw_settings_dp_name', cwAccountId);
        var creditMemoIdentifier = getGlobalSetting('custrecord_ctc_cw_settings_cm_name', cwAccountId);

        if (creditMemoEnabled == 'T' && downpaymentEnabled == 'F') {
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', downpaymentIdentifier));
        }

        if (creditMemoEnabled == 'F' && downpaymentEnabled == 'T') {
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', creditMemoIdentifier));
        }

        if (creditMemoEnabled == 'F' && downpaymentEnabled == 'F') {
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', downpaymentIdentifier));
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', creditMemoIdentifier));
        }
    }

    var results = nlapiSearchRecord(searchType, null, filterArr, columns);

    if (results) {
        var allColumns = results[0].getAllColumns();
        recordCount = results[0].getValue(allColumns[0]);
    }

    var defaultPageSize;
    if (pageSize == null) {
        defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
    } else {
        defaultPageSize = pageSize;
    }

    queryCount.pageCount = Math.ceil(Number(recordCount / defaultPageSize));
    queryCount.recordCount = recordCount;

    return queryCount;
}

function getContactConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_title'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_firstname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_lastname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_email'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_phonenumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_company'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cnt_convertmessage'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cnt_contactlink'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_addr1'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_addr2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_city'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_state'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_zip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_country'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_siteid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_sitename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_typename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_typeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_contacts_inactiveflag'))
    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_contacts_status', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_contacts_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_contacts_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_contacts', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;


    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        //nlapiLogExecution('DEBUG', 'Resultset Length', resultSet.length);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWContact();
            //nlapiLogExecution('DEBUG', resultSet[i].getValue('internalid'));
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_contacts_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.title = (resultSet[i].getValue('custrecord_ctc_cw_contacts_title'));
            CWObject.firstName = (resultSet[i].getValue('custrecord_ctc_cw_contacts_firstname'));
            CWObject.lastName = (resultSet[i].getValue('custrecord_ctc_cw_contacts_lastname'));

            CWObject.defaultEmail = (resultSet[i].getValue('custrecord_ctc_cw_contacts_email'));
            CWObject.defaultPhone = (resultSet[i].getValue('custrecord_ctc_cw_contacts_phonenumber'));
            CWObject.company.id = (resultSet[i].getValue('custrecord_ctc_cw_contacts_companyid'));
            CWObject.company.name = (resultSet[i].getValue('custrecord_ctc_cw_contacts_company'));
            CWObject.company.nameText = (resultSet[i].getText('custrecord_ctc_cw_contacts_company'));

            CWObject.addressLine1 = (resultSet[i].getValue('custrecord_ctc_cw_contacts_addr1'));
            CWObject.addressLine2 = (resultSet[i].getValue('custrecord_ctc_cw_contacts_addr2'));
            CWObject.city = (resultSet[i].getValue('custrecord_ctc_cw_contacts_city'));
            CWObject.state = (resultSet[i].getValue('custrecord_ctc_cw_contacts_state'));
            CWObject.zip = (resultSet[i].getValue('custrecord_ctc_cw_contacts_zip'));
            CWObject.country.name = (resultSet[i].getValue('custrecord_ctc_cw_contacts_country'));
            CWObject.site.id = (resultSet[i].getValue('custrecord_ctc_cw_contacts_siteid'));
            CWObject.site.name = (resultSet[i].getValue('custrecord_ctc_cw_contacts_sitename'));
            CWObject.types.name = (resultSet[i].getValue('custrecord_ctc_cw_contacts_typename'));
            CWObject.types.id = (resultSet[i].getValue('custrecord_ctc_cw_contacts_typeid'));
            CWObject.inactiveFlag = (resultSet[i].getValue('custrecord_ctc_cw_contacts_inactiveflag'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_contacts_status'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getItemConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    var convertItemWithInvoiceOnly = getGlobalSetting('custrecord_ctc_cw_settings_iteminvonly', cwAccountId);

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_description'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_price'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_cost'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_taxableflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_dropshipflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_specialorderflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_custdescription'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_productclass'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_conversionstatus'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_itemlink'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_mapping'));
    colArr.push(new nlobjSearchColumn('custrecord_cw_item_convertmessage'));


    //new additions 6/16/2020
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_categoryid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_categoryname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_subcategoryid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_subcategoryname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_typeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_typename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_expaccount'));

    //added 9/13/2021 - item type and subtype specific fields
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_conv_type'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_conv_subtype'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_cogsaccount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_item_assetaccount'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_item_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_item_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_item_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_item', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWItem();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_item_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.description = (resultSet[i].getValue('custrecord_ctc_cw_item_description'));
            CWObject.price = (resultSet[i].getValue('custrecord_ctc_cw_item_price'));
            CWObject.cost = (resultSet[i].getValue('custrecord_ctc_cw_item_cost'));
            CWObject.taxableFlag = (resultSet[i].getValue('custrecord_ctc_cw_item_taxableflag'));
            CWObject.dropshipFlag = (resultSet[i].getValue('custrecord_ctc_cw_item_dropshipflag'));
            CWObject.specialOrderFlag = (resultSet[i].getValue('custrecord_ctc_cw_item_specialorderflag'));
            CWObject.customerDescription = (resultSet[i].getValue('custrecord_ctc_cw_item_custdescription'));
            CWObject.incomeaccount = (resultSet[i].getValue('custrecord_ctc_cw_item_mapping'));
            CWObject.incomeaccountName = (resultSet[i].getText('custrecord_ctc_cw_item_mapping'));
            CWObject.productClass = (resultSet[i].getValue('custrecord_ctc_cw_item_productclass'));

            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_cmp_conversionstatus'));

            CWObject.category.id = (resultSet[i].getValue('custrecord_ctc_cw_item_categoryid'));
            CWObject.category.name = (resultSet[i].getValue('custrecord_ctc_cw_item_categoryname'));
            CWObject.subcategory.id = (resultSet[i].getValue('custrecord_ctc_cw_item_subcategoryid'));
            CWObject.subcategory.name = (resultSet[i].getValue('custrecord_ctc_cw_item_subcategoryname'));
            CWObject.type.id = (resultSet[i].getValue('custrecord_ctc_cw_item_typeid'));
            CWObject.type.name = (resultSet[i].getValue('custrecord_ctc_cw_item_typename'));
            CWObject.expenseaccount = (resultSet[i].getValue('custrecord_ctc_cw_item_expaccount'));
            CWObject.expenseaccountName = (resultSet[i].getText('custrecord_ctc_cw_item_expaccount'));
            CWObject.cogsaccount = (resultSet[i].getValue('custrecord_ctc_cw_item_cogsaccount'));
            CWObject.assetaccount = (resultSet[i].getValue('custrecord_ctc_cw_item_assetaccount'));

            CWObject.nstype = (resultSet[i].getValue('custrecord_ctc_cw_item_conv_type'))
            CWObject.nssubtype = (resultSet[i].getValue('custrecord_ctc_cw_item_conv_subtype'));

            JSONDataArray.push(CWObject);

        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function checkItemWithInvoice(cwItemId, cwAccountId) {
    var itemHasInvoice = false;

    //search for product entries that use this item and check if it has an invoice
    var col = [];
    var filter = [];


    col[0] = new nlobjSearchColumn('custrecord_ctc_cw_invitem_catalogid');
    col[1] = new nlobjSearchColumn('custrecord_ctc_cw_invitem_id');

    filter[0] = new nlobjSearchFilter('custrecord_ctc_cw_invitem_catalogid', null, 'equalto', cwItemId);
    filter[1] = new nlobjSearchFilter('custrecord_ctc_cw_invitem_invoiceid', null, 'isnotempty');

    if (cwAccountId)
        filter[2] = new nlobjSearchFilter('custrecord_ctc_cw_invitem_cwaccount', null, 'anyof', cwAccountId);

    var searchResults = nlapiSearchRecord('customrecord_ctc_cw_invoice_items', null, filter, col);

    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            itemHasInvoice = true;
            return itemHasInvoice;
        }
    }

    return itemHasInvoice;
}

function getInvoiceConvertData(pageNumber, pageSize, invoiceDateParam, convertStatus, singleConvertId, cwAccountId) {

    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_id'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_invoicenumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_type'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_companyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billtocompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billtocompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shiptocompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shiptocompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_duedate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_date'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_attention'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_reference'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_servicetotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_expensetotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_producttotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_subtotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_total'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_salestax'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_currency'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_agreementlink'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_agreementamount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_conversionstatus'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_convertmessage'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_paymenttotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_agreementamountbdy'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_customerpo'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_statusname'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsiteaddr1'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsiteaddr2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsitecity'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsitecountry'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsitestate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_billsitezip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsiteaddr1'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsiteaddr2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsitecity'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsitecountry'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsitestate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipsitezip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_shipattn'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_downpaymentapplied'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_applytotype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_applytoid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_lastupdated'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_templatename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_agreementid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_prevprogapplied'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_projectid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_projectname'));

    //added 10/29/2023
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_phaseid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_phasename'));

    //added 11/10/2023
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_inv_serviceadjamt'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId) {
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_id', null, 'equalto', singleConvertId));
    } else {
        //for invoice date param
        if (invoiceDateParam)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_date', null, 'within', invoiceDateParam, new Date()));
    }

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_cwaccount', null, 'anyof', cwAccountId));

    //added 2/2/2022 - inactive cw invoices will not be processed
    filterArr.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));

    var downpaymentEnabled = getGlobalSetting('custrecord_ctc_cw_settings_dp_enableconv', cwAccountId);
    var creditMemoEnabled = getGlobalSetting('custrecord_ctc_cw_settings_cm_enableconv', cwAccountId);
    var downpaymentIdentifier = getGlobalSetting('custrecord_ctc_cw_settings_dp_name', cwAccountId);
    var creditMemoIdentifier = getGlobalSetting('custrecord_ctc_cw_settings_cm_name', cwAccountId);

    if (creditMemoEnabled == 'T' && downpaymentEnabled == 'F') {
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', downpaymentIdentifier));
    }

    if (creditMemoEnabled == 'F' && downpaymentEnabled == 'T') {
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', creditMemoIdentifier));
    }

    if (creditMemoEnabled == 'F' && downpaymentEnabled == 'F') {
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', downpaymentIdentifier));
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_type', null, 'isnot', creditMemoIdentifier));
    }


    var search = nlapiCreateSearch('customrecord_ctc_cw_invoices', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWInvoice();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.invoiceNumber = (resultSet[i].getValue('custrecord_ctc_cw_inv_invoicenumber'));
            CWObject.type = (resultSet[i].getValue('custrecord_ctc_cw_inv_type'));
            CWObject.company.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_companyid'));
            CWObject.company.name = (resultSet[i].getValue('custrecord_ctc_cw_inv_companyname'));
            CWObject.billToCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_billtocompanyid'));
            CWObject.billToCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_inv_billtocompanyname'));
            CWObject.shipToCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_shiptocompanyid'));
            CWObject.shipToCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_inv_shiptocompanyname'));
            CWObject.dueDate = (resultSet[i].getValue('custrecord_ctc_cw_inv_duedate'));
            CWObject.date = (resultSet[i].getValue('custrecord_ctc_cw_inv_date'));
            CWObject.attention = (resultSet[i].getValue('custrecord_ctc_cw_inv_attention'));
            CWObject.reference = (resultSet[i].getValue('custrecord_ctc_cw_inv_reference'));
            CWObject.serviceTotal = (resultSet[i].getValue('custrecord_ctc_cw_inv_servicetotal'));
            CWObject.expenseTotal = (resultSet[i].getValue('custrecord_ctc_cw_inv_expensetotal'));
            CWObject.productTotal = (resultSet[i].getValue('custrecord_ctc_cw_inv_producttotal'));
            CWObject.subtotal = (resultSet[i].getValue('custrecord_ctc_cw_inv_subtotal'));
            CWObject.total = (resultSet[i].getValue('custrecord_ctc_cw_inv_total'));
            CWObject.salesTax = (resultSet[i].getValue('custrecord_ctc_cw_inv_salestax'));
            CWObject.currency = (resultSet[i].getValue('custrecord_ctc_cw_inv_currency'));
            CWObject.agreementapplink = (resultSet[i].getValue('custrecord_ctc_cw_inv_agreementlink'));
            CWObject.agreementappamount = (resultSet[i].getValue('custrecord_ctc_cw_inv_agreementamount'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_inv_conversionstatus'));

            CWObject.billToCompany.nameText = (resultSet[i].getText('custrecord_ctc_cw_inv_billtocompanyname'));
            CWObject.company.nameText = (resultSet[i].getText('custrecord_ctc_cw_inv_companyname'));
            CWObject.payments = (resultSet[i].getValue('custrecord_ctc_cw_inv_paymenttotal'));
            CWObject.agreementAmount = (resultSet[i].getValue('custrecord_ctc_cw_inv_agreementamountbdy'));
            CWObject.customerPO = (resultSet[i].getValue('custrecord_ctc_cw_inv_customerpo'));
            CWObject.statusname = (resultSet[i].getValue('custrecord_ctc_cw_inv_statusname'));

            CWObject.billingSiteAddressLine1 = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsiteaddr1'));
            CWObject.billingSiteAddressLine2 = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsiteaddr2'));
            CWObject.billingSiteCity = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsitecity'));
            CWObject.billingSiteCountry = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsitecountry'));
            CWObject.billingSiteState = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsitestate'));
            CWObject.billingSiteZip = (resultSet[i].getValue('custrecord_ctc_cw_inv_billsitezip'));

            CWObject.shippingSiteAddressLine1 = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsiteaddr1'));
            CWObject.shippingSiteAddressLine2 = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsiteaddr2'));
            CWObject.shippingSiteCity = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsitecity'));
            CWObject.shippingSiteCountry = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsitecountry'));
            CWObject.shippingSiteState = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsitestate'));
            CWObject.shippingSiteZip = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipsitezip'));

            CWObject.shipToAttention = (resultSet[i].getValue('custrecord_ctc_cw_inv_shipattn'));
            CWObject.shipToCompany.nameText = (resultSet[i].getText('custrecord_ctc_cw_inv_shiptocompanyname'));

            CWObject.downpaymentApplied = (resultSet[i].getValue('custrecord_ctc_cw_inv_downpaymentapplied'));

            CWObject.applyToType = (resultSet[i].getValue('custrecord_ctc_cw_inv_applytotype'));
            CWObject.applyToId = (resultSet[i].getValue('custrecord_ctc_cw_inv_applytoid'));

            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_inv_lastupdated'));
            CWObject.invoiceTemplate = (resultSet[i].getValue('custrecord_ctc_cw_inv_templatename'));
            CWObject.agreementId = (resultSet[i].getValue('custrecord_ctc_cw_inv_agreementid'));
            CWObject.previousProgressApplied = (resultSet[i].getValue('custrecord_ctc_cw_inv_prevprogapplied'));
            CWObject.project.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_projectid'));
            CWObject.project.name = (resultSet[i].getValue('custrecord_ctc_cw_inv_projectname'));
            CWObject.phase.id = (resultSet[i].getValue('custrecord_ctc_cw_inv_phaseid'));
            CWObject.phase.name = (resultSet[i].getValue('custrecord_ctc_cw_inv_phasename'));
            CWObject.serviceAdjustmentAmount = (resultSet[i].getValue('custrecord_ctc_cw_inv_serviceadjamt'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getExpenseTypeConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetypeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetypecaption'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetype_mapping'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetype_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetype_cnvtype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_expensetype_cnvsubtype'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_expensetype_status', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_expensetypeid', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_expensetype_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_expense_type', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWExpenseType();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_expensetypeid'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.amountCaption = (resultSet[i].getValue('custrecord_ctc_cw_expensetypecaption'));
            CWObject.expenseaccount = (resultSet[i].getValue('custrecord_ctc_cw_expensetype_mapping'));
            CWObject.expenseaccountName = (resultSet[i].getText('custrecord_ctc_cw_expensetype_mapping'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_expensetype_status'));
            CWObject.nstype = (resultSet[i].getValue('custrecord_ctc_cw_expensetype_cnvtype'));
            CWObject.nssubtype = (resultSet[i].getValue('custrecord_ctc_cw_expensetype_cnvsubtype'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getWorkTypeConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktypeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktype_mapping'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktype_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktype_cnvtype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktype_cnvsubtype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_worktype_cwaccount'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_worktype_status', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_worktypeid', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_worktype_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_work_type', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWWorkType();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_worktypeid'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.expenseaccount = (resultSet[i].getValue('custrecord_ctc_cw_worktype_mapping'));
            CWObject.expenseaccountName = (resultSet[i].getText('custrecord_ctc_cw_worktype_mapping'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_worktype_status'));

            CWObject.nstype = (resultSet[i].getValue('custrecord_ctc_cw_worktype_cnvtype'));
            CWObject.nssubtype = (resultSet[i].getValue('custrecord_ctc_cw_worktype_cnvsubtype'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getWorkRoleConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workroleid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_hourlyrate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_mapping'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_cnvtype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_cnvsubtype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_cwaccount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_workrole_lastupdated'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_workrole_status', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_workroleid', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_workrole_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_work_role', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWWorkRole();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_workroleid'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.hourlyRate = (resultSet[i].getValue('custrecord_ctc_cw_workrole_hourlyrate'));
            CWObject.inactiveFlag = (resultSet[i].getValue('custrecord_ctc_cw_workrole_inactiveflag'));
            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_workrole_lastupdated'));
            CWObject.incomeAccount = (resultSet[i].getValue('custrecord_ctc_cw_workrole_mapping'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_workrole_status'));

            CWObject.nstype = (resultSet[i].getValue('custrecord_ctc_cw_workrole_cnvtype'));
            CWObject.nssubtype = (resultSet[i].getValue('custrecord_ctc_cw_workrole_cnvsubtype'));
            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getPurchaseOrderConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    nlapiLogExecution('DEBUG', 'Single Convert ID Value for PO: ' + singleConvertId);
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_id'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_businessunitid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_closedflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercontactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercontactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customersiteid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customersitename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_dateclosed'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_dropshipflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_freightcost'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_freightpackingslip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_freighttaxtotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_locationid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_notes'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_podate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_ponumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_salestax'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_shippinginstruction'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_shipdate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_shipmethodid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_shipmethodname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_statusid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_statusname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_subtotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_taxcodeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_taxcodename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_taxfreightflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_taxpoflag'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_termid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_termname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_total'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_trackingnumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorcompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorcompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorcontactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorcontactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorinvoicedate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorinvoicenumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorordernumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorsiteid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_vendorsitename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_warehouseid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_warehousename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_currency'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_lastupdated'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_dateentered'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_conversionstatus'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercity'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerextension'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customername'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerphone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customersitenameds'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerstate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerstreetline1'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerstreetline2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customerzip'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_po_customercountry'));

    //7/26/2023 - Emergency fix, from Driven. Customer assigned for billback line on PO should be the NS Customer Link ID!
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_cmp_link', 'custrecord_ctc_cw_po_customercompanyname'));

    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_po_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_po_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_po_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_po', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWPurchaseOrder();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_po_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.businessUnitId = (resultSet[i].getValue('custrecord_ctc_cw_po_businessunitid'));
            CWObject.closedFlag = (resultSet[i].getValue('custrecord_ctc_cw_po_closedflag'));
            CWObject.customerCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_po_customercompanyid'));
            CWObject.customerCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_po_customercompanyname'));
            CWObject.customerContact.id = (resultSet[i].getValue('custrecord_ctc_cw_po_customercontactid'));
            CWObject.customerContact.name = (resultSet[i].getValue('custrecord_ctc_cw_po_customercontactname'));
            CWObject.customerSite.id = (resultSet[i].getValue('custrecord_ctc_cw_po_customersiteid'));
            CWObject.customerSite.name = (resultSet[i].getValue('custrecord_ctc_cw_po_customersitename'));
            CWObject.dateClosed = (resultSet[i].getValue('custrecord_ctc_cw_po_dateclosed'));
            CWObject.dropShipCustomerFlag = (resultSet[i].getValue('custrecord_ctc_cw_po_dropshipflag'));
            CWObject.freightCost = (resultSet[i].getValue('custrecord_ctc_cw_po_freightcost'));
            CWObject.freightPackingSlip = (resultSet[i].getValue('custrecord_ctc_cw_po_freightpackingslip'));
            CWObject.freightTaxTotal = (resultSet[i].getValue('custrecord_ctc_cw_po_freighttaxtotal'));
            CWObject.locationId = (resultSet[i].getValue('custrecord_ctc_cw_po_locationid'));
            CWObject.internalNotes = (resultSet[i].getValue('custrecord_ctc_cw_po_notes'));
            CWObject.poDate = (resultSet[i].getValue('custrecord_ctc_cw_po_podate'));
            CWObject.poNumber = (resultSet[i].getValue('custrecord_ctc_cw_po_ponumber'));
            CWObject.salesTax = (resultSet[i].getValue('custrecord_ctc_cw_po_salestax'));
            CWObject.shippingInstructions = (resultSet[i].getValue('custrecord_ctc_cw_po_shippinginstruction'));
            CWObject.shipmentDate = (resultSet[i].getValue('custrecord_ctc_cw_po_shipdate'));
            CWObject.shipmentMethod.id = (resultSet[i].getValue('custrecord_ctc_cw_po_shipmethodid'));
            CWObject.shipmentMethod.name = (resultSet[i].getValue('custrecord_ctc_cw_po_shipmethodname'));
            CWObject.status.id = (resultSet[i].getValue('custrecord_ctc_cw_po_statusid'));
            CWObject.status.name = (resultSet[i].getValue('custrecord_ctc_cw_po_statusname'));
            CWObject.subTotal = (resultSet[i].getValue('custrecord_ctc_cw_po_subtotal'));
            CWObject.taxCode.id = (resultSet[i].getValue('custrecord_ctc_cw_po_taxcodeid'));
            CWObject.taxCode.name = (resultSet[i].getValue('custrecord_ctc_cw_po_taxcodename'));
            CWObject.taxFreightFlag = (resultSet[i].getValue('custrecord_ctc_cw_po_taxfreightflag'));
            CWObject.taxPoFlag = (resultSet[i].getValue('custrecord_ctc_cw_po_taxpoflag'));
            CWObject.terms.id = (resultSet[i].getValue('custrecord_ctc_cw_po_termid'));
            CWObject.terms.name = (resultSet[i].getValue('custrecord_ctc_cw_po_termname'));
            CWObject.total = (resultSet[i].getValue('custrecord_ctc_cw_po_total'));
            CWObject.trackingNumber = (resultSet[i].getValue('custrecord_ctc_cw_po_trackingnumber'));
            CWObject.vendorCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorcompanyid'));
            CWObject.vendorCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorcompanyname'));
            CWObject.vendorContact.id = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorcontactid'));
            CWObject.vendorContact.name = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorcontactname'));
            CWObject.vendorInvoiceDate = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorinvoicedate'));
            CWObject.vendorInvoiceNumber = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorinvoicenumber'));
            CWObject.vendorOrderNumber = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorordernumber'));
            CWObject.vendorSite.id = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorsiteid'));
            CWObject.vendorSite.name = (resultSet[i].getValue('custrecord_ctc_cw_po_vendorsitename'));
            CWObject.warehouse.id = (resultSet[i].getValue('custrecord_ctc_cw_po_warehouseid'));
            CWObject.warehouse.name = (resultSet[i].getValue('custrecord_ctc_cw_po_warehousename'));
            CWObject.currency = (resultSet[i].getValue('custrecord_ctc_cw_po_currency'));
            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_po_lastupdated'));
            CWObject.dateEntered = (resultSet[i].getValue('custrecord_ctc_cw_po_dateentered'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_po_conversionstatus'));

            CWObject.customerCity = (resultSet[i].getValue('custrecord_ctc_cw_po_customercity'));
            CWObject.customerExtension = (resultSet[i].getValue('custrecord_ctc_cw_po_customerextension'));
            CWObject.customerName = (resultSet[i].getValue('custrecord_ctc_cw_po_customername'));
            CWObject.customerPhone = (resultSet[i].getValue('custrecord_ctc_cw_po_customerphone'));
            CWObject.customerSiteName = (resultSet[i].getValue('custrecord_ctc_cw_po_customersitenameds'));
            CWObject.customerState = (resultSet[i].getValue('custrecord_ctc_cw_po_customerstate'));
            CWObject.customerStreetLine1 = (resultSet[i].getValue('custrecord_ctc_cw_po_customerstreetline1'));
            CWObject.customerStreetLine2 = (resultSet[i].getValue('custrecord_ctc_cw_po_customerstreetline2'));
            CWObject.customerZip = (resultSet[i].getValue('custrecord_ctc_cw_po_customerzip'));
            CWObject.customerCountry = (resultSet[i].getValue('custrecord_ctc_cw_po_customercountry'));

            CWObject.vendorCompany.nameText = (resultSet[i].getText('custrecord_ctc_cw_po_vendorcompanyname'));
            CWObject.customerCompany.nameText = (resultSet[i].getText('custrecord_ctc_cw_po_customercompanyname'));

            //7/26/2023 - Emergency fix, from Driven. Customer assigned for billback line on PO should be the NS Customer Link ID!
            CWObject.customerCompany.nscustomerlink = (resultSet[i].getValue('custrecord_ctc_cw_cmp_link', 'custrecord_ctc_cw_po_customercompanyname'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getSalesOrderConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    nlapiLogExecution('DEBUG', 'Single Convert ID Value for SO: ' + singleConvertId);
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_id'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_companyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_contactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_contactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_phone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_email'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_statusname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_statusid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_opportunityname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_opportunityid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_orderdate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_duedate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billingtermsname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billingtermsid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_taxcodename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_taxcodeid'))
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_ponumber'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_locationname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_locationid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_departmentname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_departmentid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_salesrepname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_salesrepid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_notes'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_description'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptocompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptocompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptocontactname'))
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptocontactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptositename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_shiptositeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtocompanyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtocompanyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtocontactname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtocontactid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtositename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_billtositeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_productids'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_documentids'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_invoiceids'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_configids'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_total'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_taxtotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_currencycode'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_companylocationid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_subtotal'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_lastupdated'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_updatedby'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_conversionstatus'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_so_cwaccount'));


    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_so_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_so_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_so_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_salesorder', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWSalesOrder();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_so_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.company.name = (resultSet[i].getValue('custrecord_ctc_cw_so_companyname'));
            CWObject.company.nameText = (resultSet[i].getText('custrecord_ctc_cw_so_companyname'));
            CWObject.company.id = (resultSet[i].getValue('custrecord_ctc_cw_so_companyid'));
            CWObject.contact.name = (resultSet[i].getValue('custrecord_ctc_cw_so_contactname'));
            CWObject.contact.id = (resultSet[i].getValue('custrecord_ctc_cw_so_contactid'));
            CWObject.phone = (resultSet[i].getValue('custrecord_ctc_cw_so_phone'));
            CWObject.email = (resultSet[i].getValue('custrecord_ctc_cw_so_email'));
            CWObject.status.name = (resultSet[i].getValue('custrecord_ctc_cw_so_statusname'));
            CWObject.status.id = (resultSet[i].getValue('custrecord_ctc_cw_so_statusid'));
            CWObject.opportunity.name = (resultSet[i].getValue('custrecord_ctc_cw_so_opportunityname'));
            CWObject.opportunity.id = (resultSet[i].getValue('custrecord_ctc_cw_so_opportunityid'));
            CWObject.orderDate = (resultSet[i].getValue('custrecord_ctc_cw_so_orderdate'));
            CWObject.dueDate = (resultSet[i].getValue('custrecord_ctc_cw_so_duedate'));
            CWObject.billingTerms.name = (resultSet[i].getValue('custrecord_ctc_cw_so_billingtermsname'));
            CWObject.billingTerms.id = (resultSet[i].getValue('custrecord_ctc_cw_so_billingtermsid'));
            CWObject.taxCode.name = (resultSet[i].getValue('custrecord_ctc_cw_so_taxcodename'));
            CWObject.taxCode.id = (resultSet[i].getValue('custrecord_ctc_cw_so_taxcodeid'))
            CWObject.poNumber = (resultSet[i].getValue('custrecord_ctc_cw_so_ponumber'));
            CWObject.location.name = (resultSet[i].getValue('custrecord_ctc_cw_so_locationname'));
            CWObject.location.id = (resultSet[i].getValue('custrecord_ctc_cw_so_locationid'));
            CWObject.department.name = (resultSet[i].getValue('custrecord_ctc_cw_so_departmentname'));
            CWObject.department.id = (resultSet[i].getValue('custrecord_ctc_cw_so_departmentid'));
            CWObject.salesRep.name = (resultSet[i].getValue('custrecord_ctc_cw_so_salesrepname'));
            CWObject.salesRep.id = (resultSet[i].getValue('custrecord_ctc_cw_so_salesrepid'));
            CWObject.notes = (resultSet[i].getValue('custrecord_ctc_cw_so_notes'));
            CWObject.description = (resultSet[i].getValue('custrecord_ctc_cw_so_description'));
            CWObject.shipToCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptocompanyname'));
            CWObject.shipToCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptocompanyid'));
            CWObject.shipToContact.name = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptocontactname'))
            CWObject.shipToContact.id = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptocontactid'));
            CWObject.shipToSite.name = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptositename'));
            CWObject.shipToSite.id = (resultSet[i].getValue('custrecord_ctc_cw_so_shiptositeid'));
            CWObject.billToCompany.name = (resultSet[i].getValue('custrecord_ctc_cw_so_billtocompanyname'));
            CWObject.billToCompany.id = (resultSet[i].getValue('custrecord_ctc_cw_so_billtocompanyid'));
            CWObject.billToContact.name = (resultSet[i].getValue('custrecord_ctc_cw_so_billtocontactname'));
            CWObject.billToContact.id = (resultSet[i].getValue('custrecord_ctc_cw_so_billtocontactid'));
            CWObject.billToSite.name = (resultSet[i].getValue('custrecord_ctc_cw_so_billtositename'));
            CWObject.billToSite.id = (resultSet[i].getValue('custrecord_ctc_cw_so_billtositeid'));
            CWObject.productIds = (resultSet[i].getValue('custrecord_ctc_cw_so_productids'));
            CWObject.documentIds = (resultSet[i].getValue('custrecord_ctc_cw_so_documentids'));
            CWObject.invoiceIds = (resultSet[i].getValue('custrecord_ctc_cw_so_invoiceids'));
            CWObject.configIds = (resultSet[i].getValue('custrecord_ctc_cw_so_configids'));
            CWObject.total = (resultSet[i].getValue('custrecord_ctc_cw_so_total'));
            CWObject.taxTotal = (resultSet[i].getValue('custrecord_ctc_cw_so_taxtotal'));
            CWObject.currency.currencyCode = (resultSet[i].getValue('custrecord_ctc_cw_so_currencycode'));
            CWObject.companyLocation.id = (resultSet[i].getValue('custrecord_ctc_cw_so_companylocationid'));
            CWObject.subTotal = (resultSet[i].getValue('custrecord_ctc_cw_so_subtotal'));
            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_so_lastupdated'));
            CWObject.updatedBy = (resultSet[i].getValue('custrecord_ctc_cw_so_updatedby'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_so_conversionstatus'));
            CWObject.solink = (resultSet[i].getValue('custrecord_ctc_cw_so_link'));
            CWObject.cwAccountId = (resultSet[i].getValue('custrecord_ctc_cw_so_cwaccount'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getMemberConvertData(pageNumber, pageSize, convertStatus, singleConvertId, cwAccountId) {
    nlapiLogExecution('DEBUG', 'Single Convert ID Value for Member: ' + singleConvertId);
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_id'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_identifier'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_firstname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_middleinitial'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_lastname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_title'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_officeemail'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_officephone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_officeextension'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_mobileemail'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_mobilephone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_mobileextension'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_homeemail'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_homephone'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_homeextension'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_defaultemail'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_primaryemail'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_defaultphone'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_cwaccount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_conversionstat'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_member_lastupdated'));


    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_member_conversionstat', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_member_id', null, 'equalto', singleConvertId));

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_member_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_member', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWMember();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_member_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.identifier = (resultSet[i].getValue('custrecord_ctc_cw_member_identifier'));
            CWObject.firstName = (resultSet[i].getValue('custrecord_ctc_cw_member_firstname'));
            CWObject.middleInitial = (resultSet[i].getValue('custrecord_ctc_cw_member_middleinitial'));
            CWObject.lastName = (resultSet[i].getValue('custrecord_ctc_cw_member_lastname'));
            CWObject.title = (resultSet[i].getValue('custrecord_ctc_cw_member_title'));
            CWObject.primaryEmail = (resultSet[i].getValue('custrecord_ctc_cw_member_primaryemail'));
            CWObject.officePhone = (resultSet[i].getValue('custrecord_ctc_cw_member_officephone'));
            CWObject.cwAccountId = (resultSet[i].getValue('custrecord_ctc_cw_member_cwaccount'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_member_conversionstat'));
            CWObject.lastUpdated = (resultSet[i].getValue('custrecord_ctc_cw_member_lastupdated'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}

function getTimeEntryConvertData(pageNumber, pageSize, timeDateParam, convertStatus, singleConvertId, cwAccountId) {
    //nlapiLogExecution('DEBUG', 'Single Convert ID Value for Time: ' + singleConvertId);
    var JSONDataArray = [];
    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));
    colArr.push(new nlobjSearchColumn('name'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_id'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_companyid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_companyname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_chargetoid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_chargetotype'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_memberid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_membername'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_locationid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_businessunitid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_worktypeid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_worktypename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_workroleid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_workrolename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_agreementid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_agreementname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_timestart'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_timeend'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_actualhours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_billableoption'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_notes'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_hoursbilled'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_hourlyrate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_status'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_invoiceid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_invlink'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_internalnotes'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_hoursdeduct'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_overagerate'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_agreementhours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_agreementamount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_ticketid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_ticketsummary'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_timesheetid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_projectid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_projectname'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_phaseid'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_phasename'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_invoicehours'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_updatedby'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_cwaccount'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_link'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_conversionstatus'));

    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_debgl'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_credgl'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_intercompje'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_debgl2'));
    colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_time_credgl2'));
    // var convertStatus = [1]; //1 - Not Started and 2 - Failed

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_time_conversionstatus', null, 'anyof', convertStatus));

    //added for single button convert on record
    if (singleConvertId) {
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_time_id', null, 'equalto', singleConvertId));
    } else {
        //for time date param
        //convert the cw date to netsuite date, then formulate a formula for date filter
        if (timeDateParam) {
            var timeDateParam_split = timeDateParam.split("|");
            //start date and end date
            if (timeDateParam_split) {
                if (timeDateParam_split.length > 0) {
                    if (timeDateParam_split[0] && timeDateParam_split[0] != '' && timeDateParam_split[0] != 'undefined' && timeDateParam_split[0] != 'null') {
                        var timeDateFormula1 = "CASE WHEN TO_DATE(REGEXP_SUBSTR({custrecord_ctc_cw_time_timestart}, '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])'), 'YYYY-MM-DD') >= '" + timeDateParam_split[0] + "' THEN 1 ELSE 0 END";
                        filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(timeDateFormula1));
                        nlapiLogExecution('AUDIT', 'Time Start Date Filter Detected', 'Formula to Use: ' + timeDateFormula1);
                    } else {
                        nlapiLogExecution('AUDIT', 'No Time Start Date filter');
                    }
                    if (timeDateParam_split[1] && timeDateParam_split[1] != '' && timeDateParam_split[1] != 'undefined' && timeDateParam_split[1] != 'null') {
                        var timeDateFormula2 = "CASE WHEN TO_DATE(REGEXP_SUBSTR({custrecord_ctc_cw_time_timestart}, '^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])'), 'YYYY-MM-DD') <= '" + timeDateParam_split[1] + "' THEN 1 ELSE 0 END";
                        filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(timeDateFormula2));
                        nlapiLogExecution('AUDIT', 'Time End Date Filter Detected', 'Formula to Use: ' + timeDateFormula2);
                    } else {
                        nlapiLogExecution('AUDIT', 'No Time End Date filter');
                    }
                }
            }

        }
    }

    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_time_cwaccount', null, 'anyof', cwAccountId));

    var search = nlapiCreateSearch('customrecord_ctc_cw_time', filterArr, colArr);
    var searchResults = search.runSearch();

    var resultIndex = 0;
    var resultStep = 1000;

    var runOnce = false;

    var resultSet;

    //run once, display a slice of saved search range in UI
    if (pageNumber != 0 && pageNumber != null) {
        var defaultPageSize;
        if (pageSize == null) {
            defaultPageSize = getGlobalSetting('custrecord_ctc_cw_defpagesize', cwAccountId);
        } else {
            defaultPageSize = pageSize;
        }
        resultStep = defaultPageSize;
        if (pageNumber > 1) {
            resultIndex = Number(Number(pageNumber) * Number(resultStep));
            resultIndex = Number(resultIndex) - Number(resultStep);
        }
        resultStep = Number(resultStep);

        runOnce = true;

    }

    do {
        //get all data on saved search (for convert all operation)
        //nlapiLogExecution('DEBUG', 'resultIndex Run ' + resultIndex, Number(Number(resultIndex) + Number(resultStep)));
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        for (var i = 0; !!resultSet && i < resultSet.length; i++) {   // loop through the search results
            //build cw object based on search
            var CWObject = new CWTimeEntry();
            CWObject.internalid = (resultSet[i].getValue('internalid'));
            CWObject.id = (resultSet[i].getValue('custrecord_ctc_cw_time_id'));
            CWObject.name = (resultSet[i].getValue('name'));
            CWObject.company.id = (resultSet[i].getValue('custrecord_ctc_cw_time_companyid'));
            CWObject.company.nsid = (resultSet[i].getValue('custrecord_ctc_cw_time_companyname'));
            CWObject.chargeToId = (resultSet[i].getValue('custrecord_ctc_cw_time_chargetoid'));
            CWObject.chargeToType = (resultSet[i].getValue('custrecord_ctc_cw_time_chargetotype'));
            CWObject.member.id = (resultSet[i].getValue('custrecord_ctc_cw_time_memberid'));
            CWObject.member.name = (resultSet[i].getValue('custrecord_ctc_cw_time_membername'));
            CWObject.locationId = (resultSet[i].getValue('custrecord_ctc_cw_time_locationid'));
            CWObject.businessUnitId = (resultSet[i].getValue('custrecord_ctc_cw_time_businessunitid'));
            CWObject.workType.id = (resultSet[i].getValue('custrecord_ctc_cw_time_worktypeid'));
            CWObject.workType.name = (resultSet[i].getValue('custrecord_ctc_cw_time_worktypename'));
            CWObject.workType.nameText = (resultSet[i].getText('custrecord_ctc_cw_time_worktypename'));
            CWObject.workRole.id = (resultSet[i].getValue('custrecord_ctc_cw_time_workroleid'));
            CWObject.workRole.name = (resultSet[i].getValue('custrecord_ctc_cw_time_workrolename'));
            CWObject.agreement.id = (resultSet[i].getValue('custrecord_ctc_cw_time_agreementid'));
            CWObject.agreement.nsid = (resultSet[i].getValue('custrecord_ctc_cw_time_agreementname'));
            CWObject.agreement.nameText = (resultSet[i].getText('custrecord_ctc_cw_time_agreementname'));
            CWObject.timeStart = (resultSet[i].getValue('custrecord_ctc_cw_time_timestart'));
            CWObject.timeEnd = (resultSet[i].getValue('custrecord_ctc_cw_time_timeend'));
            CWObject.actualHours = (resultSet[i].getValue('custrecord_ctc_cw_time_actualhours'));
            CWObject.billableOption = (resultSet[i].getValue('custrecord_ctc_cw_time_billableoption'));
            CWObject.notes = (resultSet[i].getValue('custrecord_ctc_cw_time_notes'));
            CWObject.hoursBilled = (resultSet[i].getValue('custrecord_ctc_cw_time_hoursbilled'));
            CWObject.hourlyRate = (resultSet[i].getValue('custrecord_ctc_cw_time_hourlyrate'));
            CWObject.status = (resultSet[i].getValue('custrecord_ctc_cw_time_status'));
            CWObject.invoiceId = (resultSet[i].getValue('custrecord_ctc_cw_time_invoiceid'));
            CWObject.cwInvoiceLink = (resultSet[i].getValue('custrecord_ctc_cw_time_invlink'));
            CWObject.internalNotes = (resultSet[i].getValue('custrecord_ctc_cw_time_internalnotes'));
            CWObject.hoursDeduct = (resultSet[i].getValue('custrecord_ctc_cw_time_hoursdeduct'));
            CWObject.overageRate = (resultSet[i].getValue('custrecord_ctc_cw_time_overagerate'));
            CWObject.agreementHours = (resultSet[i].getValue('custrecord_ctc_cw_time_agreementhours'));
            CWObject.agreementAmount = (resultSet[i].getValue('custrecord_ctc_cw_time_agreementamount'));
            CWObject.ticket.id = (resultSet[i].getValue('custrecord_ctc_cw_time_ticketid'));
            CWObject.ticket.summary = (resultSet[i].getValue('custrecord_ctc_cw_time_ticketsummary'));
            CWObject.timeSheet.id = (resultSet[i].getValue('custrecord_ctc_cw_time_timesheetid'));
            CWObject.project.id = (resultSet[i].getValue('custrecord_ctc_cw_time_projectid'));
            CWObject.project.name = (resultSet[i].getValue('custrecord_ctc_cw_time_projectname'));
            CWObject.phase.id = (resultSet[i].getValue('custrecord_ctc_cw_time_phaseid'));
            CWObject.phase.name = (resultSet[i].getValue('custrecord_ctc_cw_time_phasename'));
            CWObject.invoiceHours = (resultSet[i].getValue('custrecord_ctc_cw_time_invoicehours'));
            CWObject.updatedBy = (resultSet[i].getValue('custrecord_ctc_cw_time_updatedby'));
            CWObject.cwAccount = (resultSet[i].getValue('custrecord_ctc_cw_time_cwaccount'));
            CWObject.nsTimeLink = (resultSet[i].getValue('custrecord_ctc_cw_time_link'));
            CWObject.conversionstatus = (resultSet[i].getValue('custrecord_ctc_cw_time_conversionstatus'));
            CWObject.creditGL = (resultSet[i].getValue('custrecord_ctc_cw_time_credgl'));
            CWObject.debitGL = (resultSet[i].getValue('custrecord_ctc_cw_time_debgl'));
            CWObject.jeintercompany = (resultSet[i].getValue('custrecord_ctc_cw_time_intercompje'));
            CWObject.creditGL2 = (resultSet[i].getValue('custrecord_ctc_cw_time_credgl2'));
            CWObject.debitGL2 = (resultSet[i].getValue('custrecord_ctc_cw_time_debgl2'));

            JSONDataArray.push(CWObject);
        }
        resultIndex = resultIndex + resultStep;
    } while (resultSet.length >= 1000 && runOnce == false);

    return JSONDataArray;

}


//get the internal ID of the CW Record or any column specified
function getCWRecordInternalId(searchName, cwIDSearchColumnName, cwID, columnResult, cwAccountIdSearchField, cwAccountId) {

    var cwInternalId = '';

    try {
        var col = [];
        var filter = [];


        col[0] = new nlobjSearchColumn(columnResult);
        filter[0] = new nlobjSearchFilter(cwIDSearchColumnName, null, 'equalto', cwID);

        if (cwAccountIdSearchField && cwAccountId) {
            filter[1] = new nlobjSearchFilter(cwAccountIdSearchField, null, 'anyof', cwAccountId);
        }

        var searchResults = nlapiSearchRecord(searchName, null, filter, col);
        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                cwInternalId = (searchResults[i].getValue(columnResult));
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for internal ID of CW ID: ' + cwID, err)
    }
    return cwInternalId;
}

function removeDuplicateID(arr) {
    var unique_array = [];
    for (var i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i]);
        }
    }
    return unique_array;
}

function sortJSONArray(jsonObjectArray, key) {
    //var data = [{ "id": "105", "name": "FIAT", "active": true, "parentId": "1" }, { "id": "106", "name": "AUDI", "active": true, "parentId": "1" }, { "id": "107", "name": "BMW", "active": true, "parentId": "1" }, { "id": "109", "name": "RENAULT", "active": true, "parentId": "1" }];
    jsonObjectArray.sort(function (a, b) {
        return parseInt(a[key]) > parseInt(b[key]) ? 1 : parseInt(a[key]) < parseInt(b[key]) ? -1 : 0;
    });

    return jsonObjectArray;
}

function arrayDiff(a1, a2) {
    var o1 = {},
        o2 = {},
        diff = [],
        i, len, k;
    for (i = 0, len = a1.length; i < len; i++) {
        o1[a1[i]] = true;
    }
    for (i = 0, len = a2.length; i < len; i++) {
        o2[a2[i].id] = true;
    }
    for (k in o1) {
        if (!(k in o2)) {
            diff.push(k);
        }
    }
    for (k in o2) {
        if (!(k in o1)) {
            diff.push(k);
        }
    }
    return diff;
}

function rebuildJSONDataArray(lookupTable, JSONDataArray) {
    var JSONDataArrayResult = [];

    lookupTable.sort(function (a, b) {
        return a - b;
    });
    var JSONDataArraySorted = sortJSONArray(JSONDataArray, "id");
    var JSONDataArrayIDs = [];

    for (var i = 0; i < JSONDataArraySorted.length; i++)
        JSONDataArrayIDs.push(JSONDataArraySorted[i].id)

    //for loop method is faster using binary search tree algorithm
    for (var i = 0; i < lookupTable.length; i++) {
        var index = binarySearch(JSONDataArrayIDs, lookupTable[i]);
        if (index != -1)
            JSONDataArrayResult.push(JSONDataArraySorted[index]);
    }

    return JSONDataArrayResult;
}

function binarySearch(items, value) {
    var firstIndex = 0,
        lastIndex = items.length - 1,
        middleIndex = Math.floor((lastIndex + firstIndex) / 2);

    while (items[middleIndex] != value && firstIndex < lastIndex) {
        if (value < items[middleIndex]) {
            lastIndex = middleIndex - 1;
        } else if (value > items[middleIndex]) {
            firstIndex = middleIndex + 1;
        }
        middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    }

    return (items[middleIndex] != value) ? -1 : middleIndex;
}

function binarySearch2(items, value) {
    var firstIndex = 0,
        lastIndex = items.length - 1,
        middleIndex = Math.floor((lastIndex + firstIndex) / 2);

    while (Number(items[middleIndex].split("|")[0]) != value && firstIndex < lastIndex) {
        if (value < Number(items[middleIndex].split("|")[0])) {
            lastIndex = middleIndex - 1;
        } else if (value > Number(items[middleIndex].split("|")[0])) {
            firstIndex = middleIndex + 1;
        }
        middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    }

    return (Number(items[middleIndex].split("|")[0]) != value) ? -1 : middleIndex;
}


function buildJSONDataBasedOnID(cwIDListArray, JSONDataArrayInput) {
    //A new JSONDataArray with only unique CW IDs (no duplicates)
    var JSONDataArrayNew = [];

    //cwIDListArray.sort(); //TODO: This might not sort correctly found an error using .sort() 5/5/2021 - proved to be a critical issue and fixed by below code, finally gave up with binary search as it is glitched
    // cwIDListArray.sort(function(a, b) {
    //     return a - b;
    // });

    // for (var z = 0; z < cwIDListArray.length; z++)
    //     nlapiLogExecution('AUDIT', 'CW ID LIST Array: ' + cwIDListArray[z]);

    for (var i = 0; i < JSONDataArrayInput.length; i++) {
        var JSONDataArrayInputRow = JSONDataArrayInput[i];
        if (checkIDExists(JSONDataArrayInputRow.id, cwIDListArray)) {
            JSONDataArrayNew.push(JSONDataArrayInputRow);
        }
    }
    return JSONDataArrayNew;
}


function checkIDExists(cwID, cwIDArr) {
    // var cwIDArrSorted = cwIDArr.sort();

    //TODO: Reverted back to linear search (best and most accurate) 5/17/2021
    for (var i = 0; i < cwIDArr.length; i++) {
        if (cwID.toString() == cwIDArr[i].toString()) {
            //nlapiLogExecution('DEBUG', 'Matched',  + cwID.toString() + ' and ' + cwIDArr[i].toString());
            return true;
        }
    }

    return false;
}

function checkIDExists2(cwID, cwDateString, cwIDArr, updateMode, parentIdInput, invoiceLineMode) {
    //this is a modified version for the suitelet, uses linear search instead of binary search
    //returns 3 kinds of status, available (no match), imported (perfect match with same date), updated (matched id but record needs update, last update date not the same)

    // var cwIDArrSorted = cwIDArr.sort();
    var returnStatus = 'available';
    var matchedParentIdOnArray = '';
    try {
        for (var i = 0; i < cwIDArr.length; i++) {
            var cwIDArrSplit = cwIDArr[i].split("|");
            var cwIDOnArray = Number(cwIDArrSplit[0]);
            var cwDateOnArray = cwIDArrSplit[1];
            if (cwID == cwIDOnArray) {
                if (cwDateOnArray == cwDateString) {
                    returnStatus = 'imported';
                } else {
                    if (updateMode == 'T') {
                        returnStatus = 'update';
                    } else {
                        returnStatus = 'imported';
                    }
                }
                //modifications for invoiceLineMode
                if (invoiceLineMode == true)
                    matchedParentIdOnArray = cwIDArrSplit[2]; //this is the key variable that gets tested (invoice id) to check if the matched row has an invoice id or not

                //nlapiLogExecution('DEBUG', 'Break at index ' + i, 'matched parent id on array: ' + matchedParentIdOnArray + ' parentIdInput: ' + parentIdInput);
                break;

            }
        }

        //modifications for invoiceLineMode - this makes sure that the invoice id on the suitelet matches on what is already in NS, if not, mark it as Needs Update
        if (invoiceLineMode == true) {
            // if(cwIDOnArray == '49')
            //     nlapiLogExecution('DEBUG', 'CW ID: ' + cwID + 'cwIDOnArray ' + cwIDOnArray + ' parentIdOnArray: ' + parentIdOnArray, 'parentIdInput ' + parentIdInput);

            if (returnStatus == 'imported' && parentIdInput != matchedParentIdOnArray) {
                returnStatus = 'update'; //set it to update because there's an invoice link id updated on the row
            }

            //original
            // var parentIdOnArray = cwIDArrSplit[2];
            // if(returnStatus == 'imported' && parentIdInput != parentIdOnArray) {
            //     nlapiLogExecution('DEBUG', 'CW ID: ' + cwIDOnArray + ' parentIdOnArray: ' + parentIdOnArray, 'parentIdInput ' + parentIdInput);
            //     returnStatus = 'update'; //set it to update because there's an invoice link id updated on the row
            // }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not check id duplicates for cw id: ' + cwID, err);
    }

    return returnStatus;

}


function checkSingleCWIDExists(searchType, searchColumnName, cwIDInput, lastUpdateFieldName, importLastUpdateDate, checkParentIdFieldName, checkParentId, cwAccountIdSearchField, cwAccountId) {

    //load all CW IDS in system - make sure there are no duplicates inserted
    var cwIDList = [];
    var col = [];

    try {
        //nlapiLogExecution('DEBUG', searchType, searchColumnName + ' ' + cwIDInput + ' ' + lastUpdateFieldName + ' ' + importLastUpdateDate);
        //load search for scheduled script
        var colArr = new Array();
        var filterArr = new Array();

        colArr.push(new nlobjSearchColumn('internalid'));


        filterArr.push(new nlobjSearchFilter(searchColumnName, null, 'equalto', cwIDInput));

        if (cwAccountIdSearchField && cwAccountId) {
            filterArr.push(new nlobjSearchFilter(cwAccountIdSearchField, null, 'anyof', cwAccountId));
        }

        //added for update logic, if last 2 params have values
        //double check if there is a difference on date, if the date stored in the system is equal to the import date, then this is a duplicate and no updates needed
        if (lastUpdateFieldName && importLastUpdateDate) {
            filterArr.push(new nlobjSearchFilter(lastUpdateFieldName, null, 'is', importLastUpdateDate));
            //added for update logic - emergency fix 1/10/2021, this makes sure even if that the product line, time line or expense line or po line is 100% updated
            // but an invoice parent id was attached
            if (checkParentId && checkParentId != '') {
                //nlapiLogExecution('DEBUG', 'Check parent id is NOT null');
                filterArr.push(new nlobjSearchFilter(checkParentIdFieldName, null, 'equalto', checkParentId));
            } else {
                //added update logic - emergency fix Ticket #8129 - added 4/8/2022
                //cw prod entry in CW has blank invoice, make sure that the NS cw prod entry doesnt have an invoice id, or else update this record and blank it out!
                //nlapiLogExecution('DEBUG', 'Check parent id is null');
                if (checkParentIdFieldName) {
                    filterArr.push(new nlobjSearchFilter(checkParentIdFieldName, null, 'isempty'));
                }
            }
        }


        var searchResults = nlapiSearchRecord(searchType, null, filterArr, colArr);

        if (searchResults) {
            if (searchResults.length > 0)
                return true;
        }
    } catch (err) {
        nlapiSearchRecord('ERROR', 'Could not check CW ID: ' + cwIDInput, err);
    }

    return false;
}

function checkAllCWIDExists(searchType, searchColumnName, cwIDInputArray) {
    //deprecated - use checkAllCWIDExists2 instead
    //this function returns a array of ids that are already in the system
    if (cwIDInputArray) {
        nlapiLogExecution('DEBUG', 'CWIDInputArray Length: ', cwIDInputArray.length);
        var MAX_PAGINATION = 100;
        var duplicateIDList = [];
        var idList = [];
        var col = [];

        var iterationCount = Math.ceil(Number(cwIDInputArray.length) / Number(MAX_PAGINATION));

        for (var x = 0; x < iterationCount; x++) {
            var currentMaxLength;
            var lastIterationMaxLength = Number(cwIDInputArray.length) % Number(MAX_PAGINATION);

            if (x + 1 < iterationCount) {
                currentMaxLength = Number(MAX_PAGINATION);
            } else {
                if (lastIterationMaxLength > 0) {
                    currentMaxLength = lastIterationMaxLength;
                } else {
                    currentMaxLength = Number(MAX_PAGINATION);
                }

            }

            //load search for scheduled script
            var colArr = new Array();
            var filterArr = new Array();

            colArr.push(new nlobjSearchColumn(searchColumnName));

            var startFormula = 'CASE WHEN';
            var middleFormula = '';
            var endFormula = ' THEN 1 ELSE 0 END';
            var finalFormula = '';
            var pageMultiplier = Number(x * Number(MAX_PAGINATION));


            for (var i = 0; i < currentMaxLength; i++) {
                // var realIndex = Number(Number(i) + Number(pageMultiplier));
                if (i + 1 < currentMaxLength) {
                    middleFormula += ' {' + searchColumnName + '} = ' + cwIDInputArray[i + pageMultiplier] + ' OR ';
                } else {
                    middleFormula += ' {' + searchColumnName + '} = ' + cwIDInputArray[i + pageMultiplier];
                }

            }

            //nlapiLogExecution('DEBUG', 'Iteration ' + x + ' currentMaxLength: ' + currentMaxLength);

            finalFormula = startFormula + middleFormula + endFormula;

            filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(finalFormula));

            var searchResults = nlapiSearchRecord(searchType, null, filterArr, colArr);

            if (searchResults) {
                for (var i = 0; i < searchResults.length; i++) {
                    duplicateIDList.push(searchResults[i].getValue(searchColumnName));
                }
            }
        }

        if (duplicateIDList) {
            duplicateIDList.sort(function (a, b) {
                return a - b;
            });
        }

        // for (var p = 0; p < duplicateIDList.length; p++)
        //     nlapiLogExecution('DEBUG', 'CW ID List Sorted: ', duplicateIDList[p]);

        return duplicateIDList;
    }
}

function checkAllCWIDExists2(searchType, searchColumnName, cwIDInputArray, dateFieldName, parentFieldName, cwAccountIdSearchField, cwAccountId) {
    //this is a modified version for the suitelet, uses linear search instead of binary search
    //to enable "Record Needs Update" and be able to reimport an existing on suitelet

    var duplicateRecordArray = [];

    //this function returns a array of ids that are already in the system
    if (cwIDInputArray) {
        nlapiLogExecution('DEBUG', 'CWIDInputArray Length: ', cwIDInputArray.length);
        var MAX_PAGINATION = 100;
        var duplicateIDList = [];
        var idList = [];
        var col = [];

        var iterationCount = Math.ceil(Number(cwIDInputArray.length) / Number(MAX_PAGINATION));

        for (var x = 0; x < iterationCount; x++) {
            var currentMaxLength;
            var lastIterationMaxLength = Number(cwIDInputArray.length) % Number(MAX_PAGINATION);

            if (x + 1 < iterationCount) {
                currentMaxLength = Number(MAX_PAGINATION);
            } else {
                if (lastIterationMaxLength > 0) {
                    currentMaxLength = lastIterationMaxLength;
                } else {
                    currentMaxLength = Number(MAX_PAGINATION);
                }

            }

            //load search for scheduled script
            var colArr = new Array();
            var filterArr = new Array();

            colArr.push(new nlobjSearchColumn(searchColumnName).setSort(false));

            if (dateFieldName)
                colArr.push(new nlobjSearchColumn(dateFieldName));

            if (parentFieldName)
                colArr.push(new nlobjSearchColumn(parentFieldName));


            var startFormula = 'CASE WHEN';
            var middleFormula = '';
            var endFormula = ' THEN 1 ELSE 0 END';
            var finalFormula = '';
            var pageMultiplier = Number(x * Number(MAX_PAGINATION));


            for (var i = 0; i < currentMaxLength; i++) {
                // var realIndex = Number(Number(i) + Number(pageMultiplier));
                if (i + 1 < currentMaxLength) {
                    middleFormula += ' {' + searchColumnName + '} = ' + cwIDInputArray[i + pageMultiplier] + ' OR ';
                } else {
                    middleFormula += ' {' + searchColumnName + '} = ' + cwIDInputArray[i + pageMultiplier];
                }

            }

            //nlapiLogExecution('DEBUG', 'Iteration ' + x + ' currentMaxLength: ' + currentMaxLength);

            finalFormula = startFormula + middleFormula + endFormula;

            filterArr.push(new nlobjSearchFilter('formulatext', null, 'is', '1').setFormula(finalFormula));

            if (cwAccountIdSearchField && cwAccountId) {
                nlapiLogExecution('DEBUG', 'CW Account ID to check: ' + cwAccountId);
                filterArr.push(new nlobjSearchFilter(cwAccountIdSearchField, null, 'anyof', cwAccountId));
            }

            //nlapiLogExecution('DEBUG', 'Final Formula', finalFormula)
            var searchResults = nlapiSearchRecord(searchType, null, filterArr, colArr);

            if (searchResults) {
                for (var i = 0; i < searchResults.length; i++) {

                    if (dateFieldName) {
                        if (parentFieldName) {
                            duplicateIDList.push(searchResults[i].getValue(searchColumnName) + "|" + searchResults[i].getValue(dateFieldName) + "|" + searchResults[i].getValue(parentFieldName));
                        } else {
                            duplicateIDList.push(searchResults[i].getValue(searchColumnName) + "|" + searchResults[i].getValue(dateFieldName));
                        }
                    } else {
                        duplicateIDList.push(searchResults[i].getValue(searchColumnName));
                    }

                }
            }
        }

        // for (var p = 0; p < duplicateIDList.length; p++)
        //     nlapiLogExecution('DEBUG', 'CW ID List: ', duplicateIDList[p]);

        return duplicateIDList;
    }
}


function getHeaderSettings(additionalHeaders, cwAccountId) {
    //base 64 encoder & decoder
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);
            return output;
        },
        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }
    var returnHeader;

    var col = [];
    col[0] = new nlobjSearchColumn('custrecord_ctc_cw_api_companyname');
    col[1] = new nlobjSearchColumn('custrecord_ctc_cw_api_publickey');
    col[2] = new nlobjSearchColumn('custrecord_ctc_cw_api_privatekey');
    col[3] = new nlobjSearchColumn('custrecord_ctc_cw_api_baseurl');
    col[4] = new nlobjSearchColumn('custrecord_ctc_cw_api_clientid');
    col[5] = new nlobjSearchColumn('custrecord_ctc_cw_api_version');
    col[6] = new nlobjSearchColumn('internalid');

    var filters = [];
    if (cwAccountId) {
        filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', cwAccountId);
    } else {
        filters[0] = new nlobjSearchFilter('custrecord_ctc_cw_primarysettings', null, 'is', 'T');
    }

    var searchresults = nlapiSearchRecord('customrecord_ctc_cw_setup', null, filters, col);
    var companyname;
    var publickey;
    var privatekey;
    var baseurl;
    var clientid;
    var apiversion;

    if (searchresults) {
        for (var i = 0; i < searchresults.length; i++) {
            companyname = (searchresults[i].getValue('custrecord_ctc_cw_api_companyname')).toString();
            publickey = (searchresults[i].getValue('custrecord_ctc_cw_api_publickey')).toString();
            privatekey = (searchresults[i].getValue('custrecord_ctc_cw_api_privatekey')).toString();
            baseurl = (searchresults[i].getValue('custrecord_ctc_cw_api_baseurl')).toString();
            clientid = (searchresults[i].getValue('custrecord_ctc_cw_api_clientid')).toString();
            apiversion = (searchresults[i].getValue('custrecord_ctc_cw_api_version')).toString();
            //nlapiLogExecution('DEBUG', 'Test', 'Searched ID: ' + searchresults[i].getValue('custrecord_ctc_cw_cmp_id'));
        }
    }

    var auth = Base64.encode(companyname + '+' + publickey + ':' + privatekey);
    var auth = "Basic " + auth;
    returnHeader = {
        "Authorization": auth,
        "Content-Type": "application/json; charset=utf-8",
        "clientId": clientid,
        "Accept": "application/vnd.connectwise.com+json; version=" + apiversion
    };

    //add additional parameters - optional, used on POST calls
    if (additionalHeaders) {
        for (var name in additionalHeaders) {
            returnHeader[name] = additionalHeaders[name];
            nlapiLogExecution('DEBUG', 'Additional Header Name', name);
            var value = additionalHeaders[name];
            nlapiLogExecution('DEBUG', 'Additional Header Value', value);
        }
    }
    //nlapiLogExecution('DEBUG', 'Header', returnHeader.Authorization );
    return returnHeader;
}

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

function sendEmailSuccess(runName, runType, runLogId, runLogOwner, totalRecordsSelected, totalRecordsProcessed, totalRecordsCreated, totalRecordsFailed, totalRecordsDuplicate, batchJobMode, cwAccountId) {
    if (getGlobalSetting('custrecord_ctc_cw_settings_sendemail', cwAccountId) == 'T') {
        //send email to record owner
        var ccEmailFinal = null;
        var runLogURL = nlapiResolveURL('RECORD', 'customrecord_ctc_cw_runlog', runLogId, 'VIEW');
        var emailMessage = 'Greetings from Catalyst Technology!<br /><br />';
        emailMessage += 'Thank you for using the Connectwise Integration Tool. The import of your Connectwise ' + runName + ' data to your Netsuite account is Completed.<br /><br />';
        emailMessage += 'Run Log ID: ' + runLogId + '<br />';
        emailMessage += 'Total Number of Records to Process: ' + totalRecordsSelected + '<br />';
        emailMessage += 'Number of Records Created: ' + totalRecordsCreated + '<br />';
        emailMessage += 'Number of Records Failed: ' + totalRecordsFailed + '<br />';
        emailMessage += 'Run Data Type: ' + runName + '<br />';
        emailMessage += 'Run Type: ' + runType + '<br />';
        emailMessage += "Run Log Link: <a href='" + runLogURL + "'>View Link</a>" + "<br /><br />";
        emailMessage += 'If there are any issues with the import run, please contact pjlee@nscatalyst.com for assistance.<br /><br />';
        emailMessage += 'Sincerely,<br />';
        emailMessage += 'Catalyst Technology';

        //get cc email field
        var ccEmail = getGlobalSetting('custrecord_ctc_cw_settings_jobstatemail');
        if (ccEmail && ccEmail != '')
            ccEmailFinal = ccEmail;

        //make sure to send to the right person, -4 means it was executed by batch job, send email to ccEmailField instead
        if (runLogOwner == '-4') {
            if (ccEmailFinal) {//if there's an email set in the settings page, use it, else there won't be any emails sent, -5 is the first user in the system
                //nlapiSendEmail(5, 5, 'Your Connectwise Import/Convert Run is complete', 'Test Message', null, null, null, null);
                var systemAdminId = getSystemAdminEmployeeId();
                nlapiSendEmail(systemAdminId, ccEmailFinal, 'Your Connectwise Import/Convert Run is complete', emailMessage, null, null, null, null);
                //nlapiLogExecution('DEBUG', 'Log owner is ' + runLogOwner + ' sending email...', 'ccEmailFinal = ' + ccEmailFinal);
            }
        } else {
            nlapiSendEmail(runLogOwner, runLogOwner, 'Your Connectwise Import/Convert Run is complete', emailMessage, ccEmailFinal, null, null, null);
        }

    }
}

function getGlobalSetting(settingField, cwAccountId) {
    var settingsRecordId = getDefaultSettingsRecordId(cwAccountId);

    var settingResult = '';

    try {
        var settingResult = nlapiLookupField('customrecord_ctc_cw_setup', settingsRecordId, settingField);
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not load data for field: ' + settingField, 'Record ID: ' + settingsRecordId);
    }


    return settingResult;
}

function getDefaultSettingsRecordId(cwAccountId) {
    var settingsRecordId;

    var col = [];
    col[0] = new nlobjSearchColumn('internalid');

    var filters = [];

    if (cwAccountId) {
        //4/26/2021 - For Multi-sub enhancement, if there is a cwAccountId specified, look for the correct connection
        filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', cwAccountId);
    } else {
        //if it is null, just get the primary subsidiary (single)
        filters[0] = new nlobjSearchFilter('custrecord_ctc_cw_primarysettings', null, 'is', 'T');
    }


    var searchresults = nlapiSearchRecord('customrecord_ctc_cw_setup', null, filters, col);


    if (searchresults) {
        for (var i = 0; i < searchresults.length; i++) {
            settingsRecordId = searchresults[i].getValue('internalid');
        }
    }

    return settingsRecordId;
}

function convertJSONStringToDate(json_date) {

    var returnDate = new Date();

    //time format will be in 2005-05-02T00:00:00Z
    var dateString = json_date.split("T")[0];
    //nlapiLogExecution('DEBUG', 'split json date: ' + dateString);
    var newDateString = dateString.replace('-', '/');
    //nlapiLogExecution('DEBUG', 'new date: ' + newDateString);
    newDateString = newDateString.replace('-', '/');
    //nlapiLogExecution('DEBUG', 'new date 2nd: ' + newDateString);

    var finalDate = Date.parse(newDateString);
    returnDate = new Date(finalDate);

    return returnDate;
}

function formatURL(urlString) {
    var returnString = urlString;

    if (urlString.indexOf('http://') == -1 && urlString.indexOf('https://') == -1)
        returnString = 'http://' + urlString;

    //remove white spaces front, in between and at the last
    return returnString.replace(/\s/g, '');
}

function checkForDuplicateEntity(nsRecordType, nsEntityNameField, entityName, customerIdCheck, previousDuplicateNumber) {
    var disableDuplicateCheck = getGlobalSetting('custrecord_ctc_cw_settings_disabledupchk');
    if (disableDuplicateCheck == 'T') {
        return entityName;
    } else {

        if (previousDuplicateNumber == null)
            previousDuplicateNumber = 0;
        //trim front and leading white space
        entityName = entityName.trim();

        var returnEntityName = entityName;
        var duplicateCount = 0;
        var col = [];
        var filter = [];

        col[0] = new nlobjSearchColumn('internalid', null, 'COUNT')
        if (customerIdCheck == 'T') {
            filter[0] = new nlobjSearchFilter(nsEntityNameField, null, 'is', entityName);
        } else {
            filter[0] = new nlobjSearchFilter(nsEntityNameField, null, 'contains', entityName);
        }
        //nlapiLogExecution('DEBUG', 'Entity Name', entityName);

        var searchResults = nlapiSearchRecord(nsRecordType, null, filter, col);
        if (searchResults) {
            var allColumns = searchResults[0].getAllColumns();
            duplicateCount = searchResults[0].getValue(allColumns[0]);
        }

        //nlapiLogExecution('DEBUG', 'Contact Dupe Count', duplicateCount);

        if (duplicateCount > 0) {
            var currentDuplicateNumber = Number(Number(previousDuplicateNumber) + Number(1));
            returnEntityName = entityName + ' (' + currentDuplicateNumber + ')';

            if (currentDuplicateNumber == 1) {
                returnEntityName = entityName + ' (' + currentDuplicateNumber + ')';
            } else {
                var digitLength = digitCount(previousDuplicateNumber);
                var lookupLength = Number(Number(2) + Number(digitLength));
                returnEntityName = entityName.substring(0, entityName.length - lookupLength) + '(' + currentDuplicateNumber + ')'; //replace last three characters
                nlapiLogExecution('DEBUG', 'Digit count', digitLength);
            }
            // if(previousDuplicateNumber > 0) {
            //rename entity, add number to next iteration as suffix to prevent duplicate error on Netsuite

            // } else {
            //     //rename entity, add number suffix to prevent duplicate error on Netsuite
            //     returnEntityName = entityName + ' (' + duplicateCount + ')';
            // }
            returnEntityName = checkForDuplicateEntity(nsRecordType, nsEntityNameField, returnEntityName, 'T', currentDuplicateNumber);
        } else {
            returnEntityName = entityName;
        }

        nlapiLogExecution('DEBUG', 'Contact Return Entity Name', returnEntityName);
        return returnEntityName;
    }
}

function formatEmail(emailString) {
    var returnEmailString = '';

    if (emailString != null) {
        //1. remove white spaces front, in between and leading
        var temp1 = emailString.replace(/\s/g, '');
        //2. replace any commas to dots
        var temp2 = temp1.replace(/,/g, '.');

        //3. remove apostrophes
        returnEmailString = temp2.replace(/’/g, '');

        //4. check if email is valid, if not, make it blank
        var isValid = validEmail(returnEmailString);

        if (isValid == false)
            returnEmailString = '';

    }

    return returnEmailString;
}

function validEmail(e) {
    //var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/; - old filter
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return String(e).search(filter) != -1;
}

function validPhone(phoneNumber) {
    if (phoneNumber) {
        if (phoneNumber.length >= 7)
            return true;
    }

    return false;
}

function getCountryCode(countryName) {
    //returns the country code based on a country code name input
    var isoCountries = {
        'afghanistan': 'af',
        'aland islands': 'ax',
        'albania': 'al',
        'algeria': 'dz',
        'american samoa': 'as',
        'andorra': 'ad',
        'angola': 'ao',
        'anguilla': 'ai',
        'antarctica': 'aq',
        'antigua and barbuda': 'ag',
        'argentina': 'ar',
        'armenia': 'am',
        'aruba': 'aw',
        'australia': 'au',
        'austria': 'at',
        'azerbaijan': 'az',
        'bahamas': 'bs',
        'bahrain': 'bh',
        'bangladesh': 'bd',
        'barbados': 'bb',
        'belarus': 'by',
        'belgium': 'be',
        'belize': 'bz',
        'benin': 'bj',
        'bermuda': 'bm',
        'bhutan': 'bt',
        'bolivia': 'bo',
        'bosnia and herzegovina': 'ba',
        'botswana': 'bw',
        'bouvet island': 'bv',
        'brazil': 'br',
        'british indian ocean territory': 'io',
        'brunei darussalam': 'bn',
        'bulgaria': 'bg',
        'burkina faso': 'bf',
        'burundi': 'bi',
        'cambodia': 'kh',
        'cameroon': 'cm',
        'canada': 'ca',
        'cape verde': 'cv',
        'cayman islands': 'ky',
        'central african republic': 'cf',
        'chad': 'td',
        'chile': 'cl',
        'china': 'cn',
        'christmas island': 'cx',
        'cocos (keeling) islands': 'cc',
        'colombia': 'co',
        'comoros': 'km',
        'congo': 'cg',
        'congo, democratic republic': 'cd',
        'cook islands': 'ck',
        'costa rica': 'cr',
        'cote d\'ivoire': 'ci',
        'croatia': 'hr',
        'cuba': 'cu',
        'cyprus': 'cy',
        'czech republic': 'cz',
        'denmark': 'dk',
        'djibouti': 'dj',
        'dominica': 'dm',
        'dominican republic': 'do',
        'ecuador': 'ec',
        'egypt': 'eg',
        'el salvador': 'sv',
        'equatorial guinea': 'gq',
        'eritrea': 'er',
        'estonia': 'ee',
        'ethiopia': 'et',
        'falkland islands': 'fk',
        'faroe islands': 'fo',
        'fiji': 'fj',
        'finland': 'fi',
        'france': 'fr',
        'french guiana': 'gf',
        'french polynesia': 'pf',
        'french southern territories': 'tf',
        'gabon': 'ga',
        'gambia': 'gm',
        'georgia': 'ge',
        'germany': 'de',
        'ghana': 'gh',
        'gibraltar': 'gi',
        'greece': 'gr',
        'greenland': 'gl',
        'grenada': 'gd',
        'guadeloupe': 'gp',
        'guam': 'gu',
        'guatemala': 'gt',
        'guernsey': 'gg',
        'guinea': 'gn',
        'guinea-bissau': 'gw',
        'guyana': 'gy',
        'haiti': 'ht',
        'heard island & mcdonald islands': 'hm',
        'holy see (vatican city state)': 'va',
        'honduras': 'hn',
        'hong kong': 'hk',
        'hungary': 'hu',
        'iceland': 'is',
        'india': 'in',
        'indonesia': 'id',
        'iran, islamic republic of': 'ir',
        'iraq': 'iq',
        'ireland': 'ie',
        'isle of man': 'im',
        'israel': 'il',
        'italy': 'it',
        'jamaica': 'jm',
        'japan': 'jp',
        'jersey': 'je',
        'jordan': 'jo',
        'kazakhstan': 'kz',
        'kenya': 'ke',
        'kiribati': 'ki',
        'korea': 'kr',
        'kuwait': 'kw',
        'kyrgyzstan': 'kg',
        'lao people\'s democratic republic': 'la',
        'latvia': 'lv',
        'lebanon': 'lb',
        'lesotho': 'ls',
        'liberia': 'lr',
        'libyan arab jamahiriya': 'ly',
        'liechtenstein': 'li',
        'lithuania': 'lt',
        'luxembourg': 'lu',
        'macao': 'mo',
        'macedonia': 'mk',
        'madagascar': 'mg',
        'malawi': 'mw',
        'malaysia': 'my',
        'maldives': 'mv',
        'mali': 'ml',
        'malta': 'mt',
        'marshall islands': 'mh',
        'martinique': 'mq',
        'mauritania': 'mr',
        'mauritius': 'mu',
        'mayotte': 'yt',
        'mexico': 'mx',
        'micronesia, federated states of': 'fm',
        'moldova': 'md',
        'monaco': 'mc',
        'mongolia': 'mn',
        'montenegro': 'me',
        'montserrat': 'ms',
        'morocco': 'ma',
        'mozambique': 'mz',
        'myanmar': 'mm',
        'namibia': 'na',
        'nauru': 'nr',
        'nepal': 'np',
        'netherlands': 'nl',
        'netherlands antilles': 'an',
        'new caledonia': 'nc',
        'new zealand': 'nz',
        'nicaragua': 'ni',
        'niger': 'ne',
        'nigeria': 'ng',
        'niue': 'nu',
        'norfolk island': 'nf',
        'northern mariana islands': 'mp',
        'norway': 'no',
        'oman': 'om',
        'pakistan': 'pk',
        'palau': 'pw',
        'palestinian territory, occupied': 'ps',
        'panama': 'pa',
        'papua new guinea': 'pg',
        'paraguay': 'py',
        'peru': 'pe',
        'philippines': 'ph',
        'pitcairn': 'pn',
        'poland': 'pl',
        'portugal': 'pt',
        'puerto rico': 'pr',
        'qatar': 'qa',
        'reunion': 're',
        'romania': 'ro',
        'russian federation': 'ru',
        'rwanda': 'rw',
        'saint barthelemy': 'bl',
        'saint helena': 'sh',
        'saint kitts and nevis': 'kn',
        'saint lucia': 'lc',
        'saint martin': 'mf',
        'saint pierre and miquelon': 'pm',
        'saint vincent and grenadines': 'vc',
        'samoa': 'ws',
        'san marino': 'sm',
        'sao tome and principe': 'st',
        'saudi arabia': 'sa',
        'senegal': 'sn',
        'serbia': 'rs',
        'seychelles': 'sc',
        'sierra leone': 'sl',
        'singapore': 'sg',
        'slovakia': 'sk',
        'slovenia': 'si',
        'solomon islands': 'sb',
        'somalia': 'so',
        'south africa': 'za',
        'south georgia and sandwich isl.': 'gs',
        'spain': 'es',
        'sri lanka': 'lk',
        'sudan': 'sd',
        'suriname': 'sr',
        'svalbard and jan mayen': 'sj',
        'swaziland': 'sz',
        'sweden': 'se',
        'switzerland': 'ch',
        'syrian arab republic': 'sy',
        'taiwan': 'tw',
        'tajikistan': 'tj',
        'tanzania': 'tz',
        'thailand': 'th',
        'timor-leste': 'tl',
        'togo': 'tg',
        'tokelau': 'tk',
        'tonga': 'to',
        'trinidad and tobago': 'tt',
        'tunisia': 'tn',
        'turkey': 'tr',
        'turkmenistan': 'tm',
        'turks and caicos islands': 'tc',
        'tuvalu': 'tv',
        'uganda': 'ug',
        'ukraine': 'ua',
        'united arab emirates': 'ae',
        'united kingdom': 'gb',
        'united states': 'us',
        'united states outlying islands': 'um',
        'uruguay': 'uy',
        'uzbekistan': 'uz',
        'vanuatu': 'vu',
        'venezuela': 've',
        'vietnam': 'vn',
        'virgin islands, british': 'vg',
        'virgin islands, u.s.': 'vi',
        'wallis and futuna': 'wf',
        'western sahara': 'eh',
        'yemen': 'ye',
        'zambia': 'zm',
        'zimbabwe': 'zw'
    };

    var returnCode = '';
    //lower case everything
    var countryNameLowerCase = countryName.toLowerCase();
    if (isoCountries.hasOwnProperty(countryNameLowerCase)) {
        returnCode = isoCountries[countryNameLowerCase];
    }
    return returnCode.toUpperCase();
}

function getCountryName(countryCode) {
    //returns country name based on 2-character ISO code
    var isoCountries = {
        'AF': 'Afghanistan',
        'AX': 'Aland Islands',
        'AL': 'Albania',
        'DZ': 'Algeria',
        'AS': 'American Samoa',
        'AD': 'Andorra',
        'AO': 'Angola',
        'AI': 'Anguilla',
        'AQ': 'Antarctica',
        'AG': 'Antigua And Barbuda',
        'AR': 'Argentina',
        'AM': 'Armenia',
        'AW': 'Aruba',
        'AU': 'Australia',
        'AT': 'Austria',
        'AZ': 'Azerbaijan',
        'BS': 'Bahamas',
        'BH': 'Bahrain',
        'BD': 'Bangladesh',
        'BB': 'Barbados',
        'BY': 'Belarus',
        'BE': 'Belgium',
        'BZ': 'Belize',
        'BJ': 'Benin',
        'BM': 'Bermuda',
        'BT': 'Bhutan',
        'BO': 'Bolivia',
        'BA': 'Bosnia And Herzegovina',
        'BW': 'Botswana',
        'BV': 'Bouvet Island',
        'BR': 'Brazil',
        'IO': 'British Indian Ocean Territory',
        'BN': 'Brunei Darussalam',
        'BG': 'Bulgaria',
        'BF': 'Burkina Faso',
        'BI': 'Burundi',
        'KH': 'Cambodia',
        'CM': 'Cameroon',
        'CA': 'Canada',
        'CV': 'Cape Verde',
        'KY': 'Cayman Islands',
        'CF': 'Central African Republic',
        'TD': 'Chad',
        'CL': 'Chile',
        'CN': 'China',
        'CX': 'Christmas Island',
        'CC': 'Cocos (Keeling) Islands',
        'CO': 'Colombia',
        'KM': 'Comoros',
        'CG': 'Congo',
        'CD': 'Congo, Democratic Republic',
        'CK': 'Cook Islands',
        'CR': 'Costa Rica',
        'CI': 'Cote D\'Ivoire',
        'HR': 'Croatia',
        'CU': 'Cuba',
        'CY': 'Cyprus',
        'CZ': 'Czech Republic',
        'DK': 'Denmark',
        'DJ': 'Djibouti',
        'DM': 'Dominica',
        'DO': 'Dominican Republic',
        'EC': 'Ecuador',
        'EG': 'Egypt',
        'SV': 'El Salvador',
        'GQ': 'Equatorial Guinea',
        'ER': 'Eritrea',
        'EE': 'Estonia',
        'ET': 'Ethiopia',
        'FK': 'Falkland Islands (Malvinas)',
        'FO': 'Faroe Islands',
        'FJ': 'Fiji',
        'FI': 'Finland',
        'FR': 'France',
        'GF': 'French Guiana',
        'PF': 'French Polynesia',
        'TF': 'French Southern Territories',
        'GA': 'Gabon',
        'GM': 'Gambia',
        'GE': 'Georgia',
        'DE': 'Germany',
        'GH': 'Ghana',
        'GI': 'Gibraltar',
        'GR': 'Greece',
        'GL': 'Greenland',
        'GD': 'Grenada',
        'GP': 'Guadeloupe',
        'GU': 'Guam',
        'GT': 'Guatemala',
        'GG': 'Guernsey',
        'GN': 'Guinea',
        'GW': 'Guinea-Bissau',
        'GY': 'Guyana',
        'HT': 'Haiti',
        'HM': 'Heard Island & Mcdonald Islands',
        'VA': 'Holy See (Vatican City State)',
        'HN': 'Honduras',
        'HK': 'Hong Kong',
        'HU': 'Hungary',
        'IS': 'Iceland',
        'IN': 'India',
        'ID': 'Indonesia',
        'IR': 'Iran, Islamic Republic Of',
        'IQ': 'Iraq',
        'IE': 'Ireland',
        'IM': 'Isle Of Man',
        'IL': 'Israel',
        'IT': 'Italy',
        'JM': 'Jamaica',
        'JP': 'Japan',
        'JE': 'Jersey',
        'JO': 'Jordan',
        'KZ': 'Kazakhstan',
        'KE': 'Kenya',
        'KI': 'Kiribati',
        'KR': 'Korea',
        'KW': 'Kuwait',
        'KG': 'Kyrgyzstan',
        'LA': 'Lao People\'s Democratic Republic',
        'LV': 'Latvia',
        'LB': 'Lebanon',
        'LS': 'Lesotho',
        'LR': 'Liberia',
        'LY': 'Libyan Arab Jamahiriya',
        'LI': 'Liechtenstein',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'MO': 'Macao',
        'MK': 'Macedonia',
        'MG': 'Madagascar',
        'MW': 'Malawi',
        'MY': 'Malaysia',
        'MV': 'Maldives',
        'ML': 'Mali',
        'MT': 'Malta',
        'MH': 'Marshall Islands',
        'MQ': 'Martinique',
        'MR': 'Mauritania',
        'MU': 'Mauritius',
        'YT': 'Mayotte',
        'MX': 'Mexico',
        'FM': 'Micronesia, Federated States Of',
        'MD': 'Moldova',
        'MC': 'Monaco',
        'MN': 'Mongolia',
        'ME': 'Montenegro',
        'MS': 'Montserrat',
        'MA': 'Morocco',
        'MZ': 'Mozambique',
        'MM': 'Myanmar',
        'NA': 'Namibia',
        'NR': 'Nauru',
        'NP': 'Nepal',
        'NL': 'Netherlands',
        'AN': 'Netherlands Antilles',
        'NC': 'New Caledonia',
        'NZ': 'New Zealand',
        'NI': 'Nicaragua',
        'NE': 'Niger',
        'NG': 'Nigeria',
        'NU': 'Niue',
        'NF': 'Norfolk Island',
        'MP': 'Northern Mariana Islands',
        'NO': 'Norway',
        'OM': 'Oman',
        'PK': 'Pakistan',
        'PW': 'Palau',
        'PS': 'Palestinian Territory, Occupied',
        'PA': 'Panama',
        'PG': 'Papua New Guinea',
        'PY': 'Paraguay',
        'PE': 'Peru',
        'PH': 'Philippines',
        'PN': 'Pitcairn',
        'PL': 'Poland',
        'PT': 'Portugal',
        'PR': 'Puerto Rico',
        'QA': 'Qatar',
        'RE': 'Reunion',
        'RO': 'Romania',
        'RU': 'Russian Federation',
        'RW': 'Rwanda',
        'BL': 'Saint Barthelemy',
        'SH': 'Saint Helena',
        'KN': 'Saint Kitts And Nevis',
        'LC': 'Saint Lucia',
        'MF': 'Saint Martin',
        'PM': 'Saint Pierre And Miquelon',
        'VC': 'Saint Vincent And Grenadines',
        'WS': 'Samoa',
        'SM': 'San Marino',
        'ST': 'Sao Tome And Principe',
        'SA': 'Saudi Arabia',
        'SN': 'Senegal',
        'RS': 'Serbia',
        'SC': 'Seychelles',
        'SL': 'Sierra Leone',
        'SG': 'Singapore',
        'SK': 'Slovakia',
        'SI': 'Slovenia',
        'SB': 'Solomon Islands',
        'SO': 'Somalia',
        'ZA': 'South Africa',
        'GS': 'South Georgia And Sandwich Isl.',
        'ES': 'Spain',
        'LK': 'Sri Lanka',
        'SD': 'Sudan',
        'SR': 'Suriname',
        'SJ': 'Svalbard And Jan Mayen',
        'SZ': 'Swaziland',
        'SE': 'Sweden',
        'CH': 'Switzerland',
        'SY': 'Syrian Arab Republic',
        'TW': 'Taiwan',
        'TJ': 'Tajikistan',
        'TZ': 'Tanzania',
        'TH': 'Thailand',
        'TL': 'Timor-Leste',
        'TG': 'Togo',
        'TK': 'Tokelau',
        'TO': 'Tonga',
        'TT': 'Trinidad And Tobago',
        'TN': 'Tunisia',
        'TR': 'Turkey',
        'TM': 'Turkmenistan',
        'TC': 'Turks And Caicos Islands',
        'TV': 'Tuvalu',
        'UG': 'Uganda',
        'UA': 'Ukraine',
        'AE': 'United Arab Emirates',
        'GB': 'United Kingdom',
        'US': 'United States',
        'UM': 'United States Outlying Islands',
        'UY': 'Uruguay',
        'UZ': 'Uzbekistan',
        'VU': 'Vanuatu',
        'VE': 'Venezuela',
        'VN': 'Viet Nam',
        'VG': 'Virgin Islands, British',
        'VI': 'Virgin Islands, U.S.',
        'WF': 'Wallis And Futuna',
        'EH': 'Western Sahara',
        'YE': 'Yemen',
        'ZM': 'Zambia',
        'ZW': 'Zimbabwe'
    };

    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}

function convertCWDatetoNSDate(cwDateString, returnMMDDYYYY) {
    var NSDate;
    //YYYYMMDD format comes from CW Manage, need to convert it to MM/DD/YYYY netsuite date format
    try {

        var cwDateSplit = cwDateString.split('T');
        var cwDateNew;
        var nsDateString = '';
        //split to remove seconds and minutes
        if (cwDateSplit[0]) {
            //split to categorize yyyy mm dd
            cwDateNew = cwDateSplit[0].split('-');
        }

        //cwDateNew should have 3 arrays now, yyyy[0] mm[1] dd[2]
        if (cwDateNew) {
            //convert to NS Date format
            nsDateString = cwDateNew[0] + '-' + cwDateNew[1] + '-' + cwDateNew[2];
            var newMonth = Number(cwDateNew[1]) - 1;
            NSDate = new Date(cwDateNew[0], newMonth, cwDateNew[2]); // 10/24/2022 - fix for all other time entry formats in NS, like YYYY-MM-DD
            nlapiLogExecution('AUDIT', 'Conversion Tran Date: ' + NSDate);

            if (returnMMDDYYYY == true)
                NSDate = cwDateNew[1] + '/' + cwDateNew[2] + '/' + cwDateNew[0];
        }


    } catch (err) {
        nlapiLogExecution('DEBUG', 'Couldnt split CW Date for custom field', err);
    }

    return NSDate;
}

function formatDateToYYYYMMDD(dateString) {
    var returnDate = '';

    if (dateString) {
        var javaDateObj = nlapiStringToDate(dateString);

        var yearString = javaDateObj.getFullYear();
        var monthString = Number(Number(javaDateObj.getMonth()) + 1);
        var dayString = javaDateObj.getDate();

        returnDate = yearString + '-' + monthString + '-' + dayString;
    }

    return returnDate;
}

function getSystemAdminEmployeeId() {
    var empId = '-5';

    try {
        //load search for scheduled script
        var colArr = new Array();


        colArr.push(new nlobjSearchColumn('internalid').setSort(false));

        var searchResults = nlapiSearchRecord('employee', null, null, colArr);

        if (searchResults) {
            for (var i = 0; i < 1; i++) {
                var searchResultRow = searchResults[i];
                empId = searchResultRow.getValue('internalid');
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Couldnt get system admin employee id for email: ', err);
        empId = '-5';
    }

    return empId;
}

function getTotalActiveConnections() {
    var connectionCount = 0;

    var col = [];
    col[0] = new nlobjSearchColumn('internalid');

    var filters = [];

    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

    var searchresults = nlapiSearchRecord('customrecord_ctc_cw_setup', null, filters, col);


    if (searchresults) {
        for (var i = 0; i < searchresults.length; i++) {
            connectionCount++;
        }
    }

    return connectionCount;
}

function checkIfLicenseIsValid() {

    try {
        var returnLicenseObject = {};

        var default_accountId = nlapiGetContext().getCompany();

        var total_active_connections = getTotalActiveConnections();

        var licenseExpirationDate = '';
        var installedLicenseCount = 0;

        var authURL = NSCATALYST_SERVER_URL + 'productauth.php?producttypeid=' + LICENSE_PRODUCT_ID + '&nsaccountid=' + default_accountId.toLowerCase();
        nlapiLogExecution('AUDIT', 'License Auth URL String:', authURL);

        var authServerObject = nlapiRequestURL(authURL);

        if (authServerObject) {
            var authServerJSONData = authServerObject.getBody();
            if (authServerJSONData) {
                nlapiLogExecution('AUDIT', 'Auth Server Return String:', authServerJSONData);
                var licenseData = JSON.parse(authServerJSONData);
                if (licenseData) {
                    if (licenseData.error) {
                        returnLicenseObject.message = 'ERROR: Your product has a missing license, please contact Catalyst to have your product license installed.';
                        returnLicenseObject.isValid = false;
                        return returnLicenseObject;
                    }
                    if (licenseData.status) {
                        if (licenseData.status == 'inactive') {
                            returnLicenseObject.isValid = false;
                            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'Your Product has been disabled by Catalyst, please contact damon@nscatalyst.com for assistance');
                            returnLicenseObject.message = 'Invalid License - Your Product has been disabled by Catalyst, please contact damon@nscatalyst.com for assistance';
                            return returnLicenseObject;
                        }
                    }
                    if (licenseData.additional_field) {
                        if (total_active_connections > Number(licenseData.additional_field)) {
                            returnLicenseObject.isValid = false;
                            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'License Count Mismatch: Your Product has been disabled by Catalyst, please contact damon@nscatalyst.com for assistance');
                            returnLicenseObject.message = 'Invalid License - License Count Mismatch: Your Product has been disabled by Catalyst, please contact damon@nscatalyst.com for assistance';
                            return returnLicenseObject;
                        }
                    }
                    installedLicenseCount = licenseData.additional_field;
                    licenseExpirationDate = licenseData.expiration_date;
                }
            }
        }
    } catch (autherr) {
        nlapiLogExecution('ERROR', 'Could not authenticate to catalyst licensing server: ', autherr);
        returnLicenseObject.message = 'Problem connecting to auth server - but your product will still continue to function.\nPlease contact catalyst if you encounter any issues. \nERROR: ' + autherr;
        returnLicenseObject.isValid = true;
        return returnLicenseObject;
    }

    returnLicenseObject.isValid = true;
    returnLicenseObject.message = 'Valid Until: ' + licenseExpirationDate + '<br />' + 'Valid License Count: ' + total_active_connections + ' used out of ' + installedLicenseCount + ' available licenses.';
    return returnLicenseObject; //valid license
}

function checkIfLicenseIsValid_old() {
    //deprecated - 10/26/2023
    try {
        var returnLicenseObject = {};

        //get account settings
        var default_productId = LICENSE_PRODUCT_ID;
        var default_date = new Date();
        var default_accountId = nlapiGetContext().getCompany();

        //new addition - license key count for multi-subsidiary license
        var license_count = 1;
        var total_active_connections = getTotalActiveConnections();

        //get license key and decrypt
        var encryptedLicenseKey = getGlobalSetting('custrecord_ctc_cw_settings_licensekey', getDefaultSettingsRecordId());

        var decryptedLicenseKey = nlapiDecrypt(encryptedLicenseKey, "aes", LICENSE_AES_SECRET_KEY);

        var resultArray = decryptedLicenseKey.split("|");

        //added 2/2/2022: Fix for critical flaw detected with different dates on General Preferences or User Set Preferences
        //since the license key date will always be on MM/DD/YYYY format, convert it to ISO 8601 YYYY/MM/DD so that the javascript Date() function would parse it correctly
        var licenseKeyDate = formatDateStringMMDDYYYYToYYYYMMDD(resultArray[1]);

        var license_productId = resultArray[0];
        //var license_date = nlapiStringToDate(resultArray[1]);
        var license_date = new Date(licenseKeyDate); //2/2/2022 fix for date
        var license_accountId = resultArray[2];

        if (resultArray[3]) {
            license_count = resultArray[3];
        } else {
            license_count = 1;
        }

        var errorMessage = '';

        //invalid product id
        if (license_productId != default_productId) {
            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'Reason: Mismatch Product ID. Are you sure this license is for the correct catalyst product? License Product ID: ' + license_productId + '  Current Product ID: ' + default_productId);
            returnLicenseObject.message = 'Mismatch Product ID. Are you sure this license is for the correct catalyst product? License Product ID: ' + license_productId + '  Current Product ID: ' + default_productId;
            returnLicenseObject.isValid = false;
            return returnLicenseObject;
        }

        //invalid account id
        if (license_accountId.indexOf(default_accountId.toLowerCase()) == -1) {
            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'Reason: Mismatch Netsuite Account. Are you sure this license is for this customer? License Account ID: ' + license_accountId + '  Current Account ID: ' + default_accountId);
            returnLicenseObject.message = 'Mismatch Netsuite Account. Are you sure this license is for this customer? License Account ID: ' + license_accountId + '  Current Account ID: ' + default_accountId;
            returnLicenseObject.isValid = false;
            return returnLicenseObject;
        }

        //invalid date
        var dateDifference = date_difference(default_date, license_date);
        if (dateDifference < 0) {
            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'Reason: License has expired, please renew. Expiration Date: ' + license_date + ' Current Date: ' + default_date);
            returnLicenseObject.message = 'License has expired, please renew. Expiration Date: ' + license_date + ' Current Date: ' + default_date;
            returnLicenseObject.isValid = false;
            return returnLicenseObject;
        }
        //invalid license key count
        if (license_count < total_active_connections) {
            nlapiLogExecution('ERROR', 'Invalid License Key - TERMINATING SCRIPT', 'Reason: License count is not enough for this account, please renew. Current Valid License Count: ' + license_count);
            returnLicenseObject.message = 'License count is not enough for this account, please renew. Current Valid License Count: ' + license_count + ' out of ' + total_active_connections + ' active connections.';
            returnLicenseObject.isValid = false;
            return returnLicenseObject;
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Cannot read license key', err);
        returnLicenseObject.message = err;
        returnLicenseObject.isValid = false;
        return returnLicenseObject;
    }

    returnLicenseObject.isValid = true;
    returnLicenseObject.message = 'Valid Until: ' + license_date + '<br />' + 'Valid License Count: ' + total_active_connections + ' used out of ' + license_count + ' available licenses.';
    return returnLicenseObject; //valid license
}

function date_difference(date1, date2) {
    //if 0 or positive number, then date is still within expiration period, if negative then license is expired
    var timeDiff = date2.getTime() - date1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Get 1 day in milliseconds
    return diffDays;
}

function checkIfVendor(CWCompanyTypeArray, typeId) {
    //return true if vendor, return false if customer
    if (CWCompanyTypeArray) {
        for (var i = 0; i < CWCompanyTypeArray.length; i++) {
            var CWCompanyTypeObject = CWCompanyTypeArray[i];
            //nlapiLogExecution('DEBUG', 'Vendor Flag VALUE = ' + CWCompanyTypeObject.vendorFlag);
            if (CWCompanyTypeObject.id == typeId && CWCompanyTypeObject.vendorFlag == true) {
                //nlapiLogExecution('DEBUG', 'Setting True for Type ID: ' + typeId, 'Vendor Flag = ' + CWCompanyTypeObject.vendorFlag );
                return true;
            }
        }
    }

    return false;
}

function findCompanyTypeName(CWCompanyTypeArray, typeId) {
    //return the name of the company type id
    var typeName;

    if (CWCompanyTypeArray) {
        for (var i = 0; i < CWCompanyTypeArray.length; i++) {
            var CWCompanyTypeObject = CWCompanyTypeArray[i];
            if (CWCompanyTypeObject.id == typeId)
                return CWCompanyTypeObject.name;
        }
    }

    return typeName;
}

function findCWObjectName(CWObjectArray, cwObjectId) {
    //a generic function to return a "name" of a cw object given its id
    var cwObjectName = '';

    if (CWObjectArray) {
        for (var i = 0; i < CWObjectArray.length; i++) {
            var CWObject = CWObjectArray[i];
            if (CWObject.id == cwObjectId) {
                //nlapiLogExecution('DEBUG', 'Found Loc Name for Loc ID: ' + cwObjectId, CWObject.name);
                return CWObject.name;
            }
        }
    }

    return cwObjectName;
}

function getSiteData(cwCompanyId, specificAddressLookup, cwAccountId) {
    //returns an array of CWSite given a CWCompany Id, used for conversion of CW Company
    //2 functions: if specific address lookup is filled, search will check on specific flag for 'billing', 'primary', 'shipping' or 'mailing' address,
    // else return all addresses if specific address lookup is null
    var cwSiteArray = [];
    var colArr = new Array();
    var filterArr = new Array();

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('name'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_siteid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_addr1'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_addr2'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_city'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_statename'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_zip'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_country'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_phonenumber'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_faxnumber'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_companyid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_companyname'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_primaryaddrflag').setSort(true)); //sort so that the first address listed on top is primary address
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defbillingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defshippingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defmailingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_stateidentifier'));

        if (cwCompanyId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_companyid', null, 'equalto', cwCompanyId));

        if (specificAddressLookup == 'primary')
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_primaryaddrflag', null, 'is', 'T'));

        if (specificAddressLookup == 'billing')
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_defbillingflag', null, 'is', 'T'));

        if (specificAddressLookup == 'shipping')
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_defshippingflag', null, 'is', 'T'));

        if (specificAddressLookup == 'mailing')
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_defmailingflag', null, 'is', 'T'));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_cwaccount', null, 'anyof', cwAccountId));

        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_site', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                var CWSiteObject = new CWSite();
                CWSiteObject.internalid = searchResultRow.getValue('internalid');
                CWSiteObject.name = searchResultRow.getValue('name');
                CWSiteObject.id = searchResultRow.getValue('custrecord_ctc_cw_siteid');
                CWSiteObject.addressLine1 = searchResultRow.getValue('custrecord_ctc_cw_site_addr1');
                CWSiteObject.addressLine2 = searchResultRow.getValue('custrecord_ctc_cw_site_addr2');
                CWSiteObject.city = searchResultRow.getValue('custrecord_ctc_cw_site_city');
                CWSiteObject.stateReference.name = searchResultRow.getValue('custrecord_ctc_cw_site_statename');
                CWSiteObject.zip = searchResultRow.getValue('custrecord_ctc_cw_site_zip');
                CWSiteObject.country.name = searchResultRow.getValue('custrecord_ctc_cw_site_country');
                CWSiteObject.phoneNumber = searchResultRow.getValue('custrecord_ctc_cw_site_phonenumber');
                CWSiteObject.faxNumber = searchResultRow.getValue('custrecord_ctc_cw_site_faxnumber');
                CWSiteObject.company.id = searchResultRow.getValue('custrecord_ctc_cw_site_companyid');
                CWSiteObject.company.name = searchResultRow.getValue('custrecord_ctc_cw_site_companyname');
                CWSiteObject.primaryAddressFlag = searchResultRow.getValue('custrecord_ctc_cw_site_primaryaddrflag');
                CWSiteObject.defaultBillingFlag = searchResultRow.getValue('custrecord_ctc_cw_site_defbillingflag');
                CWSiteObject.defaultShippingFlag = searchResultRow.getValue('custrecord_ctc_cw_site_defshippingflag');
                CWSiteObject.defaultMailingFlag = searchResultRow.getValue('custrecord_ctc_cw_site_defmailingflag');
                CWSiteObject.stateReference.identifier = searchResultRow.getValue('custrecord_ctc_cw_site_stateidentifier');
                cwSiteArray.push(CWSiteObject);
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get site data for cw company id: ' + cwCompanyId, err);
    }
    return cwSiteArray;
}

function JSONReplacer(key, value) {
    if (typeof value == "number" && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function isEmpty(stValue) {
//if (stValue == 0) return false;

    if ((stValue == '') || (stValue == null) || (stValue == undefined)) {
        return true;
    } else if (typeof stValue == 'object') {
        for (var prop in stValue) {
            if (stValue.hasOwnProperty(prop))
                return false;
        }

        return;
    } else {
        if (stValue instanceof String) {
            if ((stValue == '')) {
                return true;
            }
        } else if (stValue instanceof Array) {
            if (stValue.length == 0) {
                return true;
            }
        }

        return false;
    }
}

function getSearchResults(recordType, searchId, filters, columns) {

    if (!isEmpty(searchId)) {
        var savedSearch = nlapiLoadSearch(recordType, searchId);

        if (!isEmpty(filters)) {
            savedSearch.addFilters(filters);
        }
        if (!isEmpty(columns)) {
            savedSearch.addColumns(columns);
        }
    } else {
        var savedSearch = nlapiCreateSearch(recordType);
        savedSearch.filters = filters;
        savedSearch.columns = columns;
    }
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
            checkusageRemaining();
        }
        checkusageRemaining();
    } while (resultslice.length >= 1000);

    return returnSearchResults;
}

function checkIfSiteExists(cwSiteId, lastUpdated, cwAccountId) {
    //returns true or false, searching a CW Site ID on NS system
    var siteObject = {};
    siteObject.siteExists = false;
    siteObject.needsUpdate = false;

    var colArr = new Array();
    var filterArr = new Array();

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_siteid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_lastupdated'));

        if (cwSiteId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_siteid', null, 'equalto', cwSiteId));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_cwaccount', null, 'anyof', cwAccountId));


        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_site', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                siteObject.siteExists = true;
                siteObject.internalid = searchResultRow.getValue('internalid');

                if (searchResultRow.getValue('custrecord_ctc_cw_site_lastupdated') != lastUpdated)
                    siteObject.needsUpdate = true;
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get site data for cw company id: ' + cwCompanyId, err);
    }

    return siteObject;
}

function checkIfAgreementAdditionExists(cwAdditionId, cwAccountId) {
    //returns true or false, searching a CW Site ID on NS system
    var agrExists = false;
    var colArr = new Array();
    var filterArr = new Array();

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agrad_id'));

        if (cwAdditionId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agrad_id', null, 'equalto', cwAdditionId));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agrad_cwaccount', null, 'anyof', cwAccountId));


        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_agreementaddition', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                agrExists = true;
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get agreement addition data for agreement addition id: ' + cwAdditionId, err);
    }

    return agrExists;
}

function checkIfAgreementAdjustmentExists(cwAdditionId, cwAccountId) {
    //returns true or false, searching a CW Site ID on NS system
    var agrExists = false;
    var colArr = new Array();
    var filterArr = new Array();

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agraj_id'));

        if (cwAdditionId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agraj_id', null, 'equalto', cwAdditionId));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agraj_cwacccount', null, 'anyof', cwAccountId));


        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_agreementadjustment', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                agrExists = true;
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get agreement adjustment data for agreement adjustment id: ' + cwAdditionId, err);
    }

    return agrExists;
}

function checkIfAgreementSiteExists(cwAdditionId, cwAccountId) {
    //returns true or false, searching a CW Site ID on NS system
    var agrExists = false;
    var colArr = new Array();
    var filterArr = new Array();

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_agrst_id'));

        if (cwAdditionId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agrst_id', null, 'equalto', cwAdditionId));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_agrst_cwaccount', null, 'anyof', cwAccountId));


        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_agreementsite', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                agrExists = true;
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get agreement site data for agreement site id: ' + cwAdditionId, err);
    }

    return agrExists;
}

function convertNSDateToCWDateFormat(nsDate, addDays) {
    var returnDate = '';
    try {
        //accepts a netsuite date object
        //output should be YYYY-DD-MMT00:00:00Z
        if (nsDate) {
            var newdate = nlapiStringToDate(nsDate);
            if (addDays) {
                newdate.setDate(newdate.getDate() + addDays);
            }
            var returnDateTemp = newdate.toISOString();
            if (returnDateTemp) {
                //remove last zero
                returnDate = returnDateTemp.substr(0, 10) + "T00:00:00Z";
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', err);
    }

    return returnDate;
}

function convertNSBooleantoCWBoolean(booleanValue) {
    var returnVal = false;

    if (booleanValue == 'T')
        returnVal = true;

    return returnVal;
}

function addDaysToADate(date, days) {
    //adds specific number of days to a js date object
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getFieldData(baseRecordId, nsJSONInput, lineNumber) {

    //JSON Based: Usage - this will accept an array of elements based on nsJSONInput:
    // E.g.
    // [
    //     {
    //         "fieldName": "custbody_hp_entity_primary_contact",
    //         "recordType": "salesorder",
    //         "isText": false
    //     },
    //     {
    //         "fieldName": "custentity_ctc_cw_cnt_link",
    //         "recordType": "contact",
    //         "isText": false
    //     },
    //     {
    //         "fieldName": "custrecord_ctc_cw_contacts_id",
    //         "recordType": "customrecord_ctc_cw_contacts",
    //         "isText": false
    //     }
    // ]

    var returnData = '';

    if (nsJSONInput) {
        try {
            var fieldLookupObject = JSON.parse(nsJSONInput);
            if (fieldLookupObject) {
                nlapiLogExecution('DEBUG', 'NS Field Array Length: ' + fieldLookupObject.length);
                for (var i = 0; i < fieldLookupObject.length; i++) {
                    if (i == 0) { //root record
                        if (fieldLookupObject[i].bodyOrLine == 'line') {
                            var record = nlapiLoadRecord(fieldLookupObject[i].recordType, baseRecordId);
                            if (fieldLookupObject[i].isText == false) {
                                fieldLookupObject[i].currentValue = record.getLineItemValue(fieldLookupObject[i].sublistName, fieldLookupObject[i].fieldName, lineNumber);
                            } else {
                                fieldLookupObject[i].currentValue = record.getLineItemText(fieldLookupObject[i].sublistName, fieldLookupObject[i].fieldName, lineNumber);
                            }
                        } else {
                            fieldLookupObject[i].currentValue = nlapiLookupField(fieldLookupObject[i].recordType, baseRecordId, fieldLookupObject[i].fieldName, fieldLookupObject[i].isText);
                        }
                    } else {
                        fieldLookupObject[i].currentValue = nlapiLookupField(fieldLookupObject[i].recordType, fieldLookupObject[i - 1].currentValue, fieldLookupObject[i].fieldName, fieldLookupObject[i].isText);
                    }
                }
                //just get the last currentValue of the last element
                returnData = fieldLookupObject[fieldLookupObject.length - 1].currentValue;
            }
        } catch (err) {
            nlapiLogExecution('ERROR', 'Could not interpret default fields for JSON Input: ' + nsJSONInput, err);
        }
    }

    return returnData;
}

function getAllAccountId(isScheduled, primarySettingsOnly) {
    //grabs all cw accounts settings id and override keydate
    var accountObjectArray = [];

    //load search for scheduled script
    var colArr = new Array();
    var filterArr = new Array();

    colArr.push(new nlobjSearchColumn('internalid').setSort(false));
    colArr.push(new nlobjSearchColumn('name'));

    if (isScheduled)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_scheduledjob_all', null, 'is', isScheduled)); // make sure the schedule daily job setting is turned on

    if (primarySettingsOnly == 'T')
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_primarysettings', null, 'is', 'T')); // get the primary settings, regardless if its set to daily job

    var searchResults = nlapiSearchRecord('customrecord_ctc_cw_setup', null, filterArr, colArr);

    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            var searchResultRow = searchResults[i];
            var cwAccountId = searchResultRow.getValue('internalid');
            var accountObject = {};
            accountObject.overrideKeyDate = getOverrideKeyDate(cwAccountId);
            accountObject.cwAccountId = cwAccountId;
            accountObject.name = searchResultRow.getValue('name');
            nlapiLogExecution('DEBUG', 'Account: ' + cwAccountId);
            accountObjectArray.push(accountObject);
        }
    }

    return accountObjectArray;
}

function getOverrideKeyDate(cwAccountId) {
    var overrideKeyDate;

    var recurringKeyDateDefaultStart = getGlobalSetting('custrecord_ctc_cw_settings_recjobkeydate', cwAccountId); // check to see if there is an override key date set for the recurring job
    if (recurringKeyDateDefaultStart) {
        overrideKeyDate = recurringKeyDateDefaultStart;
        nlapiLogExecution('DEBUG', 'Static Override Key Date Value: ' + overrideKeyDate);
    } else {
        try {
            var recurringDynamicKeyDateDefaultStart = getGlobalSetting('custrecord_ctc_cw_settings_recimpkeydate', cwAccountId);

            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_CURRENT_DAY) {
                overrideKeyDate = nlapiDateToString(new Date()); // set key date (today) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_YESTERDAY) {
                overrideKeyDate = nlapiDateToString(new Date(new Date().setDate(new Date().getDate() - 1))); // set key date (yesterday) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_3DAYSAGO) {
                overrideKeyDate = nlapiDateToString(new Date(new Date().setDate(new Date().getDate() - 3))); // set key date (3 days ago) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_7DAYSAGO) {
                overrideKeyDate = nlapiDateToString(new Date(new Date().setDate(new Date().getDate() - 7))); // set key date (7d ays ago) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_DAY_OF_CURR_MONTH) {
                var firstDayThisMonth = new Date();
                firstDayThisMonth.setDate(1);
                firstDayThisMonth.setMonth(firstDayThisMonth.getMonth());
                overrideKeyDate = nlapiDateToString(firstDayThisMonth); // set key date (1st day of month) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_DAY_OF_PREV_MONTH) {
                var firstDayPrevMonth = new Date();
                firstDayPrevMonth.setDate(1);
                firstDayPrevMonth.setMonth(firstDayPrevMonth.getMonth() - 1);
                overrideKeyDate = nlapiDateToString(firstDayPrevMonth); // set key date (1st day of last month) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_DAY_FROM_SIXMONTHSAGO) {
                var firstDaySixMonthsAgo = new Date();
                firstDaySixMonthsAgo.setDate(1);
                firstDaySixMonthsAgo.setMonth(firstDaySixMonthsAgo.getMonth() - 6);
                overrideKeyDate = nlapiDateToString(firstDaySixMonthsAgo); // set key date (1st day from 6 months ago) for the day when the script is run
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_DAY_OF_CURRENT_YEAR) {
                var firstDayOfCurrentYear = new Date();
                overrideKeyDate = '1/1/' + firstDayOfCurrentYear.getFullYear().toString(); //1st day of current year
            }
            if (recurringDynamicKeyDateDefaultStart == IMPORT_KEYDATE_DAY_OF_LAST_YEAR) {
                var firstDayOfLastYear = new Date();
                overrideKeyDate = '1/1/' + (firstDayOfLastYear.getFullYear() - 1).toString(); //1st day of last year
            }
            nlapiLogExecution('DEBUG', 'Dynamic Key Date Value: ' + overrideKeyDate);
        } catch (err) {
            nlapiLogExecution('ERROR', 'Couldnt set override key date, setting default date to today');
            overrideKeyDate = nlapiDateToString(new Date());
        }
    }

    return overrideKeyDate;
}

function formatDecimalToHourFormat(hoursDecimal) {

    try {
        var decimalTime = parseFloat(hoursDecimal);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hours * 60 * 60);
        var minutes = Math.floor((decimalTime / 60));
        decimalTime = decimalTime - (minutes * 60);
        var seconds = Math.round(decimalTime);
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return hours + ":" + minutes;

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not format decimal to hour format: ' + hoursDecimal, err);
    }


}

function getCWAccountList(userRole, userEmployeeId, grabAll) {
    //grabs all cw accounts settings id
    var accountObjectArray = [];

    //load search for scheduled script
    var colArr = new Array();
    var filterArr = new Array();

    colArr.push(new nlobjSearchColumn('internalid').setSort(false));
    colArr.push(new nlobjSearchColumn('name'));

    nlapiLogExecution('DEBUG', 'User Role = ' + userRole);
    nlapiLogExecution('DEBUG', 'User ID = ' + userEmployeeId);

    if (userRole != 3 || grabAll == true) { //skip these filters if user role is Administrator (3)
        filterArr = [
            ['custrecord_ctc_cw_settings_acs_role', 'anyof', userRole],
            'OR',
            ['custrecord_ctc_cw_settings_acs_employee', 'anyof', userEmployeeId],
            'OR',
            ['custrecord_ctc_cw_settings_acs_accessall', 'is', 'T']
        ];
    }

    var searchResults = nlapiSearchRecord('customrecord_ctc_cw_setup', null, filterArr, colArr);

    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            var searchResultRow = searchResults[i];
            var cwAccountId = searchResultRow.getValue('internalid');
            var accountObject = {};
            accountObject.name = searchResultRow.getValue('name');
            accountObject.cwAccountId = cwAccountId;
            nlapiLogExecution('DEBUG', 'Account: ' + cwAccountId + ' Name: ' + accountObject.name);
            accountObjectArray.push(accountObject);
        }
    }

    return accountObjectArray;
}

function buildAccountSelectorField(fieldSelector, userRole, userEmployeeId, defaultCWAccountId) {
    var cwAccountId;
    var defaultRecordExists = false;
    var primarySettingsId = getDefaultSettingsRecordId();

    try {

        var accountList = getCWAccountList(userRole, userEmployeeId);
        if (accountList) {
            for (var i = 0; i < accountList.length; i++) {
                fieldSelector.addSelectOption(accountList[i].cwAccountId, accountList[i].name, true);
                cwAccountId = accountList[i].cwAccountId;

                if (primarySettingsId == accountList[i].cwAccountId)
                    defaultRecordExists = true;
            }
        }
        if (defaultCWAccountId) {
            fieldSelector.setDefaultValue(defaultCWAccountId); //TODO: Multi-sub change
            cwAccountId = defaultCWAccountId;
        }

        //default one time auto-selects
        if (defaultRecordExists == true && defaultCWAccountId == null) {
            fieldSelector.setDefaultValue(primarySettingsId);
            cwAccountId = primarySettingsId;
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get cw account list for drop down', err);
    }

    return cwAccountId;
}

function grabLineIDs(CWInvoiceID, cwAccountId, dataRequestString, dataFilterString) {
    var returnIDArray = [];

    nlapiLogExecution('DEBUG', 'Data Filter String ' + dataFilterString);
    try {
        var JSONData = getJSONData(dataRequestString, 1, 1000, 1, null, null, null, cwAccountId, dataFilterString);
        if (JSONData) {
            for (var i = 0; i < JSONData.length; i++) {
                returnIDArray.push(JSONData[i].id.toFixed(0));
                nlapiLogExecution('DEBUG', 'Got Line ID: ' + JSONData[i].id.toFixed(0), 'From CW Invoice ID: ' + CWInvoiceID);
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get invoice lines on CW Manage for Invoice ID: ' + CWInvoiceID);
    }

    return returnIDArray;
}

function grabPOLineIDs(CWPOID, cwAccountId, dataRequestString, purchaseOrderHeaderId, dataFilterString) {
    //modified version for PO Lines
    var returnIDArray = [];

    nlapiLogExecution('DEBUG', 'Data Filter String ' + dataFilterString);
    try {
        var JSONData = getJSONData(dataRequestString + '/' + purchaseOrderHeaderId + '/' + PURCHASEORDERLINE_REQ_STRING, 1, 1000, 1, null, null, null, cwAccountId);
        if (JSONData) {
            for (var i = 0; i < JSONData.length; i++) {
                returnIDArray.push(JSONData[i].id.toFixed(0));
                nlapiLogExecution('DEBUG', 'Got Line ID: ' + JSONData[i].id.toFixed(0), 'From CW PO ID: ' + CWPOID);
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get po lines on CW Manage for PO ID: ' + CWPOID);
    }

    return returnIDArray;
}

function getNSCurrencyISOCode(nsCurrencyId) {
    var returnCurrencyISO = 'USD';

    try {
        returnCurrencyISO = nlapiLookupField('currency', nsCurrencyId, 'symbol');
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get currency ISO code for currency id: ' + nsCurrencyId, err);
    }

    return returnCurrencyISO;
}

function getCWCountryID(countryName, cwCountryList) {
    //returns the CW Id of the country name
    nlapiLogExecution('DEBUG', 'Country Name: ' + countryName);
    nlapiLogExecution('DEBUG', 'CW Country List Length: ' + cwCountryList.length);
    var returnId;
    if (cwCountryList) {
        for (var i = 0; i < cwCountryList.length; i++) {
            if (countryName == cwCountryList[i].name) {
                returnId = cwCountryList[i].id;
            }
        }
    }
    return returnId;
}

function getSiteAddressObject(cwSiteId, cwAccountId) {

    var colArr = new Array();
    var filterArr = new Array();

    var returnSiteObject = {};

    try {

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('name'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_siteid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_addr1'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_addr2'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_city'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_statename'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_stateid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_stateidentifier'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_zip'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_country'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_phonenumber'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_faxnumber'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_primaryaddrflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defshippingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defbillingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_defmailingflag'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_companyid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_companyname'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_site_cwaccount'));

        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_siteid', null, 'equalto', cwSiteId));

        if (cwAccountId)
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_site_cwaccount', null, 'anyof', cwAccountId));


        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_site', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                returnSiteObject.customerStreetLine1 = searchResultRow.getValue('custrecord_ctc_cw_site_addr1');
                returnSiteObject.customerStreetLine2 = searchResultRow.getValue('custrecord_ctc_cw_site_addr2');
                returnSiteObject.customerCity = searchResultRow.getValue('custrecord_ctc_cw_site_city');
                returnSiteObject.customerState = searchResultRow.getValue('custrecord_ctc_cw_site_stateidentifier');
                returnSiteObject.customerZip = searchResultRow.getValue('custrecord_ctc_cw_site_zip');
                returnSiteObject.companyNameText = searchResultRow.getText('custrecord_ctc_cw_site_companyname');
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get site object for id: ' + cwSiteId, err);
    }

    return returnSiteObject;
}

function getCWAccountIDFromStagingRecord(stagingRecordType, stagingRecordInternalId, stagingRecordCWAccountFieldName, stagingRecordCWIDFieldName) {
    //gets the CW Account ID and CW ID from a specific staging record (used for synbacks to CW Manage)
    var returnObject = {};

    try {
        //load search for scheduled script
        var colArr = new Array();
        var filterArr = new Array();

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('name'));
        colArr.push(new nlobjSearchColumn(stagingRecordCWAccountFieldName));
        colArr.push(new nlobjSearchColumn(stagingRecordCWIDFieldName));

        filterArr.push(new nlobjSearchFilter('internalid', null, 'anyof', stagingRecordInternalId));

        var searchResults = nlapiSearchRecord(stagingRecordType, null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                returnObject.cwaccountid = searchResultRow.getValue(stagingRecordCWAccountFieldName);
                returnObject.cwid = searchResultRow.getValue(stagingRecordCWIDFieldName);
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not grab cw account id from staging record id: ' + stagingRecordInternalId, err);
    }

    return returnObject;
}

//get the CW ID of staging record based on internal id
function getCWRecordIdFromInternalId(searchName, NSColumnName, NSInternalId, columnResult) {

    var cwId = '';

    try {
        var col = [];
        var filter = [];


        col[0] = new nlobjSearchColumn(columnResult);
        filter[0] = new nlobjSearchFilter(NSColumnName, null, 'anyof', NSInternalId);

        var searchResults = nlapiSearchRecord(searchName, null, filter, col);
        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                cwId = (searchResults[i].getValue(columnResult));
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for CW ID of Internal Id: ' + NSInternalId, err)
    }
    return cwId;
}

function createSyncRunLog(entityType, runType, totalRecordsSelected, messageLog, defaultStatus, defaultPercentComplete, defaultProcessed, defaultCreated, defaultUpdated, defaultFailed) {
    var logRecordId;

    try {
        nlapiLogExecution('DEBUG', 'Creating Run Log...');
        var logRecord = nlapiCreateRecord('customrecord_ctc_cw_runlog');
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_recordtype', entityType);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_type', runType);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_status', defaultStatus);

        if (totalRecordsSelected > 0)
            logRecord.setFieldValue('custrecord_ctc_cw_runlog_totalrecords', totalRecordsSelected);

        logRecord.setFieldValue('custrecord_ctc_cw_runlog_processed', defaultProcessed);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_created', defaultCreated);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_recordsupdated', defaultUpdated);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_failed', defaultFailed);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_percentcomplete', defaultPercentComplete);
        logRecord.setFieldValue('custrecord_ctc_cw_runlog_message', messageLog);

        logRecordId = nlapiSubmitRecord(logRecord);
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not create a log id: ', err);
    }

    return logRecordId;
}

function getCustomerSyncList(savedSearchList, cwAccountId) {
    //utilizes a saved search in Netsuite to grab existing customers to be synchronized back to Manage
    var returnObjectArr = [];
    var internalIdArr = [];

    var filterArr = [];
    //set filter to cw account id
    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_cmp_cwaccount', null, 'anyof', cwAccountId));

    var customerListResultSet = getSearchResults(null, savedSearchList, filterArr);
    nlapiLogExecution('DEBUG', 'Customer Search List ID: ' + savedSearchList);


    //global vars
    var defaultCompanyType = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_deftype', cwAccountId);
    var defaultCompanyStatus = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_defstat', cwAccountId);
    var defaultCompanyTerritoryManager = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_defmgr', cwAccountId);
    var defaultCompanyCurrency = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_defcurr', cwAccountId);
    var defaultCompanyTaxCode = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_deftax', cwAccountId);
    var defaultCompanyTerm = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_defterm', cwAccountId);
    var defaultCompanyTerritory = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_defter', cwAccountId);
    var defaultCompanyIdPrefix = getGlobalSetting('custrecord_ctc_cw_pl_createcmp_prefix', cwAccountId);

    //build internal id
    for (var i = 0; i < customerListResultSet.length; i++) {
        var intid = customerListResultSet[i].getValue(new nlobjSearchColumn('internalid', null, null));
        internalIdArr.push(intid);
        nlapiLogExecution('DEBUG', 'Custom INT ID: ' + intid);
    }


    for (var k = 0; k < internalIdArr.length; k++) {
        var customerId = internalIdArr[k];

        try {

            var customerRecord = nlapiLoadRecord('customer', customerId);
            if (customerRecord) {
                //var addressLineCount = customerRecord.getLineItemCount('custpage_addresslist');

                var objAddressArray = [];
                var objContactArray = [];
                var returnObject = {};

                //get header stuff
                returnObject.baserecordid = customerId;
                returnObject.companyName = customerRecord.getFieldValue('companyname');
                returnObject.companyIdentifier = defaultCompanyIdPrefix + customerId;
                returnObject.companyEmail = customerRecord.getFieldValue('email');
                returnObject.companyPhone = customerRecord.getFieldValue('phone');
                returnObject.companyFax = customerRecord.getFieldValue('fax');
                returnObject.companyWebsite = customerRecord.getFieldValue('url');
                returnObject.companyStatus = defaultCompanyStatus;
                returnObject.companyType = defaultCompanyType;
                returnObject.companyTerritoryManager = defaultCompanyTerritoryManager;
                returnObject.companyCurrency = defaultCompanyCurrency;
                returnObject.companyTax = defaultCompanyTaxCode;
                returnObject.companyTerritory = defaultCompanyTerritory;
                returnObject.companyTerm = defaultCompanyTerm;

                var addressLineCount = customerRecord.getLineItemCount('addressbook');
                var contactLineCount = customerRecord.getLineItemCount('contactroles');

                for (var i = 0; i < addressLineCount; i++) {
                    var objAddressLine = new Object();
                    objAddressLine.addressid = customerRecord.getLineItemValue('addressbook', 'addressbookaddress_key', i + 1);
                    objAddressArray.push(objAddressLine);
                }

                returnObject.addressList = objAddressArray;
                for (var i = 0; i < contactLineCount; i++) {
                    var objContactLine = new Object();
                    objContactLine.contactid = customerRecord.getLineItemValue('contactroles', 'contact', i + 1);
                    objContactArray.push(objContactLine);
                }
                returnObject.contactList = objContactArray;

                returnObjectArr.push(returnObject);
            }
        } catch (err) {
            nlapiLogExecution('ERROR', 'Could not load customer for syncback to Manage customer id: ' + customerId, err);
        }
        checkusageRemaining();
    }

    return returnObjectArr;

}

function getContactSyncList(savedSearchList, cwAccountId) {
    //utilizes a saved search in Netsuite to grab existing contacts to be synchronized back to Manage
    var returnObjectArr = [];
    var internalIdArr = [];
    var filterArr = [];
    //set filter to cw account id
    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_contacts_cwaccount', null, 'anyof', cwAccountId));

    var contactListResultSet = getSearchResults(null, savedSearchList, filterArr);
    nlapiLogExecution('DEBUG', 'Contact Search List ID: ' + savedSearchList);

    //TODO: Contact sync list has no cwaccount id filter!! Fix soon

    //global vars
    var defaultContactLocation = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_defloc', cwAccountId);
    var defaultContactDepartment = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_defdep', cwAccountId);
    var defaultContactRelationship = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_defrel', cwAccountId);
    var defaultContactType = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_deftype', cwAccountId);
    var defaultEmailFieldOnCW = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_defemail', cwAccountId);
    var defaultPhoneFieldOnCW = getGlobalSetting('custrecord_ctc_cw_pl_createcnt_defphone', cwAccountId);


    //build internal id
    for (var i = 0; i < contactListResultSet.length; i++) {
        var intid = contactListResultSet[i].getValue(new nlobjSearchColumn('internalid', null, null));
        internalIdArr.push(intid);
        nlapiLogExecution('DEBUG', 'Contact INT ID: ' + intid);
    }


    for (var k = 0; k < internalIdArr.length; k++) {
        var contactId = internalIdArr[k];

        try {

            nlapiLogExecution('DEBUG', 'Loading contact ID: ' + contactId);
            var contactRecord = nlapiLoadRecord('contact', contactId);
            if (contactRecord) {

                var objAddressArray = [];
                var objContactArray = [];
                var returnObject = {};

                //get header stuff
                returnObject.baserecordid = contactId;
                returnObject.internalid = contactId;
                returnObject.firstName = contactRecord.getFieldValue('firstname');
                nlapiLogExecution('DEBUG', 'First Name: ' + returnObject.firstName);
                returnObject.lastName = contactRecord.getFieldValue('lastname');
                returnObject.title = contactRecord.getFieldValue('title');
                returnObject.defaultPhoneType = defaultPhoneFieldOnCW;
                returnObject.defaultPhoneNbr = contactRecord.getFieldValue('phone');
                //cw info
                returnObject.locationId = defaultContactLocation;
                returnObject.departmentId = defaultContactDepartment;
                returnObject.relationshipId = defaultContactRelationship;
                returnObject.contactTypeId = defaultContactType;
                returnObject.email = contactRecord.getFieldValue('email');

                var CWCompanyIdOfContact = '';

                try {
                    var cwCompanyStagingLinkInternalId = nlapiLookupField('customer', contactRecord.getFieldValue('company'), 'custentity_ctc_cw_cmp_link');
                    if (cwCompanyStagingLinkInternalId)
                        CWCompanyIdOfContact = nlapiLookupField('customrecord_ctc_cw_cmp', cwCompanyStagingLinkInternalId, 'custrecord_ctc_cw_cmp_id');

                } catch (errcwc) {
                    nlapiLogExecution('ERROR', 'Could not get CW Company ID of Contact: ' + contactId);
                }

                returnObject.companyId = CWCompanyIdOfContact;

                var communicationDataArr = [];

                var contactEmail = returnObject.email;
                if (contactEmail) {
                    var communicationData = {};
                    var communicationDataType = {};
                    communicationDataType.name = defaultEmailFieldOnCW;
                    communicationData.type = communicationDataType;
                    communicationData.value = contactEmail;
                    communicationDataArr.push(communicationData);
                }

                var contactPrimaryPhone = returnObject.defaultPhoneNbr;
                if (contactPrimaryPhone) {
                    var communicationData2 = {};
                    var communicationDataType2 = {};
                    communicationDataType2.name = defaultPhoneFieldOnCW;
                    communicationData2.type = communicationDataType2;
                    communicationData2.value = contactPrimaryPhone;
                    communicationDataArr.push(communicationData2);
                }

                returnObject.communicationItems = communicationDataArr;

                //get other addresses for this contact
                var addressLineCount = contactRecord.getLineItemCount('addressbook');
                for (var i = 0; i < addressLineCount; i++) {
                    var objAddressLine = new Object();
                    objAddressLine.addressid = contactRecord.getLineItemValue('addressbook', 'addressbookaddress_key', i + 1);
                    objAddressArray.push(objAddressLine);
                }
                returnObject.addressList = objAddressArray;
                returnObjectArr.push(returnObject);
            }
        } catch (err) {
            nlapiLogExecution('ERROR', 'Could not load contact for syncback to Manage contact id: ' + contactId, err);
        }
        checkusageRemaining();
    }

    return returnObjectArr;

}

function getInvoiceBatchSyncList(savedSearchList, cwAccountId) {
    //grabs all internal id of cw staging record
    var returnObjectArr = [];
    var internalIdArr = [];
    var filterArr = [];

    //set filter to cw account id
    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_inv_cwaccount', null, 'anyof', cwAccountId));

    var invoiceBatchListResultSet = getSearchResults(null, savedSearchList, filterArr);
    nlapiLogExecution('DEBUG', 'Invoice batch Search List ID: ' + savedSearchList);

    //global vars

    //build internal id
    for (var i = 0; i < invoiceBatchListResultSet.length; i++) {
        var returnObject = {};
        var cwid = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('custrecord_ctc_cw_inv_id', null, null));
        var intid = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('internalid', null, null));
        var invNumber = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('custrecord_ctc_cw_inv_invoicenumber', null, null));
        returnObject.cwid = cwid;
        returnObject.intind = intid;
        returnObject.invoiceNumber = invNumber;

        returnObjectArr.push(returnObject);
        nlapiLogExecution('DEBUG', 'Invoice batch Internal ID: ' + intid);
        nlapiLogExecution('DEBUG', 'Invoice batch CW ID: ' + cwid);
        nlapiLogExecution('DEBUG', 'Invoice batch Invoice Number: ' + invNumber);
    }

    return returnObjectArr;

}

function getPOBatchSyncList(savedSearchList, cwAccountId) {
    //grabs all internal id of cw staging record
    var returnObjectArr = [];
    var internalIdArr = [];
    var filterArr = [];

    //set filter to cw account id
    if (cwAccountId)
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_po_cwaccount', null, 'anyof', cwAccountId));

    var invoiceBatchListResultSet = getSearchResults(null, savedSearchList, filterArr);
    nlapiLogExecution('DEBUG', 'PO batch Search List ID: ' + savedSearchList);

    //global vars

    //build internal id
    for (var i = 0; i < invoiceBatchListResultSet.length; i++) {
        var returnObject = {};
        var cwid = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('custrecord_ctc_cw_po_id', null, null));
        var intid = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('internalid', null, null));
        var poNumber = invoiceBatchListResultSet[i].getValue(new nlobjSearchColumn('custrecord_ctc_cw_po_ponumber', null, null));
        returnObject.cwid = cwid;
        returnObject.intind = intid;
        returnObject.poNumber = poNumber;

        returnObjectArr.push(returnObject);
        nlapiLogExecution('DEBUG', 'PO batch Internal ID: ' + intid);
        nlapiLogExecution('DEBUG', 'PO batch CW ID: ' + cwid);
        nlapiLogExecution('DEBUG', 'PO batch PO Number: ' + poNumber);
    }

    return returnObjectArr;

}

function checkusageRemaining() {
    if (nlapiGetContext().getExecutionContext() == 'scheduled') {
        var remainingUsage = nlapiGetContext().getRemainingUsage();
        //nlapiLogExecution('DEBUG', 'Remaining Usage: ', remainingUsage);

        if (remainingUsage < 1000) {
            var state = nlapiYieldScript();
            if (state.status == 'FAILURE')
                throw 'Failed to yield script';
            else if (state.status == 'RESUME')
                nlapiLogExecution('DEBUG', 'Resuming Script');
        }
    }
}

function getNSInternalId(nsRecordType, nsEntityNameField, entityName) {
    //finds an exactly named netsuite item/company/vendor and returns its name and internal id
    //trim front and leading white space
    entityName = entityName.trim();

    var nsInternalId;

    try {
        var colArr = [];
        var filterArr = [];

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn(nsEntityNameField));
        filterArr.push(new nlobjSearchFilter(nsEntityNameField, null, 'is', entityName));

        var searchResults = nlapiSearchRecord(nsRecordType, null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                nsInternalId = searchResultRow.getValue('internalid');
                nlapiLogExecution('DEBUG', 'Record match found: ' + nsInternalId);
            }
        }

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not find NS record to auto-map CW staging record: ' + entityName, err);
    }

    return nsInternalId;


}

function updateNSLinkRecord(nsRecordType, nsLinkFieldName, nsInternalId, cwStagingInternalId) {
    //opens a Netsuite record and updates its CW Link field to staging record
    var messageLog = '';
    try {
        //get this record type's first if this is an item
        if (nsRecordType == 'item') {

            nsRecordType = nlapiLookupField('item', nsInternalId, 'recordtype');
        }

        //main code
        var record = nlapiLoadRecord(nsRecordType, nsInternalId);
        if (record) {
            record.setFieldValue(nsLinkFieldName, cwStagingInternalId);
            var newRecordId = nlapiSubmitRecord(record, true, true);
            if (newRecordId) {
                messageLog = 'NS Record successfully auto-linked back to CW Staging Record Internal ID: ' + cwStagingInternalId;
            }
        }
    } catch (err) {
        messageLog = 'Could not find NS record to update its CW staging record link, NS ID: ' + nsInternalId + ' ERROR: ' + err;
        nlapiLogExecution('ERROR', 'Could not find NS record to update its CW staging record link, NS ID: ' + nsInternalId, err);
    }

    return messageLog;
}

function formatDateStringMMDDYYYYToYYYYMMDD(dateString) {
    //assume that date passed is on MM/DD/YYYY format, we need to convert it to YYYY/MM/DD format
    var returnDateString;

    try {
        if (dateString) {
            var dateStringArr = dateString.split("/");
            if (dateStringArr) {
                returnDateString = dateStringArr[2] + "/" + dateStringArr[0] + "/" + dateStringArr[1];

            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not convert MMDDYYYY date to YYYMMDD format: ' + dateString, err);
    }
    return returnDateString;
}

function applyMatrixMappings(record, mappingRecord, mappingType, stagingRecordId, stagingRecordType, isLine, sublistGroup, cwAccountId, customId) {
    //this function will attempt to apply the built-in matrix mapping function of CWMI
    var returnMessage = '';
    var matrixMappingObjectArray = [];

    try {
        var colArr = new Array();
        var filterArr = new Array();

        colArr.push(new nlobjSearchColumn('internalid').setSort(false)); //ascending order
        colArr.push(new nlobjSearchColumn('isinactive'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_recordtorun'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_cwfieldname'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_setastext'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_nsfieldname'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_cwvalue'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_nsvalue'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_comparisonop'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_mappingtype'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_cw_map_cwaccount'));

        filterArr.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_map_cwaccount', null, 'anyof', cwAccountId));
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_map_recordtorun', null, 'anyof', mappingRecord));
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_map_mappingtype', null, 'anyof', mappingType));

        if(customId && customId != '') {
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_cw_map_customid', null, 'is', customId));
        }

        var searchResults = nlapiSearchRecord('customrecord_ctc_cw_matrixmappingentry', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                var lookupastext = false;
                var msgMappingSubType = 'Header';
                var msgMappingType = 'Conversion';
                var stagingRecordFieldValue = '';

                if (mappingType == RUNLOG_TYPE_CONVERT)
                    msgMappingType = 'Conversion';

                if (mappingType == RUNLOG_TYPE_IMPORT)
                    msgMappingType = 'Import';

                if (mappingType == RUNLOG_TYPE_CREATE_ON_CW)
                    msgMappingType = 'Create on CW';

                if (isLine == true)
                    msgMappingSubType = 'Line';

                var msgMappingString = msgMappingType + ' ' + msgMappingSubType;

                var cwfieldid = searchResultRow.getValue('custrecord_ctc_cw_map_cwfieldname');
                var nsfieldid = searchResultRow.getValue('custrecord_ctc_cw_map_nsfieldname');
                var cwvalue = searchResultRow.getValue('custrecord_ctc_cw_map_cwvalue');
                var nsvalue = searchResultRow.getValue('custrecord_ctc_cw_map_nsvalue');
                var setastext = searchResultRow.getValue('custrecord_ctc_cw_map_setastext');
                var comparisonop = searchResultRow.getValue('custrecord_ctc_cw_map_comparisonop');

                if (mappingType == RUNLOG_TYPE_IMPORT) {
                    stagingRecordFieldValue = record.getFieldValue(cwfieldid);
                } else {
                    stagingRecordFieldValue = nlapiLookupField(stagingRecordType, stagingRecordId, cwfieldid);
                }


                if (comparisonop == 'equalto') {
                    if (stagingRecordFieldValue == cwvalue) {
                        if (setastext == 'F') {
                            if (isLine == false) {
                                record.setFieldValue(nsfieldid, nsvalue);
                            } else {
                                record.setCurrentLineItemValue(sublistGroup, nsfieldid, nsvalue);
                            }
                        } else {
                            if (isLine == false) {
                                record.setFieldText(nsfieldid, nsvalue);
                            } else {
                                record.setCurrentLineItemValue(sublistGroup, nsfieldid, nsvalue);
                            }
                        }
                        returnMessage = returnMessage + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: ' + msgMappingString + ' Matrix mapping applied to this record. CW Field ID: ' + cwfieldid + ' is EQUAL with CW Field Value: ' + cwvalue + ' Overriding value to ' + nsvalue + ' for NS Field ID: ' + nsfieldid;
                    }
                }

                if (comparisonop == 'contains') {
                    if (stagingRecordFieldValue.indexOf(cwvalue) != -1) {
                        if (setastext == 'F') {
                            if (isLine == false) {
                                record.setFieldValue(nsfieldid, nsvalue);
                            } else {
                                record.setCurrentLineItemValue(sublistGroup, nsfieldid, nsvalue);
                            }
                        } else {
                            if (isLine == false) {
                                record.setFieldText(nsfieldid, nsvalue);
                            } else {
                                record.setCurrentLineItemValue(sublistGroup, nsfieldid, nsvalue);
                            }
                        }
                        returnMessage = returnMessage + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: ' + msgMappingString + ' Matrix mapping applied to this record. CW Field ID: ' + cwfieldid + ' CONTAINS a character match with CW Field Value: ' + cwvalue + ' Overriding value to ' + nsvalue + ' for NS Field ID: ' + nsfieldid;
                    }
                }
                checkusageRemaining();
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not apply ' + msgMappingString + ' matrix mappings for record: ' + mappingRecord, err);
        returnMessage = returnMessage + ' Could not apply ' + msgMappingString + ' matrix mappings for record: ' + mappingRecord + ' ERROR: ' + err;
    }

    return returnMessage;
}

function replaceLast(find, replace, string) {
    var lastIndex = string.lastIndexOf(find);

    if (lastIndex === -1) {
        return string;
    }

    var beginString = string.substring(0, lastIndex);
    var endString = string.substring(lastIndex + find.length);

    return beginString + replace + endString;
}

function getCustomRecordTypeId(scriptId) {
    try {
        var filters = new Array();
        filters.push(new nlobjSearchFilter("scriptid", null, "is", scriptId));

        var columns = new Array();
        columns.push(new nlobjSearchColumn("internalid"));
        columns.push(new nlobjSearchColumn("scriptid"));

        var results = nlapiSearchRecord("customrecordtype", null, filters, columns);

        if (results && results.length > 0) {
            return results[0].getValue("internalid");
        } else {
            return null;
        }
        ;

    } catch (e) {
        nlapiLogExecution("ERROR", "getCustomRecordType", e.message);
    }
    ;
}

function digitCount(number) {
    return number.toString().length;
}

function getPaginationId(url) {
    var returnId = '';

    if (url && url != '') {
        var urlArr = url.split('&');
        if (urlArr) {
            if (urlArr.length > 0) {
                for (var i = 0; i < urlArr.length; i++) {
                    if (urlArr[i].indexOf('pageId=') != -1) {
                        returnId = urlArr[i].replace('pageId=', '').replace(/\D/g, '');
                    }
                }
            }
        }
    }

    return returnId;
}