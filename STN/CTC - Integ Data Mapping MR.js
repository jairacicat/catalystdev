/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */


 define(['N/search', 'N/file', './utils/ctc_CommonUtils.js', './lib/lib_ctc_integ.js'], function(search, file, utils, lib) {

    // Global variables
    const SCRIPT_FILE_NAME = 'ctc - Integ Data Mapping MR.js';
    const SPARAM_FILE_ID = 'custscript_ctc_integ_map_fileid';
    const SPARAM_RECORD_CONFIG = 'custscript_ctc_integ_map_config';

    const CONN_CONFIG = lib.globalObj().CONN_CONFIG;
    const RECORD_CONFIG = lib.globalObj().RECORD_CONFIG;
    const MAPPING = lib.globalObj().MAPPING;

    let objEvents = {};
    objEvents.config = {
        retryCount: 3,
        exitOnError: false
    }

    objEvents.getInputData = () => {
        log.audit(SCRIPT_FILE_NAME, 'getInputData');
        try {
            let fileId = utils.getScriptParamValue(SPARAM_FILE_ID);
            let recordConfigId = utils.getScriptParamValue(SPARAM_RECORD_CONFIG);
            let recordConfigObj = utils.getRecordObj(recordConfigId, RECORD_CONFIG.ID, RECORD_CONFIG.FIELDS, true);

            log.debug("fileId", fileId);
            let fileObj = file.load(fileId);
            let folderId = fileObj.folder;

            if (folderId == recordConfigObj.FOLDER_INBOUND && fileObj.size < 10485760) {
                let fileContents = fileObj.getContents();
                let json = JSON.parse(fileContents);
                
                if (Array.isArray(json)) {
                    return json;
                } else {
                    let errMsg = 'Payload Data Read Error. File contains invalid format.';
                    lib.createLog({
                        configid: recordConfigObj.ID,
                        doculink: fileId,
                        reclink: '',
                        haserror: true,
                        response: errMsg
                    });
                    log.error('MR getInputData: ', errMsg);
                }
            } else {
                let errMsg = 'Payload Data Read Error. Misconfigured inbound folder or file exceeds 10mb limit.';
                lib.createLog({
                    configid: recordConfigObj.ID,
                    doculink: fileId,
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                log.error('MR getInputData: ', errMsg);
            }
            
            
        } catch (e) {
            log.error(SCRIPT_FILE_NAME, 'Error in getInputData: ' + e);
        }
    }
 
    objEvents.map = (context) => {
        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: START map > ' + utils.getUsage());
        let result = JSON.parse(context.value);
        log.debug(SCRIPT_FILE_NAME, 'Result: ' + JSON.stringify(result));
        let recordConfigId = utils.getScriptParamValue(SPARAM_RECORD_CONFIG);
        let key = lib.getPrimaryKeyField(recordConfigId);
        let fileId = utils.getScriptParamValue(SPARAM_FILE_ID);

        lib.mapFields(result, recordConfigId, fileId);

        log.debug(SCRIPT_FILE_NAME, 'key: ' + JSON.stringify({
            pk: key,
            key: result[key]
        }));

        context.write({
            key: result[key],
            value: result
        }); 

        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: END map > ' + utils.getUsage());
    }

    objEvents.reduce = (context) => {
        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: START reduce > ' + utils.getUsage());

        context.write({
            key: context.key, 
            value: context.values[0]  
        }); 
        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: END reduce > ' + utils.getUsage());
    }

    objEvents.summarize = (summary) => {
        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: START summary > ' + utils.getUsage());
        log.debug('Summarize Stage', summary.mapSummary);
        let mapKeys = [];
        summary.mapSummary.keys.iterator().each(function (key, executionCount, completionState) {
            mapKeys.push(key);
            return true;
        });
        
        log.audit('MAP keys processed', mapKeys);

        summary.mapSummary.errors.iterator().each(function (key, error) {
            log.error('Map Error for key: ' + key, error);
            return true;
        });

        summary.output.iterator().each(function (key, value) {
            log.audit({
                title: key + ' records updated', 
                details: value
            });
            return true;
        });
        log.audit(SCRIPT_FILE_NAME, 'Remaining Usage: END summary > ' + utils.getUsage());
    }

    return objEvents;
});
