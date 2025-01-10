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
 * Script Name: CTC UE Retainer
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @description
 *
 * CHANGELOGSf
 *
 * Version    Date            Author            Remarks
 * 1.00        Dec 12, 2022    karaneta        Initial Build
 * 1.01     May 2, 2024     asaliba         Set retainer name
 * 1.02     Jul 17, 2024    mesteban        Fix issue with retainer name
 * 1.03     Jul 22, 2024    karaneta        Add functionality to deduct retainer adjustment if user enter negative amount
 *
 */
define(['N/record', 'N/search', 'N/log', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'],
    function (record, search, log, rtnrutil) {
        //declare variable

        function beforeLoad(context) {
            var stLogTitle = 'beforeLoad';
            var form = context.form;
            var rec = context.newRecord;
            var recOld = context.oldRecord;
            var stContextType = context.type;


            try {
                log.debug(stLogTitle, '-------------> SCRIPT ENTRY | ' + JSON.stringify(context));

                var stName = rec.getValue({fieldId: 'altname'});
                log.debug(stLogTitle, '1 | name=' + stName + ', no name?' + (!stName));

                // if no value, set dummy value
                if (!stName) {
                    if (stContextType == 'create') {
                        rec.setValue({fieldId: 'altname', value: 'To Be Generated'});
                    } else {
                        recOld.setValue({fieldId: 'altname', value: 'To Be Generated'});
                    }
                }

            } catch (err) {
                log.debug({title: stLogTitle, details: 'Error=' + err.toString()});
            }
        }

        function rtnr_afterSubmit(context) {
            var stLogTitle = 'rtnr_afterSubmit';
            log.debug(stLogTitle, '-------------> SCRIPT ENTRY <------------------');
            log.debug(stLogTitle, 'CONTEXT ' + JSON.stringify(context));
            //if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE){
            if (context.type === 'create' || context.type === 'edit') {
                var current_rec = context.newRecord;
                var retainerId = current_rec.id;
                var currentType = current_rec.type; //customrecord_ctc_retainer
                var retainerAmount;
                current_rec = record.load({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    isDynamic: true
                });
                var retainerName = current_rec.getValue({
                    fieldId: 'name'
                });
                var customerId = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_customer_ref'
                });
                var retainerExpiration = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_end_date'
                });
                var retainerStatus = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_status'
                });
                var retainerBudget = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_total_budget'
                });
                retainerBudget = Math.abs(retainerBudget);

                var beginningTransaction = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_beginningtransaction'
                });
                var beginningBalance = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_beginningbal'
                });

                var retainerBudgetCalc = rtnrutil.getTotalParentRetainer(retainerId, customerId, beginningTransaction);
                if(retainerBudget != retainerBudgetCalc){
                    current_rec.setValue({
                        fieldId: 'custrecord_ctc_rtnr_total_budget',
                        value: retainerBudgetCalc || 0
                    });

                    retainerBudget = retainerBudgetCalc;

                    if(beginningBalance != ''){
                        retainerBudget = retainerBudget + beginningBalance || 0;
                    }
                }
                

                var retainerBudgAdj = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_total_bgt_adjustment'
                });

                /*
                var retainerBudgetAdjCalc = rtnrutil.getTotalParentRetainer(retainerId, customerId, beginningTransaction);
                log.audit("retainerBudgetAdjCalc", retainerBudgetAdjCalc);
                if(retainerBudgAdj != retainerBudgetAdjCalc){
                    current_rec.setValue({
                        fieldId: 'custrecord_ctc_rtnr_total_bgt_adjustment',
                        value: retainerBudgetAdjCalc
                    });

                    retainerBudgAdj = retainerBudgetAdjCalc;
                }
                    */

                var retainerBilled = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_total_billed'
                });
                retainerBilled = Math.abs(retainerBilled);

                var retainerBilledCalc = rtnrutil.getRetainerTotalBilled(retainerId, customerId);
                log.debug("RETAINER BILLED CALC", retainerBilledCalc);

                if(retainerBilled != retainerBilledCalc){
                    current_rec.setValue({
                        fieldId: 'custrecord_ctc_rtnr_total_billed',
                        value: retainerBilledCalc
                    });

                    retainerBilled = retainerBilledCalc;
                }
                var retainerRemaining = current_rec.getValue({
                    fieldId: 'custrecord_ctc_rtnr_total_bgt_remaining'
                });
                if (retainerStatus !== '4') {
                    log.debug(stLogTitle, retainerBudget + ' | Retainer billed: ' + retainerBilled);
                    //add functionality to deduct if user input negative amount on budget adjustment

                    if (retainerBudgAdj < 0) {
                        log.debug({
                            title: stLogTitle,
                            details: 'budget adjustment is negative, to deduct amount'
                        });
                        retainerBudgAdj = Math.abs(retainerBudgAdj);
                        retainerAmount = retainerBudget - retainerBudgAdj;
                    } else {
                        retainerBudgAdj = Math.abs(retainerBudgAdj);
                        retainerAmount = retainerBudget + retainerBudgAdj;
                    }

                    retainerAmount = retainerAmount - retainerBilled;
                    log.debug(stLogTitle, 'RETAINER AMOUNT:' + retainerAmount);

                    current_rec.setValue({
                        fieldId: 'custrecord_ctc_rtnr_total_bgt_remaining',
                        value: retainerAmount
                    });
                    //Update billed retainer record
                    /*var retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_total_bgt_remaining': retainerAmount
                        },
                        options: {
                            enableSourcing: true
                        }
                    });
                    */
                    log.debug(stLogTitle, 'RETAINER UPDATE:' + retainerId);
                    //Update customer total retainer balance
                    if (!rtnrutil.isEmpty(customerId)) {
                        var custRetUpdate = rtnrutil.getCustomerRetainerBalance(customerId)
                        if (!rtnrutil.isEmpty(custRetUpdate)) {
                            // return true;
                        }
                        log.debug(stLogTitle + ' > updateBilled', retainerId + ' | getCustomerRetainerBalance: ' + custRetUpdate);
                    }
                } // end if expired or closed

                //UPDATE RETAINER NAME
                var retainerType = current_rec.getText({
                    fieldId: 'custrecord_ctc_rtnr_type'
                });

                var newRetainerName = retainerName + ' - ' + retainerType;
                log.debug('retainer details', 'retainerName: ' + retainerName + ' | retainerType: ' + retainerType + ' | newRetainerName: ' + newRetainerName);

                /*
                record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    values: {
                        'altname': newRetainerName
                    }
                });
                */

                current_rec.setValue({
                    fieldId: 'altname',
                    value: newRetainerName
                });

                current_rec.save({
                    ignoreMandatoryFields: true
                })

            } // END IF CONTEXT
        } // END AFTER SUBMIT
        return {
            beforeLoad: beforeLoad,
            afterSubmit: rtnr_afterSubmit
        }
    })