import { useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// import { Toaster } from 'react-hot-toast';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/styles';

import { getCurrencies } from '../../../actions/currencies';
import { cancelTransaction, getPendingTransactionCount, getTransactions } from '../../../actions/transactions';
import { 
    CLEAR_TRANSACTIONS,
    GET_ERRORS,
    SET_ALL_TRANSACTIONS,
    SET_BID,
    SET_EUR_TRANSACTIONS,
    SET_LOADING,
    SET_NGN_TRANSACTIONS,
    SET_TRANSACTION_MSG
} from '../../../actions/types';

import isEmpty from '../../../utils/isEmpty';

import Transaction from './Transaction';
import TransactionSkeleton from './TransactionSkeleton';
import Toast from '../../../components/common/Toast';
import SuccessModal from '../../../components/common/SuccessModal';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 5, 5, 5),

        [theme.breakpoints.down('sm')]: {
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    filterContainer: {
        display: 'grid',
        gridTemplateColumns: '0.25fr 0.25fr',
        gap: theme.spacing(20),
        alignItems: 'center',
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '0.5fr 0.5fr',
            gap: theme.spacing(3),
        }
    },
    
    transactions: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        marginTop: theme.spacing(2),
        maxWidth: '100%',
    }
}));

                        
const Transactions = ({ cancelTransaction, getCurrencies, getPendingTransactionCount, getTransactions, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { currencies, loading } = useSelector(state => state);
    const { customerId } = useSelector(state => state.customer);
    const { msg, eurTransactions, ngnTransactions, transactions } = useSelector(state => state.transactions);
    const errorsState = useSelector(state => state.errors);

    const [currency, setCurrency] = useState('ALL');
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Transactions');
        batch(() => {
            dispatch({
                type: SET_LOADING,
                payload: true
            });
            dispatch({ type: CLEAR_TRANSACTIONS });
            dispatch({ type: SET_BID, payload: {} });
        });
        getTransactions(false);
        if (currencies.length === 0) {
            // setLoading(true);
            getCurrencies();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            dispatch({
                type: SET_LOADING,
                payload: false
            });
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (msg) {
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [msg]);

    // Filter transactions
    useEffect(() => {
        switch (currency) {
            case 'ALL':
                // dispatch({
                //     type: SET_LOADING,
                //     payload: true
                // });
                dispatch({ type: SET_ALL_TRANSACTIONS });
                break;

            case 'EUR':
                // dispatch({
                //     type: SET_LOADING,
                //     payload: true
                // });
                dispatch({ type: SET_EUR_TRANSACTIONS, payload: customerId });
                break;

            case 'NGN':
                // dispatch({
                //     type: SET_LOADING,
                //     payload: true
                // });

                dispatch({ type: SET_NGN_TRANSACTIONS, payload: customerId });
                break;

            default:
                break;
        }
    }, [currency, customerId, dispatch]);

    const handleCancelTransaction = (transactionId) => {
        cancelTransaction(transactionId);
    };

    const dismissAction = () => {
        getPendingTransactionCount();
        dispatch({
            type: SET_TRANSACTION_MSG,
            payload: null
        });
    };

    const isPending = (transaction) => {
        if (!transaction.buyer.hasMadePayment && !transaction.buyer.hasReceivedPayment && !transaction.seller.hasMadePayment && !transaction.seller.hasReceivedPayment) {
            return true;
        }
        return false;
    };

    // const setTransactionType = (sent, received) => {
	// 	dispatch({
	// 		type: SET_TRANSACTION_TYPE,
	// 		payload: {
	// 			sent,
	// 			received
	// 		}
	// 	});
	// }

    return (
        <>
            {/* <Toaster /> */}
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Box component="section" className={classes.root}>
                <Typography variant="h6">Transaction History</Typography>
                <Typography variant="body2" component="p">Here are your recent transactions</Typography>
                <Box component="section">
                    <Box component="div" className={classes.filterContainer}>
                        <FormControl 
                            variant="outlined" 
                            // error={errors.ReceivingAccount ? true : false } 
                            fullWidth 
                            required
                            disabled={loading ? true : false}
                        >
                            <Select
                                labelId="Currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <MenuItem value="ALL" selected>ALL</MenuItem>
                                {currencies && currencies.map((currency, index) => <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box component="section" className={classes.transactions}>
                    {loading ?
                        <>
                            <TransactionSkeleton />
                            <TransactionSkeleton />
                            <TransactionSkeleton />
                            <TransactionSkeleton />
                            <TransactionSkeleton />
                        </>
                        :
                        eurTransactions.length > 0 ? 
                        eurTransactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
                        :
                        ngnTransactions.length > 0 ? ngnTransactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
                        :
                        transactions.map(transaction => {
                            if (isPending(transaction)) {
                                if (transaction.buyer.customerId === customerId) {
                                    return <Transaction key={transaction.id} cancelTransaction={handleCancelTransaction} transaction={transaction} />
                                }
                                return null;
                            }
                            return <Transaction key={transaction.id} cancelTransaction={handleCancelTransaction} transaction={transaction} />
                            
                            
                        })
                    }
                    {!loading && transactions.length === 0 && 
                        <Typography variant="h4" align="center" color="primary">You have no transactions</Typography>
                    }
                </Box>
            </Box>
        </>
    );
};

Transactions.propTypes = {
    cancelTransaction: PropTypes.func.isRequired,
    getCurrencies: PropTypes.func.isRequired,
    getTransactions: PropTypes.func.isRequired,
    getPendingTransactionCount: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { cancelTransaction, getCurrencies, getPendingTransactionCount, getTransactions })(Transactions);