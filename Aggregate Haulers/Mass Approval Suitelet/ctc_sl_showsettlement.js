/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/file', 'N/redirect', 'N/ui/serverWidget', 'N/search'], function(file, redirect, serverWidget, search) {
    
    function onRequest(context) {
        var request = context.request;
        var response = context.response;
        
        if (context.request.method === 'GET') {
            var vendorId = request.parameters.vendorId;
            var weekOfDate = request.parameters.weekOfDate;
            var fileName = 'vendor_settlement_' + vendorId + '_' + weekOfDate;
            log.debug("fileName", fileName);
            var fileSearch = search.create({
                type: "file",
                filters:
                [
                    ["name","is",fileName], 
                    "AND", 
                    ["folder","anyof","13646"],
                    "AND", 
                    ["filetype","anyof","PDF"]
                ],
                columns: ['internalid']
            });
            
            var searchResult = fileSearch.run().getRange({ start: 0, end: 1 });
            log.debug("searchResult", searchResult);
            
            if (searchResult.length > 0) {
                var fileId = searchResult[0].getValue({ name: 'internalid' });
                var fileObj = file.load({
                    id: fileId
                });
                
                response.writeFile({
                    file: fileObj,
                    isInline: true
                });
            } else {
                var form = serverWidget.createForm({ title: 'File Status' });
                form.addField({
                    id: 'custpage_message',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Message'
                }).defaultValue = '<p>The PDF is still being generated. Please try again in a few minutes. Thank you.</p>';
                
                response.writePage(form);
            }
        }
    }
    
    return {
        onRequest: onRequest
    };
    
});
