const steampagerequest = require('./steampagerequest');
const database = require('../database/database');
const analyzeitem = require('./analyzeitem');
const getlistings = require('../steamrequests/getlistings');

let orders;
let tempconfig;
let count; 
let sessionid;

var finished;
var maxordersprice;
var ordersprice = 0;

export function process(cursession, config, callback) {
    steampagerequest.getUserBalance((userbalance) => {
        orders = database.GetOrders({query: { active: false }, sort: [["profit", "DESC"]]});
        console.log(userbalance);
        count = 0;
        tempconfig = config;
        sessionid = cursession;
        finished = callback;
        ordersprice = 0;
        maxordersprice = userbalance * config.maxorderspercent / 100;
        processOrder(0);
    })
}

function processOrder(id) {
    const order = orders[id];
    const item = database.GetItemByColumn('name', order.name)[0];

    getlistings.get(item.nameid, tempconfig, item.soldHour, (response) => {
        if(analyzeitem.estimate({ avgPrice: item.avgPrice, soldHour: item.soldHour, profit: response.profit }, tempconfig))  {
            if(ordersprice < maxordersprice) {
                steampagerequest.createBuyOrder(sessionid, order.name, response.buy_price * 100 * parseInt(order.buy_count), order.buy_count, (result) => {
                    console.log(result);
                    if(result.data.success == 1) {
                        ordersprice += response.buy_price * parseInt(order.buy_count);
                        count++;
                        database.UpdateOrder(order.ID, result.data.buy_orderid, response.buy_price, true);
                    }
                });
            } else {
                console.log("Balance Limit");
            }
        } else {
            console.log("Rejected");
        }
    })

    if(id < orders.length - 1) {
        setTimeout(function() {
            processOrder(id + 1);
        }, tempconfig.time_steamdelay);
    } else {
        finished({finished: true, count: count});
    }
}