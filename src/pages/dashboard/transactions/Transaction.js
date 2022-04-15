import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';

import { SET_TRANSACTION } from '../../../actions/types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import { TRANSACTION_STATUS } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr 1fr'
        }
    },

    label: {
        color: COLORS.grey,
        fontWeight: 300
    },

    text: {
        color: COLORS.offBlack,
        fontWeight: 600,
        marginTop: theme.spacing(1)
    },

    inProgress: {
        color: `${COLORS.orange} !important`
    }
}));

const Transaction = ({ transaction }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customerId } = useSelector(state => state.customer);

    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('');
    // eslint-disable-next-line
    const [reference, setReference] = useState('');

    useEffect(() => {
        setTransactionDetails();
        // eslint-disable-next-line
    }, []);

    const getTransactionStatus = (isCompleted) => {
    // const getTransactionStatus = (status) => {
        if (isCompleted) {
            return 'Completed';
        }

        return 'Pending';
        // const { CANCELED, COMPLETED, IN_PROGRES } = BID_STATUS;

        // switch (status) {
        //     case IN_PROGRES:
        //         return 'In Progress';

        //     case CANCELED:
        //         return 'Canceled';
            
        //     case COMPLETED:
        //         return 'Completed';

        //     default:
        //         return 'Unknown';
        // }
    };

    const setTransactionDetails = () => {
        const { amount, currency, reference } = getTransactionDetails(transaction);
        setAmount(amount);
        setCurrency(currency);
        setReference(reference);
    };

    const getTransactionDetails = () => {
        const { buyer, seller, isCompleted } = transaction;

        if (buyer.customerId === customerId) {
            return { 
                amount: buyer.amountTransfered, 
                currency: buyer.currency,
                reference: buyer.transferReference,
                status:  getTransactionStatus(isCompleted)
            };
        }

        if (seller.customerId === customerId) {
            return { 
                amount: seller.amountTransfered,  
                currency: seller.currency,
                reference: seller.transferReference,
                status:  getTransactionStatus(isCompleted) 
            };
        }
    };

    const gotoTransaction = () => {
        // Put transaction in state
        dispatch({
            type: SET_TRANSACTION,
            payload: transaction
        });
        return navigate(TRANSACTION_STATUS);
    };

    return (
        <Box component="section" className={classes.root}>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Time</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{moment(transaction.dateCreated).fromNow()}</Typography>
                {/* <Typography variant="body1" component="p" className={classes.text}>5 mins ago</Typography> */}
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Transaction Type</Typography>
                <Typography variant="body1" component="p" className={classes.text}>P2P Exchange</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Amount Tendered</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{currency}{formatNumber(amount, 2)}</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Reference Number</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{`${transaction.listingId}-${currency.charAt(0)}`}</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Status</Typography>
                <Typography variant="body1" component="p" className={clsx(classes.text, {[classes.inProgress]: !transaction.isClosed})}>{transaction?.isClosed ? 'Completed' : 'In Progress'}</Typography>
            </Box>
            <Button 
                variant="outlined" 
                color="primary" 
                disableRipple
                disableFocusRipple
                disableTouchRipple
                onClick={gotoTransaction}
            >
                View More
            </Button>
        </Box>
    );
};

Transaction.propTypes = {
    transaction: PropTypes.object.isRequired
};

export default Transaction;