/**
 *
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @description Sales Order User Events
 *
 * Script Name: sti_ue_sales_order.js
 *
 */
define([
    'N/ui/serverWidget',
    'N/log',
    'N/record',
    'N/runtime',
    'N/search',
    'N/https',
    'N/file',
    'N/format',
    'N/url',
    'SuiteScripts/STI_Lib/sti_integration_lib',
    'SuiteScripts/STI_Lib/sti_integration_module',
    'SuiteScripts/STI_Lib/sti_utility_module'
],
    /**
     * @param{serverWidget} serverWidget
     * @param{log} LOG
     * @param{record} RECORD
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param {https} HTTPS
     * @param{file} FILE
     * @param{format} FORMAT
     * @param{url} URL
     * @param SNOW
     * @param STIN
     * @param STITUIL
     */
    (serverWidget, LOG, RECORD, RUNTIME, SEARCH, HTTPS, FILE, FORMAT, URL, SNOW, STIN, STIUTIL) => {
        const beforeLoad = (scriptContext) => {
            var userObj = RUNTIME.getCurrentUser();
            var currentUserIdOld = userObj.id;
            var currentUserIdNew = Math.abs(currentUserIdOld);
            var webTempId = currentUserIdNew + '_' + new Date().getTime(); log.debug('webTempId', webTempId);
            var sessionObj = RUNTIME.getCurrentSession(); //sessionObj is a runtime.Session object
            //var updateResults = updateLatencyRecord(scriptContext.newRecord, 'beforeLoad', 'start');
            var fromTime = new Date();
            //log.debug('Current Session', RUNTIME.getCurrentSession());
            try {
                //var monitorTime = checkToMonitorTime(scriptContext.newRecord);
                //Add Button to Print Pro Forma
                var thesalesOrderId = scriptContext.newRecord.id;
                var urlParams = '&button_name=SINGLEPRINTPROFORMA';
                urlParams = urlParams + '&soid=' + thesalesOrderId;

                var theSuiteletUrl = URL.resolveScript({
                    scriptId: 'customscript_sti_button_event_suitelet',
                    deploymentId: 'customdeploy_sti_button_event_suitelet'
                }) + urlParams;
                scriptContext.form.addButton({
                    label: 'Print Pro Forma',
                    id: 'custpage_print_pro_forma',
                    functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                });
            } catch (err) {
                log.error('beforeLoad', err.toString());
            }
            //var updateResults = updateLatencyRecord(scriptContext.newRecord, 'beforeLoad', 'stop');
            //if (monitorTime) {
            //    var thruTime = new Date();
            //    var timeDiff = STIUTIL.calcTimeDiff(fromTime, thruTime); log.debug('timeDiff beforeLoad', timeDiff);
            //}
        }
        const beforeSubmit = (scriptContext) => {
            var fromTime = new Date();
            //log.debug('Current Session', RUNTIME.getCurrentSession());
            try {
                //var updateResults = updateLatencyRecord(scriptContext.newRecord, 'beforeSubmit', 'start');
                //var monitorTime = checkToMonitorTime(scriptContext.newRecord);
                //if (monitorTime) {
                //    log.debug('beforeSubmit');
                //}
                if (scriptContext.type == "delete") {
                    return true;
                }
                if (RUNTIME.executionContext == 'CSVIMPORT') {
                    return true; //do not process for csv imports
                }
                if (RUNTIME.executionContext == 'WORKFLOW') {
                    var theData = JSON.parse(JSON.stringify(RUNTIME));
                    //log.debug('theData', JSON.stringify(theData));
                    return true; //do not process for Workflow Updates
                }
                if (RUNTIME.executionContext == 'WEBSERVICES') {
                    return true; //do not process for Webservices Updates
                }
                //if (RUNTIME.executionContext == 'MAPREDUCE') {
                //    return true; //do not process for MAPREDUCE Updates
                //}
                //var brandNew = Boolean(SNOW.isEmpty(scriptContext.oldRecord));
                ////var ismultishipto = scriptContext.newRecord.getValue({ fieldId: 'ismultishipto' });
                ////if (ismultishipto) {
                //var firstAddress = scriptContext.newRecord.getSublistValue({
                //    sublistId: 'item',
                //    fieldId: 'custcol_ns_address_book',
                //    line: 0
                //});
                //if (!SNOW.isEmpty(firstAddress)) {
                //    scriptContext.newRecord.setValue({
                //        fieldId: 'ismultishipto',
                //        value: true
                //    });
                //    log.debug('heading to copyAddressBookToShipAddress');
                //    scriptContext.newRecord = STIN.copyAddressBookToShipAddress(scriptContext.newRecord);  //Check if Need to Populate Ship-To on Line Items
                //    log.debug('returned from copyAddressBookToShipAddress');
                //}
                //if (!brandNew) {
                //    if (!scriptContext.newRecord.isDynamic) {
                //        scriptContext.newRecord = STIN.addDefaultInvoiceGroups(scriptContext.newRecord);
                //    }
                //}
                //var updateResults = updateLatencyRecord(scriptContext.newRecord, 'beforeSubmit', 'stop');
            } catch (err) {
                log.error('Error: beforeSubmit', err.toString());
            }
            //if (monitorTime) {
            //var thruTime = new Date();
            //var timeDiff = STIUTIL.calcTimeDiff(fromTime, thruTime);
            //log.debug(scriptContext.newRecord.id + ' timeDiff beforeSubmit', timeDiff);
            //}
        }
        const afterSubmit = (scriptContext) => {
            var fromTime = new Date();
            log.debug('in afterSubmit', scriptContext.newRecord.id);
            try {
                const scriptObj = RUNTIME.getCurrentScript();
                //Check if Need to Send Project to SN
                var custbody_sti_invoice_type = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
                if (custbody_sti_invoice_type == '2') {
                    var custbody_sti_opp_pm = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_opp_pm' });
                    var custbody_sti_project_link_to_sn = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_project_link_to_sn' });

                    var okForSN = false;
                    if (SNOW.isEmpty(custbody_sti_project_link_to_sn) && !SNOW.isEmpty(custbody_sti_opp_pm)) {
                        var okForSN = true;  //First time to SN
                    } else {
                        var projectFields = ['custbody_sti_project_type', 'custbody_sti_project_name', 'custbody_sti_opp_pm'];
                        for (var fieldLoop = 0; fieldLoop < projectFields.length && !okForSN; fieldLoop++) {
                            var fieldName = projectFields[fieldLoop];
                            var oldValue = scriptContext.oldRecord.getValue({ fieldId: fieldName });
                            var newValue = scriptContext.newRecord.getValue({ fieldId: fieldName });
                            if (oldValue != newValue && !SNOW.isEmpty(newValue)) {
                                okForSN = true;  //Field Changes to SN
                            }
                        }
                    }
                    log.debug('okForSN', okForSN);
                    if (okForSN) {
                        var salesOrderRecord = RECORD.load({
                            type: RECORD.Type.SALES_ORDER,
                            id: scriptContext.newRecord.id,
                            isDynamic: false
                        });
                        log.debug(salesOrderRecord.id + ' heading to integration');
                        salesOrderRecord = STIN.sendProjectToSN(salesOrderRecord, scriptObj);
                        log.debug(salesOrderRecord.id + ' back from integration');
                    }
                }
            } catch (err) {
                log.error('afterSubmit', err.toString());
            }
            //    //if (monitorTime) {
            //    var thruTime = new Date();
            //    var timeDiff = STIUTIL.calcTimeDiff(fromTime, thruTime); log.debug(scriptContext.newRecord.id + ' timeDiff afterSubmit', timeDiff);
            //    //}
        }
        function updateLatencyRecord(transactionRecord, event, action) {
            //if (action == 'start') {
            //    try {
            //        var scriptObj = RUNTIME.getCurrentScript();
            //        var userObj = RUNTIME.getCurrentUser();
            //        var currentUserIdOld = userObj.id;
            //        var currentUserIdNew = Math.abs(currentUserIdOld);
            //        var webTempId = currentUserIdNew + '_' + new Date().getTime(); log.debug('webTempId', webTempId);
            //        var sessionObj = RUNTIME.getCurrentSession(); //sessionObj is a runtime.Session object
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_session',
            //            value: webTempId
            //        });
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_user',
            //            value: userObj.id
            //        });
            //        //sessionObj.set({
            //        //    name: 'custrecord_sti_latency_date',
            //        //    value: new Date()
            //        //});
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_script',
            //            value: scriptObj.id
            //        });
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_event',
            //            value: event
            //        });
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_record',
            //            value: transactionRecord.id
            //        });
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_lines',
            //            value: transactionRecord.getLineCount({ sublistId: 'item' })
            //        });
            //        var fromSeconds = new Date().getTime() / 1000;
            //        sessionObj.set({
            //            name: 'custrecord_sti_latency_start',
            //            value: fromSeconds
            //        });

            //        var latencyRecord = RECORD.create({
            //            type: 'customrecord_sti_so_latency',
            //            isDynamic: false
            //        });

            //        var arrayFields = ["custrecord_sti_latency_session", "custrecord_sti_latency_user", "custrecord_sti_latency_date", "custrecord_sti_latency_script", "custrecord_sti_latency_event", "custrecord_sti_latency_record", "custrecord_sti_latency_lines", "custrecord_sti_latency_start"];
            //        for (var fldLoop = 0; fldLoop < arrayFields.length; fldLoop++) {
            //            var fieldName = arrayFields[fldLoop];
            //            var fieldValue = sessionObj.get({ name: fieldName });
            //            latencyRecord.setValue({
            //                fieldId: fieldName,
            //                value: fieldValue
            //            });
            //        }
            //        var latencyRecordId = latencyRecord.save({
            //            enableSourcing: false,
            //            ignoreMandatoryFields: true
            //        });
            //        sessionObj.set({
            //            name: 'latency_id',
            //            value: latencyRecordId
            //        });
            //    } catch (err) {
            //        log.error('updateLatencyRecord - Start', err.toString());
            //    }
            //} else {
            //    try {
            //        var sessionObj = RUNTIME.getCurrentSession(); //sessionObj is a runtime.Session object
            //        var latencyRecordId = sessionObj.get({ name: 'latency_id' });
            //        var latencyRecord = RECORD.load({
            //            type: 'customrecord_sti_so_latency',
            //            id: latencyRecordId,
            //            isDynamic: false
            //        });
            //        var fromSeconds = latencyRecord.getValue({ fieldId: 'custrecord_sti_latency_start' });
            //        var thruSeconds = new Date().getTime() / 1000;
            //        var diffSeconds = (thruSeconds - fromSeconds).toFixed(2);
            //        latencyRecord.setValue({
            //            fieldId: 'custrecord_sti_latency_lines',
            //            value: transactionRecord.getLineCount({ sublistId: 'item' })
            //        });
            //        latencyRecord.setValue({
            //            fieldId: 'custrecord_sti_latency_stop',
            //            value: thruSeconds
            //        });
            //        latencyRecord.setValue({
            //            fieldId: 'custrecord_sti_latency_difference',
            //            value: diffSeconds
            //        });
            //        latencyRecord.save();
            //    } catch (err) {
            //        log.error('updateLatencyRecord - Stop', err.toString());
            //    }
            //}
        }
        function checkToMonitorTime(salesOrderRecord) {
            var checkForTime = true;
            return checkForTime;
            try {
                if (!SNOW.isEmpty(salesOrderRecord)) {
                    var salesOrderId = salesOrderRecord.id;
                    if (!SNOW.isEmpty(salesOrderId)) {
                        const scriptObj = RUNTIME.getCurrentScript();
                        var arrayOfIDs = scriptObj.getParameter({ name: 'custscript_sti_invoice_batch_id' });
                        //salesOrderId = salesOrderId.toString();
                        //log.debug('salesOrderId', salesOrderId);
                        //log.debug('arrayOfIDs', arrayOfIDs);
                        if (!SNOW.isEmpty(arrayOfIDs)) {
                            arrayOfIDs = arrayOfIDs.split(',');
                            //var theIndex = arrayOfIDs.indexOf(salesOrderId.toString()); log.debug('theIndex', theIndex);
                            checkForTime = Boolean(arrayOfIDs.indexOf(salesOrderId.toString()) >= 0);
                        }
                    }
                }
            } catch (err) {
                log.error('checkToMonitorTime', err.toString());
            }
            return checkForTime;
        }
        return { beforeLoad, beforeSubmit, afterSubmit }
    });