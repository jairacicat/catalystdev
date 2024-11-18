/**
 * Version #    Date         User            Description
 * 1.0          07.11.2024   plee            All webhook for CU and CWM tickets. Webhook for CU to CWM time entry for date today.
 * 2.0          07.11.2024   jcicat          Added webhook logic for CU and and CWM Time Entry.
 * 3.0          07.11.2024   jcicat          New script for dev testing of CU-CWM Webhook.
 */


//Main webhook callback for CW Manage from Netsuite
// This will allow any third party application to post to this suitelet and post it back to CW Manage

//CWM Parameters
var CWM_NAME = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cwmname');
var CWM_API_MEMBER_NAME = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_apimember');
var CW_ACCOUNT_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cwaccount');
var CW_TIME_REDIRECT_URL =  nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cwmtimeurl');
var CW_TICKET_REDIRECT_URL = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cwmticketurl');
var CWM_TIME_ENTRY_CU_TASK_ID_FIELD_ID = 40;
var CWM_TIME_ENTRY_CU_TIME_ID_FIELD_ID = 41;
var CWM_TICKET_CU_TASK_LINK_ID_FIELD_ID = 38;
var CWM_TICKET_CU_TASK_ID_FIELD_ID = 39;
var CW_SCHEDULE_TYPE_ID = 4;

//CLICKUP Parameters
var CLICKUP_NAME = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cuname');
var CU_AUTH_ACCESS_TOKEN = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_token');
var CU_API_URL = 'https://api.clickup.com';
var CU_BASE_URL = 'https://app.clickup.com';
var CU_SPACE_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_spaceid');
var CU_SYSTEM_INTEGRATION_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_ctc_oip_cfg_dev_cuintegid');

var MATRIX_MAPPING_TYPE_BOARD_TO_LIST = 1;
var MATRIX_MAPPING_TYPE_MEMBER_TO_USER = 2;
var MATRIX_MAPPING_TYPE_STATUS_TO_STATUS = 3;

var INTEGRATION_STATUS_INQUEUE = 1;
var INTEGRATION_STATUS_SUCCESS = 2;
var INTEGRATION_STATUS_ERROR = 3;
var INTEGRATION_STATUS_REJECTED = 4;

//var NS_WEBHOOK_URL = 'https://tstdrv1716438.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=309&deploy=1&compid=TSTDRV1716438&h=619d07712869fc7a359a';
var NS_WEBHOOK_URL = 'https://tstdrv1716438.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=479&deploy=1&compid=TSTDRV1716438&ns-at=AAEJ7tMQpebO18GX0KF-rt60MWj6VUN5O_-drIt22Ok_rTrclnI';

var CWM_BOARD_NAME_FUNCTIONAL = 'NetSuite Support Functional';
var CWM_BOARD_NAME_TECHNICAL = 'NetSuite Support Technical';
var CWM_BOARD_NAME_SOLUTION = 'Solution Design';
var CWM_BOARD_NAME_CONNECTWISE_SUPPORT = 'ConnectWise Manage Support';
var CWM_BOARD_NAME_COMMISSION_SUPPORT = 'Commission Support';
var CWM_BOARD_NAME_VAR_CONNECT_SUPPORT = 'VAR Connect Support';

var CWM_STATUS_NAME_CANCELLED = '>Cancelled';
var CWM_STATUS_NAME_CLOSED = '>Closed';
var CWM_STATUS_NAME_ASSIGNED = 'Assigned';
var CWM_STATUS_NAME_RESPONDED = 'Client Responded';
var CWM_STATUS_NAME_INPROGRESS = 'In Progress';
var CWM_STATUS_NAME_LONGTERM = 'Long Term';
var CWM_STATUS_NAME_NEW = 'New';
var CWM_STATUS_NAME_ONHOLD = 'On Hold';
var CWM_STATUS_NAME_REOPENED = 'Re-Opened';
var CWM_STATUS_NAME_SENDCHANGEREQUEST = 'Send Change Request for Approval';
var CWM_STATUS_NAME_SENDESTIMATE = 'Send Estimate (Resolution) to Customer';
var CWM_STATUS_NAME_TICKETCLOSEREQUEST = 'Ticket Close Request then Automated Close';
var CWM_STATUS_NAME_WAITING = 'Waiting Client Response';

//TODO: Change these IDs on CU Production
var CU_LIST_ID_FUNCTIONAL = '205609241';
var CU_LIST_ID_TECHNICAL = '170354003';
var CU_LIST_ID_SOLUTION = '170354012';
var CU_LIST_ID_CONNECTWISE_SUPPORT = '170354015';
var CU_LIST_ID_COMMISSION_SUPPORT = '170354064';
var CU_LIST_ID_VAR_CONNECT_SUPPORT = '170354066';

//TODO: Change these IDs on CU Production
var CU_STATUS_ID_CANCELLED = '>cancelled';
var CU_STATUS_ID_CLOSED = '>closed';
var CU_STATUS_ID_ASSIGNED = 'assigned'; //TODO: Needs fixing
var CU_STATUS_ID_RESPONDED = 'client responded'; // OK
var CU_STATUS_ID_INPROGRESS = 'in progress'; // OK
var CU_STATUS_ID_LONGTERM = 'long term';
var CU_STATUS_ID_NEW = 'new'; // OK
var CU_STATUS_ID_ONHOLD = 'on hold'; //TODO: Needs fixing
var CU_STATUS_ID_REOPENED = 're-opened'; //TODO: Needs fixing
var CU_STATUS_ID_SENDCHANGEREQUEST = 'send change req approval';
var CU_STATUS_ID_SENDESTIMATE = 'send estimate to customer';
var CU_STATUS_ID_TICKETCLOSEREQUEST = 'ticket close request';
var CU_STATUS_ID_WAITING = 'waiting client response';

