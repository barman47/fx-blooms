import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Button,
    CircularProgress,
    Divider,
    Fab,
    FormControl, 
    FormHelperText,
    Grid, 
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {FormatListText,  Plus } from 'mdi-material-ui';

import AddListingModal from './AddListingModal';
import SellerAccountModal from './SellerAccountModal';
import SuccessModal from '../../../components/common/SuccessModal';
import Listing from './Listing';

import { getCurrencies } from '../../../actions/currencies';
import { addListing } from '../../../actions/listings';
import { ADDED_LISTING } from '../../../actions/types';
import { COLORS } from '../../../utils/constants';
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
        top: 0,

        [theme.breakpoints.down('md')]: {
            height: '100%'
        }
    },

    listingFormContainer: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },

    helperText: {
        fontSize: '10px'
    },

    listings: {
        
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
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const { currencies } = useSelector(state => state);
    const { addedListing, listings, msg } = useSelector(state => state.listings);

    const { getCurrencies, handleSetTitle } = props;

    useEffect(() => {
        // console.log(listings.length);
        handleSetTitle('Add Listing');
        // eslint-disable-next-line
    }, []);

    const [open, setOpen] = useState(false);
    const [openAccountModal, setOpenAccountModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [RequiredCurrency, setRequiredCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    const [ListingFee, setListingFee] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const successModal = useRef();

    useEffect(() => {
        if (currencies.length === 0) {
            getCurrencies();
        }
    }, [currencies, getCurrencies]);

    useEffect(() => {
        setLoading(false);
    }, [listings]);

    useEffect(() => {
        if (addedListing && !matches) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            return dispatch({
                type: ADDED_LISTING
            });
        }
    }, [addedListing, dispatch, matches, msg]);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOpenAccountModalModal = () => {
        setOpenAccountModal(true);
    };

    const handleCloseAccountModalModal = () => {
        setOpenAccountModal(false);
    };

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
            return setErrors({ ...errors, msg: 'Invalid login data' });
        }

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
                CurrencyType: RequiredCurrency,
                Amount: parseFloat(MinExchangeAmount)
            }
        };

        setLoading(true);
        props.addListing(listing);
    };

    return (
        <section className={classes.root}>
            <Tooltip title="Create Listing" arrow>
				<Fab 
					className={classes.fab} 
					color="primary" 
					aria-label="filter listings"
					onClick={handleOpenModal}
				>
					<Plus />
				</Fab>
			</Tooltip>
			<SuccessModal ref={successModal} />
			<AddListingModal open={open} edit={false} handleCloseModal={handleCloseModal} currencies={currencies} />
			<SellerAccountModal open={openAccountModal} handleCloseModal={handleCloseAccountModalModal} />
            <header>
                <div>
                    <Typography variant="h6">Make a Listing</Typography>
                    <Typography variant="subtitle1" component="span">Complete the form below to post a listing</Typography>
                </div>
                <Typography variant="subtitle1" component="p" onClick={handleOpenAccountModalModal}>Seller Account Details Popup</Typography>
            </header>
            <Grid container direction="row" spacing={4} className={classes.container}>
                <Grid item md={4} className={classes.listingFormContainer}>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>I Have</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
                                    fullWidth 
                                    required
                                    disabled={loading ? true : false}
                                >
                                    <InputLabel 
                                        id="AvailableCurrency" 
                                        variant="outlined" 
                                        error={errors.AvailableCurrency ? true : false}
                                    >
                                        &#163;(GBP)
                                    </InputLabel>
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
                                        label="Enter Amount" 
                                        helperText={errors.ExchangeAmount}
                                        fullWidth
                                        required
                                        disabled={loading ? true : false}
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
                                    disabled={loading ? true : false}
                                >
                                    <InputLabel 
                                        id="RequiredCurrency" 
                                        variant="outlined" 
                                        error={errors.RequiredCurrency ? true : false}
                                    >
                                        &#8358;(NGN)
                                    </InputLabel>
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
                                        label="Enter Amount" 
                                        helperText={errors.ExchangeRate}
                                        fullWidth
                                        required
                                        disabled={loading ? true : false}
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
                                    disabled={loading ? true : false}
                                >
                                    <InputLabel 
                                        id="AvailableCurrency" 
                                        variant="outlined" 
                                        error={errors.AvailableCurrency ? true : false}
                                    >
                                        &#163;(GBP)
                                    </InputLabel>
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
                                        label="Enter Amount" 
                                        helperText={errors.MinExchangeAmount}
                                        fullWidth
                                        disabled={loading ? true : false}
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
                                        // label="Enter Amount" 
                                        helperText={errors.ReceiptAmount}
                                        fullWidth
                                        required
                                        disabled={loading ? true : false}
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
                                    // label="Enter Amount" 
                                    helperText={errors.ListingFee}
                                    fullWidth
                                    required
                                    disabled={loading ? true : false}
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
                            {listings.map(listing => (
                                <Listing key={listing.id} listing={listing} />
                            ))}
                            {/* <Listing negotiation by />
                            <Listing buttonText="Edit" />
                            <Listing />
                            <Listing negotiation by />
                            <Listing buttonText="Edit" />
                            <Listing />
                            <Listing negotiation by />
                            <Listing buttonText="Edit" /> */}
                    </div>
                    }
                </Grid>
            </Grid>
        </section>
    );
};

MakeListing.propTypes = {
    addListing: PropTypes.func.isRequired,
    getCurrencies: PropTypes.func.isRequired
};

export default connect(undefined, { addListing, getCurrencies })(MakeListing);