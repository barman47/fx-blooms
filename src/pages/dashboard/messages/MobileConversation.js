import { useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    AppBar,
    Button, 
    Grid, 
    IconButton, 
    InputAdornment, 
    Link, 
    TextField, 
    Toolbar,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowLeft, Attachment, InformationOutline, Send } from 'mdi-material-ui';
import { decode } from 'html-entities';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

// import ScrollableFeed from 'react-scrollable-feed'
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';
import { Document } from 'react-pdf';
// import { Page } from 'react-pdf';

import { sendMessage } from '../../../actions/chat';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR } from '../../../utils/constants';
import { SET_LISTING, SENT_MESSAGE, EXIT_CHAT } from '../../../actions/types';
import { DASHBOARD, MESSAGES } from '../../../routes';

import PaymentConfirmationTipsModal from './PaymentConfirmationTipsModal';
import isEmpty from '../../../utils/isEmpty';
import CompleteTransactionModal from './CompleteTransactionModal';

// import avatar from '../../../assets/img/avatar.jpg';

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

    otherAttachment: {
        alignSelf: 'flex-end',
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
    const dispatch = useDispatch();
    const history = useHistory();

    const { customerId } = useSelector(state => state.customer);
    const { chat, paymentMade, sessionId } = useSelector(state => state.chat);
    const listings = useSelector(state => state.listings.listings);

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

    const paymentModal = useRef();

    useEffect(() => {
        const connect = new HubConnectionBuilder().withUrl('https://api.fxblooms.com/notificationhub', {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();
        console.log(connect);
        setConnection(connect);

        return () => {
            dispatch({ type: EXIT_CHAT });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!_.isEmpty(chat) && _.isEmpty(listings.listing)) {
            const listing = listings.find(item => item.id === chat.listing);
            dispatch({
                type: SET_LISTING,
                payload: listing
            });
        }
    }, [chat, dispatch, listings]);

    useEffect(() => {
        setNewMessage(false);
    }, [chat]);

    useEffect(() => {
        if (connection && !connected) {
            connection.start()
                .then(() => {
                    console.log('connected');
                    setConnected(true);
                    connection.on('ReceiveNotification', message => {
                        if (!newMessage) {
                            setNewMessage(true);
                            let response = JSON.parse(message);
                            const newMessage = {
                                chatId: response.ChatId,
                                dateSent: response.DateSent,
                                id: response.Id,
                                sender: response.Sender,
                                text: response.Text,
                                uploadedFileName: response.UploadedFileName
                            };

                            dispatch({
                                type: SENT_MESSAGE,
                                payload: newMessage
                            });
                            setMessage('');
                        }
                    });

                    connection.on('TransferNotification', notification => {
                        console.log('notification ', notification);
                    });
                })
                .catch(err => {
                    setConnected(false);
                    console.error(err);
                });
        }
    }, [connection, dispatch, connected, newMessage]);

    const openModal = () => {
        paymentModal.current.openModal();
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

    const showCompleteTransactionModal = () => {
        setCompleteTransactionOpen(true);
    };

    const copyChatSessionId = () => {
        copy(sessionId);
        toast.success('Chat Session ID Copied!');
    };

    return (
        <>
            <Toaster />
            <PaymentConfirmationTipsModal ref={paymentModal} />
            <CompleteTransactionModal open={completeTransactionOpen} />
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
                    <section className={classes.messageContainer}>
                        <Typography variant="subtitle1" component="p" color="primary" className={classes.disclaimer}>
                            Ensure to read our <Link to="#!" color="primary" component={RouterLink} underline="always">disclaimer</Link> before you carry out any transaction.
                        </Typography>
                        <div className={classes.messages}>
                            {/* <ScrollableFeed className={classes.messages}> */}
                                {chat?.messages && chat?.messages.map((message) => (
                                    <>
                                        {!isEmpty(message.uploadedFileName) ? 
                                            (
                                                message.uploadedFileName.includes('.pdf') ? 
                                                    <div 
                                                        key={message.id} 
                                                        className={clsx(classes.attachment, {[`${classes.otherAttachment}`]: customerId !== message.sender })}
                                                    >
                                                        <Document 
                                                            file={message.uploadedFileName}
                                                        >
                                                        </Document>
                                                    </div>
                                                :
                                                <img 
                                                    key={message.id}
                                                    src={message.uploadedFileName} 
                                                    className={clsx(classes.attachment, {[`${classes.otherAttachment}`]: customerId !== message.sender })}
                                                    alt="Attachment" 
                                                />
                                            )
                                            :
                                            <Typography 
                                                key={message.id} 
                                                variant="subtitle2" 
                                                component="span" 
                                                className={clsx({[`${classes.me}`]: customerId === message.sender, [`${classes.recipient}`]: customerId !== message.sender })}
                                            >
                                                {/* {message.text} */}
                                                {decode(message.text)}
                                            </Typography>
                                        }
                                    </>
                                ))}
                                {paymentMade && 
                                    <div className={classes.paymentNotification}>
                                        <Typography variant="subtitle1" component="p"><span className={classes.username}>{paymentMade.Sender}</span> claimes to have made the payment.</Typography>
                                        <Typography variant="subtitle1" component="p">What's next?</Typography>
                                        <ul>
                                            <li>Proceed to your banking app to confirm payment.</li>
                                            <li>See payment confirmation tips <span className={classes.paymentTips} onClick={openModal}>here.</span></li>
                                            <li>Send your money to the buyer.</li>
                                        </ul>
                                    </div>
                                }
                            {/* </ScrollableFeed> */}
                        </div>
                    </section>
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

MobileConversation.propTypes = {
    sendMessage: PropTypes.func.isRequired
};

export default connect(undefined, { sendMessage })(MobileConversation);