
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
* Project Number: Aggregate Haulers - Mass VB Approval
* Script Name:
* Author: jaira@nscatalyst.com
* @NApiVersion 2.1
* @NScriptType MapReduceScript
* @Description Approves the Vendor Bills of selected Vendors on the VB Mass Approval Suitelet
*
* CHANGELOGS
*
* Version      Date                        Author             rfo                    Remarks
* 1.00                                     jaira@nscatalyst.com                    Initial Build
*   
*/


define(['N/file', 'N/record', 'N/search', 'N/runtime'], function(file, record, search, runtime) {

    const SPARAM_VB_APPROVAL_SS = 'custscript_vbapproval_ss';

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

            log.debug("Result", result);
            let logRecordId = result.values.custrecord_ctc_vbapprovalline_log.value;
            log.debug("Map - Log Record Id", logRecordId);

            //Get Status:
            let logStatus = search.lookupFields({
                type: 'customrecord_ctc_vb_mass_approval_log',
                id: logRecordId,
                columns: 'custrecord_vbapprovallog_status'
            }).custrecord_vbapprovallog_status;
            if(logStatus == "PENDING"){
                 //Update Log Record status to IN PROGRESS;
                record.submitFields({
                    type: 'customrecord_ctc_vb_mass_approval_log',
                    id: logRecordId,
                    values: {
                        "custrecord_vbapprovallog_status": "IN PROGRESS"
                    }
                });
                log.debug("Updated to IN PROGRESS", logRecordId);
            }
            else{
                log.debug("Skipping update to IN Progress", logRecordId);
            }
           


            let vbId = result.values.custrecord_ctc_vbapprovalline_vb.value;
            let vbStatus = result.values["approvalstatus.CUSTRECORD_CTC_VBAPPROVALLINE_VB"].value;

            if(vbStatus == 1){
                log.debug("VB Id", vbId);

                let vendorBillRecord = record.load({
                    type: record.Type.VENDOR_BILL,
                    id: vbId
                });

                vendorBillRecord.setValue({
                    fieldId: 'approvalstatus',
                    value: 2
                });

                vendorBillRecord.save({
                    ignoreMandatoryFields: true
                });

                log.debug("Approved Vendor Bill", vbId);
            }
            else{
                log.debug("Skipping -- already approved", vbId);
            }
            
            context.write({
                key: logRecordId,
                value: vbId
            });
    }

   
    // The reduce function is invoked one time for each of the key/value pairs
    // provided.
    function reduce(context) 
	{
        try
        {
            let logRecordId = context.key;

            log.debug("Log Record Id - Set to Completed", logRecordId);
               
            //Update Log Record status to IN PROGRESS;
            record.submitFields({
                type: 'customrecord_ctc_vb_mass_approval_log',
                id: logRecordId,
                values: {
                    "custrecord_vbapprovallog_status": "COMPLETED"
                }
            });

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