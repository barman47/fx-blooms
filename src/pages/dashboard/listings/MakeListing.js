import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid, 
    Link,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { getAccounts } from '../../../actions/bankAccounts';
import { getCurrencies } from '../../../actions/currencies';
import { addListing, getExchangeRate } from '../../../actions/listings';
import { getWallets } from '../../../actions/wallets';
import { ADDED_LISTING, GET_ERRORS, SET_BUY, SET_LISTING_MSG, SET_REQUIRED_CURRENCY } from '../../../actions/types';
import { COLORS, CUSTOMER_CATEGORY, ID_STATUS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';
import getAccount from '../../../utils/getAccount';
import { FUND_WALLET } from '../../../routes';
import validateAddListing from '../../../utils/validation/listing/add';

import PendingIdModal from '../idVerification/PendingIdModal';
import IDVerificationModal from '../idVerification/IDVerificationModal';
import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import CreateWalletModal from '../wallet/CreateWalletModal';
import ZeroBalanceModal from '../wallet/ZeroBalanceModal';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        padding: theme.spacing(0, 5),

        [theme.breakpoints.down('sm')]: {
            padding: 0
        },
        
        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            },
            
            '& h6': {
                fontWeight: 600
            },

            '& p': {
                color: theme.palette.primary.main,
                cursor: 'pointer',

                [theme.breakpoints.down('sm')]: {
                    marginTop: theme.spacing(2)
                },
            }
        }
    },

    darkInput: {
        backgroundColor: 'rgba(81, 103, 103, 1)',
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        
        '& .MuiInputBase-root': {
            color: COLORS.offWhite
        }
    },

    fab: {
		display: 'none',
		[theme.breakpoints.down('md')]: {
			display: 'block',
			position: 'fixed',
			bottom: 60,
			right: 10,
			zIndex: 1
		}
	},

    container: {
        position: 'relative',
        top: theme.spacing(3),
        paddingLeft: theme.spacing(25),
        paddingRight: theme.spacing(25),

        [theme.breakpoints.down('md')]: {
            height: '100%',
            paddingLeft: theme.spacing(10),
            paddingRight: theme.spacing(10),
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
        },
    },

    listings: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(4),
        // marginRight: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },

    helperText: {
        color: COLORS.offBlack,
        fontSize: theme.spacing(1.2)
    },

    addAccountButton: {
        justifySelf: 'flex-end'
    },

    checkboxLabel: {
        color: COLORS.grey,
        fontWeight: '300 !important'
    },

    noListing: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',

        '& h6': {
            padding: [[theme.spacing(1), theme.spacing(2)]]
        }
    },

    noListingContent: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },

    noListingIcon: {
        color: theme.palette.primary.main
    },

    noListingText: {
        color: COLORS.grey,
        fontWeight: 300,
        marginTop: theme.spacing(2)
    }
}));

