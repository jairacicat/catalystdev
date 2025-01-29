/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/config', 'N/file', 'N/format', 'N/record', 'N/render', 'N/runtime', 'N/search', 'N/xml'],
    /**
 * @param{config} config
     * @param{file} file
     * @param{format} format
     * @param{record} record
     * @param{render} render
     * @param{runtime} runtime
     * @param{search} search
     * @param {xml} xml
 */
    (config, file, format, record, render, runtime, search, xml) => {
        function isEmpty(stValue) {
            return ((stValue === 'none' || stValue === '' || stValue === null || stValue === undefined) || (stValue.constructor === Array && stValue.length === 0) ||
                (stValue.constructor === Object && (function(v) { for (var k in v) return false;return true; }) (stValue)));
        }
        function getTruckLines(soID,truckSSID,invID){
            /*log.debug("URL In getTruckLines", ticketURL)
            ticketURL = ticketURL.replace(/&/g,'&amp;');*/
            var data_arr = [];
            var final_arr = [];
            var truckSearch = search.load({
                type:'customrecord_agency_mf_media',
                id:truckSSID
            });
            var idFilter = search.createFilter({
                name:'internalid',
                join:'CUSTRECORD_AGENCY_MF_CREATED_FROM',
                operator:search.Operator.ANYOF,
                values:soID
            });
            var invFilter = search.createFilter({
                name:'internalid',
                join:'CUSTRECORD_AH_INVOICE',
                operator:search.Operator.ANYOF,
                values:invID
            })
            truckSearch.filters.push(idFilter,invFilter);
            var truckResults = truckSearch.run().getRange({start:0,end:999});
            var headObj = {};
            var url_arr = [];
            var qtyTotal = 0;
            if(truckResults.length !==0){
                var loadTotal = truckResults.length;
                for(var x=0;x<truckResults.length;x++){
                    var truckObj = {};
                    var urlObj = {};
                    var truckDate = '';
                    var truckNum = '';
                    var truckTicket = '';
                    var truckTons = 0;
                    var lineDate = truckResults[x].getValue("custrecord_agency_mf_delivery_date");
                    var lineNum = truckResults[x].getValue("custrecord_truck");
                    var truckName = truckResults[x].getText("custrecord_truck");
                    var lineTicket = truckResults[x].getValue("custrecord197");
                    var lineTons = truckResults[x].getValue("custrecord_agency_mf_quantity_1");
                    var lineUnits = truckResults[x].getText("custrecord_ah_uom");
                    qtyTotal = qtyTotal + Number(lineTons);
                    truckObj.truckDate = lineDate;
                    truckObj.truckTicket = lineTicket;
                    truckObj.truckNum = truckName;
                    truckObj.truckTons = Number(lineTons).toFixed(2) + " "+ lineUnits;
                    //truckObj.truckURL = ticketURL;
                    data_arr.push(truckObj);

                }
            }
            final_arr.push(data_arr,qtyTotal,loadTotal);
            return final_arr;
        }
        function getInvoiceLines(soID,invSSID,invRec){
            var data_arr = [];
            var soLineArr = []
            var linesSearch = search.load({
                type:search.Type.TRANSACTION,
                id:invSSID
            });
            var idFilter = search.createFilter({
                name:'internalid',
                operator:search.Operator.ANYOF,
                values:soID
            });
            linesSearch.filters.push(idFilter);
            var linesResults = linesSearch.run().getRange({start:0,end:25});
            if(linesResults.length !==0){
                for(var i=0;i<linesResults.length;i++){
                    var lineObj = {};
                    var item = '';
                    var surcharge = 0;
                    var itemID = linesResults[i].getValue("item");
                    var lineSurcharge = linesResults[i].getValue("formulanumeric");
                    lineObj.item = itemID;
                    lineObj.surcharge = Number(lineSurcharge);
                    lineObj.rate = Number(linesResults[i].getValue("rate"));
                    soLineArr.push(lineObj)
                }
                log.debug('soLineArr', soLineArr)
                for(var x=0;x<soLineArr.length;x++){
                    var invObj = {};
                    var item = '';
                    var quantity = 0;
                    var rate = 0;
                    var amount = 0;
                    var itemLine = invRec.findSublistLineWithValue({
                        sublistId:'item',
                        fieldId:'rate',
                        value:soLineArr[x].rate
                    });
                    log.debug('itemLine', itemLine)
                    if(itemLine >= 0) {
                        var lineID = invRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: itemLine
                        });
                        var lineRate = invRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            line: itemLine
                        });
                        if (soLineArr[x].item === lineID && soLineArr[x].rate===lineRate) {
                            var surcharge = 0;
                            var fuelSurcharge = soLineArr[x].surcharge;
                            var itemName = invRec.getSublistText({
                                sublistId: 'item',
                                fieldId: 'item',
                                line: itemLine
                            });
                            var itemQty = invRec.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                line: itemLine
                            });
                            var itemRate = invRec.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                line: itemLine
                            });
                            var itemAmount = invRec.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'amount',
                                line: itemLine
                            });
                            var formatRate = format.format({
                                value: itemRate,
                                type: format.Type.CURRENCY
                            });
                            var formatAmount = format.format({
                                value: itemAmount,
                                type: format.Type.CURRENCY
                            });
                            var itemSurcharge = Number(fuelSurcharge) * itemAmount;
                            invObj.item = itemName;
                            invObj.quantity = itemQty;
                            invObj.rate = formatRate;
                            invObj.surcharge = Number(itemSurcharge).toFixed(2);
                            invObj.amount = formatAmount;
                            data_arr.push(invObj);
                        }
                    }
                    log.debug("data_arr", data_arr)
                }
            }
            return data_arr;
        }
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{
                var scriptObj = runtime.getCurrentScript();
               // var invRecSearch = scriptObj.getParameter('custscript_inv_rec_ss_id');
                var truckSSID = scriptObj.getParameter('custscript_nscs_inv_truck_ss_id');
                var invSSID = scriptObj.getParameter('custscript_nscs_rec_lines_ss_id');
                var recID = scriptObj.getParameter('custscript_nscs_inv_rec_id');
                var invRec = record.load({
                    type:record.Type.INVOICE,
                    id:recID
                });
                var renderer = render.create();

                var xmlTemplateFile = file.load('SuiteScripts/nscs_xml_ah_invoice.xml');

                renderer.templateContent = xmlTemplateFile.getContents();

                renderer.addRecord('companyInformation', config.load({
                    type: config.Type.COMPANY_INFORMATION
                }));
                renderer.addRecord('record', invRec);
                var tranID = invRec.getValue('tranid');
                var soID = invRec.getValue('createdfrom');
                var locationID = invRec.getValue('location');
                var emailObj = search.lookupFields({
                    type:search.Type.LOCATION,
                    id:locationID,
                    columns:['custrecordemail_address']
                });
                var locationEmail = emailObj.custrecordemail_address;
                var head_arr = [];
                var data_arr = getTruckLines(soID, truckSSID, recID);
                var truck_arr = data_arr[0];
                var qtyTotal = Number(data_arr[1]).toFixed(2);
                var ticketTotal = Number(data_arr[2]).toFixed(2);
                var itemHead = {};
                var inv_arr = [];
                itemHead.total = qtyTotal;
                itemHead.tickets = ticketTotal;
                itemHead.email = locationEmail;
                itemHead.invData = getInvoiceLines(soID, invSSID, invRec);
                itemHead.truckData = truck_arr;
                inv_arr.push(itemHead);
                var items = {};
                items.item = inv_arr;
                renderer.addCustomDataSource({
                    format: render.DataSource.JSON,
                    alias: "ITEMS",
                    data: JSON.stringify(items)
                });
                var folderID = scriptObj.getParameter('custscript_nscs_inv_folder_id');
                var invPDF = renderer.renderAsPdf();
                invPDF.folder = folderID;
                invPDF.name = tranID + "_PDF";
                invPDF.isOnline = true;
                var pdfFile = invPDF.save();
                var ticketSearch = search.load({
                    type:'customrecord_agency_mf_media',
                    id:truckSSID
                });
                var idFilter = search.createFilter({
                    name:'internalid',
                    join:'CUSTRECORD_AGENCY_MF_CREATED_FROM',
                    operator:search.Operator.ANYOF,
                    values:soID
                });
                var ticketFilter = search.createFilter({
                    name:'internalidnumber',
                    join:'file',
                    operator:search.Operator.ISNOTEMPTY,
                    values:""
                });
                var invFilter = search.createFilter({
                    name:'internalid',
                    join:'CUSTRECORD_AH_INVOICE',
                    operator:search.Operator.ANYOF,
                    values:recID
                });
                ticketSearch.filters.push(idFilter,ticketFilter,invFilter);
                var ticketResults = ticketSearch.run().getRange({start:0,end:999});
                if (ticketResults.length !== 0) {
                    var xmlArr = ['<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">', '<pdfset>'];
                    var mainFileLoad = file.load({id: pdfFile});
                    var mainURL = xml.escape({xmlText: mainFileLoad.url});
                    xmlArr.push("<pdf src='" + mainURL + "'/>");
                    for (var t = 0; t < ticketResults.length; t++) {
                        var ticketFileID = ticketResults[t].getValue({
                            name: "internalid",
                            join: "file"
                        });
                        var ticketFile = file.load({id: ticketFileID});
                        ticketFile.isOnline = true;
                        ticketFile.save();
                        var ticketReload = file.load({id: ticketFileID});
                        var fileURL = xml.escape({
                            xmlText: ticketReload.url
                        });
                        //log.debug("File URL", fileURL)
                        xmlArr.push("<pdf src='" + fileURL + "'/>");
                    }
                    xmlArr.push("</pdfset>");
                    log.debug({title: 'bound template', details: xml.escape({xmlText: xmlArr.join('\n')})});
                    var mainPDF = render.xmlToPdf({
                        xmlString: xmlArr.join('\n')
                    });
                    mainPDF.name = tranID + "_PDF";
                    mainPDF.folder = folderID;
                    var mainFileID = mainPDF.save();
                    log.debug("Main File ID", mainFileID)
                    record.attach({
                        record: {type: 'file', id: mainFileID},
                        to: {type: 'invoice', id: recID}
                    });
                } else {
                    record.attach({
                        record: {type: 'file', id: pdfFile},
                        to: {type: 'invoice', id: recID}
                    });
                }
                invRec.setValue({fieldId:'custbody_nscs_high_vol_inv', value:false});
                invRec.save({ignoreMandatoryFields:true});
                log.debug('Remaining governance units: ' + scriptObj.getRemainingUsage());

            }catch(error){
                log.error("error", error)
                log.error('Remaining governance units: ' + scriptObj.getRemainingUsage());
            }
        }

        return {execute}

    });
