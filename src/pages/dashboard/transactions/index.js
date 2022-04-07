import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FormControlLabel, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getCurrencies } from '../../../actions/currencies';
import { getTransactions } from '../../../actions/transactions';
import { SET_ALL_TRANSACTIONS, SET_EUR_TRANSACTIONS, SET_TRANSACTION, SET_NGN_TRANSACTIONS } from '../../../actions/types';

import Transaction from './Transaction';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(-3)
    },

    filterContainer: {
        display: 'grid',
        gridTemplateColumns: '0.25fr 0.25fr',
        gap: theme.spacing(20),
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
        marginTop: theme.spacing(2)
    }
}));

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
            '&$checked': {
                transform: 'translateX(16px)',
                color: theme.palette.common.white,
                '& + $track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
                border: 'none',
            }
        },
      
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },

    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },

    checked: {},

    focusVisible: {},

}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const Transactions = ({ getCurrencies, getTransactions }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { currencies } = useSelector(state => state);
    const { customerId } = useSelector(state => state.customer);
    const { eurTransactions, ngnTransactions, transactions } = useSelector(state => state.transactions);

    const [currency, setCurrency] = useState('ALL');
    const [showReceived, setShowReceived] = useState(true);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch({
            type: SET_TRANSACTION,
            payload: {}
        });
        getTransactions(true);
        if (currencies.length === 0) {
            // setLoading(true);
            getCurrencies();
        }
        // eslint-disable-next-line
    }, []);

    // Filter transactions
    useEffect(() => {
        switch (currency) {
            case 'ALL':
                dispatch({ type: SET_ALL_TRANSACTIONS });
                break;

            case 'EUR':
                dispatch({ type: SET_EUR_TRANSACTIONS, payload: customerId });
                break;

            case 'NGN':
                dispatch({ type: SET_NGN_TRANSACTIONS, payload: customerId });
                break;

            default:
                break;
        }
    }, [currency, customerId, dispatch]);


    return (
        <>
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
                        <FormControlLabel
                            control={<IOSSwitch checked={showReceived} onChange={() => setShowReceived(!showReceived)} />}
                            label={showReceived ? 'Received' : 'Sent'}
                        />
                    </Box>
                </Box>
                <Box component="section" className={classes.transactions}>
                    {eurTransactions.length > 0 ? 
                        eurTransactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
                        :
                        ngnTransactions.length > 0 ? ngnTransactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
                        :
                        transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
                    }
                </Box>
            </Box>
        </>
    );
};

Transactions.propTypes = {
    getCurrencies: PropTypes.func.isRequired,
    getTransactions: PropTypes.func.isRequired,
};

export default connect(undefined, { getCurrencies, getTransactions })(Transactions);
