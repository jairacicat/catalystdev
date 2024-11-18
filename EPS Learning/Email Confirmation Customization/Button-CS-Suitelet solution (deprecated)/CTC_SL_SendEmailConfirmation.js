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
 * Script Name: 
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/render', 'N/email', 'N/record', 'N/search'],
    function(render, email, record, search) {

        const FORM_SALESORDER = 273;
        const FORM_ITEMFULFILLMENT = 275;
        const EMAIL_TEMPLATE = 25;
        const EMAIL_AUTHOR = 941541;
        const FLD_CONTACT_EMAIL = 'custbody_mhi_contact_email';

        function onRequest(context) {
            try {
                //Get Parameters:
                let recordId = parseInt(context.request.parameters.tranid);
                let recordType = context.request.parameters.type;

                log.debug("recordId", recordId);
                log.debug("recordType", recordType);
                //Check Record Type


                //Load Record:
                let transactionRecord = record.load({
                    type: recordType,
                    id: recordId
                });
             
                let renderedPDF;
                let contactEmail = '';
                if(recordType == 'salesorder'){
                    renderedPDF = render.transaction({
                        entityId: recordId,
                        printMode: render.PrintMode.PDF,
                        formId: FORM_SALESORDER
                    });

                    contactEmail = transactionRecord.getValue({fieldId: FLD_CONTACT_EMAIL});
                }
                else if(recordType == 'itemfulfillment'){
                    renderedPDF = render.packingSlip({
                        entityId: recordId,
                        printMode: render.PrintMode.PDF,
                        formId: FORM_ITEMFULFILLMENT
                    });

                    const salesOrder = transactionRecord.getValue({fieldId: 'createdfrom'});
                    contactEmail = search.lookupFields({
                        type: search.Type.SALES_ORDER,
                        id: salesOrder,
                        columns: FLD_CONTACT_EMAIL
                    })[FLD_CONTACT_EMAIL];
                    
                }
                log.debug("contactEmail", contactEmail);

                if(contactEmail == "" || contactEmail == null){
                    context.response.write(JSON.stringify({"ok": false}));
                }

                let recipientId = transactionRecord.getValue({fieldId: 'entity'});

                log.debug("recipientId", recipientId);
                

                let mergeResult = render.mergeEmail({
                    templateId: EMAIL_TEMPLATE,
                    transactionId: parseInt(recordId),
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
                context.response.write(JSON.stringify({"ok": true}));

                
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
                context.response.write(JSON.stringify({"ok": false}));
            }
        }

        return {
            onRequest: onRequest
        };
    });