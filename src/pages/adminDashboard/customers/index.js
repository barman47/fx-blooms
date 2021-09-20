import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
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

import { getCustomers, getMoreCustomers, getNewCustomers, getMoreNewCustomers, getRejectedCustomers, getMoreRejectedCustomers, getVerifiedCustomers, getMoreVerifiedCustomers } from '../../../actions/customer';
import { COLORS, ALL_CUSTOMERS, CONFIRMED, PENDING, REJECTED } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import AllCustomers from './AllCustomers';
import NewCustomers from './NewCustomers';
import RejectedCustomers from './RejectedCustomers';
import VerifiedCustomers from './VerifiedCustomers';

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
            gridTemplateColumns: '0.2fr 1fr 1.2fr 1.7fr 1.2fr 0.8fr',
            marginBottom: theme.spacing(3),
            
            '& span': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                padding: theme.spacing(1),

                [theme.breakpoints.down('md')]: {
                    fontSize: theme.spacing(1.5)
                },

                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },
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

    const { admin } = useSelector(state => state);
    const { confirmed, customers, pending, rejected, count } = useSelector(state => state.customers);
    const { totalCustomersAwaitingApproval, totalApprovedCustomers, totalCustomers, totalRejectedCustomers } = useSelector(state => state.stats);

    const [error, setError] = useState('');
    const [filter, setFilter] = useState(PENDING);

    const { getCustomers, getMoreCustomers, getNewCustomers, getMoreNewCustomers, getVerifiedCustomers, getMoreVerifiedCustomers, getRejectedCustomers, getMoreRejectedCustomers, handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Customers');
        if (count === 0) {
            getNewCustomers();
        }
        // handleSetTitle('Customers');
        // eslint-disable-next-line
    }, []);

    const handleSetFilter = (filter) => {
        console.log(filter);
        setFilter(filter);
        switch (filter) {
            case CONFIRMED:
                if (isEmpty(confirmed)) {
                    getVerifiedCustomers({
                        pageNumber: 1,
                        pageSize: 25
                    });
                }
                break;

            case PENDING:
                if (isEmpty(pending)) {
                    getNewCustomers({
                        pageNumber: 1,
                        pageSize: 25
                    });
                }
                break;

            case REJECTED:
                if (isEmpty(rejected)) {
                    getRejectedCustomers({
                        pageNumber: 1,
                        pageSize: 25
                    });
                }
                break;

            case ALL_CUSTOMERS:
                if (isEmpty(customers)) {
                    getCustomers({
                        pageNumber: 1,
                        pageSize: 25
                    });
                }
                break;

            default:
                break;
        }  
    };

    const getMore = () => {
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
            
            case ALL_CUSTOMERS:
                if (customers.hasNext) {
                    getMoreCustomers({
                        pageSize: 25,
                        pageNumber: customers.currentPageNumber + 1
                    });
                }
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
                        <div className={clsx(classes.filter, filter === PENDING && classes.active)} onClick={() => handleSetFilter(PENDING)}>
                            <Typography variant="subtitle2" component="span">New</Typography>
                            <Typography variant="subtitle2" component="span">{totalCustomersAwaitingApproval}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <div className={clsx(classes.filter, filter === CONFIRMED && classes.active)} onClick={() => handleSetFilter(CONFIRMED)}>
                            <Typography variant="subtitle2" component="span">Verified</Typography>
                            <Typography variant="subtitle2" component="span">{totalApprovedCustomers}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <div className={clsx(classes.filter, filter === REJECTED && classes.active)} onClick={() => handleSetFilter(REJECTED)}>
                            <Typography variant="subtitle2" component="span">Rejected</Typography>
                            <Typography variant="subtitle2" component="span">{totalRejectedCustomers}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                    <div className={clsx(classes.filter, filter === ALL_CUSTOMERS && classes.active)} onClick={() => handleSetFilter(ALL_CUSTOMERS)}>
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
                        {/* <Typography variant="subtitle2" component="span">ID Type</Typography> */}
                        <Typography variant="subtitle2" component="span">Email Address</Typography>
                        <Typography variant="subtitle2" component="span">Username</Typography>
                        <Typography variant="subtitle2" component="span"></Typography>
                    </header>
                    <main className={classes.content}>
                        {filter === PENDING && <NewCustomers handleSetTitle={handleSetTitle} />}
                        {filter === CONFIRMED && <VerifiedCustomers handleSetTitle={handleSetTitle} />}
                        {filter === REJECTED && <RejectedCustomers handleSetTitle={handleSetTitle} />}
                        {filter === ALL_CUSTOMERS && <AllCustomers handleSetTitle={handleSetTitle} />}
                        <Button 
                            color="primary" 
                            className={classes.button} 
                            onClick={getMore}
                            disabled={(filter === PENDING && !pending.hasNext) || (filter === CONFIRMED && !confirmed.hasNext) || (filter === REJECTED && !rejected.hasNext) ? true : false}
                        >
                            Load More
                        </Button>
                    </main>
                </section>
            </section>
        </>
    );
}

Customers.propTypes = {
    getCustomers: PropTypes.func.isRequired,
    getMoreCustomers: PropTypes.func.isRequired,
    getNewCustomers: PropTypes.func.isRequired,
    getMoreNewCustomers: PropTypes.func.isRequired,
    getRejectedCustomers: PropTypes.func.isRequired,
    getMoreRejectedCustomers: PropTypes.func.isRequired,
    getVerifiedCustomers: PropTypes.func.isRequired,
    getMoreVerifiedCustomers: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomers, getMoreCustomers, getNewCustomers, getMoreNewCustomers, getRejectedCustomers, getMoreRejectedCustomers, getVerifiedCustomers, getMoreVerifiedCustomers })(Customers);