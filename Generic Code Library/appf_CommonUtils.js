/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */

/**
 * @file       A collection of utilities that can be used both in client-side and server-side scripts.
 * @company    Appficiency Inc.
 * 
 * @author     Krizzia Jane Rivera <krivera@appficiencyinc.com>
 * @date       September 14, 2021
 * @version    1.0     krivera                  Initial
 *             1.1     krivera     02022022     Update allColumnsSearch to build filter array
 *             1.2     krivera     04042022     Update allColumnsSearch to build add useLabel parameter
 *             1.3     krivera     08062022     Fix 4000 result limit on allColumnsSearch
 *             1.4     krivera     10102022     Add unique array
 *             1.5     krivera     11062022     Add create record field-value in JSON format based on JSON field mapping
 *             1.6     krivera     11282022     Add get record field-value in JSON format based on JSON field mapping
 *             1.7     krivera     11282022     Add get record field-value in JSON format based on JSON field mapping with sublist
 *             1.8     krivera     05032023     Fix getText result, do not add if empty.
 *             1.9     acuatero    06272023     Updated getAllResults to use runPaged instead of run to lessen the governance units for the function
 *             2.0     krivera     08292023     Use column index instead of loading field value by name.
 *          
 * 
 */

/**
 * This script provides various shared/reusable utility functions.
 *
 * As the name suggests, it includes utilities that can be used in both client and server side scripts.
 * See https://netsuite.custhelp.com/app/answers/detail/a_id/43517 for list of all modules and their dependencies.
 * 
 * Users can access the functions in this module via the wrapper modules:
 * - ClientUtils.js - Includes all functions here as well as functions with dependencies on client side-only modules. 
 * - ServerUtils.js - Includes all functions here as well as functions with dependencies on server side-only modules.
 */

