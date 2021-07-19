import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    CircularProgress,
    Fade,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel, 
	MenuItem,
    Modal,
	Select,
	TextField,
    Tooltip,
	Typography,
    useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import SuccessModal from '../../../components/common/SuccessModal';

import { getCurrencies } from '../../../actions/currencies';
import { addListing } from '../../../actions/listings';
import { ADDED_LISTING } from '../../../actions/types';

import { COLORS, SHADOW } from '../../../utils/constants';
import validateAddListing from '../../../utils/validation/listing/add';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: SHADOW
    },

    container: {
		backgroundColor: COLORS.lightTeal,
        borderRadius: '5px',
		padding: theme.spacing(4, 2),
        width: '80%',

        [theme.breakpoints.down('sm')]: {
            height: '80vh',
            overflowY: 'auto'
        },

        '& header': {
            marginBottom: theme.spacing(4),
            textAlign: 'center',
            
            '& h6': {
                fontWeight: 600,
            },

            '& span': {
                [theme.breakpoints.down('sm')]: {
                    display: 'inline-block',
                    textAlign: 'left',
                }
            }
        }
	}
}));

const AddListingModal = ({ addListing, edit, open, getCurrencies, handleCloseModal }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    
    const { currencies } = useSelector(state => state);
    const { addedListing, listings, msg } = useSelector(state => state.listings);

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
        setLoading(false);
    }, [listings]);

    useEffect(() => {
        if (currencies.length === 0) {
            getCurrencies();
        }
    }, [currencies, getCurrencies]);

    useEffect(() => {
        if (addedListing && matches) {
            resetForm();
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            return dispatch({
                type: ADDED_LISTING
            });
        }
    }, [addedListing, dispatch, matches, msg]);

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
        addListing(listing);
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            disableBackdropClick={loading ? true : false}
            disableEscapeKeyDown={loading ? true : false}
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid item lg={3} className={classes.container}>
                    <SuccessModal ref={successModal} />
                    <header>
                        <div>
                            {edit ? 
                                <>
                                    <Typography variant="h6">Edit Listing</Typography>
                                    <Typography variant="subtitle1" component="span">Modify your current listing.</Typography>
                                </>
                             : 
                                <>
                                    <Typography variant="h6">Make a Listing</Typography>
                                    <Typography variant="subtitle1" component="span">Complete the form below to post a listing</Typography>
                                </>
                            }
                        </div>
                    </header>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={1} className={classes.formContainer}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span">I Have</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
                                    disabled={loading ? true : false}
                                    fullWidth 
                                    required
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
                                        {currencies?.length > 0 && currencies.map((currency, index) => (
                                            <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={7}>
                            <Typography variant="subtitle2" component="span">&nbsp;</Typography>
                                <Tooltip title="This is the amount you wish to change." aria-label="Exchange Amount" arrow>
                                    <TextField
                                        value={ExchangeAmount}
                                        onChange={(e) => setExchangeAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        label="Enter Amount" 
                                        helperText={errors.ExchangeAmount}
                                        disabled={loading ? true : false}
                                        fullWidth
                                        required
                                        error={errors.ExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span">Exchange Rate</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.RequiredCurrency ? true : false } 
                                    disabled={loading ? true : false}
                                    fullWidth 
                                    required
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
                                        disabled={loading ? true : false}
                                        fullWidth
                                        required
                                        error={errors.ExchangeRate ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span">Min. Exchange Amount</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
                                    disabled={loading ? true : false}
                                    fullWidth 
                                    required
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
                                        disabled={loading ? true : false}
                                        fullWidth
                                        required
                                        error={errors.MinExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">I Will Receive</Typography>
                                <Tooltip title="This is the amount you will receive in your bank account." aria-label="Amount to Receive" arrow>
                                    <TextField
                                        value={ReceiptAmount}
                                        onChange={(e) => setReceiptAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        // label="Enter Amount" 
                                        helperText={errors.ReceiptAmount}
                                        disabled={loading ? true : false}
                                        fullWidth
                                        required
                                        error={errors.ReceiptAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span">Listing Fee</Typography>
                                <TextField
                                    value={ListingFee}
                                    onChange={(e) => setListingFee(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Amount"
                                    // label="Enter Amount" 
                                    helperText={errors.ListingFee}
                                    disabled={loading ? true : false}
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
                                    fullWidth
                                    disabled={loading ? true : false}
                                >
                                    {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Fade>
        </Modal>
	);
};

AddListingModal.propTypes = {
    addListing: PropTypes.func.isRequired,
    getCurrencies: PropTypes.func.isRequired,
    edit: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default connect(undefined, { addListing, getCurrencies })(AddListingModal);