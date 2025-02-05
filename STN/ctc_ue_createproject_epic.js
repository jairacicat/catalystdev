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
 * Project Number: STN - Jira-NS Integration
 * Script Name: CTC - Create Project & Epic UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description This script calls the Suitelet CTC - Create Project & Epic SL.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         01.24.2025                  jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/record', 'N/https', 'N/search', 'N/url'],
    function(record, https, search, url) {

        const FLD_OPPORTUNITY_ID = 'custbody_ctc_opportunityid';
        const FLD_JIRA_PROJECT_ID = 'custentity_ctc_jira_id'
       
        const SL_SCRIPT_ID = 'customscript_ctc_sl_createprojectepic';
        const SL_SCRIPT_DEPLOYMENT = 'customdeploy_ctc_sl_createprojectepic';

        function afterSubmit(context) {
            try {
                if(context.type = context.UserEventType.CREATE || context.type == context.UserEventType.EDIT){
                    let newRecord = context.newRecord;

                    let soRec = record.load({
                        type: record.Type.SALES_ORDER,
                        id: newRecord.id
                    });

                    let customerId = soRec.getValue({ fieldId: 'entity'});
                    let opportunityId = soRec.getValue({ fieldId: FLD_OPPORTUNITY_ID});
                    let soId = newRecord.id;

                    let scriptURL = url.resolveScript({
                        deploymentId: SL_SCRIPT_DEPLOYMENT,
                        scriptId: SL_SCRIPT_ID,
                        params: {
                            'customerId' : customerId,
                            'opportunityId' : opportunityId,
                            'soId' : soId
                        },
                        returnExternalUrl: true
                    });
                    log.debug("scriptURL", scriptURL);

                    let responseBody = https.post({
                        url: scriptURL,
                        body: 'OUTBOUND'
                    });

                    log.debug("responseBody", responseBody);
                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return {
            afterSubmit: afterSubmit
        };
    });