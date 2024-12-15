const dayjs = require('dayjs');
const request = require('./axiosrequest');
const getnameid = require('./getnameid')

export function get(name, options, callback) {
    const TODAY = dayjs(Date.now()).format('MMM DD YYYY');
    const START = dayjs(Date.now() - (options.days * 3600 * 24 * 1000)).format('MMM DD YYYY');

    request.getwithheaders("https://steamcommunity.com/market/listings/"+730+"/"+name,true,{ 'Content-Type': 'html', 'Access-Control-Allow-Origin': '*'}, { }, (response) => {
        if(response != 'error') {
            let startAt = response.data.indexOf(START) - 2;
            let temp = response.data.substr(startAt);
            let endAt = temp.lastIndexOf(TODAY);
            let temp_last = temp.substr(endAt);
            endAt += temp_last.indexOf("]") + 1;
            let data = response.data.slice(startAt, startAt + endAt);
            data = JSON.parse("[" + data + "]");

            const nameid = getnameid.fromData(response.data);
            const avgPrice = averagePrice(data, options.convert)
            const sold = countSold(data);
            const sold_per_hour = soldPerHour(sold, options.days);
            
            callback({
                graph: data,
                nameid,
                avgPrice: round(avgPrice),
                sold,
                soldHour: round(sold_per_hour)
            });
        }
        else callback(response);
    })
}

function round(number){
    return Math.round(parseFloat(number) * 100) / 100;
}

function averagePrice(data, rate) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        count += data[i][1];
    }
    return count * rate / data.length;
}

function countSold(data) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        count += parseInt(data[i][2]);
    }
    return count;
}

function soldPerHour(sold, days) {
    return (sold / (days * 24 + new Date().getHours()));
}

function calcDifference(data) {
    let first = data[0][1]; 
    let last = data[data.length - 1][1];
    if(last > first) {
        return -(1 - (last / first));
    } else {
        return 1 - (first / last);
    }
}