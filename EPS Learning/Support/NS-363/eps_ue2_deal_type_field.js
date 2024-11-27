/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/ui/serverWidget'],
    function (record, serverWidget) {
        function beforeLoad(context) {
                       const opportunity = context.newRecord;
                const form = context.form;
            try {
              // const isQuote = opportunity.getValue({fieldId: 'status'});
              // log.debug('isQuote', isQuote)
              // if (isQuote != 'Issued Quote') {
                //Hide NS native Status field
                form.getField({ id: 'entitystatus' }).updateDisplayType({ displayType: 'hidden' });//hidden
                //Add custom Status field
                const status = form.addField({
                    id: 'custpage_entitystatus',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Status'
                });
                status.isMandatory = true;
                //If custom Deal Type field is already New Sales (Including Expansion), filter out select options
                const statusValue = opportunity.getValue({ fieldId: 'custbody_mhi_opportunity_type' });
                if (statusValue == 13) {
                    //Add select options
                    status.addSelectOption({ value: 'empty', text: '' });
                    status.addSelectOption({ value: '16', text: 'Closed-Lost' });
                    status.addSelectOption({ value: '34', text: 'Closed-Out' });
                    status.addSelectOption({ value: '35', text: 'Needs Discovery' });
                    status.addSelectOption({ value: '40', text: 'Solution Development (New Sales)' });
                    status.addSelectOption({ value: '37', text: 'Proposal Delivery & Review-NewSale' });
                    status.addSelectOption({ value: '12', text: 'Verbal Commitment' });
                    status.addSelectOption({ value: '45', text: 'Closed-PO' });
                } else if (statusValue == 14) {//Renewal (Subscription Only)
                    //Add select options
                    status.addSelectOption({ value: 'empty', text: '' });
                    status.addSelectOption({ value: '16', text: 'Closed-Lost' });
                    status.addSelectOption({ value: '34', text: 'Closed-Out' });
                    status.addSelectOption({ value: '36', text: 'Onboarding' });
                    status.addSelectOption({ value: '47', text: 'Solution Development (Renewal)' });
                    status.addSelectOption({ value: '38', text: 'Proposal Delivery & Review-Renewal' });
                    status.addSelectOption({ value: '12', text: 'Verbal Commitment' });
                    status.addSelectOption({ value: '44', text: 'Student Success' });
                    status.addSelectOption({ value: '45', text: 'Closed-PO' });
                } else if (statusValue == 15) {//Residual (Non-Subscription Only)
                    //Add select options
                    status.addSelectOption({ value: 'empty', text: '' });
                    status.addSelectOption({ value: '16', text: 'Closed-Lost' });
                    status.addSelectOption({ value: '34', text: 'Closed-Out' });
                    status.addSelectOption({ value: '43', text: 'Solution Research' });
                    status.addSelectOption({ value: '42', text: 'Solution Development (Residual)' });
                    status.addSelectOption({ value: '39', text: 'Proposal Delivery & Review-Residual' });
                    status.addSelectOption({ value: '12', text: 'Verbal Commitment' });
                    status.addSelectOption({ value: '45', text: 'Closed-PO' });
                } else {
                    //Add select options
                    status.addSelectOption({ value: 'empty', text: '' });
                    status.addSelectOption({ value: '16', text: 'Closed-Lost' });
                    status.addSelectOption({ value: '34', text: 'Closed-Out' });
                    status.addSelectOption({ value: '43', text: 'Solution Research' });
                    status.addSelectOption({ value: '35', text: 'Needs Discovery' });
                    status.addSelectOption({ value: '36', text: 'Onboarding' });
                    status.addSelectOption({ value: '40', text: 'Solution Development (New Sales)' });
                    status.addSelectOption({ value: '44', text: 'Student Success' });
                    status.addSelectOption({ value: '37', text: 'Proposal Delivery & Review-NewSale' });
                    status.addSelectOption({ value: '42', text: 'Solution Development (Residual)' });
                    status.addSelectOption({ value: '38', text: 'Proposal Delivery & Review-Renewal' });
                    status.addSelectOption({ value: '39', text: 'Proposal Delivery & Review-Residual' });
                    status.addSelectOption({ value: '47', text: 'Solution Development (Renewal)' });
                    status.addSelectOption({ value: '12', text: 'Verbal Commitment' });
                    status.addSelectOption({ value: '45', text: 'Closed-PO' });
                }
                //Insert field in Primary Information
                if (form.getField({ id: 'entitystatus' })) {
                    form.insertField({
                        field: status,
                        nextfield: 'entitystatus'//entitystatus
                    });
                }
                //Set custom Status field value based on native value, if in edit or view mode
                const nativeStatus = opportunity.getValue({ fieldId: 'entitystatus' });
              log.debug('nativeStatus', nativeStatus)
                nativeStatus ? opportunity.setValue({ fieldId: 'custpage_entitystatus', value: nativeStatus }) : '';
              
            } catch (e) {
                log.debug('Error', e)
            }
        }
        return {
            beforeLoad: beforeLoad
        }
    });