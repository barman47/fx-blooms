import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getCustomer } from '../../../actions/customer';
import { getTransactions, exportAllTransactionRecords } from '../../../actions/admin';
import clsx from 'clsx';
import { Box, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { COLORS, LISTING_DETAILS, CUSTOMER_CATEGORY } from '../../../utils/constants';
import { COLORS, TRANSACTION_DETAILS } from '../../../utils/constants';
import AllTransactions from './AllTransactions'
// import AllOpen from './AllOpen';
// import AllNegotiations from './AllNegotiations';
// import AllRemoved from './AllRemoved';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import { ArrowTopRight, Filter, CloseCircleOutline } from 'mdi-material-ui';
// import { getStats } from '../../../actions/admin';
import { SET_PAGE_NUMBER, SET_PAGE_SIZE } from '../../../actions/types';
import { exportRecords } from '../../../utils/exportRecords'
import isEmpty from '../../../utils/isEmpty';
import AmlBoard from '../../../components/admin-dashboard/AmlBoard';
// import Status from '../../../components/admin-dashboard/Status';
import formatId from '../../../utils/formatId';
import ExportAllLoader from '../../../components/admin-dashboard/ExportAllLoader'



const useStyles = makeStyles((theme) => ({
    root: {
        // padding: theme.spacing(0, 3),
        backgroundColor: 'white',
        paddingRight: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(9),
        paddingBottom: theme.spacing(12),

        position: 'relative',
    },

    exportBox: {
        position: 'absolute',
        top: 116,
        right: 65,
        borderRadius: 5,
        boxShadow: '1px 1px 1px 1.3px #c7c7c7',
        display: 'flex',
        flexDirection: 'column',
        

        '& span': {
            fontSize: '.9vw',
            backgroundColor: 'white',
            padding: '10px 20px',
            width: '6vw',

            '&:hover': {
                backgroundColor: '#1E6262',
                color: 'white'
            }
        }
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
    },

    viewMoreContainer: {
        position: 'fixed',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        top: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        height: '100vh',
        transform: 'translate(0, 84px)'
    },

    viewMoreContent: {
        backgroundColor: 'white',
        width: '65%',
        height: '75vh',
        margin: '2rem 8vw 0 auto',
        borderRadius: '3px',
        // paddingTop: '3rem',
        // paddingLeft: '1.5rem',
        padding: '1rem',
        // overflowY: 'scroll',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },

    viewMoreTitle: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        borderBottom: '1px solid #808080',
        padding: '.5rem .5rem .5rem 2rem',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    viewMoreData: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        
        padding: '2rem .5rem .5rem 2rem'
    },

    amlTable: {
        display: 'grid',
        gridTemplateColumns: '.8fr 15vw',
        marginBottom: theme.spacing(2),
        // justifyContent: 'space-between',
        // width: '10vw',   
        // gap: '7rem'
    },

    amlTitle: {
        fontSize: '1vw',
        fontWeight: '400 !important',
    },

    amlNumber: {
        fontWeight: '600 !important',
        justifySelf: 'self-start',
        fontSize: '1vw',

        '& p:first-child': {
            fontWeight: '600 !important',
        }
    },

    viewMoreBidsContainer: {
        overflowY: 'scroll',
        height: '42%',
        width: '70%',
        overflowX: 'hidden',
    },

    viewMoreBids: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        padding: '.5rem .5rem .5rem 2rem',
        marginTop: '1.5rem',
        columnGap: '1rem',
        rowGap: '1.7rem',
        alignItems: 'center'
    },

    circleDesign: {
        position: 'relative',
    },

    circle: {
        width: '20px',
        height: '20px',
        backgroundColor: 'green',
        borderRadius: '50%',
        border: '1px solid #000000'
    },

    line: {
        position: 'absolute',
        top: 23,
        left: 11,
        height: 55,
        width: 1,

        backgroundColor: 'black'
    },

    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },

    dateTime: {
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(2, max-content)',

        '& p': {
            fontSize: '.9vw'
        }
    },

    statusContainer: {
        position: 'relative',
        marginRight: 50
    },

    userStatusTitle: {
        // backgroundColor: '#DDF2E5',
        color: '#1E6262',
        width: 'fit-content',
        borderRadius: '5px',
        fontSize: '.9vw',
        textAlign: 'center',
        padding: '.1rem .5rem',
    },

    subStatus: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        top: 30,
        
        '& span': {
            fontSize: '.7vw',
            fontWeight: '400'
        }
    },

    subDateTime: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        top: 26,
        width: 'max-content',
        
        '& span': {
            fontSize: '.7vw',
            fontWeight: '400'
        }
    },

    status: {
        color: 'white',
        fontWeight: "500 !important",
        textAlign: 'center',
        backgroundColor: '#C4C4C4'
    },

    verified: {
        backgroundColor: '#DDF2E5',
        color: '#1E6262',
    },

    pending: {
        backgroundColor: '#FFF5CE',
        color: '#FBBC05',
    },

    rejected: {
        backgroundColor: '#FFCECE',
        color: '#FF0000',
    },

    suspended: {
        backgroundColor: '#f5f7be',
        color: '#d1c70c',
    },
}));

