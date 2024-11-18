/**
 * Project Number: EPS Learning 
 * Script Name: CTC_CS_ValidateDuplicateCustomerPO.js
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         6.26.2024                   jaira@nscatalyst.com                    Initial Build
 * 1.1          7.11.2024                   jaira@nscatalyst.com                    Update poNumber search to exclude Cancelled and Closed orders
 */

define(['N/search', 'N/currentRecord', 'N/ui/dialog'],
    function(search, currentRecord, dialog) {
        function pageInit(scriptContext){
        }
        
        function validatePO() {
            try{
                var CURRENT_RECORD = currentRecord.get();

                var poNumber = CURRENT_RECORD.getValue({fieldId: 'otherrefnum'});
                var customerId = CURRENT_RECORD.getValue({fieldId: 'entity'});

                if(customerId && poNumber){
                    //Get Parent of Customer
                    var customerParent = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: customerId,
                        columns: 'parent'
                    }).parent[0].value || customerId;
                    
                    var poSearch = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: [
                            ['otherrefnum', 'equalto', poNumber],
                            'AND',
                            ['customersubof', 'anyof', customerParent],
                            'AND',
                            ['mainline', 'is', 'T'],
                            "AND", 
                            ["status","noneof","SalesOrd:C","SalesOrd:H"]

                        ],
                        columns: ['tranid']
                    });
            
                    var duplicateFound = false;
                    poSearch.run().each(function(result) {
                        if(CURRENT_RECORD.id == "" || (CURRENT_RECORD.id && result.id != CURRENT_RECORD.id)){
                            dialog.alert({
                                title: 'Duplicate PO# Found',
                                message: 'The PO# ['+poNumber+'] is already used in another Sales Order: ' + result.getValue({name: 'tranid'})
                            });
                            duplicateFound = true;
                            return false;
                        }
                    
                        return true;
                    });
            
                    if (!duplicateFound) {
                        dialog.alert({
                            title: 'PO# Validation',
                            message: 'No duplicates found for this PO#. It is safe to proceed.'
                        });
                    }
                }
                else{
                    dialog.alert({
                        title: 'PO# Validation',
                        message: 'Please populate the Customer and/or the PO# first.'
                    });
                }
                
               
            }
            catch(o_exception){
                console.log("Error found - Validate PO: ", o_exception);
            }
        }

      
       
        return {
           validatePO: validatePO,
           pageInit: pageInit
        };
    });