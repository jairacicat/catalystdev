/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */



define(['N/record', 'N/search', 'N/https', 'N/task', 'N/format', 'N/runtime', 'N/file', 'N/config', '../lib/moment-timezone-with-data.min.js', '../utils/appf_CommonUtils.js'], 
function(record, search, https, task, format, runtime, file, config, moment, utils) {

    const MAPPING_SS_ID = 'customsearch_ctc_integ_mapping_ss'; // 	Appf - Integration Mapping Search (DNU - SCRIPT)
    const HEADER_SS_ID = 'customsearch_ctc_integ_header_ss'; // Appf - Integration Header Search (DNU - SCRIPT)

    const INTEG_CONN_CONFIG = {
        ID: 'customrecord_ctc_integ_in_config',
        FIELDS: {
            ID: 'id',
            IS_TEST_MODE: 'custrecord_ctc_integ_config_is_test',
            URL: 'custrecord_ctc_integ_config_conn_url',
            SECRET_KEY: 'custrecord_ctc_integ_config_conn_key',
            TOKEN_URL: 'custrecord_ctc_integ_config_conn_tokurl',
            TOKEN: 'custrecord_ctc_integ_config_conn_token',
            TOKEN_PREFIX: 'custrecord_ctc_integ_config_conn_prefix'
        }
    }

    const INTEG_RECORD_CONFIG = {
        ID: 'customrecord_ctc_integ_recconfig',
        FIELDS: {
            ID: 'id',
            ENDPOINT: 'custrecord_ctc_integ_recconfig_path',
            STAGING_ENDPOINT: 'custrecord_ctc_integ_recconfig_spath',
            FOLDER_INBOUND: 'custrecord_ctc_integ_recconfig_flrid',
            FOLDER_MAPPED: 'custrecord_ctc_integ_recconfig_flmapped',
            FOLDER_PROCESSED: 'custrecord_ctc_integ_recconfig_processed',
            RECORD_TYPE: 'custrecord_ctc_integ_recconfig_rectype',
            CONN_CONFIG: 'custrecord_ctc_integ_recconfig_piconfig',
            GROUP_BY_SUBLIST: 'custrecord_ctc_integ_recconfig_grpfld',
            FILE_TYPE: 'custrecord_ctc_integ_recconfig_ftype',
            FILE_IDENTIFIER: 'custrecord_ctc_integ_recconfig_name',
            NUMBER_OF_DAYS: 'custrecord_ctc_integ_recconfig_days',
            USE_NUMBER_OF_DAYS: 'custrecord_ctc_integ_recconfig_usedays',
            FROM_DATE: 'custrecord_ctc_integ_recconfig_fromdate',
            USE_FROM_DATE: 'custrecord_ctc_integ_recconfig_usefromd',
            USE_LAST_ACCOUNTING_PERIOD: 'custrecordappf_integ_recconfig_useperiod',
            SUBSIDIARY: 'custrecord_ctc_integ_recconfig_subs',
            DIRECTION: 'custrecord_ctc_integ_recconfig_dirflow',
            FROM_SAVED_SEARCH: 'custrecord_ctc_integ_recconfig_fromsrch',
            SAVED_SEARCH_1: 'custrecord_ctc_integ_recconfig_srcsrch',
            SAVED_SEARCH_2: 'custrecord_ctc_integ_recconfig_srcsrch2',
            SAVED_SEARCH_GROUPBY: 'custrecord_ctc_integ_recconfig_grpfld',
            FOLDER_OUTBOUND: 'custrecord_ctc_integ_recconfig_floutb',
            RECORD_LINK: 'custrecord_ctc_integ_recconfig_reclink',
            DUPLICATE_OPERATOR: 'custrecord_ctc_integ_recconfig_dupopr',
            RUN_ON_SCHEDULE_DAY: 'custrecord_ctc_integ_recconfig_runday',
            BUSINESS_DAY: 'custrecord_ctc_integ_recconfig_busday'
       
        }
    }

    const INTEG_HEADER_BODY = {
        ID: 'customrecord_ctc_integ_headerbody',
        FIELDS: {
            ID: 'id',
            RECORD_CONFIG: 'custrecord_integ_header_parentconfig',
            PROPERTY_NAME: 'custrecord_integ_header_property',
            VALUE: 'custrecord_integ_header_value',
            IS_BODY: 'custrecord_integ_header_isbody'
        }
    }

    const INTEG_MAPPING = {
        ID: 'customrecord_ctc_integ_mapping',
        FIELDS: {
            ID: 'id',
            PRIORITY: 'custrecord_ctc_integ_map_priority',
            RECORD_CONFIG: 'custrecord_ctc_integ_map_config_rec',
            PAYLOAD_FIELD: 'custrecord_ctc_integ_map_payload_fld',
            NS_FIELD: 'custrecord_ctc_integ_map_field',
            FIELD_TYPE: 'custrecord_ctc_integ_map_fldtype',
            SUBLIST: 'custrecord_ctc_integ_map_sublist',
            SUBRECORD: 'custrecord_ctc_integ_map_subrecord',
            IS_HARDCODED: 'custrecord_ctc_integ_map_is_hardcoded',
            HARDCODED_VALUE: 'custrecord_ctc_integ_map_hardcode_value',
            IS_LOOKUP: 'custrecord_ctc_integ_map_is_lookup',
            LOOKUP_FIELD: 'custrecord_ctc_integ_map_lookup_fld',
            LOOKUP_FIELD_TYPE: 'custrecord_ctc_integ_map_lookup_type',
            IS_RECORD_LOOKUP: 'custrecord_ctc_integ_map_is_rec_lookup',
            LOOKUP_RECORD: 'custrecord_ctc_integ_map_rec_lookup',
            IS_TRAN_LOOKUP: 'custrecord_ctc_integ_map_is_tran_lookup',
            LOOKUP_TRAN: 'custrecord_ctc_integ_map_tran_lookup',
            IS_ENTITY_LOOKUP: 'custrecord_ctc_integ_map_is_enti_lookup',
            LOOKUP_ENTITY: 'custrecord_ctc_integ_map_enti_lookup',
            CONCAT_SPACER: 'custrecord_ctc_integ_map_spacer',
            LOOKUP_OPERATOR: 'custrecord_ctc_integ_map_lookup_srchop',
            LOOKUP_GET_FIELD: 'custrecord_ctc_integ_map_lookup_fldval'
        }
    }

    const INTEG_LOG = {
        ID: 'customrecord_ctc_integ_log',
        FIELDS: {
            ID: 'recordid',
            RECORD_CONFIG: 'custrecord_ctc_integ_log_config_rec',
            DOCUMENT_LINK: 'custrecord_ctc_integ_log_doclink',
            RECORD_LINK: 'custrecord_ctc_integ_log_config_reclink',
            RESPONSE: 'custrecord_ctc_integ_log_response',
            HAS_ERROR: 'custrecord_ctc_integ_log_has_error'
        }
    }

    const INTEG_STATUS = {
        ID: '',
        FIELDS: {
            ID: 'internalid'
        }
    }

    const RECORD_LINK = '<a href="$URI"> Record Link </a>';

    let libObj = {};

    libObj.getSavedSearchResultCount = (ssId) => {
        let searchObj = search.load({
            id : ssId
        });
        return searchObj.runPaged().count;
    };

    libObj.getDecryptedSecret = (secret) => {
        let options = {
            recordType: INTEG_CONN_CONFIG.ID,
            recordId: 1,
            fieldId: INTEG_CONN_CONFIG.FIELDS.SECRET_KEY,
            value: 'theenteredpassword'
        };
    }

    libObj.getHeader = (connObj) => {
        if (!utils.isEmpty(connObj)) {
            return {
                'Content-Type': 'application/json',
                'Authorization': connObj.TOKEN
            }
        }
    }

    libObj.testConn = (connObj) => {
        if (!utils.isEmpty(connObj)) {
            let headersObj = libObj.getHeader(connObj);

            let getRequest = https.get({
                url: connObj.URL,  
                headers: headersObj
            });

            log.debug('testConn', JSON.stringify(getRequest));

            return getRequest.code === 200;

        } else {
            let errMsg = 'Connection configuration must not be empty.';
            libObj.createLog({
                configid: configId,
                doculink: '',
                reclink: '',
                haserror: false,
                response: errMsg
            });
            log.error('testConn', errMsg);
        }
    };

    libObj.getConnectionHeaders = (configObj) => {
        if(!utils.isEmpty(configObj.ID)){
            let mappingFilterArr = [];
            mappingFilterArr.push(search.createFilter({
                name: INTEG_HEADER_BODY.FIELDS.RECORD_CONFIG,
                operator: search.Operator.ANYOF,
                values: configObj.ID
            }));
            let connectionHeadersArr = utils.allColumnsSearch(HEADER_SS_ID, mappingFilterArr, null, false);
        
            let connectionHeadersObj = {
                header: {},
                body: {}
            };

            connectionHeadersArr.forEach(function(header) {
                if(header[INTEG_HEADER_BODY.FIELDS.IS_BODY]) {
                   connectionHeadersObj.body[header[INTEG_HEADER_BODY.FIELDS.PROPERTY_NAME]] = header[INTEG_HEADER_BODY.FIELDS.VALUE];
                } else {
                   connectionHeadersObj.header[header[INTEG_HEADER_BODY.FIELDS.PROPERTY_NAME]] = header[INTEG_HEADER_BODY.FIELDS.VALUE];
                }
            });
             
            configObj["HEADERS"] = connectionHeadersObj.header;
            configObj["BODY"] = connectionHeadersObj.body;
        }
        return configObj;
    };

    // Function to get the href value of the "next"
    libObj.getNextHref = (links) => {
        for (let link of links) {
            if (link.rel === "next") {
                return link.href;
            }
        }
        return null; // Return null if "next" href is not found
    };

    libObj.fetchData = (recObj, connObj) => {
        if (!utils.isEmpty(recObj)) {
            let currentEnvironment = runtime.envType;
            log.debug('fetchData', 'currentEnvironment: ' + currentEnvironment);

            let endpoint = currentEnvironment == 'PRODUCTION' ? recObj.ENDPOINT : recObj.STAGING_ENDPOINT;

            let headersObj = libObj.getHeader(connObj);
            log.debug('fetchData', 'headersObj: ' + JSON.stringify(headersObj));

            let bodyObj = {};
            let recordRequest = [];

            let subsidiaryList = libObj.getExternalId(recObj.SUBSIDIARY, 'subsidiary', 'custrecord_ctc_subsidiary');
            log.debug('fetchData', 'subsidiaryList: ' + JSON.stringify(subsidiaryList));

            // bodyObj.companyid = subsidiaryList;
            // bodyObj.companyid = '63';

            let dateToday = new Date();
            // let dateTodayFormatted = dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1) + '-' + dateToday.getDate();
            let dateTodayFormatted = moment(dateToday).format('MM-DD-YYYY');
            log.debug('fetchData', 'dateTodayFormatted: ' + JSON.stringify(dateTodayFormatted));  

            if (recObj.USE_NUMBER_OF_DAYS) {
                bodyObj.start_date = moment(dateToday).subtract(recObj.NUMBER_OF_DAYS, 'days').format('MM-DD-YYYY');
                bodyObj.end_date = dateTodayFormatted;
            } else if (recObj.USE_FROM_DATE) {
                bodyObj.start_date = moment(recObj.FROM_DATE).format('MM-DD-YYYY');
                bodyObj.end_date = dateTodayFormatted;
            } else if (recObj.USE_LAST_ACCOUNTING_PERIOD) {
                bodyObj.start_date = moment(dateToday).subtract(1, 'months').startOf('month').format('MM-DD-YYYY');
                bodyObj.end_date = moment(dateToday).subtract(1, 'months').endOf('month').format('MM-DD-YYYY');
            }
            // jcicat - 04252024: Add option if no date filter endpoint is used.
            else{
                bodyObj.start_date = "";
                bodyObj.end_date = "";
            }
            // krivera - 04172024: Append date filter
            endpoint += bodyObj.start_date;

            //jcicat - 03182024: Handling TrueNet response pagination
            let hasMore = true;
            let payLoadArray = [];
            subsidiaryList.forEach(subId => {
                bodyObj.companyid = subId;
                log.debug('fetchData', 'bodyObj: ' + JSON.stringify(bodyObj));
               
                while(hasMore && !utils.isEmpty(endpoint)){
                    log.debug('endpoint - inside while', endpoint);
                    let getRequest = https.get({
                        url: endpoint,
                        // body: JSON.stringify(bodyObj),
                        headers: headersObj
                    });

                    let responseBody = JSON.parse(getRequest.body);
                    if (getRequest.code != 200) {
                        let errMsg = 'Connection FAILED.';
                        libObj.createLog({
                            configid: recObj.ID,
                            doculink: '',
                            reclink: '',
                            haserror: true,
                            response: errMsg + ' ' + postData.body
                        });
                        log.error('Response Error: ', errMsg);
                    } else {
                        let sucMsg = 'Connection SUCCESSFUL.';
                        payLoadArray = payLoadArray.concat(responseBody.items);
                        hasMore = responseBody.hasMore;
                        if(hasMore){
                            endpoint = libObj.getNextHref(responseBody.links);
                            log.debug("next endpoint", endpoint);
                        }
                        if(utils.isEmpty(endpoint)){
                            break;
                        }
                        // libObj.createLog({
                        //     configid: recObj.ID,
                        //     doculink: '',
                        //     reclink: '',
                        //     haserror: false,
                        //     response: sucMsg
                        // });
                        // log.audit('Response: ', sucMsg);
                    }
                }
                //let simplePayloadArray = [payLoadArray[0]];
                //log.debug('fetchData', 'responseBody: ' + JSON.stringify(simplePayloadArray));
                //log.debug('fetchData', 'responseBody: ' + JSON.stringify(payLoadArray));
                
                let fileId = libObj.savePayload(recObj, payLoadArray);
                //let fileId = libObj.savePayload(recObj, simplePayloadArray);

                recordRequest.push({
                    start_date: bodyObj.start_date,
                    end_date: bodyObj.end_date,
                    companyid: bodyObj.companyid,
                    //code: getRequest.code,
                    file: fileId
                })
            });

            log.debug('fetchData', 'recordRequest: ' + JSON.stringify(recordRequest));
            return JSON.stringify(recordRequest);
        } else {
            // TODO: Add error handling
        }
    }
    libObj.pushData = (recObj) => {
        if (recObj.FROM_SAVED_SEARCH && !utils.isEmpty(recObj.SAVED_SEARCH_1)) {
            let schTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT,
                scriptId: 'customscript_ctc_sc_integ_outb_blk',
                params: {
                    'custscript_ctc_integ_outbound_recconfig': recObj.ID
                }
            });

            try {
                let taskId = schTask.submit();
                log.debug({title: 'OUTBOUND Task: ', details: taskId});
            } catch (e) {
                let errMsg = 'Error before JSON build at Scheduled Script submission. Error: ' + e;
                libObj.createLog({
                    configid: recObj.ID,
                    doculink: '',
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                log.error('pushData: ', errMsg);
            }
        } else {
            let errMsg = 'Misconfigured record for outbound. From Saved Seach checkbox must be ticked and add a Saved Search to Saved Search 1 field, Saved Search 2 field is optional.';
            libObj.createLog({
                configid: recObj.ID,
                doculink: '',
                reclink: '',
                haserror: true,
                response: errMsg
            });
            log.error('pushData: ', errMsg);
        }
    }

    libObj.savePayload = (recObj, body) => {
        if (!utils.isEmpty(body)) {
    
            try {
                // Create file in File Cabinet for audit
                let fileName = recObj.FILE_IDENTIFIER;
                let today = new Date(Date.now());

                let newFileObj = file.create({
                    name: fileName + '_' + body.length + '_' + today.toDateString() + '_' + Math.floor((Math.random() * 1000) + 1) + '.json',
                    fileType: file.Type.JSON,
                    contents: JSON.stringify(body),
                    encoding: file.Encoding.UTF8,
                    folder: recObj.FOLDER_INBOUND
                });

                let fileId = newFileObj.save();
                log.debug({title: 'JSON FILE', details: fileId});

                let mrTask = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ctc_sc_integ_mapping',
                    params: {
                        'custscript_ctc_integ_map_fileid': fileId,
                        'custscript_ctc_integ_map_config': recObj.ID
                    }
               });

                try {
                    let taskId = mrTask.submit();
                    log.debug({title: 'INBOUND Task: ', details: taskId});

                    return fileId;

                } catch (e) {
                    let errMsg = 'Error before record creation at MR submission. Error: ' + e;
                    libObj.createLog({
                        configid: recObj.ID,
                        doculink: '',
                        reclink: '',
                        haserror: true,
                        response: errMsg
                    });
                    log.error('savePayload: ', errMsg);
                }
            } catch (e) {
                let errMsg = 'Error in saving payload file. Error: ' + e;
                libObj.createLog({
                    configid: recObj.ID,
                    doculink: '',
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                log.error('savePayload: ', errMsg);
            }
        } else {
            let errMsg = 'Response body must not be empty. ' + body;
            libObj.createLog({
                configid: recObj.ID,
                doculink: '',
                reclink: '',
                haserror: true,
                response: errMsg
            });
            log.error('savePayload: ', errMsg);
        }
    }
    libObj.getExternalId  = (ids, type, field) => {
        let tempArr = [];
        let filterArr = [];
        filterArr.push(search.createFilter({
            name: 'internalid',
            operator: search.Operator.ANYOF,
            values: ids
        }));
        // Run search for look up field internal ID
        let searchObj = search.create({
            type: type,
            columns: [{ name : 'internalid'}, { name : field }],
            filters: filterArr
        });

        // log.debug('isLookUp count:', lookUpSearchObj.runPaged().count);

        searchObj.run().each(function(result) {
            let extId = result.getValue({
                name: field
            });
            tempArr.push(extId);
            return true;
        });
        log.debug('getExternalId', JSON.stringify(tempArr));

        return tempArr;
    }
    libObj.generateNewSecret = (connObj) => {
        if (!utils.isEmpty(connObj)) {  
            let headersObj = {
                "Authorization": connObj.SECRET_KEY 
            };
            if(connObj.hasOwnProperty("HEADERS")){
                headersObj = Object.assign({}, headersObj, connObj.HEADERS);
            }
            let bodyObj = {
                //"grant_type": "client_credentials",         
                //'client_id' : 'u8RNvOUXk7A2AHBZ0OpDfg..',
                //'client_secret': 'PUdUn4vQO8WG6zGqBC4nHw..'
            };
            if(connObj.hasOwnProperty("BODY")){
                bodyObj = Object.assign({}, bodyObj, connObj.BODY);
            }
            let formBody = [];
            for (let property in bodyObj) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(bodyObj[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            let postRequest = https.post({
                url: connObj.TOKEN_URL,
                body: formBody,
                headers: headersObj
            });

            log.debug('generateNewSecret', JSON.stringify(postRequest));

            if (postRequest.code == 200) {
                let responseBody = JSON.parse(postRequest.body);
                let token = responseBody.access_token;

                if(!utils.isEmpty(connObj.TOKEN_PREFIX)){
                    token = connObj.TOKEN_PREFIX + " " + token;
                }

                record.submitFields({
                    type: INTEG_CONN_CONFIG.ID,
                    id: connObj.ID,
                    values: {
                        custrecord_ctc_integ_config_conn_token: token
                    },
                    options: {
                        enablesourcing: false,
                    }
                });

                log.audit('generateNewSecret', 'New token saved: ' + token);

            } else {
                // TODO: Add error handling
            }
            
        } else {
            // TODO: Add error handling
        }
    }
    libObj.getPrimaryKeyField = (recordConfigId) => {
        let mappingFilterArr = [];
        mappingFilterArr.push(search.createFilter({
            name: INTEG_MAPPING.FIELDS.RECORD_CONFIG,
            operator: search.Operator.ANYOF,
            values: recordConfigId
        }));
        let mappingArr = utils.allColumnsSearch(MAPPING_SS_ID, mappingFilterArr, null, false);

        let primaryKey = mappingArr.find((element) => element.custrecord_ctc_integ_map_is_primary == true);

        return primaryKey.custrecord_ctc_integ_map_payload_fld;
    }
    libObj.mapFields = (payload, recordConfigId, fileId) => {
        let primaryKey = '';
        let primaryKeyValue = '';
        let recordObj = {};
        let mappingFilterArr = [];
        let sublistObj = [];
        let recordConfigObj = utils.getRecordObj(recordConfigId, INTEG_RECORD_CONFIG.ID, INTEG_RECORD_CONFIG.FIELDS, true);
        mappingFilterArr.push(search.createFilter({
            name: INTEG_MAPPING.FIELDS.RECORD_CONFIG,
            operator: search.Operator.ANYOF,
            values: recordConfigId
        }));

        log.debug('recordConfigObj:', JSON.stringify(recordConfigObj));
        let recordType = recordConfigObj.RECORD_TYPE;

        let mappingArr = utils.allColumnsSearch(MAPPING_SS_ID, mappingFilterArr, null, false);
        log.debug('mappingArr:', JSON.stringify(mappingArr));

        // Loop through each mapping field.
        mappingArr.forEach(mapping => {
            let mapField = mapping.custrecord_ctc_integ_map_payload_fld;
            let fieldValue = '';
            let isAddress = false;

            let isPrimaryKey = mapping.custrecord_ctc_integ_map_is_primary === true;
            let isLookUp = mapping.custrecord_ctc_integ_map_is_lookup === true;
            let lookUpField = isLookUp ? mapping.custrecord_ctc_integ_map_lookup_fld : undefined;
            let lookUpFieldType = isLookUp ? mapping.custrecord_ctc_integ_map_lookup_type : undefined;
            let isRecordLookUp = mapping.custrecord_ctc_integ_map_is_rec_lookup === true;
            let recordLookUpType = isRecordLookUp ? mapping.custrecord_ctc_integ_map_rec_lookup : undefined;
            let isTransactionLookUp = mapping.custrecord_ctc_integ_map_is_tran_lookup === true;
            let transactionLookUpType = isTransactionLookUp ? mapping.custrecord_ctc_integ_map_tran_lookup : undefined;
            let isEntityLookUp = mapping.custrecord_ctc_integ_map_is_enti_lookup === true;
            let entityLookUpType = isEntityLookUp ? mapping.custrecord_ctc_integ_map_enti_lookup : undefined;
            let fieldId = mapping.custrecord_ctc_integ_map_field;
            let sublistId = mapping.custrecord_ctc_integ_map_sublist;
            let subrecordId = mapping.custrecord_ctc_integ_map_subrecord;
            let fieldType = mapping.custrecord_ctc_integ_map_fldtype;
            let concatSpacer = mapping.custrecord_ctc_integ_map_spacer;
            let lookupOperator = mapping.custrecord_ctc_integ_map_lookup_srchop;
            let lookUpGetValue = mapping.custrecord_ctc_integ_map_lookup_fldval;

            let isHardcoded = mapping.custrecord_ctc_integ_map_is_hardcoded === true;
            
            if (isTransactionLookUp) {
                recType = transactionLookUpType;
            } else if (isEntityLookUp) {
                recType = entityLookUpType
            } else {
                recType = recordLookUpType
            }

            if (mapField.includes('.') || !utils.isEmpty(sublistId)) { // Sublist
                if (mapField.includes('.')) { // ex: item.quantity
                    let keyArr = mapField.split('.'); // ex: [item, quantity]
                    let sublistKey = keyArr[0]; // ex: item
                    let fieldKey = keyArr[1]; // ex: quantity
                    log.debug('keyArr:', JSON.stringify(keyArr));
                    log.debug('sublistKey:', JSON.stringify(sublistKey));
                    log.debug('fieldKey:', JSON.stringify(fieldKey));
                    log.debug('value:', JSON.stringify(payload[sublistKey]));

                    let lookupIdsArr = [];
                    let lookupResultArr = [];
                    // try {
                        sublistObj = typeof payload[sublistKey] == 'string' ? JSON.parse(payload[sublistKey]) : payload[sublistKey];
                        // Non-array ex: sublistObj = { quantity : 2 }
                        // Array ex: sublistObj = [{ quantity : 2, rate: 5 },{ quantity : 5, rate: 10 }]
    
                        log.debug('sublistObj:', JSON.stringify(sublistObj));
                        log.debug('isLookup:', isLookUp);
                        // Non-array
                        if (!Array.isArray(sublistObj)) {
                            fieldValue = sublistObj[keyArr[1]]; // ex: fieldValue = 2
                        } else {
                            if (!recordObj.hasOwnProperty(sublistId)) {
                                recordObj[sublistId] = [];
                                sublistObj.forEach(line => { // loop through payload sublist
                                    recordObj[sublistId].push({});
                                });
                            }

                            if (isLookUp) {
                                sublistObj.forEach((line, idx) => { // loop through payload sublist, ex: sublistObj = [{ quantity : 2, rate: 5 },{ quantity : 5, rate: 10 }]
                                    for (const key in line) { // loop through each property of payload sublist, ex: quantity : 2, rate: 5
                                        if (Object.hasOwnProperty.call(line, key)) {
                                            const element = line[key];
                                            if (key == fieldKey) {
                                                // log.debug('sublistObj element:', JSON.stringify({
                                                //     element: element,
                                                //     key: key
                                                // }));
                                                lookupIdsArr.push(element);
                                                lookupResultArr.push({
                                                    orig: element,
                                                    line: idx
                                                })
                                            }
                                            
                                        }
                                    }
                                });

                                lookupResultArr = libObj.getSublistLookUpValue(lookupResultArr, lookupIdsArr, recType, lookUpField, lookupOperator, lookUpGetValue);
                                log.debug('lookupResultArr:', JSON.stringify(lookupResultArr));
                            }                            

                            sublistObj.forEach((line, idx) => { // loop through payload sublist, ex: sublistObj = [{ quantity : 2, rate: 5 },{ quantity : 5, rate: 10 }]
                                for (const key in line) { // loop through each property of payload sublist, ex: quantity : 2, rate: 5
                                    if (Object.hasOwnProperty.call(line, key)) {
                                        const element = line[key];

                                        // log.debug('sublistObj:', JSON.stringify({
                                        //     key: key,
                                        //     fieldKey: fieldKey
                                        // }));

                                        if (key == fieldKey) {
                                            if (isLookUp) {
                                                log.debug('sublistObj element:', JSON.stringify({
                                                    element: element,
                                                    key: key,
                                                    lookup:  lookupResultArr
                                                }));
                                                
                                                let valueIdx = lookupResultArr.findIndex((data) => data.line == idx);

                                                recordObj[sublistId][idx][fieldId] = lookupResultArr[valueIdx]['key'];
                                            } else {
                                                log.debug('sublistObj:', JSON.stringify({
                                                    key: key,
                                                    fieldKey: fieldKey
                                                }));
                                                recordObj[sublistId][idx][fieldId] = element;
                                            }
                                            
                                            fieldValue = '';
                                        }
                                        
                                    }
                                }
                            });
                        }
                    // } catch (e) {
                    //     log.debug('Mapping Error:', JSON.stringify(e));
                    //     // Empty value if has mapping error
                    //     fieldValue = '';
                    // }
    
                    let newKey = keyArr[0];

                    if (sublistId != '') {
                        newKey = sublistId;
                        if (subrecordId != '') {
                            newKey += '.' + subrecordId;
                        }
                    }
    
                    isAddress = sublistId.includes('address');
                    if (isAddress) {
                        // ADDRESSBOOK
                        if (!recordObj.hasOwnProperty(newKey)) {
                            recordObj[newKey] = [];
                            recordObj[newKey].push({}); // Shipping
                            recordObj[newKey].push({}); // Billing
                        }
        
                        if (keyArr[0].includes('billing')) {
                            recordObj[newKey][1][fieldId] = fieldValue;
                        } else {
                            recordObj[newKey][0][fieldId] = fieldValue;
                        }
                        // ADDRESSBOOK END
                    } 
                } else {
                    log.debug('sublist fieldId:', JSON.stringify(fieldId));
                    log.debug('sublist id:', JSON.stringify(sublistId));
                    log.debug('sublist mapField:', JSON.stringify(mapField));
                    log.debug('sublist obj:', JSON.stringify(sublistObj));

                    if (utils.isEmpty(mapField) && !utils.isEmpty(sublistId)) { // Hardcoded Sublist
                        sublistObj.forEach((line, idx) => { // loop through payload sublist
                            recordObj[sublistId][idx][fieldId] = mapping[INTEG_MAPPING.FIELDS.HARDCODED_VALUE];
                        });
                  }
                }
            } else if (mapField.includes('+')) {
                let keyArr = mapField.trim().split('+');
                let keyArrCount = keyArr.length;
                let concatStr = '';

                // log.debug('keyArr:', JSON.stringify(keyArr));


                keyArr.forEach( (value, idx) => {
                    // log.debug('keyArrCount:', keyArrCount + ' ' + idx);
                    // log.debug('concatSpacer:', concatSpacer);
                    // log.debug('condition:', !(keyArrCount == (idx+1)));
                    if(payload[value]){
                        concatStr += payload[value];
                        if (!(keyArrCount == (idx+1))) {
                            concatStr+=concatSpacer;
                        }
                    } else{
                        concatStr += value
                    }
                });

                fieldValue = concatStr;
                recordObj[fieldId] = fieldValue;

            } else if (isHardcoded) {
                fieldValue = mapping[INTEG_MAPPING.FIELDS.HARDCODED_VALUE];
                recordObj[fieldId] = fieldValue;
            } else {
                fieldValue = payload[mapField] || '';
                recordObj[fieldId] = fieldValue;
            }

            log.debug('FIELD Type:', JSON.stringify({
                fieldType: fieldType
            }));

            // Format Date
            if (fieldType && parseInt(fieldType) == 4 && !utils.isEmpty(fieldValue)) {
                log.debug('FIELD fieldValue:', JSON.stringify({
                    fieldType: fieldValue
                }));

                let adjDate = moment(fieldValue).add('minutes',(moment.tz(libObj.getCompanyTimezone()).utcOffset())*-1);
                let date = new Date(adjDate);

                fieldValue = format.format({
                    value: date,
                    type: format.Type.DATE
                });
                recordObj[fieldId] = fieldValue;
                log.debug('DATE Value:', JSON.stringify(fieldValue));

            } else if (fieldType && parseInt(fieldType) == 46  && !utils.isEmpty(fieldValue)) {
                let date = new Date(fieldValue);
                fieldValue = format.format({
                    value: date,
                    type: format.Type.DATETIME
                });
                recordObj[fieldId] = fieldValue;
                log.debug('DATETIME Value:', JSON.stringify(fieldValue));
            } else if (fieldType && Number(fieldType) == 1) {
                fieldValue = fieldValue.toString();
                recordObj[fieldId] = fieldValue;
                log.debug('String Value:', JSON.stringify(fieldValue));
            }

            if (isLookUp && !isHardcoded && utils.isEmpty(sublistId)) {
                log.debug('isLookUp:', JSON.stringify(isLookUp));
                let recType = '';
                let lookUpValue = '';
                if (isTransactionLookUp) {
                    recType = transactionLookUpType;
                } else if (isEntityLookUp) {
                    recType = entityLookUpType
                } else {
                    recType = recordLookUpType
                }

                lookUpValue = libObj.getLookUpValue(recType, lookUpField, lookupOperator, lookUpGetValue, fieldValue, false);
               
                // log.debug('isLookUp internalid:', JSON.stringify(internalId));
                if (lookUpValue == '') {
                    log.error('No matching record found during lookup. ', JSON.stringify({
                        recType: recType,
                        lookUpField: lookUpField,
                        fieldValue: fieldValue
                    }));
                    recordObj[fieldId] = '';
                    return;
                } else {
                    fieldValue = lookUpValue;
                    recordObj[fieldId] = fieldValue;
                }
            }

            log.debug('Mapping:', JSON.stringify({
                field: mapField,
                nsField: fieldId,
                value: fieldValue
            }));

            if (isPrimaryKey && primaryKey == '') {
                primaryKey = fieldId;
                primaryKeyValue = fieldValue;
            }
        });

        log.debug('Record Object:', JSON.stringify(recordObj));
        log.debug('Duplicate Detection:', JSON.stringify({
            primaryKey: primaryKey,
            primaryKeyValue: primaryKeyValue
        }));

        // Check whether to create or update a record.
        if (primaryKey != '') {
            log.debug('Duplicate Detection Record Type:', recordType);
            // Run search for look up field internal ID

            let operator = recordConfigObj.DUPLICATE_OPERATOR || search.Operator.IS;
            let duplicateSearchObj = search.create({
                type: recordType,
                columns: [{ name : 'internalid'}, { name : primaryKey }],
                filters: [[primaryKey, operator, primaryKeyValue]]
            });

            let duplicateRecordId = '';

            let resultCount = duplicateSearchObj.runPaged().count;
            log.debug('Duplicate Detection Record Count:', resultCount);

            if (resultCount > 0) {
                duplicateSearchObj.run().each(function(result) {
                    duplicateRecordId = result.getValue({
                        name: 'internalid'
                    });
                    return false;
                });
            }

            if (duplicateRecordId != '') {
                log.debug('Update Record:', duplicateRecordId);
                log.debug('Update Record Obj:', recordObj);

                delete recordObj[primaryKey];

                libObj.updateRecord(duplicateRecordId, recordType, recordObj, recordConfigObj, fileId);
            } else {
                log.debug('Create Record:', recordObj);
                libObj.createRecord(recordType, recordObj, recordConfigObj, fileId);
            }   
        } else {
            libObj.createRecord(recordType, recordObj, recordConfigObj, fileId);
        }
 
    }

    libObj.createRecord = (type, recordObj, recordConfigObj, fileId) => {
        log.audit('Create Record:', JSON.stringify({
            type: type,
            recordObj: recordObj,
            recordConfigObj: recordConfigObj,
            fileId: fileId
        }));

        try {
            let recCreateObj = record.create({
                type: type,
                isDynamic: true
            });
    
            libObj.setFields(recCreateObj, recordObj, true);
    
            let newRecordId = recCreateObj.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });

            let sucMsg = 'New ' + type + 'record created: ' + newRecordId + '.';
            let link = recordConfigObj.RECORD_LINK + newRecordId;
            log.debug('Create Record:', link);

            libObj.createLog({
                configid: recordConfigObj.ID,
                doculink: fileId,
                reclink: RECORD_LINK.replace("$URI", link),
                haserror: false,
                response: sucMsg + ' Payload: ' + JSON.stringify(recordObj)
            });
            log.audit('createRecord:', sucMsg);
        } catch (e) { 
            if (e.name === 'UNIQUE_CUST_ID_REQD' || e.name === 'DUP_ENTITY') {
            let subsRecObj = record.load({
                type: search.Type.SUBSIDIARY,
                id: recordObj.subsidiary
            });

            log.error('Create Record UNIQUE_CUST_ID_REQD:', JSON.stringify({
                type: type,
                recordObj: recordObj,
                recordConfigObj: recordConfigObj,
                fileId: fileId,
                subsRecObj :subsRecObj
            }));

            let prefix = subsRecObj.getValue('tranprefix');

            let dupId = '';
            let duplicateRecordSearch = search.create({
                type: type,
                columns: [
                    search.createColumn({
                        name: 'internalid',
                        sort: search.Sort.ASC,
                        label: 'Internal ID'
                    })
                ],
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['companyname', 'is', recordObj.companyname]
                ]
            });

            duplicateRecordSearch.run().each(function(result){
                dupId = result.getValue('internalid');
                return false;
            });
            
            if (!utils.isEmpty(dupId)) {
                let dupRec = record.load({
                    type: type,
                    id: dupId
                });

                let dupRecSubs = dupRec.getValue('subsidiary');
                let dupRecExtId = dupRec.getValue('externalid');


                if (dupRecSubs == recordObj.subsidiary && utils.isEmpty(dupRecExtId)) {
                    record.submitFields({
                        type: type,
                        id: dupId,
                        values: {
                            externalid: recordObj.externalid
                        }
                    });

                    log.audit('Update Record External ID:', JSON.stringify({
                        type: type,
                        recordObj: recordObj,
                        externalid: externalid
                    }));
                } else {
                    let errMsg = 'Error in creating a record. Record Object: ' + JSON.stringify(recordObj) + ' ERROR: Unable to create due to duplicate record.';
                    libObj.createLog({
                        configid: recordConfigObj.ID,
                        doculink: fileId,
                        reclink: '',
                        haserror: true,
                        response: errMsg
                    });
                    
                    log.error('Create Record Error: ', errMsg);
                }
            } else {
                if (!(recordObj.companyname).includes(prefix)) {
                    recordObj.companyname = recordObj.companyname + ' - ' + prefix;
                    libObj.createRecord(type, recordObj, recordConfigObj, fileId);
                } else {
                    let errMsg = 'Error in creating a record. Record Object: ' + JSON.stringify(recordObj) + ' ERROR: Unable to load duplicate record.';
                    libObj.createLog({
                        configid: recordConfigObj.ID,
                        doculink: fileId,
                        reclink: '',
                        haserror: true,
                        response: errMsg
                    });
                    
                    log.error('Create Record Error: ', errMsg);
                }
            }

        } else {
            let errMsg = 'Error in creating a record. Record Object: ' + JSON.stringify(recordObj) + ' ERROR: ' + e;
            libObj.createLog({
                configid: recordConfigObj.ID,
                doculink: fileId,
                reclink: '',
                haserror: true,
                response: errMsg
            });
            
            log.error('Create Record Error: ', errMsg);
        }  

    }
    }

    libObj.updateRecord = (id, type, recordObj, recordConfigObj, fileId) => {
        log.audit('Update Record:', JSON.stringify({
            type: type,
            recordObj: recordObj,
            recordConfigObj: recordConfigObj,
            fileId: fileId
        }));

        try {
            let recUpdateObj = record.load({
                id: id,
                type: type,
                isDynamic: true
            });
    
            libObj.setFields(recUpdateObj, recordObj, false);
    
            let updatedRecordId =  recUpdateObj.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            });

            let sucMsg = 'Successfully updated ' + type + ' record: ' + updatedRecordId + '.';
            let link = recordConfigObj.RECORD_LINK + updatedRecordId;
            log.debug('Update Record:', link);

            libObj.createLog({
                configid: recordConfigObj.ID,
                doculink: fileId,
                reclink: RECORD_LINK.replace("$URI", link),
                haserror: false,
                response: sucMsg + ' Payload: ' + JSON.stringify(recordObj)
            });
            log.audit('updateRecord:', sucMsg);
        } catch (e) {
            let errMsg = 'Error in updating a record. Record Object: ' + JSON.stringify(recordObj) + ' ERROR: ' + e;
            libObj.createLog({
                configid: recordConfigObj.ID,
                doculink: fileId,
                reclink: id,
                haserror: true,
                response: errMsg
            });
            log.error('Update Record Error: ', errMsg);
        }
        
    } 
    libObj.setFields = (createObj, recordObj, isCreate) => {
        for (const key in recordObj) {
            if (Object.hasOwnProperty.call(recordObj, key)) {
                const fieldId = key;
                let value = recordObj[key];
                if (typeof value != 'object') {
                    let isDate = libObj.validateDate(value);

                    log.debug('setFields isDate: ', isDate);

                    if (isDate) {
                        let date = new Date(value);
                        value = format.parse({
                            value: date,
                            type: format.Type.DATE
                        });
                    } 
                    createObj.setValue({
                        fieldId: fieldId,
                        value: value
                    });

                } else {
                    let sublistId = false;
                    let subRecordId = false;
                    let subObjArr = value;

                    if (fieldId.includes('.')) {
                        let tempKey = fieldId.split('.');
                        sublistId = tempKey[0];
                        subRecordId = tempKey[1];
                    } else {
                        sublistId = fieldId
                    }

                    log.debug('setFields sublistId:', JSON.stringify({
                        sublistId: sublistId,
                        fieldId: fieldId
                    }));

                    if (subRecordId) {
                        log.debug('Subrecord:', JSON.stringify({
                            key: key,
                            value: subObjArr
                        }));

                        // Has Subrecord
                        if (key.includes("addressbook")) {
                            //Set Shipping
                            //Set Billing
 
                            // Check if Billing Address is all Null
                            let isBillingNull = true;
                            let billingObj = subObjArr[1];
                            for (const key in billingObj) {
                                if (Object.hasOwnProperty.call(billingObj, key)) {
                                    // const fieldId = key;
                                    const billingObjValue = billingObj[key];

                                    if (!utils.isEmpty(billingObjValue)) {
                                        isBillingNull = false; // This means billing is valid, set default billing
                                    }
                                }
                            }
                            subObjArr.forEach((subObj, idx) => {
                                if (isCreate) {
                                    createObj.selectNewLine({
                                        sublistId: sublistId
                                    });
                                } else {
                                    createObj.selectLine({
                                        sublistId: sublistId,
                                        line: idx
                                    });
                                }

                                let subRecord = createObj.getCurrentSublistSubrecord({
                                    sublistId: sublistId,
                                    fieldId: subRecordId
                                });
                                for (const key in subObj) {
                                    if (Object.hasOwnProperty.call(subObj, key)) {
                                        const fieldId = key;
                                        const value = subObj[key];
    
                                        if (!utils.isEmpty(value)) {
                                            subRecord.setValue({
                                                fieldId: fieldId,
                                                value: value
                                            });
                                        }
                                            
                                    }
                                }

                                if (idx == 0) {
                                    // Set default Shipping
                                    createObj.setCurrentSublistValue({
                                        sublistId: sublistId,
                                        fieldId: 'defaultshipping',
                                        value: true
                                    });
                                } else if ((idx == 0 && subObjArr.length == 1) || isBillingNull) {
                                    // Set default Shipping
                                    createObj.setCurrentSublistValue({
                                        sublistId: sublistId,
                                        fieldId: 'defaultshipping',
                                        value: true
                                    });
                                    // Set default Billing
                                    createObj.setCurrentSublistValue({
                                        sublistId: sublistId,
                                        fieldId: 'defaultbilling',
                                        value: true
                                    });
                                } else {
                                    // Set default Billing
                                    createObj.setCurrentSublistValue({
                                        sublistId: sublistId,
                                        fieldId: 'defaultbilling',
                                        value: true
                                    });
                                }

                                createObj.commitLine({
                                    sublistId: sublistId
                                });
                            });
                        } else {
                            log.debug('Setfield Sublist subObjArr:', JSON.stringify(subObjArr));
                            subObjArr.forEach(subObj => {
                                log.debug('Setfield Sublist list:', JSON.stringify(subObj));
                                // Has Subrecord
                                createObj.selectNewLine({
                                    sublistId: sublistId
                                });
                                let subRecord = createObj.getCurrentSublistSubrecord({
                                    sublistId: sublistId,
                                    fieldId: subRecordId
                                });
                                for (const key in subObj) {
                                    if (Object.hasOwnProperty.call(subObj, key)) {
                                        const fieldId = key;
                                        const value = subObj[key];
    
                                        subRecord.setValue({
                                            fieldId: fieldId,
                                            value: value
                                        });
                                    }
                                }
                                createObj.commitLine({
                                    sublistId: sublistId
                                });
                            });
                        }
                       
                   } else {
                        //Normal Sublist
                        log.debug('Sublist:', JSON.stringify({
                            key: key,
                            value: subObjArr
                        }));

                        // Add remove sublist
                        libObj.removeSublist(createObj, sublistId);

                        createObj.selectNewLine({
                            sublistId: sublistId
                        });

                        for (const key in subObjArr) {
                            if (Object.hasOwnProperty.call(subObjArr, key)) {
                                // const fieldId = key;
                                const subObjValue = subObjArr[key];
                                //JC: 03282024 - to loop through each field on the line field list
                                for (const objectKey in subObjValue) {
                                    if (subObjValue.hasOwnProperty(objectKey)) {
                                        const value = subObjValue[objectKey];
                                       // log.debug("Setting line -" + key + "field-"+objectKey, value ); 
                                        createObj.setCurrentSublistValue({
                                            sublistId: sublistId,
                                            fieldId: objectKey,
                                            value: value
                                        });
                                    }
                                }
                               //log.debug("Setting line -" + key, subObjValue ); 
                            }
                            createObj.commitLine({sublistId: sublistId});
                        }

                    }
                }
            }
        }
    }


    libObj.removeSublist = (recObj, sublist) => {
        let numLines = recObj.getLineCount({
            sublistId: sublist
        });
        for(let z = 0; z < numLines; z++) {
            recObj.removeLine({
                sublistId: sublist,
                line: 0
            });
        }
    }

    libObj.getLookUpValue = (recType, lookUpField, lookupOperator, lookUpGetValue, fieldValue) => {
        
        log.debug('getLookUpValue:', JSON.stringify({
            recType: recType,
            lookUpField: lookUpField,
            lookupOperator: lookupOperator,
            lookUpGetValue: lookUpGetValue,
            fieldValue: fieldValue
        }));

        let value = '';
        // Run search for look up field internal ID
        let lookUpSearchObj = search.create({
            type: recType,
            columns: [{ name : lookUpGetValue }, { name : lookUpField }],
            filters: [[lookUpField, lookupOperator, fieldValue]]
        });
    
        // log.debug('isLookUp count:', lookUpSearchObj.runPaged().count);
        lookUpSearchObj.run().each(function(result) {
            value = result.getValue({
                name: lookUpGetValue
            });
            // log.debug('isLookUp found:', JSON.stringify(internalId));
            return false;
        });

        return value;
    }

    libObj.getSublistLookUpValue = (lookupResultArr, lookupIdsArr, recType, lookUpField, lookupOperator, lookUpGetValue) => {

        log.debug('getSublistLookUpValue:', JSON.stringify({
            lookupResultArr: lookupResultArr,
            lookupIdsArr: lookupIdsArr,
            recType: recType,
            lookupOperator: lookupOperator,
            lookUpGetValue: lookUpGetValue
        }));

        // let value = '';
        let searchIds = lookupIdsArr.filter((y, i, a) => a.indexOf(y) == i); // Get unique values
        let filtersExpArr = [];
        searchIds.forEach((element, idx) => {
            filtersExpArr.push([lookUpField, lookupOperator, element]);
            if (idx < (searchIds.length-1)) {
                filtersExpArr.push('or')
            }
        });

        log.debug('filtersExpArr:', JSON.stringify(filtersExpArr));

        // Run search for look up field internal ID
        let lookUpSearchObj = search.create({
            type: recType,
            columns: [{ name : lookUpGetValue }, { name : lookUpField }],
            filters: [filtersExpArr]
        });
    
        log.debug('isLookUp count:', lookUpSearchObj.runPaged().count);
        lookUpSearchObj.run().each(function(result) {
            let value = result.getValue({
                name: lookUpGetValue
            });

            let lookUpfield = result.getValue({
                name: lookUpField
            });

            lookupResultArr.forEach((element, idx) => {
                // log.debug('forEach:', JSON.stringify({
                //     element: element,
                //     key: value,
                //     lookUpfield: lookUpfield
                // }));
        
                if (element.orig == lookUpfield) {
                    element.key = value;
                }
            });
            return true;
        });

        log.debug('getSublistLookUpValue:', JSON.stringify({
            lookupResultArr: lookupResultArr
        }));

        return lookupResultArr;
    }

    libObj.createLog = (obj) => {

        // libObj.createLog({
        //     configid: configId,
        //     doculink: '',
        //     tranlink: '',
        //     haserror: false,
        //     response: 'Files Downloaded!' + downloaded.join(",")
        // });
        let integLogRec = record.create({
            type: INTEG_LOG.ID,
            isDynamic: true
        });

        integLogRec.setValue({
            fieldId: INTEG_LOG.FIELDS.RECORD_CONFIG,
            value: obj.configid
        });

        integLogRec.setValue({
            fieldId: INTEG_LOG.FIELDS.RECORD_LINK,
            value: obj.reclink
        });

        integLogRec.setValue({
            fieldId: INTEG_LOG.FIELDS.DOCUMENT_LINK,
            value: obj.doculink
        });

        integLogRec.setValue({
            fieldId: INTEG_LOG.FIELDS.RESPONSE,
            value: obj.response
        });

        integLogRec.setValue({
            fieldId: INTEG_LOG.FIELDS.HAS_ERROR,
            value: obj.haserror
        });

        try {
            let newIntegLogRec = integLogRec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
    
            log.audit('New Log Created: ', newIntegLogRec);
        } catch (e) {
            log.error('Error in creating new log.');
        }
        
    }

    libObj.validateDate = (testdate) => {
        //let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
        let date_regex = /^(0[1-9]|1[0-2]|[1-9])\/(0[1-9]|1\d|2\d|3[01]|[1-9])\/(19|20)\d{2}$/; //considers M/D/YYYY values
        return date_regex.test(testdate);
    }
    libObj.globalObj = () => {
        return {
            CONN_CONFIG: INTEG_CONN_CONFIG,
            CONN_HEADER: INTEG_HEADER_BODY,
            RECORD_CONFIG: INTEG_RECORD_CONFIG,
            MAPPING: INTEG_MAPPING,
            LOG: INTEG_LOG,
            STATUS: INTEG_STATUS
        }
    }
    
    libObj.getCompanyTimezone = () => {
        let companyInfo = config.load({
            type: config.Type.COMPANY_INFORMATION
        });

        return companyInfo.getValue({ fieldId : 'timezone' });
    }

    return libObj;
});