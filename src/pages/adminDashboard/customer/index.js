import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { SET_CUSTOMER, CLEAR_CUSTOMER_STATUS_MSG } from '../../../actions/types';
import { COLORS, USER_DETAILS } from '../../../utils/constants';

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

    tabContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
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

const Customer = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { customer, msg } = useSelector(state => state.customers);

    const { PERSONAL_DETAILS, ID_DETAILS, TWO_FACTOR, TRANSACTION_DETAILS, WALLET_DETAILS } = USER_DETAILS;

    const [tab, setTab] = useState(PERSONAL_DETAILS);
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    const { getStats } = props;

    useEffect(() => {
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
                    <div className={clsx(classes.tab, tab === TWO_FACTOR && classes.active)} onClick={() => setTab(TWO_FACTOR)}>
                        <Typography variant="subtitle2" component="span">{TWO_FACTOR}</Typography>
                    </div>
                    <div className={clsx(classes.tab, tab === TRANSACTION_DETAILS && classes.active)} onClick={() => setTab(TRANSACTION_DETAILS)}>
                        <Typography variant="subtitle2" component="span">{TRANSACTION_DETAILS}</Typography>
                    </div>
                    <div className={clsx(classes.tab, tab === WALLET_DETAILS && classes.active)} onClick={() => setTab(WALLET_DETAILS)}>
                        <Typography variant="subtitle2" component="span">{WALLET_DETAILS}</Typography>
                    </div>
                </Box>
                <Box component="section" className={classes.container}>
                    {tab === PERSONAL_DETAILS && <PersonalDetails  />}
                    {tab === ID_DETAILS && <IdentityDetails />}
                    {/*{tab === TWO_FACTOR && <VerifiedCustomers handleClick={handleClick} handleSetTitle={handleSetTitle} />}
                    {tab === TRANSACTION_DETAILS && <RejectedCustomers handleClick={handleClick} handleSetTitle={handleSetTitle} />}
                    {tab === WALLET_DETAILS && <AllCustomers handleClick={handleClick} handleSetTitle={handleSetTitle} />} */}
                </Box>
            </section>
        </>
    );
}

export default Customer;