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
 * Project Number: Sentinel - Ticket 11928 - Prevent Invoice Approval
 * Script Name: CTC - Copy Address Book
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description Copies the Address Book column value to the Ship To column.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         12/05/2024                  jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/error'],
    function(error) {
        const FLD_ADDRESS_BOOK = 'custcol_ns_address_book';
        const FLD_SHIP_TO = 'shipaddress';
      
        function fieldChanged(context) {
            try {
                let INVOICE = context.currentRecord;

                console.log("Field: ", context.fieldId);
                if(context.fieldId == FLD_ADDRESS_BOOK && context.sublistId == 'item'){
                    let addressBook = INVOICE.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: FLD_ADDRESS_BOOK
                    });

                    INVOICE.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: FLD_SHIP_TO,
                        value: addressBook
                    });

                    console.log("Ship To Set", addressBook);
                }
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

 
        return {
          
            fieldChanged: fieldChanged,

        };
    });