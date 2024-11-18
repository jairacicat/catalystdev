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
 * Project Number: Sentinel - Invoice and Credit Memo Advanced HTML form customizations
 * Script Name: CTC - Attach Invoice PDF SL
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 8, 2024              jaira@nscatalyst.com                    Initial Build
 * 2.00         August 31, 2024             jaira@nscatalyst.com                    Update pdf search to include credit memo
 * 3.00         Sept 30, 2024               jaira@nscatalyst.com                    Add logic for non-SuiteBilling/non-Service Tickets Invoice
 */
 
define(['N/search', 'N/url', 'N/runtime', 'N/file'], 
    function(search, url, runtime, file) 
    {
        const FLD_INVOICE_ATTACHMENT = 'custbody_so_invoice_body_attachment';

        let URL_DOMAIN = '';
       
        function onRequest(context) 
        {
            try
            {
                const request = context.request;
                const invoiceType = context.request.parameters.type;
                const invoiceId = context.request.parameters.invoice;

                //Get URL Domain of NS account
                URL_DOMAIN = getURLDomain();
                log.debug("URL_DOMAIN", URL_DOMAIN);

                //If Invoice Type = Service, attach all PDFs in the Invoice's Files tab.
                if(invoiceType == 'service'){
                    let returnXML = "&nbsp;";
                    log.debug("Service - Invoice ID", invoiceId);

                    if(invoiceId){
                        let pdfsOnInvoice = getPDFsOnInvoice(invoiceId);
                        log.debug("PDFS on Invoice", pdfsOnInvoice);
                        if(pdfsOnInvoice.length > 0){
                            for(var i = 0; i < pdfsOnInvoice.length; i++){
                                var cleanURL = pdfsOnInvoice[i].replaceAll('&', '&amp;');
                                returnXML = returnXML + "<pdf src='"+URL_DOMAIN+cleanURL+"'></pdf>";
                            }
                        }
                    }
                    log.debug("returnXML", returnXML);

                    context.response.write(returnXML);

                }

                //If Invoice Type = SuiteBilling, get Invoice PDF from the FileCabinet folder.
                //Get the filename from the field 
                else if(invoiceType == 'suitebilling'){
                    let returnXML = "";
                    const attachmentTextLookup = search.lookupFields({
                        type: search.Type.INVOICE,
                        id: invoiceId,
                        columns: FLD_INVOICE_ATTACHMENT
                    });
                    const attachmentText = attachmentTextLookup[FLD_INVOICE_ATTACHMENT];
                    log.debug("SuiteBilling - Invoice ID", invoiceId);
                    log.debug("SuiteBilling - Attachment Text", attachmentText);

                    if(invoiceId && attachmentText){
                        let pdfToAttach = getPDFFromFileCabinet(formatString(attachmentText));
                        log.debug("PDF to Attach", pdfToAttach);
                        if(pdfToAttach != ''){
                            var cleanURL = pdfToAttach.replaceAll('&', '&amp;');
                            log.debug("cleanURL", cleanURL);
                            returnXML = returnXML + "<pdf src='"+URL_DOMAIN+cleanURL+"'></pdf>";
                        }
                    }
                    log.debug("returnXML", returnXML);

                    context.response.write(returnXML);

                }
                else{
                    let returnXML = "";
                    let attachmentText = "";

                    //Get Related Transactions:
                    let transactionTexts = getRelatedTransactions(invoiceId);
                    log.debug("transactionTexts", transactionTexts);

                    if(invoiceId && transactionTexts){
                        let pdfToAttach = getPDFFromFileCabinet2(transactionTexts);
                        log.debug("PDF to Attach", pdfToAttach);
                        if(pdfToAttach != ''){
                            var cleanURL = pdfToAttach.replaceAll('&', '&amp;');
                            returnXML = returnXML + "<pdf src='"+URL_DOMAIN+cleanURL+"'></pdf>";
                        }
                    }
                    log.debug("returnXML", returnXML);

                    context.response.write(returnXML);
                }
            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
                context.response.write("&nbsp;");
            }
        }

        function getURLDomain(){
            let accountId = runtime.accountId;
            let scheme = "https://";
            let host = url.resolveDomain({
                hostType: url.HostType.APPLICATION,
                accountId: accountId
            });

            return scheme + host;
        }

        function formatString(input) {
            // Replace all spaces and dashes with '%'
            let formattedString = input.replace(/[\s-]/g, '%');
            
            // Add '%' before and after the string
            return '%' + formattedString + '%';
        }    

        function getRelatedTransactions(invoiceId){
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                [
                   ["type","anyof","CustInvc"], 
                   "AND", 
                   ["mainline","is","T"], 
                   "AND", 
                   ["custbody_sti_invoice_type","noneof",["5","6"]],
                   "AND",
                   ["internalid", "anyof", invoiceId]
                ],
                columns:
                [
                    "tranid",
                    "custbody_sti_invoice_type",
                    search.createColumn({
                    name: "tranid",
                    join: "createdFrom",
                    label: "Document Number"
                    }),
                    search.createColumn({
                        name: "tranid",
                        join: "opportunity",
                        label: "Document Number"
                    })
                ]
             });
             let relatedTransactions = {"salesorder": "", "opportunity": ""};
             invoiceSearchObj.run().each(function(result){
                relatedTransactions.salesorder = result.getValue({name: "tranid", join: "createdFrom"});
                relatedTransactions.opportunity = result.getValue({name: "tranid", join: "opportunity"});
                if(relatedTransactions.opportunity != ""){
                    relatedTransactions.opportunity = "OP" + relatedTransactions.opportunity;
                }
                return false;
             });
             return relatedTransactions;
        }

        function getPDFsOnInvoice(invoiceId){
            let pdfAttachments = [];

            try{
                var invoiceSearchObj = search.create({
                    type: "transaction",
                    filters:
                    [
                       ["type","anyof",["CustInvc","CustCred"]], 
                       "AND", 
                       ["mainline","is","T"], 
                       "AND", 
                       ["internalid","anyof", invoiceId], 
                       "AND", 
                       ["file.filetype","anyof","PDF"]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "name",
                          join: "file"
                       }),
                       search.createColumn({
                          name: "internalid",
                          join: "file"
                       }),
                       search.createColumn({
                          name: "url",
                          join: "file"
                       })
                    ]
                 });

                 invoiceSearchObj.run().each(function(result){
                    let pdfId = result.getValue({
                        name: 'internalid',
                        join: 'file'
                    });

                    if(pdfId){
                        let pdfFile = file.load({id: pdfId});
                        pdfFile.isOnline = true;
                        let newPdfId = pdfFile.save();
                        log.debug("Updated File", newPdfId);
                    }

                    var pdfURL = result.getValue({ name: 'url', join: 'file'});
                    pdfAttachments.push(pdfURL);
                    return true;
                 });
            }
            catch(e){
                log.error("Error in getting PDF attachments on Invoice " + invoiceId, e);
            }
           
            return pdfAttachments;
        }

        function getPDFFromFileCabinet(tranid){
            let pdfURL = '';
            log.debug("Get PDF File From Cabinet", tranid)
            try{
                    var fileSearchObj = search.create({
                        type: "file",
                        filters:
                        [
                        ["name","contains",tranid], 
                        "AND", 
                        ["filetype","anyof","PDF"]
                        ],
                        columns:
                        [
                        "name",
                        "url",
                        "filetype"
                        ]
                    });

                    fileSearchObj.run().each(function(result){
                        let pdfId = result.id;
                        log.debug("PDF ID", pdfId);
                        if(pdfId){
                            pdfFile = file.load({
                                id: pdfId
                            });
                            pdfFile.isOnline = true;
                            let pdfNewId = pdfFile.save();
                            log.debug("Updated PDF File to Available Without Login", pdfNewId);
                        }

                        pdfURL = result.getValue({name: 'url'});
                        return false;
                    });
            }
            catch(e){
                log.error("Error in retrieving PDF from File Cabinet - " + tranid, e);
            }

            log.debug("PDF URL", pdfURL)
            
            return pdfURL;
        }

        function getPDFFromFileCabinet2(documentNumbers){
            let pdfURL = '';
            log.debug("Get PDF File From Cabinet - nonsuitebilling, nonservice tickets", documentNumbers)
            try{
                let conditionArray = [];
                if(documentNumbers.opportunity != ""){
                    conditionArray.push(["name","contains", documentNumbers.opportunity + "%Invoice Detail%"]);
                }
                if(documentNumbers.salesorder != ""){
                    conditionArray.push(["name","contains", documentNumbers.salesorder + "%Invoice Detail%"]);
                }
                if(conditionArray.length > 1){
                    conditionArray.splice(1, 0, "OR");
                }
                var fileSearchObj = search.create({
                    type: "file",
                    filters:
                    [
                       [conditionArray], 
                       "AND", 
                       ["filetype","anyof","PDF"], 
                       "AND", 
                       ["folder","anyof",["1621","1622"]]
                    ],
                    columns:
                    [
                       "name",
                       "url",
                       "filetype",
                       "folder"
                    ]
                 });

                    fileSearchObj.run().each(function(result){
                        let pdfId = result.id;
                        log.debug("PDF ID", pdfId);
                        if(pdfId){
                            pdfFile = file.load({
                                id: pdfId
                            });
                            pdfFile.isOnline = true;
                            let pdfNewId = pdfFile.save();
                            log.debug("Updated PDF File to Available Without Login", pdfNewId);
                        }

                        pdfURL = result.getValue({name: 'url'});
                        return false;
                    });
            }
            catch(e){
                log.error("Error in retrieving PDF from File Cabinet - " + tranid, e);
            }

            log.debug("PDF URL", pdfURL)
            
            return pdfURL;
        }
             
        return {
            onRequest: onRequest
        };  
    }); 