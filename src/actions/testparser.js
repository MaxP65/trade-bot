const getlistings = require('../steamrequests/getlistings');
const database = require('../database/database');
var listings = {};
export function parse(config) {
    //listings = database.GetListings({query: {buy_price: ''}});
    //parseItem(0, config);
    if(listings['non'] != undefined)
        console.log(listings['non']);
}

const ids = [
    949,
    948,
    947,
    946,
    945,
    944,
    943,
    942,
    941,
    940
]

function parseItem(i, config) {
    const listing = database.GetListings({query: { ID: ids[i] }})[0];
    console.log(listing)
    const item = database.GetItemByColumn('name', listing.name)[0];
    getlistings.get(item.nameid, config, item.soldHour, (response) => {
        database.UpdateListingColumn(listing.ID, 'buy_price', response.buy_price);
        if(i < ids.length - 1)
            parseItem(i + 1, config);
    });
}