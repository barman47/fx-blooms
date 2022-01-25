import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Box,
    Button,
    Grid,
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
    getMoreCustomers, 
    getNewCustomers, 
    getMoreNewCustomers, 
    getRejectedCustomers, 
    getMoreRejectedCustomers, 
    getSuspendedCustomers,
    getMoreSuspendedCustomers,
    getVerifiedCustomers, 
    getMoreVerifiedCustomers, 
    getCustomersWithoutProfile,
    getMoreCustomersWithoutProfile
} from '../../../actions/customer';
import { COLORS, CUSTOMER_CATEGORY } from '../../../utils/constants';

import AllCustomers from './AllCustomers';
import NoProfileCustomers from './NoProfileCustomers';
import NewCustomers from './NewCustomers';
import RejectedCustomers from './RejectedCustomers';
import VerifiedCustomers from './VerifiedCustomers';

const useStyles = makeStyles((theme) => ({
    root: {
        border: '1px solid red',
        padding: theme.spacing(3)
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
        marginTop: theme.spacing(2)
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
        maxHeight: 440,
        overflowX: 'hidden',
        // backgroundColor: COLORS.lightTeal,
        // marginTop: theme.spacing(3),

        // '& header': {
            
            
        //     '& span': {
        //         color: theme.palette.primary.main,
        //         fontWeight: 600,
        //         padding: theme.spacing(1),

        //         [theme.breakpoints.down('md')]: {
        //             fontSize: theme.spacing(1.5)
        //         },

        //         [theme.breakpoints.down('sm')]: {
        //             fontSize: theme.spacing(1)
        //         },
        //     }
        // }
    },

    tableHeader: {
        border: '1px solid red',
        backgroundColor: COLORS.white,
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1fr 0.5fr 0.7fr 0.5fr',
        // width: '100%',
        // alignItems: 'center',
        // marginBottom: theme.spacing(3),
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
    },

    

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: 'pointer'
    },

    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

const columns = [
    { id: '', label: '', minWidth: 10 },
    { id: 'firstName', label: 'First Name', minWidth: 100 },
    {
      id: 'lastName',
      label: 'Last Name',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'email',
      label: 'Email Address',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'username',
      label: 'Username',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'riskProfile',
      label: 'Risk Profile',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
    //   align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    }
];

const Customers = (props) => {
    const classes = useStyles();

    const { admin } = useSelector(state => state);
    const { confirmed, customers, noProfile, pending, rejected, suspended, count } = useSelector(state => state.customers);
    const { 
        // totalCustomersAwaitingApproval, 
        totalApprovedCustomers, 
        totalCustomers, 
        totalRejectedCustomers,
        totalSuspendedCustomers,
        totalCustomersWithNoProfile 
    } = useSelector(state => state.stats);

    const { ALL_CUSTOMERS, CONFIRMED, NO_PROFILE, PENDING, REJECTED, SUSPENDED_CUSTOMERS } = CUSTOMER_CATEGORY;
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [customerCount, setCustomerCount] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(NO_PROFILE);

    const { 
        getCustomers, 
        getMoreCustomers, 
        getNewCustomers, 
        getCustomersWithoutProfile,
        getMoreCustomersWithoutProfile,
        getSuspendedCustomers,
        getMoreSuspendedCustomers,
        getMoreNewCustomers, 
        getVerifiedCustomers, 
        getMoreVerifiedCustomers, 
        getRejectedCustomers, 
        getMoreRejectedCustomers, 
        handleSetTitle 
    } = props;

    useEffect(() => {
        handleSetTitle('Customers');
        if (count === 0) {
            getNewCustomers();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [confirmed.items, customers.items, noProfile.items, pending.items, rejected.items, suspended.items]);

    const handleChangePage = (event, newPage) => {
        console.log(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleSetFilter = (filter) => {
        setFilter(filter);
        switch (filter) {
            case CONFIRMED:
                getVerifiedCustomers({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            case PENDING:
                getNewCustomers({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            case REJECTED:
                getRejectedCustomers({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            case ALL_CUSTOMERS:
                getCustomers({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            case SUSPENDED_CUSTOMERS:
                getSuspendedCustomers({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            case NO_PROFILE:
                getCustomersWithoutProfile({
                    pageNumber: 1,
                    pageSize: 25
                });
                break;

            default:
                break;
        }  
    };

    const getMore = () => {
        setLoading(true);
        switch (filter) {
            case CONFIRMED:
                if (confirmed.hasNext) {
                    getMoreVerifiedCustomers({
                        pageSize: 25,
                        pageNumber: confirmed.currentPageNumber + 1
                    });
                }
                break;

            case PENDING:
                if (pending.hasNext) {
                    getMoreNewCustomers({
                        pageSize: 25,
                        pageNumber: pending.currentPageNumber + 1
                    });
                }
                break;

            case REJECTED:
                if (rejected.hasNext) {
                    getMoreRejectedCustomers({
                        pageSize: 25,
                        pageNumber: rejected.currentPageNumber + 1
                    });
                }
                break;

                case SUSPENDED_CUSTOMERS:
                    getMoreSuspendedCustomers({
                        pageSize: 25,
                        pageNumber: suspended.currentPageNumber + 1
                    });
                    break;

            case NO_PROFILE:
                getMoreCustomersWithoutProfile({
                    pageSize: 25,
                    pageNumber: noProfile.currentPageNumber + 1
                });
                break;
            
            case ALL_CUSTOMERS:
                if (customers.hasNext) {
                    getMoreCustomers({
                        pageSize: 25,
                        pageNumber: customers.currentPageNumber + 1
                    });
                }
                break;

            default:
                setLoading(false);
                break;
        }
    };

    const getCount = () => {
        switch (filter) {
            case CONFIRMED:
                setCustomerCount(confirmed.totalItemCount);
                break;

            case PENDING:
                setCustomerCount(pending.totalItemCount);
                break;

            case REJECTED:
                setCustomerCount(rejected.totalItemCount);
                break;

                case SUSPENDED_CUSTOMERS:
                    setCustomerCount(suspended.totalItemCount);
                    break;

            case NO_PROFILE:
                setCustomerCount(noProfile.totalItemCount);
                break;
            
            case ALL_CUSTOMERS:
                setCustomerCount(customers.totalItemCount);
                break;

            default:
                setCustomerCount(0);
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
            <section className={classes.root}>
                <Grid container direction="row" justify="space-between">
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
                    <div className={clsx(classes.filter, filter === SUSPENDED_CUSTOMERS && classes.active)} onClick={() => handleSetFilter(SUSPENDED_CUSTOMERS)}>
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
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.content}>
                                {filter === NO_PROFILE && <NoProfileCustomers handleSetTitle={handleSetTitle} />}
                                {filter === PENDING && <NewCustomers handleSetTitle={handleSetTitle} />}
                                {filter === CONFIRMED && <VerifiedCustomers handleSetTitle={handleSetTitle} />}
                                {filter === REJECTED && <RejectedCustomers handleSetTitle={handleSetTitle} />}
                                {filter === ALL_CUSTOMERS && <AllCustomers handleSetTitle={handleSetTitle} />}
                                <Button 
                                    color="primary" 
                                    className={classes.button} 
                                    onClick={getMore}
                                    disabled={
                                        (filter === PENDING && !pending.hasNext) || 
                                        (filter === CONFIRMED && !confirmed.hasNext) || 
                                        (filter === REJECTED && !rejected.hasNext) || 
                                        (filter === ALL_CUSTOMERS && !customers.hasNext) || 
                                        (filter === NO_PROFILE && !noProfile.hasNext) || 
                                        (loading) ? true : false}
                                >
                                    {loading ? 'Please Wait . . . ' : 'Load More'}
                                </Button>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
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
            </section>
        </>
    );
}

Customers.propTypes = {
    getCustomers: PropTypes.func.isRequired,
    getCustomersWithoutProfile: PropTypes.func.isRequired,
    getSuspendedCustomers: PropTypes.func.isRequired,
    getMoreCustomers: PropTypes.func.isRequired,
    getNewCustomers: PropTypes.func.isRequired,
    getMoreNewCustomers: PropTypes.func.isRequired,
    getRejectedCustomers: PropTypes.func.isRequired,
    getMoreRejectedCustomers: PropTypes.func.isRequired,
    getVerifiedCustomers: PropTypes.func.isRequired,
    getMoreVerifiedCustomers: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { 
    getCustomers, 
    getMoreCustomers, 
    getCustomersWithoutProfile, 
    getMoreCustomersWithoutProfile, 
    getSuspendedCustomers,
    getMoreSuspendedCustomers, 
    getNewCustomers, 
    getMoreNewCustomers, 
    getRejectedCustomers, 
    getMoreRejectedCustomers, 
    getVerifiedCustomers, 
    getMoreVerifiedCustomers 
})(Customers);