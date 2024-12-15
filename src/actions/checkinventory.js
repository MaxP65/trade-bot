const steampagerequest = require('./steampagerequest');
const database = require('../database/database')

export function check(steamid, deletedOrders, callback) {
    steampagerequest.getUserInventory(steamid, (response) => {
        let count = 0;
        for (let i = 0; i < response.assets.length; i++) {
            const asset = response.assets[i];
            if(count > 70) { 
                callback({finished: true});
                return;
            }
            if(database.GetNonsell(asset.assetid).length == 0) {
                let name = getName(asset.classid, response.descriptions)
                let order = database.GetOrders({query: {name: name}});
                var hasOrder = false;
                var item = database.GetItemByColumn('name', name)[0];
                if(item)
                if(item.buy == true) {
                    if(order.length != 0) {
                        order = order[0];
                        hasOrder = true;
                        console.log("TRADABLE", name);
                    }
                    else if(deletedOrders.hasOwnProperty(name)) {
                        console.log("TRADED From deleted", name);
                        hasOrder = true;
                        order = deletedOrders[name];
                    } else {
                        if(item.buy == true) {
                            console.log("TRADED NOT BY ORDER", name);
                            database.AddListing({
                                listingid: asset.assetid,
                                name,
                                price: 0,
                                buy_price: 0,
                                time: 0,
                                active: false
                            });
                        }
                    }
                    if(hasOrder == true) {
                        count++;
                        database.AddListing({
                            listingid: asset.assetid,
                            name,
                            price: order.price,
                            buy_price: order.price,
                            time: 0,
                            active: false
                        });
                        database.UpdateOrderColumn(order.ID, "buy_count", parseInt(order.buy_count) - 1);
                        if(parseInt(order.buy_count) == 1) {
                            const item = database.GetItemByColumn('name', order.name)[0];
                            database.UpdateItem(item.ID, 'buy_count', Math.min(parseInt(item.buy_count) + 1, 10));
                            database.UpdateOrder(order.ID, "1", order.price, false);
                            database.UpdateOrderColumn(order.ID, "buy_count", Math.min(parseInt(item.buy_count) + 1, 10));
                            console.log(database.GetOrders({query: {name: name}})[0]);
                        }
                    }
                }
            }
        }
        callback({finished: true});
    })
}

function getName(classid, descriptions) {
    let result = "";
    descriptions.forEach(description => {
        if(description.classid == classid) {
            result = description.market_hash_name;
        }
    });
    return result
}