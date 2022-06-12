import { useCallback, useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    ButtonGroup,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getFundingRequests, getWallets, getWalletTransactions } from '../../../actions/wallets';
import { GET_ERRORS, SET_FUNDING_REQUESTS, SET_WALLET, SET_WALLET_FILTER, SET_WALLET_TRANSACTIONS } from '../../../actions/types';

import { COLORS, WALLET_FILTER } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import Transaction from './Transaction';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';
import FundingRequest from './FundingRequest';

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

const Transactions = ({ getFundingRequests, getWallets, getWalletTransactions }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const { customerId } = useSelector(state => state.customer);
    const { filter, fundingRequests, wallet, wallets, transactions } = useSelector(state => state.wallets);
    const errorsState = useSelector(state => state.errors);

    const [currentFilter, setCurrentFilter] = useState(HISTORY);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const toast = useRef();

    // useEffect(() => {
    //     if (wallet.id) {
    //         handleFilter(currentFilter);
    //     }
    //     // eslint-disable-next-line
    // }, []);

    useEffect(() => {
		if (wallets.length > 0) {
			dispatch({
				type: SET_WALLET,
				payload: { currency: 'EUR' }
			});
		}
	}, [dispatch, wallets]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        setLoading(false);
        getWallets(customerId);
    }, [customerId, getWallets, fundingRequests, transactions]);

    const handleFilter = useCallback((currentFilter) => {
        switch (currentFilter) {
            case HISTORY:
                // if (filter !== HISTORY) {
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
                // }
                break;

            case FUNDING:
                // if (filter !== FUNDING) {
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
                    getFundingRequests(wallet?.id);
                // }
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
    }, [dispatch, getFundingRequests, getWalletTransactions, wallet?.id]);

    useEffect(() => {
        if (wallet?.id) {
            handleFilter(currentFilter);
        }
    }, [currentFilter, handleFilter, wallet?.id]);

    const handleGetNextTransactions = () => {
        setLoading(true);
        getWalletTransactions({
            pageNumber: transactions.currentPageNumber + 1,
            pageSize: 15,
            walletId: wallet.id
        });
    };

    const handleGetPreviousTransactions = () => {
        setLoading(true);
        getWalletTransactions({
            pageNumber: transactions.currentPageNumber - 1,
            pageSize: 15,
            walletId: wallet.id
        });
    };

    const handleSetLoading = (loadingState) => {
        setLoading(loadingState);
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }  
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
                    {transactions?.items?.length > 0 && transactions.items.map(transaction => (
                        <Transaction 
                            key={transaction.id}
                            date={transaction.dateCreated}
                            amount={Number(transaction.amount)}
                            status={transaction.status.toUpperCase()}
                            type={transaction.type}
                            destinationAccount={`${transaction.destinationAccountNumber} ${transaction.destinationBank}`}
                            sourceAccount={`${transaction.sourceAccountNumber} ${transaction.sourceAccountName}`}
                            id={transaction.id}
                        />
                    ))}
                    {fundingRequests.length > 0 && fundingRequests.map((request, index) => (
                        <FundingRequest 
                            key={index}
                            date={request.dateCreated}
                            amount={Number(request.amount)}
                            status={request.status.toUpperCase()}
                            currency={request.currency}
                            paymentId={request.paymentId}
                            paymentRequestId={request.paymentRequestId}
                            handleSetLoading={handleSetLoading}
                        />
                    ))}
                    {filter === HISTORY && 
                        <ButtonGroup disableElevation className={classes.filterButtons}>
                            <Button
                                color="primary"
                                size="small"
                                disableRipple
                                disableFocusRipple
                                onClick={handleGetPreviousTransactions}
                                variant="outlined"
                                disabled={loading || transactions?.hasPrevious === false ? true : false}
                            >
                                Previous Page
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                disableRipple
                                disableFocusRipple
                                onClick={handleGetNextTransactions}
                                variant="outlined"
                                disabled={loading || transactions?.hasNext === false ? true : false}
                            >
                                Next Page
                            </Button>
                        </ButtonGroup>
                    }
                </div>
            </section>
        </>
    );
};

Transactions.propTypes = {
    getFundingRequests: PropTypes.func.isRequired,
    getWallets: PropTypes.func.isRequired,
    getWalletTransactions: PropTypes.func.isRequired
};

export default connect(undefined, { getFundingRequests, getWallets, getWalletTransactions })(Transactions);