import awsIot from "aws-iot-device-sdk";
import * as dgram from "dgram";

const server = dgram.createSocket('udp4');

let temperature = 0
let humidity = 0

server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

/*
const genClientId = (length: number) => {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

const randomVal = () => {
    return Math.floor(Math.random() * 51);
}
 */

const device = new awsIot.device({
    keyPath: "/root/paocloud-ais-nb-iot-aws-iot/src/private.key",
    certPath: "/root/paocloud-ais-nb-iot-aws-iot/src/cert.crt",
    caPath: "/root/paocloud-ais-nb-iot-aws-iot/src/rootCA.pem",
    clientId: "paocloud-nbiot-to-aws-agent-1-v1",
    host: "a2i9tqi7jp33oq-ats.iot.ap-southeast-1.amazonaws.com"
});

server.on('message', function (message, remote) {
        //console.log(message.toString('utf8'));
        let data = JSON.parse(message.toString('utf8'));
        //console.log("Temperature: " + data.temperature);
        temperature = data.temperature
        humidity = data.humidity
});

device.on('connect', (): void => {
    console.log('connect');
    try {
        setInterval( (): void =>{
            console.log(temperature);
            console.log(humidity);
            device.publish('/home/nbiot/temperature/value', JSON.stringify({ temperature: temperature}));
            device.publish('/home/nbiot/humidity/value', JSON.stringify({ humidity: humidity}));
        },300000);
                }
    catch (err){
        console.log(err);
    }
});

server.bind(42302, '0.0.0.0');
