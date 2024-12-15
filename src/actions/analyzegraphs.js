const database = require('../database/database');
const getgraphinfo = require('../steamrequests/getgraphinfo');

let itemsCount;

let finished;

export function analyze(startat, count, options, callback) {
    itemsCount = startat + count;
    analyzeItem(startat, options);
    finished = callback;
}

function analyzeItem(id, options) {
    const item = database.GetItem(id)[0];
    if(item.buy == true && database.GetOrders({query: {name: item.name}}).length == 0) {
        getgraphinfo.get(item.name, options, (graph) => {
            if(graph != 'error') {
                database.UpdateItem(item.ID, 'soldHour', graph.soldHour);
                database.UpdateItem(item.ID, 'avgPrice', graph.avgPrice);
                database.UpdateItem(item.ID, 'nameid', graph.nameid);

                console.log(item.ID, item.name, graph.avgPrice, options.time_proxydelay);
            }
            Next(id, options);
        })
    } 
    else Next(id, options);
}

function Next(id, options) {
    if(itemsCount - 1 > id) {
        setTimeout(function() {
            analyzeItem(id + 1, options);
        }, 400);
    } else {
        finished({finished: true});
    }
}