import { makeStyles } from '@material-ui/core/styles';

import Message from './Message';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		// overflowY: 'scroll'
	}
}));

const Messages = () => {
	const classes = useStyles();

    return (
		<section className={classes.root}>
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
		</section>
    );
};

export default Messages;