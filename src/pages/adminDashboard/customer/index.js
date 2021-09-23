import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { SET_CUSTOMER, CLEAR_CUSTOMER_STATUS_MSG } from '../../../actions/types';
import { getStats } from '../../../actions/admin';
import { getCustomerStatus, setCustomerStatus } from '../../../actions/customer';
import { COLORS, CONFIRMED, PENDING, REJECTED } from '../../../utils/constants';

// import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import PersonalDetails from './PersonalDetails';
import IdentityDetails from './IdentityDetails';

const useStyles = makeStyles(theme =>({
    root: {
        padding: [[theme.spacing(2), theme.spacing(3)]],

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        },

        '& h6': {
            fontWeight: 600
        }
    },

    container: {
        marginTop: theme.spacing(1)
    },

    buttonContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: theme.spacing(1),
        marginTop: theme.spacing(2)
    },

    button: {
        padding: [[theme.spacing(2), theme.spacing(3)]]
    },

    reactivateButton: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,

        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: COLORS.offWhite
        }
    },

    deactivateButton: {
        borderColor: COLORS.red,
        color: COLORS.red,

        '&:hover': {
            backgroundColor: 'initial'
        }
    },

    removeButton: {
        color: COLORS.white,
        backgroundColor: COLORS.red,

        '&:hover': {
            backgroundColor: COLORS.red
        }
    },
}));

const Customer = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { customer, msg } = useSelector(state => state.customers);
    // const errorsState = useSelector(state => state.errors);

    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    const { getStats } = props;

    useEffect(() => {
        // if (isEmpty(customer)) {
        //     props.getCustomerStatus();
        // }

        return () => dispatch({ 
            type: SET_CUSTOMER,
            payload: {}
        });
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     if (errorsState?.msg) {
    //         setLoading(false);
    //         dispatch({
    //             type: GET_ERRORS,
    //             payload: {}
    //         });
    //     }
    // }, [dispatch, errorsState]);

    useEffect(() => {
        if (msg && customer) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [customer, dispatch, msg]);

    const dismissAction = () => {
        getStats();
        dispatch({
            type: CLEAR_CUSTOMER_STATUS_MSG
        });

        history.goBack();
    };

    const setCustomerStatus = (newStatus, currentStatus) => {
        setLoading(true);
        props.setCustomerStatus({ status: newStatus, currentStatus, customerID: customer.id });
    };

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            {loading && <Spinner />}
            <section className={classes.root}>
                <Grid container direction="row" justify="space-between" className={classes.header}>
                    <Grid item xs={12} lg={6}>
                        {customer.customerStatus === PENDING && <Typography variant="h6">User Details (NEW)</Typography>}
                        {customer.customerStatus === CONFIRMED && <Typography variant="h6">User Details (VERIFIED)</Typography>}
                        
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <div className={classes.buttonContainer}>
                        {customer.customerStatus === PENDING && 
                            <>
                                <Button 
                                    variant="outlined" 
                                    size="large" 
                                    className={clsx(classes.button, classes.deactivateButton)}
                                    onClick={() => setCustomerStatus(REJECTED, PENDING)}
                                    disabled={loading ? true : false}
                                >
                                    Decline
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    color="primary" 
                                    className={classes.button}
                                    onClick={() => setCustomerStatus(CONFIRMED, PENDING)}
                                    disabled={loading ? true : false}
                                >
                                    Approve
                                </Button>
                            </>
                        }
                        {customer.customerStatus === CONFIRMED && 
                            <>
                                <Button 
                                    variant="outlined" 
                                    size="large" 
                                    className={clsx(classes.button, classes.deactivateButton)}
                                    onClick={() => setCustomerStatus(REJECTED, CONFIRMED)}
                                    disabled={loading ? true : false}
                                >
                                    Deactivate
                                </Button>
                                {/* <Button 
                                    variant="contained" 
                                    size="large" 
                                    className={clsx(classes.button, classes.removeButton)}
                                    disabled={loading ? true : false}
                                    onClick={() => setCustomerStatus(REJECTED, CONFIRMED)}
                                >
                                    Remove
                                </Button> */}
                            </>
                        }
                        {customer.customerStatus === REJECTED && 
                            <>
                                <Button 
                                    variant="outlined" 
                                    size="large" 
                                    className={clsx(classes.button, classes.reactivateButton)}
                                    onClick={() => setCustomerStatus(CONFIRMED, REJECTED)}
                                    disabled={loading ? true : false}
                                >
                                    Reactivate
                                </Button>
                            </>
                        }
                        </div>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} className={classes.container}>
                    <Grid item xs={12} lg={6}>
                        <PersonalDetails />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <IdentityDetails />
                    </Grid>
                </Grid>
            </section>
        </>
    );
}

Customer.propTypes = {
    getCustomerStatus: PropTypes.func.isRequired,
    getStats: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired,
    setCustomerStatus: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomerStatus, getStats, setCustomerStatus })(Customer);