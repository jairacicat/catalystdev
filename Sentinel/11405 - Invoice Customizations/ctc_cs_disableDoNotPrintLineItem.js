/**
 * Copyright (c) 2020 Catalyst Tech Corp
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Catalyst Tech Corp. (“Confidential Information”). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Catalyst Tech.
 *
 * Project Number: Sentinel - Invoice Customizations
 * Script Name: CTC - Disable Do Not Print CS
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         08-02-2024                  jaira@nscatalyst.com                    Initial Build
 * 2.00         08-19-2024                  jaira@nscatalyst.com                    Enable checkbox if both Rate and Amount are 0
 * 3.00         10-09-2024                  jaira@nscatalyst.com                    Unchecks lines on pageload if Rate&Amount are not 0
 *
 */

define(['N/record', 'N/currentRecord'], function(record, currentRecord) {
    var FLD_DONOTPRINT = 'custcol_sti_do_not_print';

    function pageInit(context){
        var CURRENT_REC = context.currentRecord;
        var lineCount = CURRENT_REC.getLineCount({sublistId: 'item'});

        for(var i = 0; i < lineCount; i++){
            CURRENT_REC.selectLine({
                sublistId: 'item',
                line: i
            });
            var lineRate = CURRENT_REC.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate'
            });

            var lineAmount = CURRENT_REC.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount'
            });

            if(lineRate != 0 && lineAmount != 0){
                CURRENT_REC.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: FLD_DONOTPRINT,
                    value: false
                });

                CURRENT_REC.commitLine({sublistId: 'item'});
            }
        }
    }
    
    function fieldChanged(context) {
        var sublistName = context.sublistId;
        var fieldName = context.fieldId;

        if (sublistName == 'item' && (fieldName == 'rate' || fieldName == 'amount') ) {
            var rec = context.currentRecord;
            var rate = rec.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'rate'
            });
            var amount = rec.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'amount'
            });
           
            if ((rate == 0 && amount == 0)) {
                rec.getSublistField({sublistId: 'item', fieldId: FLD_DONOTPRINT, line: context.line}).isDisabled = false;
            } 
            else{
                rec.setCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: FLD_DONOTPRINT,
                    value: false,
                    ignoreFieldChange: true
                });
                rec.getSublistField({sublistId: 'item', fieldId: FLD_DONOTPRINT, line: context.line}).isDisabled = true;
            }
        }
    }

    function lineInit(context){
        if(context.sublistId == 'item'){
            var rec = context.currentRecord;

            var amount = rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'amount'});
            var rate = rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate'});
            var line = rec.getCurrentSublistIndex({sublistId: 'item'});

            if(rate == 0 && amount == 0){
                rec.getSublistField({sublistId: 'item', fieldId: FLD_DONOTPRINT, line: line}).isDisabled = false;
            }
            else{
                rec.getSublistField({sublistId: 'item', fieldId: FLD_DONOTPRINT, line: line}).isDisabled = true;
            }
        }
    }
    

    return {
        fieldChanged: fieldChanged,
        lineInit: lineInit,
        pageInit: pageInit
    };
});