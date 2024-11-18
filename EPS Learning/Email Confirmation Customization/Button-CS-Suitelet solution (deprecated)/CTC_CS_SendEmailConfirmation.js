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
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/error', 'N/ui/dialog', 'N/https', 'N/url', 'N/ui/message'],
    function(error, dialog, https, url, msg) {

        let isTriggered = false;
        const SL_SCRIPTID = 'customscript_ctc_sl_sendemailconfirm';
        const SL_SCRIPTDEPLOYMENTID = 'customdeploy_ctc_sl_sendemailconfirm';

        function pageInit(context) {}

        function confirmSendEmail(tranId, tranType) {

            var options = {
                title: "Confirm to Email the Contact",
                message: "Are you sure you want to send email confirmation? Press OK to continue."
            };

            function success(result) {
                if (result == true) {
                    //call suitelet
                    var suiteletURL = url.resolveScript({
                        scriptId: SL_SCRIPTID,
                        deploymentId: SL_SCRIPTDEPLOYMENTID,
                        returnExternalUrl: false,
                        params: {
                            'tranid': tranId,
                            'type': tranType
                        }
                    });
                    // Calling the Suitelet like this does not open a new page, but it does allow you to 
                    // receive back a response from the Suitelet and perform logic based on the response 
                    // in this Client Script. The logic here is performed in the showSuccess function.
                    https.get.promise({
                        url: suiteletURL
                    }).then(function(response) {
                       
                        var responseBody = JSON.parse(response.body);
                        console.log('responseBody', responseBody);

                        if (responseBody.ok) {
                            showSuccess(tranId, tranType)
                        } else {
                            alert("No email sent. Please populate the Contact's Email field.");
                        }
                    }).catch(function(reason) {
                        log.error("failed to send email", reason)
                        showError(reason);
                    });
                    // If the suitelet generates a PDF or form that should appear for the user, use window.open()
                    //window.open(suiteletURL);
                    // To open SuiteLet in same tab, use location.href
                    //location.href = suiteletURL;
                    // To open SuiteLet in same tab without popup to confirm, add "window.onbeforeunload = null;":
                    //window.onbeforeunload = null;
                    //location.href = suiteletURL;
                }
                return result;
            }

            function showSuccess(tranId, tranType) {
                var confirmMsg = msg.create({
                    title: "Email Sent",
                    message: "An email has been sent to the customer.",
                    type: msg.Type.CONFIRMATION
                });
                confirmMsg.show({
                    duration: 5000 // will disappear after 5s
                });
            }

            function failure(reason) {
                showError(reason);
            }

            function showError(message) {
                var confirmMsg = msg.create({
                    title: "Email Failure",
                    message: "Email Failed For Reason: " + message,
                    type: msg.Type.WARNING
                });
                confirmMsg.show({
                    duration: 5000 // will disappear after 30s
                });
            }

            if(!isTriggered){
                isTriggered = true;
                dialog.confirm(options).then(success).catch(failure);
            }
            else{
                alert("You have already triggered this action. Refresh the page to retrigger.");
            }
           
        }

        return {
            pageInit: pageInit,
            confirmSendEmail: confirmSendEmail
        };
    });