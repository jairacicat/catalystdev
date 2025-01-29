/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

 define(['N/runtime', 'N/record', 'N/task', 'N/https', './utils/ctc_CommonUtils.js', './lib/lib_ctc_integ.js'], (runtime, record, task, https, utils, lib) => {
    
    var objEvents = {};

    // Global Variables
    const SCRIPT_FILE_NAME = 'ctc - Integ Endpoint Conn SC.js';
    const SPARAM_RECORD_CONFIG = 'custscript_ctc_integ_rec_config';
    const CONN_CONFIG = lib.globalObj().CONN_CONFIG;
    const RECORD_CONFIG = lib.globalObj().RECORD_CONFIG;

    objEvents.execute = (scriptContext) => {
        log.audit(SCRIPT_FILE_NAME, '<--- START INTEGRATION --->');
        try {
            let recordConfigId = utils.getScriptParamValue(SPARAM_RECORD_CONFIG);
            let recordConfigObj = utils.getRecordObj(recordConfigId, RECORD_CONFIG.ID, RECORD_CONFIG.FIELDS, true);
            log.debug(SCRIPT_FILE_NAME, 'recordConfigObj' + JSON.stringify(recordConfigObj));

            let configId = recordConfigObj.CONN_CONFIG;
            let initConfigObj = utils.getRecordObj(configId, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
            
            initConfigObj = lib.getConnectionHeaders(initConfigObj);
            log.debug(SCRIPT_FILE_NAME, 'recordConfigObj' + JSON.stringify(initConfigObj));
          
            let configObj = {};

            if (utils.isEmpty(recordConfigObj)) {
                log.error(SCRIPT_FILE_NAME, 'Invalid configuration setting, review selected ctc - Integration Outbound Config.');
                log.audit(SCRIPT_FILE_NAME, '<--- END --->');
                return;
            }

            //Check if Schedule Day is set on Record Configuration
            let runScript = false;
            if(recordConfigObj.RUN_ON_SCHEDULE_DAY && !utils.isEmpty(recordConfigObj.BUSINESS_DAY)){
                runScript = checkSchedule(recordConfigObj.BUSINESS_DAY);
                log.debug("Run Script check", "Check if today is " + recordConfigObj.BUSINESS_DAY + " business day of the month: " + runScript);
            }else{
                log.debug("Run Script check", "Script will follow deployment schedule.");
                runScript = true;
            }
            log.debug("Run Script", runScript);

            let isValidSecret = initConfigObj.TOKEN != "" ? true : false;
         
            configObj = utils.getRecordObj(configId, CONN_CONFIG.ID, CONN_CONFIG.FIELDS, true);
            log.debug(SCRIPT_FILE_NAME, 'isValidSecret: ' + isValidSecret);
            
            if (isValidSecret) {
                log.debug(SCRIPT_FILE_NAME, 'configObj: ' + JSON.stringify(configObj));
                
                if (recordConfigObj.DIRECTION == "Inbound") { // INBOUND 
                    let postData = lib.fetchData(recordConfigObj, configObj);
                    log.debug(SCRIPT_FILE_NAME, JSON.stringify(postData));
                    
                } else {
                    lib.pushData(recordConfigObj);
                }
            } else {
                let errMsg = 'Invalid Credentials!';
                /*
                lib.createLog({
                    configid: recordConfigObj.ID,
                    doculink: '',
                    reclink: '',
                    haserror: true,
                    response: errMsg
                });
                */
                log.error('Request: ', errMsg);
            }
        } catch(e) {
            let errMsg = 'Integration Error at the beginning! Error: ' + e;
            /*
            lib.createLog({
                configid: '',
                doculink: '',
                reclink: '',
                haserror: true,
                response: errMsg
            });
            */
            log.error('Integration Start: ', errMsg);
        }
        log.audit(SCRIPT_FILE_NAME, '<--- END --->');
    }

    checkSchedule = (n) => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let businessDayCount = 0;

        // Iterate through the days starting from the first of the month
        for (let day = firstDayOfMonth; day <= today; day.setDate(day.getDate() + 1)) {
            const dayOfWeek = day.getDay();
            // Monday to Friday are considered business days
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 is Sunday, 6 is Saturday
                businessDayCount++;
            }
            // If today is the nth business day, return true
            if (businessDayCount === n) {
                if (day.getDate() === today.getDate()) {
                    return true;
                } else {
                    break; // No point in continuing if we've passed the nth business day
                }
            }
    }

    // If not returned by now, today is not the nth business day
    return false;
    }

    return objEvents;
});
