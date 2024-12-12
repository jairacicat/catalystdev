/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

/****************************************************************************************
 * Name: ctc - Integ Outbound Bulk SC <customscript_ctc_sc_integ_outb_blk>
 *
 * Script Type:	Scheduled Script
 *
 * Version:		1.0.0 - date: Mar 5, 2024 - Initial Release
 *				
 *
 * Author:	Krizzia Jane Rivera <krivera@ctciciencyinc.com>
 * DRR Details: TBD
 * Description: This script run saved searches to build a JSON.
 *              Then establish connection for the integration containign the JSON file.
 * Libraries: ctc_CommonUtils.js, lib_ctc_integ_datalake.js
 * Company: ctciciency Inc.
 * Script Modification Logs:
 * Date            Modified By            Requested By                                      Notes
 * Mar 5, 2024     krivera               -                                                  Initial

 ****************************************************************************************/

 define(['N/file', 'N/search', 'N/format', 'N/runtime', 'N/https', './utils/ctc_CommonUtils.js', './lib/moment.js', './lib/lib_ctc_integ.js'], (file, search, format, runtime, https, utils, moment, lib) => {
    
    var objEvents = {};

    // Global Variables
    const SCRIPT_FILE_NAME = 'ctc - Integ Outbound Bulk SC.js';
    const SPARAM_RECORD_CONFIG_ID = 'custscript_ctc_integ_outbound_recconfig';
    const RECORD_CONFIG = lib.globalObj().RECORD_CONFIG;
    const CONN_CONFIG = lib.globalObj().CONN_CONFIG;

    objEvents.execute = (scriptContext) => {
        log.audit(SCRIPT_FILE_NAME, '<--- START OUTBOUND INTEGRATION --->');
        try {
            let recObj = utils.getRecordObj(utils.getScriptParamValue(SPARAM_RECORD_CONFIG_ID), RECORD_CONFIG.ID, RECORD_CONFIG.FIELDS, true);

            log.debug("recObj", recObj);
            let ssArr = [];
            let srch1 = [];
            let srch2 = [];
            let groupBy = '';
            let combinedArr = [];
            let srchFilterArr = [];
            let dataArr = [];

            let now = new Date();

            let startDate = ''; 
            let endDate = '';

            srchFilterArr.push(search.createFilter({
                name: 'subsidiary',
                operator: search.Operator.ANYOF,
                values: recObj.SUBSIDIARY
            }));
            log.debug('Subsidiary: ', JSON.stringify(recObj.SUBSIDIARY));

            if (recObj.USE_NUMBER_OF_DAYS) {
                startDate = moment(now).subtract(recObj.NUMBER_OF_DAYS, 'days').format('M/D/YYYY hh:mm a');
                log.debug('Start Date, Days Ago: ', JSON.stringify(startDate));

                srchFilterArr.push(search.createFilter({
                    name: 'lastmodifieddate',
                    operator: search.Operator.ONORAFTER,
                    values: startDate
                }));
            } else if (recObj.USE_FROM_DATE) {
                startDate = moment(recObj.FROM_DATE).format('M/D/YYYY hh:mm a');
                log.debug('Start Date, From Date: ', JSON.stringify(startDate));

                srchFilterArr.push(search.createFilter({
                    name: 'lastmodifieddate',
                    operator: search.Operator.ONORAFTER,
                    values: startDate
                }));

            } else if (recObj.USE_LAST_ACCOUNTING_PERIOD) {
                startDate = moment(now).subtract(1, 'months').startOf('month').format('M/D/YYYY hh:mm a');
                endDate = moment(now).subtract(1, 'months').endOf('month').format('M/D/YYYY hh:mm a');
                log.debug('Start Date, From Date: ', JSON.stringify(startDate) + '-' + JSON.stringify(endDate));

                srchFilterArr.push(search.createFilter({
                    name: 'lastmodifieddate',
                    operator: search.Operator.WITHIN,
                    values: [startDate,endDate]
                }));
            }
            log.debug("srchFiltterArr", srchFilterArr);
            
            if (!utils.isEmpty(recObj.SAVED_SEARCH_1)) {
                srch1 = utils.allColumnsSearch(recObj.SAVED_SEARCH_1, srchFilterArr, null, true);
            }
            
            if (!utils.isEmpty(recObj.SAVED_SEARCH_2) && !utils.isEmpty(recObj.SAVED_SEARCH_GROUPBY)) {
                srch2 = utils.allColumnsSearch(recObj.SAVED_SEARCH_2, srchFilterArr, null, true);
                groupBy = recObj.SAVED_SEARCH_GROUPBY
            }

            combinedArr = srch1.concat(srch2);
            log.debug("combinedArr", combinedArr);
            if (!utils.isEmpty(groupBy)) {
            let groupByField = utils.groupBy(combinedArr, groupBy);
            
            log.debug('srch1:', JSON.stringify(srch1));
            log.debug('srch2:', JSON.stringify(srch2));
            log.debug('groupby:', JSON.stringify(groupBy));
            log.debug('groupByField:', JSON.stringify(groupByField));

            for(const proj in groupByField) {
                let jsonObj = {};
                log.debug('proj:', JSON.stringify(proj));
                const projArr = groupByField[proj];

                log.debug('projArr:', JSON.stringify(projArr));

                projArr.forEach((line, index) => {
                    let tempSublistObj = {};
                    let sublist = '';
                    // Loop through each property
                    for(const prop in line) {
                        // Save sublist values to a temp object
                        if(prop.indexOf('.') > 0) {
                            let propArr = prop.split('.');
                            let sublistField = propArr[1];
                            sublist = propArr[0];

                            log.debug('sublist', JSON.stringify(sublist));
                            log.debug('sublistField', JSON.stringify(sublistField));
    
                            // Check if sublist is already a property of JSON
                            if (!Object.prototype.hasOwnProperty.call(jsonObj, sublist)) {
                                // Instantiate sublist array
                                jsonObj[sublist] = [];
                            }

                            let value = line[prop];
                            if (value.includes('.0')) {
                                let valueFormatted = Number(value);
                                if (valueFormatted == 0) {
                                    value = 0
                                }
                            }

                            tempSublistObj[sublistField] = value;
                            log.debug(sublistField, JSON.stringify(value));

                            // sublistsArr.push(sublist);
                            // sublistFieldsArr.push(propArr[1]);
                        } else {
                            // Set header values
                            let value = line[prop];
                            if (value.includes('.0')) {
                                let valueFormatted = Number(value);
                                if (valueFormatted == 0) {
                                    value = 0
                                }
                            }
                            jsonObj[prop] = value;
                            log.debug(prop, JSON.stringify(value));
                        }
                    }
    
                    log.debug('jsonObj', JSON.stringify(jsonObj));
                    if (sublist != '') {
                        // Once all property has been parsed push temp object to sublist array.
                        jsonObj[sublist].push(tempSublistObj);
                    }
                });

                dataArr.push(jsonObj);
            }
            } else {
              dataArr = combinedArr;
            }
            
            log.debug(SCRIPT_FILE_NAME, 'JSON: ' + JSON.stringify(dataArr));
            let today = new Date(Date.now());
            let newFileObj = file.create({
                name: recObj.FILE_IDENTIFIER + today.toDateString() + '_' + dataArr.length + '.json',
                fileType: file.Type.JSON,
                contents: JSON.stringify(dataArr),
                encoding: file.Encoding.UTF8,
                folder: recObj.FOLDER_OUTBOUND
            });

            try {
                let fileId = newFileObj.save();
                log.debug({title: 'JSON FILE', details: fileId});

                if (fileId) {
                    let response = '';
                    let currentEnvironment = runtime.envType;
                    let configId = recObj.CONN_CONFIG;
                    let configObj = utils.getRecordObj(configId, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
                    let headersObj = lib.getHeader(configObj);
                    let endpoint = currentEnvironment == 'PRODUCTION' ? recObj.ENDPOINT : recObj.STAGING_ENDPOINT;
                    log.debug("Request", {
                        url: endpoint,
                        body: dataArr[0],
                        headers: headersObj
                    });
                    let postRequest = https.post({
                        url: endpoint,
                        body: JSON.stringify(dataArr),
                        headers: headersObj
                    });
        
                    try{
                        let postResponseParsed = (postRequest);

                        log.debug({title: 'postDataResponse', details: postResponseParsed});
                        if (postResponseParsed && postResponseParsed.code) {
                            response = postResponseParsed.code;
                        }
                    }
                    catch(errPost){
                        log.error('Error in getting response body', errPost);
                        response = JSON.stringify(postRequest.body)
                    }

                    let sucMsg = 'Connection SUCCESSFUL. Message: ' + response;
                    lib.createLog({
                        configid: recObj.ID,
                        doculink: fileId,
                        reclink: '',
                        haserror: false,
                        response: sucMsg
                    });
                    log.audit('Response: ', sucMsg);
                }
            } catch (e) {
                let errMsg = 'Error saving outbound payload file OR Error on Request. Error: ' + e;
                lib.createLog({
                    configid: recObj.ID,
                    doculink: '',
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                log.error('Outbound Payload Error: ', errMsg);
            }

        } catch(e) {
            let errMsg = 'Outbound Integration Error: ' + e;
                lib.createLog({
                    configid: '',
                    doculink: '',
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                log.error('Outbound Request Error: ', errMsg);
        }
        log.audit(SCRIPT_FILE_NAME, '<--- END --->');
    }
    function toNSSearchableDatetime(date) {
        var formatted = format.format({ value: date, type: format.Type.DATETIMETZ });
        return formatted.replace(/(:\d{2}):\d{1,2}\b/, '$1');
    }

    return objEvents;
});
