import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
	Button,
    Drawer,
    Grid,
    IconButton,
    Tooltip,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close, ContentCopy } from 'mdi-material-ui';
import { decode } from 'html-entities';
import copy from 'copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';

import { sendTransactionNotification } from '../../../actions/transactions';
import { GET_ERRORS, SET_LISTING_MSG } from '../../../actions/types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';
import isEmpty from '../../../utils/isEmpty';

import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(1, 4),
        width: '30vw',

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4),
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '80vw'
        }
    },

    header: {
        color: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    transactionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    text: {
        color: COLORS.offBlack,
        fontWeight: 300,
        fontSize: theme.spacing(1.7),
        marginTop: theme.spacing(1),
    },

    accountDetails: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginBottom: theme.spacing(1)
    },

    accountDetailsContainer: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(1)
        },
    },

    accountDetailsHeader: {
        color: COLORS.offBlack,
        fontWeight: 600,
        fontSize: theme.spacing(1.7),
    },

    accountContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },

        '& section': {
            bodrder: '1px solid red',
            display: 'flex',
            flexDirection: 'column'
        }
    },

    accountDetailsText: {
        color: COLORS.offBlack,
        fontWeight: 300,
    },

    transferAmount: {
        backgroundColor: 'rgba(81, 103, 103, 1)',
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        color: COLORS.offWhite,
        padding: theme.spacing(1.5, 2.5)
    }
}));

const BuyerSendEurDrawer = ({ amount, toggleDrawer, drawerOpen, transactionId, sendTransactionNotification, notificationId }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    
    const { account } = useSelector(state => state.bankAccounts);
    const { msg } = useSelector(state => state.listings);
    const message = useSelector(state => state.notifications.msg);
    const errorsState = useSelector(state => state.errors);
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const toastRef = useRef();

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            setLoading(false);
        }
    }, [msg]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toastRef.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
            toggleDrawer();
        }
    }, [dispatch, errorsState, errors, toggleDrawer]);

    const handleCopyTransactionId = () => {
        copy(transactionId);
        toast.success('Transaction ID Copied!');
    };

    const handleSendTransactionNotification = () => {
        setLoading(true);
        sendTransactionNotification(transactionId, notificationId);
    };

    const dismissSuccessModal = () => {
        successModal.current.closeModal();
        setLoading(false);
        toggleDrawer();
        dispatch({
            type: SET_LISTING_MSG,
            payload: null
        });
    };

	return (
        <>
            <Toaster />
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {!isEmpty(errors) && 
                <Toast 
                    ref={toastRef}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <Drawer 
                PaperProps={{ className: classes.drawer }} 
                anchor="right" 
                open={open} 
                onClose={toggleDrawer}
            >
                <Grid container direction="row" spacing={3}>
                    <Grid item xs={12} className={classes.header}>
                        <Typography variant="h6" className={classes.header}>Send EUR</Typography>
                        <IconButton 
                            color="primary" 
                            disableFocusRipple
                            variant="text"
                            onClick={toggleDrawer}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} className={classes.transactionContainer}>
                        <Typography variant="body2" component="p" color="primary">Transaction ID</Typography>
                        <Typography variant="body2" component="p">
                            {`. . . ${returnLastThreeCharacters(transactionId)}`}
                            <IconButton onClick={handleCopyTransactionId} color="primary">
                                <Tooltip title="Copy Transaction ID" arrow>
                                    <ContentCopy />
                                </Tooltip>
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" className={classes.text}>{message}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>I Will Send</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.transferAmount}>&#8364;{formatNumber(amount)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Buyer Account Details</Typography>
                        <section className={classes.accountDetailsContainer}>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Name</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accounName}</Typography>
                            </div>
                            <div className={classes.accountContainer}>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>IBAN</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accountNumber}</Typography>
                                </section>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.bankName}</Typography>
                                </section>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.reference ? account.reference : 'N/A'}</Typography>
                            </div>
                        </section>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation 
                            fullWidth 
                            disabled={loading ? true : false}
                            onClick={handleSendTransactionNotification}
                        >
                            {loading ? 'One Moment . . .' : `I've Made Payment of ${decode('&#8364;')}${formatNumber(amount)}`}
                        </Button>
                    </Grid>
                </Grid>
            </Drawer>
        </>
	);
};

BuyerSendEurDrawer.propTypes = {
    amount: PropTypes.number.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    sendTransactionNotification: PropTypes.func.isRequired,
    notificationId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired
};

export default connect(undefined, { sendTransactionNotification })(BuyerSendEurDrawer);