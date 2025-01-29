
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
* Project Number: Aggregate Haulers - Print Vendor Bill for Mass Approval Suitelet
* Script Name:
* Author: jaira@nscatalyst.com
* @NApiVersion 2.1
* @NScriptType MapReduceScript
* @Description Prints the Vendor Statements for the Vendors with Pending Approvals, in preparation for Mass Approval Suitelet.
*
* CHANGELOGS
*
* Version      Date                        Author             rfo                    Remarks
* 1.00                                     jaira@nscatalyst.com                    Initial Build
*   
*/


define(['N/file', 'N/record', 'N/search', 'N/runtime'], function(file, record, search, runtime) {

    const SPARAM_VB_APPROVAL_SS = 'custscript_vendors_for_statementprint';

    // Use the getInputData function to return two strings.
    function getInputData()
    {
        try
        {
            let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_VB_APPROVAL_SS});
            log.debug("SS_ID", SS_ID);
            if(SS_ID){
                let searchObj = search.load({id: SS_ID});
                log.debug("SearchObj", searchObj);
                return searchObj;
            }
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
        return "";
    }

    // The map function is invoked one time for each key/value pair. Each time the
    // function is invoked, the relevant key/value pair is made available through
    // the context.key and context.value properties.
    function map(context) 
	{
            // Parse the search result to get the file ID
            var result = JSON.parse(context.value);

            let mapKey = context.key;
            let mapValues = JSON.parse(context.value);

            let entityId = mapValues.values["entity"].value;
            let entityName = mapValues.values["entity"].text;
            let documentNumber = mapValues.values["tranid"];
            let amount = mapValues.values["amount"];
          
            //Group by Vendor ID:
            context.write({
                key: entityId,
                value: JSON.stringify({
                    "transactionId": mapKey,
                    "transactionName" : documentNumber,
                    "entityId" : entityId,
                    "entityName" : entityName,
                    "amount" : amount
                })
            });
    }

   
    // The reduce function is invoked one time for each of the key/value pairs
    // provided.
    function reduce(context) 
	{
        try
        {
            let reduceKey = context.key;
            let reduceValues = JSON.parse(context.values[0]);
            log.debug("REDUCE - ", reduceValues);
            let entityId = reduceValues.values.entity.value;
            let entityName = reduceValues.values.entity.text;
            let documentNumber = reduceValues.values.tranid;
            let amount = reduceValues.values.amount;
           
             //Call scheduled script to create the file:
             let statementTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT,
                scriptId: 'customscript_nscs_ss_inv_print',
                deploymentId: 'customdeploy_ss_printinvoice_email',
                params: {
                    custscript_nscs_inv_rec_id: reduceKey
                }
            });
            let invTaskId = invTask.submit();

            let taskStatus = task.checkStatus({taskId: invTaskId});
            log.debug("taskStatus", taskStatus.status);
            log.debug("taskStatus check", taskStatus.status == "COMPLETE");
            while(taskStatus.status != "COMPLETE" || taskStatus.status != "FAILED"){

                taskStatus = task.checkStatus({taskId: invTaskId});
                if(taskStatus.status == "COMPLETE" || taskStatus.status == "FAILED"){
                    break;
                }
            }
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
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
                title: 'VB Approval Error',
                details: 'Error approving VB with ID ' + key + ': ' + error
            });
            return true;
        });

        let SS_ID = runtime.getCurrentScript().getParameter({
            name: SPARAM_VB_APPROVAL_SS
        });
        // Check if more records remain in the saved search
        var remainingRecords = search.load({
            id: SS_ID
        }).run().getRange({ start: 0, end: 1 }).length > 0;

        if (remainingRecords) {
            // Resubmit the Map/Reduce script if more records are found
            var scriptTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customcript_ctc_mr_approvebills',
                deploymentId: 'customdeploy_ctc_mr_approvebills'
            });

            var taskId = scriptTask.submit();
            log.audit({
                title: 'Resubmitted Map/Reduce Script',
                details: 'New task ID: ' + taskId
            });
        } else {
            log.audit({
                title: 'Map/Reduce Script Completed',
                details: 'No more VB Lines to Approve. Process completed successfully.'
            });
        }
    }

    // Link each entry point to the appropriate function.
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});