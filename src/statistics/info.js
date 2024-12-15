const getuserbalance = require('../steamrequests/getuserbalance');
const database = require('../database/database');
const getuserlistings = require('../steamrequests/getuserlistings')

// chrome.runtime.sendMessage("mpcjkjidolcbckhcilgngcgidiabmpcf", { /* whatever you want to send goes here */ },
//     response => {
//          console.log(response);
//     }
// );

export function stats(callback) {
    getuserbalance.get((balance) => {
        getuserlistings.get(true, (listings) => {
            const _ordersSum = ordersSum();
            const _listingsSum = listingsSum(listings); 
            //const totalProfit = profitSum();
            callback({
                balance,
                ordersSum: round(_ordersSum),
                ordersCount: database.GetOrders({query: {active: true}}).length,
                listingsSum: round(_listingsSum),
                listingsCount: listings.length
                //totalProfit: round(totalProfit)
            })
        })
    })
}

export function profit(callback) {
    const totalProfit = profitSum();
    const tradesCount = database.GetTrades({}).length;
    const tdProfit = todayProfit();

    callback({
        totalProfit: round(totalProfit),
        tradesCount,
        avgProfit: round(totalProfit / tradesCount),
        todayProfit: round(tdProfit.sum),
        todayCount: tdProfit.count,
    })
}

export function orders(callback) {

}

export function listings(callback) {

}

export function inventory(callback) {

}

//     steampagerequest.getUserInventory(steamid, (response) => {
//         for (let i = 0; i < response.assets.length; i++) {
//             const asset = response.assets[i];
//             if(database.GetNonsell(asset.assetid).length == 0) {
//                 let name = getName(asset.classid, response.descriptions)
//                 console.log("TRADABLE", name);

function round(number){
    return Math.round(parseFloat(number) * 100) / 100;
}

function ordersSum() {
    let orders = database.GetOrders({query: {active: true}});
    let sum = 0;
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        sum += order.price * order.buy_count;
    }
    return sum;
}

function listingsSum(listings) {
    let sum = 0;
    for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        sum += listing.price;
    }
    return sum;
}

function todayProfit() {
    let now = new Date();
    let start = new Date().setHours(0).setSeconds(0);

    let trades = database.GetTrades({});
    let sum = 0;
    let count = 0;
    for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        if(trade.time > start && trade.time <= now) {
            sum += trade.sell_price - trade.buy_price;
            count++;
        }
    }
    return { sum, count };
}

function profitSum() {
    let trades = database.GetTrades({});
    let sum = 0;
    for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        if(trade.buy_price)
            sum += trade.sell_price - trade.buy_price;
    }
    return sum;
}