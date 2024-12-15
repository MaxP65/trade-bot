const database = require('../database/database');
const getuserinventory = require('../steamrequests/getuserinventory');

export function fill(bot_config) {
    getuserinventory.get(bot_config.steamid, (response)=> {
        for (let index = 0; index < response.assets.length; index++) {
            const asset = response.assets[index];
            if(database.GetNonsell(asset.assetid).length == 0) {
                database.AddNonsell({
                    assetid: asset.assetid,
                    name: getName(asset.classid, response.descriptions)
                })
            }
        }
    });
}

function getName(classid, descriptions) {
    let result = "";
    descriptions.forEach(description => {
        if(description.classid == classid) result = description.market_hash_name;
    });
    return result;
}