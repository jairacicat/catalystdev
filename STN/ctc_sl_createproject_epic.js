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
 * Script Name: 
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         June 14, 2024               jaira@nscatalyst.com                    Initial Build
 *
 */
 
define(['N/record', 'N/url', 'N/https'], 
    function(record, url, https) 
    {

        const JIRA_URL = 'https://stninc.atlassian.net/rest/api/3/issue';

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

                //Create Jira Epic
                

            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
    
        return
        {
            onRequest: onRequest
        };
    }); 