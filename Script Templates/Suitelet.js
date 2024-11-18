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
 
define([], 
function() 
{
    function onRequest(context) 
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
        onRequest: onRequest
    };
}); 