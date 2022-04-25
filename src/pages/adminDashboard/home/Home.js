import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import { styled } from '@mui/material/styles';
import {
    Box,
    Grid,
    // Paper,
    Typography
} from '@material-ui/core';
import { getCustomersWithoutProfile } from '../../../actions/customer';
import { getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer } from '../../../actions/admin';
import { TOGGLE_STATS_CHANGE_STATUS } from '../../../actions/types';
import { Stack, Animation, ArgumentScale } from '@devexpress/dx-react-chart';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    BarSeries,
    LineSeries,
    // Title,
    Legend,
  } from '@devexpress/dx-react-chart-material-ui';
import { scalePoint } from 'd3-scale';
import {
    curveCatmullRom,
    line,
  } from 'd3-shape';
import { olimpicMedals as data, energyConsumption as data2 } from '../../../utils/constants';
import { CUSTOMERS, LISTINGS } from '../../../routes';
import { ADMIN_FILTERS } from '../../../utils/constants';
// import { useCallback } from 'react';
// import { CalendarTodayIcon } from '@material-ui/icons';
import formatNumber from '../../../utils/formatNumber';
// import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { AccountSupervisor, Receipt, ViewDashboardVariant, CompareHorizontal, BankOutline, ArrowTopRight, ArrowBottomLeft } from 'mdi-material-ui';
import UserActivitiesRow from '../../../components/admin-dashboard/UserActivities_Row'
import RecentTransactions from '../../../components/admin-dashboard/RecentTransactions'
import AmlBoard from '../../../components/admin-dashboard/AmlBoard'
import GenericMiniCard from '../../../components/admin-dashboard/GenericMiniCard'


