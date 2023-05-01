import qrcode from 'qrcode-terminal';
import wpp from 'whatsapp-web.js';
import { handleMessages } from './messages.js';
import { User } from '../db.js';

const client = new wpp.Client({
    authStrategy: new wpp.LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', (wppMessage) => {
    try {
        handleMessages(wppMessage);
    } catch (error) {
        console.error(error);
        client.sendMessage(
            wppMessage.from,
            'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.'
        );
    }
});

client.initialize();

export function wppSendMessage(wppMessage, response, writeDb = true, value) {
    client.sendMessage(wppMessage.from, response.message(value));
    if (writeDb) {
        User.update(
            { lastMessageCode: response.code },
            { where: { phone: wppMessage.from } }
        );
    }
}

export function wppSendMessageFrom(phoneUser, response, value) {
    client.sendMessage(phoneUser, response.message(value));
}
