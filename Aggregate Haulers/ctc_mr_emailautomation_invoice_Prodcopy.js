    /**
    * Copyright (c) 2020 Catalyst Tech Corp
    * All Rights Reserved.
    *
    * This software is the confidential and proprietary information of
    * Catalyst Tech Corp. (“Confidential Information”). You shall not
    * disclose such Confidential Information and shall use it only in
    * accordance with the terms of the license agreement you entered into
    * with Catalyst Tech.
    *
    * Project Number: Aggregate Haulers - Email Automation
    * Script Name: CTC - Email Automation MR
    * Author: jaira@nscatalyst.com
    * @NApiVersion 2.1
    * @NScriptType MapReduceScript
    * @Description This will batch send emails for Vendors and Invoices created the past week.
    *
    * CHANGELOGS
    *
    * Version      Date                        Author                                  Remarks
    * 1.00         08.14.2024                  jaira@nscatalyst.com            Initial Build
    * 1.1          09.12.2024                  jaira@nscatalyst.com                 Update log record and log file to add Amount
    */

    define(['N/file', 'N/search', 'N/record', 'N/runtime', 'N/email', 'N/url', 'N/https', 'N/cache', 'N/log', 'N/render'], 
        function(file, search, record, runtime, email, url, https, cache, log, render) {
        
        // Script Parameters
        const SPARAM_SAVEDSEARCH = 'custscript_emailautomation_inv_ss';
        const SPARAM_EMAIL_TEMPLATE = 'custscript_emailautomation_inv_template';
        const SPARAM_EMAILAUTHOR = 'custscript_emailautomation_inv_author';
        const SPARAM_SCRIPT = 'custscript_emailautomation_inv_script';
        const SPARAM_SCRIPTDEPLOYMENT = 'custscript_emailautomation_inv_dep';
        const SPARAM_FOLDER = 'custscript_emailautomation_inv_folder';
    
        const LOG_CACHE = 'EMAIL_AUTOMATION_CACHE';
    
        function getInputData() {
            let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_SAVEDSEARCH});
            if (SS_ID) {
                // Create a log record early in the process
                let LOG_REC = record.create({
                    type: "customrecord_ctc_emailsending_logs"
                });
                LOG_REC.setValue("custrecord_ctc_emailautomationlog_status", "In Progress");
                LOG_REC.setValue("custrecord_ctc_emailautomationlog_type", "Invoice");
                let LOG_ID = LOG_REC.save({ignoreMandatoryFields: true});
                log.debug("Log Id", LOG_ID);
    
                // Use cache to store log ID
                let logCache = cache.getCache({
                    name: LOG_CACHE,
                    scope: cache.Scope.PRIVATE
                });
                logCache.put({
                    key: 'log_id',
                    value: LOG_ID
                });
    
                return search.load({id: SS_ID});
            }
            return null;
        }
    
        function map(context) {
            try {
                let mapKey = context.key;
                let mapValues = JSON.parse(context.value);
                context.write({
                    key: mapKey,
                    value: mapValues
                });
            } catch (o_exception) {
                log.error('Map Error', o_exception);
            }
        }
    
        function reduce(context) {
            let reduceKey = context.key;
            let reduceValues = JSON.parse(context.values[0]);
            let entityId = reduceValues.values.entity.value;
            let entityName = reduceValues.values.entity.text;
            let documentNumber = reduceValues.values.tranid;
            let amount = reduceValues.values.amount;
            try {
                let scriptId = runtime.getCurrentScript().getParameter({name: SPARAM_SCRIPT});
                let scriptDeployment = runtime.getCurrentScript().getParameter({name: SPARAM_SCRIPTDEPLOYMENT});
    
                if (scriptId && scriptDeployment) {
                    let suiteletURL = url.resolveScript({
                        scriptId: scriptId,
                        deploymentId: scriptDeployment,
                        params: { "recID": reduceKey },
                        returnExternalUrl: true
                    });
    
                    let invoicePDF = https.post({ url: suiteletURL });
          
                    //Get Date for timestamp:
                    let dateTime = (new Date()).toJSON();
                    let pdfFileId = invoicePDF.body;    
                    let pdfFile = file.load({id: pdfFileId});

                    //Update the filename:
                    pdfFile.name = pdfFile.name + "_" + dateTime + ".pdf";
                    let newFileId = pdfFile.save();

                    let EMAIL_TEMPLATE = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
                    let EMAIL_AUTHOR = runtime.getCurrentScript().getParameter({name: SPARAM_EMAILAUTHOR});
    
                    if(EMAIL_TEMPLATE){
                        let mergeResult = render.mergeEmail({
                            templateId: EMAIL_TEMPLATE,
                            transactionId: parseInt(reduceKey)
                        });
        
                        email.send({
                            author: EMAIL_AUTHOR,
                            recipients: entityId,
                            subject: mergeResult.subject,
                            body: mergeResult.body,
                            attachments: [pdfFile],
                            relatedRecords: {
                                transactionId: reduceKey,
                                entityId: entityId
                            }
                        });
                    }
        
                    
                    context.write({
                        key: reduceKey,
                        value: {
                            transactionId: reduceKey,
                            transactionName: documentNumber,
                            entityId: entityId,
                            entityName: entityName,
                            amount: amount,
                            result: "SUCCESS"
                        }
                    });
                    log.debug("Email Sent", "To Entity: " + entityId);
                }
            } catch (o_exception) {
                log.error('Reduce Error', `${reduceKey}: Email not sent - ${o_exception.message}`);
                context.write({
                    key: reduceKey,
                    value: {
                        transactionId: reduceKey,
                        transactionName: documentNumber,
                        entityId: entityId,
                        entityName: entityName,
                        amount: amount,
                        result: "ERROR: " + o_exception.message
                    }
                });
            }
        }

        function summarize(context) {
            let logId = cache.getCache({
                name: LOG_CACHE
            }).get({key: 'log_id'});
    
            let logRecord = record.load({
                type: 'customrecord_ctc_emailsending_logs',
                id: logId,
                isDynamic: true
            });

            let ARR_MAP_KEYS = [];
            let totalSent = 0;
          
            try{
                 /* ********** Store All Keys from Map Stage ********** */            
               
                context.mapSummary.keys.iterator().each((key) => {
                    ARR_MAP_KEYS.push(key);
                    return true;
                });

                /* ********** Store All Reduce Errors per Key ********** */
                let OBJ_REDUCE_ERRORS = []
                context.reduceSummary.errors.iterator().each( (key, error) => {
                    OBJ_REDUCE_ERRORS.push(key +":" + error);
                        return true;
                    }
                );

                /* ********** Store All Output data ********** */
                let OBJ_OUTPUT = {}
                context.output.iterator().each((key, value) => {
                    OBJ_OUTPUT[key] = value
                    return true;
                });

                let processData = mergeAndFormat(OBJ_OUTPUT);
                totalSent = Number(ARR_MAP_KEYS.length) - Number(processData.totalError);

                var csvFile = createCSV(processData.data, processData.totalAmount);

                logRecord.setValue('custrecord_ctc_emailautomationlog_total', ARR_MAP_KEYS.length);
                logRecord.setValue('custrecord_ctc_emailautomationlog_sent', totalSent);
                logRecord.setValue('custrecord_ctc_emailautomationlog_csv', csvFile);
                logRecord.setValue('custrecord_ctc_emailautomationlog_amt', parseFloat(processData.totalAmount).toFixed(2));
                logRecord.setValue('custrecord_ctc_emailautomationlog_amtsnt', parseFloat(processData.amountSent).toFixed(2));
                logRecord.setValue('custrecord_ctc_emailautomationlog_status', 'Completed');

                if(processData.totalError > 0){
                    logRecord.setValue('custrecord_ctc_emailautomationlog_status', 'Completed with Errors');
                    logRecord.setValue('custrecord_ctc_emailautomationlog_error', processData.errorMessages.join("\n"));
                }
                logRecord.save({ignoreMandatoryFields: true});
            }
            catch(summarizeError){
                log.debug("Summarize Error", summarizeError);
                logRecord.setValue('custrecord_ctc_emailautomationlog_total', ARR_MAP_KEYS.length);
                logRecord.setValue('custrecord_ctc_emailautomationlog_sent', totalSent);
                logRecord.setValue('custrecord_ctc_emailautomationlog_csv', csvFile);
                logRecord.setValue('custrecord_ctc_emailautomationlog_status', 'Failed');
                logRecord.setValue('custrecord_ctc_emailautomationlog_error', JSON.stringify(summarizeError.message));
                logRecord.save({ignoreMandatoryFields: true});
            }
           
        }


        function mergeAndFormat(objOutput) {
            // Initialize an array to hold the output strings
            let results = [];
            let totalError = 0;
            let errorMessages = [];
            let totalAmountValue = 0;
            let totalAmountFailed = 0;
            log.debug("objOutput", objOutput);
        
            // Iterate over all keys in objOutput
            for (let outputKey in objOutput) {
                // Parse the JSON string (array of objects) and check each transaction
                let output = JSON.parse(objOutput[outputKey]);

                let result =  output.result;
                totalAmountValue = totalAmountValue + parseFloat(output.amount);
               
                log.debug("output", output);
                if(result != "SUCCESS"){
                    totalError++;
                    errorMessages.push(output.transactionId + "-" + output.entityId + ":" +result.replace("ERROR:",""));
                    totalAmountFailed = totalAmountFailed + parseFloat(output.amount);
                }
                let outputAmount = String(parseFloat(output.amount).toFixed(2));
                results.push(`${output.transactionId}, ${output.transactionName}, ${output.entityId}, ${output.entityName}, ${outputAmount}, ${result}`);
            }
        
            return {
                data: results,
                totalError: totalError,
                errorMessages: errorMessages,
                totalAmount: parseFloat(totalAmountValue),
                amountSent: parseFloat(totalAmountValue) - parseFloat(totalAmountFailed)
            };
        }

        function createCSV(dataArray, totalAmount) {
            let todayDate = new Date()
            todayDate = todayDate.toISOString().split('T')[0];
            let FOLDER_ID = runtime.getCurrentScript().getParameter({name: SPARAM_FOLDER});

            var fileObj = file.create({
                name: 'invoice_processing_results'+todayDate+'.csv',
                fileType: file.Type.CSV,
                folder: FOLDER_ID,
                isOnline: true
            });
            fileObj.appendLine({
                value: 'Record ID, Document Number, Entity ID, Entity Name, Amount, Result'  
            })

            for(var i = 0; i < dataArray.length; i++){
                fileObj.appendLine({value: dataArray[i]})
            }
          
            fileObj.appendLine({
                value: ", , , ,"+String(totalAmount)+",TOTAL"
            });

            let fileId = fileObj.save();
            log.debug("File Id", fileId);
            return fileId;
        }
    
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });
    