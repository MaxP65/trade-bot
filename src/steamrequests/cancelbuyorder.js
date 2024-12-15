//https://steamcommunity.com/market/cancelbuyorder/
// sessionid: dd9eb0b627588419731cf64e
// buy_orderid: 5199728941

const request = require("./axiosrequest");

export function post(sessionid, orderid, callback) {
    const params = new URLSearchParams()
    params.append('sessionid', sessionid);
    params.append('buy_orderid', orderid);
    request.post("https://steamcommunity.com/market/cancelbuyorder/", false, params, {
        "X-Prototype-Version": 1.7,
        "X-Requested-With":	"XMLHttpRequest"
    }, (response=> {
        callback(response);
    }));
}