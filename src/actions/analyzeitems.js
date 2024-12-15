const database = require('../database/database');
const analyzeitem = require('./analyzeitem');
const getlistings = require('../steamrequests/getlistings');

let items;
let config;
var finished;
var active;

export function analyze(activeonly, options, callback) {
    if(activeonly == true)
        items = database.GetItemByColumn('active', true);
    else 
        items = database.GetItemByColumn('buy', true);
    config = options;
    finished = callback;
    active = activeonly;
    if(items.length > 0)
        processItem(0);
    else 
        finished({finished: true});
}

function processItem(i) {
    const item = items[i];
    if(database.GetOrders({query: {'name': item.name}}).length == 0) {
        if(item.nameid != null) {
            getlistings.get(item.nameid, config, item.soldHour, (response) => {
                if(response != 'error') {
                    console.log(item.ID, item.name, response.profit, response.listingplace);
                    if(analyzeitem.estimate({ avgPrice: item.avgPrice, soldHour: item.soldHour, profit: response.profit }, config)) {
                        database.AddOrder({
                            name: item.name,
                            orderid: "1",
                            profit: response.profit,
                            price: response.buy_price,
                            buy_count: item.buy_count,
                            active: false
                        })
                    }
                    database.UpdateItem(item.ID, 'profit', response.profit);
                    if(active == false && response.profit >= 0 && item.soldHour > parseFloat(config.minsold)) {
                        database.UpdateItem(item.ID, 'active', true);
                    }
                }
                Next(i, config.time_proxydelay);
            })
        } else Next(i, 10);
    } else {
        Next(i, 10)
    }
}

function Next(i, delay) {
    if(items.length - 1 > i) {
        setTimeout(function() {
            processItem(i + 1);
        }, delay);
    } else {
        finished({finished: true});
    }
}