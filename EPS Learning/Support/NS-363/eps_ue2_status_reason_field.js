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

                //Hide NS native Win/LossReason field
                const hide = form.getField({ id: 'winlossreason' }).updateDisplayType({ displayType: 'hidden' });
                //Add custom Win/Loss Reason field
                const winLossReason = form.addField({
                    id: 'custpage_winlossreason',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Win/Loss Reason'
                });
                //Add select options
                winLossReason.addSelectOption({ value: 'empty', text: '' });
                winLossReason.addSelectOption({ value: '1', text: 'Administrative Change' });
                winLossReason.addSelectOption({ value: '3', text: 'Content/Pedagogy' });
                winLossReason.addSelectOption({ value: '2', text: 'Customer Experience' });
                winLossReason.addSelectOption({ value: '4', text: 'Duplicate Opp' });
                winLossReason.addSelectOption({ value: '14', text: 'EPS Withdrew' });
                winLossReason.addSelectOption({ value: '5', text: 'Funding/Budget' });
                winLossReason.addSelectOption({ value: '6', text: 'Lack of Inventory' });
                winLossReason.addSelectOption({ value: '7', text: 'No Decision/Stale Opp' });
                winLossReason.addSelectOption({ value: '8', text: 'No Driver' });
                winLossReason.addSelectOption({ value: '13', text: 'Not on State List' });
                winLossReason.addSelectOption({ value: '17', text: 'On State List' });
                winLossReason.addSelectOption({ value: '16', text: 'Other' });
                winLossReason.addSelectOption({ value: '9', text: 'Overstock' });
                winLossReason.addSelectOption({ value: '18', text: 'Part of a Larger Opp' });
                winLossReason.addSelectOption({ value: '10', text: 'Price' });
                winLossReason.addSelectOption({ value: '15', text: 'Sales Process/Strategy' });
                winLossReason.addSelectOption({ value: '11', text: 'Sales Relationship' });
                winLossReason.addSelectOption({ value: '12', text: 'Too late/Missed Cycle' });
                //Insert field in Primary Information
                if (form.getField({ id: 'winlossreason' })) {
                    form.insertField({
                        field: winLossReason,
                        nextfield: 'winlossreason'
                    });
                }
                //Set custom Status field value based on native value, if in edit or view mode
                //if (context.type == 'edit' || context.type == 'view') {
                    const nativeWinLoss = opportunity.getValue({ fieldId: 'winlossreason' });
                    nativeWinLoss ? opportunity.setValue({ fieldId: 'custpage_winlossreason', value: nativeWinLoss }) : '';
                //}
              
            } catch (e) {
                log.debug('Error', e)
            }
        }
        return {
            beforeLoad: beforeLoad
        }
    });