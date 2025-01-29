/**
 * Copyright (c) 2020 Catalyst Tech Corp
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Catalyst Tech Corp. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Catalyst Tech.
 *
 * Project Number: Service TODO-
 * Script Name: CTC SL Generate Retainer PDF
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @description
 *
 * CHANGELOGS
 *
 * Version    Date            Author            Remarks
 * 1.00        Jan 26, 2023    karaneta        Initial Build
 * 1.01     Apr 24, 2024    asaliba         Added new retainer items (Retainer - IR and Retainer - Advisory)
 * 1.02     May 1, 2024     asaliba         Added Retainer Type
 * 2.00     May 1, 2024     asaliba         Update invoice to get multiple retainer and filter to unique transaction
 *
 */
    //var retainerItem = ['99047', '99196', '99195'] //Retainer - NetSuite (sb)
    var retainerItem = ['118568', '284603', '284604', '71668', '127208']
    var retainerItemList = [118568, 284603, 284604, 127208, 71668, 53238, 156689, 156686, 53238];

    define(['N/file', 'N/render', 'N/search', 'N/log', 'N/redirect', 'N/record',
            'N/config', 'N/ui/serverWidget'],
        function (file, render, search, log, redirect, record, config, serverWidget) {
    
            function onRequest(context) {
                var stLogTitle = 'Generate PDF Suitelet';
                var request = context.request;
                var response = context.response;
                var datasource;
    
                var custId = context.request.parameters.custparam_custid;
    
                log.debug({
                    title: stLogTitle,
                    details: 'custId: ' + custId
                });
                var companyInfo = config.load({
                    type: config.Type.COMPANY_INFORMATION
                });
    
                var logo = companyInfo.getText({
                    fieldId: 'pagelogo'
                });
    
                var clogo = file.load({
                    id: 'Images/' + logo
                });
    
                if (request.method === 'GET') {
                    // Create the form
                    var form = serverWidget.createForm({
                        title: 'Select Customer Retainer'
                    });
        
                    // Dropdown Field for Retainers
                    var retainerDropdown = form.addField({
                        id: 'custpage_retainer_dropdown',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Select Retainer'
                    });
    
                    var customerID = form.addField({
                        id: 'custpage_customerid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'CUSTOMER'
                    });
                    customerID.defaultValue = custId;
                    customerID.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    })
        
                    retainerDropdown.isMandatory = true;
        
                    // Populate the dropdown with Retainer Transactions
                    var retainers = getCustomerRetainers(custId);
                    retainerDropdown.addSelectOption({
                        value: '',
                        text: '-- Select Retainer --'
                    });
        
                    retainers.forEach(function(retainer) {
                        retainerDropdown.addSelectOption({
                            value: retainer.id,
                            text: retainer.name
                        });
                    });
        
                    // Submit Button
                    form.addSubmitButton({
                        label: 'Print Retainer Statement'
                    });
        
                    response.writePage(form);
        
                } else if (request.method === 'POST') {
                    var custId = request.parameters.custpage_customerid;
                    var retainerId = request.parameters.custpage_retainer_dropdown;
                    var custobj = getCustomerInfo(custId);
                    var invoiceResult = getInvoices(custId, retainerId);
                    var creditMemoResult = getCreditMemo(custId);
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;
                    var retainerobj = getOpenRetainerDetails(custId, retainerId);
    
                    datasource = {
                        logo: clogo.url,
                        today: today,
                        custobj: custobj,
                        invobj: invoiceResult,
                        cmobj: creditMemoResult,
                        retainer: retainerobj
                    };
    
                    var htmlTemplate = file
                        .load({
                            id: 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/CTC_RetainerTemplate.html'
                        });
    
                    var retainerReport = renderPDF(htmlTemplate, datasource, response, custId);
                    context.response.setHeader({name: 'Content-Type', value: 'application/pdf'});
                    context.response.setHeader({
                        name: 'Content-Disposition',
                        value: 'inline; filename="' + retainerReport.fileName + '"'
                    });
                    context.response.writeFile(retainerReport.file);
                }
    
var retainerItem = ['118568', '284603', '284604', '71668', '127208']
var retainerItemList = [118568, 284603, 284604, 127208, 71668, 53238, 156689, 156686, 53238];
define(['N/file', 'N/render', 'N/search', 'N/log', 'N/redirect', 'N/record',
        'N/config'],
    function (file, render, search, log, redirect, record, config) {

        function onRequest(context) {
            var stLogTitle = 'Generate PDF Suitelet';
            var request = context.request;
            var response = context.response;
            var datasource;

            var custId = context.request.parameters.custparam_custid;

            log.debug({
                title: stLogTitle,
                details: 'custId: ' + custId
            });
            var companyInfo = config.load({
                type: config.Type.COMPANY_INFORMATION
            });

            var logo = companyInfo.getText({
                fieldId: 'pagelogo'
            });

            var clogo = file.load({
                id: 'Images/' + logo
            });

            if (context.request.method == 'GET') {
                var custobj = getCustomerInfo(custId);
                var invoiceResult = getInvoices(custId);
                var creditMemoResult = getCreditMemo(custId);
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                var retainerobj = getOpenRetainerDetails(custId);

                datasource = {
                    logo: clogo.url,
                    today: today,
                    custobj: custobj,
                    invobj: invoiceResult,
                    cmobj: creditMemoResult,
                    retainer: retainerobj
                };

                var htmlTemplate = file
                    .load({
                        id: 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/CTC_RetainerTemplate.html'
                    });

                var retainerReport = renderPDF(htmlTemplate, datasource, response, custId);
                context.response.setHeader({name: 'Content-Type', value: 'application/pdf'});
                context.response.setHeader({
                    name: 'Content-Disposition',
                    value: 'inline; filename="' + retainerReport.fileName + '"'
                });
                context.response.writeFile(retainerReport.file);

            }
    
            /**
             * Function to get the customer's retainers.
             * @param {string} customerId - The customer ID.
             * @returns {Array} List of retainer transactions.
             */
            function getCustomerRetainers(customerId) {
                var results = [];
    
                // Search for Retainer Transactions related to the customer
                var retainerSearch = search.create({
                    type: 'customrecord_ctc_retainer',
                    filters: [
                        ['custrecord_ctc_rtnr_customer_ref', 'anyof', customerId],
                        'AND',
                        ['isinactive', 'is', 'F'],
                        'AND',
                        ['custrecord_ctc_rtnr_status', 'anyof', ['1','2']]
                    ],
                    columns: ['internalid', 'name']
                });
    
                var pagedData = retainerSearch.runPaged({ pageSize: 1000 });
                pagedData.pageRanges.forEach(function(pageRange) {
                    var page = pagedData.fetch({ index: pageRange.index });
                    page.data.forEach(function(result) {
                        results.push({
                            id: result.getValue('internalid'),
                            name: result.getValue('name')
                        });
                    });
                });
    
                return results;
            }
    
            function renderPDF(htmlTemplate, datasource, response, custId) {
                log.debug('renderPDF ');
                log.debug({
                    title: 'datasource',
                    details: JSON.stringify(datasource)
                });
    
                var pageRenderer = render.create();
                pageRenderer.templateContent = htmlTemplate.getContents();
                var returnValue;
    
                pageRenderer.addCustomDataSource({
                    format: render.DataSource.OBJECT,
                    alias: 'ds',
                    data: datasource
                });
    
                returnValue = {
                    fileName: ['RetainerReport#', custId, '.pdf'].join(),
                    file: pageRenderer.renderAsPdf()
                };
    
                var retainerStatement = pageRenderer.renderAsPdf();
                //response.writeFile(retainerStatement, false);
                return returnValue;
    
            }
    
            function getCustomerInfo(custId) {
                var stLogTitle = 'getCustomerInfo';
                var custObj = null;
                if (!isEmpty(custId)) {
                    try {
                        var customerSearch = search.create({
                            type: search.Type.CUSTOMER,
                            columns: ['entityid', 'attention', 'addressee', 'address1', 'address2', 'city', 'state', 'zipcode', 'custentity_ctc_custret_totalbalance', 'email'],
                            filters: [search.createFilter({
                                name: 'internalid',
                                operator: search.Operator.ANYOF,
                                values: custId
                            }),
                                search.createFilter({
                                    name: 'isdefaultbilling',
                                    operator: search.Operator.IS,
                                    values: 'T'
                                })]
                        });
    
                        custObj = customerSearch.run().getRange({
                            start: 0,
                            end: 999
                        });
    
                        log.debug({
                            title: 'customer search result',
                            details: JSON.stringify(custObj)
                        });
    
                        if (!isEmpty(custObj)) {
                            for (var i = 0; i < custObj.length; i++) {
                                var entityID = custObj[i].getValue({name: 'entityid'});
                                var at = custObj[i].getValue({name: 'attention'});
                                log.debug(custObj[i], ' entityID:' + entityID + ' - attention: ' + at);
    
                            }
                            // return custObj;
                        }
    
                    } catch (e) {
                        log.error({
                            title: stLogTitle,
                            details: e
                        });
    
                    }
                }
    
                return custObj;
            }
    
            function getInvoices(custId, retainerId) {
                var stLogTitle = 'getInvoices';
                var invoiceResult = null;
                var invoiceArray = [];
    
                if (!isEmpty(custId)) {
                    try {
                        var invoiceSearch = search.create({
                            type: search.Type.TRANSACTION,
                            filters:
                                [
                                    [[["type", "anyof", "CustInvc"],
                                        "AND", ["status","noneof","CustInvc:V"],
                                        "AND", ["customermain.internalid", "anyof", custId],
                                        "AND", ["item", "anyof", retainerItem],
                                        "AND", [["custbody_ctc_rtnr_inv_retainer", "anyof", retainerId],
                                            "OR", ["custbody_ctc_rtnr_so_retainer", "anyof", retainerId]]]]
                                ],
                            columns:
                                [
                                    search.createColumn({
                                        name: "tranid",
                                        summary: "GROUP",
                                        label: "Document Number"
                                    }),
                                    search.createColumn({
                                        name: "entity",
                                        summary: "GROUP",
                                        label: "Name"
                                    }),
                                    search.createColumn({
                                        name: "custbody_ctc_ret_trans_amount",
                                        summary: "MIN",
                                        label: "Retainer Transaction Amount"
                                    }),
                                    search.createColumn({
                                        name: "internalid",
                                        summary: "GROUP",
                                        label: "Internal ID"
                                    }),
                                    search.createColumn({
                                        name: "trandate",
                                        summary: "GROUP",
                                        label: "Date"
                                    })
                                ]
                        });
    
                        invoiceResult = invoiceSearch.run().getRange({
                            start: 0,
                            end: 999
                        });
    
                        log.debug({
                            title: 'invoice search result',
                            details: JSON.stringify(invoiceResult)
                        });
    
                        if (!isEmpty(invoiceResult)) {
                            for (var i = 0; i < invoiceResult.length; i++) {
                                var inv = invoiceResult[i].getValue({name: 'tranid', summary: "GROUP"});
                                var retAmount = invoiceResult[i].getValue({
                                    name: 'custbody_ctc_ret_trans_amount',
                                    summary: "MIN"
                                });
                                var transDate = invoiceResult[i].getValue({
                                    name: 'trandate',
                                    summary: "GROUP"
                                });
                                log.debug(invoiceResult[i], ' inv:' + inv + ' - retAmount: ' + retAmount);
                                var invObj = {
                                    'tranid': inv,
                                    'trandate': transDate,
                                    'custbody_ctc_ret_trans_amount': retAmount
    
                                }
                                invoiceArray.push(invObj);
                            }
                        }
    
    
                    } catch (e) {
                        log.error({
                            title: stLogTitle,
                            details: e
                        });
    
                    }
    
                }
                log.debug({
                    title: stLogTitle,
                    details: 'return: ' + JSON.stringify(invoiceArray)
                });
                return invoiceArray;
    
            }
    
            function getCreditMemo(custId) {
                var stLogTitle = 'getCreditMemo';
                var creditMemoResult = null;
                var creditMemoArray = [];
    
                if (!isEmpty(custId)) {
                    try {
                        var creditSearch = search.create({
                            type: search.Type.TRANSACTION,
                            filters: [search.createFilter({
                                name: 'type',
                                operator: search.Operator.ANYOF,
                                values: 'CustCred'
                            }),
                                search.createFilter({
                                    name: 'status',
                                    operator: search.Operator.NONEOF,
                                    values: 'CustCred:V'
                                }),
                                search.createFilter({
                                    name: 'internalid',
                                    join: 'customermain',
                                    operator: search.Operator.ANYOF,
                                    values: custId
                                }),
                                search.createFilter({
                                    name: 'internalid',
                                    join: 'item',
                                    operator: search.Operator.ANYOF,
                                    values: retainerItem
                                })
                            ],
                            columns:
                                [
                                    search.createColumn({
                                        name: "tranid",
                                        summary: "GROUP",
                                        label: "Document Number"
                                    }),
                                    search.createColumn({
                                        name: "entity",
                                        summary: "GROUP",
                                        label: "Name"
                                    }),
                                    search.createColumn({
                                        name: "custbody_ctc_ret_trans_amount",
                                        summary: "MIN",
                                        label: "Retainer Transaction Amount"
                                    }),
                                    search.createColumn({
                                        name: "internalid",
                                        summary: "GROUP",
                                        label: "Internal ID"
                                    }),
                                    search.createColumn({
                                        name: "trandate",
                                        summary: "GROUP",
                                        label: "Date"
                                    })
                                ]
                            //columns: ['internalid', 'type', 'trandate', 'tranid', 'entity', 'amount', 'custbody_ctc_ret_trans_amount']
                        });
    
                        creditMemoResult = creditSearch.run().getRange({
                            start: 0,
                            end: 999
                        });
    
                        log.debug({
                            title: 'credit memo search result',
                            details: JSON.stringify(creditMemoResult)
                        });
    
                        if (!isEmpty(creditMemoResult)) {
                            for (var i = 0; i < creditMemoResult.length; i++) {
                                var cm = creditMemoResult[i].getValue({name: 'tranid', summary: "GROUP"});
                                var retAmount = creditMemoResult[i].getValue({
                                    name: 'custbody_ctc_ret_trans_amount',
                                    summary: "MIN"
                                });
                                var transDate = creditMemoResult[i].getValue({
                                    name: 'trandate',
                                    summary: "GROUP"
                                });
                                log.debug(creditMemoResult[i], ' cm:' + cm + ' - retAmount: ' + retAmount);
                                var cmObj = {
                                    'tranid': cm,
                                    'trandate': transDate,
                                    'custbody_ctc_ret_trans_amount': retAmount
    
                                }
                                creditMemoArray.push(cmObj);
                            }
                        }
    
    
                    } catch (e) {
                        log.error({
                            title: stLogTitle,
                            details: e
                        });
    
                    }
    
                }
                log.debug({
                    title: stLogTitle,
                    details: 'return: ' + JSON.stringify(creditMemoArray)
                });
                return creditMemoArray;
    
            }
    
            function getOpenRetainerDetails(custId, retainerId) {
                var stLogTitle = 'getOpenRetainerDetails';
                var retainerResult;
                var retainerObj = {
                    'retainerStart': null,
                    'retainerEnd': null,
                    'retainerBudget': null
                };
    
                if (!isEmpty(custId)) {
                    try {
                        //Load retainer record and get balance
                        var customerRetainerSearch = search.create({
                            type: 'customrecord_ctc_retainer',
                            filters: [search.createFilter({
                                name: 'custrecord_ctc_rtnr_customer_ref',
                                operator: search.Operator.ANYOF,
                                values: custId
                            }), search.createFilter({
                                name: 'custrecord_ctc_rtnr_status',
                                operator: search.Operator.ANYOF,
                                values: ['1', '2']  // Open or partially used
                            }), search.createFilter({
                                name: 'internalid',
                                operator: search.Operator.ANYOF,
                                values: retainerId
                            })],
                            columns: ['internalid', 'name', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_start_date', 'custrecord_ctc_rtnr_end_date', 'custrecord_ctc_rtnr_type', 'custrecord_ctc_rtnr_total_bgt_remaining'] //ALI
                        });
    
                        retainerResult = customerRetainerSearch.run().getRange({
                            start: 0,
                            end: 1
                        });
    
                        log.debug({
                            title: 'retainer search result',
                            details: JSON.stringify(retainerResult)
                        });
    
                        if (!isEmpty(retainerResult)) {
                            for (var i = 0; i < retainerResult.length; i++) {
                                var retName = retainerResult[i].getValue({name: 'name'});
                                var startDate = retainerResult[i].getValue({name: 'custrecord_ctc_rtnr_start_date'});
                                var endDate = retainerResult[i].getValue({name: 'custrecord_ctc_rtnr_end_date'});
                                var totalBudget = retainerResult[i].getValue({name: 'custrecord_ctc_rtnr_total_budget'});
                                var retainerType = retainerResult[i].getText({name: 'custrecord_ctc_rtnr_type'}); //ALI
                                //var beginningBalance = retainerResult[i].getValue({name: 'custrecord_ctc_rtnr_beginningbal'}); //ALI
                                var retainerBudegetRemaining = retainerResult[i].getValue({name: 'custrecord_ctc_rtnr_total_bgt_remaining'});
                                var retainerDateCreated = retainerResult[i].getValue({name: 'created'});
                                log.debug(retainerResult[i], 'retName: ' + retName + ' -startDate:' + startDate + ' - endDate: ' + endDate + ' - custrecord_ctc_rtnr_total_budget:' + totalBudget + ' - retainerType:' + retainerType);
                                retainerObj = {
                                    'retainerStart': startDate,
                                    'retainerEnd': endDate,
                                    'retainerBudget': totalBudget,
                                    'retainerType': retainerType, //ALI
                                    'retainerName': retName,
                                    'budgetRemaining': retainerBudegetRemaining
                                    //'beginningBalance': beginningBalance
                                }
                            }
                        }
    
                        return retainerObj;
    
                    } catch (e) {
                        log.error({
                            title: stLogTitle,
                            details: e
                        });
    
                    }
    
                }
    
            }
    
            function getRetainerBeginningBudget(retainerId){
                var customrecord_ctc_retainerSearchObj = search.create({
                    type: "customrecord_ctc_retainer",
                    filters:
                    [
                       ["internalidnumber","equalto", retainerId], 
                       "AND", 
                       ["systemnotes.type","is","F"], 
                       "AND", 
                       ["systemnotes.field","anyof","CUSTRECORD_CTC_RTNR_TOTAL_BUDGET"]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "field",
                          join: "systemNotes",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "oldvalue",
                          join: "systemNotes",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "date",
                          join: "systemNotes",
                          summary: "MIN"
                       }),
                       search.createColumn({
                          name: "created",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                        name: "formulatext",
                        summary: "MAX",
                        formula: "case when {created} < {systemnotes.date} then 1 else 0 end",
                        label: "Formula (Text)"
                        })
                    ]
                 });
                
                 var beginningBudget = 0;
    
                 customrecord_ctc_retainerSearchObj.run().each(function(result){
                    if(result.getValue({name: 'formulatext', summary: "MAX"}) != 1){
                        beginningBudget = result.getValue({name: 'oldvalue', join: "systemNotes", summary: "GROUP"});
                    }
                    return false;
                 });
                 
                return beginningBudget;
            }
    
            function isEmpty(stValue) {
                if ((stValue === '') || (stValue === null) || (stValue === undefined)) {
                    return true;
                } else {
                    if (typeof stValue === 'string') {
                        if ((stValue === '')) {
                            return true;
                        }
                    } else if (typeof stValue === 'object') {
                        if (stValue.length === 0 || stValue.length === 'undefined') {
                            return true;
                        }
                    }
    
                    return false;
                }
            }
    
    
            return {
                onRequest: onRequest
            };
    
        });