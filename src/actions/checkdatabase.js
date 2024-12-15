const searchitems = require('../steamrequests/searchitems');
const config = require('../config/config');

export function check() {
    config.getDatabaseConfig((result) => {
        searchitems.call(result, response);
    })
}

function response(data) {
    console.log(data);
}