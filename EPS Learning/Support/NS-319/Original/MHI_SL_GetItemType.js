/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

define(['N/record', 'N/search'], function (record, search) {
    'use strict';
  
    return {
        getItemType: function ( itemID ) {
            var itemSearchObj = search.create({
                type: "item",
                filters: [ ["internalid","anyof", parseInt( itemID )] ],
                columns:[ search.createColumn({name: "type", label: "Type"}) ]
            });

            var getSearchResult = itemSearchObj.run().getRange(0, 1);
            var itemType = getSearchResult[0].getValue('type');

            return itemType;
        },

        onRequest: function ( context ) {
            try {
                var parameters = context.request.parameters;
                var itemID = parameters.itemID;
                var parentItemID = itemID;

                if ( parameters.action == 'get_item_type' ) {
                    context.response.write( JSON.stringify({ item_type: this.getItemType( itemID ) }) );
                } else if ( parameters.action == 'is_kit_shippable' ) {
                    var isShippable = false;

                    var itemRecord = record.load({
                        type: record.Type.KIT_ITEM,
                        id: parseInt( itemID ),
                        isDynamic: true
                    })
                    
                    var lines = itemRecord.getLineCount({sublistId: 'member'});
                    for ( var i=0; i < lines; i++ ){
                        itemRecord.selectLine({ sublistId: 'member', line: i });
                        var itemID = itemRecord.getCurrentSublistValue({
                            sublistId: 'member',
                            fieldId: 'item'
                        });

                        log.debug('item type + i', this.getItemType( itemID ) + ':' + i );

                        // If item is inventory or assembly, order is shippable
                        var itemType = this.getItemType(itemID);
                        if (itemType == 'InvtPart' || itemType == 'Assembly') {
                            isShippable = true;
                        }
                    }

                    context.response.write( JSON.stringify({ is_shippable: isShippable, itemID: parentItemID, action: parameters.action, rate: parameters.rate }) );
                }

            } catch (error) {
                log.debug('Error 🛑', error.message);
            }
        }
    };
  });
  