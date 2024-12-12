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
 * Project Number: EPS Learning : NS-101
 * Script Name: CTC - Set Invoice Delivery Method
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description This sets the default Invoice Delivery Method. If the Billing Address Country is US, set Print & Mail, otherwise, set Email.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         12/04/2024                           jaira@nscatalyst.com           Initial Build
 *
 */

define(['N/record'],
    function(record) {
        const FLD_INV_DELIVERY_METHOD = 'custentity_invoicedeliverymethod';

        const VAL_PRINT_AND_MAIL = 1;
        const VAL_EMAIL = 2

        function beforeSubmit(context) {
            try {
                if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.COPY){
                    
                    let CUSTOMER = context.newRecord;
                    let invoiceDeliveryMethod = CUSTOMER.getValue({fieldId: FLD_INV_DELIVERY_METHOD});
                    
                    if(context.type == context.UserEventType.COPY){
                        invoiceDeliveryMethod = "";
                    }

                    if(invoiceDeliveryMethod == "" || invoiceDeliveryMethod == null){
                        let billCountry = CUSTOMER.getValue({fieldId: 'billcountry'});
                        log.debug("BillCountry", billCountry);

                        if(billCountry == "" || billCountry == "US"){
                            CUSTOMER.setValue({
                                fieldId: FLD_INV_DELIVERY_METHOD,
                                value: VAL_PRINT_AND_MAIL
                            });
                        }
                        else{
                            CUSTOMER.setValue({
                                fieldId: FLD_INV_DELIVERY_METHOD,
                                value: VAL_EMAIL
                            });
                        }
                    }
                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        return {
            beforeSubmit: beforeSubmit
        };
    });