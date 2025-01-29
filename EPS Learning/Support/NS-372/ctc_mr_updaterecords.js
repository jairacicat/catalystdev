/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime'], function(search, record, runtime) {

    function getInputData() {
        // Retrieve the saved search ID from the script parameter
        var scriptObj = runtime.getCurrentScript();
        var searchId = scriptObj.getParameter({name: 'custscript_ctc_saved_search_id'});

        // Load the saved search
        return search.load({
            id: searchId
        });
    }

    function map(context) {
        var searchResult = JSON.parse(context.value);
        // Retrieve the record type from the script parameter
        var scriptObj = runtime.getCurrentScript();
        var recordType = scriptObj.getParameter({name: 'custscript_ctc_record_type'});

        try {
            var dynamicRecord = record.load({
                type: recordType, // Use the dynamically specified record type
                id: searchResult.id,
                isDynamic: true
            });

            // Perform any modifications or processing required on the dynamicRecord here
            dynamicRecord.save({ignoreMandatoryFields: true});
            log.debug('Record Saved', 'Type: ' + recordType + ', ID: ' + dynamicRecord.id);
        } catch (e) {
            log.error('Error saving record', 'Type: ' + recordType + ', ID: ' + searchResult.id + ' Error: ' + e.message);
        }
    }

    function summarize(summary) {
        log.audit('Processing Complete', 'Number of records processed: ' + summary.inputSummary.keysProcessed.length);
        summary.output.forEach(function (data) {
            log.audit('Output', data);
        });
        if (summary.errors.iterator().hasNext()) {
            summary.errors.iterator().each(function (key, error) {
                log.error('Error', 'Key: ' + key + ', Error: ' + error);
                return true;
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        summarize: summarize
    };
});
