/**
* @NApiVersion 2.x
* @NScriptType MapReduceScript
* @NModuleScope Public
* Script Name: sti_map_reduce_process_invoice_batch.js
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
    'SuiteScripts/STI_Lib/sti_process_invoice_module'
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
     * @param STINVC
     */
    function (LOG, RECORD, EMAIL, RENDER, RUNTIME, SEARCH, HTTPS, FILE, FORMAT, URL, ERROR, SNOW, STINVC) {
        function getInputData() {
            try {
                var scriptObj = RUNTIME.getCurrentScript();
                var batchInternalId = scriptObj.getParameter({ name: 'custscript_sti_invoice_batch_id' });
                var batchNumber = scriptObj.getParameter({ name: 'custscript_sti_invoice_batch_number' });
                var batchSearch;

                if (!SNOW.isEmpty(batchNumber)) {
                    batchNumber = batchNumber.toString();
                }
                log.debug('in getInputData with batchInternalId', batchInternalId);
                log.debug('in getInputData with batchNumber', batchNumber);

                var invoiceBatchRecord = RECORD.load({
                    type: 'customrecord_sti_invoice_batch',
                    id: batchInternalId,
                    isDynamic: false
                });
                log.debug('invoiceBatchRecord', JSON.stringify(invoiceBatchRecord));

                var userObj = RUNTIME.getCurrentUser();
                var currentUserIdOld = userObj.id;
                var currentUserIdNew = Math.abs(currentUserIdOld);
                var webTempId = currentUserIdNew + '_' + new Date().getTime();

                try {
                    var fieldCnt;
                    var fieldLoop;
                    var fieldName;
                    var fieldData;
                    var fieldsArray = [];
                    var searchJsonObj = {
                        batch_internal_id: batchInternalId,
                        web_temp_id: webTempId
                    };

                    //Build Search Statement Based on Form Selections
                    fieldsArray.push('custrecord_sti_batch_number');
                    fieldsArray.push('custrecord_sti_batch_record_type');
                    fieldsArray.push('custrecord_sti_batch_output_type');
                    fieldsArray.push('custrecord_sti_batch_invoice_date');
                    fieldsArray.push('custrecord_sti_batch_invoice_type');
                    fieldsArray.push('custrecord_sti_batch_invoice_number');
                    fieldsArray.push('custrecord_sti_batch_customer_number');
                    fieldCnt = fieldsArray.length;

                    for (fieldLoop = 0; fieldLoop < fieldCnt; fieldLoop++) {
                        fieldName = fieldsArray[fieldLoop];
                        fieldData = invoiceBatchRecord.getValue({ fieldId: fieldName });

                        if (!SNOW.isEmpty(fieldData)) {
                            fieldData = fieldData.toString();
                            fieldData = fieldData.trim();
                        }
                        searchJsonObj[fieldName] = fieldData;
                    }

                    invoiceBatchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_start',
                        value: new Date()
                    });
                    invoiceBatchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_stop',
                        value: ''
                    });
                    invoiceBatchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_selected',
                        value: 0
                    });
                    invoiceBatchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_completed',
                        value: 0
                    });
                    invoiceBatchRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });

                    if (searchJsonObj.custrecord_sti_batch_output_type == '101' || searchJsonObj.custrecord_sti_batch_output_type == '102') {  //TBB Add (101) or Remove (102)
                        var numberOfInvoices = STINVC.invcAddRemoveTBB(searchJsonObj);
                    } else {
                        var numberOfInvoices = STINVC.invcAttachAndPrintAndEmail(searchJsonObj);
                    }

                    //Read Invoice Record Again Since Changed in Module
                    invoiceBatchRecord = RECORD.load({
                        type: 'customrecord_sti_invoice_batch',
                        id: batchInternalId,
                        isDynamic: false
                    });
                    invoiceBatchRecord.setValue({
                        fieldId: 'custrecord_sti_invoice_batch_stop',
                        value: new Date()
                    });
                    invoiceBatchRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });
                } catch (err) {
                    LOG.error({ title: 'Error on Invoice Batch Processing', details: err.toString() });
                }
                return batchSearch = SEARCH.create({
                    id: 'customsearch_temporary_invoice_search',
                    type: RECORD.Type.INVOICE,
                    filters: [['status', SEARCH.Operator.IS, 'open']],
                    columns: ['entity'],
                    title: 'Open Invoice Search'
                });
            } catch (err) {
                log.error('Error on getInputData()', err.toString());
                return {};
            }
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
        function map(context) {}
        function reduce(context) {}
        function summarize(summary) {
            handleErrorIfAny(summary);
        }
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });