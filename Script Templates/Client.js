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
 * Project Number:
 * Script Name:
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00                                     jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/error'],
    function(error) {
        function pageInit(context) {
            try {
                console.log("pageInit")
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function saveRecord(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
            return true;
        }

        function validateField(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
            return true;
        }

        function fieldChanged(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function postSourcing(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function lineInit(context) {
            try {
                console.log("lineInit", context.sublistId)
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function validateDelete(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
            return true;
        }

        function validateInsert(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
            return true;
        }

        function validateLine(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
            return true;
        }

        function sublistChanged(context) {
            try {
                console.log("sublistChanged", context.sublistId)
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord
        };
    });