'use strict';

const items = require('./items');

const database = require('./database/database');
const configManager = require('./config/config');
const getsessionid = require('./actions/getsessionid');
const steampagerequest = require('./actions/steampagerequest');

const analyzegraphs = require('./actions/analyzegraphs');
const analyzeitems = require('./actions/analyzeitems');
const processbuyorders = require('./actions/processbuyorders');
const recalculateorders = require('./actions/recalculateorders');
const removeallorders = require('./actions/removeallorders')

const checkinventory = require('./actions/checkinventory');
const processlistings = require('./actions/processlistings');
const recalculatelistings = require('./actions/recalculatelistings');
const findsold = require('./actions/findsold');

const info = require('./statistics/info');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'BOT') {
        if(request.payload.command == "START") {
            StartBot(request.payload.argument);
        }
        else if(request.payload.command == "STOP") {
            StopBot();
        }
        else if(request.payload.command == "STATE") {
            sendResponse(active);
        }
        else if(request.payload.command == "INFO") {
            var result = {
                BotActive: active,
                CurrentTask: bot.state,
                PlacingNewOrders: placeNewOrders,
                TimeToOrderUpdite: (bot_config.time_updateorders - updateOrdersTimer)
            };

            sendResponse(result);
        } else if(request.payload.command == "REMOVEORDERS") {
            sendResponse({ Process: "Removing orders" });
            RemoveOrders(() => {});
        } else if(request.payload.command == "BALANCEINFO") {
            var result = {};
            info.stats((response) => {
                result = response;
                sendResponse(result);
            });
        }
        else if(request.payload.command == "BOTSTARTSTOP") {
            if(active == true) {
                sendResponse({ Process: "Stopping" });
                StopBot();
            } else {
                sendResponse({ Process: "Starting" });
                StartBot(false);
            }

        }
        else if(request.payload.command == "RELOADBOT") {
            sendResponse({ Reloaded: true });
            document.location.reload();
        }
        else if(request.payload.command == "TOGGLEORDERS") {
            placeNewOrders = !placeNewOrders;
            sendResponse({ PlacingNewOrders: placeNewOrders });
        }
    }
    return true;
});

let timer;
let active = false;
let placeNewOrders = true;

const bot = {
    state: 'idle',
    
    set State(newstate) {
        console.log(newstate);
        this.state = newstate;
    }
};

let canCheckInventory = true;

var bot_config = {};
var database_config = {};
var trading_config = {};

var tempDeletedOrders = {};

let updateOrdersTimer = 0;

GetConfings(() => {});

function StartBot(withRecalculation) {
    console.log(new Date().getHours() ,new Date().getMinutes(), new Date().getSeconds(), 'Bot Started');
    if(withRecalculation == true) {
        //CheckInventory((finished) => {
            UpdateOrders(() => {});
            updateOrdersTimer = 0;
        //});
    } else {
        if(database.GetOrders({}).length == 0) {
            //UpdateListings(() => {
                PlaceOrders();
            //});
        } else {
            ReloadSteamContent((result) => {
                CheckInventory(() => {});
            });
        }
    }
    active = true;
    timer = setInterval(() => Tick(), bot_config.time_checkinventory * 60000);
}

function ReloadSteamContent(callback) {
    bot.State = "Reloading Page";

    steampagerequest.reloadPage((response) => {
        setTimeout(function() {
            getsessionid.get((sessionid) => {
                bot_config.sessionid = sessionid;
                console.log(sessionid);
                callback(response);
            });
        }, 5000);
    })
}

function Tick() {
    const date = new Date();
    updateOrdersTimer += parseInt(bot_config.time_checkinventory);
    console.log('inventory check ' + canCheckInventory,updateOrdersTimer, date.getHours() , date.getMinutes());

    if(date.getHours() == trading_config.time_createorders.getHours() && trading_config.time_createorders.getMinutes() <= date.getMinutes() && date.getMinutes() < trading_config.time_createorders.getMinutes() + bot_config.time_checkinventory) {
        //UpdateListings(() => {
            UpdateOrders(() => {
                PlaceOrders();
            });
        //});
        updateOrdersTimer = 0;
    }
    else if(updateOrdersTimer >= bot_config.time_updateorders && date.getHours() != trading_config.time_createorders.getHours() - 1) {
        if(canCheckInventory) ReloadSteamContent((result) => {
            CheckInventory((finished) => {
                UpdateOrders(() => {});
                updateOrdersTimer = 0;
            });
        });
        else updateOrdersTimer -= parseInt(bot_config.time_checkinventory);
    }
    else if(canCheckInventory) {
        CheckInventory(() => {});
    }
}

