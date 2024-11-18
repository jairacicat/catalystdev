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
 * Project Number: Sentinel - Invoice and Serials
 * Script Name: CTC - Get Invoice Serials SL
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @Description Returns the serial numbers of the Invoice Items
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         October 29, 2024            jaira@nscatalyst.com                    Initial Build
 */
 
define(['N/search', 'N/url', 'N/runtime', 'N/file'], 
    function(search, url, runtime, file) 
    {

        function onRequest(context) 
        {
            try
            {
                const request = context.request;
                const invoiceId = context.request.parameters.invoice;
                log.debug("Invoice Id", invoiceId);
                let returnXML = "&nbsp;";
                if(invoiceId != "" && invoiceId != "A"){
                    let serialNumbers = {};
                    serialNumbers = getSerials(invoiceId);
                    returnXML = returnXML + "<#assign serialNumbers = "+ JSON.stringify(serialNumbers)+ ">"
    
                }
                log.debug("Return XML", returnXML);

                context.response.write(returnXML);
            }
            catch(o_exception)
            {
                log.debug('catch', 'o_exception= ' + o_exception);
                context.response.write("&nbsp;");
            }
        }

        function getSerials(invoiceId){
            try{
                let serialNumbers = {};
                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                    [
                       ["type","anyof","SalesOrd"], 
                       "AND", 
                       ["billingtransaction","anyof",[invoiceId]]
                    ],
                    columns:
                    [
                       "tranid",
                       "item",
                       "billingtransaction",
                       "custcol_ctc_xml_serial_num",
                       "custcol_ctc_so_line_id"
                    ]
                 });

                 salesorderSearchObj.run().each(function(result){
                    let soLineId = result.getValue({name: 'custcol_ctc_so_line_id'});
                    let itemId = result.getValue({name: 'item'});
                    let lineSerial = result.getValue({name: 'custcol_ctc_xml_serial_num'});

                    if(lineSerial != "" && lineSerial != "NA"){
                        serialNumbers["line-"+soLineId] = {
                            "item" : itemId,
                            "serial": lineSerial.split(" ").join(", ")
                        }
                    }
                    return true;
                 });
                 
                return serialNumbers;
            }catch(err){
                log.error("Error in getSerials", err.message);
            }
        }
        return {
            onRequest: onRequest
        };  
    }); 