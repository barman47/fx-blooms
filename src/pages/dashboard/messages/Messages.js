import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { getChats } from '../../../actions/chat';

import Message from './Message';
import { SET_CHAT } from '../../../actions/types';
import { DASHBOARD, MOBILE_CONVERSATION } from '../../../routes';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		// height: '100%',
		position: 'sticky'
		// overflowY: 'scroll'
	}
}));

const Messages = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();

	const { chats } = useSelector(state => state.chat);

	useEffect(() => {
		props.getChats();
		// eslint-disable-next-line
	}, []);

	const handleSetChat = (chat) => {
		dispatch({
			type: SET_CHAT,
			payload: chat
		});

		if (matches) {
			history.push(`${DASHBOARD}${MOBILE_CONVERSATION}`);
		}
	};

    return (
		<section className={classes.root}>
			{chats.map((chat, index) => (
				<Message key={index} conversation={chat} handleSetChat={() => handleSetChat(chat)} />
			))}
		</section>
    );
};

Messages.propTypes = {
	getChats: PropTypes.func.isRequired
};

export default connect(undefined, { getChats })(Messages);