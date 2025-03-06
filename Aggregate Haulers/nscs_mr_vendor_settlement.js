/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/config', 'N/file', 'N/format', 'N/record', 'N/redirect', 'N/render', 'N/runtime', 'N/search', 'N/task'],
    /**
 * @param{config} config
 * @param{file} file
 * @param{format} format
 * @param{record} record
 * @param{redirect} redirect
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 */
    (config, file, format, record, redirect, render, runtime, search, task) => {

        const SPARAM_VENDOR_SS = 'custscript_vendors_for_processing';
        const SPARAM_CALLED_BY_EMAIL_AUTOMATION = 'custscript_calledbyemailautomation';
        const SPARAM_FOR_MASS_APPROVAL = 'custscript_formassapproval';

        function formatDate(dateValue){
            var newDate = ((dateValue.getMonth() > 8) ? (dateValue.getMonth() + 1) : ('0' + (dateValue.getMonth() + 1))) + '/' + ((dateValue.getDate() > 9) ? dateValue.getDate() : ('0' + dateValue.getDate())) + '/' + dateValue.getFullYear();
            return newDate;
        }
        function isEmpty(stValue) {
            return ((stValue === 'none' || stValue === '' || stValue === null || stValue === undefined) || (stValue.constructor === Array && stValue.length === 0) ||
                (stValue.constructor === Object && (function(v) { for (var k in v) return false;return true; }) (stValue)));
        }
        function ytdValues(recID,weekofDate,payDate,driverData,formatWeek,truckIDs){
            var firstDay =new Date(weekofDate.getFullYear(), 0);
            var formatFirst = formatDate(firstDay);
            var ytd_arr = [];
            var ytdObj = {};
            var ytdEarnings = 0;
            var ytdFuel = 0;
            var ytdDeduction = 0;
            var netEarnings = 0;
            var startDate = formatFirst + " 12:00 am";
            var endDate = payDate + " 11:59 pm";
            log.debug('YTD Date Range', startDate + " - "+endDate)
            var ytdEarningSS = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord155",
                            summary: "GROUP",
                            label: "Vendor #"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_6",
                            summary: "SUM",
                            label: "Total Revenue"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_7",
                            summary: "SUM",
                            label: "Total Cost"
                        }),
                        search.createColumn({
                            name: "amount",
                            join: "CUSTRECORD_AGENCY_MF_CREATED_FROM",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var ytdEarningResults = ytdEarningSS.run().getRange({start:0,end:5});
            if(ytdEarningResults.length !==0){
                var earningAmt = ytdEarningResults[0].getValue({
                    name: "custrecord_agency_mf_quantity_7",
                    summary: "SUM"
                });
                netEarnings += Number(earningAmt);
            }else{
                var earningAmt =0;
            }
            var ytdFuelSS =  search.create({
                type: "customrecord_ah_fuel_purchases",
                filters:
                    [
                        ["isinactive","is","F"],
                        /*"AND",
                        ["custrecord196.custrecord_driver_vendor","anyof",recID],*/
                        "AND",
                        //["formuladate: NVL({custrecord350}, {custrecord186})","within",formatFirst,formatWeek]
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord189",
                            summary: "SUM",
                            label: "Cost"
                        }),
                        search.createColumn({
                            name: "custrecord_driver_vendor",
                            join: "CUSTRECORD196",
                            summary: "GROUP",
                            label: "Driver"
                        })
                    ]
            });

            if(truckIDs.length != 0){
                ytdFuelSS.filters.push(search.createFilter({
                    name: "internalid",
                    join: "custrecord192",
                    operator: "anyof",
                    values: truckIDs
                }))
            }

            var ytdFuelResults = ytdFuelSS.run().getRange({start:0,end:5});
            if(ytdFuelResults.length !==0){
                var fuelAmt = ytdFuelResults[0].getValue({
                    name: "custrecord189",
                    summary: "SUM"
                });
                netEarnings = netEarnings - Number(fuelAmt);
            }else{
                var fuelAmt =0;
            }
            // fuelAmt = Number(fuelAmt) * -1;
            var ytdDeductionSS = search.create({
                type: "customrecord_ah_deductions",
                filters:
                    [
                        ["custrecord185.internalid","anyof",recID],
                        "AND",
                        ["custrecord_ah_truck_id","noneof","@NONE@"],
                        "AND",
                        //["custrecord_ah_start_date","within",formatFirst,formatWeek]
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord185",
                            summary: "GROUP",
                            label: "Vendor ID"
                        }),
                        search.createColumn({
                            name: "custrecord_ah_amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var ytdDeductionResults = ytdDeductionSS.run().getRange({start:0,end:5});
            if(ytdDeductionResults.length !==0){
                var deductAmt = ytdDeductionResults[0].getValue({
                    name: "custrecord_ah_amount",
                    summary: "SUM"
                });
                netEarnings = netEarnings -  Number(deductAmt);
            }else{
                var deductAmt =0;
            }
            var ytdCreditSearch = search.create({
                type: "vendorcredit",
                filters:
                    [
                        ["type","anyof","VendCred"],
                        "AND",
                        ["taxline","is","F"],
                        "AND",
                        ["item","noneof","966"],
                        "AND",
                        ["memo","doesnotcontain","Fuel"],
                        "AND",
                        ["vendor.internalid","anyof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", formatFirst,payDate],
                        "AND",
                        ["memo","isnotempty",""]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var creditResults = ytdCreditSearch.run().getRange({start:0,end:9});
            var adjustYTD = 0;
            if(creditResults.length !==0){
                adjustYTD = creditResults[0].getValue({
                    name: "amount",
                    summary: "SUM"
                });
                netEarnings = netEarnings +  Number(adjustYTD);
            }
            adjustYTD = Number(adjustYTD) *-1;
            if(Number(earningAmt) < 0) {
                earningAmt = earningAmt * -1;
                ytdObj.ytdEarnings = "("+Number(earningAmt).toFixed(2)+")";
            }else{
                ytdObj.ytdEarnings = Number(earningAmt).toFixed(2);
            }
            //ytdObj.ytdEarnings = Number(earningAmt).toFixed(2);
            ytdObj.ytdFuel =Number(fuelAmt).toFixed(2);
            ytdObj.ytdDeduction = Number(deductAmt).toFixed(2);
            ytdObj.ytdAdjustment = adjustYTD.toFixed(2)
            ytdObj.dateRange = formatFirst + ' - '+payDate;
            if(Number(netEarnings) < 0) {
                netEarnings = netEarnings * -1;
                ytdObj.netAmt = "("+Number(netEarnings).toFixed(2)+")";
            }else{
                ytdObj.netAmt = Number(netEarnings).toFixed(2);
            }
            ytd_arr.push(ytdObj);
            return ytd_arr;
        }
        function weekValues(recID,weekofDate,payDate,pmtDate,driverData,truckIDs){
            var totalWeek = 0;
            var week_arr = [];
            var weekObj = {};
            var startDate = weekofDate + " 12:00 am";
            var endDate = payDate + " 11:59 pm";
            log.debug('Date Range', startDate + " - "+endDate)
            var weekEarningSS = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord155",
                            summary: "GROUP",
                            label: "Vendor #"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_7",
                            summary: "SUM",
                            label: "Total Cost"
                        })
                    ]
            });
            var weekEarningResults = weekEarningSS.run().getRange({start:0,end:5});
            if(weekEarningResults.length !==0){
                var earningAmt = weekEarningResults[0].getValue({
                    name: "custrecord_agency_mf_quantity_7",
                    summary: "SUM"
                });
                totalWeek += Number(earningAmt);
            }else{
                var earningAmt =0;
            }
            var weekFuelSS = search.create({
                type: "customrecord_ah_fuel_purchases",
                filters:
                    [
                        /*["custrecord196.custrecord_driver_vendor","anyof",recID],
                        "AND",
                        ["custrecord186","within",priorDate,weekofDate],*/
                        ["custrecord192.internalid","anyof",truckIDs],
                        "AND",
                        //["formuladate: NVL({custrecord350}, {custrecord186})","within",priorDate,weekofDate]
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord189",
                            summary: "SUM",
                            label: "Cost"
                        })
                    ]
            });
            var weekFuelResults = weekFuelSS.run().getRange({start:0,end:5});
            if(weekFuelResults.length !==0){
                var fuelAmt = weekFuelResults[0].getValue({
                    name: "custrecord189",
                    summary: "SUM"
                });
                totalWeek = totalWeek - Number(fuelAmt);
            }else{
                var fuelAmt =0;
            }
            var fuelCount = weekFuelResults.length;
            // fuelAmt =  Number(fuelAmt) * -1;
            var weekDeductionSS = search.create({
                type: "customrecord_ah_deductions",
                filters:
                    [
                        ["custrecord185.internalid","anyof",recID],
                        "AND",
                        ["custrecord_ah_truck_id","noneof","@NONE@"],
                        "AND",
                        //["custrecord_ah_start_date","within",weekofDate,payDate]
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord185",
                            summary: "GROUP",
                            label: "Vendor ID"
                        }),
                        search.createColumn({
                            name: "custrecord_ah_amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var weekDeductionResults = weekDeductionSS.run().getRange({start:0,end:5});
            if(weekDeductionResults.length !==0){
                var deductAmt = weekDeductionResults[0].getValue({
                    name: "custrecord_ah_amount",
                    summary: "SUM"
                });
                totalWeek = totalWeek - Number(deductAmt);
            }else{
                var deductAmt =0;
            }
            var creditSearch = search.create({
                type: "vendorcredit",
                filters:
                    [
                        ["type","anyof","VendCred"],
                        "AND",
                        ["taxline","is","F"],
                        "AND",
                        ["item","noneof","966"],
                        "AND",
                        ["memo","doesnotcontain","Fuel"],
                        "AND",
                        ["vendor.internalid","anyof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", weekofDate,payDate],
                        "AND",
                        ["memo","isnotempty",""]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var creditResults = creditSearch.run().getRange({start:0,end:9});
            var creditAmt = 0;
            if(creditResults.length !==0){
                creditAmt = creditResults[0].getValue({
                    name: "amount",
                    summary: "SUM"
                });
                if(Number(creditAmt) > 0){
                    creditAmt = creditAmt * -1;
                }
                totalWeek += Number(creditAmt);
            }
            //deductAmt = Number(deductAmt) * -1;
            if(Number(earningAmt) < 0) {
                earningAmt = earningAmt * -1;
                weekObj.weekEarnings = "("+Number(earningAmt).toFixed(2)+")";
            }else{
                weekObj.weekEarnings = Number(earningAmt).toFixed(2);
            }

            weekObj.weekFuel =Number(fuelAmt).toFixed(2);
            weekObj.weekDeduction = Number(deductAmt).toFixed(2);
            if(Number(creditAmt) < 0) {
                creditAmt = creditAmt * -1;
                weekObj.weekAdjust = "("+Number(creditAmt).toFixed(2)+")";
            }else{
                weekObj.weekAdjust = Number(creditAmt).toFixed(2);
            }
            weekObj.weekEnd = weekofDate;
            weekObj.pmtDate = pmtDate;
            if(Number(totalWeek) < 0) {
                totalWeek = totalWeek * -1;
                weekObj.weekTotal = "("+Number(totalWeek).toFixed(2)+")";
            }else{
                weekObj.weekTotal = Number(totalWeek).toFixed(2);
            }
            week_arr.push(weekObj);
            return week_arr;
        }
        function totalEarnings(recID,priorDate,weekofDate,truckID_arr,formatToday){
            //weekofDate = weekofDate + " 11:59 pm";
            var startDate = weekofDate + " 12:00 am";
            var endDate = formatToday + " 11:59 pm";
            log.debug('totalEarnings Date Range', startDate + " - "+endDate)
            var earning_arr = [];
            var final_arr = [];
            var finalObj = {};
            var totalAmt = 0;
            var earningSearch = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["created","within",startDate,endDate]

                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_truck",
                            summary: "GROUP",
                            label: "Truck"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "CUSTRECORD155",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord197",
                            summary: "COUNT",
                            label: "Ticket Number"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_6",
                            summary: "SUM",
                            label: "Total Revenue"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_7",
                            summary: "SUM",
                            label: "Total Cost"
                        }),
                        search.createColumn({
                            name: "amount",
                            join: "CUSTRECORD_AGENCY_MF_CREATED_FROM",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });
            var earningResults = earningSearch.run().getRange({start:0,end:999});
            var earningCount = 0;
            if(earningResults.length!==0){
                for(var a=0;a<earningResults.length;a++){
                    var earningObj = {};
                    var truck = '';
                    var count = 0;
                    var amount = 0;
                    var truckNum = earningResults[a].getText({
                        name: "custrecord_truck",
                        summary: "GROUP"
                    });
                    var ticketCt = earningResults[a].getValue({
                        name: "custrecord197",
                        summary: "COUNT"
                    });
                    var lineAmt = earningResults[a].getValue({
                        name: "custrecord_agency_mf_quantity_7",
                        summary: "SUM"
                    });
                    if(!isEmpty(lineAmt)){
                        totalAmt += Number(lineAmt);
                    }
                    earningCount += Number(ticketCt);
                    earningObj.truck = truckNum;
                    earningObj.count = ticketCt;
                    if(Number(lineAmt) < 0) {
                        lineAmt = lineAmt * -1;
                        earningObj.amount = "("+Number(lineAmt).toFixed(2)+")";
                    }else{
                        earningObj.amount = Number(lineAmt).toFixed(2);
                    }
                    earning_arr.push(earningObj);
                }
            }
            if(Number(totalAmt) < 0) {
                totalAmt = totalAmt * -1;
                finalObj.total = "("+Number(totalAmt).toFixed(2)+")";
            }else{
                finalObj.total = Number(totalAmt).toFixed(2);
            }
            finalObj.earningNum = earningCount;
            finalObj.data = earning_arr;
            final_arr.push(finalObj);
            return final_arr;
        }
        function totalFuel(recID,priorDate,weekofDate,truckIDs,formatToday) {
            var fuel_arr = [];
            var final_arr = [];
            var finalObj = {};
            var totalAmt = 0;
            var startDate = weekofDate + " 12:00 am";
            var endDate = formatToday + " 11:59 pm";
            log.debug('totalFuel Date Range', startDate + " - " + endDate)
            var fuelSearch = search.create({
                type: "customrecord_ah_fuel_purchases",
                filters:
                    [
                        /*"AND",["custrecord196.custrecord_driver_vendor","anyof",recID],

                        ["custrecord186","within",priorDate,weekofDate],
                        "AND",
                        */
                        //["formuladate: NVL({custrecord350}, {custrecord186})","within",startDate,endDate],
                        ["created", "within", startDate, endDate],
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord189",
                            summary: "SUM",
                            label: "Cost"
                        }),
                        search.createColumn({
                            name: "custrecord192",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "Truck"
                        }),
                        search.createColumn({
                            name: "custrecord196",
                            summary: "GROUP",
                            label: "Driver"
                        })
                    ]
            });
            fuelSearch.filters.push(search.createFilter({
                name: "custrecord192",
                operator: "anyof",
                values: truckIDs
            }))
            var fuelResults = fuelSearch.run().getRange({start: 0, end: 999});
            var fuelCount = 0;
            if (fuelResults.length !== 0) {
                for (var a = 0; a < fuelResults.length; a++) {
                    var fuelObj = {};
                    var truck = '';
                    var count = 0;
                    var amount = 0;
                    var truckNum = fuelResults[a].getText({
                        name: "custrecord192",
                        summary: "GROUP"
                    });
                    var ticketCt = fuelResults[a].getValue({
                        name: "internalid",
                        summary: "COUNT"
                    });
                    var lineAmt = fuelResults[a].getValue({
                        name: "custrecord189",
                        summary: "SUM"
                    });
                    if (!isEmpty(lineAmt)) {
                        totalAmt += Number(lineAmt);
                        //lineAmt = Number(lineAmt) * -1;
                    }
                    fuelCount += Number(ticketCt);
                    fuelObj.truck = truckNum;
                    fuelObj.count = ticketCt;
                    fuelObj.amount = Number(lineAmt).toFixed(2);
                    fuel_arr.push(fuelObj);
                }
            }

            //totalAmt = Number(totalAmt) * -1;
            //("Fuel Obj", fuel_arr)
            finalObj.total = Number(totalAmt).toFixed(2);
            finalObj.fuelNum = fuelCount;
            finalObj.data = fuel_arr;
            final_arr.push(finalObj);
            return final_arr;
        }
        function totalDeduction(recID,priorDate,weekofDate,truckID_arr,formatToday){
            var deduction_arr = [];
            var final_arr = [];
            var finalObj = {};
            var totalAmt = 0;
            var startDate = weekofDate+ " 12:00 am";
            var endDate = formatToday + " 11:59 pm";
            log.debug('totalDeduction Date Range', startDate + " - "+endDate)
            var deductionSearch = search.create({
                type: "customrecord_ah_deductions",
                filters:
                    [
                        ["custrecord185.internalid","anyof",recID],
                        "AND",
                        ["custrecord_ah_truck_id","noneof","@NONE@"],
                        "AND",
                        ["created","within",startDate,endDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "CUSTRECORD185",
                            summary: "GROUP",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord185",
                            summary: "GROUP",
                            label: "Vendor ID"
                        }),
                        search.createColumn({
                            name: "custrecord_ah_amount",
                            summary: "SUM",
                            label: "Amount"
                        }),
                        search.createColumn({
                            name: "custrecord_ah_truck_id",
                            summary: "GROUP",
                            label: "Truck ID"
                        })
                    ]
            });
            var deductionResults = deductionSearch.run().getRange({start:0,end:999});
            var deductionCount = 0;
            if(deductionResults.length!==0){
                for(var a=0;a<deductionResults.length;a++){
                    var deductionObj = {};
                    var truck = '';
                    var count = 0;
                    var amount = 0;
                    var truckNum = deductionResults[a].getText({
                        name: "custrecord_ah_truck_id",
                        summary: "GROUP"
                    });
                    var ticketCt = deductionResults[a].getValue({
                        name: "internalid",
                        summary: "COUNT"
                    });
                    var lineAmt = deductionResults[a].getValue({
                        name: "custrecord_ah_amount",
                        summary: "SUM"
                    });
                    if(!isEmpty(lineAmt)){
                        totalAmt += Number(lineAmt);
                        //lineAmt = Number(lineAmt) * -1;
                    }
                    deductionCount += Number(ticketCt);
                    deductionObj.truck = truckNum;
                    deductionObj.count = ticketCt;
                    deductionObj.amount =Number(lineAmt).toFixed(2);
                    deduction_arr.push(deductionObj);
                }
            }

            finalObj.total = Number(totalAmt).toFixed(2);
            finalObj.deductionNum = deductionCount;
            finalObj.data = deduction_arr;
            final_arr.push(finalObj);
            return final_arr;
        }
        function leaseFees(recID){
            var lease_arr=[];
            var leaseFeeSearch = search.create({
                type: "customrecord_truck_record",
                filters:
                    [
                        ["custrecord157","anyof",recID],
                        /*"AND",
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]*/
                    ],
                columns:
                    [
                        search.createColumn({name: "name", label: "Name"}),
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord163", label: "Lease Fee"})
                    ]
            });
            var leaseResults = leaseFeeSearch.run().getRange({start:0,end:999});
            if(leaseResults.length!==0){
                for(var x=0;x<leaseResults.length;x++){
                    var leaseObj = {};
                    var truck= '';
                    var fee = '';
                    var truckID = leaseResults[x].getValue("internalid");
                    var truckName = leaseResults[x].getValue("name");
                    var leaseFee = leaseResults[x].getValue("custrecord163");
                    leaseObj.truck = truckName;
                    leaseObj.fee = leaseFee;
                    lease_arr.push(leaseObj);
                }
            }
            //('Fee Obj', lease_arr)
            return lease_arr;
        }
        function getAdjustments(recID,driverData,priorDate,weekofDate,formatToday){
            var head_arr = [];
            var headObj = {};
            var creditSearch = search.create({
                type: "vendorcredit",
                filters:
                    [
                        ["type","anyof","VendCred"],
                        "AND",
                        ["taxline","is","F"],
                        "AND",
                        ["item","noneof","966"],
                        "AND",
                        ["memo","doesnotcontain","Fuel"],
                        "AND",
                        ["vendor.internalid","anyof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", weekofDate, formatToday],
                        "AND",
                        ["memo","isnotempty",""]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "tranid", label: "Document Number"}),
                        search.createColumn({name: "transactionnumber", label: "Transaction Number"}),
                        search.createColumn({name: "amount", label: "Amount"}),
                        search.createColumn({name: "memo", label: "Memo"}),
                    ]
            });
            var creditResults = creditSearch.run().getRange({start:0,end:999});
            var creditTotal = 0;
            var creditCount = creditResults.length;
            var creditArr = [];
            if(creditResults.length !==0){
                for(var c=0;c<creditResults.length;c++){
                    var creditObj = {};
                    var docnum = '';
                    var count = 0;
                    var amount = 0;
                    var creditNum = creditResults[c].getValue("transactionnumber");
                    var creditMemo = creditResults[c].getValue("memo");
                    if (creditMemo.indexOf('&') !== -1) {
                        creditMemo = creditMemo.replace(/&/g, '&amp;');
                    }
                    var creditAmt = creditResults[c].getValue("amount");
                    if(Number(creditAmt) < 0){
                        creditAmt = creditAmt * -1;
                    }
                    creditTotal += Number(creditAmt);
                    creditObj.docnum = creditNum;
                    creditObj.info = creditMemo;
                    creditObj.amount = Number(creditAmt).toFixed(2);
                    creditArr.push(creditObj);
                }
            }
            /*if(Number(creditTotal < 0)){
                creditTotal = creditTotal * -1;
            }*/
            headObj.lines = creditCount;
            headObj.total =creditTotal.toFixed(2);
            headObj.data = creditArr;
            head_arr.push(headObj);
            return head_arr;
        }
        function getStatement(recID,driverData,pmtDate,weekofDate,truckIDs,locationID,finalDate,rawDate){
            log.debug("Truck IDs", truckIDs)
            var headObj = {};
            var head_arr = [];
            var finalArr = [];
            var firstDay =new Date(rawDate.getFullYear(), 0);
            var formatFirst = formatDate(firstDay);
            var ytdStartDate = formatFirst + " 12:00 am";
            var ytdEndDate = finalDate + " 11:59 pm";
            var dateRange = formatFirst+" - "+finalDate;
            for(var f=0;f<truckIDs.length;f++) {
                var truckID = truckIDs[f];
                var finalObj = {};
                var tran_arr = [];
                var earningData = [];
                var earningTotal = 0;
                var earningCount = 0;
                var fuelData = [];
                var fuelTotal = 0;
                var fuelCount = 0;
                var deductionData = [];
                var deductionTotal = 0;
                var deductionCount = 0;
                var adjustData = [];
                var adjustTotal = 0;
                var adjustCount = 0;
                var truck = '';
                var leaseFee = 0;
                var ytdEarnings = 0;
                var ytdFuel = 0;
                var ytdDeduction = 0;
                var ytdAdjustment = 0;
                var ytdTotal = 0;
                var weekEarnings = 0;
                var weekFuel = 0;
                var weekDeduction = 0;
                var weekAdjustment = 0;
                var weekNet = 0;
                var netEarnings = 0;
                var weekTotal = 0;
                var ytdEarningSS = search.create({
                    type: "customrecord_agency_mf_media",
                    filters:
                        [
                            ["custrecord155.internalid","anyof",recID],
                            "AND",
                            ["custrecord_agency_mf_created_from.mainline","is","T"],
                            "AND",
                            ["created","within",ytdStartDate,ytdEndDate],
                            //["custrecord_agency_mf_delivery_date","within",formatFirst,weekofDate],
                            "AND",
                            ["custrecord_truck.internalid", "anyof", truckID]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord155",
                                summary: "GROUP",
                                label: "Vendor #"
                            }),
                            search.createColumn({
                                name: "custrecord_agency_mf_quantity_7",
                                summary: "SUM",
                                label: "Total Cost"
                            })
                        ]
                });
                var ytdEarningResults = ytdEarningSS.run().getRange({start:0,end:5});
                var earningAmt = 0;
                if(ytdEarningResults.length !==0){
                    earningAmt = ytdEarningResults[0].getValue({
                        name: "custrecord_agency_mf_quantity_7",
                        summary: "SUM"
                    });
                    netEarnings += Number(earningAmt);
                }

                var deductionYTDSearch = search.create({
                    type: "customrecord_ah_deductions",
                    filters:
                        [
                            ["isinactive","is","F"],
                            "AND",
                            ["created","within",ytdStartDate,ytdEndDate],
                            //["custrecord_ah_start_date","within",formatFirst,weekofDate],
                            "AND",
                            ["custrecord185.internalid","anyof",recID],
                            "AND",
                            ["custrecord_ah_truck_id.internalid","anyof",truckID]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ah_amount",
                                summary: "SUM",
                                label: "Amount"
                            })
                        ]
                });
                var deductionYTDResults = deductionYTDSearch.run().getRange({start:0,end:5});
                var deductYTD =0.00;
                if(deductionYTDResults.length !==0){
                    deductYTD = deductionYTDResults[0].getValue({
                        name: "custrecord_ah_amount",
                        summary: "SUM"
                    });
                    netEarnings = netEarnings - Number(deductYTD);
                }
                var ytdFuelSS =  search.create({
                    type: "customrecord_ah_fuel_purchases",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                           
                            /* "AND",
                             ["custrecord186", "within", formatFirst, weekofDate],
                            "AND",
                            ["custrecord196.custrecord_driver_vendor", "anyof", recID],*/
                            "AND",
                            ["custrecord198", "anyof", locationID],
                            "AND",
                            ["created","within",ytdStartDate,ytdEndDate]
                            // ["formuladate: NVL({custrecord350}, {custrecord186})","within",formatFirst,weekofDate]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord189",
                                summary: "SUM",
                                label: "Cost"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD192",
                                summary: "GROUP",
                                label: "Truck Internal ID"
                            }),
                            search.createColumn({
                                name: "custrecord196",
                                summary: "GROUP",
                                label: "Driver"
                            })
                        ]
                });
                ["custrecord192.internalid", "anyof", truckID],
                ytdFuelSS.filters.push(search.createFilter({
                    name: "internalid",
                    join: "custrecord192",
                    operator: "anyof",
                    values: truckID
                }))
                var ytdFuelResults = ytdFuelSS.run().getRange({start:0,end:5});
                var fuelAmt =0;
                if(ytdFuelResults.length !==0){
                    fuelAmt = ytdFuelResults[0].getValue({
                        name: "custrecord189",
                        summary: "SUM"
                    });
                    netEarnings = netEarnings - Number(fuelAmt);
                }
                finalObj.ytdRange = dateRange;
                if(Number(earningAmt) < 0) {
                    earningAmt = earningAmt * -1;
                    finalObj.ytdEarnings = "("+Number(earningAmt).toFixed(2)+")";
                }else{
                    finalObj.ytdEarnings = Number(earningAmt).toFixed(2);
                }
                finalObj.ytdDeduction = Number(deductYTD).toFixed(2);
                finalObj.ytdFuel = Number(fuelAmt).toFixed(2);
                if(Number(netEarnings) < 0) {
                    netEarnings = netEarnings * -1;
                    finalObj.ytdTotal = "("+Number(netEarnings).toFixed(2)+")";
                }else{
                    finalObj.ytdTotal = Number(netEarnings).toFixed(2);
                }
                finalObj.payDate = pmtDate;
                finalObj.weekEnding = weekofDate;
                var truckObj = search.lookupFields({
                    type:'customrecord_truck_record',
                    id:truckID,
                    columns:['name', 'custrecord163']
                });
                var truckNum = truckObj.name;
                var leaseAmt = truckObj.custrecord163;
                var startDate = weekofDate + " 12:00 am";
                var endDate = finalDate + " 11:59 pm";
                log.debug('Date Range', startDate + " - "+endDate)
                var detailSearch = search.create({
                    type: "customrecord_agency_mf_media",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord155.internalid","anyof",recID],
                            "AND",
                            ["created", "within", startDate, endDate],
                            "AND",
                            ["custrecord_truck.internalid", "anyof", truckID],
                            "AND",
                            ["custrecord_agency_mf_created_from.mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord_agency_mf_created_from", label: "Created From"}),
                            search.createColumn({
                                name: "tranid",
                                join: "CUSTRECORD_AGENCY_MF_CREATED_FROM",
                                label: "Document Number"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD_AGENCY_MF_CREATED_FROM",
                                label: "Internal ID"
                            }),
                            search.createColumn({name: "custrecord_agency_mf_order", label: "Order"}),
                            search.createColumn({
                                name: "custrecord_truck",
                                label: "Truck"
                            }),
                            search.createColumn({
                                name: "custrecord_agency_mf_delivery_date",
                                sort: search.Sort.ASC, label: "Delivery Date"
                            }),
                            search.createColumn({name: "custrecord197",
                                sort: search.Sort.ASC, label: "Ticket Number"}),
                            search.createColumn({
                                name: "custrecord_agency_mf_quantity_1",
                                label: "Media Fulfillment Quantity"
                            }),
                            search.createColumn({name: "custrecord155", label: "Vendor #"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_4", label: "Leasing Fee"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_5", label: "Mileage"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_6", label: "Total Revenue"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_7", label: "Total Cost"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_8", label: "Total Income"}),
                            search.createColumn({name: "custrecord_agency_mf_quantity_9", label: "Margin"}),
                            search.createColumn({name:"custrecord_agency_mf_quantity_3", label: "Fuel Surcharge (Truck)"}),
                            search.createColumn({name: "custrecord_ah_location", label: "Location"}),
                            search.createColumn({
                                name: "custrecord163",
                                join: "CUSTRECORD_TRUCK",
                                label: "Lease Fee"
                            })
                        ]
                });
                var detailResults = detailSearch.run().getRange({start: 0, end: 999});
                var totalEarnings = 0;

                if (detailResults.length !== 0) {
                    for (var x = 0; x < detailResults.length; x++) {
                        var tranObj = {};
                        var tranName = '';
                        var tranDate = '';
                        var truckFrom = '';
                        var truckTo = '';
                        var truckTons = 0;
                        var truckGross = 0;
                        var truckFee = 0;
                        var truckNet = 0;
                        var truckMiles = 0;
                        var truckRate = 0;
                        var tranID = detailResults[x].getValue({
                            name: "tranid",
                            join: "CUSTRECORD_AGENCY_MF_CREATED_FROM"
                        });
                        var truck_ID = detailResults[x].getValue('custrecord_truck');
                        var truckName = detailResults[x].getText({
                            name: "custrecord_truck"
                        });
                        var truckRec = record.load({
                            type: 'customrecord_truck_record',
                            id: truck_ID
                        });
                        //var recName = truckRec.getValue('name');
                        var vendorID = truckRec.getValue('custrecord157');
                        var vendorObj = search.lookupFields({
                            type: 'vendor',
                            id: vendorID,
                            columns: ['altname']
                        });
                        var vendorName = vendorObj.altname;
                        var driverName = truckRec.getText('custrecord166');
                        var isSame = '';
                        if (vendorName === driverName) {
                            isSame = 'SAME';
                        }
                        var detailName = detailResults[x].getValue("custrecord197");
                        if (detailName.indexOf('&') !== -1) {
                            detailName = detailName.replace(/&/g, '&amp;');
                        }
                        var detailDate = detailResults[x].getValue("custrecord_agency_mf_delivery_date");
                        /*var detailFrom = detailResults[x].getText({
                            name: "custrecord_ah_location",
                            summary: "GROUP"
                        });*/
                        var soID = detailResults[x].getValue({
                            name: "internalid",
                            join: "CUSTRECORD_AGENCY_MF_CREATED_FROM"
                        });
                        var detailToObj = search.lookupFields({
                            type: search.Type.SALES_ORDER,
                            id: soID,
                            columns: ['custbody7', 'custbody8']
                        });
                        var detailTo = detailToObj.custbody8;
                        var detailFrom = detailToObj.custbody7;
                        if (detailFrom.indexOf('&') !== -1) {
                            detailFrom = detailFrom.replace(/&/g, '&amp;');
                        }
                        if (detailTo.indexOf('&') !== -1) {
                            detailTo = detailTo.replace(/&/g, '&amp;');
                        }
                        if (isEmpty(detailTo)) {
                            detailTo = '';
                        }
                        if (isEmpty(detailFrom)) {
                            detailFrom = '';
                        }
                        var detailTons = detailResults[x].getValue("custrecord_agency_mf_quantity_1");
                        var detailRevenue = detailResults[x].getValue("custrecord_agency_mf_quantity_6");
                        var detailFee = detailResults[x].getValue("custrecord_agency_mf_quantity_8");
                        var detailNet = detailResults[x].getValue("custrecord_agency_mf_quantity_7");
                        var fuelSurcharge = detailResults[x].getValue("custrecord_agency_mf_quantity_3");
                        totalEarnings += Number(detailNet);
                        var detailMiles = detailResults[x].getValue('custrecord_agency_mf_quantity_5');
                        var detailRate = Number(detailRevenue) / Number(detailTons);
                        tranObj.tranName = detailName;
                        tranObj.tranDate = detailDate;
                        tranObj.truckFrom = detailFrom;
                        tranObj.truckTo = detailTo;
                        tranObj.truckTons = Number(detailTons).toFixed(2);
                        if(Number(detailRevenue) < 0) {
                            detailRevenue = detailRevenue * -1;
                            tranObj.truckGross = "("+Number(detailRevenue).toFixed(2)+")";
                        }else{
                            tranObj.truckGross = Number(detailRevenue).toFixed(2);
                        }
                        if(Number(detailFee) < 0) {
                            detailFee = detailFee * -1;
                            tranObj.truckFee = "("+Number(detailFee).toFixed(2)+")";
                        }else{
                            tranObj.truckFee = Number(detailFee).toFixed(2);
                        }
                        if(Number(detailNet) < 0) {
                            detailNet = detailNet * -1;
                            tranObj.truckNet = "("+Number(detailNet).toFixed(2)+")";
                        }else{
                            tranObj.truckNet = Number(detailNet).toFixed(2);
                        }
                        tranObj.truckMiles = detailMiles;
                        if(Number(detailRate) < 0) {
                            detailRate = detailRate * -1;
                            tranObj.truckRate = "("+Number(detailRate).toFixed(2)+")";
                        }else{
                            tranObj.truckRate = Number(detailRate).toFixed(2);
                        }
                        if(Number(fuelSurcharge) < 0) {
                            fuelSurcharge = fuelSurcharge * -1;
                            tranObj.truckFSC = "("+Number(fuelSurcharge).toFixed(2)+")";
                        }else{
                            tranObj.truckFSC = Number(fuelSurcharge).toFixed(2);
                        }
                        tran_arr.push(tranObj);
                    }
                }
                finalObj.truck = truckNum;
                finalObj.leaseFee = leaseAmt;
                finalObj.earningData = tran_arr;
                if(Number(totalEarnings) < 0) {
                    totalEarnings = totalEarnings * -1;
                    finalObj.earningTotal = "("+Number(totalEarnings).toFixed(2)+")";
                }else{
                    finalObj.earningTotal = Number(totalEarnings).toFixed(2);
                }
                finalObj.earningCount = detailResults.length;
                var fuelDetailSearch = search.create({
                    type: "customrecord_ah_fuel_purchases",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                         
                            /*"AND",
                            ["custrecord186", "within", priorDate, weekofDate],
                            "AND",
                            ["custrecord196.custrecord_driver_vendor", "anyof", recID],*/
                            "AND",
                            ["custrecord198", "anyof", locationID],
                            "AND",
                            //["formuladate: NVL({custrecord350}, {custrecord186})","within",weekofDate,finalDate]
                            ["created", "within", startDate, endDate]
                        ],
                    columns:
                        [
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord193", label: "Order"}),
                            search.createColumn({name: "custrecord195", label: "Type"}),
                            search.createColumn({
                                name: "custrecord186",
                                sort: search.Sort.ASC, label: "Date"
                            }),
                            search.createColumn({name: "custrecord209", label: "Subsidiary"}),
                            search.createColumn({name: "custrecord198", label: "Location"}),
                            search.createColumn({name: "custrecord187", label: "Gallons"}),
                            search.createColumn({name: "custrecord188", label: "Price"}),
                            search.createColumn({name: "custrecord189", label: "Cost"}),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD192",
                                label: "Truck Internal ID"
                            }),
                            search.createColumn({name: "custrecord196", label: "Driver"}),
                            search.createColumn({name: "custrecord259", label: "Fueling Location"}),
                            search.createColumn({name: "custrecord257", label: "Fuel Fee"}),
                        ]
                });
                if(truckID.length > 0){
                    fuelDetailSearch.filters.push(search.createFilter({
                        name : "internalid",
                        join : "custrecord192",
                        operator: "anyof",
                        values: truckID
                    }));
                }
                var fuelResults = fuelDetailSearch.run().getRange({start: 0, end: 99});
                //var main_arr = [];
                var fee_arr = [];
                var totalFee = 0;
                if (fuelResults.length !== 0) {
                    for (var i = 0; i < fuelResults.length; i++) {
                        var fuelObj = {};
                        var tranid = '';
                        var date = '';
                        var station = '';
                        var location = '';
                        var gallons = '';
                        var price = 0;
                        var fee = 0;
                        var total = 0;
                        var fuelOrder = fuelResults[i].getText('custrecord193');
                        var fuelDate = fuelResults[i].getValue('custrecord186');
                        var fuelLocation = fuelResults[i].getText('custrecord198');
                        if (fuelLocation.indexOf('&') !== -1) {
                            fuelLocation = fuelLocation.replace(/&/g, '&amp;');
                        }
                        var fuelGallons = fuelResults[i].getValue('custrecord187');
                        var fuelPrice = fuelResults[i].getValue('custrecord188');
                        var fuelFee = fuelResults[i].getValue('custrecord257');

                        var fuelCost = fuelResults[i].getValue('custrecord189');
                        var fuelType = fuelResults[i].getText('custrecord195');
                        if (fuelType.indexOf('&') !== -1) {
                            fuelType = fuelType.replace(/&/g, '&amp;');
                        }
                        var fuelStation = fuelResults[i].getValue('custrecord259');
                        if (fuelStation.indexOf('&') !== -1) {
                            fuelStation = fuelStation.replace(/&/g, '&amp;');
                        }
                        totalFee += Number(fuelCost);
                        fuelObj.tranid = fuelType;
                        fuelObj.date = fuelDate;
                        fuelObj.location = fuelLocation;
                        fuelObj.gallons = Number(fuelGallons).toFixed(2);
                        fuelObj.type = fuelStation;
                        if(isEmpty(fuelFee)) {
                            fuelFee = 0;
                        }
                        fuelObj.fee = Number(fuelFee).toFixed(2);
                        fuelObj.price = Number(fuelPrice).toFixed(2);
                        fuelObj.total = Number(fuelCost).toFixed(2);
                        fee_arr.push(fuelObj)
                    }
                }
                finalObj.fuelTotal = Number(totalFee).toFixed(2);
                finalObj.fuelCount = fuelResults.length;
                finalObj.fuelData = fee_arr;
                var deductionSearch = search.create({
                    type: "customrecord_ah_deductions",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["created", "within", startDate, endDate],
                            "AND",
                            ["custrecord_ah_truck_id.internalid", "anyof", truckID],
                            "AND",
                            ["custrecord185","anyof",recID]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "id",
                                sort: search.Sort.ASC,
                                label: "ID"
                            }),
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord_ah_deduction_type", label: "Deduction Type"}),
                            search.createColumn({name: "custrecord_ah_start_date", label: "Start Date"}),
                            search.createColumn({name: "custrecord_ah_end_date", label: "End Date"}),
                            search.createColumn({name: "custrecord_ah_occurance_field", label: "Occurrence"}),
                            search.createColumn({name: "custrecord_ah_amount", label: "Amount"}),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD_AH_TRUCK_ID",
                                label: "Truck Internal ID"
                            })
                        ]
                });
                var deductionResults = deductionSearch.run().getRange({start: 0, end: 99});
                var deduction_arr = [];
                var totalDeduction = 0;
                if (deductionResults.length !== 0) {
                    for (var d = 0; d < deductionResults.length; d++) {
                        var deductionObj = {};
                        var deductDesc = '';
                        var deductAmt = 0;
                        var deductType = deductionResults[d].getText('custrecord_ah_deduction_type');
                        var totalAmt = deductionResults[d].getValue('custrecord_ah_amount');
                        if (deductType.indexOf('&') !== -1) {
                            deductType = deductType.replace(/&/g, '&amp;');
                        }
                        totalDeduction += Number(totalAmt);
                        deductionObj.deductDesc = deductType;
                        deductionObj.deductAmt = Number(totalAmt).toFixed(2);
                        deduction_arr.push(deductionObj);
                    }
                }

                var totalFees = Number(totalFee) + Number(totalDeduction);
                weekTotal = Number(totalEarnings) - totalFees;
                finalObj.deductionData = deduction_arr;
                finalObj.deductionTotal = Number(totalDeduction).toFixed(2);
                finalObj.deductionCount = deductionResults.length;
                if(Number(totalEarnings) < 0) {
                    totalEarnings = totalEarnings * -1;
                    finalObj.weekEarnings = "("+Number(totalEarnings).toFixed(2)+")";
                }else{
                    finalObj.weekEarnings = Number(totalEarnings).toFixed(2);
                }
                finalObj.weekFuel = Number(totalFee).toFixed(2);
                finalObj.weekDeduction = Number(totalDeduction).toFixed(2);
                if(Number(weekTotal) < 0) {
                    weekTotal = weekTotal * -1;
                    finalObj.weekNet = "("+Number(weekTotal).toFixed(2)+")";
                }else{
                    finalObj.weekNet = Number(weekTotal).toFixed(2);
                }
                if(deductionResults.length ===0 &&fuelResults.length===0&&detailResults.length===0) {
                    log.debug("No Truck Data")
                }else{
                    finalArr.push(finalObj);
                }
            }
            headObj.statementData = finalArr;
            head_arr.push(headObj);
            return head_arr;
        }
        function getDrivers(recID){
            var driver_arr = [];
            var driverSearch = search.create({
                type: "customrecorddriver_information",
                filters:
                    [
                        ["custrecord_driver_vendor.internalid","anyof",recID]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "name", label: "Name"}),
                        search.createColumn({
                            name: "custrecord_driver_vendor",
                            sort: search.Sort.ASC,
                            label: "Vendor"
                        })
                    ]
            });
            var driverResults = driverSearch.run().getRange({start:0,end:999});
            if(driverResults.length !==0){
                for(var i=0;i<driverResults.length;i++){
                    var driverID = driverResults[i].getValue('internalid');
                    driver_arr.push(driverID);
                }
            }
            return driver_arr;
        }
        function getTrucks(recID){
            var truck_arr = [];
            var truckSearch = search.create({
                type: "customrecord_truck_record",
                filters:
                    [
                        ["custrecord157","anyof",recID],
                        /*"AND",
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]*/
                    ],
                columns:
                    [
                        search.createColumn({name: "name", label: "Name"}),
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
            });
            var truckResults = truckSearch.run().getRange({start:0,end:999});
            if(truckResults.length !==0) {
                for (var t = 0; t < truckResults.length; t++) {
                    var truckID = truckResults[t].getValue({
                        name: "internalid"
                    });
                    truck_arr.push(truckID);
                }
            }
            return truck_arr;
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
                
                /*
                log.debug("inputContext", inputContext)
                var scriptObj = runtime.getCurrentScript();
                var recID = scriptObj.getParameter('custscript_pdf_rec_id');
                var rawDate = scriptObj.getParameter('custscript_pdf_weekof_date');
                var dataArr = [{"recordid":recID,"weekOf":rawDate}];

                log.debug("getInputData", dataArr)
                return dataArr;
                */

                let SS_ID = runtime.getCurrentScript().getParameter({name: SPARAM_VENDOR_SS});
                if(SS_ID){
                    return search.load({id: SS_ID});
                }

                
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

                var forMassApproval = runtime.getCurrentScript().getParameter({name: SPARAM_FOR_MASS_APPROVAL});
                if(forMassApproval == 'T' || forMassApproval == true){
                    var lastSaturday =  getLastSaturdayDate();
                    var vendorId = mapValues.values["GROUP(internalid.vendor)"].value
                    mapContext.write({
                        key: vendorId, //mapValues.recordid,
                        value: lastSaturday
                    });
                }
                else{
                    mapContext.write({
                        key: mapContext.key, //mapValues.recordid,
                        value: mapValues.values.custentity_ctc_statement_date//mapValues.weekOf
                    });
                }
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
                var scriptObj = runtime.getCurrentScript();
                log.debug("", "------reduce------");
                log.debug("reduceContext", reduceContext)
                var recID = reduceContext.key;
                var rawDate = reduceContext.values[0];
                log.debug("rawDate -- before", rawDate);
                if(rawDate == null || rawDate == '' || rawDate == undefined){
                    rawDate = getLastSaturdayDate();
                    log.debug("rawDate -- after", rawDate);
                }
                log.debug("recID", recID);
                log.debug("rawDate", rawDate);
                var xmlTemplateFile = file.load('SuiteScripts/nscs_xml_vendor_settlement.xml');
                var renderer = render.create();
                renderer.templateContent = xmlTemplateFile.getContents();
                renderer.addRecord('companyInformation', config.load({
                    type: config.Type.COMPANY_INFORMATION
                }));
                var head_arr = [];
                var headObj = {};
                var weekofDate = new Date(rawDate);
                var sevenDaysPrior = new Date(weekofDate - 8 * 24 * 60 * 60 * 1000);
                var formatPrior = formatDate(sevenDaysPrior);
                var dateStr = rawDate;
                var days = 7;
                var todaysDate = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + days));
                var formatToday = formatDate(todaysDate);
                days = 13;
                var pmtDate = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + days));
                var formatPmt = formatDate(pmtDate);
                log.debug("formatToday", formatToday)
                days = 7;
                var rawPrint = new Date((new Date(dateStr).setDate(new Date(dateStr).getDate() + days)));
                var printDate = formatDate(rawPrint);
                log.debug("Print Date", printDate)
                var vendorRec = record.load({type:record.Type.VENDOR,id:recID});
                renderer.addRecord("record",vendorRec);
                var subID = vendorRec.getValue('subsidiary');
                renderer.addRecord('subsidiary', record.load({
                    type:record.Type.SUBSIDIARY,
                    id:subID
                }));
                var locationID = vendorRec.getValue('custentity2');
                var emailObj = search.lookupFields({
                    type:search.Type.LOCATION,
                    id:locationID,
                    columns:['custrecordemail_address']
                });
                var locationEmail = emailObj.custrecordemail_address;
                var driverData = getDrivers(recID);
                var truckID_arr = getTrucks(recID);
                log.debug('truckID_arr', truckID_arr)
                var statementData = getStatement(recID,driverData,formatPmt,rawDate,truckID_arr,locationID,formatToday,weekofDate);
                var leaseData = leaseFees(recID);
                var fuelData = totalFuel(recID,formatPmt,rawDate,truckID_arr,formatToday);
                var deductionData = totalDeduction(recID,formatPmt,rawDate,truckID_arr,formatToday);
                var earningsData = totalEarnings(recID,formatPmt,rawDate,truckID_arr,formatToday);
                var adjustmentData = getAdjustments(recID,driverData,formatPmt,rawDate,formatToday);
                headObj.email = locationEmail;
                headObj.print = printDate;
                headObj.lease = leaseData;
                headObj.earnings = earningsData;
                headObj.fuel = fuelData;
                headObj.deduction = deductionData;
                headObj.adjustment = adjustmentData;
                headObj.ytd = ytdValues(recID,weekofDate,formatToday,driverData,rawDate,truckID_arr);
                headObj.week = weekValues(recID,rawDate,formatToday,formatPmt,driverData,truckID_arr);
                headObj.statement = statementData;
                head_arr.push(headObj);
                var items = {};
                items.item = head_arr;
                log.debug('items Array', 'items:' + JSON.stringify(items))
                renderer.addCustomDataSource({
                    format: render.DataSource.JSON,
                    alias: "ITEMS",
                    data: JSON.stringify(items)
                });
                var vendorObj = search.lookupFields({
                    type:search.Type.VENDOR,
                    id:recID,
                    columns:['entityid']
                });
                var entityID = vendorObj.entityid;
                var folderID = scriptObj.getParameter('custscript_pdf_folder_id');
                var vendorPDF = renderer.renderAsPdf();
                vendorPDF.folder = folderID;
                vendorPDF.name = "vendor_settlement_"+ entityID+"_"+rawDate;
                var pdfFile =  vendorPDF.save();

                //Update Vendor to set field to blank:
                record.submitFields({
                    type: record.Type.VENDOR,
                    id: recID,
                    values: {
                        'custentity_ctc_statement_date': '',
                        'custentity_pdf_foremailsending': ''
                    }
                });
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
            try{

                const calledByEmailAutomation = runtime.getCurrentScript().getParameter({name: SPARAM_CALLED_BY_EMAIL_AUTOMATION});

                if(calledByEmailAutomation || calledByEmailAutomation == 'T'){
                    //Call CTC - Email Automation - Vendor MR
                    let mrTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_ctc_mr_emailautomation',
                        deploymentId: 'customdeploy_emailautomation_vendor_sch',
                        params: {
                            'custscript_emailautomation_pdfs_created' : true
                        }
                    });

                    mrTask.submit();

                    log.debug("Called Email Automation");

                }

                let SS_ID = runtime.getCurrentScript().getParameter({
                    name: SPARAM_VENDOR_SS
                });
                // Check if more records remain in the saved search
                var getInputSS = search.load({
                    id: SS_ID
                });

                var entityColumn =  search.createColumn({
                    name: 'entity',
                    summary: search.Summary.GROUP
                });

                getInputSS.columns.push(entityColumn);
                
                var remainingRecords = getInputSS.run().getRange({ start: 0, end: 1000 });
                log.debug("remaining Records result", remainingRecords);
                remainingRecords = remainingRecords.length;

                log.debug("remainingRecords", remainingRecords);
                var mapKeys = [];
                summaryContext.mapSummary.keys.iterator().each(function (key)
                    {
                        mapKeys.push(key);
                        return true;
                    });
                log.audit('MAP keys processed', mapKeys);

                if ((remainingRecords>0) && (remainingRecords != mapKeys.length) && mapKeys.length != 0) {
                    
                    // Resubmit the Map/Reduce script if more records are found
                    var scriptTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_nscs_mr_vendor_settlement',
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
                        details: 'No more Vendor Statements to process.'
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
            }catch(error){
                log.error('Error', error)
            }
        }
        function getLastSaturdayDate() {
            const today = new Date();
            const dayOfWeek = today.getDay();  // Get the current day of the week (0 is Sunday, 6 is Saturday)
            const lastSaturday = new Date(today);
        
            // Calculate the number of days to subtract to get to the last Saturday
            // If today is Sunday (0), subtract 1 day more than usual to get the previous week's Saturday.
            if (dayOfWeek === 0) {  // Special case for Sunday
                lastSaturday.setDate(today.getDate() - 8);
            } else {
                lastSaturday.setDate(today.getDate() - (dayOfWeek + 1));
            }
        
            // Padding month and day to ensure MM/DD/YYYY format
            const dd = String(lastSaturday.getDate()).padStart(2, '0');
            const mm = String(lastSaturday.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = lastSaturday.getFullYear();
        
            return mm + '/' + dd + '/' + yyyy;  // Return formatted date string
        }
        

        return {getInputData, map, reduce, summarize}

    });
