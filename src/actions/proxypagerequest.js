export function search(config, callback) {
    let params = {
        type: 'proxyWebRequest',
        payload: {
            action: "Search",
            config
        }
    }
    sendMessage(params, callback);
}

export function listings(name, days, callback) {
    let params = {
        type: 'proxyWebRequest',
        payload: {
            action: "Listings",
            name,
            days
        }
    }
    sendMessage(params, callback);
}

function sendMessage(object, callback) {
    chrome.tabs.query({url: "https://thingproxy.freeboard.io/*"}, function (tabs) {
        if (tabs.length != 0) {
            chrome.tabs.sendMessage(tabs[0].id, object).then((response) => {callback(response)});
        }
    });
}