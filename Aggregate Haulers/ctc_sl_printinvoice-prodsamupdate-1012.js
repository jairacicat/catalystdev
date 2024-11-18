/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * 
 * Version changes:
 * Version          Date             Name                Description
 * 1.0              09/12/2024       jcicat              Initial build in Production
 * 2.0              10/11/2024       sam stark           added getInvoiceLines function
 */
define(['N/file', 'N/format', 'N/record', 'N/render', 'N/runtime', 'N/search', 'N/config', 'N/redirect', 'N/xml'],
    /**
     * @param{file} file
     * @param{format} format
     * @param{record} record
     * @param{render} render
     * @param{runtime} runtime
     * @param{search} search
     * @param{config} config
     * @param{redirect} redirect
     * @param{xml} xml
     */
    function (file, format, record, render, runtime, search, config,redirect,xml)  {
        function isEmpty(stValue) {
            return ((stValue === 'none' || stValue === '' || stValue === null || stValue === undefined) || (stValue.constructor === Array && stValue.length === 0) ||
                (stValue.constructor === Object && (function(v) { for (var k in v) return false;return true; }) (stValue)));
        }

        function getTruckLines(soID,truckSSID){
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
            truckSearch.filters.push(idFilter);
            var truckResults = truckSearch.run().getRange({start:0,end:999});
            log.debug("truckResults", truckResults)
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
                    //log.debug("Ticket Number", lineTicket)
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
            //log.debug("QTY Total", qtyTotal)
            final_arr.push(data_arr,qtyTotal);
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
            log.debug("linesResults",linesResults)
            if(linesResults.length !==0){
                for(var i=0;i<linesResults.length;i++){
                    var lineObj = {};
                    var item = '';
                    var surcharge = 0;
                    var itemID = linesResults[i].getValue("item");
                    var lineSurcharge = linesResults[i].getValue("formulanumeric");
                    lineObj.item = itemID;
                    lineObj.surcharge = Number(lineSurcharge);
                    soLineArr.push(lineObj)
                }
                log.debug("soLineArr",soLineArr)
                for(var x=0;x<soLineArr.length;x++){
                    var invObj = {};
                    var item = '';
                    var quantity = 0;
                    var rate = 0;
                    var amount = 0;
                    var itemLine = invRec.findSublistLineWithValue({
                        sublistId:'item',
                        fieldId:'item',
                        value:soLineArr[x].item
                    });
                    log.debug("itemLine", itemLine)
                    if(itemLine >= 0) {
                        var lineID = invRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: itemLine
                        });
                        log.debug("soLineArr[x].item", soLineArr[x].item)
                        log.debug("lineID", lineID)
                        if (soLineArr[x].item === lineID) {
                            var surcharge = 0;
                            var fuelSurcharge = soLineArr[x].surcharge;
                            log.debug('fuelSurcharge', fuelSurcharge)
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
                            log.debug('itemSurcharge', itemSurcharge)
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
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest  (scriptContext) {
            try{
                var scriptObj = runtime.getCurrentScript();
                var truckSSID = scriptObj.getParameter('custscript_emailautomation_truck_ss');
                var ticketFolder = scriptObj.getParameter('custscript_emailautomation_ticketfolder');
                var invSSID = scriptObj.getParameter('custscript_emailautomation_inv_lines_ss');
                var recID = scriptContext.request.parameters.recID;
                //log.debug('Record ID', recID)
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
                //log.debug("emailObj",emailObj)
                var locationEmail = emailObj.custrecordemail_address;
                //log.debug('locationEmail', locationEmail)
                // log.debug("SO ID", soID)
                var head_arr = [];
                if(!isEmpty(soID)) {
                    /*var ticketURL = getTicketPDF(invRec,truckSSID,soID,ticketFolder,tranID);
                    log.debug("Ticket URL", ticketURL)*/
                    var data_arr = getTruckLines(soID,truckSSID);
                    // head_arr.push(truck_arr);
                    var truck_arr = data_arr[0];
                    var qtyTotal = Number(data_arr[1]).toFixed(2);
                    //('Truck Array', truck_arr)
                    var itemHead = {};
                    var inv_arr = [];
                    itemHead.total = qtyTotal;
                    itemHead.email = locationEmail;
                    itemHead.invData = getInvoiceLines(soID,invSSID,invRec);
                    itemHead.truckData = truck_arr;
                    inv_arr.push(itemHead);
                    var items = {};
                    items.item = inv_arr;
                    //log.debug('items Array', 'items:' + JSON.stringify(items))
                    renderer.addCustomDataSource({
                        format: render.DataSource.JSON,
                        alias: "ITEMS",
                        data: JSON.stringify(items)
                    });
                    var folderID = scriptObj.getParameter('custscript_emailautomation_folder_id');
                    var invPDF = renderer.renderAsPdf();
                    invPDF.folder = folderID;
                    invPDF.name = tranID +"_PDF";
                    invPDF.isOnline = true;
                    var pdfFile =  invPDF.save();
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
                    ticketSearch.filters.push(idFilter,ticketFilter);
                    var ticketResults = ticketSearch.run().getRange({start:0,end:999});
                    if(ticketResults.length !==0){
                        var xmlArr = ['<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">','<pdfset>'];
                        var mainFileLoad = file.load({id:pdfFile});
                        var mainURL = xml.escape({xmlText:mainFileLoad.url});
                        log.debug("Invoice URL", mainURL);
                        xmlArr.push("<pdf src='" + mainURL + "'/>");
                        for(var t=0;t<ticketResults.length;t++){
                            var ticketFileID = ticketResults[t].getValue({name: "internalid",
                                join: "file"});
                            log.debug('File ID', ticketFileID)
                            var ticketFile = file.load({id:ticketFileID});
                            ticketFile.isOnline = true;
                            ticketFile.save();
                            var ticketReload = file.load({id:ticketFileID});
                            var fileURL = xml.escape({
                                xmlText:ticketReload.url
                            });
                            log.debug("File URL", fileURL)
                            xmlArr.push("<pdf src='" + fileURL + "'/>");
                        }
                        xmlArr.push("</pdfset>");
                        log.debug("XML Array", xmlArr)
                        log.debug({title:'bound template', details:xml.escape({xmlText:xmlArr.join('\n')})});
                        var mainPDF = render.xmlToPdf({
                            xmlString:  xmlArr.join('\n')
                        });
                        mainPDF.name = tranID +"_PDF";
                        mainPDF.folder = folderID;
                        var mainFileID = mainPDF.save();
                        log.debug("Main File ID", mainFileID)
                        record.attach({
                            record:{type:'file',id:mainFileID},
                            to:{type:'invoice',id:recID}
                        });
                        
                        scriptContext.response.write({
                            output: JSON.stringify(mainFileID)
                        });
                        //var mainFileReload= file.load({id:mainFileID})
                        //redirect.redirect({
                        //    url:mainFileReload.url
                        //});
                    }else{
                        var fileLoad = file.load({
                            id:pdfFile
                        });
                        scriptContext.response.write({
                            output: JSON.stringify(pdfFile)
                        })

                        /*log.debug("File ID w no attachments", pdfFile)
                        record.attach({
                            record:{type:'file',id:pdfFile},
                            to:{type:'invoice',id:recID}
                        });
                        redirect.redirect({
                            url:fileLoad.url
                        });
                        */
                    }


                    //load file and redirect to url for printing


                }
            }catch(error){
                log.error('Error', error)
            }
        }

        return {onRequest}

    });
