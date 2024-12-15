const request = require("./axiosrequest");
const getnameid = require("./getnameid");
const dayjs = require('dayjs');

export function get(nameid, options, hourSold, callback) {
    request.get('https://steamcommunity.com/market/itemordershistogram', true , {
        country: "RU",
        language: "english",
        currency: 5,
        item_nameid: nameid,
        two_factor: 0,
        norender: 1,
        }, (response) => {
            if(response != 'error') {


                const listingplace = Math.min(options.listingplace, Math.round(hourSold / 2.5));

                const buy_order_table = convertOrders(response.data.buy_order_table, options.myorder);
                const sell_order_table = convertOrders(response.data.sell_order_table, options.mylsting);

                const buy_price = calcMin(buy_order_table, 0.01, listingplace);
                const sell_price = calcMin(sell_order_table, -0.01, listingplace);
                const sell_price_fee = calcPriceWithFee(sell_price);

                const profit = calcProfit(buy_price, sell_price_fee);

                callback({
                    buy_price: round(buy_price),
                    sell_price,
                    sell_price_fee: round(sell_price_fee),
                    profit: floor(profit),
                    listingplace,
                    sell_order_table: convertOrders(response.data.sell_order_table),
                    buy_order_table: convertOrders(response.data.buy_order_table),
                });
            }
            else callback(response);
        }
    );
}

function calcMin(data, step, listingplace) {
    let result = 0;
    for (let index = 0; index < data.length; index++) {
        let count = 0;
        for (let prev = 0; prev < index + 1; prev++) {
            count += data[prev].count;
        }
        if(count >= listingplace) {
            return data[index].price + step;
        }
    }
    return result;
}

function convertOrders(input, myorder) {
    let temp = [];
    for (let i = 0; i < input.length; i++) {
        const element = input[i];
        temp.push({
            price: parseFloat(element.price.replace(',','.')),
            count: parseInt(element.quantity.replace(',',''))
        })
        if(myorder != undefined) {
            if(temp[i].price == myorder.price) {
                temp[i].count -= myorder.count;
                console.log(-myorder.count);
            }
        }
    }
    return temp;
}

function calcProfit(buy_price, sell_price) {
    if(buy_price > buy_price) {
        return -(1 - (buy_price / buy_price));
    }   else  {
        return 1 - (buy_price / sell_price);
    }
}

function round(number){
    return Math.round(parseFloat(number) * 100) / 100;
}

function floor(number){
    return Math.floor(parseFloat(number) * 100) / 100;
}

function calcPriceWithFee(input) {
    return Math.floor((input / 1.15) * 100) / 100 + 0.01;
}