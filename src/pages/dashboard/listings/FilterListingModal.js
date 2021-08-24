import { useCallback, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import clsx from 'clsx';
import { 
    Backdrop,
	Button,
	CircularProgress,
    Fade,
	FormControl,
	FormHelperText,
	Grid,
	MenuItem,
    Modal,
	Select,
	TextField,
	Typography 
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { getListingsOpenForBid } from '../../../actions/listings';
import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    filterContainer: {
		backgroundColor: COLORS.lightTeal,
        borderRadius: '5px',
		padding: theme.spacing(4, 3),
        width: '80vw',

		[theme.breakpoints.down('md')]: {
			width: '40vw'
		},

		[theme.breakpoints.down('sm')]: {
			width: '85vw'
		},

		'& form': {
			'& header': {
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				columnGap: theme.spacing(10),
				marginBottom: theme.spacing(4),
				alignItems: 'center',

				'& span': {
					cursor: 'pointer',
					'&:hover': {
						textDecoration: 'underline'
					}
				}
			}
		}
	},

    clear: {
		cursor: 'pointer',
		'&:hover': {
			textDecoration: 'underline'
		}
	},

	filterButton: {
		borderRadius: '25px',
        marginTop: theme.spacing(1),

		'&:hover': {
			textDecoration: 'none !important'
		}
	},

	disabledButton: {
		backgroundColor: '#d8dcdc',
		color: '#aoa3a3'
	},

	buyerPopup: {
		display: 'inline-block',
		marginTop: theme.spacing(2),
		textAlign: 'center',
		width: '100%'
	}
}));

const MobileFilterModal = (props) => {

    const [open, setOpen] = useState(false);

    const { getListingsOpenForBid } = props;

    const closeModal = useCallback(() => {
        setOpen(false);
    }, []);

    const PRICE = 'PRICE';
	const RATING = 'RATING';
	
    const classes = useStyles();
	const theme = useTheme();
	
	const { listings } = useSelector(state => state.listings);
	const { currencies } = useSelector(state => state);

	const [AvailableCurrency, setAvailableCurrency] = useState('');
	const [RequiredCurrency, setRequiredCurrency] = useState('');
	const [Amount, setAmount] = useState('');

	const [SellerRating, setSellerRating] = useState(0);

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState(PRICE);

    useEffect(() => {
        setLoading(false);
        closeModal();
    }, [closeModal, listings])

	useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

	const handleClearFilter = () => {
		setFilter(PRICE);
		setAvailableCurrency('');
		setRequiredCurrency('');
		setAmount('');
		setSellerRating('');
		setErrors({});

		getListingsOpenForBid();
	};

    const onSubmit = (e) => {
		e.preventDefault();
		setErrors({});

		if (filter === RATING) {
			if (isEmpty(SellerRating)) {
				return setErrors({ msg: 'Invalid Filter', SellerRating: 'Seller rating is required!' });
			}

			setErrors({});
			setLoading(true);
			getListingsOpenForBid({
				pageNumber: 1,
				pageSize: 15,
				currencyAvailable: AvailableCurrency,
				currencyNeeded: RequiredCurrency,
				amount: Number(Amount),
				useCurrencyFilter: false,
				useRatingFilter: true,
				sellerRating: parseInt(SellerRating)
			});
		} else {
			// Get rating by star
			const priceFilter = {
				AvailableCurrency,
				RequiredCurrency,
				Amount
			};
			const { errors, isValid } = validatePriceFilter(priceFilter);

			if (!isValid) {
				return setErrors({ msg: 'Invalid Filter', ...errors });
			}

			setErrors({});
			setLoading(true);
			getListingsOpenForBid({
				pageNumber: 1,
				pageSize: 15,
				currencyAvailable: AvailableCurrency,
				currencyNeeded: RequiredCurrency,
				amount: Number(Amount),
				useCurrencyFilter: true,
				useRatingFilter: false,
				sellerRating: 0
			});
		}
	};

	return (
        <Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={open}
			onClose={() => setOpen(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
        >
            <Fade in={open}>
                <Grid item lg={3} className={classes.filterContainer}>
					<form onSubmit={onSubmit} noValidate>
						<header>
							<Typography variant="h6">Filter</Typography>
							<Typography 
								className={classes.clear}
								variant="subtitle2" 
								component="span" 
								color="primary"
								onClick={handleClearFilter}
								>
									Clear
							</Typography>
							<Button 
								className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === RATING } )} 
								variant="contained" 
								color="primary" 
								size="small"
								onClick={() => setFilter(PRICE)}
							>
								Price
							</Button>
							<Button 
								className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === PRICE } )} 
								variant="contained" 
								color="primary" 
								size="small"
								onClick={() => setFilter(RATING)}
							>
								Rating
							</Button>
						</header>
						{
						filter === PRICE
							?
							<Grid container direction="row" spacing={1}>
								<Grid item xs={12}>
									<Typography variant="subtitle2">I Have</Typography>
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
											<MenuItem value="">Select Currency</MenuItem>
											{currencies.length > 0 && currencies.map((currency, index) => (
												<MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
											))}
										</Select>
										<FormHelperText>{errors.AvailableCurrency}</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="subtitle2">I want</Typography>
								</Grid>
								<Grid item xs={5}>
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
											<MenuItem value="" disabled>Select</MenuItem>
											{currencies.length > 0 && currencies.map((currency, index) => (
												<MenuItem key={index} value={currency.value} disabled={currency.value === AvailableCurrency ? true : false}>{currency.value}</MenuItem>
											))}
										</Select>
										<FormHelperText>{errors.RequiredCurrency}</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={7}>
									<TextField 
										value={Amount}
										onChange={(e) => setAmount(e.target.value)}
										type="text"
										variant="outlined" 
										placeholder="Enter Amount"
										helperText={errors.Amount}
										fullWidth
										required
										error={errors.Amount ? true : false}
										disabled={loading ? true : false}
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
										{!loading ? 'Filter Result' : <CircularProgress style={{ color: '#f8f8f8' }} />}
									</Button>
								</Grid>
							</Grid>
							:
							<Grid container direction="row" spacing={2}>
								<Grid item xs={12}>
									<Rating 
										color="primary" 
										name="seller-rating"  
										style={{ color: theme.palette.primary.main }}
										value={SellerRating}
										onChange={(e) => setSellerRating(e.target.value)}
										disabled={loading ? true : false}
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
										{!loading ? 'Filter Result' : <CircularProgress style={{ color: '#f8f8f8' }} />}
									</Button>
								</Grid>
							</Grid>
						}
					</form>
                </Grid>
            </Fade>
        </Modal>
	);
};

export default connect(undefined, { getListingsOpenForBid })(MobileFilterModal);