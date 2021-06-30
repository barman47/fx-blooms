import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
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
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS, SHADOW } from '../../../utils/constants';

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

const AddListingModal = ({ edit, open, handleCloseModal }) => {
	const classes = useStyles();

	const [AvailableCurrency, setAvailableCurrency] = useState('');
    const [ExchangeAmount, setExchangeAmount] = useState('');

    const [ExchangeCurrency, setExchangeCurrency] = useState('');
    const [ExchangeRate, setExchangeRate] = useState('');

    const [MinExchangeAmount, setMinExchangeAmount] = useState('');

    const [ReceiptAmount, setReceiptAmount] = useState('');
    const [ListingFee, setListingFee] = useState('');

	const [errors, setErrors] = useState({});

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
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
                    <form>
                        <Grid container direction="row" spacing={1} className={classes.formContainer}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" component="span">I Have</Typography>
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
                            <Typography variant="subtitle2" component="span"AvailableCurrency>&nbsp;</Typography>
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
                                <Typography variant="subtitle2" component="span"AvailableCurrency>Exchange Rate</Typography>
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
                                <Typography variant="subtitle2" component="span"AvailableCurrency>Min. Exchange Amount</Typography>
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
                                <Typography variant="subtitle2" component="span"AvailableCurrency>I Will Receive</Typography>
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
                            <Typography variant="subtitle2" component="span"AvailableCurrency>Listing Fee</Typography>
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
            </Fade>
        </Modal>
	);
};

AddListingModal.propTypes = {
    edit: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default AddListingModal;