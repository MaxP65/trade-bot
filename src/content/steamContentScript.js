'use strict';

// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

console.log("Trade Bot Content Script Connected");

const sellitem = require('../steamrequests/sellitem');
const cancellisting = require('../steamrequests/cancellisting');
const createbuyorder = require('../steamrequests/createbuyorder');
const cancelbuyorder = require('../steamrequests/cancelbuyorder');
const getuserbalance = require('../steamrequests/getuserbalance');
const getuserinventory = require('../steamrequests/getuserinventory');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.type === 'steamWebRequest') {
        switch(request.payload.action) {
            case "SellItem":
                sellitem.post(request.payload.sessionid, request.payload.assetid, request.payload.count, request.payload.price, (response) => {
                    sendResponse(response);
                });
                break;
            case "CreateBuyOrder":
                createbuyorder.post(request.payload.sessionid, request.payload.name, request.payload.price, request.payload.count, (response) => {
                    sendResponse(response);
                });
                break;
            case "CancelListing":
                cancellisting.post(request.payload.sessionid, request.payload.listingid, (response) => {
                    sendResponse(response);
                });
                break;
            case "CancelBuyOrder":
                cancelbuyorder.post(request.payload.sessionid, request.payload.orderid, (response) => {
                    sendResponse(response);
                });
                break;
            case "Balance":
                getuserbalance.get((response) => {
                    console.log(response);
                    sendResponse(response);
                });
                break;
            case "Inventory":
                getuserinventory.get(request.payload.steamid, (response) => {
                    sendResponse(response);
                });
                break;
            case "Reload":
                document.location.reload();
                sendResponse({success: 1});
                break;
        }
    }
    return true;
 })
