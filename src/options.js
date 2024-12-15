'use strict';

//Configs --------------------------------------------------------

let configs = document.getElementById("configDiv");

function constructConfig(titletext, config, resetevent, inputevent) {
    //Main
    let main = document.createElement("div");
    main.style = "padding: 1rem; border: 1px solid black; border-radius: 1rem; width: max-content;";
    configs.appendChild(main);

    //Title
    let title = document.createElement("h2");
    title.textContent = titletext;
    title.style = "margin: 0;display:inline-block;";
    main.appendChild(title);

    //Reset
    let button = document.createElement("button");
    button.textContent = "Reset to default";
    button.style = "float:right;display:inline-block;";
    main.appendChild(button);

    button.addEventListener('click', ()=> {resetevent()});

    for (var key in config) {
        //Form-group
        let group = document.createElement("div");
        group.classList.add("form-group");
        group.style = "margin-top: 0.5rem"
        main.appendChild(group);

        //Label
        let label = document.createElement("label");
        label.textContent = key;
        label.for = key; 
        label.style = 'margin-right: 0.5rem'
        group.appendChild(label);

        //Input
        let type = typeof config[key]
        let input = document.createElement("input");
        if(type == "boolean")  {
            type = "checkbox";
            input.checked = config[key];
            input.addEventListener('change', (event) => {
                //console.log(event.target);
                inputevent(event.target.name, event.target.checked);
            });
        }
        input.type = type;
        input.value = config[key];
        input.name = key;
        input.style = "float: right;";
        group.appendChild(input);

        if(type != "checkbox")  {
            input.addEventListener('change', (event) => {
                inputevent(event.target.name, event.target.value);
            });
        }
    }
}

const configManager = require('./config/config.js');

var bot_config = {};
configManager.getBotConfig(setBotConfig);
function setBotConfig(data) {
    bot_config = data;
    constructConfig("Bot", bot_config, resetBotConfig, function(key, value) {
        bot_config[key] = value;
        console.log(key + bot_config[key]);
        configManager.setBotConfig(bot_config);
    });
}
function resetBotConfig() {
    configManager.resetBotConfig();
    document.location.reload();
}

var database_config = {};
configManager.getDatabaseConfig(setDatabaseConfig);
function setDatabaseConfig(data) {
    database_config = data;
    constructConfig("Database", database_config, resetDatabaseConfig, function(key, value) {
        database_config[key] = value;
        console.log(key + database_config[key]);
        configManager.setDatabaseConfig(database_config);
    });
}
function resetDatabaseConfig() {
    configManager.resetDatabaseConfig();
    document.location.reload();
}

var trading_config = {};
configManager.getTradingConfig(setTradingConfig);
function setTradingConfig(data) {
    trading_config = data;
    constructConfig("Trading", trading_config, resetTradingConfig, function(key, value) {
        trading_config[key] = value;
        configManager.setTradingConfig(trading_config);
    });
}
function resetTradingConfig() {
    configManager.resetTradingConfig();
    document.location.reload();
}

//Buttons -----------------------------------------------------

let buttons = document.getElementById("buttonDiv");

function constructButton(title, callback) {
    let button = document.createElement("button");
    button.textContent = title;
    buttons.appendChild(button);

    button.addEventListener('click', callback);
}

function constructTitle(title) {
    let p = document.createElement("p");
    p.textContent = title;
    p.style = "width: 100%";
    buttons.appendChild(p);
}

// const analyzeitems = require('./actions/analyzeallitems');
// constructButton("Check items", async function() { analyzeitems.analyze(trading_config) });

constructTitle("Trading");

const analyzeitem = require('./actions/analyzeitem');
constructButton("Analyze Glock", () => {analyzeitem.process("AUG%20%7C%20Sweeper%20%28Well-Worn%29", trading_config, (response)=> {
    console.log(response);
})});


const getconvertion = require('./actions/getconvertion');
constructButton("convert", () => { getconvertion.get() });

const processbuyorders = require('./actions/processbuyorders');
constructButton("Place Orders", () => { processbuyorders.process(bot_config.sessionid, trading_config) });



const database = require('./database/database');
// constructButton("Find Item", () => { console.log(database.GetItemByColumn('name', 'Nova | Windblown (Factory New)'))});

constructButton("Clear Listings", () => { database.ClearListings() });

constructButton("Clear Inactive Listings", () => { database.DeleteListings({active: false}) });

constructButton("Clear Inactive orders", () => { database.DeleteOrders({active: false})});

const removeallorders = require('./actions/removeallorders')
constructButton("Remove orders", () => { removealloreders.remove(bot_config.sessionid); });

constructButton("Clear orders table", () => { database.ClearOrders(); });

constructTitle("User Info");

const steampagerequest = require('./actions/steampagerequest');
constructButton("Balance", () => {steampagerequest.getUserBalance((response)=> {
    console.log(response);
})});

constructButton("Inventory", () => {steampagerequest.getUserInventory(bot_config.steamid, (response)=> {
    console.log(response);
})});

const profit = require('./statistics/profit');
constructButton("Profit", () => { 
    console.log(profit.calculate());
});

const getuserlistings = require('./steamrequests/getuserlistings');
constructButton("Listings", () => { getuserlistings.get(true, (response) => {
    console.log(response);
})});

const gethistory = require('./steamrequests/gethistory');
constructButton("History", () => { gethistory.get((response) => {
    console.log(response.data.results_html);
    // var tag_id = document.getElementById('buttonDiv');
    // var newNode = document.createElement('p');
    // tag_id.appendChild(newNode);
    // newNode.appendChild(document.createTextNode(response.data.results_html));
    document.body.innerHTML += response.data.results_html;
})});

const fillnosell = require('./actions/fillnosell');
constructButton("Fill nosale", () => {fillnosell.fill(bot_config) });

constructButton("Clear nosale", () => {database.ClearNonsell() });

// Database ----------------------------------------------------

constructTitle("Data base");

const checkdatabase = require('./actions/checkdatabase');
constructButton("Check database", checkdatabase.check);

constructButton("Save database to file", async() => {
    const fileHandle = await window.showSaveFilePicker();
    chrome.storage.sync.get(['test_key'], async function(result) {
        console.log('Value currently is ' + result.key);
        const fileStream = await fileHandle.createWritable();
        await fileStream.write(new Blob(result.key, {type: "text/plain"}));
        await fileStream.close();
    });
});

createLoader();

function createLoader() {
    var input = document.createElement('input');
    input.textContent = "Load DB";
    input.type = 'file';
    buttons.appendChild(input);

    input.addEventListener('onchange', () => {
        //let file = files.files[0];
        //alert(`File name: ${file.name}`);
        console.log('file.name');
    })
}

// constructButton("Load database from file", async() => {
//     const fileHandle = await window.showOpenFilePicker();
//     const fileData = fileHandle.kind;
//     console.log(fileData);
    // chrome.storage.sync.set({'test_key': value}, function() {
    //     console.log('Value is set to ' + value);
    // });
// });

constructButton("Clear Database", database.ClearTable);

const loadbase = require('./actions/loadbase');
constructButton("Load Database", () => { loadbase.load(database_config) });

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
constructButton("Show Database", ()=> {
    getCurrentTab().then(result => {
        chrome.tabs.create({ url: chrome.runtime.getURL("../items.html"), index: parseInt((result.index + 1)) });
    });
});