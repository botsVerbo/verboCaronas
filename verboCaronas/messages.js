import { wppSendMessage, wppSendMessageFrom } from './index.js';
import { MaxTime, User } from '../db.js';
import { RESPONSES } from './RESPONSES.js';
import { verifyCep, handleDriver, handlePassenger } from './maps.js';

export async function handleMessages(wppMessage) {
    const user = await User.findOne({ where: { phone: wppMessage.from } });
    if (!user) {
        await User.create({
            phone: wppMessage.from,
        });
        wppSendMessage(wppMessage, RESPONSES['welcome']);
    } else {
        choseMessages(wppMessage, user.lastMessageCode, user.dataValues);
    }
}

function choseMessages(wppMessage, lastMessageCode, currentUser) {
    if (lastMessageCode == 'welcome' || lastMessageCode == 'tryAgainName') {
        saveName(wppMessage);
    } else if (lastMessageCode == 'confirmName') {
        confirmName(wppMessage);
    } else if (
        lastMessageCode == 'cep' ||
        lastMessageCode == 'errorCep' ||
        lastMessageCode == 'tryAgainCep'
    ) {
        saveCep(wppMessage);
    } else if (lastMessageCode == 'confirmCep') {
        confirmCep(wppMessage);
    } else if (
        lastMessageCode == 'choseRole' ||
        lastMessageCode == 'tryAgainRole'
    ) {
        choseRole(wppMessage);
    } else if (lastMessageCode == 'confirmRole') {
        confirmRole(wppMessage, currentUser);
    } else if (lastMessageCode == 'choseTheTimeToDrive') {
        choseTheTimeToDrive(wppMessage, currentUser);
    } else if (lastMessageCode == 'successRole') {
        wppSendMessageFrom(wppMessage.from, RESPONSES['recordCompleted']);
    }
}

function saveName(wppMessage) {
    let userName = wppMessage.body.substring(0, 50)
    User.update({ name: userName }, { where: { phone: wppMessage.from } });
    wppSendMessage(wppMessage, RESPONSES['confirmName'], true, {
        name: userName,
    });
}

async function saveCep(wppMessage) {
    const numericStr = wppMessage.body.replace(/[^0-9]/g, '');
    const cepIsValid = await verifyCep(numericStr);
    if (cepIsValid) {
        User.update(
            { cep: numericStr, neighborhood: cepIsValid },
            { where: { phone: wppMessage.from } }
        );
        wppSendMessage(wppMessage, RESPONSES['confimCep'], true, {
            address: cepIsValid,
        });
    } else {
        wppSendMessage(wppMessage, RESPONSES['errorCep']);
    }
}

function confirmName(wppMessage) {
    if (wppMessage.body == '1') {
        wppSendMessage(wppMessage, RESPONSES['cep']);
    } else if (wppMessage.body == '2') {
        wppSendMessage(wppMessage, RESPONSES['tryAgainName']);
    } else {
        wppSendMessage(wppMessage, RESPONSES['invalidOption'], false);
    }
}

function confirmCep(wppMessage) {
    if (wppMessage.body == '1') {
        wppSendMessage(wppMessage, RESPONSES['successCep']);
        wppSendMessage(wppMessage, RESPONSES['choseRole']);
    } else if (wppMessage.body == '2') {
        wppSendMessage(wppMessage, RESPONSES['tryAgainCep']);
    } else {
        wppSendMessage(wppMessage, RESPONSES['invalidOption'], false);
    }
}

function choseRole(wppMessage) {
    if (wppMessage.body == '1') {
        wppSendMessage(wppMessage, RESPONSES['confirmRole'], true, {
            value: 'Dar carona',
        });
        User.update({ role: 'driver' }, { where: { phone: wppMessage.from } });
    } else if (wppMessage.body == '2') {
        wppSendMessage(wppMessage, RESPONSES['confirmRole'], true, {
            value: 'Receber carona',
        });
        User.update({ role: 'passenger' }, { where: { phone: wppMessage.from } });
    } else {
        wppSendMessage(wppMessage, RESPONSES['invalidOption'], false);
    }
}

function confirmRole(wppMessage, currentUser) {
    if (wppMessage.body == '1') {
        if (currentUser.role == 'driver') {
            wppSendMessage(wppMessage, RESPONSES['choseTheTimeToDrive']);
        } else {
            wppSendMessage(wppMessage, RESPONSES['successRole']);
            handleRide(wppMessage, currentUser);
        }
    } else if (wppMessage.body == '2') {
        wppSendMessage(wppMessage, RESPONSES['tryAgainRole']);
    } else {
        wppSendMessageFrom(wppMessage.from, RESPONSES['invalidOption']);
    }
}

function choseTheTimeToDrive(wppMessage, currentUser) {
    const message = wppMessage.body;
    if (message == '1') {
        wppSendMessage(wppMessage, RESPONSES['successRole']);
        maxTime(currentUser.id, 3);
        handleRide(wppMessage, currentUser);
    } else if (message == '2') {
        wppSendMessage(wppMessage, RESPONSES['successRole']);
        maxTime(currentUser.id, 5);
        handleRide(wppMessage, currentUser);
    } else if (message == '3') {
        wppSendMessage(wppMessage, RESPONSES['successRole']);
        maxTime(currentUser.id, 10);
        handleRide(wppMessage, currentUser);
    } else if (message == '4') {
        wppSendMessage(wppMessage, RESPONSES['successRole']);
        maxTime(currentUser.id, 20);
        handleRide(wppMessage, currentUser);
    } else {
        wppSendMessageFrom(wppMessage.from, RESPONSES['invalidOption']);
    }
}

async function maxTime(id, minutes) {
    const maxTime = await MaxTime.findOne({
        where: { userId: id }
    })
    if (!maxTime) {
        MaxTime.create({
            userId: id,
            increaseTime: minutes
        });
    }
}

async function handleRide(wppMessage, currentUser) {
    const role = currentUser.role;
    if (role == 'driver') {
        wppSendMessage(wppMessage, RESPONSES['awaitingPassengers'], false);
        const passengers = await User.findAll({
            where: {
                Role: 'passenger',
            },
        });
        handleDriver(wppMessage.from, currentUser.cep, currentUser.id,  passengers);
    } else if (role == 'passenger') {
        wppSendMessage(wppMessage, RESPONSES['awaitingDrivers'], false);
        const drivers = await User.findAll({
            where: {
                Role: 'driver',
            },
        });
        handlePassenger(wppMessage.from, currentUser, drivers);
    }
}
