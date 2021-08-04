import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Actions from './Actions';
import Conversation from './Conversation';
import Messages from './Messages';
import RiskNoticeModal from './RiskNoticeModal';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        position: 'sticky',
        // overflowY: 'hidden',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },

        top: 0,
        left: 0,
        
        '& h5': {
            // border: '1px solid red',
            backgroundColor: COLORS.white,
            marginBottom: theme.spacing(2),
            padding: [[theme.spacing(2), 0, 0, theme.spacing(2)]],
            margin: 0,
            position: 'sticky',
            top: 0,
            zIndex: 1
        }
    },
    gridContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%'
    },
    // gridContainer: {
    //     marginTop: theme.spacing(1)
    // },

    messages: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },
        width: '25%'
    },

    conversation: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },
        width: '50%'
    },

    actions: {
        maxHeight: '100%',
        // overflowY: 'scroll',
        overflowY: ["hidden", "-moz-scrollbars-none"],
        scrollbarWidth: "none",
        msOverflowStyle: "none",

        '&::-webkit-scrollbar': {
            display: 'none'
        },
        width: '25%'
    }
}));

const Index = (props) => {
    const classes = useStyles();
    const { handleSetTitle } = props;

    const { chat } = useSelector(state => state.chat);

    useEffect(() => {
        handleSetTitle('Messages');
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <RiskNoticeModal />
            <section className={classes.root}>
                <Typography variant="h5">Messages</Typography>
                {/* <Grid container direction="row" className={classes.gridContainer}> */}
                <div className={classes.gridContainer}>
                    <div className={classes.messages}>
                        <Messages />
                    </div>
                    <div className={classes.conversation}>
                        <Conversation />
                    </div>
                    <div className={classes.actions}>
                        {chat && 
                            <Actions />
                        }
                    </div>
                </div>
                {/* </Grid> */}
            </section>
        </>
    );
};

Index.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default Index;
