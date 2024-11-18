/**
 * Copyright (c) 2022 Catalyst Tech Corp
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Catalyst Tech Corp. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Catalyst Tech.
 *
 * Project Number: TODO-001655
 * Script Name: CTC_Lib_SNOW.js
 * Author: jroque@nscatalyst.com
 *
 * @NApiVersion 2.1
 * @description Helper file for ServiceNow integration to NetSuite.
 *
 * CHANGELOGS
 * Version      Date            Author          Remarks
 * 1.00         May 1, 2022     jroque          Initial Build
 * 1.01         May 28, 2022    ccanaria        Refactor code
 * 1.10         May 30, 2022    ccanaria        Add functionality for Project record
 */

define([
    'N/search'
    , 'N/record'
    , 'N/runtime'
    , 'N/log'
    , 'N/https'
    , 'N/xml'
    , 'N/error'
    , 'N/format'
    , 'N/encode'
    , 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.SS2.Common/CTC.Lib.Utils'
    , 'SuiteScripts/CTC.Sentinel/CTC.SS2/CTC.SS2.Common/CTC.Lib.Common'
],
    function (
        search
        , record
        , runtime
        , log
        , https
        , xml
        , error
        , format
        , encode
        , ctcUtils
        , common
    ) {
        'use strict';

        var SBCredentials = {};
        SBCredentials.username = "";
        SBCredentials.password = "";
        SBCredentials.url = "";

        var PRDCredentials = {};
        PRDCredentials.username = "";
        PRDCredentials.password = "";
        PRDCredentials.url = "";

        // sample function only -- not used
        function callWS() {
            var credentialObj = {};
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                credentialObj = SBCredentials;
                log.debug({ title: 'Using SB Credentials', details: runtime.envType });
            } else {
                credentialObj = PRDCredentials;
                log.debug({ title: 'Using Prod Credentials', details: runtime.envType });
            }

            const base64EncodedString = encode.convert({
                string: credentialObj.username + ":" + credentialObj.password,
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });

            const response = https.get({
                url: credentialObj.url,
                headers: {
                    "Authorization": "Basic " + base64EncodedString
                }
            });

            if (response) {
                const responseBody = JSON.parse(response.body);
                log.debug({ title: 'responseBody', details: responseBody });
                return responseBody;
            }

            return null;
        }

        function logRequest(obj) {
            var rec = record.create({
                type: 'customrecord_ctc_integration_logs'
            });

            rec.setValue({ fieldId: 'custrecord_ctc_integ_3rd_party', value: obj.thirdParty });
            rec.setValue({ fieldId: 'custrecord_ctc_integ_request_url', value: obj.url });
            rec.setValue({ fieldId: 'custrecord_ctc_integ_request_date', value: obj.requestDate });
            rec.setValue({ fieldId: 'custrecord_ctc_integ_request_type', value: obj.requestType });
            rec.setValue({ fieldId: 'custrecord_ctc_integ_request_payload', value: obj.payload });

            if (obj.response.length < 1000000) {
                rec.setValue({ fieldId: 'custrecord_ctc_integ_response', value: obj.response });
            }

            rec.setValue({ fieldId: 'custrecord_ctc_integ_response_code', value: obj.code });

            obj.integrationLogId = rec.save();
            //log.debug({title: 'Log Created', details: obj});
        }

        function generateAuthCode(scriptObj) {
            const base64EncodedString = encode.convert({
                string: scriptObj.getParameter({ name: 'custscript_ctc_snow_api_uname' }) + ":" + scriptObj.getParameter({ name: 'custscript_ctc_snow_api_pword' }),
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });
            return base64EncodedString;
        }

        function createCustomerRequest(rec) {
            var recObj = record.load({ type: rec.type, id: rec.id });
            var obj = {};
            obj.nsid = rec.id;
            obj.entityid = recObj.getValue({ fieldId: 'entityid' });
            obj.companyname = recObj.getValue({ fieldId: 'companyname' });
            obj.subsidiary = recObj.getText({ fieldId: 'subsidiary' });
            obj.entitystatus = recObj.getText({ fieldId: 'entitystatus' });
            obj.salesrep = recObj.getText({ fieldId: 'salesrep' });
            obj.leadsource = recObj.getText({ fieldId: 'leadsource' });
            obj.phone = recObj.getValue({ fieldId: 'phone' });
            obj.email = recObj.getValue({ fieldId: 'email' });
            obj.isinactive = recObj.getValue({ fieldId: 'isinactive' });
            obj.recordtype = 'customer';

            //address details here..
            const addrLineCount = recObj.getLineCount({ sublistId: 'addressbook' });

            for (var i = 0; i < addrLineCount; i++) {
                var defaultBilling = recObj.getSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultBilling',
                    line: i
                });

                if (addrLineCount == 1) // there is only one address on the addressbook line
                    defaultBilling = true;

                if (defaultBilling === 'T' || defaultBilling === true) {
                    var addrRec = recObj.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: i
                    });
                    obj.zip = addrRec.getValue({ fieldId: 'zip' });
                    obj.city = addrRec.getValue({ fieldId: 'city' });
                    obj.addr1 = addrRec.getValue({ fieldId: 'addr1' });
                    obj.addr2 = addrRec.getValue({ fieldId: 'addr2' });
                    obj.state = addrRec.getValue({ fieldId: 'state' });
                }
            }

            return obj;
        }

        function createContactRequest(rec) {
            //var recObj = record.load({type: rec.type, id: rec.id});
            var obj = {};
            obj.nsid = rec.id;
            obj.firstname = rec.getValue({ fieldId: 'firstname' });
            obj.middlename = rec.getValue({ fieldId: 'middlename' });
            obj.lastname = rec.getValue({ fieldId: 'lastname' });
            obj.title = rec.getValue({ fieldId: 'title' });
            obj.email = rec.getValue({ fieldId: 'email' });
            obj.phone = rec.getValue({ fieldId: 'phone' });
            obj.customernsid = rec.getValue({ fieldId: 'company' });
            obj.isinactive = rec.getValue({ fieldId: 'isinactive' });
            obj.recordtype = 'contact';
            return obj;
        }

        function createProjectRequest(rec) {
            var projRec = record.load({ type: rec.type, id: rec.id });
            // var projJsonObj = JSON.stringify(projRec);

            var projObj = {
                nsid: projRec.id,
                entityid: projRec.getValue({ fieldId: "entityid" }),
                parent_nsid: projRec.getValue({ fieldId: "parent" }),
                parent_name: projRec.getText({ fieldId: "parent" }),
                entitystatus_nsid: projRec.getValue({ fieldId: "entitystatus" }),
                entitystatus_name: projRec.getText({ fieldId: "entitystatus" }),
                startdate: projRec.getValue({ fieldId: "startdate" }),
                projectedenddate: projRec.getValue({ fieldId: "projectedenddate" }),
                projectmanager_nsid: projRec.getValue({ fieldId: "projectmanager" }),
                projectmanager_name: projRec.getText({ fieldId: "projectmanager" }),

                // name: projRec.getValue({fieldId: "companyname"}),
                // subsidiary: projRec.getValue({fieldId: "subsidiary"}),
                // type: projRec.getValue({fieldId: "jobtype"}),
                // status: projRec.getText({fieldId: "entitystatus"}),
                // budgetamt: projRec.getValue({fieldId: "custentity_atlas_svs_em_budget_amt"}),
                //
                // plannedwork: projRec.getValue({fieldId: "plannedwork"}),
                // plannedworkbaseline: projRec.getValue({fieldId: "plannedworkbaseline"}),
                // allocatedtime: projRec.getValue({fieldId: "allocatedtime"}),
                // actualtime: projRec.getValue({fieldId: "actualtime"}),
                // timeremaining: projRec.getValue({fieldId: "timeremaining"}),
                // percenttimecomplete: projRec.getValue({fieldId: "percenttimecomplete"}),
                // percentcompletebyrsrcalloc: projRec.getValue({fieldId: "percentcompletebyrsrcalloc"}),
                //
                // schedulingmethod: projRec.getText({fieldId: "schedulingmethod"}),
                //
                //
                // calculatedenddate: projRec.getValue({fieldId: "calculatedenddate"}),
                // lastbaselinedate: projRec.getValue({fieldId: "lastbaselinedate"}),
                //
                // lastbilleddate: projRec.getValue({fieldId: "custentity_date_last_billed"}),

                // resources: [],
                // tasks: [],
                // salesorder: []
            }

            var resourceCount = projRec.getLineCount({ sublistId: "jobresources" });

            if (resourceCount > 0) {
                projObj.resources = [];

                for (var i = 0; i < resourceCount; i++) {
                    projObj.resources.push({
                        entityid: projRec.getSublistValue({
                            sublistId: "jobresources",
                            line: i,
                            fieldId: "jobresource"
                        }),
                        entityname: projRec.getSublistText({
                            sublistId: "jobresources",
                            line: i,
                            fieldId: "jobresource"
                        }),
                        email: projRec.getSublistValue({
                            sublistId: "jobresources",
                            line: i,
                            fieldId: "email"
                        }),
                        role: projRec.getSublistText({
                            sublistId: "jobresources",
                            line: i,
                            fieldId: "role"
                        })
                    });
                }
            }

            projObj.tasks = getProjectTasks({
                projectid: projRec.id
            });

            // Get related SO
            projObj.salesorder = getSalesOrder({
                projectid: projRec.id
            })

            return projObj;
        }

        function updateProject(obj) {
            var rec = null;

            if (obj.nsid !== "" && obj.nsid) {
                rec = record.load({ type: obj.recordtype, id: obj.nsid });
            } else {
                obj.success = false;
                obj.message = "Project update functionality needs Project record's internal ID";
                return obj;
            }

            rec.setValue({ fieldId: 'companyname', value: obj.projectname });
            rec.setText({ fieldId: 'entitystatus', text: obj.status });
            rec.setValue({ fieldId: 'custentity_atlas_svs_em_budget_amt', value: obj.budgetamount });
            rec.setValue({ fieldId: 'startdate', value: new Date(obj.startdate) });
            rec.setValue({ fieldId: 'projectedenddate', value: new Date(obj.enddate) });
            rec.setValue({ fieldId: 'projectmanager', value: obj.projectmanager_nsid });

            obj.nsid = rec.save();
            obj.success = true;

            return obj;
        }

        function upsertContact(obj) {
            var rec = null;

            if (obj.nsid !== "" && obj.nsid) {
                rec = record.load({ type: obj.recordtype, id: obj.nsid });
            } else {
                rec = record.create({ type: obj.recordtype });
            }

            rec.setValue({ fieldId: 'firstname', value: obj.firstname });
            rec.setValue({ fieldId: 'middlename', value: obj.middlename });
            rec.setValue({ fieldId: 'lastname', value: obj.lastname });
            rec.setValue({ fieldId: 'title', value: obj.title });
            rec.setValue({ fieldId: 'email', value: obj.email });
            rec.setValue({ fieldId: 'phone', value: obj.phone });
            rec.setValue({ fieldId: 'company', value: obj.customernsid });
            rec.setValue({ fieldId: 'isinactive', value: obj.isinactive });

            obj.nsid = rec.save();
            obj.success = true;

            return obj;
        }

        function upsertResourceAllocation(obj) {
            var rec = null;

            if (obj.nsid !== "" && obj.nsid) {
                rec = record.load({ type: obj.recordtype, id: obj.nsid });
            } else {
                rec = record.create({ type: obj.recordtype });
            }

            rec.setValue({ fieldId: 'project', value: obj.project_nsid });
            rec.setValue({ fieldId: 'allocationamount', value: obj.allocationamount });
            rec.setValue({ fieldId: 'allocationresource', value: obj.allocationresource_nsid });
            rec.setValue({ fieldId: 'allocationtype', value: obj.allocationtype });
            rec.setValue({ fieldId: 'allocationunit', value: obj.allocationunit });
            rec.setValue({ fieldId: 'notes', value: obj.notes });
            rec.setValue({ fieldId: 'startdate', value: new Date(obj.startdate) });
            rec.setValue({ fieldId: 'enddate', value: new Date(obj.enddate) });

            obj.nsid = rec.save();
            obj.success = true;

            return obj;
        }

        function upsertProjectTask(obj) {
            var rec = null;

            if (obj.nsid !== "" && obj.nsid) {
                rec = record.load({ type: obj.recordtype, id: obj.nsid });
            } else {
                rec = record.create({ type: obj.recordtype });
            }

            rec.setValue({ fieldId: 'company', value: obj.project_nsid });
            rec.setValue({ fieldId: 'title', value: obj.title });
            rec.setText({ fieldId: 'status', text: obj.status });
            rec.setValue({ fieldId: 'nonbillabletask', value: obj.isnonbillable });
            rec.setValue({ fieldId: 'plannedwork', value: obj.plannedwork });

            obj.nsid = rec.save();
            obj.success = true;

            return obj;
        }

        function upsertTimeBill(obj) {
            var rec = null;

            if (obj.nsid !== "" && obj.nsid) {
                rec = record.load({ type: obj.recordtype, id: obj.nsid });
            } else {
                rec = record.create({ type: obj.recordtype });
            }

            rec.setValue({ fieldId: 'employee', value: obj.employee_nsid });
            rec.setValue({ fieldId: 'customer', value: obj.project_nsid });
            rec.setValue({ fieldId: 'trandate', value: new Date(obj.trandate) });
            rec.setValue({ fieldId: 'hours', value: obj.hours });
            rec.setValue({ fieldId: 'casetaskevent', value: obj.casetaskevent_nsid });
            rec.setValue({ fieldId: 'item', value: obj.item_nsid });
            rec.setValue({ fieldId: 'memo', value: obj.memo });
            rec.setValue({ fieldId: 'rejectionnote', value: obj.rejectionnote });
            rec.setText({ fieldId: 'approvalstatus', text: obj.approvalstatus });
            rec.setValue({ fieldId: 'class', value: obj.class_nsid });
            rec.setValue({ fieldId: 'location', value: obj.location_nsid });

            obj.nsid = rec.save();
            obj.success = true;

            return obj;
        }

       function isEmpty(stValue) {
            if ((stValue === '') || (stValue == null) || (stValue == undefined)) {
                return true;
            } else {
                if (typeof stValue == 'string') {
                    if ((stValue == '')) {
                        return true;
                    }
                } else if (typeof stValue == 'object') {
                    if (stValue.length == 0 || stValue.length == 'undefined') {
                        return true;
                    }
                }

                return false;
            }
        };

        return {
            callWS: callWS,
            isEmpty: isEmpty,
            logRequest: logRequest,
            generateAuthCode: generateAuthCode,
            createCustomerRequest: createCustomerRequest,
            createContactRequest: createContactRequest,
            createProjectRequest: createProjectRequest,
            updateProject: updateProject,
            upsertContact: upsertContact,
            upsertResourceAllocation: upsertResourceAllocation,
            upsertProjectTask: upsertProjectTask,
            upsertTimeBill: upsertTimeBill,
            // getSalesOrder: getSalesOrder,
            // getProjectTasks: getProjectTasks
        };


        /********** Helper Functions **********/

        function getProjectTasks(options) {
            const projecttaskSearchObj = search.create({
                type: "projecttask",
                filters:
                    [
                        ["status", "anyof", "PROGRESS", "NOTSTART", "COMPLETE"],
                        "AND",
                        ["project", "anyof", options.projectid]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "id",
                            sort: search.Sort.ASC
                        }),
                        "title",
                        "actualwork",
                        "allocatedwork",
                        "startdate",
                        "enddate",
                        "priority",
                        "status",
                        "finishbydate",
                        "calculatedwork"
                    ]
            });

            const searchResultCount = projecttaskSearchObj.runPaged().count;
            log.debug("projecttaskSearchObj result count", searchResultCount);

            var arrTasks = [];

            if (searchResultCount > 0) {
                projecttaskSearchObj.run().each(function (result) {
                    var taskObj = {
                        title: result.getValue({
                            name: "title"
                        }),
                        actualwork: result.getValue({
                            name: "actualwork"
                        }),
                        allocatedwork: result.getValue({
                            name: "allocatedwork"
                        }),
                        startdate: result.getValue({
                            name: "startdate"
                        }),
                        enddate: result.getValue({
                            name: "enddate"
                        }),
                        priority: result.getValue({
                            name: "priority"
                        }),
                        status: result.getValue({
                            name: "status"
                        }),
                        finishbydate: result.getValue({
                            name: "finishbydate"
                        }),
                        calculatedwork: result.getValue({
                            name: "calculatedwork"
                        })
                    };

                    arrTasks.push(taskObj);

                    return true;
                });
            }

            return arrTasks;
        }

        function getSalesOrder(options) {
            var arrSoObj = [];

            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["jobmain.internalid", "anyof", options.projectid]
                    ],
                columns:
                    [
                        "tranid",
                        "trandate",
                        "opportunity",
                        "statusref",
                        "custbody_stc_total_after_discount",
                        search.createColumn({
                            name: "tranid",
                            join: "opportunity"
                        }),
                        search.createColumn({
                            name: "entitystatus",
                            join: "opportunity"
                        }),
                        search.createColumn({
                            name: "probability",
                            join: "opportunity"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "opportunity"
                        })
                    ]
            });

            var searchResultCount = salesorderSearchObj.runPaged().count;
            log.debug("salesorderSearchObj result count", searchResultCount);

            salesorderSearchObj.run().each(function (result) {
                var soObj = {
                    nsid: result.id,
                    tranid: result.getValue({
                        name: "tranid"
                    }),
                    trandate: result.getValue({
                        name: "trandate"
                    }),
                    status: result.getValue({
                        name: "statusref"
                    }),
                    total: result.getValue({
                        name: "custbody_stc_total_after_discount"
                    }),
                    // opportunity: {
                    //     tranid: result.getValue({
                    //         name: "tranid",
                    //         join: "opportunity"
                    //     }),
                    //     status: result.getText({
                    //         name: "entitystatus",
                    //         join: "opportunity"
                    //     }),
                    //     probability: result.getValue({
                    //         name: "probability",
                    //         join: "opportunity"
                    //     })
                    // }
                };

                var opportunityNo = result.getValue({
                    name: "tranid",
                    join: "opportunity"
                });

                if (opportunityNo) {
                    soObj.opportunity = {
                        nsid: result.getValue({
                            name: "internalid",
                            join: "opportunity"
                        }),
                        tranid: opportunityNo,
                        status: result.getText({
                            name: "entitystatus",
                            join: "opportunity"
                        }),
                        probability: result.getValue({
                            name: "probability",
                            join: "opportunity"
                        })
                    }
                }

                arrSoObj.push(soObj);
                return true;
            });

            /*
            salesorderSearchObj.id="customsearch1654293744593";
            salesorderSearchObj.title="CTC SO Project Search (copy)";
            var newSearchId = salesorderSearchObj.save();
            */

            return arrSoObj;
        }

    });
