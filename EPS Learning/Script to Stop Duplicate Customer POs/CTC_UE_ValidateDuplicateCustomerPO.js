/**
 * Project Number: EPS Learning
 * Script Name: CTC | Validate PO# UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         6.26.2024                  jaira@nscatalyst.com                     Initial Build
 *
 */

define(['N/ui/serverWidget'],
    function(serverWidget) {
        function beforeLoad(context) {
            try {
                if([context.UserEventType.CREATE, context.UserEventType.EDIT, context.UserEventType.COPY].indexOf(context.type) > -1){
                    var form = context.form;

                    var button = form.addButton({
                        id: 'custpage_check_po',
                        label: 'Check PO#',
                        functionName: 'validatePO'
                    });
                    
                    // Attach the client script which will define the validatePO function
                    form.clientScriptModulePath = './CTC_CS_ValidateDuplicateCustomerPO.js';
                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        return {
            beforeLoad: beforeLoad
        };
    });