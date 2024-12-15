// https://steamcommunity.com/market/mylistings?count=10

const request = require("./axiosrequest");

const listingsSeparator = 'market_recent_listing_row listing_';
const beforeId = 'listing_';
const afterId = "\"";

const price = {
    before: '(',
    after: " pуб.)"
}
const info = {
    before: "javascript:RemoveMarketListing(",
    after: ")"
}

export function get(convert, callback) {
    var result = [];
    if(convert == false) result = {};

    getPage(0, callback);

    function getPage(pageId, callback) {
        request.get("https://steamcommunity.com/market/mylistings",false, {
            start: pageId * 100,
            count: 100
        }, (response) => {
            if(convert == true) {
                var rows = response.data.results_html.split(listingsSeparator);
                rows.shift();
                for (let i = 0; i < rows.length; i++) {
                    rows[i] = getRowInfo(rows[i], response.data.assets);
                }
                result = result.concat(rows);
            } else {
                //console.log(pageId, ((response.data.total_count) / 100) - 1,  response.data.assets);
                console.log(response);
                result = { ...result, ...response.data.assets["730"][2]}
            }

            if(pageId < ((response.data.total_count) / 100) - 1) {
                setTimeout(() => {
                    getPage(pageId + 1, callback);
                }, 3000)
            } else {
                callback(result);
            }
        })
    }
}

function getRowInfo(data, assets) {
    function parse(input) {
        return parseInt(input.replace("'", ""));
    }

    function cut(input, separator) {
        const start = input.indexOf(separator.before) + separator.before.length;
        return input.slice(start, start + input.substr(start).indexOf(separator.after));
    }

    const resultInfo = cut(data, info).split(', ');
    const listingID = parse(resultInfo[1]);
    const contextID = parse(resultInfo[3]);
    const itemID = parse(resultInfo[4]);
    const listing = assets[resultInfo[2]][contextID][itemID];

    const resultPrice = parseFloat(cut(data, price).replace(',', '.'));

    return { 
        price: resultPrice,
        listingId: listingID,
        itemId: itemID,
        name: listing.market_hash_name 
    };
}