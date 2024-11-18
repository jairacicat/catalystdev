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
 * Project Number: NS-93 - EPS Learning - Reset Transaction on Copy
 * Script Name: CTC - Reset Transactions on Copy UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Resets the Tax Code on the lines when making a copy of Sales Order and Quotes. The Tax Codes should be coming from the Item Master. The Do Not Call Vertex needs to be unchecked for Open and Closed Opportunities, Quotes, and Sales Orders,
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         09/16/2024                  jaira@nscatalyst.com                    Initial Build
 * 2.00         09/30/2024                  jaira@nscatalyst.com                    Reset Ready For Fulfillment checkbox: NS-204
 */

define(['N/record', 'N/search'],
    function(record, search) {
        const FLD_READYFORFULFILLMENT = 'custbody_mhi_ready_for_fulfillment';

        function beforeLoad(context) {
            try {
                if(context.type == context.UserEventType.COPY){
                  
                    let REC = context.newRecord;

                    //Get Customer and get default Tax Code
                    let customerId = REC.getValue({fieldId: 'entity'});
                    let customerLookup = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: customerId,
                        columns: ['taxitem', 'shipcountry']
                    });

                    let taxCode = customerLookup.taxitem[0].value || customerLookup.taxitem;
                    log.debug("Tax Item", taxCode);

                    let customerShipCountry
                    if(taxCode){
                        customerShipCountry = search.lookupFields({
                            type: 'salestaxitem',
                            id: taxCode,
                            columns: 'country'
                        }).country;
                    }
                   
                    let transactionShipCountry = REC.getValue({fieldId: 'shipcountry'});
                    log.debug("customerShipCountry", customerShipCountry);
                    log.debug("transactionShipCountry", transactionShipCountry);
                
                    if(customerShipCountry != transactionShipCountry){
                        taxCode = "";
                    }

                    //Set the Tax Code on lines
                    let itemCount = REC.getLineCount({sublistId: 'items'});

                    var lineCount = REC.getLineCount({ sublistId: 'item' });

                    for (var i = 0; i < lineCount; i++) {
                        REC.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            value: taxCode,
                            line: i
                        });

                        log.debug({
                            title: 'Tax Code set',
                            details: 'Line ' + (i + 1) + ' Tax Code re-set to: ' + taxCode
                        });
                    }
                  

                    //NS-204: Reset Ready for Fulfillment checkbox:
                    REC.setValue({
                        fieldId: FLD_READYFORFULFILLMENT,
                        value: false
                    });

                   
                }
            } catch (o_exception) {
               log.error("Error in UE", o_exception.message);
            }
        }

        function beforeSubmit(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function afterSubmit(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return {
            beforeLoad: beforeLoad,
            // beforeSubmit: beforeSubmit,
            // afterSubmit: afterSubmit
        };
    });