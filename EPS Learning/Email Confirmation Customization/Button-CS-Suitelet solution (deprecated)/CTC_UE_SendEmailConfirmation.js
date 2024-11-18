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
 * Project Number: 11298 - EPS Learning
 * Script Name: 
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/record', 'N/ui/serverWidget', 'N/url', 'N/https'],
    function(record, serverWidget, url, https) {

        const SL_SCRIPTID = 'customscript_ctc_sl_sendemailconfirm';
        const SL_SCRIPTDEPLOYMENTID = 'customdeploy_ctc_sl_sendemailconfirm';


        //Adds the Send Emali Confirmation Triggered on View of the Transaction (Sales Order & Item Fulfillment)
        function beforeLoad(context) {
            try {
                if(context.type == context.UserEventType.VIEW){ 
                    context.form.clientScriptModulePath = "./CTC_CS_SendEmailConfirmation.js";

                    let tranId = context.newRecord.id;
                    let tranType = context.newRecord.type;   

                    context.form.addButton({ id: "custpage_writeoff ",label: "Send Email Confirmation",functionName: "confirmSendEmail('"+tranId+"', '"+tranType+"')"});    
                    
                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function afterSubmit(context) {
            try {
                if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY){
                    
                    let tranId = context.newRecord.id;
                    let tranType = context.newRecord.type;   

                    let suiteletURL = url.resolveScript({
                        scriptId: SL_SCRIPTID,
                        deploymentId: SL_SCRIPTDEPLOYMENTID,
                        returnExternalUrl: true,
                        params: {
                            'tranid': tranId,
                            'type': tranType
                        }
                    });
                    
                    log.debug("suiteletURL", suiteletURL);

                    let response = https.post({
                        url : suiteletURL,
                    });

                    log.debug("response", response);

                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function isEmpty (stValue) {
            return (
                (stValue === '' || stValue == null || stValue == undefined) || (stValue.constructor === Array && stValue.length == 0) || (stValue.constructor === Object && (
                    function(v) {
                        for (var k in v)
                            return false;
                        return true;
                    }
                )(stValue)));
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };
    });