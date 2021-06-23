import { useState } from 'react';

import { 
    Button,
    Fab,
    FormControl, 
    FormHelperText,
    Grid, 
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Plus } from 'mdi-material-ui';

import AddListingModal from './AddListingModal';
import SellerAccountModal from './SellerAccountModal';
import Listing from './Listing';

import { COLORS } from '../../../utils/constants';

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

const MakeListing = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [openAccountModal, setOpenAccountModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [ExchangeCurrency, setExchangeCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinimumExchangeAmount, setMinimumExchangeAmount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    const [ListingFee, setListingFee] = useState('');

    const [errors, setErrors] = useState({});

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
			<AddListingModal open={open} handleCloseModal={handleCloseModal} />
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
                    <form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>I Have</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.AvailableCurrency ? true : false } 
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
                                        error={errors.ExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>Exchange Rate</Typography>
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.ExchangeCurrency ? true : false } 
                                    fullWidth 
                                    required
                                >
                                    <InputLabel 
                                        id="ExchangeCurrency" 
                                        variant="outlined" 
                                        error={errors.ExchangeCurrency ? true : false}
                                    >
                                        &#8358;(NGN)
                                    </InputLabel>
                                    <Select
                                        labelId="ExchangeCurrency"
                                        value={ExchangeCurrency}
                                        onChange={(e) => setAvailableCurrency(e.target.value)}
                                    
                                    >
                                        <MenuItem value="">Select Currency</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.ExchangeCurrency}</FormHelperText>
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
                                    </Select>
                                    <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <br />
                                <Tooltip title="This is the minimum amount you wish to change." aria-label="Exchange Amount" arrow>
                                    <TextField
                                        value={MinimumExchangeAmount}
                                        onChange={(e) => setMinimumExchangeAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        label="Enter Amount" 
                                        helperText={errors.MinimumExchangeAmount}
                                        fullWidth
                                        required
                                        error={errors.MinimumExchangeAmount ? true : false}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span" className={classes.helperText}>I Will Receive</Typography>
                                <Tooltip title="This is the amount you will receive in your bank account." aria-label="Amount to Receive" arrow>
                                    <TextField
                                        value={ReceiptAmount}
                                        // onChange={(e) => setExchangeAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        // label="Enter Amount" 
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
                                    // onChange={(e) => setExchangeAmount(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Amount"
                                    // label="Enter Amount" 
                                    helperText={errors.ListingFee}
                                    fullWidth
                                    required
                                    error={errors.ListingFee ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                <Grid item xs={12} md={12} lg={8} className={classes.listings}>
                    {/* <section className={classes.noListing}>
                        <Typography variant="h6">Previous Listings</Typography>
                        <Divider />
                        <div className={classes.noListingContent}>
                            <FormatListText className={classes.noListingIcon} />
                            <Typography className={classes.noListingText} variant="subtitle2" component="span">Your previous listings would appear here</Typography>
                        </div>
                    </section> */}
                    <div>
                        <Listing negotiation by />
                        <Listing buttonText="Edit" />
                        <Listing />
                        <Listing negotiation by />
                        <Listing buttonText="Edit" />
                        <Listing />
                        <Listing negotiation by />
                        <Listing buttonText="Edit" />
                    </div>
                </Grid>
            </Grid>
        </section>
    );
};

export default MakeListing;