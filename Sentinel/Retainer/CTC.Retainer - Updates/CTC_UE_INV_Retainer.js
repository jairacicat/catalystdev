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
 * Script Name: CTC UE INV Retainer
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @description
 *
 * CHANGELOGS
 *
 * Version    Date            Author            Remarks
 * 1.00        Sept 26, 2022    karaneta            Initial Build
 * 1.01        May 30, 2024    karaneta            Fixed Retainer transaction amount bug when no parent retainer and retainer id use.
 * 1.02        Sept 9, 2024    karaneta            Add feature to update parent retainer budget from invoice
 * 1.03        Sept 23, 2024    karaneta           Set tax total to zero, set retainer item to non-taxable
 * 1.04        November 11, 2024 jcicat            Add update parent retainer functionality
 *
 */
define(['N/record', 'N/search', 'N/log', 'N/runtime', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'],
    function (record, search, log, runtime, rtnrutil) {

        //declare variable

        function rtnr_afterSubmit(context) {
            var stLogTitle = 'rtnr_afterSubmit';
            log.debug(stLogTitle, '-------------> SCRIPT ENTRY <------------------');
            log.debug(stLogTitle, 'CONTEXT ' + JSON.stringify(context));

            //if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE){
            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var current_rec = context.newRecord;
                var currentID = current_rec.id;
                var currentType = current_rec.type;
                var retItemAmount = 0;
                var retainerAmount = 0;
                var transAmount = 0;

                current_rec = record.load({
                    type: record.Type.INVOICE,
                    id: currentID,
                    isDynamic: true
                });

                var customerId = current_rec.getValue({
                    fieldId: 'entity'
                });

                var isRetainerReference = current_rec.getValue({
                    fieldId: 'custbody_ctc_is_retainer_reference'
                });

                var parentRetainerId = current_rec.getValue({
                    fieldId: 'custbody_ctc_rtnr_so_retainer'
                });

                var retainerId = current_rec.getValue({
                    fieldId: 'custbody_ctc_rtnr_inv_retainer'
                });

                var retainerExpiration = current_rec.getValue({
                    fieldId: 'custbody_ctc_rtnr_expiration'
                });

                var itemCount = current_rec.getLineCount({
                    sublistId: 'item'
                });

                var totalTax = current_rec.getValue({
                    fieldId: 'taxtotal'
                });

                var retTransAmount = current_rec.getValue({
                    fieldId: 'custbody_ctc_ret_trans_amount'
                });

                var addToRetainer = current_rec.getValue({
                    fieldId: 'custbody_ctc_inv_addto_retainer'
                });

                var addedToBudget = current_rec.getValue({
                    fieldId: 'custbody_ctc_rtnr_addtobudget'
                });

                log.debug(stLogTitle, 'isRetainerReference' + isRetainerReference + ' |parentRetainerId:' + parentRetainerId + ' |retainerId:' + retainerId + ' itemCount: ' + itemCount + ' |totalTax:' + totalTax);
                log.debug(stLogTitle, 'addedToBudget: ' + addedToBudget + ' |parentRetainer:' + parentRetainerId);

                for (var i = 0; i <= itemCount - 1; i++) {

                    current_rec.selectLine({
                        sublistId: 'item',
                        line: i
                    });

                    var itemId = current_rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });

                    var itemAmount = current_rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount'
                    });
               
                    log.debug(stLogTitle, i + ' isRetainerItem(parsed): ' + rtnrutil.fields.retainerItemList.indexOf(parseInt(itemId)));
                    if (rtnrutil.fields.retainerItemList.indexOf(parseInt(itemId)) > -1) {
                    //if (itemId === rtnrutil.fields.retainerItemId || itemId === rtnrutil.fields.retainerItemId_ir || itemId === rtnrutil.fields.retainerItemId_advisory || itemId === rtnrutil.fields.retainerFortisIr || itemId === rtnrutil.fields.retainerFortisVciso) {
                        log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' | included in retainer List');
                        retainerAmount += itemAmount;
                        if(totalTax !== 0 || totalTax < 0 ){
                            log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' SET ITEM TO NON-TAXABLE');
                            current_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'taxcode',
                                value: '-7'
                            });
                        }
                    } else {
                        log.error("item not in retainerItemList");
                    }


                    log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' | rate:' + itemAmount);

                }//end for

                log.debug(stLogTitle, 'retainerAmount:' + retainerAmount + ' |totalTax:' + totalTax);
                log.debug(stLogTitle, 'addToRetainer: ' + addToRetainer + ' |parentRetainerId:' + parentRetainerId);

                //remove tax as per customer request
                /*
                if (totalTax !== 0 || totalTax !== '0') {
                    retainerAmount = Math.abs(retainerAmount);
                    totalTax = Math.abs(totalTax);
                    retainerAmount = retainerAmount + totalTax;
                    //retainerAmount = -retainerAmount;
                }*/

                if (rtnrutil.isEmpty(parentRetainerId) && !rtnrutil.isEmpty(retainerId)) {
                    //Update Retainer Transaction Amount
                    if (!rtnrutil.isEmpty(retainerAmount)) {
                        retainerAmount = Math.abs(retainerAmount);
                        log.debug(stLogTitle, 'UPDATE RETAINER AMOUNT:' + retainerAmount);
                        current_rec.setValue({
                            fieldId: 'custbody_ctc_ret_trans_amount',
                            value: -retainerAmount,
                            ignoreFieldChange: true
                        });

                        /*
                        //set tax total to zero
                        log.debug(stLogTitle, 'SET TAX TOTAL TO ZERO');
                        current_rec.setValue({
                            fieldId: 'taxtotal',
                            value: 0,
                            ignoreFieldChange: true
                        });
                        log.debug(stLogTitle, 'SET TAX TOTAL TO ZERO');
                        current_rec.setValue({
                            fieldId: 'total',
                            value: 0,
                            ignoreFieldChange: true
                        });*/


                    }

                }

                if (!rtnrutil.isEmpty(parentRetainerId) && rtnrutil.isEmpty(retainerId)) {
                    //Update Retainer Transaction Amount
                    if (!rtnrutil.isEmpty(retainerAmount)) {
                        retainerAmount = Math.abs(retainerAmount);
                        log.debug(stLogTitle, 'UPDATE RETAINER AMOUNT:' + retainerAmount);
                        current_rec.setValue({
                            fieldId: 'custbody_ctc_ret_trans_amount',
                            value: retainerAmount,
                            ignoreFieldChange: true
                        });

                    }

                }

                //09-09-2024 Add retainer budget to parent retainer "Add to Retainer"
                if (addToRetainer && !rtnrutil.isEmpty(parentRetainerId)) {

                    //Only trigger if Added To Budget is blank
                    if(addedToBudget != true){
                        //Update parent retainer budget
                        var updatePTStat = rtnrutil.updateParentRetainer(parentRetainerId, retainerAmount, customerId);
                        log.audit(stLogTitle, 'addToRetainer:' + updatePTStat);

                        //Update added to budget field to prevent re-adding
                        current_rec.setValue({
                            fieldId: 'custbody_ctc_rtnr_addtobudget',
                            value: true
                        });
                    }
                }

                //Update/activate parent retainer record
                if (isRetainerReference && !addToRetainer) {
                    if (!rtnrutil.isEmpty(parentRetainerId)) {
                        var statUpdatePRId = rtnrutil.updateActivateParentRetainer(parentRetainerId, retainerAmount, retainerExpiration);

                        log.debug(stLogTitle + ' > updateActivateParentRetainer', isRetainerReference + ' |statCreateId: ' + statUpdatePRId);
                    }

                }

                //Update billed retainer record
                if (!rtnrutil.isEmpty(retainerId) && !rtnrutil.isEmpty(retainerAmount)) {

                    var statUpdate = rtnrutil.updateRetainerTotalBilled(retainerId, retainerAmount, customerId)

                    log.debug(stLogTitle + ' > updateRetainerTotalBilled:', retainerId + ' |statUpdate: ' + statUpdate);

                }

                //Update customer total retainer balance
                if (!rtnrutil.isEmpty(customerId)) {
                    var custRetUpdate = rtnrutil.getCustomerRetainerBalance(customerId)

                    log.debug(stLogTitle + ' > updateBilled', retainerId + ' | getCustomerRetainerBalance cust id: ' + custRetUpdate);

                }

                current_rec.save({
                    ignoreMandatoryFields: true
                });

            } // END IF CONTEXT

        } // END AFTER SUBMIT

        return {
            afterSubmit: rtnr_afterSubmit
        }
    })
