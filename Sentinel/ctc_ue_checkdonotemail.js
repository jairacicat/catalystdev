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
 * Project Number: 11405 - Invoice Customizations
 * Script Name: CTC - Check Do not Email UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Checks the CTC | Do not Email checkbox by default
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         10.16.2024                  jaira@nscatalyst.com                            Initial Build
 *
 */

define(['N/record'],
    function(record) {
        const FLD_DONOTEMAIL = 'custbody_ctc_donotemail';

        function beforeLoad(context) {
            try {
                if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY){
                    context.newRecord.setValue({
                        fieldId: FLD_DONOTEMAIL,
                        value: true
                    });
                }   

            } catch (o_exception) {
                log.error("Error in setting checkbox to true", o_exception);
            }
        }

        return {
            beforeLoad: beforeLoad
        };
    });