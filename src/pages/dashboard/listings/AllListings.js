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
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { Camera, ChevronDown, ChevronRight, FilterOutline } from 'mdi-material-ui';
import { Magnify } from 'mdi-material-ui';
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
	SET_LOADING_LISTINGS,
	SET_REQUIRED_CURRENCY 
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
		// marginTop: theme.spacing(10),
		padding: theme.spacing(0, 5),

		[theme.breakpoints.down('md')]: {
			display: 'grid',
			gridTemplateColumns: '1fr',
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2),
			gap: theme.spacing(1)
		},

		[theme.breakpoints.down('sm')]: {
			marginBottom: '0',
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2)
		}
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

		[theme.breakpoints.down('md')]: {
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

	currencyButtons: {
		height: theme.spacing(4.3),
	},

	filterLabel: {
		[theme.breakpoints.down('sm')]: {
			gridColumn: '1 / span 2'
		}
	},

	searchButton: {
		paddingBottom: theme.spacing(0.7),
		paddingTop: theme.spacing(0.7)
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

	listingContainer: {
		marginTop: theme.spacing(1)
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

	const { customerId, firstName, userName, profile, isAuthenticated } = useSelector(state => state.customer);
	const { listings, currentPageNumber, hasNext, availableCurrency, requiredCurrency } = useSelector(state => state.listings);
	const listingsLoading = useSelector(state => state.listings.loading);
	const { accounts } = useSelector(state => state.bankAccounts);
	const { idStatus } = useSelector(state => state.customer.stats);
	const { unreadNotifications } = useSelector(state => state.notifications);
	const { eurActive, ngnActive, usdActive, gbpActive } = useSelector(state => state.wallets);

	const { getAccounts, getCustomerInformation, getCustomerStats, getIdVerificationLink, getListingsOpenForBid, getMoreListings, getNotifications, handleSetTitle } = props;

	const [Amount, setAmount] = useState('');
	const [timeOfDay, setTimeOfDay] = useState('');
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
		greet();
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
				currencyNeeded: requiredCurrency,
				currencyAvailable: availableCurrency,
				minimumExchangeAmount: 0,
				useCurrencyFilter: true,
				useRatingFilter: false
			});
		}
	}, [Amount, dispatch, getListingsOpenForBid, availableCurrency, requiredCurrency]);

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
			currencyNeeded: requiredCurrency,
			currencyAvailable: availableCurrency,
			minimumExchangeAmount: 0,
			useCurrencyFilter: true,
			useRatingFilter: false
		}, true);
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
			type: SET_LOADING_LISTINGS,
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
			type: SET_LOADING_LISTINGS,
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

	const greet = () => {
        const time = new Date();
        const hour = time.getHours();

        if (hour < 12) {
            setTimeOfDay('morning');
        } else if (hour >= 12 && hour < 16) {
            setTimeOfDay('afternoon');
        } else {
            setTimeOfDay('evening');
        }
    };

	return (
		<>
			<RiskNoticeModal />
			{fundDrawerOpen && <FundWalletDrawer toggleDrawer={toggleFundDrawer} drawerOpen={fundDrawerOpen} />}
            {withdrawalDrawerOpen && <WalletWithdrawalDrawer toggleDrawer={toggleWithdrawalDrawer} drawerOpen={withdrawalDrawerOpen} />}
            <WalletInfoModal ref={walletInfoModal} />
			<section className={classes.header}>
				<div>
					<Typography variant="body1" component="p">Good {timeOfDay}, <strong>{firstName ? firstName : userName}</strong></Typography> 
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
							<ButtonGroup disableElevation className={classes.currencyButtons}>
								<Button
									color="primary"
									size="small"
									disableRipple
									disableFocusRipple
									onClick={() => setCurrency('NGN', 'EUR')}
									variant={requiredCurrency === 'EUR' ? 'contained' : 'outlined'}
									// disabled={requiredCurrency === 'NGN'}
								>
									BUY EUR
								</Button>
								<Button
									color="primary"
									size="small"
									disableRipple
									disableFocusRipple
									onClick={() => setCurrency('EUR', 'NGN')}
									variant={requiredCurrency === 'NGN' ? 'contained' : 'outlined'}
									// disabled={requiredCurrency === 'EUR'}
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
									placeholder={matches ? `${requiredCurrency} Amount` : 'Enter Amount'}
									helperText={errors.Amount}
									fullWidth
									required
									error={errors.Amount ? true : false}
									disabled={listingsLoading ? true : false}
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
													disableRipple
													disableFocusRipple
													className={classes.searchButton}
													onClick={handleFilter}
												>
													Search
												</Button>
											}
											
										</InputAdornment>,
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
								label="Hide Unavailable Listings"
							/>
						</Box>
						{listingsLoading === true ?
							<ListingsSkeleton />
							:
							<Listings />
						}
					</InfiniteScroll>
				</section>
			</Box>
		</>
	);
}

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