const columns = [
    // { id: 'id', label: ''},
    {
      id: 'transaction type',
      label: 'Transaction Type',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'payer',
      label: 'Payer',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'amount',
      label: 'Amount',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'receiver',
      label: 'Receiver',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'transaction ID',
        label: 'Transaction ID',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'status',
        label: 'Status',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'timestamp',
      label: 'Timestamp',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'Action',
        format: (value) => value.toLocaleString('en-US'),
    },
];

const gridColumns = '1fr 1fr 1fr 1fr 1fr .8fr 1fr .6fr';

const pages = [15, 25, 50, 100]

const Transactions = () => {
    const classes = useStyles()
    const dispatch = useDispatch();

    const { admin } = useSelector(state => state);
    const { customer } = useSelector(state => state.customers);

    const { ALL_TRANSACTIONS } = TRANSACTION_DETAILS
    const [tab, setTab] = useState(ALL_TRANSACTIONS);
    const [loading, setLoading] = useState(true)
    const [pageNumberList, setPageNumberList] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [pageCount, setPageCount] = useState(0);
    const [ lastPage, setLastPage ] = useState(pageNumberList?.length)
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    const [openXport, closeXport] = useState(false);
    const [customerName, setCustomerName] = useState('')

    const [viewMoreData, setViewMoreData] = useState({})
    const [openViewMore, setOpenViewMore] = useState(false)
    const [exportAllLoader, setExportAllLoader] = useState(false);

    //   const [page, setPage] = useState(0);
    // const [anchorEl, setAnchorEl] = useState(null);
    const { totalTransactions } = useSelector(state => state.stats)
    const { totalPageCount, transactions } = useSelector(state => state.transactions)

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
        if (!!transactions)  {
            setLoading(false)
        }
    }, [transactions])

    useEffect(() => {
        setLoading(true)
        switch (tab) {
            case ALL_TRANSACTIONS:
                dispatch(getTransactions({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage
                }))
                setPageCount(totalPageCount || 0);
                break;

            // case ALL_OPEN:
            //     getAllTransactions({
            //         pageSize: rowsPerPage,
            //         pageNumber: currentPage
            //     })
            //     setPageCount(totalPageCount || 0);
            //     break;

            default:
                break;
        }
        handlePageNUmberList()
    }, [ALL_TRANSACTIONS, tab, handlePageNUmberList, currentPage, rowsPerPage, dispatch, totalPageCount])

    const downloadRecords = () => {
        let data = []        
        switch (tab) {
            case ALL_TRANSACTIONS:
                data = [...transactions];
                break;

            // case ALL_OPEN:
            //     data = [...transactions];
            //     break;

            default:
                break;
        }

        if ( exportRecords(data, admin, tab)?.errors) {
            return
        }
    };

    const downloadAll = async () => {
        setExportAllLoader(true)
        await exportAllTransactionRecords(admin)
        setExportAllLoader(false)
    }

    const handleSetTab = (tab) => {
        setTab(tab);
        setRowsPerPage(pages[0]);
    }

    const viewTableRow = (transaction) => {
        setViewMoreData(transaction)
        setOpenViewMore(true)
    }

    useEffect(() => {
        if (!isEmpty(customer)) {
            setCustomerName(customer.firstName)
        }
    }, [customer])

    const getCustomerName = useCallback(() => {        
        return customerName
    }, [customerName])

    const currentAmount = (amount) => {
        return {
            currencyType: amount.currencyType + ' ',
            amount: amount.amount
        }
    }

    const handleDate = (dateTime) => {
        const time = new Date(dateTime);
        return {
            time: time.toLocaleTimeString(),
            space: ' ',
            date: time.toDateString(),
        }
    }

    const handleStatus = useCallback((status) => {
        if (ALL_TRANSACTIONS) {
            switch (status) {
                case "COMPLETED":
                  return classes.verified
                case "CANCELED":
                  return classes.rejected
                default:
                  return 
            }
        } 
        // else if (ALL_OPEN) {
        //     return
        // } 
        else {
            return ''
        }

      }, [ALL_TRANSACTIONS, classes.rejected, classes.verified])

    return (
    <>
        <section className={classes.root}>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    {tab === ALL_TRANSACTIONS && <Typography variant="body1" className={classes.title}>All Transactions</Typography>}
                    {/* {tab === ALL_OPEN && <Typography variant="body1" className={classes.title}>All Open</Typography>}
                    {tab === ALL_NEGOTIATIONS && <Typography variant="body1" className={classes.title}>All Negotiations</Typography>}
                    {tab === ALL_DELETED && <Typography variant="body1" className={classes.title}>All Removed</Typography>} */}
                </Grid>
                <Grid item>
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
                        <GenericButton buttonName="Filter">
                            <Filter />
                        </GenericButton>
                        <GenericButton clickAction={() => closeXport(!openXport)} buttonName="Export">
                            <ArrowTopRight />
                            {
                                openXport ? 
                                <Box className={classes.exportBox} component="span">
                                    <Typography onClick={downloadAll} component="span">Export All</Typography>
                                    <Typography onClick={downloadRecords} component="span">Export Page</Typography>
                                </Box> : ''
                            }
                        </GenericButton>
                        {/* <Menu
                            id="customer-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            classes={{ paper: classes.menu }}
                            disableScrollLock={ true }
                        >
                            <MenuItem onClick={viewDetails}>Filter by staus</MenuItem>
                        </Menu> */}
                    </Box>
                </Grid>
            </Grid>
            <Box component="section" className={classes.filterContainer}>
                <div className={clsx(classes.filter, tab === ALL_TRANSACTIONS && classes.active)} onClick={() => handleSetTab(ALL_TRANSACTIONS)}>
                    <Typography variant="subtitle2" component="span">All Transactions</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div>
                {/* <div className={clsx(classes.filter, tab === ALL_OPEN && classes.active)} onClick={() => handleSetTab(ALL_OPEN)}>
                    <Typography variant="subtitle2" component="span">All Open</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div>

                <div className={clsx(classes.filter, tab === ALL_NEGOTIATIONS && classes.active)} onClick={() => handleSetTab(ALL_NEGOTIATIONS)}>
                    <Typography variant="subtitle2" component="span">All Negotiations</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div>

                <div className={clsx(classes.filter, tab === ALL_DELETED && classes.active)} onClick={() => handleSetTab(ALL_DELETED)}>
                    <Typography variant="subtitle2" component="span">All Removed</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div> */}
            </Box>
            <Box component="div" className={classes.table}>
                <GenericTableHeader columns={columns} gridColumns={gridColumns}/>
                {tab === ALL_TRANSACTIONS && <AllTransactions viewRow={viewTableRow} loadingTransactions={loading} />}
                {/* {tab === ALL_OPEN && <AllOpen />} */}
                {/* {tab === ALL_NEGOTIATIONS && <AllNegotiations />} */}
                {/* {tab === ALL_DELETED && <AllRemoved />} */}
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

            {
                !!openViewMore ? 
                <Box component="div" className={classes.viewMoreContainer}>
                    <Box component="div" className={classes.viewMoreContent}>
                        <Typography variant="h6" className={classes.viewMoreTitle}>Listing Details <CloseCircleOutline onClick={() => setOpenViewMore(false)} /></Typography>
                        <Box component="div" className={classes.viewMoreData}>
                            <Box component="div">
                                <AmlBoard  classes={classes} amlTitle={"Listing ID:"} amlNumber={formatId(viewMoreData.id)} />
                                <AmlBoard  classes={classes} amlTitle={"Owner:"} amlNumber={getCustomerName()} />
                                <AmlBoard  classes={classes} amlTitle={"Expires:"} amlNumber={getCustomerName()} />
                                <AmlBoard  classes={classes} amlTitle={"Current Amount:"} amlNumber={currentAmount(viewMoreData.amountNeeded).currencyType + currentAmount(viewMoreData.amountNeeded).amount} />
                                <AmlBoard  classes={classes} amlTitle={"Bank:"} amlNumber={viewMoreData.bank} />
                            </Box>
                            <Box component="div">
                                <AmlBoard  classes={classes} amlTitle={"Current Status"} amlNumber={viewMoreData.status} />
                                <AmlBoard  classes={classes} amlTitle={"Listed Time"} amlNumber={handleDate(viewMoreData.dateCreated).time + handleDate(viewMoreData.dateCreated).space + handleDate(viewMoreData.dateCreated).date} />
                                <AmlBoard  classes={classes} amlTitle={"Work Flow"} amlNumber={'BUY ' + currentAmount(viewMoreData.amountNeeded).currencyType} />
                                <AmlBoard  classes={classes} amlTitle={"Current Rate"} amlNumber={viewMoreData.exchangeRate} />
                                <AmlBoard  classes={classes} amlTitle={"Reference"} amlNumber={viewMoreData.reference} />
                            </Box>
                        </Box>
                        <Box component="div" className={classes.viewMoreBidsContainer}>
                            {
                                viewMoreData.bids.map((transaction, index) => {
                                return (
                                <Box key={index} component="div" className={classes.viewMoreBids}>
                                    <Box component="div" className={classes.circleDesign}>
                                        <Box component="div" className={clsx(classes.circle, classes.status, handleStatus(transaction.status))}></Box>
                                        <Box component="div" className={classes.line}></Box>    
                                    </Box>  
                                    <Box component="div" className={classes.statusContainer}>
                                        <Typography variant="h6" className={clsx(classes.userStatusTitle, classes.status, handleStatus(transaction.status))}>
                                            {transaction.status}
                                        </Typography>
                                        <Box component="span"  className={classes.subStatus}>
                                            <Typography component='span'>Test: </Typography>
                                            <Typography component='span'>Another test: </Typography>
                                        </Box>
                                    </Box>
                                    <Box component="div" className={classes.dateTimeContainer}>
                                        <Box component="div" className={classes.dateTime}>
                                            <Typography variant="body1">{handleDate(viewMoreData.dateCreated).time}</Typography>
                                            <Typography variant="body1">{handleDate(viewMoreData.dateCreated).date}</Typography>
                                        </Box>
                                        <Box component="span"  className={classes.subDateTime}>
                                            <Typography component='span'>{customerName + ' confirms ' + currentAmount(viewMoreData.amountNeeded).currencyType + currentAmount(viewMoreData.amountNeeded).amount + ', ' + currentAmount(viewMoreData.amountAvailable).currencyType + currentAmount(viewMoreData.amountAvailable).amount + " moved to Cubana's wallet" }</Typography>
                                            {/* <Typography component='span'>Another test: </Typography> */}
                                        </Box>
                                    </Box>
                                </Box>)
                                })
                            }
                        </Box>

                        <Box component="div" className={classes.filterBoxContainer}>
                            <Typography component=""></Typography>
                        </Box>
                    </Box>
                </Box> :
                ''
            }

            {
                exportAllLoader ?
                <ExportAllLoader loader={exportAllLoader} />
                : ''
            }
        </section>
    </>
    )
}

export default Transactions;