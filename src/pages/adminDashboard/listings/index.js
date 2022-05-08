import { useState, useEffect, useCallback } from 'react';
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
// import { getStats } from '../../../actions/admin';
import { getAllListings } from '../../../actions/adminListings';
import { SET_PAGE_NUMBER, SET_PAGE_SIZE } from '../../../actions/types';
import { exportRecords } from '../../../utils/exportRecords'
import isEmpty from '../../../utils/isEmpty';



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
        display: 'flex',
        gap: theme.spacing(2),
        // gridTemplateColumns: '.13fr .13fr .13fr .13fr .15fr',
        // gap: theme.spacing(4),
        marginTop: theme.spacing(3),
        borderBottom: '1px solid #E3E8EE',
        width: '70%'
    },

    filter: {
        // backgroundColor: COLORS.lightTeal,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // padding: theme.spacing(1),
        width: 'fit-content',
        // gap: theme.spacing(1),
        color: '#697386',
        padding: '5px',
        gap: '10px',
        
        '& span': {
            fontWeight: '600',
        },

        '& span:nth-child(2)': {
            color: '#1E625E',
            backgroundColor: '#AEC7C0',
            padding: '0px 5px',
            textAlign: 'center',
            lineHeight: '1 !important',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.spacing(1)
        },

        '&:not(:first-child) span': {
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

    selected: {
        borderBottom: '2px solid #1E6262',
        fontWeight: 600,
        fontSize: '1.4vw'
    },

    pageList: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }
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

const gridColumns = '.3fr .8fr 1fr .8fr .5fr .8fr 1fr .5fr';

const pages = [15, 25, 50, 100]

const Listings = () => {
    const classes = useStyles()
    const dispatch = useDispatch();

    const { admin } = useSelector(state => state);

    const { ALL_LISTINGS, ALL_TRANSACTIONS } = LISTING_DETAILS;
    const [tab, setTab] = useState(ALL_LISTINGS);
    const [loading, setLoading] = useState(true)
    const [pageNumberList, setPageNumberList] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [pageCount, setPageCount] = useState(0);
    const [ lastPage, setLastPage ] = useState(pageNumberList?.length)
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);

    //   const [page, setPage] = useState(0);
    // const [anchorEl, setAnchorEl] = useState(null);
    const { totalListings } = useSelector(state => state.stats)
    const { totalPageCount, listings } = useSelector(state => state.listings)

    const handlePageNUmberList = useCallback(() => {
        const pageNumArr = []
        if (pageCount >= 1) {
            for (let i=1; i<=pageCount; i++) {
                pageNumArr.push(i)
            }
        }
        setPageNumberList(pageNumArr)
        setLastPage(pageCount)
    }, [pageCount])

    const onNextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const onPrevPage = () => {
        setCurrentPage(currentPage - 1)
    }

    useEffect(() => {
        if (tab) {
            setCurrentPage(1);
        }
    }, [tab]);

    useEffect(() => {
        dispatch({
            type: SET_PAGE_SIZE,
            payload: rowsPerPage
        });
    }, [dispatch, rowsPerPage]);
    
    useEffect(() => {
        dispatch({
            type: SET_PAGE_NUMBER,
            payload: currentPage
        });
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (listings.length > 0)  {
            setLoading(false)
        }
    }, [listings])

    useEffect(() => {
        setLoading(true)
        switch (tab) {
            case ALL_LISTINGS:
                dispatch(getAllListings({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage
                }))
                setPageCount(totalPageCount || 0);
                break;

            case ALL_TRANSACTIONS:
                getAllListings({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage
                })
                setPageCount(totalPageCount || 0);
                break;

            default:
                break;
        }
        handlePageNUmberList()
    }, [ALL_LISTINGS, ALL_TRANSACTIONS, tab, handlePageNUmberList, currentPage, rowsPerPage, dispatch, totalPageCount])

    const downloadRecords = () => {
        let data = []        
        let exportErrors = {}
        switch (tab) {
            case ALL_LISTINGS:
                data = [...listings];
                break;

            case ALL_TRANSACTIONS:
                data = [...listings];
                break;

            default:
                break;
        }

        const { errors } = exportRecords(data, admin, tab)
        exportErrors = errors

        if (!isEmpty(exportErrors)) {
            // setErrors()
            return
        }
    };

    // useEffect(() => {
    //     if (currentPage > 0) {
    //         fetchData();
    //     }
    // }, [fetchData, currentPage]);

    // useEffect(() => {
    //     if (rowsPerPage > 0) {
    //         fetchData();
    //     }
    // }, [fetchData, rowsPerPage]);

    const handleSetTab = (tab) => {
        setTab(tab);
        setRowsPerPage(pages[0]);
    }

    const viewTableRow = (listing) => {
        return
    }


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
                        <GenericButton clickAction={downloadRecords} buttonName="Export">
                            <ArrowTopRight />
                        </GenericButton>
                    </Box>
                </Grid>
            </Grid>
            <Box component="section" className={classes.filterContainer}>
                <div className={clsx(classes.filter, tab === ALL_LISTINGS && classes.active)} onClick={() => handleSetTab(ALL_LISTINGS)}>
                    <Typography variant="subtitle2" component="span">All Listings</Typography>
                    <Typography variant="subtitle2" component="span">{totalListings}</Typography>
                </div>
                <div className={clsx(classes.filter, tab === ALL_TRANSACTIONS && classes.active)} onClick={() => handleSetTab(ALL_TRANSACTIONS)}>
                    <Typography variant="subtitle2" component="span">All Transactions</Typography>
                    <Typography variant="subtitle2" component="span">{totalListings}</Typography>
                </div>
            </Box>
            <Box component="div" className={classes.table}>
                <GenericTableHeader columns={columns} gridColumns={gridColumns}/>
                {tab === ALL_LISTINGS && <AllListings viewRow={viewTableRow} loadingListings={loading} />}
                {tab === ALL_TRANSACTIONS && <AllTransactions />}
            </Box>


            {
                loading ? '' :
                    <Box component="div" sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', width: "100%" }}>
                        <Box component="div" sx={{ alignSelf: "flex-start" }}>
                            {/* <Typography component="span">{'20'} results</Typography> */}
                        </Box>

                        <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
                                <GenericButton clickAction={onPrevPage} isDisabled={currentPage === 1} buttonName="Previous" />
                                <GenericButton clickAction={onNextPage} isDisabled={currentPage === lastPage} buttonName="Next" />
                            </Box> 
                            <Box component="span"  sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                                {
                                    pageNumberList && pageNumberList.map((pageNUmber, i) => (
                                        <Typography className={clsx(classes.pageList, pageNUmber === currentPage && classes.selected)} onClick={() => setCurrentPage(pageNUmber)} variant="subtitle2" key={i}>{pageNUmber}</Typography>
                                    ))
                                }
                            </Box>
                        </Box>                    
                    </Box>
                }
        </section>
    </>
    )
}

export default Listings;