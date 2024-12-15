const database = require('../database/database');
const getuserlistings = require('../steamrequests/getuserlistings');

function ids(listings) {
    let temp = [];
    for (var listing of Object.keys(listings)) {
        const listingObj = listings[listing];
        temp.push(getId(listingObj));
    }
    return temp;
}

function getId(listing) {
    let id = listing.actions[0].link;
    let start = id.indexOf("%20M") + 4;
    return id.slice(start, start + id.substr(start).indexOf("A%"));
}

export function find(callback) {
    getuserlistings.get(false, (result) => {
        let idsarray = ids(result);

        let listings = database.GetListings({query: {active: true}});

        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];
            if(idsarray.indexOf(listing.listingid) == -1) {
                database.DeleteListing(listing.ID);
                database.AddTrade({
                    name: listing.name,
                    time: new Date(),
                    buy_price: listing.buy_price,
                    sell_price: listing.price
                });
            }
        }

        callback({finished: true});
    });
}