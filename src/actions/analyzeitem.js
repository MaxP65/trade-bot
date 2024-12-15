//const itemordershistogram = require('../steamrequests/itemordershistogram');

export function estimate(data, config) {
    let doorder = true;
    if(data.profit * 100 < config.wantedpercent) doorder = false;
    if(data.soldHour < parseFloat(config.minsold)) doorder = false; 
    //let graphDifference = data.graphDifference * 100;
    //if(graphDifference < 0 &&  graphDifference < -config.maxshrink) doorder = false;
    //if(graphDifference > 0 &&  graphDifference > config.maxgrow) doorder = false;
    if(data.avgPrice < data.sell_price) doorder = false;
    return doorder;
}