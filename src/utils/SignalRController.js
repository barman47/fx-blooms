import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { HUB_URL } from './constants';

class SignalRController {
    constructor () {
        this.connection = new HubConnectionBuilder().withUrl(HUB_URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();
        
        this.connection.start().then().catch(err => {
            console.error(err);
        });
    }

    registerReceiveNotification = (callback) => {
        this.connection.on('ReceiveNotification', (message) => {
            console.log('message from service ', message);
            callback(message);
        });
    };

    registerTransferNotification = (callback) => {
        this.connection.on('TransferNotification', (notification) => {
            console.log('notification ', notification);
            callback(notification);
        });
    };

    registerTransferConfrimation = (callback) => {
        this.connection.on('TransferConfrimation', (notification) => {
            console.log('notification ', notification);
            callback(notification);
        });
    };
}

const SignalRService = new SignalRController();
console.log('SignalRService Initialized ', SignalRService);
export default SignalRService;