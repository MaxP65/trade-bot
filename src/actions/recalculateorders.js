const steampagerequest = require('./steampagerequest');
const database = require('../database/database');
const analyzeitem = require('./analyzeitem');
const getlistings = require('../steamrequests/getlistings');

let orders;
let tempConfig;
let sessionid;
var finished;

var deletedOrders = {};

export function recalculate(config, cursession, callback) {
    orders = database.GetOrders({query: {active: true}});
    tempConfig = config;
    sessionid = cursession;
    finished = callback;
    if(orders.length > 0)
        processItem(0)
    else finished({finished: true, deleted: deletedOrders});
}   

function processItem(i) {
    const order = orders[i];
    const item = database.GetItemByColumn('name', order.name)[0];

    tempConfig['myorder'] = {
        price: order.price,
        count: order.buy_count
    }

    getlistings.get(item.nameid, tempConfig, item.soldHour, (response) => {
        if(response != 'error') {
            let place = calcPlace(order.price, response.buy_order_table, tempConfig.myorder);
            if(analyzeitem.estimate({ avgPrice: item.avgPrice, soldHour: item.soldHour, profit: response.profit }, tempConfig)) {
                if(place > tempConfig.listingplace) {
                    console.log("replace order", order.name, order.price, response.buy_price);
                    steampagerequest.cancelBuyOrder(sessionid, order.orderid, (result) => {
                        if(result.data.success) {
                            database.UpdateOrder(order.ID, "1", response.buy_price, false);
                        }
                    })
                    Next(i, tempConfig.time_steamdelay); //10000
                } else {
                    Next(i, tempConfig.time_proxydelay);
                    console.log("no need to replace order", order.name);
                }
            } else {
                console.log("non lickvid order", order.name, order.price);
                steampagerequest.cancelBuyOrder(sessionid, order.orderid, (result) => {
                    database.DeleteOrder(order.orderid);
                    deletedOrders[order.name] = order;
                })
                Next(i, tempConfig.time_steamdelay);
            }
        }
        else {
            Next(i, tempConfig.time_steamdelay);
        }
    })
}

function Next(id, delay) {
    if(orders.length - 1 > id) {
        setTimeout(function() {
            processItem(id + 1);
        }, delay);
    } else {
        finished({finished: true, deleted: deletedOrders});
    }
}


function calcPlace(price, table, myorder) {
    let result = 0;
    for (let i = 0; i < table.length; i++) {
        var element = table[i];
        if(element.price == myorder.price) element.count -= myorder.count;
        if(element.price >= price) {
            result += parseInt(element.count);
        }
    }
    return result;
}