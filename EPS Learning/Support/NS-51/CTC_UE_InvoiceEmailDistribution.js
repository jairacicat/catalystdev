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
 * Project Number: EPS Learning - NS-51 - Invoice Email Distribution
 * Script Name: CTC | Invoice Email Sending UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description This script sends an email to the Invoice's customer's contacts with AP Billing role upon creation of an Invoice.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         08.08.2024                  jaira@nscatalyst.com                    Initial Build
 * 2.00         08.20.2024                  jaira@nscatalyst.com                    Send email only if Customer's Invoice Delivery Method = EMAILED
 */

define(['N/record', 'N/email', 'N/search', 'N/render', 'N/runtime'],
    function(record, email, search, render, runtime) {

        const SPARAM_EMAIL_TEMPLATE = 'custscript_invoice_email_template';
        const SPARAM_EMAIL_AUTHOR = 'custscript_invoice_email_author';
        const SPARAM_INVOICE_DELIVERY_METHOD = 'custscript_invoice_del_method';

        const FLD_INVOICE_DELIVERY_METHOD = 'custentity_invoicedeliverymethod';

        function afterSubmit(context) {
            try {
                if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY){
                    let invoiceId = context.newRecord.id;
                    let customerId = context.newRecord.getValue({
                        fieldId: 'entity'
                    });

                    //Get the Invoice Delivery Method of the Customer
                    let invoiceDeliveryMethodLookup = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: customerId,
                        columns: [FLD_INVOICE_DELIVERY_METHOD]
                    });
                    log.debug("Invoice Delivery Method", invoiceDeliveryMethodLookup);
                    let invoiceDeliveryMethod = "";
                    try{
                        invoiceDeliveryMethod = invoiceDeliveryMethodLookup[FLD_INVOICE_DELIVERY_METHOD][0].value
                    }
                    catch(err){
                        log.error("No Invoice Delivery Method")
                        invoiceDeliveryMethod = "";
                    }
                    log.debug("Invoice Del Method value", invoiceDeliveryMethod);
  
                    const VAL_EMAILED = runtime.getCurrentScript().getParameter({name: SPARAM_INVOICE_DELIVERY_METHOD})
                    if(invoiceDeliveryMethod == VAL_EMAILED){
                        //Get the Contacts where Role = AP Billing
                        let contactEmails = getAPBillingContactEmails(customerId);
                        log.debug("Contact Emails", contactEmails);

                        //Render PDF and Send Email
                        let invoicePDF = render.transaction({
                            entityId: invoiceId,
                            printMode: render.PrintMode.PDF
                        });

                        //Send Email
                        let emailTemplateId = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_TEMPLATE});
                        if(emailTemplateId && contactEmails.length > 0){
                            let mergeResult = render.mergeEmail({
                                templateId: emailTemplateId,
                                transactionId: invoiceId
                            });

                            sendEmail(mergeResult, contactEmails, customerId, invoicePDF, invoiceId);
                            
                        }
                    }


                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function sendEmail(mergeResult, contactEmails, customerId, invoicePDF, invoiceId){
            let senderId = runtime.getCurrentScript().getParameter({name: SPARAM_EMAIL_AUTHOR});

            email.send({
                author: senderId,
                recipients: contactEmails,
                subject: mergeResult.subject,
                body: mergeResult.body,
                attachments: [invoicePDF],
                relatedRecords: {
                    entityId: customerId,
                    transactionId: invoiceId
                },
                replyTo: "apbilling@epslearning.com"
            });

            log.debug('Email Sent')
        }

        function getAPBillingContactEmails(customerId){
            let contactEmails = [];
            if(customerId){
                var contactSearchObj = search.create({
                    type: "contact",
                    filters:
                    [
                       ["isinactive","is","F"], 
                       "AND", 
                       ["email","isnotempty",""], 
                       "AND", 
                       ["role","anyof","8"],
                       "AND", 
                       ["company","anyof", customerId]
                    ],
                    columns:
                    [
                       "company",
                       "entityid",
                       "email"
                    ]
                 });
                 contactSearchObj.run().each(function(result){
                    contactEmails.push(result.getValue({name: 'email'}));
                    return true;
                 });
            }
            return contactEmails;
        }

        return {
            afterSubmit: afterSubmit
        };
    });