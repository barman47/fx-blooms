import { useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    Drawer,
    Grid,
    IconButton,
    Tooltip,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AlertOutline, Close, ContentCopy } from 'mdi-material-ui';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

import { cancelBid, madePaymentV2 } from '../../../actions/listings';
import { MAKE_LISTING_OPEN, SET_ACCOUNT, SET_BID, SET_LISTING, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import CircularProgressWithLabel from '../../../components/common/CircularProgressWithLabel';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(1, 4),
        width: '35vw',

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4),
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '90vw'
        },

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    },

    header: {
        color: theme.palette.primary.main,
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

    helperText: {
        fontSize: theme.spacing(1.5),

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.2)
        },
    },

    transferAmount: {
        backgroundColor: 'rgba(81, 103, 103, 1)',
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        
        '& .MuiInputBase-root': {
            color: COLORS.offWhite
        }
    },

    formHelperText: {
        fontWeight: 300,
        fontSize: theme.spacing(1.4),
    },

    exchangeAmountContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(1)
        },

        '& div': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: theme.spacing(2)
            // justifyContent: 'space-between'
        }
    },

    accountDetailsHeader: {
        color: COLORS.offBlack,
        fontWeight: 600,
        fontSize: theme.spacing(1.7),
    },

    accountDetailsText: {
        color: COLORS.offBlack,
        fontWeight: 300,
    },

    addAccountButton: {
        alignSelf: 'flex-end'
    },

    button: {
        margin: theme.spacing(2, 0),
    },
}));

