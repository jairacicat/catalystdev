/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
 define(['N/log', 'N/runtime', 'N/search', 'N/record'], function(log, runtime, search, record) {
    const SPARAM_TRANSACTION_SS = "custscript_commission_ss";

    const GLOBAL_VARIABLES = {
        CTD : {
            ID: "customrecord_ctc_comm_track",
            FIELDS: {
                TRANSACTION : "custrecord_ctc_comm_track_tranid",
                DATE_ACCRUED : "custrecord_ctc_comm_track_date_accrued",
                DATE_EARNED : "custrecord_ctc_comm_track_date_earned",
                EMPLOYEE : "custrecord_ctc_comm_track_employee",
                ITEM : "custrecord_ctc_comm_track_item",
                CUSTOMER : "custrecord_ctc_comm_track_customer",
                DEPARTMENT : "custrecord_ctc_comm_track_department",
                REGION : "custrecord_ctc_comm_track_region",
                STATUS : "custrecord_ctc_comm_track_status",
                NET_REVENUE : "custrecord_ctc_comm_track_revenue",
                COMM_PERCENT : "custrecord_ctc_comm_track_commpercent",
                COMM_AMOUNT : "custrecord_ctc_comm_track_earned",
                LINE : "custrecord_ctc_comm_track_line"
            }
        }
    }

    function getInputData() {
        
        log.audit('getInputData');
        let scriptObj = runtime.getCurrentScript();
        let internalIds = scriptObj.getParameter({
            name: 'custscript_ctc_internal_id'
        });
        log.audit('internalId', internalIds);

        let SS_ID = scriptObj.getParameter({name: SPARAM_TRANSACTION_SS});
        if(SS_ID){
            let searchObj = search.load({ id: SS_ID });
            let tranIdFilter = search.createFilter({
                name: 'internalid',
                operator: 'anyof',
                values: JSON.parse(internalIds)
            });

            searchObj.filters.push(tranIdFilter);

            log.debug("Search Obj", searchObj);
            return searchObj;
        }

        //return internalIds;
    }

    function map(context) {
        let mapValues = JSON.parse(context.value).values;
        log.debug("Map Values", mapValues);

        let lineValues = {};

        lineValues.employee = mapValues.salesteammember.value;
        lineValues.amount = mapValues.amount;
        lineValues.line = mapValues.lineuniquekey;
        lineValues.item = mapValues.item.value;
        lineValues.customer = mapValues.entity.value;
        lineValues.department = mapValues.custbody_sps_department;
        lineValues.tranid = mapValues.internalid.value;
        lineValues.status = mapValues.statusref.value;
        lineValues.type = mapValues.type.value;
        lineValues.trandate = mapValues.trandate;
        lineValues.closeddate = mapValues.closedate;
        lineValues.soTrandate = mapValues['trandate.createdFrom'];

        shipCountry = mapValues.shipcountry.value;
        lineValues.region = getState(mapValues.shipstate, shipCountry);

        log.debug("Line Values", lineValues);
        // Get Commission Plan;
        let commissionPlan = getMostMatchingCommissionPlan(lineValues);
        log.debug("Commission Plan", commissionPlan);

        if(commissionPlan == null){
            //No CTD to create
        }else{

            //Calculate Commissionable Amount:
            lineValues.commissionAmount = ((parseFloat(lineValues.amount) * parseFloat(commissionPlan.commissionPercent))/100).toFixed(2);
            log.debug("Net Revenue", lineValues.commissionAmount);

            if(lineValues.type == "CustCred") lineValues.commissionAmount = -1 * lineValues.commissionAmount;

            //Check if CTD is already existing:
            let ctdId = getCTDId(lineValues);
            log.debug("ctdId", ctdId);

            let ctdStatus = 1;
            if((lineValues.type == 'CustInvc' && lineValues.status == 'paidInFull') || lineValues.type == 'CustCred' && lineValues.status != "open"){
                ctdStatus = 2;
            }
           
            context.write({
                key: [ctdId, lineValues.status, lineValues.tranid, lineValues.item, lineValues.line, lineValues.employee].join("-"),
                value: {
                    TRANSACTION : lineValues.tranid,
                    EMPLOYEE : lineValues.employee,
                    ITEM : lineValues.item,
                    CUSTOMER : lineValues.customer,
                    DEPARTMENT : lineValues.department,
                    REGION : lineValues.region,
                    STATUS : ctdStatus,
                    NET_REVENUE : lineValues.amount,
                    COMM_PERCENT : parseFloat(commissionPlan.commissionPercent),
                    COMM_AMOUNT : lineValues.commissionAmount,
                    LINE : lineValues.line,
                    DATE_ACCRUED: lineValues.trandate,
                    DATE_EARNED: lineValues.closeddate
                }
            });

        }
    }

    function reduce(context) {
        let reduceKey = context.key;
        let reduceValues = JSON.parse(context.values[0]);

        log.debug("Reduce Key", reduceKey);
        log.debug("Reduce Values", reduceValues);

        let reduceKeySplit = reduceKey.split("-");
        let ctdId = reduceKeySplit[0];

        let ctdObj = {};

        try{
            if(ctdId){
                ctdObj = record.load({
                    type: GLOBAL_VARIABLES.CTD.ID,
                    id: ctdId
                });
            }else{
                ctdObj = record.create({
                    type: GLOBAL_VARIABLES.CTD.ID
                });
            }
    
            for(var key in reduceValues){
                if(reduceValues[key] && reduceValues[key] != ""){
                    if(key.indexOf("DATE") > -1){
                        ctdObj.setValue({
                            fieldId: GLOBAL_VARIABLES.CTD.FIELDS[key],
                            value: new Date(reduceValues[key])
                        });
                    }
                    else{
                        ctdObj.setValue({
                            fieldId: GLOBAL_VARIABLES.CTD.FIELDS[key],
                            value: reduceValues[key]
                        });
                    }
                }
            }
    
            let savedCtdId = ctdObj.save({ignoreMandatoryFields: true});
    
            log.debug("Saved CTD", savedCtdId);
        }
        catch(err){
            log.error("Error in creating CTD", err);
        }
     
    }

    function summarize(summary) {
        
    }

    function getState(shortname, country){
        log.debug("Get State: Shortname", shortname);
        log.debug("Get State: Country", country)
        let stateId = "";
        if(shortname && country){
            var stateSearchObj = search.create({
                type: "state",
                filters:
                [
                   ["shortname","is", shortname], 
                   "AND",
                   ["country", "anyof", country]
                ],
                columns:
                [
                   "id"
                ]
             });
          
            
             stateSearchObj.run().each(function(result){
               stateId = result.id;
               return false;
             });
             
        }
        
        return stateId;
    }
    
    /**
     * Function to search for a matching CTD record ID based on provided criteria.
     *
     * @param {Object} criteria - JSON object containing the search criteria.
     * @param {string} [criteria.employee] - Employee name or ID.
     * @param {string} [criteria.customer] - Customer name or ID.
     * @param {string} [criteria.department] - Department name or ID.
     * @param {string} [criteria.region] - Region name or ID.
     * @param {string} [criteria.line] - Line number or identifier.
     * @param {string} [criteria.amount] - Amount value.
     * @param {string} [criteria.tranid] - Transaction ID.
     * @returns {number|null} - The ID of the matching CTD record or null if no match is found.
     */
    function getCTDId(criteria) {
        try{

            // Define filters array based on criteria with values
            const filters = [];

            if (criteria.employee) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_employee',
                    operator: search.Operator.ANYOF,
                    values: criteria.employee
                }));
            }
            if (criteria.customer) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_customer',
                    operator: search.Operator.ANYOF,
                    values: criteria.customer
                }));
            }
            if (criteria.department) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_department',
                    operator: search.Operator.IS,
                    values: criteria.department
                }));
            }
            if (criteria.region) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_region',
                    operator: search.Operator.ANYOF,
                    values: criteria.region
                }));
            }
            if (criteria.item) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_item',
                    operator: search.Operator.ANYOF,
                    values: criteria.item
                }));
            }
            if (criteria.line) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_line',
                    operator: search.Operator.IS,
                    values: criteria.line
                }));
            }
            if (criteria.tranid) {
                filters.push(search.createFilter({
                    name: 'custrecord_ctc_comm_track_tranid',
                    operator: search.Operator.ANYOF,
                    values: criteria.tranid
                }));
            }

            // Perform the search on the custom record
            const ctdSearch = search.create({
                type: 'customrecord_ctc_comm_track',
                filters: filters,
                columns: ['internalid']
            });

            log.debug("ctdSearch - filters", filters);

            // Run the search and get the first matching record
            const result = ctdSearch.run().getRange({ start: 0, end: 1 });

            log.debug("Get CTD ID - result", result);
            // Return the internal ID of the first result or null if no match found
            return result.length > 0 ? parseInt(result[0].getValue('internalid'), 10) : null;
        }
        catch(err){
            log.error("Get CTD ID - Error", err);
        }

    }

    /**
     * Function to find the most-matching commission plan based on parameters in a JSON object.
     *
     * @param {Object} criteria - JSON object containing the search criteria.
     * @param {string} criteria.employee - Employee name or ID (mandatory).
     * @param {string} [criteria.customer] - Customer name or ID.
     * @param {string} [criteria.department] - Department name or ID.
     * @param {string} [criteria.region] - Region name or ID.
     * @param {string} [criteria.item] - Item name or ID.
     * @returns {Object|null} - The best matching commission plan or null if no match found.
     */
    function getMostMatchingCommissionPlan(criteria) {
        
        // Load the saved search
        const commissionSearch = search.load({
            id: 'customsearch_ctc_commission_plan_ss' // Replace with the actual saved search ID
        });
        
        // Add the mandatory filter for employee
        const filters = [
            search.createFilter({
                name: 'custrecord_ctc_comm_plan_employee',
                operator: search.Operator.ANYOF,
                values: [criteria.employee]
            })
        ];

        if(criteria.soTrandate != ""){
            filters.push(
                search.createFilter({
                    name: 'custrecord_ctc_comm_plan_enddate',
                    operator: "onorafter",
                    values: criteria.soTrandate
                })
            );
            filters.push(
                search.createFilter({
                    name: 'custrecord_ctc_comm_plan_startdate',
                    operator: "onorbefore",
                    values: criteria.soTrandate
                })
            );
        }

        // Apply the filter for employee to the search
        commissionSearch.filters = commissionSearch.filters.concat(filters);

        log.debug("commissino plan filters", commissionSearch.filters);
        let bestMatch = null;
        let highestScore = 0;

        // Run the search and process each result
        commissionSearch.run().each(result => {
            let score = 0;

            // Calculate score based on the number of matching optional fields
            if (criteria.customer && criteria.customer === result.getValue('custrecord_ctc_comm_plan_customer')) score++;
            if (criteria.department && criteria.department === result.getValue('custrecord_ctc_comm_plan_department')) score++;
            if (criteria.region && criteria.region === result.getValue('custrecord_ctc_comm_plan_region')) score++;
            if (criteria.item && criteria.item === result.getValue('custrecord_ctc_comm_plan_item')) score++;

            // Check if this result has a higher score than the current best match
            if (score > highestScore) {
                highestScore = score;
                bestMatch = {
                    id: result.id,
                    employee: result.getValue('custrecord_ctc_comm_plan_employee'),
                    customer: result.getValue('custrecord_ctc_comm_plan_customer'),
                    department: result.getValue('custrecord_ctc_comm_plan_department'),
                    region: result.getValue('custrecord_ctc_comm_plan_region'),
                    item: result.getValue('custrecord_ctc_comm_plan_item'),
                    commissionPercent: result.getValue('custrecord_ctc_comm_plan_percent')
                };
            }

            return true; // Continue to the next result
        });

        return bestMatch;
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize 
    }
});
