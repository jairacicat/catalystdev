/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/search', 'N/currentRecord', 'N/query'], function(search, currentRecord, query) {

    const FLD_QUOTA = 'custbody_nsacat_quota';
    function pageInit(context) {
        let CURRENT_REC = currentRecord.get();
        let quota = CURRENT_REC.getValue({fieldId: FLD_QUOTA});

        //Get employee from Sales Team
        let salesRep = CURRENT_REC.getValue({fieldId: 'salesrep'});
        let region = CURRENT_REC.getValue({fieldId: 'class'});

        if(salesRep){
            let result = getActiveQuotaRecords(salesRep, region);
            console.log("Quota Records:", result);

            if(result){
                CURRENT_REC.setValue({
                    fieldId: FLD_QUOTA,
                    value: result.total,
                    ignoreFieldChange: true
                });
            }
            else{
                CURRENT_REC.setValue({
                    fieldId: FLD_QUOTA,
                    value: '',
                    ignoreFieldChange: true
                });
            }
        }
        else{
            CURRENT_REC.setValue({
                fieldId: FLD_QUOTA,
                value: '',
                ignoreFieldChange: true
            });
        }
    }

    function fieldChanged(context) {
        if(context.fieldId == 'class'){
            updateQuota();
        }
    }

    function sublistChanged(context){
        if(context.sublistId == 'salesteam'){
            updateQuota();
        }
    }


    function updateQuota(){
        let CURRENT_REC = currentRecord.get();
        let salesRep = getSalesRep(CURRENT_REC);
        let region = CURRENT_REC.getValue({fieldId: 'class'});

        if(salesRep){
            let result = getActiveQuotaRecords(salesRep, region);
            console.log("Quota Records:", result);

            if(result){
                CURRENT_REC.setValue({
                    fieldId: FLD_QUOTA,
                    value: result.total,
                    ignoreFieldChange: true
                });
            }
            else{
                CURRENT_REC.setValue({
                    fieldId: FLD_QUOTA,
                    value: '',
                    ignoreFieldChange: true
                });
            }
        }
        else{
            CURRENT_REC.setValue({
                fieldId: FLD_QUOTA,
                value: '',
                ignoreFieldChange: true
            });
        }
    }

    function getSalesRep(rec){
        let lineCount = rec.getLineCount({ sublistId: 'salesteam' });

        for (let i = 0; i < lineCount; i++) {
            let isPrimary = rec.getSublistValue({
                sublistId: 'salesteam',
                fieldId: 'isprimary',
                line: i
            });

            if (isPrimary) {
                let salesRepId = rec.getSublistValue({
                    sublistId: 'salesteam',
                    fieldId: 'employee',
                    line: i
                });

                console.log("Primary Sales Rep ID:", salesRepId);
                return salesRepId;
            }
        }

        return null;
    }

    function getActiveQuotaRecords(employeeId, regionId) {
        try {
            let currentYear = new Date().getFullYear();
            
            let baseQuery = "SELECT id, entity, total, aclass FROM quota WHERE year= ?" ;
            baseQuery += " AND entity = ?";
            baseQuery += " AND (aclass = ? OR aclass IS NULL)";
            baseQuery += " ORDER BY CASE WHEN aclass = ? THEN 1 ELSE 2 END, year DESC";
           
    
            let params = [currentYear, employeeId, regionId, regionId];
            let quotaQuery = query.runSuiteQL({ query: baseQuery, params: params });
            let results = quotaQuery.asMappedResults();
    
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error("Error fetching quota records:", error);
            return null;
        }
    }
    

    return {
        fieldChanged: fieldChanged,
        sublistChanged: sublistChanged,
       // pageInit: pageInit
    }
});
