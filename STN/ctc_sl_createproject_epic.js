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
 
define(['N/record', 'N/https', 'N/search','./utils/ctc_CommonUtils.js',  './lib/lib_ctc_integ.js'], 
    function(record, https, search, utils, lib) 
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
                    id: PARAMETERS.salesorderid,
                    values: {
                        'job': projectId
                    }
                });

                let jiraProjectId = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: PARAMETERS.customerId,
                    columns: 'custentity_ctc_jira_id'
                }).custentity_ctc_jira_id;

                
                if(jiraProjectId){

                    let validProject = validateJiraProject(jiraProjectId);

                    if(validProject){
                        //Create Jira Epic
                        let payloadObject = {
                            contentText : PARAMETERS.opportunityId,
                            summaryText: PARAMETERS.opportunityId,
                            projectName: jiraProjectId
                        }

                        let payload = createIssuePayload(payloadObject);

                        let endpoint = JIRA_URL + "project";

                        let configObj = utils.getRecordObj(configId, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
                        let headersObj = lib.getHeader(configObj);
                        let responseBody = https.post({
                            url: endpoint,
                            body: JSON.stringify(payload),
                            headers: headersObj
                        });

                        if (responseBody && (responseBody.code == 200 || responseBody.code == 201)) {
                            let jiraEpicId = responseBody.id;
                            let jiraKey = responseBody.key;
                            let jiraLink = responseBody.self;

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

                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        log.error("Project not valid.");
                    }
                  
                }
                else{
                    //Create Jira Customer

                }



              
               
                

            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function validateJiraProject(projectId){
            let configObj = utils.getRecordObj(configId, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
            let headersObj = lib.getHeader(configObj);
            let endpoint = JIRA_URL + '/project/' + projectId;
         
            let postRequest = https.post({
                url: endpoint,
                body: JSON.stringify(dataArr),
                headers: headersObj
            });

            try{
                let postResponseParsed = (postRequest);

                log.debug({title: 'postDataResponse', details: postResponseParsed});
                if (postResponseParsed && postResponseParsed.code == 200) {
                    response = postResponseParsed.code;
                    return true;
                }
                else{
                    return false;
                }
            }
            catch(errPost){
                log.error('Error in getting response body', errPost);
                response = JSON.stringify(postRequest.body)
                return false;
            }
            return true;
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
              "update": {}
            };
        }
    
        return {onRequest};
    }); 