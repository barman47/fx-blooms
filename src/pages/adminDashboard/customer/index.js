import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { SET_CUSTOMER, CLEAR_CUSTOMER_STATUS_MSG, SET_ID_CHECK_DATA, SET_PROFILE_CHECK_DATA } from '../../../actions/types';
import { COLORS, USER_DETAILS } from '../../../utils/constants';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import PersonalDetails from './PersonalDetails';
import IdentityDetails from './IdentityDetails';
import AuthenticationDetails from './AuthenticationDetails';
import TransactionDetails from './TransactionDetails';

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

    tabContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing(4),
        marginTop: theme.spacing(2)
    },

    tab: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),

        '& span:first-child': {
            fontWeight: 600,
            color: theme.palette.primary.main
        },

        '& span:last-child': {
            color: theme.palette.primary.main,
            fontWeight: 600
        }
    },

    active: {
        backgroundColor: theme.palette.primary.main,
        
        '& span': {
            color: `${COLORS.offWhite} !important`,
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

const Customer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { customer, msg } = useSelector(state => state.customers);

    const { PERSONAL_DETAILS, ID_DETAILS, AUTHENTICATION, TRANSACTION_DETAILS } = USER_DETAILS;

    const [tab, setTab] = useState(PERSONAL_DETAILS);
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    useEffect(() => {
        return () => batch(() => {
            dispatch({ 
                type: SET_CUSTOMER,
                payload: {}
            })
            dispatch({ 
                type: SET_ID_CHECK_DATA,
                payload: null
            })
            dispatch({ 
                type: SET_PROFILE_CHECK_DATA,
                payload: null
            })
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
        if ((msg && customer) && location.pathname.split('/').length === 3) { //Only run on the customer page
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [customer, dispatch, location.pathname, msg]);

    const dismissAction = () => {
        if (location.pathname.split('/').length === 3) { //Only run on the customer page
            dispatch({
                type: CLEAR_CUSTOMER_STATUS_MSG
            });

            navigate(-1);
        }
    };

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            {loading && <Spinner />}
            <section className={classes.root}>
                <Typography variant="h5" >User Details</Typography>
                <Box component="section" className={classes.tabContainer}>
                    <div className={clsx(classes.tab, tab === PERSONAL_DETAILS && classes.active)} onClick={() => setTab(PERSONAL_DETAILS)}>
                        <Typography variant="subtitle2" component="span">{PERSONAL_DETAILS}</Typography>
                    </div>
                    <div className={clsx(classes.tab, tab === ID_DETAILS && classes.active)} onClick={() => setTab(ID_DETAILS)}>
                        <Typography variant="subtitle2" component="span">{ID_DETAILS}</Typography>
                    </div>
                    <div className={clsx(classes.tab, tab === AUTHENTICATION && classes.active)} onClick={() => setTab(AUTHENTICATION)}>
                        <Typography variant="subtitle2" component="span">{AUTHENTICATION}</Typography>
                    </div>
                    <div className={clsx(classes.tab, tab === TRANSACTION_DETAILS && classes.active)} onClick={() => setTab(TRANSACTION_DETAILS)}>
                        <Typography variant="subtitle2" component="span">{TRANSACTION_DETAILS}</Typography>
                    </div>
                </Box>
                <Box component="section" className={classes.container}>
                    {tab === PERSONAL_DETAILS && <PersonalDetails  />}
                    {tab === ID_DETAILS && <IdentityDetails />}
                    {tab === AUTHENTICATION && <AuthenticationDetails />}
                    {tab === TRANSACTION_DETAILS && <TransactionDetails />}
                </Box>
            </section>
        </>
    );
};

export default Customer;