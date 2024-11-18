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
 * Project Number: Service Ticket #11545 - Incorrect calculation on retainer statement
 * Script Name: CTC SS Voided Retainer
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @description The script will get all unprocessed voided invoice and credit memo, adjust retainer budget and remaining balance
 *
 * CHANGELOGS
 *
 * Version	Date            Author		    Remarks
 * 1.00		Sept 16, 2024 	karaneta			Initial Build
 *
 */
define(['N/record', 'N/search', 'N/log', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'],
    /**
     * @param{record} record
     * @param{search} search
     * @param log
     */
    function (record, search, log,rtnrutil) {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} context
         * @param {string} context.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        function execute(context) {
            var stLogTitle = "CTC SS Voided Retainer > Execute";
            log.debug({
                title: stLogTitle,
                details: '-----------------> Script entry <------------------'
            });


            try {
                //LOAD SAVED SEARCH RESULT
                var transSearch = getVoidedRetTrans();
                var transLength = transSearch.length;
                //log.debug(stLogTitle, 'transSearch: ' +  JSON.stringify(transSearch));
                log.debug(stLogTitle, 'transLength: ' + transLength);
                for (var i = 0; i <= transLength-1; i++) {
                    var transRow = transSearch[i];
                    log.debug(stLogTitle,i + ' |transRow: ' +  JSON.stringify(transRow));
                    var recIntId = transRow.internalId;
                    var retainerId = transRow.retainerId;
                    var parentRetId = transRow.parentRetId;
                    var custId = transRow.customerId;
                    var recType = transRow.transType;
                    var retAmount = transRow.amount;
                    var updateRetainerStat = false;

                    //update parent retainer budget
                    if(parentRetId){
                        var statUpdate =  rtnrutil.recalcParentRetainer(retainerId, retAmount, custId)
                        log.debug(stLogTitle, 'recalcParentRetainer:', retainerId + ' |statUpdate: ' + statUpdate);

                        //Update customer total retainer balance
                        if (!rtnrutil.isEmpty(custId)) {
                            var custRetUpdate = rtnrutil.getCustomerRetainerBalance(custId)

                            log.debug(stLogTitle + ' > updateBilled', retainerId + ' | getCustomerRetainerBalance cust id: ' + custRetUpdate);

                        }

                        if(!rtnrutil.isEmpty(statUpdate)){
                            updateRetainerStat = true;
                        }

                    }

                    //update retainer total billed
                    if (!rtnrutil.isEmpty(retainerId) && !rtnrutil.isEmpty(retAmount)) {
                        var statUpdate =  rtnrutil.updateRetainerTotalBilled(retainerId, retAmount, custId)
                        log.debug(stLogTitle, ' > updateRetainerTotalBilled:', retainerId + ' |statUpdate: ' + statUpdate);

                        //Update customer total retainer balance
                        if (!rtnrutil.isEmpty(custId)) {
                            var custRetUpdate = rtnrutil.getCustomerRetainerBalance(custId)

                            log.debug(stLogTitle + ' > updateBilled', retainerId + ' | getCustomerRetainerBalance cust id: ' + custRetUpdate);

                        }

                        if(!rtnrutil.isEmpty(statUpdate)){
                            updateRetainerStat = true;
                        }

                    }

                    if(updateRetainerStat){
                        log.debug(stLogTitle + 'recType:' + recType + ' | recIntId: ' + recIntId);
                        try{
                            if(recType === 'Credit Memo'){
                                var recId = record.submitFields({
                                    type: record.Type.CREDIT_MEMO,
                                    id: recIntId,
                                    values: {
                                        'custbody_ctc_is_retainer_voided': true
                                    },
                                    options: {
                                        enableSourcing: false,
                                        ignoreMandatoryFields : true
                                    }
                                });
                                log.debug(stLogTitle,  'RETAINER VOIDED UPDATE recType:' + recType + ' | update id: ' + recId);
                            }

                            if(recType === 'Invoice'){
                                var recId = record.submitFields({
                                    type: record.Type.INVOICE,
                                    id:recIntId,
                                    values: {
                                        'custbody_ctc_is_retainer_voided': true
                                    },
                                    options: {
                                        enableSourcing: false,
                                        ignoreMandatoryFields : true
                                    }
                                });
                                log.debug(stLogTitle, 'RETAINER VOIDED UPDATE recType:' + recType + ' | update id: ' + recId);
                            }

                        }catch (e) {
                            log.error({
                                title: stLogTitle,
                                details: e
                            });
                        }

                    }

                }


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

            log.debug({
                title: stLogTitle,
                details: '-----------------> Script END <------------------'
            });


        } //END EXECUTE

        function getVoidedRetTrans(){
            var stLogTitle = 'getVoidedRetTrans';
            var voidedRet = [];

            var voidedRetainerTransaction = search.create({
                type: "transaction",
                filters:
                    [
                        ["type","anyof","CustCred","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["status","anyof","CustCred:V","CustInvc:V"],
                        "AND",
                        ["custbody_ctc_is_retainer_voided","is","F"],
                        "AND",
                        [["custbody_ctc_rtnr_so_retainer","noneof","@NONE@"],"OR",["custbody_ctc_rtnr_inv_retainer","noneof","@NONE@"]]
                    ],
                columns:
                    [
                        search.createColumn({name: "type", label: "Type"}),
                        search.createColumn({name: "tranid", label: "Document Number"}),
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({
                            name: "internalid",
                            join: "customerMain",
                            label: "Internal ID"
                        }),
                        search.createColumn({name: "custbody_ctc_rtnr_inv_retainer", label: "Retainer"}),
                        search.createColumn({name: "custbody_ctc_rtnr_so_retainer", label: "Parent Retainer"}),
                        search.createColumn({name: "custbody_ctc_ret_trans_amount", label: "Retainer Transaction Amount"})
                    ]
            });

            var searchResultCount = voidedRetainerTransaction.runPaged().count;
            //log.debug(stLogTitle, "voidedRetainerTransaction result count" + searchResultCount);

            voidedRetainerTransaction.run().each(function(result){
                // .run().each has a limit of 4,000 voidedRetainerTransaction
                var internalId = result.getValue({
                    name: 'internalid'
                });
                var transId = result.getValue({
                    name: 'tranid'
                });

                var customerId = result.getValue({
                    name: "internalid",
                    join: "customerMain"
                });

                var retainerId = result.getValue({
                    name: "custbody_ctc_rtnr_inv_retainer"
                });
                var parentRetId = result.getValue({
                    name: "custbody_ctc_rtnr_so_retainer"
                })

                var retainerAmount = result.getValue({
                    name: "custbody_ctc_ret_trans_amount"
                });

                var transType = result.getText({
                    name: 'type'
                });
                var transObj = {
                    'internalId': internalId,
                    'retainerId': retainerId,
                    'parentRetId': parentRetId,
                    'customerId': customerId,
                    'amount':retainerAmount,
                    'transType':transType
                }
                voidedRet.push(transObj);
                return true;
            });


            log.debug(stLogTitle, "voidedRet: " + JSON.stringify(voidedRet));

            return voidedRet;
        }


        function isEmpty(stValue) {
            if ((stValue === '') || (stValue === null)
                || (stValue === undefined)) {
                return true;
            } else {
                if (typeof stValue === 'string') {
                    if ((stValue === '')) {
                        return true;
                    }
                } else if (typeof stValue === 'object') {
                    if (stValue.length === 0
                        || stValue.length === 'undefined') {
                        return true;
                    }
                }

                return false;
            }
        } // END IS EMPTY

        return {
            execute: execute
        };


    });