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
 * Project Number: Service Ticket #9615
 * Script Name: CTC SL Print Packing Slip Invoice
 * Author: allison.blair@nscatalyst.com
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 * @Description
 *
 * CHANGELOGS
 *
 * Version        Date                      Author              Remarks
 * 1.00         Jan 31, 2024                asaliba             Initial build
 * 1.01         May 22, 2024                asaliba             Added the retainer type when creating retainer from Sales Orders
 * 1.02         July 27, 2024               karaneta            Fixed create retainer
 *
 */
define(['N/record', 'N/runtime', 'N/log', 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.Retainer/Retainer_Util.js'], function (record, runtime, log, rtnrutil) {

    function onRequest(context) {

        var stLogTitle = 'onRequest'
        var request = context.request;
        var response = context.response;
        var requestParameters = request.parameters;
        log.debug('request.method', request.method);
        log.debug('requestParameters', requestParameters);

        try {

            if (request.method == 'POST') {

                var recId = requestParameters.recId;
                log.debug('recId', recId);

                var transAmount = 0;

                var current_rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: recId,
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

                var retainerType = current_rec.getValue({
                    fieldId: 'custbody_ctc_retainer_type'
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

                    if (rtnrutil.fields.retainerItemList.indexOf(parseInt(itemId)) > -1) {
                        retainerAmount = itemAmount;
                    }

                    log.debug(stLogTitle, i + ' |itemId: ' + itemId + ' | rate:' + itemAmount);
                }//for


                //Create parent retainer record
                if (isRetainerReference) {
                    log.debug("Retainer Amount", retainerAmount)
                    var statCreateId = rtnrutil.createRetainer(customerId, retainerAmount, retainerExpiration, retainerType);
                    if (!rtnrutil.isEmpty(statCreateId)) {

                        current_rec.setValue({
                            fieldId: 'custbody_ctc_rtnr_so_retainer',
                            value: statCreateId
                        });

                    }
                    log.debug(stLogTitle + ' > createRetainer', isRetainerReference + ' |statCreateId: ' + statCreateId);

                }

                //Update Retainer Transaction Amount
                current_rec.setValue({
                    fieldId: 'custbody_ctc_ret_trans_amount',
                    value: retainerAmount,
                    ignoreFieldChange: true
                });

                //Update child retainer record
                if (!rtnrutil.isEmpty(retainerId)) {
                    var statUpdate = rtnrutil.updateRetainerCommitted(customerId, retainerId, retainerAmount)

                    log.debug(stLogTitle + ' > updateRetainerCommitted', retainerId + ' |statUpdate: ' + statUpdate);

                }

                current_rec.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

            }

        } catch (error) {
            log.error('Error - onRequest', error.message);
        }

    }

    return {
        onRequest: onRequest
    }
});