const steampagerequest = require('./steampagerequest');
const database = require('../database/database');

let orders;
var sessionid;

export function remove(cursession, callback) {
    console.log("removing orders");
    orders = database.GetOrders({query: {active: true}});
    console.log(cursession);
    sessionid = cursession;
    removeOrder(0, callback);
}
function removeOrder(i, callback) {
    const order = orders[i];
    steampagerequest.cancelBuyOrder(sessionid, order.orderid, () => {
        if(i < orders.length - 1) {
            setTimeout(function() {
                removeOrder(i + 1, callback);
            }, 7500);
        } else {
            callback({ finished: true })
        //     database.ClearOrders();
        } 
    })
}