const useStyles = makeStyles((theme) => ({
    root: {
        // marginTop: theme.spacing(5),
        padding: theme.spacing(2.3, 3),
        gap: theme.spacing(2),
    },

    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing(10)
    },

    stats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(7)
    },

    statsHeader: {
        fontWeight: 700,
        color: 'black'
        // marginBottom: theme.spacing(1)
    },

    contentTitle: {
        color: '#A0AEC0',
        fontWeight: '700',
        fontSize: theme.spacing(2.2)
    },

    totalPercent: {
        color: '#48BB78',
        fontSize: '16px'
    },

    userGraph: {
        backgroundColor: 'white',
        border: `none`,
        borderRadius: theme.spacing(1.9),
        height: theme.spacing(50),
        padding: theme.spacing(2),
        boxShadow: '2px 2px 2px white',
        position: 'relative',
    },

    graphName: {
        fontWeight: '700',
        fontSize: theme.spacing(2.4),
        marginBottom: theme.spacing(3.13),
        color: 'black',
        lineHeight: '1.6'
    },

    legend: {
        '& ul li div span': {
            fontSize: '10px !important'
        }
    },

    contentItem: {
        border: 'none',
        borderRadius: theme.spacing(1.9),
        cursor: 'pointer',
        padding: theme.spacing(2),
        boxShadow: '2px 2px 2px white',
        backgroundColor: '#FFFFFF'
    },

    contentItemLong: {
        width: '47vw',

        '& span': {
            marginBottom: theme.spacing(1.4)
        }
    },

    contentIcon: {
        backgroundColor: '#E4EBEB',
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(1.3),
        width: '8%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    disabled: {
        pointerEvents: 'none'
    },

    dropDownContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        marginBottom: theme.spacing(2.5),
    },

    supportTable: {
        display: 'flex',
    },

    supportContent: {
        '&:not(:last-child)': {
            paddingRight: '4.2rem',
            borderRight: '2.5px solid #E6EBF2',
        },

        '&:not(:first-child)': {
            paddingLeft: '2.3rem'
        },

        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: 'fit-content',
        paddingTop: '1rem',
        paddingBottom: '2.5px'
    },

    supportHeader: {
        fontSize: '15px',
        color: '#A0AEC0',
        fontWeight: '500'
    },

    supportBody: {
        fontSize: '25px',
        color: 'black',
        fontWeight: 'bold'
    },

    select: {
        fontSize: theme.spacing(1.5),
        minWidth: theme.spacing(7),
        paddingBottom: theme.spacing(0.6),
        paddingTop: theme.spacing(0.6),
        backgroundColor: 'white',
        border: '.7px solid #E6E6E6'
    },

    recentTransactions: {
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
        height: '375px !important',
        paddingBottom: '26px !important',
    },

    userActivities: {
        // height: theme.spacing(40),
        padding: theme.spacing(3, 3),
        backgroundColor: 'white',
    },

    userActivitiesHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr',
        color: '#94A1B2',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: theme.spacing(.3),
        marginTop: theme.spacing(3.5),


        '& h6': {
            fontWeight: '600',
            fontSize: '1rem'
        }
    },

    userActivitiesBody: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.5fr',
        color: 'black',
        borderBottom: '1px solid #E2E8F0',
        padding: theme.spacing(1, 0),
        marginTop: theme.spacing(2),

        '& h6': {
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2D3748'
        }
    },

    transactionSection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(3)
    },

    recentTransactionList: {
        marginTop: theme.spacing(3),

        
    },

    recentList: {
        display: 'grid',
        gridTemplateColumns: '.5fr 1.5fr 1fr',
    },

    recentIcon: {
        padding: theme.spacing(.8),
        borderRadius: '50%',
        backgroundColor: '#E8EFEF'
    },

    recentName: {
        fontSize: theme.spacing(2.3),
        fontWeight: '600'
    },

    recentDivider: {
        height: theme.spacing(5),
        backgroundColor: '#E2E8F0',
        padding: theme.spacing(.1),
        width: '1px',
        margin: theme.spacing(.3, 0, .3, 2.5),
    },

    recentDate: {
        fontSize: theme.spacing(1.7),
        fontWeight: '700',
        color: '#A0AEC0',
        marginTop: theme.spacing(-.9)
    },

    recentAmount: {
        color: '#48BB78',
        fontWeight: '700',
        marginTop: theme.spacing(-3.125)
    },

    amlBoard: {
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
    },

    amlContent: {

        '& h6': {
            fontWeight: '600'
        },
    },

    amlTable: {
        display: 'grid',
        gridTemplateColumns: '1.5fr .5fr',

        '&:not(:last-child)': {
            paddingBottom: theme.spacing(2)
        },

        '&:not(:first-child)': {
            paddingTop: theme.spacing(2)
        },
    },

    amlNumber: {
        justifySelf: 'flex-end'
    }
}));
  
const Line = props => (
<LineSeries.Path
    {...props}
    path={line()
    .x(({ arg }) => arg)
    .y(({ val }) => val)
    .curve(curveCatmullRom)}
/>
);
  
const Root = props => (
    <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row', position: 'absolute', top: '-3px', right: '40px' }} />
);
  const Label = props => (
    <Legend.Label {...props} sx={{ whiteSpace: 'nowrap', fontSize: '9px !important' }} />
);

const Item = props => (
    <Legend.Item {...props} sx={{ flexDirection: 'column-reverse' }} />
);

