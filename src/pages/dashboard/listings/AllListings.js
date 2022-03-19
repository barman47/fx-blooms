import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { 
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	Collapse,
	FormControlLabel,
	InputAdornment,
	TextField,
	Typography,
	// useMediaQuery 
} from '@material-ui/core';
// import Rating from '@material-ui/lab/Rating';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { Camera, ChevronDown, ChevronRight, FilterOutline } from 'mdi-material-ui';
import _ from 'lodash';

import { getNotifications } from '../../../actions/notifications';
import { getCustomerInformation, getIdVerificationLink, getCustomerStats } from '../../../actions/customer';
// import { getCurrencies } from '../../../actions/currencies';
import { getAccounts } from '../../../actions/bankAccounts';
import { 
	ACTIVATE_EUR_WALLET,
	ACTIVATE_NGN_WALLET,
	ACTIVATE_USD_WALLET,
	ACTIVATE_GPB_WALLET,
	HIDE_NEGOTIATION_LISTINGS, 
	SET_LOADING_LISTINGS 
} from '../../../actions/types';
import { getListingsOpenForBid, getMoreListings } from '../../../actions/listings';
import { CUSTOMER_CATEGORY, ID_STATUS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
// import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import Listings from './Listings';
import RiskNoticeModal from './RiskNoticeModal';
import WalletInfoModal from '../wallet/WalletInfoModal';
import FundWalletDrawer from '../wallet/FundWalletDrawer';
import WalletWithdrawalDrawer from '../wallet/WalletWithdrawalDrawer';
import Wallet from '../wallet/Wallet';
import WalletInfo from '../wallet/WalletInfo';
// import NewNotification from '../notifications/NewNotification';
// import RiskNoticeModal from './RiskNoticeModal';

// import img from '../../../assets/img/decentralized.svg';
import EUFlag from '../../../assets/img/EU-flag.svg';
import NGNFlag from '../../../assets/img/NGN-flag.svg';
import USFlag from '../../../assets/img/US-flag.svg';
import GBPFlag from '../../../assets/img/GBP-flag.svg';
import ListingsSkeleton from './ListingsSkeleton';

const useStyles = makeStyles(theme => ({
	header: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(10),
		padding: theme.spacing(0, 5),

		[theme.breakpoints.down('md')]: {
			display: 'grid',
			gridTemplateColumns: '1fr',
			paddingLeft: theme.spacing(5),
			paddingRight: theme.spacing(5),
			gap: theme.spacing(1)
		},

		[theme.breakpoints.down('sm')]: {
			marginBottom: '0',
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2)
		},

		// '& div:first-child': {
		// 	'& p:last-child': {
		// 		marginTop: theme.spacing(2),
		// 		color: COLORS.grey
		// 	}
		// }
	},

	root: {
		maxWidth: '100vw',

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1)
		}
	},

	walletsContainer: {
		display: 'grid',
		gridTemplateColumns: '1fr',
		flexDirection: 'column',
		// gap: theme.spacing(1),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
		margin: '0 auto',
		width: '70%',

		[theme.breakpoints.down('md')]: {
			width: '90%'
		},

		[theme.breakpoints.down('sm')]: {
			gap: theme.spacing(2),
			margin: '0',
			paddingLeft: '0',
			paddingRight: '0',
			width: '100%'
		}
	},

	wallets: {
		borderRadius: theme.shape.borderRadius,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: '0 auto',
		width: '100%',

		[theme.breakpoints.down('md')]: {
			width: '100%'
		}
	},

	walletToggleContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: theme.spacing(7)
	},

	walletToggle: {
		color: theme.palette.primary.main,

		[theme.breakpoints.down('md')]: {
			display: 'none'
		},

		'&:hover': {
			backgroundColor: 'transparent'
		}
	},

	filterContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(1),

		[theme.breakpoints.down('sm')]: {
			display: 'grid',
			gridTemplateColumns: '0.7fr 1fr 1fr',
			rowGap: theme.spacing(0.8),
		},

		[theme.breakpoints.down('sm')]: {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			alignItems: 'center',
		},

		// Search field
		'& .MuiOutlinedInput-input': {
			paddingBottom: theme.spacing(1),
			paddingTop: theme.spacing(1)
		},

		// Search button
		'& .MuiOutlinedInput-adornedEnd': {
			paddingRight: '0'
		},

		// Hide Listings Checkbox label
		'& .MuiFormControlLabel-root': {
			[theme.breakpoints.down('md')]: {
				margin: '0'
			}
		}
	},

	buttonGroup: {
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing(1)
		}
	},

	searchButton: {
		paddingBottom: theme.spacing(0.7),
		paddingTop: theme.spacing(0.7)
	},

	// gateway: {
	// 	background: 'linear-gradient(238.08deg, #25AEAE -0.48%, #1E6262 99.63%)',
	// 	boxShadow: '1px 14px 30px -16px rgba(30, 98, 98, 1)',
	// 	display: 'flex',
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-between',
	// 	height: 'initial',
    //     padding: [[theme.spacing(5), 0, 0, theme.spacing(2)]],

	// 	'& div:first-child': {
	// 		display: 'flex',
	// 		flexDirection: 'column',
	// 		justifyContent: 'space-between',

	// 		'& h5': {
	// 			color: COLORS.offWhite,
	// 			fontWeight: 600
	// 		},

	// 		'& p': {
	// 			color: COLORS.offWhite,
	// 			marginBottom: theme.spacing(3)
	// 		},
	// 	},

	// 	'& img': {
	// 		width: '35%',
	// 		alignSelf: 'flex-end'
	// 	}
	// },
	
	listings: {
		height: '100vh',
		overflow: 'auto',
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),

		[theme.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr'
		},

		[theme.breakpoints.down('sm')]: {
			paddingLeft: '0',
			paddingRight: '0',
		}
	},

	listingContainer: {
		marginTop: theme.spacing(1)
	},

	// filter: {
	// 	marginTop: theme.spacing(4)
	// },

	// filterContainer: {
	// 	backgroundColor: COLORS.lightTeal,
	// 	borderRadius: theme.shape.borderRadius,
	// 	padding: [[theme.spacing(2), theme.spacing(2), theme.spacing(4), theme.spacing(2)]],
	// 	height: 'initial',
	// 	alignSelf: 'flex-start',
	// 	marginTop: theme.spacing(6.5),
	// 	position: 'sticky',

	// 	[theme.breakpoints.down('md')]: {
	// 		display: 'none'
	// 	},

	// 	'& header:first-child': {
	// 		display: 'flex',
	// 		flexDirection: 'row',
	// 		justifyContent: 'space-between',
	// 		marginBottom: theme.spacing(3),
	// 		padding: 0,
	// 	}
	// },

	// filterButtonContainer: {
	// 	display: 'flex',
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-between',
	// 	marginBottom: theme.spacing(3),
	// 	padding: 0,
	// },

	// clear: {
	// 	cursor: 'pointer',
	// 	'&:hover': {
	// 		textDecoration: 'underline'
	// 	}
	// },

	// filterButton: {
	// 	'&:hover': {
	// 		textDecoration: 'none !important'
	// 	}
	// },

	// label: {
	// 	fontSize: theme.spacing(1.5)
	// },

	// disabledButton: {
	// 	backgroundColor: '#d8dcdc',
	// 	color: '#aoa3a3'
	// },

	buyerPopup: {
		display: 'inline-block',
		marginTop: theme.spacing(2),
		textAlign: 'center',
		width: '100%'
	}
}));

