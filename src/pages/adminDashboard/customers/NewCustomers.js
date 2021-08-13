import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getNewCustomers } from '../../../actions/customer';
import { SET_CUSTOMER } from '../../../actions/types';
import { ADMIN_DASHBOARD, CUSTOMERS } from '../../../routes';

const useStyles = makeStyles();

const NewCustomers = ({ getNewCustomers, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { confirmed } = useSelector(state => state.customers);

    useEffect(() => {
        getNewCustomers({
            pageNumber: 1,
            pageSize: 25
        });
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
            {confirmed && confirmed.map((customer, index) => (
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
        </>
    );
};

NewCustomers.propTypes = {
    getNewCustomers: PropTypes.func.isRequired
};

export default connect(undefined, { getNewCustomers })(NewCustomers);