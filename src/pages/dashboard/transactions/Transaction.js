import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import moment from 'moment';

import { SET_TRANSACTION } from '../../../actions/types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import { TRANSACTION_STATUS } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // display: 'grid',
        // gridTemplateColumns: 'repeat(6, 1fr)',
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
        },

        '& div': {
            // border: '1px solid red'
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
    }
}));

const Transaction = ({ transaction }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { customerId } = useSelector(state => state.customer);

    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('');
    // eslint-disable-next-line
    const [reference, setReference] = useState('');
    const [status, setStatus] = useState('');

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
        const { amount, currency, reference, status } = getTransactionDetails(transaction);
        setAmount(amount);
        setCurrency(currency);
        setReference(reference);
        setStatus(status);
    };

    const getTransactionDetails = () => {
        const { buyer, seller, isCompleted } = transaction;

        if (buyer.customerId === customerId) {
            return { 
                amount: buyer.amountTransfered, 
                currency: 'NGN', 
                reference: buyer.transferReference,
                status:  getTransactionStatus(isCompleted)
            };
        }

        if (seller.customerId === customerId) {
            return { 
                amount: seller.amountTransfered,  
                currency: 'EUR', 
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
        return history.push(TRANSACTION_STATUS);
    };

    return (
        <Box component="section" className={classes.root} onClick={gotoTransaction}>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Date</Typography>
                {/* <Typography variant="body1" component="p" className={classes.text}>{moment().format()}</Typography> */}
                <Typography variant="body1" component="p" className={classes.text}>Nov 3rd 2022</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Time</Typography>
                <Typography variant="body1" component="p" className={classes.text}>20:34</Typography>
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
                <Typography variant="body1" component="p" className={classes.text}>889F5F</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Status</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{status}</Typography>
            </Box>
        </Box>
    );
};

Transaction.propTypes = {
    transaction: PropTypes.object.isRequired
};

export default Transaction;