const AllListings = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const theme = useTheme();

	const { customerId, firstName, userName, profile, isAuthenticated } = useSelector(state => state.customer);
	const { listings, currentPageNumber, hasNext } = useSelector(state => state.listings);
	const listingsLoading = useSelector(state => state.listings.loading);
	const { accounts } = useSelector(state => state.bankAccounts);
	const { idStatus } = useSelector(state => state.customer.stats);
	const { unreadNotifications } = useSelector(state => state.notifications);
	const { eurActive, ngnActive, usdActive, gbpActive } = useSelector(state => state.wallets);

	const { getAccounts, getCustomerInformation, getCustomerStats, getIdVerificationLink, getListingsOpenForBid, getMoreListings, getNotifications, handleSetTitle } = props;

	// eslint-disable-next-line
	const [AvailableCurrency, setAvailableCurrency] = useState('NGN');
	// eslint-disable-next-line
	const [RequiredCurrency, setRequiredCurrency] = useState('EUR');
	const [Amount, setAmount] = useState('');

	const [hideNegotiationListings, setHideNegotiationListings] = useState(false);
	const [errors, setErrors] = useState({});

	const [dataLength, setDataLength] = useState(0);
	const [fundDrawerOpen, setFundDrawerOpen] = useState(false);
    const [withdrawalDrawerOpen, setWithdrawalDrawerOpen] = useState(false);
	// eslint-disable-next-line
	const [showWallets, setShowWallets] = useState(false);

	let loadedEvent = useRef();
    const walletInfoModal = useRef();

	const { REJECTED } = CUSTOMER_CATEGORY;
	const { NOT_SUBMITTED } = ID_STATUS;

    const toggleFundDrawer = () => {
        setFundDrawerOpen(!fundDrawerOpen);
    };

    const toggleWithdrawalDrawer = () => {
        setWithdrawalDrawerOpen(!withdrawalDrawerOpen);
    };

	useEffect(() => {
		loadedEvent.current = getListings;
		window.addEventListener('DOMContentLoaded', loadedEvent.current);
		getCustomerStats();
		handleSetTitle('All Listings');
		if (isAuthenticated) {
			dispatch({
				type: SET_LOADING_LISTINGS,
				payload: true
			});
			getListings();
		}

		if (_.isEmpty(profile)) {
			getCustomerInformation();
		}

		if (unreadNotifications === 0) {
            getNotifications();
        }

		if (accounts.length === 0) {
            getAccounts(customerId);
        }

		return () => {
			window.removeEventListener('DOMContentLoaded', loadedEvent.current);
		};
		// eslint-disable-next-line
	}, []);

	// Only allow numbers on search
	const handleSetAmount = (value) => {
		if (isNaN(value)) {
			return;
		}
		setAmount(value);
	};

	// Fetch listings when search field is empty
	useEffect(() => {
		if (isEmpty(Amount)) {
			dispatch({
				type: SET_LOADING_LISTINGS,
				payload: true
			});
	
			getListingsOpenForBid({
				pageNumber: 0,
				pageSize: 15,
				currencyNeeded: 'EUR',
				currencyAvailable: 'NGN',
				minimumExchangeAmount: 0,
				useCurrencyFilter: false
			});
		}
	}, [Amount, dispatch, getListingsOpenForBid]);

	useEffect(() => {
		if (idStatus === REJECTED || idStatus === NOT_SUBMITTED) {
            getIdVerificationLink();
        }
	}, [getIdVerificationLink, idStatus, NOT_SUBMITTED, REJECTED]);

	useEffect(() => {
		setDataLength(listings.length);
	}, [dispatch, listings]);

	const getListings = () => {
		getListingsOpenForBid({
			pageNumber: 1,
			pageSize: 10,
			currencyNeeded: 'NGN',
			currencyAvailable: 'EUR',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		}, true);
	};

	const getMore = () => {
		getMoreListings({
			pageNumber: currentPageNumber + 1,
			pageSize: 10,
			currencyNeeded: 'EUR',
			currencyAvailable: 'NGN',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});	
	};

	const handleClearFilter = useCallback(() => {
		setAvailableCurrency('NGN');
		setRequiredCurrency('EUR');
		setAmount('');
		setErrors({});
		dispatch({
			type: SET_LOADING_LISTINGS,
			payload: true
		});

		getListingsOpenForBid({
			pageNumber: 0,
			pageSize: 15,
			currencyNeeded: 'EUR',
			currencyAvailable: 'NGN',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});
	}, [dispatch, getListingsOpenForBid]);

	useEffect(() => {
		if (hideNegotiationListings === false) {
			handleClearFilter();
		}
	}, [handleClearFilter, hideNegotiationListings]);

	const hideListingsInNegotiation = () => {
		setHideNegotiationListings(!hideNegotiationListings);
		if (!hideNegotiationListings) {
			console.log('Hiding unavailable listings');
			dispatch({ type: HIDE_NEGOTIATION_LISTINGS });
		}
	};

	const handleFilter = (e) => {
		e.preventDefault();
		setErrors({});


		if (isEmpty(Amount)) {
			return setErrors({ msg: 'Invalid Serach', Amount: 'Please enter an amount' });
		}

		setErrors({});
		dispatch({
			type: SET_LOADING_LISTINGS,
			payload: true
		});
		getListingsOpenForBid({
			pageNumber: 1,
			pageSize: 15,
			currencyAvailable: 'NGN',
			currencyNeeded: 'EUR',
			amount: Number(Amount),
			useCurrencyFilter: true,
			useRatingFilter: false,
			sellerRating: 0
		});
	};

	return (
		<>
			<RiskNoticeModal />
			{fundDrawerOpen && <FundWalletDrawer toggleDrawer={toggleFundDrawer} drawerOpen={fundDrawerOpen} />}
            {withdrawalDrawerOpen && <WalletWithdrawalDrawer toggleDrawer={toggleWithdrawalDrawer} drawerOpen={withdrawalDrawerOpen} />}
            <WalletInfoModal ref={walletInfoModal} />
			<section className={classes.header}>
				<div>
					<Typography variant="body1" component="p">Hello, <strong>{firstName ? firstName : userName}</strong></Typography> 
					{/* <Typography variant="body1" component="p">What would you like to do today?</Typography>  */}
				</div>
				{/* <div>
					<NewNotification 
						title="Set up  2FA"
						message="Required to keep your account more secure. Click Setup 2FA to proceed."
						buttonText="Setup 2FA"
						buttonAction={() => {}}
						icon={<Camera />}
						iconBackgroundColor="#F79410"
						iconColor="white"
					/>
				</div> */}
				
			</section>
			<Box component="section" className={classes.root}>
				{/* <Box component="div" className={classes.walletToggleContainer}>
					<Button
						variant="text"
						size="small"
						startIcon={showWallets ? <ChevronDown /> : <ChevronRight />}
						classes={{
							root: classes.walletToggle
						}}
						onClick={() => setShowWallets(!showWallets)}
						>
						{showWallets ? 'Hide Wallets' : 'Show Wallets'}
					</Button>
				</Box> */}
				<Collapse in={showWallets}>
					<section className={classes.walletsContainer}>
						<section className={classes.wallets}>
							<Wallet 
								type="EUR"
								flag={EUFlag}
								active={eurActive}
								handleOnclick={() => dispatch({ type: ACTIVATE_EUR_WALLET })}
							/>
							<Wallet 
								type="NGN"
								flag={NGNFlag}
								active={ngnActive}
								handleOnclick={() => dispatch({ type: ACTIVATE_NGN_WALLET })}
							/>
							<Wallet 
								type="USD"
								flag={USFlag}
								active={usdActive}
								handleOnclick={() => dispatch({ type: ACTIVATE_USD_WALLET })}
							/>
							<Wallet 
								type="GPB"
								flag={GBPFlag}
								active={gbpActive}
								handleOnclick={() => dispatch({ type: ACTIVATE_GPB_WALLET })}
							/>
							{/* <Paper className={classes.gateway}>
								<div>
									<Typography variant="h5">Your Gateway<br />into Decentralized<br />Money Exchange</Typography>
									<Link to={ABOUT_US} component="a" target="_blank">Learn More</Link>
								</div>
								<img src={img} alt="decentralized money exchange" />
							</Paper> */}
						</section>

						<WalletInfo 
							availableBalance="EUR2500.62"
							escrowedBalance="1000"
							toggleFundDrawer={toggleFundDrawer}
							toggleWithdrawalDrawer={toggleWithdrawalDrawer}
						/>
					</section>
				</Collapse>
				<section className={classes.listings} id="scrollableParent">
					<InfiniteScroll 
						className={classes.listingContainer}
						dataLength={dataLength}
						next={getMore}
						hasMore={hasNext}
						scrollThreshold={1}
						loader={<h4 style={{ textAlign: 'center' }}>Fetching Listings . . .</h4>}
						refreshFunction={getListings}
						// pullDownToRefresh
						// pullDownToRefreshThreshold={80}
						// releaseToRefreshContent={
						// 	matches && <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
						// }
						// pullDownToRefreshContent={
						// 	matches && <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
						// }
						endMessage={<h4 style={{ textAlign: 'center' }}>No More Listings</h4>}
						scrollableTarget="scrollableParent"
						// height={1000}
					>
						<Box component="div" className={classes.filterContainer}>
							<ButtonGroup disableElevation variant="contained" className={classes.buttonGroup}>
								<Button
									color="primary"
									size="small"
									disableRipple
									disableFocusRipple
								>
									BUY EUR
								</Button>
								<Button
									color="primary"
									size="small"
									disableRipple
									disableFocusRipple
									disabled
								>
									BUY NGN
								</Button>
							</ButtonGroup>
							<form onSubmit={handleFilter}>
								<TextField 
									value={Amount}
									onChange={(e) => handleSetAmount(e.target.value)}
									type="text"
									variant="outlined" 
									placeholder="Enter Amount"
									helperText={errors.Amount}
									fullWidth
									required
									error={errors.Amount ? true : false}
									disabled={listingsLoading ? true : false}
									InputProps={{
										startAdornment: <InputAdornment position="start" color="primary">EUR | </InputAdornment>,
										endAdornment: <InputAdornment position="end">
											<Button
												variant="contained"
												color="primary"
												// size="large"
												disableRipple
												disableFocusRipple
												className={classes.searchButton}
												onClick={handleFilter}
											>
												Search
											</Button>
										</InputAdornment>,
									}}
								/>
							</form>
							<FormControlLabel
								style={{ color: theme.palette.primary.main }}
								control={
									<Checkbox
										checked={hideNegotiationListings}
										onChange={hideListingsInNegotiation}
										color="primary"
									/>
								}
								label="Hide Unavailable Listings"
							/>
						</Box>
						{listingsLoading === true ?
							<ListingsSkeleton />
							:
							<Listings />
						}
						
					</InfiniteScroll>
					{/* <Filter /> */}
				</section>
			</Box>
		</>
	);
}

