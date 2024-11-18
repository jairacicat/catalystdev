/**
* @NApiVersion 2.x
* @NScriptType Suitelet
* @NModuleScope Public
* Script Name: sti_button_event_suitelet.js
*/
define([
    'N/ui/serverWidget',
    'N/redirect',
    'N/task',
    'N/record',
    'N/runtime',
    'N/search',
    'N/url',
    'SuiteScripts/STI_Lib/sti_integration_lib',
    'SuiteScripts/STI_Lib/sti_integration_module',
    'SuiteScripts/STI_Lib/sti_process_invoice_module',
    'SuiteScripts/STI_Lib/sti_utility_module'
],
    /**
     * @param{serverWidget} serverWidget
     * @param{redirect} REDIRECT
     * @param{task} TASK
     * @param{record} RECORD
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param{url} URL
     * @param SNOW
     * @param STIN
     * @param STINVC
     * @param STIUTIL
     */
    function (serverWidget, REDIRECT, TASK, RECORD, RUNTIME, SEARCH, URL, SNOW, STIN, STINVC, STIUTIL) {
        function doButtonEvent(context) {
            log.debug('got here 01', JSON.stringify(context));
            try {
                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });

                var buttonName = context.request.parameters.button_name;
                if (SNOW.isEmpty(buttonName)) {
                    buttonName = "";
                }
                buttonName = buttonName.toString().trim().toUpperCase();

                switch (true) {
                    case (buttonName == 'FSDYSHSGO'): //Create ScopeStack Project
                        doCreateScopeStackProject(context, appUrl);
                        break;
                    case (buttonName == 'IAQVCBNPW'): //Transform Opportunity to Sales Order
                        doTransformOpportunity(context, appUrl);
                        break;
                    case (buttonName == 'GVUNLWGHX'): //Update Fulfillable Items
                        doUpdateFulfillableItems(context, appUrl);
                        break;
                    case (buttonName == 'SINGLEINVOICEPREVIEW'): //Single Invoice Preview
                        doSingleInvoicePreview(context, appUrl);
                        break;
                    case (buttonName == 'SINGLEINVOICEREPRINT'): //Single Invoice Reprint
                        doSingleInvoiceReprint(context, appUrl);
                        break;
                    case (buttonName == 'SINGLEINVOICEEMAIL'): //Single Invoice Email
                        doSingleInvoiceEmail(context, appUrl);
                        break;
                    case (buttonName == 'INVOICEREPRINT'): //Reprint Invoice
                        doInvoiceReprint(context, appUrl);
                        break;
                    case (buttonName == 'RELOADINVOICEBATCH'): //Reload Invoice Batch Screen
                        doReloadInvoiceBatch(context, appUrl);
                        break;
                    case (buttonName == 'RESETINVOICEBATCH'): //Reset Invoice Batch Screen
                        doResetInvoiceBatch(context, appUrl);
                        break;
                    case (buttonName == 'STARTINVOICEBATCH'): //Start Invoice Batch Processing
                        doStartInvoiceBatch(context, appUrl);
                        break;
                    case (buttonName == 'ADDINVOICEGROUPS'): //Copy Invoice Groups from Previous One
                        doAddInvoiceGroups(context, appUrl);
                        break;
                    case (buttonName == 'REMOVEINVOICEGROUPS'): //Copy Invoice Groups from Previous One
                        doRemoveInvoiceGroups(context, appUrl);
                        break;
                    case (buttonName == 'SINGLEPRINTPROFORMA'): //Single Print Pro Forma
                        doSinglePrintProForma(context, appUrl);
                        break;
                    case (buttonName == 'INVOICEADDTBB'): //Add TBB Flag
                        doUpdateInvoiceTBB(context, appUrl, '2', true);
                        break;
                    case (buttonName == 'INVOICERMVTBB'): //Remove TBB Flag
                        doUpdateInvoiceTBB(context, appUrl, '1', false);
                        break;
                    case (buttonName == 'INVOICEPRINTEMAILSTORE'): //Invoice Email, Print and Store
                        doPrintEmailStoreSingleInvoice(context, appUrl);
                        break;
                    case (buttonName == 'INVOICESINGLEPREVIEW'): //Invoice Single Preview
                        doPreviewSingleInvoice(context, appUrl);
                        break;
                    default:
                        log.error('No action taken', buttonName + ' not defined');
                        return;
                }
            } catch (err) {
                log.error('Error in doButtonEvent', err.toString());
            }
        }
        function doCreateScopeStackProject(context, appUrl) {
            var opportunityId = '';
            try {
                var opportunityId = context.request.parameters.opportunityid;
                var opportunityRecord;
                opportunityRecord = RECORD.load({
                    type: RECORD.Type.OPPORTUNITY,
                    id: opportunityId,
                    isDynamic: false
                });
                var tranid = opportunityRecord.getValue({ fieldId: 'tranid' });
                var title = opportunityRecord.getValue({ fieldId: 'title' });
                var entityId = opportunityRecord.getValue({ fieldId: 'entity' });
                var salesrep = opportunityRecord.getText({ fieldId: 'salesrep' });
                var primarysa = opportunityRecord.getText({ fieldId: 'custbody_sti_primary_sa' });

                var customerRecord = RECORD.load({
                    type: RECORD.Type.CUSTOMER,
                    id: entityId,
                    isDynamic: false
                });
                var entityName = customerRecord.getValue({ fieldId: 'companyname' });

                var entityScopeStack = STIN.doGetScopeStackId('clients', entityName);
                var salesrepScopeStack = STIN.doGetScopeStackId('sales-executives', salesrep);
                var primarysaScopeStack = STIN.doGetScopeStackId('presales-engineers', primarysa);

                var jsonObjScopeStack = {
                    "data": {
                        "type": "projects",
                        "attributes": {
                            "project-name": tranid + ' - ' + title
                        },
                        "relationships": {
                            "client": {
                                "data": {
                                    "id": entityScopeStack,
                                    "type": "clients"
                                },
                            },
                            "sales-executive": {
                                "data": {
                                    "id": salesrepScopeStack,
                                    "type": "sales-executives"
                                },
                            },
                            "presales-engineer": {
                                "data": {
                                    "id": primarysaScopeStack,
                                    "type": "presales-engineers"
                                }
                            }
                        }
                    }
                };
                var integrationObj = {
                    Number: '01',
                    apiToCall: 'https://api.scopestack.io/sentinel/v1/projects',
                    fullJsonObj: jsonObjScopeStack
                };
                var integrationRtnVal = STIN.doPostScopeStack(integrationObj);
                log.debug('integrationRtnVal', JSON.stringify(integrationRtnVal));
                STIUTIL.addLog('integrationRtnVal', JSON.stringify(integrationRtnVal));

                //Update Link to ScopeStack Record
                var jsonObjRtnVal = JSON.parse(JSON.stringify(integrationRtnVal)); log.debug('jsonObjRtnVal', JSON.stringify(jsonObjRtnVal));
                var jsonObjResponse = JSON.parse(JSON.stringify(JSON.parse(jsonObjRtnVal.Response))); STIUTIL.addLog('jsonObjResponse', JSON.stringify(jsonObjResponse));
                var linkToScopeStack = jsonObjResponse.data.links.self; log.debug('linkToScopeStack', linkToScopeStack);
                if (!SNOW.isEmpty(linkToScopeStack)) {
                    opportunityRecord.setValue({
                        fieldId: 'custbody_sti_link_to_scope_stack_rec',
                        value: linkToScopeStack
                    });
                    opportunityRecord.save();
                }

                var opportunityRecordUrl = "https://" + appUrl;
                if (SNOW.isEmpty(opportunityId)) {
                    opportunityRecordUrl = opportunityRecordUrl + "/app/accounting/transactions/opprtntylist.nl";
                } else {
                    opportunityRecordUrl = opportunityRecordUrl + "/app/accounting/transactions/opprtnty.nl?id=" + opportunityId;
                }
                var newRecordUrl = opportunityRecordUrl;
                REDIRECT.redirect({ url: newRecordUrl });
            } catch (err) {
                log.error('Error - doCreateScopeStackProject', err.toString());
            }
            return;
        }
        function doTransformOpportunity(context, appUrl) {
            var opportunityId = '';
            try {
                var opportunityId = context.request.parameters.opportunityid;
                var taskObjInfo = {};
                taskObjInfo.scriptId = 'customscript_sti_transform_opp_to_so';
                taskObjInfo.deployId = 'customdeploy_sti_transform_opp_to_so';
                taskObjInfo.opportunityid = opportunityId;
                var mapReduceTaskId = STIN.doStartMapReduce(taskObjInfo);
                var opportunityRecordUrl = "https://" + appUrl;
                if (SNOW.isEmpty(opportunityId)) {
                    opportunityRecordUrl = opportunityRecordUrl + "/app/accounting/transactions/opprtntylist.nl";
                } else {
                    opportunityRecordUrl = opportunityRecordUrl + "/app/accounting/transactions/opprtnty.nl?id=" + opportunityId;
                }
                var newRecordUrl = opportunityRecordUrl;
                REDIRECT.redirect({ url: newRecordUrl });
            } catch (err) {
                log.error('Error - doTransformOpportunity', err.toString());
            }
            return;
        }
        function doUpdateFulfillableItems(context, appUrl) {
            var form = serverWidget.createForm({ title: 'Make Items Fulfillable or Non-Fulfullable', hideNavBar: false });
            try {
                var scriptObj = RUNTIME.getCurrentScript();
                var justSkipIt = Boolean(context.request.parameters.skip == 'T');
                var makeTrueOrFalse = Boolean(context.request.parameters.fulfillable == 'T');

                if (justSkipIt) {
                    var arrayItems = [];
                } else {
                    var arrayItems = scriptObj.getParameter({ name: 'custscript_sti_fulfillable_items' }).split(',');
                }

                for (var itemLoop = 0; itemLoop < arrayItems.length; itemLoop++) {
                    try {
                        var enumRecordType;
                        var arrayItemAndType = arrayItems[itemLoop].split('-');
                        var itemId = arrayItemAndType[0]; log.debug(itemLoop + ' itemId', itemId);

                        if (arrayItemAndType.length >= 2) {
                            var recordType = arrayItemAndType[1].toUpperCase();
                            log.debug('recordType', recordType);
                        } else {
                            var recordType = '';
                        }

                        switch (recordType) {
                            case ("SHIP"):
                                enumRecordType = RECORD.Type.SHIP_ITEM;
                                break;
                            case ("INVENTORY"):
                                enumRecordType = RECORD.Type.INVENTORY_ITEM;
                                break;
                            case ("LOT_NUMBERED_INVENTORY"):
                                enumRecordType = RECORD.Type.LOT_NUMBERED_INVENTORY_ITEM;
                                break;
                            case ("NON_INVENTORY"):
                                enumRecordType = RECORD.Type.NON_INVENTORY_ITEM;
                                break;
                            case ("SERIALIZED_INVENTORY"):
                                enumRecordType = RECORD.Type.SERIALIZED_INVENTORY_ITEM;
                                break;
                            case ("SALES_TAX"):
                                enumRecordType = RECORD.Type.SALES_TAX_ITEM;
                                break;
                            case ("REALLOCATE"):
                                enumRecordType = RECORD.Type.REALLOCATE_ITEM;
                                break;
                            case ("GIFT_CERTIFICATE"):
                                enumRecordType = RECORD.Type.GIFT_CERTIFICATE_ITEM;
                                break;
                            case ("PAYMENT"):
                                enumRecordType = RECORD.Type.PAYMENT_ITEM;
                                break;
                            case ("DOWNLOAD"):
                                enumRecordType = RECORD.Type.DOWNLOAD_ITEM;
                                break;
                            case ("KIT"):
                                enumRecordType = RECORD.Type.KIT_ITEM;
                                break;
                            case ("ASSEMBLY"):
                                enumRecordType = RECORD.Type.ASSEMBLY_ITEM;
                                break;
                            case ("LOT_NUMBERED_ASSEMBLY"):
                                enumRecordType = RECORD.Type.LOT_NUMBERED_ASSEMBLY_ITEM;
                                break;
                            case ("SERIALIZED_ASSEMBLY"):
                                enumRecordType = RECORD.Type.SERIALIZED_ASSEMBLY_ITEM;
                                break;
                            case ("DESCRIPTION"):
                                enumRecordType = RECORD.Type.DESCRIPTION_ITEM;
                                break;
                            case ("SUBTOTAL"):
                                enumRecordType = RECORD.Type.SUBTOTAL_ITEM;
                                break;
                            case ("PAYROLL"):
                                enumRecordType = RECORD.Type.PAYROLL_ITEM;
                                break;
                            case ("MARKUP"):
                                enumRecordType = RECORD.Type.MARKUP_ITEM;
                                break;
                            case ("OTHER_CHARGE"):
                                enumRecordType = RECORD.Type.OTHER_CHARGE_ITEM;
                                break;
                            case ("DISCOUNT"):
                                enumRecordType = RECORD.Type.DISCOUNT_ITEM;
                                break;
                            case ("SERVICE"):
                                enumRecordType = RECORD.Type.SERVICE_ITEM;
                                break;
                            default:
                                enumRecordType = RECORD.Type.NON_INVENTORY_ITEM;
                        }
                        var itemRecord = RECORD.load({
                            type: enumRecordType,
                            id: itemId,
                            isDynamic: false
                        });
                        itemRecord.setValue({
                            fieldId: 'isfulfillable',
                            value: makeTrueOrFalse,
                        });
                        itemRecord.save();
                    } catch (err) {
                        log.error('doUpdateFulfillableItems ' + itemId, err.toString());
                    }
                }
                var billingPageUrl = 'https://' + appUrl;
                billingPageUrl = billingPageUrl + '/app/accounting/transactions/invoicecustomers.nl';
                REDIRECT.redirect({ url: billingPageUrl });
            } catch (err) {
                log.error('doUpdateFulfillableItems', err.toString());
            }
        }
        function doSingleInvoicePreview(context, appUrl) {
            try {
                var fromTime = new Date();
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceNumber = context.request.parameters.invoicenumber;
                var searchJsonObj = createBatchRecord(invoiceId, invoiceNumber, '1', '1')
                //searchJsonObj.custrecord_sti_batch_record_type = 1; //Invoice
                //searchJsonObj.transaction_internal_id = invoiceId;
                //searchJsonObj.selectedRecordType = 1;
                searchJsonObj.single_print_flag = 'false';
                searchJsonObj.single_preview_flag = 'true';
                searchJsonObj.single_email_flag = 'false';
                var results = STINVC.singlePreviewInvoice(searchJsonObj);

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                //invoiceRecordUrl = invoiceRecordUrl + "&e=T";
                //invoiceRecordUrl = invoiceRecordUrl + "&whence=";
                var thruTime = new Date();
                var timeDiff = (thruTime - fromTime) / 1000;
                log.debug('Total Seconds', timeDiff);
                REDIRECT.redirect({ url: invoiceRecordUrl });
            } catch (err) {
                log.error('Error in doSingleInvoicePreview', err.toString());
            }
            return;
        }
        function doSingleInvoiceReprint(context, appUrl) {
            try {
                var fromTime = new Date();
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceNumber = context.request.parameters.invoicenumber;
                var searchJsonObj = createBatchRecord(invoiceId, invoiceNumber, '5', '1')
                searchJsonObj.single_print_flag = 'true';
                searchJsonObj.single_preview_flag = 'false';
                searchJsonObj.single_email_flag = 'false';
                var results = STINVC.singleReprintInvoice(searchJsonObj);

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                //invoiceRecordUrl = invoiceRecordUrl + "&e=T";
                //invoiceRecordUrl = invoiceRecordUrl + "&whence=";
                var thruTime = new Date();
                var timeDiff = (thruTime - fromTime) / 1000;
                log.debug('Total Seconds', timeDiff);
                REDIRECT.redirect({ url: invoiceRecordUrl });
            } catch (err) {
                log.error('Error in doSingleInvoiceReprint', err.toString());
            }
            return;
        }
        function doSingleInvoiceEmail(context, appUrl) {
            try {
                var fromTime = new Date();
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceNumber = context.request.parameters.invoicenumber;
                var searchJsonObj = {};
                searchJsonObj.custrecord_sti_batch_record_type = 1; //Invoice
                searchJsonObj.transaction_internal_id = invoiceId;
                searchJsonObj.transaction_tran_id = invoiceNumber;
                searchJsonObj.selectedRecordType = 1;
                searchJsonObj.single_print_flag = 'false';
                searchJsonObj.single_preview_flag = 'false';
                searchJsonObj.single_email_flag = 'true';
                var results = STINVC.singleEmailInvoice(searchJsonObj);

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                //invoiceRecordUrl = invoiceRecordUrl + "&e=T";
                //invoiceRecordUrl = invoiceRecordUrl + "&whence=";
                var thruTime = new Date();
                var timeDiff = (thruTime - fromTime) / 1000;
                log.debug('Total Seconds for doSingleInvoiceEmail', timeDiff);
                REDIRECT.redirect({ url: invoiceRecordUrl });
            } catch (err) {
                log.error('Error in doSingleInvoiceEmail', err.toString());
            }
            return;
        }
        function doUpdateInvoiceTBB(context, appUrl, invoiceStatus, tbbChecked) {
            var invoiceId = context.request.parameters.invoiceid;
            try {
                RECORD.submitFields({
                    id: invoiceId,
                    type: RECORD.Type.INVOICE,
                    values: {
                        custbody_sti_invoice_status: invoiceStatus,
                        custbody_sti_tbb_box: tbbChecked
                    }
                });
            } catch (err) {
                log.error('Error in doRemoveInvoiceTBB', err.toString());
            }
            var invoiceRecordUrl = "https://" + appUrl;
            invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
            invoiceRecordUrl = invoiceRecordUrl + "&whence=";
            if (invoiceStatus != '2') {
                invoiceRecordUrl = invoiceRecordUrl + "&e=T";
            }
            REDIRECT.redirect({ url: invoiceRecordUrl });
            return;
        }
        function doPrintEmailStoreSingleInvoice(context, appUrl) {
            try {
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceRecord = RECORD.load({
                    type: RECORD.Type.INVOICE,
                    id: invoiceId,
                    isDynamic: false
                });
                var batchRecordType = '1'; //Invoices
                var batchOutputType = '4'; //Approve & Email

                var invoiceNumber = invoiceRecord.getValue({ fieldId: 'tranid' });
                var searchJsonObj = createBatchRecord(invoiceId, invoiceNumber, batchOutputType, batchRecordType)
                var results = STINVC.invcAttachAndPrintAndEmail(searchJsonObj);

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                invoiceRecordUrl = invoiceRecordUrl + "&e=T";
                invoiceRecordUrl = invoiceRecordUrl + "&whence=";
                REDIRECT.redirect({ url: invoiceRecordUrl });
            } catch (err) {
                log.error('Error in doPrintEmailStoreSingleInvoice', err.toString());
            }
            return;
        }
        function doSinglePrintProForma(context, appUrl) {
            try {
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var salesOrderId = context.request.parameters.soid;
                var salesOrderRecord = RECORD.load({
                    type: RECORD.Type.SALES_ORDER,
                    id: salesOrderId,
                    isDynamic: false
                });
                var batchRecordType = '103'; //ProForma
                var batchOutputType = '5';   //Reprint
                var salesOrderNumber = salesOrderRecord.getValue({ fieldId: 'tranid' });
                //var batchInfoObj = createBatchRecord(batchRecordType, batchOutputType, salesOrderNumber);
                var batchInfoObj = createBatchRecord(salesOrderId, salesOrderNumber, batchOutputType, batchRecordType);

                var batchInternalId = batchInfoObj.batchInternalId;
                var batchNumber = batchInfoObj.batchNumber;
                var mapReduceTaskId = startBatchMapReduceTask(batchInternalId, batchNumber);

                var salesOrderRecordUrl = "https://" + appUrl;
                salesOrderRecordUrl = salesOrderRecordUrl + "/app/accounting/transactions/salesord.nl?id=" + salesOrderId;
                salesOrderRecordUrl = salesOrderRecordUrl + "&e=T";
                salesOrderRecordUrl = salesOrderRecordUrl + "&whence=";
                REDIRECT.redirect({ url: salesOrderRecordUrl });
            } catch (err) {
                log.error('Error in doSinglePrintProForma', err.toString());
            }
            return;
        }
        function doAddInvoiceGroups(context, appUrl) {
            try {
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceRecord = RECORD.load({
                    type: 'INVOICE',
                    id: invoiceId,
                    isDynamic: false
                });
                var invoiceRecordOriginal = RECORD.load({
                    type: 'INVOICE',
                    id: invoiceId,
                    isDynamic: false
                });

                var groupToCopy = invoiceRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_sti_line_trans_invoice_group',
                    line: 0
                });

                var groupsAdded = 0;
                if (!SNOW.isEmpty(groupToCopy)) {
                    var itemCount = invoiceRecord.getLineCount({ sublistId: 'item' });
                    for (var itemLoop = 1; itemLoop < itemCount; itemLoop++) {
                        var currentGroup = invoiceRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_sti_line_trans_invoice_group',
                            line: itemLoop
                        });
                        if (SNOW.isEmpty(currentGroup)) {
                            invoiceRecord.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_sti_line_trans_invoice_group',
                                line: itemLoop,
                                //value: groupToCopy
                                value: parseInt(groupToCopy)
                            });
                            groupsAdded++;
                        } else {
                            var groupToCopy = currentGroup;
                        }
                    }
                }
                log.debug('done with adding groups', groupsAdded);
                if (invoiceRecord != invoiceRecordOriginal) {
                    log.debug('in the save');
                    var invoiceIdSaved = invoiceRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });
                    log.debug('invoiceIdSaved', invoiceIdSaved);
                }
                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                log.audit('invoiceRecordUrl', invoiceRecordUrl)
                REDIRECT.redirect({
                    url: invoiceRecordUrl
                });
            } catch (err) {
                log.error('Error in doAddInvoiceGroups', err.toString());
            }
            return;
        }
        function doRemoveInvoiceGroups(context, appUrl) {
            try {
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceRecord = RECORD.load({
                    type: 'INVOICE',
                    id: invoiceId,
                    isDynamic: false
                });
                var invoiceRecordOriginal = RECORD.load({
                    type: 'INVOICE',
                    id: invoiceId,
                    isDynamic: false
                });

                var groupsRemoved = 0;
                var itemCount = invoiceRecord.getLineCount({ sublistId: 'item' });
                for (var itemLoop = 0; itemLoop < itemCount; itemLoop++) {
                    var currentGroup = invoiceRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_sti_line_trans_invoice_group',
                        line: itemLoop
                    });
                    if (!SNOW.isEmpty(currentGroup)) {
                        invoiceRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_sti_line_trans_invoice_group',
                            line: itemLoop,
                            value: ''
                        });
                        groupsRemoved++;
                    }
                }
                log.debug('done with removing groups', groupsRemoved);
                if (invoiceRecord != invoiceRecordOriginal) {
                    log.debug('in the save');
                    invoiceRecord.setValue({
                        fieldId: 'custbody_sti_invc_groups_removed',
                        value: true
                    });
                    var invoiceIdSaved = invoiceRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });
                    log.debug('invoiceIdSaved', invoiceIdSaved);
                }
                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                log.audit('invoiceRecordUrl', invoiceRecordUrl)
                REDIRECT.redirect({
                    url: invoiceRecordUrl
                });
            } catch (err) {
                log.error('Error in doRemoveInvoiceGroups', err.toString());
            }
            return;
        }
        function doStartInvoiceBatch(context, appUrl) {
            try {
                var batchInternalId = context.request.parameters.batch_id;
                var batchNumber = context.request.parameters.batch_number;
                var mapReduceTaskId = startBatchMapReduceTask(batchInternalId, batchNumber);
                log.debug('mapReduceTaskId', mapReduceTaskId);

                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });
                var batchRecordUrl = "https://" + appUrl;
                batchRecordUrl = batchRecordUrl + "/app/common/custom/custrecordentry.nl?rectype=1839&id=" + batchInternalId;
                batchRecordUrl = batchRecordUrl + "&e=T";
                batchRecordUrl = batchRecordUrl + "&refresh=1";
                log.audit('batchRecordUrl', batchRecordUrl)
                REDIRECT.redirect({
                    url: batchRecordUrl
                });
            } catch (err) {
                log.error('Error in doStartInvoiceBatch', err.toString());
            }
            return;
        }
        function doInvoiceReprint(context, appUrl) {
            try {
                log.debug('context.request.parameters', JSON.stringify(context.request.parameters));
                var invoiceId = context.request.parameters.invoiceid;
                var invoiceRecord = RECORD.load({
                    type: RECORD.Type.INVOICE,
                    id: invoiceId,
                    isDynamic: false
                });
                var batchRecordType = '1'; //Invoices
                var batchOutputType = '5'; //Reprint

                var invoiceNumber = invoiceRecord.getValue({ fieldId: 'tranid' });
                var batchInfoObj = createBatchRecord(batchRecordType, batchOutputType, invoiceNumber);
                var batchInternalId = batchInfoObj.batchInternalId;
                var batchNumber = batchInfoObj.batchNumber;
                var mapReduceTaskId = startBatchMapReduceTask(batchInternalId, batchNumber);

                var invoiceRecordUrl = "https://" + appUrl;
                invoiceRecordUrl = invoiceRecordUrl + "/app/accounting/transactions/custinvc.nl?id=" + invoiceId;
                invoiceRecordUrl = invoiceRecordUrl + "&e=T";
                invoiceRecordUrl = invoiceRecordUrl + "&whence=";
                REDIRECT.redirect({ url: invoiceRecordUrl });
            } catch (err) {
                log.error('Error in doInvoiceReprint', err.toString());
            }
            return;
        }
        function doReloadInvoiceBatch(context, appUrl) {
            try {
                var batchInternalId = context.request.parameters.batch_id;
                var invoiceBatchRecord = RECORD.load({
                    type: 'customrecord_sti_invoice_batch',
                    id: batchInternalId,
                    isDynamic: false
                });

                var custrecord_sti_batch_number = invoiceBatchRecord.getValue({ fieldId: 'custrecord_sti_batch_number' });
                var custrecord_sti_invoice_batch_start = invoiceBatchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_start' });
                var custrecord_sti_invoice_batch_stop = invoiceBatchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_stop' });
                var custrecord_sti_invoice_batch_selected = invoiceBatchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_selected' });
                var custrecord_sti_invoice_batch_completed = invoiceBatchRecord.getValue({ fieldId: 'custrecord_sti_invoice_batch_completed' });
                var refreshFlag = false;
                var noRecordsFlag = false;

                if (!SNOW.isEmpty(custrecord_sti_invoice_batch_start) && SNOW.isEmpty(custrecord_sti_invoice_batch_stop)) {
                    refreshFlag = true;
                } else {
                    if (custrecord_sti_invoice_batch_selected != custrecord_sti_invoice_batch_completed) {
                        refreshFlag = true;
                    }
                }

                switch (true) {
                    case (!SNOW.isEmpty(custrecord_sti_invoice_batch_stop) && custrecord_sti_invoice_batch_selected == 0): //Stopped Processing but No Records
                        noRecordsFlag = true;
                        refreshFlag = false;
                        break;
                    case (!SNOW.isEmpty(custrecord_sti_invoice_batch_start) && SNOW.isEmpty(custrecord_sti_invoice_batch_stop)): //Still Running
                        refreshFlag = true;
                        break;
                    case (custrecord_sti_invoice_batch_selected != custrecord_sti_invoice_batch_completed): //Not All Selected Invoices Processed
                        refreshFlag = true;
                        break;
                    case (!SNOW.isEmpty(custrecord_sti_invoice_batch_start) && !SNOW.isEmpty(custrecord_sti_invoice_batch_stop)): //Started and Stopped Ok
                        noRecordsFlag = false;
                        refreshFlag = false;
                        break;
                    default:
                        noRecordsFlag = false;
                        refreshFlag = true;
                }

                var batchRecordUrl = "https://" + appUrl;
                batchRecordUrl = batchRecordUrl + "/app/common/custom/custrecordentry.nl?rectype=1839&id=" + batchInternalId;
                batchRecordUrl = batchRecordUrl + "&e=T";
                batchRecordUrl = batchRecordUrl + "&batch_number=" + custrecord_sti_batch_number;
                if (refreshFlag) {
                    batchRecordUrl = batchRecordUrl + "&refresh=1";
                }
                if (noRecordsFlag) {
                    batchRecordUrl = batchRecordUrl + "&no_records_found=1";
                }
                log.debug('batchRecordUrl', batchRecordUrl)
                REDIRECT.redirect({
                    url: batchRecordUrl
                });
            } catch (err) {
                log.error("Error in doReloadInvoiceBatch", err.toString());
            }
            return;
        }
        function doResetInvoiceBatch(context, appUrl) {
            log.debug('doResetInvoiceBatch', JSON.stringify(context.request.parameters));
            try {
                var batchInternalId = context.request.parameters.batch_id;
                var batchRecordUrl = "https://" + appUrl;
                batchRecordUrl = batchRecordUrl + "/app/common/custom/custrecordentry.nl?rectype=1839";
                batchRecordUrl = batchRecordUrl + "&id=" + batchInternalId;
                batchRecordUrl = batchRecordUrl + "&e=T";
                log.debug('doResetInvoiceBatch batchRecordUrl', batchRecordUrl)
                REDIRECT.redirect({
                    url: batchRecordUrl
                });
            } catch (err) {
                log.error("Error in doResetInvoiceBatch", err.toString());
            }
            return;
        }
        function wait_a_second(numberOfSeconds) {
            var milliseconds = numberOfSeconds * 1000;
            var date = new Date();
            date.setMilliseconds(date.getMilliseconds() + milliseconds);
            while (new Date() < date) {
            }

            return;
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
        function createBatchRecord(transactionInternalId, transactionExternalId, batchOutputType, batchRecordType) {
            var userObj = RUNTIME.getCurrentUser();
            var currentUserIdOld = userObj.id;
            var currentUserIdNew = Math.abs(currentUserIdOld);
            var webTempId = currentUserIdNew + '_' + new Date().getTime();
            var batchNumber = create_UUID(); batchNumber = batchNumber.toString()
            var batchRecord = RECORD.create({
                type: 'customrecord_sti_invoice_batch',
                isDynamic: false
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_batch_invoice_date',
                value: new Date()
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_batch_invoice_number',
                value: transactionExternalId
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_batch_number',
                value: batchNumber
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_batch_record_type',
                value: batchRecordType
            });
            batchRecord.setValue({
                fieldId: 'custrecord_sti_batch_output_type',
                value: batchOutputType
            });
            var batchInternalId = batchRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: false
            });

            //Build SearchJsonObj{}
            var fieldsArray = [];
            fieldsArray.push('custrecord_sti_batch_number');
            fieldsArray.push('custrecord_sti_batch_record_type');
            fieldsArray.push('custrecord_sti_batch_output_type');
            fieldsArray.push('custrecord_sti_batch_invoice_date');
            fieldsArray.push('custrecord_sti_batch_invoice_type');
            fieldsArray.push('custrecord_sti_batch_invoice_number');
            fieldsArray.push('custrecord_sti_batch_customer_number');
            fieldCnt = fieldsArray.length;

            var searchJsonObj = {
                single_record: true,
                web_temp_id: webTempId,
                batch_internal_id: batchInternalId,
                transaction_internal_id: transactionInternalId,
                batchNumber: batchNumber,
                batchInternalId: batchInternalId
            };

            for (fieldLoop = 0; fieldLoop < fieldCnt; fieldLoop++) {
                fieldName = fieldsArray[fieldLoop];
                fieldData = batchRecord.getValue({ fieldId: fieldName });

                if (!SNOW.isEmpty(fieldData)) {
                    fieldData = fieldData.toString();
                    fieldData = fieldData.trim();
                }
                searchJsonObj[fieldName] = fieldData;
            }
            return searchJsonObj;
        }
        function startBatchMapReduceTask(batchInternalId, batchNumber) {
            var mapReduceTask;
            mapReduceTask = TASK.create({
                taskType: TASK.TaskType.MAP_REDUCE,
                scriptId: 'customscript_sti_mr_process_invc_batch',
                deploymentId: 'customdeploy_sti_mr_process_invc_batch'
            });

            mapReduceTask.params = {
                custscript_sti_invoice_batch_id: batchInternalId,
                custscript_sti_invoice_batch_number: batchNumber
            };
            var mapReduceTaskId = mapReduceTask.submit();
            return mapReduceTaskId;
        }
        return {
            onRequest: doButtonEvent
        };
    });