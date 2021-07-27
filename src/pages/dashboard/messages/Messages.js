import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { getChats } from '../../../actions/chat';

import Message from './Message';
import { SET_CHAT } from '../../../actions/types';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		// overflowY: 'scroll'
	}
}));

const Messages = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const { chats } = useSelector(state => state.chat);

	useEffect(() => {
		if (chats.length === 0) {
			props.getChats();
		}

		// eslint-disable-next-line
	}, []);

	const handleSetChat = (chat) => {
		dispatch({
			type: SET_CHAT,
			payload: { chat }
		});
	};

    return (
		<section className={classes.root}>
			{chats.map(chat => (
				<Message key={chat.id} conversation={chat} handleSetChat={() => handleSetChat(chat)} />
			))}
		</section>
    );
};

Messages.propTypes = {
	getChats: PropTypes.func.isRequired
};

export default connect(undefined, { getChats })(Messages);