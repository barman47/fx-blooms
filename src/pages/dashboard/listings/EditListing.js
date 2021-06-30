import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    Button,
    Fab,
    Divider,
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
import EditListingItem from './EditListingItem';

import { SET_LISTING } from '../../../actions/types';
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
            }
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
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius
    },

    noListing: {
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

const EditListing = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { listing } = useSelector(state => state.listings);

    const [open, setOpen] = useState(false);
    const [openAccountModal, setOpenAccountModal] = useState(false);

    const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [ExchangeCurrency, setExchangeCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    const [ListingFee, setListingFee] = useState('');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            dispatch({
                type: SET_LISTING,
                payload: {}
            });
        };
        // eslint-disable-next-line
    }, []);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    return (
        <section className={classes.root}>
			<AddListingModal edit={true} open={open} handleCloseModal={handleCloseModal} />
            <header>
                <div>
                    <Typography variant="h6">Edit Listing</Typography>
                    <Typography variant="subtitle1" component="span">Modify your current listing</Typography>
                </div>
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
                                        value={MinExchangeAmount}
                                        onChange={(e) => setMinExchangeAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        label="Enter Amount" 
                                        helperText={errors.MinExchangeAmount}
                                        fullWidth
                                        required
                                        error={errors.MinExchangeAmount ? true : false}
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
                    <Typography variant="h6">Previous Listings</Typography>
                    <br />
                    <Divider />
                    <br />
                    <div>
                        <EditListingItem listing={listing} handleOpenModal={handleOpenModal} />
                    </div>
                </Grid>
            </Grid>
        </section>
    );
};

export default EditListing;