// const Filter = connect(undefined, { getCurrencies, getListingsOpenForBid })(({ getCurrencies, getListingsOpenForBid }) => {
// 	const PRICE = 'PRICE';
// 	const RATING = 'RATING';
// 	const classes = useStyles();
// 	const dispatch = useDispatch();
// 	const theme = useTheme();
// 	const { currencies, listings } = useSelector(state => state);

// 	// eslint-disable-next-line
// 	const [AvailableCurrency, setAvailableCurrency] = useState('NGN');
// 	// eslint-disable-next-line
// 	const [RequiredCurrency, setRequiredCurrency] = useState('EUR');
// 	const [Amount, setAmount] = useState('');

// 	const [SellerRating, setSellerRating] = useState(0);
// 	const [hideNegotiationListings, setHideNegotiationListings] = useState(false);
// 	const [errors, setErrors] = useState({});
// 	const [loading, setLoading] = useState(false);
// 	const [filter, setFilter] = useState(PRICE);

// 	useEffect(() => {
// 		if (currencies.length === 0) {
// 			getCurrencies();
// 		}
// 		// eslint-disable-next-line
// 	}, []);

// 	useEffect(() => {
// 		setLoading(false);
// 	}, [listings]);

// 	const handleClearFilter = useCallback(() => {
// 		setFilter(PRICE);
// 		setAvailableCurrency('NGN');
// 		setRequiredCurrency('EUR');
// 		setAmount('');
// 		setSellerRating('');
// 		setErrors({});
// 		setLoading(false);

