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
 * @NScriptType UserEventScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00                             jaira@nscatalyst.com                            Initial Build
 *
 */

define(['N/record'],
    function(record) {
        function beforeLoad(context) {
            try {
                var a = 0;
                a = a+c;
            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
                log.debug("error with a", a);
                a = 2;
            }

            var b = 0;
            log.debug("a", a);
            log.debug("b", b);
        }


        function beforeSubmit(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function afterSubmit(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
    });