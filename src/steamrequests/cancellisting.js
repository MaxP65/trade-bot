const request = require("./axiosrequest");

export function post(sessionid, listingid, callback) {
    const params = new URLSearchParams()
    params.append('sessionid', sessionid);
    request.post("https://steamcommunity.com/market/removelisting/" + listingid, false, params, {
        "X-Prototype-Version": 1.7,
        "X-Requested-With":	"XMLHttpRequest"
    }, (response=> {
        callback(response);
    }));
}