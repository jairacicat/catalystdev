
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
 * Script Name: CTC - WFA - Get Total Est. Unit Cost
 * Description: Calculates the total estimated unit cost for all lines on a Sales Order.
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 7, 2024               jaira@nscatalyst.com                   Initial Build
 *
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {

    function getTotalEstUnitCost(context) {
        // Retrieve the current record (Sales Order) from the workflow context
        var salesOrder = context.newRecord;

        var lineCount = salesOrder.getLineCount({ sublistId: 'item' });
        var totalEstUnitCost = 0;

        // Loop through each line to sum up the Est. Unit Cost
        for (var i = 0; i < lineCount; i++) {
            var estUnitCost = salesOrder.getSublistValue({
                sublistId: 'item',
                fieldId: 'estimatedcost', // Assuming the field id for Est. Unit Cost is 'estimatedcost'
                line: i
            });
            totalEstUnitCost += estUnitCost || 0;
        }

        // Optionally, log the total for debugging purposes
        log.debug('Total Estimated Unit Cost', totalEstUnitCost);

        // Return the total estimated unit cost
        return totalEstUnitCost;
    }

    return {
        onAction: getTotalEstUnitCost
    };
});
