import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { CLEAR_ALL_CUSTOMERS, SET_CUSTOMER } from '../../../actions/types';
import { getCustomers } from '../../../actions/customer';
import { ADMIN_DASHBOARD, CUSTOMERS } from '../../../routes';
import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    customer: {
        backgroundColor: COLORS.white,
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1.2fr 1.2fr 1.7fr 1.2fr 0.8fr',

        '& span': {
            color: COLORS.offBlack,
            fontWeight: 400,
            padding: theme.spacing(1),

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(1.2)
            }
        }
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: 'pointer'
    },
}));

const AllCustomers = ({ getCustomers, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const customers = useSelector(state => state.customers?.customers?.items);

    useEffect(() => {
        // handleSetTitle('All Customers');
        if (!customers) {
            getCustomers({
                pageNumber: 1,
                pageSize: 25
            });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ALL_CUSTOMERS });
        };

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

    return (
        <>
            {customers && customers.map((customer, index) => (
                    <div key={customer.id} className={classes.customer}>
                        <Typography variant="subtitle2" component="span">{index + 1}.</Typography>
                        <Typography variant="subtitle2" component="span">{`${customer.firstName} ${customer.lastName}`}</Typography>
                        <Typography variant="subtitle2" component="span">{customer.phoneNo}</Typography>
                        <Typography variant="subtitle2" component="span"></Typography>
                        <Typography variant="subtitle2" component="span">{customer.email}</Typography>
                        <Typography variant="subtitle2" component="span">{customer.userName}</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink} onClick={() => handleViewCustomer(customer)}>View Details</Typography>
                    </div>
                ))
            }
        </>
    );
};

AllCustomers.propTypes = {
    getCustomers: PropTypes.func.isRequired
};

export default connect(undefined , { getCustomers })(AllCustomers);