function getMatrixMappingValue(mappingType, valueInput, fromOrigin) {
    var returnValue = '';

    try {
        if(valueInput)
            valueInput = valueInput.toString();

//load search for scheduled script
        var colArr = new Array();
        var filterArr = new Array();

        colArr.push(new nlobjSearchColumn('internalid').setSort(true));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_mappingtype'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_destination_value'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_origin_value'));

        filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_mappingtype', null, 'anyof', mappingType));
        valueInput = valueInput.replace(">", "&gt;");
        if(fromOrigin == true) {
            //if from Origin is true then match the value input mapping to the origin value and return the destination value
            filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_origin_value', null, 'is', valueInput));
        } else {
            //if from Origin is false then match the value input mapping to the destination value and return the origin value
            //temp fix for ">" bug

            filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_destination_value', null, 'is', valueInput));
        }


        var searchResults = nlapiSearchRecord('customrecord_ctc_oip_matrixmapping', null, filterArr, colArr);

        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                var searchResultRow = searchResults[i];
                if(fromOrigin == true) {
                    returnValue = searchResultRow.getValue('custrecord_ctc_oip_destination_value');
                } else {
                    returnValue = searchResultRow.getValue('custrecord_ctc_oip_origin_value');
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get mapping value for mapping type: ' + mappingType, 'Value Input: ' + valueInput + ' Error: ' + err);
    }
    returnValue = returnValue.replace('&gt;', ">");
    return returnValue;
}

function getStatusIDFromCWMStatusName(cwmStatusName) {
    //grabs the correct List Name on CU based on Status Name from CWM
    var returnStatusName = CU_STATUS_ID_NEW;

    switch (cwmStatusName) {
        case CWM_STATUS_NAME_CANCELLED:
            returnStatusName = CU_STATUS_ID_CANCELLED;
            break;
        case CWM_STATUS_NAME_CLOSED:
            returnStatusName = CU_STATUS_ID_CLOSED;
            break;
        case CWM_STATUS_NAME_ASSIGNED:
            returnStatusName = CU_STATUS_ID_ASSIGNED;
            break;
        case CWM_STATUS_NAME_RESPONDED:
            returnStatusName = CU_STATUS_ID_RESPONDED;
            break;
        case CWM_STATUS_NAME_INPROGRESS:
            returnStatusName = CU_STATUS_ID_INPROGRESS;
            break;
        case CWM_STATUS_NAME_LONGTERM:
            returnStatusName = CU_STATUS_ID_LONGTERM;
            break;
        case CWM_STATUS_NAME_NEW:
            returnStatusName = CU_STATUS_ID_NEW;
            break;
        case CWM_STATUS_NAME_ONHOLD:
            returnStatusName = CU_STATUS_ID_ONHOLD;
            break;
        case CWM_STATUS_NAME_REOPENED:
            returnStatusName = CU_STATUS_ID_REOPENED;
            break;
        case CWM_STATUS_NAME_SENDCHANGEREQUEST:
            returnStatusName = CU_STATUS_ID_SENDCHANGEREQUEST;
            break;
        case CWM_STATUS_NAME_SENDESTIMATE:
            returnStatusName = CU_STATUS_ID_SENDESTIMATE;
            break;
        case CWM_STATUS_NAME_TICKETCLOSEREQUEST:
            returnStatusName = CU_STATUS_ID_TICKETCLOSEREQUEST;
            break;
        case CWM_STATUS_NAME_WAITING:
            returnStatusName = CU_STATUS_ID_WAITING;
            break;
        default:
            returnStatusName = CU_STATUS_ID_NEW;
    }
    return returnStatusName;
}

function getCWMStatusNameFromCUStatusName(cuStatusName) {
    //grabs the correct CWM Status Name based on List Name from CU
    var returnStatusName = CWM_STATUS_NAME_NEW;

    switch (cuStatusName) {
        case CU_STATUS_ID_CANCELLED:
            returnStatusName = CWM_STATUS_NAME_CANCELLED;
            break;
        case CU_STATUS_ID_CLOSED:
            returnStatusName = CWM_STATUS_NAME_CLOSED;
            break;
        case CU_STATUS_ID_ASSIGNED:
            returnStatusName = CWM_STATUS_NAME_ASSIGNED;
            break;
        case CU_STATUS_ID_RESPONDED:
            returnStatusName = CWM_STATUS_NAME_RESPONDED;
            break;
        case CU_STATUS_ID_INPROGRESS:
            returnStatusName = CWM_STATUS_NAME_INPROGRESS;
            break;
        case CU_STATUS_ID_LONGTERM:
            returnStatusName = CWM_STATUS_NAME_LONGTERM;
            break;
        case CU_STATUS_ID_NEW:
            returnStatusName = CWM_STATUS_NAME_NEW;
            break;
        case CU_STATUS_ID_ONHOLD:
            returnStatusName = CWM_STATUS_NAME_ONHOLD;
            break;
        case CU_STATUS_ID_REOPENED:
            returnStatusName = CWM_STATUS_NAME_REOPENED;
            break;
        case CU_STATUS_ID_SENDCHANGEREQUEST:
            returnStatusName = CWM_STATUS_NAME_SENDCHANGEREQUEST;
            break;
        case CU_STATUS_ID_SENDESTIMATE:
            returnStatusName = CWM_STATUS_NAME_SENDESTIMATE;
            break;
        case CU_STATUS_ID_TICKETCLOSEREQUEST:
            returnStatusName = CWM_STATUS_NAME_TICKETCLOSEREQUEST;
            break;
        case CU_STATUS_ID_WAITING:
            returnStatusName = CWM_STATUS_NAME_WAITING;
            break;
        default:
            returnStatusName = CWM_STATUS_NAME_NEW;
    }
    return returnStatusName;
}

function getConnectwiseWebhookStatus() {
    var status = "<span style='background-color:red; color: white; font-size: 11pt;'>INACTIVE</span>";

    try {
        var JSONData = getJSONData('system/callbacks/3', 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
        if(JSONData) {
            if(JSONData.inactiveFlag == false) {
                status = "<span style='background-color:green; color: white; font-size: 11pt;'>ACTIVE</span>";
            } else {
                status = "<span style='background-color:red; color: white; font-size: 11pt;'>INACTIVE</span>";
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get CWM Webhook status', err);
    }

    return status;
}

function getCUWebhookStatus() {
    var statusObject = {};
    var failcount = 0;
    var status = "<span style='background-color:red; color: white; font-size: 11pt;'>INACTIVE</span>";

    try {
        var JSONData = nlapiRequestURL(CU_API_URL + '/api/v2/team/36066827/webhook/', null, getCUHeaderSettings(), null, 'GET');
        if(JSONData) {
            var JSONDataParse = JSON.parse(JSONData.getBody());
            var JSONDataObject = JSONDataParse.webhooks[0];
            failcount = JSONDataObject.health.fail_count;
            if(JSONDataObject.health.status == 'active') {
                status = "<span style='background-color:green; color: white; font-size: 11pt;'>ACTIVE</span>";
            } else {
                status = "<span style='background-color:red; color: white; font-size: 11pt;'>" + JSONDataObject.health.status + "</span>";
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get CU Webhook status', err);
    }
    statusObject.status = status;
    statusObject.failcount = failcount;

    return statusObject;

}

function mainPage(request, response)
{
    var messageLog = '';
    var JSONData;
    if(request.getMethod() == 'GET')
    {
        nlapiLogExecution('DEBUG', 'GET Callback Captured', request.getBody());
        var runMode = request.getParameter('custparam_runmode');
        if(runMode == 'mappinghelptool') {
            var message = '<b>CWM to Clickup Integration Matrix Mapping Help<br/>This is a list of names and ids for to help you create matrix mappings for CWM to CU.</b><br /><br />';
            message = message + '<table width="100%" border="1"><tr><td valign="top">CWM MEMBER NAME/ID LIST (copy the ID and map to a CU User ID)<br />';
            var CWMMemberJSONData = getJSONData('system/members/', 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&fields=id,identifier,firstName,lastName');
            for (var i = 0; i < CWMMemberJSONData.length; i++) {
                message = message + '<br />ID: ' + CWMMemberJSONData[i].id + ' Name: ' + CWMMemberJSONData[i].firstName + ' ' + CWMMemberJSONData[i].lastName;
            }
            message = message + '</td>';
            message = message + '<td valign="top">CLICKUP USER ID LIST (you need to copy the ID and map to a CWM Member ID)<br />';
            var CUUserJSONData = nlapiRequestURL(CU_API_URL + '/api/v2/team/36066827', null, getCUHeaderSettings(), null, 'GET')
            CUUserJSONData = JSON.parse(CUUserJSONData.getBody());
            nlapiLogExecution('DEBUG', 'payload: ', JSON.stringify(CUUserJSONData));
            for (var i = 0; i < CUUserJSONData.team.members.length; i++) {
                message = message + '<br />ID: ' + CUUserJSONData.team.members[i].user.id + ' Name: ' + CUUserJSONData.team.members[i].user.username;
            }

            message = message + '</td></tr>';
            message = message + '<tr><td valign="top">CONNECTWISE MANAGE STATUS NAME LIST (copy the status name and map to a CU Status Name)<br />';
            var CWMStatusJSONData = getJSONData('service/boards/1/statuses', 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&fields=name');
            for (var i = 0; i < CWMStatusJSONData.length; i++) {
                message = message + '<br />Name: ' + CWMStatusJSONData[i].name;
            }
            message = message + '</td>';

            message = message + '<td valign="top">CLICKUP STATUS NAME LIST (copy the status name and map to a CWM Status Name)' + '<br />';
            var CUStatusJSONData = nlapiRequestURL(CU_API_URL + '/api/v2/space/32105640', null, getCUHeaderSettings(), null, 'GET')
            CUStatusJSONData = JSON.parse(CUStatusJSONData.getBody());
            var cuStatusesArray = CUStatusJSONData.statuses;
            for (var i = 0; i < cuStatusesArray.length; i++) {
                message = message + '<br />Name: ' + cuStatusesArray[i].status;
            }
            message = message + '</td></tr>';

            message = message + '<tr><td valign="top">CONNECTWISE MANAGE BOARD NAME LIST (you need to copy the board name and map to a CU Folder ID)' + '<br />';
            var CWMBoardJSONData = getJSONData('service/boards/', 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&fields=name');
            for (var i = 0; i < CWMBoardJSONData.length; i++) {
                message = message + '<br />Name: ' + CWMBoardJSONData[i].name;
            }
            message = message + '</td>';
            message = message + '<td valign="top">CLICKUP FOLDERS ID LIST (you need to copy the ID and map to a CWM Board Name)' + '<br />';
            var CUFolderJSONData = nlapiRequestURL(CU_API_URL + '/api/v2/space/32105640/list', null, getCUHeaderSettings(), null, 'GET')
            CUFolderJSONData = JSON.parse(CUFolderJSONData.getBody());
            nlapiLogExecution('DEBUG', 'payload: ', JSON.stringify(CUFolderJSONData));
            for (var i = 0; i < CUFolderJSONData.lists.length; i++) {
                if(CUFolderJSONData.lists[i].space.id == '32105640') {
                    message = message + '<br />ID: ' +  CUFolderJSONData.lists[i].id + ' Name: ' + CUFolderJSONData.lists[i].name;
                }
            }
            message = message + '</td></tr>';
            message = message + '</table>';


            response.write(message);
        } else if(runMode == 'webhookstatus') {
            var form = nlapiCreateForm('Webhook Status Page', false);
            var cuStatus = getCUWebhookStatus();
            var statusText = '<b>Conectwise Manage Webhook Status: </b>' + getConnectwiseWebhookStatus() + '<br/><br/><b>Clickup Webhook Status: </b>' + cuStatus.status;
            if(cuStatus.status.indexOf('failing') != - 1) {
                statusText = statusText + ' Fail Count: ' + cuStatus.failcount;
                statusText = statusText + '<br/><br />Note: Failing does not mean the webhook is inactive. Only Re-activate the webhooks if you see "suspended" or "inactive"';
            }
            var labelField = form.addField('custpage_label1', 'inlinehtml', 'Label');
            labelField.setDefaultValue(statusText);
            var whField = form.addField('custpage_activatewebhook', 'text', 'Activate Webhook').setDisplayType('hidden');
            whField.setDefaultValue('T');
            var submitButton = form.addSubmitButton('Activate CWM/CU Webhooks');
            response.writePage(form);
        }
        else {
            response.write('ERROR: Unauthorized access, illegal attempt: ' + request.getBody());
        }
    }
    //GET - Standard Status page
    if(request.getMethod() == 'POST') {
        if (request.getParameter('custpage_activatewebhook') == 'T') {
            var webhookform = nlapiCreateForm('Activated CWM and Clickup Webhook.. click back and check status again');

            var jsonPostObjectWH = {
                "id": 3,
                "url": "https://tstdrv1716438.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=479&deploy=1&compid=TSTDRV1716438&ns-at=AAEJ7tMQpebO18GX0KF-rt60MWj6VUN5O_-drIt22Ok_rTrclnI&origin=cwm",
                "objectId": 1,
                "type": "ticket",
                "level": "owner",
                "inactiveFlag": false
            };

            var cuPostWH = {
                "status": "active"
            };
            var cwmPOST = postJSONData('system/callbacks/3', jsonPostObjectWH, null, 'PUT', CW_ACCOUNT_ID);
            var cuPOST =  nlapiRequestURL(CU_API_URL + '/api/v2/webhook/bcf5329b-67fd-4da1-a884-90fb3b61e36e', JSON.stringify(cuPostWH), getCUHeaderSettings(),'PUT');
            nlapiLogExecution('DEBUG', 'CU POST BODY', cuPOST.getBody());
            response.writePage(webhookform);
        } else {
            nlapiLogExecution('DEBUG', 'POST Callback Captured', request.getBody());
            var JSONPayloadString = request.getBody();
            var logRecordId;
            var JSONData = JSON.parse(JSONPayloadString);
            var customerFlagAlreadyUpdated = false;

            //Clickup to CWM Integration - Task status is updated
            var lastUpdatedDate = '';
            var userName = '';
            var userId = '';
            var initialLogStatus = INTEGRATION_STATUS_INQUEUE;
            if (JSONData.event == 'taskStatusUpdated') {
                var statusUpdate = '';
                var historyItemsArr = JSONData.history_items;
                if (historyItemsArr && historyItemsArr.length > 0) {
                    if (historyItemsArr[0].after) {
                        lastUpdatedDate = historyItemsArr[0].date;
                        statusUpdate = historyItemsArr[0].after.status;
                        userName = historyItemsArr[0].user.username;
                        userId = historyItemsArr[0].user.id.toString();
                        nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);

                        if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                            statusUpdate = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, statusUpdate, false);
                            var taskObject = getTaskTicketId(JSONData.task_id);

                            var cwTicketId = '';
                            cwTicketId = taskObject.cwticketid;
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Setting Ticket ID: ' + cwTicketId + ' status on CWM to ' + statusUpdate;
                            messageLog = messageLog + '\n' + taskObject.message;
                            if (taskObject.cwticketid == '') {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                            }
                            if(statusUpdate == null || statusUpdate == '')
                            {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: Status update is invalid, there is no matrix mapping list / status combo selected: ' + statusUpdate;
                            }
                            logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', 'Update CWM Ticket Status', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                            updateCWMTicketStatus(cwTicketId, statusUpdate, logRecordId, taskObject.isprojectticket);
                            customerFlagAlreadyUpdated = true;
                        }
                    }
                }
            }

            // //Clickup to CWM Integration - Moved a task to a different board
            if (JSONData.event == 'taskMoved') {
                var boardUpdate = '';
                var historyItemsArr = JSONData.history_items;
                if (historyItemsArr && historyItemsArr.length > 0) {
                    if (historyItemsArr[0].after) {
                        lastUpdatedDate = historyItemsArr[0].date;
                        boardUpdate = historyItemsArr[0].after.id;
                        userName = historyItemsArr[0].user.username;
                        userId = historyItemsArr[0].user.id.toString();
                        nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);

                        if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                            boardUpdate = getMatrixMappingValue(MATRIX_MAPPING_TYPE_BOARD_TO_LIST, boardUpdate, false);
                            var taskObject = getTaskTicketId(JSONData.task_id);
                            var cwTicketId = '';

                            cwTicketId = taskObject.cwticketid;
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Setting Ticket ID: ' + cwTicketId + ' BOARD on CWM to ' + boardUpdate;
                            messageLog = messageLog + '\n' + taskObject.message;
                            if (taskObject.cwticketid == '') {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                            }
                            if(boardUpdate == null || boardUpdate == '')
                            {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: Board Move is invalid, there is no matrix mapping list / board combo selected: ' + boardUpdate;
                            }
                            logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', 'Update CWM Ticket Board', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                            updateCWMTicketBoard(cwTicketId, boardUpdate, logRecordId);
                            customerFlagAlreadyUpdated = true;
                        }
                    }
                }
            }
            //assigned task owner
            if (JSONData.event == 'taskAssigneeUpdated') {
                var assignedId = '';
                var removedId = '';
                var assignedMemberId = '';
                var removedMemberId = '';
                var returnResult = 'Update CWM Ticket Assignee';
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                var historyItemsArr = JSONData.history_items;
                if (historyItemsArr && historyItemsArr.length > 0) {
                    lastUpdatedDate = historyItemsArr[0].date;
                    userName = historyItemsArr[0].user.username;
                    userId = historyItemsArr[0].user.id.toString();
                    nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);
                    if (historyItemsArr[0].after) {
                        assignedId = historyItemsArr[0].after.id;
                        assignedMemberId = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, assignedId, false);
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: Assigned a New User to Ticket/Task - User ID: ' + assignedId;
                        returnResult = 'Add CWM Ticket Assignee';
                    }
                    if (historyItemsArr[0].before) {
                        removedId = historyItemsArr[0].before.id;
                        removedMemberId = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, removedId, false);
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: Removed an assigned user to Ticket/Task - User ID: ' + removedId;
                        returnResult = 'Remove CWM Ticket Assignee';
                    }

                    if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                        // statusUpdate = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, statusUpdate, false);
                        var taskObject = getTaskTicketId(JSONData.task_id);

                        var cwTicketId = '';
                        cwTicketId = taskObject.cwticketid;
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Updating assigned member id on CWM for Ticket ' + cwTicketId + ' with member id ' + assignedMemberId + ' ' + removedMemberId;
                        messageLog = messageLog + '\n' + taskObject.message;
                        if (taskObject.cwticketid == '') {
                            initialLogStatus = INTEGRATION_STATUS_REJECTED;
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                        }
                        logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', returnResult, userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                        updateCWMTicketAssignee(cwTicketId, JSONData.task_id, assignedMemberId, removedMemberId, logRecordId, taskObject.isprojectticket);
                        customerFlagAlreadyUpdated = true;
                    }

                }
            }
            //Time Entry created
            if (JSONData.event == 'taskTimeTrackedUpdated') {
                var timeId = '';
                var timeSeconds = 0;
                var timeStart = 0;
                var timeEnd = 0;

                var timeMemberId = '';
                var historyItemsArr = JSONData.history_items;
                if (historyItemsArr && historyItemsArr.length > 0) {
                    if (historyItemsArr[0].after) {
                        lastUpdatedDate = historyItemsArr[0].date;
                        timeId = historyItemsArr[0].after.id;
                        timeSeconds = historyItemsArr[0].after.time;

                        // var timeObject = prepareTimeStartTimeEnd(historyItemsArr[0].after.start, timeSeconds);
                        // timeStart = timeObject.start;
                        // timeEnd = timeObject.end;

                        //timeStart = prepStartTime();
                        var timeStart = prepStartTime(parseInt(historyItemsArr[0].after.start))

                        //var timeStart2 = prepStartTime(historyItemsArr[0].after.start);
                        //timeStart = formatTimeToCWMDateTime(historyItemsArr[0].after.start);
                        // timeEnd = formatTimeToCWMDateTime(historyItemsArr[0].after.end);

                        userName = historyItemsArr[0].user.username;
                        userId = historyItemsArr[0].user.id.toString();

                        timeMemberId = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, userId, false);

                        if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                            // statusUpdate = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, statusUpdate, false);
                            var taskObject = getTaskTicketId(JSONData.task_id);
                            var taskTimeObject = getTaskTime(JSONData.task_id, timeId);
                          
                            var cwTicketId = '';
                            cwTicketId = taskObject.cwticketid;
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Creating CWM Time Entry for Ticket ID ' + cwTicketId + ' with time duration: ' + timeSeconds;
                            messageLog = messageLog + '\n' + taskObject.message;
                            messageLog = messageLog + '\n' + taskTimeObject.message;
                            if (taskObject.cwticketid == '') {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                            }
                            if (taskTimeObject.description == null || taskTimeObject.description == '' || taskTimeObject.description == 'undefined') {
                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No notes on Time Entry Task, sync will not go to CWM.';
                                //nlapiSendEmail(runLogOwner, runLogOwner, '[Clickup]', 'Your time entry does not have notes in it', ccEmailFinal, null, null, null);
                            }
                            var duplicateDetected = false;
                            //duplicateDetected = checkIfCUTimeIdExists(timeId);
                            var CWMTimeResult = checkIfCUTimeIdExists2(timeId);
                            var CWM_timeId = CWMTimeResult.id;
                            var CWM_timeStatus = CWMTimeResult.status;
                            nlapiLogExecution("EMERGENCY", "CWM TIME RESULT", JSON.stringify(CWMTimeResult));
                            duplicateDetected = (CWM_timeId != '') ? true : false;
                            nlapiLogExecution("EMERGENCY", "duplicate detected", duplicateDetected);

                            //Handle webhook trigger from CWM Time Entry creation:
                            if(CWM_timeId == '' && taskTimeObject.description.indexOf('CWMTimeID') != -1){
                                duplicateDetected = true;
                                var CWM_timeIdString = taskTimeObject.description.split("\n")[0];
                                CWM_timeIdString = CWM_timeIdString.replace("[", "");
                                CWM_timeIdString = CWM_timeIdString.replace("]", "");
                                CWM_timeId = CWM_timeIdString.split(":")[1];
                              
                            }
                           
                            //Update CWM Time Entry
                            if((duplicateDetected == true && CWM_timeStatus == "Open") || (duplicateDetected == true && CWM_timeStatus == "")) {
                                initialLogStatus = INTEGRATION_STATUS_INQUEUE;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': UPDATE TIME ENTRY: Duplicate time entry detected on CWM. Updating time entry webhook.';
                                nlapiLogExecution("EMERGENCY", "Duplicate Time detected in CWM", CWM_timeId);

                                logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'time', 'Update CWM Time Entry', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                                updateCWMTimeEntry(cwTicketId, JSONData.task_id, timeMemberId, taskObject.companyid, timeId, timeStart, timeEnd, taskTimeObject.description, logRecordId, timeSeconds, taskObject.isprojectticket, taskObject.ischargecode, CWM_timeId);
                                nlapiLogExecution("EMERGENCY", "TIME UPDATED", CWM_timeId);   
                                customerFlagAlreadyUpdated = true;
                            }

                            //Create CWM Time Entry
                            if (taskTimeObject.description && taskTimeObject.description != '' && taskTimeObject.description != 'undefined' && duplicateDetected == false) {
                                logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'time', 'Create CWM Time Entry', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                                createCWMTimeEntry(cwTicketId, JSONData.task_id, timeMemberId, taskObject.companyid, timeId, timeStart, timeEnd, taskTimeObject.description, logRecordId, timeSeconds, taskObject.isprojectticket, taskObject.ischargecode);
                                customerFlagAlreadyUpdated = true;
                            }

                        }
                    }
                }
            }
            //budget hours on task
            if (JSONData.event == 'taskUpdated') {
                var historyItemsArr = JSONData.history_items;
                var newTaskToCreate = false;
                //nlapiLogExecution('AUDIT', 'History Items Length: ' + historyItemsArr.length);
                //search for task_creation history item on payload
                for (var b = 0; b < historyItemsArr.length; b++) {
                    if(historyItemsArr[b].custom_field) {
                        if (historyItemsArr[b].custom_field.name == 'CW Contact Email') {
                            nlapiLogExecution('AUDIT', 'New Contact Email: ' + historyItemsArr[b].after);
                            if (historyItemsArr[b].before == null && historyItemsArr[b].after != null && historyItemsArr[b].after != '') {
                                newTaskToCreate = true;
                                lastUpdatedDate = historyItemsArr[b].date;
                                userName = historyItemsArr[b].user.username;
                                userId = historyItemsArr[b].user.id.toString();
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: EDITED a CU Task and populated a blank CW Contact Email field - Attemping to Create a CWM Ticket ';
                            }
                        }
                    }
                }
                //for those tasks that have edited CW Contact Email from BLANK to a value - this means create a new ticket in CWM and link everything back to CU
                if(newTaskToCreate == true) {
                    var returnResult = 'Create CWM Ticket';
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                    if (historyItemsArr && historyItemsArr.length > 0) {
                        nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);
                        if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized

                            if (JSONData.task_id) {
                                var cwContactEmail = '';
                                var companyIdToPost = '';
                                var contactIdToPost = '';
                                var proceedToCWMTicketCreation = true;
                                var cuTaskDataObject = getTaskTicketId(JSONData.task_id, logRecordId);
                                //determine if we have to sync this back to CWM

                                if (cuTaskDataObject.payload) {
                                    //1. Check to see if the list id in CU matches a ticket board back in CWM
                                    var boardToPost = getMatrixMappingValue(MATRIX_MAPPING_TYPE_BOARD_TO_LIST, cuTaskDataObject.payload.list.id, false);
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ' [INFO]: Board to Post on CWM: ' + boardToPost;
                                    nlapiLogExecution('AUDIT', '[INFO]: Board to Post on CWM: ' + boardToPost);
                                    if (boardToPost == '') {
                                        proceedToCWMTicketCreation = false;
                                        initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: This CU Task is created on an invalid board (not a service ticket board)! CWM Ticket creation will not proceed!';
                                    }
                                    //2. make sure CW Contact Email field is filled, in order to find the company
                                    var cuCustomFieldDataArr = cuTaskDataObject.payload.custom_fields;
                                    for(var i = 0; i < cuCustomFieldDataArr.length; i++)
                                    {
                                        if(cuCustomFieldDataArr[i].name == 'CW Contact Email') {
                                            cwContactEmail = cuCustomFieldDataArr[i].value;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CW Contact Email Value: ' + cwContactEmail;
                                        }
                                    }

                                    if(cwContactEmail && cwContactEmail != '') {
                                        //grab the company id and contact id on CWM via contact email lookup
                                        var cwmContactObject = getCWMCompanyAndContactId(cwContactEmail);
                                        if(cwmContactObject) {
                                            companyIdToPost = cwmContactObject.companyid;
                                            contactIdToPost = cwmContactObject.contactid;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CWM Company ID to Post: ' + companyIdToPost;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CWM Contact ID to Post: ' + contactIdToPost;
                                        }
                                    } else {
                                        proceedToCWMTicketCreation = false;
                                        initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: This CU Task is created on an invalid CW Contact Email! CWM Ticket creation will not proceed!';
                                    }
                                }

                                logRecordId = createLog(JSON.stringify(JSONData), CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', returnResult, userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                                if (proceedToCWMTicketCreation == true) {
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: Validated - This is a CU Task that needs to be created on CWM. Creating CWM Ticket now... ';
                                    messageLog = messageLog + '\n' + cuTaskDataObject.message;
                                    var statusToPost = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, cuTaskDataObject.payload.status.status, false);
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + '[INFO]: Status to Post on CWM: ' + statusToPost;
                                    nlapiLogExecution('AUDIT', '[INFO]: Status to Post on CWM: ' + statusToPost);
                                    var initialNotes = '';
                                    if(cuTaskDataObject.payload.description) {
                                        initialNotes = cuTaskDataObject.payload.description;
                                    }
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + '[INFO]: Initial Description to Post on CWM: ' + initialNotes;

                                    createCWMTicket(JSONData.task_id, cuTaskDataObject.payload.name, boardToPost, statusToPost, companyIdToPost, contactIdToPost, cuTaskDataObject.payload.assignees, initialNotes, userName, userId, logRecordId, cuTaskDataObject.isprojectticket);
                                }


                            }
                        }
                    }
                }

                if(newTaskToCreate == false) {
                    //for time budget
                    var budgetHoursTemp = 0;
                    var budgetHours = 0;
                    if (historyItemsArr && historyItemsArr.length > 0) {
                        if (historyItemsArr[0].field == "time_estimate") {
                            if (historyItemsArr[0].after) {
                                if (historyItemsArr[0].after > 0) {
                                    try {
                                        var budgetHoursTemp = msToHMS(historyItemsArr[0].after);
                                        var budgetHoursSplit = budgetHoursTemp.split(':');
                                        if (budgetHoursSplit.length > 0) {
                                            budgetHours = budgetHoursSplit[0];
                                            if (budgetHoursSplit[1] != '00') {
                                                var decimalMinutes = budgetHoursSplit[1] / 60;
                                                var decimalSplit = decimalMinutes.toString().split('.');
                                                budgetHours = budgetHoursSplit[0] + '.' + decimalSplit[1];
                                                nlapiLogExecution('AUDIT', 'Final value of budget hours for CWM sync: ' + budgetHours);
                                                messageLog = messageLog + '\n' + 'Final value of budget hours for CWM sync: ' + budgetHours + ' from milliseconds: ' + historyItemsArr[0].after;
                                            }
                                        }
                                    } catch (comperr) {
                                        messageLog = messageLog + '\n' + 'ERROR: Computation error on budget hours: ' + comperr;
                                        nlapiLogExecution('ERROR', 'Computation error on budget hours', comperr);
                                        budgetHours = 0;
                                    }
                                } else {
                                    budgetHours = 0;
                                }
                                budgetHoursTemp.split(':');
                            } else {
                                budgetHours = 0;
                            }
                            lastUpdatedDate = historyItemsArr[0].date;
                            userName = historyItemsArr[0].user.username;
                            userId = historyItemsArr[0].user.id.toString();

                            nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);

                            if (userId != CU_SYSTEM_INTEGRATION_ID) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                                var taskObject = getTaskTicketId(JSONData.task_id);

                                var cwTicketId = '';
                                cwTicketId = taskObject.cwticketid;
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Setting Ticket ID: ' + cwTicketId + ' budget hour value on CWM to ' + budgetHours;
                                messageLog = messageLog + '\n' + taskObject.message;
                                if (taskObject.cwticketid == '') {
                                    initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                                }
                                logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', 'Update CWM Ticket Budget Hours', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                                updateCWMTicketBudgetHours(cwTicketId, budgetHours, logRecordId, taskObject.isprojectticket);
                            }
                        } else {
                            var doCustomerUpdatedSync = false;
                            try {
                                if (userId != CU_SYSTEM_INTEGRATION_ID) {
                                    //double check if CU CW Customer Updated = F
                                    lastUpdatedDate = historyItemsArr[0].date;
                                    userName = historyItemsArr[0].user.username;
                                    userId = historyItemsArr[0].user.id.toString();

                                    if (historyItemsArr[0].field == "custom_field") {
                                        if (historyItemsArr[0].custom_field) {
                                            if (historyItemsArr[0].custom_field.name == 'CW Customer Updated') {
                                                if (historyItemsArr[0].before == 'true' && historyItemsArr[0].after == null) {
                                                    nlapiLogExecution('AUDIT', '[customer updated] cw customer updated checkbox');
                                                    doCustomerUpdatedSync = true;
                                                }
                                            }
                                            if (historyItemsArr[0].custom_field.name == 'Working') {
                                                nlapiLogExecution('AUDIT', '[customer updated] Working type updated');
                                                doCustomerUpdatedSync = true;
                                            }
                                            if (historyItemsArr[0].custom_field.name == 'ETA') {
                                                nlapiLogExecution('AUDIT', '[customer updated] ETA updated');
                                                doCustomerUpdatedSync = true;
                                            }
                                            if (historyItemsArr[0].custom_field.name == 'Last Reviewed') {
                                                nlapiLogExecution('AUDIT', '[customer updated] ETA updated');
                                                doCustomerUpdatedSync = true;
                                            }
                                        }
                                    }

                                    if (historyItemsArr[0].field == "comment") {
                                        nlapiLogExecution('AUDIT', '[customer updated] comment inserted on task');
                                        doCustomerUpdatedSync = true;
                                    }

                                    if (doCustomerUpdatedSync == true) {
                                        nlapiLogExecution('AUDIT', '[customer updated] CU Callback triggered by username: ' + userName, userId);
                                        //basically any other generic task update on CU, will set customerUpdated = false on CWM
                                        nlapiLogExecution('AUDIT', '[customerFlagAlreadyUpdated] ' + customerFlagAlreadyUpdated);
                                        if (customerFlagAlreadyUpdated == false) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized
                                            var taskObject = getTaskTicketId(JSONData.task_id);

                                            var cwTicketId = '';
                                            cwTicketId = taskObject.cwticketid;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Processing]: Setting Ticket ID: ' + cwTicketId + ' customer updated value on CWM to false';
                                            messageLog = messageLog + '\n' + taskObject.message;
                                            if (taskObject.cwticketid == '') {
                                                initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID: No CW Service Ticket found on the CU Task! This does not seem to be a CU Task that came from CW Manage Service ticket';
                                            }
                                            logRecordId = createLog(JSONPayloadString, CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', 'Update CWM Ticket Customer Updated', userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                                            updateCWMTicketCustomerUpdated(cwTicketId, false, logRecordId, false);
                                        }
                                    }
                                }
                            } catch (customerupderr) {
                                nlapiLogExecution('ERROR', 'Could not update customer updated flag on CWM:', customerupderr);
                            }

                        }

                    }
                }
            }
            //created a cu task and then sync it back to CWM
            if (JSONData.event == 'taskCreated') {
                var returnResult = 'Create CWM Ticket';
                var taskCreated = false;
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing Clickup to CWM integration request...';
                var historyItemsArr = JSONData.history_items;
                if (historyItemsArr && historyItemsArr.length > 0) {
                    //search for task_creation history item on payload
                    for (var i = 0; i < historyItemsArr.length; i++) {
                        if (historyItemsArr[i].field == 'task_creation') {
                            //this indicates a task was created
                            taskCreated = true;
                            lastUpdatedDate = historyItemsArr[i].date;
                            userName = historyItemsArr[i].user.username;
                            userId = historyItemsArr[i].user.id.toString();
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: Created a CU Task - Attemping to Create a CWM Ticket ';
                        }
                    }

                    nlapiLogExecution('AUDIT', 'CU Callback triggered by username: ' + userName, userId);
                    if (userId != CU_SYSTEM_INTEGRATION_ID && taskCreated == true) { //if the callback came from system integration user - ignore these, only real people task updates should be recognized

                        if (JSONData.task_id) {
                            var cwContactEmail = '';
                            var companyIdToPost = '';
                            var contactIdToPost = '';
                            var proceedToCWMTicketCreation = true;
                            var cuTaskDataObject = getTaskTicketId(JSONData.task_id, logRecordId);
                            //determine if we have to sync this back to CWM

                            if (cuTaskDataObject.payload) {
                                //1. Check to see if the list id in CU matches a ticket board back in CWM
                                var boardToPost = getMatrixMappingValue(MATRIX_MAPPING_TYPE_BOARD_TO_LIST, cuTaskDataObject.payload.list.id, false);
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ' [INFO]: Board to Post on CWM: ' + boardToPost;
                                nlapiLogExecution('AUDIT', '[INFO]: Board to Post on CWM: ' + boardToPost);
                                if (boardToPost == '') {
                                    proceedToCWMTicketCreation = false;
                                    initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: This CU Task is created on an invalid board (not a service ticket board)! CWM Ticket creation will not proceed!';
                                }
                                //2. make sure CW Contact Email field is filled, in order to find the company
                                var cuCustomFieldDataArr = cuTaskDataObject.payload.custom_fields;
                                for(var i = 0; i < cuCustomFieldDataArr.length; i++)
                                {
                                    if(cuCustomFieldDataArr[i].name == 'CW Contact Email') {
                                        cwContactEmail = cuCustomFieldDataArr[i].value;
                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CW Contact Email Value: ' + cwContactEmail;
                                    }
                                }

                                if(cwContactEmail && cwContactEmail != '') {
                                    //grab the company id and contact id on CWM via contact email lookup
                                    var cwmContactObject = getCWMCompanyAndContactId(cwContactEmail);
                                    if(cwmContactObject) {
                                        companyIdToPost = cwmContactObject.companyid;
                                        contactIdToPost = cwmContactObject.contactid;
                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CWM Company ID to Post: ' + companyIdToPost;
                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CWM Contact ID to Post: ' + contactIdToPost;
                                    }
                                } else {
                                    proceedToCWMTicketCreation = false;
                                    initialLogStatus = INTEGRATION_STATUS_REJECTED;
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: This CU Task is created on an invalid CW Contact Email! CWM Ticket creation will not proceed!';
                                }
                            }

                            logRecordId = createLog(JSON.stringify(JSONData), CLICKUP_NAME, initialLogStatus, request.getMethod(), JSONData.event, CWM_NAME, lastUpdatedDate, JSONData.task_id, cwTicketId, messageLog, 'ticket', returnResult, userName, userId, CU_BASE_URL + '/t/' + JSONData.task_id, JSONData.webhook_id);
                            if (proceedToCWMTicketCreation == true) {
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [INFO]: Validated - This is a CU Task that needs to be created on CWM. Creating CWM Ticket now... ';
                                messageLog = messageLog + '\n' + cuTaskDataObject.message;
                                var statusToPost = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, cuTaskDataObject.payload.status.status, false);
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + '[INFO]: Status to Post on CWM: ' + statusToPost;
                                nlapiLogExecution('AUDIT', '[INFO]: Status to Post on CWM: ' + statusToPost);
                                var initialNotes = '';
                                if(cuTaskDataObject.payload.description) {
                                    initialNotes = cuTaskDataObject.payload.description;
                                }
                                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + '[INFO]: Initial Description to Post on CWM: ' + initialNotes;

                                createCWMTicket(JSONData.task_id, cuTaskDataObject.payload.name, boardToPost, statusToPost, companyIdToPost, contactIdToPost, cuTaskDataObject.payload.assignees, initialNotes, userName, userId, logRecordId, cuTaskDataObject.isprojectticket);
                            }


                        }
                    }
                }
            }
            //CWM to Clickup Integration
            var cwm_companyname;
            cwm_companyname = request.getHeader('companyname');
            if (cwm_companyname) {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [Integration Callback Received]: Processing CWM to Clickup integration request...';
                var webhookGUID = request.getHeader("x-content-signature");
                if (JSONData) {
                    var entityId = '';
                    //Service Ticket from CWM push as Task on CU
                    var JSONDataEntity = JSON.parse(JSONData.Entity);
                    if (JSONDataEntity._info) {
                        nlapiLogExecution("EMERGENCY", "CWM_API_MEMBER_NAME", CWM_API_MEMBER_NAME);
                        nlapiLogExecution("EMERGENCY", "JSONDataEntity._info.updatedBy", JSONDataEntity._info.updatedBy);
                        if (JSONDataEntity._info.updatedBy != CWM_API_MEMBER_NAME) {
                            if (JSONDataEntity) {
                                entityId = JSONDataEntity.id.toFixed(0);
                            }
                            
                            if (JSONData.Type == 'ticket') {
                                logRecordId = createLog(JSONData, CWM_NAME, INTEGRATION_STATUS_INQUEUE, request.getMethod(), JSONData.Action, CLICKUP_NAME, JSONDataEntity._info.lastUpdated, entityId, '', messageLog, JSONData.Type, 'Create CU Task', JSONDataEntity._info.updatedBy, JSONDataEntity._info.updatedBy, CW_TICKET_REDIRECT_URL + entityId, webhookGUID);
                                //var JSONDataMeta = JSON.parse(JSONData.Metadata);
                                nlapiLogExecution('AUDIT', 'PAYLOAD: ', JSONData.Entity);

                             
                                
                                    var ticketRequestString = 'service/tickets/';

                                    if(JSONData.recordType == 'ServiceTicket') {
                                        ticketRequestString = 'service/tickets/';
                                    }
                                
                                    if(JSONData.recordType == 'ProjectTicket') {
                                        ticketRequestString = 'project/tickets/';
                                    }

                                    if(JSONDataEntity._info.updatedBy != 'BusinessSuite'){
                                         //Get the CU Task Link:
                                        var cwmTicketObject = getJSONData(ticketRequestString + JSONDataEntity.id, 1, 1000, 1,null,null,null, CW_ACCOUNT_ID);
                                        var cwmTicketObjectCustomFields = cwmTicketObject.customFields;
                                        var createEntry = false;
                                        for(var i = 0; i < cwmTicketObjectCustomFields.length; i++)
                                            {
                                                if(cwmTicketObjectCustomFields[i].caption == 'CU Task Link' || cwmTicketObjectCustomFields[i].caption == 'CU Task ID') {
                                                    var tempValue = cwmTicketObjectCustomFields[i].value;
                                                    if(tempValue == "" || tempValue == null)  {
                                                        createEntry = true;
                                                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CU Task ID Not Found: Will create new CU Task'; 
                                                    }
                                                
                                                }
                                            }
                                        nlapiLogExecution("EMERGENCY", "CREATE ENTRY", createEntry);
                                    }
                                    
                        
                                if (JSONDataEntity.recordType == 'ServiceTicket') {
                                    if (JSONData.Action == 'added' || (createEntry == true && JSONData.Action == 'updated' && JSONDataEntity._info.updatedBy != 'BusinessSuite')) {
                                    //if (JSONData.Action == 'added') {
                                        //CODE FOR CREATED TICKET
                                        var ticketNotesObject = getTicketNotes(JSONDataEntity.id, true);

                                        nlapiLogExecution('AUDIT', 'CWM Webhook GUID', webhookGUID);
                                        var newTaskId = postTask(JSONDataEntity, ticketNotesObject.notes, ticketNotesObject.messageLog, CW_TICKET_REDIRECT_URL + entityId, logRecordId);
                                    }
                                    if (JSONData.Action == 'updated' ) {
                                        //CODE FOR UPDATED TICKET
                                        // var cwmStatusUpdate = false;
                                        // if(cwmStatusUpdate == true) {
                                        //     updateTaskStatus(JSONDataEntity, logRecordId);
                                        // }
                                        updateTaskStatus(JSONDataEntity, logRecordId);

                                    }
                                }
                                if (JSONDataEntity.recordType == 'ProjectTicket') {
                                   //if (JSONData.Action == 'added' || (createEntry == true && JSONData.Action == 'updated')) {
                                    if (JSONData.Action == 'added') {
                                        //CODE FOR CREATED TICKET
                                        var ticketNotesObject = getTicketNotes(JSONDataEntity.id, true);

                                        nlapiLogExecution('AUDIT', 'CWM Webhook GUID', webhookGUID);
                                        var newTaskId = postTask(JSONDataEntity, ticketNotesObject.notes, ticketNotesObject.messageLog, CW_TICKET_REDIRECT_URL + entityId, logRecordId);
                                    }
                                    if (JSONData.Action == 'updated' ) {
                                        //CODE FOR UPDATED TICKET
                                        // var cwmStatusUpdate = false;
                                        // if(cwmStatusUpdate == true) {
                                        //     updateTaskStatus(JSONDataEntity, logRecordId);
                                        // }
                                        updateTaskStatus(JSONDataEntity, logRecordId);

                                    }
                                }
                            }

                            //Create/Update CU Time from CWM
                            if (JSONData.Type == 'time'){
                                if(JSONDataEntity._info.updatedBy == 'jcicat' || JSONDataEntity._info.updatedBy == 'dbrown'){      
                                    var cwmTimeId = JSONDataEntity.id;
                                    var requestString = "time/entries/";
                                    var cwmTimeObject = getJSONData(requestString + cwmTimeId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

                                    var cuTaskId, cuTimeId, cuSubTaskId;
                                    var cwmTimeObjectCustomFields = cwmTimeObject.customFields;

                                    for(var i = 0; i < cwmTimeObjectCustomFields.length; i++)
                                    {
                                        if(cwmTimeObjectCustomFields[i].caption == 'CU Task ID') {
                                            cuTaskId = cwmTimeObjectCustomFields[i].value;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CW Task ID Found: ' + cuTaskId;
                                        }
                                        if(cwmTimeObjectCustomFields[i].caption == 'CU Time ID')
                                        {
                                            cuTimeId = cwmTimeObjectCustomFields[i].value;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: CU Time ID Found: ' + cuTimeId;
                                        }
                                        if(cwmTimeObjectCustomFields[i].caption == 'CU SubTask ID') {
                                            cuSubTaskId = cwmTimeObjectCustomFields[i].value;
                                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: CU Subtask ID Found: ' + cuSubTaskId;
                                        }
                                    }

                                    //Update CU Time
                                    if(cuTimeId && JSONData.Action == 'updated'){
                                        logRecordId = createLog(JSONData, CWM_NAME, INTEGRATION_STATUS_INQUEUE, request.getMethod(), JSONData.Action, CLICKUP_NAME, JSONDataEntity._info.lastUpdated, entityId, '', messageLog, JSONData.Type, 'Update CU Time', JSONDataEntity._info.updatedBy, JSONDataEntity._info.updatedBy, CW_TIME_REDIRECT_URL + cwmTimeId, webhookGUID);
                                        //If CU Time ID exists, update CU Time Entry
                                        var getRequest = nlapiRequestURL(CU_API_URL + '/api/v2/team/36066827/time_entries/' + cuTimeId, null, getCUHeaderSettings(), null, 'GET')
                                        if(getRequest.getCode() == 200){
                                            var CUTimeObject = JSON.parse(getRequest.getBody()).data;
                                            var CU_Data = CUTimeObject.id;
                                        }

                                        var JSONPostObject = {
                                            "description": cwmTimeObject.notes,
                                            "tags": [],
                                            "tag_action": "replace",
                                            "duration": parseInt(cwmTimeObject.hoursBilled * 3600000)
                                        }

                                        var postRequest = nlapiRequestURL(CU_API_URL + '/api/v2/team/36066827/time_entries/' + cuTimeId, JSON.stringify(JSONPostObject), getCUHeaderSettings(), 'PUT');
                                       
                                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                                        returnStatus = INTEGRATION_STATUS_SUCCESS;     

                                        if(postRequest.getCode() != 200){
                                            returnStatus = INTEGRATION_STATUS_ERROR;
                                        }
                                        updateLog(logRecordId, returnStatus, messageLog, cuTimeId, JSON.stringify(JSONPostObject), CU_BASE_URL + cuTaskId);
                                       
                                    }
                                    //Create CU Time from CWM Time Entryy
                                    else if(JSONData.Action == 'added' || (!cuTimeId && JSONData.Action == 'updated')){     
                                        logRecordId = createLog(JSONData, CWM_NAME, INTEGRATION_STATUS_INQUEUE, request.getMethod(), JSONData.Action, CLICKUP_NAME, JSONDataEntity._info.lastUpdated, entityId, '', messageLog, JSONData.Type, 'Create CU Time', JSONDataEntity._info.updatedBy, JSONDataEntity._info.updatedBy, CW_TIME_REDIRECT_URL + cwmTimeId, webhookGUID);

                                        var cwmStart = (cwmTimeObject.timeStart).split("T")[0];
                                        var cwmStartDate = new Date(convertDateFormat(cwmStart));
                                        var cwmMember = cwmTimeObject.member.id;
                                       
                                        var cuAssignee =  getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, cwmMember, true);

                                        //Get the ticket from CWM Ticket
                                        var cwmTicket = cwmTimeObject.chargeToId;
                                        var cuTaskId;
                                        var isProjectTicket = false;
                                        var isChargeCode = false;

                                        if  (cwmTimeObject.chargeToType == 'ServiceTicket' && cwmTicket){
                                            //Get the CU Task ID from the CWM Ticket
                                            cuTaskId = getCUTaskIDfromCWMTicket('service',  cwmTicket);
                                            isProjectTicket = false;
                                        }else if(cwmTimeObject.chargeToType == 'ProjectTicket' && cwmTicket){
                                            //Get the CU Task ID from the CWM Ticket
                                            cuTaskId = getCUTaskIDfromCWMTicket('project',  cwmTicket);
                                            isProjectTicket = true;
                                        }
                                        else if(cwmTimeObject.chargeToType == 'ChargeCode'){
                                            //Get the corresponding Ticket Id for the ChargeCode using CWM Task ID custom field in Clickup
                                            isChargeCode = true;
                                         
                                            var cuListId = 901103639512;  
                                            var customFieldParam = '[{"field_id":"df5c2b9d-ef37-4218-a6f9-a6eab8c18154","operator":"=","value":"'+cwmTimeObject.chargeToId+'"}]';
                                            var getRequest = nlapiRequestURL(CU_API_URL + '/api/v2/list/'+cuListId+'/task?custom_fields=' + customFieldParam, null, getCUHeaderSettings(), null, 'GET');

                                            var JSONGetData = JSON.parse(getRequest.getBody()); 
                                            if(JSONGetData.tasks.length > 0){
                                                cuTaskId = JSONGetData.tasks[0].id;
                                            }
                                            else{
                                                nlapiLogExecution("EMERGENCY", "No Task Found for this ticket", cwmTimeObject.ticket);
                                            }
                                        }
                                        
                                        if(cuTaskId){
                                            var timeNotes = "[CWMTimeID:"+cwmTimeObject.id+"]" +"\n\n" + cwmTimeObject.notes ;

                                            var JSONPostObject = {
                                                "description": timeNotes,
                                                "start": cwmStartDate.getTime(),
                                                "billable": true,
                                                "duration": parseInt(cwmTimeObject.hoursBilled * 3600000),
                                                "assignee": cuAssignee,
                                                "tid": cuTaskId
                                            }

                                            var postRequest = nlapiRequestURL(CU_API_URL + '/api/v2/team/36066827/time_entries/', JSON.stringify(JSONPostObject), getCUHeaderSettings(), 'POST');

                                            //Update CWM Time ID with CU Task ID and CI Time ID
                                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                                            if(postRequest.getCode() == 200){
                                                var postBody = JSON.parse(postRequest.getBody());
                                                var cuTimeId = postBody.data.id;
                                                updateCWMTimeEntry(cwmTimeObject.chargeToId, cuTaskId, cwmTimeObject.member.id, cwmTimeObject.company.id, cuTimeId, cwmTimeObject.timeStart, null, timeNotes, logRecordId, null, isProjectTicket, isChargeCode, cwmTimeObject.id)
                                                returnStatus = INTEGRATION_STATUS_SUCCESS;     
                                            }
                                            else{
                                                returnStatus = INTEGRATION_STATUS_ERROR;
                                            }
                                            updateLog(logRecordId, returnStatus, messageLog, cuTimeId, JSON.stringify(JSONPostObject),  CU_BASE_URL + '/t/' + cuTaskId);
                                        }
                                    }
                                    //Do not loopback (if updated by ClickUpv2, it will not trigger)
                                    
                                }
                               
                            }
                        }
                    }
                }

            }

            response.write('ERROR: Unauthorized Access - Illegal Attempt');
        }
    }
}

