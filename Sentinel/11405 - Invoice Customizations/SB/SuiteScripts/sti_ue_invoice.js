/**
 *
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @description User Events for Invoice
 *
 * Script Name: sti_ue_invoice.js
 *
 * Version History:
 * 
 * jcicat - 07.29.2024 - comment out Print button for Invoice.
 * jcicat - 10.01.2024 - Add logic in beforeLoad to set Invoice Type = SuiteBilling if Invoice is created from Billing Account
 * jcicat - 10.09.2024 - Review script and retain only the ff logic:
 *      BeforeLoad: 
 *          a. Do not allow editd if From Epicor = True
 *          b. Check if Already approved, and if already approved, show the Email button
 *      BeforeSubmit:
 *          a. If From Epicor = True, do not process
 *          b. Get Sales Order Data(PO #, Short Description and Long Description) from Created From
 *          c. Get Customer PO from Sales Order if present
 *          d. Assign customer PO if an Open PO is present for this customer
 *      AfterSubmit:
 *          a. If From Epicor = True, do not process
 *          b. If PO # has value, script to create Customer PO record. 
 *          c. Set value for the ff Customer PO fields
 *              - Name = PO#
 *              - Customer Number = Customer
 *              - Active = True
 *              - Invoice Numer = Invoice id
 *              - Applied Amount = Invoice Total
 * 
 */
