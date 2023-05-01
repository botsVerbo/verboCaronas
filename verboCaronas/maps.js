import { RESPONSES } from './RESPONSES.js';
import { wppSendMessageFrom } from './index.js';
import { Addresses, MaxTime } from '../db.js';
import * as dotenv from 'dotenv';
dotenv.config();
const key = process.env.API_KEY || '';
const destination =
    'Igreja Evangélica Verbo da Vida - Carlos Prates, belo horizonte, minas gerais';

export async function verifyCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data?.bairro || false;
    } catch (error) {
        return false;
    }
}

export async function handleDriver(driverPhone, origin, id, passengers) {
    let countPassengers = 0;
    for (const passenger of passengers) {
        const passengerData = passenger.dataValues;
        const waypointCep = passengerData.cep;

        const timeAndDistance = await getDurationAndDistance(origin, waypointCep);
        if (timeAndDistance.duration <= await maxTime(id)) {
            countPassengers++;
            sendMessageToDriver(timeAndDistance, passengerData, driverPhone);
            await delay(randomIntFromInterval(5000, 10000));
        }
    }
    if (countPassengers == 0) {
        wppSendMessageFrom(driverPhone, RESPONSES['noPassengers']);
    } else {
        wppSendMessageFrom(driverPhone, RESPONSES['passengersFound'], { passengersNumber: countPassengers });
    }
}

export async function handlePassenger(passengerPhone, passengerData, drivers) {
    let countPassengers = 0;
    for (const driver of drivers) {
        const driverData = driver.dataValues;
        const driverPhone = driverData.phone;
        const origin = driverData.cep;

        const waypointCep = passengerData.cep;

        const timeAndDistance = await getDurationAndDistance(origin, waypointCep);

        if (timeAndDistance.duration <= await maxTime(driverData.id)) {
            countPassengers++;
            checkSchedule(timeAndDistance, passengerData, driverPhone);
            await delay(randomIntFromInterval(5000, 10000));
        }
    }
    if (countPassengers == 0) {
        wppSendMessageFrom(passengerPhone, RESPONSES['noDrivers']);
    } else {
        wppSendMessageFrom(passengerPhone, RESPONSES['driversFound']);
    }
}

async function checkSchedule(timeAndDistance, passengerData, driverPhone) {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 22) {
        sendMessageToDriver(timeAndDistance, passengerData, driverPhone);
    } else {
        let wait = hour >= 22 ? hour - 10 : 10 - hour;
        wait = wait * 60 * 60 * 1000;
        setTimeout(() => {
            sendMessageToDriver(timeAndDistance, passengerData, driverPhone);
        }, wait);
    }
}

async function sendMessageToDriver(timeAndDistance, passengerData, driverPhone) {
    wppSendMessageFrom(driverPhone, RESPONSES['nearbyUsers'], {
        name: passengerData.name,
        neighborhood: passengerData.neighborhood,
        time: `${Math.ceil(timeAndDistance.duration)} min`,
        distance: `${parseFloat(timeAndDistance.distance).toFixed(1)} km`,
        contact: passengerData.phone.replace('@c.us', ''),
    });
}

async function calculateDurationAndDistance(queryString) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${queryString}`);

    const data = await response.json();
    const driverToPassenger = data.routes[0].legs[0];
    const passengerToDestination = data.routes[0].legs[1];
    const driverToDestination = data.routes[0].legs[3];

    const duration1 = driverToPassenger.duration.value / 60;
    const duration2 = passengerToDestination.duration.value / 60;
    const duration3 = driverToDestination.duration.value / 60;
    const duration = (duration1 + duration2) - duration3;

    const distance1 = driverToPassenger.distance.value / 1000;
    const distance2 = passengerToDestination.distance.value / 1000;
    const distance3 = driverToDestination.distance.value / 1000;
    const distance = (distance1 + distance2) - distance3;
    console.log(`(${distance1} + ${distance2}) - ${distance3} = ${distance}`)
    console.log(`(${duration1} + ${duration2}) - ${duration3} = ${duration}`)
    return { duration, distance };
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getDurationAndDistance(origin, waypointCep) {

    const waypoints = [waypointCep, destination, origin];

    const params = {
        origin: origin,
        destination: destination,
        waypoints: `|${waypoints.join('|')}`,
        key: key,
    };
    const queryString = new URLSearchParams(params).toString();


    try {
        const addresses = await Addresses.findAll({
            where: {
                startPoint: `${origin}`,
                waypoint: `${waypointCep}`
            }
        });
        const rideData = addresses[0].dataValues;
        const durationAndDistance = { duration: rideData.duration, distance: rideData.distance };
        return durationAndDistance;

    } catch {
        const durationAndDistance = await calculateDurationAndDistance(queryString);
        await Addresses.create({
            startPoint: `${origin}`,
            waypoint: `${waypointCep}`,
            duration: `${durationAndDistance.duration}`,
            distance: `${durationAndDistance.distance}`
        });
        return durationAndDistance;
    }
}

async function maxTime(id) {
    try {
        const maxTimeById = await MaxTime.findOne({where: {userId: id}})
        return maxTimeById.dataValues.increaseTime
    } catch (error) {
        return 0
    }
}