const axiosrequest = require('./axiosrequest')

export function get(callback) {
    axiosrequest.get('https://steamcommunity.com/market/myhistory', false, {
        start: 0,
        count: 10
    }, (response)=> {
        callback(response);
    })
}