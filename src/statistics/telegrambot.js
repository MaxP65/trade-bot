const token = "5457850885:AAF-YFozq2e_uISX6CYn0neNsQ1DWWHHvUA";
const user = 1373133940;
const TelegramApi = require('node-telegram-bot-api');

// const opts = {
//     reply_to_message_id: msg.message_id,
//     reply_markup: JSON.stringify({
//         inline_keyboard: 
//         [
//             [{text: 'Level 1'}],
//         ]
//     })
// };

const bot = new TelegramApi(token, { polling: true });

const commandsDict = {
    '/botstartstop': 'BOTSTARTSTOP',
    '/reloadbot': 'RELOADBOT',
    '/botinfo': 'INFO',
    '/balanceinfo': 'BALANCEINFO',
    '/toggleorders': 'TOGGLEORDERS',
    '/removebuyorders': 'REMOVEORDERS'
}

bot.setMyCommands([
    {  command: '/start', description: 'Telegram Bot Start' },
    {  command: '/botstartstop', description: 'Start Or Stop Bot Timeout' },
    {  command: '/reloadbot', description: 'Reload bot page' },
    {  command: '/removebuyorders', description: 'Remove buy orders' },
    {  command: '/placeorders', description: 'Place buy orders' },
    {  command: '/botinfo', description: 'Trade Bot Info' },
    {  command: '/balanceinfo', description: 'Balance, Orders, Listings' },
    {  command: '/toggleorders', description: 'Place Orders On Update' },
    {  command: '/clear', description: 'Clear chat' },
]);

const info = require('./info');

bot.on('message', msg => {
    const text = msg.text;
    const chat = msg.chat;

    if(msg.from.id == user) {
        const textMsg = text.split(' ')[0]
        switch(textMsg) {
            case "/start":
                var option = {
                    "parse_mode": "Markdown",
                    "reply_markup": {  "keyboard": [["Yes"],["No"]]  }
                };
                bot.sendMessage(msg.chat.id, "*Some* message here.", option);
                break;
            case "/clear":
                for (let i = 0; i < 101; i++) {
                    bot.deleteMessage(msg.chat.id,msg.message_id-i).catch(er=>{return})
                }
                break;
            default: 
                if(commandsDict.hasOwnProperty(textMsg)) {
                    chrome.runtime.sendMessage({
                        type: "BOT",
                        payload: {
                            command: commandsDict[textMsg]
                        }
                    }, (response) => {
                        var info = "";
                        Object.keys(response).forEach(key => {
                            info += key + ' - ' + response[key] + '\n';
                        });
                        bot.sendMessage(chat.id, info);
                    })
                    break;
                } else {
                    bot.sendMessage(chat.id, `Unknown command`);
                }
                //bot.sendMessage(chat.id, `Ты написал мне ${text}`);
                break
        }
    } else {
        bot.sendMessage(chat.id, `Unknown user`);
    }
})