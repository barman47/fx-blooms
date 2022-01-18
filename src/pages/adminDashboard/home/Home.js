import { useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    // Link,
    Typography
} from '@material-ui/core';

// import { COLORS } from '../../../utils/constants';
// import { CUSTOMERS } from '../../../routes';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        padding: theme.spacing(0, 3)
    },

    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: theme.spacing(5)
    },

    stats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(10)
    },

    statsHeader: {
        fontWeight: 700,
        marginBottom: theme.spacing(1)
    },

    userAcquisitions: {
        backgroundColor: '#FBEDFF',
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },

    listingsBreakdown: {
        backgroundColor: '#FBEDFF',
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },

    contentItem: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: theme.spacing(30),
        padding: theme.spacing(2)
    },

    userActivities: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },

    recentTransactions: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },
}));

const Home = (props) => {
    const classes = useStyles();
    // const history = useHistory();

    const { totalCustomers, totalListings } = useSelector(state => state.stats);

    const { handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Admin Home');
        // eslint-disable-next-line
    }, []);

    // const goToDashboard = () => history.push(`${CUSTOMERS}`);

    return (
        <>
            <Grid container direction="row" spacing={3} className={classes.root}>
                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={classes.userAcquisitions}>
                        <Typography variant="subtitle2" component="span" color="primary">Listings Breakdown</Typography>
                    </Box>
                    <Box component="div" className={classes.listingsBreakdown}>
                        <Typography variant="subtitle2" component="span" color="primary">User Acquisitions</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.content}>
                    <Box component="div" className={classes.contentItem}>
                        <Typography variant="subtitle2" component="span" color="primary">Users</Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>{totalCustomers}</Typography>
                            <Typography variant="subtitle2" component="span" color="primary">Total</Typography>
                        </Box>
                    </Box>
                    <Box component="div" className={classes.contentItem}>
                        <Typography variant="subtitle2" component="span" color="primary">Active Users</Typography>
                        <Typography variant="h5" color="primary" className={classes.statsHeader}>200,000 (95%)</Typography>
                    </Box>
                    <Box component="div" className={classes.contentItem}>
                        <Typography variant="subtitle2" component="span" color="primary">Support Board</Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>User Activities</Typography>
                        </Box>
                    </Box>
                    <Box component="div" className={classes.contentItem} style={{ backgroundColor: '#FBEDFF' }}>
                        <Typography variant="subtitle2" component="span" color="primary">Listings</Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>{totalListings}</Typography>
                            <Typography variant="subtitle2" component="span" color="primary">Total</Typography>
                        </Box>
                    </Box>
                    <Box component="div" className={classes.contentItem} style={{ backgroundColor: '#FBEDFF' }}>
                        <Typography variant="subtitle2" component="span" color="primary">Volume</Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>EUR 354,000</Typography>
                            <Typography variant="subtitle2" component="span" color="primary">Total</Typography>
                        </Box>
                    </Box>
                    <Box component="div" className={classes.contentItem} style={{ backgroundColor: '#FBEDFF' }}>
                        <Typography variant="subtitle2" component="span" color="primary">AML Board</Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>User Activities</Typography>
                            
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={classes.userActivities}>
                        <Typography variant="subtitle2" component="span" color="primary">User Activities</Typography>
                    </Box>
                    <Box component="div" className={classes.recentTransactions}>
                        <Typography variant="subtitle2" component="span" color="primary">Recent Transactions</Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

Home.propTypes = {
    handleSetTitle:PropTypes.func.isRequired
};

export default Home;