import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
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

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 3)
    },

    title: {
        fontWeight: 600
    },

    link: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },

    filterContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: theme.spacing(4),
        marginTop: theme.spacing(1)
    },

    filter: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.spacing(1),

        '& span:first-child': {
            fontWeight: 600,
            color: theme.palette.primary.main
        },

        '& span:last-child': {
            color: theme.palette.primary.main,
            fontWeight: 600
        }
    },

    active: {
        backgroundColor: theme.palette.primary.main,
        
        '& span': {
            color: `${COLORS.offWhite} !important`,
        }
    },

    table: {
        borderTop: `1px solid ${theme.palette.primary.main}`,
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: '50vh',
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(3)
    },

    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1fr 0.5fr 0.7fr 0.5fr',
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
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius
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

const Customers = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

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

    const { ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;

    const pages = [10, 25, 100]
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    const [customerCount, setCustomerCount] = useState(0);
    const [error, setError] = useState('');
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(NO_PROFILE);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
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
                break;

            default:
                break;
        }
    }, [ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED, filter, getCustomers, getCustomersWithoutProfile, getNewCustomers, getRejectedCustomers, getSuspendedCustomers, getVerifiedCustomers, rowsPerPage, page]);

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };


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
        history.push(`${CUSTOMERS}/${customer.id}`);
    };

    const editProfile = () => {
        handleClose();
        history.push(`${CUSTOMERS}/${customer.id}`, { editProfile: true });
    };

    const contact = () => {
        handleClose();
    };

    const suspend = () => {
        handleClose();
        setCustomerStatus({
            customerID: customer.id,
            newStatus: SUSPENDED,
            currentStatus: filter
        });
    };

    const changeRiskProfile = () => {
        handleClose();
    };

    const viewCustomerProfile = (customer) => {
        dispatch({
            type: SET_CUSTOMER,
            payload: customer
        });
        history.push(`${CUSTOMERS}/${customer.id}`);
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
                        <Typography variant="body1" className={classes.title}>Customers</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" className={classes.link} onClick={downloadRecords}>Download Records</Typography>
                    </Grid>
                </Grid>
                <Box component="section" className={classes.filterContainer}>
                    <div className={clsx(classes.filter, filter === NO_PROFILE && classes.active)} onClick={() => handleSetFilter(NO_PROFILE)}>
                        <Typography variant="subtitle2" component="span">No Profile</Typography>
                        <Typography variant="subtitle2" component="span">{totalCustomersWithNoProfile}</Typography>
                    </div>
                    <div className={clsx(classes.filter, filter === CONFIRMED && classes.active)} onClick={() => handleSetFilter(CONFIRMED)}>
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
                    <div className={clsx(classes.filter, filter === ALL_CUSTOMERS && classes.active)} onClick={() => handleSetFilter(ALL_CUSTOMERS)}>
                        <Typography variant="subtitle2" component="span">All</Typography>
                        <Typography variant="subtitle2" component="span">{totalCustomers}</Typography>
                    </div>
                </Box>
                <Paper>
                    <TableContainer className={classes.table}>
                        <Table stickyHeader aria-label="sticky table" style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow className={classes.tableHeader}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
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
                    </TableContainer>
                    <TablePagination
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
                    />
                </Paper>
                <Menu
                    id="customer-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    classes={{ paper: classes.menu }}
                >
                    <MenuItem onClick={viewDetails}>View Details</MenuItem>
                    <Divider />
                    <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
                    <Divider />
                    <MenuItem onClick={contact}>Contact</MenuItem>
                    <Divider />
                    <MenuItem onClick={suspend} disabled={filter === SUSPENDED || filter === REJECTED}>Suspend</MenuItem>
                    <Divider />
                    <MenuItem onClick={changeRiskProfile}>Change Risk Profile</MenuItem>
                </Menu>
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