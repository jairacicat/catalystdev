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
 * Script Name: CTC - WFA - Set Default Segments on Line
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         August 7, 2024               jaira@nscatalyst.com                   Initial Build
 *
 */
define(['N/record', 'N/search', 'N/currentRecord'], function(record, search, currentRecord) {
    function pageInit(context) {
        console.log("Page Init - context", context);
        if(context.mode == 'create' || context.mode == 'copy'){
            var rec = context.currentRecord;
            var itemCount = rec.getLineCount({ sublistId: 'item' });
            console.log("Item Count", itemCount);
            var itemIds = [];
    
            if(itemCount > 0){
                  // Gather all item IDs
                for (var i = 0; i < itemCount; i++) {
                  
                    var itemId = rec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    console.log("itemId", itemId);
                    console.log("itemId", rec.getSublistValue({sublistId: 'item', fieldId: 'item', line: i}));
                    itemIds.push(itemId);

                    rec.selectLine({sublistId: 'item', line: i});
                    rec.setCurrentSublistValue({sublistId: 'item', fieldId: 'department', value: 1});
                    rec.commitLine({sublistId: 'item'});
                }
                console.log("itemIds", itemIds);
        
                // Get locations for all items
                var locations = getItemLocations(itemIds);
                console.log("Locations", locations);

                // Get header level Department and Region
                var headerRegion = rec.getValue({ fieldId: 'class'});
                var headerDepartment = rec.getValue({ fieldId: 'department'});
                var headerLocation = rec.getValue({ fieldId: 'location'});
        
                // Set header level information to line items
                for (var i = itemCount-1; i >=0 ; i--) {
                 
                  
                    rec.selectLine({sublistId: 'item', line: i});
                    var currentItem = rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item', line: i});
                    console.log("current Item", currentItem);
                    console.log("selectLIne", i);
                    rec.setCurrentSublistValue({
                        sublistId: 'item', 
                        fieldId: 'class',
                        value: headerRegion,
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'department',
                        value: headerDepartment
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location',
                        value: locations[currentItem] || headerLocation
                    });

                    alert("stop")
                   
                   
                    /*var currentItem = rec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
        
                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'department',
                        value: rec.getValue('department')
                    });
                    console.log("Header - Department", rec.getValue('department'));
                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'class',
                        value: rec.getValue('class')
                    });
                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location',
                        value: locations[currentItem] || rec.getValue('location')
                    });
        
                    rec.commitLine({ sublistId: 'item' });
                    */
                }
            }
          
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
        pageInit: pageInit
    };
});