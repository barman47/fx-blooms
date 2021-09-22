import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { HUB_URL, NOTIFICATION_TYPES, RECEIVE_NOTIFICATION, SEND_MESSAGE } from './constants';
const { TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } = NOTIFICATION_TYPES;

class SignalRController {
    constructor () {
        this.connection = new HubConnectionBuilder().withUrl(HUB_URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect([5, 5, 5, 5, 5, 5, 5, 5, 5, 5]).build();
        
        this.connection.start().then().catch(err => {
            console.error(err);
        });
    }

    sendMessage = async (message) => {
        try {
            await this.connection.send(SEND_MESSAGE, message);
        } catch (err) {
            console.log(err);
        }
    }

    registerReceiveNotification = (callback) => {
        this.connection.on(RECEIVE_NOTIFICATION, (message, type) => {
            // console.log('message from service ', message);
            callback(message, type);
        });
    };

    closeNotifications = () => {
        this.connection.off(RECEIVE_NOTIFICATION);
        this.connection.off(TRANSFER_NOTIFICATION);
        this.connection.off(TRANSFER_CONFIRMATION);
    };
}

const SignalRService = new SignalRController();
console.log('SignalRService Initialized ', SignalRService);
export default SignalRService;