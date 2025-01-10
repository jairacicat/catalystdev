/**
 * Copyright (c) 2020 Catalyst Tech Corp
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Catalyst Tech Corp. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Catalyst Tech.
 *
 * Project Number: Service TODO-
 * Script Name: Retainer_Util.js
 * Author: karaneta@nscatalyst.com
 * @NApiVersion 2.0
 * @NModuleScope SameAccount
 * @description
 *
 * CHANGELOGS
 *
 * Version    Date            Author            Remarks
 * 1.00      Jun 20, 2022     karaneta        Initial Build
 * 1.02      Apr 18, 2024     asaliba         Added new retainer items (Retainer - IR and Retainer - Advisory)
 * 1.03      May 22, 2024     asaliba         Added the retainer type when creating retainer from Sales Orders
 * 1.04      July 15, 2024    karaneta         Added the retainer item FORTIS-IR-RETAINER and FORTIS-vCISO-RETAINER, change and deduct credit memo to retainer balance
 * 1.05      Aug 27, 2024     karaneta         Added update parent retainer functionality
 * 1.06      Sept 17, 2024     karaneta         Added voided transaction condition
 *
 */

define(['N/record', 'N/search', 'N/log', 'N/currentRecord'],

    function (record, search, log, currentRecord) {

        var isParentRetainer;
    var retainerBalance;
    var retainerBudget;
    var retainerItemAmount;
    var retainerItemId = '118568'; //Retainer - NetSuite - sb: 99047
    var retainerItemId_ir = '284603'; //Retainer - IR - sb: 99196
    var retainerItemId_advisory = '284604'; //Retainer - Advisory - sb: 99195
    var retainerItemList = [118568, 284603, 284604, 127208, 71668, 53238, 156689, 156686, 53238];

        //------------------------------------- UTILS -----------------------------------
        function isEmpty(stValue) {
            if ((stValue === '') || (stValue === null) || (stValue === undefined) || (stValue === '0') || (stValue === 0)) {
                return true;
            } else if (typeof stValue == 'object') {
                for (var prop in stValue) {
                    if (stValue.hasOwnProperty(prop))
                        return false;
                }

                return;
            } else {
                if (stValue instanceof String) {
                    if ((stValue == '')) {
                        return true;
                    }
                } else if (stValue instanceof Array) {
                    if (stValue.length == 0) {
                        return true;
                    }
                }

                return false;
            }
        }

        function createRetainer(customerId, retainerAmount, retainerExpiration, retainerType) {
            var stLogTitle = 'createRetainer';
            retainerAmount = Math.abs(retainerAmount);

            try {
                var retainerRecord = record.create({
                    type: 'customrecord_ctc_retainer',
                    isDynamic: true
                });

                retainerRecord.setValue({
                    fieldId: 'custrecord_ctc_rtnr_customer_ref',
                    value: customerId
                });

                retainerRecord.setValue({
                    fieldId: 'custrecord_ctc_rtnr_total_budget',
                    value: retainerAmount
                });

                retainerRecord.setValue({
                    fieldId: 'custrecord_ctc_rtnr_total_bgt_remaining',
                    value: retainerAmount
                });

                retainerRecord.setValue({
                    fieldId: 'custrecord_ctc_rtnr_end_date',
                    value: retainerExpiration
                });

                retainerRecord.setValue({
                    fieldId: 'custrecord_ctc_rtnr_type',
                    value: retainerType
                });

                return retainerRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function updateRetainerCommitted(customerId, retainerId, retainerAmount) {
            var stLogTitle = 'updateRetainer';
            retainerAmount = Math.abs(retainerAmount);

            try {

                var retainerLookup = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_committed']
                });

                var totalCommitted = retainerLookup.custrecord_ctc_rtnr_total_committed;
                totalCommitted = Math.abs(totalCommitted)

                retainerAmount = totalCommitted + retainerAmount;
                retainerAmount = -retainerAmount;

                log.debug({
                    title: stLogTitle,
                    details: retainerId + ' |new retainerAmount: ' + retainerAmount + ' |totalCommitted:' + totalCommitted
                });

                // update retainer record
                return record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    values: {
                        'custrecord_ctc_rtnr_total_committed': retainerAmount
                    },
                    options: {
                        enableSourcing: true
                    }
                });


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function validateChildRetainerItem(current_rec, retainerId, retainerName) {
            var stLogTitle = 'validateChildRetainerItem';
            var alertmesg;
            log.debug(stLogTitle, 'params: ' + retainerId + ' | retainerName:' + retainerName);

            var itemId = current_rec.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });

            var currIndex = current_rec.getCurrentSublistIndex({
                sublistId: 'item'
            });

            log.debug(stLogTitle, currIndex + ' | itemId:' + itemId);

            if (retainerItemList.indexOf((parseInt(itemId)))) { // 5414 = Retainer - Updated item
                var retainerObj;
                var itemAmount = current_rec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount'
                });

                //Load retainer record and get balance
                retainerObj = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_status', 'custrecord_ctc_rtnr_end_date']
                });

                log.debug(stLogTitle, 'retainerObj > ' + JSON.stringify(retainerObj));

                if (isEmpty(retainerObj)) {
                    log.debug(stLogTitle, 'Unable to get retainer record for ' + retainerName);
                    return false;
                }

                itemAmount = Math.abs(itemAmount);
                retainerBalance = retainerObj.custrecord_ctc_rtnr_total_bgt_remaining;
                retainerBalance = Math.abs(retainerBalance);
                retainerBudget = retainerObj.custrecord_ctc_rtnr_total_budget;
                retainerBudget = Math.abs(retainerBudget);
                var p_itemAmount = formatAmount(itemAmount);
                var p_retainerBalance = formatAmount(retainerBalance);
                var p_retainerBudget = formatAmount(retainerBudget);

                alertmesg = 'Retainer: ' + retainerName;
                alertmesg += '\nRetainer Budget: ' + p_retainerBudget;
                alertmesg += '\nRetainer Balance: ' + p_retainerBalance;
                alertmesg += '\nAmount to deduct: ' + p_itemAmount;

                if (isEmpty(retainerBalance)) {
                    alertmesg += '\n\nNo remaining retainer balance, retainer item will be removed.';
                } else if (itemAmount > retainerBalance) {
                    alertmesg += '\n\nInsufficient retainer balance, retainer item amount will be automatically adjusted.';
                }

                log.debug(stLogTitle, 'Retainer Mesg:' + alertmesg);
                log.debug(stLogTitle, itemAmount + ' | ' + retainerBalance);

                alert(alertmesg);

                if (isEmpty(retainerBalance)) {
                    current_rec.cancelLine({
                        sublistId: 'item'
                    });


                    log.debug(stLogTitle, 'Retainer Remove:' + currIndex);
                    return true;

                } else if (itemAmount > retainerBalance) {
                    //Update amount to match balance
                    log.debug(stLogTitle, 'Update amount to balance > ' + itemAmount + ' | ' + retainerBalance);
                    retainerBalance = -retainerBalance;

                    current_rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        value: retainerBalance
                    });

                    current_rec.commitLine({
                        sublistId: 'item'
                    });
                    retainerItemAmount = itemAmount;
                    return true;
                } else {
                    retainerItemAmount = itemAmount;
                    return true;
                }

            } // if retainer item
            return true;

        } // end validateChildRetainerItem

        function validateParentRetainerItem() {

        }

        function formatAmount(amount) {
            var newAmount;
            if (!isEmpty(amount)) {
                newAmount = Math.abs(amount);
                newAmount = newAmount.toLocaleString("en-US");
            }

            //log.debug('formatAmount', newAmount);
            return newAmount;
        }//end formatAmount

        function searchOpenRetainerByCustomerId(customerId) {
            var stLogTitle = 'searchOpenRetainerByCustomerId';

            var retainerSearch = search.create({
                type: 'customrecord_ctc_retainer',
                filters: [search.createFilter({
                    name: 'custrecord_ctc_rtnr_customer_ref',
                    operator: search.Operator.ANYOF,
                    values: customerId
                }), search.createFilter({
                    name: 'custrecord_ctc_rtnr_status',
                    operator: search.Operator.ANYOF,
                    values: ['1', '2']  // Open or partially used
                }), search.createFilter({
                    name: 'custrecord_ctc_rtnr_total_bgt_remaining',
                    operator: search.Operator.NOTEQUALTO,
                    values: '0'
                })],
                columns: ['internalid', 'name']
            });

            var retainerResult = retainerSearch.run();
            var firstResult = retainerResult.getRange({
                start: 0,
                end: 1
            })[0];

            if (!isEmpty(firstResult)) {
                log.debug(stLogTitle, 'retainerResult ' + JSON.stringify(firstResult));
                alert('There is a retainer record for this customer, please select a Retainer from the Retainer Field list to use it.');

            } else {
                log.debug(stLogTitle, 'retainerResult ' + JSON.stringify(firstResult));
                //alert('No open retainer found');
            }

        }

        function updateActivateParentRetainer(parentRetainerId, retainerAmount, retainerExpiration) {
            var stLogTitle = 'updateActivateParentRetainer';
            retainerAmount = Math.abs(retainerAmount);

            try {
                // update retainer status
                return record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: parentRetainerId,
                    values: {
                        'custrecord_ctc_rtnr_status': '1' //open
                    },
                    options: {
                        enableSourcing: true
                    }
                });


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function updateRetainerBilled(retainerId, retainerAmount) {
            var stLogTitle = 'updateRetainerBilled';
            retainerAmount = Math.abs(retainerAmount);

            try {

                var retainerLookup = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_total_billed', 'custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_status']
                });

                var retainerBudget = retainerLookup.custrecord_ctc_rtnr_total_budget;
                var totalBilled = retainerLookup.custrecord_ctc_rtnr_total_billed;
                var budgetAdjustment = retainerLookup.custrecord_ctc_rtnr_total_bgt_adjustment;
                var budgetRemaining = retainerLookup.custrecord_ctc_rtnr_total_bgt_remaining;
                var retainerTotalBilled = getRetainerTotalBilled(retainerId, customerId);
                var retStatus = retainerLookup.custrecord_ctc_rtnr_status;
                budgetRemaining = budgetRemaining - retainerAmount;
                totalBilled = Math.abs(totalBilled);
                var retainerTotalBilled = getRetainerTotalBilled(retainerId, customerId);
                retainerTotalBilled = Math.abs(retainerTotalBilled);
                var newRetainerBudgetRemaining = retainerBudget - retainerTotalBilled;

                if (!isEmpty(budgetAdjustment)) {
                    if (budgetAdjustment < 0) {
                        log.debug({
                            title: stLogTitle,
                            details: 'budget adjustment is negative, to deduct amount'
                        });
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining - budgetAdjustment;
                    } else {
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining + budgetAdjustment;
                    }

                }


                if (!isEmpty(totalBilled)) {
                    retainerAmount = totalBilled + retainerAmount;
                }

                retainerAmount = -retainerAmount;

                log.debug({
                    title: stLogTitle,
                    details: retainerId + ' |new retainerBilled: ' + retainerAmount + ' |totalBilled:' + totalBilled + ' |Budget:' + budgetRemaining
                });


                // Update retainer status
                var retId;
                if (retStatus == '1') {
                    retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_total_billed': -retainerTotalBilled,
                            'custrecord_ctc_rtnr_total_bgt_remaining': newRetainerBudgetRemaining,
                            'custrecord_ctc_rtnr_status': '2' //partially used
                        },
                        options: {
                            enableSourcing: true
                        }
                    });

                } else {
                    retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_total_billed': -retainerTotalBilled,
                            'custrecord_ctc_rtnr_total_bgt_remaining': newRetainerBudgetRemaining
                        },
                        options: {
                            enableSourcing: true
                        }
                    });
                }

                //Closed retainer
                if (isEmpty(budgetRemaining)) {
                    retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_status': '3' //closed
                        },
                        options: {
                            enableSourcing: true
                        }
                    });

                }

                return retId;

            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function updateRetainerTotalBilled(retainerId, retainerAmount, customerId) {
            var stLogTitle = 'updateRetainerTotalBilled| ' + retainerId + ' |cust:' + customerId;
            retainerAmount = Math.abs(retainerAmount);
            var newRetainerBudgetRemaining = 0;

            try {

                var retainerLookup = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_bgt_adjustment', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_total_billed']
                });

                var retainerBudget = retainerLookup.custrecord_ctc_rtnr_total_budget;
                var totalBilled = retainerLookup.custrecord_ctc_rtnr_total_billed
                var budgetAdjustment = retainerLookup.custrecord_ctc_rtnr_total_bgt_adjustment;
                var budgetRemaining = retainerLookup.custrecord_ctc_rtnr_total_bgt_remaining;
                var retainerTotalBilled = getRetainerTotalBilled(retainerId, customerId);
                retainerTotalBilled = Math.abs(retainerTotalBilled);
                retainerBudget = Math.abs(retainerBudget);
                log.debug({
                    title: stLogTitle,
                    details: 'retainerTotalBilled: ' + retainerTotalBilled + ' |retainerBudget: ' + retainerBudget
                });

                newRetainerBudgetRemaining = retainerBudget - retainerTotalBilled;
                if (!isEmpty(budgetAdjustment))
                    if (budgetAdjustment < 0) {
                        log.debug({
                            title: stLogTitle,
                            details: 'budget adjustment is negative, to deduct amount'
                        });
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining - budgetAdjustment;
                    } else {
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining + budgetAdjustment;
                    }


                log.debug({
                    title: stLogTitle,
                    details: retainerId + ' |retainerAmount: ' + retainerAmount + ' |newRetainerBudgetRemaining' + newRetainerBudgetRemaining
                });

                // update retainer budget
                return record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    values: {
                        'custrecord_ctc_rtnr_total_billed': -retainerTotalBilled,
                        'custrecord_ctc_rtnr_total_bgt_remaining': newRetainerBudgetRemaining
                    },
                    options: {
                        enableSourcing: true
                    }
                });

                //Closed zero retainer
                if (isEmpty(newRetainerBudgetRemaining)) {
                    var retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_status': '3' //closed
                        },
                        options: {
                            enableSourcing: true
                        }
                    });

                }


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function recalcParentRetainer(retainerId, retainerAmount, customerId) {
            var stLogTitle = 'recalcParentRetainer| ' + retainerId + ' |cust:' + customerId;
            retainerAmount = Math.abs(retainerAmount);
            var newRetainerBudgetRemaining = 0;

            try {

                var retainerLookup = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_bgt_adjustment', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_total_billed']
                });

                var retainerBudgetOld = retainerLookup.custrecord_ctc_rtnr_total_budget;
                var totalBilled = retainerLookup.custrecord_ctc_rtnr_total_billed
                var budgetAdjustment = retainerLookup.custrecord_ctc_rtnr_total_bgt_adjustment;
                var budgetRemaining = retainerLookup.custrecord_ctc_rtnr_total_bgt_remaining;
                var retainerBudget = getTotalParentRetainer(retainerId, customerId); //exclude voided
                var retainerTotalBilled = getRetainerTotalBilled(retainerId, customerId);//exclude voided
                retainerTotalBilled = Math.abs(retainerTotalBilled);
                retainerBudget = Math.abs(retainerBudget);
                log.debug({
                    title: stLogTitle,
                    details: 'retainerTotalBilled: ' + retainerTotalBilled + ' |retainerTotalBudget: ' + retainerBudget
                });

                newRetainerBudgetRemaining = retainerBudget - retainerTotalBilled;
                if (!isEmpty(budgetAdjustment))
                    if (budgetAdjustment < 0) {
                        log.debug({
                            title: stLogTitle,
                            details: 'budget adjustment is negative, to deduct amount'
                        });
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining - budgetAdjustment;
                    } else {
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining + budgetAdjustment;
                    }


                log.debug({
                    title: stLogTitle,
                    details: retainerId + ' |retainerAmount: ' + retainerAmount + ' |newRetainerBudgetRemaining' + newRetainerBudgetRemaining
                });

                // update retainer budget
                return record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    values: {
                        'custrecord_ctc_rtnr_total_billed': -retainerTotalBilled,
                        'custrecord_ctc_rtnr_total_bgt_remaining': newRetainerBudgetRemaining
                    },
                    options: {
                        enableSourcing: true
                    }
                });

                //Closed zero retainer
                if (isEmpty(newRetainerBudgetRemaining)) {
                    var retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_status': '3' //closed
                        },
                        options: {
                            enableSourcing: true
                        }
                    });

                }


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function getRetainerBalance(retainerId) {
            var stLogTitle = 'getRetainerBalance';

            //Load retainer record and get balance
            var retainerObj = search.lookupFields({
                type: 'customrecord_ctc_retainer',
                id: retainerId,
                columns: ['custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_status', 'custrecord_ctc_rtnr_end_date']
            });

            if (!isEmpty(retainerObj)) {
                return retainerObj;
            }

        }

        function getCustomerRetainerBalance(customerId) {
            var stLogTitle = 'getCustomerRetainerBalance';
            var total = 0;
            var custId = null;

            try {
                if (customerId) {
                    //Load retainer record and get balance
                    var customerRetainerSearch = search.create({
                        type: 'customrecord_ctc_retainer',
                        filters: [search.createFilter({
                            name: 'custrecord_ctc_rtnr_customer_ref',
                            operator: search.Operator.ANYOF,
                            values: customerId
                        }), search.createFilter({
                            name: 'custrecord_ctc_rtnr_status',
                            operator: search.Operator.ANYOF,
                            values: ['1', '2']  // Open or partially used
                        })
                        //, search.createFilter({
                        //    name: 'custrecord_ctc_rtnr_total_bgt_remaining',
                        //    operator: search.Operator.NOTLESSTHANOREQUALTO,
                        //    values: '0'
                        //})
                        ],
                        columns: ['internalid', 'name', 'custrecord_ctc_rtnr_total_bgt_remaining']
                    });

                    var customerRetainerResult = customerRetainerSearch.run();
                    var resultRange = customerRetainerResult.getRange({
                        start: 0,
                        end: 999
                    });

                    if (!isEmpty(customerRetainerResult)) {
                        for (var c = 0; c < resultRange.length; c++) {
                            var resultRow = resultRange[c];
                            log.debug(stLogTitle, "resultRow: " + JSON.stringify(resultRow));
                            var remainingBal = resultRow.getValue({
                                name: 'custrecord_ctc_rtnr_total_bgt_remaining'
                            });

                            var retName = resultRow.getValue({
                                name: 'name'
                            });

                            //remainingBal = Math.abs(remainingBal)
                            total += parseFloat(remainingBal);
                            log.debug(stLogTitle, c + ' Result Row:' + remainingBal + ' |Name:' + retName);
                            log.debug(stLogTitle, 'Total ' + total);
                        }
                    }

                    //Update customer total retainer
                    custId = record.submitFields({
                        type: record.Type.CUSTOMER,
                        id: customerId,
                        values: {
                            'custentity_ctc_custret_totalbalance': total
                        },
                        options: {
                            enableSourcing: false
                        }
                    });


                }

                return custId;

            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }

        }

        function getRetainerTotalBilled(retainerId, customerId) {
            var stLogTitle = 'getRetainerTotalBilled | ' + retainerId + ' |customerId:' + customerId;
            var totalBilled = null;

            var retainerTransactionSearch = search.create({
                type: "transaction",
                filters:
                    [
                        ["type","anyof","CustCred","CustInvc"],
                        "AND",
                        ["custbody_ctc_rtnr_inv_retainer","anyof",retainerId],
                        "AND",
                        ["status","noneof","CustCred:V","CustInvc:V"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["name","anyof",customerId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_ctc_ret_trans_amount"
                        })
                    ]
            });

            var retainerTransactionResult = retainerTransactionSearch.run();

            var retainerResultRange = retainerTransactionResult.getRange({
                start: 0,
                end: 999
            });

            if (!isEmpty(retainerTransactionResult)) {
                for (var r = 0; r < retainerResultRange.length; r++) {
                    var resultRow = retainerResultRange[r];
                    log.debug(stLogTitle, "resultRow: " + JSON.stringify(resultRow));
                    var retainerAmount = resultRow.getValue({
                        name: "custbody_ctc_ret_trans_amount",
                    });
                    log.debug(stLogTitle, "retainerAmount: " + retainerAmount);
                    retainerAmount = Math.abs(retainerAmount);
                    totalBilled += retainerAmount;

                    log.debug(stLogTitle, "retainerAmount: " + retainerAmount);
                    log.debug(stLogTitle, "totalBilled: " + totalBilled);

                }
            }

            log.debug(stLogTitle, "totalBilled: " + totalBilled);
            return totalBilled;

        }
        function getTotalParentRetainer(retainerId, customerId, beginningTransaction) {
            var stLogTitle = 'getTotalParentRetainer | ' + retainerId + ' |customerId:' + customerId;
            var totalBudget = null;

            var retainerTransactionSearch = search.create({
                type: "invoice",
                filters:
                    [
                        ["type","anyof","CustInvc"],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["status","noneof","CustInvc:V"], //excluded voided inv
                        "AND",
                        ["custbody_ctc_rtnr_so_retainer","anyof",retainerId],
                        "AND",
                        ["name","anyof",customerId]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "tranid", label: "Document Number"}),
                        search.createColumn({name: "type", label: "Type"}),
                        search.createColumn({name: "custbody_ctc_rtnr_so_retainer", label: "Parent Retainer"}),
                        search.createColumn({name: "custbody_ctc_ret_trans_amount", label: "Retainer Transaction Amount"}),
                        search.createColumn({name: "custbody_ctc_is_retainer_reference", label: "Create Retainer"}),
                        search.createColumn({name: "custbody_ctc_update_retainer", label: "Update Retainer"}),
                        search.createColumn({name: "custbody_ctc_inv_addto_retainer", label: "INV: Add to Retainer"})
                    ]
            });

            log.audit(beginningTransaction, beginningTransaction);
            if(beginningTransaction != null && beginningTransaction != ''){
                retainerTransactionSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    operator: 'noneof',
                    values: beginningTransaction
                }));

                log.audit('retainerTransactionSearchfitlers', retainerTransactionSearch.filters );
            }

            var retainerTransactionResult = retainerTransactionSearch.run();

            var retainerResultRange = retainerTransactionResult.getRange({
                start: 0,
                end: 999
            });

            if (!isEmpty(retainerTransactionResult)) {
                for (var r = 0; r < retainerResultRange.length; r++) {
                    var resultRow = retainerResultRange[r];
                    log.debug(stLogTitle, "resultRow: " + JSON.stringify(resultRow));
                    var retainerAmount = resultRow.getValue({
                        name: "custbody_ctc_ret_trans_amount",
                    });
                    log.debug(stLogTitle, "retainerAmount: " + retainerAmount);
                    retainerAmount = Math.abs(retainerAmount);
                    totalBudget += retainerAmount;

                    log.debug(stLogTitle, "retainerAmount: " + retainerAmount);
                    log.debug(stLogTitle, "totalBudget: " + totalBudget);

                }
            }

            log.debug(stLogTitle, "totalBudget: " + totalBudget);
            return totalBudget;

        }

        function updateParentRetainer(retainerId, retainerAmount, customerId) {
            var stLogTitle = 'updateParentRetainer';
            var updateStat = false;
            retainerAmount = Math.abs(retainerAmount);
            var newRetainerBudgetRemaining = 0;

            try {
                var retainerLookup = search.lookupFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    columns: ['custrecord_ctc_rtnr_total_bgt_adjustment', 'custrecord_ctc_rtnr_total_budget', 'custrecord_ctc_rtnr_total_bgt_remaining', 'custrecord_ctc_rtnr_total_billed']
                });

                var retainerBudget = retainerLookup.custrecord_ctc_rtnr_total_budget;
                var totalBilled = retainerLookup.custrecord_ctc_rtnr_total_billed
                var budgetAdjustment = retainerLookup.custrecord_ctc_rtnr_total_bgt_adjustment;
                var budgetRemaining = retainerLookup.custrecord_ctc_rtnr_total_bgt_remaining;
                var retainerTotalBilled = getRetainerTotalBilled(retainerId, customerId);
                retainerTotalBilled = Math.abs(retainerTotalBilled);
                retainerBudget = Math.abs(retainerBudget);
                log.debug({
                    title: stLogTitle,
                    details: 'retainerTotalBilled: ' + retainerTotalBilled + ' |retainerBudget: ' + retainerBudget
                });

                //update retainer budget dd retainer amount to retainer budget
                var newRetainerBudget = retainerBudget + retainerAmount;
                newRetainerBudget = Math.abs(newRetainerBudget);
                newRetainerBudgetRemaining = newRetainerBudget - retainerTotalBilled;

                if (!isEmpty(budgetAdjustment))
                    if (budgetAdjustment < 0) {
                        log.debug({
                            title: stLogTitle,
                            details: 'budget adjustment is negative, to deduct amount'
                        });
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining - budgetAdjustment;
                    } else {
                        budgetAdjustment = Math.abs(budgetAdjustment);
                        newRetainerBudgetRemaining = newRetainerBudgetRemaining + budgetAdjustment;
                    }


                log.debug({
                    title: stLogTitle,
                    details: retainerId + ' |retainerAmount: ' + retainerAmount + ' |newRetainerBudgetRemaining' + newRetainerBudgetRemaining + ' |newRetainerBudget:' + newRetainerBudget
                });

                // update retainer budget
                return record.submitFields({
                    type: 'customrecord_ctc_retainer',
                    id: retainerId,
                    values: {
                        'custrecord_ctc_rtnr_total_billed': -retainerTotalBilled,
                        'custrecord_ctc_rtnr_total_bgt_remaining': newRetainerBudgetRemaining,
                        'custrecord_ctc_rtnr_total_budget': newRetainerBudget
                    },
                    options: {
                        enableSourcing: true
                    }
                });

                //Closed zero retainer
                if (isEmpty(newRetainerBudgetRemaining)) {
                    var retId = record.submitFields({
                        type: 'customrecord_ctc_retainer',
                        id: retainerId,
                        values: {
                            'custrecord_ctc_rtnr_status': '3' //closed
                        },
                        options: {
                            enableSourcing: true
                        }
                    });

                }
                updateStat = true;


            } catch (e) {
                log.error({
                    title: stLogTitle,
                    details: e
                });

            }
            return updateStat;

        }


        //------------------------------------- END UTILS -----------------------------------
        return {
            isEmpty: isEmpty,
            createRetainer: createRetainer,
            updateRetainerCommitted: updateRetainerCommitted,
            validateChildRetainerItem: validateChildRetainerItem,
            validateParentRetainerItem: validateParentRetainerItem,
            formatAmount: formatAmount,
            searchOpenRetainerByCustomerId: searchOpenRetainerByCustomerId,
            updateActivateParentRetainer: updateActivateParentRetainer,
            updateRetainerBilled: updateRetainerBilled,
            updateRetainerTotalBilled: updateRetainerTotalBilled,
            getRetainerBalance: getRetainerBalance,
            getCustomerRetainerBalance: getCustomerRetainerBalance,
            getRetainerTotalBilled: getRetainerTotalBilled,
            getTotalParentRetainer: getTotalParentRetainer,
            recalcParentRetainer: recalcParentRetainer,
            updateParentRetainer: updateParentRetainer,
            fields: {
                retainerItemId: '118568', //Retainer - NetSuite
                retainerItemId_ir: '284603', //Retainer - IR
                retainerItemId_advisory: '284604',
                retainerFortisIr: '71668',
                retainerFortisVciso: '127208',//FORTIS-IR-RETAINER,
                retainerItemList: retainerItemList
            }
        };


    });