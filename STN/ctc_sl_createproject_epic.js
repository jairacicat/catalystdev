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
 * @Description This script creates the NS Project record and Jira Epic. If the Jira Project Board is not existing, this script will create it too.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 *
 */
 
define(['N/record', 'N/https', 'N/search','./utils/ctc_CommonUtils.js',  './lib/lib_ctc_integ.js', 'N/render', 'N/encode', 'N/file', 'N/runtime'],
    function(record, https, search, utils, lib, render, encode, file, runtime) 
    {

        const JIRA_URL = 'https://stninc.atlassian.net/rest/api/3/';
        const CONN_CONFIG = lib.globalObj().CONN_CONFIG;

        function onRequest(context) 
        {
            try
            {
                let PARAMETERS = context.request.parameters;

                //Create NS Project:
                let PROJECT_REC = record.create({
                    type: record.Type.JOB,
                });

                log.debug("PARAMETERS", PARAMETERS);

                PROJECT_REC.setValue({
                    fieldId: 'companyname',
                    value: PARAMETERS.opportunityId
                });

                PROJECT_REC.setValue({
                    fieldId: 'parent',
                    value: PARAMETERS.customerId
                });

                let projectId = PROJECT_REC.save({ignoreMandatoryFields: true});

                //Update Sales Order with Project ID

                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: PARAMETERS.soId,
                    values: {
                        'job': projectId
                    }
                });
                

                let customerName = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: PARAMETERS.customerId,
                    columns: 'companyname'
                }).companyname;

                if(customerName){

                    let jiraProjectId = validateJiraProject(customerName);

                    if(jiraProjectId){
                        //Create Jira Epic
                        let payloadObject = {
                            contentText : PARAMETERS.opportunityId,
                            summaryText: PARAMETERS.opportunityId,
                            projectName: jiraProjectId
                        }

                        let payload = createIssuePayload(payloadObject);

                        let endpoint = JIRA_URL + "issue";

                        let configObj = utils.getRecordObj(1, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
                        let headersObj = lib.getHeader(configObj);
                        
                        
                        let responseBody = https.post({
                            url: endpoint,
                            body: JSON.stringify(payload),
                            headers: headersObj
                        });

                        if (responseBody && (responseBody.code == 200 || responseBody.code == 201)) {
                            let responseBodyValue = JSON.parse(responseBody.body);
                            let jiraEpicId = responseBodyValue.id;
                            let jiraKey = responseBodyValue.key;
                            let jiraLink = responseBodyValue.self;

                            log.debug("responseBody", responseBodyValue)

                            //Update NS Project with the Epic ID and Key
                            record.submitFields({
                                type: record.Type.JOB,
                                id: projectId,
                                values: {
                                    'custentity_ctc_jira_epic_id' : jiraEpicId,
                                    'custentity_ctc_jira_key' : jiraKey,
                                    'custentity_ctc_jira_link' : jiraLink
                                }
                            });
                            log.debug("Project Updated", projectId)
                        
                            //Attach SO PDF to Jira Epic:

                            //Render the SO PDF
                            let SO_ID = PARAMETERS.soId;
                            let pdfFile = render.transaction({
                                entityId: parseInt(SO_ID),
                                printMode: render.PrintMode.PDF
                            });

                            pdfFile.folder = 3330;
                            pdfFile.isOnline = true;
                            let pdfFileId = pdfFile.save();

                            let pdfFileObj = file.load({id: pdfFileId});


                            /*// Encode the PDF content to base64 for transmission
                            var base64EncodedPDF = encode.convert({
                                string: pdfFile.getContents(),
                                inputEncoding: encode.Encoding.UTF_8,
                                outputEncoding: encode.Encoding.BASE_64
                            });

                            let attachFileURL = 'issue/' + jiraEpicId + '/attachments';
                            // Prepare the payload as a JSON object with the encoded file
                            var filePayload = JSON.stringify({
                                "text": "@" + pdfFileObj.path
                            });

                            log.debug("filePayload", filePayload);

                            log.debug("endpoint", JIRA_URL + attachFileURL);
                            // Send the base64 encoded PDF to Jira
                            headersObj["Content-Type"] = "multipart/form-data"
                            var response = https.post({
                                url: JIRA_URL + attachFileURL,
                                headers: headersObj,
                                body: filePayload
                            });
                            log.debug("response", response);
                            */

                            //Attach Weblink
                            let weblinkPayload = createWebLinkPayload(pdfFileObj, PARAMETERS.opportunityId);
                            log.debug("webLinkPayload", weblinkPayload);
                            var response = https.post({
                                url: JIRA_URL + '/issue/' + jiraEpicId + '/remotelink',
                                headers: headersObj,
                                body: JSON.stringify(weblinkPayload)
                            });

                            log.debug("response", response);
                            log.debug("File attached to Issue", jiraEpicId);

                            return true;
                        
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        log.error("Project not valid.");
                        let jiraProjectId = createJiraProjectAndAssignWorkflow(headersObj, customerName);


                        if(jiraProjectId){

                            let payloadObject = {
                                contentText : PARAMETERS.opportunityId,
                                summaryText: PARAMETERS.opportunityId,
                                projectName: jiraProjectId
                            }
    
                            let payload = createIssuePayload(payloadObject);
    
                            let endpoint = JIRA_URL + "issue";
    
                            let configObj = utils.getRecordObj(1, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
                            let headersObj = lib.getHeader(configObj);
                            
                            
                            let responseBody = https.post({
                                url: endpoint,
                                body: JSON.stringify(payload),
                                headers: headersObj
                            });
                            record.submitFields({
                                type: record.Type.JOB,
                                id: projectId,
                                values: {
                                    'custentity_ctc_jira_epic_id' : jiraEpicId,
                                    //'custentity_ctc_jira_key' : jiraKey,
                                    //'custentity_ctc_jira_link' : jiraLink
                                }
                            });


                            //Update NS Project with the Epic ID and Key
                            
                            log.debug("Project Updated", projectId)
                        
                            //Attach SO PDF to Jira Epic:

                            //Render the SO PDF
                            let SO_ID = PARAMETERS.soId;
                            let pdfFile = render.transaction({
                                entityId: parseInt(SO_ID),
                                printMode: render.PrintMode.PDF
                            });

                            pdfFile.folder = 3330;
                            pdfFile.isOnline = true;
                            let pdfFileId = pdfFile.save();

                            let pdfFileObj = file.load({id: pdfFileId});

                            //Attach Weblink
                            let weblinkPayload = createWebLinkPayload(pdfFileObj, PARAMETERS.opportunityId);
                            log.debug("webLinkPayload", weblinkPayload);
                            var response = https.post({
                                url: JIRA_URL + '/issue/' + jiraEpicId + '/remotelink',
                                headers: headersObj,
                                body: JSON.stringify(weblinkPayload)
                            });

                            log.debug("response", response);
                            log.debug("File attached to Issue", jiraEpicId);
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

        function createJiraProjectAndAssignWorkflow(headers, customerName) {

            let customerKey = createCustomerKey(customerName);
            // Step 1: Create Jira Project
            var projectData = {
                "key": customerKey,
                "name": customerName,
                "projectTypeKey": "business",
                //"projectTemplateKey": "com.atlassian.jira-core-project-templates:jira-core-project-management",
                //"leadAccountId": "5b10a2844c20165700ede21g",  // Replace with actual account ID
            };
    
            var createProjectResponse = https.post({
                url: JIRA_URL + '/rest/api/3/project',
                body: JSON.stringify(projectData),
                headers: headers
            });
    
            if (createProjectResponse.code === 201) {
                var project = JSON.parse(createProjectResponse.body);
                var projectId = project.id;
                log.debug('Project Created', 'Project ID: ' + projectId);
    
                // Step 2: Assign Workflow Scheme to the Project
                var workflowSchemeId = '10123'; // Replace with your workflow scheme ID
                var assignSchemeResponse = https.put({
                    url: JIRA_URL + '/rest/api/3/project/' + projectId + '/workflowscheme',
                    body: JSON.stringify({
                        id: workflowSchemeId
                    }),
                    headers: headers
                });
    
                if (assignSchemeResponse.code === 204) {
                    log.debug('Workflow Scheme Assigned', 'Workflow Scheme ID: ' + workflowSchemeId);
                } else {
                    log.error('Error Assigning Workflow Scheme', assignSchemeResponse.body);
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

        function createIssuePayload(result) {
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
                  "id": "10000"  // Assuming this is a constant, otherwise it can be dynamic
                },
                "labels": result.labelsValues,
                "project": {
                  "id": result.projectName
                },
                "summary": result.summaryText
              },
              "update":{
                }
            };
        }
    
        return {onRequest};
    }); 