const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: false });

const sendTelegramMessage = async (message) => {
    try {
        await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendTelegramMessage;
