
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
* Project Number:
* Script Name:
* Author: jaira@nscatalyst.com
* @NApiVersion 2.x
* @NScriptType ScheduledScript
* @Description
*
* CHANGELOGS
*
* Version      Date                        Author                                  Remarks
* 1.00                                     jaira@nscatalyst.com                    Initial Build
*
*/

define(['N/search', 'N/record', 'N/runtime'],
    function(search, record, email, runtime) 
	{
        function execute(context) 
		{
            try
            {

            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return 
		{
            execute: execute
        };
    });