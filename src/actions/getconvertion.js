const request = require("../steamrequests/axiosrequest");
const axios = require("axios");
const nameid = 176012375;
const ruble = 5;
const dollar = 1;

export function get() {

    var myHeaders = new Headers();
    myHeaders.append("apikey", "2hBmxrC5W5jtZeyx4q4dzOa2OuqKi3rX");

    const options = {
        method: 'GET',
        url: 'https://api.apilayer.com/currency_data/convert',
        params: { from: 'USD', to: 'RUB', amount: '1'},
        headers: {
            "apikey": "2hBmxrC5W5jtZeyx4q4dzOa2OuqKi3rX"
        }
    };
      
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });

    // var options = {
    //     country: "RU",
    //     language: "english",
    //     currency: ruble,
    //     item_nameid: nameid,
    //     two_factor: 0,
    //     norender: 1,
    // }
    // request.get('https://steamcommunity.com/market/itemordershistogram', true , options, (response1) => {
    //     options.currency = dollar;
    //     console.log(response1.data.sell_order_table);
    //     request.get('https://steamcommunity.com/market/itemordershistogram', true , options, (response2) => {
    //         console.log(response2.data.sell_order_table);
    //         for (let i = 0; i < 6; i++) {
    //             const element1 = parseFloat(response1.data.sell_order_table[i].price.replace(',', '.'));
    //             const element2 = parseFloat(response2.data.sell_order_table[i].price.replace('$', ''));

    //             console.log(element1 / element2);
    //         }
    //     });
    // });
}