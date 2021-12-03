import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Button,
    CircularProgress,
    Divider,
    FormControl, 
    FormHelperText,
    Grid, 
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormatListText } from 'mdi-material-ui';

// import SellerAccountModal from './SellerAccountModal';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import EditListingItem from './EditListingItem';

import { getAccounts } from '../../../actions/bankAccounts';
import { getCurrencies } from '../../../actions/currencies';
import { getResidencePermitLink } from '../../../actions/customer';
import { addListing } from '../../../actions/listings';
import { ADDED_LISTING, GET_ERRORS } from '../../../actions/types';
import { ADD_ACCOUNT, APPROVED, COLORS, NOT_SUBMITTED, PAYMENT_METHODS, PENDING, REJECTED } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';
import { DASHBOARD, DASHBOARD_HOME } from '../../../routes';
import validateAddListing from '../../../utils/validation/listing/add';
import PendingIdModal from './PendingIdModal';
import ResidencePermitModal from './ResidencePermitModal';
import AddAccountDrawer from '../bankAccount/AddAccountDrawer';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        padding: theme.spacing(4, 2, 2, 2),
        
        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            },
            
            '& h6': {
                fontWeight: 600,
                // marginTop: theme.spacing(2),
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

        [theme.breakpoints.down('md')]: {
            height: '100%'
        }
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
    const history = useHistory();
    const dispatch = useDispatch();

    const { residencePermitStatus } = useSelector(state => state.customer.stats);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { currencies } = useSelector(state => state);
    // const { customer } = useSelector(state => state);
    const { customerId, residencePermitUrl } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const { addedListing, listings, msg } = useSelector(state => state.listings);

    const { addListing, getAccounts, getCurrencies, getResidencePermitLink, handleSetTitle } = props;

    // const [openAccountModal, setOpenAccountModal] = useState(false);
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [showResidencePermitModal, setShowResidencePermitModal] = useState(false);
    const [showPendingIdModal, setShowPendingIdModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [RequiredCurrency, setRequiredCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    const [ReceivingAccount, setReceivingAccount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    // eslint-disable-next-line
    const [ListingFee, setListingFee] = useState('');

    const [Bank, setBank] = useState('');

    const [previousListings, setPreviousListings] = useState([]);

    const [permitUrl, setPermitUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Add Listing');
        if (residencePermitStatus === REJECTED || residencePermitStatus === NOT_SUBMITTED) {
            getResidencePermitLink();
        }

        if (residencePermitStatus !== APPROVED) {
            checkResidencePermitStatus();
        }

        if (accounts.length === 0) {
            getAccounts(customerId);
        }
        
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     if (residencePermitStatus) {
    //         if (residencePermitStatus !== APPROVED) {
    //             return checkResidencePermitStatus();
    //         }
    //     }
    // }, []);

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
        if (residencePermitUrl) {
            setPermitUrl(residencePermitUrl);
        }
    }, [residencePermitUrl]);

    useEffect(() => {
        if (currencies.length === 0) {
            getCurrencies();
        }
    }, [currencies, getCurrencies]);
    
    useEffect(() => {
        setLoading(false);
        if (listings.length > 0) {
            setPreviousListings(listings.filter(item => item.customerId === customerId)); 
        }
    }, [customerId, listings]);

    useEffect(() => {
        if (addedListing) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            return dispatch({
                type: ADDED_LISTING
            });
        }
    }, [addedListing, dispatch, msg]);

    useEffect(() => {
        if (MinExchangeAmount && ExchangeAmount && Number(MinExchangeAmount) > Number(ExchangeAmount)) {
            setErrors({ MinExchangeAmount: 'Minimum exchange amount cannot be greater than available amount!' });
        } else {
            setErrors({});
        }
    }, [ExchangeAmount, MinExchangeAmount]);

    // useEffect(() => {
    //     if (ExchangeAmount && ReceiptAmount) {
    //         setExchangeRate(Math.round(Number(ReceiptAmount) / Number(ExchangeAmount)))
    //     }
    // }, [ExchangeAmount, ReceiptAmount]);

    useEffect(() => {
        if (ExchangeAmount && ExchangeRate) {
            setReceiptAmount(`NGN ${formatNumber(Number(ExchangeAmount) * Number(ExchangeRate), 2)}`);
        }
    }, [ExchangeAmount, ExchangeRate]);

    // Display Add Account Drawer
    useEffect(() => {
        if (ReceivingAccount === ADD_ACCOUNT) {
            setAddAccountDrawerOpen(true);
            setReceivingAccount('');
        }
    }, [ReceivingAccount]);

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

    const checkResidencePermitStatus = () => {
        switch (residencePermitStatus) {
            case APPROVED:
                break;

            case PENDING:
                setShowPendingIdModal(true);
                break;

            case REJECTED:
                setShowResidencePermitModal(true);
                break;

            case NOT_SUBMITTED:
                setShowResidencePermitModal(true);
                break;

            default:
                break;
        }
    };

    // const handleCloseAccountModalModal = () => {
    //     setOpenAccountModal(false);
    // };

    const handleCloseResidencePermitModal = () => {
        setShowResidencePermitModal(false);
    };
    
    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    const resetForm = () => {
        setAvailableCurrency('');
        setExchangeAmount('');
        setRequiredCurrency('');
        setExchangeRate('');
        setMinExchangeAmount('');
        setReceiptAmount('');
        // setListingFee('');
        setLoading(false);
    };

    const dismissSuccessModal = () => history.push(`${DASHBOARD}${DASHBOARD_HOME}`);

    const getAccountId = (account) => {
        const bank = accounts.find(item => item.bankName === account);
        return bank.accountID;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            AvailableCurrency,
            ExchangeAmount,
            RequiredCurrency,
            ExchangeRate,
            MinExchangeAmount,
            // ReceiptAmount,
            ReceivingAccount,
            ListingFee,
            Bank
        };

        const { errors, isValid } = validateAddListing(data);
        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid listing data' });
        }

        if (residencePermitStatus !== APPROVED) {
            return checkResidencePermitStatus();
        }

        // if (customer.profile.listings >= 2) { // and there is no account number
        //     return setOpenAccountModal(true);
        // }

        setErrors({});
        setLoading(true);
        const listing = {
            currencyNeeded: RequiredCurrency,
            ExchangeRate: parseFloat(ExchangeRate),
            AmountAvailable: {
                CurrencyType: AvailableCurrency,
                Amount: parseFloat(ExchangeAmount)
            },
            MinExchangeAmount: {
                CurrencyType: AvailableCurrency,
                Amount: parseFloat(MinExchangeAmount)
            },
            Bank,
            accountID: getAccountId(ReceivingAccount)
        };

        addListing(listing);
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

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
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} />}
            <section className={classes.root}>
                <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
                <ResidencePermitModal open={showResidencePermitModal} handleCloseModal={handleCloseResidencePermitModal} url={permitUrl} />
                <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />
                {/* <SellerAccountModal open={openAccountModal} handleCloseModal={handleCloseAccountModalModal} /> */}
                <header>
                    <div>
                        <Typography variant="h6">Make a Listing</Typography>
                        <Typography variant="subtitle1" component="span">Complete the form below to post a listing</Typography>
                    </div>
                    {/* <Typography variant="subtitle1" component="p" onClick={handleOpenAccountModalModal}>Seller Account Details Popup</Typography> */}
                </header>
                <Grid container direction="row" spacing={6} className={classes.container}>
                    <Grid item xs={12} lg={4}>
                        <form onSubmit={onSubmit} noValidate>
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
                                            onChange={(e) => setAvailableCurrency(e.target.value)}
                                        
                                        >
                                            <MenuItem value="" disabled>Select Currency</MenuItem>
                                            {currencies.length > 0 && currencies.map((currency, index) => (
                                                <MenuItem key={index} value={currency.value} disabled={currency.value === 'NGN'}>{currency.value}</MenuItem>
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
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Exchange Currency</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.RequiredCurrency ? true : false } 
                                        fullWidth 
                                        required
                                        disabled={loading ? true : false}
                                    >
                                        <Select
                                            labelId="RequiredCurrency"
                                            value={RequiredCurrency}
                                            onChange={(e) => setRequiredCurrency(e.target.value)}
                                        
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
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>Exchange Rate</Typography>
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
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Min. Exchange Amount</Typography>
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
                                            onChange={(e) => setAvailableCurrency(e.target.value)}
                                        
                                        >
                                            <MenuItem value="" disabled>Select Currency</MenuItem>
                                            {currencies.length > 0 && currencies.map((currency, index) => (
                                                <MenuItem key={index} value={currency.value} disabled={currency.value === RequiredCurrency}>{currency.value}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <br />
                                    <Tooltip title="This is the minimum amount you wish to change." aria-label="Exchange Amount" arrow>
                                        <TextField
                                            value={MinExchangeAmount}
                                            onChange={(e) => setMinExchangeAmount(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Amount"
                                            helperText={errors.MinExchangeAmount}
                                            fullWidth
                                            disabled={loading ? true : false}
                                            error={errors.MinExchangeAmount ? true : false}
                                            inputProps={{
                                                maxLength: 12
                                            }}
                                        />
                                    </Tooltip>
                                </Grid>
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
                                            {accounts.map((account) => (
                                                <MenuItem key={account.id} value={account.bankName}>{account.bankName}</MenuItem>
                                            ))}
                                            <MenuItem value={ADD_ACCOUNT}>{ADD_ACCOUNT}</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.setReceivingAccount}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Paying From</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.Bank ? true : false } 
                                        fullWidth 
                                        required
                                        disabled={loading ? true : false}
                                    >
                                        <Select
                                            labelId="Bank"
                                            value={Bank}
                                            onChange={(e) => setBank(e.target.value)}
                                        
                                        >
                                            <MenuItem value="" disabled>Select Payment Method</MenuItem>
                                            {PAYMENT_METHODS.map((method, index) => (
                                                <MenuItem key={index} value={method}>{method}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.Bank}</FormHelperText>
                                    </FormControl>
                                </Grid>
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
                                            placeholder="NGN 0.00"
                                            helperText={errors.ReceiptAmount}
                                            fullWidth
                                            required
                                            // disabled={loading ? true : false}
                                            disabled
                                            error={errors.ReceiptAmount ? true : false}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Listing Fee</Typography>
                                    <TextField
                                        className={classes.darkInput}
                                        value={ListingFee}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="EUR 0.00"
                                        helperText={errors.ListingFee}
                                        fullWidth
                                        required
                                        // disabled={loading ? true : false}
                                        disabled
                                        error={errors.ListingFee ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary" 
                                        disabled={loading ? true : false}
                                        fullWidth
                                    >
                                        {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12} md={12} lg={8} className={classes.listings}>
                        {listings.length === 0 ?
                            <section className={classes.noListing}>
                                <Typography variant="h6">Previous Listings</Typography>
                                <Divider />
                                <div className={classes.noListingContent}>
                                    <FormatListText className={classes.noListingIcon} />
                                    <Typography className={classes.noListingText} variant="subtitle2" component="span">Your previous listings would appear here</Typography>
                                </div>
                            </section>
                            : 
                            <div>
                                <Typography variant="h6">Previous Listings</Typography>
                                <Divider />
                                <br />
                                {previousListings.map(item => (<EditListingItem key={item.id} listing={item} />))}
                                {/* {listings.map(listing => (
                                    <EditListingItem key={listing.id} listing={listing} />
                                ))} */}
                            </div>
                        }
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
    getResidencePermitLink: PropTypes.func.isRequired
};

export default connect(undefined, { addListing, getAccounts, getCurrencies, getResidencePermitLink })(MakeListing);