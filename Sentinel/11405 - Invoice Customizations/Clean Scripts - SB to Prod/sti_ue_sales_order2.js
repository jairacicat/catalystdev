/**
 *
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @description Sales Order User Events
 *
 * Script Name: sti_ue_sales_order2.js
 *
 */
define([
    'N/ui/serverWidget',
    'N/log',
    'N/record',
    'N/runtime',
    'N/search',
    'N/https',
    'N/file',
    'N/format',
    'N/url',
    '../STI_Lib/sti_integration_lib',
    '../STI_Lib/sti_integration_module',
    '../STI_Lib/sti_utility_module'
],
    /**
     * @param{serverWidget} serverWidget
     * @param{log} LOG
     * @param{record} RECORD
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param {https} HTTPS
     * @param{file} FILE
     * @param{format} FORMAT
     * @param{url} URL
     * @param SNOW
     * @param STIN
     * @param STITUIL
     */
    (serverWidget, LOG, RECORD, RUNTIME, SEARCH, HTTPS, FILE, FORMAT, URL, SNOW, STIN, STIUTIL) => {
        const beforeLoad = (scriptContext) => {

        }
        const beforeSubmit = (scriptContext) => {
            var fromTime = new Date();
            //LOG.debug('Current Session', RUNTIME.getCurrentSession());
            try {
                if (scriptContext.type == "delete") {
                    return true;
                }
                if (RUNTIME.executionContext == 'CSVIMPORT') {
                    return true; //do not process for csv imports
                }
                if (RUNTIME.executionContext == 'WORKFLOW') {
                    var theData = JSON.parse(JSON.stringify(RUNTIME));
                    //LOG.debug('theData', JSON.stringify(theData));
                    return true; //do not process for Workflow Updates
                }
                if (RUNTIME.executionContext == 'WEBSERVICES') {
                    return true; //do not process for Webservices Updates
                }
            } catch (err) {
                LOG.error('Error: beforeSubmit', err.toString());
            }
        }
        const afterSubmit = (scriptContext) => {
            var fromTime = new Date();
            LOG.debug('in afterSubmit', scriptContext.newRecord.id);
            try {
                const scriptObj = RUNTIME.getCurrentScript();
                //Check if Need to Send Project to SN
                var custbody_sti_invoice_type = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
                if (custbody_sti_invoice_type == '2') {
                    var custbody_sti_opp_pm = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_opp_pm' });
                    var custbody_sti_project_link_to_sn = scriptContext.newRecord.getValue({ fieldId: 'custbody_sti_project_link_to_sn' });

                    var okForSN = false;
                    if (SNOW.isEmpty(custbody_sti_project_link_to_sn) && !SNOW.isEmpty(custbody_sti_opp_pm)) {
                        var okForSN = true;  //First time to SN
                    } else {
                        var projectFields = ['custbody_sti_project_type', 'custbody_sti_project_name', 'custbody_sti_opp_pm'];
                        for (var fieldLoop = 0; fieldLoop < projectFields.length && !okForSN; fieldLoop++) {
                            var fieldName = projectFields[fieldLoop];
                            var oldValue = scriptContext.oldRecord.getValue({ fieldId: fieldName });
                            var newValue = scriptContext.newRecord.getValue({ fieldId: fieldName });
                            if (oldValue != newValue && !SNOW.isEmpty(newValue)) {
                                okForSN = true;  //Field Changes to SN
                            }
                        }
                    }
                    LOG.debug('okForSN', okForSN);
                    if (okForSN) {
                        var salesOrderRecord = RECORD.load({
                            type: RECORD.Type.SALES_ORDER,
                            id: scriptContext.newRecord.id,
                            isDynamic: false
                        });
                        LOG.debug(salesOrderRecord.id + ' heading to integration');
                        salesOrderRecord = STIN.sendProjectToSN(salesOrderRecord, scriptObj);
                        LOG.debug(salesOrderRecord.id + ' back from integration');
                    }
                }
            } catch (err) {
                LOG.error('afterSubmit', err.toString());
            }
        }
        return {beforeLoad, beforeSubmit, afterSubmit }
    });