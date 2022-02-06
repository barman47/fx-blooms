import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Typography
} from '@material-ui/core';

// import { COLORS } from '../../../utils/constants';
import { CUSTOMERS, LISTINGS } from '../../../routes';

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
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: theme.spacing(30),
        padding: theme.spacing(2)
    },

    dropDownContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    userActivities: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },

    select: {
        fontSize: theme.spacing(1.7),
        minWidth: theme.spacing(15),
        paddingBottom: theme.spacing(0.6),
        paddingTop: theme.spacing(0.6),
    },

    recentTransactions: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(35),
        padding: theme.spacing(2)
    },
}));

const Home = ({ handleSetTitle }) => {
    const classes = useStyles();
    const history = useHistory();

    const { totalCustomers, totalListings } = useSelector(state => state.stats);

    const [listingFilter, setListingFilter] = useState('');
    const [usersFilter, setUsersFilter] = useState('');
    const [volumeFilter, setVolumeFilter] = useState('');
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    useEffect(() => {
        handleSetTitle('Admin Home');
        // eslint-disable-next-line
    }, []);

    // const goToDashboard = () => history.push(`${CUSTOMERS}`);

    const gotoCustomersPage = (e) => {
        if (e.target.name !== 'usersFilter') {
            history.push(CUSTOMERS);
        }
    };

    const gotoListingsPage = (e) => {
        if (e.target.name !== 'listingFilter') {
            history.push(LISTINGS);
        }
    };

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
                    <Box component="div" className={classes.contentItem} onClick={gotoCustomersPage}>
                        <Box component="div" className={classes.dropDownContainer}>
                            <Typography variant="subtitle2" component="span" color="primary">Users</Typography>
                            <FormControl 
                                variant="outlined"
                            >
                                <Select
                                    value={usersFilter}
                                    onChange={(e) => setUsersFilter(e.target.value)}
                                    displayEmpty
                                    classes={{ select: classes.select }}
                                    inputProps={{ 'aria-label': 'Select Users Filter' }}
                                    name="usersFilter"
                                >
                                    <MenuItem value="" disabled>Select Users Filter</MenuItem>
                                    <MenuItem value="Past 24 Hours">Past 24 Hours</MenuItem>
                                    <MenuItem value="Past 7 Days">Past 7 Days</MenuItem>
                                    <MenuItem value="Past 30 Days">Past 30 Days</MenuItem>
                                    <MenuItem value="Past 3 Months">Past 3 Months</MenuItem>
                                    <MenuItem value="All">All</MenuItem>
                                </Select>
                                {/* <FormHelperText>Select Users Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
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
                    <Box component="div" className={classes.contentItem} style={{ backgroundColor: '#FBEDFF' }} onClick={gotoListingsPage}>
                        <Box component="div" className={classes.dropDownContainer}>
                            <Typography variant="subtitle2" component="span" color="primary">Listings</Typography>
                            <FormControl 
                                variant="outlined"
                            >
                                <Select
                                    value={listingFilter}
                                    onChange={(e) => setListingFilter(e.target.value)}
                                    displayEmpty
                                    classes={{ select: classes.select }}
                                    inputProps={{ 'aria-label': 'Select Listing Filter' }}
                                    name="listingFilter"
                                >
                                    <MenuItem value="" disabled>Select Listing Filter</MenuItem>
                                    <MenuItem value="Past 24 Hours">Past 24 Hours</MenuItem>
                                    <MenuItem value="Past 7 Days">Past 7 Days</MenuItem>
                                    <MenuItem value="Past 30 Days">Past 30 Days</MenuItem>
                                    <MenuItem value="Past 3 Months">Past 3 Months</MenuItem>
                                    <MenuItem value="All">All</MenuItem>
                                </Select>
                                {/* <FormHelperText>Select Listing Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>{totalListings}</Typography>
                            <Typography variant="subtitle2" component="span" color="primary">Total</Typography>
                        </Box>
                    </Box>
                    <Box component="div" className={classes.contentItem} style={{ backgroundColor: '#FBEDFF' }}>
                        <Box component="div" className={classes.dropDownContainer}>
                            <Typography variant="subtitle2" component="span" color="primary">Volume</Typography>
                            <FormControl 
                                variant="outlined"
                            >
                                <Select
                                    value={volumeFilter}
                                    onChange={(e) => setVolumeFilter(e.target.value)}
                                    displayEmpty
                                    classes={{ select: classes.select }}
                                    inputProps={{ 'aria-label': 'Select Volume Filter' }}
                                    name="volumneFilter"
                                >
                                    <MenuItem value="" disabled>Select Volume Filter</MenuItem>
                                    <MenuItem value="Past 24 Hours">Past 24 Hours</MenuItem>
                                    <MenuItem value="Past 7 Days">Past 7 Days</MenuItem>
                                    <MenuItem value="Past 30 Days">Past 30 Days</MenuItem>
                                    <MenuItem value="Past 3 Months">Past 3 Months</MenuItem>
                                    <MenuItem value="All">All</MenuItem>
                                </Select>
                                {/* <FormHelperText>Select Volume Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
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