
//conexion con slack web hook
const {IncomingWebhook} = require('@slack/webhook');
const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK);
//const sendTelegramMessage = require('./handleLoggerTelegram');

const loggerStream = {
    write: (message) => {
        webHook.send({
            text:message
        });
        //sendTelegramMessage(message);
    },
};

module.exports = loggerStream;