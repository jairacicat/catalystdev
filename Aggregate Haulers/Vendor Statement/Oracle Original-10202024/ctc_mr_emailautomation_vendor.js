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
*/


define(['N/file', 'N/search', 'N/record', 'N/runtime', 'N/render', 'N/email', 'N/url', 'N/https', 'N/file', 'N/cache'], 
    function(file, search, record, runtime, render, email, url, https,file, cache) {

    
    const SPARAM_SAVEDSEARCH = 'custscript_emailautomation_ss';
    const SPARAM_EMAIL_TEMPLATE = 'custscript_emailautomation_emailtemplate';
    const SPARAM_EMAILAUTHOR = 'custscript_emailautomation_author';
    const SPARAM_SCRIPT = 'custscript_emailautomation_script';
    const SPARAM_SCRIPTDEPLOYMENT = 'custscript_emailautomation_scriptdep';
    const SPARAM_FOLDER = 'custscript_emailautomation_folder';

    const LOG_CACHE = 'EMAIL_AUTOMATION_CACHE';

    // Use the getInputData function to return two strings.
    function getInputData()
    {
        try
        {
            let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_SAVEDSEARCH});
            if(SS_ID){
                // Create a log record early in the process
                let LOG_REC = record.create({
                    type: "customrecord_ctc_emailsending_logs"
                });
                LOG_REC.setValue("custrecord_ctc_emailautomationlog_status", "In Progress");
                LOG_REC.setValue("custrecord_ctc_emailautomationlog_type", "Vendor Statement");

                let LOG_ID = LOG_REC.save({ignoreMandatoryFields: true});
    
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
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
        return "";
    }

    // The map function is invoked one time for each key/value pair. Each time the
    // function is invoked, the relevant key/value pair is made available through
    // the context.key and context.value properties.
    function map(context) 
	{
        try
        {
            let mapKey = context.key;
            let mapValues = JSON.parse(context.value);

            let entityId = mapValues.values["entity"].value;
            let entityName = mapValues.values["entity"].text;
            let documentNumber = mapValues.values["tranid"];
            let amount = mapValues.values["amount"];
          
            //Group by Vendor ID:
            context.write({
                key: entityId,
                value: JSON.stringify({
                    "transactionId": mapKey,
                    "transactionName" : documentNumber,
                    "entityId" : entityId,
                    "entityName" : entityName,
                    "amount" : amount
                })
            });
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

   
    // The reduce function is invoked one time for each of the key/value pairs
    // provided.
    function reduce(context) 
	{
        let reduceKey = context.key;
        try
        {
            let scriptId = runtime.getCurrentScript().getParameter({name: SPARAM_SCRIPT});
            let scriptDeployment = runtime.getCurrentScript().getParameter({name: SPARAM_SCRIPTDEPLOYMENT});

            if(scriptId && scriptDeployment){
                let suiteletURL = url.resolveScript({
                    scriptId: scriptId,
                    deploymentId: scriptDeployment,
                    params: {
                        "vendorId" : reduceKey
                    },
                    returnExternalUrl: true
                });
    
                //Render PDF
                let settlementPDF = https.post({
                    url: suiteletURL
                });

                //Get Date for timestamp:
                let dateTime = (new Date()).toJSON();
    
                let pdfFileId = (settlementPDF.body);
                let pdfFile = file.load({id: pdfFileId});
                log.debug("pdfFile", pdfFile);
                
                //Update the filename:
                pdfFile.name = pdfFile.name + "_" + dateTime + ".pdf";
                let newFileId = pdfFile.save();
                log.debug("newFileId", newFileId);

                //Get Email Template:
                let EMAIL_TEMPLATE = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
                let EMAIL_AUTHOR = runtime.getCurrentScript().getParameter({name: SPARAM_EMAILAUTHOR});

                if(EMAIL_TEMPLATE){
                    let mergeResult = render.mergeEmail({
                        templateId: EMAIL_TEMPLATE,
                        entity: {
                            type: 'vendor',
                            id: parseInt(reduceKey)
                        }
                    });

                    log.debug("mergeResult", mergeResult);
    
                    email.send({
                        author: EMAIL_AUTHOR,
                        recipients: reduceKey,
                        subject: mergeResult.subject,
                        body: mergeResult.body,
                        attachments: [pdfFile],
                        relatedRecords: {
                            entityId: parseInt(reduceKey)
                        }
                    });
                    log.debug("Email Sent", reduceKey);
                    
                    context.write({
                        key: reduceKey,
                        value: 
                        {
                            transactions: context.values,
                            result: "SUCCESS"
                        }
                    });
                }
            }
            
            
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
            context.write({
                key: reduceKey,
                value: {
                    transactions: context.values,
                    result: "ERROR: " + o_exception.message,
                }
            });
        }
    }

    // The summarize stage is a serial stage, so this function is invoked only one time.
    function summarize(context) 
	{
      
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

            /* ********** Store All Output data from Reduce Stage ********** */
            let OBJ_OUTPUT = {}
            context.output.iterator().each((key, value) => {
                OBJ_OUTPUT[key] = value;
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
    
        // Iterate over all keys in objOutput
        for (let outputKey in objOutput) {
            // Parse the JSON string (array of objects) and check each transaction
            let output = JSON.parse(objOutput[outputKey]);
            let transactions = output.transactions;
            let result =  output.result;
           
            transactions.forEach(transactionStr => {
                let transactionObj = JSON.parse(transactionStr);
                totalAmountValue = totalAmountValue + parseFloat(transactionObj.amount);
                if(result != "SUCCESS"){
                    totalError++;
                    errorMessages.push(transactionObj.transactionId + "-" + transactionObj.entityId + ":" +result.replace("ERROR:",""))
                    totalAmountFailed = totalAmountFailed + parseFloat(transactionObj.amount)
                }
                let outputAmount = String(parseFloat(transactionObj.amount).toFixed(2));
                results.push(`${transactionObj.transactionId}, ${transactionObj.transactionName}, ${transactionObj.entityId}, ${transactionObj.entityName}, ${outputAmount}, ${result}`);
                
            });
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

        let folderId = runtime.getCurrentScript().getParameter({name: SPARAM_FOLDER});

        var fileObj = file.create({
            name: 'vendorstatementresults-'+todayDate+'.csv',
            fileType: file.Type.CSV,
            folder: folderId,
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
        return fileId;
    }

    // Link each entry point to the appropriate function.
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});