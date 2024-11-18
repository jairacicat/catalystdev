/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

define(['N/file', 'N/render', 'N/search', 'N/record', 'N/https', 'N/url', 'N/runtime', 'N/config'],
    function (file, render, search, record, https, url, runtime, config) {
        function getRoleAP(IDCustomer) {

            var customerSearchObj = search.create({
                type: "customer",
                filters:
                    [
                        ["internalid", "anyof", IDCustomer],
                        "AND",
                        ["contact.role", "anyof", "7"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "contactrole",
                            join: "contact",
                            label: "Role"
                        })
                    ]
            });
            var searchResultCount = customerSearchObj.runPaged().count;
            log.debug("customerSearchObj result count", searchResultCount);
            return searchResultCount > 0 ? false : true;
        }
        // Function to retrieve the input data for processing
        function getInputData() {
            try {
                // Define search filters
                log.debug('getting datas')
                var filters = [
                    ["type", "anyof", "CustInvc"],
                    "AND",
                    ["datecreated", "on", "9/20/2024 11:59 pm"],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    ["billcountry", "anyof", "US"],
                    "AND",
                    ["subsidiary", "anyof", "7"],
                    "AND",
                    ["customermain.custentity_invoicedeliverymethod", "anyof", "6"],
                    "AND",
                    ["custbody_sent_to_postgrid", "is", "F"] // Filter by custom order type
                    //"AND", 
                    // ["internalid","anyof","428534"]
                ];
                // Return the search object promise
                return search.create.promise({
                    type: 'invoice',
                    filters: filters
                });
            } catch (error) {
                log.error(error.message, JSON.stringify(error)); // Log errors
            }
        }

        // Function to create a letter using the provided URL and invoice ID
        function createLetter(urlInv, recID) {
            try {
                var recInv = record.load({
                    type: 'invoice',
                    id: recID
                });
                log.debug('Working in ', recID)
                // Retrieve company information
                var companyInfo = config.load({ type: config.Type.COMPANY_INFORMATION });
                var companyname = companyInfo.getValue({ fieldId: 'companyname' });
                var mainaddress_text = companyInfo.getValue({ fieldId: 'mainaddress_text' });
                var country_2 = companyInfo.getValue({ fieldId: 'country' });
                var country = companyInfo.getText({ fieldId: 'country' });
                log.debug('Country', country)
                // Retrieve customer information
                var identi = recInv.getValue({ fieldId: "entity" });
                var entityRec = record.load({ type: 'customer', id: identi });
                var entity = entityRec.getValue({ fieldId: "companyname" });
                var billaddress = recInv.getText({ fieldId: "billaddress" });

                // Retrieve script parameters
                const scriptObj = runtime.getCurrentScript();
                var url = scriptObj.getParameter({ name: 'custscript_url_api' });
                log.debug("url", url)
                var apiKey = scriptObj.getParameter({ name: 'custscript_api_key' });
                log.debug("apiKey", apiKey)

                // Prepare headers and data for the HTTP request
                var headers = {
                    "Content-Type": "application/json; charset=utf-8",
                    "x-api-key": apiKey
                }
                var data = {
                    "to": {
                        "firtName": "To", "lastName": "", "companyName": entity, "addressLine1": billaddress, country: country_2
                    },
                    "from": {
                        firtName: "From", lastName: "", companyName: companyname, addressLine1: mainaddress_text, country: country_2
                    },
                    "pdf": urlInv,
                    "object": "letter",
                    "live": false,
                    "addressPlacement": "insert_blank_page",
                }

                // Send the HTTP POST request
                var response = https.post({
                    url: url,
                    headers: headers,
                    body: JSON.stringify(data)
                });

                var responseBodyObject = JSON.parse(response.body)
                log.debug('Response Body', JSON.stringify(responseBodyObject) + " : code: " + response.code);
                var idGrid = responseBodyObject.id;

                // Check the response status and update the invoice record accordingly
                if (response.code == '201' && idGrid) {
                    recInv.setValue({
                        fieldId: 'custbody_sent_to_postgrid',
                        value: true
                    });
                    recInv.setValue({
                        fieldId: 'custbody_postgrid_id',
                        value: idGrid
                    });
                    recInv.save({
                        ignoreMandatoryFields: true
                    })
                } else if (response.code == '401' || response.code == '400') {
                    recInv.setValue({
                        fieldId: 'custbody_postgrid_errors',
                        value: 'Error Creating Letter ' + responseBodyObject.error.message
                    });
                    recInv.save({
                        ignoreMandatoryFields: true
                    })
                }
            } catch (error) {
                log.error(error.message, JSON.stringify(error)); // Log errors
            }
        }

        // Function to generate a URL for the invoice PDF
        function generateURL(invoiceId) {
            try {
                let doc = render.transaction({
                    entityId: Number(invoiceId),
                    printMode: render.PrintMode.PDF,
                });

                // Save the generated PDF to a specific folder
                doc.folder =2630584;// 878687;  // Folder named Invoices Postgrid
                doc.isOnline = true;
                var fileId = doc.save();

                // Load the file and generate the URL
                let f = file.load({
                    id: fileId,
                });
                f.isOnline = true;
                var domain = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                });
                let fileUrl = 'https://' + domain + f.url;

                var fileContent = doc.getContents();
                return fileUrl;
            } catch (error) {
                log.error(error.message, JSON.stringify(error)); // Log errors
            }

        }

        // Map function to process each invoice
        function map(context) {
            try {
                var invoiceId = JSON.parse(context.value);
                log.debug('invoiceId', JSON.stringify(invoiceId))
                /*     var recInv = record.load({
                        type: 'invoice',
                        id: invoiceId.id
                    });
                    var IDCustomer = companyInfo.getValue({ fieldId: 'entity' }); */
                // if (getRoleAP(IDCustomer)) {
                log.debug('invoiceId', invoiceId.id)
                var urlInv = generateURL(invoiceId.id);
                createLetter(urlInv, invoiceId.id)
                //  }


            } catch (error) {
                log.error(error.message, JSON.stringify(error)); // Log errors
            }
        }

        // Reduce function (currently just counts the number of processed items)
        function reduce(context) {
            context.write({
                key: context.key,
                value: context.values.length
            });
        }

        // Summarize function to log the final statistics
        function summarize(context) {
            log.audit({
                title: 'Usage units consumed',
                details: context.usage
            });
            log.audit({
                title: 'Concurrency',
                details: context.concurrency
            });
            log.audit({
                title: 'Number of yields',
                details: context.yields
            });

        }

        // Return the entry points for the MapReduce script
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });
