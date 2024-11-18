/**
 *
 * @NApiVersion 2.1
 * @description Perform Customer Integrations to AMS, ServiceNow, Universe.
 *
 * Script Name: sti_integration_module.js
 *
 */

define([
    'N/log',
    'N/task',
    'N/record',
    'N/runtime',
    'N/search',
    'N/file',
    'N/format',
    'N/url',
    'N/https',
    'N/ui/message',
    './sti_integration_lib',
    './sti_utility_module'
],
    function (LOG, TASK, RECORD, RUNTIME, SEARCH, FILE, FORMAT, URL, HTTPS, MESSAGE, SNOW, STIUTIL) {
        var rtnObj = {};
        rtnObj.getInstanceParams = function (recordType, scriptObj) {
            var constParams = {};
            try {
                switch (recordType) {
                    case ("opportunity"):
                        constParams = {
                            AMS_MS_BUS_UNIT: scriptObj.getParameter({ name: 'custscript_sti_managed_services_bus_unit' }), //Managed Services
                            AMS_MS_LEAD_SOURCE: scriptObj.getParameter({ name: 'custscript_sti_managed_services_lead_src' }),
                            AMS_MS_LINK: scriptObj.getParameter({ name: 'custscript_sti_ams_managed_services_link' }),

                            AMS_RN_BUS_UNIT: scriptObj.getParameter({ name: 'custscript_sti_renewal_bus_unit' }), //Regular Renewal
                            AMS_RN_LEAD_SOURCE: scriptObj.getParameter({ name: 'custscript_sti_renewal_lead_source' }),
                            AMS_RN_LINK: scriptObj.getParameter({ name: 'custscript_sti_ams_renewal_link' }),

                            AMS_CS_BUS_UNIT: scriptObj.getParameter({ name: 'custscript_sti_renewal_bus_unit_cs' }),  //Cloud Select
                            AMS_CS_LEAD_SOURCE: scriptObj.getParameter({ name: 'custscript_sti_renewal_lead_source_cs' }),
                            AMS_CS_LINK: '',

                            AMS_FS_BUS_UNIT: scriptObj.getParameter({ name: 'custscript_sti_renewal_bus_unit_fs' }), //Fortis
                            AMS_FS_LEAD_SOURCE: scriptObj.getParameter({ name: 'custscript_sti_renewal_lead_source_fs' }),
                            AMS_FS_LINK: '',

                            ATTACHMENT_FOLDER: scriptObj.getParameter({ name: 'custscript_sti_opp_attachment_folder' }),
                            DEFAULT_ITEM_ID: scriptObj.getParameter({ name: 'custscript_sti_item_id_placeholder' }),
                            ENTITY_STATUS: scriptObj.getParameter({ name: 'custscript_sti_opp_entity_status' }),
                            PROJECT_TYPE: scriptObj.getParameter({ name: 'custscript_sti_opp_project_type' }),
                            CLOSED_WON_STATUS: scriptObj.getParameter({ name: 'custscript_sti_opp_closedwon_status' })
                        };
                        break;
                    case ("requisition"):
                        constParams = {
                            ATTACHMENT_FOLDER: scriptObj.getParameter({ name: 'custscript_sti_req_attachment_folder' }),
                            DEFAULT_ITEM_ID: scriptObj.getParameter({ name: 'custscript_sti_req_item_id_placeholder' }),
                        };
                        break;
                    default:
                        constParams = {};
                }
            } catch (err) {
                log.error('Error getInstanceParams', err.toString());
            }
            return constParams;
        }
        rtnObj.getAddressBookFromAddressId = function (customerRecord, addressInternalId) {
            return doGetAddressBookFromAddressId(customerRecord, addressInternalId);
        }
        rtnObj.getAddressIdFromAddressBook = function (customerRecord, addressBookInternalId) {
            return doGetAddressIdFromAddressBook(customerRecord, addressBookInternalId);
        }
        rtnObj.sendCustomerData = function (customerId, scriptObj) {
            var userObj = RUNTIME.getCurrentUser();
            var skipUserArray = [];
            skipUserArray = scriptObj.getParameter({ name: 'custscript_sti_web_services_users' }).split(","); //List of Web Services Users to Skip
            var currentUserId = userObj.id.toString();

            if (skipUserArray.indexOf(currentUserId) >= 0) {
                log.audit("Update initiated from " + currentUserId, "Exit Script to Avoid Circular Updates");
                return;
            }

            //var userObj = RUNTIME.getCurrentUser();
            var updatedBy = userObj.name;
            if (SNOW.isEmpty(updatedBy)) {
                updatedBy = '';
            }
            updatedBy = updatedBy.toString();

            var jsonObjCustomer = {};
            var integrationObj;
            try {
                // Build Customer Payload
                var customerRecord = RECORD.load({
                    type: RECORD.Type.CUSTOMER,
                    id: customerId,
                    isDynamic: false,
                });

                var currentStage = customerRecord.getValue({ fieldId: 'stage' });
                if (!SNOW.isEmpty(currentStage)) {
                    currentStage = currentStage.toString().toUpperCase();
                }
                log.audit('Current Stage', currentStage);
                if (currentStage != 'PROSPECT' && currentStage != 'CUSTOMER') {  //* do not process for Leads
                    log.audit("only integrate Prospects and Customers", currentStage);
                    return true; //* Only Prospects and Customers
                }

                var paymentTerms = "";
                paymentTerms = customerRecord.getText({ fieldId: 'terms' });

                var creditHold = customerRecord.getText({ fieldId: 'creditholdoverride' });
                if (SNOW.isEmpty(creditHold)) {
                    creditHold = "Off";
                }
                creditHold = creditHold.toUpperCase();

                var codFlag;
                if (creditHold == "ON") {
                    codFlag = true;
                } else {
                    codFlag = false;
                }

                var customerEmail;
                customerEmail = customerRecord.getValue({ fieldId: 'email' });
                if (SNOW.isEmpty(customerEmail)) {
                    customerEmail = "";
                } else {
                    customerEmail = customerEmail.toString();
                }

                var customerUrl = customerRecord.getValue({ fieldId: 'url' });
                if (SNOW.isEmpty(customerUrl)) {
                    customerUrl = ""
                } else {
                    customerUrl = customerUrl.toString();
                }

                var priSalesRepInternalId = customerRecord.getValue({ fieldId: 'salesrep' });

                jsonObjCustomer.id = customerId;
                jsonObjCustomer.externalId = customerRecord.getValue({ fieldId: 'entityid' });
                jsonObjCustomer.custentity_sti_customer_external_id = customerRecord.getValue({ fieldId: 'custentity_sti_customer_external_id' });
                jsonObjCustomer.companyName = customerRecord.getValue({ fieldId: 'companyname' });
                jsonObjCustomer.altName = customerRecord.getValue({ fieldId: 'altname' });
                jsonObjCustomer.phone = customerRecord.getValue({ fieldId: 'phone' });
                jsonObjCustomer.email = customerEmail;
                jsonObjCustomer.entityStatus = customerRecord.getValue({ fieldId: 'stage' });
                jsonObjCustomer.isInactive = false;
                jsonObjCustomer.salesRep = priSalesRepInternalId;
                jsonObjCustomer.industry = customerRecord.getText({ fieldId: 'custentity_esc_industry' });
                jsonObjCustomer.url = customerUrl.toString();
                jsonObjCustomer.paymentTerms = paymentTerms;
                jsonObjCustomer.created = customerRecord.getValue({ fieldId: 'datecreated' });
                jsonObjCustomer.updated = customerRecord.getText({ fieldId: 'lastmodifieddate' });
                jsonObjCustomer.cod = codFlag;
                jsonObjCustomer.newexternalid = customerRecord.getValue({ fieldId: ' custentity_sti_customer_external_id' });
                jsonObjCustomer.recordtype = 'customer';

                //Include all Contacts for this Customer
                var jsonObjContact = {};
                var contactId;
                var contactRole;
                var contactRecord;
                var contactPrimary;
                var arrayContacts = [];
                var contactAddressId = "";
                var contactAddressCount;
                var contactAddressLoop;
                var defaultShipping = "";
                var contactLoop;
                const contactLineCount = customerRecord.getLineCount({ sublistId: 'contactroles' });
                for (contactLoop = 0; contactLoop < contactLineCount; contactLoop++) {
                    contactId = customerRecord.getSublistValue({
                        sublistId: 'contactroles',
                        fieldId: 'contact',
                        line: contactLoop
                    });

                    var contactFirstName;
                    var contactLastName;
                    var contactEntityId;
                    if (!SNOW.isEmpty(contactId)) {
                        contactRecord = new RECORD.load({ type: RECORD.Type.CONTACT, id: contactId });
                        if (!SNOW.isEmpty(contactRecord)) {
                            contactRole = contactRecord.getValue({ fieldId: 'contactrole' });
                            if (!SNOW.isEmpty(contactRole)) {
                                contactRole = contactRole.toString();
                            }
                            contactPrimary = Boolean(contactRole == "-10");

                            //Addresses from addressbook
                            contactAddressId = "";
                            contactAddressCount = contactRecord.getLineCount({ sublistId: 'addressbook' });
                            for (contactAddressLoop = 0; contactAddressLoop < contactAddressCount; contactAddressLoop++) {
                                defaultShipping = contactRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'defaultshipping',
                                    line: contactAddressLoop
                                });

                                if (contactAddressCount == 1) // there is only one address on the addressbook line
                                    defaultShipping = true;

                                defaultShipping = defaultShipping.toString();
                                if (defaultShipping === 'T' || defaultShipping === true || defaultShipping === "true") {
                                    contactAddressId = contactRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'addressid',
                                        line: contactAddressLoop
                                    });
                                    break;
                                }
                            }

                            contactFirstName = contactRecord.getValue({ fieldId: 'firstname' });
                            contactLastName = contactRecord.getValue({ fieldId: 'lastname' });
                            contactEntityId = contactRecord.getValue({ fieldId: 'entityid' });
                            if (SNOW.isEmpty(contactFirstName) || SNOW.isEmpty(contactLastName)) {
                                if (!SNOW.isEmpty(contactEntityId)) {
                                    contactFirstName = contactEntityId;
                                    contactLastName = "";
                                }
                            }

                            jsonObjContact = {};
                            jsonObjContact.id = contactId;
                            jsonObjContact.primary = contactPrimary;
                            jsonObjContact.company = customerId; // contactRecord.getValue({ fieldId: 'companyid' });
                            jsonObjContact.salutation = contactRecord.getValue({ fieldId: 'salutation' });
                            jsonObjContact.title = contactRecord.getValue({ fieldId: 'title' });
                            jsonObjContact.entityid = contactRecord.getValue({ fieldId: 'entityid' });
                            jsonObjContact.firstName = contactRecord.getValue({ fieldId: 'firstname' });
                            jsonObjContact.middleName = contactRecord.getValue({ fieldId: 'middlename' });
                            jsonObjContact.lastName = contactRecord.getValue({ fieldId: 'lastname' });
                            jsonObjContact.phone = contactRecord.getValue({ fieldId: 'phone' });
                            jsonObjContact.email = contactRecord.getValue({ fieldId: 'email' });
                            jsonObjContact.isInactive = contactRecord.getValue({ fieldId: 'isinactive' });
                            jsonObjContact.created = contactRecord.getValue({ fieldId: 'created' });
                            jsonObjContact.updated = contactRecord.getValue({ fieldId: 'lastmodifieddate' });
                            jsonObjContact.addressId = contactAddressId;
                            arrayContacts.push(jsonObjContact);
                        }
                    }
                }

                //Include all Addresses from addressbook
                var addrRec;
                var jsonAddressRecord = {};
                var arrayAddresses = [];
                var univAddresses = '';
                var univAddressFields;
                var univAddressValues;
                var theJsonKey;
                var theJsonValue;
                var colDelimiter = String.fromCharCode(253);
                var rowDelimiter = String.fromCharCode(254);
                var jsonObjAnotherAddress = {};
                var defaultBilling;
                var defaultShipping;
                var addressExternalId;
                var addressInternalId;
                var customerName = customerRecord.getValue({ fieldId: 'companyname' });
                var theAddressee;
                var theCountry;
                var addrLoop;
                const addrLineCount = customerRecord.getLineCount({ sublistId: 'addressbook' });
                for (addrLoop = 0; addrLoop < addrLineCount; addrLoop++) {
                    addressInternalId = customerRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'id',
                        line: addrLoop
                    });
                    addrRec = customerRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: addrLoop
                    });

                    addressExternalId = addrRec.getValue({
                        fieldId: 'custrecord_addr_ext_id'
                    });

                    jsonAddressRecord = JSON.parse(JSON.stringify(addrRec));
                    defaultBilling = customerRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'defaultbilling',
                        line: addrLoop
                    });

                    defaultShipping = customerRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'defaultshipping',
                        line: addrLoop
                    });

                    if (addrLineCount == 1) { // there is only one address on the addressbook line
                        defaultBilling = true;
                        defaultShipping = true;
                    }

                    defaultBilling = defaultBilling.toString();
                    if (defaultBilling === 'T' || defaultBilling === true || defaultBilling === "true") {
                        jsonObjCustomer.zip = addrRec.getValue({ fieldId: 'zip' });
                        jsonObjCustomer.city = addrRec.getValue({ fieldId: 'city' });
                        jsonObjCustomer.addr1 = addrRec.getValue({ fieldId: 'addr1' });
                        jsonObjCustomer.addr2 = addrRec.getValue({ fieldId: 'addr2' });
                        jsonObjCustomer.state = addrRec.getValue({ fieldId: 'state' });
                        jsonObjCustomer.country = addrRec.getText({ fieldId: 'country' });
                    }
                    theAddressee = "";
                    theAddressee = jsonAddressRecord.fields.addressee;
                    if (SNOW.isEmpty(theAddressee)) {
                        theAddressee = customerName;
                    }

                    theCountry = jsonAddressRecord.fields.country;
                    if (SNOW.isEmpty(theCountry)) {
                        theCountry = "United States";
                    } else {
                        if (theCountry == "US") {
                            theCountry = "United States";
                        }
                    }

                    jsonObjAnotherAddress = {
                        "id": addressInternalId,
                        "company": customerId,
                        "defaultBilling": defaultBilling.toString(),
                        "defaultShipping": defaultShipping.toString(),
                        "label": theAddressee,
                        "entityId": addressExternalId,
                        "addr1": jsonAddressRecord.fields.addr1,
                        "city": jsonAddressRecord.fields.city,
                        "state": jsonAddressRecord.fields.dropdownstate,
                        "zip": jsonAddressRecord.fields.zip,
                        "country": theCountry,
                        "addrPhone": jsonAddressRecord.fields.addrphone,
                        "addrtext": jsonAddressRecord.fields.addrtext,
                        "attention": jsonAddressRecord.fields.attention,
                        "addr2": jsonAddressRecord.fields.addr2,
                        "custrecord_sti_location_name": jsonAddressRecord.fields.custrecord_sti_location_name,
                        "address_book_internal_id": jsonAddressRecord.id,
                    };
                    arrayAddresses.push(jsonObjAnotherAddress);
                    //                        : 

                    univAddressFields = '';
                    univAddressValues = '';
                    for (theJsonKey in jsonObjAnotherAddress) {
                        theJsonValue = jsonObjAnotherAddress[theJsonKey];
                        univAddressFields = univAddressFields + theJsonKey + colDelimiter;
                        univAddressValues = univAddressValues + theJsonValue + colDelimiter;
                    }
                    univAddressFields = univAddressFields + 'updatedby' + colDelimiter;
                    univAddressValues = univAddressValues + updatedBy + colDelimiter;
                    univAddresses = univAddresses + univAddressFields + rowDelimiter + univAddressValues + rowDelimiter;
                }

                //01 Send Customer to AMS
                try {
                    integrationObj = {
                        "Number": "01",
                        "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_ams_api_url' }),
                        "base64EncodedString": "Basic YmxhaDpibGFoYmxhaA==",
                        "fullJsonObj": jsonObjCustomer
                    };
                    callTheAPI(integrationObj);
                } catch (err) {
                    log.error('Error Sending Customer to AMS', err.toString());
                }

                //02 Send Addresses to AMS
                try {
                    integrationObj = {
                        "Number": "02",
                        "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_ams_address_url' }),
                        "base64EncodedString": "Basic YmxhaDpibGFoYmxhaA==",
                        "fullJsonObj": arrayAddresses
                    };
                    callTheAPI(integrationObj);
                } catch (err) {
                    log.error('Error Sending Addresses to AMS', err.toString());
                }

                //03 Send Contacts to AMS
                try {
                    integrationObj = {
                        "Number": "03",
                        "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_contact_api_url_from_cust' }),
                        "base64EncodedString": "Basic YmxhaDpibGFoYmxhaA==",
                        "fullJsonObj": arrayContacts
                    };
                    callTheAPI(integrationObj);
                } catch (err) {
                    log.error('Error Sending Contacts to AMS', err.toString());
                }

                //04 Send Customer to SN
                if (currentStage == 'CUSTOMER') {
                    try {
                        integrationObj = {
                            "Number": "04",
                            "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_sn_dev_api_url' }),
                            "base64EncodedString": "Basic U1RJX05ldFN1aXRlX0ludGVncmF0aW9uX0FQSTppUUEzKXc5OTVHQWppcUxdYjROUGhofShOV3dO",
                            "fullJsonObj": jsonObjCustomer
                        };
                        callTheAPI(integrationObj);
                    } catch (err) {
                        log.error('Error Sending Customer to SN', err.toString());
                    }

                    ////05 Send Addresses to SN
                    //integrationObj = {
                    //    "Number": "05",
                    //    "apiToCall": scriptObj.getParameter({ name: 'custscript_sn_dev_address_url' }),
                    //    "base64EncodedString": "Basic U1RJX05ldFN1aXRlX0ludGVncmF0aW9uX0FQSTppUUEzKXc5OTVHQWppcUxdYjROUGhofShOV3dO",
                    //    "fullJsonObj": arrayAddresses
                    //};
                    //callTheAPI(integrationObj);
                }

                if (currentStage == 'CUSTOMER') {
                    var pri_sales_rep_externalId = '';
                    try {
                        var employeeRecord = RECORD.load({
                            type: RECORD.Type.EMPLOYEE,
                            id: priSalesRepInternalId,
                            isDynamic: false
                        });
                        pri_sales_rep_externalId = employeeRecord.getValue({ fieldId: 'custentity_sti_staff_id' });
                    } catch (err) {
                        pri_sales_rep_externalId = '';
                    }

                    var sec_sales_rep_externalId = '';
                    var secSalesRepInternalId = customerRecord.getValue({ fieldId: 'custentity_second_sales_rep_cust' });
                    try {
                        var employeeRecord = RECORD.load({
                            type: RECORD.Type.EMPLOYEE,
                            id: secSalesRepInternalId,
                            isDynamic: false
                        });
                        sec_sales_rep_externalId = employeeRecord.getValue({ fieldId: 'custentity_sti_staff_id' });
                    } catch (err) {
                        sec_sales_rep_externalId = '';
                    }

                    //06 Send Customer to Universe
                    var jsonObjCustomerUniverse = jsonObjCustomer;
                    jsonObjCustomerUniverse.cust_number = "NSCUST";
                    jsonObjCustomerUniverse.call_type = "NSCUST";
                    jsonObjCustomerUniverse.updatedby = updatedBy;
                    jsonObjCustomerUniverse.billaddressee = customerRecord.getValue({ fieldId: 'billaddressee' });
                    jsonObjCustomerUniverse.billattention = customerRecord.getValue({ fieldId: 'billattention' });
                    jsonObjCustomerUniverse.creditholdoverride = customerRecord.getValue({ fieldId: 'creditholdoverride' });
                    jsonObjCustomerUniverse.custentity_cust_inv_notes = customerRecord.getValue({ fieldId: 'custentity_cust_inv_notes' });
                    jsonObjCustomerUniverse.custentity_cust_prim_split = customerRecord.getValue({ fieldId: 'custentity_cust_prim_split' });
                    jsonObjCustomerUniverse.custentity_cust_sec_split = customerRecord.getValue({ fieldId: 'custentity_cust_sec_split' });
                    jsonObjCustomerUniverse.custentity_sti_to_invoice_emails = customerRecord.getValue({ fieldId: 'custentity_sti_to_invoice_emails' });
                    jsonObjCustomerUniverse.custentity_sti_cc_invoice_emails = customerRecord.getValue({ fieldId: 'custentity_sti_cc_invoice_emails' });
                    jsonObjCustomerUniverse.custentity_sti_bcc_invoice_emails = customerRecord.getValue({ fieldId: 'custentity_sti_bcc_invoice_emails' });
                    //jsonObjCustomerUniverse.custentity_email5 = customerRecord.getValue({ fieldId: 'custentity_email5' });
                    jsonObjCustomerUniverse.custentity_esc_last_modified_date = customerRecord.getValue({ fieldId: 'custentity_esc_last_modified_date' });
                    jsonObjCustomerUniverse.pri_sales_rep_externalId = pri_sales_rep_externalId.toString();
                    jsonObjCustomerUniverse.sec_sales_rep_externalId = sec_sales_rep_externalId.toString();
                    jsonObjCustomerUniverse.custentity_second_sales_rep_cust = secSalesRepInternalId;
                    jsonObjCustomerUniverse.custentity_sentinal_gsa = customerRecord.getValue({ fieldId: 'custentity_sentinal_gsa' });
                    jsonObjCustomerUniverse.custentity_sentinel_date_signed = customerRecord.getValue({ fieldId: 'custentity_sentinel_date_signed' });
                    jsonObjCustomerUniverse.custentity_sentinel_msa = customerRecord.getValue({ fieldId: 'custentity_sentinel_msa' });
                    jsonObjCustomerUniverse.custentity_sentinel_msa_date = customerRecord.getValue({ fieldId: 'custentity_sentinel_msa_date' });
                    jsonObjCustomerUniverse.custentity_sentinel_po_rec_on_invoice = customerRecord.getValue({ fieldId: 'custentity_sentinel_po_rec_on_invoice' });
                    jsonObjCustomerUniverse.custentity_sentinel_prevailing_wage = customerRecord.getValue({ fieldId: 'custentity_sentinel_prevailing_wage' });
                    jsonObjCustomerUniverse.custentity_sentinel_staffing_services = customerRecord.getValue({ fieldId: 'custentity_sentinel_staffing_services' });
                    jsonObjCustomerUniverse.custentity_sti_third_party_billing_notes = customerRecord.getValue({ fieldId: 'custentity_sti_third_party_billing_notes' });
                    jsonObjCustomerUniverse.emailpreference = customerRecord.getValue({ fieldId: 'emailpreference' });
                    jsonObjCustomerUniverse.taxable = customerRecord.getValue({ fieldId: 'taxable' });

                    try {
                        integrationObj = {
                            "Number": "06",
                            "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_uws_customer_url' }),
                            "base64EncodedString": "Basic MDIwMDJfbmV0c3VpdGVfaW50ZWdyYXRpb25Ac3VwcG9ydC5zZW50aW5lbC5jb206N3sjO1VjR1Y4Uy9lLFpUbQ==",
                            "theHttpMethod": "put",
                            "fullJsonObj": jsonObjCustomerUniverse
                        };
                        callTheAPI(integrationObj);
                    } catch (err) {
                        log.error('Error Sending Customer to Universe', err.toString());
                    }

                    //07 Send Address to Universe
                    try {
                        var universeAddressData = {
                            "call_type": "NSADDR",
                            "cust_number": "NSADDR",
                            "addressData": univAddresses
                        };
                        integrationObj = {
                            "Number": "07",
                            "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_uws_customer_url' }),
                            "base64EncodedString": "Basic MDIwMDJfbmV0c3VpdGVfaW50ZWdyYXRpb25Ac3VwcG9ydC5zZW50aW5lbC5jb206N3sjO1VjR1Y4Uy9lLFpUbQ==",
                            "theHttpMethod": "put",
                            "fullJsonObj": universeAddressData
                        };
                        callTheAPI(integrationObj);
                    } catch (err) {
                        log.error('Error Sending Addresses to Universe', err.toString());
                    }
                }
            } catch (err) {
                LOG.error({ title: 'Error on Customer Integration Module', details: JSON.stringify(integrationObj) + ' ' + err.toString() });
            }
            return null;
        }
        rtnObj.sendProjectToSN = function (salesOrderRecord, scriptObj) {
            try {
                var apiToCall = scriptObj.getParameter({ name: 'custscript_sti_project_to_sn_api' });
                log.debug('apiToCall', apiToCall);
                var currentUserObj = RUNTIME.getCurrentUser();

                //Get Business Unit from Professional Services Line
                var theBusinessUnit = '';
                var arrayItemIds = [87230, 6889, 6891, 6890];
                for (var itemLoop = 0; itemLoop < arrayItemIds.length && SNOW.isEmpty(theBusinessUnit); itemLoop++) {
                    var lineNumber = salesOrderRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: arrayItemIds[itemLoop]
                    });
                    if (lineNumber >= 0) {
                        var currentBusinessUnit = salesOrderRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'class',
                            line: lineNumber
                        });
                        if (!SNOW.isEmpty(currentBusinessUnit)) {
                            theBusinessUnit = currentBusinessUnit;
                        }
                    }
                }
                if (SNOW.isEmpty(theBusinessUnit)) {
                    theBusinessUnit = salesOrderRecord.getValue({ fieldId: 'class' });
                }

                var jsonObjProject = {};
                jsonObjProject.id = salesOrderRecord.id;
                jsonObjProject.title = salesOrderRecord.getValue({ fieldId: 'custbody_sti_project_name' });
                jsonObjProject.projectnumber = salesOrderRecord.getValue({ fieldId: 'tranid' });
                jsonObjProject.businessunit = theBusinessUnit;
                jsonObjProject.customer = salesOrderRecord.getValue({ fieldId: 'entity' });
                jsonObjProject.projectType = salesOrderRecord.getText({ fieldId: 'custbody_sti_project_type' });
                jsonObjProject.projectTypeInternal = salesOrderRecord.getValue({ fieldId: 'custbody_sti_project_type' });
                jsonObjProject.status = salesOrderRecord.getText({ fieldId: 'status' });
                //jsonObjProject.plannedHours = salesOrderRecord.getValue({ fieldId: 'plannedwork' });
                jsonObjProject.startDate = salesOrderRecord.getValue({ fieldId: 'custbody_sti_project_start_date' });
                jsonObjProject.estimatedEndDate = salesOrderRecord.getValue({ fieldId: 'custbody_sti_project_est_end_date' });
                jsonObjProject.projectManager = salesOrderRecord.getValue({ fieldId: 'custbody_sti_opp_pm' });
                jsonObjProject.billingCoordinator = salesOrderRecord.getValue({ fieldId: 'custbody_sti_billing_coordinator' });
                //jsonObjProject.department = ""; //salesOrderRecord.getValue({ fieldId: 'blah' });
                jsonObjProject.salesorder = salesOrderRecord.getValue({ fieldId: 'tranid' });
                jsonObjProject.created = salesOrderRecord.getValue({ fieldId: 'createddate' });
                jsonObjProject.createdBy = currentUserObj.id;
                jsonObjProject.updated = new Date();
                jsonObjProject.updatedBy = currentUserObj.id;

                //01 Send to ServiceNow
                integrationObj = {
                    "Number": "01",
                    "apiToCall": scriptObj.getParameter({ name: 'custscript_sti_project_to_sn_api' }), //Send to SN Dev
                    "base64EncodedString": "Basic U1RJX05ldFN1aXRlX0ludGVncmF0aW9uX0FQSTppUUEzKXc5OTVHQWppcUxdYjROUGhofShOV3dO",
                    "fullJsonObj": jsonObjProject
                };
                var rtnVal = callTheAPI(integrationObj);

                var snProjectLink = scriptObj.getParameter({ name: 'custscript_sti_url_to_sn_project' }); //Send to SN
                theResponseObj = JSON.parse(JSON.parse(JSON.stringify(rtnVal.Response))); log.debug("theResponseObj", theResponseObj);
                var snProjectId = theResponseObj.result.number; log.debug("SN project number", snProjectId);
                var snProjectSysId = theResponseObj.result.sys_id; log.debug('snProjectSysId', snProjectSysId);
                var snProjectURL = snProjectLink.replace("%%SN_SYS_ID%%", snProjectSysId);
                log.debug("the project url", snProjectURL);


                //var theResponse = JSON.parse(JSON.stringify(JSON.parse(rtnVal.Response)));
                //log.debug('theResponse', JSON.stringify(theResponse));
                //var theResult = JSON.parse(JSON.stringify(theResponse.result));
                //log.debug('theResult', JSON.stringify(theResult));

                if (!SNOW.isEmpty(snProjectId)) {
                    //var theSysId = theResponse.result.sys_id;
                    //var theNumber = theResponse.result.number;
                    //var theProjectLink = 'https://sentinel1dev.service-now.com/now/nav/ui/classic/params/target/customer_project.do?sys_id=';
                    //theProjectLink = theProjectLink + theSysId;
                    var updatedId = RECORD.submitFields({
                        type: RECORD.Type.SALES_ORDER,
                        id: salesOrderRecord.id,
                        values: {
                            custbody_sti_project_link_to_sn: snProjectURL,
                            custbody_sti_sn_project_number: snProjectId
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            } catch (err) {
                log.error('sendProjectToSN', err.toString());
            }
            return salesOrderRecord;
        }
        rtnObj.copyAddressBookToShipAddress = function (previousTransactionRecord) {
            var currentTransactionRecord = previousTransactionRecord;
            try {
                var numberUpdated = 0;
                var ismultishipto = currentTransactionRecord.getValue({ fieldId: 'ismultishipto' });
                if (ismultishipto) {
                    itemCnt = currentTransactionRecord.getLineCount({ sublistId: 'item' });
                    for (itemLoop = 0; itemLoop < itemCnt; itemLoop++) {
                        var addressInternalId = currentTransactionRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_ns_address_book',
                            line: itemLoop
                        });
                        var shipaddressInternalId = currentTransactionRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'shipaddress',
                            line: itemLoop
                        });
                        if (SNOW.isEmpty(shipaddressInternalId)) {
                            shipaddressInternalId = '';
                        }

                        //log.debug(itemLoop + ' addressInternalId and shipaddressInternalId', addressInternalId + ' ' + shipaddressInternalId)
                        if (!SNOW.isEmpty(addressInternalId) && Boolean(addressInternalId != shipaddressInternalId)) {
                            //log.debug(itemLoop + ' Updating shipaddressInternalId', shipaddressInternalId);
                            currentTransactionRecord.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'shipaddress',
                                line: itemLoop,
                                value: addressInternalId
                            });
                            numberUpdated++;
                        }
                    }
                    //if (numberUpdated > 0) {
                    //    STIUTIL.addLog('previous Transaction record', JSON.stringify(previousTransactionRecord));
                    //    STIUTIL.addLog('current  Transaction record', JSON.stringify(currentTransactionRecord));
                    //    log.debug(numberUpdated + ' Address(es) Updated');
                    //}
                }
            } catch (err) {
                log.error('Error: copyAddressBookToShipAddress', err.toString());
            }
            return currentTransactionRecord;
        }
        rtnObj.updateAddrSeqsAndLabels = function (customerRecord) {
            var customerExternalId = customerRecord.getValue({ fieldId: "entityid" });
            var entityNumber = customerRecord.getValue({ fieldId: "entitynumber" });
            if (!SNOW.isEmpty(entityNumber)) {
                customerExternalId = entityNumber;
            }

            if (!SNOW.isEmpty(customerExternalId)) {
                customerExternalId = customerExternalId.toString();
            }
            customerExternalId = '00000' + customerExternalId;
            customerExternalId = customerExternalId.slice(-5);

            var custentity_sti_customer_external_id = customerRecord.getValue({ fieldId: "custentity_sti_customer_external_id" });
            if (!SNOW.isEmpty(customerExternalId) && customerExternalId != '00000') {
                if (SNOW.isEmpty(custentity_sti_customer_external_id) || custentity_sti_customer_external_id.split('-')[0] == '00000') {
                    customerRecord.setValue({
                        fieldId: 'custentity_sti_customer_external_id',
                        value: customerExternalId + '-00'
                    })
                };

                var siteSequenceId = customerRecord.getValue({ fieldId: 'custentity_sti_site_counter_id' });
                if (SNOW.isEmpty(siteSequenceId)) {
                    var highestSeq = findHighestAddrSeq(customerRecord);
                    var siteSequenceRecord = RECORD.create({
                        type: 'customrecord_sti_customer_site_sequence',
                        isDynamic: false
                    });
                    siteSequenceRecord.setValue({
                        fieldId: 'custrecord_sti_site_sequence_cust_id',
                        value: customerRecord.id
                    });
                    siteSequenceRecord.setValue({
                        fieldId: 'custrecord_sti_site_sequence_last_num',
                        value: highestSeq
                    });
                    var siteSequenceId = siteSequenceRecord.save();
                    customerRecord.setValue({
                        fieldId: 'custentity_sti_site_counter_id',
                        value: siteSequenceId
                    });
                }

                //Clear All Addresses that have 00000 as Customer Prefix
                var addrLineCountUpdate = customerRecord.getLineCount({ sublistId: 'addressbook' });
                for (var updateLoop = 0; updateLoop < addrLineCountUpdate; updateLoop++) {
                    var addressSubRecord = customerRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: updateLoop
                    });
                    try {  //Update the Address External Id
                        var newAddrExternalId = addressSubRecord.getValue({
                            fieldId: 'custrecord_addr_ext_id'
                        });
                        if (!SNOW.isEmpty(newAddrExternalId)) {
                            var customerPrefix = newAddrExternalId.split('-')[0];
                            if (customerPrefix == '00000') {
                                addressSubRecord.setValue({
                                    fieldId: 'custrecord_addr_ext_id',
                                    value: ''
                                });
                            }
                        }
                    } catch (err) {
                        log.error('Unable to Check the Address External Id for 000000', updateLoop + ' ' + err.toString());
                    }
                }

                var addrLineCountUpdate = customerRecord.getLineCount({ sublistId: 'addressbook' });
                for (var updateLoop = 0; updateLoop < addrLineCountUpdate; updateLoop++) {
                    var addressSubRecord = customerRecord.getSublistSubrecord({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: updateLoop
                    });


                    try {  //Update the Address External Id
                        var newAddrExternalId = addressSubRecord.getValue({
                            fieldId: 'custrecord_addr_ext_id'
                        });
                        if (SNOW.isEmpty(newAddrExternalId)) {
                            if (updateLoop == 0) { //Make the first address -00
                                var customerPrefix = customerExternalId.split('-')[0];
                                customerPrefix = customerPrefix.replace(/\D/g, "");
                                newAddrExternalId = customerPrefix + "-00";

                                addressSubRecord.setValue({
                                    fieldId: 'custrecord_addr_ext_id',
                                    value: newAddrExternalId
                                });
                            } else {
                                var nextAddrSeq = findNextAddrSeq(siteSequenceId);
                                var customerPrefix = customerExternalId.split('-')[0];

                                //Set the External Id
                                if (!SNOW.isEmpty(nextAddrSeq)) {
                                    customerPrefix = customerPrefix.replace(/\D/g, "");
                                    var addrSuffix = '0000' + nextAddrSeq.toString();
                                    addrSuffix = addrSuffix.slice(-4);
                                    newAddrExternalId = customerPrefix + "-" + addrSuffix;

                                    addressSubRecord.setValue({
                                        fieldId: 'custrecord_addr_ext_id',
                                        value: newAddrExternalId
                                    });
                                }
                            }
                        }
                    } catch (err) {
                        log.error('Unable to Update the Address External Id', updateLoop + ' ' + err.toString());
                    }


                    try {  //Update Address Label
                        var labelData = '';
                        var addressCountry = addressSubRecord.getValue({ fieldId: 'country' });
                        var labelFieldList = ['addr1', 'city', 'state', 'attention', 'custrecord_addr_ext_id'];
                        for (var labelFieldLoop = 0; labelFieldLoop < labelFieldList.length; labelFieldLoop++) {
                            var lastlabelField = Boolean(labelFieldLoop + 1 == labelFieldList.length);
                            var labelFieldName = labelFieldList[labelFieldLoop].toString();
                            var labelFieldData = addressSubRecord.getValue({ fieldId: labelFieldName });

                            if (addressCountry != 'US' && labelFieldName == 'custrecord_addr_ext_id') {
                                labelData = labelData + '\n' + labelFieldData;
                            } else {
                                if (!SNOW.isEmpty(labelFieldData)) {
                                    if (labelFieldName == 'state') {
                                        labelData = labelData + ', ' + labelFieldData;
                                    } else {
                                        labelData = labelData + labelFieldData;
                                    }

                                    if (lastlabelField === false && labelFieldName != 'city') {
                                        labelData = labelData + '\n';
                                    }
                                }
                            }
                        }
                        if (!SNOW.isEmpty(labelData)) {
                            customerRecord.setSublistValue({
                                sublistId: 'addressbook',
                                fieldId: 'label',
                                line: updateLoop,
                                value: labelData,
                                ignoreFieldChange: true
                            });
                        }
                    } catch (err) {
                        log.error('Unable to Update the Address Label', updateLoop + ' ' + err.toString());
                    }
                }
                return customerRecord;
            }
        }
        rtnObj.doGetIntegrationAccessToken = function (nameOfIntegration) {
            return getIntegrationAccessToken(nameOfIntegration);
        }
        rtnObj.doGetScopeStackId = function (filterType, filterName) {
            /**
             * filterType: sales-executives   = Sales Reps
             * filterType: presales-engineers = Solution Architects
             * filterType: clients            = Customers
             */
            try {
                var accessToken = getIntegrationAccessToken('ScopeStack');
                if (SNOW.isEmpty(filterType) || SNOW.isEmpty(filterName)) {
                    return;
                } else {
                    var reqObj = {};
                    var fullJsonObj = {};
                    filterName = filterName.replace(/ /g, "%20")
                    var urlToCall = "https://api.scopestack.io/sentinel/v1/" + filterType + "?filter%5Bname%5D=" + filterName;// + "&filter%5Bactive%5D=true";
                    reqObj.headers = {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    };
                    reqObj.url = urlToCall;
                    var response = HTTPS.get({
                        url: reqObj.url,
                        headers: reqObj.headers
                    });
                    reqObj.response = response.body;
                    reqObj.code = response.code;
                    STIUTIL.addLog(filterType + '_' + filterName, reqObj.response);
                    var jsonObj = JSON.parse(reqObj.response);

                    var strMessage;
                    strMessage = {
                        "Method": "Get",
                        "Endpoint": reqObj.url,
                        "HTTP Code": reqObj.code,
                        "Response": reqObj.response,
                        "Payload": fullJsonObj
                    };
                    STIUTIL.addLog("integration info", JSON.stringify(strMessage));

                    return jsonObj.data[0].id;
                }
            } catch (err) {
                log.error('Error doGetScopeStackId', err.toString());
                return;
            }
        }
        rtnObj.getAvalaraTaxData = function (transactionRecord, commitFlag) {
            return transactionRecord;
        }
        rtnObj.getCustOpenPO = function (entityId, tranDate, invoiceType) {
            var userObj = RUNTIME.getCurrentUser();
            var theWebTempId = userObj.id.toString() + new Date();
            theWebTempId = theWebTempId.replace(/\D/g, "");

            var tranDateFormatted = FORMAT.format({
                value: tranDate,
                type: FORMAT.Type.DATE
            });

            var customerPoSearch = SEARCH.create({
                "type": "customrecord_sti_cust_purchase_orders",
                "title": "temp_customer_po_search_" + theWebTempId,
                "id": 'customsearch_' + theWebTempId,
                "filters": [
                    {
                        "name": "custrecord_sti_po_customer_number",
                        "operator": "anyof",
                        "values": [entityId],
                        "isor": false,
                        "isnot": false,
                        "leftparens": 0,
                        "rightparens": 0
                    },
                    {
                        "name": "custrecord_sti_po_invoice_type",
                        "operator": "is",
                        "values": [invoiceType],
                        "isor": false,
                        "isnot": false,
                        "leftparens": 0,
                        "rightparens": 0
                    },
                    {
                        "name": "custrecord_sti_po_active",
                        "operator": "is",
                        "values": ["T"],
                        "isor": false,
                        "isnot": false,
                        "leftparens": 0,
                        "rightparens": 0
                    },
                    {
                        "name": "custrecord_sti_po_from_date",
                        "operator": "onorbefore",
                        "values": [tranDateFormatted],
                        "isor": false,
                        "isnot": false,
                        "leftparens": 0,
                        "rightparens": 0
                    },
                    {
                        "name": "custrecord_sti_po_thru_date",
                        "operator": "onorafter",
                        "values": [tranDateFormatted],
                        "isor": false,
                        "isnot": false,
                        "leftparens": 0,
                        "rightparens": 0
                    },

                ],
                "columns": [
                    {
                        "name": "name",
                        "label": "name",
                        "type": "string",
                        "sortdir": "NONE"
                    }
                ],
                "settings": [],
                "scriptId": 'customsearch_' + theWebTempId,
                "isPublic": false
            });
            var customerPoSearchId = customerPoSearch.save();
            var customerPoSearchResults = customerPoSearch.run().getRange({
                start: 0,
                end: 1
            });

            var rtnVal = '';
            if (!SNOW.isEmpty(customerPoSearchResults[0])) {
                var zeroElement = JSON.parse(JSON.stringify(customerPoSearchResults[0]));
                if (!SNOW.isEmpty(zeroElement)) {
                    var theValues = JSON.parse(JSON.stringify(zeroElement.values));
                    if (!SNOW.isEmpty(theValues)) {
                        rtnVal = theValues.name;
                    }
                }
            }
            SEARCH.delete({
                id: customerPoSearchId
            });
            return rtnVal;
        }
        rtnObj.addDefaultInvoiceGroups = function (transactionRecord) {
            var recordType = transactionRecord.type;
            if (SNOW.isEmpty(recordType)) {
                recordType = '';
            }
            recordType = recordType.toString();
            var goodRecordType = false;
            goodRecordType = Boolean(recordType == 'invoice' || recordType == 'salesorder' || recordType == 'creditmemo');

            if (!goodRecordType) {
                return transactionRecord;
            }

            var groupsPreviouslyRemoved = transactionRecord.getValue({ fieldId: 'custbody_sti_invc_groups_removed' });
            if (groupsPreviouslyRemoved) {
                return transactionRecord;
            }

            //Check for a Default Invoice Group
            var scriptObj = RUNTIME.getCurrentScript();
            var invoiceType = transactionRecord.getValue({ fieldId: 'custbody_sti_invoice_type' });
            var invoiceTypeText = transactionRecord.getText({ fieldId: 'custbody_sti_invoice_type' });
            var theFieldName = 'custscript_sti_invc_group_' + invoiceType;
            var theDefaultGroup = scriptObj.getParameter({ name: theFieldName });

            if (SNOW.isEmpty(theDefaultGroup)) {
                //log.debug('Unable to Add Invoice Groups', 'No Default Invoice Group found for ' + invoiceTypeText);
            } else {
                itemCnt = transactionRecord.getLineCount({ sublistId: 'item' });
                for (itemLoop = 0; itemLoop < itemCnt; itemLoop++) {
                    transactionRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_sti_line_trans_invoice_group',
                        line: itemLoop,
                        value: theDefaultGroup,
                        ignoreFieldChange: true
                    });
                }
            }
            return transactionRecord;
        }
        rtnObj.doConvertRecordToFieldsObj = function (originalRecord) {
            var fieldsObj = {};
            var partOne = JSON.stringify(originalRecord);
            var partTwo = JSON.parse(partOne);
            fieldsObj = partTwo.fields;
            return fieldsObj;
        }
        rtnObj.doSearchFolderForFile = function (theFolderId, theFileName) {
            try {
                var theFileId = '';
                var fileSearch = SEARCH.create({
                    "type": "folder",
                    "id": 'customsearch_sti_search_folder_for_file',
                    "filters": [
                        {
                            "name": "internalid",
                            "operator": "anyof",
                            "values": [theFolderId],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        },
                        {
                            "name": "name",
                            "join": "file",
                            "operator": "is",
                            "values": [theFileName],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [
                        {
                            "name": "internalid",
                            "join": "file",
                            "label": "Internal ID",
                            "type": "select",
                            "sortdir": "NONE"
                        }
                    ],
                    "settings": [],
                    "title": null,
                    "scriptId": 'customsearch_sti_search_folder_for_file',
                    "isPublic": false
                });
                var fileSearchResults = fileSearch.run().getRange({
                    start: 0,
                    end: 1000
                });

                var foundTheFile = false;
                var fileInternalFieldName = 'file.internalid'
                for (var fileLoop = 0; fileLoop < fileSearchResults.length && !foundTheFile; fileLoop++) {
                    try {
                        var theJsonObj = JSON.parse(JSON.stringify(fileSearchResults[fileLoop]));
                        var theValues = theJsonObj.values;
                        var theFileId = theValues[fileInternalFieldName][0].value;
                        var foundTheFile = Boolean(!SNOW.isEmpty(theFileId));
                    } catch (err) {
                        log.error(fileLoop + ' Error - doSearchFolderForFile', err.toString());
                    }
                }
            } catch (err) {
                log.error('Error - doSearchFolderForFile', err.toString());
            }
            return theFileId;
        }
        rtnObj.doGetTransactionFolderId = function (parentFolderId, transactionId, transactionType) {
            log.debug('in doGetTransactionFolderId');
            log.debug('parentFolderId', parentFolderId);
            log.debug('transactionId', transactionId);
            log.debug('transactionType', transactionType);

            var folderInternalId = '';
            try {
                var transactionRecord = RECORD.load({
                    type: transactionType,
                    id: transactionId,
                    isDynamic: false
                });

                if (transactionType == RECORD.Type.SALES_ORDER) {  //Pro Forma
                    folderName = 'PRO FORMA INVOICES';
                } else {
                    var dateObj = {};
                    dateString = transactionRecord.getText({ fieldId: 'trandate' });
                    var tempArray = dateString.split('/');
                    if (tempArray.length == 3) {
                        dateObj.month = tempArray[0];
                        dateObj.day = tempArray[1];
                        dateObj.year = tempArray[2];
                        var folderName = dateObj.year + '-' + dateObj.month;
                    } else {
                        var folderName = 'Other PDFs';
                    }
                }

                var folderSearchObj;
                folderSearchObj = SEARCH.create({
                    "type": "folder",
                    "id": 'customsearch_sti_temp_folder_search',
                    "filters": [
                        {
                            "name": "name",
                            "operator": "is",
                            "values": [folderName],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        },
                        {
                            "name": "parent",
                            "operator": "anyof",
                            "values": [parentFolderId],
                            "isor": false,
                            "isnot": false,
                            "leftparens": 0,
                            "rightparens": 0
                        }
                    ],
                    "columns": [],
                    "settings": [],
                    "title": null,
                    "scriptId": "customsearch_sti_temp_folder_search",
                    "isPublic": false
                });
                var folderSearchResults = folderSearchObj.run().getRange({
                    start: 0,
                    end: 1000
                });

                if (folderSearchResults.length <= 0) {  //Create Folder if Does not Exist
                    var folderObj = RECORD.create({
                        type: RECORD.Type.FOLDER,
                        isDynamic: false
                    });
                    folderObj.setValue({
                        fieldId: 'name',
                        value: folderName
                    });
                    folderObj.setValue({
                        fieldId: 'parent',
                        value: parentFolderId
                    });
                    var folderInternalId = folderObj.save();
                } else {
                    var folderInternalId = folderSearchResults[0].id;
                }
                return folderInternalId;
            } catch (err) {
                log.debug('Error sti_process_invoice_module retrieving Invoice/Credit Folder Id', err.toString());
            }
            return folderInternalId;
        }
        rtnObj.doStartMapReduce = function (taskObjInfo) {
            var rtnVal = '';
            try {
                log.debug('taskObjInfo', JSON.stringify(taskObjInfo));
                //var fileId = STIUTIL.addLog('taskObjInfo', JSON.stringify(taskObjInfo));
                var taskScriptId = taskObjInfo.scriptId;
                var taskDeployId = taskObjInfo.deployId;

                switch (true) {
                    case (taskScriptId == 'customscript_sti_run_nightly_invc_job'): //Invoice Nightly Batch
                        var mapReduceTask = TASK.create({
                            taskType: TASK.TaskType.MAP_REDUCE,
                            scriptId: taskScriptId,
                            deploymentId: taskDeployId
                        });
                        mapReduceTask.params = {
                            custscript_sti_invc_batch_task_info: taskObjInfo
                        };
                        var mapReduceTaskId = mapReduceTask.submit();
                        rtnVal = mapReduceTaskId;
                        break;
                    case (taskScriptId == 'customscript_sti_mr_del_dup_time'): //Delete Duplicate Time Entries
                        var mapReduceTask = TASK.create({
                            taskType: TASK.TaskType.MAP_REDUCE,
                            scriptId: taskScriptId,
                            deploymentId: taskDeployId
                        });
                        mapReduceTask.params = {
                            custscript_sti_invc_batch_task_info: taskObjInfo
                        };
                        var mapReduceTaskId = mapReduceTask.submit();
                        rtnVal = mapReduceTaskId;
                        break;
                    default:
                        var mapReduceTask = TASK.create({
                            taskType: TASK.TaskType.MAP_REDUCE,
                            scriptId: taskScriptId,
                            deploymentId: taskDeployId
                        });
                        mapReduceTask.params = {
                            custscript_sti_invc_batch_task_info: taskObjInfo
                        };
                        var mapReduceTaskId = mapReduceTask.submit();
                        rtnVal = mapReduceTaskId;
                }
            } catch (err) {
                log.error('Error - doStartMapReduce', err.toString());
                rtnVal = err.toString();
            }
            return rtnVal;
        }
        rtnObj.doPostScopeStack = function (integrationObj) {
            var response;
            var currentNumber = integrationObj.Number;
            var apiToCall = integrationObj.apiToCall;
            var fullJsonObj = integrationObj.fullJsonObj;

            var reqObj = {
                url: apiToCall,
            };

            reqObj.headers = {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Bearer ' + getIntegrationAccessToken('ScopeStack')
            };

            response = HTTPS.post({
                url: reqObj.url,
                body: JSON.stringify(fullJsonObj),
                headers: reqObj.headers
            });

            reqObj.response = response.body;
            reqObj.code = response.code;

            var strMessage;
            strMessage = {
                "Method": "Post",
                "Endpoint": reqObj.url,
                "HTTP Code": reqObj.code,
                "Response": reqObj.response,
                "Payload": fullJsonObj
            };
            log.audit(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
            //STIUTIL.addLog(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
            //STIUTIL.addLog(currentNumber + ' callTheApi', JSON.stringify(integrationObj));
            //STIUTIL.addLog(currentNumber + ' Response from', JSON.stringify(strMessage));
            return strMessage;
        }
        function getIntegrationAccessToken(nameOfIntegration) {
            try {
                switch (true) {
                    case (nameOfIntegration == 'ScopeStack'):  //ScopeStack
                        var recordId = '1';
                        break;
                    default:
                        var recordId = '';
                }
                if (SNOW.isEmpty(recordId)) {
                    return;
                } else {
                    var integrationRecord = RECORD.load({
                        type: 'customrecord_sti_integration_settings',
                        id: recordId,
                        isDynamic: false
                    });
                    var urlToCall = integrationRecord.getValue({ fieldId: 'custrecord_sti_integration_token_api' });
                    var clientId = integrationRecord.getValue({ fieldId: 'custrecord_sti_oauth_param_01' });
                    var clientSecret = integrationRecord.getValue({ fieldId: 'custrecord_sti_oauth_param_02' });
                    var refreshToken = integrationRecord.getValue({ fieldId: 'custrecord_sti_refresh_token' });

                    var reqObj = {};
                    reqObj.headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    };
                    reqObj.url = urlToCall;
                    reqObj.url = reqObj.url + "?client_id=" + clientId;
                    reqObj.url = reqObj.url + "&client_secret=" + clientSecret;
                    reqObj.url = reqObj.url + "&grant_type=refresh_token";
                    reqObj.url = reqObj.url + "&refresh_token=" + refreshToken;

                    var response = HTTPS.post({
                        url: reqObj.url,
                        headers: reqObj.headers
                    });
                    reqObj.response = response.body;
                    reqObj.code = response.code;
                    log.audit('reqObj.response', reqObj.response);

                    var theResponse = JSON.parse(reqObj.response);
                    var newRefreshToken = theResponse.refresh_token;
                    if (SNOW.isEmpty(newRefreshToken)) {
                        return;
                    } else {
                        integrationRecord.setValue({
                            fieldId: 'custrecord_sti_refresh_token',
                            value: newRefreshToken
                        });
                        integrationRecord.save();
                        log.audit('Refresh token updated', newRefreshToken);
                    }
                    return theResponse.access_token;
                }
            } catch (err) {
                log.error('Error on getIntegrationAccessToken', err.toString());
                return;
            }
        }
        function doGetAddressBookFromAddressId(customerRecord, addressInternalId) {
            var addressBookInternalId = '';
            try {
                var lineNumber = customerRecord.findSublistLineWithValue({
                    sublistId: 'addressbook',
                    fieldId: 'addressid',
                    value: addressInternalId
                });
                if (lineNumber >= 0) {
                    var addressBookInternalId = customerRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        line: lineNumber
                    });
                }
            } catch (err) {
                log.error('Error: getAddressBookFromAddressId', err.toString());
            }
            return addressBookInternalId;
        }
        function doGetAddressIdFromAddressBook(customerRecord, addressBookInternalId) {
            var addressInternalId = '';
            try {
                var lineNumber = customerRecord.findSublistLineWithValue({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress',
                    value: addressBookInternalId
                });
                if (lineNumber >= 0) {
                    var addressInternalId = customerRecord.getSublistValue({
                        sublistId: 'addressbook',
                        fieldId: 'addressid',
                        line: lineNumber
                    });
                }
            } catch (err) {
                log.error('Error: getAddressIdFromAddressBook', err.toString());
            }
            return addressInternalId;
        }
        function findHighestAddrSeq(customerRecord) {
            var lneLoop;
            var theLength;
            var currentSeq;
            var highestSeq = 0;
            var addrExternalId;
            var subrecAddress;
            var addrLneCount = customerRecord.getLineCount({ sublistId: 'addressbook' });

            for (lneLoop = 0; lneLoop < addrLneCount; lneLoop++) {
                subrecAddress = customerRecord.getSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress',
                    line: lneLoop
                });

                addrExternalId = subrecAddress.getValue({
                    fieldId: 'custrecord_addr_ext_id'
                });

                addrExternalId = addrExternalId.split('-');
                theLength = addrExternalId.length
                if (theLength > 1) {
                    currentSeq = parseInt(addrExternalId[theLength - 1]);
                    if (currentSeq == "NaN") {
                        currentSeq = 0;
                    }
                } else {
                    currentSeq = 0;
                }
                if (currentSeq > highestSeq) {
                    highestSeq = currentSeq;
                }
            }
            return highestSeq;
        }
        function findNextAddrSeq(siteSequenceId) {
            log.debug('siteSequenceId', siteSequenceId);
            try {
                var siteSequenceRecord = RECORD.load({
                    type: 'customrecord_sti_customer_site_sequence',
                    id: siteSequenceId,
                    isDynamic: false
                });
                var prevAddrSeq = siteSequenceRecord.getValue({ fieldId: 'custrecord_sti_site_sequence_last_num' });
                var nextAddrSeq = prevAddrSeq + 1;
                var savedRecordId = RECORD.submitFields({
                    type: 'customrecord_sti_customer_site_sequence',
                    id: siteSequenceId,
                    values: {
                        custrecord_sti_site_sequence_last_num: nextAddrSeq
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                return nextAddrSeq;

            } catch (err) {
                log.error('Error in findNextAddrSeq', err.toString());
                return;
            }
        }
        function storeCommittedTaxData(transactionInternalId, lineNumber, taxCode, taxDetailsObj) {
            var taxedAmount = taxDetailsObj.Tax
            if (taxedAmount != '0') {
                var taxReportId = taxDetailsObj.STI_TaxReportId;
                if (SNOW.isEmpty(taxReportId)) {
                    var taxReportRecord = RECORD.create({
                        type: 'customrecord_sti_invoice_taxes',
                        isDynamic: false
                    });
                } else {
                    var taxReportRecord = RECORD.load({
                        type: 'customrecord_sti_invoice_taxes',
                        id: taxReportId,
                        isDynamic: false
                    });
                }

                taxReportRecord.setValue({
                    fieldId: 'custrecord_sti_invoice_taxes_transaction',
                    value: transactionInternalId
                });
                taxReportRecord.setValue({
                    fieldId: 'custrecord_sti_invoice_taxes_tax_code',
                    value: taxCode
                });
                taxReportRecord.setValue({
                    fieldId: 'custrecord_sti_invoice_taxes_line_number',
                    value: lineNumber
                });

                var arrayAvalaraFields = ['Tax', 'Rate', 'Region', 'Country', 'JurisType', 'JurisName', 'JurisCode', 'TaxName'];
                for (var fieldLoop = 0; fieldLoop < arrayAvalaraFields.length; fieldLoop++) {
                    var avaFieldName = arrayAvalaraFields[fieldLoop];
                    var stiFieldName = 'custrecord_sti_invoice_taxes_' + avaFieldName.toLowerCase();
                    if (stiFieldName == 'custrecord_sti_invoice_taxes_tax') {
                        stiFieldName = 'custrecord_sti_invoice_taxes_amount';
                    }
                    taxReportRecord.setValue({
                        fieldId: stiFieldName,
                        value: taxDetailsObj[avaFieldName]
                    });
                }

                taxDetailsObj.sti_tax_report_id = taxReportRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });
            }
            return taxDetailsObj;
        }
        function checkForStoredTaxes(transactionInternalId, lineNumber) {
            var searchfilters = [];
            searchfilters.push({
                "name": "custrecord_sti_invoice_taxes_transaction",
                "operator": "anyof",
                "values": [transactionInternalId]
            });
            if (!SNOW.isEmpty(lineNumber)) {
                searchfilters.push({
                    "name": "custrecord_sti_invoice_taxes_line_number",
                    "operator": "equalto",
                    "values": [lineNumber],
                });
            }
            var invoiceTaxesSearch = SEARCH.create({
                "type": "customrecord_sti_invoice_taxes",
                "id": 'customsearch_sti_invoice_taxes_temp',
                "filters": searchfilters,
                "columns": [],
                "settings": [],
                "title": null,
                "scriptId": "customsearch_sti_invoice_taxes_temp",
                "isPublic": false
            });
            var invoiceTaxesSearchResults = invoiceTaxesSearch.run().getRange({
                start: 0,
                end: 1
            });
            log.debug('invoiceTaxesSearchResults', JSON.stringify(invoiceTaxesSearchResults));
            return invoiceTaxesSearchResults;
        }
        function callTheAPI(integrationObj) {
            var response;
            var currentNumber = integrationObj.Number;
            var apiToCall = integrationObj.apiToCall;
            var base64EncodedString = integrationObj.base64EncodedString;
            var theHttpMethod = integrationObj.theHttpMethod;
            var fullJsonObj = integrationObj.fullJsonObj;

            if (SNOW.isEmpty(theHttpMethod)) {
                theHttpMethod = "post";
            }

            var reqObj = {
                url: apiToCall,
                requestType: HTTPS.Method.PUT,
                requestDate: new Date(),
                thirdParty: "ServiceNow"
            };

            reqObj.headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': base64EncodedString
            };

            if (theHttpMethod == "post") {
                response = HTTPS.post({
                    url: reqObj.url,
                    body: JSON.stringify(fullJsonObj),
                    headers: reqObj.headers
                });
            } else {
                response = HTTPS.put({
                    url: reqObj.url,
                    body: JSON.stringify(fullJsonObj),
                    headers: reqObj.headers
                });
            }

            reqObj.response = response.body;
            reqObj.code = response.code;

            var strMessage;
            strMessage = {
                "Method": theHttpMethod,
                "Endpoint": reqObj.url,
                "HTTP Code": reqObj.code,
                "Response": reqObj.response,
                "Payload": fullJsonObj
            };
            log.audit(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
            //STIUTIL.addLog(currentNumber + " " + apiToCall, JSON.stringify(strMessage));
            //STIUTIL.addLog(currentNumber + ' callTheApi', JSON.stringify(integrationObj));
            //STIUTIL.addLog(currentNumber + ' Response from', JSON.stringify(strMessage));
            return strMessage;
        }
        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
        return rtnObj;
    });