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
 * @NScriptType RestletScript
 * @Description
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00                                     jaira@nscatalyst.com                    Initial Build
 *
 */

define(['N/record', 'N/error'],
    function(record, error) {
        function get(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function _delete(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function post(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }

        function put(context) {
            try {

            } catch (o_exception) {
                log.debug('catch', 'o_exception= ' + o_exception);
            }
        }
        return {
            get: get,
            delete: _delete,
            post: post,
            put: put
        };
    });