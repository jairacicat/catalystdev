
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
 * Script Name: CTC - Set Non-Mandatory for WS UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Sets the fields to non-mandatory for Web Services
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 7, 2024               jaira@nscatalyst.com                   Initial Build
 *
 */
define(['N/record', 'N/runtime'],
    function(record, runtime) {
        const NON_MANDATORY_FIELDS = ['shipaddresslist', 'billaddresslist', 'custbody_mhi_contact_email'];

        function beforeLoad(context) {
            // Check if the context is Web Services
            var contextType = runtime.executionContext;
            log.debug("contextType", contextType);
            if (contextType == runtime.ContextType.WEBSERVICES) {
                var newRecord = context.newRecord;

                // Set fields to non-mandatory
              
                for(let i = 0; i < NON_MANDATORY_FIELDS.length; i++){
                    try {
                        newRecord.getField({ fieldId: NON_MANDATORY_FIELDS[i] }).isMandatory = false;
                    } catch (e) {
                        log.error({
                            title: 'Error setting fields to non-mandatory',
                            details: e.toString()
                        });
                    }
                }
            
            }
        }

        return {
            beforeLoad: beforeLoad
        };
    });