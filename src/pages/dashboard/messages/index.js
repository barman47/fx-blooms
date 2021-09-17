import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Actions from './Actions';
import Conversation from './Conversation';
import Messages from './Messages';
// import SignalRService from '../../../utils/SignalRController';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        position: 'relative',
        // overflowY: 'hidden',
        overflowY: ['hidden', '-moz-scrollbars-none'],
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        top: 0,
        left: 0,

        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },

    header: {
        backgroundColor: COLORS.white,
        marginBottom: theme.spacing(2),
        padding: [[theme.spacing(2), 0, 0, theme.spacing(2)]],
        margin: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,

        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },

    gridContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',

        [theme.breakpoints.down('md')]: {
            display: 'grid',
            gridTemplateColumns: '1.5fr 2fr'
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr'
        },
    },

    messages: {
        position: 'sticky',

        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },
        width: '25%',
        [theme.breakpoints.down('md')]: {
            // display: 'none'
            width: '100%'
        }
    },

    conversation: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: '50%',

        '&::-webkit-scrollbar': {
            display: 'none'
        },

        [theme.breakpoints.down('md')]: {
            width: '100%'
        },
        [theme.breakpoints.down('sm')]: {
            maxHeight: '90%'
        },
    },

    actions: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: '25%',

        [theme.breakpoints.down('md')]: {
            display: 'none'
        },

        '&::-webkit-scrollbar': {
            display: 'none'
        }
    }
}));

const Index = (props) => {
    const classes = useStyles();

    const { handleSetTitle } = props;

    const chat = useSelector(state => state.chat?.chat);
    
    useEffect(() => {
        // handleSentMessage();
        handleSetTitle('Messages');
        // eslint-disable-next-line
    }, []);

    // const handleSentMessage = () => {
    //     const { CHAT_MESSAGE, TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } = NOTIFICATION_TYPES;
    //     SignalRService.registerReceiveNotification((data, type) => {
    //         let response = JSON.parse(data);
    //         console.log('New Notification ', response, type);
    //         if (customerId !== response.Sender) {
    //             const audio = new Audio(audioFile);
    //             audio.play();
    //             navigator.vibrate(1000);
    //         }
    //         switch (type) {
    //             case CHAT_MESSAGE:
    //                 console.log('id ', response.Id);
    //                 if (response.chatId === chat.id) {
    //                     const messageData = {
    //                         chatId: response.ChatId,
    //                         dateSent: response.DateSent,
    //                         id: response.Id,
    //                         sender: response.Sender,
    //                         text: response.Text,
    //                         uploadedFileName: response.UploadedFileName,
    //                         isRead: false
    //                     };
            
    //                     dispatch({
    //                         type: SENT_MESSAGE,
    //                         payload: messageData
    //                     });
    //                 }

    //             break;

    //             case TRANSFER_CONFIRMATION:
    //                 dispatch({
    //                     type: PAYMENT_NOTIFICATION,
    //                     payload: {
    //                         buyerHasMadePayment: response.BuyerHasMadePayment,
    //                         buyerHasRecievedPayment: response.BuyerHasRecievedPayment,
    //                         sellerHasMadePayment: response.SellerHasMadePayment, 
    //                         sellerHasRecievedPayment: response.SellerHasRecievedPayment, 
    //                         isDeleted: response.IsDeleted
    //                     }
    //                 });
    //                 break;

    //             case TRANSFER_NOTIFICATION:
    //                 dispatch({
    //                     type: PAYMENT_NOTIFICATION,
    //                     payload: {
    //                         buyerHasMadePayment: response.BuyerHasMadePayment,
    //                         buyerHasRecievedPayment: response.BuyerHasRecievedPayment,
    //                         sellerHasMadePayment: response.SellerHasMadePayment, 
    //                         sellerHasRecievedPayment: response.SellerHasRecievedPayment, 
    //                         isDeleted: response.IsDeleted
    //                     }
    //                 });
    //                 break;

    //             default:
    //                 break;
    //         }
    //     });
    // };

    return (
        <>
            <section className={classes.root}>
                <Typography variant="h5" className={classes.header}>Messages</Typography>
                <div className={classes.gridContainer}>
                    <div className={classes.messages}>
                        <Messages />
                    </div>
                    <div className={classes.conversation}>
                        {!isEmpty(chat) && 
                            <Conversation />
                        }
                    </div>
                    <div className={classes.actions}>
                        {!isEmpty(chat) && 
                            <Actions />
                        }
                    </div>
                </div>
            </section>
        </>
    );
};

Index.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default Index;
