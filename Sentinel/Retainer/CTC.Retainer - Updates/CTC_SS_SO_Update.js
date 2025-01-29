/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'], function(record, search) {

    function execute(context) {
        var soId = '309407'; // Replace 'YOUR_SO_ID' with the actual ID of the Sales Order
        var lineNumbersToClose = [149, 832, 833, 834, 853, 855, 864];

        var salesOrder = record.load({
            type: record.Type.SALES_ORDER,
            id: soId
        });

        var lineCount = salesOrder.getLineCount({ sublistId: 'item' });
        for (var i = 0; i < lineCount; i++) {
            var lineNumber = salesOrder.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_ctc_so_line_id',
                line: i
            });

            if (lineNumbersToClose.indexOf(parseInt(lineNumber)) > -1) {
                log.debug("Closing",  "line"  + lineNumber);
                salesOrder.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'isclosed',
                    line: i,
                    value: true
                });
            }
        }

        salesOrder.save({
            ignoreMandatoryFields: true
        });
        logd
    }

    return {
        execute: execute
    };

});
