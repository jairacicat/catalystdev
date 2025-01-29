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
 * Project Number: Aggregate Haulers - Mass VB Approval
 * Script Name: 
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 * @Description Client Script for the form actions of the VB Mass Approval Suitelet
 * 
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         Oct 5, 2024                 jaira@nscatalyst.com                    Initial Build
 *
 * Fields:
 * CTC - VB Mass Approval In Progress [custentity_ctc_vb_mass_approval]
 */
define(['N/currentRecord', 'N/url'], function(currentRecord, url) {

    function pageInit(context) {
        // Initial setup if needed
        window.onbeforeunload = null;
    }

    function applyFilters() {
        var currentRec = currentRecord.get();

        // Get the values from the filter fields
        var dateFrom = currentRec.getText({ fieldId: 'custpage_datefrom' });
        var dateTo = currentRec.getText({ fieldId: 'custpage_dateto' });
        var vendorId = currentRec.getValue({ fieldId: 'custpage_vendor' });
        var location = currentRec.getValue({ fieldId: 'custpage_location' });

        // Build the URL with the filter parameters
        var suiteletUrl = url.resolveScript({
            scriptId: 'customscript_ctc_vb_massapproval',
            deploymentId: 'customdeploy_ctc_vb_massapproval'
        });

        var params = {
            datefrom: dateFrom ? dateFrom : '',
            dateto: dateTo ? dateTo : '',
            vendor: vendorId ? vendorId : '',
            applyfilters: true,
            location: location ? location : ''
        };

        // Construct the full URL with query parameters
        var finalUrl = suiteletUrl + '&' + Object.keys(params).map(function(key) {
            return key + '=' + encodeURIComponent(params[key]);
        }).join('&');

        // Redirect to the Suitelet page with the filters in place
        window.location.href = finalUrl;
    }

    function saveRecord() {
        var selectedVendors = [];
        var lineCount = currentRecord.get().getLineCount({ sublistId: 'custpage_vendorlist' });

        for (var i = 0; i < lineCount; i++) {
            var isChecked = currentRecord.get().getSublistValue({
                sublistId: 'custpage_vendorlist',
                fieldId: 'custpage_select',
                line: i
            });

            if (isChecked) {
                var vendorId = currentRecord.get().getSublistValue({
                    sublistId: 'custpage_vendorlist',
                    fieldId: 'custpage_vendorpdf',
                    line: i
                });
                selectedVendors.push(vendorId);
            }
        }

        // Validation if no vendors selected
        if (selectedVendors.length === 0) {
            alert('Please select at least one vendor.');
            return false;
        }

        // Save and initiate Map/Reduce processing
        return true;
    }

    return {
        pageInit: pageInit,
        applyFilters: applyFilters,
        saveRecord: saveRecord
    };
});
