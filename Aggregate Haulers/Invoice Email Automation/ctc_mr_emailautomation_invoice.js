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
    * 1.00         08.14.2024                  jaira@nscatalyst.com                 Initial Build
    * 1.1          09.12.2024                  jaira@nscatalyst.com                 Update log record and log file to add Amount
    * 1.2          10.24.2024                  jaira@nscatalyst.com                 Add PDF Email Sent Date logic
    * 2.0          11.08.2024                  jaira@nscatalyst.com                 Add logic for generating invoice pdf thru MR                                                                        - on saved search, add this as criteria (PDF email sent date is empty)
    */

    define(['N/file', 'N/search', 'N/record', 'N/runtime', 'N/email', 'N/url', 'N/https', 'N/cache', 'N/log', 'N/render', 'N/task'], 
        function(file, search, record, runtime, email, url, https, cache, log, render, task) {
        
        // Script Parameters
        const SPARAM_SAVEDSEARCH = 'custscript_emailautomation_inv_ss';
        const SPARAM_EMAIL_TEMPLATE = 'custscript_emailautomation_inv_template';
        const SPARAM_EMAILAUTHOR = 'custscript_emailautomation_inv_author';
        const SPARAM_FOLDER = 'custscript_emailautomation_inv_folder';;
    
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
                log.debug("Log record created", LOG_ID);
               
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
            log.debug("REDUCE - ", reduceValues);
            let entityId = reduceValues.values.entity.value;
            let entityName = reduceValues.values.entity.text;
            let documentNumber = reduceValues.values.tranid;
            let amount = reduceValues.values.amount;
           
            try {
                //Call scheduled script to create the file:
                let invTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 'customscript_nscs_ss_inv_print',
                    deploymentId: 'customdeploy_ss_printinvoice_email',
                    params: {
                        custscript_nscs_inv_rec_id: reduceKey
                    }
                });
                let invTaskId = invTask.submit();

                let taskStatus = task.checkStatus({taskId: invTaskId});
                log.debug("taskStatus", taskStatus.status);
                log.debug("taskStatus check", taskStatus.status == "COMPLETE");
                while(taskStatus.status != "COMPLETE" || taskStatus.status != "FAILED"){

                    taskStatus = task.checkStatus({taskId: invTaskId});
                    if(taskStatus.status == "COMPLETE" || taskStatus.status == "FAILED"){
                        break;
                    }
                }
                log.debug("Task Status is complete");
                //Get File ID of created Invoice PDF

                let fileName = documentNumber + "_PDF";
                let fileId = getFile(fileName);
                log.debug("File ID", fileId);
                if(fileId){
                   
                    let pdfFile = file.load({id: fileId});
                    let fileURL = "";
                    log.debug("File Size", pdfFile.size);
                    let fileAttachments = [pdfFile];
                    if(pdfFile.size > 10000000){
                        log.debug("File too big for email");
                        pdfFile.isOnline = true;
                        pdfFile.save();
                        pdfFile = file.load({id: fileId});
                        fileURL = pdfFile.url;
                        fileAttachments = [];
                    }

                    log.debug("fileURL", fileURL);

                    let EMAIL_TEMPLATE = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
                    let EMAIL_AUTHOR = runtime.getCurrentScript().getParameter({name: SPARAM_EMAILAUTHOR});

                    if(EMAIL_TEMPLATE){
                        let mergeResult = render.mergeEmail({
                            templateId: EMAIL_TEMPLATE,
                            transactionId: parseInt(reduceKey)
                        });

                        let mergeBody = mergeResult.body;
                        if(fileURL != ""){
                            mergeBody = mergeBody.replace("We appreciate your business and the opportunity to work with you. ","You may access your Invoice through this <a href = '"+fileURL+"'> link</a>. <br /> <br />We appreciate your business and the opportunity to work with you. ")
                        }
                      
                        log.debug("MergeBody", mergeBody)
        
                        email.send({
                            author: EMAIL_AUTHOR,
                            recipients: entityId,
                            subject: mergeResult.subject,
                            body:  mergeBody,
                            attachments: fileAttachments,
                            relatedRecords: {
                                transactionId: reduceKey,
                                entityId: entityId
                            }
                        });
                    }
        
                    //Update date sent field:
                    record.submitFields({
                        type: record.Type.INVOICE,
                        id: reduceKey,
                        values: {
                            'custbody_pdfemailsentdate' : (new Date()).toLocaleDateString(),
                            'custbody_pdf_foremailsending': false,
                            'custbody_nscs_high_vol_inv': false
                        }
                    });

                    
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

         
            let logId = getLogId();
                log.audit("Log ID - Finish Log Record", logId);

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
                        logRecord.setValue('custrecord_ctc_emailautomationlog_error', processData.errorMessages.join("\n").substring(0, 4000));
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

        function getLogId(){
            var customrecord_ctc_emailsending_logsSearchObj = search.create({
                type: "customrecord_ctc_emailsending_logs",
                filters:
                [
                   ["isinactive","is","F"], 
                   "AND", 
                   ["custrecord_ctc_emailautomationlog_type","is","Invoice"], 
                   "AND", 
                   ["custrecord_ctc_emailautomationlog_status","doesnotcontain","COMPLETE"]
                ],
                columns:
                [
                   search.createColumn({
                      name: "internalid",
                      summary: "MAX"
                   })
                ]
             });
             let logId = "";
             customrecord_ctc_emailsending_logsSearchObj.run().each(function(result){
                logId = result.getValue({name: 'internalid', summary: "MAX"})
                return false;
             });
    
             return logId;
          
        }

        function getFile(fileName){
            let fileId = "";
            try{
                var fileSearchObj = search.create({
                    type: "file",
                    filters:
                    [
                    ["name","is", fileName]
                    ],
                    columns:
                    [
                    "name"
                    ]
                });
                
              
                fileSearchObj.run().each(function(result){
                    fileId = result.id;
                    return false;
                });
                
            }
            catch(err){
                log.error("No file found");
            }
            return fileId;
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
    