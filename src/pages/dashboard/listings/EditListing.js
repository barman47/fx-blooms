import { useEffect, useRef, useState } from 'react';
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

import EditListingItem from './EditListingItem';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { GET_ERRORS, SET_LISTING } from '../../../actions/types';
import { updateListing } from '../../../actions/listings';
import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import validateAddListing from '../../../utils/validation/listing/add';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        padding: theme.spacing(2),
        
        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(3),

            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            },

            '& h6': {
                fontWeight: 600
            }
        }
    },

    container: {
        position: 'relative',
        top: 0,

        [theme.breakpoints.down('md')]: {
            height: '100%'
        }
    },

    helperText: {
        fontSize: '10px'
    },

    listings: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,

        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },

    noListing: {
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

const EditListing = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { currencies } = useSelector(state => state);
    const { customerId } = useSelector(state => state.customer);
    const { listing, listings, updatedListing, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [openAccountModal, setOpenAccountModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    // eslint-disable-next-line
    const [RequiredCurrency, setRequiredCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    // eslint-disable-next-line
    const [ReceiptAmount, setReceiptAmount] = useState('');
    // eslint-disable-next-line
    const [ListingFee, setListingFee] = useState('');

    const [previousListings, setPreviousListings] = useState([]);

    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        return () => {
            dispatch({
                type: SET_LISTING,
                payload: {}
            });
        };
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
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (updatedListing && msg) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [updatedListing, dispatch, msg]);

    useEffect(() => {
        if (!isEmpty(listing)) {
            const { amountAvailable, amountNeeded, minExchangeAmount, exchangeRate } = listing;

            setAvailableCurrency(amountAvailable.currencyType);
            setExchangeAmount(amountAvailable.amount);
            setRequiredCurrency(amountNeeded.currencyType);
            setExchangeRate(exchangeRate);
            setMinExchangeAmount(minExchangeAmount.amount);
        }
    }, [listing]);

    useEffect(() => {
        if (listings.length > 0) {
            // const listingsList = listings.filter(item => item.customerId === customerId && item.id !== listing.id);
            // debugger
            setPreviousListings(listings.filter(item => item.customerId === customerId)); 
        }
    }, [customerId, listing.id, listings]);

    const resetForm = () => {
        setAvailableCurrency('');
        setExchangeAmount('');
        setRequiredCurrency('');
        setExchangeRate('');
        setMinExchangeAmount('');
        setReceiptAmount('');
        setListingFee('');
        setLoading(false);
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
            ReceiptAmount,
            ListingFee
        };

        const { errors, isValid } = validateAddListing(data);
        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid data' });
        }

        setErrors({});
        setLoading(true);
        const listingItem = {
            listingId: listing.id,
            currencyNeeded: RequiredCurrency,
            ExchangeRate: parseFloat(ExchangeRate),
            AmountAvailable: {
                CurrencyType: AvailableCurrency,
                Amount: parseFloat(ExchangeAmount)
            },
            MinExchangeAmount: {
                CurrencyType: RequiredCurrency,
                Amount: parseFloat(MinExchangeAmount)
            }
        };

        setLoading(true);
        props.updateListing(listingItem);
    };

    return (
        <section className={classes.root}>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} />
            <header>
                <div>
                    <Typography variant="h6">Edit Listing</Typography>
                    <Typography variant="subtitle1" component="span">Modify your current listing</Typography>
                </div>
            </header>
            <Grid container direction="row" spacing={4} className={classes.container}>
                <Grid item xs={12} lg={4} className={classes.listingFormContainer}>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>I Have</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
                                    fullWidth 
                                    required
                                >
                                    <Select
                                        labelId="AvailableCurrency"
                                        value={AvailableCurrency}
                                        onChange={(e) => setAvailableCurrency(e.target.value)}
                                    >
                                        <MenuItem value="">Select Currency</MenuItem>
                                        {currencies.length > 0 && currencies.map((currency, index) => (
                                            <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <br />
                                <Tooltip title="This is the amount you wish to change." aria-label="Exchange Amount" arrow>
                                    <TextField
                                        value={ExchangeAmount}
                                        onChange={(e) => setExchangeAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        helperText={errors.ExchangeAmount}
                                        fullWidth
                                        required
                                        error={errors.ExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>Exchange Rate</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.RequiredCurrency ? true : false } 
                                    fullWidth 
                                    required
                                >
                                    <Select
                                        labelId="RequiredCurrency"
                                        value={RequiredCurrency}
                                        onChange={(e) => setRequiredCurrency(e.target.value)}
                                    
                                    >
                                        <MenuItem value="">Select Currency</MenuItem>
                                        {currencies.length > 0 && currencies.map((currency, index) => (
                                            <MenuItem key={index} value={currency.value} disabled={currency.value === AvailableCurrency ? true : false}>{currency.value}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.RequiredCurrency}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={7}>
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
                                        error={errors.ExchangeRate ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>Min. Exchange Amount</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
                                    fullWidth 
                                    required
                                >
                                    <Select
                                        labelId="AvailableCurrency"
                                        value={AvailableCurrency}
                                        onChange={(e) => setAvailableCurrency(e.target.value)}
                                    
                                    >
                                        <MenuItem value="">Select Currency</MenuItem>
                                        {currencies.length > 0 && currencies.map((currency, index) => (
                                            <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={7}>
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
                                        required
                                        error={errors.MinExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>I Will Receive</Typography>
                                <Tooltip title="This is the amount you will receive in your bank account." aria-label="Amount to Receive" arrow>
                                    <TextField
                                        value={ReceiptAmount}
                                        onChange={(e) => setReceiptAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        helperText={errors.ReceiptAmount}
                                        fullWidth
                                        required
                                        error={errors.ReceiptAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Listing Fee</Typography>
                                <TextField
                                    value={ListingFee}
                                    onChange={(e) => setListingFee(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Amount"
                                    helperText={errors.ListingFee}
                                    fullWidth
                                    required
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
                <Grid item xs={12} lg={8} className={classes.listings}>
                    {/* <section className={classes.noListing}>
                        <Typography variant="h6">Previous Listings</Typography>
                        <Divider />
                        <div className={classes.noListingContent}>
                            <FormatListText className={classes.noListingIcon} />
                            <Typography className={classes.noListingText} variant="subtitle2" component="span">Your previous listings would appear here</Typography>
                        </div>
                    </section> */}
                    <Typography variant="h6">Previous Listings</Typography>
                    <br />
                    <Divider />
                    <br />
                    <div>
                        {
                            previousListings.map(item => (<EditListingItem key={item.id} listing={item} />))
                        }
                    </div>
                </Grid>
            </Grid>
        </section>
    );
};

EditListing.propTypes = {
    updateListing: PropTypes.func.isRequired
};

export default connect(undefined, { updateListing })(EditListing);