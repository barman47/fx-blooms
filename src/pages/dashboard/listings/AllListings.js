import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
	Button,
	Fab,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel, 
	Link, 
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FilterOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';

import FilterListingModal from './FilterListingModal';
import Listing from './Listing';

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
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
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

	buyerPopup: {
		display: 'inline-block',
		marginTop: theme.spacing(2),
		textAlign: 'center',
		width: '100%'
	}
}));

const AllListings = () => {
	const classes = useStyles();

	const [open, setOpen] = useState(false);

	const handleOpenModal = () => {
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
	};

	return (
		<section className={classes.root}>
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
							<Link to="#!" component={RouterLink}>Hide listings in negotiation</Link>
						</div>
					</header>
					<section className={classes.listingContainer}>
						<Listing />
						<Listing negotiation by />
						<Listing buttonText="Edit" />
						<Listing />
						<Listing negotiation by />
						<Listing buttonText="Edit" />
						<Listing />
						<Listing negotiation by />
						<Listing buttonText="Edit" />
					</section>
				</Grid>
				<Filter />
			</Grid>
		</section>
	);
}

const Filter = () => {
	const classes = useStyles();

	const [ExchangeAmount, setExchangeAmount] = useState('');
	const [availableCurrency, setAvailableCurrency] = useState('');
	// eslint-disable-next-line
	const [requiredCurrency, setRequiredCurrency] = useState('');
	// eslint-disable-next-line
	const [errors, setErrors] = useState({});

	const handleClearFilter = () => {
		setExchangeAmount('');
		setAvailableCurrency('');
		setRequiredCurrency('');
	};

	return (
		<Grid item lg={3} className={classes.filterContainer}>
			<form>
				<header>
					<Typography variant="h6">Filter</Typography>
					<Typography 
						variant="subtitle2" 
						component="span" 
						color="primary"
						onClick={handleClearFilter}
						>
							Clear
					</Typography>
				</header>
				<Grid container direction="row" spacing={2}>
					<Grid item xs={12}>
						<Typography variant="subtitle2">I Have</Typography>
							<FormControl 
								variant="outlined" 
								error={errors.availableCurrency ? true : false } 
								fullWidth 
								required
							>
								<InputLabel 
									id="availableCurrency" 
									variant="outlined" 
									error={errors.availableCurrency ? true : false}
								>
									Select Currency
								</InputLabel>
								<Select
									labelId="availableCurrency"
									value={availableCurrency}
									onChange={(e) => setAvailableCurrency(e.target.value)}
								
								>
									<MenuItem value="">Select Currency</MenuItem>
								</Select>
								<FormHelperText>{errors.availableCurrency}</FormHelperText>
							</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">I Want</Typography>
							<FormControl 
								variant="outlined" 
								error={errors.availableCurrency ? true : false } 
								fullWidth 
								required
							>
								<InputLabel 
									id="availableCurrency" 
									variant="outlined" 
									error={errors.availableCurrency ? true : false}
								>
									Select Currency
								</InputLabel>
								<Select
									labelId="availableCurrency"
									value={availableCurrency}
									onChange={(e) => setAvailableCurrency(e.target.value)}
								
								>
									<MenuItem value="">Select Currency</MenuItem>
								</Select>
								<FormHelperText>{errors.availableCurrency}</FormHelperText>
							</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Min. Exchange Amount</Typography>
					</Grid>
					<Grid item xs={12}>
							<FormControl 
								variant="outlined" 
								error={errors.availableCurrency ? true : false } 
								fullWidth 
								required
							>
								<InputLabel 
									id="availableCurrency" 
									variant="outlined" 
									error={errors.availableCurrency ? true : false}
								>
									&#163;(GBP)
								</InputLabel>
								<Select
									labelId="availableCurrency"
									value={availableCurrency}
									onChange={(e) => setAvailableCurrency(e.target.value)}
								
								>
									<MenuItem value="">&#163;(GBP)</MenuItem>
								</Select>
								<FormHelperText>{errors.availableCurrency}</FormHelperText>
							</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							value={ExchangeAmount}
							onChange={(e) => setAvailableCurrency(e.target.value)}
							type="text"
							variant="outlined" 
							placeholder="Enter Amount"
							label="Amount" 
							helperText={errors.ExchangeAmount}
							fullWidth
							required
							error={errors.ExchangeAmount ? true : false}
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
};

export default AllListings;
