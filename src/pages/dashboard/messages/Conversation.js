import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, ContentCopy, FilePdfOutline, Send } from 'mdi-material-ui';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ScrollableFeed from 'react-scrollable-feed';

import { sendMessage } from '../../../actions/chat';
import { SENT_MESSAGE, PAYMENT_NOTIFICATION, UPDATE_ACTIVE_CHAT, CUSTOMER_CANCELED } from '../../../actions/types';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR, NOTIFICATION_TYPES } from '../../../utils/constants';
import copy from 'copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';

import EndTransactionModal from './EndTransactionModal';
import PaymentConfirmationTipsModal from './PaymentConfirmationTipsModal';
import SellerNoticeModal from './SellerNoticeModal';
import TipsAndRecommendationsModal from './TipsAndRecommendationsModal';
import isEmpty from '../../../utils/isEmpty';
import SignalRService from '../../../utils/SignalRController';
import audioFile from '../../../assets/sounds/notification.mp3';
import CustomerCanceledModal from './CustomerCanceledModal';

import { DASHBOARD, DASHBOARD_HOME } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        border: `1px solid ${COLORS.borderColor}`,
        position: 'sticky',
        bottom: theme.spacing(1),
        left: 0,
        // overflowY: 'hidden',

        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    
    header: {
        backgroundColor: COLORS.lightTeal,
        padding: theme.spacing(3),
        position: 'sticky',
        top: 0,
        left: 0,

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1)
        }
    },
    
    messageContainer: {
        // height: '55%',
        height: theme.spacing(95),
        position: 'relative',
        top: 0,
        overflowY: 'scroll',
        // paddingBottom: theme.spacing(5),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        zIndex: -1,

        [theme.breakpoints.down('lg')]: {
            height: theme.spacing(55),
        },

        [theme.breakpoints.down('md')]: {
            // border: '1px solid red',
            height: theme.spacing(95)
        },

        [theme.breakpoints.down('sm')]: {
            height: theme.spacing(10)
        }
    },
    
    messages: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        gap: theme.spacing(1),
        height: '68vh',
        // overflowY: 'scroll',
        paddingBottom: theme.spacing(1),
        position: 'relative',
        zIndex: 2,

        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },

        [theme.breakpoints.down('lg')]: {
            height: '55vh',
        },

        '& span': {
            borderRadius: theme.shape.borderRadius,
            display: 'inline-block',
            fontSize: theme.spacing(1.5),
            fontWeight: 300,
            padding: theme.spacing(1)
        }
    },

    me: {
        backgroundColor: '#069595',
        color: COLORS.offWhite,
        alignSelf: 'flex-end',
        maxWidth: '50%'
    },

    recipient: {
        alignSelf: 'flex-start',
        backgroundColor: `${COLORS.lightGrey} !important`,
        maxWidth: '50%'
    },

    input: {
        backgroundColor: COLORS.lightTeal,
        border: 'none !important',
        width: '100%'
    },

    form: {
        position: 'sticky',
        bottom: 0,
        width: '100%',
        zIndex: 2
    },

    attachment: {
        borderRadius: theme.shape.borderRadius,
        width: '40%'
    },

    downloadLink: {
        color: '#db2219',
        textDecoration: 'none',

        '& div': {
            display: 'flex',
            flexDirection: 'column'
        }
    },

    downloadIcon: {
        fontSize: theme.spacing(10),
        float: 'right'
    },

    myAttachment: {
        alignSelf: 'flex-end'
    },

    paymentNotification: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),

        '& p': {
            color: theme.palette.primary.main,
            fontWeight: 300
        },

        '& ul li': {
            color: theme.palette.primary.main,
            fontWeight: 300
        }
    },

    username: {
        fontSize: '1rem !important',
        fontWeight: '500 !important'
    },

    paymentTips: {
        cursor: 'pointer',
        fontSize: '1rem !important',
        fontWeight: '500 !important',
        textDecoration: 'underline'
    }
}));