define([
    'N/ui/serverWidget',
    'N/redirect',
    'N/ui/message',
    'N/record',
    'N/runtime',
    'N/https',
    'N/url',
    'SuiteScripts/STI_Lib/sti_integration_lib',
    'SuiteScripts/STI_Lib/sti_integration_module',
    'SuiteScripts/STI_Lib/sti_utility_module'
],
    /**
     * @param{serverWidget} serverWidget
     * @param{redirect} REDIRECT
     * @param{message} MESSAGE
     * @param{record} RECORD
     * @param{runtime} RUNTIME
     * @param {https} HTTPS
     * @param{url} URL
     * @param SNOW
     * @param STIN
     * @param STIUTIL
     */
    (serverWidget, REDIRECT, MESSAGE, RECORD, RUNTIME, HTTPS, URL, SNOW, STIN, STIUTIL) => {
        const beforeLoad = (scriptContext) => {
            try {
                var executionContext = RUNTIME.executionContext;
                log.debug('executionContext', executionContext);
                if (executionContext == 'SUITELET' || executionContext == 'MAPREDUCE' || executionContext == 'CSVIMPORT' || executionContext == 'WORKFLOW') {
                    return true;
                }
                /* if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.COPY){
                    let billingAccount = scriptContext.newRecord.getValue({fieldId: 'billingaccount'})
                    if(billingAccount != null && billingAccount != ""){
                        scriptContext.newRecord.setValue({
                            fieldId: 'custbody_sti_invoice_type',
                            value: 6
                        });
                    }
                }
                */

                var scriptObj = RUNTIME.getCurrentScript();

                var queryStringObj = scriptContext.request.parameters;
                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });
                
                /*
                //Remove Buttons
                scriptContext.form.removeButton('approve');
                //scriptContext.form.removeButton('print');
                scriptContext.form.removeButton('refund');
                scriptContext.form.removeButton('renewal');
                */

                var fromEpicor = STIUTIL.getBoolean(scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_from_epicor' }));
                if (fromEpicor) {
                    if (queryStringObj.e == 'T') {  //Do not allow edits if From Epicor
                        var invoiceRecordUrl = "https://" + appUrl;
                        invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + queryStringObj.id;
                        invoiceRecordUrl = invoiceRecordUrl + "&sro=T&ro=2";
                        REDIRECT.redirect({ url: invoiceRecordUrl });
                    }
                    return true;
                }

                /*
                //Check If Show Ready Only Message
                if (queryStringObj.sro == 'T') {
                    switch (true) {
                        case (queryStringObj.ro == '2'):
                            var readOnlyReason = 'Updates not allowed after invoice approval';
                            break;
                        case (queryStringObj.ro == '101'):
                            var readOnlyReason = 'Updates not allowed while status is To Be Invoiced';
                            break;
                        default:
                            var readOnlyReason = 'Updates not allowed due to security restraints';
                    }

                    scriptContext.form.addPageInitMessage({
                        title: "Read Only Mode",
                        message: readOnlyReason,
                        type: MESSAGE.Type.ERROR
                    });
                }
                */

                var theInvoiceId = scriptContext.newRecord.id;
                var theInvoiceNumber = scriptContext.newRecord.getValue({ fieldId: 'tranid' });
                var theApprovalStatus = scriptContext.newRecord.getValue({ fieldId: 'approvalstatus' });
                var theInvoiceStatus = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_invoice_status' });
                //var taxIssues = ''; //scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_tax_errors' });

                if (SNOW.isEmpty(theApprovalStatus)) {
                    theApprovalStatus = "";
                }
                theApprovalStatus = theApprovalStatus.toString();

                if (SNOW.isEmpty(theInvoiceStatus)) {
                    theInvoiceStatus = "";
                }
                theInvoiceStatus = theInvoiceStatus.toString();
                var theTbbStatus = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_tbb_box' });

                if (SNOW.isEmpty(theTbbStatus)) {
                    theTbbStatus = false;
                }
                theTbbStatus = Boolean(theTbbStatus.toString().toUpperCase() == 'TRUE');

                if (theApprovalStatus == '1' && !SNOW.isEmpty(theInvoiceId)) {  //Not Approved
                    for (var conditionLoop = 1; conditionLoop < 5; conditionLoop++) {
                        var theButtonId = ''; var theButtonName = ''; var theButtonLabel = '';
                        switch (true) {
                            /*
                            case (conditionLoop == 1):   //Already TBB so Read Only and Add Button to Remove TBB
                                if (theTbbStatus) {
                                    theButtonId = 'custpage_sti_invc_rmv_tbb'
                                    theButtonName = 'INVOICERMVTBB';
                                    theButtonLabel = 'Remove To Be Invoiced';

                                    if (queryStringObj.e == 'T') {  //Do not allow edits if TBB is flagged
                                        var invoiceRecordUrl = "https://" + appUrl;
                                        invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + queryStringObj.id;
                                        invoiceRecordUrl = invoiceRecordUrl + "&sro=T&ro=101";
                                        REDIRECT.redirect({ url: invoiceRecordUrl });
                                    }
                                }
                                break;
                            case (conditionLoop == 2):    //Not TBB so Add TBB Button
                                if (!theTbbStatus) {
                                    theButtonId = 'custpage_sti_invc_add_tbb'
                                    theButtonName = 'INVOICEADDTBB';
                                    theButtonLabel = 'To Be Invoiced';
                                }
                                break;
                          
                            case (conditionLoop == 3):
                                theButtonName = '';
                                theButtonLabel = '';
                                break;
                        
                            case (conditionLoop == 4):   //Add Print Button
                                theButtonId = 'custpage_sti_print_invoice'
                                theButtonName = 'SINGLEINVOICEPREVIEW';
                                theButtonLabel = 'Preview';
                                break;
                            */
                            default:
                                theButtonName = '';
                                theButtonLabel = '';
                        }
                        if (!SNOW.isEmpty(theButtonName) && !SNOW.isEmpty(theButtonLabel)) {
                            var urlParams = '&button_name=' + theButtonName;
                            urlParams = urlParams + '&invoicenumber=' + theInvoiceNumber;
                            urlParams = urlParams + '&invoiceid=' + theInvoiceId;

                            var theSuiteletUrl = URL.resolveScript({
                                scriptId: 'customscript_sti_button_event_suitelet',
                                deploymentId: 'customdeploy_sti_button_event_suitelet'
                            }) + urlParams;

                            scriptContext.form.addButton({
                                label: theButtonLabel,
                                id: theButtonId,
                                functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                            });
                        }
                    }
                } else {
                    //if (queryStringObj.e == 'T') {  //Do not allow edits if Approval Status is Approved
                    //    var invoiceRecordUrl = "https://" + appUrl;
                    //    invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + queryStringObj.id;
                    //    invoiceRecordUrl = invoiceRecordUrl + "&sro=T&ro=2";
                    //    REDIRECT.redirect({ url: invoiceRecordUrl });
                    //}
                    scriptContext.form.removeButton('reject');

                    for (var conditionLoop = 1; conditionLoop < 3; conditionLoop++) {
                        var theButtonId = ''; var theButtonName = ''; var theButtonLabel = '';
                        switch (true) {
                            case (conditionLoop == 1):   //Reprint
                                if (theApprovalStatus == '2') {  //Check if Already Approved Add Reprint
                                  //  theButtonId = 'custpage_sti_invc_reprint'
                                  //  theButtonName = 'SINGLEINVOICEREPRINT';
                                  //  theButtonLabel = 'Print';
                                }
                                break;
                            case (conditionLoop == 2):    //Email
                                if (theApprovalStatus == '2') {  //Check if Already Approved and If Already Attached
                                    var itemFileName = 'Invoice_' + theInvoiceNumber;
                                    var folderInvoicePDF = scriptObj.getParameter({ name: 'custscript_sti_invoice_pdf_folder' });
                                    var destinationFolderId = STIN.doGetTransactionFolderId(folderInvoicePDF, theInvoiceId, scriptContext.newRecord.type);
                                    var theExistingAttachmentFileId = STIN.doSearchFolderForFile(destinationFolderId, itemFileName);

                                    theButtonId = 'custpage_sti_invc_email'
                                    theButtonName = 'SINGLEINVOICEEMAIL';
                                    theButtonLabel = 'Email';
                                    //if (!SNOW.isEmpty(theExistingAttachmentFileId)) {
                                       
                                    //}
                                }
                                break;
                            default:
                                theButtonName = '';
                                theButtonLabel = '';
                        }
                        if (!SNOW.isEmpty(theButtonName) && !SNOW.isEmpty(theButtonLabel)) {
                            var urlParams = '&button_name=' + theButtonName;
                            urlParams = urlParams + '&invoicenumber=' + theInvoiceNumber;
                            urlParams = urlParams + '&invoiceid=' + theInvoiceId;

                            var theSuiteletUrl = URL.resolveScript({
                                scriptId: 'customscript_sti_button_event_suitelet',
                                deploymentId: 'customdeploy_sti_button_event_suitelet'
                            }) + urlParams;

                            scriptContext.form.addButton({
                                label: theButtonLabel,
                                id: theButtonId,
                                functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                            });
                        }
                    }
                }

                /*
                try {
                    var groupToCopy = scriptContext.newRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_sti_line_trans_invoice_group',
                        line: 0
                    });
                    if (!SNOW.isEmpty(groupToCopy)) {
                        var urlParams = '&button_name=ADDINVOICEGROUPS';      //Add Button to Copy Invoice Groups
                        urlParams = urlParams + '&invoiceid=' + theInvoiceId;

                        var theSuiteletUrl = URL.resolveScript({
                            scriptId: 'customscript_sti_button_event_suitelet',
                            deploymentId: 'customdeploy_sti_button_event_suitelet'
                        }) + urlParams;

                        scriptContext.form.addButton({
                            label: 'Add Invoice Groups',
                            id: 'custpage_add_invoice_groups',
                            functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                        });

                        var urlParams = '&button_name=REMOVEINVOICEGROUPS';      //Add Button to Remove Invoice Groups
                        urlParams = urlParams + '&invoiceid=' + theInvoiceId;

                        var theSuiteletUrl = URL.resolveScript({
                            scriptId: 'customscript_sti_button_event_suitelet',
                            deploymentId: 'customdeploy_sti_button_event_suitelet'
                        }) + urlParams;

                        scriptContext.form.addButton({
                            label: 'Remove Invoice Groups',
                            id: 'custpage_remove_invoice_groups',
                            functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                        });
                    }
                } catch (err) {
                    log.error('Unable to Add Invoice Group Buttons', err.toString());
                }
                */
            } catch (err) {
                log.error('Error on beforeLoad - sti_ue_invoice', err.toString());
            }
        }

        const beforeSubmit = (scriptContext) => {
            log.debug('in beforeSubmit', executionContext);
            try {
                var executionContext = RUNTIME.executionContext;
                if (executionContext == 'SUITELET' || executionContext == 'MAPREDUCE') {
                    return true;
                }
                var fromEpicor = STIUTIL.getBoolean(scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_from_epicor' }));
                if (fromEpicor) { return true; }

                var currentRecordType = scriptContext.newRecord.type.toString();
                //scriptContext.newRecord = setInvoiceStatus(scriptContext.newRecord);
                try {
                    //Get Sales Order Data
                    var soNumber = scriptContext.newRecord.getValue({ fieldId: "createdfrom" });
                    var soCustomerPo = "";
                    var soShortDescription = "";
                    var soLongDescription = "";
                    if (!SNOW.isEmpty(soNumber)) {
                        soNumber = soNumber.toString();
                        try {
                            var salesOrderRecord = RECORD.load({
                                type: RECORD.Type.SALES_ORDER,
                                id: soNumber,
                                isDynamic: false
                            });
                            soCustomerPo = salesOrderRecord.getValue({ fieldId: 'otherrefnum' });
                            soShortDescription = salesOrderRecord.getValue({ fieldId: 'custbody_ctc_u_short_description' });
                            if (!SNOW.isEmpty(soShortDescription)) {
                                soShortDescription = soShortDescription.toString();
                                RECORD.submitFields({
                                    id: scriptContext.newRecord.id,
                                    type: RECORD.Type.INVOICE,
                                    values: { 'custbody_ctc_u_short_description': soShortDescription }
                                });
                            }
                            soLongDescription = salesOrderRecord.getValue({ fieldId: 'custbody_sti_so_description' });
                            if (!SNOW.isEmpty(soLongDescription)) {
                                soLongDescription = soLongDescription.toString();
                                RECORD.submitFields({
                                    id: scriptContext.newRecord.id,
                                    type: RECORD.Type.INVOICE,
                                    values: { 'custbody_sti_so_description': soLongDescription }
                                });
                            }
                        } catch (err) {
                            log.error("Error reading sales order " + soNumber, err.toString());
                        }
                    }

                    var calcTaxes = false;
                    var commitFlag = false;
                    var updateType = scriptContext.type.toString();

                    if (updateType != "xedit") {
                        if (currentRecordType == "invoice") {
                            //Set Invoice Type if not already set
                            var invoiceType = scriptContext.newRecord.getValue({ fieldId: "custbody_sti_invoice_type" });
                            if (SNOW.isEmpty(invoiceType)) {
                                log.debug("Empty invoice type", invoiceType);
                                var ticketNumber = scriptContext.newRecord.getValue({ fieldId: "custbody_sti_service_ticket" });
                                var custbody_ctc_col_id = scriptContext.newRecord.getValue({ fieldId: "custbody_ctc_col_id" });
                                var projectNumber = scriptContext.newRecord.getValue({ fieldId: "custbody_project" });
                                var billingAccount = scriptContext.newRecord.getValue({ fieldId: "billingaccount" });

                                switch (true) {
                                    case (!SNOW.isEmpty(custbody_ctc_col_id)): //Channel Online
                                        invoiceType = '1';
                                        break;
                                    case (!SNOW.isEmpty(projectNumber)):
                                        invoiceType = 'Projects';
                                        invoiceType = '2';
                                        break;
                                    case (true === false): //Retainer
                                        invoiceType = '3';
                                        break;
                                    case (!SNOW.isEmpty(ticketNumber)):
                                        invoiceType = 'Service Tickets';
                                        invoiceType = '5'
                                        break;

                                    case (!SNOW.isEmpty(billingAccount)):
                                        invoiceType = 'SuiteBilling';
                                        invoiceType = '6';
                                        break;
                                    default:
                                        invoiceType = 'Other Sales Orders';
                                        invoiceType = '4';
                                }

                                scriptContext.newRecord.setValue({
                                    fieldId: 'custbody_sti_invoice_type',
                                    value: invoiceType,
                                    ignoreFieldChange: true
                                });
                            }

                            //Check if Need to Copy Address_Book to ShipAddress
                            var firstAddress = scriptContext.newRecord.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ns_address_book',
                                line: 0
                            });
                            if (!SNOW.isEmpty(firstAddress)) {
                                scriptContext.newRecord.setValue({
                                    fieldId: 'ismultishipto',
                                    value: true
                                });
                                //log.debug('heading to    copyAddressBookToShipAddress');
                                scriptContext.newRecord = STIN.copyAddressBookToShipAddress(scriptContext.newRecord);  //Check if Need to Populate Ship-To on Line Items
                                //log.debug('returned from copyAddressBookToShipAddress');
                            }

                            //Get Customer PO from Sales Order if present
                            if (!SNOW.isEmpty(soCustomerPo)) {
                                soCustomerPo = soCustomerPo.toString();
                                scriptContext.newRecord.setValue({
                                    fieldId: 'otherrefnum',
                                    value: soCustomerPo
                                });
                            }

                            //Assign customer PO if an Open PO is present for this customer
                            var customerPo = scriptContext.newRecord.getValue({ fieldId: 'otherrefnum' });
                            if (SNOW.isEmpty(customerPo)) {
                                var theEntityId = scriptContext.newRecord.getValue({ fieldId: 'entity' });
                                var theTranDate = scriptContext.newRecord.getValue({ fieldId: 'trandate' });
                                customerPo = STIN.getCustOpenPO(theEntityId, theTranDate, invoiceType);
                                if (!SNOW.isEmpty(customerPo)) {
                                    scriptContext.newRecord.setValue({
                                        fieldId: 'otherrefnum',
                                        value: customerPo
                                    });
                                }
                            }

                            //var oldApprovalStatus;
                            //if (SNOW.isEmpty(scriptContext.oldRecord)) {
                            //    oldApprovalStatus = "";
                            //} else {
                            //    oldApprovalStatus = scriptContext.oldRecord.getValue({ fieldId: "approvalstatus" });
                            //}
                            //if (SNOW.isEmpty(oldApprovalStatus)) {
                            //    oldApprovalStatus = "";
                            //}
                            //oldApprovalStatus = oldApprovalStatus.toString();

                            //var newApprovalStatus = scriptContext.newRecord.getValue({ fieldId: "approvalstatus" })
                            //if (SNOW.isEmpty(newApprovalStatus)) {
                            //    newApprovalStatus = "";
                            //}
                            //newApprovalStatus = newApprovalStatus.toString();

                            //switch (true) {
                            //    case (executionContext == 'MAPREDUCE'): //From Map Reduce
                            //        calcTaxes = false;
                            //        commitFlag = false;
                            //        break;
                            //    case (newApprovalStatus == '1'): //Pending Approval
                            //        calcTaxes = true;
                            //        commitFlag = false;
                            //        break;
                            //    case (newApprovalStatus == '2' && oldApprovalStatus != '2'):  //Newly Approved
                            //        calcTaxes = true;
                            //        commitFlag = true;
                            //        break;
                            //    case (newApprovalStatus == '2' && oldApprovalStatus == '2'):  //Previously Approved
                            //        calcTaxes = false;
                            //        commitFlag = false;
                            //        break;
                            //    default:
                            //        calcTaxes = true;
                            //        commitFlag = false;
                            //}
                        }

                        //if (calcTaxes) {
                        //    log.debug("got here in calcTaxes", "10");
                        //    log.debug('old script record', JSON.stringify(scriptContext.newRecord));

                        //    //Remove Previous Tax Errors
                        //    scriptContext.newRecord.setValue({
                        //        fieldId: 'custbody_sti_tax_errors',
                        //        value: '',
                        //        ignoreFieldChange: true
                        //    });
                        //    log.audit('Calculating Taxes for ' + scriptContext.newRecord.getValue({ fieldId: 'tranid' }), executionContext + ' Commit Flag ' + commitFlag);
                        //    var newRecordUpdated = STIN.getAvalaraTaxData(scriptContext.newRecord, commitFlag);
                        //    log.debug('newRecordUpdated', JSON.stringify(newRecordUpdated));
                        //    scriptContext.newRecord = newRecordUpdated;
                        //} else {
                        //    log.audit('NOT Calculating Taxes for ' + scriptContext.newRecord.getValue({ fieldId: 'tranid' }), executionContext + ' Commit Flag ' + commitFlag);
                        //}

                        ////Copy Tax Total Field
                        //var invoiceTaxtotal = scriptContext.newRecord.getValue({ fieldId: 'taxtotal' });
                        //scriptContext.newRecord.setValue({
                        //    fieldId: 'custbody_sti_tax_total',
                        //    value: invoiceTaxtotal
                        //});
                        scriptContext.newRecord = STIN.addDefaultInvoiceGroups(scriptContext.newRecord);
                    }
                } catch (err) {
                    log.error('Error in beforeSubmit', err.toString());
                }
            } catch (err) {
                log.error('Error on beforeSubmit - sti_ue_invoice', err.toString());
            }
        }
        const afterSubmit = (scriptContext) => {
            try {
                var fromEpicor = STIUTIL.getBoolean(scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_from_epicor' }));
                if (fromEpicor) { return true; }

                var invoiceRecord = RECORD.load({
                    type: RECORD.Type.INVOICE,
                    id: scriptContext.newRecord.id,
                    isDynamic: false
                });
                var savedAlready = invoiceRecord.getValue({ fieldId: 'custbody_sti_record_saved' });
                log.debug('savedAlready', savedAlready);
                if (SNOW.isEmpty(savedAlready)) {
                    savedAlready = false;
                }
                savedAlready = Boolean(savedAlready == true);
                //log.debug('savedAlready', savedAlready);
                if (!savedAlready) {
                    log.debug('saving again');
                    invoiceRecord.setValue({
                        fieldId: 'custbody_sti_record_saved',
                        value: true
                    });
                    invoiceRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }
            } catch (err) {
                log.error('Error on savedAlready logic', err.toString());
            }
            try {
                var custbody_sti_record_saved = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_record_saved' });
                log.debug('before custbody_sti_record_saved', custbody_sti_record_saved);
                var invoiceRecord = checkForFirstTimeSave(scriptContext.newRecord.id); scriptContext.newRecord = invoiceRecord;
                var custbody_sti_record_saved = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_record_saved' });
                log.debug('after  custbody_sti_record_saved', custbody_sti_record_saved);

                var executionContext = RUNTIME.executionContext;
                if (executionContext == 'SUITELET' || executionContext == 'MAPREDUCE') {
                    return true;
                }
                var currentRecordType = scriptContext.newRecord.type.toString();

                if (currentRecordType == 'invoice') {
                    if (!SNOW.isEmpty(scriptContext.newRecord) && !SNOW.isEmpty(scriptContext.oldRecord)) {
                        var currApprovalStatus = scriptContext.newRecord.getValue({ fieldId: "approvalstatus" });
                        var prevApprovalStatus = scriptContext.oldRecord.getValue({ fieldId: "approvalstatus" });
                        if (SNOW.isEmpty(currApprovalStatus)) {
                            currApprovalStatus = "";
                        }
                        if (SNOW.isEmpty(prevApprovalStatus)) {
                            prevApprovalStatus = "";
                        }
                        currApprovalStatus = currApprovalStatus.toString();
                        prevApprovalStatus = prevApprovalStatus.toString();

                        if (currApprovalStatus == "2" && prevApprovalStatus != "2") {
                            var ticketNumber = scriptContext.newRecord.getValue({ fieldId: "custbody_sti_service_ticket" });
                            if (!SNOW.isEmpty(ticketNumber)) {
                                var sendInvoiceNumberResult = sendInvoiceNumber(scriptContext, ticketNumber);
                            }

                            var customerPO = scriptContext.newRecord.getValue({
                                fieldId: 'otherrefnum'
                            });
                            if (!SNOW.isEmpty(customerPO)) {
                                var poRecord = RECORD.create({
                                    type: 'customrecord_sti_cust_purchase_orders',
                                    isDynamic: false
                                });
                                poRecord.setValue({
                                    fieldId: 'name',
                                    value: customerPO
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_customer_number',
                                    value: scriptContext.newRecord.getValue({ fieldId: 'entity' })
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_active',
                                    value: true
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_invoice_number',
                                    value: scriptContext.newRecord.id
                                });
                                poRecord.setValue({
                                    fieldId: 'custrecord_sti_po_applied_amount',
                                    value: scriptContext.newRecord.getValue({ fieldId: 'total' })
                                });
                                var poRecordId = poRecord.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                log.error('Error on afterSubmit - sti_ue_invoice', err.toString());
            }
            log.audit('Done with afterSubmit for ' + scriptContext.newRecord.getValue({ fieldId: 'tranid' }), executionContext);
        }
        /*
        function setInvoiceStatus(invoiceRecord) {
            var currentApprovalStatus = invoiceRecord.getValue({ fieldId: 'approvalstatus' });
            var currentTBBStatus = invoiceRecord.getValue({ fieldId: 'custbody_sti_tbb_box' });
            var newInvoiceStatus = '';
            log.debug('setting ', newInvoiceStatus);
            log.debug('currentApprovalStatus', currentApprovalStatus);
            log.debug('currentTBBStatus', currentTBBStatus);
            if (currentApprovalStatus == '2') {
                newInvoiceStatus = 3;      //Invoiced
            } else {
                if (SNOW.isEmpty(currentTBBStatus)) {
                    currentTBBStatus = false;
                }
                currentTBBStatus = Boolean(currentTBBStatus.toString().toUpperCase() == 'TRUE');
                if (currentTBBStatus) {
                    newInvoiceStatus = 2;  //TBB
                } else {
                    newInvoiceStatus = 1;  //Preview
                }
            }
            if (!SNOW.isEmpty(newInvoiceStatus)) {
                invoiceRecord.setValue({
                    fieldId: 'custbody_sti_invoice_status',
                    value: newInvoiceStatus,
                });
            }
            log.debug('set ', newInvoiceStatus);
            log.debug('newInvoiceStatus', newInvoiceStatus);
            return invoiceRecord;
        }
        */
        function checkForFirstTimeSave(invoiceInternalId) {
            try {
                var invoiceRecord = RECORD.load({
                    type: RECORD.Type.INVOICE,
                    id: invoiceInternalId,
                    isDynamic: false
                });
                var custbody_sti_record_saved = invoiceRecord.getValue({ fieldId: 'custbody_sti_record_saved' });
                if (SNOW.isEmpty(custbody_sti_record_saved)) {
                    custbody_sti_record_saved = 'False';
                }
                custbody_sti_record_saved = custbody_sti_record_saved.toString().toUpperCase();
                var theBooleanValue = (custbody_sti_record_saved == 'TRUE')
                log.debug('theBooleanValue', theBooleanValue);
                if (theBooleanValue != true) {
                    invoiceRecord.setValue({
                        fieldId: 'custbody_sti_record_saved',
                        value: true,
                        ignoreFieldChange: false
                    });
                    invoiceRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    log.debug('finished saving');
                }
                return invoiceRecord;
            } catch (err) {
                log.error('Error - Unable to check for first time save', err.toString());
                return 'ERROR';
            }
        }
        const sendInvoiceNumber = (scriptContext, ticketNumber) => {
            try {
                const scriptObj = RUNTIME.getCurrentScript();
                var integrationObj = {
                    "Number": "02",
                    "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_case_invc_to_sn' }),
                    "base64EncodedString": "Basic U1RJX05ldFN1aXRlX0ludGVncmF0aW9uX0FQSTppUUEzKXc5OTVHQWppcUxdYjROUGhofShOV3dO",
                    "fullJsonObj": {
                        "caseNumber": ticketNumber,
                        "invoiceNumber": scriptContext.newRecord.getValue({ fieldId: "tranid" })
                    }
                };
                var strMessage = callTheAPI(integrationObj);
            } catch (err) {
                log.error('Error in sendInvoiceNumber', err.toString());
            }
        };
        const callTheAPI = (integrationObj) => {
            let currentNumber = integrationObj.Number;
            let apiToCall = integrationObj.apiToCall;
            let base64EncodedString = integrationObj.base64EncodedString;
            let fullJsonObj = integrationObj.fullJsonObj;

            let reqObj = {
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
            let response = HTTPS.post({
                url: reqObj.url,
                body: JSON.stringify(fullJsonObj),
                headers: reqObj.headers
            });

            reqObj.response = response.body;
            reqObj.code = response.code;
            //reqObj.payload = JSON.stringify(reqObj.payload);

            let strMessage;
            strMessage = {
                "Endpoint": reqObj.url,
                "Payload": fullJsonObj,
                "HTTP_Code": reqObj.code,
                "Response": reqObj.response
            };
            //log.debug(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
            return strMessage;
        }
        return { beforeLoad, beforeSubmit, afterSubmit }
    });