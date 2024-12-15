'use strict';

const database = require('./database/database');

var selected = [];

const css = 'th, td { padding: 3px; } .dark { background: rgb(211, 211, 211) } .light { background: rgb(235, 235, 235) } input { max-width: 4rem; } p {margin: 0;} h4 { display: inline-block;margin-left: 1rem;cursor: pointer; }';
const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');

head.appendChild(style);
style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

let query = document.createElement("input");
query.id = "query";
query.style = "display: inline-block; min-width: 15rem;";
query.addEventListener('change', function () {
    inputName = this.value;
    currentPage = 0;
    clearTable();
    generateTable(pageSize, currentPage);
});
document.body.appendChild(query);

let selector = document.createElement("div");
selector.id = "selector";
selector.style = "display: inline-block; margin-left: 1rem;";
document.body.appendChild(selector);

let pages = document.createElement("div");
pages.id = "pages";
pages.style = "display: inline-block;";
document.body.appendChild(pages);

let table = document.createElement("table");
pages.id = "table";
document.body.appendChild(table);

const pageSizes = [10, 25, 50, 100, 200];
let pageSize = 10;
let currentPage = 0;
let sortcolumn = '';
let inputName = '';
chrome.storage.sync.get(['pageSize', 'currentPage'], function(result) {
    console.log(result);
    pageSize = parseInt(result.pageSize);
    currentPage = parseInt(result.currentPage);
    drawSelector();
    drawLinks();
    generateTable(pageSize, currentPage);
});

function drawSelector() {
    let select = document.createElement("select");
    selector.appendChild(select);

    pageSizes.forEach(size => {
        let option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        select.appendChild(option);
    });

    select.value = pageSize;
    select.addEventListener('change', (event) => {
        pageSize = parseInt(select.value);
        chrome.storage.sync.set({pageSize: pageSize}, function() {
            currentPage = 0;
            clearTable();
            generateTable(pageSize, currentPage);
            clearLinks();
            drawLinks();
            //document.location.reload();
        })
    });
}

function clearLinks() {
    pages.innerHTML = '';
}

function drawLinks() {
    let pagesCount = Math.floor(database.GetItemsCount() / pageSize);
    if(pagesCount * pageSize < database.GetItemsCount()) pagesCount += 1;
    for (let i = 0; i < pagesCount; i++) {
        let page = document.createElement("h4");
        page.id = "page_"+i;
        page.textContent = i + 1;
        page.style = i == currentPage ? "text-decoration: underline;" : "";
        pages.appendChild(page);
        page.addEventListener('click', (event) => {
            document.getElementById("page_"+currentPage).style = "";
            currentPage = i;
            chrome.storage.sync.set({currentPage: currentPage}, function() { });
            page.style = "text-decoration: underline;";
            clearTable();
            generateTable(pageSize, currentPage);
        })
    }
}

function clearTable() {
    table.innerHTML = '';
}

// Table
function generateTable(pageSizeInput, currentPageInput) {
    let div = table;

    // Head -----------------------------------------------
    let thead = document.createElement("thead");
    div.appendChild(thead);
    let trhead = document.createElement("tr");
    trhead.classList.add("dark")
    thead.appendChild(trhead);

    const columns = [...database.GetAllColumns()];
    columns.unshift("selected");

    columns.forEach(column => {
        let th = document.createElement("th");
        trhead.appendChild(th);
        if(column == "selected") {
            let input = createInputColumn(th, "checkbox", column);
            input.addEventListener('change', (event) => {allSelected =  input.checked});
        } else if(column == "buy" || column == "sell" || column == "active") {
            let input = createInputColumn(th, "checkbox", column);
            input.addEventListener('change', (event) => {updateSelected(column, input.checked)});
        } else if(column == "buy_count") {
            let input = createInputColumn(th, "number", column);
            input.addEventListener('change', (event) => {updateSelected(column, input.value)});
        } else {
            th.textContent = column;
        }
    });

    // Body -----------------------------------------------

    let tbody = document.createElement("tbody");
    div.appendChild(tbody);
    let index = 0;

    database.QueryItems(pageSizeInput, currentPageInput*pageSizeInput, inputName, '').forEach(item => {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        if(index % 2 == 1) tr.classList.add("dark");
        else tr.classList.add("light");
        index++;

        columns.forEach(column => {
            if(column == "selected") {
                let th = document.createElement("th");
                tr.appendChild(th); 
                let input = createInput(th, "checkbox", false);
                input.addEventListener('change', (event) => {select(item.ID, input.checked)});
            } else {
                if(column == "buy" || column == "sell" || column == "active") {
                    let th = document.createElement("th");
                    tr.appendChild(th);
                    let input = createInput(th, "checkbox", item[column]);
                    input.addEventListener('change', (event) => {changeItem(item.ID, column, input.checked)});
                }
                else if(column == "buy_count") {
                    let th = document.createElement("td");
                    tr.appendChild(th);
                    let input = createInput(th, "number", item[column]);
                    input.addEventListener('change', (event) => {changeItem(item.ID, column, input.value)});
                }
                else {
                    let th = document.createElement("td");
                    tr.appendChild(th);
                    th.textContent = item[column];
                }
            }
        });
    });
}

let allSelected = false;

function select(id, select) {
    if(select) {
        selected.push(id);
    } else {
        selected.splice(selected.indexOf(id), 1);
    }
    console.log(selected);
}

function updateSelected(column, value) {
    if(allSelected) {
        database.UpdateAllItems(column, value);
        clearTable();
        generateTable(pageSize, currentPage);
        //document.location.reload();
    } else {
        database.UpdateItems(selected, column, value);
        if(selected.length > 0) {
            clearTable();
            generateTable(pageSize, currentPage);
        }
        //document.location.reload();
    }
}

function createInputColumn(parent, type, column) {
    let text = document.createElement("p");
    text.textContent = column;
    parent.appendChild(text);
    return createInput(parent, type, '');
}

function createInput(parent, type, value) {
    let input = document.createElement("input");
    input.type = type;
    if(type == "checkbox") {
        input.checked = value;
    } else if(type == "number") {
        input.value = value;
    }
    parent.appendChild(input);
    return input;
}

function changeItem(id, column, value) {
    database.UpdateItem(id, column, value);
}