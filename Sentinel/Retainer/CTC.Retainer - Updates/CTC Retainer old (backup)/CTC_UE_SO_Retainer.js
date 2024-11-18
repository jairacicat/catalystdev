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
 * Script Name: CTC UE SO Retainer
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @description
 *
 * CHANGELOGS
 *
 * Version    Date            Author            Remarks
 * 1.00     Jun 20, 2022    karaneta        Initial Build
 * 1.10     Jan 31, 2024    asaliba         Add custom button to create the retainer

 *
 */

define(['N/record', 'N/search', 'N/log', 'N/runtime', 'N/ui/serverWidget', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'], function (record, search, log, runtime, serverWidget, rtnrutil) {

    //declare variable

    function rtnr_beforeLoad(context) {
        log.audit('Start rtnr_beforeLoad', new Date());
        var stLogTitle = 'rtnr_beforeLoad';
        log.debug(stLogTitle, '-------------> SCRIPT ENTRY <------------------');
        log.debug(stLogTitle, 'CONTEXT ' + JSON.stringify(context));

        try {

            if (context.type == context.UserEventType.VIEW) {

                var currentRecord = context.newRecord;
                var currentRecordId = currentRecord.id;
                var currentForm = context.form;
                currentForm.clientScriptFileId = 1277217;

                var createRetainer = currentRecord.getValue({
                    fieldId: 'custbody_ctc_is_retainer_reference'
                });

                var parentRetainer = currentRecord.getValue({
                    fieldId: 'custbody_ctc_rtnr_so_retainer'
                });

                var retainerAmount = currentRecord.getValue({
                    fieldId: 'custbody_ctc_ret_trans_amount'
                });

                var retainerExpiration = currentRecord.getValue({
                    fieldId: 'custbody_ctc_rtnr_expiration'
                });

                var retainerType = currentRecord.getValue({
                    fieldId: 'custbody_ctc_retainer_type'
                });

                if (createRetainer == true && !parentRetainer) {

                    currentForm.addButton({
                        id: 'custpage_ctc_create_retainer',
                        label: 'Create Retainer',
                        functionName: 'createRetainer(' + currentRecordId + ' )'
                    });
                }
            }


        } catch (error) {
            log.error('Error - ' + stLogTitle, error.message);
        }
        log.audit('Stop rtnr_beforeLoad', new Date());
    }

    function rtnr_afterSubmit(context) {
        log.audit('Start rtnr_afterSubmit', new Date());
        var stLogTitle = 'rtnr_afterSubmit';
        log.debug(stLogTitle, '-------------> SCRIPT ENTRY <------------------');
        log.debug(stLogTitle, 'CONTEXT ' + JSON.stringify(context));

        if (context.type === context.UserEventType.CREATE) {
            /*
            // GET RETAINER ITEM ID LINKS
            var retainerItemId = runtime.getCurrentScript().getParameter({
                name: 'custscript_ctc_rtnr_item'
            });
            */
            var current_rec = context.newRecord;
            var currentID = current_rec.id;
            var currentType = current_rec.type;
            var transAmount = 0;

            current_rec = record.load({
                type: record.Type.SALES_ORDER,
                id: currentID,
                isDynamic: true
            });

            var customerId = current_rec.getValue({
                fieldId: 'entity'
            });

            var isRetainerReference = current_rec.getValue({
                fieldId: 'custbody_ctc_is_retainer_reference'
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
            var retainerAmount;


            log.debug(stLogTitle, 'isRetainerReference' + isRetainerReference + ' retainerId:' + retainerId + ' itemCount: ' + itemCount);

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

            //Update Retainer Transaction Amount
            current_rec.setValue({
                fieldId: 'custbody_ctc_ret_trans_amount',
                value: retainerAmount,
                ignoreFieldChange: true
            });


            //Create parent retainer record
            if (isRetainerReference) {
                var statCreateId = rtnrutil.createRetainer(customerId, retainerAmount, retainerExpiration);
                if (!rtnrutil.isEmpty(statCreateId)) {

                    current_rec.setValue({
                        fieldId: 'custbody_ctc_rtnr_so_retainer',
                        value: statCreateId
                    });

                }
                log.debug(stLogTitle + ' > createRetainer', isRetainerReference + ' |statCreateId: ' + statCreateId);

            }

            //Update child retainer record
            if (!rtnrutil.isEmpty(retainerId)) {
                var statUpdate = rtnrutil.updateRetainerCommitted(customerId, retainerId, retainerAmount)

                log.debug(stLogTitle + ' > updateRetainerCommitted', retainerId + ' |statUpdate: ' + statUpdate);

            }

            current_rec.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });
            log.audit('Stop rtnr_afterSubmit', new Date());
            return true;

        } // END IF CONTEXT

    } // END AFTER SUBMIT


    return {
        beforeLoad: rtnr_beforeLoad
        //afterSubmit: rtnr_afterSubmit
    }
})