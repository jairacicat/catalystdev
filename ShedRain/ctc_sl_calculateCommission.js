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
 * Project Number: ShedRain - Commission
 * Script Name: CTC SL Calculate Commission
 * Author: allison.blair@nscatalyst.com
  *@NApiVersion 2.1
  *@NScriptType Suitelet
 *
 * CHANGELOGS
 *
 * Version		Date			            Author              Remarks
 * 1.00			Sept 26, 2024     			asaliba             Initial build
 *
 */
 define(['N/ui/serverWidget', 'N/search', 'N/log', 'N/record', 'N/task', 'N/format'], function(serverWidget, search, log, record, task, format) {
 
    function onRequest(context) {

        try{

            var filterObjString = context.request.parameters.filterObj;
            log.debug('filterObjString', filterObjString);
            var filterObj;

            if(filterObjString){
                filterObj = JSON.parse(filterObjString);
                log.debug('filterObj', filterObj);
            }

            let mapReduceTaskId = context.request.parameters.mrTaskId;
            log.debug('mapReduceTaskId', mapReduceTaskId);

            if(mapReduceTaskId){

                let mrStatus = checkMapReduceStatus(mapReduceTaskId);

            }else{

                if(context.request.method == 'GET'){

                    let form = createForm(filterObj, null);
                    context.response.writePage(form);
        
                }else{
        
                    log.debug('POST');
                    let taskId = createCTD(context, filterObj);
                    let form = createForm(filterObj, taskId);
                    context.response.writePage(form);
                }

            }


        }catch(error){
            log.error('Error - onRequest', error.message);
        }
        
    }

    function createForm(filterObj, mapReduceTaskId){

        try{

            log.audit('createForm');

            let form = serverWidget.createForm({
                title: 'Calculate Commission'
            });

            form.clientScriptModulePath = 'SuiteScripts/ctc_cs_calculateCommission.js';

            let filterGroup = form.addFieldGroup({
                id: 'custpage_filtergroup',
                label: 'Filters'
            });

            var mapReduceTaskIdField = form.addField({
                id: 'custpage_mrtaskid',
                type: serverWidget.FieldType.LONGTEXT,
                label: 'Map Reduce Task Id'
            });
            mapReduceTaskIdField.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            if(mapReduceTaskId){
                mapReduceTaskIdField.defaultValue = mapReduceTaskId;
            };

            //CREATE FILTERS
            let fromDateFilter = form.addField({
                id: 'custpage_filter_fromdate',
                label: 'Date From',
                type: serverWidget.FieldType.DATE,
                container: 'custpage_filtergroup'
            });

            let toDateFilter = form.addField({
                id: 'custpage_filter_todate',
                label:  'Date To',
                type: serverWidget.FieldType.DATE,
                container: 'custpage_filtergroup'
            });

            let typeFilter = form.addField({
                id: 'custpage_filter_type',
                label: 'Transaction Type',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_filtergroup'
            });

            //ADD OPTIONS FOR TRANSACTION TYPE
            typeFilter.addSelectOption({
                value: '',
                text: ''
             });

             typeFilter.addSelectOption({
                value: 'CustInvc',
                text: 'Invoice'
             });

             typeFilter.addSelectOption({
                value: 'CustCred',
                text: 'Credit Memo'
             });

            let customerFilter = form.addField({
                id: 'custpage_filter_customer',
                label: 'Customer',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_filtergroup',
                source: 'customer'
            });

            let statusFilter = form.addField({
                id: 'custpage_filter_status',
                label: 'Transaction Status',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_filtergroup',
            });

            //ADD OPTIONS FOR TRANSACTION STATUS
            statusFilter.addSelectOption({
                value: '',
                text: ''
             });

             statusFilter.addSelectOption({
                value: 'CustCred:A',
                text: 'Credit Memo: Open'
             });

             statusFilter.addSelectOption({
                value: 'CustCred:B',
                text: 'Credit Memo: Fully Applied'
             });


             statusFilter.addSelectOption({
                value: 'CustInvc:A',
                text: 'Invoice: Open'
             });

             statusFilter.addSelectOption({
                value: 'CustInvc:B',
                text: 'Invoice: Paid In Full'
             })

            let rebatchFilter = form.addField({
                id: 'custpage_filter_rebatch',
                label: 'Rebatch',
                type: serverWidget.FieldType.CHECKBOX,
                container: 'custpage_filtergroup'
            });

            if(filterObj){

                log.audit('createdFrom - filterObj', filterObj);

                if(filterObj.fromdate){
                    fromDateFilter.defaultValue = filterObj.fromdate;
                }

                if(filterObj.todate){
                    toDateFilter.defaultValue = filterObj.todate;
                }

                if(filterObj.type){
                    typeFilter.defaultValue = filterObj.type;
                }

                if(filterObj.customer){
                    customerFilter.defaultValue = filterObj.customer;
                }

                fromDateFilter.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                toDateFilter.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                typeFilter.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                customerFilter.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });
            }

            //CREATE SUBLIST
            let transactionList = form.addSublist({
                id: 'custpage_transactionsublist',
                label: 'Transaction List',
                type: serverWidget.SublistType.LIST
            });

            transactionList.addMarkAllButtons();

            let checkBoxField = transactionList.addField({
                id: 'custpage_transactionsublist_checkbox',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'Checkbox'
            });

            let internalId = transactionList.addField({
                id: 'custpage_transactionsublist_id',
                type: serverWidget.FieldType.TEXT,
                label: 'Internal Id'
            });
            internalId.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            let tranDate = transactionList.addField({
                id: 'custpage_transactionsublist_trandate',
                type: serverWidget.FieldType.DATE,
                label: 'Transaction Date'
            });

            let tranNum = transactionList.addField({
                id: 'custpage_transactionsublist_tranid',
                type: serverWidget.FieldType.TEXT,
                label: 'Transaction Number'
            });

            let tranType = transactionList.addField({
                id: 'custpage_transactionsublist_trantype',
                type: serverWidget.FieldType.TEXT,
                label: 'Transaction Type'
            });

            let tranStatus = transactionList.addField({
                id: 'custpage_transactionsublist_transtatus',
                type: serverWidget.FieldType.TEXT,
                label: 'Transaction Status'
            });

            let customer = transactionList.addField({
                id: 'custpage_transactionsublist_customer',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer'
            });

            let department = transactionList.addField({
                id: 'custpage_transactionsublist_department',
                type: serverWidget.FieldType.TEXT,
                label: 'Department'
            });

            let region = transactionList.addField({
                id: 'cuspage_transactionsublist_region',
                type: serverWidget.FieldType.TEXT,
                label: 'Region'
            });

            let displayBtn = form.addButton({
                id: 'custpage_generate_report',
                label: 'Submit',
                functionName: 'getFilter'
            });

            if(filterObj){

                let searchResult = loadSearch(filterObj);

                if(!isEmpty(searchResult) && searchResult.length > 0){
                    let searchResultCTD = addToSublist(searchResult, transactionList);
                }

                displayBtn.isHidden = true;

                let createCTDbtn = form.addSubmitButton({
                    label: 'Create Commission'
                });

            }

            return form;

        }catch(error){
            log.error('Error - createForm', error.message);
        }
    }

    function loadSearch(filterObj){

        try{

            log.audit('loadSearch');

            let fromdate = filterObj.fromdate;
            let todate = filterObj.todate;
            let type = filterObj.type;
            let customer = filterObj.customer;
            log.audit('loadSearch - filterObj', 'fromdate: ' + fromdate + ' | todate: ' + todate + ' | type: ' + type + ' | customer: ' + customer);

            //CREATE SEARCH
            let transactionSearchObj = search.load({
                id: 'customsearch_ctc_create_commission'
            });

            //ADD FILTERS

            if(fromdate){

                transactionSearchObj.filters.push(search.createFilter({
                    name: 'trandate',
                    operator: search.Operator.ONORAFTER,
                    values: fromdate
                }));
            }

            if(todate){

                transactionSearchObj.filters.push(search.createFilter({
                    name: 'trandate',
                    operator: search.Operator.ONORBEFORE,
                    values: todate
                }));
            }

            if(type){

                if(type == 'CustInvc'){
                    //type == invoice
                    log.debug('type', type)

                    transactionSearchObj.filters.push(search.createFilter({
                        name: 'type',
                        operator: search.Operator.ANYOF,
                        values: "CustInvc"
                    }));
                }else if(type == 'CustCred'){
                    //type == credit memo

                    transactionSearchObj.filters.push(search.createFilter({
                        name: 'type',
                        operator: search.Operator.ANYOF,
                        values: 'CustCred'
                    }));
                }
            }else{

                transactionSearchObj.filters.push(search.createFilter({
                    name: 'type',
                    operator: search.Operator.ANYOF,
                    values: ['CustInvc', 'CustCred']
                }));
            }

            if(customer){

                transactionSearchObj.filters.push(search.createFilter({
                    name: 'name',
                    operator: search.Operator.ANYOF,
                    values: customer
                }));
            }

            let loadSearchCount = transactionSearchObj.runPaged().count;
            log.debug('loadSearchCount', loadSearchCount);

            var results = [];
        	
                var resultSet = transactionSearchObj.run();
                var start = 0;
                var end = 1000;
                do{
                    var result = resultSet.getRange(start, end);
                    results = results.concat(result);
                    start += 1000;
                    end += 1000;
                }while(result.length == 1000);
        
            return results;


        }catch(error){
            log.error('Error - loadSearch', error.message);
        }
    }

    function addToSublist(searchResult, transactionList){

        try{

            log.audit('addToSublist');

            searchResult.forEach(function(values, i){

                //internalid
                let internalid = values.getValue({
                    name: 'internalid'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_id',
                    line: i,
                    value: internalid
                });

                //transaction date
                let trandate = values.getValue({
                    name: 'trandate'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_trandate',
                    line: i,
                    value: trandate
                });

                //transaction number
                let tranid = values.getValue({
                    name: 'tranid'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_tranid',
                    line: i,
                    value: tranid
                });

                //transaction type
                let type = values.getText({
                    name: 'type'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_trantype',
                    line: i,
                    value: type
                });

                //transaction status
                let status = values.getValue({
                    name: 'statusref'
                });
                let statusrefText = values.getText({
                    name: 'statusref'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_transtatus',
                    line: i,
                    value: statusrefText
                });

                //customer
                let customer = values.getText({
                    name: 'entity'
                });

                transactionList.setSublistValue({
                    id: 'custpage_transactionsublist_customer',
                    line: i,
                    value: customer
                });

                //department
                let department = values.getValue({
                    name: 'custbody_sps_department'
                });

                if(department){

                    transactionList.setSublistValue({
                        id: 'custpage_transactionsublist_department',
                        line: i,
                        value: department
                    });
                }

            });

        }catch(error){
            log.error('Error - addToSublist', error.message);
        }
    }

    function createCTD(context, filterObj){

        try{

            log.debug('createCTD');

            let sublistLineCount = context.request.getLineCount({
                group: 'custpage_transactionsublist'
            });
            log.debug('sublistLineCount', sublistLineCount);

            let transactionArr = [];

            for(var a = 0; a < sublistLineCount; a++){

                let isChecked = context.request.getSublistValue({
                    group: 'custpage_transactionsublist',
                    name: 'custpage_transactionsublist_checkbox',
                    line: a
                });
    
                if(isChecked == 'T'){

                    let ctdInternalId = context.request.getSublistValue({
                        group: 'custpage_transactionsublist',
                        name: 'custpage_transactionsublist_id',
                        line: a
                    });
                    log.debug('ctdInternalId', ctdInternalId);

                    transactionArr.push(ctdInternalId);
                }
            }
            log.debug('transactionArr', transactionArr);

            let mapreduce_task = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_ctc_mr_calculate_commission',
                params: {
                    'custscript_ctc_internal_id': transactionArr
                }
            });

            let taskId = mapreduce_task.submit();
            log.debug('taskId', taskId);

            return taskId;


        }catch(error){
            log.error('Error - createCTD', error.message);
        }
    }

    function checkMapReduceStatus(mapReduceTaskId){

        try{

            if(mapReduceTaskId){

                var mrTaskStatus;

                do{
                    var mrTaskObj = task.checkStatus({
                        taskId: mapReduceTaskId
                    });

                    mrTaskStatus = mrTaskObj.status;
                }while(mrTaskStatus != 'COMPLETE');

                return mrTaskStatus;
            }

        }catch(error){
            log.error('Error - checkMapReduceStatus', error.message)
        }
    }

    function isEmpty(value) {
        if (value === null) {
          return true;
        } else if (value === undefined) {
          return true;
        } else if (value === '') {
          return true;
        } else if (value === ' ') {
          return true;
        } else if (value === 'null') {
          return true;
        } else {
          return false;
        }
    }
 
    return {
        onRequest: onRequest
    }
 });
 