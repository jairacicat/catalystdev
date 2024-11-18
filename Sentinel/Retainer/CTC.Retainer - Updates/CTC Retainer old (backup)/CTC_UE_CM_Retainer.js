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
 * Script Name: CTC UE CM Retainer
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @description Retainer budget adjusment on credit memo
 *
 * CHANGELOGS
 *
 * Version    Date            Author            Remarks
 * 1.00        Sept 26, 2022    karaneta            Initial Build
 * 1.00        July 15, 2024    karaneta            Change and deduct credit memo retainer amount to retainer balance
 *
 */
define(['N/record', 'N/search', 'N/log', 'N/runtime', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'],
    function (record, search, log, runtime, rtnrutil) {

        //declare variable

        function rtnr_afterSubmit(context) {
            var stLogTitle = 'rtnr_afterSubmit';
            log.debug(stLogTitle, '-------------> SCRIPT ENTRY <------------------');
            //log.debug(stLogTitle, 'CONTEXT ' + JSON.stringify(context));

            var current_rec = context.newRecord;
            var currentID = current_rec.id;
            var currentType = current_rec.type;
            var retTransAmount = 0;

            current_rec = record.load({
                type: record.Type.CREDIT_MEMO,
                id: currentID,
                isDynamic: true
            });

            var customerId = current_rec.getValue({
                fieldId: 'entity'
            });


            var retainerId = current_rec.getValue({
                fieldId: 'custbody_ctc_rtnr_inv_retainer'
            });

            retTransAmount = current_rec.getValue({
                fieldId: 'custbody_ctc_ret_trans_amount'
            });

            var itemCount = current_rec.getLineCount({
                sublistId: 'item'
            });

            var retainerAmount;

            log.debug(stLogTitle, 'retainerId:' + retainerId + ' itemCount: ' + itemCount + 'customerId:' + customerId);


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

                //if (retainerItemList.indexOf(itemId) > -1) {
                if (itemId === rtnrutil.fields.retainerItemId || itemId === rtnrutil.fields.retainerItemId_ir || itemId === rtnrutil.fields.retainerItemId_advisory || itemId === rtnrutil.fields.retainerFortisIr || itemId === rtnrutil.fields.retainerFortisVciso) {
                    log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' | includes in retainer List');
                    retainerAmount = itemAmount;
                } else {
                    log.error("item not in retainerItemList");
                }


                log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' | rate:' + itemAmount);
            }//for


            //Update retainer budget remaining
            if (!rtnrutil.isEmpty(retainerId) && !rtnrutil.isEmpty(retainerAmount)) {
                //Update Retainer Transaction Amount
                current_rec.setValue({
                    fieldId: 'custbody_ctc_ret_trans_amount',
                    value: -retainerAmount,
                    ignoreFieldChange: true
                });

                current_rec.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

                var statUpdate = rtnrutil.updateRetainerTotalBilled(retainerId, retainerAmount, customerId)
                log.debug(stLogTitle + ' > updateRetainerTotalBilled', retainerId + ' |statUpdate: ' + statUpdate);
                if (!rtnrutil.isEmpty(statUpdate)) {
                    var stat = rtnrutil.getCustomerRetainerBalance(customerId)

                }
                return true;


            }

            log.debug(stLogTitle, '-------------> SCRIPT END <------------------');


        } // END AFTER SUBMIT

        return {
            afterSubmit: rtnr_afterSubmit
        }
    })
