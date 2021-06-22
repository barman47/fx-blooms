import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel, 
	Link, 
	MenuItem,
    Modal,
	Select,
	TextField,
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

    filterContainer: {
		backgroundColor: COLORS.lightTeal,
        borderRadius: '5px',
		padding: theme.spacing(4, 3),
        width: '80%',
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

const MobileFilterModal = ({ open, handleModalClose }) => {
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
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid item lg={3} className={classes.filterContainer}>
                    <form>
                        <header>
                            <Typography variant="h6">Filter Listings</Typography>
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
                                            &#8364;(GBP)
                                        </InputLabel>
                                        <Select
                                            labelId="availableCurrency"
                                            value={availableCurrency}
                                            onChange={(e) => setAvailableCurrency(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">&#8364;(GBP)</MenuItem>
                                        </Select>
                                        <FormHelperText>{errors.availableCurrency}</FormHelperText>
                                    </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={ExchangeAmount}
                                    onChange={(e) => {
                                        if(!isNaN(Number(e.target.value))) {
                                            console.log('not a number');
                                            setAvailableCurrency(e.target.value);
                                        }
                                    }}
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
            </Fade>
        </Modal>
	);
};

MobileFilterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired
};

export default MobileFilterModal;