define(['N/error', 'N/record', 'N/runtime', 'N/url', 'N/search'],

function(error, record, runtime, url, search) {

   // Global variables
   const SCRIPT_FILE_NAME = 'CommonUtils.js';

   function allColumnsFilterExpSearch(searchId, filters, count) {
       try {
           var resultArr = [];
           if (!searchId) return resultArr;

           var allColSearch = search.load({
               id: searchId
           });

           allColSearch.filterExpression = filters;

           if (count && typeof count == 'number' && count > 0) {
               var resultSet = allColSearch.run();

               var resultRange = resultSet.getRange({
                   start: 0,
                   end: count
               });

               for (var i = 0; i < resultRange.length; i++) {
                   var resultObj = {};
                   allColSearch.columns.forEach(function(col) {
                       resultObj[col.name] = resultRange[i].getValue({name: col.name, join: col.join, summary:col.summary});
                   });
                   resultArr.push(resultObj);
               }
           } else {
               allColSearch.run().each(function(result){
                   var resultObj = {};
                   allColSearch.columns.forEach(function(col) {
                       resultObj[col.name] = result.getValue({name: col.name, join: col.join, summary:col.summary});
                   });
                   resultArr.push(resultObj);  
                   return true;
               });
           }
           return resultArr;

       } catch (e) {
           log.error({
               title: 'ERROR when executing allColumnsFilterExpSearch function ' + SCRIPT_FILE_NAME + '.',
               details: e.message
           });
       }
   }
   function allColumnsSearch(searchId, filters, count, useLabel) {
       try {
           var resultArr = [];
           if (!searchId) return resultArr;

           var allColSearch = search.load({
               id: searchId
           });
   
           if (filters) {
               for (var i = 0; i < filters.length; i++) {
                   allColSearch.filters.push(filters[i]);
               }
           }

           if (count && typeof count == 'number' && count > 0) {
               var resultSet = allColSearch.run();

               var resultRange = resultSet.getRange({
                   start: 0,
                   end: count
               });

               for (var i = 0; i < resultRange.length; i++) {
                   var resultObj = {};
                   allColSearch.columns.forEach(function(col, index) {
                        var textValue = slice.getText(s.columns[index]);
                        var value = slice.getValue(s.columns[index]);
                        if (useLabel) {	
                            resultObj[col.label] = value;
                            if (!isEmpty(textValue)) {
                                resultObj[col.label + "__text"] = textValue;
                            }
                        } else {	
                            resultObj[col.name] = value;
                            if (!isEmpty(textValue)) {
                                resultObj[col.name + "__text"] = textValue;
                            }	
                        }	
                   });
                   resultArr.push(resultObj);
               }
           } else {
               resultArr = getAllResults(allColSearch, useLabel);
           }
           return resultArr;

       } catch (e) {
           log.error({
               title: 'ERROR when executing allColumnsSearch function ' + SCRIPT_FILE_NAME + '.',
               details: e
           });
       }
   }
   function getAllResults(s, useLabel) {
       // var results = s.run();
       var searchResults = [];
       var searchid = 0;
       var results = s.runPaged({ pageSize: 1000 });
       for (let i = 0; i < results.pageRanges.length; i++) {	
           const SearchPage = results.fetch({ index: i });	
           SearchPage.data.forEach((slice) => {	
               var resultObj = {};	
               s.columns.forEach(function(col, index) {	
                   var textValue = slice.getText(s.columns[index]);
                   var value = slice.getValue(s.columns[index]);
                   if (useLabel) {	
                       resultObj[col.label] = value;
                       if (!isEmpty(textValue)) {
                           resultObj[col.label + "__text"] = textValue;
                       }
                   } else {	
                       resultObj[col.name] = value;
                       if (!isEmpty(textValue)) {
                           resultObj[col.name + "__text"] = textValue;
                       }	
                   }	
               });	
               searchResults.push(resultObj);	
               searchid++;
           });
       }
      
       return searchResults;
   }
   function getScriptParamValue(paramField) {
       try {
           if (!isEmpty(paramField)) {
               return runtime.getCurrentScript().getParameter(paramField);
           } else {
               throw error.create('Invalid argument.');
           }
       } catch (e) {
           log.error({
               title: 'ERROR when executing getScriptParam of ' + SCRIPT_FILE_NAME + '.',
               details: e.message
           });
       }
   }
   function getUsage(){
       try {
           return runtime.getCurrentScript().getRemainingUsage();
       } catch (e) {
           log.error({
               title: 'ERROR when executing getUsage of ' + SCRIPT_FILE_NAME + '.',
               details: e.message
           });
       }
   }
   function logError(scriptName, funcName, e) {
       log.error({
           title: 'ERROR when executing ' + funcName + ' of ' + scriptName + '.',
           details: 'Message: ' + e.message + ' Error Details: ' + e.stack
       });
   }

   function isEmpty (stValue) {
       return (
           (stValue === '' || stValue == null || stValue == undefined) || (stValue.constructor === Array && stValue.length == 0) || (stValue.constructor === Object && (
               function(v) {
                   for (var k in v)
                       return false;
                   return true;
               }
           )(stValue)));
   }

   // Takes an array of objects and the property by which they should be grouped.
   // Produces an object of arrays keyed by the specified property values.
   // 
   // Provide multiple keys if your data is nested:   groupBy(dogs, 'values', 'emoji')
   // 
   // Ex: [{id: 1, group: 'A'}, {id: 2, group: 'B'}, {id: 3, group: 'A'}],   'group'
   //     =>
   //     {A: [{id: 1, group: 'A'}, {id: 3, group: 'A'}], B: [{id: 2, group: 'B'}]}
   const groupBy = (data, ...keys) =>
   {
       // Ex: {values: {color: 'red'}}, ['values', 'color'] => 'red'
       const getGroupFromItem = (item, keys) =>
       {
           return (keys.length > 1)
               ? getGroupFromItem(item[keys[0]], keys.slice(1))
               : item[keys[0]]
       }
       
       return data.reduce((results, item) =>
           {
               // Get the first instance of the key by which we're grouping
               var group = getGroupFromItem(item, keys);
               
               // Ensure that there's an array to hold our results for this group
               results[group] = results[group] || [];
               
               // Add this item to the appropriate group within results
               results[group].push(item);
               
               // Return the updated results object to be passed into next reduce call
               return results; 
           },
           
           // Initial value of the results object
           {}
       );
   };
   const reduceUnique = (arr, key) => {
       try {
           var newArr = arr.reduce((acc, current) => {
               
               const x = acc.find(item => item[key] === current[key]);
               if (!x) {
                 return acc.concat([current]);
               } else {
                 return acc;
               }
           }, []);
           return newArr;
       } catch (e) {
           log.error({
               title: 'ERROR when executing reduceUnique of ' + SCRIPT_FILE_NAME + '.',
               details: e
           });
       }
   }
   const getRecordObj = (id, type, mapping, useKey) => {
       try {
           var tempObj = {};

           if (isEmpty(id) || isEmpty(type) || isEmpty (mapping)) return;

           var rec = record.load({
               id: id,
               type: type
           });

           for (const key in mapping) {
               if (Object.hasOwnProperty.call(mapping, key)) {
                   if (useKey) {
                       tempObj[key] = rec.getValue(mapping[key]) || '';
                   } else {
                       tempObj[mapping[key]] = rec.getValue(mapping[key]) || '';
                   }
               }
               // log.debug('getRecordObj', JSON.stringify({
               //     valid: Object.hasOwnProperty.call(mapping, key),
               //     key: key,
               //     field: mapping[key],
               //     value: tempObj[key]
               // }));
           }
           return tempObj;
       } catch (e) {
           log.error({
               title: 'ERROR when executing getRecordObj of ' + SCRIPT_FILE_NAME + '.',
               details: e
           });
       }
   }
   const getRecordObjWithSublist = (id, type, mapping, useKey) => {
       try {
           var tempObj = {};

           if (isEmpty(id) || isEmpty(type) || isEmpty (mapping)) return;

           var rec = record.load({
               id: id,
               type: type
           });

           for (const key in mapping) {
               if (Object.hasOwnProperty.call(mapping, key)) {
                   if (typeof key == 'object') {

                   } else {
                       if (useKey) {
                           if (mapping[key])
                           tempObj[key] = rec.getValue(mapping[key]) || '';
                       } else {
                           tempObj[mapping[key]] = rec.getValue(mapping[key]) || '';
                       }
                   }
               }
               // log.debug('getRecordObj', JSON.stringify({
               //     valid: Object.hasOwnProperty.call(mapping, key),
               //     key: key,
               //     field: mapping[key],
               //     value: tempObj[key]
               // }));
           }
           return tempObj;
       } catch (e) {
           log.error({
               title: 'ERROR when executing getRecordObj of ' + SCRIPT_FILE_NAME + '.',
               details: e
           });
       }
   }
   const setRecordObj = (type, value) => {
       try {
           if (isEmpty(type) || isEmpty (value)) return;

           var rec = record.create({
               type: type
           });

           for (const key in value) {
               if (Object.hasOwnProperty.call(value, key)) {
                   if (!isEmpty(value[key])) {
                       rec.setValue({
                           fieldId: key,
                           value: value[key]
                       });
                   }
               }
               // log.debug('getRecordObj', JSON.stringify({
               //     valid: Object.hasOwnProperty.call(mapping, key),
               //     key: key,
               //     field: mapping[key],
               //     value: tempObj[key]
               // }));
           }
           var newId = rec.save({
               enableSourcing: false,
               ignoreMandatoryFields: true
           });
           log.debug('New Record: '+ JSON.stringify({
               id: newId,
               type: type
           }));
           return newId;
       } catch (e) {
           log.error({
               title: 'ERROR when executing setRecordObj of ' + SCRIPT_FILE_NAME + '.',
               details: e
           });
       }
   }
   return {
       logError: logError,
       allColumnsSearch: allColumnsSearch,
       allColumnsFilterExpSearch: allColumnsFilterExpSearch, 
       getScriptParamValue: getScriptParamValue,
       getUsage: getUsage,
       isEmpty: isEmpty,
       groupBy: groupBy,
       reduceUnique: reduceUnique,
       getRecordObj: getRecordObj,
       setRecordObj: setRecordObj,
       getRecordObjWithSublist: getRecordObjWithSublist
   }
});
