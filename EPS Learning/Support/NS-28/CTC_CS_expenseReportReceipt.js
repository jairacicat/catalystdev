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
 * Script Name: CTC - CS - Expense Report Receipt
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 7, 2024               jaira@nscatalyst.com                   Initial Build
 *
 */
define(['N/ui/dialog'], function(dialog) {

    const VAL_TRAVEL_MILEAGE = 106;
  
    function fieldChanged(context) {
        var CURRENT_RECORD = context.currentRecord;

        // Trigger for changes in 'Category' or 'Amount'
        if ((context.sublistId == 'expense' && context.fieldId === 'category') || (context.sublistId == 'expense' && context.fieldId === 'amount')) {
            var category = CURRENT_RECORD.getCurrentSublistValue({sublistId: 'expense', fieldId: 'category'});
            var amount = CURRENT_RECORD.getCurrentSublistValue({sublistId: 'expense', fieldId: 'amount'});
            var isTravelMileage = category == VAL_TRAVEL_MILEAGE;
           
            // Determine if receipt is required
            var receiptRequired = isTravelMileage || (!isTravelMileage && amount >= 25);

            // Set 'Receipt' checkbox on the sublist
            CURRENT_RECORD.setCurrentSublistValue({
                sublistId: 'expense',
                fieldId: 'receipt',
                value: receiptRequired,
                ignoreFieldChange: true
            });
        }
    }

    function validateLine(context) {
        var record = context.currentRecord;

        if (context.sublistId === 'expense') {
            var receiptRequired = record.getCurrentSublistValue({sublistId: 'expense', fieldId: 'receipt'});
            var attachment = record.getCurrentSublistValue({sublistId: 'expense', fieldId: 'expmediaitem'});

            // Alert and prevent line update if receipt is required but not attached
            if (receiptRequired && !attachment) {
                dialog.alert({
                    title: 'Attachment Required',
                    message: 'Please attach a receipt file to proceed.'
                });
                return false;
            }
        }
        return true;
    }

    return {
        fieldChanged: fieldChanged,
        validateLine: validateLine
    };
});