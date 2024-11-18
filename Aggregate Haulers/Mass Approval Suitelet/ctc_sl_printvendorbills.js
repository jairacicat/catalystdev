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
 * Project Number: Aggregate Haulers - Mass VB Approval
 * Script Name: CTC - Print Vendor Bills SL
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description Outputs a single PDF of all passed vendor bill ids
 * 
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         Oct 8, 2024                 jaira@nscatalyst.com                    Initial Build
 *
 */
 /**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define(['N/render', 'N/record', 'N/file', 'N/log', 'N/https', 'N/xml', 'N/task', 'N/url'],
    function(render, record, file, log, https, xml, task, url) {
        const SPARAM_SETTLEMENT_SCRIPT = 'customscript_nscs_sl_vendor_settlement';
        const SPARAM_SETTLEMENT_DEPLOYMENT = 'customdeploy_nscs_sl_vendor_settlement'
    
        function onRequest(context) {
            if (context.request.method === 'GET') {
                try {
                    // Parse the list of Vendor Bill IDs from URL parameters
                    var vendorId = context.request.parameters.vendorId;
                    var billIds = context.request.parameters.billIds;
                    if (!billIds) {
                        context.response.write('No Vendor Bill IDs provided.');
                        return;
                    }
    
                    // Convert the comma-separated list to an array
                    var billIdArray = billIds.split(',');
                    let fileIds = [];
    
                    // Create a PDF renderer for the final output
                    var finalPdf = render.create();
                    var templateContent = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">'
                    templateContent += '<pdfset>';

                    let settlementURL = url.resolveScript({
                        deploymentId: SPARAM_SETTLEMENT_DEPLOYMENT,
                        scriptId: SPARAM_SETTLEMENT_SCRIPT,
                        params: {
                            "custpage_int_id": vendorId,
                            "fromMassApproval": true,
                            
                        },
                        returnExternalUrl: true
                    });

                    log.debug("settlementURL", settlementURL);
    
                    //Render PDF
                    let settlementPDF = https.post({
                        url: settlementURL
                    });
                    log.debug("Settlement PDF", settlementPDF);

                    let pdfFileId = (settlementPDF.body);
                    log.debug("pdfFileId", pdfFileId);

                    try{
                        let pdfFileUrl = file.load({id: pdfFileId}).url;
                        log.debug("pdfFile", pdfFileUrl);
                        templateContent += '<pdf src="'+ escapeAmpersands(pdfFileUrl)+'"> </pdf>';
    
                        // Loop through each Vendor Bill ID and generate its PDF
                        for (var i = 0; i < billIdArray.length; i++) {
                            var billId = billIdArray[i].trim();
                            if (billId) {
                                // Load the individual Vendor Bill record
                                var vendorBillPdf = render.transaction({
                                    entityId: parseInt(billId),
                                    printMode: render.PrintMode.PDF
                                });
                                vendorBillPdf.isOnline = true;
                                vendorBillPdf.folder = 14622;
                                var fileId = vendorBillPdf.save();
                                fileIds.push(fileId);
    
                                //Get file url:
                                let fileObj = file.load({id: fileId});
                                let fileURL = fileObj.url;
                                log.debug("fileUrl", fileURL);
                                templateContent += '<pdf src="'+ escapeAmpersands(fileURL)+'"> </pdf>';
                            }
                        }
        
                        templateContent += '</pdfset>';
    
                        // Finalize the PDF content
                        finalPdf.templateContent = templateContent;
                        var pdfOutput = finalPdf.renderAsPdf();
        
                        // Call MR to delete files
                        try{
                            let mrTask = task.create({
                                taskType: task.TaskType.MAP_REDUCE,
                                scriptId: 'customscript_ctc_mr_delete_files', // Replace with your script ID
                                deploymentId: 'customdeploy_ctc_mr_delete_files' // Replace with your deployment ID
                            })
                            let mrTaaskId = mrTask.submit();
                        }
                        catch(err){
                            log.error("Error calling Map/Reduce"); 
                        }
                        
                        // Send the PDF response
                        context.response.writeFile({
                            file: pdfOutput,
                            isInline: true
                        });
                    }
                    catch(err){
                        context.response.write({
                            output: "File not ready, please wait for the file to be generated and check the folder."
                        })
                    }
                  
    
                } catch (e) {
                    log.error({
                        title: 'Error generating PDF',
                        details: e.message
                    });
                    context.response.write('An error occurred while generating the PDF: ' + e.message);
                }
            }
        }

        function escapeAmpersands(text) {
            if (!text) return text;
            return text.replace(/&/g, '&amp;');
        }
    
        return {
            onRequest: onRequest
        };
    });
    