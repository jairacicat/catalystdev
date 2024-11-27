/**
* @NApiVersion 2.1
* @NScriptType ClientScript
*/
define(
    ['N/record', 'N/error', 'N/currentRecord', 'N/ui/message', 'N/runtime'],
    function (record, error, currentRecord, message, runtime) {
        //Restore/refresh of default select options
        const restoreSelectOptions = (status, options) => {
            //Remove existing options
            options.forEach(value => {
                status.removeSelectOption({
                    value: value.value
                });
            });
            //Add default options
            status.insertSelectOption({ value: 'empty', text: '' });
            status.insertSelectOption({ value: '16', text: 'Closed-Lost' });
            status.insertSelectOption({ value: '34', text: 'Closed-Out' });
            status.insertSelectOption({ value: '43', text: 'Solution Research' });
            status.insertSelectOption({ value: '35', text: 'Needs Discovery' });
            status.insertSelectOption({ value: '36', text: 'Onboarding' });
            status.insertSelectOption({ value: '40', text: 'Solution Development (New Sales)' });
            status.insertSelectOption({ value: '44', text: 'Student Success' });
            status.insertSelectOption({ value: '37', text: 'Proposal Delivery & Review-NewSale' });
            status.insertSelectOption({ value: '42', text: 'Solution Development (Residual)' });
            status.insertSelectOption({ value: '38', text: 'Proposal Delivery & Review-Renewal' });
            status.insertSelectOption({ value: '39', text: 'Proposal Delivery & Review-Residual' });
            status.insertSelectOption({ value: '47', text: 'Solution Development (Renewal)' });
            status.insertSelectOption({ value: '12', text: 'Verbal Commitment' });
            status.insertSelectOption({ value: '45', text: 'Closed-PO' });
        }

        function fieldChanged(scriptContext) {
            let opportunity = scriptContext.currentRecord;
            const field = scriptContext.fieldId;

            try {

              let dealType;
                //If the Status field is changed, get Status field value and Win/Loss field
                if (field == 'custbody_mhi_opportunity_type') {
                    dealType = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                    const status = opportunity.getField({ fieldId: 'custpage_entitystatus' });
                    opportunity.setValue({ fieldId: 'custpage_entitystatus', value: 'empty' });
                    opportunity.setValue({ fieldId: 'entitystatus', value: '' });
                    //Restore select Options if needed
                    const options = status.getSelectOptions();
                    const optionsLength = options.length;
                    if (optionsLength != 15) {
                        restoreSelectOptions(status, options)
                    }
                    //Remove specific select options in custom Status field based on Status value
                    let removeOptions = [];
                    if (dealType == 13/*New Sales (Including Expansion)*/) {
                        removeOptions = ['43', '36', '44', '42', '38', '39', '47'];
                        removeOptions.forEach(value => {
                            status.removeSelectOption({
                                value: value
                            });
                        });
                    } else if (dealType == 14/*Renewal (Subscription Only)*/) {
                        removeOptions = ['43', '35', '40', '37', '42', '39'];
                        removeOptions.forEach(value => {
                            status.removeSelectOption({
                                value: value
                            });
                        });
                    } else if (dealType == 15/*Residual (Non-Subscription Only)*/) {
                        removeOptions = ['35', '36', '40', '44', '37', '38', '47'];
                        removeOptions.forEach(value => {
                            status.removeSelectOption({
                                value: value
                            });
                        });
                    }
                }
                dealType = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                if (field == 'custpage_entitystatus' && dealType == 13) {
                    //Set NS native Status field
                    const entityStatus = opportunity.getValue({ fieldId: 'custpage_entitystatus' });
                    opportunity.setValue({ fieldId: 'entitystatus', value: entityStatus });
                 
                    //Set Probabiloity field based on new Entity Status value
                    if (entityStatus == 35/*Needs Discovery*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 20 });
                    } else if (entityStatus == 16/*Closed-Lost*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    } else if (entityStatus == 40/*Solution Development (New Sales)*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 40 });
                    } else if (entityStatus == 37/*Proposal Delivery & Review-NewSale*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 65 });
                    } else if (entityStatus == 12/*Verbal Commitment*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 95 });
                    } else if (entityStatus == 45/*Closed-PO*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 100 });
                    } else if (entityStatus == 34/*Closed-Out*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    }
                } else if (field == 'custpage_entitystatus' && dealType == 14) {
                    //Set NS native Status field
                    const entityStatus = opportunity.getValue({ fieldId: 'custpage_entitystatus' });
                  
                    opportunity.setValue({ fieldId: 'entitystatus', value: entityStatus });
                    //Set Probabiloity field based on new Entity Status value
                    if (entityStatus == 36/*Onboarding*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 40 });
                    } else if (entityStatus == 44/*Student Success*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 50 });
                    } else if (entityStatus == 47/*Solution Development (Renewal)*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 65 });
                    } else if (entityStatus == 38/*Proposal Delivery & Review-Renewa)*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 80 });
                    } else if (entityStatus == 12/*Verbal Commitment*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 95 });
                    } else if (entityStatus == 45/*Closed-PO*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 100 });
                    } else if (entityStatus == 34/*Closed-Out*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    } else if (entityStatus == 16/*Closed-Lost*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    }
                } else if (field == 'custpage_entitystatus' && dealType == 15) {
                    //Set NS native Status field
                    const entityStatus = opportunity.getValue({ fieldId: 'custpage_entitystatus' });
                    opportunity.setValue({ fieldId: 'entitystatus', value: entityStatus });
                    //Set Probabiloity field based on new Entity Status value
                    if (entityStatus == 43/*Solution Research*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    } else if (entityStatus == 16/*Closed-Lost*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    } else if (entityStatus == 42/*Solution Development (Residual)*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 65 });
                    } else if (entityStatus == 39/*Proposal Delivery & Review-Residual*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 80 });
                    } else if (entityStatus == 12/*Verbal Commitment*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 95 });
                    } else if (entityStatus == 45/*Closed-PO*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 100 });
                    } else if (entityStatus == 34/*Closed-Out*/) {
                        opportunity.setValue({ fieldId: 'probability', value: 0 });
                    }
                }
              
            } catch (e) {
                log.debug('Error', e)
            }
              
        }
        return {
            fieldChanged: fieldChanged
        };
    });