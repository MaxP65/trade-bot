const request = require("./axiosrequest");

export function post(sessionid, assetid, amount, price, callback) {
    const params = new URLSearchParams()
    params.append('sessionid', sessionid);
    params.append('appid', 730);
    params.append('contextid', 2);
    params.append('assetid', assetid);
    params.append('amount', amount);
    params.append('price', price);
    request.post("https://steamcommunity.com/market/sellitem/", false, params, {}, (response=> {
        callback(response);
    }));
}