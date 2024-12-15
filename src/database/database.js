const localStorageDB = require('localstoragedb');
var lib = new localStorageDB("TradeBot", "localStorage");

const itemsScheme = ["name", "soldHour", "avgPrice", "nameid", "profit", "buy_count", "buy", "sell", "active"];
const ordersScheme = ["orderid", "name", "profit", "price", "buy_count", "active"];
const nonsellScheme = ["assetid", "name"];
const listingsScheme = ["listingid", "name", "price", "buy_price", "time", "active"];
const tradesScheme = ["name", "time", "buy_price", "sell_price"];

if(!lib.tableExists("items")) {
    lib.createTable("items", itemsScheme);
    lib.commit()
}
if(!lib.tableExists("orders")) {
    lib.createTable("orders", ordersScheme);
    lib.commit()
}
if(!lib.tableExists("nonsell")) {
    lib.createTable("nonsell", nonsellScheme);
    lib.commit()
}
if(!lib.tableExists("listings")) {
    lib.createTable("listings", listingsScheme);
    lib.commit()
}
if(!lib.tableExists("trades")) {
    lib.createTable("trades", tradesScheme);
    lib.commit()
}

//ITEMS ---------------------------------------------------------------------------------------

export function ClearTable() {
    lib.dropTable("items")
    lib.createTable("items", itemsScheme);
    lib.commit()
}  

export function GetAllColumns() {
    return lib.tableFields("items");
}

export function GetItemsCount() {
    return lib.rowCount("items");
}

export function GetAllItems() {
    return lib.queryAll("items");
}

export function GetItems(limit, start, sortcolumn) {
    return lib.queryAll("items", { limit, start });
}

export function QueryItems(limit, start, name, sortcolumn) {
    let query = null;
    if(name != '') query = { name };
    return lib.queryAll("items", { limit, start, query });
}

export function GetItemByColumn(col, val) {
    return lib.queryAll("items", {
        query: {[col]: val}
    });
}

export function GetItem(id) {
    return lib.queryAll("items", {
        query: {ID: id}
    });
}

export function AddItem(item) {
    lib.insert("items", item);
    lib.commit();
}

export function Update(id, column, value, commit) {
    lib.update("items", {ID: id}, function(row) {
        row[column] = value;
        return row;
    });
    if(commit) lib.commit();
}

export function UpdateAllItems(column, value) {
    lib.update("items", {}, function(row) {
        row[column] = value;
        return row;
    });
    lib.commit();
}

export function UpdateItem(id, column, value) {
    Update(id, column, value, true);
}

export function UpdateItems(ids, column, value) {
    ids.forEach(id => {
        Update(id, column, value, false);
    });
    lib.commit();
}

// ORDERS ------------------------------------------------------------------------------------

export function AddOrder(order) {
    lib.insert("orders", order);
    lib.commit();
}

export function UpdateOrder(id, orderid, price, active) {
    lib.update("orders", {ID: id}, function(row) {
        row['orderid'] = orderid;
        row['price'] = price;
        row['active'] = active;
        return row;
    });
    lib.commit();
}

export function UpdateOrderColumn(id, col, val) {
    lib.update("orders", {ID: id}, function(row) {
        row[col] = val;
        return row;
    });
    lib.commit();
}

export function GetOrders(options) {
    return lib.queryAll("orders", options);
}

export function DeleteOrder(orderid) {
    lib.deleteRows("orders", {orderid: orderid});
    lib.commit();
}

export function DeleteOrders(options) {
    lib.deleteRows("orders", options);
    lib.commit();
}

export function ClearOrders() {
    lib.dropTable("orders")
    lib.createTable("orders", ordersScheme);
    lib.commit()
}  


// NONSELL ----------------------------------------------------------------------------------

export function AddNonsell(item) {
    lib.insert("nonsell", item);
    lib.commit();
}

export function GetNonsell(assetid) {
    return lib.queryAll("nonsell", { query: {assetid: assetid}});
}

export function ClearNonsell() {
    lib.dropTable("nonsell")
    lib.createTable("nonsell", nonsellScheme);
    lib.commit()
}

// LISTINGS ---------------------------------------------------------------------------------

export function AddListing(listing) {
    lib.insert("listings", listing);
    lib.commit();
}

export function UpdateListing(id, price, active) {
    lib.update("listings", {ID: id}, function(row) {
        row['price'] = price;
        row['active'] = active;
        return row;
    });
    lib.commit();
}

export function UpdateListingColumn(id, col, val) {
    lib.update("listings", {ID: id}, function(row) {
        row[col] = val;
        return row;
    });
    lib.commit();
}

export function GetListings(options) {
    return lib.queryAll("listings", options);
}

export function DeleteListing(id) {
    console.log('delete' + id);
    lib.deleteRows("listings", {ID: id});
    lib.commit();
}

export function DeleteListings(options) {
    lib.deleteRows("listings", options);
    lib.commit();
}

export function ClearListings(options) {
    lib.dropTable("listings")
    lib.createTable("listings", listingsScheme);
    lib.commit()
}

// TRADES -------------------------------------------------------------------------------------

export function AddTrade(trade) {
    lib.insert("trades", trade);
    lib.commit();
}

export function GetTrades(options) {
    return lib.queryAll("trades", options);
}