const steampagerequest = require('./steampagerequest');
const database = require('../database/database');
const analyzeitem = require('./analyzeitem');
const getlistings = require('../steamrequests/getlistings');


let listings;
let tempconfig;
let sessionid;

var finished;

export function process(cursession, config, callback) {
    listings = database.GetListings({query: { active: false }});
    tempconfig = config;
    sessionid = cursession;
    finished = callback;
    if(listings.length > 0)
     processItem(0);
    else fillids();
}

function processItem(id) {
    const listing = listings[id];
    const item = database.GetItemByColumn('name', listing.name)[0];

    getlistings.get(item.nameid, tempconfig, item.soldHour, (response) => {
        let price = Math.max(listing.buy_price, response.sell_price_fee);
        console.log('selling', item.name);
        steampagerequest.sellItem(sessionid, listing.listingid, 1, Math.floor(price * 100), (result) => {
            if(result.data.success) {
                database.UpdateListing(listing.ID, price, true);
                if(listing.buy_price == 0) {
                    database.UpdateListingColumn(listing.ID, 'buy_price', response.buy_price);
                }
            }
        })
    });

    if(id < listings.length - 1) {
        setTimeout(function() {
            processItem(id + 1);
        }, tempconfig.time_steamdelay);
    } else {
        setTimeout(function() {
            fillids();
        }, tempconfig.time_steamdelay / 2)  
    }
}

const getuserlistings = require('../steamrequests/getuserlistings');

let ids;

function fillids() {
    ids = [];
    console.log('fill ids')
    getuserlistings.get(false, (listingsall) => {
        var listings = listingsall;
        for (var listing of Object.keys(listings)) {
            const listingObj = listings[listing];
            let id = getId(listingObj);
            if(database.GetListings({query: {listingid: id}}).length == 0)  {
                const listingsWithName = database.GetListings({query: {name: listingObj.market_hash_name}});
                if(listingsWithName.length > countNames(listingObj.market_hash_name)) {
                    console.log(listing, countNames(listingObj.market_hash_name), listingObj);
                    database.UpdateListingColumn(listingsWithName[countNames(listingObj.market_hash_name)].ID, 'listingid', id);
                    ids.push(listingObj.market_hash_name);
                }
            }
        }
        finished({finished: true});
    })
}

function getId(listing) {
    if(listing.actions != null) {
        let id = listing.actions[0].link;
        let start = id.indexOf("%20M") + 4;
        return id.slice(start, start + id.substr(start).indexOf("A%"));
    }
    return 0;
}

function countNames(name) {
    let result = 0;
    for (let i = 0; i < ids.length; i++) {
        if(ids[i] == name) result++;
    }
    return result;
}