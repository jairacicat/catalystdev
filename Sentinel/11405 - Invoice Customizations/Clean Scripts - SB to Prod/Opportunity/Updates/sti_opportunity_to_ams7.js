/**
 *
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @description Helper file for integration from NetSuite to AMS.
 *
 * Script Name: sti_opportunity_to_ams7.js
 *
 */
define([
    'N/log',
    'N/record',
    'N/runtime',
    'N/search',
    'N/https',
    'N/url',
    'N/encode',
    'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.SNOW/CTC_Lib_SNOW_fromSBX'
],

    /**
     * @param {log} LOG
     * @param {record} RECORD
     * @param{runtime} RUNTIME
     * @param{search} SEARCH
     * @param {https} HTTPS
     * @param{url} URL
     * @param {encode} ENCODE
     * @param SNOW
     */

    (LOG, RECORD, RUNTIME, SEARCH, HTTPS, URL, ENCODE, SNOW) => {
        const beforeLoad = (scriptContext) => {
            try {
                //Add Button to Create the Sales Order
                var onCOD = false;
                var appUrl = URL.resolveDomain({
                    hostType: URL.HostType.APPLICATION
                });
                log.debug('appUrl', appUrl);
                try {
                    var customerId = scriptContext.newRecord.getValue({ fieldId: 'entity' });
                    var customerRecord = RECORD.load({
                        type: RECORD.Type.CUSTOMER,
                        id: customerId,
                        isDynamic: false
                    });
                    var creditholdoverride = customerRecord.getValue({ fieldId: 'creditholdoverride' });
                    if (SNOW.isEmpty(creditholdoverride)) {
                        creditholdoverride = '';
                    }
                    creditholdoverride = creditholdoverride.toString().toUpperCase();
                    var onCOD = Boolean(creditholdoverride == 'ON');
                } catch (err) {
                    log.error('Error', err.toString());
                }
                if (!onCOD) {
                    var userRole = RUNTIME.getCurrentUser().role.toString();
                    var arrayButtonRoles = ["3", "1176", "1180", "1184"];
                    if (arrayButtonRoles.indexOf(userRole) >= 0) {
                        var theOpportunityId = scriptContext.newRecord.id;
                        var urlParams = '&button_name=IAQVCBNPW';
                        urlParams = urlParams + '&opportunityid=' + theOpportunityId;

                        var theSuiteletUrl = URL.resolveScript({
                            scriptId: 'customscript_sti_button_event_suitelet2',
                            deploymentId: 'customdeploy_sti_button_event_suitelet2'
                        }) + urlParams;
                        scriptContext.form.addButton({
                            label: 'Create Sales Order(s)',
                            id: 'custpage_create_sales_order',
                            functionName: '(function(){ window.open("' + theSuiteletUrl + '","_self") })()'
                        });
                        log.debug('theSuiteletUrl', theSuiteletUrl);
                    }
                }
                /*
                scriptContext.form.clientScriptModulePath = 'SuiteScripts/STI Scripts/sti_cs_opportunity';
                scriptContext.form.addButton({
                    id: 'custpage_other_shipping_cost',
                    label: 'Submit to Admin',
                    functionName: `doVerifyAdminSubmit()`
                });
                */
            } catch (err) {
                log.error('beforeLoad', err.toString());
            }
        }
        const beforeSubmit = (scriptContext) => { }
        const afterSubmit = (scriptContext) => {
            const scriptObj = RUNTIME.getCurrentScript();
            var jsonObj = {};
            var currentUserObj = RUNTIME.getCurrentUser();
            var currentUserId;

            var skipUserArray = [];
            skipUserArray = scriptObj.getParameter({ name: 'custscript_sti_web_services_users' }).split(","); //List of Web Services Users to Skip
            currentUserId = currentUserObj.id.toString();

            if (skipUserArray.indexOf(currentUserId) >= 0) {
                log.audit("Update initiated from " + currentUserId, "Exit Script to Avoid Circular Updates");
                return;
            }

            try {
                if (scriptContext.type == "delete") {
                    return true;
                }
                if (RUNTIME.executionContext == 'CSVIMPORT') {
                    return true; //do not process for csv imports
                }
                if (scriptContext.UserEventType == scriptContext.UserEventType.DELETE) {
                    return true; // do not process in delete context..
                }
                var theExecutionContext = RUNTIME.executionContext;
                if (RUNTIME.executionContext == 'CSVIMPORT') {
                    return true; //do not process for csv imports
                }
                let rec = scriptContext.newRecord;
                let opportunityRecord = RECORD.load({ type: rec.type, id: rec.id });

                //Check if Ok to Send to AMS
                var okForAMS = true;
                if (okForAMS) {
                    jsonObj.id = rec.id;
                    jsonObj.title = opportunityRecord.getValue({ fieldId: 'title' });
                    jsonObj.entity = opportunityRecord.getValue({ fieldId: 'entity' });
                    jsonObj.customer = opportunityRecord.getValue({ fieldId: 'entity' });
                    jsonObj.entitystatus = opportunityRecord.getValue({ fieldId: 'entitystatus' });
                    jsonObj.salesrep = opportunityRecord.getValue({ fieldId: 'salesrep' });
                    jsonObj.expectedclosedate = opportunityRecord.getValue({ fieldId: 'expectedclosedate' });
                    jsonObj.projectedtotal = opportunityRecord.getValue({ fieldId: 'projectedtotal' });
                    jsonObj.tranid = opportunityRecord.getValue({ fieldId: 'tranid' });
                    jsonObj.closedate = opportunityRecord.getValue({ fieldId: 'closedate' });
                    jsonObj.primarycontact = opportunityRecord.getValue({ fieldId: 'custbody_sti_primary_contact' });
                    jsonObj.secondarycontact = opportunityRecord.getValue({ fieldId: 'custbody_sti_secondary_contact' });
                    jsonObj.recordcreatedby = opportunityRecord.getValue({ fieldId: 'recordcreatedby' });
                    jsonObj.recordcreateddate = opportunityRecord.getValue({ fieldId: 'recordcreateddate' });

                    var arrForJsonObj = [];
                    arrForJsonObj.push(jsonObj);

                    //01 Send Opportunity to AMS
                    integrationObj = {
                        "Number": "01",
                        "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_opportunity_api_url' }),
                        "base64EncodedString": 'Basic YmxhaDpibGFoYmxhaA==',
                        "fullJsonObj": arrForJsonObj
                    };
                    callTheAPI(integrationObj);

                    var idSubmitted = RECORD.submitFields({
                        type: rec.type,
                        id: rec.id,
                        values: {
                            custbody_sti_sync_to_ams_entity_date: new Date(),
                            custbody_sti_sync_to_ams: "T"
                        }
                    });
                }
            } catch (err) {
                LOG.error({ title: 'Error on User Event', details: err });
            }
        }
        const callTheAPI = (integrationObj) => {
            var theResponse;
            let currentNumber = integrationObj.Number;
            let apiToCall = integrationObj.apiToCall;
            let base64EncodedString = integrationObj.base64EncodedString;
            let fullJsonObj = integrationObj.fullJsonObj;

            let reqObj = {
                url: apiToCall,
                requestType: HTTPS.Method.POST,
                requestDate: new Date(),
                thirdParty: "ServiceNow"
            };

            reqObj.headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': base64EncodedString
            };

            theResponse = HTTPS.post({
                url: reqObj.url,
                body: JSON.stringify(fullJsonObj),
                headers: reqObj.headers
            });

            reqObj.response = theResponse.body;
            reqObj.code = theResponse.code;

            let strMessage;
            strMessage = {
                "Endpoint": reqObj.url,
                "Payload": fullJsonObj,
                "HTTP Code": reqObj.code,
                "Response": reqObj.response
            };
            log.audit(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
        }
        return { beforeLoad, beforeSubmit, afterSubmit }
    });