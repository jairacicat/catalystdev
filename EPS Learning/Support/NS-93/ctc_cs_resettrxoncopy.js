/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/log', 'N/currentRecord'], function(log, currentRecord) {

    function pageInit(context) {
        var REC = currentRecord.get();
        var lineCount = REC.getLineCount({ sublistId: 'item' });
        console.log("lineCount", lineCount)

        for (var i = 0; i < lineCount; i++) {
            REC.selectLine({
                sublistId: 'item',
                line: i
            });

            var itemId = REC.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });

            console.log(itemId);
            // Re-set the item with ignoreFieldChange set to false
            REC.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i,
                value: itemId,
                ignoreFieldChange: false
            });

            REC.commitLine({
                sublistId: 'item',
                ignoreRecalc: false
            });

            console.log('Item Re-set', 'Line ' + (i + 1) + ' Item ID re-set to: ' + itemId);
        }
    }

    return {
        pageInit: pageInit
    };
});
