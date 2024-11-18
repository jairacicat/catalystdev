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
 * Project Number: 11298 - EPS Learning
 * Script Name: CTC | Send Email Confirmation UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 * 2.00         June 19, 2024               jaira@nscatalyst.com                    Remove beforeLoad and calling of suitelet. Put sending email logic on afterSubmit.
 *
 */

define(['N/render', 'N/email', 'N/record', 'N/search', 'N/runtime'],
    function(render, email, record, search, runtime) {
        const FLD_CONTACT_EMAIL = 'custbody_mhi_contact_email';
        const SPARAM_EMAILTEMPLATE = 'custscript_ctc_emailtemplate';
        const SPARAM_PDFTEMPLATE = 'custscript_ctc_pdftemplate';
        const SPARAM_EMAILAUTHOR = 'custscript_ctc_emailauthor';

        function afterSubmit(context) {
            try {
                if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY) {

                    const recordId = context.newRecord.id;
                    const recordType = context.newRecord.type;

                    //Load current record and get the sales order id
                    let CURRENT_RECORD = record.load({
                        type: recordType,
                        id: recordId
                    });

                    const salesOrderId = CURRENT_RECORD.getValue({
                        fieldId: 'createdfrom'
                    });

                    if(!isEmpty(salesOrderId)){
                        let SALES_ORDER = record.load({
                            type: record.Type.SALES_ORDER,
                            id: salesOrderId
                        });
                     
                        //Get the Contact's Email from the Sales Order
                        let contactEmail = search.lookupFields({
                            type: search.Type.SALES_ORDER,
                            id: salesOrderId,
                            columns: FLD_CONTACT_EMAIL
                        })[FLD_CONTACT_EMAIL];

                        if (isEmpty(contactEmail)) {
                            log.debug("No email sent -- blank contact email for IF: " + recordId);
                            return;
                        }

                        //Get Item Fulfillment values:
                        let packageCount = CURRENT_RECORD.getLineCount({sublistId: 'package'});
                        let trackingNumbers = [];
                        for(var i = 0; i < packageCount; i++){
                            trackingNumbers.push(CURRENT_RECORD.getSublistValue({sublistId: 'package', line: i, fieldId: 'packagetrackingnumber'}));
                        }
                        log.debug("Tracking Numbers", trackingNumbers);
                        let itemLines = getItemLines(salesOrderId);


                        //Render the PDF
                        const PDF_TEMPLATE_ID = runtime.getCurrentScript().getParameter({name: SPARAM_PDFTEMPLATE});

                        log.debug("PDF_TEMPLATE_ID", PDF_TEMPLATE_ID);
                        let renderer = render.create();
                        renderer.setTemplateById(PDF_TEMPLATE_ID); 

                        renderer.addRecord('record', SALES_ORDER);
                        renderer.addCustomDataSource({
                            format: render.DataSource.OBJECT,
                            alias: "customObject",
                            data: {
                                "trackingnumbers" : trackingNumbers,
                                "itemlines": itemLines,
                                "itemfulfillment": CURRENT_RECORD.getValue({fieldId: 'tranid'})
                            }
                        });

                        let renderedPDF = renderer.renderAsPdf();
                        renderedPDF.name = SALES_ORDER.getValue({fieldId: 'tranid'}) +  "-" + CURRENT_RECORD.getValue({fieldId: 'tranid'}) + ".pdf";

                        //Sending of Email to contact
                        let recipientId = CURRENT_RECORD.getValue({
                            fieldId: 'entity'
                        });

                        const EMAIL_TEMPLATE = runtime.getCurrentScript().getParameter({name: SPARAM_EMAILTEMPLATE});
                        const EMAIL_AUTHOR = runtime.getCurrentScript().getParameter({name: SPARAM_EMAILAUTHOR});
            
                        if(!isEmpty(EMAIL_TEMPLATE) && !isEmpty(EMAIL_AUTHOR)){

                            let mergeResult = render.mergeEmail({
                                templateId: EMAIL_TEMPLATE,
                                transactionId: parseInt(salesOrderId),
                                entity: {
                                    type: 'employee',
                                    id: -5
                                },
                                recipient: {
                                    type: 'customer',
                                    id: parseInt(recipientId)
                                }
                            });

                            email.send({
                                author: EMAIL_AUTHOR,
                                recipients: contactEmail,
                                subject: mergeResult.subject,
                                body: mergeResult.body,
                                attachments: [renderedPDF],
                                relatedRecords: {
                                    transactionId: recordId
                                }
                            });
                            log.debug("Email Sent!");
                       }
                    }

                  

                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function sendEmail(recipient, attachment){

        }

        function getItemLines(salesOrderId){
            var salesorderSearchObj = search.create({
                type: "salesorder",
                settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                filters:
                [
                   ["type","anyof","SalesOrd"], 
                   "AND", 
                   ["taxline","is","F"], 
                   "AND", 
                   ["shipping","is","F"], 
                   "AND", 
                   ["cogs","is","F"], 
                   "AND", 
                   ["internalidnumber","equalto",salesOrderId], 
                   "AND", 
                   ["mainline","is","F"]
                ],
                columns:
                [
                   search.createColumn({
                      name: "item",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "memo",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "quantity",
                      summary: "MAX"
                   }),
                   search.createColumn({
                      name: "quantityshiprecv",
                      summary: "MAX"
                   }),
                   search.createColumn({
                      name: "formulatext",
                      summary: "MAX",
                      formula: "replace(ns_concat({fulfillingtransaction.tranid}||'('||{fulfillingtransaction.trandate}||')'), ',', '<br />')"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "MAX",
                      formula: "{quantity} - {quantityshiprecv}"
                   })
                ]
             });
             let itemLines = [];
             salesorderSearchObj.run().each(function(result){
             
                var resultObject = {};
                resultObject["item"] = result.getText(result.columns[0]);
                resultObject["memo"] = result.getValue(result.columns[1]);
                resultObject["qty"] = result.getValue(result.columns[2]);
                resultObject["qtyshipped"] = result.getValue(result.columns[3]);
                resultObject["shippeddata"] = result.getValue(result.columns[4]);
                resultObject["qtyremaining"] = result.getValue(result.columns[5]);
                itemLines.push(resultObject);
                log.debug("item  line", itemLines);
                return true;
             });
             
             return itemLines;
        }

        function isEmpty(stValue) {
            return (
                (stValue === '' || stValue == null || stValue == undefined) || (stValue.constructor === Array && stValue.length == 0) || (stValue.constructor === Object && (
                    function(v) {
                        for (var k in v)
                            return false;
                        return true;
                    }
                )(stValue)));
        }

        return {
            afterSubmit: afterSubmit
        };
    });