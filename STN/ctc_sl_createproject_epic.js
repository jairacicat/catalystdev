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
 * Project Number: 11298 - EPS Learning
 * Script Name: CTC - Create Project & Epic SL
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description This script creates the Jira Epic and its child issues matching the SO items. If the Jira Project Board is not existing, this script will create it too.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         Dec 14, 2024               jaira@nscatalyst.com                    Initial Build
 * 2.00         Feb 6, 2025                jaira@nscatalyst.com                    Remove logic of creating NS Project. Add logic of creating Jira Project and child issues.
 *
 */
 
define(['N/record', 'N/https', 'N/search','./utils/ctc_CommonUtils.js',  './lib/lib_ctc_integ.js', 'N/render', 'N/encode', 'N/file', 'N/runtime'],
    function(record, https, search, utils, lib, render, encode, file, runtime) 
    {

        const JIRA_URL = 'https://stninc.atlassian.net/rest/api/3/';
        const CONN_CONFIG = lib.globalObj().CONN_CONFIG;

        const WORKFLOW_SCHEME_ID = 10123;
        const ISSUE_TYPE_SCHEME_ID = 10173;
        const ISSUE_TYPE_SCREEN_SCHEME_ID = 10017;
        
        const PDF_FOLDER = 3330;

        let LOG_MESSAGE = "";

        function onRequest(context) 
        {
            try
            {
                let PARAMETERS = context.request.parameters;
                log.debug("PARAMETERS", PARAMETERS);

                let soId = PARAMETERS.soId;
                let soRec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: soId
                });

                let itemLineCount = soRec.getLineCount({ sublistId: 'item' });
                let tempItems = [];
                for(let i = 0; i < itemLineCount; i++){
                    let tempObject = {
                        'name': '',
                        'description': ''
                    }
                    tempObject.name = soRec.getSublistText({
                        sublistId: 'item',
                        line: i,
                        fieldId: 'item'
                    });

                    tempObject.description = soRec.getSublistValue({
                        sublistId: 'item',
                        line: i,
                        fieldId: 'description'
                    });

                    tempItems.push(tempObject);
                }
                log.debug("Temp Items", tempItems);

                let projectId = soRec.getValue({
                    fieldId: 'job'
                });

                let projectName = soRec.getText({
                    fieldId: 'job'
                });

                let customerId = soRec.getValue({
                    fieldId: 'entity'
                });

                let opportunityId = soRec.getValue({
                    fieldId: 'custbody_ctc_opportunityid'
                });
                

                let paramFields = {
                    "soId" : soId,
                    "customerId" : customerId,
                    "projectId" : projectId,
                    "opportunityId" : opportunityId,
                    "items" : tempItems,
                    "projectName" : projectName
                }

                log.debug("paramFields", paramFields);

                let customerName = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: customerId,
                    columns: 'companyname'
                }).companyname;
               
                
                log.debug("customerName", customerName);
                if(customerName){

                    let jiraProjectId = validateJiraProject(customerName);
                    let configObj = utils.getRecordObj(1, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
                    let headersObj = lib.getHeader(configObj);

                    if(jiraProjectId){
                        let jiraEpicId = createJiraEpic(headersObj, jiraProjectId, paramFields, projectId);

                        if (jiraEpicId.id != null) {
                           
                            //Attach SO PDF to Jira Epic:
                            attachWeblinkToEpic(headersObj, jiraEpicId.id, paramFields)
                            return true;
                        
                        }
                        else{

                            log.error("Error in creating Jira Project: ", jiraEpicId.errors);
                            return false;
                        }
                    }
                    else{
                        log.error("Project not valid.");
                        log.debug("Headers Obj", headersObj);
                        let jiraProjectId = createJiraProjectAndAssignWorkflow(headersObj, customerName);

                        log.debug("Jira Project ID", jiraProjectId);
                        if(jiraProjectId){

                            let jiraEpicId = createJiraEpic(headersObj, jiraProjectId, paramFields, projectId);
                        
                            if(jiraEpicId.id != null){
                                //Attach SO PDF to Jira Epic:
                                attachWeblinkToEpic(headersObj, jiraEpicId.id, paramFields);
                                return true;
                            }
                            else{
                                log.error("Error in creating Jira Project: ", jiraEpicId.error);
                                return false;
                            }
                        }
                    }
                }
                
                return true;
            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function attachWeblinkToEpic(headers, jiraEpicId, paramFields){
            //Render the SO PDF
            let pdfFile = render.transaction({
                entityId: parseInt(paramFields.soId),
                printMode: render.PrintMode.PDF
            });

            pdfFile.folder = PDF_FOLDER;
            pdfFile.isOnline = true;
            let pdfFileId = pdfFile.save();
            let pdfFileObj = file.load({id: pdfFileId});

            //Attach Weblink
            let weblinkPayload = createWebLinkPayload(pdfFileObj, paramFields.opportunityId);
            log.debug("webLinkPayload", weblinkPayload);
            var weblinkResponse = https.post({
                url: JIRA_URL + '/issue/' + jiraEpicId + '/remotelink',
                headers: headers,
                body: JSON.stringify(weblinkPayload)
            });

            log.debug("response", weblinkResponse);
            if(weblinkResponse.code == 201 ){
                log.debug("Attaching weblink successful", jiraEpicId);
                log.debug("File attached to Issue", jiraEpicId);
            }
            else{
                log.error("Error in attaching weblink", jiraEpicId);
            }
        }

        function createCustomerKey(customerName) {
            // Check if the name has multiple words or hyphenated words
            if (customerName.includes(' ') || customerName.includes('-')) {
                // Split the name into parts on spaces or hyphens
                const parts = customerName.split(/[\s\-]+/);
                // Get the first letter of each part and join them into a key
                const key = parts.map(part => part[0]).join('').toUpperCase();
                return key;
            } else {
                // If it's a single word, use the first three letters
                return customerName.substring(0, 3).toUpperCase();
            }
        }

        function createJiraEpic(headers, jiraProjectId, paramFields, nsProjectId){
            let payloadObject = {
                contentText : paramFields.opportunityId,
                summaryText: paramFields.projectName,
                projectName: jiraProjectId
            }

            let payload = createIssuePayload(payloadObject);
            let endpoint = JIRA_URL + "issue";

            log.debug("payload", payload);
            let responseBody = https.post({
                url: endpoint,
                body: JSON.stringify(payload),
                headers: headers
            });

            log.debug("Creation of Jira Epic response", responseBody);

            if (responseBody && (responseBody.code == 200 || responseBody.code == 201)) {
                let responseBodyValue = JSON.parse(responseBody.body);
                let jiraEpicId = responseBodyValue.id;
                let jiraKey = responseBodyValue.key;
                let jiraLink = responseBodyValue.self;

                log.debug("Jira Epic created", jiraEpicId);

                //Update NS Project with the Epic ID and Key
                record.submitFields({
                    type: record.Type.JOB,
                    id: nsProjectId,
                    values: {
                        'custentity_ctc_jira_epic_id' : jiraEpicId,
                        'custentity_ctc_jira_key' : jiraKey,
                        'custentity_ctc_jira_link' : jiraLink
                    }
                });
                log.debug("Project Updated", nsProjectId);

                //Get items from parameters and create Jira Child Issues
                let soItems = paramFields.items;
                log.debug("SO ITEMS", soItems)
                for(var i = 0; i < soItems.length; i++){
                    let childPayloadObject = {
                        contentText : soItems[i].description,
                        summaryText: paramFields.projectName + " - " + soItems[i].name,
                        projectName: jiraProjectId
                    }

                    let childPayload = createIssuePayload(childPayloadObject, true, jiraEpicId);
                    let childResponseBody = https.post({
                        url: endpoint,
                        body: JSON.stringify(childPayload),
                        headers: headers
                    });
        
                    log.debug("Creation of Child Jira Epic response", childResponseBody);

                    let childResponse = JSON.parse(childResponseBody.body);
                    let childJiraKey = childResponse.key;
                   
                    let projectTask = record.create({
                        type: record.Type.PROJECT_TASK,
                    });

                    projectTask.setValue({
                        fieldId: 'title',
                        value: paramFields.opportunityId + " - " + soItems[i].name
                    });

                    projectTask.setValue({
                        fieldId: 'company',
                        value: nsProjectId
                    });

                    projectTask.setValue({
                        fieldId: 'plannedwork',
                        value: 1
                    });

                    projectTask.setValue({
                        fieldId: 'custevent_ctc_jira_issue_key',
                        value: childJiraKey
                    });

                    let projectTaskId = projectTask.save({ignoreMandatoryFields: true});
                    log.debug("Project Task Created", projectTaskId);
                }

                return {
                    "id": jiraEpicId
                };
            }
            else{
                log.error("Error in creating Jira Epic", responseBody.errors);
                return {
                    "error": responseBody.errors
                };
            }
        }

        function createJiraProjectAndAssignWorkflow(headers, customerName) {
            let customerKey = createCustomerKey(customerName);
            log.debug("Customer Key", customerKey)
            // Step 1: Create Jira Project
            var projectData = {
                "key": customerKey,
                "name": customerName,
                "projectTypeKey": "business",
                "leadAccountId": "712020:2c772fda-6fb8-4fe3-abd8-d848742bcadc",
                "projectTemplateKey": "com.atlassian.jira-core-project-templates:jira-core-simplified-project-management"
            };
    
            log.debug("projectData", projectData)
            var createProjectResponse = https.post({
                url: JIRA_URL + 'project',
                body: JSON.stringify(projectData),
                headers: headers
            });

            log.debug("createProjectResponse", createProjectResponse);
    
            if (createProjectResponse.code === 201) {
                var project = JSON.parse(createProjectResponse.body);
                var projectId = project.id;
                log.debug('Project Created', 'Project ID: ' + projectId);

                 // Step 1: Assign Workflow Scheme to the Project
                
                 var assignSchemeResponse = https.put({
                     url: JIRA_URL + 'workflowscheme/project',
                     body: JSON.stringify({
                         "projectId": projectId,
                         "workflowSchemeId": WORKFLOW_SCHEME_ID
                       }),
                     headers: headers
                 });
     
                 if (assignSchemeResponse.code === 204) {
                     log.debug('Workflow Scheme Assigned', 'Workflow Scheme ID: ' + WORKFLOW_SCHEME_ID);
                 } else {
                     log.error('Error Assigning Workflow Scheme', assignSchemeResponse.body);
                 }

               
                // Step 2: Assign Issue Type Scheme to Project
                var assignIssueTypeSchemeResponse = https.put({
                    url: JIRA_URL + 'issuetypescheme/project',
                    body: JSON.stringify(
                        {
                            "issueTypeSchemeId": ISSUE_TYPE_SCHEME_ID,
                            "projectId": projectId
                        }
                    ),
                    headers: headers
                });

                if (assignIssueTypeSchemeResponse.code === 204) {
                    log.debug('Issue Type Scheme Assigned', 'Issue Type Scheme ID: ' + ISSUE_TYPE_SCHEME_ID);
                } else {
                    log.error('Error Assigning Issue Type Scheme', assignSchemeResponse.errorMessages);
                }

                 
                // Step 3: Assign Issue Type Scheme to Project
                var assignIssueTypeScreenSchemeResponse = https.put({
                    url: JIRA_URL + 'issuetypescreenscheme/project',
                    body: JSON.stringify(
                        {
                            "issueTypeScreenSchemeId": ISSUE_TYPE_SCREEN_SCHEME_ID,
                            "projectId": projectId
                        }
                    ),
                    headers: headers
                });

                if (assignIssueTypeScreenSchemeResponse.code === 204) {
                    log.debug('Issue Type Scheme Assigned', 'Issue Type Scheme ID: ' + ISSUE_TYPE_SCREEN_SCHEME_ID);
                } else {
                    log.error('Error Assigning Issue Type Screen Scheme', assignIssueTypeScreenSchemeResponse.errorMessages);
                }
    
                return projectId;
    
            } else {
                log.error('Error Creating Project', createProjectResponse.body);
                return null;
            }
        }

        function validateJiraProject(companyName){
            let configObj = utils.getRecordObj(1, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
            let headersObj = lib.getHeader(configObj);
            let endpoint = JIRA_URL + '/project/search?query=' + companyName;

            let getRequest = https.get({
                url: endpoint,
                headers: headersObj
            });

            try{
                let getResponseParsed = (getRequest);

                log.debug({title: 'getResponse', details: getResponseParsed});
                if (getResponseParsed && getResponseParsed.code == 200) {
                    responseBody = JSON.parse(getResponseParsed.body);

                    let jiraProjectId = responseBody.values[0].id;
                    log.debug("Searched Jira Project ID", jiraProjectId);
                    return jiraProjectId;
                }
                else{
                    return '';
                }
            }
            catch(errPost){
                log.error('Error in getting response body', errPost);
                response = JSON.stringify(getRequest.body)
                return false;
            }
            return '';
        }

        function createWebLinkPayload(soFile, opportunityId){
            let domain = getNetSuiteDomain();
            return {
                "object": {
                    "url": domain + soFile.url,
                    "title": "SOW - " + opportunityId,
                    "summary": "SOW",
                    "icon": {
                        "url16x16": "https://example.com/favicon.ico",
                        "title": "SOW - " + opportunityId
                    }
                }
            }
        }

        function getNetSuiteDomain() {
            var env = runtime.envType;
            var accountId = runtime.accountId.replace('_', '-').toLowerCase(); // Replace any underscores
            return 'https://' + accountId + '.app.netsuite.com';
        }    

        function createIssuePayload(result, isChildIssue, jiraEpicId) {

            return {
              "fields": {
                "description": {
                  "content": [
                    {
                      "content": [
                        {
                          "text": result.contentText,
                          "type": "text"
                        }
                      ],
                      "type": "paragraph"
                    }
                  ],
                  "type": "doc",
                  "version": 1
                },
                
                "issuetype": {
                  "id": isChildIssue ? "10004" : "10000" // Assuming this is a constant, otherwise it can be dynamic
                },
                "labels": result.labelsValues,
                "project": {
                  "id": result.projectName
                },
                "summary": result.summaryText,
                ...(jiraEpicId ? { "parent": { "id": jiraEpicId } } : {})
              },
              "update":{
                }
            };
        }
    
        return {onRequest};
    }); 