export function sellItem(sessionid, assetid, count, price, callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "SellItem",
            sessionid,
            assetid,
            count,
            price
        }
    }
    sendMessage(params, callback);
}

export function cancelListing(sessionid, listingid, callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "CancelListing",
            sessionid,
            listingid,
        }
    }
    sendMessage(params, callback);
}

export function createBuyOrder(sessionid, name, price, count, callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "CreateBuyOrder",
            sessionid,
            name,
            price: Math.round(price),
            count,
            price
        }
    }
    sendMessage(params, callback);
}

export function cancelBuyOrder(sessionid, orderid, callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "CancelBuyOrder",
            sessionid,
            orderid
        }
    }
    sendMessage(params, callback);
}

export function getUserBalance(callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "Balance",
        }
    }
    sendMessage(params, callback);
}

export function getUserInventory(steamid, callback) {
    let params = {
        type: 'steamWebRequest',
        payload: {
            action: "Inventory",
            steamid: steamid
        }
    }
    sendMessage(params, callback);
}

export function reloadPage(callback) {
    chrome.tabs.query({url: "https://steamcommunity.com/*"}, function (tabs) {
        chrome.tabs.reload(tabs[0].id, {} , (response) => {
            callback(response);
        })
    });
}

function sendMessage(object, callback) {
    try {
        chrome.tabs.query({url: "https://steamcommunity.com/*"}, function (tabs) {
            if (tabs.length != 0) {
                chrome.tabs.sendMessage(tabs[0].id, object).then((response) => {callback(response)});
            }
        });
    } catch (er) {
        console.error(er);
        callback({error: er, assets: []})
    }
}