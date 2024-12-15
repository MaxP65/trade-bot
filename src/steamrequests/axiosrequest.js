let axios = require("axios");
const retry = require('retry-axios');

const raxConfig = {
    backoffType: 'exponential',
    onRetryAttempt: (err) => {
      const cfg = rax.getConfig(err);
      const status = err.response.status;
      console.log(`🔄 [${status}] Retry attempt #${cfg.currentRetryAttempt}`);
    }
}

//https://api.codetabs.com/v1/proxy/
// https://thingproxy.freeboard.io/fetch/"

const proxy = "https://thingproxy.freeboard.io/fetch/";

const defaultOptions = {
    withCredentials: true,
    credentials: 'steamCurrencyId=5; steamCountry=RU%7Cf8b2e0ff6fa74586d6c8a061dbbf6ccf',
    crossdomain: true,
    raxConfig
}

const defaultOptionPost = {
    withCredentials: true,
    raxConfig
}

const defaultHeaders = {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
}

function getproxy(input) {
    return input == true ? proxy : "";
}

export function get(url, useproxy, params, callback) {
    getwithheaders(url, useproxy, {} , params, callback);
}

export function getwithheaders(url, useproxy, headers, params, callback) {
    axios.get((getproxy(useproxy) + url), {
        ...defaultOptions,
        headers: {
            ...headers,
        },
        params,
    }).then((response) => {
        callback(response);
    }).catch(error => {
        console.log(error);
        callback('error'); 
    });
}

export function post(url, useproxy, data, additiveHeaders, callback) {
    axios.post((getproxy(useproxy) + url),
    data, {
        ...defaultOptionPost,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-KL-Ajax-Request': 'Ajax_Request',
            ...additiveHeaders
        }
    }).then((response) => {
        callback(response);
    });
}