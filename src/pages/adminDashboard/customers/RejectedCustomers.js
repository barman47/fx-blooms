import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DotsHorizontal } from 'mdi-material-ui';

import { getNewCustomers } from '../../../actions/customer';
import { SET_CUSTOMER } from '../../../actions/types';
import { CUSTOMERS } from '../../../routes';
import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    customer: {
        backgroundColor: COLORS.white,
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1fr 0.5fr 0.7fr 0.5fr',

        '& span': {
            color: COLORS.offBlack,
            fontWeight: 400,
            padding: theme.spacing(1),

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(1.2)
            },

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(0.7)
            }
        }
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: 'pointer'
    },
}));

const RejectedCustomers = ({ getNewCustomers, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const rejectedCustomers = useSelector(state => state.customers.rejected.items);

    useEffect(() => {
        // handleSetTitle('Rejected Customers');
        // if (!rejectedCustomers) {
            getNewCustomers({
                pageNumber: 1,
                pageSize: 25
            });
        // }
        // eslint-disable-next-line
    }, []);

    const handleViewCustomer = (customer) => {
        dispatch({
            type: SET_CUSTOMER,
            payload: customer
        });
        handleSetTitle('User Details');
        history.push(`${CUSTOMERS}/${customer.id}`);
    };

    return (
        <>
            {rejectedCustomers && rejectedCustomers.map((customer, index) => (
                <div key={customer.id} className={classes.customer}>
                    <Typography variant="subtitle2" component="span">{index + 1}.</Typography>
                    <Typography variant="subtitle2" component="span">{`${customer.firstName ? customer.firstName : ''} ${customer.lastName ? customer.lastName : ''}`}</Typography>
                    <Typography variant="subtitle2" component="span">{customer.phoneNo}</Typography>
                    <Typography variant="subtitle2" component="span">{customer.email}</Typography>
                    <Typography variant="subtitle2" component="span">{customer.userName}</Typography>
                    <Typography variant="subtitle2" component="span">{customer.customerStatus}</Typography>
                    <Typography variant="subtitle2" component="span">{customer?.riskProfile}</Typography>
                    <IconButton variant="text" size="small" className={classes.button}>
                        <DotsHorizontal />
                    </IconButton>
                </div>
            ))}
        </>
    );
};

RejectedCustomers.propTypes = {
    getNewCustomers: PropTypes.func.isRequired
};

export default connect(undefined, { getNewCustomers })(RejectedCustomers);