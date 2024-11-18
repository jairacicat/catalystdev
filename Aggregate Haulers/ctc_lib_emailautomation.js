/**
 * @NApiVersion 2.1
 * 
 * Name: CTC - Email Automation LIB
 * File Name: ctc_lib_emailautomation.js
 * 
 * Changelogs
 * Date             Version         Notes          Developer
 * 08/29/2024       1.0             Initial        jcicat (Catalyst)
 * 
 */

define([],
    function () {
        const GLOBAL_IDS = {
            NATIVE_RECORDS: {
                TRANSACTIONS: {
                    COLUMN_FIELDS: {
                    },
                    BODY_FIELDS: {
                    }
                }
            },
            CUSTOM_RECORDS: {
                CONTROL: { 
                    ID: 'customrecord_ctc_emailautomation',
                    FIELDS: {
                        RUN_AUTOMATION: 'custrecord_ctc_runautomation',
                        SCHEDULE_TIME: 'custrecord_ctc_schedule',
                        SAVED_SEARCH: 'custrecord_ctc_referencess',
                        RECORD_TYPE: 'custrecord_ctc_recordtype',
                        EMAIL_TEMPLATE: 'custrecord_ctc_emailtemplate',
                        PDF_RENDER_SCRIPT: 'custrecord_ctc_pdfrenderscript',
                        PDF_RENDER_SCRIPT_DEPLOYMENT: 'custrecord_ctc_pdfrenderdeployment',
                        GROUP_RECORDS: 'custrecord_ctc_grouprecords',
                        SCRIPT_DEPLOYMENT: 'custrecord_ctc_scriptdeployment',
                        SCRIPT_ID: 'custrecord_ctc_scriptid',
                        EMAIL_AUTHOR: 'custrecord_ctc_emailauthor'
                    }
                },
                LOG: {
                    ID: 'customrecord_ctc_emailsending_logs',
                    FIELDS: {
                        CONTROL: 'custrecord_ctc_emailautomationlog_record',
                        TOTAL_RECORDS: 'custrecord_ctc_emailautomationlog_total',
                        TOTAL_PROCESSED: 'custrecord_ctc_emailautomationlog_sent',
                        FILE: 'custrecord_ctc_emailautomationlog_csv',
                        STATUS: 'custrecord_ctc_emailautomationlog_status',
                        ERROR: 'custrecord_ctc_emailautomationlog_error'
                    }
                }
            }
        };

        function RETRIEVE_GLOBAL_IDS() {
            return GLOBAL_IDS;
        }

        /**
         * @description  Returns object containing values for NATIVE_RECORDS.TRANSACTIONS
         * @return {Object}
         */
        function GET_TRANSACTION_FIELD_IDS(){
            return GLOBAL_IDS.NATIVE_RECORDS.TRANSACTIONS
        }

        /**
         * @description  Returns object containing values for BODY FIELDS under NATIVE_RECORDS.TRANSACTIONS
         * @return {Object}
         */
        function GET_TRANSACTION_BODY_FIELD_IDS(){
            return GLOBAL_IDS.NATIVE_RECORDS.TRANSACTIONS.BODY_FIELDS
        }

        /**
         * @description  Returns object containing values for COLUMN FIELDS under NATIVE_RECORDS.TRANSACTIONS
         * @return {Object}
         */
        function GET_TRANSACTION_COLUMN_FIELD_IDS(){
            return GLOBAL_IDS.NATIVE_RECORDS.TRANSACTIONS.COLUMN_FIELDS
        }

        return {
            RETRIEVE_GLOBAL_IDS: RETRIEVE_GLOBAL_IDS,
            GET_TRANSACTION_FIELD_IDS: GET_TRANSACTION_FIELD_IDS,
            GET_TRANSACTION_BODY_FIELD_IDS: GET_TRANSACTION_BODY_FIELD_IDS,
            GET_TRANSACTION_COLUMN_FIELD_IDS: GET_TRANSACTION_COLUMN_FIELD_IDS
        }
    });