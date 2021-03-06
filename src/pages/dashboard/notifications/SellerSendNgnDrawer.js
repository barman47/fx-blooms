import { useCallback, useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    Drawer,
    Grid,
    IconButton,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AlertOutline, Close } from 'mdi-material-ui';

import { cancelBid, getBids, madePaymentV2 } from '../../../actions/listings';
import { markNotificationAsRead } from '../../../actions/notifications';
import { GET_ERRORS, SET_ACCOUNT, SET_BID, SET_BIDS, SET_LISTING, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
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
            justifyContent: 'space-between',
            alignItems: 'center'
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

    timerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    button: {
        margin: theme.spacing(2, 0),
    }
}));

const SellerSendNgnDrawer = ({ cancelBid, getBids, handleOpenTimeElapsedModal, madePaymentV2, markNotificationAsRead, toggleDrawer, drawerOpen, notificationId }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { bid, bids, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const interval = useRef();
    const successModal = useRef();
    const errorToast = useRef();

    useEffect(() => {
        return () => {
            dispatch({
                type: SET_BIDS,
                payload: []
            });
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
            clearInterval(interval.current);
            batch(() => {
                dispatch({
                    type: GET_ERRORS,
                    payload: {}
                });
                dispatch({
                    type: SET_BID,
                    payload: {}
                });
                dispatch({
                    type: SET_LISTING,
                    payload: {}
                });
            });
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

    const getBidIds = useCallback(() => {
        const bidIds = [];
        bids.forEach(bid => bidIds.push(bid.id));
        return bidIds;
    }, [bids]);

    // Cancel bids once bids return from the endpoint
    useEffect(() => {
        if (bids.length > 0) {
            cancelBid(getBidIds());
            handleOpenTimeElapsedModal();
            toggleDrawer();
        }
    }, [bids, cancelBid, getBidIds, handleOpenTimeElapsedModal, toggleDrawer]);

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
            successModal.current.setModalText(msg);
            successModal.current.openModal();
            clearInterval(interval.current);
        }
    }, [msg]);

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
        }, notificationId, bid.data.Buyer.UserName);
    };

    return (
        <>
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
                    disableEscapeKeyDown: true
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
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={6} lg={5}>
                        <Typography variant="h6" color="primary">Actions Required</Typography>
                    </Grid>
                    <Grid item xs={6} lg={1}>
                        <AlertOutline style={{ color: '#F67171', position: 'relative', top: 3 }} />
                    </Grid>
                </Grid>
                <ol>
                    <li><Typography variant="body2" component="p">Transfer the {bid.data.Seller.Currency} to {`${bid.data.Buyer.UserName?.toLowerCase()}'s`} account below</Typography></li>
                    <li><Typography variant="body2" component="p">Click on <Typography variant="body2" component="span" color="primary" style={{ fontWeight: 600 }}>{bid.data.Seller.Currency}{formatNumber(bid.data.Seller.AmountTransfered, 2)} Payment Made</Typography></Typography></li>
                    <li><Typography variant="body2" component="p">The EUR equivalent will be moved to your wallet immediately</Typography></li>
                </ol>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Buyer Account Details</Typography>
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

SellerSendNgnDrawer.propTypes = {
    cancelBid: PropTypes.func.isRequired,
    getBids: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    madePaymentV2: PropTypes.func.isRequired,
    markNotificationAsRead: PropTypes.func.isRequired,
    notificationId: PropTypes.string.isRequired
};

export default connect(undefined, { cancelBid, getAccount, getBids, madePaymentV2, markNotificationAsRead })(SellerSendNgnDrawer);
