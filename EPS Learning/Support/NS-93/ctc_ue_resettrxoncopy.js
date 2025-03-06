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

        const FLD_TRX_VERTEXCUSTOMERID = 'custbody_customerid_vt';
        const FLD_ENT_VERTEXCUSTOMERID = 'custentity_externalid_vt';
        const FLD_ITEM_PRODUCTCLASS = 'custitem_taxproductclass_vt';
        const FLD_TRX_PRODUCTCLASS = 'custcol_taxproductclass_vt';

        function beforeLoad(context) {
            try {
                if(context.type == context.UserEventType.COPY){
                  
                    let REC = context.newRecord;

                    //Get Customer and get default Tax Code
                    let customerId = REC.getValue({fieldId: 'entity'});
                    let customerLookup = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: customerId,
                        columns: ['taxitem', 'shipcountry', FLD_ENT_VERTEXCUSTOMERID]
                    });

                    let taxCode = customerLookup.taxitem[0].value || customerLookup.taxitem;
                    log.debug("Tax Item", taxCode);

                    let customerShipCountry;
                    if(taxCode){
                        customerShipCountry = search.lookupFields({
                            type: 'salestaxitem',
                            id: taxCode,
                            columns: 'country'
                        }).country[0].value;
                    }
                   
                    let transactionShipCountry = REC.getValue({fieldId: 'shipcountry'});
                    log.debug("customerShipCountry", customerShipCountry);
                    log.debug("transactionShipCountry", transactionShipCountry);
                
                    if(customerShipCountry != transactionShipCountry){
                        taxCode = "";
                    }

                    //Set the Tax Code on lines
                    var lineCount = REC.getLineCount({ sublistId: 'item' });
                    let itemIds = [];
                    for (var i = 0; i < lineCount; i++) {
                        let itemId = REC.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });

                        itemIds.push(itemId);
                    }

                    //Search and get Vertex product class of items:
                    let itemProductClass = getItemProductClass(itemIds);

                    for (var i = 0; i < lineCount; i++){
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

                        let itemId = REC.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });

                        REC.setSublistValue({
                            sublistId: 'item',
                            fieldId: FLD_TRX_PRODUCTCLASS,
                            value: itemProductClass[itemId],
                            line: i
                        });
                    }
                  
                    //NS-93: BR3 The Vertex Customer ID should be "refreshed" from the account, in the event that the certificate had expired or a missing certificate was added
                    let vertexCustomerId = REC.getValue({
                        fieldId: FLD_TRX_VERTEXCUSTOMERID
                    });

                    let customerVertexCustomerId = customerLookup[FLD_ENT_VERTEXCUSTOMERID];
                    log.debug("customerVertexCustomerId", customerVertexCustomerId);
                    if(customerVertexCustomerId && (vertexCustomerId != customerVertexCustomerId)){
                        REC.setValue({
                            fieldId: FLD_TRX_VERTEXCUSTOMERID,
                            value: customerVertexCustomerId
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

        function getItemProductClass(itemIds){
            // Create the saved search
            var itemSearch = search.create({
                type: search.Type.ITEM,
                filters: [
                    ['internalid', 'anyof', itemIds]
                ],
                columns: [
                    search.createColumn({ name: 'internalid' }),
                    search.createColumn({ name: FLD_ITEM_PRODUCTCLASS }) 
                ]
            });

            // Run the search
            var searchResult = itemSearch.run();
            var results = {};
            searchResult.each(function(result) {
                var itemId = result.getValue({ name: 'internalid' });
                results[itemId] = result.getValue({ name: FLD_ITEM_PRODUCTCLASS })

            });

            // Log the results
            log.debug('Search Results', JSON.stringify(results));

            return results;
        }

        return {
            beforeLoad: beforeLoad
        };
    });