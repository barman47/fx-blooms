import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { SET_SOCKET_CONNECTION_STATUS } from '../actions/types';

import { HUB_URL, NOTIFICATION_TYPES, RECEIVE_NOTIFICATION, SEND_MESSAGE } from './constants';
import { store } from '../store';

import { CHAT_CONNECTION_STATUS } from '../utils/constants';

const { CONNECTED, DISCONNECTED, RECONNECTED, RECONNECTING } = CHAT_CONNECTION_STATUS;
const { TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } = NOTIFICATION_TYPES;

class SignalRController {
    connected = false;
    connection = new HubConnectionBuilder().withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
    }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();

    constructor () {
        this.connect();
    }

    connect = async () => {
        try {
            await this.connection.start();
            console.log('SignalR Connected');
            store.dispatch({
                type: SET_SOCKET_CONNECTION_STATUS,
                payload: CONNECTED
            });
        } catch (err) {
            console.assert(this.connection.state === HubConnectionState.Disconnected);
            console.error(err);
            setTimeout(this.connect, 5000);
        }
    };

    onReconnect = () => {
        this.connection.onreconnecting(err => {
            console.log('Reconnecting');
            console.assert(this.connection.state === HubConnectionState.Reconnecting);
            // callback(err);
            store.dispatch({
                type: SET_SOCKET_CONNECTION_STATUS,
                payload: RECONNECTING
            });
            // disable inputs and show reconnection message
        });
    }

    onReconnected = () => {
        this.connection.onreconnected(connectionId => {
            console.assert(this.connection.state === HubConnectionState.Connected);
            store.dispatch({
                type: SET_SOCKET_CONNECTION_STATUS,
                payload: RECONNECTED
            });
        });
    }

    onClose = () => {
        this.connection.onclose(err => {
            console.assert(this.connection.state === HubConnectionState.Disconnected);
            store.dispatch({
                type: SET_SOCKET_CONNECTION_STATUS,
                payload: DISCONNECTED
            });
        });
    };

    sendMessage = async (message) => {
        try {
            await this.connection.send(SEND_MESSAGE, message);
        } catch (err) {
            console.error(err);
        }
    }

    registerReceiveNotification = (callback) => {
        this.connection.on(RECEIVE_NOTIFICATION, (message, type) => {
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