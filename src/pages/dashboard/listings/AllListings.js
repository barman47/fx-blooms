import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { 
	Button,
	CircularProgress,
	Fab,
	FormControl,
	FormHelperText,
	Grid,
	Link,
	MenuItem,
	Select,
	Paper,
	TextField,
	Tooltip,
	Typography,
	// useMediaQuery 
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FilterOutline } from 'mdi-material-ui';
import _ from 'lodash';

import isEmpty from '../../../utils/isEmpty';
import { getNotifications } from '../../../actions/notifications';
import { getCustomerInformation, getIdVerificationLink, getCustomerStats } from '../../../actions/customer';
import { getCurrencies } from '../../../actions/currencies';
import { getAccounts } from '../../../actions/bankAccounts';
import { SET_LOADING_LISTINGS } from '../../../actions/types';
import { getListingsOpenForBid, getMoreListings } from '../../../actions/listings';
import { COLORS, CUSTOMER_CATEGORY, ID_STATUS } from '../../../utils/constants';
import validatePriceFilter from '../../../utils/validation/listing/priceFilter';

import FilterListingModal from './FilterListingModal';
import Listings from './Listings';
import RiskNoticeModal from './RiskNoticeModal';
import WalletInfoModal from '../wallet/WalletInfoModal';
import FundWalletDrawer from '../wallet/FundWalletDrawer';
import WalletWithdrawalDrawer from '../wallet/WalletWithdrawalDrawer';
import Wallet from '../wallet/Wallet';
// import RiskNoticeModal from './RiskNoticeModal';

import img from '../../../assets/img/decentralized.svg';
import { ABOUT_US } from '../../../routes';
import ListingsSkeleton from './ListingsSkeleton';