const BuyerPaymentNgnDrawer = ({ cancelBid, getAccount, madePaymentV2, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { account } = useSelector(state => state.bankAccounts);
    const { firstName } = useSelector(state => state.customer);
    const { bid, listing, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);

    const [timerMinutes, setTimerMinutes] = useState('00');
    const [timerSeconds, setTimerSeconds] = useState('00');
    const [timerValue, setTimerValue] = useState(0);

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const FIVE_MINUTES = 300000; // 5 minutes in milliseconds

    const interval = useRef();
    const successModal = useRef();
    const errorToast = useRef();

    useEffect(() => {
        startExpiryTimer();
        if (isEmpty(account) && !isEmpty(listing)) {
            getAccount(listing.sellersAccountId);
        }

        return () => {
            clearInterval(interval.current);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setOpen(drawerOpen);
        dispatch({
            type: SET_ACCOUNT,
            payload: {}
        });
        if (!drawerOpen) {
            setErrors({});
        }
    }, [dispatch, drawerOpen]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            setLoading(false);
        }
    }, [msg]);

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    const getBidIds = (bids) => {
        const bidIds = [];
        bids.forEach(bid => bidIds.push(bid.id));
        return bidIds;
    };

    const expireListing = () => {
        clearInterval(interval.current);
        toggleDrawer();
        batch(() => {
            dispatch({
                type: SET_BID,
                payload: {}
            });
            dispatch({
                type: SET_LISTING,
                payload: {}
            });
            dispatch({
                type: MAKE_LISTING_OPEN,
                payload: listing.id
            });
        });
        cancelBid(getBidIds(listing.bids));
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    useEffect(() => {
        setOpen(drawerOpen);
        dispatch({
            type: SET_ACCOUNT,
            payload: {}
        });
        if (!drawerOpen) {
            setErrors({});
        }
    }, [dispatch, drawerOpen]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const startExpiryTimer = () => {
        const countDownTime = new Date(bid.dateLogged).getTime() + (FIVE_MINUTES - 22000); // Remove 22 Seconds from the timer. I don't know wjy but when it starts there's an additional 22 seconds
        interval.current = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (minutes === 0 && seconds === 0) {
                clearInterval(interval.current);
                setTimerMinutes('00');
                setTimerSeconds('00');
                setTimerValue(0);
                expireListing();
            } else {
                setTimerMinutes(minutes < 10 ? `0${minutes}` : minutes);
                setTimerSeconds(seconds < 10 ? `0${seconds}` : seconds);
                setTimerValue(Math.floor(distance / FIVE_MINUTES * 100));
            }
        }, 1000);
    };

    const dismissSuccessModal = () => {
        // setButtonDisabled(true);
        successModal.current.closeModal();
        setLoading(false);
        toggleDrawer();
        batch(() => {
            dispatch({
                type: SET_LISTING_MSG,
                payload: null
            });
            dispatch({ 
                type: SET_BID, 
                payload: {}
            });
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        });
        
    };

    const handleMadepayment = () => {
        setLoading(true);
        madePaymentV2({
            bidId: bid.data.BidId,
            listingId: bid.data.ListingId
        });
    };

    const handleCopyTransactionId = () => {
        copy(bid.id);
        toast.success('Transaction ID Copied!');
    };

    return (
        <>
            <Toaster />
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} eur={true} />}
            {!isEmpty(errors) && 
                <Toast 
                    ref={errorToast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <Drawer 
                ModalProps={{ 
                    disableBackdropClick: true,
                    disableEscapeKeyDown: true,
                }}
                PaperProps={{ className: classes.drawer }} 
                anchor="right" 
                open={loading ? true : open} 
                // open={true} 
                onClose={toggleDrawer}
            >
                <Box component="header">
                    <Typography variant="h6" className={classes.header}>Sell NGN - Transfer the NGN</Typography>
                    <IconButton 
                        color="primary" 
                        disableFocusRipple
                        variant="text"
                        onClick={toggleDrawer}
                    >
                        <Close />
                    </IconButton>
                </Box>
                <div className={classes.transactionContainer}>
                    <Typography variant="body2" component="p" color="primary">Transaction ID</Typography>
                    <Typography variant="body2" component="p">
                        {bid?.id && `. . . ${returnLastThreeCharacters(bid.id)}`}
                        <IconButton onClick={handleCopyTransactionId} color="primary">
                            <Tooltip title="Copy Transaction ID" arrow>
                                <ContentCopy />
                            </Tooltip>
                        </IconButton>
                    </Typography>
                </div>
                <Grid container direction="row">
                    <Grid item xs={5}>
                        <Typography variant="h6" color="primary">Actions Required</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <AlertOutline style={{ color: '#F67171', position: 'relative', top: 3 }} />
                    </Grid>
                </Grid>
                <ol>
                    <li><Typography variant="body2" component="p">Select/add the receiving account</Typography></li>
                    <li><Typography variant="body2" component="p">Transfer the {listing?.amountNeeded?.currencyType} to the {`${listing?.listedBy?.toLowerCase()}'s`} account below</Typography></li>
                    <li><Typography variant="body2" component="p">Click on {listing?.amountNeeded?.currencyType} Payment Made</Typography></li>
                </ol>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Buyer Account Details</Typography>
                    {/* <Collapse in={!_.isEmpty(account)}> */}
                        <section className={classes.accountDetailsContainer}>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Name</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{bid.data.Buyer.AccountName}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Number</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{bid.data.Buyer.AccountNumber}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{bid.data.Buyer.BankName}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{bid.data.Buyer.TransferReference}</Typography>
                            </div>
                        </section>
                    {/* </Collapse>               */}
                </Grid>
                <Typography variant="subtitle2" component="span" color="primary">Payment Countdown</Typography>
                <Typography variant="subtitle2" component="span" color="textSecondary">{firstName} will send {listing?.amountNeeded?.currencyType}{formatNumber((listing?.amountAvailable?.amount * listing?.exchangeRate), 2)} within 5 mins</Typography>
                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <CircularProgressWithLabel 
                        variant="determinate" 
                        size={100}
                        value={timerValue} 
                        minutes={timerMinutes.toString()} 
                        seconds={timerSeconds.toString()} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        disableFocusRipple
                        className={classes.button}
                        disabled={loading}
                        onClick={handleMadepayment}
                    >
                        {loading ? 'One Moment . . .' : `${bid.data.Seller.Currency}${formatNumber((bid.data.Seller.AmountTransfered), 2)} Payment Made`}
                    </Button>
                </Grid>
            </Drawer>
        </>
    );
};

BuyerPaymentNgnDrawer.propTypes = {
    cancelBid: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    madePaymentV2: PropTypes.func.isRequired
};

export default connect(undefined, { cancelBid, getAccount, madePaymentV2 })(BuyerPaymentNgnDrawer);