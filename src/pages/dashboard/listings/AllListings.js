import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { 
	Button,
	Fab,
	FormControl,
	FormHelperText,
	Grid,
	Link, 
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FilterOutline } from 'mdi-material-ui';
import _ from 'lodash';

import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import { getCurrencies } from '../../../actions/currencies';
import { getCustomerInformation } from '../../../actions/customer';
import { getListingsOpenForBid } from '../../../actions/listings';
import { HIDE_NEGOTIATION_LISTINGS } from '../../../actions/types';
import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import FilterListingModal from './FilterListingModal';
import Listings from './Listings';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
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

	listings: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
		}
	},

	listingHeader: {
		[theme.breakpoints.down('md')]: {
			marginTop: theme.spacing(2)
		},

		'& h5': {
			fontWeight: 500
		},
	},

	headerContent: {
		display: 'flex',
		flexDirection: 'row',
		fontWeight: 300,
		justifyContent: 'space-between',

		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			marginTop: theme.spacing(2)
		},

		'& span': {
			fontWeight: 300,
		}
	},

	listingContainer: {
		position: 'relative',
		left: 0,
		border: '1px solid red',
		marginTop: theme.spacing(5)
	},

	filterContainer: {
		backgroundColor: COLORS.lightTeal,
		padding: theme.spacing(2),
		position: 'fixed',
		right: 0,
		width: '21%',
		minWidth: '21%',
		height: '100vh',

		[theme.breakpoints.down('md')]: {
			display: 'none'
		},

		'& form': {
			'& header': {
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				columnGap: theme.spacing(10),
				marginBottom: theme.spacing(4),
				alignItems: 'center'
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

const AllListings = (props) => {
	const classes = useStyles();
	const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

	const dispatch = useDispatch();
	const { profile, isAuthenticated } = useSelector(state => state.customer);
	const { listings, currentPageNumber, hasNext } = useSelector(state => state.listings);
	
	const [open, setOpen] = useState(false);

	const { getCustomerInformation, getListingsOpenForBid, handleSetTitle } = props;

	useEffect(() => {
		handleSetTitle('All Listings');
		if (isAuthenticated && _.isEmpty(listings)) {
			getListings();
		}

		if (_.isEmpty(profile)) {
			getCustomerInformation();
		}
		// eslint-disable-next-line
	}, []);

	const getListings = () => {
		console.log('getting listings');
		getListingsOpenForBid({
			pageNumber: 0,
			pageSize: 5,
			currencyNeeded: 'EUR',
			currencyAvailable: 'NGN',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});
	};

	const getMoreListings = () => {
		console.log('getting listings');
		getListingsOpenForBid({
			pageNumber: currentPageNumber + 1,
			pageSize: 15,
			currencyNeeded: 'EUR',
			currencyAvailable: 'NGN',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});	
	};

	const handleOpenModal = () => {
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
	};

	const hideListingsInNegotiation = () => {
		dispatch({ type: HIDE_NEGOTIATION_LISTINGS });
	};

	return (
		<section className={classes.root} id="parent">
			<Tooltip title="Filter Listings" arrow>
				<Fab 
					className={classes.fab} 
					color="primary" 
					aria-label="filter listings"
					onClick={handleOpenModal}
				>
					<FilterOutline />
				</Fab>
			</Tooltip>
			<FilterListingModal open={open} handleCloseModal={handleCloseModal} />
			<Grid container direction="row">
				<Grid item xs={12} lg={9} className={classes.listings}>
					<header className={classes.listingHeader}>
						<Typography variant="h5">All Listings</Typography>
						<div className={classes.headerContent}>
							<Typography variant="subtitle1" component="span">Here are all the listings available right now</Typography>
							<Link to="#!" component={RouterLink} onClick={hideListingsInNegotiation}>Hide listings in negotiation</Link>
						</div>
					</header>
					<InfiniteScroll 
						className={classes.listingContainer}
						dataLength={listings.length || 5}
						next={getMoreListings}
						hasMore={hasNext}
						scrollThreshold={1}
						loader={<h4>Fetching Listings . . .</h4>}
						refreshFunction={getListings}
						pullDownToRefresh
						pullDownToRefreshThreshold={80}
						releaseToRefreshContent={
							matches && <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
						}
						pullDownToRefreshContent={
							matches && <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
						}
						// endMessage={}
						scrollableTarget="parent"
						height="100%"
					>
						<Listings />
					</InfiniteScroll>
				</Grid>
				<Filter />
			</Grid>
		</section>
	);
}

const Filter = connect(undefined, { getListingsOpenForBid, getCurrencies })((props) => {
	const PRICE = 'PRICE';
	const RATING = 'RATING';
	const classes = useStyles();
	const { currencies, listings } = useSelector(state => state);

	const [AvailableCurrency, setAvailableCurrency] = useState('');
	const [RequiredCurrency, setRequiredCurrency] = useState('');
	const [MinExchangeAmount, setMinExchangeAmount] = useState('');

	const [SellerRating, setSellerRating] = useState('');
	// eslint-disable-next-line
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState(PRICE);

	useEffect(() => {
		if (currencies.length === 0) {
			props.getCurrencies();
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		setLoading(false);
	}, [listings]);

	const handleClearFilter = () => {
		setFilter(PRICE);
		setAvailableCurrency('');
		setRequiredCurrency('');
		setMinExchangeAmount('');
		setSellerRating('');
		setErrors({});
		setLoading(false);

		props.getListingsOpenForBid({
			pageNumber: 0,
			pageSize: 15,
			currencyNeeded: 'EUR',
			currencyAvailable: 'NGN',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});
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
			props.getListingsOpenForBid({
				pageNumber: 0,
				pageSize: 15,
				currencyAvailable: 'NGN',
				currencyNeeded: 'EUR',
				minimumExchangeAmount: 0,
				useCurrencyFilter: false,
				useRatingFilter: true,
				sellerRating: parseInt(SellerRating)
			});
			// Get rating by star
		} else {
			const priceFilter = {
				AvailableCurrency,
				RequiredCurrency,
				MinExchangeAmount
			};
			const { errors, isValid } = validatePriceFilter(priceFilter);

			if (!isValid) {
				return setErrors({ msg: 'Invalid Filter', ...errors });
			}

			setErrors({});
			setLoading(true);
			props.getListingsOpenForBid({
				pageNumber: 0,
				pageSize: 15,
				currencyAvailable: AvailableCurrency,
				currencyNeeded: RequiredCurrency,
				minimumExchangeAmount: Number(MinExchangeAmount),
				useCurrencyFilter: false,
				useRatingFilter: false,
				sellerRating: 0
			});
		}
	};

	return (
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
							<Typography variant="subtitle2">I Want</Typography>
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
									<MenuItem value="">Select Currency</MenuItem>
									{currencies.length > 0 && currencies.map((currency, index) => (
										<MenuItem key={index} value={currency.value} disabled={currency.value === AvailableCurrency ? true : false}>{currency.value}</MenuItem>
									))}
								</Select>
								<FormHelperText>{errors.AvailableCurrency}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="subtitle2">Min. Exchange Amount</Typography>
						</Grid>
						<Grid item xs={5}>
							<FormControl 
								variant="outlined" 
								error={errors.AvailableCurrency ? true : false } 
								fullWidth 
								required
								disabled={true}
							>
								<Select
									labelId="AvailableCurrency"
									value={AvailableCurrency}
								
								>
									<MenuItem value={AvailableCurrency}>{AvailableCurrency}</MenuItem>
								</Select>
								<FormHelperText>{errors.AvailableCurrency}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={7}>
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
						</Grid>
						<Grid item xs={12}>
							<Button 
								type="submit" 
								variant="contained" 
								color="primary"
								fullWidth
								>
									Filter Result
							</Button>
						</Grid>
					</Grid>
					:
					<Grid container direction="row" spacing={2}>
						<Grid item xs={12}>
							<Typography variant="subtitle2">Number of Stars</Typography>
								<FormControl 
									variant="outlined" 
									error={errors.SellerRating ? true : false } 
									fullWidth 
									required
								>
									<Select
										labelId="SellerRating"
										value={SellerRating}
										onChange={(e) => setSellerRating(e.target.value)}
									
									>
										<MenuItem value="">Select Number of Stars</MenuItem>
										<MenuItem value="1">1</MenuItem>
										<MenuItem value="2">2</MenuItem>
										<MenuItem value="3">3</MenuItem>
										<MenuItem value="4">4</MenuItem>
										<MenuItem value="5">5</MenuItem>
									</Select>
									<FormHelperText>{errors.SellerRating}</FormHelperText>
								</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Button 
								type="submit" 
								variant="contained" 
								color="primary"
								fullWidth
								>
									Filter Result
							</Button>
						</Grid>
					</Grid>
				}
				
			</form>
			<Link 
				to="#!" 
				component={RouterLink}
				className={classes.buyerPopup}
			>
				Buyer Account Details Popup
			</Link>
		</Grid>
	);
});

Filter.propTypes = {
	getCurrencies: PropTypes.func,
	getListingsOpenForBid: PropTypes.func
};

AllListings.propTypes = {
	getCustomerInformation: PropTypes.func,
	getListingsOpenForBid: PropTypes.func,
	handleSetTitle:PropTypes.func.isRequired
};

export default connect(undefined, { getCustomerInformation, getListingsOpenForBid })(AllListings);