function checkIfCUTimeIdExists(timeId) {
    var returnBool = false;

    try {
        var JSONData = getJSONData(TIME_REQ_STRING, 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&customFieldConditions=caption="CU Time ID" AND value = "'+ timeId + '"');
     
        if(JSONData) {
            if (JSONData.length > 0) {
                nlapiLogExecution("EMERGENCY", "Check if CU Time ID Exists", JSON.stringify(JSONData));

                //06.29.2024 - Update the Time Entry in CWM
                returnBool = true;
                nlapiLogExecution('AUDIT', 'CREATE CWM TIME ENTRY REJECTED: CW TIME ALREADY EXISTS FOR TIME ID', timeId);
            }
        }

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for cw time id: ' + timeId, err);
    }

    return returnBool;
}


function checkIfCUTimeIdExists2(timeId) {
    var returnBool = 0;
    var returnObject = {"id": "", "status": ""};

    try {
        var JSONData = getJSONData(TIME_REQ_STRING, 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&customFieldConditions=caption="CU Time ID" AND value = "'+ timeId + '"');
        if(JSONData) {
            if (JSONData.length > 0) {
                nlapiLogExecution("EMERGENCY", "Check if CU Time ID Exists", JSON.stringify(JSONData));
                returnObject["id"] = JSONData[0].id;
                returnObject["status"] = JSONData[0].status;
                //06.29.2024 - Update the Time Entry in CWM
                //returnBool = JSONData[0].id;
                nlapiLogExecution('AUDIT', 'CREATE CWM TIME ENTRY REJECTED: CW TIME ALREADY EXISTS FOR TIME ID', timeId);
            }
        }

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for cw time id: ' + timeId, err);
    }

    return returnObject;
}


function prepStartTime(startTime) {

    var months = {
        'january': '01',
        'february': '02',
        'march': '03',
        'april': '04',
        'may': '05',
        'june': '06',
        'july': '07',
        'august': '08',
        'september': '09',
        'october': '10',
        'november': '11',
        'december': '12'
    };
    var date = new Date(startTime);
    var newDate = date.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
    });
    var parts = newDate.split(' ');
    var year = parts[2];
    var month = months[parts[0].toLowerCase()];
    var day = parts[1].replace(/\,/g,"");
    var finalDay = day;
    if(day.length == 1)
        finalDay = '0' + day;
    var finalISODateString = year + '-' + month + '-' + finalDay + 'T10:00:00Z';
    nlapiLogExecution('debug', 'Final ISO Date String', finalISODateString);

    return finalISODateString;

}

