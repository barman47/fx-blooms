import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, Send } from 'mdi-material-ui';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// import axios from 'axios';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';

import { sendMessage } from '../../../actions/chat';
import { COLORS } from '../../../utils/constants';
import { SENT_MESSAGE } from '../../../actions/types';

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
        display: 'grid',
        gridTemplateColumns: '1fr',
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
        color: COLORS.offWhite,
        justifySelf: 'flex-end'
    },

    recipient: {
        backgroundColor: `${COLORS.lightGrey} !important`,
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

    const [message, setMessage] = useState('');
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const connect = new HubConnectionBuilder().withUrl('https://api.fxblooms.com/notificationhub', {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).configureLogging(LogLevel.Information).withAutomaticReconnect().build();
        console.log(connect);
        setConnection(connect);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('connected');
                    connection.on('ReceiveNotification', message => {
                        console.log('message received ', message);

                        const { chatSessionId, ...rest } = message;
                        dispatch({
                            type: SENT_MESSAGE,
                            payload: { ...rest }
                        });
                        setMessage('');
                        // Notification.open({
                        //     message: 'New Notification',
                        //     description: message
                        // });
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [connection, dispatch]);

    const onSubmit = async (e) => {
        e.preventDefault();

        // const chatMessage = {
        //     user: customerId,
        //     message
        // };

        const chatMessage = {
            chatSessionId: sessionId,
            message,
            documentName: 'document'
        };

        props.sendMessage(chatMessage);

        // if (connection.connectionStarted) {
        //     try {
        //         await connection.send('ReceiveNotification', chatMessage);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }
    };

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
                            Ensure to read our <Link color="primary" component={RouterLink} underline="always">disclaimer</Link> before you carry out any transaction.
                        </Typography>
                        <div className={classes.messages}>
                            {chat?.messages && chat.messages.map((message, index) => (
                                <Typography 
                                    key={index} 
                                    variant="subtitle2" 
                                    component="span" 
                                    className={clsx({[`${classes.me}`]: customerId === message.sender, [`${classes.recipient}`]: customerId !== message.sender })}
                                >
                                    {message.text}
                                </Typography>
                            ))}
                        </div>
                        <form onSubmit={onSubmit} noValidate className={classes.form}>
                            <Grid container direction="row">
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