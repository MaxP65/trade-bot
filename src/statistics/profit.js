const database = require('../database/database');

export function calculate() {
    const trades = database.GetTrades({});
    var result = 0;
    for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        result += parseFloat(trade.sell_price) - parseFloat(trade.buy_price);
    }
    return result;
}