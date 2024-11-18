/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/format', 'N/record', 'N/redirect', 'N/render', 'N/runtime', 'N/search', 'N/ui/serverWidget','N/config'],
    /**
     * @param{file} file
     * @param{format} format
     * @param{record} record
     * @param{redirect} redirect
     * @param{render} render
     * @param{runtime} runtime
     * @param{search} search
     * @param{serverWidget} serverWidget
     * @param{config} config
     */
    function(file, format, record, redirect, render, runtime, search,serverWidget,config) {
        function ytdValues(recID,weekofDate,payDate,driverData,formatWeek){
            //log.debug("Current Date", payDate)
            var firstDay =new Date(weekofDate.getFullYear(), 0);
            var formatFirst = formatDate(firstDay);
            //log.debug("First Day of the year", formatFirst)
            var ytd_arr = [];
            var ytdObj = {};
            var ytdEarnings = 0;
            var ytdFuel = 0;
            var ytdDeduction = 0;
            var netEarnings = 0;
            var ytdEarningSS = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["custrecord_agency_mf_delivery_date","within",formatFirst,formatWeek]
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
                            name: "custrecord_agency_mf_quantity_8",
                            summary: "SUM",
                            label: "Total Income"
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
                    name: "custrecord_agency_mf_quantity_8",
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
                        "AND",
                        ["custrecord192.internalid","noneof","@NONE@"],
                        "AND",
                        ["custrecord186","within",formatFirst,formatWeek],
                        "AND",
                        ["custrecord196","anyof",driverData]
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
                        ["custrecord_ah_start_date","within",formatFirst,formatWeek]
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
                        ["vendor.internalid","noneof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", formatFirst,formatWeek]
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
            // deductAmt = Number(deductAmt) * -1;
            //log.debug("Total Earnings", netEarnings)
            ytdObj.ytdEarnings = Number(earningAmt).toFixed(2);
            ytdObj.ytdFuel =Number(fuelAmt).toFixed(2);
            ytdObj.ytdDeduction = Number(deductAmt).toFixed(2);
            ytdObj.ytdAdjustment = adjustYTD.toFixed(2)
            ytdObj.dateRange = formatFirst + ' - '+formatWeek;
            ytdObj.netAmt = Number(netEarnings).toFixed(2);
            ytd_arr.push(ytdObj);
            //log.debug("ytd Obj", ytd_arr)
            return ytd_arr;
        }
        function weekValues(recID,weekofDate,payDate,priorDate,driverData){
            var totalWeek = 0;
            var week_arr = [];
            var weekObj = {};
            var weekEarningSS = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord155",
                            summary: "GROUP",
                            label: "Vendor #"
                        }),
                        search.createColumn({
                            name: "custrecord_agency_mf_quantity_8",
                            summary: "SUM",
                            label: "Total Income"
                        })
                    ]
            });
            var weekEarningResults = weekEarningSS.run().getRange({start:0,end:5});
           // log.debug("Earning Results", weekEarningResults)
            if(weekEarningResults.length !==0){
                var earningAmt = weekEarningResults[0].getValue({
                    name: "custrecord_agency_mf_quantity_8",
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
                        ["custrecord196","anyof",driverData],
                        "AND",
                        ["custrecord186","within",priorDate,weekofDate]
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
                        ["custrecord_ah_start_date","within",priorDate,weekofDate]
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
                        ["vendor.internalid","noneof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", priorDate,weekofDate]
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
                totalWeek += Number(creditAmt);
            }
            //deductAmt = Number(deductAmt) * -1;
            weekObj.weekEarnings = Number(earningAmt).toFixed(2);
            weekObj.weekFuel =Number(fuelAmt).toFixed(2);
            weekObj.weekDeduction = Number(deductAmt).toFixed(2);
            weekObj.weekAdjust = Number(creditAmt).toFixed(2);
            weekObj.weekEnd = weekofDate;
            weekObj.pmtDate = payDate;
            weekObj.weekTotal = Number(totalWeek).toFixed(2);
            week_arr.push(weekObj);
            //log.debug("week Obj", week_arr)
            return week_arr;
        }
        function totalEarnings(recID,priorDate,weekofDate){
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
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]

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
                            name: "custrecord_agency_mf_quantity_8",
                            summary: "SUM",
                            label: "Total Income"
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
                        name: "custrecord_agency_mf_quantity_8",
                        summary: "SUM"
                    });
                    if(!isEmpty(lineAmt)){
                        totalAmt += Number(lineAmt);
                    }
                    earningCount += Number(ticketCt);
                    earningObj.truck = truckNum;
                    earningObj.count = ticketCt;
                    earningObj.amount = Number(lineAmt).toFixed(2);
                    earning_arr.push(earningObj);
                }
            }
            //
            finalObj.total = Number(totalAmt).toFixed(2);
            finalObj.earningNum = earningCount;
            finalObj.data = earning_arr;
            final_arr.push(finalObj);
            //log.debug("Earning Obj", final_arr)
            return final_arr;
        }
        function totalFuel(recID,priorDate,weekofDate,truckIDs) {
            var fuel_arr = [];
            var final_arr = [];
            var finalObj = {};
            var totalAmt = 0;
            var fuelSearch = search.create({
                type: "customrecord_ah_fuel_purchases",
                filters:
                    [
                        ["custrecord196","anyof",recID],
                        "AND",
                        ["custrecord186","within",priorDate,weekofDate]
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
            var fuelResults = fuelSearch.run().getRange({start:0,end:999});
            //log.debug("fuel results", fuelResults)
            var fuelCount = 0;
            if(fuelResults.length!==0){
                for(var a=0;a<fuelResults.length;a++){
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
                    if(!isEmpty(lineAmt)){
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
            //log.debug("fuel Obj", final_arr)
            return final_arr;
        }
        function totalDeduction(recID,priorDate,weekofDate){
            var deduction_arr = [];
            var final_arr = [];
            var finalObj = {};
            var totalAmt = 0;
            var deductionSearch = search.create({
                type: "customrecord_ah_deductions",
                filters:
                    [
                        ["custrecord185.internalid","anyof",recID],
                        "AND",
                        ["custrecord_ah_truck_id","noneof","@NONE@"],
                        "AND",
                        ["custrecord_ah_start_date","within",priorDate,weekofDate]
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

            //totalAmt = totalAmt  -1;
            //log.debug("deduction Obj", deduction_arr)
            finalObj.total = Number(totalAmt).toFixed(2);
            finalObj.deductionNum = deductionCount;
            finalObj.data = deduction_arr;
            final_arr.push(finalObj);
            //log.debug("Deduction Obj", final_arr)
            return final_arr;
        }
        function leaseFees(recID,priorDate,weekofDate){
            var lease_arr=[];
            var leaseFeeSearch = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_truck",
                            summary: "GROUP",
                            label: "Truck"
                        }),
                        search.createColumn({
                            name: "custrecord155",
                            summary: "GROUP",
                            label: "Vendor #"
                        }),
                        search.createColumn({
                            name: "custrecord163",
                            join: "CUSTRECORD_TRUCK",
                            summary: "GROUP",
                            label: "Lease Fee"
                        })
                    ]
            });
           // log.debug('leaseFeeSearch', leaseFeeSearch)
            var leaseResults = leaseFeeSearch.run().getRange({start:0,end:999});
            if(leaseResults.length!==0){
                for(var x=0;x<leaseResults.length;x++){
                    var leaseObj = {};
                    var truck= '';
                    var fee = '';
                    var truckID = leaseResults[x].getValue({
                        name: "custrecord_truck",
                        summary: "GROUP"
                    });
                    var truckName = leaseResults[x].getText({
                        name: "custrecord_truck",
                        summary: "GROUP"
                    });
                    var leaseFee = leaseResults[x].getValue({
                        name: "custrecord163",
                        join: "CUSTRECORD_TRUCK",
                        summary: "GROUP"
                    });
                    leaseObj.truck = truckName;
                    leaseObj.fee = leaseFee;
                    lease_arr.push(leaseObj);
                }
            }
            //('Fee Obj', lease_arr)
            return lease_arr;
        }
        function getAdjustments(recID,driverData,priorDate,weekofDate){
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
                        ["vendor.internalid","noneof",recID],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["trandate", "within", priorDate, weekofDate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP",
                            label: "Document Number"
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "COUNT",
                            label: "Internal ID"
                        })
                    ]
            });
            var creditResults = creditSearch.run().getRange({start:0,end:999});
            log.debug('creditResults', creditResults)
            var creditTotal = 0;
            var creditCount = 0;
            var creditArr = [];
            if(creditResults.length !==0){
                for(var c=0;c<creditResults.length;c++){
                    var creditObj = {};
                    var docnum = '';
                    var count = 0;
                    var amount = 0;
                    var creditNum = creditResults[c].getValue({
                        name: "tranid",
                        summary: "GROUP"});
                    var creditCt = creditResults[c].getValue({
                        name: "internalid",
                        summary: "COUNT"});
                    var creditAmt = creditResults[c].getValue({
                        name: "amount",
                        summary: "SUM"});
                    creditTotal += Number(creditAmt);
                    creditObj.docnum = creditNum;
                    creditObj.count = creditCt;
                    creditObj.amount = Number(creditAmt).toFixed(2);
                    creditArr.push(creditObj);
                }
            }
            headObj.lines = creditCount;
            headObj.total = creditTotal;
            headObj.data = creditArr;
            head_arr.push(headObj);
            return head_arr;
        }
        function getStatement(recID,driverData,priorDate,weekofDate,truckIDs,locationID,finalDate,rawDate){
            log.debug("Truck IDs", truckIDs)
            var headObj = {};
            var head_arr = [];
            var finalArr = [];
            var firstDay =new Date(rawDate.getFullYear(), 0);
            var formatFirst = formatDate(firstDay);
            var dateRange = formatFirst+" - "+weekofDate;
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
                            ["custrecord_agency_mf_delivery_date","within",formatFirst,weekofDate],
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
                                name: "custrecord_agency_mf_quantity_8",
                                summary: "SUM",
                                label: "Total Income"
                            })
                        ]
                });
                var ytdEarningResults = ytdEarningSS.run().getRange({start:0,end:5});
                var earningAmt = 0;
                if(ytdEarningResults.length !==0){
                    earningAmt = ytdEarningResults[0].getValue({
                        name: "custrecord_agency_mf_quantity_8",
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
                            ["custrecord_ah_start_date","within",formatFirst,weekofDate],
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
                            "AND",
                            ["custrecord192.internalid", "anyof", truckID],
                            "AND",
                            ["custrecord186", "within", formatFirst, weekofDate],
                            "AND",
                            ["custrecord196.custrecord_driver_vendor", "anyof", recID],
                            "AND",
                            ["custrecord198", "anyof", locationID]
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
                var ytdFuelResults = ytdFuelSS.run().getRange({start:0,end:5});
                var fuelAmt =0;
                if(ytdFuelResults.length !==0){
                    fuelAmt = ytdFuelResults[0].getValue({
                        name: "custrecord189",
                        summary: "SUM"
                    });
                    netEarnings = netEarnings - Number(fuelAmt);
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
                            ["vendor.internalid","noneof",recID],
                            "AND",
                            ["mainline","is","T"],
                            "AND",
                            ["trandate", "within", formatFirst,weekofDate]
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
                finalObj.ytdRange = dateRange;
                finalObj.ytdEarnings = Number(earningAmt).toFixed(2);
                finalObj.ytdDeduction = Number(deductYTD).toFixed(2);
                finalObj.ytdFuel = Number(fuelAmt).toFixed(2);
                finalObj.ytdAdjustment = adjustYTD.toFixed(2);
                finalObj.ytdTotal = Number(netEarnings).toFixed(2);
                finalObj.payDate = finalDate;
                finalObj.weekEnding = weekofDate;
                var detailSearch = search.create({
                    type: "customrecord_agency_mf_media",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord155.internalid","anyof",recID],
                            "AND",
                            ["custrecord_agency_mf_delivery_date", "within", priorDate, weekofDate],
                            "AND",
                            ["custrecord_truck.internalid", "anyof", truckID],
                            "AND",
                            ["custrecord_agency_mf_created_from.mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({name: "id", label: "ID"}),
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
                            search.createColumn({name: "custrecord_ah_trucker_name", label: "Trucker Name"}),
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
                var truckNum = '';
                var leaseAmt = '';
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
                        if(!isEmpty(truckName)) {
                            truckNum = truckName;
                        }
                        var leasePercent = detailResults[x].getValue({
                            name: "custrecord163",
                            join: "CUSTRECORD_TRUCK"
                        });
                        if(!isEmpty(leasePercent)) {
                            leaseAmt = leasePercent;
                        }
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
                        //log.debug('Vendor Name', vendorName)
                        //var driverID = truckRec.getValue('custrecord166');
                        var driverName = truckRec.getText('custrecord166');
                        //log.debug('driver name', driverName)
                        var isSame = '';
                        if (vendorName === driverName) {
                            isSame = 'SAME';
                        }
                        var detailName = detailResults[x].getValue("custrecord197");
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
                        var detailFee = detailResults[x].getValue("custrecord_agency_mf_quantity_7");
                        var detailNet = detailResults[x].getValue("custrecord_agency_mf_quantity_8");
                        var fuelSurcharge = detailResults[x].getValue("custrecord_agency_mf_quantity_3");
                        totalEarnings += Number(detailNet);
                        var detailMiles = detailResults[x].getValue('custrecord_agency_mf_quantity_5');
                        var detailRate = Number(detailRevenue) / Number(detailTons);
                        //log.debug("detail Rate",detailRate)
                        tranObj.tranName = detailName;
                        tranObj.tranDate = detailDate;
                        tranObj.truckFrom = detailFrom;
                        tranObj.truckTo = detailTo;
                        tranObj.truckTons = Number(detailTons).toFixed(2);
                        tranObj.truckGross = Number(detailRevenue).toFixed(2);
                        tranObj.truckFee = Number(detailFee).toFixed(2);
                        tranObj.truckNet = Number(detailNet).toFixed(2);
                        tranObj.truckMiles = detailMiles;
                        tranObj.truckRate = Number(detailRate).toFixed(2);
                        tranObj.truckFSC = fuelSurcharge;
                        tran_arr.push(tranObj);
                    }
                }
                finalObj.truck = truckNum;
                finalObj.leaseFee = leaseAmt;
                finalObj.earningData = tran_arr;
                finalObj.earningTotal = Number(totalEarnings).toFixed(2);
                finalObj.earningCount = detailResults.length;
                var fuelDetailSearch = search.create({
                    type: "customrecord_ah_fuel_purchases",
                    filters:
                        [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord192.internalid", "anyof", truckID],
                            "AND",
                            ["custrecord186", "within", priorDate, weekofDate],
                            "AND",
                            ["custrecord196.custrecord_driver_vendor", "anyof", recID],
                            "AND",
                            ["custrecord198", "anyof", locationID]
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
                            search.createColumn({name: "custrecord194", label: "Billed"})
                        ]
                });
                var fuelResults = fuelDetailSearch.run().getRange({start: 0, end: 99});
                //var main_arr = [];
                var fee_arr = [];
                var totalFee = 0;
                if (fuelResults.length !== 0) {
                    // log.debug('Fuel Results', fuelResults)
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
                        var fuelGallons = fuelResults[i].getValue('custrecord187');
                        var fuelPrice = fuelResults[i].getValue('custrecord188');
                        var fuelCost = fuelResults[i].getValue('custrecord189');
                        var fuelType = fuelResults[i].getValue('custrecord195');
                        totalFee += Number(fuelCost);
                        fuelObj.tranid = fuelOrder;
                        fuelObj.date = fuelDate;
                        fuelObj.location = fuelLocation;
                        fuelObj.gallons = Number(fuelGallons).toFixed(2);
                        fuelObj.type = fuelType;
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
                            ["custrecord_ah_start_date", "within", priorDate, weekofDate],
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
                        totalDeduction += Number(totalAmt);
                        deductionObj.deductDesc = deductType;
                        deductionObj.deductAmt = Number(totalAmt).toFixed(2);
                        deduction_arr.push(deductionObj);
                    }
                }
                var adjustmentSearch = search.create({
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
                            ["vendor.internalid","noneof",recID],
                            "AND",
                            ["trandate", "within", priorDate, weekofDate]
                        ],
                    columns:
                        [
                            search.createColumn({name: "mainline", label: "*"}),
                            search.createColumn({name: "tranid", label: "Document Number"}),
                            search.createColumn({name: "entity", label: "Name"}),
                            search.createColumn({name: "item", label: "Item"}),
                            search.createColumn({name: "memo", label: "Memo"}),
                            search.createColumn({name: "amount", label: "Amount"}),
                            search.createColumn({name: "internalid", label: "Internal ID"})
                        ]
                });
                var adjustmentResults = adjustmentSearch.run().getRange({start:0,end:999});
                var adjustmentTotal =0;
                var adjustmentCount = 0;
                var adjustArr = [];
                if(adjustmentResults.length !==0){
                    for(var a=0;a<adjustmentResults.length;a++){
                        var adjustObj = {};
                        var item = '';
                        var memo = '';
                        var amount = 0;
                        var flag = '';
                        var lineFlag = "green"
                        var mainLine = adjustmentResults[a].getValue('mainline');
                        var adjustAmt = Number(adjustmentResults[a].getValue('amount'));
                        if(!isEmpty(mainLine)) {
                            var adjustItem = adjustmentResults[a].getValue('tranid');
                            lineFlag = "red";
                            adjustmentTotal += Number(adjustAmt);
                            adjustmentCount ++;
                        }else{
                            var adjustItem = adjustmentResults[a].getValue('item');
                            var adjustMemo = adjustmentResults[a].getValue('memo');
                        }
                        adjustAmt = adjustAmt * -1;
                        adjustObj.item = adjustItem;
                        adjustObj.memo = adjustMemo;
                        adjustObj.amount = adjustAmt;
                        adjustObj.flag = lineFlag;
                        adjustArr.push(adjustObj);
                    }
                }
                var totalFees = Number(totalFee) + Number(totalDeduction);
                weekTotal = Number(totalEarnings) - totalFees;
                finalObj.deductionData = deduction_arr;
                finalObj.deductionTotal = Number(totalDeduction).toFixed(2);
                finalObj.deductionCount = deductionResults.length;
                finalObj.adjustData = adjustArr;
                finalObj.adjustTotal = adjustmentTotal.toFixed(2);
                finalObj.adjustCount = adjustmentCount;
                finalObj.weekEarnings = Number(totalEarnings).toFixed(2);
                finalObj.weekFuel = Number(totalFee).toFixed(2);
                finalObj.weekDeduction = Number(totalDeduction).toFixed(2);
                finalObj.weekAdjustment = Number(adjustmentTotal).toFixed(2);
                finalObj.weekNet = Number(weekTotal).toFixed(2);
                finalArr.push(finalObj);
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
            //log.debug('Driver Array', driver_arr)
            return driver_arr;
        }
        function getTrucks(recID,priorDate,weekofDate){
            var truck_arr = [];
            var truckSearch = search.create({
                type: "customrecord_agency_mf_media",
                filters:
                    [
                        ["custrecord155.internalid","anyof",recID],
                        "AND",
                        ["custrecord_agency_mf_created_from.mainline","is","T"],
                        "AND",
                        ["custrecord_agency_mf_delivery_date","within",priorDate,weekofDate]
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
                            join: "CUSTRECORD_TRUCK",
                            summary: "GROUP",
                            label: "Truck Internal ID"
                        })
                    ]
            });
            //log.debug('truckSearch', truckSearch)
            var truckResults = truckSearch.run().getRange({start:0,end:999});
            //log.debug('truckResults', truckResults)
            if(truckResults.length !==0) {
                for (var t = 0; t < truckResults.length; t++) {
                    var truckID = truckResults[t].getValue({
                        name: "internalid",
                        join: "CUSTRECORD_TRUCK",
                        summary: "GROUP"
                    });
                    truck_arr.push(truckID);
                }
            }
            //log.debug("truck array", truck_arr)
            return truck_arr;
        }
        function formatDate(dateValue){
            var newDate = ((dateValue.getMonth() > 8) ? (dateValue.getMonth() + 1) : ('0' + (dateValue.getMonth() + 1))) + '/' + ((dateValue.getDate() > 9) ? dateValue.getDate() : ('0' + dateValue.getDate())) + '/' + dateValue.getFullYear();
            return newDate;
        }
        function isEmpty(stValue) {
            return ((stValue === 'none' || stValue === '' || stValue === null || stValue === undefined) || (stValue.constructor === Array && stValue.length === 0) ||
                (stValue.constructor === Object && (function(v) { for (var k in v) return false;return true; }) (stValue)));
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
                if (scriptContext.request.method === 'GET') {
                    var recordID = scriptContext.request.parameters.custparam_record_id;
                    var weekForm = serverWidget.createForm({
                        title: 'Week Of Selection'
                    });
                    var intID = weekForm.addField({
                        id:'custpage_int_id',
                        label:'Internal ID',
                        type:serverWidget.FieldType.TEXT
                    }).updateDisplayType({
                        displayType:serverWidget.FieldDisplayType.HIDDEN
                    }).defaultValue = recordID;
                    var weekOf = weekForm.addField({
                        id:'custpage_week_of',
                        label:'Week Of',
                        type:serverWidget.FieldType.DATE
                    });
                    weekForm.addSubmitButton('Submit');
                    scriptContext.response.writePage(weekForm);
                }else{
                    var reqParameters = scriptContext.request.parameters;
                    var scriptObjPost = runtime.getCurrentScript();
                    var renderer = render.create();
                    var xmlTemplateFile = file.load('SuiteScripts/nscs_xml_vendor_settlement.xml');
                    renderer.templateContent = xmlTemplateFile.getContents();
                    renderer.addRecord('companyInformation', config.load({
                        type: config.Type.COMPANY_INFORMATION
                    }));
                    var head_arr = [];
                    var headObj = {};
                    var rawDate = reqParameters.custpage_week_of;
                    log.debug("Raw Date", rawDate)
                    var weekofDate = new Date(rawDate);
                    //log.debug('Week of Date', weekofDate)
                    var sevenDaysPrior = new Date(weekofDate - 8 * 24 * 60 * 60 * 1000);
                    var formatPrior = formatDate(sevenDaysPrior);
                    log.debug('Beginning of Week', formatPrior)
                    var dateStr = rawDate;
                    var days = 13;
                    var todaysDate = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + days));
                    var formatToday = formatDate(todaysDate);
                    log.debug('Todays Date', formatToday)
                    var recID = reqParameters.custpage_int_id;
                    var vendorRec = record.load({type:record.Type.VENDOR,id:recID});
                    renderer.addRecord("record",vendorRec)
                    var locationID = vendorRec.getValue('custentity2');
                    log.debug("Location ID", locationID)
                    var emailObj = search.lookupFields({
                        type:search.Type.LOCATION,
                        id:locationID,
                        columns:['custrecordemail_address']
                    });
                    log.debug("emailObj",emailObj)
                    var locationEmail = emailObj.custrecordemail_address;
                    log.debug('locationEmail', locationEmail)
                    var driverData = getDrivers(recID);
                    var truckID_arr = getTrucks(recID,formatPrior,rawDate);
                    //log.debug("truckID_arr", truckID_arr)
                    var statementData = getStatement(recID,driverData,formatPrior,rawDate,truckID_arr,locationID,formatToday,weekofDate);
                    log.debug('Statement Data', statementData)
                    var leaseData = leaseFees(recID,formatPrior,rawDate);
                    var fuelData = totalFuel(driverData,formatPrior,rawDate,truckID_arr);
                    var deductionData = totalDeduction(recID,formatPrior,rawDate,truckID_arr);
                    var earningsData = totalEarnings(recID,formatPrior,rawDate,truckID_arr);
                    var adjustmentData = getAdjustments(recID,driverData,formatPrior,rawDate);
                    log.debug('adjustmentData', adjustmentData)
                    headObj.email = locationEmail;
                    headObj.lease = leaseData;
                    headObj.earnings = earningsData;
                    headObj.fuel = fuelData;
                    headObj.deduction = deductionData;
                    headObj.adjustment = adjustmentData;
                    headObj.ytd = ytdValues(recID,weekofDate,formatToday,driverData,rawDate);
                    headObj.week = weekValues(recID,rawDate,formatToday,formatPrior,driverData);
                    headObj.statement = statementData;
                    head_arr.push(headObj);
                    //log.debug('Main Array', head_arr)
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
                    //log.debug('Entity ID', entityID)
                    var folderID = scriptObjPost.getParameter('custscript_nscs_folder_id');
                    var vendorPDF = renderer.renderAsPdf();
                    vendorPDF.folder = folderID;
                    vendorPDF.name = "vendor_settlement_"+ entityID;
                    //var pdfFile =  vendorPDF.save();
                    //load file and redirect to url for printing
                    //var fileLoad = file.load({
                    //    id:pdfFile
                    //});
                    scriptContext.response.setHeader("Content-Type", "text/plain;charset=iso-8859-1");
                    scriptContext.response.writeFile(vendorPDF, true);
                }
            }catch(error){
                log.error("Error", error)
            }

        }

        return {onRequest}

    });