function prepareTimeStartTimeEnd(timeStart, timeMilliSeconds) {
    var timeObject = {};

    var dateStart = new Date(parseInt(timeStart)).toISOString();

    var dateStartTemp = dateStart.substring(0,10) + 'T00:00:00.000Z';
    nlapiLogExecution('debug', 'Start Date Temp: ' + dateStartTemp);
    var dateStartFinal = new Date(dateStartTemp);
    var endDate = dateStartFinal.getTime() + parseInt(timeMilliSeconds);
    var endDateFinal = new Date(endDate);


    nlapiLogExecution('AUDIT', 'Start Date 1: ' + dateStartFinal  );
    nlapiLogExecution('AUDIT', 'End Date 1: ' + endDateFinal);

    var ISOStartTime = dateStartFinal.toISOString().split('.'); //remove the decimals so that cw time can accept this format
    if(ISOStartTime) {
        if(ISOStartTime.length > 0) {
            timeObject.start = ISOStartTime[0] + 'Z';
        }
    }

    var ISOEndTime = endDateFinal.toISOString().split('.'); //remove the decimals so that cw time can accept this format
    if(ISOEndTime) {
        if(ISOEndTime.length > 0) {
            timeObject.end = ISOEndTime[0] + 'Z';
        }
    }

    nlapiLogExecution('AUDIT', 'Start Date F: ' + timeObject.start);
    nlapiLogExecution('AUDIT', 'End Date F: ' + timeObject.end);
    return timeObject;

}


// function formatTimeToCWMDateTime(timeString) {
//     var returnTime = '';
//     if(timeString) {
//         var ISOTime = new Date(parseInt(timeString)).toISOString();
//         var splitTime = ISOTime.split('.'); //remove the decimals so that cw time can accept this format
//         if(splitTime) {
//             if(splitTime.length > 0) {
//                 returnTime = splitTime[0] + 'Z';
//             }
//         }
//     }
// nlapiLogExecution('AUDIT', 'return time: ' + returnTime);
//     return returnTime;
// }
// function checkWebhookGUIDExists(webhookGUIDInput, recordType, integrationOrigin, integrationDestination) {
//     var webhookExists = false;
//
//     try {
//         //load search for scheduled script
//         var colArr = new Array();
//         var filterArr = new Array();
//
//         colArr.push(new nlobjSearchColumn('internalid'));
//         colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_webhook_guid'));
//         colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_recordtype'));
//         colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_origin'));
//         colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_destination'));
//
//         filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_webhook_guid', null, 'is', webhookGUIDInput));
//         filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_recordtype', null, 'is', recordType));
//         filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_origin', null, 'is', integrationOrigin));
//         filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_destination', null, 'is', integrationDestination));
//
//         var searchResults = nlapiSearchRecord('customrecord_ctc_oip_runlog', null, filterArr, colArr);
//
//         if (searchResults) {
//             if(searchResults.length > 0)
//                 webhookExists = true;
//         }
//     } catch (err) {
//         nlapiLogExecution('ERROR', 'Could not search fo webhook guid in the logs: ', 'GUID: ' + webhookGUIDInput);
//     }
//     nlapiLogExecution('AUDIT', 'Webhook GUID Exists: ' + webhookExists);
//     return webhookExists;
// }

function convertDateFormat(dateString) {
    // Split the date string into components [year, month, day]
    var parts = dateString.split('-');
    
    // Check for valid input length after splitting
    if (parts.length !== 3) {
        return 'Invalid date format'; // Return error if format is incorrect
    }

    // Rearrange the parts from "YYYY-MM-DD" to "MM/DD/YYYY"
    var year = parts[0];
    var month = parts[1];
    var day = parts[2];

    // Return the rearranged date string
    return month + '/' + day + '/' + year;
}

function millisecondToHours(milliseconds) {
    try {
        var seconds = Math.floor((milliseconds / 1000) % 60);
        var minutes = Math.floor((milliseconds / 1000 / 60) % 60);
        var hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

    } catch (err) {
        nlapiLogExecution('ERROR','Could not get milliseconds to hours value: ' + milliseconds, err);
    }
    return hours+':'+minutes;
}

