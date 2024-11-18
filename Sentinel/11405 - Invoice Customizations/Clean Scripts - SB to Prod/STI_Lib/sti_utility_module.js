/**
 *
 * @NApiVersion 2.1
 * @description Perform Utility Operations.
 *
 * Script Name: sti_utility_module.js
 *
 */

define([
    'N/file',
    './sti_integration_lib',
],
    function (FILE, SNOW) {
        var rtnObj = {};
        rtnObj.addLog = function (logTitle, logText) {
            var theGuid = create_UUID();
            var fileName = logTitle + '_' + theGuid + '.txt';
            var fileObj = FILE.create({
                name: fileName,
                fileType: FILE.Type.PLAINTEXT,
                contents: logText.toString(),
                description: logTitle,
                folder: 6084,
                isOnline: false
            });
            var fileId = fileObj.save();
            return fileId;
        }
        rtnObj.calcTimeDiff = function (fromTime, thruTime) {
            //Send variables as "new Date()";
            var fromSeconds = fromTime.getTime() / 1000;
            var thruSeconds = thruTime.getTime() / 1000;
            var diffSeconds = (thruSeconds - fromSeconds).toFixed(2);
            return diffSeconds;
        }
        rtnObj.dateMMDDYYYY = function (dateStr) {
            var formattedDate = '';
            var monthWords = ['Zero', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dateStr = dateStr.toString();
            var arrayWords = dateStr.split(' ');
            if (arrayWords.length >= 4) {
                var monthName = arrayWords[1];
                var monthNumber = '00' + monthWords.indexOf(monthName);
                //monthNumber = monthNumber.slice(-2);
                formattedDate = monthNumber.slice(-2) + '/' + arrayWords[2] + '/' + arrayWords[3];
            }
            return formattedDate;
        }
        rtnObj.dateYYYYMMDD = function (dateStr) {
            var formattedDate = '';
            var arrayWords = dateStr.replace('T', '-').split('-');
            if (arrayWords.length >= 3) {
                var theYear = arrayWords[0];
                var theMonth = arrayWords[1];
                var theDay = arrayWords[2];
                formattedDate = theMonth + '/' + theDay + '/' + theYear;
            }
            return formattedDate;
        }//"2023-04-11T13:13:11.000Z"
        rtnObj.getBoolean = function (theSndVal) {
            var theRtnVal = false;
            try {
                if (SNOW.isEmpty(theSndVal)) {
                    theSndVal = 'FALSE';
                }
                theSndVal = theSndVal.toString().toUpperCase();
                var theRtnVal = Boolean(theSndVal == 'TRUE');
            } catch (err) {
                log.error('Error', err.toString());
                theRtnVal = false;
            }
            return theRtnVal;
        }
        rtnObj.getUUID = function () {
            return create_UUID();
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