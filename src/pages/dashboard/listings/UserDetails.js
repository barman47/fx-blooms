import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Divider, Grid, TextField, Typography, useMediaQuery } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { getSeller, reportSeller } from '../../../actions/customer';
import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';
import { SET_CUSTOMER, SET_CUSTOMER_MSG } from '../../../actions/types';

import SuccessModal from '../../../components/common/SuccessModal';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingTop: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            paddingRight: theme.spacing(4)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    content: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(5),

        '& h6': {
            color: theme.palette.primary.main,
            marginLeft: theme.spacing(4),
            marginTop: theme.spacing(2)
        }
    },

    detail: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        rowGap: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        marginBottom: theme.spacing(3)
    },

    title: {
        fontWeight: 300
    },

    text: {
        fontWeight: 500
    },

    reportContainer: {
        marginTop: theme.spacing(5),

        '& h5': {
            marginBottom: theme.spacing(2)
        }
    },

    rating: {
        color: theme.palette.primary.main
    }
}));

const UserDetails = (props) => {
    const classes = useStyles();
    const location = useLocation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const { customer } = useSelector(state => state);
    const seller = useSelector(state => state.customers.customer);

    const [Message, setMessage] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const successModal = useRef();

    useEffect(() => {
        setSellerId(location.state.sellerId);
        if (isEmpty(seller)) {
            props.getSeller(location.state.sellerId);
        }
        return () => {
            dispatch({
                type: SET_CUSTOMER,
                payload: {}
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (customer.msg) {
            setMessage('');
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(customer.msg);
        }
    }, [customer.msg, dispatch]);

    const dismissAction = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (isEmpty(Message)) {
            return setErrors({ Message: 'Message is required!' });
        }

        setErrors({});
        setLoading(true);
        props.reportSeller({ sellerId, message:  Message });
    };

    return (
        <>
            <Helmet><title>User Details | FXBLOOMS.com</title></Helmet>
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <section className={classes.root}>
                <Typography variant="h5">User Details</Typography>
                <Grid container direction="column">
                    <Grid item xs={12} lg={7} className={classes.content}>
                        <Typography variant="h6">Personal Details</Typography>
                        <br /><Divider /><br />
                        <div className={classes.detail}>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Username</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Phone Number</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>{seller?.userName}</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>{seller?.phoneNumber}</Typography>
                        </div>
                        <div className={classes.detail}>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Successful Transactions</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Listings</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>{seller?.successfulTransactions}</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>{seller?.listings}</Typography>
                        </div>
                        <div className={classes.detail}>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Last Login</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.title}>Rating</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>{seller?.lastLogin}</Typography>
                            <Rating name=""seller-rating  value={seller?.rating || 0} precision={0.5} readOnly className={classes.rating} />
                        </div>
                    </Grid>
                    {sellerId !== customer.customerId &&
                        <Grid item xs={12} lg={7} className={classes.reportContainer}>
                            <Typography variant="h5">Report this User</Typography>
                            <form onSubmit={onSubmit} noValidate>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs={12} xl={9}>
                                        <TextField 
                                            className={classes.input}
                                            value={Message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            type="text"
                                            variant="outlined"
                                            placeholder="Enter Message"
                                            helperText={errors.Message}
                                            fullWidth
                                            multiline
                                            rows={matches ? 4 : 1}
                                            required
                                            error={errors.Message ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} xl={3}>
                                        <Button 
                                            className={classes.button}
                                            variant="contained" 
                                            color="primary"
                                            type="submit"
                                            fullWidth
                                            disabled={loading ? true : false}
                                        >
                                            {!loading ? 'Report' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    }
                </Grid>
            </section>
        </>
    );
};

UserDetails.propTypes = {
    getSeller: PropTypes.func.isRequired,
    reportSeller: PropTypes.func.isRequired
};

export default connect(undefined, { getSeller, reportSeller })(UserDetails);
