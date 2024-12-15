const steampagerequest = require('./steampagerequest');
const database = require('../database/database');
const analyzeitem = require('./analyzeitem');
const getuserlistings = require('../steamrequests/getuserlistings');
const getlistings = require('../steamrequests/getlistings');

var listings;

let sessionid;
let config; 
var finished;



export function recalculate(cursession, options, callback) {
    listings = database.GetListings({query: {active: true}});
    sessionid = cursession;
    config = options;
    finished = callback;
    if(listings.length > 0) {
        processListing(0);
    } else {
        finished({finished: true});
    }
}

function processListing(i) {
    const listing = listings[i];
    if(parseInt(listing.time) < 3) {
        database.UpdateListingColumn(listing.ID, 'time', parseInt(listing.time) + 1);
        Next(i, 10);
    } else {
        steampagerequest.cancelListing(sessionid, listing.listingid, (result) => {
            database.UpdateListing(listing.ID, listing.price, false);
            database.UpdateListingColumn(listing.ID, 'buy_price', 0);

            Next(i, config.time_steamdelay);
        })
    }
}

function Next(id, delay) {
    if(listings.length - 1 > id) {
        setTimeout(function() {
            processListing(id + 1);
        }, delay);
    } else {
        finished({finished: true});
    }
}