const useStyles = makeStyles(theme => ({
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

	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: theme.spacing(10),
		padding: theme.spacing(0, 5),

		[theme.breakpoints.down('md')]: {
			display: 'grid',
			gridTemplateColumns: '1fr',
			paddingLeft: theme.spacing(5),
			paddingRight: theme.spacing(5)
		},

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2)
		},

		'& div:first-child': {
			'& p:last-child': {
				marginTop: theme.spacing(2),
				color: COLORS.grey
			}
		}
	},

	walletsContainer: {
		borderRadius: theme.shape.borderRadius,
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
		marginTop: theme.spacing(5),

		[theme.breakpoints.down('md')]: {
			display: 'none'
		}
	},

	wallets: {
		backgroundColor: COLORS.lightTeal,
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		padding: theme.spacing(5),
		gap: theme.spacing(5),
	},

	walletToggle: {
		alignSelf: 'flex-end',
		color: theme.palette.primary.main,

		[theme.breakpoints.down('md')]: {
			display: 'none'
		},

		'&:hover': {
			backgroundColor: 'transparent'
		}
	},

	gateway: {
		background: 'linear-gradient(238.08deg, #25AEAE -0.48%, #1E6262 99.63%)',
		boxShadow: '1px 14px 30px -16px rgba(30, 98, 98, 1)',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 'initial',
        padding: [[theme.spacing(5), 0, 0, theme.spacing(2)]],

		'& div:first-child': {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',

			'& h5': {
				color: COLORS.offWhite,
				fontWeight: 600
			},

			'& p': {
				color: COLORS.offWhite,
				marginBottom: theme.spacing(3)
			},
		},

		'& img': {
			width: '35%',
			alignSelf: 'flex-end'
		}
	},
	
	listings: {
		height: '100vh',
		overflow: 'auto',
		display: 'grid',
		gridTemplateColumns: '3fr 1fr',
		gap: theme.spacing(2.5),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),

		[theme.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr'
		},
		
		'& p': {
			color: theme.palette.primary.main,
			fontWeight: 600,
			marginBottom: theme.spacing(2.5)
		},

		[theme.breakpoints.down('sm')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
		}
	},

	listingContainer: {
		marginTop: theme.spacing(5)
	},

	filter: {
		marginTop: theme.spacing(4),

		'& header': {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: theme.spacing(3),
			paddingTop: theme.spacing(1),

			[theme.breakpoints.down('md')]: {
				display: 'none'
			}
		}
	},

	filterContainer: {
		backgroundColor: COLORS.lightTeal,
		borderRadius: theme.shape.borderRadius,
		padding: [[theme.spacing(4), theme.spacing(2)]],
		height: 'initial',
		alignSelf: 'flex-start',
		position: 'sticky',

		[theme.breakpoints.down('md')]: {
			display: 'none'
		},

		'& header': {
			display: 'grid',
			gridTemplateColumns: '1.2fr 2fr',
			alignItems: 'center',
			columnGap: theme.spacing(1),
			marginBottom: theme.spacing(4),
			padding: 0,
		},

		'& form': {
			'& header': {
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				columnGap: theme.spacing(1),
				rowGap: theme.spacing(2),
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
	const dispatch = useDispatch();

	const { customerId, firstName, userName, profile, isAuthenticated } = useSelector(state => state.customer);
	const { listings, currentPageNumber, hasNext } = useSelector(state => state.listings);
	const listingsLoading = useSelector(state => state.listings.loading);
	const { accounts } = useSelector(state => state.bankAccounts);
	const { idStatus } = useSelector(state => state.customer.stats);
	const { unreadNotifications } = useSelector(state => state.notifications);

	const { getAccounts, getCustomerInformation, getCustomerStats, getIdVerificationLink, getListingsOpenForBid, getMoreListings, getNotifications, handleSetTitle } = props;

	const [dataLength, setDataLength] = useState(0);
	// const [hideNegotiationListings, setHideNegotiationListings] = useState(false);
	const [open, setOpen] = useState(false);
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

	const toggleFilterModal = () => setOpen(!open);

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

	useEffect(() => {
		if (idStatus === REJECTED || idStatus === NOT_SUBMITTED) {
            getIdVerificationLink();
        }
	}, [getIdVerificationLink, idStatus, NOT_SUBMITTED, REJECTED]);

	useEffect(() => {
		setDataLength(listings.length);
	}, [dispatch, listings]);

	const getListings = () => {
		// setHideNegotiationListings(false);
		getListingsOpenForBid({
			pageNumber: 1,
			pageSize: 10,
			currencyNeeded: 'NGN',
			currencyAvailable: 'EUR',
			minimumExchangeAmount: 0,
			useCurrencyFilter: false
		});
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

	const handleOpenModal = () => {
		setOpen(true);
	};

	return (
		<>
			<RiskNoticeModal />
			<FilterListingModal open={open} toggleModal={toggleFilterModal} />
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
			{fundDrawerOpen && <FundWalletDrawer toggleDrawer={toggleFundDrawer} drawerOpen={fundDrawerOpen} />}
            {withdrawalDrawerOpen && <WalletWithdrawalDrawer toggleDrawer={toggleWithdrawalDrawer} drawerOpen={withdrawalDrawerOpen} />}
            <WalletInfoModal ref={walletInfoModal} />
			<section className={classes.header}>
				<div>
					<Typography variant="body1" component="p">Hello, <strong>{firstName ? firstName : userName}</strong></Typography> 
					<Typography variant="body1" component="p">What would you like to do today?</Typography> 
				</div>
				{/* <Button
					variant="text"
					size="small"
					startIcon={showWallets ? <ChevronDown /> : <ChevronRight />}
					classes={{
						root: classes.walletToggle
					}}
					onClick={() => setShowWallets(!showWallets)}
				>
					{showWallets ? 'Hide Wallets' : 'Show Wallets'}
				</Button> */}
			</section>
			{showWallets && 
				<section className={classes.walletsContainer}>
					<section className={classes.wallets}>
						<Wallet 
							id="dsdsds"
							type="EUR"
							balance={1000}
							toggleWalletWithdrawal={toggleWithdrawalDrawer}
							toggleWalletFund={toggleFundDrawer}
							showWalletInfoModal={() => walletInfoModal.current.openModal()}
						/>
						<Wallet 
							id="dsdsds"
							type="NGN"
							balance={1000}
							toggleWalletWithdrawal={toggleWithdrawalDrawer}
							toggleWalletFund={toggleFundDrawer}
							showWalletInfoModal={() => walletInfoModal.current.openModal()}
						/>
						<Paper className={classes.gateway}>
							<div>
								<Typography variant="h5">Your Gateway<br />into Decentralized<br />Money Exchange</Typography>
								<Link to={ABOUT_US} component="a" target="_blank">Learn More</Link>
							</div>
							<img src={img} alt="decentralized money exchange" />
						</Paper>
					</section>
				</section>
			}
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
					<Typography variant="body1" component="p">All Listings</Typography>
					{listingsLoading === true ?
						<ListingsSkeleton />
						:
						<Listings />
					}
					
				</InfiniteScroll>
				<Filter />
			</section>
		</>
	);
}

const Filter = connect(undefined, { getCurrencies, getListingsOpenForBid })((props) => {
	const PRICE = 'PRICE';
	const RATING = 'RATING';
	const classes = useStyles();
	const theme = useTheme();
	const { currencies, listings } = useSelector(state => state);

	const [AvailableCurrency, setAvailableCurrency] = useState('NGN');
	const [RequiredCurrency, setRequiredCurrency] = useState('EUR');
	const [Amount, setAmount] = useState('');

	const [SellerRating, setSellerRating] = useState(0);
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
		setAmount('');
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
			props.getListingsOpenForBid({
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
		<section className={classes.filter}>
			<header>
				<Typography variant="subtitle2" component="span">Filter</Typography>
				<Typography 
					className={classes.clear}
					variant="subtitle2" 
					component="span" 
					color="primary"
					onClick={handleClearFilter}
					>
						Clear
				</Typography>
			</header>
			<div className={classes.filterContainer}>
				<header>
					<Button 
							className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === RATING } )} 
							variant="contained" 
							color="primary" 
							size="small"
							onClick={() => setFilter(PRICE)}
						>
							Amount
						</Button>
						{/* <Button 
							className={clsx(classes.filterButton, { [`${classes.disabledButton}`]: filter === PRICE } )} 
							variant="contained" 
							color="primary" 
							size="small"
						>
							Completion Rate
					</Button> */}
				</header>
				<form onSubmit={onSubmit} noValidate>
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
									disabled
									// disabled={loading ? true : false}
								>
									<Select
										labelId="AvailableCurrency"
										value={AvailableCurrency}
										// onChange={(e) => setAvailableCurrency(e.target.value)}
									
									>
										<MenuItem value="">Select Currency</MenuItem>
										{currencies.length > 0 && currencies.map((currency, index) => (
											<MenuItem key={index} value={currency.value} disabled={currency.value === 'EUR'}>{currency.value}</MenuItem>
										))}
									</Select>
									<FormHelperText>{errors.AvailableCurrency}</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle2">I Want</Typography>
							</Grid>
							<Grid item xs={5}>
								<FormControl 
									variant="outlined" 
									error={errors.RequiredCurrency ? true : false } 
									fullWidth 
									required
									disabled
									// disabled={loading ? true : false}
								>
									<Select
										labelId="RequiredCurrency"
										value={RequiredCurrency}
										// onChange={(e) => setRequiredCurrency(e.target.value)}
									>
										<MenuItem value="" disabled>Select</MenuItem>
										<MenuItem value="" disabled>Select</MenuItem>
										{currencies.length > 0 && currencies.map((currency, index) => (
											<MenuItem key={index} value={currency.value} disabled={currency.value === 'NGN'}>{currency.value}</MenuItem>
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
								{/* <Typography variant="subtitle2">Number of Stars</Typography> */}
									{/* <FormControl 
										variant="outlined" 
										error={errors.SellerRating ? true : false } 
										fullWidth 
										required
										disabled={loading ? true : false}
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
									</FormControl> */}
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
				{/* <Link 
					to="#!" 
					component={RouterLink}
					className={classes.buyerPopup}
				>
					Buyer Account Details Popup
				</Link> */}
			</div>
		</section>
	);
});

Filter.propTypes = {
	getCurrencies: PropTypes.func.isRequired,
	getListingsOpenForBid: PropTypes.func.isRequired
};

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