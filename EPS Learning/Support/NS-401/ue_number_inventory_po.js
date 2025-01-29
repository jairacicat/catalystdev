/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
 define(['N/log', 'N/record', 'N/runtime'],
    function (log, record, runtime) {

        function beforeSubmit(context) {
            try {
                log.debug('beforeSubmit', runtime.getCurrentUser().id)
                if (context.type == context.UserEventType.CREATE || (context.type == context.UserEventType.EDIT && runtime.getCurrentUser().id ==1008739)){
                   
                }
                else{
                    return;
                }
                let newRec = context.newRecord;
              
                let totalLines = newRec.getLineCount({
                    sublistId: 'item'
                });
                log.debug('totalLines',totalLines)
                for (let i = 0; i < totalLines; i++) {
                    let itemType = newRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_mhi_item_type',
                        line: i
                    });
                    let itemID = newRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    log.debug("Data: ", itemType + " : " + itemID)
                    var valline = newRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_itm_print_no',
                        line: i
                    });
                   
                    if (itemType == 'Inventory Item' && valline =='' && context.type == context.UserEventType.CREATE) {
                        var iteRec = record.load({
                            type: "inventoryitem",
                            id: itemID
                        });
                        var pnunmber = iteRec.getValue("custitem_itm_print_no");
                        pnunmber = pnunmber == '' || pnunmber == 0 ? 1 : pnunmber;
                        log.debug('pnunmberuno', pnunmber)
                        newRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_itm_print_no',
                            value: pnunmber + 1,
                            ignoreFieldChange: true,
                            line: i
                            //  forceSyncSourcing: true
                        });

                        iteRec.setValue({
                            fieldId: "custitem_itm_print_no",
                            value: pnunmber + 1,
                        });
                        iteRec.save({ignoreMandatoryFields: true});

                        log.debug('data from items updated')
                    }

                    if((context.type == context.UserEventType.EDIT && runtime.getCurrentUser().id == 1008739)){
                        var iteRec = record.load({
                            type: record.Type.INVENTORY_ITEM,
                            id: itemID
                        });
                        log.debug("item", iteRec);
                        var pnunmber = iteRec.getValue("custitem_itm_print_no");
                        pnunmber = pnunmber == '' || pnunmber == 0 ? 1 : pnunmber;
                        log.debug('pnunmberuno', pnunmber);
                        let newPrintNumber = pnunmber + 1;
                        log.debug('newPrintNumber', newPrintNumber);

                        iteRec.setValue({
                            fieldId: "custitem_itm_print_no",
                            value: parseInt(newPrintNumber)
                        });
                        var itemRecId = iteRec.save({ignoreMandatoryFields: true});

                        log.debug('data from items updated', itemRecId)
                    }
                  
                }

            } catch (error) {
                log.error(error.message, JSON.stringify(error));
            }


        }

        return {
            beforeSubmit: beforeSubmit
        };
    });