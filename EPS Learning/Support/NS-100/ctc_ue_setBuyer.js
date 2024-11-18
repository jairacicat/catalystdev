
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
 * Script Name: CTC - Set Buyer UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Sets the Buyer field for Vendor Bills
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 19, 2024               jaira@nscatalyst.com                   Initial Build
 *
 */
define(['N/record', 'N/search'],
    function(record, search) {

        function afterSubmit(context) {
            if (context.type == context.UserEventType.CREATE) {
                var BILL_ID = context.newRecord.id;

                // Get the Buyer from the PO's related to this Bill
                try {
                    for(let i = 0; i < NON_MANDATORY_FIELDS.length; i++){
                        newRecord.getField({ fieldId: NON_MANDATORY_FIELDS[i] }).isMandatory = false;
                    }
                } catch (e) {
                    log.error({
                        title: 'Error setting fields to non-mandatory',
                        details: e.toString()
                    });
                }
            }
        }

        return {
            afterSubmit: afterSubmit
        };
    });