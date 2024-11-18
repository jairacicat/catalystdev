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
* 2.0          10.20.2024                  jaira@nscatalyst.com                 Use oracle's NS | SL | Vendor Settlement script
*/


define(['N/file', 'N/search', 'N/record', 'N/runtime', 'N/render', 'N/email', 'N/url', 'N/https', 'N/file', 'N/cache', 'N/task'], 
    function(file, search, record, runtime, render, email, url, https,file, cache, task) {

    
    const SPARAM_SAVEDSEARCH = 'custscript_emailautomation_ss';
    const SPARAM_EMAIL_TEMPLATE = 'custscript_emailautomation_emailtemplate';
    const SPARAM_EMAILAUTHOR = 'custscript_emailautomation_author';
    const SPARAM_SCRIPT = 'customscript_nscs_sl_vendor_settlement';
    const SPARAM_SCRIPTDEPLOYMENT = 'customdeploy_nscs_sl_vendor_settlement';
    const SPARAM_FOLDER = 'custscript_emailautomation_folder';
    const SPARAM_PDFS_CREATED = 'custscript_emailautomation_pdfs_created';
    const SPARAM_WEEK_OF_DATE = 'custscript_emailautomation_weekofdate';

    const LOG_CACHE = 'VENDOR_EMAIL_AUTOMATION_CACHE';

    // Use the getInputData function to return two strings.
    function getInputData()
    {
        try
        {
            let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_SAVEDSEARCH});
            if(SS_ID){
                // Create a log record early in the process
                let PDF_CREATED = runtime.getCurrentScript().getParameter({name: SPARAM_PDFS_CREATED});
                log.audit("PDF Crated", PDF_CREATED);
                if(PDF_CREATED == true || PDF_CREATED == "true"){
                    let LOG_ID = getLogId()
                    log.audit("LOG ID - sending Emails", LOG_ID);

                    let LOG_REC = record.load({
                        type: "customrecord_ctc_emailsending_logs",
                        id: LOG_ID
                    });
        
                    LOG_REC.setValue("custrecord_ctc_emailautomationlog_status", "Sending Emails");
                    LOG_ID = LOG_REC.save({ignoreMandatoryFields: true});

                    log.audit("Log record created updated - sending emails", LOG_ID);
                }
                else{
                    let LOG_REC = record.create({
                        type: "customrecord_ctc_emailsending_logs"
                    });
                    LOG_REC.setValue("custrecord_ctc_emailautomationlog_status", "In Progress");
                    LOG_REC.setValue("custrecord_ctc_emailautomationlog_type", "Vendor Statement");

                    let weekOfDate = runtime.getCurrentScript().getParameter({name: SPARAM_WEEK_OF_DATE});
                    log.debug("weekOFDate", weekOfDate);
                    if(weekOfDate == "" || weekOfDate == null) {
                        weekOfDate = getLastSaturdayDate();
                    }
                    log.debug("weekOFDate- after", weekOfDate);
                    LOG_REC.setValue("custrecord_ctc_emailautomationlog_weekof", weekOfDate);

                    let LOG_ID = LOG_REC.save({ignoreMandatoryFields: true});
                    log.audit("Log record created", LOG_ID);

                }

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
        let reduceValues = JSON.parse(context.values[0]);
        log.debug("reduceValues", reduceValues);

        try
        {
            let PDF_CREATED = runtime.getCurrentScript().getParameter({name: SPARAM_PDFS_CREATED});
            log.debug("PDF_CREATED", PDF_CREATED);
            let weekOfDate = runtime.getCurrentScript().getParameter({name: SPARAM_WEEK_OF_DATE});
            if(weekOfDate == "" || weekOfDate == null){
                weekOfDate = getLastSaturdayDate();
            }
            log.debug("weekOfDate - reduce", weekOfDate);
                
            if(PDF_CREATED || PDF_CREATED == 'true'){
                //Get the entityId and send email
                log.debug("Get entityId and send email");
                let entityId = reduceValues.entityName.split(" ")[0];

                let fileName = "vendor_settlement_" + entityId + "_" + weekOfDate;
                log.debug("filename", fileName);
                //Search for File in the File Cabinet:
                let fileId = getFile(fileName);
                
                log.debug("File ID", fileId);
                if(fileId){
                
                    let pdfFile = file.load({id: fileId});
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
                else{
                    context.write({
                        key: reduceKey,
                        value: {
                            transactions: context.values,
                            result: "ERROR: " + "No file found for this vendor.",
                        }
                    });
                }
            }
            else{
                //Update vendor record with statementDate = last saturday date;
                record.submitFields({
                    type: record.Type.VENDOR,
                    id: reduceKey,
                    values:{
                        'custentity_ctc_statement_date': weekOfDate,
                        'custentity_pdf_foremailsending': true
                    }
                });
                log.debug("Updated Vendor", reduceKey);
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
      
        let PDF_CREATED = runtime.getCurrentScript().getParameter({name: SPARAM_PDFS_CREATED});
        log.debug("PDF_CREATED", PDF_CREATED);
        if(PDF_CREATED || PDF_CREATED == 'true'){
            log.debug("PDFs already created", "Finish log record");
            
            let logId = getLogId()

            log.audit("Log ID - Finish Log Record", logId);
    
            let logRecord = record.load({
                type: 'customrecord_ctc_emailsending_logs',
                id: logId,
                isDynamic: true
            });
            
            let ARR_MAP_KEYS = [];
            let totalSent = 0;
    
            try{
              
                context.mapSummary.keys.iterator().each((key) => {
                    ARR_MAP_KEYS.push(key);
                    return true;
                });
    
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
            
        }else{
            //Call MR to create PDFs:
            let mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_nscs_mr_vendor_settlement',
                deploymentId: 'customdeploy_vendorsettlement_email',
                params: {
                    'custscript_calledbyemailautomation': true
                }
            });

            mrTask.submit();
            log.debug("Called MR script to create PDFs");

            let logId = getLogId();

            //Get last ID: 

            let logRecord = record.load({
                type: 'customrecord_ctc_emailsending_logs',
                id: logId,
                isDynamic: true
            });

            logRecord.setValue('custrecord_ctc_emailautomationlog_status', 'Generating Statement PDFs');
            let LOG_ID = logRecord.save({ignoreMandatoryFields: true});
        }
        
    }

    function getLogId(){
        var customrecord_ctc_emailsending_logsSearchObj = search.create({
            type: "customrecord_ctc_emailsending_logs",
            filters:
            [
               ["isinactive","is","F"], 
               "AND", 
               ["custrecord_ctc_emailautomationlog_type","is","Vendor Statement"], 
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

    function getLastSaturdayDate() {
        const today = new Date();
        const dayOfWeek = today.getDay();  // Get the current day of the week (0 is Sunday, 6 is Saturday)
        const lastSaturday = new Date(today);
    
        // Calculate the number of days to subtract to get to the last Saturday
        // If today is Sunday (0), we subtract 1 day, if Monday (1), we subtract 2 days, and so on.
        // If today is Saturday (6), we subtract 7 days to get to the previous Saturday.
        if (dayOfWeek === 0) {  // Special case for Sunday
            lastSaturday.setDate(today.getDate() - 8);
        } else {
            lastSaturday.setDate(today.getDate() - (dayOfWeek + 1));
        }

        log.debug("RETURNING - Date",lastSaturday.toLocaleDateString() )
    
        return lastSaturday.toLocaleDateString();  // Format date as string, or modify as needed
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

    // Link each entry point to the appropriate function.
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});