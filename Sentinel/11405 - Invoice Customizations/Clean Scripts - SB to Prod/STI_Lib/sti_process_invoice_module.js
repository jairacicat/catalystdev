/**
 *
 * @NApiVersion 2.1
 * @description Perform Invoice Functions i.e. Taxes, Approvals, Email, Print
 *
 * Script Name: sti_process_invoice_module.js
 *
 */
define([
    'N/redirect',
    'N/task',
    'N/log',
    'N/record',
    'N/email',
    'N/render',
    'N/runtime',
    'N/search',
    'N/file',
    'N/format',
    'N/url',
    'N/https',
    'N/ui/message',
    './sti_integration_lib',
    './sti_integration_module',
    './sti_utility_module'
],
    /**
     * @param{redirect} REDIRECT
     * @param{task} TASK
     * @param{log} LOG
     * @param{record} RECORD
     * @param{email} EMAIL
     * @param{render} RENDER
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param{file} FILE
     * @param{format} FORMAT
     * @param{url} URL
     * @param {https} HTTPS
     * @param {Message} MESSAGE
     * @param SNOW
     * @param SNIN
     * @param STIUTIL
     */
    function (REDIRECT, TASK, LOG, RECORD, EMAIL, RENDER, RUNTIME, SEARCH, FILE, FORMAT, URL, HTTPS, MESSAGE, SNOW, STIN, STIUTIL) {
        var rtnObj = {};
        rtnObj.invcAddRemoveTBB = function (searchJsonObj) {
            var fromTime = new Date();
            try {
                var selectedOutputType = searchJsonObj.custrecord_sti_batch_output_type;
                var listOfInvoices = searchForInvoices(searchJsonObj);
                if (SNOW.isEmpty(listOfInvoices)) {
                    listOfInvoices = {};
                }
                var numberOfInvoices = listOfInvoices.length
                var batchInternalId = searchJsonObj.batch_internal_id;
                var batchNumber = searchJsonObj.custrecord_sti_batch_number;

                RECORD.submitFields({
                    type: 'customrecord_sti_invoice_batch',
                    id: batchInternalId,
                    values: {
                        custrecord_sti_invoice_batch_selected: numberOfInvoices,
                    }
                });

                switch (true) {
                    case (selectedOutputType == 101): //To Be Invoiced - Add
                        var oldValTbbChecked = false;
                        var newValInvoiceStatus = 2; //To Be Invoiced
                        break;
                    case (selectedOutputType == 102): //To Be Invoiced - Remove 
                        var oldValTbbChecked = true;
                        var newValInvoiceStatus = 1; //Preview
                        break;
                    default:
                        return;
                }
                var newValTbbChecked = Boolean(!oldValTbbChecked);

                for (invoiceLoop = 0; invoiceLoop < numberOfInvoices; invoiceLoop++) {
                    var invoiceId = listOfInvoices[invoiceLoop].id
                    var numberProcessedAlready = invoiceLoop + 1;
                    try {
                        var invoiceRecord = RECORD.load({
                            type: RECORD.Type.INVOICE,
                            id: invoiceId,
                            isDynamic: false
                        });
                        var approvalStatus = invoiceRecord.getValue({ fieldId: 'approvalstatus' });
                        if (SNOW.isEmpty(approvalStatus)) {
                            approvalStatus = '';
                        }
                        approvalStatus = approvalStatus.toString();

                        if (approvalStatus == '1') {
                            RECORD.submitFields({
                                type: RECORD.Type.INVOICE,
                                id: invoiceId,
                                values: {
                                    custbody_sti_tbb_box: newValTbbChecked,
                                    custbody_sti_invoice_status: newValInvoiceStatus,
                                    custbody_sti_inv_batch_num: batchNumber
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        }
                        RECORD.submitFields({
                            type: 'customrecord_sti_invoice_batch',
                            id: batchInternalId,
                            values: {
                                custrecord_sti_invoice_batch_completed: numberProcessedAlready,
                            }
                        });
                    } catch (err) {
                        LOG.error('Error sti_process_invoice_module on invcAddRemoveTBB', err.toString());
                    }
                }
            } catch (err) {
                LOG.error('Error sti_process_invoice_module on invcAddRemoveTBB', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "invcAddRemoveTBB");
            return numberOfInvoices;
        }
        rtnObj.singlePreviewInvoice = function (searchJsonObj) {
            var fromTime = new Date();
            var listOfInvoices = [{
                "recordType": "invoice",
                "id": searchJsonObj.transaction_internal_id,
                "values": {}
            }];

            var invoicePrintArray = doPrintInvoices(listOfInvoices, searchJsonObj);
            var theNewlyCreatedFileId = postProcessInvoices(invoicePrintArray, searchJsonObj);
            var jsonAttachmentObj = {
                fileid: theNewlyCreatedFileId,
                recid: searchJsonObj.transaction_internal_id,
                rectype: RECORD.Type.INVOICE
            };
            var attachResult = attachPDF(jsonAttachmentObj);
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "singlePreviewInvoice");
            return;
        }
        rtnObj.singleReprintInvoice = function (searchJsonObj) {
            var fromTime = new Date();
            var listOfInvoices = [{
                "recordType": "invoice",
                "id": searchJsonObj.transaction_internal_id,
                "values": {}
            }];
            var invoicePrintArray = doPrintInvoices(listOfInvoices, searchJsonObj);
            var theNewlyCreatedFileId = postProcessingResults = postProcessInvoices(invoicePrintArray, searchJsonObj);
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "singleReprintInvoice");
            return;
        }
        rtnObj.singleEmailInvoice = function (searchJsonObj) {
            var fromTime = new Date();
            var listOfInvoices = [{
                "recordType": "invoice",
                "id": searchJsonObj.transaction_internal_id,
                "values": {}
            }];
            var enumRecordType = RECORD.Type.INVOICE;
            var itemInternalId = searchJsonObj.transaction_internal_id;
            var transactionTranId = searchJsonObj.transaction_tran_id;
            var itemFileName = 'Invoice_' + transactionTranId;

            //Find the Existing Attached Invoice Pdf
            var scriptObj = RUNTIME.getCurrentScript();
            var folderInvoicePDF = scriptObj.getParameter({ name: 'custscript_sti_invoice_pdf_folder' });
            var destinationFolderId = STIN.doGetTransactionFolderId(folderInvoicePDF, itemInternalId, enumRecordType);
            var theExistingAttachmentFileId = STIN.doSearchFolderForFile(destinationFolderId, itemFileName);

            //Email Invoice to Customer
            if (!SNOW.isEmpty(theExistingAttachmentFileId)) {
                theExistingAttachmentFileId = 'FILE_' + theExistingAttachmentFileId;
                var rtnValEmail = doEmailTransaction(itemInternalId, enumRecordType, itemFileName, theExistingAttachmentFileId, destinationFolderId)
            } else {
                var rtnValEmail = {
                    success: false,
                    message: 'Invoice Pdf not Found'
                };
            }
            log.audit('rtnValEmail', JSON.stringify(rtnValEmail));
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "singleEmailInvoice");
            return rtnValEmail;
        }
        rtnObj.nightlyInvoiceProcessing = function (searchJsonObj, selectedInvoiceObj) {
            var fromTime = new Date();
            var scriptObj = RUNTIME.getCurrentScript();
            var listOfInvoices = [];
            listOfInvoices.push(selectedInvoiceObj);
            var batchInternalId = searchJsonObj.batch_internal_id;
            searchJsonObj.batchReprintOnly = 'false';
            searchJsonObj.batchPrintEmailOnly = 'true';
            for (var invoiceLoop = 0; invoiceLoop < listOfInvoices.length; invoiceLoop++) {              //Loop through items in arrayOfInvoices
                var invoicePrintArray = doPrintInvoices(listOfInvoices, searchJsonObj);
                var postProcessingResults = postProcessInvoices(invoicePrintArray, searchJsonObj);                //Attach Record(s) and Send Email(s) if Selected
                try {
                    var batchRecord = RECORD.load({
                        type: 'customrecord_sti_invoice_batch',
                        id: batchInternalId,
                        isDynamic: false
                    });
                    var processedAlready = batchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_completed' });
                    if (SNOW.isEmpty(processedAlready)) {
                        processedAlready = 0;
                    }
                    processedAlready = parseInt(processedAlready) + 1;
                    batchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_completed',
                        value: processedAlready
                    });
                    batchRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });
                } catch (err) {
                    LOG.error({ title: 'Error sti_process_invoice_module on Invoice Batch Update - custrecord_sti_invoice_batch_selected', details: err.toString() });
                }
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "nightlyInvoiceProcessing");
            return;
        }
        rtnObj.nightlyCompleteBatch = function (searchJsonObj, listOfInvoices) {
            var fromTime = new Date();
            searchJsonObj.custrecord_sti_batch_output_type = "5";  //Reprint
            searchJsonObj.batchReprintOnly = 'true';
            searchJsonObj.batchPrintEmailOnly = 'false';
            var invoicePrintArray = doPrintInvoices(listOfInvoices, searchJsonObj);
            var postProcessingResults = postProcessInvoices(invoicePrintArray, searchJsonObj);

            //Update the Batch with Stop Flag
            var batchInternalId = searchJsonObj.batch_internal_id;
            var batchRecord = RECORD.load({
                type: 'customrecord_sti_invoice_batch',
                id: batchInternalId,
                isDynamic: false
            });//
            batchRecord.setValue({
                fieldId: 'custrecord_sti_invoice_batch_completed',
                value: batchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_selected' })
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_invoice_batch_stop',
                value: new Date()
            });
            batchRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "nightlyCompleteBatch");
            return;
        }
        rtnObj.invcAttachAndPrintAndEmail = function (searchJsonObj) {
            var fromTime = new Date();
            var scriptObj = RUNTIME.getCurrentScript();
            var numberOfInvoices = 0;
            var enumRecordType;
            const selectedRecordType = searchJsonObj.custrecord_sti_batch_record_type;
            const singlePrintFlag = Boolean(searchJsonObj.single_print_flag == 'true');
            searchJsonObj.batchReprintOnly = 'false';

            try {
                switch (true) {
                    case (selectedRecordType == '1'):  //Invoices
                        enumRecordType = RECORD.Type.INVOICE
                        var listOfInvoices = searchForInvoices(searchJsonObj);
                        break;
                    case (selectedRecordType == '2'):  //Credit Memos
                        enumRecordType = RECORD.Type.CREDIT_MEMO;
                        var listOfInvoices = searchForCreditMemos(searchJsonObj);
                        break;
                    case (selectedRecordType == '103'):  //Pro Formas
                        searchJsonObj.selectedOutputType = '5';  //Only Allow Pro Forma (Reprint) for Sales Order
                        enumRecordType = RECORD.Type.SALES_ORDER;
                        var listOfInvoices = searchForSalesOrders(searchJsonObj);
                        break;
                    default:
                        enumRecordType = RECORD.Type.INVOICE
                        var listOfInvoices = searchForInvoices(searchJsonObj);
                }

                numberOfInvoices = listOfInvoices.length;
                var batchInternalId = searchJsonObj.batch_internal_id;

                try {
                    RECORD.submitFields({
                        type: 'customrecord_sti_invoice_batch',
                        id: batchInternalId,
                        values: {
                            custrecord_sti_invoice_batch_selected: numberOfInvoices,
                        }
                    });
                } catch (err) {
                    LOG.error({ title: 'Error sti_process_invoice_module - custrecord_sti_invoice_batch_selected', details: err.toString() });
                }


                if (numberOfInvoices > 0) {
                    var invoicePrintArray = doPrintInvoices(listOfInvoices, searchJsonObj);

                    //Attach Record(s) and Send Email(s) if Selected
                    var postProcessingResults = postProcessInvoices(invoicePrintArray, searchJsonObj);

                    //Run Invoice Batch Report and Attach To Batch Record
                    if (!singlePrintFlag) {
                        runInvoiceBatchReport(searchJsonObj);
                    }
                }
                log.audit('all done');
            } catch (err) {
                log.error('Error sti_process_invoice_module on Invoice Batch Processing', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "invcAttachAndPrintAndEmail");
            return numberOfInvoices;
        }
        function searchForInvoices(searchJsonObj) {
            var fromTime = new Date();
            var selectedBatchNumber = searchJsonObj.custrecord_sti_batch_number;
            var selectedOutputType = searchJsonObj.custrecord_sti_batch_output_type;
            var selectedInvoiceDate = searchJsonObj.custrecord_sti_batch_invoice_date;
            var selectedInvoiceNumber = searchJsonObj.custrecord_sti_batch_invoice_number;
            var selectedInvoiceType = searchJsonObj.custrecord_sti_batch_invoice_type;
            var selectedCustomerNumber = searchJsonObj.custrecord_sti_batch_customer_number;
            var selectedInvoiceStatus;
            var arrayInvoiceRange;
            var fromInvoiceRange;
            var thruInvoiceRange;
            var anotherFilter = {};
            var tbbRequired = false;

            //Check if Entered an Invoice Range
            if (!SNOW.isEmpty(selectedInvoiceNumber)) {
                arrayInvoiceRange = selectedInvoiceNumber.split('-');
                if (arrayInvoiceRange.length >= 2) {
                    fromInvoiceRange = arrayInvoiceRange[0];
                    if (!SNOW.isEmpty(fromInvoiceRange)) {
                        fromInvoiceRange = fromInvoiceRange.replace(/\D/g, "");
                    }

                    thruInvoiceRange = arrayInvoiceRange[1];
                    if (!SNOW.isEmpty(thruInvoiceRange)) {
                        thruInvoiceRange = thruInvoiceRange.replace(/\D/g, "");
                    }
                }
            }

            switch (true) {
                case (selectedOutputType == 1): //Preview
                    tbbRequired = true;
                    selectedInvoiceStatus = 1; // Pending Approval
                    break;
                case (selectedOutputType == 2 || selectedOutputType == 4): //Post, Post and Email
                    tbbRequired = true;
                    selectedInvoiceStatus = 1; // Pending Approval
                    break;
                case (selectedOutputType == 3): //Email Only
                    tbbRequired = false;
                    selectedInvoiceStatus = 2; // Approved
                    break;
                case (selectedOutputType == 5): //Reprint
                    tbbRequired = false;
                    selectedInvoiceStatus = 2; // Approved
                    break;
                case (selectedOutputType == 101): //Flag as TBB
                    tbbRequired = false;
                    selectedInvoiceStatus = 1; // Pending Approval
                    break;
                case (selectedOutputType == 102): //To Be Invoiced - Remove
                    tbbRequired = true;
                    selectedInvoiceStatus = 1; // Pending Approval
                    break;
                default:
                    tbbRequired = false;
                    return;
            }

            if (tbbRequired) {
                var tbbValue = 'T'
            } else {
                var tbbValue = 'F'
            }

            var invoiceBatchSearch = {};
            switch (true) {
                case (!SNOW.isEmpty(fromInvoiceRange) && !SNOW.isEmpty(thruInvoiceRange)):
                    log.audit('in condition 1', '!SNOW.isEmpty(fromInvoiceRange) && !SNOW.isEmpty(thruInvoiceRange)');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                "name": "number",
                                "operator": "between",
                                "values": [fromInvoiceRange, thruInvoiceRange],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedInvoiceNumber)):
                    log.audit('in condition 2', '!SNOW.isEmpty(selectedInvoiceNumber)');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                name: 'tranid',
                                operator: 'is',
                                values: [selectedInvoiceNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedCustomerNumber) && !SNOW.isEmpty(selectedInvoiceType)):
                    log.audit('in condition 3', '!SNOW.isEmpty(selectedCustomerNumber) && !SNOW.isEmpty(selectedInvoiceType)');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                name: 'custbody_sti_invoice_type',
                                operator: 'is',
                                values: [selectedInvoiceType]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                name: 'entity',
                                operator: 'is',
                                values: [selectedCustomerNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedCustomerNumber) && SNOW.isEmpty(selectedInvoiceType)):
                    log.audit('in condition 4', '!SNOW.isEmpty(selectedCustomerNumber) && SNOW.isEmpty(selectedInvoiceType)');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                name: 'entity',
                                operator: 'is',
                                values: [selectedCustomerNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedInvoiceType)):
                    log.audit('in condition 5', '!SNOW.isEmpty(selectedInvoiceType)');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                name: 'custbody_sti_invoice_type',
                                operator: 'is',
                                values: [selectedInvoiceType]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                default:
                    log.audit('in condition 6', 'default');
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.INVOICE,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            {
                                name: 'approvalstatus',
                                operator: 'is',
                                values: [selectedInvoiceStatus]
                            },
                            {
                                "name": "custbody_sti_tbb_box",
                                "operator": "is",
                                "values": [tbbValue],
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
            }
            log.audit('invoiceBatchSearch', JSON.stringify(invoiceBatchSearch));
            var invoiceBatchSearchResults = invoiceBatchSearch.run().getRange({
                start: 0,
                end: 1000
            });
            log.audit('batch search results', JSON.stringify(invoiceBatchSearchResults));
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "searchForInvoices");
            return invoiceBatchSearchResults;
        }
        function searchForCreditMemos(searchJsonObj) {
            var fromTime = new Date();
            var selectedBatchNumber = searchJsonObj.custrecord_sti_batch_number;
            var selectedOutputType = searchJsonObj.custrecord_sti_batch_output_type;
            var selectedInvoiceDate = searchJsonObj.custrecord_sti_batch_invoice_date;
            var selectedInvoiceNumber = searchJsonObj.custrecord_sti_batch_invoice_number;
            var selectedInvoiceType = searchJsonObj.custrecord_sti_batch_invoice_type;
            var selectedCustomerNumber = searchJsonObj.custrecord_sti_batch_customer_number;
            var selectedInvoiceStatus;
            var arrayInvoiceRange;
            var fromInvoiceRange;
            var thruInvoiceRange;
            var anotherFilter = {};

            //Check if Entered an Invoice Range
            if (!SNOW.isEmpty(selectedInvoiceNumber)) {
                arrayInvoiceRange = selectedInvoiceNumber.split('-');
                if (arrayInvoiceRange.length >= 2) {
                    fromInvoiceRange = arrayInvoiceRange[0];
                    if (!SNOW.isEmpty(fromInvoiceRange)) {
                        fromInvoiceRange = fromInvoiceRange.replace(/\D/g, "");
                    }

                    thruInvoiceRange = arrayInvoiceRange[1];
                    if (!SNOW.isEmpty(thruInvoiceRange)) {
                        thruInvoiceRange = thruInvoiceRange.replace(/\D/g, "");
                    }
                }
            }

            var invoiceBatchSearch;
            switch (true) {
                case (!SNOW.isEmpty(fromInvoiceRange) && !SNOW.isEmpty(thruInvoiceRange)):
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.CREDIT_MEMO,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                "name": "number",
                                "operator": "between",
                                "values": [fromInvoiceRange, thruInvoiceRange],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedInvoiceNumber)):
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.CREDIT_MEMO,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'tranid',
                                operator: 'is',
                                values: [selectedInvoiceNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedCustomerNumber)):
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.CREDIT_MEMO,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'entity',
                                operator: 'is',
                                values: [selectedCustomerNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                default:
                    invoiceBatchSearch = SEARCH.create({
                        type: SEARCH.Type.CREDIT_MEMO,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
            }

            var invoiceBatchSearchResults = invoiceBatchSearch.run().getRange({
                start: 0,
                end: 1000
            });
            log.audit('batch search results', JSON.stringify(invoiceBatchSearchResults));
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "searchForCreditMemos");
            return invoiceBatchSearchResults;
        }
        function searchForSalesOrders(searchJsonObj) {
            var fromTime = new Date();
            var selectedSalesOrderNumber = searchJsonObj.custrecord_sti_batch_invoice_number;
            var selectedCustomerNumber = searchJsonObj.custrecord_sti_batch_customer_number;
            var arraySalesOrderRange;
            var fromSalesOrderRange;
            var thruSalesOrderRange;

            //Check if Entered a Sales Order Range
            if (!SNOW.isEmpty(selectedSalesOrderNumber)) {
                arraySalesOrderRange = selectedSalesOrderNumber.split('-');
                if (arraySalesOrderRange.length >= 2) {
                    fromSalesOrderRange = arraySalesOrderRange[0];
                    if (!SNOW.isEmpty(fromSalesOrderRange)) {
                        fromSalesOrderRange = fromSalesOrderRange.replace(/\D/g, "");
                    }

                    thruSalesOrderRange = arraySalesOrderRange[1];
                    if (!SNOW.isEmpty(thruSalesOrderRange)) {
                        thruSalesOrderRange = thruSalesOrderRange.replace(/\D/g, "");
                    }
                }
            }

            var SalesOrderBatchSearch;
            switch (true) {
                case (!SNOW.isEmpty(fromSalesOrderRange) && !SNOW.isEmpty(thruSalesOrderRange)):
                    SalesOrderBatchSearch = SEARCH.create({
                        type: SEARCH.Type.SALES_ORDER,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                "name": "number",
                                "operator": "between",
                                "values": [fromSalesOrderRange, thruSalesOrderRange],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedSalesOrderNumber)):
                    SalesOrderBatchSearch = SEARCH.create({
                        type: SEARCH.Type.SALES_ORDER,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'tranid',
                                operator: 'is',
                                values: [selectedSalesOrderNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                case (!SNOW.isEmpty(selectedCustomerNumber)):
                    SalesOrderBatchSearch = SEARCH.create({
                        type: SEARCH.Type.SALES_ORDER,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'entity',
                                operator: 'is',
                                values: [selectedCustomerNumber]
                            },
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
                default:
                    SalesOrderBatchSearch = SEARCH.create({
                        type: SEARCH.Type.SALES_ORDER,
                        id: 'customsearch_temporary_invoice_search',
                        columns: [],
                        filters: [
                            {
                                "name": "custbody_sti_from_epicor",
                                "operator": "is",
                                "values": ["F"],
                                "isor": false,
                                "isnot": false,
                                "leftparens": 0,
                                "rightparens": 0
                            },
                            {
                                name: 'billaddress',
                                operator: 'isnotempty',
                                values: []
                            },
                            //{
                            //    name: 'shipaddress',
                            //    operator: 'isnotempty',
                            //    values: []
                            //},
                            {
                                name: 'mainline',
                                operator: 'is',
                                values: [true]
                            }
                        ],
                        settings: []
                    });
                    break;
            }

            var SalesOrderBatchSearchResults = SalesOrderBatchSearch.run().getRange({
                start: 0,
                end: 1000
            });
            log.audit('batch search results', JSON.stringify(SalesOrderBatchSearchResults));
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "searchForSalesOrders");
            return SalesOrderBatchSearchResults;
        }
        function buildInvoiceDataArray(listOfInvoices, searchJsonObj) {
            var fromTime = new Date();
            var invoiceDataArray = [];
            try {
                var jsonInvoiceObj;
                var theInvoicePaymentLink;
                var rowDelimiter = String.fromCharCode(254);
                var colDelimiter = String.fromCharCode(253);
                var selectedRecordType = searchJsonObj.custrecord_sti_batch_record_type;
                var enumRecordType;
                var sendRecordType;
                var totalLineDescription;
                switch (true) {
                    case (selectedRecordType == '1'):  //Invoice
                        sendRecordType = 'INVOICE';
                        enumRecordType = RECORD.Type.INVOICE;
                        totalLineDescription = "Total Payable in USD";
                        break;
                    case (selectedRecordType == '2'):  //Credit Memo
                        sendRecordType = 'CREDITMEMO';
                        enumRecordType = RECORD.Type.CREDIT_MEMO;
                        totalLineDescription = "Total USD Issued";
                        break;
                    case (selectedRecordType == '103'):  //Pro Forma
                        sendRecordType = 'PROFORMA';
                        enumRecordType = RECORD.Type.SALES_ORDER;
                        totalLineDescription = "Total Payable in USD";
                        break;
                    default:
                        sendRecordType = 'INVOICE'
                        enumRecordType = RECORD.Type.INVOICE;
                        totalLineDescription = "Total Payable in USD";
                }
                var invoiceId;
                var invoiceLoop;
                var invoiceBodyAttachment;
                var batchNumber = searchJsonObj.custrecord_sti_batch_number.toString();
                var invoiceDataArray = [];
                var invoiceCnt = listOfInvoices.length;

                for (invoiceLoop = 0; invoiceLoop < invoiceCnt; invoiceLoop++) {
                    jsonInvoiceObj = {};
                    invoiceId = listOfInvoices[invoiceLoop].id;

                    var emailOnly = Boolean(selectedOutputType == 3);
                    if (!emailOnly) {
                        try {
                            RECORD.submitFields({
                                type: enumRecordType,
                                id: invoiceId,
                                values: {
                                    custbody_sti_inv_batch_num: batchNumber,
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        } catch (err) {
                            log.error('buildInvoiceDataArray - Unable to Update Batch #', err.toString());
                        }
                    }

                    var invoiceRecord = RECORD.load({
                        type: enumRecordType,
                        id: invoiceId,
                        isDynamic: false
                    });
                    var fromEpicor = STIUTIL.getBoolean(invoiceRecord.getValue({ fieldId: 'custbody_sti_from_epicor' }));
                    if (fromEpicor) throw invoiceRecord.getValue({ fieldId: 'tranid' }) + " From Epicor - Skipped";

                    var itemInternalId = invoiceId;
                    var selectedBatchNumber = searchJsonObj.custrecord_sti_batch_number;
                    var selectedOutputType = searchJsonObj.custrecord_sti_batch_output_type;
                    var selectedRecordType = searchJsonObj.custrecord_sti_batch_record_type;
                    currentApprovalStatus = invoiceRecord.getValue({ fieldId: 'approvalstatus' });

                    if (SNOW.isEmpty(currentApprovalStatus)) {
                        currentApprovalStatus = "";
                    }
                    currentApprovalStatus = currentApprovalStatus.toString();

                    if (selectedOutputType == 2 || selectedOutputType == 4) {   //Approve or Approve and Email
                        switch (true) {
                            case (selectedRecordType == '1'):  //Invoice
                                var rtnValApproved = doApproveTransaction(itemInternalId, enumRecordType, selectedBatchNumber); //Mark Approved, Update Customer PO, Commit Taxes
                                var invoiceRecord = RECORD.load({
                                    type: enumRecordType,
                                    id: itemInternalId,
                                    isDynamic: false
                                });
                                break;
                            case (selectedRecordType == '2'):  //Credit 
                                var rtnValApproved = {
                                    success: true
                                };
                                break;
                            default:
                                var rtnValApproved = {
                                    success: false
                                };
                        }
                        if (!rtnValApproved.success) {
                            if (!SNOW.isEmpty(rtnValApproved.message)) {
                                doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValApproved.message);
                            }
                        }
                    }

                    invoiceBodyAttachment = invoiceRecord.getValue({ fieldId: 'custbody_so_invoice_body_attachment' });
                    invoiceBodyAttachment = formatFilePath(invoiceBodyAttachment);
                    var itemCount = invoiceRecord.getLineCount({ sublistId: 'item' });

                    var existingBatchNumber = invoiceRecord.getValue({ fieldId: 'custbody_sti_inv_batch_num' });
                    if (SNOW.isEmpty(existingBatchNumber)) {
                        existingBatchNumber = '';
                    }

                    //Customer Data
                    var customerRecord = RECORD.load({
                        type: 'CUSTOMER',
                        id: invoiceRecord.getValue({ fieldId: "entity" }),
                        isDynamic: false
                    });

                    var defaultBillId;
                    var lineNumber = customerRecord.findSublistLineWithValue({
                        sublistId: 'addressbook',
                        fieldId: 'defaultbilling',
                        value: true
                    });
                    if (lineNumber >= 0) {
                        defaultBillId = customerRecord.getSublistValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            line: lineNumber
                        });
                    }

                    var defaultShipId;
                    var lineNumber = customerRecord.findSublistLineWithValue({
                        sublistId: 'addressbook',
                        fieldId: 'defaultshipping',
                        value: true
                    });
                    if (lineNumber >= 0) {
                        defaultShipId = customerRecord.getSublistValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            line: lineNumber
                        });
                    }
                    if (SNOW.isEmpty(defaultShipId)) {
                        defaultShipId = defaultBillId;
                    }

                    var jsonBillAddressRecord = {};
                    var jsonShipAddressRecord = {};
                    var suppressQty;
                    var suppressPart;

                    jsonInvoiceObj.recordtype = "invoice_pdf";
                    jsonInvoiceObj.customer_number = getCustomerNumber(customerRecord);
                    jsonInvoiceObj.invoice_number = invoiceRecord.getValue({ fieldId: "tranid" }).toString();

                    //Get Billing Address
                    var billAddressId = invoiceRecord.getValue({ fieldId: "billingaddress" });
                    if (SNOW.isEmpty(billAddressId)) {
                        billAddressId = defaultBillId;
                    }

                    var addressRecord = RECORD.load({ type: "ADDRESS", id: billAddressId });
                    var jsonAddressRecord = {};
                    jsonAddressRecord = JSON.parse(JSON.stringify(addressRecord));
                    jsonBillAddressRecord = jsonAddressRecord;

                    jsonInvoiceObj.bill_addressee = jsonAddressRecord.fields.addressee;
                    jsonInvoiceObj.bill_attention = jsonAddressRecord.fields.attention;
                    if (SNOW.isEmpty(jsonInvoiceObj.bill_attention)) {
                        jsonInvoiceObj.bill_attention = "Accounts Payable";
                    }
                    if (SNOW.isEmpty(jsonInvoiceObj.bill_addressee)) {
                        jsonInvoiceObj.bill_addressee = "Accounts Payable";
                    }
                    if (SNOW.isEmpty(jsonAddressRecord)) {
                        jsonAddressRecord = {};
                    }
                    if (SNOW.isEmpty(jsonAddressRecord.fields)) {
                        jsonAddressRecord.fields = {};
                    }
                    jsonInvoiceObj.bill_attention = "Attention: " + jsonInvoiceObj.bill_attention;
                    jsonInvoiceObj.bill_addr = jsonAddressRecord.fields.addr1;
                    jsonInvoiceObj.bill_city = jsonAddressRecord.fields.city;
                    jsonInvoiceObj.bill_state = jsonAddressRecord.fields.state;
                    jsonInvoiceObj.bill_zip = jsonAddressRecord.fields.zip;
                    jsonInvoiceObj.bill_country = jsonAddressRecord.fields.country;

                    //Get Shiping Address
                    var jsonShipAddressRecord = {};
                    var shipAddressId = invoiceRecord.getValue({ fieldId: "shippingaddress" });
                    if (SNOW.isEmpty(shipAddressId)) {
                        shipAddressId = defaultShipId;
                    }

                    if (!SNOW.isEmpty(shipAddressId)) {
                        addressRecord = new RECORD.load({ type: "ADDRESS", id: shipAddressId });
                        jsonAddressRecord = JSON.parse(JSON.stringify(addressRecord));
                        jsonShipAddressRecord = jsonAddressRecord;
                        jsonInvoiceObj.ship_addressee = jsonAddressRecord.fields.addressee;
                        jsonInvoiceObj.ship_addr = jsonAddressRecord.fields.addr1;
                        jsonInvoiceObj.ship_city = jsonAddressRecord.fields.city;
                        jsonInvoiceObj.ship_state = jsonAddressRecord.fields.state;
                        jsonInvoiceObj.ship_zip = jsonAddressRecord.fields.zip;
                        jsonInvoiceObj.ship_country = jsonAddressRecord.fields.country;
                    }
                    if (SNOW.isEmpty(jsonShipAddressRecord.fields)) {
                        var jsonShipAddressRecord = {};
                        jsonShipAddressRecord.fields = jsonBillAddressRecord.fields;
                    }

                    try {
                        var referenceNumberOne;
                        var referenceNumberTwo;
                        var referenceNumberTre;//selectedRecordType == '103'):  //Pro Formas
                        if (selectedRecordType == '1' || selectedRecordType == '103') {
                            var invoiceType = invoiceRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
                            if (SNOW.isEmpty(invoiceType)) {
                                invoiceType = "";
                            }
                            invoiceType = invoiceType.toString();
                            switch (true) {
                                case (invoiceType == '2'):  //Project
                                    referenceNumberOne = invoiceRecord.getText({ fieldId: 'custbody_sti_sn_project_number' });
                                    referenceNumberTwo = '';
                                    referenceNumberTre = invoiceRecord.getValue({ fieldId: 'custbody_sti_project_name' });
                                    break;
                                case (invoiceType == '4'): //Sales Order
                                    referenceNumberOne = invoiceRecord.getText({ fieldId: ' custbody_sti_invoice_type' });
                                    referenceNumberTwo = '';
                                    referenceNumberTre = '';
                                    break;
                                case (invoiceType == '5'): //Service Ticket
                                    referenceNumberOne = invoiceRecord.getValue({ fieldId: 'custbody_sti_service_ticket' });
                                    referenceNumberTwo = '';
                                    referenceNumberTre = '';
                                    break;
                                case (invoiceType == '6'): //SuiteBilling
                                    referenceNumberOne = ''; //invoiceRecord.getText({ fieldId: 'billingaccount' });
                                    referenceNumberTwo = '';
                                    referenceNumberTre = invoiceRecord.getValue({ fieldId: 'custbody_ctc_u_short_description' });
                                    break;
                            }
                        } else {
                            referenceNumberOne = '';
                            referenceNumberTwo = '';
                            referenceNumberTre = '';
                        }
                    } catch (err) {
                        referenceNumberOne = '';
                        referenceNumberTwo = '';
                        referenceNumberTre = '';
                    }

                    if (SNOW.isEmpty(referenceNumberOne)) {
                        referenceNumberOne = '';
                    }
                    if (SNOW.isEmpty(referenceNumberTwo)) {
                        referenceNumberTwo = '';
                    }
                    if (SNOW.isEmpty(referenceNumberTre)) {
                        referenceNumberTre = invoiceRecord.getValue({ fieldId: 'custbody_ctc_u_short_description' });
                    }
                    if (referenceNumberOne.toString() == 'undefined') {
                        referenceNumberOne = '';
                    }
                    if (referenceNumberTwo.toString() == 'undefined') {
                        referenceNumberTwo = '';
                    }
                    if (referenceNumberTre.toString() == 'undefined') {
                        referenceNumberTre = '';
                    }
                    jsonInvoiceObj.project_number = invoiceRecord.getText({ fieldId: "custbody_project" });
                    jsonInvoiceObj.description = referenceNumberTre;

                    //Payment Terms
                    try {
                        var paymentTerms = invoiceRecord.getText({ fieldId: 'terms' });
                        if (SNOW.isEmpty(paymentTerms)) {
                            var paymentTerms = customerRecord.getText({ fieldId: 'terms' });
                            if (SNOW.isEmpty(paymentTerms)) {
                                var paymentTerms = 'Net 30';
                            }
                        }
                    } catch (err) {
                        log.error('Payment Terms', err.toString());
                        var paymentTerms = 'Net 30';
                    }

                    //Get Other Invoice Data
                    jsonInvoiceObj.po_number = invoiceRecord.getValue({ fieldId: "otherrefnum" });
                    jsonInvoiceObj.invoice_date = invoiceRecord.getText({ fieldId: "trandate" });
                    //jsonInvoiceObj.labor_terms = invoiceRecord.getText({ fieldId: "terms" });
                    //jsonInvoiceObj.nonlabor_terms = invoiceRecord.getText({ fieldId: "terms" });
                    jsonInvoiceObj.labor_terms = paymentTerms;
                    jsonInvoiceObj.nonlabor_terms = paymentTerms;
                    jsonInvoiceObj.sales_rep = invoiceRecord.getText({ fieldId: "salesrep" });
                    jsonInvoiceObj.email_address = invoiceRecord.getText({ fieldId: "email" });

                    jsonInvoiceObj.sub_total = invoiceRecord.getValue({ fieldId: "subtotal" });
                    jsonInvoiceObj.discount_total = invoiceRecord.getValue({ fieldId: "discounttotal" });
                    jsonInvoiceObj.tax_total = invoiceRecord.getValue({ fieldId: "taxtotal" });
                    jsonInvoiceObj.ship_total = invoiceRecord.getValue({ fieldId: "altshippingcost" });
                    jsonInvoiceObj.invoice_total = invoiceRecord.getValue({ fieldId: "total" });

                    var custbody_ng_pg_paynow_allowed_method = invoiceRecord.getValue({ fieldId: 'custbody_ng_pg_paynow_allowed_method' });
                    if (SNOW.isEmpty(custbody_ng_pg_paynow_allowed_method)) {
                        custbody_ng_pg_paynow_allowed_method = '';
                    }
                    var theInvoicePaymentLink = '';
                    var theInvoiceTotal = parseFloat(jsonInvoiceObj.invoice_total);
                    custbody_ng_pg_paynow_allowed_method = custbody_ng_pg_paynow_allowed_method.toString();
                    //log.audit('jsonInvoiceObj.invoice_total', jsonInvoiceObj.invoice_total);
                    //log.audit('custbody_ng_pg_paynow_allowed_method', custbody_ng_pg_paynow_allowed_method);
                    if (theInvoiceTotal <= 100000.00) {
                        if (custbody_ng_pg_paynow_allowed_method == '2' || custbody_ng_pg_paynow_allowed_method == '1') {
                            theInvoicePaymentLink = invoiceRecord.getValue({ fieldId: 'custbody_ng_paytrace_pay_link_url' });
                        }
                    }
                    //log.audit('first theInvoicePaymentLink', theInvoicePaymentLink);
                    var combineTaxes = invoiceRecord.getValue({ fieldId: 'custbody_sti_combine_taxes_on_invoice' });
                    if (SNOW.isEmpty(combineTaxes)) {
                        combineTaxes = false;
                    }

                    suppressQty = invoiceRecord.getValue({ fieldId: 'custbody_sti_suppress_qty_on_invoice' });
                    if (SNOW.isEmpty(suppressQty)) {
                        suppressQty = false;
                    }
                    suppressPart = invoiceRecord.getValue({ fieldId: 'custbody_sti_suppress_part_on_invoice' });
                    if (SNOW.isEmpty(suppressPart)) {
                        suppressPart = false;
                    }
                    suppressPrice = invoiceRecord.getValue({ fieldId: 'custbody_sti_suppress_price_on_invoice' });
                    if (SNOW.isEmpty(suppressPrice)) {
                        suppressPrice = false;
                    }
                    if (invoiceType == '6') {
                        suppressPart = true;
                    }

                    //Get Invoice Serial Numbers
                    var arrayLines = [];
                    var jsonObjSerialInfo = {};
                    var salesOrderRecord = '';
                    var salesOrderId = invoiceRecord.getValue({ fieldId: 'createdfrom' });
                    if (!SNOW.isEmpty(salesOrderId)) {
                        try {
                            var salesOrderRecord = RECORD.load({
                                type: RECORD.Type.SALES_ORDER,
                                id: salesOrderId,
                                isDynamic: false
                            });
                            var jsonObjSerialInfo = getInvoiceSerials(invoiceRecord);
                        } catch (err) {
                            salesOrderRecord = '';
                        }
                    }

                    var internalAddressId;
                    var jsonAddressRecord = {};
                    var jsonObjCurrentCharges = {};
                    var itemCount = invoiceRecord.getLineCount({ sublistId: 'item' });
                    var arrayGroupIds = [];
                    var arrayGroupAmounts = [];
                    for (itemLoop = 0; itemLoop < itemCount; itemLoop++) {
                        try {
                            var invoiceGroup = invoiceRecord.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_sti_line_trans_invoice_group',
                                line: itemLoop
                            });
                            var chkDoNotPrint = invoiceRecord.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_sti_do_not_print',
                                line: itemLoop
                            });
                            if (SNOW.isEmpty(chkDoNotPrint)) {
                                chkDoNotPrint = false;
                            }
                            chkDoNotPrint = chkDoNotPrint.toString().toUpperCase();

                            if (chkDoNotPrint == 'FALSE') {
                                if (SNOW.isEmpty(invoiceGroup)) {
                                    try {  //Get Street Address for this Item       
                                        var internalAddressId = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'shipaddress',
                                            line: itemLoop
                                        });
                                        var jsonAddressRecord = {};
                                        if (SNOW.isEmpty(internalAddressId)) {
                                            jsonAddressRecord = jsonShipAddressRecord;
                                        } else {
                                            var shipAddressId = STIN.getAddressBookFromAddressId(customerRecord, internalAddressId)
                                            var addressRecord = new RECORD.load({ type: "ADDRESS", id: shipAddressId });
                                            jsonAddressRecord = JSON.parse(JSON.stringify(addressRecord));
                                        }
                                    } catch (err) {
                                        jsonAddressRecord = {};
                                    }

                                    jsonObjCurrentCharges = {};
                                    jsonAddressRecord = JSON.parse(JSON.stringify(jsonAddressRecord));
                                    if (SNOW.isEmpty(jsonAddressRecord.fields)) {
                                        jsonAddressRecord = jsonShipAddressRecord;
                                    }
                                    jsonObjCurrentCharges.item_addr_street = jsonAddressRecord.fields.addr1;
                                    jsonObjCurrentCharges.item_addr_city = jsonAddressRecord.fields.city;
                                    jsonObjCurrentCharges.item_addr_state = jsonAddressRecord.fields.state;

                                    var itemInternalId;
                                    if (suppressPart == true) {
                                        itemInternalId = '';
                                        jsonObjCurrentCharges.item_name = '';
                                    } else {
                                        jsonObjCurrentCharges.item_name = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'item_display',
                                            line: itemLoop
                                        });
                                        if (jsonObjCurrentCharges.item_name.length > 20) {
                                            var oldPartNumber = jsonObjCurrentCharges.item_name;
                                            var newPartNumber = oldPartNumber.replace(/-/g, ' ');
                                            jsonObjCurrentCharges.item_name = newPartNumber;
                                        }
                                        itemInternalId = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'item',
                                            line: itemLoop
                                        });
                                    }
                                    var fromDate = invoiceRecord.getSublistText({
                                        sublistId: 'item',
                                        fieldId: 'custcol_ns_service_start',
                                        line: itemLoop
                                    });
                                    var thruDate = invoiceRecord.getSublistText({
                                        sublistId: 'item',
                                        fieldId: 'custcol_ns_service_end',
                                        line: itemLoop
                                    });
                                    switch (true) {
                                        case (!SNOW.isEmpty(fromDate) && !SNOW.isEmpty(thruDate) && fromDate == thruDate): //Same Dates
                                            var dateStr = fromDate;
                                            break;
                                        case (!SNOW.isEmpty(fromDate) && !SNOW.isEmpty(thruDate)):  //Start and End Dates
                                            var dateStr = fromDate + ' - ' + thruDate;
                                            break;
                                        case (!SNOW.isEmpty(fromDate)):                             //From Date
                                            var dateStr = fromDate;
                                            break;
                                        case (!SNOW.isEmpty(thruDate)):                             //Thru Date
                                            var dateStr = thruDate;
                                            break;
                                        default:
                                            var dateStr = '';
                                    }

                                    //var theLineDescription = dateStr + ' ' + invoiceRecord.getSublistValue({
                                    var theLineDescription = invoiceRecord.getSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'description',
                                        line: itemLoop
                                    });
                                    if (SNOW.isEmpty(theLineDescription)) {
                                        theLineDescription = '';
                                    }
                                    theLineDescription = theLineDescription.replace(/-/g, ' ');
                                    theLineDescription = dateStr + ' ' + theLineDescription;
                                    jsonObjCurrentCharges.item_description = theLineDescription.trim();
                                    if (suppressQty == true) {
                                        jsonObjCurrentCharges.item_qty = '';
                                    } else {
                                        jsonObjCurrentCharges.item_qty = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'quantity',
                                            line: itemLoop
                                        });
                                    }
                                    if (SNOW.isEmpty(jsonObjCurrentCharges.item_description) && !SNOW.isEmpty(salesOrderRecord) && !SNOW.isEmpty(itemInternalId)) {
                                        var soItemInternalId = salesOrderRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'item',
                                            line: itemLoop
                                        });
                                        if (itemInternalId == soItemInternalId) {
                                            jsonObjCurrentCharges.item_description = salesOrderRecord.getSublistValue({
                                                sublistId: 'item',
                                                fieldId: 'description',
                                                line: itemLoop
                                            });
                                        }
                                    }

                                    var serialsOnInvoice = [];
                                    var arrayItems = jsonObjSerialInfo.arrayItems;
                                    var arraySerials = jsonObjSerialInfo.arraySerials;
                                    if (!SNOW.isEmpty(itemInternalId) && !SNOW.isEmpty(arrayItems)) {
                                        var itemInternalIdPos = arrayItems.indexOf(itemInternalId);
                                        if (itemInternalIdPos >= 0) {
                                            var availableSerials = arraySerials[itemInternalIdPos].split('|');
                                            var itemQtyNumeric = parseInt(jsonObjCurrentCharges.item_qty);
                                            while (availableSerials.length >= 0 && serialsOnInvoice.length < itemQtyNumeric) {
                                                var theCurrentSerial = availableSerials.pop();
                                                serialsOnInvoice.push(theCurrentSerial);
                                            }
                                            jsonObjSerialInfo.arraySerials[itemInternalIdPos] = availableSerials.join('|');
                                        }
                                    }

                                    if (serialsOnInvoice.length >= 1) {
                                        jsonObjCurrentCharges.item_description = jsonObjCurrentCharges.item_description + ' Serial Number(s): ' + serialsOnInvoice.join(', ');
                                        jsonObjCurrentCharges.item_description = jsonObjCurrentCharges.item_description.trim();
                                    }

                                    if (suppressPrice == true) {
                                        jsonObjCurrentCharges.item_unit_price = '';
                                        jsonObjCurrentCharges.item_ext_price = '';
                                    } else {
                                        jsonObjCurrentCharges.item_unit_price = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'rate',
                                            line: itemLoop
                                        });
                                        jsonObjCurrentCharges.item_ext_price = invoiceRecord.getSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'amount',
                                            line: itemLoop
                                        });
                                    }

                                    var theFilePath = invoiceRecord.getSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcol_so_invoice_attachment',
                                        line: itemLoop
                                    });
                                    theFilePath = formatFilePath(theFilePath);

                                    jsonObjCurrentCharges.item_file_path = theFilePath;
                                    arrayLines.push(jsonObjCurrentCharges);
                                } else {
                                    var thisLineGroup = invoiceGroup.toString();
                                    var thisLinePrice = invoiceRecord.getSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'amount',
                                        line: itemLoop
                                    });
                                    var invoiceGroupPos = arrayGroupIds.indexOf(thisLineGroup);
                                    if (invoiceGroupPos >= 0) {
                                        arrayGroupAmounts[invoiceGroupPos] = arrayGroupAmounts[invoiceGroupPos] + thisLinePrice;
                                    } else {
                                        arrayGroupIds.push(thisLineGroup);
                                        arrayGroupAmounts.push(thisLinePrice);
                                    }
                                }
                            }
                        } catch (err) {
                            log.error(itemLoop + ' Error', err.toString());
                        }
                    }

                    //Add Grouped Lines to Invoice
                    var numberOfGroups = arrayGroupIds.length;
                    for (var groupLoop = 0; groupLoop < numberOfGroups; groupLoop++) {
                        var groupId = arrayGroupIds[groupLoop];
                        var groupAmount = arrayGroupAmounts[groupLoop];

                        var groupRecord = RECORD.load({
                            type: 'customrecord_sti_invoice_group',
                            id: groupId,
                            isDynamic: false
                        });

                        var groupDescription;
                        var groupName = groupRecord.getValue({ fieldId: 'name' });
                        var groupLabel = groupRecord.getValue({ fieldId: 'custrecord_sti_invoice_group_label' });

                        if (SNOW.isEmpty(groupLabel)) {
                            groupDescription = groupName;
                        } else {
                            groupDescription = groupLabel;
                        }

                        jsonObjCurrentCharges = {};
                        jsonObjCurrentCharges.item_name = " ";
                        jsonObjCurrentCharges.item_description = groupDescription;
                        jsonObjCurrentCharges.item_qty = " ";
                        jsonObjCurrentCharges.item_unit_price = " ";
                        jsonObjCurrentCharges.item_ext_price = groupAmount;
                        jsonObjCurrentCharges.item_file_path = "";
                        jsonObjCurrentCharges.item_addr_street = " ";
                        jsonObjCurrentCharges.item_addr_city = " ";
                        jsonObjCurrentCharges.item_addr_state = " ";
                        arrayLines.push(jsonObjCurrentCharges);
                    }

                    //Sub Total
                    jsonObjCurrentCharges = {};
                    jsonObjCurrentCharges.item_name = " ";
                    jsonObjCurrentCharges.item_description = "Sub-Total";
                    jsonObjCurrentCharges.item_qty = " ";
                    jsonObjCurrentCharges.item_unit_price = " ";
                    jsonObjCurrentCharges.item_ext_price = jsonInvoiceObj.sub_total;
                    jsonObjCurrentCharges.item_file_path = "";
                    jsonObjCurrentCharges.item_addr_street = " ";
                    jsonObjCurrentCharges.item_addr_city = " ";
                    jsonObjCurrentCharges.item_addr_state = " ";
                    arrayLines.push(jsonObjCurrentCharges);

                    //Tax Total
                    jsonObjCurrentCharges = {};
                    jsonObjCurrentCharges.item_name = " ";
                    jsonObjCurrentCharges.item_description = "Total Taxes";
                    jsonObjCurrentCharges.item_qty = " ";
                    jsonObjCurrentCharges.item_unit_price = " ";
                    jsonObjCurrentCharges.item_ext_price = jsonInvoiceObj.tax_total;
                    jsonObjCurrentCharges.item_file_path = "";
                    jsonObjCurrentCharges.item_addr_street = " ";
                    jsonObjCurrentCharges.item_addr_city = " ";
                    jsonObjCurrentCharges.item_addr_state = " ";
                    arrayLines.push(jsonObjCurrentCharges);

                    //Shipping Total
                    if (!SNOW.isEmpty(jsonInvoiceObj.ship_total)) {
                        jsonObjCurrentCharges = {};
                        jsonObjCurrentCharges.item_name = " ";
                        jsonObjCurrentCharges.item_description = "Total Shipping";
                        jsonObjCurrentCharges.item_qty = " ";
                        jsonObjCurrentCharges.item_unit_price = " ";
                        jsonObjCurrentCharges.item_ext_price = jsonInvoiceObj.ship_total;
                        jsonObjCurrentCharges.item_file_path = "";
                        jsonObjCurrentCharges.item_addr_street = " ";
                        jsonObjCurrentCharges.item_addr_city = " ";
                        jsonObjCurrentCharges.item_addr_state = " ";
                        arrayLines.push(jsonObjCurrentCharges);
                    }

                    //Grand Total
                    jsonObjCurrentCharges = {};
                    jsonObjCurrentCharges.item_name = " ";
                    jsonObjCurrentCharges.item_description = totalLineDescription;
                    jsonObjCurrentCharges.item_qty = " ";
                    jsonObjCurrentCharges.item_unit_price = " ";
                    jsonObjCurrentCharges.item_ext_price = jsonInvoiceObj.invoice_total;
                    jsonObjCurrentCharges.item_file_path = "";
                    jsonObjCurrentCharges.item_addr_street = " ";
                    jsonObjCurrentCharges.item_addr_city = " ";
                    jsonObjCurrentCharges.item_addr_state = " ";
                    arrayLines.push(jsonObjCurrentCharges);
                    jsonInvoiceObj.invoice_lines = arrayLines;

                    //Format Data like Universe for Now Until I get C# working and can read json
                    var tempData = "";
                    var billCSZ = jsonInvoiceObj.bill_city + ", " + jsonInvoiceObj.bill_state + " " + jsonInvoiceObj.bill_zip;
                    var shipCSZ = jsonInvoiceObj.ship_city + ", " + jsonInvoiceObj.ship_state + " " + jsonInvoiceObj.ship_zip;
                    var shipMore = jsonInvoiceObj.customer_number + " " + jsonInvoiceObj.ship_addressee;

                    var upBillAddress = getCustomerNumber(customerRecord);
                    upBillAddress = upBillAddress + colDelimiter + jsonInvoiceObj.bill_attention;
                    upBillAddress = upBillAddress + colDelimiter + jsonInvoiceObj.bill_addressee;
                    upBillAddress = upBillAddress + colDelimiter + jsonInvoiceObj.bill_addr;
                    upBillAddress = upBillAddress + colDelimiter + billCSZ;

                    var upShipAddress = shipMore;
                    upShipAddress = upShipAddress + colDelimiter + jsonInvoiceObj.ship_addr;
                    upShipAddress = upShipAddress + colDelimiter + shipCSZ;

                    //Line Items
                    var arrayNames = [];
                    var arrayDescs = [];
                    var arrayQtys = [];
                    var arrayUnitCosts = [];
                    var arrayExtCosts = [];
                    var arrayFilePaths = [];
                    var arrayStreetAddrs = [];
                    var arrayCityStates = []; var theCity; var theState; var theCityState;
                    var lineLoop;

                    var lineCount = jsonInvoiceObj.invoice_lines.length;
                    for (lineLoop = 0; lineLoop < lineCount; lineLoop++) {
                        theCity = jsonInvoiceObj.invoice_lines[lineLoop].item_addr_city;
                        theState = jsonInvoiceObj.invoice_lines[lineLoop].item_addr_state;
                        if (SNOW.isEmpty(theCity) && SNOW.isEmpty(theState)) {
                            theCityState = "";
                        } else {
                            theCityState = theCity + ", " + theState;
                            theCityState = theCityState.trim();
                        }
                        if (theCityState == ",") {
                            theCityState = "";
                        }

                        arrayNames.push(jsonInvoiceObj.invoice_lines[lineLoop].item_name);
                        arrayDescs.push(jsonInvoiceObj.invoice_lines[lineLoop].item_description);
                        arrayQtys.push(jsonInvoiceObj.invoice_lines[lineLoop].item_qty);
                        arrayUnitCosts.push(jsonInvoiceObj.invoice_lines[lineLoop].item_unit_price);
                        arrayExtCosts.push(jsonInvoiceObj.invoice_lines[lineLoop].item_ext_price);
                        arrayFilePaths.push(jsonInvoiceObj.invoice_lines[lineLoop].item_file_path);
                        arrayStreetAddrs.push(jsonInvoiceObj.invoice_lines[lineLoop].item_addr_street);
                        arrayCityStates.push(theCityState);

                        arrayNames.push("");
                        arrayDescs.push("");
                        arrayQtys.push("");
                        arrayUnitCosts.push("");
                        arrayExtCosts.push("");
                        arrayFilePaths.push("");
                        arrayStreetAddrs.push("");
                        arrayCityStates.push("");
                    }

                    //Add Invoice Body Attachment to arrayFilePaths
                    if (!SNOW.isEmpty(invoiceBodyAttachment)) {
                        for (var pathLoop = 0; arrayFilePaths.length; pathLoop++) {
                            if (SNOW.isEmpty(arrayFilePaths[pathLoop])) {
                                arrayFilePaths[pathLoop] = invoiceBodyAttachment;
                                invoiceBodyAttachment = '';
                                break;
                            }
                        }
                    }
                    if (!SNOW.isEmpty(invoiceBodyAttachment)) {
                        arrayFilePaths.unshift(invoiceBodyAttachment);
                    }

                    //Check for Drag And Drop Files to Add to Invoice pdf
                    //if (SNOW.isEmpty(invoiceBodyAttachment)) {
                    var dragAndDropFileName = '';
                    var dragAndDropContents = '';
                    var arrayFolders = [1621, 1622];
                    var arrayPrefixes = ['OP', 'SO'];
                    var arrayFields = ['opportunity', 'createdfrom'];
                    var arrayEnums = [RECORD.Type.SALES_ORDER, RECORD.Type.OPPORTUNITY];
                    var foundTheFile = false;

                    for (var typeLoop = 0; typeLoop < 2 && !foundTheFile; typeLoop++) {
                        var folderId = arrayFolders[typeLoop];
                        var fieldName = arrayFields[typeLoop];
                        var theEnumRecordType = arrayEnums[typeLoop];
                        var internalId = invoiceRecord.getValue({ fieldId: fieldName });
                        if (!SNOW.isEmpty(internalId)) {
                            try {
                                if (typeLoop == 0) {
                                    var theOriginalRecord = RECORD.load({
                                        type: RECORD.Type.OPPORTUNITY,
                                        id: internalId,
                                        isDynamic: false
                                    });
                                } else {
                                    if (selectedRecordType == '103') {  //Pro Forma
                                        var theOriginalRecord = invoiceRecord;
                                    } else {
                                        var theOriginalRecord = RECORD.load({
                                            type: RECORD.Type.SALES_ORDER,
                                            id: internalId,
                                            isDynamic: false
                                        });
                                    }
                                }


                                var theTranId = theOriginalRecord.getValue({ fieldId: 'tranid' }).replace(/\D/g, '');
                                var invoiceType = theOriginalRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
                                if (SNOW.isEmpty(invoiceType)) {
                                    invoiceType = '';
                                }
                                invoiceType = invoiceType.toString();
                                if (invoiceType == '5') {
                                    var folderId = 21340;
                                    var dragAndDropFileName = theOriginalRecord.id + '_SRBilling.pdf';
                                } else {
                                    var dragAndDropFileName = arrayPrefixes[typeLoop] + theTranId + ' - Invoice Detail.pdf';
                                }
                                var dragAndDropFileId = STIN.doSearchFolderForFile(folderId, dragAndDropFileName);
                                var theFileObj = FILE.load({
                                    id: dragAndDropFileId
                                });
                                var logFileId = STIUTIL.addLog('theFileObj', JSON.stringify(theFileObj));
                                var dragAndDropContents = theFileObj.getContents();
                                var logFileId = STIUTIL.addLog('pdfFileContent', dragAndDropContents);
                                foundTheFile = Boolean(!SNOW.isEmpty(dragAndDropContents));
                            } catch (err) {
                                log.audit('Unable to Find File Attachment', err.message);
                            }
                        }
                    }

                    //Check for Other Attachments to be Added to the Invoice
                    var arrOtherFileNames = [];
                    var arrOtherFileContents = [];
                    try {
                        var strAttachFileIds = invoiceRecord.getValue({ fieldId: 'custbody_sti_list_of_invc_attachments' });
                        if (SNOW.isEmpty(strAttachFileIds)) {
                            strAttachFileIds = '';
                        }
                        var arrAttachFileIds = strAttachFileIds.split(',');
                        for (var intAttachFileLoop = 0; intAttachFileLoop < arrAttachFileIds.length; intAttachFileLoop++) {
                            try {
                                var thisFileId = arrAttachFileIds[intAttachFileLoop];
                                var theFileObj = FILE.load({
                                    id: thisFileId
                                });
                                var theFileType = theFileObj.fileType;
                                if (theFileType == 'PDF') {
                                    arrOtherFileNames.push(theFileObj.name);
                                    arrOtherFileContents.push(theFileObj.getContents());
                                }
                            } catch (err) { }
                        }
                    } catch (err) { }

                    //Remove Potential Blank Lines from End of Arrays
                    try {
                        var theHighestLength = Math.max(arrayNames.length, arrayDescs.length, arrayQtys.length, arrayUnitCosts.length, arrayFilePaths.length, arrayStreetAddrs.length, arrayCityStates.length);

                        var blankLastLine = false;
                        var elementLoop = theHighestLength - 1;
                        do {
                            if (
                                SNOW.isEmpty(arrayNames[elementLoop]) &&
                                SNOW.isEmpty(arrayDescs[elementLoop]) &&
                                SNOW.isEmpty(arrayQtys[elementLoop]) &&
                                SNOW.isEmpty(arrayUnitCosts[elementLoop]) &&
                                SNOW.isEmpty(arrayExtCosts[elementLoop]) &&
                                SNOW.isEmpty(arrayFilePaths[elementLoop]) &&
                                SNOW.isEmpty(arrayStreetAddrs[elementLoop]) &&
                                SNOW.isEmpty(arrayCityStates[elementLoop])
                            ) {
                                blankLastLine = true;
                                arrayNames.pop();
                                arrayDescs.pop();
                                arrayQtys.pop();
                                arrayUnitCosts.pop();
                                arrayExtCosts.pop();
                                arrayFilePaths.pop();
                                arrayStreetAddrs.pop();
                                arrayCityStates.pop();
                            } else {
                                var blankLastLine = false;
                            }
                            elementLoop = elementLoop - 1;
                        }
                        while (blankLastLine === true && elementLoop >= 0);
                    } catch (err) {
                        log.error('Error removing trailing blank lines', err.toString());
                    }
                    var theHighestLength = Math.max(arrayNames.length, arrayDescs.length, arrayQtys.length, arrayUnitCosts.length, arrayFilePaths.length, arrayStreetAddrs.length, arrayCityStates.length);

                    tempData = jsonInvoiceObj.bill_attention;                                 //* <01> Bill Attention
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.bill_addressee;       //* <02> Addressee
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.bill_addr;            //* <03> Bill Address
                    tempData = tempData + rowDelimiter + billCSZ                              //* <04> Bill City, State, Zip
                    tempData = tempData + rowDelimiter + shipMore                             //* <05> Ship Customer Number and Ship Addressee
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.ship_addr;            //* <06> Ship Address
                    tempData = tempData + rowDelimiter + shipCSZ;                             //* <07> Ship City, State, Zip
                    tempData = tempData + rowDelimiter + referenceNumberOne;                  //* <08> Reference Line 1
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.po_number;            //* <09> Purchase Order Number
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.invoice_date;         //* <10> Invoice Date
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.customer_number;      //* <11> Customer Number
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.labor_terms;          //* <12> Labor Terms
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.nonlabor_terms;       //* <13> Non-Labor Terms
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.sales_rep;            //* <14> Sales Rep
                    tempData = tempData + rowDelimiter + arrayNames.join(colDelimiter);       //* <15> Item Names
                    tempData = tempData + rowDelimiter + arrayDescs.join(colDelimiter);       //* <16> Item Descriptions
                    tempData = tempData + rowDelimiter + arrayQtys.join(colDelimiter);        //* <17> Item Quantities
                    tempData = tempData + rowDelimiter + arrayUnitCosts.join(colDelimiter);   //* <18> Item Unit Costs
                    tempData = tempData + rowDelimiter + arrayExtCosts.join(colDelimiter);    //* <19> Item Extended Costs
                    tempData = tempData + rowDelimiter + "";                                  //* <20> Contract Addendum
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.email_address;        //* <21> Email Address
                    tempData = tempData + rowDelimiter + referenceNumberTwo;                  //* <22> Reference Line 2
                    tempData = tempData + rowDelimiter + "";                                  //* <23> S&H Present
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.description           //* <24> Invoice Description
                    tempData = tempData + rowDelimiter + jsonInvoiceObj.invoice_number;       //* <25> Invoice Number
                    tempData = tempData + rowDelimiter + "";                                  //* <26> Invoice Instructions
                    tempData = tempData + rowDelimiter + upBillAddress;                       //* <27> Upcase Bill-To Address Information (1-4)
                    tempData = tempData + rowDelimiter + upShipAddress;                       //* <28> Upcase Ship-to Address Information (5-7)
                    tempData = tempData + rowDelimiter + invoiceBodyAttachment;               //* <29> Invoice Body Attachment
                    tempData = tempData + rowDelimiter + arrayFilePaths.join(colDelimiter);   //* <30> Invoice Attachments
                    tempData = tempData + rowDelimiter + arrayStreetAddrs.join(colDelimiter); //* <31> Street Addresses
                    tempData = tempData + rowDelimiter + arrayCityStates.join(colDelimiter);  //* <32> Cities and States

                    var theTranId = jsonInvoiceObj.invoice_number = invoiceRecord.getValue({ fieldId: "tranid" }).toString();
                    if (selectedRecordType == '103') {
                        theTranId = 'PFRM' + theTranId.replace(/\D/g, "");
                    }

                    jsonInvoiceObj = {};
                    jsonInvoiceObj.recordtype = "invoice_pdf";
                    jsonInvoiceObj.customer_number = getCustomerNumber(customerRecord);
                    jsonInvoiceObj.invoice_number = theTranId.toString();
                    jsonInvoiceObj.internal_id = invoiceRecord.id.toString();
                    jsonInvoiceObj.record_type = sendRecordType;
                    jsonInvoiceObj.invoice_data = tempData;
                    jsonInvoiceObj.drag_drop_name = dragAndDropFileName;
                    jsonInvoiceObj.drag_drop_content = dragAndDropContents;
                    jsonInvoiceObj.other_attachment_names = arrOtherFileNames.join(colDelimiter);
                    jsonInvoiceObj.other_attachment_contents = arrOtherFileContents.join(colDelimiter);
                    jsonInvoiceObj.credit_card_link = theInvoicePaymentLink;
                    invoiceDataArray.push(jsonInvoiceObj);
                    var logFileId = STIUTIL.addLog('jsonInvoiceObj', JSON.stringify(jsonInvoiceObj));
                }
            } catch (err) {
                log.error('Error on buildInvoiceDataArray', err.toString());
            }
            return invoiceDataArray;
        }
        function formatFilePath(oldFilePath) {
            var fromTime = new Date();
            newFilePath = oldFilePath;
            if (!SNOW.isEmpty(newFilePath)) {
                var lastFour = newFilePath.slice(-4).toUpperCase();
                if (lastFour != '.PDF') {
                    newFilePath = newFilePath + '.pdf';
                }
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "formatFilePath");
            return newFilePath;
        }
        function callTheAPI(integrationObj) {
            var fromTime = new Date();
            var currentNumber = integrationObj.Number;
            var apiToCall = integrationObj.apiToCall;
            var base64EncodedString = integrationObj.base64EncodedString;
            var fullJsonObj = integrationObj.fullJsonObj;

            var reqObj = {
                url: apiToCall,
                requestType: HTTPS.Method.PUT,
                requestDate: new Date(),
                thirdParty: "ServiceNow"
            };

            reqObj.headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': base64EncodedString
            };
            var response = HTTPS.post({
                url: reqObj.url,
                body: JSON.stringify(fullJsonObj),
                headers: reqObj.headers
            });

            reqObj.response = response.body;
            reqObj.code = response.code;

            var strMessage;
            strMessage = {
                "Endpoint": reqObj.url,
                "Response": reqObj.response,
                "HTTP Code": reqObj.code,
                "Payload": fullJsonObj
            };
            //var logFileId = STIUTIL.addLog('API Call - Process Invoice Module', JSON.stringify(strMessage));
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "callTheAPI");
            return strMessage;
        }
        function postProcessInvoices(invoicePrintArray, searchJsonObj) {
            var fromTime = new Date();
            var singlePreviewFlag = false;
            try {
                var scriptObj = RUNTIME.getCurrentScript();
                var theNewlyCreatedFileId;
                var folderBatchPDF = scriptObj.getParameter({ name: 'custscript_sti_invoice_batch_pdf_folder' });
                var folderInvoicePDF = scriptObj.getParameter({ name: 'custscript_sti_invoice_pdf_folder' });

                const singlePrintFlag = Boolean(searchJsonObj.single_print_flag == 'true');
                var singlePreviewFlag = Boolean(searchJsonObj.single_preview_flag == 'true');
                var batchReprintOnly = Boolean(searchJsonObj.batchReprintOnly == 'true');
                var batchPrintEmailOnly = Boolean(searchJsonObj.batchPrintEmailOnly == 'true');
                var emailSenderId = 438;

                const selectedRecordType = searchJsonObj.custrecord_sti_batch_record_type;
                var enumRecordType;
                switch (true) {
                    case (selectedRecordType == '1'):  //Invoices
                        enumRecordType = RECORD.Type.INVOICE
                        break;
                    case (selectedRecordType == '2'):  //Credit Memos
                        enumRecordType = RECORD.Type.CREDIT_MEMO;
                        break;
                    case (selectedRecordType == '103'):  //Pro Formas
                        enumRecordType = RECORD.Type.SALES_ORDER;
                        break;
                    default:
                        enumRecordType = RECORD.Type.INVOICE
                }

                var batchInternalId = searchJsonObj.batch_internal_id;
                var selectedBatchNumber = searchJsonObj.custrecord_sti_batch_number;
                var selectedOutputType = searchJsonObj.custrecord_sti_batch_output_type;
                var attachmentRecType;// InvoiceBatch

                var invoiceLoop;
                var invoiceCnt = invoicePrintArray.length;
                var currentInvoiceType;
                var currentApprovalStatus;
                var invoiceMessageToCustomer;
                var invoiceMessageToCustomerType;

                //Loop Through Items Returned from Invoice Print and Attach, Email, Approve, as Requested
                for (var itemLoop = 0; itemLoop < invoicePrintArray.length; itemLoop++) {
                    var jsonItemObj = JSON.parse(JSON.stringify(invoicePrintArray[itemLoop]));
                    var itemRecType = jsonItemObj.attachmentRecType;
                    if (batchReprintOnly && itemRecType != 'InvoiceBatch') {
                        continue;
                    }
                    var itemFileName = jsonItemObj.attachmentFileName;
                    var itemInternalId = jsonItemObj.attachmentInternalId;
                    var itemAttachContent = jsonItemObj.attachmentContent;
                    var addToCount = true;

                    try {
                        var transactionRecord = RECORD.load({
                            type: enumRecordType,
                            id: itemInternalId,
                            isDynamic: false
                        });
                        var fromEpicor = STIUTIL.getBoolean(transactionRecord.getValue({ fieldId: 'custbody_sti_from_epicor' }));
                        if (fromEpicor) throw transactionRecord.getValue({ fieldId: 'tranid' }) + " From Epicor - Skipped";
                    } catch (err) {
                        var transactionRecord = '';
                    }

                    switch (true) {
                        case (itemRecType == 'InvoiceBatch' && batchPrintEmailOnly):
                            addToCount = false;
                            break;
                        case (itemRecType == 'InvoiceBatch' || singlePreviewFlag):
                            var addToCount = Boolean(itemRecType == singlePreviewFlag);
                            if (singlePreviewFlag && !SNOW.isEmpty(transactionRecord)) {
                                itemFileName = 'Preview_' + transactionRecord.getValue({ fieldId: 'tranid' });
                            }
                            var addPDFObj = {
                                name: itemFileName,
                                content: itemAttachContent
                            };
                            var theNewlyCreatedFileId = addPDF(addPDFObj, folderBatchPDF);
                            var jsonAttachmentObj = {
                                fileid: theNewlyCreatedFileId,
                                recid: batchInternalId,
                                rectype: 'customrecord_sti_invoice_batch'
                            };
                            var attachResult = attachPDF(jsonAttachmentObj);
                            if (singlePreviewFlag) {
                                return theNewlyCreatedFileId;
                            }
                            break;
                        case (selectedOutputType == 101): //To Be Invoiced - Remove
                            break;
                        case (selectedOutputType == 102): //To Be Invoiced - Add
                            break;
                        case (selectedRecordType == '103'):  //Pro Formas
                            var destinationFolderId = STIN.doGetTransactionFolderId('4975', itemInternalId, enumRecordType);
                            var rtnValAttached = doAttachTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId); //Attach to Transaction and Customer Record
                            break;
                        case (selectedOutputType == 2 || selectedOutputType == 4):   //Approve or Approve and Email
                            var destinationFolderId = STIN.doGetTransactionFolderId(folderInvoicePDF, itemInternalId, enumRecordType);

                            switch (true) {
                                case (selectedRecordType == '1'):  //Invoice
                                    var rtnValApproved = doApproveTransaction(itemInternalId, enumRecordType, selectedBatchNumber); //Mark Approved, Update Customer PO, Commit Taxes
                                    break;
                                case (selectedRecordType == '2'):  //Credit 
                                    var rtnValApproved = {
                                        success: true
                                    };
                                    break;
                                default:
                                    var rtnValApproved = {
                                        success: false
                                    };
                            }
                            if (rtnValApproved.success) {
                                var rtnValAttached = doAttachTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId); //Attach to Transaction and Customer Record
                                if (SNOW.isEmpty(rtnValAttached.message)) {
                                    if (selectedOutputType == 4) {  //Email
                                        var rtnValEmail = doEmailTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId);
                                        if (SNOW.isEmpty(rtnValEmail.message)) {
                                            //var transactionRecord = RECORD.load({
                                            //    type: enumRecordType,
                                            //    id: itemInternalId,
                                            //    isDynamic: false
                                            //});
                                            //transactionRecord.setValue({
                                            //    fieldId: 'custbody_sti_invoice_status',
                                            //    value: '3'
                                            //});
                                            //transactionRecord.save();
                                        } else {
                                            doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValEmail.message);
                                        }
                                    }
                                } else {
                                    doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValAttached.message);
                                }
                            } else {
                                if (!SNOW.isEmpty(rtnValApproved.message)) {
                                    doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValApproved.message);
                                }
                            }
                            addToCount = Boolean(!batchPrintEmailOnly);
                            break;
                        case (selectedOutputType == 3): //Email
                            var destinationFolderId = STIN.doGetTransactionFolderId(folderInvoicePDF, itemInternalId, enumRecordType);
                            var rtnValEmail = doEmailTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId);
                            if (!SNOW.isEmpty(rtnValEmail.message)) {
                                doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValAttached.message);
                            }
                            break;
                        case (selectedOutputType == 5): //Reprint
                            var okToReprint = false;
                            switch (true) {
                                case (selectedRecordType == '1'):  //Invoice
                                    var transactionRecord = RECORD.load({
                                        type: enumRecordType,
                                        id: itemInternalId,
                                        isDynamic: false
                                    });
                                    var currentApprovalStatus = transactionRecord.getValue({ fieldId: 'approvalstatus' });
                                    if (SNOW.isEmpty(currentApprovalStatus)) {
                                        currentApprovalStatus = '';
                                    }
                                    var okToReprint = Boolean(currentApprovalStatus.toString() == '2');
                                    break;
                                case (selectedRecordType == '2'):  //Credit 
                                    var okToReprint = true;
                                    break;
                                default:
                                    var okToReprint = false;
                            }
                            if (okToReprint) {
                                var destinationFolderId = STIN.doGetTransactionFolderId(folderInvoicePDF, itemInternalId, enumRecordType);
                                var rtnValAttached = doAttachTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId); //Attach to Transaction and Customer Record
                                if (!SNOW.isEmpty(rtnValAttached.message)) {
                                    doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, rtnValAttached.message);
                                }
                            }
                        default:
                    }

                    if (addToCount) {
                        var numberProcessedAlready = itemLoop + 1;
                        try {
                            RECORD.submitFields({
                                type: 'customrecord_sti_invoice_batch',
                                id: batchInternalId,
                                values: {
                                    custrecord_sti_invoice_batch_completed: numberProcessedAlready,
                                }
                            });
                        } catch (err) {
                            LOG.error({ title: 'Error sti_process_invoice_module on Invoice Batch Update - custrecord_sti_invoice_batch_selected', details: err.toString() });
                        }
                    }
                }
            } catch (err) {
                log.error('Error postProcessInvoices', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "postProcessInvoices");
            return "something";
        }
        function runInvoiceBatchReport(searchJsonObj) {
            var fromTime = new Date();
            try {
                log.audit('running batch report', searchJsonObj);
                var theBatchInternalId = searchJsonObj.batch_internal_id.toString();
                var theBatchNumber = searchJsonObj.custrecord_sti_batch_number.toString();
                var theWebTempId = searchJsonObj.web_temp_id.toString();

                var batchReportSearch = SEARCH.create({
                    "type": "transaction",
                    "title": 'Invoice Batch Report Search ' + theWebTempId,
                    "id": 'customsearch_' + theWebTempId,
                    "filters": [
                        {
                            "name": "type",
                            "operator": "anyof",
                            "values": ["CustInvc", "CustCred"],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        },
                        {
                            "name": "mainline",
                            "operator": "is",
                            "values": ["T"],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        },
                        {
                            "name": "custbody_sti_inv_batch_num",
                            "operator": "is",
                            "values": [theBatchNumber],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [
                        {
                            "name": "tranid",
                            "label": "Invoice Number",
                            "type": "text",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "trandate",
                            "label": "Invoice Date",
                            "type": "date",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "entity",
                            "label": "Name",
                            "type": "select",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_billing_coordinator",
                            "label": "Billing Coordinator",
                            "type": "select",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_invoice_status",
                            "label": "Invoice Status",
                            "type": "select",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_tbb_box",
                            "label": "TBB",
                            "type": "checkbox",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "approvalstatus",
                            "label": "Approval Status",
                            "type": "select",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_trans_emailed_to_cust",
                            "label": "Emailed",
                            "type": "date",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_tax_total",
                            "label": "Tax Total",
                            "type": "currency",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "amount",
                            "label": "Amount",
                            "type": "currency",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custentity_cust_inv_notes",
                            "join": "customerMain",
                            "label": "Invoice Notes",
                            "type": "textarea",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_tax_errors",
                            "label": "Errors",
                            "type": "clobtext",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "memo",
                            "label": "Memo",
                            "type": "text",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "custbody_sti_inv_batch_num",
                            "label": "Batch Number",
                            "type": "text",
                            "sortdir": "NONE"
                        }
                    ],
                    "settings": [],
                    "scriptId": 'customsearch_' + theWebTempId,
                    "isPublic": false
                });
                var batchReportSearchId = batchReportSearch.save();
                log.audit('batchReportSearchId', batchReportSearchId);

                //Create a Blank csv File in the File Cabinet and get the File Id
                var csvFileId;
                var csvFileName = 'InvoiceBatchReport_' + theWebTempId + '.csv';
                var pathName = 'Accounting/Invoice Batch Reports/' + csvFileName;

                //try {
                var fileObj = FILE.create({
                    name: csvFileName,
                    fileType: FILE.Type.CSV,
                    contents: "",
                    folder: 4976,
                    isOnline: true,
                    conflictResolution: FILE.NameConflictResolution.OVERWRITE
                });
                csvFileId = fileObj.save();
                //} catch (err) {
                //    log.error("Error creating CSV file", err.toString());
                //}

                var searchTask = TASK.create({
                    taskType: TASK.TaskType.SEARCH
                });
                searchTask.savedSearchId = batchReportSearchId;
                searchTask.filePath = pathName;
                var searchTaskId = searchTask.submit();

                taskStatus = TASK.checkStatus(searchTaskId).status;
                do {
                    wait_a_second(5);
                    taskStatus = TASK.checkStatus(searchTaskId).status;
                    taskStatus = taskStatus.toUpperCase();
                }
                while (taskStatus != 'COMPLETE' && taskStatus != "FAILED");
                if (taskStatus == "COMPLETE") {  //Attach CSV File to Invoice Batch Record
                    try {
                        RECORD.attach({
                            record: {
                                type: 'file',
                                id: csvFileId
                            },
                            to: {
                                type: 'customrecord_sti_invoice_batch',
                                id: theBatchInternalId
                            }
                        });
                    } catch (err) {
                        log.error("Error sti_process_invoice_module attaching Batch Report CSV", err.toString());
                    }
                }

                //Delete the Temporary Saved Search
                SEARCH.delete({
                    id: batchReportSearchId
                });
            } catch (err) {
                log.error('runInvoiceBatchReport', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "runInvoiceBatchReport");
            return;
        }
        function doApproveTransaction(itemInternalId, enumRecordType, selectedBatchNumber) {
            var fromTime = new Date();
            try {
                log.audit('start doApproveTransaction', itemInternalId + ' ' + enumRecordType + ' ' + selectedBatchNumber)
                var transactionRecord = RECORD.load({
                    type: enumRecordType,
                    id: itemInternalId,
                    isDynamic: false
                });
                var taxIssues = transactionRecord.getValue({ fieldId: 'custbody_sti_tax_errors' });
                var custbody_sti_tbb_box = transactionRecord.getValue({ fieldId: 'custbody_sti_tbb_box' });
                if (SNOW.isEmpty(custbody_sti_tbb_box)) {
                    custbody_sti_invoice_status = 'False';
                }
                custbody_sti_tbb_box = custbody_sti_tbb_box.toString().toUpperCase();
                var tbbFlagged = Boolean(custbody_sti_tbb_box == 'TRUE' || custbody_sti_tbb_box == 'T');
                if (tbbFlagged && SNOW.isEmpty(taxIssues)) {  //Must be TBB and No Invoice Errors
                    currentApprovalStatus = transactionRecord.getValue({ fieldId: 'approvalstatus' });
                    if (SNOW.isEmpty(currentApprovalStatus)) {
                        currentApprovalStatus = "";
                    }
                    currentApprovalStatus = currentApprovalStatus.toString();

                    if (currentApprovalStatus != '2') {
                        try {
                            transactionRecord.setValue({
                                fieldId: 'approvalstatus',
                                value: '2'
                            });
                            transactionRecord.setValue({
                                fieldId: 'custbody_sti_invoice_status',
                                value: '3'
                            });
                            transactionRecord.setValue({
                                fieldId: 'custbody_sti_inv_batch_num',
                                value: selectedBatchNumber
                            });
                            transactionRecord.setValue({
                                fieldId: 'custbody_sti_date_pdf_created',
                                value: new Date()
                            });
                            transactionRecord.save();

                            transactionRecord = RECORD.load({
                                type: enumRecordType,
                                id: itemInternalId,
                                isDynamic: false
                            });

                            var customerPO = transactionRecord.getValue({
                                fieldId: 'otherrefnum'
                            });

                            if (!SNOW.isEmpty(customerPO)) {
                                var poRecord = RECORD.create({
                                    type: 'customrecord_sti_cust_purchase_orders',
                                });
                                poRecord.setValue({
                                    fieldId: 'name',
                                    value: customerPO
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_customer_number',
                                    value: transactionRecord.getValue({ fieldId: 'entity' })
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_invoice_number',
                                    value: itemInternalId
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_applied_amount',
                                    value: transactionRecord.getValue({ fieldId: 'total' })
                                });
                                var poRecordId = poRecord.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });
                            }
                        } catch (err) {
                            log.error('Error Updating Approval Status', err.toString());
                        }
                    }
                }
                var rtnVal = {
                    success: true
                };
            } catch (err) {
                log.error('doApproveTransaction', itemInternalId + ' ' + err.toString());
                var rtnVal = {
                    success: false,
                    message: 'doApproveTransaction ' + itemInternalId + ' ' + err.message
                };
            }
            log.audit('end doApproveTransaction', JSON.stringify(rtnVal) + ' ' + itemInternalId + ' ' + enumRecordType + ' ' + selectedBatchNumber)
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "doApproveTransaction");
            return rtnVal;
        }
        function doAttachTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId) { //Attach to Transaction and Customer Record
            var fromTime = new Date();
            try {
                log.audit('start doAttachTransaction', itemInternalId + ' ' + enumRecordType + ' ' + itemFileName + ' ' + destinationFolderId);
                var jsonCreateFileObj = {
                    name: itemFileName,
                    content: itemAttachContent
                }
                var theNewlyCreatedFileId = addPDF(jsonCreateFileObj, destinationFolderId);

                if (SNOW.isEmpty(theNewlyCreatedFileId)) {
                    throw new Error('Unable to Create ' + itemFileName + ' in Folder ' + destinationFolderId);
                } else {
                    var jsonAttachmentObj = {
                        fileid: theNewlyCreatedFileId,
                        recid: itemInternalId,
                        rectype: enumRecordType
                    };
                    var rtnVal = attachPDF(jsonAttachmentObj);

                    if (rtnVal.success = true) {
                        var transactionRecord = RECORD.load({
                            type: enumRecordType,
                            id: itemInternalId,
                            isDynamic: false
                        });
                        var customerInternalId = transactionRecord.getValue({ fieldId: 'entity' });
                        var jsonAttachmentObj = {
                            fileid: theNewlyCreatedFileId,
                            recid: customerInternalId,
                            rectype: RECORD.Type.CUSTOMER
                        };
                        var rtnVal = attachPDF(jsonAttachmentObj);
                    }
                }
                rtnVal.fileid = theNewlyCreatedFileId;
            } catch (err) {
                log.error('doAttachTransaction', err.toString());
                var rtnVal = {
                    success: false,
                    message: 'doAttachTransaction ' + err.message
                };
            }
            log.audit('end doAttachTransaction', JSON.stringify(rtnVal) + ' ' + itemInternalId + ' ' + enumRecordType + ' ' + itemFileName + ' ' + destinationFolderId);
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "doAttachTransaction");
            return rtnVal;
        }
        function doEmailTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId) {
            var fromTime = new Date();
            try {
                log.audit('start doEmailTransaction', itemInternalId + ' ' + enumRecordType + ' ' + itemFileName + ' ' + destinationFolderId);
                var okToEmail = false;
                var transactionRecord = RECORD.load({
                    type: enumRecordType,
                    id: itemInternalId,
                    isDynamic: false
                });
                var customerId = transactionRecord.getValue({ fieldId: 'entity' });
                var customerRecord = RECORD.load({
                    type: RECORD.Type.CUSTOMER,
                    id: customerId,
                    isDynamic: false
                });
                var invoiceMessageToCustomer = customerRecord.getValue({ fieldId: 'custentity_sti_invoice_message_to_cust' });
                var invoiceMessageToCustomerType = customerRecord.getValue({ fieldId: 'custentity_sti_invoice_message_type' });
                var emailSenderId = 438;
                if (itemAttachContent.substring(0, 5) == 'FILE_') {
                    var fileIdToEmail = itemAttachContent.substring(5);
                } else {
                    var fileIdToEmail = '';
                }
                switch (true) {
                    case (enumRecordType == RECORD.Type.INVOICE):
                        var currentApprovalStatus = transactionRecord.getValue({ fieldId: 'approvalstatus' });
                        if (SNOW.isEmpty(currentApprovalStatus)) {
                            currentApprovalStatus = "";
                        }
                        currentApprovalStatus = currentApprovalStatus.toString();
                        okToEmail = Boolean(currentApprovalStatus == '2');
                        break;
                    case (enumRecordType == RECORD.Type.CREDIT_MEMO):
                        okToEmail = true;
                        break;
                    default:
                        okToEmail = false;
                }

                if (okToEmail) { //Email to Customer
                    log.audit("start sending email");
                    if (SNOW.isEmpty(fileIdToEmail)) {
                        var rtnValAttached = doAttachTransaction(itemInternalId, enumRecordType, itemFileName, itemAttachContent, destinationFolderId);
                        if (SNOW.isEmpty(rtnValAttached.fileid)) {
                            throw new Error('Unable to Email - File Not Attached to Transaction ' + itemInternalId);
                        }
                    } else {
                        var rtnValAttached = {
                            fileid: fileIdToEmail
                        };
                    }

                    var emailAddrTo = []; var toAddr = customerRecord.getValue({ fieldId: 'custentity_sti_to_invoice_emails' });
                    var emailAddrCc = []; var ccAddr = customerRecord.getValue({ fieldId: 'custentity_sti_cc_invoice_emails' });
                    var emailAddrBcc = []; var bccAddr = customerRecord.getValue({ fieldId: 'custentity_sti_bcc_invoice_emails' });

                    if (!SNOW.isEmpty(toAddr)) {
                        emailAddrTo = toAddr.split(',');
                    }

                    if (!SNOW.isEmpty(ccAddr)) {
                        emailAddrCc = ccAddr.split(',');
                    }
                    if (!SNOW.isEmpty(bccAddr)) {
                        emailAddrBcc = bccAddr.split(',');
                    }
                    emailAddrBcc.push('SentinelAR@Sentinel.com');

                    var fileObj = FILE.load({
                        id: rtnValAttached.fileid
                    });
                    var emailInfoObj = {};
                    var mergeResult = RENDER.mergeEmail({
                        templateId: 3,
                        entity: {
                            type: 'employee',
                            id: emailSenderId
                        },
                        recipient: {
                            type: 'customer',
                            id: customerRecord.id
                        }
                    });

                    emailInfoObj = {
                        author: emailSenderId,
                        subject: fileObj.name + ' Invoice from Sentinel Technologies, Inc.',
                        recipients: emailAddrTo,
                        cc: emailAddrCc,
                        bcc: emailAddrBcc,
                        relatedRecords: {
                            entityId: customerRecord.id,
                            tranid: transactionRecord.id
                        }
                    }

                    //Check file Size for Emailing Eligibility
                    if (fileObj.size < 10000000) {  //* Send Attachment
                        emailInfoObj.body = "Attached is " + fileObj.name + " from Sentinel Technologies, Inc.";
                        emailInfoObj.body = emailInfoObj.body + '<br>' + '<br>';

                        if (!SNOW.isEmpty(invoiceMessageToCustomer)) {
                            var currentInvoiceType = transactionRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
                            if (currentInvoiceType == invoiceMessageToCustomerType) {
                                emailInfoObj.body = emailInfoObj.body + '<b>';
                                //emailInfoObj.body = emailInfoObj.body + '\n' + '\n' + '\n';
                                //emailInfoObj.body = emailInfoObj.body + '<br>' + '<br>' + '<br>';
                                //emailInfoObj.body = emailInfoObj.body + '\n';
                                //emailInfoObj.body = emailInfoObj.body + '\n';
                                emailInfoObj.body = emailInfoObj.body + invoiceMessageToCustomer;
                                emailInfoObj.body = emailInfoObj.body + '</b>';
                                emailInfoObj.body = emailInfoObj.body + '<br>' + '<br>';
                            }
                        }

                        //emailInfoObj.body = emailInfoObj.body + '<br>';
                        //emailInfoObj.body = emailInfoObj.body + '<b>';
                        //emailInfoObj.body = emailInfoObj.body + 'Attached is your monthly Managed Services invoicing.  You may notice the formatting of your invoice is slightly different. We recently implemented NetSuite to improve our business operations and this format is a result of this change. You may continue to notice minor formatting enhancements as we continue to refine. We appreciate your patience during this transition.';
                        //emailInfoObj.body = emailInfoObj.body + '</b>';
                        emailInfoObj.attachments = [fileObj];
                    } else {                  //* Send Link
                        emailInfoObj.body = "Below is the link to " + fileObj.name + " from Sentinel Technologies, Inc.";
                        emailInfoObj.body = emailInfoObj.body + '\n';
                        emailInfoObj.body = emailInfoObj.body + '\n';
                        emailInfoObj.body = emailInfoObj.body + "https://" + appUrl + fileObj.url;
                    }
                    emailInfoObj.body = emailInfoObj.body + '\n' + '\n' + '\n' + mergeResult.body;
                    EMAIL.send(emailInfoObj);

                    if (enumRecordType == RECORD.Type.INVOICE || enumRecordType == RECORD.Type.CREDIT_MEMO) {
                        try {
                            RECORD.submitFields({
                                type: enumRecordType,
                                id: itemInternalId,
                                values: {
                                    custbody_sti_trans_emailed_to_cust: new Date()
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        } catch (err) {
                            log.error('Unable to update the Emailed Date', err.toString());
                        }
                    }
                    log.audit("done sending email");
                    var rtnVal = {
                        success: true,
                    };
                } else {
                    throw new Error('Transaction not eligible for email ' + itemInternalId + '.  Check Record Type and Status');
                }
            } catch (err) {
                log.error('doEmailTransaction', err.toString());
                var rtnVal = {
                    success: false,
                    message: 'doEmailTransaction ' + err.message
                };
            }
            log.audit('end doEmailTransaction', JSON.stringify(rtnVal) + ' ' + itemInternalId + ' ' + enumRecordType + ' ' + itemFileName + ' ' + destinationFolderId);
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "doEmailTransaction");
            return rtnVal;
        }
        function doUpdateTransactionErrorMessage(itemInternalId, enumRecordType, errorMessage) {
            var fromTime = new Date();
            try {
                log.audit('start doUpdateTransactionErrorMessage', itemInternalId + ' ' + enumRecordType + ' ' + errorMessage);
                RECORD.submitFields({
                    type: enumRecordType,
                    id: itemInternalId,
                    values: {
                        custbody_sti_tax_errors: errorMessage,
                    }
                });
            } catch (err) {
                log.error('doUpdateTransactionErrorMessage', err.toString());
            }
            log.audit('end doUpdateTransactionErrorMessage', itemInternalId + ' ' + enumRecordType + ' ' + errorMessage);
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "doUpdateTransactionErrorMessage");
            return true;
        }
        function doPrintInvoices(listOfInvoices, searchJsonObj) {
            var fromTime = new Date();
            var scriptObj = RUNTIME.getCurrentScript();
            var invoicePrintArray = {};
            try {
                var invoiceDataArray = buildInvoiceDataArray(listOfInvoices, searchJsonObj);
                //Send Batch Invoice Data to .net for PDF Creation
                invoiceDataArray = JSON.parse(JSON.stringify(invoiceDataArray));
                var integrationObj = {
                    "Number": "01",
                    "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_generate_invoice_pdf2' }),
                    "base64EncodedString": 'Basic ZGV2X2ludGVncmF0aW9uX3NlcnZpY2VzX25ldHN1aXRlQHNlbnRpbmVsLmNvbTpIQE1NQkwjM3YzcmNsZWFy',
                    'base64EncodedString': 'Basic ZGV2X2ludGVncmF0aW9uX3NlcnZpY2VzX25ldHN1aXRlQHNlbnRpbmVsLmNvbTpIQE1NQkwjM3YzcmNsZWFy',
                    "fullJsonObj": invoiceDataArray
                };
                var fileId = STIUTIL.addLog('integrationObj.fullJsonObj', JSON.stringify(integrationObj.fullJsonObj));

                var testMode = false;
                if (testMode) {
                    wait_a_second(60);
                    var theFileObj = FILE.load({
                        id: 'SuiteScripts/ScriptLogs/testdata.txt'
                    });
                    var theRtnVal = theFileObj.getContents(); STIUTIL.addLog('theRtnVal', theRtnVal);
                    var integrationObjRtnVal = {};
                    integrationObj.Response = JSON.parse(theRtnVal);
                    integrationObjRtnVal.Response = JSON.stringify(JSON.parse(theRtnVal));
                } else {
                    var integrationObjRtnVal = callTheAPI(integrationObj);
                    integrationObjRtnVal = JSON.parse(JSON.stringify(integrationObjRtnVal));
                }

                var invoicePrintArray = integrationObjRtnVal.Response;
                invoicePrintArray = JSON.parse(invoicePrintArray);
            } catch (err) {
                log.error('Error doPrintInvoices', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "doPrintInvoices");
            return invoicePrintArray;
        }
        function addPDF(obj, destinationFolderId) {
            var fromTime = new Date();
            var retVal;
            try {
                var fileObj = FILE.create({
                    name: obj.name,
                    fileType: FILE.Type.PDF,
                    contents: obj.content,
                    folder: destinationFolderId,
                    isOnline: true,
                    conflictResolution: FILE.NameConflictResolution.OVERWRITE
                });

                // Save the file
                var fileId = fileObj.save();

                if (fileId) {
                    retVal = fileId;
                }
            } catch (err) {
                log.error("Error sti_process_invoice_module creating PDF file", err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "addPDF");
            return retVal;
        };
        function attachPDF(obj) {
            var fromTime = new Date();
            var retVal = {
                success: false
            };

            try {
                RECORD.attach({
                    record: {
                        type: 'file',
                        id: obj.fileid
                    },
                    to: {
                        type: obj.rectype,
                        id: obj.recid
                    }
                });

                retVal = {
                    success: true,
                };

            } catch (err) {
                log.error("Error sti_process_invoice_module attaching PDF", err.toString());
                retval = {
                    success: false,
                    message: "Error sti_process_invoice_module attaching PDF. " + err.toString()
                };
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "attachPDF");
            return retVal;
        };
        function getInvoiceSerials(invoiceRecord) {
            var fromTime = new Date();
            var rtnObj = {};
            try {
                var arrayItems = [];
                var arraySerials = [];
                var salesOrderId = invoiceRecord.getValue({ fieldId: 'createdfrom' });

                var serialNumberSearch = SEARCH.create({
                    "type": "customrecordserialnum",
                    "id": 'customsearch_temp_serial_search',
                    "filters": [
                        {
                            "name": "custrecordserialsales",
                            "operator": "anyof",
                            "values": [salesOrderId],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [
                        {
                            "name": "name",
                            "label": "Name",
                            "type": "text",
                            "sortdir": "ASC"
                        },
                        {
                            "name": "id",
                            "label": "ID",
                            "type": "integer",
                            "sortdir": "NONE"
                        },
                        {
                            "name": "internalid",
                            "join": "CUSTRECORDSERIALITEM",
                            "label": "Internal ID",
                            "type": "select",
                            "sortdir": "NONE"
                        }
                    ],
                    "settings": [],
                    "title": null,
                    "scriptId": "customsearch_sti_temp_search",
                    "isPublic": false
                });

                serialNumberSearch.run().each(function (result) {
                    try {
                        var jsonObjResult = JSON.parse(JSON.stringify(result));
                        var theVariableName = 'CUSTRECORDSERIALITEM.internalid';
                        var itemSerialNumber = jsonObjResult.values.name;
                        var arrayInternalIds = jsonObjResult.values[theVariableName];
                        if (arrayInternalIds.length >= 1) {
                            var itemInternalId = jsonObjResult.values[theVariableName][0].value;
                            if (!SNOW.isEmpty(itemInternalId) && !SNOW.isEmpty(itemSerialNumber)) {
                                itemInternalId = itemInternalId.toString();
                                itemSerialNumber = itemSerialNumber.toString();
                                var itemPos = arrayItems.indexOf(itemInternalId.toString());
                                if (itemPos < 0) {
                                    var arrayLength = arrayItems.push(itemInternalId);
                                    while (arrayLength > arraySerials.length) {
                                        arraySerials.push('');
                                    }
                                    itemPos = arrayLength - 1;
                                }
                                var arraySingleRow = arraySerials[itemPos].split('|');
                                if (arraySingleRow.indexOf(itemSerialNumber) < 0) {
                                    arraySingleRow.push(itemSerialNumber);
                                    arraySerials[itemPos] = arraySingleRow.join('|');
                                }
                            }
                        }
                    } catch (err) {
                        log.error('Error on serialNumberSearch.run()', err.toString());
                    }
                    return true;
                });
                var rtnObj = {
                    arrayItems: arrayItems,
                    arraySerials: arraySerials
                };
            } catch (err) {
                log.error('getInvoiceSerials', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "getInvoiceSerials");
            return rtnObj;
        }
        function wait_a_second(numberOfSeconds) {
            var milliseconds = numberOfSeconds * 1000;
            var date = new Date();
            date.setMilliseconds(date.getMilliseconds() + milliseconds);
            while (new Date() < date) {
            }
            return;
        }
        function getCustomerNumber(customerRecord) {
            var fromTime = new Date();
            try {
                var custNumInfo = customerRecord.getValue({ fieldId: 'entityid' });
                var customerNumber = custNumInfo.split(' ')[0];
            } catch (err) {
                log.error('Error sti_process_invoice_module getting customer', err.toString());
                customerNumber = '';
            }
            customerNumber = customerNumber.replace(/\D/g, "");
            customerNumber = 'CUS' + customerNumber;
            customerNumber = customerNumber.toString();
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "getCustomerNumber");
            return customerNumber;
        }
        function numberStrToCurrency(sndVal) {
            var fromTime = new Date();
            var rtnVal = "";
            if (SNOW.isEmpty(sndVal)) {
                rtnVal = '$0.00';
            } else {
                var strArray = sndVal.toString().split('.');
                if (strArray.length == 1) {
                    strArray.push('');
                };
                strArray[1] = strArray[1] + '00';

                var theChar;
                var charLoop;
                var newStr = "";
                var addedCnt = 0;
                for (charLoop = strArray[0].length - 1; charLoop > 0; charLoop--) {
                    theChar = strArray[0][charLoop];
                    newStr = theChar + newStr;
                    addedCnt++;
                    if (addedCnt == 3) {
                        newStr = ',' + newStr;
                        addedCnt = 0;
                    }
                };
                rtnVal = '$' + strArray[0][0] + newStr + '.' + strArray[1].substring(0, 2);
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "numberStrToCurrency");
            return rtnVal;
        }
        function searchForOtherAttachment(theOtherAttachmentName) {
            var fromTime = new Date();
            try {
                var theFileContents = '';
                var fileSearch = SEARCH.create({
                    "type": "folder",
                    "id": 'customsearch_sti_other_attach_search',
                    "filters": [
                        {
                            "name": "internalid",
                            "operator": "anyof",
                            "values": ["1622"],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        },
                        {
                            "name": "name",
                            "join": "file",
                            "operator": "is",
                            "values": [theOtherAttachmentName],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [
                        {
                            "name": "internalid",
                            "join": "file",
                            "label": "Internal ID",
                            "type": "select",
                            "sortdir": "NONE"
                        }
                    ],
                    "settings": [],
                    "title": null,
                    "scriptId": 'customsearch_sti_other_attach_search',
                    "isPublic": false
                });
                var fileSearchResults = fileSearch.run().getRange({
                    start: 0,
                    end: 1000
                });

                var foundTheFile = false;
                var fileInternalFieldName = 'file.internalid'
                for (var fileLoop = 0; fileLoop < fileSearchResults.length && !foundTheFile; fileLoop++) {
                    try {
                        var theJsonObj = JSON.parse(JSON.stringify(fileSearchResults[fileLoop]));
                        var theValues = theJsonObj.values;
                        var theFileId = theValues[fileInternalFieldName][0].value;

                        var theFileObj = FILE.load({
                            id: theFileId
                        });
                        var theFileContents = theFileObj.getContents();
                        foundTheFile = true;
                    } catch (err) {
                        log.error(fileLoop + ' Error - searchForOtherAttachment', err.toString());
                    }
                }
            } catch (err) {
                log.error('Error - searchForOtherAttachment', err.toString());
            }
            var thruTime = new Date(); doShowElapTime(fromTime, thruTime, "searchForOtherAttachment");
            return theFileContents;
        }
        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
        function doShowElapTime(fromTime, thruTime, processName) {
            var timeDiff = STIUTIL.calcTimeDiff(fromTime, thruTime);
            log.debug('Elap Time ' + processName, timeDiff);
        }
        return rtnObj;
    });
