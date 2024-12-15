//https://steamcommunity.com/market/createbuyorder/
//  sessionid: dd9eb0b627588419731cf64e
// currency: 5
// appid: 730
// market_hash_name: R8 Revolver | Bone Mask (Field-Tested)
// price_total: 4
// quantity: 1
// billing_state: 
// save_my_address: 0
//Response {"success":1,"buy_orderid":"5199674353"}

const request = require("./axiosrequest");

export function post(sessionid, market_hash_name, price, count, callback) {
    const params = new URLSearchParams()
    params.append('sessionid', sessionid);
    params.append('currency', 5);
    params.append('appid', 730);
    params.append('market_hash_name', market_hash_name);
    params.append('price_total', Math.round(price));
    params.append('quantity', count);
    params.append('billing_state', "");
    params.append('save_my_address', 0);
    console.log(params);
    request.post("https://steamcommunity.com/market/createbuyorder/", false, params, {}, (response => {
        callback(response);
    }));
}