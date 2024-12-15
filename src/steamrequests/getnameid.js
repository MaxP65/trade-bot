const request = require("./axiosrequest");
const DELIMITER_START = 'Market_LoadOrderSpread(';
const DELIMITER_END = ');';

export function get(appid, name, callback) {
    request.get('https://steamcommunity.com/market/listings/'+appid+'/'+name, true, {}, (response) => {
        callback(fromData(response.data));
    })
}

export function fromData(data) {
    let temp = data.substr(data.indexOf(DELIMITER_START) + DELIMITER_START.length);
    let start = data.indexOf(DELIMITER_START) + DELIMITER_START.length;
    let newdata = data.slice(start, start + temp.indexOf(DELIMITER_END));
    return newdata.replace(/\s/g, '');
}