// 		getListingsOpenForBid({
// 			pageNumber: 0,
// 			pageSize: 15,
// 			currencyNeeded: 'EUR',
// 			currencyAvailable: 'NGN',
// 			minimumExchangeAmount: 0,
// 			useCurrencyFilter: false
// 		});
// 	}, [getListingsOpenForBid]);

// 	useEffect(() => {
// 		if (hideNegotiationListings === false) {
// 			handleClearFilter();
// 		}
// 	}, [handleClearFilter, hideNegotiationListings]);

// 	const hideListingsInNegotiation = () => {
// 		setHideNegotiationListings(!hideNegotiationListings);
// 		if (!hideNegotiationListings) {
// 			dispatch({ type: HIDE_NEGOTIATION_LISTINGS });
// 		}
// 	};

// 	const onSubmit = (e) => {
// 		e.preventDefault();
// 		setErrors({});

// 		if (filter === RATING) {
// 			if (isEmpty(SellerRating)) {
// 				return setErrors({ msg: 'Invalid Filter', SellerRating: 'Seller rating is required!' });
// 			}

// 			setErrors({});
// 			setLoading(true);
// 			getListingsOpenForBid({
// 				pageNumber: 1,
// 				pageSize: 15,
// 				currencyAvailable: 'NGN',
// 				currencyNeeded: 'EUR',
// 				amount: Number(Amount),
// 				useCurrencyFilter: false,
// 				useRatingFilter: true,
// 				sellerRating: parseInt(SellerRating)
// 			});
// 		} else {
// 			// Get rating by star
// 			const priceFilter = {
// 				AvailableCurrency: 'NGN',
// 				RequiredCurrency: 'EUR',
// 				Amount
// 			};
// 			const { errors, isValid } = validatePriceFilter(priceFilter);

