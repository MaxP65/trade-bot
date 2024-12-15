const searchitems = require('../steamrequests/searchitems');
const database = require('../database/database');

export function load(config) {
    addItems(config)
}

function addItems(config) {
    searchitems.call(config, (data) => {
        const items = data.results;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if(database.GetItemByColumn('name', item.hash_name).length == 0) {
                console.log("New item " + item.hash_name);
                database.AddItem({
                    name: item.hash_name,
                    avgPrice: item.sell_price_text,
                    profit: 0,
                    soldHour: 0,
                    buy_count: 1,
                    buy: true,
                    sell: true,
                    active: false,
                })
            }
        }
        let newconfig = Object.assign({}, config);
        newconfig.start_at = parseInt(newconfig.start_at);
        newconfig.start_at += items.length;
        newconfig.max_items -= items.length;
        if(newconfig.max_items > 0) {
            setTimeout(function() {
                addItems(newconfig);
            }, 200);
        }
    });
}