
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
* @NApiVersion 2.1
* @NScriptType MapReduceScript
* @Description
*
* CHANGELOGS
*
* Version      Date                        Author                                  Remarks
* 1.00                                     jaira@nscatalyst.com            Initial Build
*
*/


define(['N/search', 'N/record', 'N/runtime'], function(search, record, runtime) {

    const SPARAM_TRX_TO_UPDATE = 'custscript_trx_to_update';

    // Use the getInputData function to return two strings.
    function getInputData()
    {
        try
        {
            let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_TRX_TO_UPDATE});
            if(SS_ID){
                return search.load(SS_ID)
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
        try
        {
            let tranId = context.key;

            let tranObj = record.load({
                type: record.Type.SALES_ORDER,
                id: tranId
            });

            tranObj.setValue({
                fieldId: 'custbody_do_not_call_vt',
                value: false
            });

            tranObj.save({
                ignoreMandatoryFields: true
            })
        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

   
    // The reduce function is invoked one time for each of the key/value pairs
    // provided.
    function reduce(context) 
	{
        try
        {

        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
        }
    }

    // The summarize stage is a serial stage, so this function is invoked only one time.
    function summarize(context) 
	{
        try
        {

        }
        catch(o_exception)
        {
            log.debug('catch', 'o_exception= ' + o_exception);
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