function timeToDecimal(t) {

    try {
        var arr = t.split(':');
        var dec = parseInt((arr[1]/6)*10, 10);
        var returnVal = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);

    } catch (err) {
        nlapiLogExecution('ERROR','Could not convert time to decimal: ' + t, err);
    }
    nlapiLogExecution('AUDIT', 'TIME DECIMAL VALUE: ' + returnVal);
    return returnVal;
}
function createCWMTimeEntry(cwTicketId, cuTaskId, memberId, companyId, timeId, timeStart, timeEnd, description, logRecordId, timeSeconds, isProjectTicket, isChargeCode) {

    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var actualHours = 0;
    var chargeToType = 'ServiceTicket';

    try {
        if(isProjectTicket == true) {
            chargeToType = 'ProjectTicket'
        }
        if(isChargeCode == true){
            chargeToType = 'ChargeCode'
        }
        if(timeSeconds) {
            if(timeSeconds > 0)
                actualHours = timeToDecimal(millisecondToHours(timeSeconds));
        }
        if(cwTicketId && timeId && timeStart) {

            var JSONPostObject = {
                "company": {
                    "id": companyId
                },
                "member": {
                    "id": memberId
                },
                "chargeToId": cwTicketId,
                "chargeToType": chargeToType,
                "timeStart": timeStart,
                // "timeEnd": timeEnd,
                "actualHours": actualHours,
                // "billableOption": "Billable",
                "notes": description,
                "internalNotes": description,
                "status": "Open",
                "ticket": {
                    "id": cwTicketId
                },
                "customFields": [
                    {
                        "id": CWM_TIME_ENTRY_CU_TASK_ID_FIELD_ID,
                        "caption": "CU Task ID",
                        "numberOfDecimals": 0,
                        "value": cuTaskId
                    },
                    {
                        "id": CWM_TIME_ENTRY_CU_TIME_ID_FIELD_ID,
                        "caption": "CU Time ID",
                        "numberOfDecimals": 0,
                        "value": timeId
                    }
                ]
            };
            nlapiLogExecution('AUDIT', 'JSON POST for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData('time/entries', JSONPostObject, null, 'POST', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }
            var postRequestBody = JSON.parse(postRequest.getBody());
            destinationURL = CW_TIME_REDIRECT_URL + postRequestBody.id;
            updateLog(logRecordId, returnStatus, messageLog, String(postRequestBody.id), JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not post time entry on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not post time entry on CWM for ticket id: ' + cwTicketId, err);
    }

}

//Update existing time entry from Clickup to CWM
//Get CWM Time Entry first then update postObject with workType, workRole and billableOption.
function updateCWMTimeEntry(cwTicketId, cuTaskId, memberId, companyId, timeId, timeStart, timeEnd, description, logRecordId, timeSeconds, isProjectTicket, isChargeCode, cwmTimeId) {
    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var actualHours = 0;
    var chargeToType = 'ServiceTicket';

    try {
        if(isProjectTicket == true) {
            chargeToType = 'ProjectTicket'
        }
        if(isChargeCode == true){
            chargeToType = 'ChargeCode'
        }
        if(timeSeconds) {
            if(timeSeconds > 0)
                actualHours = timeToDecimal(millisecondToHours(timeSeconds));
        }
        if(cwTicketId && timeId && timeStart) {
            //Get Details of CWM Time Entry
            var requestString = "time/entries/";
            var cwmTimeObject = getJSONData(requestString + cwmTimeId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
            nlapiLogExecution("EMERGENCY", "Update Time Entry - cwmTimeObject", JSON.stringify(cwmTimeObject));
            if(actualHours == 0) actualHours = cwmTimeObject.actualHours;

            var JSONPostObject = {
                "id": cwmTimeId,
                "company": {
                    "id": companyId
                },
                "member": {
                    "id": memberId
                },
                "chargeToId": cwTicketId,
                "chargeToType": chargeToType,
                "timeStart": timeStart,
                // "timeEnd": timeEnd,
                "actualHours": actualHours,
                // "billableOption": "Billable",
                "notes": description,
                "internalNotes": description,
                "status": "Open",
                "ticket": {
                    "id": cwTicketId
                },
                "customFields": [
                    {
                        "id": CWM_TIME_ENTRY_CU_TASK_ID_FIELD_ID,
                        "caption": "CU Task ID",
                        "numberOfDecimals": 0,
                        "value": cuTaskId
                    },
                    {
                        "id": CWM_TIME_ENTRY_CU_TIME_ID_FIELD_ID,
                        "caption": "CU Time ID",
                        "numberOfDecimals": 0,
                        "value": timeId
                    }
                ],
                "workType": cwmTimeObject.workType,
                "workRole": cwmTimeObject.workRole,
                "billableOption": cwmTimeObject.billableOption
            };
            nlapiLogExecution('AUDIT', 'JSON POST for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData('time/entries/' + cwmTimeId, JSONPostObject, null, 'PUT', CW_ACCOUNT_ID);
            nlapiLogExecution("EMERGENCY", "Update TIME ENTRY - postRequest", JSON.stringify(postRequest));
           
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }
            var postRequestBody = JSON.parse(postRequest.getBody());
            destinationURL = CW_TIME_REDIRECT_URL + postRequestBody.id;
            updateLog(logRecordId, returnStatus, messageLog, String(postRequestBody.id), JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not post time entry on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not post time entry on CWM for ticket id: ' + cwTicketId, err);
    }

}

function updateCWMTicketAssignee(cwTicketId, taskId, assignedId, removedMemberId, logRecordId, isProjectTicket) {

    var messageLog = '';
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    var assigneeObjectArr = [];
    var currentOwnerId = '';
    var requestString = 'service/tickets/';

    if(isProjectTicket == true) {
        requestString = 'project/tickets/'
    }
    nlapiLogExecution('AUDIT', 'Assigned ID: ' + assignedId);
    try {
        if(cwTicketId) {
            var cwTicketObject = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
            if(cwTicketObject) {
                if(cwTicketObject.owner) {
                    currentOwnerId = cwTicketObject.owner.id;
                }
            }

            //grab the assignements list
            var scheduleEntriesJSONData = getJSONData(requestString +cwTicketId+'/scheduleentries', 1, 1000, 1, null, null, null, CW_ACCOUNT_ID);
            if(scheduleEntriesJSONData) {
                if(scheduleEntriesJSONData.length > 0) {
                    for (var i = 0; i < scheduleEntriesJSONData.length; i++) {
                        var scheduleId =  scheduleEntriesJSONData[i].id;
                        var entryData = getJSONData('schedule/entries/'+scheduleId, 1, 1000, 1, null, null, null, CW_ACCOUNT_ID);
                        if(entryData ) {
                            if(entryData.member) {
                                var assigneeObject = {};
                                assigneeObject.scheduleid = scheduleId;
                                assigneeObject.memberid = entryData.member.id;
                                nlapiLogExecution('DEBUG','**** PUSHING MEMBER ID ****', entryData.member.id);
                                assigneeObjectArr.push(assigneeObject);
                            }
                        }
                    }
                }
            }
            if(removedMemberId && removedMemberId != '') {
                if (assigneeObjectArr.length > 0) {
                    for (var i = 0; i < assigneeObjectArr.length; i++) {
                        if (removedMemberId == assigneeObjectArr[i].memberid) {
                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': REMOVING ASSIGNEE ON TICKET - ASSIGNEE ID: ' + assigneeObjectArr[i].memberid + ' SCHEDULE ID: ' + assigneeObjectArr[i].scheduleid;
                            var deleteScheduleRequest = postJSONData('schedule/entries/' + assigneeObjectArr[i].scheduleid, null, null, 'DELETE', CW_ACCOUNT_ID);
                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + deleteScheduleRequest.getError();
                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + deleteScheduleRequest.getBody();
                            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + deleteScheduleRequest.getCode();
                            if (deleteScheduleRequest.getCode() == 400) {
                                returnStatus = INTEGRATION_STATUS_ERROR;
                            }
                        }
                    }
                    if(currentOwnerId == removedMemberId && returnStatus != INTEGRATION_STATUS_ERROR) {
                        var ownerReplaced = false;
                        var cwTicketObject2 = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
                        for (var i = 0; i < assigneeObjectArr.length; i++) {
                            if(ownerReplaced == false) {
                                //assign first member to replace as owner id on ticket
                                if (assigneeObjectArr[i].memberid) {
                                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': REPLACING OWNER ON TICKET - ASSIGNEE ID: ' + assigneeObjectArr[i].memberid + ' TO TICKET ID: ' + cwTicketId;
                                    if (cwTicketObject2) {
                                        //company id on cw manage, required additional headers for attaching a contact record to company
                                        var replaceAssigneeObject = cwTicketObject2;

                                        var ownerObject = {};
                                        ownerObject.id = assigneeObjectArr[i].memberid;
                                        replaceAssigneeObject.owner = ownerObject;
                                    }
                                    var postRequest2 = postJSONData(requestString + cwTicketId, replaceAssigneeObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
                                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest2.getError();
                                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest2.getBody();
                                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest2.getCode();
                                    if (postRequest2.getCode() == 400) {
                                        returnStatus = INTEGRATION_STATUS_ERROR;
                                    } else {
                                        ownerReplaced = true;
                                    }


                                }
                            }
                        }
                    }
                }
            }

            if(assignedId && assignedId != '') {
                //make sure the id doesnt exist on cw manage
                var memberAlreadyAssigned = false;
                memberAlreadyAssigned = checkIfMemberAlreadyAssignedToTicket(assignedId, assigneeObjectArr);
                if(memberAlreadyAssigned == false) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': ADDING ASSIGNEE ON TICKET - ASSIGNEE ID: ' + assignedId + ' TO TICKET ID: ' + cwTicketId;
                    var dateStartSched = new Date().toISOString();
                    dateStartSched = dateStartSched.substring(0, 10) + "T00:00:00Z";

                    var addAssigneeObject = {
                        "objectId": cwTicketId,
                        "member": {
                            "id": assignedId
                        },
                        "type": {
                            "id": CW_SCHEDULE_TYPE_ID,
                        },
                        "dateStart": dateStartSched,
                        "dateEnd": dateStartSched
                    };
                    var postRequest = postJSONData('schedule/entries/', addAssigneeObject, null, 'POST', CW_ACCOUNT_ID);
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                    if (postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                } else {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': NO CHANGES MADE - MEMBER ALREADY ASSIGNED ON TICKET - ASSIGNEE ID: ' + assignedId + ' ON TICKET ID: ' + cwTicketId;
                }

                if(currentOwnerId == '' && assignedId != '') {
                    if (cwTicketObject) {
                        //company id on cw manage, required additional headers for attaching a contact record to company
                        var JSONPostObject = cwTicketObject;

                        var ownerObject = {};
                        ownerObject.id = assignedId;
                        JSONPostObject.owner = ownerObject;

                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Updating Ticket Owner ID: ' + assignedId;
                        postRequest = postJSONData(requestString + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                        if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                            returnStatus = INTEGRATION_STATUS_ERROR;
                        }

                    }
                }
            }
            // //grab some existing info first in manage
            // var cwTicketObject = getJSONData('service/tickets/' + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
            //

            //
            // if(removedMemberId && removedMemberId != '') {
            //     if (cwTicketObject) {
            //         //company id on cw manage, required additional headers for attaching a contact record to company
            //         var JSONPostObject = cwTicketObject;
            //
            //         var ownerObject = {};
            //         ownerObject.id = removedMemberId
            //         cwTicketObject.owner = ownerObject;
            //
            //     }
            // }
            //
            //
            //
            //
            // nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            // //POST
            // //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            // postRequest = postJSONData('service/tickets/' + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            // messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            // messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            // messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            // if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
            //     returnStatus = INTEGRATION_STATUS_ERROR;
            // }
            destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
            updateLog(logRecordId, returnStatus, messageLog, '', '', destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update assignee on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', '');
        nlapiLogExecution('ERROR', 'Could not update asignee on CWM for ticket id: ' + cwTicketId, err);
    }

}

function checkIfMemberAlreadyAssignedToTicket(assignedMemberId, assigneeObjectArr) {
    var isAssigned = false;
    try {
        if(assigneeObjectArr) {
            if(assigneeObjectArr.length > 0) {
                for (var i = 0; i < assigneeObjectArr.length; i++) {
                    if(assigneeObjectArr[i].memberid == assignedMemberId) {
                        isAssigned = true;
                    }
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not check assigned member id ' + assignedMemberId, err);
    }
    return isAssigned;
}
function updateCWMTicketBoard(cwTicketId, boardUpdate, logRecordId) {

    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    try {
        if(cwTicketId && boardUpdate) {

            //grab some existing info first in manage
            var cwTicketObject = getJSONData('service/tickets/' + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

            if (cwTicketObject) {
                //company id on cw manage, required additional headers for attaching a contact record to company
                var JSONPostObject = cwTicketObject;

                var boardObject = {};
                boardObject.name = boardUpdate;
                cwTicketObject.board = boardObject;

                var statusObject = {};
                statusObject.name = cwTicketObject.status.name;
                cwTicketObject.status = statusObject;

                var teamObject = {};
                teamObject.name = cwTicketObject.team.name;
                cwTicketObject.team = teamObject;

                //added 8/7/2023
                cwTicketObject.customerUpdatedFlag = false;

            }

            nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData('service/tickets/' + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }
            destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
            updateLog(logRecordId, returnStatus, messageLog, '', JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update board on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not update board on CWM for ticket id: ' + cwTicketId, err);
    }

}
function updateCWMTicketLink(cwTicketId, taskURL, taskId, logRecordId, recordType) {

    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    var requestString = 'service/tickets/';

    if(recordType == 'ProjectTicket') {
        requestString = 'project/tickets/';
    }

    try {
        if(cwTicketId && taskURL) {

            //grab some existing info first in manage
            var cwTicketObject = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

            if (cwTicketObject) {
                //company id on cw manage, required additional headers for attaching a contact record to company
                var JSONPostObject = cwTicketObject;

                var customFieldData = {};
                customFieldData.id = CWM_TICKET_CU_TASK_LINK_ID_FIELD_ID;
                customFieldData.value = taskURL;
                var customFieldData2 = {};
                customFieldData2.id = CWM_TICKET_CU_TASK_ID_FIELD_ID;
                customFieldData2.value = taskId;
                var customFieldDataArr = [];
                customFieldDataArr.push(customFieldData);
                customFieldDataArr.push(customFieldData2);
                JSONPostObject.customFields = customFieldDataArr;

            }

            nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData(requestString + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }
            destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
            //updateLog(logRecordId, returnStatus, messageLog, '', JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update CU Task Link on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not update CU Task Link on CWM for ticket id: ' + cwTicketId, err);
    }

    return messageLog;
}
function updateCWMTicketCustomerUpdated(cwTicketId, customerUpdatedValue, logRecordId, isProjectTicket) {


    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    var requestString = 'service/tickets/';

    if(isProjectTicket == true)
        requestString = 'project/tickets/';

    try {

        if(customerUpdatedValue == null || customerUpdatedValue == 0) {
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Setting customer updated value to: ' + customerUpdatedValue;
        }

        if(cwTicketId) {

            //grab some existing info first in manage
            var cwTicketObject = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

            if (cwTicketObject) {
                //company id on cw manage, required additional headers for attaching a contact record to company
                var JSONPostObject = cwTicketObject;
                //added 8/7/2023
                cwTicketObject.customerUpdatedFlag = customerUpdatedValue;
            }

            nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData(requestString + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }

        } else {
            returnStatus = INTEGRATION_STATUS_REJECTED;
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': No CW Ticket ID for this task! Is this a task that came from CWM?';
        }

        destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
        updateLog(logRecordId, returnStatus, messageLog, cwTicketId, JSON.stringify(JSONPostObject), destinationURL);
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update customer updated value on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not update customer updated value on CWM for ticket id: ' + cwTicketId, err);
    }

}
function updateCWMTicketBudgetHours(cwTicketId, budgetHours, logRecordId, isProjectTicket) {

    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    var requestString = 'service/tickets/';

    if(isProjectTicket == true)
        requestString = 'project/tickets/';

    try {

        if(budgetHours == null || budgetHours == 0) {
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Setting Budget Hours Value to zero on CWM: ' + budgetHours;
        }

        if(cwTicketId) {

            //grab some existing info first in manage
            var cwTicketObject = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

            if (cwTicketObject) {
                //company id on cw manage, required additional headers for attaching a contact record to company
                var JSONPostObject = cwTicketObject;
                cwTicketObject.budgetHours = budgetHours;
                //added 8/7/2023
                cwTicketObject.customerUpdatedFlag = false;
            }

            nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData(requestString + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }

        } else {
            returnStatus = INTEGRATION_STATUS_REJECTED;
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': No CW Ticket ID for this task! Is this a task that came from CWM?';
        }

        destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
        updateLog(logRecordId, returnStatus, messageLog, cwTicketId, JSON.stringify(JSONPostObject), destinationURL);
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update budget hours on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not update budget hours on CWM for ticket id: ' + cwTicketId, err);
    }

}

function updateCWMTicketStatus(cwTicketId, statusUpdate, logRecordId, isProjectTicket) {

    var messageLog = '';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var additionalHeaders = {"id": cwTicketId};
    var requestString = 'service/tickets/';

    if(isProjectTicket == true)
        requestString = 'project/tickets/';

    try {
        if(cwTicketId && statusUpdate) {

            //grab some existing info first in manage
            var cwTicketObject = getJSONData(requestString + cwTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);

            if (cwTicketObject) {
                //company id on cw manage, required additional headers for attaching a contact record to company
                var JSONPostObject = cwTicketObject;

                var statusObject = {};
                statusObject.name = statusUpdate;
                cwTicketObject.status = statusObject;
                //added 8/7/2023
                cwTicketObject.customerUpdatedFlag = false;

            }

            nlapiLogExecution('AUDIT', 'JSON PUT for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            postRequest = postJSONData(requestString + cwTicketId, JSONPostObject, additionalHeaders, 'PUT', CW_ACCOUNT_ID);
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            if(postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                returnStatus = INTEGRATION_STATUS_ERROR;
            }
            destinationURL = CW_TICKET_REDIRECT_URL + cwTicketId;
            updateLog(logRecordId, returnStatus, messageLog, '', JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not update status on CWM for ticket id: ' + cwTicketId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not update status on CWM for ticket id: ' + cwTicketId, err);
    }

}

function createCWMTicket(cuTaskId, summary, boardName, statusName, companyId, contactId, cuAssigneesArr, notes, userName, userId, logRecordId, isProjectTicket) {

    var messageLog = '';
    var recordType = 'ServiceTicket';
    var postRequest;
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var destinationURL = '';
    var requestString = 'service/tickets/';

    if(isProjectTicket == true) {
        requestString = 'project/tickets/';
        recordType = 'ProjectTicket';
    }



    var JSONPostObject =  {
        "summary": summary,
        "recordType": recordType,
        "board": {
            "name": boardName
        },
        "initialDescription": notes,
        "status": {
            "name": statusName
        },
        "company": {
            "id": companyId
        },
        "contact": {
            "id": contactId
        },
        "customFields": [
            {
                "id": CWM_TICKET_CU_TASK_LINK_ID_FIELD_ID,
                "caption": "CU Task Link",
                "type": "Hyperlink",
                "entryMethod": "EntryField",
                "value": CU_BASE_URL + '/t/' +cuTaskId,
                "numberOfDecimals": 0
            },
            {
                "id": CWM_TICKET_CU_TASK_ID_FIELD_ID,
                "caption": "CU Task ID",
                "type": "Text",
                "entryMethod": "EntryField",
                "value": cuTaskId,
                "numberOfDecimals": 0
            }
        ]
    };

    try {
        if(cuTaskId) {

            nlapiLogExecution('AUDIT', 'JSON POST for CW Account ID: ' + CW_ACCOUNT_ID, JSON.stringify(JSONPostObject));
            //POST
            messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(JSONPostObject);
            //check to see if there is an existing CWM Service Ticket with the CU Task ID
            var cwmTicketExists = checkCWMServiceTicketForTaskID(cuTaskId, CW_ACCOUNT_ID);
            var newTicketObject = {};
            if(cwmTicketExists == false) {
                postRequest = postJSONData(requestString, JSONPostObject, null, 'POST', CW_ACCOUNT_ID);
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                if (postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }

                if (postRequest.getCode() == 201) {
                    if (postRequest.getBody()) {
                        newTicketObject = JSON.parse(postRequest.getBody());
                        destinationURL = CW_TICKET_REDIRECT_URL + newTicketObject.id;
                        //assign resources to cwm ticket
                        if (cuAssigneesArr) {
                            if (cuAssigneesArr.length > 0) {
                                for (var i = 0; i < cuAssigneesArr.length; i++) {
                                    var newLogRecord = createLog(JSON.stringify(cuAssigneesArr[i]), CLICKUP_NAME, INTEGRATION_STATUS_REJECTED, 'POST', 'taskAssigneeUpdated', CWM_NAME, 'NA', cuTaskId, newTicketObject.id.toFixed(0), messageLog, 'ticket', 'Add CWM Ticket Assignee', userName, userId, CU_BASE_URL + '/t/' + cuTaskId, 'NA');
                                    var assigneeToPost = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, cuAssigneesArr[i].id, false);
                                    if (assigneeToPost && assigneeToPost != '') {
                                        updateCWMTicketAssignee(newTicketObject.id, cuTaskId, assigneeToPost, '', newLogRecord, isProjectTicket);
                                    } else {
                                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': INVALID ASSIGNEE, CU ASSIGNEE MAPPED TO : ' + cuAssigneesArr[i].id + ' NOT FOUND ON CWM MEMBER MATRIX MAPPING!';
                                    }
                                }
                            }
                        }
                        //post back to cu task all the cwm ticket fields
                        var newLogRecord2 = createLog(JSON.stringify(newTicketObject), CWM_NAME, INTEGRATION_STATUS_REJECTED, 'POST', 'updated', CLICKUP_NAME, 'NA', newTicketObject.id.toFixed(0), cuTaskId, messageLog, 'ticket', 'Update CU Task', userName, userId, CW_TICKET_REDIRECT_URL + newTicketObject.id, 'NA');
                        updateTaskStatus(newTicketObject, newLogRecord2, true);
                    }
                }
            } else {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Service Ticket with CU Task: ' + cuTaskId + ' already exists! Service ticket creation will not push through.';
                returnStatus = INTEGRATION_STATUS_REJECTED;
            }
            var destinationIdFinal = '';
            if(newTicketObject.id) {
                destinationIdFinal = newTicketObject.id.toFixed(0);
            } else {
                destinationIdFinal = '';
            }
            updateLog(logRecordId, returnStatus, messageLog, destinationIdFinal, JSON.stringify(JSONPostObject), destinationURL);
        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': [ERROR]: Could not create ticket on CWM for cu task id: ' + cuTaskId + ' REASON: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject));
        nlapiLogExecution('ERROR', 'Could not create ticket on CWM for cu task id: ' + cuTaskId, err);
    }

}

function getTaskTicketId(taskId, logRecordId) {
    var returnObject = {};
    var messageLog = '';
    var cwTicketId = '';
    var isProjectTicket = false;
    // var webhookGUID = '';
    var cwCompanyId = '';
    var JSONData;
    var ticketFound = false;
    
    var isChargeCode = false;

    try {
        var getRequest = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, null, getCUHeaderSettings(), null, 'GET');

        if (getRequest) {
            JSONData = JSON.parse(getRequest.getBody());
            if(JSONData) {
                var cuCustomFieldDataArr = JSONData.custom_fields;
                for(var i = 0; i < cuCustomFieldDataArr.length; i++)
                {
                    if(cuCustomFieldDataArr[i].name == 'CW Company ID') {
                        cwCompanyId = cuCustomFieldDataArr[i].value;
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CW Company ID Found: ' + cwCompanyId;
                    }
                    if(cuCustomFieldDataArr[i].name == 'CW Ticket ID')
                    {
                        if(cuCustomFieldDataArr[i].value) {
                            cwTicketId = cuCustomFieldDataArr[i].value;
                        }
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: CW Ticket ID Found: ' + cwTicketId;
                        ticketFound = true;
                    }
                    if(cuCustomFieldDataArr[i].name == 'CW Project Ticket') {
                        isProjectTicket = cuCustomFieldDataArr[i].value;
                        if(isProjectTicket) {
                            if(isProjectTicket == 'true') {
                                isProjectTicket = true;
                            }
                        }
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Is This a CW Project Ticket Found: ' + isProjectTicket;
                    }
                }

                //Check if Charge Code:
                if(JSONData.list.name == 'Charge Codes'){
                    isChargeCode = true;
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Is This a Charge Code Ticket Found: ' + isChargeCode;
                }
            }
            if(ticketFound == false) {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': WARNING: CW Ticket ID NOT Found: Is this a task that came from a service ticket?';
            }
        }
    } catch (err) {
        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP GET ERROR: ' + err;
        nlapiLogExecution('ERROR', 'HTTP GET ERROR for Task ID: ' + taskId, messageLog);
    }
    returnObject.message = messageLog;
    returnObject.cwticketid = cwTicketId;
    // returnObject.webhookguid = webhookGUID;
    returnObject.companyid = cwCompanyId;
    returnObject.isprojectticket = isProjectTicket;
    returnObject.payload = JSONData;
    returnObject.ischargecode = isChargeCode;
    return returnObject;
}

function getTaskTime(taskId, timeId, logRecordId) {
    var returnObject = {};
    var messageLog = '';
    var timeNotes = '';
    // var webhookGUID = '';
    var JSONData;
    var ticketFound = false;

    try {
        var getRequest = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/time', null, getCUHeaderSettings(), null, 'GET');

        if (getRequest) {
            JSONData = JSON.parse(getRequest.getBody());
            if(JSONData) {
                if(JSONData.data) {
                    if(JSONData.data.length > 0) {
                        for (var j = 0; j < JSONData.data.length; j++) {
                            var timeEntryObjectArr = JSONData.data[j].intervals;
                            for (var i = 0; i < timeEntryObjectArr.length; i++) {
                                if(timeId == timeEntryObjectArr[i].id) {
                                    timeNotes = timeEntryObjectArr[i].description;
                                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': INFO: Description for time found: ' + timeNotes;
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP GET ERROR: ' + err;
        nlapiLogExecution('ERROR', 'HTTP GET ERROR for Time Entry Fetch Task ID: ' + taskId, messageLog);
    }
    returnObject.message = messageLog;
    returnObject.description = timeNotes;
    // returnObject.webhookguid = webhookGUID;
    return returnObject;
}

// function getListIDFromBoardID(boardId) {
//     //grabs the correct List ID on CU based on Board ID from CWM
//     var returnListId = CWM_BOARD_ID_FUNCTIONAL;
//
//     switch (boardId) {
//         case CWM_BOARD_ID_FUNCTIONAL:
//             returnListId = CU_LIST_ID_FUNCTIONAL;
//             break;
//         case CWM_BOARD_ID_TECHNICAL:
//             returnListId = CU_LIST_ID_TECHNICAL;
//             break;
//         case CWM_BOARD_ID_SOLUTION:
//             returnListId = CU_LIST_ID_SOLUTION;
//             break;
//         case CWM_BOARD_ID_COMMISSION_SUPPORT:
//             returnListId = CU_LIST_ID_COMMISSION_SUPPORT;
//             break;
//         case CWM_BOARD_ID_CONNECTWISE_SUPPORT:
//             returnListId = CU_LIST_ID_CONNECTWISE_SUPPORT;
//             break;
//         case CWM_BOARD_ID_VAR_CONNECT_SUPPORT:
//             returnListId = CU_LIST_ID_VAR_CONNECT_SUPPORT;
//             break;
//         default:
//             returnListId = CWM_BOARD_ID_FUNCTIONAL;
//     }
//     return returnListId;
// }

// function getCWMBoardNameFromCUListID(listId) {
//     //grabs the correct Board Name on CWM based on List ID on CU
//     var returnBoardName = CWM_BOARD_NAME_FUNCTIONAL;
//
//     switch (listId) {
//         case CU_LIST_ID_FUNCTIONAL:
//             returnBoardName = CWM_BOARD_NAME_FUNCTIONAL;
//             break;
//         case CU_LIST_ID_TECHNICAL:
//             returnBoardName = CWM_BOARD_NAME_TECHNICAL;
//             break;
//         case CU_LIST_ID_SOLUTION:
//             returnBoardName = CWM_BOARD_NAME_SOLUTION;
//             break;
//         case CU_LIST_ID_COMMISSION_SUPPORT:
//             returnBoardName = CWM_BOARD_NAME_COMMISSION_SUPPORT;
//             break;
//         case CU_LIST_ID_CONNECTWISE_SUPPORT:
//             returnBoardName = CWM_BOARD_NAME_CONNECTWISE_SUPPORT;
//             break;
//         case CU_LIST_ID_VAR_CONNECT_SUPPORT:
//             returnBoardName = CWM_BOARD_NAME_VAR_CONNECT_SUPPORT;
//             break;
//         default:
//             returnBoardName = CWM_BOARD_NAME_FUNCTIONAL;
//     }
//     return returnBoardName;
// }
//
// function getListIDFromBoardName(boardName) {
//     //grabs the correct List ID on CU based on Board ID from CWM
//     var returnListId = CWM_BOARD_NAME_FUNCTIONAL;
//
//     switch (boardName) {
//         case CWM_BOARD_NAME_FUNCTIONAL:
//             returnListId = CU_LIST_ID_FUNCTIONAL;
//             break;
//         case CWM_BOARD_NAME_TECHNICAL:
//             returnListId = CU_LIST_ID_TECHNICAL;
//             break;
//         case CWM_BOARD_NAME_SOLUTION:
//             returnListId = CU_LIST_ID_SOLUTION;
//             break;
//         case CWM_BOARD_NAME_COMMISSION_SUPPORT:
//             returnListId = CU_LIST_ID_COMMISSION_SUPPORT;
//             break;
//         case CWM_BOARD_NAME_CONNECTWISE_SUPPORT:
//             returnListId = CU_LIST_ID_CONNECTWISE_SUPPORT;
//             break;
//         case CWM_BOARD_NAME_VAR_CONNECT_SUPPORT:
//             returnListId = CU_LIST_ID_VAR_CONNECT_SUPPORT;
//             break;
//         default:
//             returnListId = CWM_BOARD_NAME_FUNCTIONAL;
//     }
//     return returnListId;
// }

function postAttachment(taskId, attachmentArr) {
    //https://api.clickup.com/api/v2/task/task_id/attachment?custom_task_ids=&team_id=
    //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);t
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var returnObject = {};

    var messageLog = '';
    try {
        if (attachmentArr && taskId) {
            for (var i = 0; i < attachmentArr.length; i++) {
                var sendAttachmentObject = { filename: 'test' + i, attachment: attachmentArr[i] };
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Attaching File ' + i + ' to CU Task';
                var postRequest = nlapiRequestURL('https://eofdtxxu5kzemm3.m.pipedream.net/', sendAttachmentObject, getCUHeaderSettings(null, true), null, 'POST');
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not post attachment on task for task id: ' + taskId, err);
    }
    returnObject.status = returnStatus;
    returnObject.message = messageLog;
    return returnObject;

}

function getAttachments(recordId, recordType) {

    var binaryAttachmentArr = [];
    var returnObject = {};
    var messageLog = '';
    var attachmentList = [];
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var attachCount = 0;
    var cwBaseURL = getGlobalSetting('custrecord_ctc_cw_api_baseurl', CW_ACCOUNT_ID);
    try {
        if (recordId) {
            //messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Attempting to get attachments for this ticket...';
            var JSONDataString = nlapiRequestURL(cwBaseURL + 'system/documents?recordId=' + recordId + '&recordType=' + recordType, null, getHeaderSettings(null, CW_ACCOUNT_ID), null, 'GET');
            attachmentList = JSON.parse(JSONDataString.getBody());
            if (attachmentList) {
                if (attachmentList.length > 0) {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': There are a total of ' + attachmentList.length + ' attachments for this ticket.';
                    for (var i = 0; i < attachmentList.length; i++) {
                        var binaryRequest = nlapiRequestURL(cwBaseURL + 'system/documents/' + attachmentList[i].id + '/download', null, getHeaderSettings(null, CW_ACCOUNT_ID), null, 'GET');
                        var fileAttachment = binaryRequest.getBody();
                        if (fileAttachment) {
                            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': File ID: ' + attachmentList[i].id + ' File Name: ' + attachmentList[i].fileName + ' Title: ' + attachmentList[i].title;
                            binaryAttachmentArr.push(fileAttachment);
                            attachCount++;
                        }
                    }
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Please go to the CW Service Ticket Link to view the attachments.';
                }
            }
        }
    } catch (err) {
        returnStatus = INTEGRATION_STATUS_ERROR;
        messageLog =  messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Could not get attachment from CW for record id: '  + recordId + ' REASON: '+ err;
        nlapiLogExecution('ERROR', 'Could not get attachment from CW for record id: ' + recordId, err);
    }
    returnObject.attachmentArray = binaryAttachmentArr;
    returnObject.message = messageLog;
    returnObject.status = returnStatus;
    returnObject.attachmentCount = attachCount;
    return returnObject;
}

function getTicketNotes(cwTicketId, firstNoteOnly) {
    var returnObject = {};
    var returnNotes = '';

    var returnNotesObjectArr = [];
    var erorrOccured = false;
    var messageLog = '';
    try {
        var JSONNotesData = getJSONData('service/tickets/' + cwTicketId + '/notes', 1, 1000, 1, null, 'id', 'F', CW_ACCOUNT_ID, null, null, null, null );
        if(JSONNotesData) {
            if(JSONNotesData.length >= 1) {
                if(firstNoteOnly == true) {
                    returnNotes = JSONNotesData[0].text;
                } else {
                    for (var i = 0; i < JSONNotesData.length; i++) {
                        var noteObject = {};
                        noteObject.ticketnotes = JSONNotesData[i].text;
                        noteObject.ticketnoteid = JSONNotesData[i].id;
                        noteObject.createdby = JSONNotesData[i].createdBy;
                        noteObject.datecreated = JSONNotesData[i].dateCreated;
                        nlapiLogExecution('DEBUG', '[getTicketNotes] Inserting CWM Ticket Notes to arr, note id: ' + noteObject.ticketnoteid, noteObject.ticketnotes);
                        nlapiLogExecution('DEBUG', '[getTicketNotes] Created by and date created: ' + noteObject.createdby, noteObject.datecreated);
                        returnNotesObjectArr.push(noteObject);
                    }

                }
            }
        }
    } catch (err) {
        erorrOccured = true;
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': CW Ticket Notes fetch error for ticket id: ' + cwTicketId + ': ERROR: ' + err ;
        nlapiLogExecution('ERROR', 'CW Ticket Notes fetch error for ticket id: ' + cwTicketId, err);
    }
    if(erorrOccured == false) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Ticket Notes for ' + cwTicketId + ': ' + returnNotes;
    }

    nlapiLogExecution('AUDIT', 'Ticket Notes for ' + cwTicketId, returnNotes);
    returnObject.messageLog = messageLog;

    if(firstNoteOnly) {
        returnObject.notes = returnNotes;
    } else {
        returnObject.notes = returnNotesObjectArr;
    }

    return returnObject;
}
function getCWMCustomFieldValueById(JSONData, customFieldId) {
    var returnFieldValue = '';
    var messageLog = '';
    var returnObject = {};

    try {
        if(JSONData) {
            if(JSONData.customFields) {
                for (var i = 0; i < JSONData.customFields.length; i++) {
                    if(JSONData.customFields[i].id == customFieldId) {
                        returnFieldValue = JSONData.customFields[i].value;
                        messageLog = messageLog + '\n' + 'Custom Field ID: ' + customFieldId + ' Value found: ' + returnFieldValue;
                    }
                }
            }

        }
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Cannot get value of custom field id: ' + customFieldId + ' ERROR: ' + err;
        nlapiLogExecution('ERROR', 'Cannot update task status on Clickup: CWM Ticket ID: ' + JSONData.id, messageLog);
    }
    returnObject.value = returnFieldValue;
    returnObject.message = messageLog;

    return returnObject;

}

function updateTaskStatus(JSONData, logRecordId, updateTicketId) {
    var JSONPostObject;
    var messageLog = '';
    var destinationURL = '';
    var taskId = '';
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    var ticketRequestString = 'service/tickets/';

    if(JSONData.recordType == 'ServiceTicket') {
        ticketRequestString = 'service/tickets/';
    }

    if(JSONData.recordType == 'ProjectTicket') {
        ticketRequestString = 'project/tickets/';
    }

    //1. get the data from CWM Ticket first
    try {
        var cwmTicketObject = getJSONData(ticketRequestString + JSONData.id, 1, 1000, 1,null,null,null, CW_ACCOUNT_ID);
        nlapiLogExecution('AUDIT', 'cwmTicketObject', JSON.stringify(cwmTicketObject));
        if(cwmTicketObject) {
            var taskCustomFieldObject = getCWMCustomFieldValueById(cwmTicketObject, CWM_TICKET_CU_TASK_ID_FIELD_ID);
            nlapiLogExecution('AUDIT', 'taskCustomFieldObject', taskCustomFieldObject.value);
            taskId = taskCustomFieldObject.value;
            messageLog = messageLog + '\n' + taskCustomFieldObject.message;
        }

        //nlapiLogExecution('AUDIT', 'Ticket Name: ' + JSONData.summary);

        if(taskId != '' && taskId) {
            var currentCUTaskStatus = '';
            var statusUpdateNeeded = true;
            var currentOrderIndex = 0;
            //2. grab some existing info first clickup
            var currentTaskRequest = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, null, getCUHeaderSettings(), null, 'GET');
            nlapiLogExecution('AUDIT', 'CurrentTaskRequest', currentTaskRequest.getBody());
            if (currentTaskRequest) {
                var currentTaskObject = JSON.parse(currentTaskRequest.getBody());
                if (currentTaskObject) {
                    currentOrderIndex = currentTaskObject.orderindex;
                    currentCUTaskStatus = currentTaskObject.status.status;
                }
            }

            var cuStatusUpdate = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, JSONData.status.name, true);
            JSONPostObject = {
                status: cuStatusUpdate
            };

            if(currentCUTaskStatus == cuStatusUpdate) {
                statusUpdateNeeded = false;
                nlapiLogExecution('DEBUG', 'Status Update NOT NEEDED');
            }

            //nlapiLogExecution('DEBUG', 'Current Order Index ' + currentOrderIndex);
            if (JSONPostObject) {
                //3. post back the cu task with updated field values from cwm
                if(statusUpdateNeeded == true) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - STATUS UPDATE: ' + JSON.stringify(JSONPostObject);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT:', JSON.stringify(JSONPostObject));
                    var postRequest = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, JSON.stringify(JSONPostObject), getCUHeaderSettings(), 'PUT');

                    if (postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                } else {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': STATUS UPDATE NOT NEEDED: Status is the same';
                }
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object is EMPTY!';
                returnStatus = INTEGRATION_STATUS_REJECTED;
            }

            var cuTaskJSONData = JSON.parse(currentTaskRequest.getBody());

            //4. custom field of task - owner name
            var JSONPostObject2 = {};
            var ownerName = '';
            if(JSONData.owner) {
                ownerName = JSONData.owner.name;
            }
            JSONPostObject2.value = ownerName;

            var customFieldId_ownerName = getCUCustomFieldId('CW Owner Name', cuTaskJSONData);

            if (JSONPostObject2) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD OWNER NAME UPDATE: ' + JSON.stringify(JSONPostObject2);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD OWNER NAME UPDATE:', JSON.stringify(JSONPostObject2));
                var postRequest2 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_ownerName, JSON.stringify(JSONPostObject2), getCUHeaderSettings(), 'POST');

                if (postRequest2.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest2.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest2.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest2.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Owner Name) is EMPTY!';
            }

            //5. custom field of task - owner id
            var JSONPostObject3 = {};
            var ownerId = '';
            if(JSONData.owner) {
                ownerId = JSONData.owner.id;
            }
            JSONPostObject3.value = ownerId;

            var customFieldId_ownerId = getCUCustomFieldId('CW Owner ID', cuTaskJSONData);

            if (JSONPostObject3) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD OWNER ID UPDATE: ' + JSON.stringify(JSONPostObject3);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD OWNER ID UPDATE:', JSON.stringify(JSONPostObject3));
                var postRequest3 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_ownerId, JSON.stringify(JSONPostObject3), getCUHeaderSettings(), 'POST');

                if (postRequest3.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest3.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest3.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest3.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Owner ID) is EMPTY!';
            }

            //6. custom field of task - cw company name
            var JSONPostObject4 = {};
            var companyName = '';
            if(JSONData.company) {
                companyName = JSONData.company.name;
            }
            JSONPostObject4.value = companyName;

            var customFieldId_companyName = getCUCustomFieldId('CW Company Name', cuTaskJSONData);

            if (JSONPostObject4) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD COMPANY NAME UPDATE: ' + JSON.stringify(JSONPostObject4);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD COMPANY NAME UPDATE:', JSON.stringify(JSONPostObject4));
                var postRequest4 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_companyName, JSON.stringify(JSONPostObject4), getCUHeaderSettings(), 'POST');

                if (postRequest4.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest4.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest4.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest4.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Company Name) is EMPTY!';
            }

            //7. custom field of task - company id
            var JSONPostObject5 = {};
            var companyId = '';
            if(JSONData.company) {
                companyId = JSONData.company.id;
            }
            JSONPostObject5.value = companyId;

            var customFieldId_companyId = getCUCustomFieldId('CW Company ID', cuTaskJSONData);

            if (JSONPostObject5) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD COMPANY ID UPDATE: ' + JSON.stringify(JSONPostObject5);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD COMPANY ID UPDATE:', JSON.stringify(JSONPostObject5));
                var postRequest5 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_companyId, JSON.stringify(JSONPostObject5), getCUHeaderSettings(), 'POST');

                if (postRequest5.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest5.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest5.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest5.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Company ID) is EMPTY!';
            }

            //6a. custom field of task - cw contact name
            var JSONPostObject4a = {};
            var contactName = '';
            if(JSONData.contactName) {
                contactName = JSONData.contactName;
            }
            JSONPostObject4a.value = contactName;

            var customFieldId_contactName = getCUCustomFieldId('CW Contact Name', cuTaskJSONData);

            if (JSONPostObject4a) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CONTACT NAME UPDATE: ' + JSON.stringify(JSONPostObject4a);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CONTACT NAME UPDATE:', JSON.stringify(JSONPostObject4a));
                var postRequest4a = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_contactName, JSON.stringify(JSONPostObject4a), getCUHeaderSettings(), 'POST');

                if (postRequest4a.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest4a.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest4a.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest4a.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Contact Name) is EMPTY!';
            }

            //7a. custom field of task - contact email
            var JSONPostObject5a = {};
            var contactEmail = '';
            if(JSONData.contactEmailAddress) {
                contactEmail = JSONData.contactEmailAddress.trim();
            }
            JSONPostObject5a.value = contactEmail;

            var customFieldId_contactEmail = getCUCustomFieldId('CW Contact Email', cuTaskJSONData);

            if (JSONPostObject5a) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CONTACT EMAIL UPDATE: ' + JSON.stringify(JSONPostObject5a);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CONTACT EMAIL UPDATE:', JSON.stringify(JSONPostObject5a));
                var postRequest5a = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_contactEmail, JSON.stringify(JSONPostObject5a), getCUHeaderSettings(), 'POST');

                if (postRequest5a.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest5a.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest5a.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest5a.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Contact Email) is EMPTY!';
            }

            //added 8/5/2023
            //7b. custom field of task - cw customer updated
            var JSONPostObject7b = {};
            JSONPostObject7b.value = 'false';
            if(JSONData) {
                if (JSONData.customerUpdatedFlag == true) {
                    JSONPostObject7b.value = 'true';
                } else {
                    JSONPostObject7b.value = 'false';
                }
            }


            var customFieldId_isCustomerUpdated = getCUCustomFieldId('CW Customer Updated', cuTaskJSONData);

            if (JSONPostObject7b) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD IS CW CUSTOMER UPDATED UPDATE: ' + JSON.stringify(JSONPostObject7b);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD IS CW CUSTOMER UPDATED UPDATE:', JSON.stringify(JSONPostObject7b));
                var postRequest7b = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_isCustomerUpdated, JSON.stringify(JSONPostObject7b), getCUHeaderSettings(), 'POST');

                if (postRequest7b.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest7b.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest7b.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest7b.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Is CW Customer Updated Flag) is EMPTY!';
            }

            //9. custom field of task - customer type        //added 06/22/2024
            
            /**
             *  06.26.2024 - Do not run for updates for now.
             */
            /*
            var JSONPostObjectCompType = {};
            var customerType = '';
         
            if(JSONData.company) {
                companyId = JSONData.company.id;
                customerType = getCompanyType(companyId);
            }
            JSONPostObjectCompType.value = customerType;
           
            var customFieldId_customerType = getCUCustomFieldId('CW Customer Type', cuTaskJSONData);
            if (JSONPostObjectCompType) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD COMPANY ID UPDATE: ' + JSON.stringify(JSONPostObjectCompType);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CUSTOMER TYPE UPDATE:', JSON.stringify(JSONPostObjectCompType));
                var postRequestCustType = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_customerType, JSON.stringify(JSONPostObjectCompType), getCUHeaderSettings(), 'POST');
                if (postRequestCustType.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequestCustType.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequestCustType.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequestCustType.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Customer Type) is EMPTY!';
            }
            */

           

            //8. custom field of task - cw attachments
            var JSONPostObject6 = {};

            var attachmentObject = getAttachments(JSONData.id, 'Ticket');
            messageLog = messageLog + attachmentObject.message;
            JSONPostObject6.value = attachmentObject.message;

            var attachmentFieldNeedsUpdate = true;

            var customFieldId_attachments = getCUCustomFieldId('CW Attachments', cuTaskJSONData);

            

            //determine first if there is no need to update
            var attachmentFieldNeedsUpdate = determineIfAttachmentNeedsUpdate(cuTaskJSONData, 'CW Attachments', attachmentObject.attachmentCount);

            if(attachmentFieldNeedsUpdate == true) {
                if (JSONPostObject6) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD ATTACHMENTS TEXT UPDATE: ' + JSON.stringify(JSONPostObject6);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD ATTACHMENTS TEXT UPDATE:', JSON.stringify(JSONPostObject6));
                    var postRequest6 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_attachments, JSON.stringify(JSONPostObject6), getCUHeaderSettings(), 'POST');

                    if (postRequest6.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest6.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest6.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest6.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Attachments Text) is EMPTY!';
                }
            } else {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD ATTACHMENTS TEXT UPDATE: NO NEED TO UPDATE ATTACHMENT COUNT IS THE SAME!';
            }

            //counter-check each cu resource from cwm resrouce so we would know which to remove or add on CU - added 11/13/2022
            var cwmResourcesArr = [];
            var cuAssigneesArr = [];

            var removeAssigneeArr = [];
            var addAssigneeArr = [];

            //get the resources first on CWM and get its CU id matrix
            if(JSONData.resources) {
                var resourcesArr = JSONData.resources.split(',');
                if(resourcesArr) {
                    if(resourcesArr.length > 0) {
                        for (var x = 0; x < resourcesArr.length; x++) {
                            var cwmMemberId = getCWMemberIdByIdentifier(resourcesArr[x].trim());
                            nlapiLogExecution('AUDIT', 'CW MEMBER IDENTIFIER: ' + resourcesArr[x].trim(), 'Found CWM Member ID: ' + cwmMemberId);
                            if(cwmMemberId != '' && cwmMemberId) {
                                var resourceObject = {};
                                resourceObject.id = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, cwmMemberId, true);
                                nlapiLogExecution('AUDIT', 'CW TEAM ASSIGNEE ID FOUND: ' + resourceObject.id );
                                cwmResourcesArr.push(resourceObject.id);
                            }
                        }
                    }
                }
            }

            //get the resources id on CU side
            //nlapiLogExecution('DEBUG', '**** CU TASK JSON DATA ****', JSON.stringify(cuTaskJSONData));
            if(cuTaskJSONData.assignees) {
                if(cuTaskJSONData.assignees.length > 0) {
                    for (var z = 0; z < cuTaskJSONData.assignees.length; z++) {
                        cuAssigneesArr.push(cuTaskJSONData.assignees[z].id);
                        nlapiLogExecution('DEBUG', 'ASSIGNEE CU ID: ' + cuTaskJSONData.assignees[z].id);
                    }
                }
            }

            //check to see which resources to add to Clickup
            for (var i = 0; i < cwmResourcesArr.length; i++) {
                var cuResourceFound = false;
                for (var j = 0; j < cuAssigneesArr.length; j++) {
                    if(cwmResourcesArr[i].toString() == cuAssigneesArr[j].toString()) {
                        cuResourceFound = true;
                    }
                }
                if(cuResourceFound == false) {
                    addAssigneeArr.push(cwmResourcesArr[i]);
                    nlapiLogExecution('DEBUG', 'ADDING TO ADD LIST: ' + cuAssigneesArr[i]);
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': ADDING CU ASSIGNEE ID: ' + cuAssigneesArr[i];
                }
            }

            nlapiLogExecution('DEBUG', '*** CWM RESOURCES ARRAY: ', JSON.stringify(cwmResourcesArr));
            nlapiLogExecution('DEBUG', '*** CU RESOURCES ARRAY: ', JSON.stringify(cuAssigneesArr));
            //check to see which resources to remove from Clickup
            for (var i = 0; i < cuAssigneesArr.length; i++) {
                var matchFound = false;
                for (var j = 0; j < cwmResourcesArr.length; j++) {
                    if(cuAssigneesArr[i].toString() == cwmResourcesArr[j].toString()) {
                        matchFound = true;
                    }
                }
                if(matchFound == false) {
                    removeAssigneeArr.push(cuAssigneesArr[i]);
                    nlapiLogExecution('DEBUG', 'ADDING TO REMOVE LIST: ' + cuAssigneesArr[i]);
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': REMOVING CU ASSIGNEE ID: ' + cuAssigneesArr[i];
                }
            }

            //9. remove all assignees, replace whatever we have on CWM

            // var removeArr = [];
            //nlapiLogExecution('DEBUG', '**** CU TASK JSON DATA ****', JSON.stringify(cuTaskJSONData));
            // if(cuTaskJSONData.assignees) {
            //     if(cuTaskJSONData.assignees.length > 0) {
            //         for (var z = 0; z < cuTaskJSONData.assignees.length; z++) {
            //             removeArr.push(cuTaskJSONData.assignees[z].id);
            //             nlapiLogExecution('DEBUG', 'ADDING TO REMOVE LIST: ' + cuTaskJSONData.assignees[z].id);
            //         }
            //     }
            // }
            var JSONPostObject7 = {};
            if(removeAssigneeArr.length > 0 && updateTicketId != true) {
                nlapiLogExecution('AUDIT', 'REMOVING ASSIGNEES');
                JSONPostObject7 = {
                    "assignees": {
                        "rem": removeAssigneeArr
                    },
                };

                if (JSONPostObject7) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - ASSIGNEES REMOVAL UPDATE: ' + JSON.stringify(JSONPostObject7);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - ASSIGNEES REMOVAL UPDATE:', JSON.stringify(JSONPostObject7));
                    var postRequest7 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/', JSON.stringify(JSONPostObject7), getCUHeaderSettings(), 'PUT');

                    if (postRequest7.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest7.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest7.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest7.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - ASSIGNEES REMOVAL UPDATE) is EMPTY!';
                }
            } else {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': NO ASSIGNEES NEEDED TO REMOVE ON CLICKUP!';
            }

            //10. add all assignees from cwm

            //var assigneesObjectArr = [];

            //assign owner
            // if(ownerId != '' && ownerId) {
            //     var ownerObject = {};
            //     ownerObject.id = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, ownerId, true);
            //     nlapiLogExecution('AUDIT', 'CW OWNER ID FOUND: ' + ownerObject.id );
            //
            //     assigneesObjectArr.push(ownerObject.id);
            // }
            //assign rest of the team on CWM
            // if(JSONData.resources) {
            //     var resourcesArr = JSONData.resources.split(',');
            //     if(resourcesArr) {
            //         if(resourcesArr.length > 0) {
            //             for (var x = 0; x < resourcesArr.length; x++) {
            //                 var cwmMemberId = getCWMemberIdByIdentifier(resourcesArr[x].trim());
            //                 nlapiLogExecution('AUDIT', 'CW MEMBER IDENTIFIER: ' + resourcesArr[x].trim(), 'Found CWM Member ID: ' + cwmMemberId);
            //                 if(cwmMemberId != '' && cwmMemberId) {
            //                     var resourceObject = {};
            //                     resourceObject.id = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, cwmMemberId, true);
            //                     nlapiLogExecution('AUDIT', 'CW TEAM ASSIGNEE ID FOUND: ' + resourceObject.id );
            //                     assigneesObjectArr.push(resourceObject.id);
            //                 }
            //             }
            //         }
            //     }
            // }
            var JSONPostObject8 = {};
            if(addAssigneeArr.length > 0 && updateTicketId != true) {
                JSONPostObject8 = {
                    "assignees": {
                        "add": addAssigneeArr,
                    },
                };

                if (JSONPostObject8) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - ASSIGNEES UPDATE: ' + JSON.stringify(JSONPostObject8);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - ASSIGNEES UPDATE:', JSON.stringify(JSONPostObject8));
                    var postRequest8 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/', JSON.stringify(JSONPostObject8), getCUHeaderSettings(), 'PUT');

                    if (postRequest8.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest8.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest8.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest8.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - ASSIGNEES UPDATE) is EMPTY!';
                }
            } else {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': NO ASSIGNEES NEEDED TO ADD ON CLICKUP!';
            }

            //budget hours or time_estimate field update
            var cwmBudgetHoursFinal = null;
            if (JSONData.budgetHours) {
                if(JSONData.budgetHours > 0) {
                    try {
                        var cwmBudgetHoursTemp = JSONData.budgetHours.toString();
                        nlapiLogExecution('AUDIT', 'CWM Budget Hours String: ' + cwmBudgetHoursTemp );
                        var budgetHoursSplit = cwmBudgetHoursTemp.split('.');
                        nlapiLogExecution('AUDIT', 'CWM Budget Hours Split Length: ' + budgetHoursSplit.length);
                        if (budgetHoursSplit.length > 0) {
                            if(budgetHoursSplit.length == 1) {
                                cwmBudgetHoursFinal = (+budgetHoursSplit[0] * (60000 * 60));
                            } else {
                                cwmBudgetHoursFinal = (+budgetHoursSplit[0] * (60000 * 60)) + (+budgetHoursSplit[1] * 60000);
                            }
                            nlapiLogExecution('AUDIT', 'CWM Budget Hours Split 0: ' + budgetHoursSplit[0]);
                            nlapiLogExecution('AUDIT', 'CWM Budget Hours Split 1: ' + budgetHoursSplit[1]);
                            nlapiLogExecution('AUDIT', 'CWM Budget Hours Final: ' + cwmBudgetHoursFinal);
                        }
                    } catch (hrerr) {
                        nlapiLogExecution('ERROR', 'Budget hour computation error: ', hrerr);
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Budget hour computation error:  ' + hrerr
                        cwmBudgetHoursFinal = null;
                    }
                }
            }

            var JSONPostObjectBH = {
                time_estimate: cwmBudgetHoursFinal
            };

            if (JSONPostObjectBH) {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - TIME ESTIMATE UPDATE: ' + JSON.stringify(JSONPostObjectBH);
                nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - TIME ESTIMATE UPDATE:', JSON.stringify(JSONPostObjectBH));
                var postRequestBH = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, JSON.stringify(JSONPostObjectBH), getCUHeaderSettings(), 'PUT');

                if (postRequestBH.getCode() == 400) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequestBH.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequestBH.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequestBH.getCode();
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object Time Estimate Field is EMPTY!';
            }

            //8/7/2023 - post latest notes from cwm ticket
            var cwmTicketNotes = getTicketNotes(JSONData.id, false);
            var currentCUTaskNotes = getCUTaskNotes(taskId);
            var notesToPostToTask = determineNotesToPost(cwmTicketNotes.notes, currentCUTaskNotes);

            if(notesToPostToTask.length > 0)
                nlapiLogExecution('AUDIT', 'Total Note ID to POST: ' + notesToPostToTask.length);

            if(notesToPostToTask.length > 0) {
                for (var b = 0; b < notesToPostToTask.length; b++) {
                    nlapiLogExecution('AUDIT', 'Posting Note ID: ' + notesToPostToTask[b].noteid, 'Text: ' + notesToPostToTask[b].text);
                    var commentHeader = '[POSTED BY SYSTEM INTEGRATION - NOTE ID: ' + notesToPostToTask[b].noteid + ']' + '\n' + '\n';
                    if(notesToPostToTask[b].createdby) {
                        commentHeader = commentHeader + 'From: ' + notesToPostToTask[b].createdby + '\n';
                    }
                    if(notesToPostToTask[b].datecreated) {
                        nlapiLogExecution('AUDIT', 'Adding user and date to comment: ' + notesToPostToTask[b].createdby, 'Date: ' + notesToPostToTask[b].datecreated);
                        var commentDateTemp = notesToPostToTask[b].datecreated.replace('T', ' ');
                        var commentDate = commentDateTemp.replace('Z', '');
                        commentHeader = commentHeader + commentDate + '\n' + '\n';
                    }

                    var JSONPostObject24 = {
                        "comment_text": commentHeader + notesToPostToTask[b].text,
                        "notify_all": true
                    };

                    if (JSONPostObject24) {
                        //post back the cu task with updated field values from cwm
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST UPDATE DATA OBJECT - TASK COMMENT UPDATE: ' + JSON.stringify(JSONPostObject24);
                        nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT:', JSON.stringify(JSONPostObject24));
                        var postRequest24 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/comment', JSON.stringify(JSONPostObject24), getCUHeaderSettings(), 'POST');

                        if (postRequest24.getCode() == 400 || postRequest24.getCode() == 403) {
                            returnStatus = INTEGRATION_STATUS_ERROR;
                        }
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest24.getError();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest24.getBody();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest24.getCode();
                        nlapiLogExecution('AUDIT', 'HTTP BODY RESPONSE DATA OBJECT:', postRequest24.getBody());
                    } else {
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object is EMPTY!';
                        returnStatus = INTEGRATION_STATUS_REJECTED;
                    }
                }
            } else {
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST UPDATE DATA OBJECT - TASK COMMENT UPDATE: NO NEW NOTES TO POST ON CU TASK...';
            }

            //for Project Ticket, update link and CWM ID as well
            if(JSONData.recordType == 'ProjectTicket') {
                //11. custom field of task - cwm ticket id
                var JSONPostObject9 = {};
                var cwmProjectTicketId = '';
                if(JSONData.id) {
                    cwmProjectTicketId = JSONData.id;
                }
                JSONPostObject9.value = cwmProjectTicketId;

                var customFieldId_projectTicketId = getCUCustomFieldId('CW Ticket ID', cuTaskJSONData);

                if (JSONPostObject9) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CW PROJECT TICKET UPDATE: ' + JSON.stringify(JSONPostObject9);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CW PROJECT TICKET UPDATE:', JSON.stringify(JSONPostObject9));
                    var postRequest9 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_projectTicketId, JSON.stringify(JSONPostObject9), getCUHeaderSettings(), 'POST');

                    if (postRequest9.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest9.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest9.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest9.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - CW Project Ticket ID) is EMPTY!';
                }

                //12. custom field of task - cwm ticket link
                var JSONPostObject10 = {};
                var cwmProjectTicketId = '';
                if(JSONData.id) {
                    cwmProjectTicketId = JSONData.id;
                }
                JSONPostObject10.value = CW_TICKET_REDIRECT_URL + cwmProjectTicketId;

                var customFieldId_projectTicketId = getCUCustomFieldId('CW Ticket Link', cuTaskJSONData);

                if (JSONPostObject10) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CW PROJECT TICKET LINK UPDATE: ' + JSON.stringify(JSONPostObject10);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CW PROJECT TICKET LINK UPDATE:', JSON.stringify(JSONPostObject10));
                    var postRequest10 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_projectTicketId, JSON.stringify(JSONPostObject10), getCUHeaderSettings(), 'POST');

                    if (postRequest10.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest10.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest10.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest10.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - CW Project Ticket Link) is EMPTY!';
                }

                //13. update cwm ticket link on connectwise
                messageLog = messageLog + updateCWMTicketLink(cwmProjectTicketId, CU_BASE_URL + '/t/' + taskId, taskId, logRecordId, JSONData.recordType);

                //14. update Is CW Project field
                var JSONPostObject11 = {};
                JSONPostObject11.value = 'true';

                var customFieldId_isProjectTicket = getCUCustomFieldId('CW Project Ticket', cuTaskJSONData);

                if (JSONPostObject11) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD IS CW PROJECT TICKET UPDATE: ' + JSON.stringify(JSONPostObject11);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD IS CW PROJECT TICKET UPDATE:', JSON.stringify(JSONPostObject11));
                    var postRequest11 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_isProjectTicket, JSON.stringify(JSONPostObject11), getCUHeaderSettings(), 'POST');

                    if (postRequest11.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest11.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest11.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest11.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Is CW Project Ticket) is EMPTY!';
                }

            }

            //OPTIONAL: Used for CU Task to CWM Ticket creation, update back the cwm ticket id and link on CU Task
            if(updateTicketId == true) {
                //cw ticket id custom field
                var JSONPostObject21 = {};
                JSONPostObject21.value = JSONData.id;

                var customFieldId_cwmTicketId = getCUCustomFieldId('CW Ticket ID', cuTaskJSONData);
                if (JSONPostObject21) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CWM TICKET ID UPDATE: ' + JSON.stringify(JSONPostObject21);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CWM TICKET ID UPDATE:', JSON.stringify(JSONPostObject21));
                    var postRequest21 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_cwmTicketId, JSON.stringify(JSONPostObject21), getCUHeaderSettings(), 'POST');

                    if (postRequest21.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest21.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest21.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest21.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - CW Ticket ID) is EMPTY!';
                }

                //cw ticket link id custom field
                var JSONPostObject22 = {};
                JSONPostObject22.value = CW_TICKET_REDIRECT_URL + JSONData.id;

                var customFieldId_cwmTicketLink = getCUCustomFieldId('CW Ticket Link', cuTaskJSONData);
                if (JSONPostObject22) {
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CWM TICKET LINK UPDATE: ' + JSON.stringify(JSONPostObject22);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD CWM TICKET LINK UPDATE:', JSON.stringify(JSONPostObject22));
                    var postRequest22 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/field/' + customFieldId_cwmTicketLink, JSON.stringify(JSONPostObject22), getCUHeaderSettings(), 'POST');

                    if (postRequest22.getCode() == 400) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest22.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest22.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest22.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - CW Ticket LINK) is EMPTY!';
                }

                var JSONPostObject23 = {
                    name: "Service Ticket #" + JSONData.id + ' - ' + cuTaskJSONData.name
                };

                //nlapiLogExecution('DEBUG', 'Current Order Index ' + currentOrderIndex);
                if (JSONPostObject23) {
                    //3. post back the cu task with updated field values from cwm
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - TASK NAME UPDATE: ' + JSON.stringify(JSONPostObject23);
                    nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT:', JSON.stringify(JSONPostObject23));
                    var postRequest23 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, JSON.stringify(JSONPostObject23), getCUHeaderSettings(), 'PUT');

                    if (postRequest23.getCode() == 400 || postRequest23.getCode() == 403) {
                        returnStatus = INTEGRATION_STATUS_ERROR;
                    }
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest23.getError();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest23.getBody();
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest23.getCode();
                } else {
                    messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object is EMPTY!';
                    returnStatus = INTEGRATION_STATUS_REJECTED;
                }


            }
            //update order index for service ticket and project tickets
            // var JSONPostObjectOI = {
            //     orderindex: currentOrderIndex
            // };
            //
            // nlapiLogExecution('DEBUG', 'Current Order Index ' + currentOrderIndex);
            // if (JSONPostObjectOI) {
            //     //3. post back the cu task with updated field values from cwm
            //     messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - ORDER INDEX UPDATE: ' + JSON.stringify(JSONPostObjectOI);
            //     nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT:', JSON.stringify(JSONPostObjectOI));
            //     var postRequestOI = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId, JSON.stringify(JSONPostObjectOI), getCUHeaderSettings(), 'PUT');
            //
            //     if (postRequestOI.getCode() == 400 || postRequestOI.getCode() == 403) {
            //         returnStatus = INTEGRATION_STATUS_ERROR;
            //     }
            //     messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequestOI.getError();
            //     messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequestOI.getBody();
            //     messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequestOI.getCode();
            // } else {
            //     messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object for Index Update is EMPTY!';
            //     returnStatus = INTEGRATION_STATUS_REJECTED;
            // }

        } else {
            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': No Task ID Found for this CWM Ticket!';
            returnStatus = INTEGRATION_STATUS_REJECTED;
        }

        destinationURL = CU_BASE_URL + '/t/' + taskId;
        updateLog(logRecordId, returnStatus, messageLog, taskId, JSON.stringify(JSONPostObject), destinationURL, '', 'Update CU Task');
    } catch (err) {
        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Cannot update task status on Clickup: ERROR: ' + err;
        updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(JSONPostObject), '', '', 'Update CU Task');
        nlapiLogExecution('ERROR', 'Cannot update task status on Clickup: CWM Ticket ID: ' + JSONData.id, messageLog);

    }

}

