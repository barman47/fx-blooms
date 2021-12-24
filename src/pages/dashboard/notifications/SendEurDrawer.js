import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
	Button,
    Drawer,
    Grid,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { decode } from 'html-entities';

import { sendTransactionNotification } from '../../../actions/notifications';
import { SET_CUSTOMER_MSG } from '../../../actions/types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

import SuccessModal from '../../../components/common/SuccessModal';

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

const SendEurDrawer = ({ amount, toggleDrawer, drawerOpen, transactionId, sendTransactionNotification, sellerUsername }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    
    const { account } = useSelector(state => state.bankAccounts);
    const { msg } = useSelector(state => state.customer);
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const successModal = useRef();

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);
    
    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const dismissSuccessModal = () => {
        setLoading(false);
        toggleDrawer();
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    const handleSendTransactionNotification = () => {
        setLoading(true);
        sendTransactionNotification(transactionId, sellerUsername);
    };

	return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={open} onClose={toggleDrawer}>
                <Grid container direction="row" spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.header}>Send EUR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" className={classes.text}>Check how much you need to send to buyer below and make a transfer to the account details provided below.</Typography>
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
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Hello FXBLOOMS money</Typography>
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

SendEurDrawer.propTypes = {
    amount: PropTypes.number.isRequired,
    toggleDrawer: PropTypes.bool.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    sendTransactionNotification: PropTypes.func.isRequired,
    transactionId: PropTypes.string.isRequired,
    sellerUsername: PropTypes.string.isRequired
};

export default connect(undefined, { sendTransactionNotification })(SendEurDrawer);