import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { 
	Box,
	Button,
	Checkbox,
	Zoom,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
	useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ArrowTopRight, EyeOutline, EyeOffOutline, Magnify } from 'mdi-material-ui';
import _ from 'lodash';
import clsx from 'clsx';

import { getNotifications } from '../../../actions/notifications';
import { getCustomerInformation, getCustomerStats } from '../../../actions/customer';
// import { getCurrencies } from '../../../actions/currencies';
import { getAccounts } from '../../../actions/bankAccounts';
import { getPendingTransactionCount } from '../../../actions/transactions';
import { getWallets } from '../../../actions/wallets';
import { 
	// ACTIVATE_EUR_WALLET,
	// ACTIVATE_NGN_WALLET,
	HIDE_NEGOTIATION_LISTINGS, 
	SET_WALLET,
	SET_LOADING,
	SET_REQUIRED_CURRENCY ,
	SET_BUY,
	SET_SELL
} from '../../../actions/types';
import { getListingsOpenForBid, getMoreListings, removeExpiredListings } from '../../../actions/listings';
import isEmpty from '../../../utils/isEmpty';
import formatNumber from '../../../utils/formatNumber';
import { COLORS } from '../../../utils/constants';
// import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import Listings from './Listings';
import RiskNoticeModal from './RiskNoticeModal';