function determineNotesToPost(cwmNotesArr, cuCommentsArr) {
    var returnObjectArr = [];
    var cuTaskNoteIdArr = [];

    try {
        if(cwmNotesArr) {
            if(cwmNotesArr.length > 0) {
                nlapiLogExecution('AUDIT', '[cwmNotesArr]', JSON.stringify(cwmNotesArr));
                for (var i = 0; i < cuCommentsArr.length; i++) {
                    var noteId;
                    var currentCUComment = cuCommentsArr[i];
                    nlapiLogExecution('DEBUG', '[determineNotesToPost] Analyzing cu comment: ', cuCommentsArr[i]);
                    //var currentCUComment = cuCommentsArr[i];
                    var splitText = currentCUComment.split('[POSTED BY SYSTEM INTEGRATION - NOTE ID: ');
                    if(splitText) {
                        if (splitText.length > 1) {
                            var noteIdTemp = splitText[1];
                            noteId = noteIdTemp.substring(0, noteIdTemp.indexOf(']'));
                            if(noteId) {
                                cuTaskNoteIdArr.push(noteId);
                                nlapiLogExecution('DEBUG', '[determineNotesToPost] Pushing Cu Task Note ID to Arr: ', noteId);
                            }
                        }
                    }
                }

                //match cu
                for (var q = 0; q < cwmNotesArr.length; q++) {
                    var noteIdMatchFound = false;
                    for (var e = 0; e < cuTaskNoteIdArr.length; e++) {
                        if (cwmNotesArr[q].ticketnoteid == cuTaskNoteIdArr[e]) {
                            //note id matched on cu task, means that we need to skip this
                            noteIdMatchFound = true;
                        }
                    }
                    if (noteIdMatchFound == false) {
                        var returnObject = {};
                        returnObject.noteid = cwmNotesArr[q].ticketnoteid;
                        returnObject.text = cwmNotesArr[q].ticketnotes;
                        returnObject.createdby = cwmNotesArr[q].createdby;
                        returnObject.datecreated = cwmNotesArr[q].datecreated;
                        nlapiLogExecution('DEBUG', '[determineNotesToPost] Note ID to Post: ', returnObject.noteid);
                        nlapiLogExecution('DEBUG', '[determineNotesToPost] createdby: ', returnObject.createdby);
                        nlapiLogExecution('DEBUG', '[determineNotesToPost] datecreated: ', returnObject.datecreated);
                        returnObjectArr.push(returnObject);
                    }
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not consolidate notes to post for task id: ' + taskId, err);
    }

    return returnObjectArr;
}

function getCUTaskNotes(taskId) {
    var taskCommentsArr = [];

    try {
        if(taskId) {
            //2. grab some existing info first clickup
            var currentTaskRequest = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + taskId + '/comment', null, getCUHeaderSettings(), null, 'GET');
            nlapiLogExecution('AUDIT', 'CurrentTaskComments', currentTaskRequest.getBody());
            if (currentTaskRequest) {
                var currentTaskObject = JSON.parse(currentTaskRequest.getBody());
                if (currentTaskObject) {
                    var cuTaskCommentsArr = currentTaskObject.comments;
                    if(cuTaskCommentsArr) {
                        if (cuTaskCommentsArr.length > 0) {
                            for (var i = 0; i < currentTaskObject.comments.length; i++) {
                                var commentTextArr = currentTaskObject.comments[i].comment;
                                if(commentTextArr) {
                                    if(commentTextArr.length > 0) {
                                        var commentTextLine1 = commentTextArr[0].text;
                                        nlapiLogExecution('DEBUG', '[getCUTaskNotes] Inserting Task Notes to Arr', commentTextLine1);
                                        taskCommentsArr.push(commentTextLine1);
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not get CU Task comments for task id: ' + taskId, err);
    }

    return taskCommentsArr;
}

function determineIfAttachmentNeedsUpdate(cuJSONData, cuFieldName, attachmentCount) {
    var isNeedUpdate = true;
    var cuAttachCount = 0;

    try {
        for (var i = 0; i < cuJSONData.custom_fields.length; i ++) {
            if(cuJSONData.custom_fields[i].name == cuFieldName) {
                var cuAttachmentText = cuJSONData.custom_fields[i].value;
                //get attachment count
                var splitText = [];
                splitText = cuAttachmentText.split('There are a total of ');
                if(splitText) {
                    if(splitText.length > 1) {
                        var subPos = splitText[1].indexOf(' attachments for this ticket.');
                        var cuAttachCount = splitText[1].substring(0, subPos);
                        if(cuAttachCount == attachmentCount)
                        {
                            isNeedUpdate = false
                        }
                    }
                }
                console.log(cuAttachCount);
            }
        }

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not check attachment count: ' + cuFieldName, err);
    }
    return isNeedUpdate;
}
function getCUCustomFieldId(cuFieldName, cuJSONData) {
    var returnId = '';

    try {
        if(cuFieldName) {
            for (var i = 0; i < cuJSONData.custom_fields.length; i ++) {
                if(cuJSONData.custom_fields[i].name == cuFieldName) {
                    returnId = cuJSONData.custom_fields[i].id;
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for cu field id for cu field name: ' + cuFieldName, err);
    }

    return returnId;
}

function checkIfTaskExistsOnCU(ticketId) {

    var messageLog = '';
    var JSONData;
    var ticketFound = false;
    var customFieldSearchFilterString = 'custom_fields=[{"field_id":"df5c2b9d-ef37-4218-a6f9-a6eab8c18154","operator":"=","value": ' + ticketId + '}]';

    try {

        var getRequest = nlapiRequestURL(CU_API_URL + '/api/v2/team/' + CU_SPACE_ID + '/task?' + customFieldSearchFilterString, null, getCUHeaderSettings(), null, 'GET');

        if (getRequest) {
            JSONData = JSON.parse(getRequest.getBody());
            if(JSONData) {
                if(JSONData.tasks) {
                    if(JSONData.tasks.length > 0) {
                        ticketFound = true;
                    }
                }
            }
        }
    } catch (err) {
        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP GET ERROR: ' + err;
        nlapiLogExecution('ERROR', 'HTTP GET ERROR for Task ID: ' + taskId, messageLog);
    }

    return ticketFound;
}
function checkIfTaskExists(ticketId) {
    var returnBool = false;

    try {
        //load search for scheduled script
        var colArr = new Array();
        var filterArr = new Array();

        colArr.push(new nlobjSearchColumn('internalid'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_origin_id'));
        colArr.push(new nlobjSearchColumn('custrecord_ctc_oip_status'));

        filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_origin_id', null, 'is', ticketId));
        filterArr.push(new nlobjSearchFilter('custrecord_ctc_oip_status', null, 'anyof', INTEGRATION_STATUS_SUCCESS));

        var searchResults = nlapiSearchRecord('customrecord_ctc_oip_runlog', null, filterArr, colArr);

        if (searchResults) {
            if(searchResults.length > 0) {
                returnBool = true;
                nlapiLogExecution('AUDIT', 'CREATE CU TASK REJECTED: TASK ALREADY EXISTS FOR TICKET ID', ticketId);
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not search for cw ticket id: ' + ticketId, err);
    }
    return returnBool;
}

function postTask(JSONData, taskNotes, taskNotesMessage, cwmTicketURL, logRecordId) {

    var postDataObject = {};
    var messageLog = '';
    var destinationURL = '';
    var listId = getMatrixMappingValue(MATRIX_MAPPING_TYPE_BOARD_TO_LIST, JSONData.board.name, true);
    //var tasStatus = getStatusNameFromCWMStatusName(JSONData.status.name);
    //var listId = '205609241';
    var returnStatus = INTEGRATION_STATUS_SUCCESS;
    messageLog = messageLog + taskNotesMessage;

    var companyId = '';
    var companyName = '';
    var companyType = '';
    var ownerName = '';
    var ownerId = '';
    var ticketId = '';
    var cwmTicketURLFinal = '';
    var ticketSummary = '';
    var taskNotesFinal = '';
    var statusFinal = '';
    var cwmContactNameFinal = '';
    var cwmContactEmailFinal = '';
    var cwmBudgetHoursFinal = null;

    if (JSONData.id) {
        ticketId = JSONData.id
    }
    //emergency fix, check to see if the task does not exist yet with the ticket id from CWM
    var taskExists = checkIfTaskExists(ticketId);

    if(taskExists == false) {
        //ticket components
        if (JSONData.status) {
            if (JSONData.status.name) {
                statusFinal = getMatrixMappingValue(MATRIX_MAPPING_TYPE_STATUS_TO_STATUS, JSONData.status.name, true);
            }
        }
        if (taskNotes) {
            taskNotesFinal = taskNotes;
        }
        if (JSONData.summary) {
            ticketSummary = JSONData.summary;
        }
        if (JSONData.company) {
            if (JSONData.company.id)
                companyId = JSONData.company.id;
                companyType = getCompanyType(companyId);
            if (JSONData.company.name)
                companyName = JSONData.company.name;
        }
        if (JSONData.owner) {
            if (JSONData.owner.id)
                ownerId = JSONData.owner.id;
            if (JSONData.owner.name)
                ownerName = JSONData.owner.name;
        }
        if (JSONData.contactName) {
            cwmContactNameFinal = JSONData.contactName;
        }
        if (JSONData.contactEmailAddress) {
            cwmContactEmailFinal = JSONData.contactEmailAddress.trim();
        }

        if (JSONData.budgetHours) {
            if(JSONData.budgetHours > 0) {
                try {
                    var cwmBudgetHoursTemp = JSONData.budgetHours.toString();
                    var budgetHoursSplit = cwmBudgetHoursTemp.split('.');
                    if (budgetHoursSplit.length > 0) {
                        if (budgetHoursSplit.length == 1) {
                            cwmBudgetHoursFinal = (+budgetHoursSplit[0] * (60000 * 60));
                        } else {
                            cwmBudgetHoursFinal = (+budgetHoursSplit[0] * (60000 * 60)) + (+budgetHoursSplit[1] * 60000);
                        }
                        nlapiLogExecution('AUDIT', 'CWM Budget Hours Final: ' + cwmBudgetHoursFinal);
                    }
                } catch (hrerr) {
                    nlapiLogExecution('ERROR', 'Budget hour computation error: ', hrerr);
                    messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': Budget hour computation error:  ' + hrerr
                    cwmBudgetHoursFinal = null;
                }
            }
        }


        if (cwmTicketURL) {
            cwmTicketURLFinal = cwmTicketURL;
        }

        //nlapiLogExecution('AUDIT', 'Ticket Name: ' + JSONData.summary);
        try {
            //create the task record for CU
            postDataObject =
                {
                    "name": 'Service Ticket #' + ticketId + ' - ' + ticketSummary,
                    "description": taskNotesFinal, //TODO: Grab the notes
                    "status": statusFinal, //TODO: Status names from CWM and CU are identical
                    "priority": null,
                    "due_date": null,
                    "due_date_time": false,
                    "time_estimate": cwmBudgetHoursFinal,
                    "start_date": null,
                    "start_date_time": false,
                    "notify_all": true,
                    "parent": null,
                    "links_to": null,
                    "custom_fields": [
                        {
                            "id": "322c9c7d-9a94-4ed0-9700-4a481136958b",
                            "name": "CW Company ID",
                            "type": "number",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": companyId,
                            "required": false
                        },
                        {
                            "id": "a18716b4-e521-458e-b949-482c8eb35d03",
                            "name": "CW Company Name",
                            "type": "short_text",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": companyName,
                            "required": false
                        },
                        {
                            "id": "9a47f086-63f8-4c8c-b613-a7e3fe336471",
                            "name": "CW Owner ID",
                            "type": "number",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": ownerId,
                            "required": false
                        },
                        {
                            "id": "311ed5fc-c979-44bc-97a2-bbf0eea8a33b",
                            "name": "CW Owner Name",
                            "type": "short_text",
                            "type_config": {},
                            "value": ownerName,
                            "hide_from_guests": false,
                            "required": false
                        },
                        {
                            "id": "df5c2b9d-ef37-4218-a6f9-a6eab8c18154",
                            "name": "CW Ticket ID",
                            "type": "number",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": ticketId,
                            "required": false
                        },
                        {
                            "id": "1e61fc8d-49ff-4f33-94ee-938f90f7cde2",
                            "name": "CW Ticket Link",
                            "type": "url",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": cwmTicketURLFinal,
                            "required": false
                        },
                        {
                            "id": "84a10c9f-63db-4744-af12-926acee237f9",
                            "name": "CW Contact Name",
                            "type": "short_text",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": cwmContactNameFinal,
                            "required": false
                        },
                        {
                            "id": "96f632a2-349c-475a-9f1b-1c49b9e43192",
                            "name": "CW Contact Email",
                            "type": "email",
                            "type_config": {},
                            "hide_from_guests": false,
                            "value": cwmContactEmailFinal,
                            "required": false
                        },
                        {
                            "id": "c56ef17b-c8dc-4085-94c7-ea40261e9d70",
                            "name": "Complete",
                            "type": "manual_progress",
                            "type_config": {
                                "end": 100,
                                "start": 0
                            },
                            "hide_from_guests": false,
                            "value": {
                                "current": 0,
                                "percent_completed": 0
                            },
                            "required": false
                        },
                        {
                            "id": "279e8059-992f-4005-9bc8-562cf0874a9d",
                            "name": "ETA",
                            "type": "date",
                            "type_config": {},
                            "hide_from_guests": false,
                            "required": false
                        },
                        {
                            "id": "595490dd-086c-4d23-92ee-c1691fd22e20",
                            "name": "CW Customer Type",
                            "type": "short_text",
                            "type_config": {},
                            "value": companyType,
                            "hide_from_guests": true,
                            "required": false
                        }

                        // {
                        //     "id": "a73b7b4b-d0ca-4175-8531-a5bb67cb1ebb",
                        //     "name": "Webhook GUID",
                        //     "type": "short_text",
                        //     "type_config": {},
                        //     "value": webhookGUIDFinal,
                        //     "hide_from_guests": false,
                        //     "required": false
                        // }
                    ],
                };

            var assigneesObjectArr = [];

            //assign owner
            // if(ownerId != '' && ownerId) {
            //     var ownerObject = {};
            //     ownerObject.id = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, ownerId, true);
            //     nlapiLogExecution('AUDIT', 'CW OWNER ID FOUND: ' + ownerObject.id );
            //
            //     assigneesObjectArr.push(ownerObject.id);
            // }
            //assign rest of the team on CWM
            if (JSONData.resources) {
                var resourcesArr = JSONData.resources.split(',');
                if (resourcesArr) {
                    if (resourcesArr.length > 0) {
                        for (var x = 0; x < resourcesArr.length; x++) {
                            var cwmMemberId = getCWMemberIdByIdentifier(resourcesArr[x].trim());
                            nlapiLogExecution('AUDIT', 'CW MEMBER IDENTIFIER: ' + resourcesArr[x].trim(), 'Found CWM Member ID: ' + cwmMemberId);
                            if (cwmMemberId != '' && cwmMemberId) {
                                var resourceObject = {};
                                resourceObject.id = getMatrixMappingValue(MATRIX_MAPPING_TYPE_MEMBER_TO_USER, cwmMemberId, true);
                                nlapiLogExecution('AUDIT', 'CW TEAM ASSIGNEE ID FOUND: ' + resourceObject.id);
                                assigneesObjectArr.push(resourceObject.id);
                            }
                        }
                    }
                }
            }

            if (assigneesObjectArr.length > 0) {
                postDataObject.assignees = assigneesObjectArr;
                nlapiLogExecution('DEBUG', 'ADDING ASSIGNEES ARRAY TO PAYLOAD');
            }

            //messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP POST DATA OBJECT: ' + JSON.stringify(postDataObject);
            //2nd level task checking to prevent duplicates

            var taskExistsOnCU = checkIfTaskExistsOnCU(ticketId);
            if(taskExistsOnCU == false) {
                var postRequest = nlapiRequestURL(CU_API_URL + '/api/v2/list/' + listId + '/task', JSON.stringify(postDataObject), getCUHeaderSettings(), null, 'POST');

                if (postRequest.getCode() == 400 || postRequest.getCode() == 403) {
                    returnStatus = INTEGRATION_STATUS_ERROR;
                }
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest.getError();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest.getBody();
                messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest.getCode();
                var JSONResponseBody = postRequest.getBody();
                var destinationId;
                if (JSONResponseBody) {
                    var JSONResponseData = JSON.parse(JSONResponseBody);
                    destinationId = JSONResponseData.id;
                }
                destinationURL = CU_BASE_URL + '/t/' + destinationId;
                //UPDATE CWM SERVICE TICKET WITH TASK LINK
                if (destinationId) {
                    //update ticket back on CWM with task link
                    messageLog = messageLog + updateCWMTicketLink(ticketId, destinationURL, destinationId, logRecordId);
                    //bring over attachments from CW and post to CU Task
                    // var attachmentObject = getAttachments(JSONData.id, 'Ticket');
                    // messageLog = messageLog + attachmentObject.message;
                    // var postAttachments = postAttachment(destinationId, attachmentObject.attachmentArray);
                    // messageLog = messageLog + postAttachments.message;

                    //8. custom field of task - cw attachments
                    var JSONPostObject6 = {};

                    var attachmentObject = getAttachments(JSONData.id, 'Ticket');
                    messageLog = messageLog + attachmentObject.message;
                    JSONPostObject6.value = attachmentObject.message;

                    var customFieldId_attachments = getCUCustomFieldId('CW Attachments', JSONResponseData);

                    if (JSONPostObject6) {
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD ATTACHMENTS TEXT UPDATE: ' + JSON.stringify(JSONPostObject6);
                        nlapiLogExecution('AUDIT', 'HTTP PUT UPDATE DATA OBJECT - CUSTOM FIELD ATTACHMENTS TEXT UPDATE:', JSON.stringify(JSONPostObject6));
                        var postRequest6 = nlapiRequestURL(CU_API_URL + '/api/v2/task/' + destinationId + '/field/' + customFieldId_attachments, JSON.stringify(JSONPostObject6), getCUHeaderSettings(), 'POST');

                        if (postRequest6.getCode() == 400) {
                            returnStatus = INTEGRATION_STATUS_ERROR;
                        }
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE ERRORS: ' + postRequest6.getError();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE BODY: ' + postRequest6.getBody();
                        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': HTTP RESPONSE CODE: ' + postRequest6.getCode();
                    } else {
                        messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': JSON Post Object (Custom Field - Attachments Text) is EMPTY!';
                    }
                }
                updateLog(logRecordId, returnStatus, messageLog, destinationId, JSON.stringify(postDataObject), destinationURL);
            } else {
                messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + 'ERROR: Skipping creation of CU Task, Existing task was found Clickup for Ticket ID: ' + ticketId;
                updateLog(logRecordId, INTEGRATION_STATUS_REJECTED, messageLog, '', '', '');
            }
        } catch (err) {
            messageLog = messageLog + '\n' + nlapiDateToString(new Date(), 'datetime') + ': Cannot post task on Clickup: ERROR: ' + err;
            updateLog(logRecordId, INTEGRATION_STATUS_ERROR, messageLog, '', JSON.stringify(postDataObject));
            nlapiLogExecution('ERROR', 'Cannot post task on Clickup: CWM Ticket ID: ' + JSONData.id, messageLog);

        }
    } else {
        messageLog = messageLog + '\n\n' + nlapiDateToString(new Date(), 'datetime') + ': ERROR: Skipping creation of CU Task, Task already exists in Clickup Log for Ticket ID: ' + ticketId;
        updateLog(logRecordId, INTEGRATION_STATUS_REJECTED, messageLog, '', '', '');
    }

    return destinationId;

}

function getCompanyType(companyId){
    var JSONData = getJSONData('company/companies/'+companyId, 1, 1000, 1, null, null, null, CW_ACCOUNT_ID);

    var customerTypes = [];
    if(JSONData){
        for(var i = 0; i < JSONData.types.length; i++){
            customerTypes.push(JSONData.types[i].name);
        }
    }

    nlapiLogExecution("DEBUG", "Customer Types",  customerTypes);

    return customerTypes.join(", ");
}

function getCWMemberIdByIdentifier(identifier) {
    var returnMemberId = '';

    try {
        var memberJSONData = getJSONData('system/members/', 1, 1000, 1, null, null, null, CW_ACCOUNT_ID, '&conditions=identifier="'+identifier+'"&fields=id');
        if(memberJSONData) {
            nlapiLogExecution('AUDIT', 'MEMBER JSON DATA', JSON.stringify(memberJSONData));
            returnMemberId = memberJSONData[0].id;
        }
    } catch (err) {
        nlapiLogExecution('ERROR','Could not get id of member on CWM for identifier: ' + identifier, err);
    }
    return returnMemberId;
}

function getCUHeaderSettings(additionalHeaders, isBinary)
{
    var returnHeader;
    if(isBinary == true) {
        returnHeader = {
            "Authorization": CU_AUTH_ACCESS_TOKEN,
            "Accept": "*/*",
            "Content-Type": "multipart/form-data",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br"
        };
    } else {
        returnHeader = {
            "Authorization": CU_AUTH_ACCESS_TOKEN,
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br" };
    }

    // if(isBinary == true) {
    //     returnHeader["Content-Type"] = "multipart/form-data";
    // } else {
    //     returnHeader["Content-Type"] = "application/json";
    // }

    //add additional parameters - optional, used on POST calls
    if(additionalHeaders) {
        for(var name in additionalHeaders) {
            returnHeader[name] = additionalHeaders[name];
            nlapiLogExecution('DEBUG', 'Additional Header Name', name);
            var value = additionalHeaders[name];
            nlapiLogExecution('DEBUG', 'Additional Header Value', value);
        }
    }
    //nlapiLogExecution('DEBUG', 'Header', returnHeader.Authorization );
    return returnHeader;
}
function updateLog(logRecordId, status, messageLog, destinationId, outboundPayload, destinationURL, webhookGUID, result) {
    var newMessageLog = '';

    try {
        var logRecord = nlapiLoadRecord('customrecord_ctc_oip_runlog', logRecordId);
        if(logRecord) {
            var currentMessage = logRecord.getFieldValue('custrecord_ctc_oip_messagelog');
            newMessageLog = currentMessage + '\n' + messageLog;
            logRecord.setFieldValue('custrecord_ctc_oip_messagelog', newMessageLog);
            logRecord.setFieldValue('custrecord_ctc_oip_status', status);

            if(destinationId != '' && destinationId != null)
                logRecord.setFieldValue('custrecord_ctc_oip_destination_id', destinationId);

            if(outboundPayload != '' && outboundPayload != null)
                logRecord.setFieldValue('custrecord_ctc_oip_outboundpayload', outboundPayload);

            if(destinationURL != '' && destinationURL != null)
                logRecord.setFieldValue('custrecord_ctc_oip_destination_url', destinationURL);

            if(webhookGUID != '' && webhookGUID != null)
                logRecord.setFieldValue('custrecord_ctc_oip_webhook_guid', webhookGUID);

            if(result != '' && result != null)
                logRecord.setFieldValue('custrecord_ctc_oip_result', result);
            nlapiSubmitRecord(logRecord, true,true);
        }

    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not update integration log: ', err);
    }
}
function createLog(JSONPayloadString, origin, status, httpMethod, action, destination, originLastUpdated, originId, destinationId, messageLog, recordType, result, userName, userId, originURL, webhookGUID) {
    var logRecordId;

    try {
        var logRecord = nlapiCreateRecord('customrecord_ctc_oip_runlog');
        logRecord.setFieldValue('custrecord_ctc_oip_payload', JSONPayloadString);
        logRecord.setFieldValue('custrecord_ctc_oip_origin', origin);
        logRecord.setFieldValue('custrecord_ctc_oip_status', status);
        logRecord.setFieldValue('custrecord_ctc_oip_httpmethod', httpMethod);
        logRecord.setFieldValue('custrecord_ctc_oip_action', action);
        logRecord.setFieldValue('custrecord_ctc_oip_destination', destination);
        logRecord.setFieldValue('custrecord_ctc_oip_origin_lastupdated', originLastUpdated);
        logRecord.setFieldValue('custrecord_ctc_oip_origin_id', originId);
        logRecord.setFieldValue('custrecord_ctc_oip_destination_id', destinationId);
        logRecord.setFieldValue('custrecord_ctc_oip_messagelog', messageLog);
        logRecord.setFieldValue('custrecord_ctc_oip_recordtype', recordType);
        logRecord.setFieldValue('custrecord_ctc_oip_result', result);
        if(userName && userName != '')
            logRecord.setFieldValue('custrecord_ctc_oip_triggeredby_name', userName);

        if(userId && userId != '')
            logRecord.setFieldValue('custrecord_ctc_oip_triggeredby_id', userId);

        if(originURL && originURL != '')
            logRecord.setFieldValue('custrecord_ctc_oip_origin_url', originURL);

        if(webhookGUID != '' && webhookGUID != null)
            logRecord.setFieldValue('custrecord_ctc_oip_webhook_guid', webhookGUID);

        logRecordId = nlapiSubmitRecord(logRecord, true, true);
    } catch (err) {
        nlapiLogExecution('ERROR', 'Could not create integration log: ', err);
    }

    return logRecordId;
}

//milliseconds to hours - to post back to CWM
function msToHMS( ms ) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;

    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours

    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute

    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;

    //alert( hours+":"+minutes+":"+seconds);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    var hms = hours+":"+minutes+":"+seconds;
    return hms;
}

function getCWMCompanyAndContactId(cwmContactEmail) {
    var returnObject = {};
    returnObject.contactid = '';
    returnObject.companyid = '';
    nlapiLogExecution('AUDIT', '*** Searcing for contact email on CWM: '+ + cwmContactEmail);
    if(cwmContactEmail) {
        try {
            var contactJSONData = getJSONData('company/contacts', 1, 1, 1, null, null, null, CW_ACCOUNT_ID, '&childconditions=communicationItems/value like "%' + cwmContactEmail + '%"');
            if(contactJSONData) {
                if(contactJSONData.length > 0) {
                    if(contactJSONData[0].company) {
                        returnObject.companyid = contactJSONData[0].company.id.toFixed(0);
                    }
                    if(contactJSONData[0].id) {
                        returnObject.contactid = contactJSONData[0].id.toFixed(0);
                    }

                }
            }
        } catch (err) {
            nlapiLogExecution('ERROR', 'Could not locate cwm contact email company id and contact id: ' + cwmContactEmail, err);
        }
    }

    return returnObject;
}

function checkCWMServiceTicketForTaskID(cuTaskId,cwAccountId) {
    var taskExists = false;
    try {
        var cwmTicketObject = getJSONData('service/tickets', 1, 1, 1, null, null, null, cwAccountId, '&customFieldConditions=caption="CU Task ID" AND value = "'+cuTaskId+'"');
        if(cwmTicketObject) {
            if(cwmTicketObject.length > 0) {
                taskExists = true;
                nlapiLogExecution('AUDIT', '**** TASK ID already exists on CWM ****');
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR','Cannot check cwm service ticket with cu task id: ' + cuTaskId, err);
    }
    return taskExists;
}

function getCUTaskIDfromCWMTicket(cwmTicketType, cwmTicketId){
    var cuTicketId = 0;
    try {
        var cwmTicketObject = getJSONData(cwmTicketType + '/tickets/'+cwmTicketId, 1, 1, 1, null, null, null, CW_ACCOUNT_ID);
        nlapiLogExecution("EMERGENCY", "CHECKIFCUTIMEIDEXISTS", JSON.stringify(cwmTicketObject));
        if(cwmTicketObject) {
            nlapiLogExecution("EMERGENCY", "getCUTaskIDfromCWMTicket - CWM TICKET OBJECT", JSON.stringify(cwmTicketObject));
            if(cwmTicketObject.customFields.length > 0){
                for(var i = 0; i < cwmTicketObject.customFields.length; i++){
                    var customFieldObject = cwmTicketObject.customFields[i];
                    if(customFieldObject.caption == "CU Task ID"){
                        cuTicketId = customFieldObject.value;
                    }
                }
            }
        }
    } catch (err) {
        nlapiLogExecution('ERROR','CU Task ID not found in CWM Ticket ' + cwmTicketId, err);
    }
    return cuTicketId;
}