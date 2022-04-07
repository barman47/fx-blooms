import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    CircularProgress,
    FormControl,
    Grid,
    // Paper,
    MenuItem,
    Select,
    Typography
} from '@material-ui/core';

import { getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer } from '../../../actions/admin';
import { TOGGLE_STATS_CHANGE_STATUS } from '../../../actions/types';
import { Stack, Animation } from '@devexpress/dx-react-chart';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    BarSeries,
    Title,
    Legend,
  } from '@devexpress/dx-react-chart-material-ui';

import { olimpicMedals as data } from '../../../utils/constants';
import { CUSTOMERS, LISTINGS } from '../../../routes';
import { ADMIN_FILTERS } from '../../../utils/constants';
// import { useCallback } from 'react';
// import { CalendarTodayIcon } from '@material-ui/icons';
import formatNumber from '../../../utils/formatNumber';

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
        height: theme.spacing(50),
        padding: theme.spacing(2)
    },

    listingsBreakdown: {
        backgroundColor: '#FCF8F3',
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(50),
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
        padding: theme.spacing(2),

        display: 'flex',
        flexDirection: 'column',
    },

    filterLoaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    chart: {
        height: '375px !important'
    },

    userActivitiesHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.primary.main,

        marginTop: theme.spacing(3),

        '& h6': {
            flexBasis: '70%',
            marginLeft: theme.spacing(3),
            fontWeight: '600',
            fontSize: '1rem'
        }
    },

    subActivitiesHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexBasis: '30%',
        
        '& p': {
            fontWeight: '600',
            fontSize: '1rem'
        }
    },

    userActivitiesBody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.primary.main,

        marginTop: theme.spacing(2),

        '& h6': {
            flexBasis: '70%',
            marginLeft: theme.spacing(3),
            fontSize: '1rem'
        }
    },

    subActivitiesBody: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexBasis: '30%',
        
        '& p': {
            fontSize: '1rem'
        }
    },

    recentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    recentContent: {
        display: 'flex',
        flexDirection: 'column',
    },

    recentTable: {
        display: 'flex',
        flexDirection: 'column',
        color: 'grey',
        marginTop: theme.spacing(1.7),
        gap: '5px',

        '& h6': {
            fontWeight: '600',
        }
    },

    recentBody: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        '& h6': {
            color: '#006400'
        }
    },

    recentRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        flexBasis: '70%',
        alignItems: 'center',
        
        '& > h6:first-child': {
            border: `1px solid green`,
            borderRadius: '50%',
            height: '25px',
            width: '25px',
            color: 'green',
            textAlign: 'center'
        },

        '& p': {
            color: 'black',
            fontWeight: 'bold',
            fontSize: theme.spacing(1.8)
        },

        '& h6': {
            fontWeight: 'bold',
            fontSize: theme.spacing(1.5),
            color: 'grey'
        }
    },

    recentRow_2: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        flexBasis: '70%',
        alignItems: 'center',
        
        '& > h6:first-child': {
            border: `1px solid red`,
            borderRadius: '50%',
            height: '25px',
            width: '25px',
            color: 'red',
            textAlign: 'center'
        },

        '& p': {
            color: 'black',
            fontWeight: 'bold',
            fontSize: theme.spacing(1.8)
        },

        '& h6': {
            fontWeight: 'bold',
            fontSize: theme.spacing(1.5),
            color: 'grey'
        }
    },

    recentCells: {
        color: 'red !important',
    }
}));

const Root = props => (
    <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }} />
  );
  const Label = props => (
    <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />
  );

