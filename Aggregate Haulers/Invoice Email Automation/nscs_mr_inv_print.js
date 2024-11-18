/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/config', 'N/file', 'N/format', 'N/record', 'N/render', 'N/runtime', 'N/search', 'N/xml', 'N/task'],
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
    (config, file, format, record, render, runtime, search, xml, task) => {
        const SPARAM_INVOICE_SS = 'custscript_inv_rec_ss_id';
        const SPARAM_CALLED_BY_EMAIL_AUTOMATION = 'custscript_called_by_invemail';

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
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            try{
                var scriptObj = runtime.getCurrentScript();
                var invRecSearch = scriptObj.getParameter('custscript_inv_rec_ss_id');

                return search.load({id:invRecSearch, type:record.Type.INVOICE});
            }catch(error){
                log.error("getInputData Error", error)
            }
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try{
                log.debug("", "------map------");
                log.debug('Context-map', mapContext);
                var mapValues = JSON.parse(mapContext.value);
                mapContext.write({
                    key: mapContext.key, //mapValues.recordid,
                    value: mapValues.values.internalid//mapValues.weekOf
                });
            }catch(error){
                log.error("map Error", error)
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            try{
                var reduceObj = runtime.getCurrentScript();
                var truckSSID = reduceObj.getParameter('custscript_inv_truck_ss_id');
                var invSSID = reduceObj.getParameter('custscript_rec_lines_ss_id');
                log.debug("reduceKey", reduceContext.key)
                var recID = reduceContext.key;
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
                var folderID = reduceObj.getParameter('custscript_inv_folder_id');
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
                invRec.setValue({fieldId: 'custbody_pdf_foremailsending', value:false});

                invRec.save({ignoreMandatoryFields:true});
            }catch (error){
                log.error("reduce Error", error)
            }
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

            const calledByEmailAutomation = runtime.getCurrentScript().getParameter({name: SPARAM_CALLED_BY_EMAIL_AUTOMATION});

            if(calledByEmailAutomation || calledByEmailAutomation == 'T'){
                //Call CTC - Email Automation - Vendor MR
                let mrTask = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ctc_mr_emailautomation_inv',
                    deploymentId: 'customdeploy_emailautomation_invoice',
                    params: {
                        'custscript_emailautomation_inv_pdfcreate' : true
                    }
                });

                mrTask.submit();

                log.debug("Called Email Automation");

            }
            
            let SS_ID = runtime.getCurrentScript().getParameter({
                name: SPARAM_INVOICE_SS
            });

            // Check if more records remain in the saved search
            var remainingRecords = search.load({
                id: SS_ID
            }).run().getRange({ start: 0, end: 1000 }).length;

            log.debug("remainingRecords", remainingRecords);
            var mapKeys = [];
            summaryContext.mapSummary.keys.iterator().each(function (key)
                {
                    mapKeys.push(key);
                    return true;
                });
            log.audit('MAP keys processed', mapKeys);

            if ((remainingRecords>0) && (remainingRecords != mapKeys.length)) {
                // Resubmit the Map/Reduce script if more records are found
                var scriptTask = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_nscs_mr_inv_print',
                    deploymentId: runtime.getCurrentScript().deploymentId,
                });
    
                var taskId = scriptTask.submit();
                log.audit({
                    title: 'Resubmitted Map/Reduce Script',
                    details: 'New task ID: ' + taskId
                });
            } else {
                log.audit({
                    title: 'Map/Reduce Script Completed',
                    details: 'No more Invoices to process.'
                });
            }

            var stMethodName = 'summarize';
            log.debug(stMethodName, ' - Summarize Entry -');

            log.audit({
                title : stMethodName,
                details : 'Duration : ' + summaryContext.seconds
            });
            log.audit({
                title : stMethodName,
                details : 'Usage Consumed : ' + summaryContext.usage
            });
            log.audit({
                title : stMethodName,
                details : 'Number of Queues : ' + summaryContext.concurrency
            });
            log.audit({
                title : stMethodName,
                details : 'Number of Yields : ' + summaryContext.yields
            });
            log.audit({
                title : stMethodName,
                details : 'Restart? : ' + summaryContext.isRestarted
            });
            log.debug(stMethodName, ' - SummarizeExit -');
        }

        return {getInputData, map, reduce, summarize}

    });
