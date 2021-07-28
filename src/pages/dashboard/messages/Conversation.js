import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, Send } from 'mdi-material-ui';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import _ from 'lodash';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';

import { sendMessage } from '../../../actions/chat';
import { COLORS, ATTACHMENT_LIMIT, NETWORK_ERROR } from '../../../utils/constants';
import { SET_LISTING, SENT_MESSAGE, EXIT_CHAT } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';

// import avatar from '../../../assets/img/avatar.jpg';

const useStyles = makeStyles(theme => ({
    root: {
        // border: '1px solid red'
        height: '100%',
        borderBottom: `1px solid ${COLORS.borderColor}`,
        borderRight: `1px solid ${COLORS.borderColor}`,
        borderTop: `1px solid ${COLORS.borderColor}`,
        position: 'relative',
        top: 0,
        left: 0,
        overflowY: 'scroll',
    },
    
    header: {
        backgroundColor: COLORS.lightTeal,
        padding: theme.spacing(3),
        // position: 'fixed',
        top: 0,
        left: 0,
        width: '100%'
    },
    
    messageContainer: {
        border: '1px solid red',
        height: '100%',
        // overflowY: 'scroll',
        padding: [[0, theme.spacing(3)]],
        position: 'relative',
        top: 0,
        left: 0,
        // paddingBottom: theme.spacing(10),
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
        // display: 'grid',
        // gridTemplateColumns: '1fr',
        // gridAutoFlow: 'row',
        gap: theme.spacing(1),
        overflowY: 'scroll',
        position: 'relative',
        zIndex: 2,

        '& span': {
            borderRadius: theme.shape.borderRadius,
            display: 'inline-block',
            fontSize: theme.spacing(1.5),
            fontWeight: 300,
            padding: theme.spacing(1),
            width: '75%'
        }
    },

    me: {
        backgroundColor: '#069595',
        flexBasis: 'initial',
        flexGrow: 1,
        flexShrink: 0,
        border: '1px solid red',
        color: COLORS.offWhite,
        alignSelf: 'flex-end'
    },

    recipient: {
        backgroundColor: `${COLORS.lightGrey} !important`,
        flexBasis: 'initial',
        border: '1px solid red',
        // color: COLORS.grey,
    },

    input: {
        backgroundColor: COLORS.lightTeal,
        border: 'none !important'
    },

    form: {
        position: 'fixed',
        bottom: 0
    }
}));
const Conversation = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { customerId } = useSelector(state => state.customer);
    const { chat, sessionId } = useSelector(state => state.chat);
    const listings = useSelector(state => state.listings.listings);

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

    // useEffect(() => {
    //     console.log('setting messages');
    //     if (chat?.messages?.length > 0) {
    //         setMessageList(chat?.messages);
    //     }
    // }, [chat?.messages]);

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
                            // Notification.open({
                            //     message: 'New Notification',
                            //     description: message
                            // });
                        }
                    });
                })
                .catch(err => {
                    setConnected(false);
                    console.error(err);
                });
        }
    }, [connection, dispatch, connected, newMessage]);

    const uploadAttachment = useCallback(async () => {
        try {
            if (attachment.size / ATTACHMENT_LIMIT > 1) {
                return setErrors({ msg: 'File too large', photo: 'Photo must not be greater than 3MB' });
            }

            setLoadingText('Sending File . . ');
            setLoading(true);
            const data = new FormData();
            data.append(`${attachment.name}`, attachment);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setAttachmentUrl(res.data.fileName);
            setLoading(false);
            console.log(res);
            
            const chatMessage = {
                chatSessionId: sessionId,
                message: '',
                documentName: res.data.fileName
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

    return (
        <>
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
                    <section className={classes.messageContainer}>
                        <Typography variant="subtitle1" component="p" color="primary" className={classes.disclaimer}>
                            Ensure to read our <Link to="#!" color="primary" component={RouterLink} underline="always">disclaimer</Link> before you carry out any transaction.
                        </Typography>
                        <div className={classes.messages}>
                            {chat?.messages && chat.messages.map((message) => (
                                <>
                                {!isEmpty(message.uploadedFileName) ? 
                                    <a key={message.id} href={message.uploadedFileName}>attachment</a>
                                    :
                                    <Typography 
                                        key={message.id} 
                                        variant="subtitle2" 
                                        component="span" 
                                        className={clsx({[`${classes.me}`]: customerId === message.sender, [`${classes.recipient}`]: customerId !== message.sender })}
                                    >
                                        {message.text}
                                    </Typography>
                                }
                                </>
                            ))}
                        </div>
                        <form onSubmit={onSubmit} noValidate className={classes.form}>
                            <Grid container direction="row">
                                <TextField 
                                        onChange={(e) =>setAttachment(e.target.files[0])}
                                        id="attachment"
                                        style={{ display: 'none' }}
                                        type="file"
                                        variant="outlined" 
                                        accept=".png,.jpg,.pdf.,doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        fullWidth
                                        required
                                    />
                                <Grid item>
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