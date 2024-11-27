/**
* @NApiVersion 2.1
* @NScriptType ClientScript
*/
define(
    ['N/record', 'N/error', 'N/currentRecord', 'N/ui/message', 'N/runtime'],
    function (record, error, currentRecord, message, runtime) {
        //Global original Status value
        let oldStatus;
        function pageInit(scriptContext) {
            let opportunity = scriptContext.currentRecord;
            try {

                //If record is in EDIT and Deal Type is Residual (Non-Subscription Only)
                if (opportunity.id) {
                    const dealType = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                    if (dealType == 15) {
                        oldStatus = opportunity.getValue({ fieldId: 'custpage_entityStatus' });
                    }
                }
              
            } catch (e) {
                log.debug('Error', e)
            }
        }

        function fieldChanged(scriptContext) {
            let opportunity = scriptContext.currentRecord;
            const field = scriptContext.fieldId;
            try {
                //If record in CREATE, If field is Deal Type and value is Residual (Non-Subscription Only)
                if (field == 'custbody_mhi_opportunity_type' && !opportunity.id) {
                    const dealType = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                    if (dealType == 15) {
                        //Set status to Solution Research
                        opportunity.setValue({ fieldId: 'custpage_entityStatus', value: 43 });
                        opportunity.getField({ fieldId: 'custpage_entityStatus' }).isDisabled = true;
                    } else {
                        opportunity.getField({ fieldId: 'custpage_entityStatus' }).isDisabled = false;
                    }
                }
              
            } catch (e) {
                log.debug('Error', e)
            }
        }

        function saveRecord(scriptContext) {
            let opportunity = scriptContext.currentRecord;
            try {
                //If record is in EDIT and Deal Type is Residual (Non-Subscription Only)
                if (opportunity.id) {
                    const dealType = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                    if (dealType == 15) {
                        const newStatus = opportunity.getValue({ fieldId: 'custpage_entitystatus' });
                        //If the old Status loaded is not Solution Research (changed prior), and the new Status is set to Solution Research, throw notice/warning
                        if (oldStatus != 43 && newStatus == 43) {
                            //Display warning message
                            message.create({
                                title: 'Notice',
                                message: 'Solution Research cannot be selected as the Opportunity Status. Please select a different option.',
                                type: message.Type.WARNING // Can be 'CONFIRMATION', 'INFORMATION', 'WARNING', or 'ERROR'
                            }).show();
                            return false;
                        }
                    }
                } else if (!opportunity.id) {//On create throw error if Entity status is empty
                  const entityStatusNative = opportunity.getValue({ fieldId: 'entitystatus' });
                  if (!entityStatusNative) {
                    log.debug('new opp status error thrown')
                    //Display warning message
                            message.create({
                                title: 'Notice',
                                message: 'Status is mandatory. Please select a value for Status.',
                                type: message.Type.WARNING // Can be 'CONFIRMATION', 'INFORMATION', 'WARNING', or 'ERROR'
                            }).show();
                            return false;
                  }
                }
                return true;
            } catch (e) {
                log.debug('Error', e)
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };
    });