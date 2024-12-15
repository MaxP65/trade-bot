'use strict';

console.log("Trade Bot Proxy Content Script Connected");

const searchitems = require('../steamrequests/searchitems');
const getlistings = require('../steamrequests/getlistings');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.type === 'proxyWebRequest') {
        switch(request.payload.action) {
            case "Search":
                searchitems.call(request.payload.config, (response) => {
                    sendResponse(response);
                });
                break;
            case "Listings":
                getlistings.get(request.payload.name, request.payload.days, (response) => {
                    sendResponse(response);
                });
                break;
        }
    }
    return true;
 })