const Home = ({ getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useNavigate();

    const { changed, customerCount, listingCount, totalCustomers, totalListings, totalEuroTransfered, transactionVolume } = useSelector(state => state.stats);

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

    // Show total volume count when no filter is selected
    useEffect(() => {
        if (totalEuroTransfered && !volumeFilter) {
            setVolume(totalEuroTransfered);
        }
    }, [totalEuroTransfered, volumeFilter]);

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

    // const goToDashboard = () => history(`${CUSTOMERS}`);

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
                setVolume(totalEuroTransfered);
                break;
            
            default:
                break;
        }
    }, [getTransactionVolume, totalEuroTransfered]);

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
            history(CUSTOMERS);
        }
    };

    const gotoListingsPage = (e) => {
        if (e.target.name !== 'listingFilter') {
            history(LISTINGS);
        }
    };

    return (
        <>
            <Grid container direction="row" spacing={3} className={classes.root}>
                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={classes.userAcquisitions}>
                        <Typography variant="subtitle2" component="span" color="primary">Listings Breakdown</Typography>
                        {/* <Paper className={classes.chart}> */}
                            <Chart
                                className={classes.chart}
                                data={data}
                                >
                                <ArgumentAxis />
                                <ValueAxis />

                                <BarSeries
                                    name="Gold Medals"
                                    valueField="gold"
                                    argumentField="country"
                                    color="#ffd700"
                                />
                                <BarSeries
                                    name="Silver Medals"
                                    valueField="silver"
                                    argumentField="country"
                                    color="#c0c0c0"
                                />
                                <BarSeries
                                    name="Bronze Medals"
                                    valueField="bronze"
                                    argumentField="country"
                                    color="#cd7f32"
                                />
                                <Animation />
                                <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                                <Title text="Olimpic Medals in 2008" />
                                <Stack />
                            </Chart>
                        {/* </Paper> */}
                    </Box>
                    <Box component="div" className={classes.listingsBreakdown}>
                        <Typography variant="subtitle2" component="span" color="primary">User Acquisitions</Typography>
                        {/* <Paper className={classes.chart}> */}
                                <Chart
                                    className={classes.chart}
                                    data={data}
                                    >
                                    <ArgumentAxis />
                                    <ValueAxis />

                                    <BarSeries
                                        name="Gold Medals"
                                        valueField="gold"
                                        argumentField="country"
                                        color="#ffd700"
                                    />
                                    <BarSeries
                                        name="Silver Medals"
                                        valueField="silver"
                                        argumentField="country"
                                        color="#c0c0c0"
                                    />
                                    <BarSeries
                                        name="Bronze Medals"
                                        valueField="bronze"
                                        argumentField="country"
                                        color="#cd7f32"
                                    />
                                    <Animation />
                                    <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                                    <Title text="Olimpic Medals in 2008" />
                                    <Stack />
                                </Chart>
                            {/* </Paper> */}
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
                                    formatNumber(users)
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
                                    formatNumber(listings)
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
                                    `EUR ${formatNumber(volume)}`
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
                        <div className={classes.userActivitiesHeader}>
                            <Typography  variant="subtitle2">
                                Category
                            </Typography>
                            <div className={classes.subActivitiesHeader} compoennt="div" variant="subtitle2">
                                <Typography>Nos</Typography>
                                <Typography>&#37;</Typography>
                            </div>
                        </div>

                        <div className={classes.userActivitiesBody}>
                            <Typography  variant="subtitle2">
                                No profile
                            </Typography>
                            <div className={classes.subActivitiesBody} compoennt="div" variant="subtitle2">
                                <Typography>344</Typography>
                                <Typography>5%</Typography>
                            </div>
                        </div>

                        <div className={classes.userActivitiesBody}>
                            <Typography  variant="subtitle2">
                                Not signed in in the last 30days
                            </Typography>
                            <div className={classes.subActivitiesBody} compoennt="div" variant="subtitle2">
                                <Typography>325</Typography>
                                <Typography>50%</Typography>
                            </div>
                        </div>

                        <div className={classes.userActivitiesBody}>
                            <Typography  variant="subtitle2">
                                Have transact in the last 30days
                            </Typography>
                            <div className={classes.subActivitiesBody} compoennt="div" variant="subtitle2">
                                <Typography>200</Typography>
                                <Typography>20%</Typography>
                            </div>
                        </div>

                        <div className={classes.userActivitiesBody}>
                            <Typography  variant="subtitle2">
                                No listing in the last 30days
                            </Typography>
                            <div className={classes.subActivitiesBody} compoennt="div" variant="subtitle2">
                                <Typography>650</Typography>
                                <Typography>5%</Typography>
                            </div>
                        </div>
                    </Box>
                    <Box component="div" className={classes.recentTransactions}>
                        <div className={classes.recentHeader}>
                            <Typography variant="subtitle2" component="span" color="primary">Recent Transactions</Typography>
                            <Typography variant="subtitle2" component="span" color="primary">
                                {/* <CalendarTodayIcon /> */}
                                23-30 March 2022
                                </Typography>
                        </div>
                       <div className={classes.recentContent}>
                            <div className={classes.recentTable}>
                                <Typography variant="subtitle2">
                                    NEWEST
                                </Typography>
                                <div className={classes.recentBody}>
                                    <Typography className={classes.recentRow} component="div" variant="body1">
                                        <Typography variant="subtitle1">&#43;</Typography>
                                        <Typography className={classes.recentCell} variant="body1">
                                            Listing
                                            <Typography variant="subtitle1">27 March 2021, at 4:30PM</Typography>
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">&#43; &#163; 2,000</Typography>
                                </div>

                                <div className={classes.recentBody}>
                                    <Typography className={classes.recentRow_2} component="div" variant="body1">
                                        <Typography variant="subtitle1">&#8722;</Typography>
                                        <Typography variant="body1">
                                            Purchase
                                            <Typography variant="subtitle1">27 March 2021, at 12:30PM</Typography>
                                        </Typography>
                                    </Typography>
                                    <Typography className={classes.recentCells} variant="subtitle2">&#8722; &#163; 5,000</Typography>
                                </div>
                            </div>

                            <div className={classes.recentTable}>
                                <Typography variant="subtitle2">
                                    YESTERDAY
                                </Typography>
                                <div className={classes.recentBody}>
                                    <Typography className={classes.recentRow} component="div" variant="body1">
                                        <Typography variant="subtitle1">&#43;</Typography>
                                        <Typography className={classes.recentCell} variant="body1">
                                            Listing
                                            <Typography variant="subtitle1">27 March 2021, at 4:30PM</Typography>
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">&#43; &#163; 2,000</Typography>
                                </div>

                                <div className={classes.recentBody}>
                                    <Typography className={classes.recentRow_2} component="div" variant="body1">
                                        <Typography variant="subtitle1">&#8722;</Typography>
                                        <Typography variant="body1">
                                            Purchase
                                            <Typography variant="subtitle1">27 March 2021, at 12:30PM</Typography>
                                        </Typography>
                                    </Typography>
                                    <Typography className={classes.recentCells} variant="subtitle2">&#8722; &#163; 5,000</Typography>
                                </div>
                            </div>
                       </div>
                                                
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