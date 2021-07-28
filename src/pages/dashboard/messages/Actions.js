import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button,
    CircularProgress, 
    Divider, 
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, 
    Radio, 
    RadioGroup,
    TextField, 
    Typography 
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_LISTING } from '../../../actions/types';
import { completeTransaction } from '../../../actions/listings';
import { DASHBOARD, EDIT_LISTING } from '../../../routes';


import validateRateCustomer from '../../../utils/validation/customer/rateCustomer';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),  
        paddingRight: theme.spacing(2),  
    },

    button: {
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1.5),
        paddingTop: theme.spacing(1.5),
    },

    radio: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    }
}));

const Actions = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { listing } = useSelector(state => state.listings);
    const { customerId } = useSelector(state => state.customer);

    const [successfulTransaction, setSuccessfulTransaction] = useState('');
    const [ratingComment, setRatingComment] = useState('');
    const [sellerRating, setSellerRating] = useState(0);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const handleEditListing = () => {
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
        return history.push(`${DASHBOARD}${EDIT_LISTING}`);
    };

    const handleChange = (e) => {
        setSuccessfulTransaction(e.target.value);
    };

    const handleSetRating = (e, value) => {
        setSellerRating(value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            successfulTransaction,
            ratingComment,
            sellerRating
        };

        const { errors, isValid } = validateRateCustomer(data);

        if (isValid) {
            return setErrors(errors);
        }

        setErrors({});
        setLoading(true);
        props.completeTransaction({
            rating: Number(sellerRating),
            messagee: ratingComment,
            receivedExpectedFunds: successfulTransaction === 'yes' ? true : false
        });
    };

    return (
		<section className={classes.root}>
			<Typography variant="subtitle1" component="p">Actions</Typography>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    {listing && listing.customerId === customerId ?
                        <Button 
                            variant="outlined" 
                            color="primary"
                            fullWidth
                            className={classes.button}
                            onClick={handleEditListing}
                        >
                            Edit Listing
                        </Button>
                        :
                        <Button 
                            variant="contained" 
                            color="primary"
                            fullWidth
                        >
                            Cancel Negotiation
                        </Button>
                    }
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                {listing && listing.customerId !== customerId && 
                    <Grid item>
                        <form onSubmit={onSubmit}>
                            <Grid container direction="column" spacing={3}>
                                <Grid item>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Is this a successful transaction?</FormLabel>
                                    <RadioGroup 
                                        aria-label="successful-transaction" 
                                        name="transaction" 
                                        value={successfulTransaction} 
                                        onChange={handleChange}
                                        className={classes.radio}
                                    >
                                        <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                    </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" component="p" align="center">Rate this user</Typography>
                                </Grid>
                                <Grid item align="center">
                                    <Rating color="primary" name="seller-rating"  value={sellerRating} onChange={handleSetRating} className={classes.rating} />
                                </Grid>
                                <Grid item>
                                    <TextField 
                                        type="text"
                                        variant="outlined"
                                        value={ratingComment}
                                        onChange={(e) => setRatingComment(e.target.value)}
                                        placeholder="Enter message"
                                        multiline
                                        rows={5}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <Button 
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                }
            </Grid>
		</section>
    );
};

Actions.propTypes = {
    completeTransaction: PropTypes.func.isRequired
};

export default connect(undefined, { completeTransaction })(Actions);