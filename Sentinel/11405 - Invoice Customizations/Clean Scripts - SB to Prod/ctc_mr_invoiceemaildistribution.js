
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
* Project Number: Sentinel #11405 - Invoice and Credit Memo Customizations
* Script Name: CTC - Invoice Email Distribution MR
* Author: jaira@nscatalyst.com
* @NApiVersion 2.1
* @NScriptType MapReduceScript
* @Description This will batch send Invoice emails at 1am.
*
* CHANGELOGS
*
* Version      Date                        Author                                  Remarks
* 1.00         08.14.2024                  jaira@nscatalyst.com            Initial Build
*
*/


define(['N/file', 'N/search', 'N/record', 'N/runtime', 'N/render', 'N/email'], 
    function(file, search, record, runtime, render, email) {
    const SPARAM_INVOICE_SS = 'custscript_ctc_invoice_ss';
    const SPARAM_EMAIL_AUTHOR = 'custscript_ctc_invoice_emailauthor';
    const SPARAM_EMAIL_TEMPLATE = 'custscript_ctc_invoice_emailtemplate';
    const SPARAM_RECORD_TYPE = 'custscript_ctc_recordtype';
    const SPARAM_INVOICE_ID = 'custscript_ctc_invoice_id';

    // Use the getInputData function to return two strings.
    function getInputData()
    {
        try
        {
            let INV_ID = runtime.getCurrentScript().getParameter({name: SPARAM_INVOICE_ID});
            if(INV_ID){
                let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_INVOICE_SS});
                let searchObj = search.load({
                    id: SS_ID
                });

                let newFilters = [];
                let invoiceIdFilter = search.createFilter({
                    name: 'internalid',
                    operator: 'anyof',
                    values: INV_ID,
                });

                let mainLineFilter = search.createFilter({
                    name: 'mainline',
                    operator: 'is',
                    values: 'T'
                });
                newFilters.push(invoiceIdFilter);
                newFilters.push(mainLineFilter);

                searchObj.filters = newFilters;

                log.debug("WITH INVOICE ID -- ", searchObj);
                return searchObj;
            }
            else{
                let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_INVOICE_SS});
                log.debug("Get Input Data - SS_ID", SS_ID);
                if(SS_ID){
                    return search.load({id: SS_ID});
                }
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
            const invoiceId = parseInt(context.key);
            let mapValues = JSON.parse(context.value).values;
            log.debug("mapKey", invoiceId);
            log.debug("mapValues", mapValues);

            //get customer emails:
            const customerId = parseInt(mapValues.entity.value);
            const toEmail = mapValues["custentity_sti_to_invoice_emails.customerMain"].split(",").filter(i => i);
            const ccEmail = mapValues["custentity_sti_cc_invoice_emails.customerMain"].split(",").filter(i => i);
            const bccEmail = mapValues["custentity_sti_bcc_invoice_emails.customerMain"].split(",").filter(i => i);
            const invoiceEmailTo = mapValues["custbody_ctc_emailinvoiceto"].split(",").filter(i => i);
            const tranId = mapValues.tranid;

            //Render Invoice PDF:
            let invoicePDF = render.transaction({
                entityId: invoiceId,
                printMode: render.PrintMode.PDF
            });
           
            //Send Email
            let emailTemplateId = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
            if(emailTemplateId){
                let mergeResult = render.mergeEmail({
                    templateId: emailTemplateId,
                    transactionId: invoiceId
                });

                sendEmail(toEmail, ccEmail, bccEmail, invoiceEmailTo, customerId, invoicePDF, invoiceId, tranId, mergeResult)
                
            }

        
            const recordType = runtime.getCurrentScript().getParameter({name: SPARAM_RECORD_TYPE});
            //Update Invoice:
            record.submitFields({
                type: recordType,
                id: invoiceId,
                values: {
                    "custbody_ctc_invoice_email_sent" : true
                },
                ignoreMandatoryFields: true
            })
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

    function sendEmail( toEmail, ccEmail, bccEmail, invoiceEmailTo, customerId, invoicePDF, invoiceId, tranid, mergeResult){
        let senderId = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_AUTHOR});
        let EMAIL_TEMPLATE = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
        let emailObject = {
            author: senderId,
            subject: mergeResult.subject,
            body: mergeResult.body,
            attachments: [invoicePDF],
            relatedRecords: {
                entityId: customerId,
                transactionId: invoiceId
            },
            replyTo: "SentinelAR@Sentinel.com"
        };


        if(invoiceEmailTo != ""){
            emailObject["recipients"] = invoiceEmailTo;
         
        }else{
            if(toEmail.length == 0){
                toEmail = ["SentinelAR@sentinel.com"]
            }
            
            if(toEmail != "" || toEmail.length > 0){
                emailObject["recipients"] = toEmail;
            }
            if(ccEmail.length > 0){
                emailObject["cc"] = ccEmail;
            }
            if(bccEmail.length > 0){
                emailObject["bcc"] = bccEmail
            }
        }
       
        email.send(emailObject);
        log.debug('Email Sent')
    }


   
    // The reduce function is invoked one time for each of the key/value pairs
    // provided.
    function reduce(context) 
	{
        try
        {

        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

    // The summarize stage is a serial stage, so this function is invoked only one time.
    function summarize(context) 
	{
        try
        {

        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

    // Link each entry point to the appropriate function.
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});