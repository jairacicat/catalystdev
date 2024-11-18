/**
* @NApiVersion 2.x
* @NScriptType MapReduceScript
* @NModuleScope Public
* Script Name: sti_transform_opp_to_so.js
*/

define([
    'N/log',
    'N/record',
    'N/email',
    'N/render',
    'N/runtime',
    'N/search',
    'N/https',
    'N/file',
    'N/format',
    'N/url',
    'N/error',
    'SuiteScripts/STI_Lib/sti_integration_lib',
    'SuiteScripts/STI_Lib/sti_integration_module',
    'SuiteScripts/STI_Lib/sti_process_invoice_module',
    'SuiteScripts/STI_Lib/sti_utility_module'
],
    /**
     * @param{log} LOG
     * @param{record} RECORD
     * @param{email} EMAIL
     * @param{render} RENDER
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param {https} HTTPS
     * @param{file} FILE
     * @param{format} FORMAT
     * @param{url} URL
     * @param{error} ERROR
     * @param SNOW
     * @param STIN
     * @param STINVC
     * @param STIUTIL
     */
    function (LOG, RECORD, EMAIL, RENDER, RUNTIME, SEARCH, HTTPS, FILE, FORMAT, URL, ERROR, SNOW, STIN, STINVC, STIUTIL) {
        function getInputData() {
            try {
                var scriptObj = RUNTIME.getCurrentScript();
                var taskObjInfo = JSON.parse(scriptObj.getParameter({ name: 'custscript_sti_invc_batch_task_info' }));
                var opportunityId = taskObjInfo.opportunityid;
                try {
                    var colDelimiter = String.fromCharCode(253);
                    var opportunityRecord = RECORD.load({
                        type: RECORD.Type.OPPORTUNITY,
                        id: opportunityId,
                        isDynamic: false
                    });

                    var oppShipAddress = '';
                    try {
                        var customerRecord = RECORD.load({
                            type: RECORD.Type.CUSTOMER,
                            id: opportunityRecord.getValue({ fieldId: 'entity' }),
                            isDynamic: false
                        });
                        var oppShipAddressList = opportunityRecord.getValue({ fieldId: 'shipaddresslist' });
                        if (!SNOW.isEmpty(oppShipAddressList)) {
                            var addressLineNumber = customerRecord.findSublistLineWithValue({
                                sublistId: 'addressbook',
                                fieldId: 'addressid',
                                value: oppShipAddressList
                            });
                            if (addressLineNumber >= 0) {
                                var oppShipAddress = customerRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'addressbookaddress_text',
                                    line: addressLineNumber
                                });
                            }
                        }
                    } catch (err) {
                        var oppShipAddress = '';
                    }


                    //Determine Record Groups
                    var lineCount = opportunityRecord.getLineCount({ sublistId: 'item' });
                    var startWith = lineCount - 1;
                    var arrayLines = [];
                    var arrayGroups = [];
                    var arrayRecurringCycles = ["1", "2", "4", "5"];
                    var arrayRenewalTerms = ["1", "2", "3", "4", "5", "6", "7"];
                    var arrayIncomeAccounts = ["1000", "1001", "1030", "1031", "1032"];
                    for (var lineLoop = startWith; lineLoop >= 0; lineLoop--) {
                        var thisGroupId = opportunityRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_sti_op_so_create_group',
                            line: lineLoop
                        });
                        var thisLineId = opportunityRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'lineuniquekey',
                            line: lineLoop
                        });
                        if (SNOW.isEmpty(thisGroupId)) {
                            thisGroupId = '0';
                        }
                        thisGroupId = thisGroupId.toString();
                        var groupPos = arrayGroups.indexOf(thisGroupId);
                        if (groupPos >= 0) {
                            arrayLines[groupPos] = arrayLines[groupPos] + colDelimiter + thisLineId;
                        } else {
                            arrayGroups.push(thisGroupId);
                            arrayLines.push(thisLineId);
                        }
                    }

                    //Create a Sales Order for Each Group
                    for (var groupLoop = 0; groupLoop < arrayGroups.length; groupLoop++) {
                        var thisGroupId = arrayGroups[groupLoop];
                        var arrayLineIds = arrayLines[groupLoop].split(colDelimiter);
                        var salesOrderRecord = RECORD.transform({
                            fromType: RECORD.Type.OPPORTUNITY,
                            fromId: opportunityId,
                            toType: RECORD.Type.SALES_ORDER,
                            isDynamic: false,
                        });
                        salesOrderRecord.setValue({
                            fieldId: 'memo',
                            value: 'Group #' + thisGroupId
                        });
                        salesOrderRecord.setValue({
                            fieldId: 'shipaddresslist',
                            value: oppShipAddressList
                        });
                        salesOrderRecord.setValue({
                            fieldId: 'shipaddress',
                            value: oppShipAddress
                        });

                        var lineCount = opportunityRecord.getLineCount({ sublistId: 'item' });
                        var startWith = lineCount - 1;

                        for (var lineLoop = startWith; lineLoop >= 0; lineLoop--) {
                            var groupIsGood = false;
                            try {
                                var thisLineId = opportunityRecord.getSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'lineuniquekey',
                                    line: lineLoop
                                });
                                var thisLinePos = arrayLineIds.indexOf(thisLineId);
                                groupIsGood = Boolean(thisLinePos >= 0);
                            } catch (err) {
                                groupIsGood = false;
                            }

                            if (groupIsGood) {
                                var lineAmount = salesOrderRecord.getSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'amount',
                                    line: lineLoop
                                });

                                if (lineAmount == 0) {
                                    var keepTheLine = false;
                                    for (var checkLoop = 0; checkLoop <= 9 && keepTheLine == false; checkLoop++) {
                                        switch (checkLoop) {
                                            case (0): //Check for Non Zero Rate
                                                var lineRate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'rate',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineRate)) {
                                                    lineRate = 0;
                                                }
                                                lineRate = parseFloat(lineRate);
                                                keepTheLine = Boolean(lineRate != 0);
                                                break;
                                            case (1): //Check for Zero Cost Estimate
                                                var lineCostEstimate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'costestimate',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineCostEstimate)) {
                                                    lineCostEstimate = 0;
                                                }
                                                lineCostEstimate = parseFloat(lineCostEstimate);
                                                keepTheLine = Boolean(lineCostEstimate != 0);
                                                break;
                                            case (2): //Check for Zero Term Length
                                                var lineTermLength = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_sti_term_length',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineTermLength)) {
                                                    lineTermLength = 0;
                                                }
                                                lineTermLength = parseFloat(lineTermLength);
                                                keepTheLine = Boolean(lineTermLength != 0);
                                                break;
                                            case (3): //Check for PO Rate
                                                var linePoRate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_ctc_iv_porate',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(linePoRate)) {
                                                    linePoRate = '0';
                                                }
                                                linePoRate = parseFloat(linePoRate);
                                                keepTheLine = Boolean(linePoRate != 0);
                                                break;
                                            case (4): //Check for Requested Start Date
                                                var lineRequestedStartDate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_ctc_requested_start_date',
                                                    line: lineLoop
                                                });
                                                keepTheLine = Boolean(!SNOW.isEmpty(lineRequestedStartDate));
                                                break;
                                            case (5): //Check for Service Start Date
                                                var lineServiceStartDate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_ns_service_start',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineServiceStartDate)) {
                                                    lineServiceStartDate = '';
                                                }
                                                keepTheLine = Boolean(!SNOW.isEmpty(lineServiceStartDate));
                                                break;
                                            case (6): //Check for Service End Date
                                                var lineServiceEndDate = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_ns_service_end',
                                                    line: lineLoop
                                                });
                                                keepTheLine = Boolean(!SNOW.isEmpty(lineServiceEndDate));
                                                break;
                                            case (7): //Check for Recurring Cycle
                                                var lineRecurringCycle = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_ctc_recurring_cycle',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineRecurringCycle)) {
                                                    lineRecurringCycle = '';
                                                }
                                                lineRecurringCycle = lineRecurringCycle.toString();
                                                keepTheLine = Boolean(arrayRecurringCycles.indexOf(lineRecurringCycle) >= 0);
                                                break;
                                            case (8): //Check for Renewal Term
                                                var lineRenewalTerm = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'custcol_sti_renewal_term',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(lineRenewalTerm)) {
                                                    lineRenewalTerm = '';
                                                }
                                                lineRenewalTerm = lineRenewalTerm.toString();
                                                keepTheLine = Boolean(arrayRenewalTerms.indexOf(lineRenewalTerm) >= 0);
                                                break;
                                            case (9): //Check for Item's Income Account
                                                var thisItemId = salesOrderRecord.getSublistValue({
                                                    sublistId: 'item',
                                                    fieldId: 'item',
                                                    line: lineLoop
                                                });
                                                if (SNOW.isEmpty(thisItemId)) {
                                                    thisItemId = '';
                                                }
                                                var theIncomeAccount = getIncomeAccountSearch(thisItemId)
                                                keepTheLine = Boolean(arrayIncomeAccounts.indexOf(theIncomeAccount) >= 0);
                                                break;
                                            default:
                                                keepTheLine = false;
                                        }
                                    }
                                } else {
                                    var keepTheLine = true;
                                }
                            } else {
                                var keepTheLine = false;
                            }
                            if (!keepTheLine) {
                                salesOrderRecord.removeLine({
                                    sublistId: 'item',
                                    line: lineLoop,
                                    ignoreRecalc: false
                                });
                            }
                        }
                        salesOrderRecord.setValue({
                            fieldId: 'custbody_sti_record_saved',
                            value: true
                        });
                        //Convert Address Books to Addresses
                        var firstAddress = salesOrderRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_ns_address_book',
                            line: 0
                        });
                        if (!SNOW.isEmpty(firstAddress)) {
                            salesOrderRecord.setValue({
                                fieldId: 'ismultishipto',
                                value: true
                            });
                            salesOrderRecord = STIN.copyAddressBookToShipAddress(salesOrderRecord);  //Check if Need to Populate Ship-To on Line Items
                        }

                        var numberOfLines = salesOrderRecord.getLineCount({ sublistId: 'item' })
                        log.debug('Group ' + thisGroupId + ' Sales Order items', numberOfLines);
                        if (numberOfLines > 0) {
                            var salesOrderId = salesOrderRecord.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });
                            log.debug('Group ' + thisGroupId + ' New Sales Order ' + salesOrderId);
                            //var newSalesOrderRecord = RECORD.load({
                            //    type: RECORD.Type.SALES_ORDER,
                            //    id: salesOrderId,
                            //    isDynamic: false
                            //});
                            //newSalesOrderRecord.setValue({
                            //    fieldId: 'shipaddress',
                            //    value: oppShipAddress
                            //});
                            //newSalesOrderRecord.save();
                        }
                    }
                } catch (err) {
                    log.error('Error - doTransformOpportunity', err.toString());
                }
            } catch (err) {
                log.error('getInputData', err.toString());
            }
            log.debug('all done');
            return [];
        }
        function handleErrorAndSendNotification(e, stage) {
            log.error('Stage: ' + stage + ' failed', e);
            var author = 5;
            var recipients = 'fwalker@sentinel.com';
            var subject = 'Map/Reduce script ' + RUNTIME.getCurrentScript().id + ' failed for stage: ' + stage;
            var body = 'An error occurred with the following information:\n' +
                'Error code: ' + e.name + '\n' +
                'Error msg: ' + e.message;
            EMAIL.send({
                author: author,
                recipients: recipients,
                subject: subject,
                body: body
            });
        }
        function handleErrorIfAny(summary) {
            var inputSummary = summary.inputSummary;
            var mapSummary = summary.mapSummary;
            var reduceSummary = summary.reduceSummary;

            if (inputSummary.error) {
                var e = ERROR.create({
                    name: 'INPUT_STAGE_FAILED',
                    message: inputSummary.error
                });
                handleErrorAndSendNotification(e, 'getInputData');
            }

            handleErrorInStage('map', mapSummary);
            handleErrorInStage('reduce', reduceSummary);
        }
        function handleErrorInStage(stage, summary) {
            var errorMsg = [];
            summary.errors.iterator().each(function (key, value) {
                var msg = 'Failure to  create Invoice Pdf for : ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
                errorMsg.push(msg);
                return true;
            });
            if (errorMsg.length > 0) {
                var e = ERROR.create({
                    name: 'RECORD_TRANSFORM_FAILED',
                    message: JSON.stringify(errorMsg)
                });
                handleErrorAndSendNotification(e, stage);
            }
        }
        function map(context) { }
        function reduce(context) { }
        function summarize(summary) {
            handleErrorIfAny(summary);
        }
        function getIncomeAccountSearch(itemInternalId) {
            var arrayRtnVals = [];
            try {
                var searchIncomeAccountSearch = SEARCH.create({
                    "type": "item",
                    "id": "temp_item_search",
                    "filters": [
                        {
                            "name": "internalid",
                            "operator": "anyof",
                            "values": [itemInternalId],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [
                        {
                            "name": "incomeaccount",
                            "label": "Income Account",
                            "type": "select",
                            "sortdir": "NONE"
                        }
                    ],
                    "settings": [],
                    "title": null,
                    "scriptId": "customsearch_temp_item_search",
                    "isPublic": true
                });
                var resultsIncomeAccountSearch = searchIncomeAccountSearch.run();
                resultsIncomeAccountSearch.each(function (result) {
                    var result = JSON.parse(JSON.stringify(result));
                    var thisIncomeAccount = result.values.incomeaccount[0].value;
                    arrayRtnVals.push(thisIncomeAccount);
                });
            } catch (err) {
                log.error('Error - getIncomeAccount', err.toString());
            }
            if (arrayRtnVals.length >= 1) {
                return arrayRtnVals[0];
            } else {
                return '';
            }
        }
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });