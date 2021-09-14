import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    AppBar,
    Grid, 
    IconButton, 
    InputAdornment, 
    TextField, 
    Toolbar,
    Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ArrowLeft, Attachment, FilePdfOutline, ContentCopy, Send } from 'mdi-material-ui';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

import ScrollableFeed from 'react-scrollable-feed';

import { sendMessage } from '../../../actions/chat';
import { PAYMENT_NOTIFICATION, SENT_MESSAGE } from '../../../actions/types';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR, NOTIFICATION_TYPES } from '../../../utils/constants';

import SellerNoticeModal from './SellerNoticeModal';
import TipsAndRecommendationsModal from './TipsAndRecommendationsModal';
import isEmpty from '../../../utils/isEmpty';
import { DASHBOARD, MESSAGES } from '../../../routes';
import SignalRService from '../../../utils/SignalRController';
import audioFile from '../../../assets/sounds/notification.mp3';

import MobileActions from './MobileActions';

const useStyles = makeStyles(theme => ({
    root: {
        // height: '100%',
        height: '93vh',
        border: `1px solid ${COLORS.borderColor}`,
        position: 'sticky',
        bottom: theme.spacing(1),
        left: 0,
        overflowY: 'hidden'
    },

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },

    container: {
        overflowY: 'scroll',
    },
    
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '45vh',
        // height: theme.spacing(50),
        position: 'relative',
        top: 0,
        // overflowY: 'scroll',
        // padding: theme.spacing(1, 2),
        padding: [[theme.spacing(1), theme.spacing(2), 0, theme.spacing(2)]],
        zIndex: -1,
    },
    
    messages: {
        display: 'flex',
        flexDirection: 'column',
        // flexGrow: 1,
        gap: theme.spacing(1),
        // height: '10vh',
        // overflowY: 'scroll',
        paddingBottom: theme.spacing(1),
        position: 'relative',
        zIndex: 2,

        // overflowY: ["hidden", "-moz-scrollbars-none"],
        // scrollbarWidth: "none",
        // msOverflowStyle: "none",

        // '&::-webkit-scrollbar': {
        //     display: 'none'
        // },

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
        width: '50%'
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
    }
}));
const MobileConversation = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const history = useHistory();

    const buyer = useSelector(state => state.chat?.chat?.buyer);
    const buyerHasMadePayment = useSelector(state => state.chat?.chat?.buyerHasMadePayment);
    const buyerUsername = useSelector(state => state.chat?.chat?.buyerUsername);
    const seller = useSelector(state => state.chat?.chat?.seller);
    const sellerHasMadePayment = useSelector(state => state.chat?.chat?.sellerHasMadePayment);
    const sellerUsername = useSelector(state => state.chat?.chat?.sellerUsername);
    const isDeleted = useSelector(state => state.chat?.chat?.isDeleted);

    const { customerId, userName } = useSelector(state => state.customer);
    const { chat, sessionId } = useSelector(state => state.chat);

    const { sendMessage } = props;

    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    // eslint-disable-next-line
    const [attachmentUrl, setAttachmentUrl] = useState('');

    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [loadingText, setLoadingText] = useState('');
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const tipsAndRecommendationsModal = useRef();
    
    useEffect(() => {
        props.handleSetTitle('Mobile Conversation');
        handleSentMessage();
        return () => {
            // dispatch({ type: REMOVE_CHAT });
            SignalRService.closeNotifications();
        };
        // eslint-disable-next-line
    }, []);

    const handleSentMessage = () => {
        // const { CHAT_MESSAGE, TRANSFER_CONFIRMATION, TRANSFER_NOTIFICATION } = NOTIFICATION_TYPES;
        // SignalRService.registerReceiveNotification((data, type) => {
        //     let response = JSON.parse(data);
        //     // console.log('New Notification ', response, type);
        //     switch (type) {
        //         case CHAT_MESSAGE:
        //             if (customerId !== response.Sender) {
        //                 const audio = new Audio(audioFile);
        //                 audio.play();
        //             }
        //             const messageData = {
        //                 chatId: response.ChatId,
        //                 dateSent: response.DateSent,
        //                 id: response.Id,
        //                 sender: response.Sender,
        //                 text: response.Text,
        //                 uploadedFileName: response.UploadedFileName
        //             };
        
        //             dispatch({
        //                 type: SENT_MESSAGE,
        //                 payload: messageData
        //             });

        //             break;

        //         case TRANSFER_CONFIRMATION:
        //             dispatch({
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
        //             dispatch({
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
    };

    // End transaction and disable chat
    // useEffect(() => {
    //     if (isDeleted && !chatDisabled) {
    //         console.log('ending transaction');
    //         endTransactionModal.current.openModal();
    //         setChatDisabled(true);
    //     }
    // }, [chatDisabled, isDeleted]);

    // const openPaymentConfirmationTipsModal = () => {
    //     paymentModal.current.openModal();
    // };

    const openTipsAndRecommendationsModal = () => {
        tipsAndRecommendationsModal.current.openModal();
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
            //     payload: chatMessage
            // });
            // sendMessage(chatMessage);
            setMessage('');
        }
    };

    const handleSelectAttachment = () => document.getElementById('attachment').click();

    const copyChatSessionId = () => {
        copy(sessionId);
        toast.success('Copied Conversation ID!');
    };

    const goBack = () => history.push(`${DASHBOARD}${MESSAGES}`);

    return (
        <>
            <Toaster />
            <TipsAndRecommendationsModal ref={tipsAndRecommendationsModal} />
            { (customerId === buyer && chat.buyerAcceptedTransactionTerms === false) && <SellerNoticeModal /> }
            { (customerId === seller && chat.sellerAcceptedTransactionTerms === false) && <SellerNoticeModal /> }
            <section className={classes.root}>
                <AppBar position="static" color="transparent" elevation={1}>
                    <Toolbar>
                        <section className={classes.headerContainer}>
                            <IconButton edge="start" color="primary" aria-label="back" onClick={goBack}>
                                <ArrowLeft />
                            </IconButton>
                            <div>
                                <Typography variant="subtitle2" component="small">Conversation ID: ...{sessionId.substring(sessionId.length - 3)}</Typography>
                                <IconButton 
                                    edge="start" color="primary" aria-label="copyChatSessionId" onClick={copyChatSessionId} style={{ marginLeft: '5px' }}>
                                    <ContentCopy />
                                </IconButton>
                            </div>
                        </section>
                    </Toolbar>
                </AppBar>
                <ScrollableFeed className={classes.messageContainer} forceScroll={true}>
                    <div className={classes.messages}>
                        {chat?.messages && matches && chat?.messages.map((message) => (
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
                </ScrollableFeed>
                <MobileActions showTipsAndRecommendations={openTipsAndRecommendationsModal} />
            </section>
        </>
    );
};

MobileConversation.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    handleSetTitle:PropTypes.func.isRequired
};

export default connect(undefined, { sendMessage })(MobileConversation);