const Conversation = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { customerId, userName } = useSelector(state => state.customer);
    const { chat, customerCanceled, sessionId } = useSelector(state => state.chat);
    const buyer = useSelector(state => state.chat?.chat?.buyer);
    const buyerHasMadePayment = useSelector(state => state.chat?.chat?.buyerHasMadePayment);
    const buyerUsername = useSelector(state => state.chat?.chat?.buyerUsername);
    const seller = useSelector(state => state.chat?.chat?.seller);
    const sellerHasMadePayment = useSelector(state => state.chat?.chat?.sellerHasMadePayment);
    const sellerUsername = useSelector(state => state.chat?.chat?.sellerUsername);
    const isDeleted = useSelector(state => state.chat?.chat?.isDeleted);

    const { sendMessage } = props;

    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    // eslint-disable-next-line
    const [attachmentUrl, setAttachmentUrl] = useState('');

    // const [chatDisabled, setChatDisabled] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [loadingText, setLoadingText] = useState('');
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const endTransactionModal = useRef();
    const paymentModal = useRef();
    const tipsAndRecommendationsModal = useRef();
    const customerCanceledModal = useRef();

    useEffect(() => {
        handleSentMessage();
        return () => {
            dispatch({ type: UPDATE_ACTIVE_CHAT });
            // dispatch({ type: REMOVE_CHAT });
            SignalRService.closeNotifications();
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (customerCanceled !== null) {
            customerCanceledModal.current.openModal();
            customerCanceledModal.current.setModalText(customerCanceled);
        }
    }, [customerCanceled]);

    const handleSentMessage = () => {
        const { CHAT_MESSAGE, TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION, CANCEL_NEGOTIATION } = NOTIFICATION_TYPES;
        SignalRService.registerReceiveNotification((data, type) => {
            let response = JSON.parse(data);
            let payload, senderId;
            console.log('New Notification ', response, type);
            if (customerId !== response.Sender) {
                const audio = new Audio(audioFile);
                audio.play();
                navigator.vibrate(1000);
            }
            switch (type) {
                case CHAT_MESSAGE:
                    const messageData = {
                        chatId: response.ChatId,
                        dateSent: response.DateSent,
                        id: response.Id,
                        sender: response.Sender,
                        text: response.Text,
                        uploadedFileName: response.UploadedFileName,
                        isRead: false
                    };
        
                    dispatch({
                        type: SENT_MESSAGE,
                        payload: { message: messageData, customerId }
                    });

                break;

                case TRANSFER_CONFIRMATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;

                    dispatch({
                        type: PAYMENT_NOTIFICATION,
                        payload: {
                            buyerHasMadePayment: payload.Chat.BuyerHasMadePayment,
                            buyerHasRecievedPayment: payload.Chat.BuyerHasRecievedPayment,
                            sellerHasMadePayment: payload.Chat.SellerHasMadePayment, 
                            sellerHasRecievedPayment: payload.Chat.SellerHasRecievedPayment, 
                            isDeleted: payload.Chat.IsDeleted,
                            customerId,
                            senderId,
                            transactionType: type
                        }
                    });
                    
                    break;

                case TRANSFER_NOTIFICATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;

                    dispatch({
                        type: PAYMENT_NOTIFICATION,
                        payload: {
                            buyerHasMadePayment: payload.BuyerHasMadePayment,
                            buyerHasRecievedPayment: payload.BuyerHasRecievedPayment,
                            sellerHasMadePayment: payload.SellerHasMadePayment, 
                            sellerHasRecievedPayment: payload.SellerHasRecievedPayment, 
                            isDeleted: payload.IsDeleted,
                            customerId,
                            senderId,
                            transactionType: type
                        }
                    });    

                    break;

                case CANCEL_NEGOTIATION:
                    payload = JSON.parse(response.Payload);
                    senderId = response.SenderId;
                    
                    if (senderId !== customerId) {
                        dispatch({ 
                            type: CUSTOMER_CANCELED,
                            payload: `Hi, this transaction has been canceled by the other user`
                        });
                    }
                    break;

                default:
                    break;
            }
        });
    };

    const uploadAttachment = useCallback(async () => {
        try {
            if (attachment.size / ATTACHMENT_LIMIT > 1) {
                return setErrors({ msg: 'File too large', photo: 'Photo must not be greater than 3MB' });
            }

            setLoadingText('Sending File . . ');
            setLoading(true);
            const data = new FormData();
            data.append(`${attachment.name}`, attachment);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/UploadV2`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setAttachmentUrl(res.data);
            setLoading(false);
            
            const chatMessage = {
                chatSessionId: sessionId,
                message: '',
                documentName: res.data
            };

            sendMessage(chatMessage);
        } catch (err) {
            return handleError(err, 'attachment', 'File not sent');
        }
    }, [attachment, sessionId, sendMessage]);

    useEffect(() => {
        if (attachment) {
            uploadAttachment();
        }
    }, [attachment, uploadAttachment]);

    const handleError = (err, key, msg) => {
        console.log(err.response);
        console.error(err);
        setLoading(false);
        if (err?.message === NETWORK_ERROR) {
            return setErrors({ msg:  NETWORK_ERROR });    
        }

        return setErrors({ [`${key}`]: msg || 'Upload Failed' });
    };

    const handleSendMessage = (message) => {
        SignalRService.sendMessage(JSON.stringify(message));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isEmpty(message)) {
            // const chatMessage = {
            //     chatSessionId: sessionId,
            //     message,
            //     documentName: '',
            // };
            const chatMessage = {
                chatSessionId: sessionId,
                message,
                documentName: '',
                senderId: customerId,
                userName
            };

            handleSendMessage(chatMessage);
            // dispatch({
            //     type: SENT_MESSAGE,
            //     payload: {
            //         chatId: chatMessage.chatSessionId,
            //         // dateSent: chatMessage.DateSent,
            //         // id: chatMessage.Id,
            //         sender: chatMessage.senderId,
            //         text: chatMessage.message,
            //         uploadedFileName: chatMessage.documentName,
            //         // isRead: false
            //     }
            // });
            // sendMessage(chatMessage);
            setMessage('');
        }
    };

    const copyChatSessionId = () => {
        copy(sessionId);
        toast.success('Copied Conversation ID!');
    };

    const handleSelectAttachment = () => document.getElementById('attachment').click();

    const clearCustomerCanceled = () => {
        dispatch({
            type: CUSTOMER_CANCELED,
            payload: null
        });

        return history.push(`${DASHBOARD}${DASHBOARD_HOME}`);
    };

    return (
        <>
            <Toaster />
            <CustomerCanceledModal ref={customerCanceledModal} dismissAction={clearCustomerCanceled} />
            <EndTransactionModal ref={endTransactionModal} />
            <PaymentConfirmationTipsModal ref={paymentModal} />
            <TipsAndRecommendationsModal ref={tipsAndRecommendationsModal} />
            { (customerId === buyer && chat.buyerAcceptedTransactionTerms === false) && <SellerNoticeModal /> }
            { (customerId === seller && chat.sellerAcceptedTransactionTerms === false) && <SellerNoticeModal /> }
            {chat ? 
		        <section className={classes.root}>
                    <Grid container direction="row" justify="space-between" className={classes.header}>
                        <Grid item>
                            <Typography variant="subtitle1" component="p">Conversation</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" component="p" color="primary">
                                ID: {sessionId}
                                <Tooltip title="Copy Conversation ID" aria-label="Conversation ID" arrow>
                                    <IconButton
                                        edge="start"
                                        color="primary" 
                                        aria-label="copyChatSessionId" 
                                        onClick={copyChatSessionId} 
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </Tooltip>
                            </Typography>
                        </Grid>
                    </Grid>
                    <ScrollableFeed className={classes.messageContainer} forceScroll={true}>
                        <div className={classes.messages}>
                            {chat?.messages && chat?.messages.map((message) => (
                                <Fragment key={uuidv4()}>
                                    {!isEmpty(message.uploadedFileName) ? 
                                        (
                                            message.uploadedFileName.includes('.pdf') ? 
                                                <div 
                                                    key={uuidv4()}
                                                    className={clsx(classes.attachment, {[`${classes.myAttachment}`]: customerId === message.sender })}
                                                >
                                                    <a href={message.uploadedFileName} className={classes.downloadLink} download>
                                                        <div>
                                                            <FilePdfOutline className={classes.downloadIcon} />
                                                            <Typography variant="subtitle2"component="span" style={{ color: '#333333' }}>Attachment</Typography>
                                                        </div>
                                                    </a>
                                                </div>
                                            :
                                            <img 
                                                key={uuidv4()}
                                                src={message.uploadedFileName} 
                                                className={clsx(classes.attachment, {[`${classes.myAttachment}`]: customerId === message.sender })}
                                                alt="Attachment" 
                                            />
                                        )
                                        :
                                        <Typography 
                                            key={uuidv4()} 
                                            variant="subtitle2" 
                                            component="span" 
                                            className={clsx({[`${classes.me}`]: customerId === message.sender, [`${classes.recipient}`]: customerId !== message.sender })}
                                        >
                                            {decode(message.text)}
                                        </Typography>
                                    }
                                </Fragment>
                            ))}
                            {customerId === seller && buyerHasMadePayment &&
                                <div className={classes.paymentNotification}>
                                    <Typography variant="subtitle1" component="p"><span className={classes.username}>{buyerUsername}</span> claims to have made the payment.</Typography>
                                    <ul>
                                        <li>Proceed to your banking app to confirm payment.</li>
                                        <li>Once NGN is received, click on Payment Received button. <br /><strong>N.B: Do not rely on payment receipt or screenshots of payments.</strong></li>
                                        <li>Send the EUR equivalent to the account provided by the buyer and click on I’ve made payment.</li>
                                    </ul>
                                </div>
                            }
                            {customerId === buyer && sellerHasMadePayment &&
                                <div className={classes.paymentNotification}>
                                    <Typography variant="subtitle1" component="p"><span className={classes.username}>{sellerUsername}</span> claims to have made the payment.</Typography>
                                    <ul>
                                        <li>Please confirm receiving the EUR payment by clicking on Payment Received button.<br /><strong>N.B: EUR transfer can take up to 3 days in some cases.</strong></li>
                                        <li>Reach out to our support via <a href="mailto:support@fxblooms.com">support@fxblooms.com</a> if you do not receive the money after 4 days.</li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </ScrollableFeed>
                    <form onSubmit={onSubmit} noValidate className={classes.form}>
                        <Grid container direction="row">
                            <TextField 
                                onChange={(e) =>setAttachment(e.target.files[0])}
                                id="attachment"
                                style={{ display: 'none' }}
                                type="file"
                                variant="outlined" 
                                fullWidth
                                required
                                disabled={isDeleted}
                                inputProps={{
                                    accept: ".png,.jpg,.pdf"
                                }}
                            />
                            <Grid item xs={12}>
                                <TextField 
                                    className={classes.input}
                                    type="text"
                                    variant="outlined"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.ctrlKey && e.key === 'Enter') {
                                            return e.persist();
                            
                                            // return e.target.value + '\n';
                                        }

                                        if (e.code === 'Enter') {
                                            return onSubmit(e);
                                        }
                                    }}
                                    placeholder="Enter message"
                                    multiline
                                    rows={1}
                                    fullWidth
                                    disabled={isDeleted}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="attach-file"
                                                    onClick={handleSelectAttachment}
                                                    disabled={isDeleted}
                                                >
                                                    <Attachment />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="send-message"
                                                    onClick={onSubmit}
                                                    disabled={isDeleted}
                                                >
                                                    <Send />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </section>
                :
                <div></div>
            }
        </>
    );
};

Conversation.propTypes = {
    sendMessage: PropTypes.func.isRequired
};

export default connect(undefined, { sendMessage })(Conversation);