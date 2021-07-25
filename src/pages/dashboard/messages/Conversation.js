import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, Send } from 'mdi-material-ui';
// import axios from 'axios';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { HubConnection } from '@microsoft/signalr';

import { COLORS } from '../../../utils/constants';

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
        left: 0
    },
    
    header: {
        backgroundColor: COLORS.lightTeal,
        padding: theme.spacing(3)
    },
    
    messageContainer: {
        border: '1px solid red',
        height: '100%',
        padding: [[0, theme.spacing(3)]],
        position: 'relative',
        top: 0,
        left: 0
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
        
    },

    messageField: {
        outline: 'none',
    }
}));
const Conversation = () => {
    const classes = useStyles();
    const { customerId } = useSelector(state => state.customer);

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
                        Notification.open({
                            message: 'New Notification',
                            description: message
                        });
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [connection]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const chatMessage = {
            user: customerId,
            message
        };

        if (connection.connectionStarted) {
            try {
                await connection.send('ReceiveNotification', chatMessage);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
		<section className={classes.root}>
			<Grid container direction="row" justify="space-between" className={classes.header}>
                <Grid item>
                    <Typography variant="subtitle1" component="p">Conversation</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" component="p" color="primary">ID: 888839JJU38</Typography>
                </Grid>
            </Grid>
            <section className={classes.messageContainer}>
                <Typography variant="subtitle1" component="p" color="primary" className={classes.disclaimer}>
                    Ensure to read our <Link color="primary" component={RouterLink} underline="always">disclaimer</Link> before you carry out any transaction.
                </Typography>
                <div className={classes.messages}>
                    <Typography variant="subtitle2" component="span" className={classes.recipient}>Hello</Typography>
                    <Typography variant="subtitle2" component="span" className={classes.me}>How are you doing?</Typography>
                    <Typography variant="subtitle2" component="span" className={classes.recipient}>I'm okay. I'd like to change 500 right now</Typography>
                    <Typography variant="subtitle2" component="span" className={classes.me}>Okay. That'd be 26,550 naira. Send money to 0043031752 - Access Bank and attcach payment receipt when you're done.</Typography>
                    <Typography variant="subtitle2" component="span" className={classes.me}>Thank you</Typography>
                    <Typography variant="subtitle2" component="span" className={classes.recipient}>Done</Typography>
                </div>
                <form onSubmit={onSubmit} noValidate className={classes.form}>
                    <Grid container direction="row">
                        <TextField 
                            className={classes.input}
                            classes={{ multiline: classes.messageField }}
                            type="text"
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message"
                            multiline={true}
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
    );
};

export default Conversation;