// 			if (!isValid) {
// 				return setErrors({ msg: 'Invalid Filter', ...errors });
// 			}

// 			setErrors({});
// 			setLoading(true);
// 			getListingsOpenForBid({
// 				pageNumber: 1,
// 				pageSize: 15,
// 				currencyAvailable: 'NGN',
// 				currencyNeeded: 'EUR',
// 				amount: Number(Amount),
// 				useCurrencyFilter: true,
// 				useRatingFilter: false,
// 				sellerRating: 0
// 			});
// 		}
// 	};

// 	return (
// 		<section className={classes.filter}>
// 			<div className={classes.filterContainer}>
// 				<Box component="header">
// 					<Typography variant="subtitle2" component="span">Filter</Typography>
// 					<Typography 
// 						className={classes.clear}
// 						variant="subtitle2" 
// 						component="span" 
// 						color="primary"
// 						onClick={handleClearFilter}
// 						>
// 							Clear
// 					</Typography>
// 				</Box>
// 				<Box component="div" className={classes.filterButtonContainer}>
// 					<Button 
// 							className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === RATING } )} 
// 							variant="contained" 
// 							color="primary" 
// 							size="small"
// 							onClick={() => setFilter(PRICE)}
// 						>
// 							Amount
// 						</Button>
// 						<Button 
// 							className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === PRICE } )} 
// 							variant="contained" 
// 							color="primary" 
// 							size="small"
// 							disabled
// 						>
// 							Completion Rate
// 					</Button>
// 				</Box>
// 				<form onSubmit={onSubmit} noValidate>
// 					{
// 						filter === PRICE
// 						?
// 						<Grid container direction="row" spacing={2}>
// 							<Grid item xs={12}>
// 								<Typography variant="subtitle2" className={classes.label}>Exchange Amount</Typography>
// 								<TextField 
// 									value="NGN"
// 									// onChange={(e) => setAmount(e.target.value)}
// 									type="text"
// 									variant="outlined" 
// 									// placeholder="Enter Amount"
// 									helperText={errors.AvailableCurrency}
// 									fullWidth
// 									required
// 									error={errors.AvailableCurrency ? true : false}
// 									disabled
// 								/>
// 								{/* <FormControl 
// 									variant="outlined" 
// 									error={errors.AvailableCurrency ? true : false } 
// 									fullWidth 
// 									required
// 									disabled
// 									// disabled={loading ? true : false}
// 								>
// 									<Select
// 										labelId="AvailableCurrency"
// 										value={AvailableCurrency}
// 										// onChange={(e) => setAvailableCurrency(e.target.value)}
									
