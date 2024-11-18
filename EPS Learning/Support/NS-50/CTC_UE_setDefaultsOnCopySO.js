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
 * Script Name: CTC - UE - Set Default on Copy SO
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 7, 2024               jaira@nscatalyst.com                   Initial Build
 *
 */
define(['N/search', 'SuiteScripts/Myers-Holum/Customer Territory Class Mapping/Library/MHI_EPS_CustomerTerritoryClassMapping_Library.js'], 
    function(search, LIBRARY) {

    const VAL_DEPARTMENT = 1;           // 0000 - NO DEPARTMENT
    const VAL_LOCATION = 4;             // 0000 NO LOCATION

    function beforeLoad(context) {
        try{
            if(context.type == context.UserEventType.COPY || context.type == context.UserEventType.CREATE){
                var rec = context.newRecord;
                var type = rec.type || 'salesorder';
                log.debug("Type", type);
                
                var createdFrom = rec.getValue({fieldId: 'createdfrom'});
                log.debug("Created from", createdFrom);
                if(!createdFrom) return; 
    
                //Set the Region, Department and Location:
                var customerFieldId = LIBRARY.getCustomerFieldId(type);
                var territoryNetsuite = LIBRARY.getCustomerTerritory(rec, customerFieldId);
                var VAL_REGION = null;
                if(territoryNetsuite){
                    VAL_REGION = LIBRARY.searchTerritory(territoryNetsuite);
                }

                var headerRegion = rec.getValue({ fieldId: 'class'});
                var headerDepartment = rec.getValue({ fieldId: 'department'});
                var headerLocation = rec.getValue({ fieldId: 'location'});

                if(!headerRegion){
                    rec.setValue({ fieldId: 'class', value: VAL_REGION});
                    headerRegion = VAL_REGION;
                }
                if(!headerDepartment){
                    rec.setValue({ fieldId: 'department', value: VAL_DEPARTMENT});
                    headerDepartment = VAL_DEPARTMENT;
                }
                if(!headerLocation){
                    rec.setValue({ fieldId: 'location', value: VAL_LOCATION});
                    headerLocation = VAL_LOCATION
                }
    
                var itemCount = rec.getLineCount({ sublistId: 'item' });
                log.debug("Item Count", itemCount);
                var itemIds = [];
        
                if(itemCount > 0){
                    // Gather all item IDs
                    for (var i = 0; i < itemCount; i++) {
                        var itemId = rec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });
                        itemIds.push(itemId);
                    }
                
                    // Get locations for all items
                    var locations = getItemLocations(itemIds);
                
                    // Get header level segment values
            
                    // Set header level information to line items
                    for (var i = 0; i < itemCount ; i++) {
                     
                        var currentItem = rec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i});
    
                        //Get current line segment values:
                        var lineRegion = rec.getSublistValue({ sublistId: 'item', fieldId: 'class', line: i});
                        var lineDepartment = rec.getSublistValue({ sublistId: 'item', fieldId: 'department', line: i});
                        var lineLocation = rec.getSublistValue({ sublistId: 'item', fieldId: 'location', line: i});
    
                        if(lineRegion == ''){
                            rec.setSublistValue({
                                sublistId: 'item', 
                                fieldId: 'class',
                                value: VAL_REGION,
                                line: i
                            });
                        }
                        
                        if(lineDepartment == ''){
                            rec.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'department',
                                value: VAL_DEPARTMENT,
                                line: i
                            });
                        }
                      
                        if(lineLocation == ''){
                            rec.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'location',
                                value: locations[currentItem] || VAL_LOCATION,
                                line: i
                            });
                        }
                    }
                }
            }
        }
        catch(e){
            log.error("Error on setting defaults", e);
        }
        
    }

    function getItemLocations(itemIds) {
        var locationMap = {};
        var itemSearch = search.create({
            type: search.Type.ITEM,
            filters: [['internalid', 'anyof', itemIds]],
            columns: ['internalid', 'location']
        });

        itemSearch.run().each(function(result) {
            locationMap[result.getValue('internalid')] = result.getValue('location');
            return true; // Continue to next result
        });

        return locationMap;
    }

    return {
        beforeLoad: beforeLoad
    };
});