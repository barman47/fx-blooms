import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { SET_CUSTOMER, SET_ID_CHECK_DATA, SET_PROFILE_CHECK_DATA } from '../../../actions/types';
import clsx from 'clsx';
import { Box, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { COLORS, LISTING_DETAILS, CUSTOMER_CATEGORY } from '../../../utils/constants';
import { COLORS, LISTING_DETAILS } from '../../../utils/constants';
import AllListings from './AllListings'
import AllTransactions from './AllTransactions';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import { ArrowTopRight, Filter } from 'mdi-material-ui';
import { getListingCount } from '../../../actions/admin';


const useStyles = makeStyles((theme) => ({
    root: {
        // padding: theme.spacing(0, 3),
        backgroundColor: 'white',
        paddingRight: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(9),
        paddingBottom: theme.spacing(12),
    },

    title: {
        fontWeight: 600,
        fontSize: theme.spacing(3)
    },

    link: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },

    filterContainer: {
        display: 'grid',
        gridTemplateColumns: '.12fr .12fr',
        // gap: theme.spacing(4),
        marginTop: theme.spacing(3),
        borderBottom: '1px solid #E3E8EE'
    },

    filter: {
        // backgroundColor: COLORS.lightTeal,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: theme.spacing(1),
        width: 'fit-content',
        gap: theme.spacing(1),
        color: '#697386',
        padding: '5px',
        
        '& span': {
            fontWeight: '600'
        },

        '& span:nth-child(2)': {
            color: '#1E625E',
            backgroundColor: '#AEC7C0',
            padding: '0px 3px',
            borderRadius: theme.spacing(1)
        }
    },

    active: {
        borderBottom: '2px solid #1E6262'
    },

    table: {
        marginTop: theme.spacing(3)
    },

    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '0.2fr 1.5fr 1.5fr 2fr 1fr 0.5fr 0.8fr 0.5fr',
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr'
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: 'pointer'
    },

    pagination: {
        backgroundColor: COLORS.lightTeal,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
    },
}));

const columns = [
    { id: 'id', label: ''},
    {
      id: 'listing ID',
      label: 'Listing ID',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'owner',
      label: 'Owner',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'amount',
      label: 'Amount',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'rate',
      label: 'Rate',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'status',
        label: 'Status',
        format: (value) => value.toLocaleString('en-US'),
      },
    {
        id: 'timeStamp',
        label: 'Timestamp',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'action',
      label: 'Action',
      format: (value) => value.toLocaleString('en-US'),
    },
];

const gridColumns = '.3fr .8fr 1fr .8fr .5fr .8fr 1fr .3fr';

// const pages = [10, 25, 50, 100]

const Listings = () => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const { ALL_LISTINGS, ALL_TRANSACTIONS } = LISTING_DETAILS;
    const [tab, setTab] = useState(ALL_LISTINGS);

    //   const [page, setPage] = useState(0);
    //   const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    // const [anchorEl, setAnchorEl] = useState(null);
    const { totalListings } = useSelector(state => state.stats)

    //   const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    //   };



    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    useEffect(() => {
        dispatch(getListingCount())
    })


    //   const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(1);
    //   };


    return (
    <>
        <section className={classes.root}>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    {tab === ALL_LISTINGS && <Typography variant="body1" className={classes.title}>All Listings</Typography>}
                    {tab === ALL_TRANSACTIONS && <Typography variant="body1" className={classes.title}>All Transactions</Typography>}
                </Grid>
                <Grid item>
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
                        <GenericButton buttonName="Filter">
                            <Filter />
                        </GenericButton>
                        <GenericButton buttonName="Export">
                            <ArrowTopRight />
                        </GenericButton>
                    </Box>
                </Grid>
            </Grid>
            <Box component="section" className={classes.filterContainer}>
                <div className={clsx(classes.filter, tab === ALL_LISTINGS && classes.active)} onClick={() => setTab(ALL_LISTINGS)}>
                    <Typography variant="subtitle2" component="span">All Listings</Typography>
                    <Typography variant="subtitle2" component="span">{totalListings}</Typography>
                </div>
                <div className={clsx(classes.filter, tab === ALL_TRANSACTIONS && classes.active)} onClick={() => setTab(ALL_TRANSACTIONS)}>
                    <Typography variant="subtitle2" component="span">All Transactions</Typography>
                    <Typography variant="subtitle2" component="span">{totalListings}</Typography>
                </div>
            </Box>
            <Box component="div" className={classes.table}>
                <GenericTableHeader columns={columns} gridColumns={gridColumns}/>
                {tab === ALL_LISTINGS && <AllListings />}
                {tab === ALL_TRANSACTIONS && <AllTransactions />}
            </Box>
        </section>
    </>
    )
}

export default Listings;