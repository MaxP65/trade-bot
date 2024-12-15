const bot_config = require('./bot.json');
const database_config = require('./database.json');
const trading_config = require('./trading.json');

function setStorage(options) {
    chrome.storage.sync.set(options, function() {
    })
}

export function getBotConfig(callback) {
    chrome.storage.sync.get(['bot_config'], function(result) {
        if(result.bot_config) {
            callback(result.bot_config);
        } else {
            callback(bot_config);
        }
    });
}

export function resetBotConfig() {
    setStorage({bot_config: bot_config});
    return bot_config;
}

export function setBotConfig(newvalue) {
    setStorage({bot_config: newvalue});
}

export function getDatabaseConfig(callback) {
    chrome.storage.sync.get(['database_config'], function(result) {
        if(result.database_config) {
            callback(result.database_config);
        } else {
            callback(database_config);
        }
    });
}

export function resetDatabaseConfig() {
    setStorage({database_config: database_config });
    return database_config;
}

export function setDatabaseConfig(newvalue) {
    setStorage({database_config: newvalue });
}

export function getTradingConfig(callback) {
    chrome.storage.sync.get(['trading_config'], function(result) {
        if(result.trading_config) {
            callback(result.trading_config);
        } else {
            callback(trading_config);
        }
    });
}

export function resetTradingConfig() {
    setStorage({trading_config: trading_config});
    return trading_config;
}

export function setTradingConfig(newvalue) {
    setStorage({trading_config: newvalue});
}