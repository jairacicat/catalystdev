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
 * Script Name: 
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description Shows a screen of Vendors with Open Bills, showing the Vendor Bills. When submitted, the vendor bills will all be set to Approved approval status.
 * 
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         Oct 5, 2024                 jaira@nscatalyst.com                    Initial Build
 *
 * Fields:
 * CTC - VB Mass Approval In Progress [custentity_ctc_vb_mass_approval]
 */
 
/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define(['N/ui/serverWidget', 'N/search', 'N/url', 'N/redirect', 'N/runtime', 'N/record', 'N/task'], 
    function(ui, search, url, redirect, runtime, record, task) {
        const SPARAM_SEARCH = 'custscript_ss_vbforapproval';
        const SPARAM_PRINTING_SCRIPT = 'customscript_ctc_sl_printvendorbills';
        const SPARAM_PRINTING_DEPLOYMENT = 'customdeploy_ctc_sl_printvendorbills';

        const GLOBAL_VARIABLES = {
            "LOG": {
                "ID": "customrecord_ctc_vb_mass_approval_log",
                "FIELDS": {
                    "CREATED_BY": "custrecord_vbapprovallog_createdby",
                    "STATUS" : "custrecord_vbapprovallog_status",
                    "DATE_FROM" : "custrecord_vbapprovallog_datefrom",
                    "DATE_TO" : "custrecord_vbapprovallog_dateto",
                    "VENDOR" : "custrecord_vbapprovallog_vendor",
                }
            },
            "LINES": {
                "ID": "customrecord_ctc_vbapproval_lines",
                "SUBLIST_ID": "recmachcustrecord_ctc_vbapprovalline_log",
                "FIELDS": {
                    "LOG" : "custrecord_ctc_vbapprovalline_log",
                    "VENDOR": "custrecord_ctc_vbapprovalline_vendor",
                    "VENDOR_BILLS": "custrecord_ctc_vbapprovalline_vb",
                    "TOTAL": "custrecord_ctc_vbapprovalline_total",
                    "VB_TEXT": "custrecord_ctc_vbapprovalline_vbtext"
                }
            }
        }
    
        function onRequest(context) {
            if (context.request.method === 'GET') {
                createForm(context);
            } else if (context.request.method === 'POST') {

                let LOG_RECORD_VALUES = {
                    "LOG": {
                        "CREATED_BY": "",
                        "STATUS": "",
                        "DATE_FROM": "",
                        "DATE_TO": "",
                        "VENDOR": ""
                    },
                    "LINES": []
                };

                //Gather POST values:
                LOG_RECORD_VALUES.LOG.CREATED_BY = runtime.getCurrentUser().id;
                LOG_RECORD_VALUES.LOG.STATUS = "PENDING";
                if(context.request.parameters.custpage_datefrom){
                    LOG_RECORD_VALUES.LOG.DATE_FROM = new Date(context.request.parameters.custpage_datefrom);
                }
                if(context.request.parameters.custpage_dateto){
                    LOG_RECORD_VALUES.LOG.DATE_TO = new Date(context.request.parameters.custpage_dateto);
                }
                LOG_RECORD_VALUES.LOG.VENDOR = context.request.parameters.custpage_vendor;

                log.debug("LOG RECORD VALUES", LOG_RECORD_VALUES);

                let sublistLineCount = context.request.getLineCount({
                    group: 'custpage_vendorlist'
                });
                log.debug("Sublist Line Count", sublistLineCount);
                
                for(var i = 0; i < sublistLineCount; i++){
                    let isChecked = context.request.getSublistValue({
                        group: 'custpage_vendorlist',
                        name: 'custpage_select',
                        line: i
                    });
    
                    if(isChecked == 'T' || isChecked == true){

                        let lineObj = {};
                        lineObj.vendorId = context.request.getSublistValue({
                            group: 'custpage_vendorlist',
                            line: i,
                            name: 'custpage_vendorid'
                        });

                        lineObj.vendorBillIds = context.request.getSublistValue({
                            group: 'custpage_vendorlist',
                            line: i,
                            name: 'custpage_vendorbillids'
                        });

                        lineObj.total = context.request.getSublistValue({
                            group: 'custpage_vendorlist',
                            line: i,
                            name: 'custpage_total'
                        });

                        lineObj.vbText = context.request.getSublistValue({
                            group: 'custpage_vendorlist',
                            line: i,
                            name: 'custpage_vendorbillnames'
                        })
    
                        LOG_RECORD_VALUES.LINES.push(lineObj);
                    }
                }

                log.debug("LOG RECORD VALUES", LOG_RECORD_VALUES);

                // Create the VB Mass Approval Log record
                let LOG_RECORD = record.create({
                    type: GLOBAL_VARIABLES.LOG.ID
                });

                for(var key in LOG_RECORD_VALUES.LOG){
                    LOG_RECORD.setValue({
                        fieldId: GLOBAL_VARIABLES.LOG.FIELDS[key],
                        value: LOG_RECORD_VALUES.LOG[key]
                    });
                }

                let lineCtr = 0;

                for(var i = 0; i < LOG_RECORD_VALUES.LINES.length; i++){
                    let tempLine = LOG_RECORD_VALUES.LINES[i];
                    log.debug("Temp Line", tempLine)

                    let vbIds = tempLine.vendorBillIds.split(",");

                    for(var ctr = 0; ctr < vbIds.length; ctr++){
                     
                        LOG_RECORD.setSublistValue({
                            sublistId: GLOBAL_VARIABLES.LINES.SUBLIST_ID,
                            line: lineCtr,
                            fieldId: GLOBAL_VARIABLES.LINES.FIELDS.VENDOR,
                            value: parseInt(tempLine.vendorId)
                        });

                        LOG_RECORD.setSublistValue({
                            sublistId: GLOBAL_VARIABLES.LINES.SUBLIST_ID,
                            line: lineCtr,
                            fieldId: GLOBAL_VARIABLES.LINES.FIELDS.VENDOR_BILLS,
                            value: parseInt(vbIds[ctr])
                        });

                        /*

                        LOG_RECORD.setSublistValue({
                            sublistId: GLOBAL_VARIABLES.LINES.SUBLIST_ID,
                            line: i,
                            fieldId: GLOBAL_VARIABLES.LINES.FIELDS.TOTAL,
                            value: tempLine.total
                        });
                        */

                        lineCtr++;
                    }

                }

                LOG_RECORD.setValue({
                    fieldId: "custrecord_vbapprovallog_submitted",
                    value: JSON.stringify(LOG_RECORD_VALUES)
                });

                let LOG_ID = LOG_RECORD.save({ignoreManndatoryFields: true});
                log.debug("LOG_RECORD CREATED", LOG_ID);
                // Call the Map/Reduce

                try{
                    var mrTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_ctc_mr_approvebills', 
                        deploymentId: 'customdeploy_ctc_mr_approvebills',
                    });

                    let mrTaskId = mrTask.submit();
                    log.debug("Map/Reduce called", mrTaskId);
                }
                catch(err){
                    log.error("Map/Reduce still running", err);
                }
                
                redirect.toRecord({
                    id: LOG_ID,
                    type: GLOBAL_VARIABLES.LOG.ID,
                });
                
            }
        }

        /**
         * Creates a long HTML string with links to each vendor bill.
         * 
         * @param {string} ids - A comma-delimited string of vendor bill IDs (e.g., "1234,2345").
         * @param {string} names - A comma-delimited string of vendor bill names (e.g., "Bill 1,Bill 2").
         * @return {string} - A long string with links for each vendor bill.
         */
        function createVendorBillLinks(ids, names) {
            const idArray = ids.split(',');
            const nameArray = names.split(',');
            let result = '';

            // Check if both arrays are the same length
            if (idArray.length !== nameArray.length) {
                throw new Error("The number of IDs and names must match.");
            }

            let printingSL_URL = url.resolveScript({
                deploymentId: SPARAM_PRINTING_DEPLOYMENT,
                scriptId: SPARAM_PRINTING_SCRIPT,
                returnExternalUrl: true
            })

            // Loop through each ID and name, creating the link format
            for (let i = 0; i < idArray.length; i++) {
                const id = idArray[i].trim();
                const name = nameArray[i].trim();

                // Construct the link and append it to the result
                result += `<a href="${printingSL_URL}&id=${id}">${name}</a>`;

                // Add a comma and space after each link except the last one
                if (i < idArray.length - 1) {
                    result += '\n';
                }
            }

            return result;
        }
    
        function createForm(context){
            let parameters = context.request.parameters;
            var form = ui.createForm({
                title: 'Vendor Bill Mass Approval'
            });

            // Add Date From filter
            var dateFromField = form.addField({
                id: 'custpage_datefrom',
                type: ui.FieldType.DATE,
                label: 'Created Date From'
            });
            if(parameters.datefrom){
                dateFromField.defaultValue = parameters.datefrom
            }

            // Add Date To filter
            var dateToField = form.addField({
                id: 'custpage_dateto',
                type: ui.FieldType.DATE,
                label: 'Created Date To'
            });
            if(parameters.dateto){
                dateToField.defaultValue = parameters.dateto
            }

            // Add Vendor filter
            var vendorField = form.addField({
                id: 'custpage_vendor',
                type: ui.FieldType.SELECT,
                label: 'Vendor',
                source: 'vendor' // Netsuite's internal vendor list
            });
            if(parameters.vendor){
                vendorField.defaultValue = parameters.vendor
            }

            // Add Submit and Apply Filters buttons
            form.addSubmitButton({ label: 'Submit' });
            form.addButton({
                id: 'custpage_applyfilters',
                label: 'Apply Filters',
                functionName: 'applyFilters'
            });

            // Add sublist for the vendor results
            var sublist = form.addSublist({
                id: 'custpage_vendorlist',
                type: ui.SublistType.LIST,
                label: 'Vendors with Open Bills'
            });

            sublist.addMarkAllButtons();

            sublist.addField({
                id: 'custpage_select',
                type: ui.FieldType.CHECKBOX,
                label: 'Select'
            });

            sublist.addField({
                id: 'custpage_vendorid',
                type: ui.FieldType.TEXT,
                label: 'Vendor ID'
            });

            sublist.addField({
                id: 'custpage_vendorname',
                type: ui.FieldType.TEXT,
                label: 'Vendor Name'
            });

            sublist.addField({
                id: 'custpage_vendorpdf',
                type: ui.FieldType.TEXT,
                label: 'Vendor Statement'
            });

            sublist.addField({
                id: 'custpage_vendorbillids',
                type: ui.FieldType.TEXT,
                label: 'Vendor Bill Ids'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            });

            sublist.addField({
                id: 'custpage_vendorbillnames',
                type: ui.FieldType.TEXT,
                label: 'Vendor Bill Names'
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            });;

            sublist.addField({
                id: 'custpage_vendorbills',
                type: ui.FieldType.TEXT,
                label: 'Vendor Bills'
            });


            sublist.addField({
                id: 'custpage_total',
                type: ui.FieldType.CURRENCY,
                label: 'Total'
            });

            populateVendorList(sublist, parameters);

            // Client Script to handle buttons
            form.clientScriptModulePath = './ctc_cs_vbmassapproval.js';

            //Try 

            context.response.writePage(form);
        }

        function populateVendorList(sublist, filters) {
            const SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_SEARCH});
            log.debug("popuateVendorList", filters);

            let previewBillsURL = url.resolveScript({
                deploymentId: 'customdeploy_ctc_sl_printvendorbills',
                scriptId: 'customscript_ctc_sl_printvendorbills',
                returnExternalUrl: true
            });

            if(!SS_ID){
                return;
            }

            let vendorSearch = search.load({
                id: SS_ID
            });

            let searchFilters = vendorSearch.filters;

            if(filters.datefrom){
                let dateFromFilter = search.createFilter({
                    name: 'trandate',
                    operator: 'onorafter',
                    values: filters.datefrom
                });
                searchFilters.push(dateFromFilter)
            }
            if(filters.dateto){
                let dateToFilter = search.createFilter({
                    name: 'trandate',
                    operator: 'onorbefore',
                    values: filters.dateto
                });
                searchFilters.push(dateToFilter)
            }
            if(filters.vendor){
                let dateToFilter = search.createFilter({
                    name: 'internalid',
                    join: 'vendor',
                    operator: 'anyof',
                    values: filters.vendor
                });
                searchFilters.push(dateToFilter)
            }
            vendorSearch.filters = searchFilters;
    
            log.debug("Search filters", vendorSearch.filters);

            let searchResults = [];
            vendorSearch.run().each(function(result){
                let lineResult = {};
                log.debug("RESULT", result);

                lineResult.vendorId = result.getValue(result.columns[0]);
                lineResult.vendorName = result.getValue(result.columns[1]);
                lineResult.totalAmount = result.getValue(result.columns[2]);
                lineResult.vendorBillIds = result.getValue(result.columns[3]);
                lineResult.vendorBillNums = result.getValue(result.columns[4]);

                searchResults.push(lineResult);

                return true;
             });

             log.debug("Line Results", searchResults);
             
            
            for (var i = 0; i < searchResults.length; i++) {// Code Example 1
                sublist.setSublistValue({
                    id: 'custpage_vendorname',
                    line: i,
                    value: searchResults[i].vendorName
                });

                sublist.setSublistValue({
                    id: 'custpage_vendorid',
                    line: i,
                    value: searchResults[i].vendorId
                });
    
                sublist.setSublistValue({
                    id: 'custpage_vendorpdf',
                    line: i,
                   // value: SETTLEMENT_URL + "&vendor=" + searchResults[i].vendorId
                    value: "<a href='" + previewBillsURL + "&vendorId="+ searchResults[i].vendorId +"&billIds=" + searchResults[i].vendorBillIds + "'  target='_blank'> Preview Vendor Bills </a>"
                });
    

                sublist.setSublistValue({
                    id: 'custpage_vendorbillids',
                    line: i,
                    value: searchResults[i].vendorBillIds
                });

                sublist.setSublistValue({
                    id: 'custpage_vendorbillnames',
                    line: i,
                    value: searchResults[i].vendorBillNums
                });


                let vendorBillIds = searchResults[i].vendorBillIds.split(",");
                let vendorBillNums = searchResults[i].vendorBillNums.split(",");
                let finalValue = "";
            
                for(var ctr = 0; ctr < vendorBillIds.length; ctr++){
                    let vbLink = url.resolveRecord({
                        recordId: vendorBillIds[ctr],
                        recordType: 'vendorbill'
                    });

                    let linkText = "<a href='" + vbLink + "'  target='_blank'>" + vendorBillNums[ctr] + " </a><br />";
                    finalValue = finalValue + linkText;
                }

                sublist.setSublistValue({
                    id: 'custpage_vendorbills',
                    line: i,
                    value: finalValue
                });

                sublist.setSublistValue({
                    id: 'custpage_total',
                    line: i,
                    value: searchResults[i].totalAmount
                });
            }
            
        }
    
        return {
            onRequest: onRequest
        };
    });
    