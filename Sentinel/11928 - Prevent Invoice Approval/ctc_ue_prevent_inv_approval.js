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
 * Project Number: Sentinel 11928 - Prevent Invoice Approval
 * Script Name: CTC - Prevent Invoice Approval UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Prevents approval of Invoice (applicable to all invoice types):
 *              - If Enable Line Shipping is unchecked, and header Ship To is blank
 *              - If Enable Line Shipping is checked, and line Ship To and Address Book is blank
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         11/25/2024                  jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/record'],
    function(record) {
        function beforeLoad(context){
            let INVOICE = context.newRecord;

            let enableLineShipping = INVOICE.getValue({
                fieldId: 'ismultishipto'
            });

            log.debug("BeforeLoad: ", enableLineShipping);
            INVOICE.setValue({
                fieldId: 'custbody23',
                value: enableLineShipping 
            });
            INVOICE.setValue({
                fieldId: 'memo',
                value: enableLineShipping 
            });
        }
        function beforeSubmit(context) {
            if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.APPROVE){
                    let OLD_INVOICE = context.oldRecord;
                    let INVOICE = context.newRecord;

                    //Get approval status
                    let oldStatus = OLD_INVOICE.getValue({
                        fieldId: 'approvalstatus'
                    });

                    log.debug("oldStatus", oldStatus);

                    let invoiceStatus = INVOICE.getValue({
                        fieldId: 'approvalstatus'
                    });

                    log.debug("invoiceStatus", invoiceStatus);

                   // if(!(oldStatus == 1 && invoiceStatus == 2)) return; 
                    
                    //Check if Enable Line Shipping is checked
                    let enableLineShipping = INVOICE.getValue({
                        fieldId: 'custbody23'
                    });
                    log.debug("enable line shipping", enableLineShipping);
                    
                    if(enableLineShipping == true || enableLineShipping == "T" || enableLineShipping == 'true'){
                        log.debug("enablelineshipping true")
                        let itemCount = INVOICE.getLineCount({ sublistId: 'item' });
                        for(var i = 0; i < itemCount; i++){
                            let lineShipTo = INVOICE.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'shipaddress',
                                line: i
                            });

                            let lineAddressBook = INVOICE.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ns_address_book',
                                line: i
                            });

                            log.debug("Line Ship To", lineShipTo);
                            log.debug("Line Address Book", lineAddressBook);
                            if(isEmpty(lineShipTo) || isEmpty(lineAddressBook)){
                                throw("Cannot approve this Invoice: Please populate Address Book or Ship To on line " + (parseInt(i + 1)) + ".");
                            }
                        }

                        let shipToSelectField = INVOICE.getField({fieldId: 'shipaddresslist'});
                        shipToSelectField.isMandatory = false;
                    }
                    else{
                        
                        let bodyShipTo = INVOICE.getValue({
                            fieldId: 'shipaddresslist'
                        });
                        log.debug("body ship to", bodyShipTo);

                        if(isEmpty(bodyShipTo) && !enableLineShipping){
                            throw("Cannot approve this Invoice: Please populate the Ship To field.");
                        }
                    }
                }
        }

        function isEmpty(stValue) {
            return ((stValue === 'none' || stValue === '' || stValue === null || stValue === undefined) || (stValue.constructor === Array && stValue.length === 0) ||
                (stValue.constructor === Object && (function(v) { for (var k in v) return false;return true; }) (stValue)));
        }

        return {
            beforeSubmit: beforeSubmit,
            beforeLoad: beforeLoad
          
        };
    });