function GetConfings(callback) {
    configManager.getBotConfig((bot) => {
        configManager.getDatabaseConfig((database) => {
            configManager.getTradingConfig((trading) => {
                getsessionid.get((sessionid) => {
                    updateOrdersTimer = 0;
                    bot_config = bot;
                    bot_config.sessionid = sessionid;
                    database_config = database;
                    trading_config = trading;
                    trading_config.time_steamdelay = trading_config.time_steamdelay * 1000;
                    trading_config.time_proxydelay = trading_config.time_proxydelay * 1000;
                    trading_config.time_createorders = new Date("Thu, 01 Jan 1970 " + bot_config.time_createorders + ":00");
                    callback();
                });
            });
        });
    });
}

function StopBot() {
    clearInterval(timer); 
    active = false;
    console.log('Bot Stopped');
}

function PlaceOrders() {
    bot.State = "Calculating Graphics";
    canCheckInventory = false;
    analyzegraphs.analyze(1, database.GetItemsCount(), trading_config, (result) => {
        bot.State = "Analyze items";
        analyzeitems.analyze(false, trading_config, (analyze) => {
            bot.State = "Placing Orders";
            processbuyorders.process(bot_config.sessionid, trading_config, (processresult) => {
                console.log("Orders Placed");
                bot.State = "Idle";
                canCheckInventory = true;
                database.DeleteOrders({active: false});
            });
        })
    });
}

function RemoveOrders(callback) {
    bot.State = "Removing orders";
    canCheckInventory = false;
    console.log(bot_config.sessionid);
    removeallorders.remove(bot_config.sessionid, (result) => {
        bot.State = "Idle";
        canCheckInventory = true;
        database.ClearOrders();
        callback();
    });
}

function CheckInventory(callback) {
    bot.State = "Checking Inventory";
    canCheckInventory = false;
    database.DeleteListings({active: false});

    checkinventory.check(bot_config.steamid, tempDeletedOrders, (result) => {
        bot.State =  "Selling Items";

        processlistings.process(bot_config.sessionid, trading_config, (processresult) => {
            if(database.GetOrders({query: {active: false}}).length == 0 || placeNewOrders == false) {
                canCheckInventory = true;
                bot.State =  "Idle";
                callback({finished: true});
                findsold.find((response) => {});
                return;
            }

            bot.State =  "Placing new orders";
            processbuyorders.process(bot_config.sessionid, trading_config, (processresult) => {
                console.log("Orders Placed");
                bot.State =  "Idle";
                canCheckInventory = true;
                database.DeleteOrders({active: false});
                callback({finished: true});
                findsold.find((response) => {});
            });
        })
    })
}

function UpdateOrders(callback) {
    canCheckInventory = false;
    bot.State = "Updating Orders";
    recalculateorders.recalculate(trading_config, bot_config.sessionid, (result) => {
        tempDeletedOrders = result.deleted;
        console.log('tempDeletedOrders', tempDeletedOrders);

        if(placeNewOrders == false) {
            canCheckInventory = true;
            bot.State =  "Idle";
            database.DeleteOrders({active: false});
            findsold.find((response) => {});
            callback();
            return;
        }

        bot.State = "Analyzing active";
        analyzeitems.analyze(true, trading_config, (analyzeresult) => {
            bot.State = "Placing new orders";
            processbuyorders.process(bot_config.sessionid, trading_config, (processresult) => {
                console.log("Orders Placed");
                bot.State = "Idle";
                database.DeleteOrders({active: false});
                canCheckInventory = true;
                findsold.find((response) => {});
                callback();
            });
        });
    })
}

function UpdateListings(callback) {
    bot.State = "UpdatingListings";
    canCheckInventory = false;
    recalculatelistings.recalculate(bot_config.sessionid, trading_config, (response) => {
        bot.State =  "Selling Items Update";
        processlistings.process(bot_config.sessionid, trading_config, (result) => {
            canCheckInventory = true;
            callback();
        })
    });
}