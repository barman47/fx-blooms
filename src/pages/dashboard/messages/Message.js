import { Avatar, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { decode } from 'html-entities';
import { Account } from 'mdi-material-ui';
import TextClamp from 'react-string-clamp';

import { COLORS } from '../../../utils/constants';

import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
	message: {
		borderBottom: `1px solid ${COLORS.borderColor}`,
		borderRight: `1px solid ${COLORS.borderColor}`,
        cursor: 'pointer',
		padding: theme.spacing(1), 
        
		'& span': {
            color: COLORS.grey,
			fontWeight: 300
		},
        
        '&:first-child': {
            borderTop: `1px solid ${COLORS.borderColor}`
        },

        '&:hover': {
            backgroundColor: COLORS.offWhite
        }
	}
}));

const Message = ({ handleSetChat, conversation }) => {
	const classes = useStyles();
    const { userName } = useSelector(state => state.customer);

    return (
        <Grid onClick={handleSetChat} container direction="row" justify="space-between" alignItems="center" className={classes.message}>
            <Grid item>
                <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                        <Avatar>
                            <Account />
                        </Avatar>
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
                        <Typography variant="subtitle2" component="span" style={{ fontStyle: 'italic' }}>{conversation?.messages?.length > 0 &&  moment(conversation.messages[conversation.messages.length - 1].dateSent).format('h:mma')}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="span" style={{ fontStyle: 'italic' }}>{conversation?.messages?.length > 0 &&  moment(conversation.messages[conversation.messages.length - 1].dateSent).fromNow()}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Message.propTypes = {
    conversation: PropTypes.object.isRequired,
    handleSetChat: PropTypes.func.isRequired
};

export default Message;