// 									>
// 										<MenuItem value="">Select Currency</MenuItem>
// 										{currencies.length > 0 && currencies.map((currency, index) => (
// 											<MenuItem key={index} value={currency.value} disabled={currency.value === 'EUR'}>{currency.value}</MenuItem>
// 										))}
// 									</Select>
// 									<FormHelperText>{errors.AvailableCurrency}</FormHelperText>
// 								</FormControl> */}
// 							</Grid>
// 							<Grid item xs={5}>
// 								<Typography variant="subtitle2" className={classes.label}>Expected Amount</Typography>
// 								<TextField 
// 									value="EUR"
// 									// onChange={(e) => setAmount(e.target.value)}
// 									type="text"
// 									variant="outlined" 
// 									placeholder="Enter Amount"
// 									helperText={errors.RequiredCurrency}
// 									fullWidth
// 									required
// 									error={errors.RequiredCurrency ? true : false}
// 									disabled
// 								/>
// 								{/* <FormControl 
// 									variant="outlined" 
// 									error={errors.RequiredCurrency ? true : false } 
// 									fullWidth 
// 									required
// 									disabled
// 									// disabled={loading ? true : false}
// 								>
// 									<Select
// 										labelId="RequiredCurrency"
// 										value={RequiredCurrency}
// 										// onChange={(e) => setRequiredCurrency(e.target.value)}
// 									>
// 										<MenuItem value="" disabled>Select</MenuItem>
// 										<MenuItem value="" disabled>Select</MenuItem>
// 										{currencies.length > 0 && currencies.map((currency, index) => (
// 											<MenuItem key={index} value={currency.value} disabled={currency.value === 'NGN'}>{currency.value}</MenuItem>
// 										))}
// 									</Select>
// 									<FormHelperText>{errors.RequiredCurrency}</FormHelperText>
// 								</FormControl> */}
// 							</Grid>
// 							<Grid item xs={7}>
// 								<TextField 
// 									value={Amount}
// 									onChange={(e) => setAmount(e.target.value)}
// 									type="text"
// 									variant="outlined" 
// 									placeholder="Enter Amount"
// 									helperText={errors.Amount}
// 									fullWidth
// 									required
// 									error={errors.Amount ? true : false}
// 									disabled={loading ? true : false}
// 									style={{ marginTop: theme.spacing(2.2) }}
// 								/>
// 							</Grid>
// 							<Grid item xs={12}>
// 								<Button 
// 									type="submit" 
// 									variant="contained" 
// 									color="primary"
// 									fullWidth
// 									disabled={loading ? true : false}
// 								>
// 									{!loading ? 'Filter Result' : <CircularProgress style={{ color: '#f8f8f8' }} />}
// 								</Button>
// 							</Grid>
// 							<Grid item xs={12}>
// 								<FormControlLabel
// 									style={{ color: theme.palette.primary.main }}
// 									control={
// 										<Checkbox
// 											checked={hideNegotiationListings}
// 											onChange={hideListingsInNegotiation}
// 											color="primary"
// 										/>
// 									}
// 									label="Hide Unavailable Listings"
// 								/>
// 							</Grid>
// 						</Grid>
// 						:
// 						<Grid container direction="row" spacing={2}>
// 							<Grid item xs={12}>
// 								<Rating 
// 									color="primary" 
// 									name="seller-rating"  
// 									style={{ color: theme.palette.primary.main }}
// 									value={SellerRating}
// 									onChange={(e) => setSellerRating(e.target.value)}
// 									disabled={loading ? true : false}
// 								/>
// 								{/* <Typography variant="subtitle2">Number of Stars</Typography> */}
// 									{/* <FormControl 
// 										variant="outlined" 
// 										error={errors.SellerRating ? true : false } 
// 										fullWidth 
// 										required
// 										disabled={loading ? true : false}
// 									>
// 										<Select
// 											labelId="SellerRating"
// 											value={SellerRating}
// 											onChange={(e) => setSellerRating(e.target.value)}
										
