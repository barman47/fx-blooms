import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar, Badge, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { decode } from 'html-entities';
import { Account } from 'mdi-material-ui';
import TextClamp from 'react-string-clamp';
import clsx from 'clsx';

import { API, COLORS } from '../../../utils/constants';
import { updateMessageStatus } from '../../../actions/chat';
import { SUBTRACT_UNREAD_MESSAGES } from '../../../actions/types';

const useStyles = makeStyles(theme => ({
	message: {
		borderBottom: `1px solid ${COLORS.borderColor}`,
		borderRight: `1px solid ${COLORS.borderColor}`,
        cursor: 'pointer',
		padding: theme.spacing(1),

        '& p': {
            fontSize: theme.spacing(1.5),
            fontWeight: 300
        },
        
        '&:first-child': {
            borderTop: `1px solid ${COLORS.borderColor}`
        },

        '&:hover': {
            backgroundColor: COLORS.offWhite
        }
	},

    active: {
        backgroundColor: COLORS.lightTeal,
        color: theme.palette.primary.main,
    },

    timestamp: {
        color: COLORS.grey,
        fontSize: theme.spacing(1.3),
        fontStyle: 'italic',
        fontWeight: 300
    }
}));

const Message = ({ handleSetChat, conversation }) => {
	const classes = useStyles();
	const dispatch = useDispatch();

    const { customerId, userName } = useSelector(state => state.customer);
    const chatId = useSelector(state => state.chat?.chat?.id);

    const [unreadNotifications, setUnreadNotifications] = useState(0);

    // Show unread notifications count
    useEffect(() => {
        if (conversation) {
            if (conversation.messages.length > 0) {
                let count = 0;
                for (let i = conversation.messages.length; i >= 0; i--) {
                    if (conversation.messages[i]?.isRead === false && conversation.messages[i]?.sender !== customerId) {
                        count += 1;
                    }
                }
                setUnreadNotifications(count);
            }
        }
    }, [conversation, customerId, dispatch]);

    const handleChatClick = () => {
        setUnreadNotifications(0);
        dispatch({
            type: SUBTRACT_UNREAD_MESSAGES,
            payload: unreadNotifications
        });
        const url = `${API}/Chat`;
        axios.post(`${url}/UpdateMessageStatus?chatId=${conversation.id}`); // Deliberately did not add await
        handleSetChat();
    };

    return (
        <Grid 
            onClick={handleChatClick} 
            container 
            direction="row" 
            justify="space-between" 
            alignItems="center" 
            className={clsx(classes.message, {[`${classes.active}`]: chatId === conversation.id })}
        >
            <Grid item>
                <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                        <Badge color="error" badgeContent={unreadNotifications}>
                            <Avatar>
                                <Account />
                            </Avatar>
                        </Badge>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" component="p">
                            {conversation && userName === conversation.buyerUsername ? conversation.sellerUsername : conversation.buyerUsername
                            }
                        </Typography>
                        <Typography variant="subtitle2" component="span" style={{ fontStyle: 'italic' }}>
                            {conversation?.messages?.length > 0 && 
                                <TextClamp 
                                    text={decode(conversation.messages[conversation.messages.length - 1].text)}
                                    lines={1}
                                />
                            }
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <Typography 
                            variant="subtitle2" 
                            component="small" 
                            className={classes.timestamp}
                            >
                                {conversation?.messages?.length > 0 &&  moment(conversation.messages[conversation.messages.length - 1].dateSent).format('h:mma')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography 
                            variant="subtitle2" 
                            component="small" 
                            className={classes.timestamp}
                        >
                            {conversation?.messages?.length > 0 &&  moment(conversation.messages[conversation.messages.length - 1].dateSent).fromNow()}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Message.propTypes = {
    conversation: PropTypes.object.isRequired,
    handleSetChat: PropTypes.func.isRequired,
    updateMessageStatus: PropTypes.func.isRequired
};

export default connect(undefined, { updateMessageStatus })(Message);