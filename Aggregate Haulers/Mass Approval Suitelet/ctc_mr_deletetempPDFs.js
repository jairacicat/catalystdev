/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope Public
 */
define(['N/search', 'N/file', 'N/log', 'N/task'], function(search, file, log, task) {

    /**
     * Defines the input data for the Map/Reduce process.
     * Here, we load a saved search to get file IDs to delete.
     * @return {Array|Object|Search|File} inputSummary
     */
    function getInputData() {
        // Load the saved search
        return search.load({
            id: 'customsearch_ctc_files_to_delete' // Replace with your actual saved search ID
        });
    }

    /**
     * Maps each result to a single file ID and deletes it.
     * @param {MapReduceContext.MapData} context - Data to process in each map stage.
     */
    function map(context) {
        try {
            // Parse the search result to get the file ID
            var result = JSON.parse(context.value);
            var fileId = result.id;

            // Delete the file using the ID
            file.delete({
                id: fileId
            });

            log.audit({
                title: 'File Deleted',
                details: 'File ID ' + fileId + ' has been deleted successfully.'
            });
        } catch (e) {
            log.error({
                title: 'Error Deleting File',
                details: e.message + ' (File ID: ' + context.key + ')'
            });
        }
    }

    /**
     * Summarizes the results of the Map/Reduce script.
     * If there are still results in the saved search, it resubmits itself.
     * @param {SummaryContext} summary - Holds statistics regarding execution.
     */
    function summarize(summary) {
        // Log any errors from the map stage
        summary.mapSummary.errors.iterator().each(function(key, error) {
            log.error({
                title: 'Delete File Error',
                details: 'Error deleting file with ID ' + key + ': ' + error
            });
            return true;
        });

        // Check if more records remain in the saved search
        var remainingRecords = search.load({
            id: 'customsearch_ctc_files_to_delete' // Replace with the saved search ID
        }).run().getRange({ start: 0, end: 1 }).length > 0;

        if (remainingRecords) {
            // Resubmit the Map/Reduce script if more records are found
            var scriptTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_ctc_mr_delete_files', // Replace with your script ID
                deploymentId: 'customdeploy_ctc_mr_delete_files' // Replace with your deployment ID
            });

            var taskId = scriptTask.submit();
            log.audit({
                title: 'Resubmitted Map/Reduce Script',
                details: 'New task ID: ' + taskId
            });
        } else {
            log.audit({
                title: 'Map/Reduce Script Completed',
                details: 'No more files to delete. Process completed successfully.'
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        summarize: summarize
    };
});
