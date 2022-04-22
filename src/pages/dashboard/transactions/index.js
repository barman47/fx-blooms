import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getCurrencies } from '../../../actions/currencies';
import { getTransactions } from '../../../actions/transactions';
import { CLEAR_TRANSACTIONS, SET_ALL_TRANSACTIONS, SET_BID, SET_EUR_TRANSACTIONS, SET_NGN_TRANSACTIONS } from '../../../actions/types';

import Transaction from './Transaction';
import TransactionSkeleton from './TransactionSkeleton';

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

    buttonGroup: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    },
    
    transactions: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        marginTop: theme.spacing(2),
        maxWidth: '100%',
    }
}));

const Transactions = ({ getCurrencies, getTransactions, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { currencies } = useSelector(state => state);
    const { customerId } = useSelector(state => state.customer);
    const { eurTransactions, ngnTransactions, transactions } = useSelector(state => state.transactions);

    const [currency, setCurrency] = useState('ALL');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleSetTitle('Transactions');
        setLoading(true);
        dispatch({ type: CLEAR_TRANSACTIONS });
        dispatch({ type: SET_BID, payload: {} });
        getTransactions(true);
        if (currencies.length === 0) {
            // setLoading(true);
            getCurrencies();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if ((transactions.length > 0 || eurTransactions.length > 0 || ngnTransactions.length > 0) && loading) {
            setLoading(false);
        }
    }, [loading, eurTransactions.length, ngnTransactions.length, transactions]);

    // Filter transactions
    useEffect(() => {
        switch (currency) {
            case 'ALL':
                setLoading(true);
                dispatch({ type: SET_ALL_TRANSACTIONS });
                break;

            case 'EUR':
                setLoading(true);
                dispatch({ type: SET_EUR_TRANSACTIONS, payload: customerId });
                break;

            case 'NGN':
                setLoading(true);
                dispatch({ type: SET_NGN_TRANSACTIONS, payload: customerId });
                break;

            default:
                break;
        }
    }, [currency, customerId, dispatch]);

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
            <Toaster />
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
                        {/* <ButtonGroup className={classes.buttonGroup} disableElevation size="large">
                            <Button
                                color="primary"
                                disableRipple
                                disableFocusRipple
                                onClick={() => setTransactionType(false, true)}
                                variant={received ? 'contained' : 'outlined'}
                                fullWidth
                            >
                                Received
                            </Button>
                            <Button
                                color="primary"
                                disableRipple
                                disableFocusRipple
                                onClick={() => setTransactionType(true, false)}
                                variant={sent ? 'contained' : 'outlined'}
                                fullWidth
                            >
                                Sent
                            </Button>
                        </ButtonGroup> */}
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
                        transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
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
    getCurrencies: PropTypes.func.isRequired,
    getTransactions: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getCurrencies, getTransactions })(Transactions);