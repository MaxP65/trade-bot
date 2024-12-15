const request = require("./axiosrequest");
const DELIMITER_START = '<span id="marketWalletBalanceAmount">';
const DELIMITER_END = '</span>';

export function get(callback) {
    // request.get('https://store.steampowered.com/account/',false, {}, (response) => {
    //     let temp = response.data.substr(response.data.indexOf(DELIMITER_START) + DELIMITER_START.length);
    //     let start = response.data.indexOf(DELIMITER_START) + DELIMITER_START.length;
    //     let data = response.data.slice(start, start + temp.indexOf(DELIMITER_END));
    //     data = data.replace(/\s/g, '');
    //     callback(data);
    // })

    request.get('https://steamcommunity.com/market/',false, {}, (response) => {
        let temp = response.data.substr(response.data.indexOf(DELIMITER_START) + DELIMITER_START.length);
        let start = response.data.indexOf(DELIMITER_START) + DELIMITER_START.length;
        let data = response.data.slice(start, start + temp.indexOf(DELIMITER_END));
        data = data.replace(/\s/g, '');
        callback(parseFloat(data.replace(',','.')));
    })
}