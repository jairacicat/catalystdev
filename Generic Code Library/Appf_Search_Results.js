/**
 *@NApiVersion 2.1
 */
/**
 * Script Name : Appf_Search_Results.js
 * Version    Date            Author           Remarks
 * 1.0        25/08/2023                       Library to get all the saved search results without any page size limit.
 */
define( [ 'N/search' ], ( search ) => {
    /**
     * @function getSearchResults
     * @Description Method to get all the saved search results without any page size limit.
     * @param {String} rectype - Search Type
     * @param {Array} fils - Search Filters
     * @param {Array} cols - Search Columns
     * @Module N/search
     * @returns {Array[Objects]} - Search Results
     */
    const getSearchResults = ( rectype, fils, cols ) => {
        let mySearch = search.create( {
            type: rectype,
            columns: cols,
            filters: fils
        } );
        let resultsList = [];
        let myPagedData = mySearch.runPaged( {
            pageSize: 1000
        } );
        myPagedData.pageRanges.forEach( ( pageRange ) => {
            let myPage = myPagedData.fetch( {
                index: pageRange.index
            } );
            myPage.data.forEach( ( result ) => {
                resultsList.push( result );
            } );
        } );
        return resultsList;
    };
    return {
        getSearchResults: getSearchResults
    };
} );