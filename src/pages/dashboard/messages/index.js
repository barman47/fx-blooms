import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Actions from './Actions';
import Conversation from './Conversation';
import Messages from './Messages';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(2),
        position: 'relative',
        top: 0,
        left: 0,

        '& h5': {
            marginBottom: theme.spacing(2),
            marginLeft: theme.spacing(2),
        }
    },
    gridContainer: {
        marginTop: theme.spacing(1)
    }
}));

const Index = (props) => {
    const classes = useStyles();
    const { handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Messages');
        // eslint-disable-next-line
    }, []);
    return (
        <section className={classes.root}>
            <Typography variant="h5">Messages</Typography>
            <Grid container direction="row" className={classes.gridContainer}>
                <Grid item lg={3}>
                    <Messages />
                </Grid>
                <Grid item lg={6}>
                    <Conversation />
                </Grid>
                <Grid item lg={3}>
                    <Actions />
                </Grid>
            </Grid>
        </section>
    );
};

Index.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default Index;
