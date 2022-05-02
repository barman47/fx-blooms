import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Box,
    Divider,
    Grid,
    Menu,
    MenuItem,
    // Paper,
    // Table,
    // TableBody,
    // TableCell,
    // TableContainer,
    // TableHead,
    // TablePagination,
    // TableRow,
    Typography
} from '@material-ui/core';

import { 
    getCustomers, 
    getNewCustomers, 
    getRejectedCustomers, 
    getSuspendedCustomers,
    getVerifiedCustomers, 
    getCustomersWithoutProfile,
    setCustomerStatus
} from '../../../actions/customer';
import { getStats } from '../../../actions/admin';
import { CLEAR_CUSTOMER_STATUS_MSG, SET_CATEGORY, SET_CUSTOMER, SET_PAGE_NUMBER, SET_PAGE_SIZE } from '../../../actions/types';

import { COLORS, CUSTOMER_CATEGORY } from '../../../utils/constants';
import { CUSTOMERS } from '../../../routes';

import AllCustomers from './AllCustomers';
import NoProfileCustomers from './NoProfileCustomers';
import SuspendedCustomers from './SuspendedCustomers';
import RejectedCustomers from './RejectedCustomers';
import VerifiedCustomers from './VerifiedCustomers';
import SuccessModal from '../../../components/common/SuccessModal';
import isEmpty from '../../../utils/isEmpty';
import GenericTableHeader from '../../../components/admin-dashboard/GenericTableHeader'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import { ArrowTopRight } from 'mdi-material-ui';


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
            borderRadius: theme.spacing(1)
        },

        '&:not(:first-child) span': {
        }
    },

    active: {
        borderBottom: '2px solid #1E6262'
    },

    table: {
        marginTop: theme.spacing(2)
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

    menu: {
        backgroundColor: 'white',
        border: `none`,
        borderRadius: theme.spacing(1.9),
        marginRight: '10px',
        cursor: 'pointer',
        // left: '1695px !important',

        '& ul': {
            padding: '0'
        },

        '& li': {
            padding: theme.spacing(2),
            paddingLeft: theme.spacing(2.5)
        }
    },

    selected: {
        color: 'red',
        fontWeight: 600,
        fontSize: '2vw'
    }
}));

const columns = [
    { id: '', label: '', minWidth: 10 },
    { id: 'firstName', label: 'First Name', minWidth: 100 },
    {
      id: 'lastName',
      label: 'Last Name',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'email',
      label: 'Email Address',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'username',
      label: 'Username',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'riskProfile',
      label: 'Risk Profile',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (value) => value.toLocaleString('en-US'),
    }
];

const gridColumns = '0.15fr 1fr 1fr 1.2fr 1.2fr .8fr 1fr 0.3fr';
const pages = [20, 50, 75, 100]

