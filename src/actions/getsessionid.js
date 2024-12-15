export function get(callback) {
    getCookies("https://steamcommunity.com", "sessionid", callback);
}

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}