// 										>
// 											<MenuItem value="">Select Number of Stars</MenuItem>
// 											<MenuItem value="1">1</MenuItem>
// 											<MenuItem value="2">2</MenuItem>
// 											<MenuItem value="3">3</MenuItem>
// 											<MenuItem value="4">4</MenuItem>
// 											<MenuItem value="5">5</MenuItem>
// 										</Select>
// 										<FormHelperText>{errors.SellerRating}</FormHelperText>
// 									</FormControl> */}
// 							</Grid>
// 							<Grid item xs={12}>
// 								<Button 
// 									type="submit" 
// 									variant="contained" 
// 									color="primary"
// 									fullWidth
// 									disabled={loading ? true : false}
// 								>
// 									{!loading ? 'Filter Result' : <CircularProgress style={{ color: '#f8f8f8' }} />}
// 								</Button>
// 							</Grid>
// 							<Grid item xs={12}>
// 								<FormControlLabel
// 									style={{ color: theme.palette.primary.main }}
// 									control={
// 										<Checkbox
// 											checked={hideNegotiationListings}
// 											onChange={hideListingsInNegotiation}
// 											color="primary"
// 										/>
// 									}
// 									label="Hide Unavailable Listings"
// 								/>
// 							</Grid>
// 						</Grid>
// 					}
// 				</form>
// 				{/* <Link 
// 					to="#!" 
// 					component={RouterLink}
// 					className={classes.buyerPopup}
// 				>
// 					Buyer Account Details Popup
// 				</Link> */}
// 			</div>
// 		</section>
// 	);
// });

// Filter.propTypes = {
// 	getCurrencies: PropTypes.func.isRequired,
// 	getListingsOpenForBid: PropTypes.func.isRequired
// };

AllListings.propTypes = {
	getAccounts: PropTypes.func.isRequired,
	getCustomerInformation: PropTypes.func.isRequired,
	getCustomerStats: PropTypes.func.isRequired,
	getIdVerificationLink: PropTypes.func.isRequired,
	getListingsOpenForBid: PropTypes.func.isRequired,
	getMoreListings: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	handleSetTitle:PropTypes.func.isRequired
};

export default connect(undefined, { getAccounts, getIdVerificationLink, getCustomerInformation, getCustomerStats, getListingsOpenForBid, getMoreListings, getNotifications })(AllListings);