const MakeListing = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { idStatus } = useSelector(state => state.customer.stats);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { currencies } = useSelector(state => state);
    const { customerId } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { addedListing, msg, recommendedRate, requiredCurrency } = useSelector(state => state.listings);
    const { wallet, wallets } = useSelector(state => state.wallets);

    const { addListing, getAccounts, getCurrencies, getExchangeRate, getWallets } = props;

    const [checked, setChecked] = useState(false);
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [showPendingIdModal, setShowPendingIdModal] = useState(false);
    const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState(requiredCurrency);
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [RequiredCurrency, setRequiredCurrency] = useState('NGN');
    const [ExchangeRate, setExchangeRate] = useState('');

    // const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    const [ReceivingAccount, setReceivingAccount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    const [ListingFee] = useState('');

    const [reference, setReference] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const idVerificationModal = useRef();
    const successModal = useRef();
    const toast = useRef();
    const zeroBalanceModal = useRef();

    const { APPROVED, NOT_SUBMITTED } = ID_STATUS;
    const { PENDING, REJECTED } = CUSTOMER_CATEGORY;

    useEffect(() => {
        checkForWallets();
        if (idStatus !== APPROVED) {
            idVerificationModal.current.openModal();
        }

        if (accounts.length === 0) {
            getAccounts(customerId);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if ((AvailableCurrency && AvailableCurrency === 'EUR') && (!isEmpty(wallet) && wallet.balance.available === 0)) {
            zeroBalanceModal.current.openModal();
        }
    }, [AvailableCurrency, wallet]);

    useEffect(() => {
        // Automatically select newly added account
        if (accounts.length > 0 && accounts[0].currency === 'NGN') {
            setReceivingAccount(accounts[0].nicKName);
        }
    }, [accounts]);

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
        if (currencies.length === 0) {
            getCurrencies();
        }
    }, [currencies, getCurrencies]);

    useEffect(() => {
        if (addedListing && msg) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [addedListing, dispatch, msg]);

    useEffect(() => {
        setAvailableCurrency(requiredCurrency);
    }, [requiredCurrency]);

    // Get exchange rate whenever available currency changes
    useEffect(() => {
        if (AvailableCurrency) {
            getExchangeRate(AvailableCurrency);
        }   
    }, [AvailableCurrency, getExchangeRate]);

    // useEffect(() => {
    //     if (MinExchangeAmount && ExchangeAmount && Number(MinExchangeAmount) > Number(ExchangeAmount)) {
    //         setErrors({ MinExchangeAmount: 'Minimum exchange amount cannot be greater than available amount!' });
    //     } else {
    //         setErrors({});
    //     }
    // }, [ExchangeAmount, MinExchangeAmount]);

    // useEffect(() => {
    //     if (ExchangeAmount && ReceiptAmount) {
    //         setExchangeRate(Math.round(Number(ReceiptAmount) / Number(ExchangeAmount)))
    //     }
    // }, [ExchangeAmount, ReceiptAmount]);

    // Set receiving amount
    useEffect(() => {
        if (ExchangeAmount && ExchangeRate && AvailableCurrency === 'EUR') {
            setReceiptAmount(`NGN ${formatNumber(Number(ExchangeAmount) * Number(ExchangeRate), 2)}`);
        }

        if (ExchangeAmount && ExchangeRate && AvailableCurrency === 'NGN') {
            setReceiptAmount(`EUR ${formatNumber(Number(ExchangeAmount) / Number(ExchangeRate), 2)}`);
        }
    }, [AvailableCurrency, ExchangeAmount, ExchangeRate]);

    // Set Listing Fee
    // useEffect(() => {
    //     if (ExchangeAmount) {
    //         const listingFee = Math.round((1 / 100) * Number(ExchangeAmount));
    //         if (isNaN(listingFee)) {
    //             setListingFee(0);
    //         } else {
    //             setListingFee(listingFee);
    //         }
    //         setListingFee(listingFee);
    //     }
    // }, [ExchangeAmount]);

    // useEffect(() => {
    //     if (ReceiptAmount && ExchangeRate) {
    //         setExchangeAmount(Number(ReceiptAmount) / Number(ExchangeRate))
    //     }
    // }, [ReceiptAmount, ExchangeRate]);

    // const handleSetReceiptAmount = (e) => {
    //     if (isEmpty(e.target.value)) {
    //         return setReceiptAmount('');
    //     }
    //     if (isEmpty(ExchangeRate)) {
    //         return setErrors({ ExchangeRate: 'Please provide an exchange rate' });
    //     }
    //     const exchangeAmount = Number(e.target.value);
    //     if (exchangeAmount && !isNaN(exchangeAmount)) {
    //         const listingFee = (10 / 100) * exchangeAmount;
    //         setReceiptAmount((exchangeAmount - listingFee) * ExchangeRate);
    //     }
    // };

    // const handleSetExchangeAmount = (e) => {
    //     if (isEmpty(e.target.value)) {
    //         return setExchangeAmount('');
    //     }
    //     const receiptAmount = Number(e.target.value);
    //     if (receiptAmount && !isNaN(receiptAmount)) {
    //         const listingFee = (10 / 100) * ExchangeAmount;
    //         setExchangeAmount(listingFee + receiptAmount);
    //     }
    // };

    // const handleOpenAccountModalModal = () => {
    //     setOpenAccountModal(true);
    // };

    const toggleShowCreateWalletModal = () => setShowCreateWalletModal(!showCreateWalletModal);

    const checkForWallets = () => {
        if (wallets.length === 0) {
            toggleShowCreateWalletModal();
        }
    };

    const checkIdStatus = () => {
        switch (idStatus) {
            case APPROVED:
                break;

            case PENDING:
                setShowPendingIdModal(true);
                break;

            case REJECTED:
                idVerificationModal.current.openModal();
                break;

            case NOT_SUBMITTED:
                idVerificationModal.current.openModal();
                break;

            default:
                break;
        }
    };
    
    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    const resetForm = () => {
        setAvailableCurrency('');
        setExchangeAmount('');
        setExchangeRate('');
        setReceiptAmount('');
        setLoading(false);
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_LISTING_MSG,
            payload: null
        });
        setShowCreateWalletModal(false);
        if (addedListing) {
            dispatch({
                type: ADDED_LISTING
            });
            dispatch({ type: SET_BUY });
            getWallets(customerId);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            AvailableCurrency,
            ExchangeAmount,
            RequiredCurrency,
            ExchangeRate,
            // MinExchangeAmount,
            // ReceiptAmount,
            ReceivingAccount,
            ListingFee
        };

        const { errors, isValid } = validateAddListing(data);
        
        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid listing data' });
        }

        if (idStatus !== APPROVED) {
            return checkIdStatus();
        }

        if (wallets.length === 0) {
            return setShowCreateWalletModal(wallets, setShowCreateWalletModal)
        }

        if (AvailableCurrency === 'EUR' && ExchangeAmount > wallet.balance.available) {
            return setErrors({ zeroBalance: true, ExchangeAmount: `Wallet balance (${wallet.currency.value}: ${formatNumber(wallet.balance.available, 2)}) is below the exchange amount`, msg: 'Insufficient wallet balance.' });
        }

        // if (customer.profile.listings >= 2) { // and there is no account number
        //     return setOpenAccountModal(true);
        // }

        setErrors({});
        setLoading(true);
        const listing = {
            currencyNeeded: AvailableCurrency === 'NGN' ? 'EUR' : 'NGN',
            ExchangeRate: parseFloat(ExchangeRate),
            AmountAvailable: {
                CurrencyType: AvailableCurrency,
                Amount: parseFloat(ExchangeAmount)
            },
            MinExchangeAmount: {
                CurrencyType: AvailableCurrency,
                Amount: 0
                // Amount: MinExchangeAmount ? parseFloat(MinExchangeAmount) : 0
            },
            accountID: AvailableCurrency === 'EUR' ? getAccount(ReceivingAccount, accounts).accountID : '',
            reference,
            walletId: wallet.id
        };

        if (AvailableCurrency === 'NGN') {
            delete listing.accountID
        }

        addListing(listing);
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setReceivingAccount('');
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
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} ngn={true} />}
            {showCreateWalletModal && <CreateWalletModal open={showCreateWalletModal} toggleCreateWalletDrawer={toggleShowCreateWalletModal} />}
            <ZeroBalanceModal ref={zeroBalanceModal} />
            <section className={classes.root}>
                <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
                <IDVerificationModal ref={idVerificationModal} />
                <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />
                <header>
                    <div>
                        <Typography variant="h6">Sell {AvailableCurrency}</Typography>
                    </div>
                </header>
                <Grid container direction="row" spacing={6} className={classes.container}>
                    <Grid item xs={12}>
                        <form onSubmit={onSubmit} noValidate className={classes.form}>
                            <Grid container direction="row" spacing={1}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>I Want to Exchange</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.AvailableCurrency ? true : false } 
                                        fullWidth 
                                        required
                                        disabled={loading ? true : false}
                                    >
                                        <Select
                                            labelId="AvailableCurrency"
                                            value={AvailableCurrency}
                                            onChange={(e) => {
                                                setAvailableCurrency(e.target.value);
                                                if (e.target.value === 'NGN') {
                                                    setRequiredCurrency('EUR');
                                                    dispatch({
                                                        type: SET_REQUIRED_CURRENCY,
                                                        payload: {
                                                            availableCurrency: 'EUR',
                                                            requiredCurrency: 'NGN'  
                                                        }
                                                    });
                                                } else {
                                                    dispatch({
                                                        type: SET_REQUIRED_CURRENCY,
                                                        payload: {
                                                            availableCurrency: 'NGN',
                                                            requiredCurrency: 'EUR'  
                                                        }
                                                    });
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled>Select Currency</MenuItem>
                                            {currencies.length > 0 && currencies.map((currency, index) => (
                                                <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <br />
                                    <Tooltip title="This is the amount you wish to change." aria-label="Exchange Amount" arrow>
                                        <TextField
                                            value={ExchangeAmount}
                                            onChange={(e) => setExchangeAmount(e.target.value)}
                                            // onKeyUp={handleSetReceiptAmount}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Amount"
                                            helperText={errors.ExchangeAmount}
                                            fullWidth
                                            required
                                            disabled={loading ? true : false}
                                            error={errors.ExchangeAmount ? true : false}
                                            inputProps={{
                                                maxLength: 12
                                            }}
                                        />
                                    </Tooltip>
                                </Grid>
                                {errors.zeroBalance &&
                                    <Grid item xs={12}>
                                        <FormHelperText>Wallet balance is too low! <Link to={FUND_WALLET} underline="always" component={RouterLink}>Fund Wallet</Link></FormHelperText>
                                    </Grid>
                                }
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Exchange Rate</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.RequiredCurrency ? true : false } 
                                        fullWidth 
                                        required
                                        // disabled={loading ? true : false}
                                        disabled
                                    >
                                        <Select
                                            labelId="RequiredCurrency"
                                            value={RequiredCurrency}
                                            // onChange={(e) => setRequiredCurrency(e.target.value)}
                                        
                                        >
                                            <MenuItem value="" disabled>Select Currency</MenuItem>
                                            {currencies.length > 0 && currencies.map((currency, index) => (
                                                <MenuItem key={index} value={currency.value} disabled={currency.value === AvailableCurrency ? true : false}>{currency.value}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.RequiredCurrency}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <br />
                                    <Tooltip title="This is the exchange rate you want." aria-label="Exchange Rate" arrow>
                                        <TextField
                                            value={ExchangeRate}
                                            onChange={(e) => setExchangeRate(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Amount"
                                            helperText={errors.ExchangeRate}
                                            fullWidth
                                            required
                                            disabled={loading ? true : false}
                                            error={errors.ExchangeRate ? true : false}
                                            inputProps={{
                                                maxLength: 12
                                            }}
                                        />
                                    </Tooltip>
                                    {recommendedRate && recommendedRate > 0 && <FormHelperText color="primary">Recomended Rate: 1EUR to <span style={{ color: COLORS.red }}>{recommendedRate}NGN</span></FormHelperText>}
                                </Grid>
                                {AvailableCurrency === 'EUR' && 
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" component="span" className={classes.helperText}>Receiving Account</Typography>
                                        <FormControl 
                                            variant="outlined" 
                                            error={errors.ReceivingAccount ? true : false } 
                                            fullWidth 
                                            required
                                            disabled={loading ? true : false}
                                        >
                                            <Select
                                                labelId="ReceivingAccount"
                                                value={ReceivingAccount}
                                                onChange={(e) => setReceivingAccount(e.target.value)}
                                            >
                                                <MenuItem value="" disabled>Select your receiving account</MenuItem>
                                                {AvailableCurrency === 'EUR' ?
                                                    accounts.map((account) => {
                                                        if (account.currency === 'NGN') {
                                                            return (
                                                                <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                : 
                                                    accounts.map((account) => {
                                                        if (account.currency === 'EUR') {
                                                            return (
                                                                <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                }
                                            </Select>
                                            <FormHelperText>{errors.ReceivingAccount}</FormHelperText>
                                        </FormControl>
                                        <Button variant="text" color="primary" onClick={handleAddAccount} className={classes.addAccountButton}>Add New Account</Button>
                                    </Grid>
                                }
                                {AvailableCurrency === 'EUR' &&
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" component="span">Payment Reference (OPTIONAL)</Typography>
                                        <TextField 
                                            value={reference}
                                            placeholder="Enter Payment Reference"
                                            onChange={(e) => setReference(e.target.value)}
                                            disabled={loading ? true : false}
                                            type="text"
                                            variant="outlined" 
                                            fullWidth
                                        />
                                        <FormHelperText>Enter the reference you want added to the payment</FormHelperText>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>I will receive</Typography>
                                    <Tooltip title="This is the amount you will receive in your bank account." aria-label="Amount to Receive" arrow>
                                        <TextField
                                            className={classes.darkInput}
                                            value={ReceiptAmount}
                                            // onChange={(e) => setReceiptAmount(e.target.value)}
                                            // onKeyUp={handleSetExchangeAmount}
                                            type="text"
                                            variant="outlined" 
                                            placeholder={AvailableCurrency === 'EUR' ? 'NGN 0.00' : 'EUR 0.00'}
                                            helperText={errors.ReceiptAmount}
                                            fullWidth
                                            required
                                            // disabled={loading ? true : false}
                                            disabled
                                            error={errors.ReceiptAmount ? true : false}
                                        />
                                    </Tooltip>
                                </Grid>
                                {AvailableCurrency === 'NGN' && 
                                    <Grid item xs={12}>
                                        <FormControlLabel 
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={checked}
                                                    onChange={() => setChecked(!checked)}
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    
                                                />
                                            }
                                            label="I agree to transfer the NGN to the buyer within 30mins once my offer is accepted."
                                            classes={{ root: classes.checkboxLabel }}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary" 
                                        disabled={(loading) || (AvailableCurrency === 'NGN' && !checked) ? true : false}
                                        fullWidth
                                    >
                                        {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

MakeListing.propTypes = {
    addListing: PropTypes.func.isRequired,
    getCurrencies: PropTypes.func.isRequired,
    getAccounts: PropTypes.func.isRequired,
    getExchangeRate: PropTypes.func.isRequired,
    getWallets: PropTypes.func.isRequired
};

export default connect(undefined, { addListing, getAccounts, getExchangeRate, getCurrencies, getWallets })(MakeListing);