const Customers = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { admin } = useSelector(state => state);
    const { confirmed, customer, customers, msg, noProfile, pending, rejected, suspended } = useSelector(state => state.customers);
    const { 
        // totalCustomersAwaitingApproval, 
        totalApprovedCustomers, 
        totalCustomers, 
        totalRejectedCustomers,
        totalSuspendedCustomers,
        totalCustomersWithNoProfile 
    } = useSelector(state => state.stats);
    // const [ isDisabled, setDisabled ] = useState(true)

    // const { isMenuOpen } = useSelector(state => state.admin);

    const { ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    const [customerCount, setCustomerCount] = useState(0);
    const [error, setError] = useState('');
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(ALL_CUSTOMERS);
    const [anchorEl, setAnchorEl] = useState(null);
    const [pageNumber, setPageNumber] = useState(0)
    const [pageNumberList, setPageNumberList] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    // const paginationRange  = usePagination({pageNumber, currentPage, siblingCount, pageSize})


    const [ lastPage ] = useState(pageNumberList?.length - 1)

    const handleClick = (event) => {
        console.log('event', event.currentTarget)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { 
        getCustomers, 
        getNewCustomers, 
        getCustomersWithoutProfile,
        getSuspendedCustomers,
        getVerifiedCustomers, 
        getRejectedCustomers, 
        getStats,
        setCustomerStatus,
        handleSetTitle 
    } = props;

    const successModal = useRef();

    const handlePageNUmberList = useCallback(() => {
        const pageNumArr = []
        if (pageNumber >= 1) {
            for (let i=1; i<=pageNumber; i++) {
                pageNumArr.push(i)
            }
        }
        setPageNumberList(pageNumArr)
    }, [pageNumber])


    const onNextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const onPrevPage = () => {
        setCurrentPage(currentPage - 1)
    }

    useEffect(() => {
        console.log('test', lastPage)
        // if (currentPage === 0 || (paginationRange && paginationRange?.length < 2)) return null
    }, [currentPage, lastPage])

    // NEXT PAGE BUTTON
    // const nextPage = useCallback(() => {
    //     switch (filter) {
    //         case CONFIRMED:
    //             setCustomerCount(confirmed.totalItemCount || 0);
    //             break;

    //         case PENDING:
    //             setCustomerCount(pending.totalItemCount || 0);
    //             break;

    //         case REJECTED:
    //             setCustomerCount(rejected.totalItemCount || 0);
    //             break;

    //         case SUSPENDED:
    //             setCustomerCount(suspended.totalItemCount || 0);
    //             break;

    //         case NO_PROFILE:
    //             setCustomerCount(noProfile.totalItemCount || 0);
    //             break;
            
    //         case ALL_CUSTOMERS:
    //             setPage(page + 1)
    //             getCustomers({
    //                 pageSize: pages[0] += pages[0] + 5,
    //                 pageNumber: page
    //             });
    //             break;

    //         default:
    //             setCustomerCount(0);
    //             break;
    //     }
    // }, [ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED, confirmed.totalItemCount, filter, getCustomers, noProfile.totalItemCount, page, pending.totalItemCount, rejected.totalItemCount, suspended.totalItemCount])

    useEffect(() => {
        handleSetTitle('Customers');
        if (isEmpty(noProfile)) {
            getCustomersWithoutProfile({
                pageNumber: 1,
                pageSize: rowsPerPage
            });
        }
        // eslint-disable-next-line
    }, []);

    // Reset page number when filter changes
    useEffect(() => {
        if (filter) {
            setPage(0);
        }
    }, [filter]);

    // Set page number for search when page number changes
    useEffect(() => {
        dispatch({
            type: SET_PAGE_NUMBER,
            payload: page
        });
    }, [dispatch, page]);

    // Set page size for search when page size changes
    useEffect(() => {
        dispatch({
            type: SET_PAGE_SIZE,
            payload: rowsPerPage
        });
    }, [dispatch, rowsPerPage]);

    useEffect(() => {
        getStats();
        setLoading(false);
    }, [confirmed.items, customers.items, noProfile.items, pending.items, rejected.items, suspended.items, getStats]);

    useEffect(() => {
        if (msg && customer) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [customer, msg]);

    const dismissAction = () => {
        batch(() => {
            dispatch({
                type: SET_CUSTOMER,
                payload: {}
            });
            dispatch({
                type: CLEAR_CUSTOMER_STATUS_MSG
            });
        });
    };

    // const handleLoading = useCallback(() => {})

    const getCount = useCallback(() => {
        switch (filter) {
            case CONFIRMED:
                setCustomerCount(confirmed.totalItemCount || 0);
                break;

            case PENDING:
                setCustomerCount(pending.totalItemCount || 0);
                break;

            case REJECTED:
                setCustomerCount(rejected.totalItemCount || 0);
                break;

            case SUSPENDED:
                setCustomerCount(suspended.totalItemCount || 0);
                break;

            case NO_PROFILE:
                setCustomerCount(noProfile.totalItemCount || 0);
                break;
            
            case ALL_CUSTOMERS:
                setCustomerCount(customers.totalItemCount || 0);
                break;

            default:
                setCustomerCount(0);
                break;
        }
    }, [filter, ALL_CUSTOMERS, CONFIRMED, PENDING, REJECTED, SUSPENDED, NO_PROFILE, customers.totalItemCount, confirmed.totalItemCount, pending.totalItemCount, rejected.totalItemCount, suspended.totalItemCount, noProfile.totalItemCount]);

    // const getMore = useCallback(() => {
    //     setLoading(true);
    //     switch (filter) {
    //         case CONFIRMED:
    //             if (confirmed.hasNext) {
    //                 getVerifiedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: confirmed.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         case PENDING:
    //             if (pending.hasNext) {
    //                 getNewCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: pending.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         case REJECTED:
    //             if (rejected.hasNext) {
    //                 getRejectedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: rejected.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //             case SUSPENDED:
    //                 getSuspendedCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: suspended.currentPageNumber + 1
    //                 });
    //                 break;

    //         case NO_PROFILE:
    //             getCustomersWithoutProfile({
    //                 pageSize: rowsPerPage,
    //                 pageNumber: noProfile.currentPageNumber + 1
    //             });
    //             break;
            
    //         case ALL_CUSTOMERS:
    //             if (customers.hasNext) {
    //                 getCustomers({
    //                     pageSize: rowsPerPage,
    //                     pageNumber: customers.currentPageNumber + 1
    //                 });
    //             }
    //             break;

    //         default:
    //             setLoading(false);
    //             break;
    //     }
    // }, [ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED, confirmed.currentPageNumber, confirmed.hasNext, customers.currentPageNumber, customers.hasNext, filter, getCustomers, getCustomersWithoutProfile, getNewCustomers, getRejectedCustomers, getSuspendedCustomers, getVerifiedCustomers, noProfile.currentPageNumber, pending.currentPageNumber, pending.hasNext, rejected.currentPageNumber, rejected.hasNext, rowsPerPage, suspended.currentPageNumber]);
    
    const fetchCustomers = useCallback(() => {
        setLoading(true);
        switch (filter) {
            case CONFIRMED:
                getVerifiedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                break;

            case PENDING:
                getNewCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                break;

            case REJECTED:
                getRejectedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                break;

            case SUSPENDED:
                getSuspendedCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                break;

            case NO_PROFILE:
                getCustomersWithoutProfile({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                break;
            
            case ALL_CUSTOMERS:
                getCustomers({
                    pageSize: rowsPerPage,
                    pageNumber: page
                });
                setPageNumber(Math.ceil(customerCount/20))
                handlePageNUmberList()
                break;
            default:
                break;
        }
    }, [ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED, filter, getCustomers, getCustomersWithoutProfile, getNewCustomers, getRejectedCustomers, getSuspendedCustomers, getVerifiedCustomers, rowsPerPage, page, handlePageNUmberList, customerCount]);

    // Get customers when page number changes
    useEffect(() => {
        if (page > 0) {
            fetchCustomers();
        }
    }, [fetchCustomers, page]);

    useEffect(() => {
        getCount();
    }, [filter, getCount]);

    // Get customers whenever rows per page changes
    useEffect(() => {
        if (rowsPerPage > 0) {
            fetchCustomers();
        }
    }, [fetchCustomers, rowsPerPage]);


    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(1);
    // };


    const handleSetFilter = (filter) => {
        setFilter(filter);
        setRowsPerPage(pages[0]);
        dispatch({
            type: SET_CATEGORY,
            payload: filter
        });
        switch (filter) {
            case CONFIRMED:
                getVerifiedCustomers({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });
                break;

            case PENDING:
                getNewCustomers({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });
                break;

            case REJECTED:
                getRejectedCustomers({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });
                break;

            case ALL_CUSTOMERS:
                getCustomers({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });

                break;

            case SUSPENDED:
                getSuspendedCustomers({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });
                break;

            case NO_PROFILE:
                getCustomersWithoutProfile({
                    pageNumber: 1,
                    pageSize: rowsPerPage
                });
                break;

            default:
                break;
        }  
    };

    const downloadRecords = () => {
        setError('');
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let data = [];

        switch (filter) {
            case CONFIRMED:
                data = [...confirmed.items];
                break;

            case PENDING:
                data = [...pending.items];
                break;

            case REJECTED:
                data = [...rejected.items];
                break;
            
            case ALL_CUSTOMERS:
                data = [...customers.items];
                break;

            default:
                break;
        }

        if (data.length === 0) {
            return setError('Cannot an empty list');
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wsCols = [
            {wpx: 40},
            {wpx: 250},
            {wpx: 250},
            {wpx: 250},
            {wpx: 250},
            {wpx: 250}
        ];
        ws['!cols'] = wsCols;
        // ws['!protect'] = {
        //     selectLockedCells: false
        // };
        // ws['A1'].v = 'This is a test header';
        // const customProps = {
        //     Exported: new Date().toISOString(),
        //     Category: filter,
        //     Admin: `${admin.firstName} ${admin.lastName}`
        // };
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }; 
    
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', Props: {
            Owner: 'FXBLOOMS.com',
            Date: new Date().toISOString(),
            Category: filter,
            Admin: `${admin.firstName} ${admin.lastName}`
        }});
    
        const usersData = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(usersData, `FXBLOOMS Customers - ${new Date().toISOString()}${fileExtension}`);
    };

    const viewDetails = () => {
        handleClose();
        // handleSetTitle('User Details');
        navigate(`${CUSTOMERS}/${customer.id}`);
    };

    const editProfile = () => {
        handleClose();
        navigate(`${CUSTOMERS}/${customer.id}`, { editProfile: true });
    };

    const contact = () => {
        handleClose();
    };

    const suspend = (e) => {
        handleClose();
        if (customer.customerStatus !== SUSPENDED) {
            setCustomerStatus({
                customerID: customer.id,
                newStatus: SUSPENDED,
                currentStatus: filter
            });
        }
    };

    const changeRiskProfile = () => {
        handleClose();
    };

    const viewCustomerProfile = (customer) => {
        dispatch({
            type: SET_CUSTOMER,
            payload: customer
        });
        navigate(`${CUSTOMERS}/${customer.id}`);
    }


    return (
        <>
            {error && 
                <Alert
                    severity="warning"
                    onClose={() => {
                        setError('');
                    }}
                    // action={
                    //     <Button color="inherit" size="small">
                    //     UNDO
                    //     </Button>
                    // }
                    >
                    {error}
                </Alert>
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body1" className={classes.title}>All Users</Typography>
                    </Grid>
                    <Grid item>
                        <Box component="div">
                            <GenericButton buttonName="Export" onClick={downloadRecords}>
                                <ArrowTopRight />
                            </GenericButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box component="section" className={classes.filterContainer}>
                    <div className={clsx(classes.filter, filter === ALL_CUSTOMERS && classes.active)} onClick={() => handleSetFilter(ALL_CUSTOMERS)}>
                        <Typography variant="subtitle2" component="span">All</Typography>
                        <Typography variant="subtitle2" component="span">{totalCustomers}</Typography>
                    </div>
                    <div style={{ color: '#1E6262'}} className={clsx(classes.filter, filter === CONFIRMED && classes.active)} onClick={() => handleSetFilter(CONFIRMED)}>
                        <Typography variant="subtitle2" component="span">Verified</Typography>
                        <Typography variant="subtitle2" component="span">{totalApprovedCustomers}</Typography>
                    </div>
                    <div className={clsx(classes.filter, filter === REJECTED && classes.active)} onClick={() => handleSetFilter(REJECTED)}>
                        <Typography variant="subtitle2" component="span">Rejected</Typography>
                        <Typography variant="subtitle2" component="span">{totalRejectedCustomers}</Typography>
                    </div>
                    <div className={clsx(classes.filter, filter === SUSPENDED && classes.active)} onClick={() => handleSetFilter(SUSPENDED)}>
                        <Typography variant="subtitle2" component="span">Suspended</Typography>
                        <Typography variant="subtitle2" component="span">{totalSuspendedCustomers}</Typography>
                    </div>
                    <div className={clsx(classes.filter, filter === NO_PROFILE && classes.active)} onClick={() => handleSetFilter(NO_PROFILE)}>
                        <Typography variant="subtitle2" component="span">No Profile</Typography>
                        <Typography variant="subtitle2" component="span">{totalCustomersWithNoProfile}</Typography>
                    </div>
                </Box>
                {/* <Paper> */}
                <Box component="div" className={classes.table}>
                    <GenericTableHeader columns={columns} gridColumns={gridColumns}/>
                    {filter === NO_PROFILE && 
                        <NoProfileCustomers 
                            handleClick={handleClick} 
                            handleSetTitle={handleSetTitle} 
                            loading={loading}
                            viewCustomerProfile={viewCustomerProfile} 
                        />
                    }
                    {filter === SUSPENDED && 
                        <SuspendedCustomers 
                            handleClick={handleClick} 
                            handleSetTitle={handleSetTitle} 
                            loading={loading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    }
                    {filter === CONFIRMED && 
                        <VerifiedCustomers 
                            handleClick={handleClick} 
                            handleSetTitle={handleSetTitle} 
                            loading={loading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    }
                    {filter === REJECTED && 
                        <RejectedCustomers 
                            handleClick={handleClick} 
                            handleSetTitle={handleSetTitle} 
                            loading={loading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    }
                    {filter === ALL_CUSTOMERS && 
                        <AllCustomers 
                            handleClick={handleClick} 
                            handleSetTitle={handleSetTitle}
                            loading={loading}
                            viewCustomerProfile={viewCustomerProfile}
                        />
                    }
                </Box>
                {/* <TableContainer className={classes.table}>
                    <Table stickyHeader aria-label="sticky table" style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow className={classes.tableHeader}>
                                {columns.map((column, i) => (
                                    <TableCell
                                        key={i}
                                        // align={column.align}
                                        style={{ background: 'transparent', minWidth: column.minWidth, fontWeight: 'bold',  }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.content}>
                            {filter === NO_PROFILE && 
                                <NoProfileCustomers 
                                    handleClick={handleClick} 
                                    handleSetTitle={handleSetTitle} 
                                    viewCustomerProfile={viewCustomerProfile} 
                                />
                            }
                            {filter === SUSPENDED && 
                                <SuspendedCustomers 
                                    handleClick={handleClick} 
                                    handleSetTitle={handleSetTitle} 
                                    viewCustomerProfile={viewCustomerProfile}
                                />
                            }
                            {filter === CONFIRMED && 
                                <VerifiedCustomers 
                                    handleClick={handleClick} 
                                    handleSetTitle={handleSetTitle} 
                                    viewCustomerProfile={viewCustomerProfile}
                                />
                            }
                            {filter === REJECTED && 
                                <RejectedCustomers 
                                    handleClick={handleClick} 
                                    handleSetTitle={handleSetTitle} 
                                    viewCustomerProfile={viewCustomerProfile}
                                />
                            }
                            {filter === ALL_CUSTOMERS && 
                                <AllCustomers 
                                    handleClick={handleClick} 
                                    handleSetTitle={handleSetTitle}
                                    viewCustomerProfile={viewCustomerProfile}
                                />
                            }
                        </TableBody>
                    </Table>
                </TableContainer> */}
                    {/* <TablePagination
                        rowsPerPageOptions={pages}
                        component="div"
                        count={customerCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        classes={{
                            root: classes.pagination
                        }}
                    /> */}
                {/* </Paper> */}
                <Menu
                    id="customer-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    classes={{ paper: classes.menu }}
                    disableScrollLock={ true }
                >
                    <MenuItem onClick={viewDetails}>View Details</MenuItem>
                    <Divider />
                    <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
                    <Divider />
                    <MenuItem onClick={contact}>Contact</MenuItem>
                    <Divider />
                    <MenuItem onClick={suspend} disabled={customer.customerStatus === REJECTED}>{ customer.customerStatus === SUSPENDED ? 'UnSuspend' : 'Suspend' }</MenuItem>
                    <Divider />
                    <MenuItem onClick={changeRiskProfile}>Change Risk Profile</MenuItem>
                </Menu>


                {
                    loading ? '' :
                    <Box component="div" sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', width: "100%" }}>
                        <Box component="div" sx={{ alignSelf: "flex-start" }}>
                            <Typography component="span">{'20'} results</Typography>
                        </Box>

                        <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
                                <GenericButton clickAction={onPrevPage} isDisabled={currentPage === 1} buttonName="Previous" />
                                <GenericButton clickAction={onNextPage} isDisabled={currentPage === lastPage} buttonName="Next" />
                            </Box> 
                            <Box component="span"  sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                                {
                                    pageNumberList && pageNumberList.map((pageNUmber, i) => (
                                        <Typography className={clsx(pageNUmber === currentPage && classes.active)} onClick={() => setCurrentPage(pageNumber)} variant="subtitle2" key={i}>{pageNUmber}</Typography>
                                    ))
                                }
                            </Box>
                        </Box>                    
                    </Box>
                }
            </section>
        </>
    );
}

Customers.propTypes = {
    getCustomers: PropTypes.func.isRequired,
    getCustomersWithoutProfile: PropTypes.func.isRequired,
    getSuspendedCustomers: PropTypes.func.isRequired,
    getStats: PropTypes.func.isRequired,
    getNewCustomers: PropTypes.func.isRequired,
    getRejectedCustomers: PropTypes.func.isRequired,
    getVerifiedCustomers: PropTypes.func.isRequired,
    setCustomerStatus: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { 
    getCustomers, 
    getCustomersWithoutProfile, 
    getSuspendedCustomers,
    getNewCustomers, 
    getRejectedCustomers, 
    getVerifiedCustomers,
    getStats,
    setCustomerStatus 
})(Customers);