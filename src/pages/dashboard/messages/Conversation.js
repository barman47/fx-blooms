import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, FilePdfOutline, Send } from 'mdi-material-ui';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ScrollableFeed from 'react-scrollable-feed';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';

import { sendMessage } from '../../../actions/chat';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR } from '../../../utils/constants';
import { SENT_MESSAGE } from '../../../actions/types';

import PaymentConfirmationTipsModal from './PaymentConfirmationTipsModal';
import TipsAndRecommendationsModal from './TipsAndRecommendationsModal';
import isEmpty from '../../../utils/isEmpty';
import { HUB_URL } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        border: `1px solid ${COLORS.borderColor}`,
        position: 'sticky',
        bottom: theme.spacing(1),
        left: 0,
        overflowY: 'hidden'
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
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
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

    tipsAndRecommendations: {
        backgroundColor: COLORS.lightTeal,
        color: theme.palette.primary.main,
        marginTop: theme.spacing(2)
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

    const { customerId } = useSelector(state => state.customer);
    const { chat, paymentMade, sessionId } = useSelector(state => state.chat);

    const { sendMessage } = props;

    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    // eslint-disable-next-line
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);
    const [newMessage, setNewMessage] = useState(false);

    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [loadingText, setLoadingText] = useState('');
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const paymentModal = useRef();
    const tipsAndRecommendationsModal = useRef();

    useEffect(() => {
        connectToSocket();

        // return () => {
        //     dispatch({ type: EXIT_CHAT });
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

    // useEffect(() => {
    //     if (!_.isEmpty(chat) && _.isEmpty(listings.listing)) {
    //         const listing = listings.find(item => item.id === chat.listing);
    //         dispatch({
    //             type: SET_LISTING,
    //             payload: listing
    //         });
    //     }
    // }, [chat, dispatch, listings]);

    // useEffect(() => {
    //     setNewMessage(false);
    // }, [chat]);

    useEffect(() => {
        if (connection && !connected) {
            connection.start()
                .then(() => {
                    console.log('connected');
                    setConnected(true);
                    connection.on('ReceiveNotification', message => {
                        console.log('new message ', message);
                        if (!newMessage) {
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

                    // connection.on('TransferNotification', notification => {
                    //     console.log('notification ', notification);
                    // });
                })
                .catch(err => {
                    setConnected(false);
                    console.error(err);
                });
        }
    }, [connection, dispatch, connected, newMessage]);

    const openPaymentConfirmationTipsModal = () => {
        paymentModal.current.openModal();
    };

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

    return (
        <>
            <PaymentConfirmationTipsModal ref={paymentModal} />
            <TipsAndRecommendationsModal ref={tipsAndRecommendationsModal} />
            {chat ? 
		        <section className={classes.root}>
                    <Grid container direction="row" justify="space-between" className={classes.header}>
                        <Grid item>
                            <Typography variant="subtitle1" component="p">Conversation</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" component="p" color="primary">ID: {sessionId}</Typography>
                        </Grid>
                    </Grid>
                    <ScrollableFeed className={classes.messageContainer} forceScroll={true}>
                        <div className={classes.messages}>
                                <Typography variant="subtitle2" component="span" className={classes.tipsAndRecommendations}>Ensure to read our <strong onClick={openTipsAndRecommendationsModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>tips and recommendations</strong> before you carry out any transaction</Typography>
                                {chat?.messages && chat?.messages.map((message) => (
                                    <>
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
                                    </>
                                ))}
                                {paymentMade && customerId === chat.seller &&
                                    <div className={classes.paymentNotification}>
                                        <Typography variant="subtitle1" component="p"><span className={classes.username}>{paymentMade.Sender}</span> claimes to have made the payment.</Typography>
                                        <Typography variant="subtitle1" component="p">What's next?</Typography>
                                        <ul>
                                            <li>Proceed to your banking app to confirm payment.</li>
                                            <li>See payment confirmation tips <span className={classes.paymentTips} onClick={openPaymentConfirmationTipsModal}>here.</span></li>
                                            <li>Send your money to the buyer.</li>
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="attach-file"
                                                    onClick={handleSelectAttachment}
                                                >
                                                    <Attachment />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="send-message"
                                                    onClick={onSubmit}
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