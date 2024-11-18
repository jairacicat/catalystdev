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
 * Project Number: Cady - Build Recurring Invoice Charges PDF Template
 * Script Name: CTC - Print AFC Details SL
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         July 18, 2024              jaira@nscatalyst.com                    Initial Build
 *
 */
 
define(['N/search'], 
    function(search) 
    {
        function onRequest(context) 
        {
            try
            {
                const request = context.request;
                const action = context.request.parameters.action;

                if(action == 'getAFCDetails'){
                    let returnXML = "";
                    const invoiceId = context.request.parameters.invoice;
                    log.debug("Invoice ID", invoiceId);

                    if(invoiceId){
                        const AFC_DETAILS = getAFCDetails(invoiceId);
                        log.debug("AFC_DETAILS", AFC_DETAILS);

                        if(AFC_DETAILS.length > 0){
                            let totalTax = 0;
                            returnXML = '<span style="font-weight: bold; font-size: 12pt;">Taxes and Surcharges Details</span>'
                                +'<table class="itemtable" style="width: 100%; top: -10px; border: 1px solid black;">'
                                +'    <!-- start AFC Details -->'
                            
                                +'            <tr>'
                                +'                <th colspan="8" align="left">Description</th>'
                                +'                <th colspan="2" align="right">Amount</th>'
                                +'            </tr>'
             
                            
                            
                            for(var i = 0; i < AFC_DETAILS.length; i++){
                                totalTax = totalTax + parseFloat(AFC_DETAILS[i].amount);
                                returnXML = returnXML + '<tr>'
                                +'            <td colspan="8" align="left">'+ AFC_DETAILS[i].description +'</td>'
                                +'            <td colspan="2" align="right">$'+ parseFloat(AFC_DETAILS[i].amount).toFixed(2) +'</td>'
                                +'        </tr>';
                            }
                            log.debug("totalTax", totalTax);
                            returnXML = returnXML 
                                +'    <tr>'
                                +'            <th colspan="8" align="left">Total Tax Charges</th>'
                                +'            <th colspan="2" align="right">$'+ parseFloat(totalTax).toFixed(2)+'</th>'
                                +'    </tr>'
                                +'    <!-- end AFC Details -->'
                                +'</table>'

                        }
                    }
                    log.debug("returnXML", returnXML);

                    context.response.write(returnXML);

                }else{
                    context.response.write("<br />");
                }
            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function getAFCDetails(invoiceId){
            let AFC_DETAILS = [];
            let AFCDetailsSearch = search.create({
                type: "customrecord_bbstfc_taxes_det",
                filters:
                [
                   ["custrecord_bbstfc_tax_det_tran","anyof", invoiceId], 
                   "AND",
                   ["isinactive","is", "F"], 

                ],
                columns:
                [
                   search.createColumn({
                      name: "formulatext",
                      summary: "GROUP",
                      formula: "{custrecord_bbstfc_tax_det_lvl} || ' ' || {custrecord_bbstfc_tax_det_name}"
                   }),
                   search.createColumn({
                      name: "custrecord_bbstfc_tax_det_tax",
                      summary: "SUM"
                   })
                ]
             });

             AFCDetailsSearch.run().each(function(result){
                let resultObject = {};
                const columns = result.columns;
                resultObject["description"] = result.getValue(columns[0]);
                resultObject["amount"] = result.getValue(columns[1]);

                AFC_DETAILS.push(resultObject);
                return true;
             });

             return AFC_DETAILS;
             
        }
        
        return {
            onRequest: onRequest
        };  
    }); 