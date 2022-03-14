import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    CircularProgress,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Typography
} from '@material-ui/core';

import { getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer } from '../../../actions/admin';
import { TOGGLE_STATS_CHANGE_STATUS } from '../../../actions/types';

// import { COLORS } from '../../../utils/constants';
import { CUSTOMERS, LISTINGS } from '../../../routes';
import { ADMIN_FILTERS } from '../../../utils/constants';
import { useCallback } from 'react';
import Logger from '../../../components/common/logger'

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
    
    disabled: {
        pointerEvents: 'none'
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

    filterLoaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
}));

const Home = ({ getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { changed, customerCount, listingCount, totalCustomers, totalListings, transactionVolume } = useSelector((state) => {
        Logger('sttas', state)
        return state.stats
    });

    const [listingFilter, setListingFilter] = useState('');
    const [listings, setListings] = useState(0);
    const [usersFilter, setUsersFilter] = useState('');
    const [users, setUsers] = useState(0);
    const [volumeFilter, setVolumeFilter] = useState('');
    const [volume, setVolume] = useState(0);
    const [loadingCustomerCount, setLoadingCustomerCount] = useState(false);
    const [loadingListingCount, setLoadingListingCount] = useState(false);
    const [loadingTransactionVolume, setLoadingTransactionVolume] = useState(false);

    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    useEffect(() => {
        handleSetTitle('Admin Home');
        // eslint-disable-next-line
        Logger('USERS', users)
    }, []);

    // Show total listing count when no filter is selected
    useEffect(() => {
        if (totalListings && !listingFilter) {
            setListings(totalListings);
        }
    }, [totalListings, listingFilter]);

    // Show total customer count when no filter is selected
    useEffect(() => {
        if (totalCustomers && !usersFilter) {
            setUsers(totalCustomers);
        }
    }, [totalCustomers, usersFilter]);

    // Show volume from filter value
    useEffect(() => {
        // if (changed) {
            if (volumeFilter && (transactionVolume !== undefined) && changed) {
            setLoadingTransactionVolume(false);
            setVolume(transactionVolume);
            dispatch({
                type: TOGGLE_STATS_CHANGE_STATUS
            });
        }
    }, [changed, volumeFilter, transactionVolume, dispatch]);

    // Show listing from filter value
    useEffect(() => {
        // if (changed) {
            if (listingFilter && (listingCount !== undefined) && changed) {
            setLoadingListingCount(false);
            setListings(listingCount);
            dispatch({
                type: TOGGLE_STATS_CHANGE_STATUS
            });
        }
    }, [changed, listingFilter, listingCount, dispatch]);

    // Show customer count from filter value
    useEffect(() => {
        // if (changed) {
            if (usersFilter && (customerCount !== undefined) && changed) {
                setLoadingCustomerCount(false);
            setUsers(customerCount);
            dispatch({
                type: TOGGLE_STATS_CHANGE_STATUS
            });
        }
    }, [changed, usersFilter, customerCount, dispatch]);

    // const goToDashboard = () => history.push(`${CUSTOMERS}`);

    const handleListingsFilter = useCallback((timeframe) => {
        const { TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS, ALL } = ADMIN_FILTERS;
        switch (timeframe) {
            case TWENTY_FOUR_HOURS:
                getListingCount('1');
                setLoadingListingCount(true);
                break;

            case SEVEN_DAYS:
                getListingCount('7');
                setLoadingListingCount(true);
                break;

            case THIRTY_DAYS:
                getListingCount('30');
                setLoadingListingCount(true);
                break;

            case THREE_MONTHS:
                getListingCount('90');
                setLoadingListingCount(true);
                break;

            case ALL:
                setListings(totalListings);
                break;
            
            default:
                break;
        }
    }, [getListingCount, totalListings]);
    
    const handleUsersFilter = useCallback((timeframe) => {
        const { TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS, ALL } = ADMIN_FILTERS;
        switch (timeframe) {
            case TWENTY_FOUR_HOURS:
                getCustomerCount('1');
                setLoadingCustomerCount(true);
                break;

            case SEVEN_DAYS:
                getCustomerCount('7');
                setLoadingCustomerCount(true);
                break;

            case THIRTY_DAYS:
                getCustomerCount('30');
                setLoadingCustomerCount(true);
                break;

            case THREE_MONTHS:
                getCustomerCount('90');
                setLoadingCustomerCount(true);
                break;

            case ALL:
                setUsers(totalCustomers);
                break;
            
            default:
                break;
        }
    }, [getCustomerCount, totalCustomers]);
    
    const handleVolumeFilter = useCallback((timeframe) => {
        const { TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS, ALL } = ADMIN_FILTERS;
        switch (timeframe) {
            case TWENTY_FOUR_HOURS:
                getTransactionVolume('1');
                setLoadingTransactionVolume(true);
                break;

            case SEVEN_DAYS:
                getTransactionVolume('7');
                setLoadingTransactionVolume(true);
                break;

            case THIRTY_DAYS:
                getTransactionVolume('30');
                setLoadingTransactionVolume(true);
                break;

            case THREE_MONTHS:
                getTransactionVolume('90');
                setLoadingTransactionVolume(true);
                break;

            case ALL:
                setVolume('N/A');
                break;
            
            default:
                break;
        }
    }, [getTransactionVolume]);

    // Get user count when user filter changes
    useEffect(() => {
        if (usersFilter) {
            handleUsersFilter(usersFilter)
        }
    }, [handleUsersFilter, usersFilter]);

    // Get listing count when listing filter changes
    useEffect(() => {
        if (listingFilter) {
            handleListingsFilter(listingFilter)
        }
    }, [handleListingsFilter, listingFilter]);

    // Get volume count when volume filter changes
    useEffect(() => {
        if (volumeFilter) {
            handleVolumeFilter(volumeFilter)
        }
    }, [handleVolumeFilter, volumeFilter]);

    const gotoCustomersPage = (e) => {
        if (e.target.name !== 'usersFilter' && !loadingCustomerCount) {
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
                                    disabled={loadingCustomerCount}
                                >
                                    <MenuItem value="" disabled>Select Users Filter</MenuItem>
                                    {Object.entries(ADMIN_FILTERS).map(([key, value], index) => (
                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                                {/* <FormHelperText>Select Users Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>
                                {loadingCustomerCount ? 
                                    <Box component="div" className={classes.filterLoaderContainer}>
                                        <Typography>Please wait . . .</Typography>&nbsp;&nbsp;&nbsp;
                                        <CircularProgress
                                            variant="indeterminate"
                                            disableShrink
                                            className={classes.top}
                                            classes={{
                                                circle: classes.circle,
                                            }}
                                            size={40}
                                            thickness={4}
                                        />
                                    </Box>
                                    : 
                                    users
                                }
                            </Typography>
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
                                    disabled={loadingListingCount}
                                >
                                    <MenuItem value="" disabled>Select Listing Filter</MenuItem>
                                    {Object.entries(ADMIN_FILTERS).map(([key, value], index) => (
                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                                {/* <FormHelperText>Select Listing Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>
                                {loadingListingCount ? 
                                    <Box component="div" className={classes.filterLoaderContainer}>
                                        <Typography>Please wait . . .</Typography>&nbsp;&nbsp;&nbsp;
                                        <CircularProgress
                                            variant="indeterminate"
                                            disableShrink
                                            className={classes.top}
                                            classes={{
                                                circle: classes.circle,
                                            }}
                                            size={40}
                                            thickness={4}
                                        />
                                    </Box>
                                    : 
                                    listings
                                }
                            </Typography>
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
                                    name="volumeFilter"
                                    disabled={loadingTransactionVolume}
                                >
                                    <MenuItem value="" disabled>Select Volume Filter</MenuItem>
                                    {Object.entries(ADMIN_FILTERS).map(([key, value], index) => (
                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                                {/* <FormHelperText>Select Volume Filter</FormHelperText> */}
                            </FormControl>
                        </Box>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}>
                                {loadingTransactionVolume ? 
                                    <Box component="div" className={classes.filterLoaderContainer}>
                                        <Typography>Please wait . . .</Typography>&nbsp;&nbsp;&nbsp;
                                        <CircularProgress
                                            variant="indeterminate"
                                            disableShrink
                                            className={classes.top}
                                            classes={{
                                                circle: classes.circle,
                                            }}
                                            size={40}
                                            thickness={4}
                                        />
                                    </Box>
                                    : 
                                    `EUR ${volume}`
                                }
                            </Typography>
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
    getCustomerCount: PropTypes.func.isRequired,
    getListingCount: PropTypes.func.isRequired, 
    getTransactionVolume: PropTypes.func.isRequired, 
    searchForCustomer: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined , { getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer })(Home);