// import EUFlag from '../../../assets/img/EU-flag.svg';
// import NGNFlag from '../../../assets/img/NGN-flag.svg';
import ListingsSkeleton from './ListingsSkeleton';
import MakeListing from './MakeListing';
import { FUND_WALLET } from '../../../routes';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(-2.5),
		maxWidth: '100vw',
		overflowY: 'hidden',

		[theme.breakpoints.down('md')]: {
			margin: 0,
		},

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1)
		}
	},

	walletsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: theme.spacing(4, 5, 7, 5),

		[theme.breakpoints.down('md')]: {
			margin: `${theme.spacing(5, 2)} !important`
		},

		[theme.breakpoints.down('sm')]: {
			margin: theme.spacing(2, 0)
		}
	},

	walletsContainerSpaced: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: theme.spacing(4, 5, 7, 5),

		[theme.breakpoints.down('md')]: {
			margin: `${theme.spacing(0, 2, 2, 2)} !important`
		},

		[theme.breakpoints.down('sm')]: {
			margin: `${theme.spacing(0)} !important`
		}
	},

	wallets: {
		borderRadius: theme.shape.borderRadius,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		margin: '0 auto',
		width: theme.spacing(40),

		[theme.breakpoints.down('md')]: {
			width: '100%'
		}
	},

	walletToggleContainer: {
		display: 'flex',
		flexDirection: 'row',

		[theme.breakpoints.down('md')]: {
			marginRight: 0
		},

		'& section': {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'space-between',
		},

		'& section:first-child': {
			marginRight: theme.spacing(2)
		}
	},

	walletToggleText: {
		fontWeight: 600
	},

	walletBalance: {
		'& p': {
			fontWeight: 300
		},

		'& h6': {
			fontWeight: 600
		},
	},

	topUpButton: {
		backgroundColor: COLORS.lightTeal,
		border: `1px solid ${theme.palette.primary.main}`,

		'&:hover': {
			backgroundColor: COLORS.lightTeal
		}
	},

	topUpIcon: {
		color: theme.palette.primary.main
	},

	toggleWalletButton: {
		backgroundColor: 'rgba(246, 113, 113, 0.08)',
		border: '1px solid rgb(246, 113, 113)',

		'&:hover': {
			backgroundColor: 'rgba(246, 113, 113, 0.08)'
		}
	},

	toggleIcon: {
		color: 'rgb(246, 113, 113)'
	},

	listingHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: theme.spacing(2, 5),

		[theme.breakpoints.down('md')]: {
			display: 'grid',
			gridTemplateColumns: '1fr',
			margin: theme.spacing(2),
		},

		[theme.breakpoints.down('sm')]: {
			margin: theme.spacing(1, 0)
		}
	},

	buttonContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',

		[theme.breakpoints.down('md')]: {
			display: 'grid',
			gridTemplateColumns: '0.7fr 1fr 1fr',
			rowGap: theme.spacing(0.8),
		},

		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			margin: theme.spacing(1, 0)
		}
	},

	buySellButtons: {
		backgroundColor: COLORS.lightTeal,
		borderBottomRightRadius: theme.shape.borderRadius,
		borderTopRightRadius: theme.shape.borderRadius,
		height: theme.spacing(4.3),
		padding: theme.spacing(0.8),
		marginRight: theme.spacing(2),

		[theme.breakpoints.down('sm')]: {
			marginRight: 0
		}
	},

	currencyButton: {
		borderRadius: 0,
		
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},

	activeButton: {
		borderBottom: `2px solid ${theme.palette.primary.main}`
	},

	form: {
		// Search field
		'& .MuiOutlinedInput-input': {
			paddingBottom: theme.spacing(0.9),
			paddingTop: theme.spacing(0.9)
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

	filterLabel: {
		[theme.breakpoints.down('sm')]: {
			'& .MuiTypography-body1': {
				fontSize: theme.spacing(1.8)
			}
		}
	},

	searchButton: {
		paddingBottom: theme.spacing(0.55),
		paddingTop: theme.spacing(0.55)
	},
	
	listings: {
		height: '100vh',
		overflow: 'auto',
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),

		[theme.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr',
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2)
		},

		[theme.breakpoints.down('sm')]: {
			paddingLeft: '0',
			paddingRight: '0',
		}
	},

	sell: {
		margin: theme.spacing(0, 5),

		[theme.breakpoints.down('md')]: {
			margin: theme.spacing(0, 2)
		},

		[theme.breakpoints.down('sm')]: {
			margin: 0
		}
	},

	listingContainer: {
		marginTop: theme.spacing(1),
		paddingLeft: theme.spacing(17),
		paddingRight: theme.spacing(17),

		[theme.breakpoints.down('md')]: {
			padding: 0
		}
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
	const dispatch = useDispatch();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();

	const { customerId, profile, isAuthenticated } = useSelector(state => state.customer);
	const { buy, sell, listings, currentPageNumber, hasNext, availableCurrency, requiredCurrency } = useSelector(state => state.listings);
	const { loading } = useSelector(state => state);
	const { accounts } = useSelector(state => state.bankAccounts);
	const { alertNotifications, unreadNotifications } = useSelector(state => state.notifications);
	const { wallet, wallets } = useSelector(state => state.wallets);

	const { 
		getAccounts, 
		getCustomerInformation, 
		getCustomerStats, 
		getListingsOpenForBid, 
		getMoreListings, 
		getNotifications,
		getWallets,
		handleSetTitle,
		removeExpiredListings,
		getPendingTransactionCount
	} = props;

	const [Amount, setAmount] = useState('');
	const [hideNegotiationListings, setHideNegotiationListings] = useState(false);
	const [errors, setErrors] = useState({});

	const [dataLength, setDataLength] = useState(0);
	const [showWallets, setShowWallets] = useState(true);

	let loadedEvent = useRef();

	useEffect(() => {
		getWallets(customerId);
		removeExpiredListings();
		getPendingTransactionCount();
		loadedEvent.current = getListings;
		window.addEventListener('DOMContentLoaded', loadedEvent.current);
		getCustomerStats();
		handleSetTitle('All Listings');
		if (isAuthenticated) {
			dispatch({
				type: SET_LOADING,
				payload: true
			});
			getListings();
		}

		if (_.isEmpty(profile)) {
			getCustomerInformation();
		}

		if (unreadNotifications === 0) {
            getNotifications(true);
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

	useEffect(() => {
		if (wallets.length > 0) {
			dispatch({
				type: SET_WALLET,
				payload: { currency: 'EUR' }
			});
		}
	}, [dispatch, wallets]);

	// Fetch listings when search field is empty
	useEffect(() => {
		if (isEmpty(Amount)) {
			dispatch({
				type: SET_LOADING,
				payload: true
			});
	
			getListingsOpenForBid({
				pageNumber: 0,
				pageSize: 15,
				currencyNeeded: requiredCurrency,
				currencyAvailable: availableCurrency,
				minimumExchangeAmount: 0,
				useCurrencyFilter: true,
				useRatingFilter: false
			});
		}
	}, [Amount, dispatch, getListingsOpenForBid, availableCurrency, requiredCurrency]);

	useEffect(() => {
		setDataLength(listings.length);
	}, [dispatch, listings]);

	const getListings = () => {
		getListingsOpenForBid({
			pageNumber: 1,
			pageSize: 10,
			currencyNeeded: requiredCurrency,
			currencyAvailable: availableCurrency,
			minimumExchangeAmount: 0,
			useCurrencyFilter: true,
			useRatingFilter: false
		});
	};

	const getMore = () => {
		getMoreListings({
			pageNumber: currentPageNumber + 1,
			pageSize: 10,
			currencyNeeded: requiredCurrency,
			currencyAvailable: availableCurrency,
			minimumExchangeAmount: 0,
			useCurrencyFilter: true,
			useRatingFilter: false
		});	
	};

	const handleClearFilter = useCallback(() => {
		// setAvailableCurrency('NGN');
		// setRequiredCurrency('EUR');
		setAmount('');
		setErrors({});
		// dispatch({
		// 	type: SET_REQUIRED_CURRENCY,
		// 	payload: {
		// 		availableCurrency: 'NGN',
		// 		requiredCurrency: 'EUR'
		// 	}
		// });
		dispatch({
			type: SET_LOADING,
			payload: true
		});

		getListingsOpenForBid({
			pageNumber: 0,
			pageSize: 15,
			currencyNeeded: requiredCurrency,
			currencyAvailable: availableCurrency,
			minimumExchangeAmount: 0,
			useRatingFilter: false,
			useCurrencyFilter: true
		});
	}, [dispatch, getListingsOpenForBid, availableCurrency, requiredCurrency]);

	useEffect(() => {
		if (hideNegotiationListings === false) {
			handleClearFilter();
		}
	}, [handleClearFilter, hideNegotiationListings]);

	const hideListingsInNegotiation = () => {
		setHideNegotiationListings(!hideNegotiationListings);
		if (!hideNegotiationListings) {
			dispatch({ type: HIDE_NEGOTIATION_LISTINGS });
		}
	};

	const handleFilter = (e) => {
		e.preventDefault();
		setErrors({});


		if (isEmpty(Amount)) {
			return setErrors({ msg: 'Invalid Search', Amount: 'Please enter an amount' });
		}

		setErrors({});
		dispatch({
			type: SET_LOADING,
			payload: true
		});
		getListingsOpenForBid({
			pageNumber: 1,
			pageSize: 15,
			currencyAvailable: availableCurrency,
			currencyNeeded: requiredCurrency,
			amount: Number(Amount),
			useCurrencyFilter: true,
			useRatingFilter: false,
			sellerRating: 0
		});
	};

	const setCurrency = (available, required) => {
		dispatch({
			type: SET_REQUIRED_CURRENCY,
			payload: {
				availableCurrency: available,
				requiredCurrency: required  
			}
		});
	}

	return (
		<>
			<RiskNoticeModal />
			<Box component="section" className={classes.root}>
				<Box component="section" className={alertNotifications.length > 0 ? classes.walletsContainerSpaced : classes.walletsContainer}>
				{/* <Box component="section" className={clsx(classes.walletsContainer, {[alertNotifications.length > 0]: classes.walletsContainerSpaced})}> */}
					<Zoom in={showWallets}>
						<Box component="div" className={classes.walletBalance}>
							<Typography variant="body2" component="p">Wallet Balance</Typography>
							{!isEmpty(wallet) && <Typography variant="h6">{`${wallet.currency.value} ${formatNumber(wallet.balance.available, 2)}`}</Typography>}
						</Box>
					</Zoom>
					<Box component="div" className={classes.walletToggleContainer}>
						<Box component="section">
							<IconButton 
								disableFocusRipple
								disableTouchRipple
								disableRipple
								className={classes.topUpButton}
								onClick={() => navigate(FUND_WALLET)}
								size={matches ? 'small' : 'medium'}
							>
								<ArrowTopRight className={classes.topUpIcon} />
							</IconButton>
							<Typography variant="body2" component="span" className={classes.walletToggleText}>Top Up</Typography>
						</Box>
						<Box component="section">
							<IconButton 
								disableFocusRipple
								disableTouchRipple
								disableRipple
								className={classes.toggleWalletButton}
								onClick={() => setShowWallets(!showWallets)}
								size={matches ? 'small' : 'medium'}
							>
								{showWallets ? <EyeOffOutline className={classes.toggleIcon} /> : <EyeOutline className={classes.toggleIcon} />}
							</IconButton>
							<Typography variant="body2" component="span" className={classes.walletToggleText}>{showWallets ? 'Hide Wallet' : 'Show Wallet'}</Typography>
						</Box>
					</Box>
				</Box>
				<Box className={classes.listingHeader} component={Paper}>
					<Box className={classes.buttonContainer}>
						<Box component="div" className={classes.buySellButtons}>
							<Button
								color="primary"
								size="small"
								disableRipple
								disableFocusRipple
								onClick={() => dispatch({ type: SET_BUY })}
								variant={buy ? 'contained' : 'text'}
							>
								BUY
							</Button>
							<Button
								color="secondary"
								size="small"
								disableRipple
								disableFocusRipple
								onClick={() => dispatch({ type: SET_SELL })}
								variant={sell ? 'contained' : 'text'}
							>
								SELL
							</Button>
						</Box>
						<Box component="div">
							<Button
								color="primary"
								size="small"
								disableRipple
								disableFocusRipple
								onClick={() => setCurrency('NGN', 'EUR')}
								variant="text"
								className={clsx(classes.currencyButton, { [classes.activeButton]: requiredCurrency === 'EUR'})}
							>
								EUR
							</Button>
							<Button
								color="primary"
								size="small"
								disableRipple
								disableFocusRipple
								onClick={() => setCurrency('EUR', 'NGN')}
								variant="text"
								className={clsx(classes.currencyButton, { [classes.activeButton]: requiredCurrency === 'NGN'})}
							>
								NGN
							</Button>
						</Box>
					</Box>
					{buy &&
						<>
							<form onSubmit={handleFilter} className={classes.form}>
								<TextField 
									value={Amount}
									onChange={(e) => handleSetAmount(e.target.value)}
									type="text"
									variant="outlined" 
									placeholder={matches ? 'Amount' : 'Enter Amount'}
									helperText={errors.Amount}
									fullWidth
									required
									error={errors.Amount ? true : false}
									disabled={loading ? true : false}
									InputProps={{
										startAdornment: !matches && <InputAdornment position="start" color="primary">{requiredCurrency} | </InputAdornment>,
										endAdornment: <InputAdornment position="end">
											{matches ? 
												<IconButton
													color="primary"
													// size="large"
													disableRipple
													disableFocusRipple
													className={classes.searchButton}
													onClick={handleFilter}
												>
													<Magnify />
												</IconButton>
											: 
												<Button
													variant="contained"
													color="primary"
													// size="large"
													disableElevation
													disableRipple
													disableFocusRipple
													className={classes.searchButton}
													onClick={handleFilter}
												>
													Search
												</Button>
											}
											
										</InputAdornment>
									}}
								/>
							</form>
							<FormControlLabel
								className={classes.filterLabel}
								style={{ color: theme.palette.primary.main }}
								control={
									<Checkbox
										checked={hideNegotiationListings}
										onChange={hideListingsInNegotiation}
										color="primary"
									/>
								}
								label="Hide Unavailable Offers"
							/>
						</>
					}
				</Box>
				{sell && <Box className={classes.sell}><MakeListing /></Box>}
				{buy &&
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
							{loading === true ?
								<ListingsSkeleton />
								:
								<Listings />
							}
						</InfiniteScroll>
					</section>
				}
			</Box>
		</>
	);
}

AllListings.propTypes = {
	getAccounts: PropTypes.func.isRequired,
	getCustomerInformation: PropTypes.func.isRequired,
	getCustomerStats: PropTypes.func.isRequired,
	getListingsOpenForBid: PropTypes.func.isRequired,
	getMoreListings: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	getWallets: PropTypes.func.isRequired,
	getPendingTransactionCount: PropTypes.func.isRequired,
	handleSetTitle:PropTypes.func.isRequired
};

export default connect(undefined, { 
	getAccounts, 
	getCustomerInformation, 
	getCustomerStats, 
	getListingsOpenForBid, 
	getMoreListings, 
	getNotifications,
	getWallets,
	getPendingTransactionCount,
	removeExpiredListings 
})(AllListings);