const Home = ({ getCustomerCount, getListingCount, getTransactionVolume, searchForCustomer, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { changed, totalCustomersWithNoProfile, customerCount, listingCount, totalCustomers, totalListings, totalEuroTransfered, transactionVolume } = useSelector(state => state.stats);

    const [listingFilter, setListingFilter] = useState('');
    const [listings, setListings] = useState(0);
    const [usersFilter, setUsersFilter] = useState('');
    const [activeUsersFilter, setActiveUsersFilter] = useState('');
    const [users, setUsers] = useState(0);
    const [volumeFilter, setVolumeFilter] = useState('');
    const [volume, setVolume] = useState(0);
    const [loadingCustomerCount, setLoadingCustomerCount] = useState(false);
    const [loadingListingCount, setLoadingListingCount] = useState(false);
    const [loadingTransactionVolume, setLoadingTransactionVolume] = useState(false);
    // const [loadingActiveUsers, setloadingActiveUsers] = useState(false);
    const [loadingActiveUsers] = useState(false);
    const [totalNoProfilePercent, setTotalNoProfilePercent] = useState(0);

    // eslint-disable-next-line
    // const [errors, setErrors] = useState({});

    useEffect(() => {
        handleSetTitle('Admin Home');
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        dispatch(getCustomersWithoutProfile())
    }, [dispatch])

    useEffect(() => {
        if (totalCustomersWithNoProfile && totalCustomers) {
            const noProfilePercentage = Math.round((totalCustomersWithNoProfile / totalCustomers) * 100)
            setTotalNoProfilePercent(noProfilePercentage)
        }
    }, [totalNoProfilePercent, totalCustomersWithNoProfile, totalCustomers])

    // Show total listing count when no filter is selected
    useEffect(() => {
        console.log('hh', totalListings)
        if (totalListings && !listingFilter) {
            console.log('list')
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

    // const goToDashboard = () => navigate.push(`${CUSTOMERS}`);

    const handleSwitchCase = useCallback((switchType, getFunction, setLoadingType, setFilterType, total) => {
        const { TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS, ALL } = ADMIN_FILTERS;
        switch (switchType) {
            case TWENTY_FOUR_HOURS:
                getFunction('1');
                setLoadingType(true);
                break;

            case SEVEN_DAYS:
                getFunction('7');
                setLoadingType(true);
                break;

            case THIRTY_DAYS:
                getFunction('30');
                setLoadingType(true);
                break;

            case THREE_MONTHS:
                getFunction('90');
                setLoadingType(true);
                break;

            case ALL:
                setFilterType(total);
                break;
            
            default:
                break;
        }
    }, [])

    const handleListingsFilter = useCallback((timeframe) => {
        handleSwitchCase(timeframe, getListingCount, setLoadingListingCount, setListings, totalListings)
    }, [getListingCount, totalListings, handleSwitchCase]);
    
    const handleUsersFilter = useCallback((timeframe) => {
        handleSwitchCase(timeframe, getCustomerCount, setLoadingCustomerCount, setUsers, totalCustomers)
    }, [getCustomerCount, totalCustomers, handleSwitchCase]);
    
    const handleVolumeFilter = useCallback((timeframe) => {
        console.log('eur', totalEuroTransfered)
        handleSwitchCase(timeframe, getTransactionVolume, setLoadingTransactionVolume, setVolume, totalEuroTransfered)
    }, [getTransactionVolume, totalEuroTransfered, handleSwitchCase]);

    const handleActiveUserFilter = useCallback((timeframe) => {
        handleSwitchCase(timeframe, getTransactionVolume, setLoadingTransactionVolume, setVolume, totalEuroTransfered)
    }, [getTransactionVolume, totalEuroTransfered, handleSwitchCase]);

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

    useEffect(() => {
        if (!!activeUsersFilter) {
            handleActiveUserFilter(activeUsersFilter)
        }
    }, [handleActiveUserFilter, activeUsersFilter]);

    const gotoCustomersPage = (e) => {
        if (e.target.name !== 'usersFilter' && !loadingCustomerCount) {
            navigate.push(CUSTOMERS);
        }
    };

    const gotoListingsPage = (e) => {
        if (e.target.name !== 'listingFilter') {
            navigate.push(LISTINGS);
        }
    };

    return (
        <>
            <Grid container direction="row" spacing={3} className={classes.root}>
                <Grid item xs={12} className={classes.content}>
                    <GenericMiniCard 
                    goToPage={gotoCustomersPage}
                    cardName="Users" 
                    cardIcon={<AccountSupervisor />} 
                    filterType={usersFilter} 
                    handleOnChange={setUsersFilter} 
                    loading={loadingCustomerCount}
                    formatFn={formatNumber} 
                    useCase={users}
                    />

                    <GenericMiniCard 
                    cardName="Active Users"
                    cardIcon={<AccountSupervisor />} 
                    filterType={activeUsersFilter} 
                    handleOnChange={setActiveUsersFilter} 
                    loading={loadingActiveUsers}
                    formatFn="" 
                    useCase=""
                    />

                    {/* //LISTING CARD */}
                    <GenericMiniCard 
                    goToPage={gotoListingsPage}
                    cardName="Listing" 
                    cardIcon={<Receipt />} 
                    filterType={listingFilter} 
                    handleOnChange={setListingFilter} 
                    loading={loadingListingCount}
                    formatFn={formatNumber} 
                    useCase={listings}
                    />

                    {/* //VOLUME CARD */}
                    <GenericMiniCard 
                    // goToPage={gotoListingsPage}
                    cardName="Volume" 
                    cardIcon={<ViewDashboardVariant />} 
                    filterType={volumeFilter} 
                    handleOnChange={setVolumeFilter} 
                    loading={loadingTransactionVolume}
                    formatFn={formatNumber} 
                    useCase={volume}
                    />
                </Grid>

                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={classes.userGraph}>
                        <Typography className={classes.graphName} variant="h6" component="h6" color="primary">Listings Breakdown</Typography>
                        <Chart
                            data={data2}
                            className={classes.chart}
                            >
                            <ArgumentScale factory={scalePoint} />
                            <ArgumentAxis />
                            <ValueAxis />

                            <LineSeries
                                name="Hydro-electric"
                                valueField="hydro"
                                argumentField="country"
                                seriesComponent={Line}
                            />
                            <LineSeries
                                name="Oil"
                                valueField="oil"
                                argumentField="country"
                                seriesComponent={Line}
                            />
                            <LineSeries
                                name="Natural gas"
                                valueField="gas"
                                argumentField="country"
                                seriesComponent={Line}
                            />
                            <LineSeries
                                name="Coal"
                                valueField="coal"
                                argumentField="country"
                                seriesComponent={Line}
                            />
                            <LineSeries
                                name="Nuclear"
                                valueField="nuclear"
                                argumentField="country"
                                seriesComponent={Line}
                            />
                            <Legend className={classes.legend} position="top" rootComponent={Root} itemComponent={Item} labelComponent={Label} />
                            {/* <Title
                                text="Energy Consumption in 2004\n(Millions of Tons, Oil Equivalent)"
                                textComponent={'Text'}
                            /> */}
                            <Animation />
                        </Chart>
                    </Box>
                    <Box component="div" className={classes.userGraph}>
                        <Typography className={classes.graphName} variant="h6" component="h6" color="primary">User Acquisitions</Typography>
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
                                    <Legend position="top" rootComponent={Root} labelComponent={Label} />
                                    {/* <Title text="Olimpic Medals in 2008" /> */}
                                    <Stack />
                                </Chart>
                            {/* </Paper> */}
                    </Box>
                </Grid>

                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={[classes.contentItem, classes.contentItemLong]}>
                        <Typography className={classes.graphName} variant="subtitle2" component="span" color="primary">Support Board</Typography>

                        <Box component="div" className={classes.supportTable}>
                            <Box component="div" className={classes.supportContent}>
                                <Typography className={classes.supportHeader} component='subtitle1' variant="h6">Total Tickets</Typography>
                                <Typography className={classes.supportBody} component='subtitle1' variant="h5">120</Typography>
                            </Box>

                            <Box component="div" className={classes.supportContent}>
                                <Typography className={classes.supportHeader} component='subtitle1' variant="h6">In progress</Typography>
                                <Typography className={classes.supportBody} component='subtitle1' variant="h5">25</Typography>
                            </Box>

                            <Box component="div" className={classes.supportContent}>
                                <Typography className={classes.supportHeader} component='subtitle1' variant="h6">Awaiting clients reply</Typography>
                                <Typography className={classes.supportBody} component='subtitle1' variant="h5">10</Typography>
                            </Box>

                            <Box component="div" className={classes.supportContent}>
                                <Typography className={classes.supportHeader} component='subtitle1' variant="h6">New</Typography>
                                <Typography className={classes.supportBody} component='subtitle1' variant="h5">40</Typography>
                            </Box>

                            <Box component="div" className={classes.supportContent}>
                                <Typography className={classes.supportHeader} component='subtitle1' variant="h6">Unresolved</Typography>
                                <Typography className={classes.supportBody} component='subtitle1' variant="h5">120</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box component="div" className={classes.contentItem}>
                        <Typography variant="subtitle2" component="span" color="primary"></Typography>
                        <Box component="div">
                            <Typography variant="h5" color="primary" className={classes.statsHeader}></Typography>       
                        </Box>
                    </Box>      
                </Grid>
                
                <Grid item xs={12} className={classes.stats}>
                    <Box component="div" className={[classes.contentItem, classes.userActivities]}>
                        <Typography className={classes.graphName} variant="subtitle2" component="span" color="primary">User Activities</Typography>
                        <Box component="div"className={classes.userActivitiesHeader}>
                            <Typography component="h6" variant="subtitle1">
                                Category
                            </Typography>
                            <Typography component="h6" variant="subtitle1">Number</Typography>
                            <Typography component="h6" variant="subtitle1">&#37;</Typography>
                        </Box>

                        <UserActivitiesRow classname={classes.userActivitiesBody} category={'No Profile'} number={totalCustomersWithNoProfile ?? 0} progressNumber={totalNoProfilePercent ?? 0} />
                        <UserActivitiesRow classname={classes.userActivitiesBody} category={'Not signed in in the last 30days'} number={323} progressNumber={10} />
                        <UserActivitiesRow classname={classes.userActivitiesBody} category={'Have transact in the last 30days'} number={200} progressNumber={100} />
                        <UserActivitiesRow classname={classes.userActivitiesBody} category={'No listing in the last 30days'} number={650} progressNumber={100} />
                    </Box>
                    <Box component="div" className={classes.transactionSection}>
                        <Box component="div" className={[classes.contentItem, classes.recentTransactions]}>
                            <Typography className={classes.graphName} variant="subtitle2" component="span" color="primary">Recent Transactions</Typography>
            
                           <Box component="div" className={classes.recentTransactionList}>
                                <RecentTransactions classes={classes} recentName={'Listing'} recentDate={ '22 DEC, 2021 7:00PM' } recentAmount={3000}>
                                    <CompareHorizontal className={classes.recentIcon} color="primary" />
                                </RecentTransactions>

                                <RecentTransactions classes={classes} recentName={'Purchase'} recentDate={ '22 DEC, 2021 7:00PM' } recentAmount={3000}>
                                    <BankOutline className={classes.recentIcon} color="primary" style={{ color: 'purple' }}/>
                                </RecentTransactions>

                                <RecentTransactions classes={classes} recentName={'Withdrawal'} recentDate={ '22 DEC, 2021 7:00PM' } recentAmount={3000}>
                                    <ArrowTopRight className={classes.recentIcon} style={{ color: 'red' }} />
                                </RecentTransactions>

                                <RecentTransactions classes={classes} recentName={'Deposit'} recentDate={ '22 DEC, 2021 7:00PM' } recentAmount={3000}>
                                    <ArrowBottomLeft className={classes.recentIcon} color="primary" />
                                </RecentTransactions>
                           </Box>
                           
                        </Box>
                        <Box component="div" className={[classes.contentItem, classes.amlBoard]}>
                            <Typography className={classes.graphName} variant="subtitle2" component="h5" color="primary">AML Board</Typography>

                            <Box component="div" className={classes.amlContent}>
                                <AmlBoard classes={classes} amlTitle={"Transaction withhold"} amlNumber={24} />
                                <AmlBoard classes={classes} amlTitle={"Unassigned risk profile"} amlNumber={30} />
                                <AmlBoard classes={classes} amlTitle={"Suspended accounts"} amlNumber={12} />
                                <AmlBoard classes={classes} amlTitle={"Pending cases"} amlNumber={28} />
                                <AmlBoard classes={classes} amlTitle={"Watch list"} amlNumber={40}/>
                            </Box>
                        </Box>
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