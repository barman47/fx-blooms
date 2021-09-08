import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { HUB_URL, RECEIVE_NOTIFICATION, SEND_MESSAGE, TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } from './constants';

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

    sendMessage = async (message) => {
        console.log(message);
        const res = await this.connection.send(SEND_MESSAGE, message);
        console.log('Message sent ', res);
    }

    registerReceiveNotification = (callback) => {
        this.connection.once(RECEIVE_NOTIFICATION, (message) => {
            console.log('message from service ', message);
            callback(message);
        });
    };

    registerTransferNotification = (callback) => {
        this.connection.once(TRANSFER_NOTIFICATION, (notification) => {
            console.log('notification ', notification);
            callback(notification);
        });
    };

    registerTransferConfirmation = (callback) => {
        this.connection.once(TRANSFER_CONFIRMATION, (notification) => {
            console.log('notification ', notification);
            callback(notification);
        });
    };
}

const SignalRService = new SignalRController();
console.log('SignalRService Initialized ', SignalRService);
export default SignalRService;