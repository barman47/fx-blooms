import { useCallback, useEffect, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    ButtonGroup,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getFundingRequests, getWalletTransactions } from '../../../actions/wallets';
import { SET_FUNDING_REQUESTS, SET_WALLET_FILTER, SET_WALLET_TRANSACTIONS } from '../../../actions/types';

import { COLORS, WALLET_FILTER } from '../../../utils/constants';

import Transaction from './Transaction';
import Spinner from '../../../components/common/Spinner';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),

        '& h6': {
            color: COLORS.offBlack,
            fontWeight: '600',
            margin: theme.spacing(2, 0, 1, 0),
            textAlign: 'center'
        }
    },

    transactions: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1.5),
    } 
}));

const { HISTORY, FUNDING } = WALLET_FILTER;

const Transactions = ({ getFundingRequests, getWalletTransactions }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const { filter, fundingRequests, wallet, transactions } = useSelector(state => state.wallets);

    const [currentFilter, setCurrentFilter] = useState(HISTORY);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [fundingRequests, transactions]);

    const handleFilter = useCallback((currentFilter) => {
        switch (currentFilter) {
            case HISTORY:
                if (filter !== HISTORY) {
                    batch(() => {
                        dispatch({
                            type: SET_WALLET_FILTER,
                            payload: HISTORY
                        });
                        dispatch({
                            type: SET_FUNDING_REQUESTS,
                            payload: []
                        });
                    });
                    setLoading(true);
                    getWalletTransactions({
                        pageNumber: 1, 
                        pageSize: 15,
                        walletId: wallet.id
                    });
                }
                break;

            case FUNDING:
                if (filter !== FUNDING) {
                    batch(() => {
                        dispatch({
                            type: SET_WALLET_FILTER,
                            payload: FUNDING
                        });
                        dispatch({
                            type: SET_WALLET_TRANSACTIONS,
                            payload: []
                        });
                    });
                    
                    setLoading(true);
                    getFundingRequests(wallet.id);
                }
                break;

            // case WITHDRAWAL:
            //     if (filter !== WITHDRAWAL) {
            //         dispatch({
            //             type: SET_WALLET_FILTER,
            //             payload: WITHDRAWAL
            //         });
            //         // Get wallet history
            //     }
            //     break;

            default:
                break;
        }
    }, [dispatch, filter, getFundingRequests, getWalletTransactions, wallet.id]);

    useEffect(() => {
        handleFilter(currentFilter);
    }, [currentFilter, handleFilter]);

    return (
        <>
            {loading && <Spinner />}
            <section className={classes.root}>
                <Typography variant="h6" className={classes.header}>
                    {filter === HISTORY ? 'Transaction History' : 'Funding Requests'}
                </Typography>
                <ButtonGroup disableElevation className={classes.filterButtons}>
                    <Button
                        color="primary"
                        size="small"
                        disableRipple
                        disableFocusRipple
                        onClick={() => setCurrentFilter(HISTORY)}
                        variant={filter === HISTORY ? 'contained' : 'outlined'}
                        disabled={loading ? true : false}
                    >
                        History
                    </Button>
                    <Button
                        color="primary"
                        size="small"
                        disableRipple
                        disableFocusRipple
                        onClick={() => setCurrentFilter(FUNDING)}
                        variant={filter === FUNDING ? 'contained' : 'outlined'}
                        disabled={loading ? true : false}
                    >
                        Funding
                    </Button>
                    {/* <Button
                        color="primary"
                        size="small"
                        disableRipple
                        disableFocusRipple
                        onClick={() => setCurrentFilter(WITHDRAWAL)}
                        variant={filter === WITHDRAWAL ? 'contained' : 'outlined'}
                        disabled={loading ? true : false}
                    >
                        Withdrawal
                    </Button> */}
                </ButtonGroup>
                <div className={classes.transactions}>
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                    <Transaction 
                        date="19/09/2021"
                        time="10:34 PM"
                        type="Fund"
                        bank="Revolute"
                        amount={1000}
                        walletId="854584594"
                    />
                </div>
            </section>
        </>
    );
};

Transactions.propTypes = {
    getFundingRequests: PropTypes.func.isRequired,
    getWalletTransactions: PropTypes.func.isRequired
};

export default connect(undefined, { getFundingRequests, getWalletTransactions })(Transactions);