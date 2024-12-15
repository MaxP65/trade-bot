const request = require("./axiosrequest");

export function get(steamid, callback) {
    request.get("https://steamcommunity.com/inventory/"+steamid+"/730/2",false, {}, (response) => {
        callback({ descriptions: response.data.descriptions, assets: response.data.assets});
    })
}