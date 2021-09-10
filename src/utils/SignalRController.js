import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { HUB_URL, NOTIFICATION_TYPES, RECEIVE_NOTIFICATION, SEND_MESSAGE } from './constants';

const { TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } = NOTIFICATION_TYPES;

class SignalRController {
    constructor () {
        this.connection = new HubConnectionBuilder().withUrl(HUB_URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Trace).withAutomaticReconnect().build();

        
        this.connection.start().then().catch(err => {
            console.error(err);
        });
        
        // this.connection.on(RECEIVE_NOTIFICATION, (data, type) => {
        //     console.log('received information ', data);
        //     let response = JSON.parse(data);
        //     switch (type) {
        //         case CHAT_MESSAGE:
        //             const messageData = {
        //                 chatId: response.ChatId,
        //                 dateSent: response.DateSent,
        //                 id: response.Id,
        //                 sender: response.Sender,
        //                 text: response.Text,
        //                 uploadedFileName: response.UploadedFileName
        //             };
        //             batch(() => {
        //                 store.dispatch({
        //                     type: SENT_MESSAGE,
        //                     payload: messageData
        //                 });
        //             });
        //             break;

        //         case TRANSFER_CONFIRMATION:
        //             store.dispatch({
        //                 type: PAYMENT_NOTIFICATION,
        //                 payload: {
        //                     buyerHasMadePayment: response.BuyerHasMadePayment,
        //                     buyerHasRecievedPayment: response.BuyerHasRecievedPayment,
        //                     sellerHasMadePayment: response.SellerHasMadePayment, 
        //                     sellerHasRecievedPayment: response.SellerHasRecievedPayment, 
        //                     isDeleted: response.IsDeleted
        //                 }
        //             });
        //             break;

        //         case TRANSFER_NOTIFICATION:
        //             store.dispatch({
        //                 type: PAYMENT_NOTIFICATION,
        //                 payload: {
        //                     buyerHasMadePayment: response.BuyerHasMadePayment,
        //                     buyerHasRecievedPayment: response.BuyerHasRecievedPayment,
        //                     sellerHasMadePayment: response.SellerHasMadePayment, 
        //                     sellerHasRecievedPayment: response.SellerHasRecievedPayment, 
        //                     isDeleted: response.IsDeleted
        //                 }
        //             });
        //             break;

        //         default:
        //             break;
        //     }
        // });
    }

    sendMessage = async (message) => {
        console.log(message);
        await this.connection.send(SEND_MESSAGE, message);
        console.log('Message sent ');
    }

    registerReceiveNotification = (callback) => {
        this.connection.on(RECEIVE_NOTIFICATION, (message, type) => {
            console.log('message from service ', message);
            callback(message, type);
        });
    };

    registerTransferNotification = (callback) => {
        this.connection.on(TRANSFER_NOTIFICATION, (notification) => {
            console.log('notification ', notification);
            callback(notification);
        });
    };

    registerTransferConfirmation = (callback) => {
        this.connection.on(TRANSFER_CONFIRMATION, (notification) => {
            console.log('notification ', notification);
            callback(notification);
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