import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Switch  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';

import { CLEAR_CUSTOMER_STATUS_MSG, } from '../../../actions/types';
// import { USER_DETAILS } from '../../../utils/constants';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import PersonalDetails from './PersonalDetails';
import IdentityDetails from './IdentityDetails';
import AuthenticationDetails from './AuthenticationDetails';
import TransactionDetails from './TransactionDetails';

const useStyles = makeStyles(theme =>({
    root: {
        padding: [[theme.spacing(2), theme.spacing(3)]],
        backgroundColor: '#F8F9FA',

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        },

        '& h6': {
            fontWeight: 600
        }
    },

    header: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',

        '& + span': {
            marginTop: 8
        }
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.27fr',
        gap: theme.spacing(6),
    },

    // personalDetails: {

    // },

    container: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2)
    },

    userTitle: {
        marginTop: '1.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold'
    }

}));

const Customer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { customer, msg } = useSelector(state => state.customers);

    // const { PERSONAL_DETAILS, ID_DETAILS, AUTHENTICATION, TRANSACTION_DETAILS } = USER_DETAILS;

    // const [tab, setTab] = useState(PERSONAL_DETAILS);
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    // useEffect(() => {
    //     return batch(() => {
    //         dispatch({ 
    //             type: SET_CUSTOMER,
    //             payload: {}
    //         })
    //         dispatch({ 
    //             type: SET_ID_CHECK_DATA,
    //             payload: null
    //         })
    //         dispatch({ 
    //             type: SET_PROFILE_CHECK_DATA,
    //             payload: null
    //         })
    //     });
    //     // eslint-disable-next-line
    // }, []);

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
        if ((msg && customer) && location.pathname.split('/').length === 3) { //Only run on the customer page
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [customer, dispatch, location.pathname, msg]);

    const dismissAction = useCallback(() => {
        if (location.pathname.split('/').length === 3) { //Only run on the customer page
            dispatch({
                type: CLEAR_CUSTOMER_STATUS_MSG
            });

            navigate(-1);
        }
    }, [dispatch, location.pathname, navigate]);

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            {loading && <Spinner />}
            <Grid container direction="row" spacing={3} className={classes.root}>
                <Box component="div" className={classes.header}>
                    <Typography className={classes.userTitle} variant="h5" >User Details</Typography>
                    <Switch
                    label="AML"
                    // checked={checked}
                    // onChange={handleChange}
                    // inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Box>
                <Grid item xs={12} className={classes.content}>
                    <Box component="div" className={classes.personalDetails}>
                        <PersonalDetails  />
                    </Box>
                    <Box component="div" className={classes.container}>
                        <IdentityDetails />
                        <AuthenticationDetails />
                        <TransactionDetails />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default Customer;