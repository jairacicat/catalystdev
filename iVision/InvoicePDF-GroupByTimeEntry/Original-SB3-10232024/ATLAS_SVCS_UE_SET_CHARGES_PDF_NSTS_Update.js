/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log','N/runtime', './NSUtilvSS2_charges.js', 'N/url', 'N/file'],
    /**
     * @param {record} record
     * @param {search} search
     * @param {search} log
     * @param {search} NSUtil
     * @param {search} url
     * @param {record} file
     */
    function(record, search, log, runtime, NSUtil, url, file) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {
        	try{
            if (scriptContext.type != scriptContext.UserEventType.DELETE && scriptContext.type != scriptContext.UserEventType.PRINT && scriptContext.type != scriptContext.UserEventType.EDIT) {
            	var scriptObj = runtime.getCurrentScript();
            	var savedSearchID = scriptObj.getParameter({
            		name: "custscript_charge_saved_search"
            	});
                var searchCharges = search.load({
                    id: savedSearchID
                });

                var currentRecord = scriptContext.newRecord;

                log.debug({
                    title: 'scriptContext.newRecord.id',
                    details: scriptContext.newRecord.id
                });

                var objInvoice = record.load({
                    type: record.Type.INVOICE,
                    id: scriptContext.newRecord.id,
                    isDynamic: true,
                });
                var filter1 = search.createFilter({
                    name: 'internalid',
                    join: 'invoice',
                    operator: search.Operator.ANYOF,
                    values: [currentRecord.id]
                });
                searchCharges.filters.push(filter1);

                var objTimeCharges = new Array();
                var objProgressCharges = new Array();
                var objMilestoneCharges = new Array();
                var objFixedCharges = new Array();
                var objPurchaseCharges = new Array();
                var objExpenseCharges = new Array();

                searchCharges.run().each(function(result) {
                    /*
                    a - chargetype
                    b - rate
                    c - quantity
                    d - amount
                    e - chargedate
                    f - description
                    g - chargeemployee
                    */
                    var resultChargeType = strigyfyNull(result.getValue({
                        name: 'chargetype'
                    }));
                    if (resultChargeType === "Time-Based") {
                        objTimeCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Timetype": strigyfyNull(result.getText({
                                name: 'custcol_time_type',
                                join: 'time'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'casetaskevent',
                                join: 'time'
                            })),
                            "Billingclass": strigyfyNull(result.getText({
                                name: 'billingclass',
                                join: 'time'
                            })),
                            "Units": strigyfyNull(result.getText({
                                name: 'unit'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Expense-Based") {
                        objExpenseCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Transaction": strigyfyNull(result.getValue({
                                name: 'internalid',
                                join: 'transaction'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))
                        });
                    }

                    if (resultChargeType === "Milestone") {
                        objMilestoneCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'projecttask'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Purchase") {
                        objPurchaseCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'projecttask'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Project Progress") {
                        objProgressCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Fixed Date") {
                        objFixedCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    return true;
                });


                    log.debug({
                        title: 'arrSearchResults',
                        details: JSON.stringify(objTimeCharges)
                    });

                    objInvoice.setValue('custbody_charge_list_time', JSON.stringify(objTimeCharges));
                    objInvoice.setValue('custbody_charge_list_expense', JSON.stringify(objExpenseCharges));
                    objInvoice.setValue('custbody_charge_list_fixed', JSON.stringify(objFixedCharges));
                    objInvoice.setValue('custbody_charge_list_progress', JSON.stringify(objProgressCharges));
                    objInvoice.setValue('custbody_charge_list_milestone', JSON.stringify(objMilestoneCharges));
                    objInvoice.setValue('custbody_charge_list_purchase', JSON.stringify(objPurchaseCharges));

                    objInvoice.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });

            }
        }catch(error){
        	log.error("beforeLoad", error.toString());
        }
        }

        function afterSubmit(scriptContext) {
        	try{
            if (scriptContext.type != scriptContext.UserEventType.DELETE && scriptContext.type != scriptContext.UserEventType.PRINT) {
            	var scriptObj = runtime.getCurrentScript();
            	var savedSearchID = scriptObj.getParameter({
            		name: "custscript_charge_saved_search"
            	});
            	var savedSearchID_images = scriptObj.getParameter({
            		name: "custscript_image_saved_search"
            	});
                var searchCharges = search.load({
                    id: savedSearchID
                });
              	// Search all expense reports for attachments under the files subtab or the line item field: Attach File
                var searchImages = search.load({
                    id: savedSearchID_images
                });

                var currentRecord = scriptContext.newRecord;

                log.debug({
                    title: 'scriptContext.newRecord.id',
                    details: scriptContext.newRecord.id
                });

                var objInvoice = record.load({
                    type: record.Type.INVOICE,
                    id: scriptContext.newRecord.id,
                    isDynamic: true,
                });
                var filter1 = search.createFilter({
                    name: 'internalid',
                    join: 'invoice',
                    operator: search.Operator.ANYOF,
                    values: [currentRecord.id]
                });


                searchCharges.filters.push(filter1);

                var objTimeCharges = new Array();
                var objProgressCharges = new Array();
                var objMilestoneCharges = new Array();
                var objFixedCharges = new Array();
                var objPurchaseCharges = new Array();
                var objExpenseCharges = new Array();
                var objExpenseTrans = new Array();
                var objImages = new Array();

                searchCharges.run().each(function(result) {
                    /*
                    a - chargetype
                    b - rate
                    c - quantity
                    d - amount
                    e - chargedate
                    f - description
                    g - chargeemployee
                    */
                    var resultChargeType = strigyfyNull(result.getValue({
                        name: 'chargetype'
                    }));
                    if (resultChargeType === "Time-Based") {
                        objTimeCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Timetype": strigyfyNull(result.getText({
                                name: 'custcol_time_type',
                                join: 'time'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'casetaskevent',
                                join: 'time'
                            })),
                            "Billingclass": strigyfyNull(result.getText({
                                name: 'billingclass',
                                join: 'time'
                            })),
                            "Units": strigyfyNull(result.getText({
                                name: 'unit'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Expense-Based") {
                        objExpenseCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Transaction": strigyfyNull(result.getValue({
                                name: 'internalid',
                                join: 'transaction'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                        objExpenseTrans.push(
                            result.getValue({
                                name: 'internalid',
                                join: 'transaction'
                            })
                        );

                    }

                    if (resultChargeType === "Milestone") {
                        objMilestoneCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'projecttask'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Purchase") {
                        objPurchaseCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Task": strigyfyNull(result.getText({
                                name: 'projecttask'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Project Progress") {
                        objProgressCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    if (resultChargeType === "Fixed Date") {
                        objFixedCharges.push({
                            internalid: result.id,
                            "Chargetype": strigyfyNull(result.getValue({
                                name: 'chargetype'
                            })),
                            "Rate": strigyfyNull(result.getValue({
                                name: 'rate'
                            })),
                            "Quantity": strigyfyNull(result.getValue({
                                name: 'quantity'
                            })),
                            "Amount": strigyfyNull(result.getValue({
                                name: 'amount'
                            })),
                            "Date": strigyfyNull(result.getValue({
                                name: 'chargedate'
                            })),
                            "Memo": strigyfyNull(result.getValue({
                                name: 'memo'
                            })),
                            "Employee": strigyfyNull(result.getValue({
                                name: 'chargeemployee'
                            })),
                            "Rule": strigyfyNull(result.getText({
                                name: 'rule'
                            })),
                            "Item": strigyfyNull(result.getText({
                                name: 'billingitem'
                            })),
                            "Month": strigyfyNull(result.getValue({
                                name: 'formulatext'
                            })),
                            "Week": strigyfyNull(result.getValue({
                                name: 'chargedate',
                              	function: 'calendarWeek'
                            })),
                            "Project": strigyfyNull(result.getValue({
                                name: 'companyname',
                              	join: 'job'
                            }))

                        });
                    }
                    return true;
                });

					var scheme = 'https://';
        			var host = url.resolveDomain({
            			hostType: url.HostType.APPLICATION
       				});

                    log.debug({
                      title: 'url',
                      details: scheme + host
                    });
              		if (!NSUtil.isEmpty(objExpenseTrans))
                    {
                    objExpenseTrans = NSUtil.removeDuplicate(objExpenseTrans);
                    var filter2 = search.createFilter({
                          name: 'internalid',
                          operator: search.Operator.ANYOF,
                          values: objExpenseTrans
                    });
                    searchImages.filters.push(filter2);
                    searchImages.run().each(function(result) {
                      objImages.push({
                          internalid : result.id,
                          "Name" : strigyfyNull(result.getValue({
                              name : 'name',
                              join: 'file'
                          })),
                          "Type" : strigyfyNull(result.getValue({
                              name : 'filetype',
                              join: 'file'
                          })),
                          "URL" : scheme + host + strigyfyNull(result.getValue({
                              name : 'url',
                              join: 'file'
                          })),
                          "AWL" : strigyfyNull(result.getValue({
                              name : 'availablewithoutlogin',
                              join : 'file'
                          })),
                          "Fileid" : strigyfyNull(result.getValue({
                              name : 'internalid',
                              join : 'file'
                          })),
                          "Amount" : strigyfyNull(result.getValue({
                              name : 'amount'
                          })),
                          "Employee" : strigyfyNull(result.getValue({
                              name : 'entityid',
                              join: 'employee'
                          }))

                      });
                    var resultAWL = strigyfyNull(result.getValue({
                        name: 'availablewithoutlogin',
                        join: 'file'
                    }));
                    var resultFileId = strigyfyNull(result.getValue({
                        name: 'internalid',
                        join: 'file'
                    }));

                    if (resultAWL === false) {
                      var objFile = file.load({
                      	id: resultFileId
                	  });
                      objFile.isOnline = true;
                      objFile.save();
                    }
                    return true;
                    })
                    objInvoice.setValue('custbody_charge_list_image', JSON.stringify(objImages));
                    }
                    log.debug({
                        title: 'arrSearchResultsTime',
                        details: JSON.stringify(objTimeCharges)
                    });

                    objInvoice.setValue('custbody_charge_list_time', JSON.stringify(objTimeCharges));
                    objInvoice.setValue('custbody_charge_list_expense', JSON.stringify(objExpenseCharges));
                    objInvoice.setValue('custbody_charge_list_fixed', JSON.stringify(objFixedCharges));
                    objInvoice.setValue('custbody_charge_list_progress', JSON.stringify(objProgressCharges));
                    objInvoice.setValue('custbody_charge_list_milestone', JSON.stringify(objMilestoneCharges));

                    objInvoice.setValue('custbody_charge_list_purchase', JSON.stringify(objPurchaseCharges));

					var timeGroup = objInvoice.getText('custbody_charge_list_time_group');
					var timeSummary = objInvoice.getText('custbody_charge_list_time_summary');

              		if (timeSummary.indexOf(timeGroup) != -1) {
              			objInvoice.setValue('custbody_charge_list_time_summary_pdf', JSON.stringify(timeSummary));
                    }
              		else {
                      	if (["None","","Hide"].indexOf(timeGroup) === -1 && timeSummary.length > 0) {
                      		timeSummary.push(timeGroup);
                        }
              			objInvoice.setValue('custbody_charge_list_time_summary_pdf', JSON.stringify(timeSummary));
                    }
                    objInvoice.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });

            }
        }catch(error){
        	log.error("afterSubmit", error.toString());
        }
        }

        function strigyfyNull(value) {
            if (NSUtil.isEmpty(value)) {
                return '';
            } else {
                return value;
            }
        }

        return {
           // beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };

    });