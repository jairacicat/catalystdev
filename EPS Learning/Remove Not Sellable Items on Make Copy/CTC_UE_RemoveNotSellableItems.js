/**
 * Project Number: EPS Learning
 * Script Name: CTC | Remove Not Sellable Items UE
 * Author: jaira@nscatalyst.com
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @Description Removes not sellable items from Sales Orders/Quotes/Opportunities when copied.
 *
 * CHANGELOGS
 *
 * Version      Date                        Author                                  Remarks
 * 1.00         06.26.2024                  jaira@nscatalyst.com                    Initial Build
 * 2.00         07.04.2024                  jaira@nscatalyst.com                    Updates after script review (removed Catalyst copyright, refactor script etc)
 */

define(['N/search', 'N/ui/message'],
    function(search, message) {

        const FLD_NOT_SELLABLE = "custitem_nscat_not_saleable";

        /**
         * Handles the beforeLoad event; executes operations when a record is copied.
         * Removes not sellable items from the record.
         * @param {Object} context - The context in which the script is executed.
         */
        function beforeLoad(context) {
            try {
                if (context.type === context.UserEventType.COPY) {
                
                    const currentRecord = context.newRecord;
                    const itemIds = getLineItemIds(currentRecord, 'item');
                    const notSellableItems = getNotSellableItems(itemIds);

                    removeNotSellableItems(currentRecord, itemIds, notSellableItems);

                    if (Object.keys(notSellableItems).length > 0) {
                        displayRemovalMessage(context, notSellableItems);
                    }
                }     
            } catch (o_exception) {
                log.error('catch', 'Error in removing Not Sellable Items:' + o_exception);
            }
        }

        /**
         * Retrieves item IDs from the specified sublist in a record.
         * @param {Object} record - The NetSuite record being processed.
         * @param {String} sublistId - The ID of the sublist from which to retrieve item IDs.
         * @returns {Array} A list of item IDs.
         */
        function getLineItemIds(record, sublistId) {
            const lineCount = record.getLineCount({ sublistId });
            const itemIds = [];

            for (let i = 0; i < lineCount; i++) {
                itemIds.push(record.getSublistValue({ sublistId, fieldId: 'item', line: i }));
            }

            return itemIds;
        }

        /**
         * Searches for items that are marked as not sellable.
         * @param {Array} itemIds - List of item IDs to search against.
         * @returns {Object} A dictionary of not sellable item IDs and their descriptions.
         */
        function getNotSellableItems(itemIds) {
            const notSellableItems = {};
            const itemSearch = search.create({
                type: "item",
                filters: [
                    [FLD_NOT_SELLABLE, "is", "T"],
                    "AND",
                    ["internalid", "anyof", itemIds]
                ],
                columns: [
                    "itemid",
                    "displayname"
                ]
            });

            itemSearch.run().each(function (result) {
                const itemId = result.id;
                const itemName = result.getValue('itemid');
                const displayName = result.getValue('displayname');
                notSellableItems[itemId] = `${itemName} - ${displayName}`;
                return true;
            });

            return notSellableItems;
        }

        /**
         * Removes not sellable items from the item sublist in the record.
         * @param {Object} record - The record from which items are to be removed.
         * @param {Array} itemIds - List of all item IDs in the record's item sublist.
         * @param {Object} notSellableItems - Dictionary of not sellable item IDs.
         */
        function removeNotSellableItems(record, itemIds, notSellableItems) {
            for (let i = record.getLineCount({ sublistId: 'item' }) - 1; i >= 0; i--) {
                if (itemIds[i] in notSellableItems) {
                    record.removeLine({ sublistId: 'item', line: i, ignoreRecalc: true });
                }
            }
        }

        /**
         * Displays a message on the form indicating which items have been removed.
         * @param {Object} context - The script context, used to access the form object.
         * @param {Object} notSellableItems - Dictionary of not sellable item IDs and descriptions.
         */
        function displayRemovalMessage(context, notSellableItems) {
            const messageObj = message.create({
                type: message.Type.INFORMATION,
                title: "Not Sellable Items Removed",
                message: "The following items have been removed from the Items list: <br /><br />" + Object.values(notSellableItems).join("<br />"),
                duration: 5000
            });

            context.form.addPageInitMessage({ message: messageObj });
        }

        return {
            beforeLoad: beforeLoad
        };
    });
