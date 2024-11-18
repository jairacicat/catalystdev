/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define([
  'N/record',
  'N/search',
  'N/ui/serverWidget',
  'N/ui/message'
], (
  record,
  search,
  serverWidget,
  message
) => {
  function beforeLoad(context) {
    if (
      context.type === context.UserEventType.VIEW
    ) {
      const { newRecord } = context;
      const { id, type } = newRecord;

      const shippingaspercentageoftotal = getShipItemData(newRecord);
      log.debug(`beforeLoad::shippingaspercentageoftotal::${type}::${id}`, shippingaspercentageoftotal);

      if (shippingaspercentageoftotal == '0') return;

      if (!shippingaspercentageoftotal) {
        context.form.addPageInitMessage({ type: message.Type.WARNING, message: 'The shipping cost is not a percentage based calculation.' });
      }
    }
  }

  function afterSubmit(context) {
    try {
      
   
    log.debug('afterSubmit::context', context);
    if (context.type === context.UserEventType.CREATE
        || context.type === context.UserEventType.EDIT) {
      const { newRecord } = context;
      const { id, type } = newRecord;
      const rec = record.load({ type, id });
      const shippingaspercentageoftotal = getShipItemData(newRecord);
      log.debug(`afterSubmit::shippingaspercentageoftotal::${type}::${id}`, shippingaspercentageoftotal);

      const itemIds = getItemIds(newRecord);
      log.debug(`afterSubmit::itemIds::${type}::${id}`, itemIds);

      const total = getTotal(newRecord, shippingaspercentageoftotal);
      log.debug(`afterSubmit::total::${type}::${id}`, total);

      if (shippingaspercentageoftotal == '0' || shippingaspercentageoftotal) {
        let shippingcost = (parseFloat(shippingaspercentageoftotal, 10) / 100) * total;
        log.debug(`afterSubmit::shippingcost-before::${type}::${id}`, shippingcost);

        if (shippingcost != '0' && shippingcost < 9.95) {
          shippingcost = 9.95;
        }

        log.debug(`afterSubmit::shippingcost-after::${type}::${id}`, shippingcost);
        rec.setValue('shippingcost', shippingcost);
        const updatedRecId = rec.save({
          ignoreMandatoryFields: true
        });
        // const updatedRecId = record.submitFields({
        //   type,
        //   id,
        //   values: {
        //     shippingcost
        //   },
        //   options: {
        //     disableTriggers: true,
        //     ignoreMandatoryFields: true
        //   }
        // });
        log.debug(`afterSubmit::updatedRecId::${type}::${id}`, updatedRecId);
      }
    }
  } catch (error) {
      
  }
  }

  function getShipItemData(newRecord) {
    let shippingaspercentageoftotal;
    const shipmethod = newRecord.getValue('shipmethod');
    if (!shipmethod) return shippingaspercentageoftotal;
    const shipItemRec = record.load({ type: 'shipItem', id: shipmethod });
    shippingaspercentageoftotal = shipItemRec.getValue('shippingaspercentageoftotal');
    return shippingaspercentageoftotal;
  }

  function getItemIds(newRecord) {
    const itemIds = [];
    const numLines = newRecord.getLineCount({ sublistId: 'item' });
    for (let i = 0; i < numLines; i += 1) {
      const item = newRecord.getSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        line: i
      });
      const itemtype = newRecord.getSublistValue({
        sublistId: 'item',
        fieldId: 'itemtype',
        line: i
      });

      if (itemtype === 'Kit') {
        itemIds.push(item);
      }
    }

    return itemIds;
  }

  function getTotal(newRecord) {
    let total = 0;
    const numLines = newRecord.getLineCount({ sublistId: 'item' });
    for (let i = 0; i < numLines; i += 1) {
      const itemtype = newRecord.getSublistValue({
        sublistId: 'item',
        fieldId: 'itemtype',
        line: i
      });
      log.debug("Item Type", itemtype);
      const amount = newRecord.getSublistValue({
        sublistId: 'item',
        fieldId: 'amount',
        line: i
      });

      if (itemtype === 'InvtPart'
      || itemtype === 'Assembly'
      || itemtype === 'Kit'
      ) {
        total += parseFloat(amount, 10);
      }
    }
    log.debug("Total",  total);

    return total;
  }

  return {
    afterSubmit,
    beforeLoad
  };
});
