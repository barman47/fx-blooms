import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    AppBar,
    Button, 
    Grid, 
    IconButton, 
    InputAdornment, 
    TextField, 
    Toolbar,
    Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ArrowLeft, Attachment, FilePdfOutline, InformationOutline, Send } from 'mdi-material-ui';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';

import ScrollableFeed from 'react-scrollable-feed';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';

import { sendMessage } from '../../../actions/chat';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR } from '../../../utils/constants';
import { PAYMENT_NOTIFICATION, SET_LISTING, SENT_MESSAGE, } from '../../../actions/types';
import { DASHBOARD, MESSAGES } from '../../../routes';

import TipsAndRecommendationsModal from './TipsAndRecommendationsModal';
import isEmpty from '../../../utils/isEmpty';
import { HUB_URL } from '../../../utils/constants';
import CompleteTransactionModal from './CompleteTransactionModal';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
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
    
    messageContainer: {
        height: theme.spacing(95),
        position: 'relative',
        top: 0,
        overflowY: 'scroll',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        zIndex: -1,

        [theme.breakpoints.down('lg')]: {
            height: theme.spacing(55),
        },

        [theme.breakpoints.down('md')]: {
            height: theme.spacing(95)
        },

        [theme.breakpoints.down('sm')]: {
            height: '79vh'
        }
    },
    
    disclaimer: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        fontSize: theme.spacing(1.7),
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
        padding: [[theme.spacing(1), 0]],
        textAlign: 'center'
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
        alignSelf: 'flex-end'
    },

    recipient: {
        alignSelf: 'flex-start',
        backgroundColor: `${COLORS.lightGrey} !important`,
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
    },

    paymentTips: {
        cursor: 'pointer',
        fontSize: '1rem !important',
        fontWeight: '500 !important',
        textDecoration: 'underline'
    },

    backButton: {
        backgroundColor: COLORS.white,
        marginBottom: theme.spacing(2),
        padding: [[theme.spacing(2), 0, 0, theme.spacing(2)]],
        margin: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'none',

        [theme.breakpoints.down('sm')]: {
            display: 'block'
        }
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

    const { customerId } = useSelector(state => state.customer);
    const { chat, sessionId } = useSelector(state => state.chat);
    const listings = useSelector(state => state.listings.listings);
    const [chatDisabled, setChatDisabled] = useState(false);

    const { sendMessage } = props;

    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    // eslint-disable-next-line
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);
    const [newMessage, setNewMessage] = useState(false);

    const [completeTransactionOpen, setCompleteTransactionOpen] = useState(false);

    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [loadingText, setLoadingText] = useState('');
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const tipsAndRecommendationsModal = useRef();

    useEffect(() => {
        props.handleSetTitle('Mobile Conversation');
        if (isDeleted) {
            setChatDisabled(true);
        }
        connectToSocket();

        // return () => {
        //     dispatch({ type: REMOVE_CHAT });
        // };
        // eslint-disable-next-line
    }, []);

    const connectToSocket = () => {
        const connect = new HubConnectionBuilder().withUrl(HUB_URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();
        console.log(connect);
        setConnection(connect);
    };

    useEffect(() => {
        if (!_.isEmpty(chat) && _.isEmpty(listings.listing) && matches) {
            const listing = listings.find(item => item.id === chat.listing);
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
        }
    }, [chat, dispatch, listings, matches]);

    useEffect(() => {
        if (isDeleted) {
            setChatDisabled(true);
        }
    }, [isDeleted]);

    useEffect(() => {
        if (matches) {
            setNewMessage(false);
        }
    }, [chat, matches]);

    useEffect(() => {
        if (connection && !connected) {
            connection.start()
                .then(() => {
                    console.log('connected');
                    setConnected(true);
                    connection.on('ReceiveNotification', message => {
                        // setNewMessage(true);
                        // let response = JSON.parse(message);
                        // const newMessage = {
                        //     chatId: response.ChatId,
                        //     dateSent: response.DateSent,
                        //     id: response.Id,
                        //     sender: response.Sender,
                        //     text: response.Text,
                        //     uploadedFileName: response.UploadedFileName
                        // };

                        // dispatch({
                        //     type: SENT_MESSAGE,
                        //     payload: newMessage
                        // });
                        // setMessage('');

                        if (!newMessage && chat) {
                            setNewMessage(true);
                            let response = JSON.parse(message);
                            const messageData = {
                                chatId: response.ChatId,
                                dateSent: response.DateSent,
                                id: response.Id,
                                sender: response.Sender,
                                text: response.Text,
                                uploadedFileName: response.UploadedFileName
                            };

                            dispatch({
                                type: SENT_MESSAGE,
                                payload: messageData
                            });
                            setMessage('');
                        }
                    });

                    connection.on('TransferNotification', notification => {
                        const notificationData = JSON.parse(notification);
                        dispatch({
                            type: PAYMENT_NOTIFICATION,
                            payload: {
                                buyerHasMadePayment: notificationData.BuyerHasMadePayment,
                                buyerHasRecievedPayment: notificationData.BuyerHasRecievedPayment,
                                sellerHasMadePayment: notificationData.SellerHasMadePayment, 
                                sellerHasRecievedPayment: notificationData.SellerHasRecievedPayment, 
                                isDeleted: notificationData.IsDeleted
                            }
                        });
                        
                    });
                    connection.on('TransferConfrimation', notification => {
                        const notificationData = JSON.parse(notification);
                        dispatch({
                            type: PAYMENT_NOTIFICATION,
                            payload: {
                                buyerHasMadePayment: notificationData.BuyerHasMadePayment,
                                buyerHasRecievedPayment: notificationData.BuyerHasRecievedPayment,
                                sellerHasMadePayment: notificationData.SellerHasMadePayment, 
                                sellerHasRecievedPayment: notificationData.SellerHasRecievedPayment, 
                                isDeleted: notificationData.IsDeleted
                            }
                        });
                    });
                })
                .catch(err => {
                    setConnected(false);
                    console.error(err);
                });
        }
    }, [connection, chat, customerId, dispatch, connected, matches, newMessage]);

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
            console.log(res);
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

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isEmpty(message)) {
            const chatMessage = {
                chatSessionId: sessionId,
                message,
                documentName: ''
            };
    
            sendMessage(chatMessage);
        }
    };

    const handleSelectAttachment = () => document.getElementById('attachment').click();

    // const handleSetAttachment = (e) => {
    //     // setAttachment(e.target.files[0]);
    //     const reader = new FileReader();

    //     reader.onload = (() => {
    //         const file = reader.result; //Array Buffer
    //         setAttachment(file);
    //     });
    //     reader.readAsDataURL(e.target.files[0]);
    // };

    const goBack = () => history.push(`${DASHBOARD}${MESSAGES}`);

    // const openTipsAndRecommendationsModal = () => {
    //     tipsAndRecommendationsModal.current.openModal();
    // };

    const showCompleteTransactionModal = () => {
        setCompleteTransactionOpen(true);
    };

    const handleCloseCompleteTransactionModal = () => {
        setCompleteTransactionOpen(false);
    };

    const copyChatSessionId = () => {
        copy(sessionId);
        toast.success('Chat Session ID Copied!');
    };

    return (
        <>
            <Toaster />
            <CompleteTransactionModal open={completeTransactionOpen} handleCloseModal={handleCloseCompleteTransactionModal} />
            <TipsAndRecommendationsModal ref={tipsAndRecommendationsModal} />
            {chat ? 
		        <section className={classes.root}>
                    <AppBar position="static" color="transparent" elevation={1}>
                        <Toolbar>
                            <section className={classes.headerContainer}>
                                <IconButton edge="start" color="primary" aria-label="back" onClick={goBack}>
                                    <ArrowLeft />
                                </IconButton>
                                <div>
                                    <Button color="primary" variant="outlined" size="small" onClick={showCompleteTransactionModal}>
                                        Complete Transaction
                                    </Button>
                                    <IconButton 
                                        edge="start" color="primary" aria-label="copyChatSessionId" onClick={copyChatSessionId} style={{ marginLeft: '5px' }}>
                                        <InformationOutline />
                                    </IconButton>
                                </div>
                            </section>
                        </Toolbar>
                    </AppBar>
                    <ScrollableFeed className={classes.messageContainer} forceScroll={true}>
                        {/* <Typography variant="subtitle1" component="p" color="primary" className={classes.disclaimer}>
                            Ensure to read our <strong onClick={openTipsAndRecommendationsModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>tips and recommendations</strong> before you carry out any transaction
                        </Typography> */}
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
                                    <Typography variant="subtitle1" component="p"><span className={classes.username}>{buyerUsername}</span> claimes to have made the payment.</Typography>
                                    <ul>
                                        <li>Proceed to your banking app to confirm payment.</li>
                                        <li>Once NGN is received, click on Payment Received button. <br /><strong>N.B: Do not rely on payment receipt or screenshots of payments.</strong></li>
                                        <li>Send the EUR equivalent to the account provided by the buyer and click on I’ve made payment.</li>
                                    </ul>
                                </div>
                            }

                            {customerId === buyer && sellerHasMadePayment &&
                                <div className={classes.paymentNotification}>
                                    <Typography variant="subtitle1" component="p"><span className={classes.username}>{sellerUsername}</span> claimes to have made the payment.</Typography>
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
                                    disabled={chatDisabled}
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
                                    disabled={chatDisabled}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="attach-file"
                                                    onClick={handleSelectAttachment}
                                                    disabled={chatDisabled}
                                                >
                                                    <Attachment />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="send-message"
                                                    onClick={onSubmit}
                                                    disabled={chatDisabled}
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

MobileConversation.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    handleSetTitle:PropTypes.func.isRequired
};

export default connect(undefined, { sendMessage })(MobileConversation);