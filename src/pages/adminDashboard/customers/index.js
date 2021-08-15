import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Button,
    Grid,
    Typography
} from '@material-ui/core';

import { getNewCustomers } from '../../../actions/customer';
import { SET_CUSTOMER } from '../../../actions/types';
import { COLORS, CONFIRMED, PENDING, REJECTED } from '../../../utils/constants';
import { ADMIN_DASHBOARD, CUSTOMERS } from '../../../routes';

import NewCustomers from './NewCustomers';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
    },

    title: {
        fontWeight: 600
    },

    link: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },

    filterContainer: {
        marginTop: theme.spacing(2)
    },

    filter: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: [[theme.spacing(3), theme.spacing(2)]]
    },

    active: {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
    },

    table: {
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(3),

        '& header': {
            backgroundColor: COLORS.white,
            display: 'grid',
            gridTemplateColumns: '0.2fr 1fr 1.2fr 1.2fr 1.7fr 1.2fr 0.8fr',
            marginBottom: theme.spacing(3),
            
            '& span': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                padding: theme.spacing(1),

                [theme.breakpoints.down('md')]: {
                    fontSize: theme.spacing(1.5)
                }
            }
        }
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

const Customers = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { admin } = useSelector(state => state);
    const { confirmed, pending, rejected, count } = useSelector(state => state.customers);
    const { totalCustomersAwaitingApproval, totalApprovedCustomers, totalCustomers, totalRejectedCustomers } = useSelector(state => state.stats);

    const [error, setError] = useState('');
    const [filter, setFilter] = useState(PENDING);

    const { getNewCustomers, handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Customers');
        if (count === 0) {
            getNewCustomers();
        }
        // handleSetTitle('Customers');
        // eslint-disable-next-line
    }, []);

    const handleViewCustomer = (customer) => {
        dispatch({
            type: SET_CUSTOMER,
            payload: customer
        });
        handleSetTitle('User Details');
        history.push(`${ADMIN_DASHBOARD}${CUSTOMERS}/${customer.id}`);
    };

    const downloadRecords = () => {
        setError('');
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let data = [];

        switch (filter) {
            case CONFIRMED:
                confirmed.forEach((customer, index) => {
                    data.push({
                        'S/N': index + 1,
                        'Full Name': `${customer.firstName} ${customer.lastName}`,
                        'Phone Number': customer.phoneNo,
                        'ID Type': customer.documentation.documentType,
                        'Email': customer.email,
                        Username: customer.username,
                    });
                });
                break;

            case PENDING:
                pending.forEach((customer, index) => {
                    data.push({
                        'S/N': index + 1,
                        'Full Name': `${customer.firstName} ${customer.lastName}`,
                        'Phone Number': customer.phoneNo,
                        'ID Type': customer.documentation.documentType,
                        'Email': customer.email,
                        Username: customer.username,
                    });
                });
                break;

            case REJECTED:
                rejected.forEach((customer, index) => {
                    data.push({
                        'S/N': index + 1,
                        'Full Name': `${customer.firstName} ${customer.lastName}`,
                        'Phone Number': customer.phoneNo,
                        'ID Type': customer.documentation.documentType,
                        'Email': customer.email,
                        Username: customer.username,
                    });
                });
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
                <Grid container direction="row" spacing={5} className={classes.filterContainer}>
                    <Grid item xs={6} md={3}>
                        <div className={clsx(classes.filter, filter === PENDING && classes.active)} onClick={() => setFilter(PENDING)}>
                            <Typography variant="subtitle2" component="span">New</Typography>
                            <Typography variant="subtitle2" component="span">{totalCustomersAwaitingApproval}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <div className={clsx(classes.filter, filter === CONFIRMED && classes.active)} onClick={() => setFilter(CONFIRMED)}>
                            <Typography variant="subtitle2" component="span">Verified</Typography>
                            <Typography variant="subtitle2" component="span">{totalApprovedCustomers}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <div className={clsx(classes.filter, filter === REJECTED && classes.active)} onClick={() => setFilter(REJECTED)}>
                            <Typography variant="subtitle2" component="span">Rejected</Typography>
                            <Typography variant="subtitle2" component="span">{totalRejectedCustomers}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <div className={classes.filter}>
                            <Typography variant="subtitle2" component="span">All</Typography>
                            <Typography variant="subtitle2" component="span">{totalCustomers}</Typography>
                        </div>
                    </Grid>
                </Grid>
                <section className={classes.table}>
                    <header>
                        <Typography variant="subtitle2" component="span">#</Typography>
                        <Typography variant="subtitle2" component="span">Full Name</Typography>
                        <Typography variant="subtitle2" component="span">Phone Number</Typography>
                        <Typography variant="subtitle2" component="span">ID Type</Typography>
                        <Typography variant="subtitle2" component="span">Email Address</Typography>
                        <Typography variant="subtitle2" component="span">Username</Typography>
                        <Typography variant="subtitle2" component="span"></Typography>
                    </header>
                    <main className={classes.content}>
                        {filter === PENDING && <NewCustomers handleSetTitle={handleSetTitle} />}
                        
                        {filter === CONFIRMED && 
                            confirmed.map((customer, index) => (
                                <div key={customer.id} className={classes.customer}>
                                    <Typography variant="subtitle2" component="span">{index + 1}</Typography>
                                    <Typography variant="subtitle2" component="span">{`${customer.firstName} ${customer.lastName}`}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.phoneNo}</Typography>
                                    {/* <Typography variant="subtitle2" component="span">{customer.documentation.documentType}</Typography> */}
                                    <Typography variant="subtitle2" component="span">{customer.email}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.username}</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.customerLink} onClick={() => handleViewCustomer(customer)}>View Details</Typography>
                                </div>
                            ))
                        }
                        {filter === REJECTED && 
                            rejected.map((customer, index) => (
                                <div key={customer.id} className={classes.customer}>
                                    <Typography variant="subtitle2" component="span">{index + 1}</Typography>
                                    <Typography variant="subtitle2" component="span">{`${customer.firstName} ${customer.lastName}`}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.phoneNo}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.documentation.documentType}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.email}</Typography>
                                    <Typography variant="subtitle2" component="span">{customer.username}</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.customerLink} onClick={() => handleViewCustomer(customer)}>View Details</Typography>
                                </div>
                            ))
                        }
                        <Button color="primary" className={classes.button}>Load More</Button>
                    </main>
                </section>
            </section>
        </>
    );
}

Customers.propTypes = {
    getNewCustomers: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getNewCustomers })(Customers);