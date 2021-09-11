import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Actions from './Actions';
import Conversation from './Conversation';
import Messages from './Messages';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import SellerNoticeModal from './SellerNoticeModal';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        position: 'sticky',
        // overflowY: 'hidden',
        overflowY: ['hidden', '-moz-scrollbars-none'],
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        top: 0,
        left: 0,

        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },

    header: {
        backgroundColor: COLORS.white,
        marginBottom: theme.spacing(2),
        padding: [[theme.spacing(2), 0, 0, theme.spacing(2)]],
        margin: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,

        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },

    gridContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',

        [theme.breakpoints.down('md')]: {
            display: 'grid',
            gridTemplateColumns: '1.5fr 2fr'
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr'
        },
    },

    messages: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },
        width: '25%',
        [theme.breakpoints.down('md')]: {
            // display: 'none'
            width: '100%'
        }
    },

    conversation: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: '50%',

        '&::-webkit-scrollbar': {
            display: 'none'
        },

        [theme.breakpoints.down('md')]: {
            width: '100%'
        },
        [theme.breakpoints.down('sm')]: {
            maxHeight: '90%'
        },
    },

    actions: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        width: '25%',

        [theme.breakpoints.down('md')]: {
            display: 'none'
        },

        '&::-webkit-scrollbar': {
            display: 'none'
        }
    }
}));

const Index = (props) => {
    const classes = useStyles();

    const { handleSetTitle } = props;

    const chat = useSelector(state => state.chat?.chat);

    useEffect(() => {
        handleSetTitle('Messages');
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <SellerNoticeModal />
            <section className={classes.root}>
                <Typography variant="h5" className={classes.header}>Messages</Typography>
                <div className={classes.gridContainer}>
                    <div className={classes.messages}>
                        <Messages />
                    </div>
                    <div className={classes.conversation}>
                        {!isEmpty(chat) && 
                            <Conversation />
                        }
                    </div>
                    <div className={classes.actions}>
                        {!isEmpty(chat) && 
                            <Actions />
                        }
                    </div>
                </div>
            </section>
        </>
    );
};

Index.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default Index;
