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
import { AlertOutline, ContentCopy } from 'mdi-material-ui';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

import { madePayment } from '../../../actions/listings';
import { REMOVE_BID, SET_ACCOUNT, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import SuccessModal from '../../../components/common/SuccessModal';

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
        justifyContent: 'space-between',
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
        marginTop: theme.spacing(1),
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

    addAccountButton: {
        alignSelf: 'flex-end'
    },

    button: {
        margin: theme.spacing(2, 0),
    },
}));

const TransferNGNDrawer = ({ madePayment, getAccount, listing, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { account } = useSelector(state => state.bankAccounts);
    const { bid, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const successModal = useRef();

    useEffect(() => {
        getAccount(listing.sellersAccountId);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!_.isEmpty(account)) {
            setButtonDisabled(false);
        }
    }, [account]);

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

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    const dismissSuccessModal = () => {
        successModal.current.closeModal();
        setLoading(false);
        toggleDrawer();
        batch(() => {
            dispatch({
                type: SET_LISTING_MSG,
                payload: null
            });
            dispatch({ type: REMOVE_BID});
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        });
        
    };

    const handleMadpayment = () => {
        setLoading(true);
        madePayment({
            bidId: bid.id,
            listingId: listing.id,
        });
    };

    const getSellerAccount = () => getAccount(listing.sellersAccountId);

    const returnLastThreeCharacters = (string) => {
        const startIndex = string.length - 3;
        const endIndex = string.length;
        return string.slice(startIndex, endIndex);
    };

    const handleCopyTransactionId = () => {
        copy(bid.id);
        toast.success('Transaction ID Copied!');
    };

	return (
        <>
            <Toaster />
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Drawer 
                ModalProps={{ 
                    disableBackdropClick: true,
                    disableEscapeKeyDown: true,
                }}
                PaperProps={{ className: classes.drawer }} 
                anchor="right" 
                open={loading ? true : open} 
                onClose={toggleDrawer}
            >
                <Box component="header">
                    <Typography variant="h6" className={classes.header}>Buy EUR - Transfer the NGN</Typography>
                    {/* <IconButton 
                        color="primary" 
                        disableFocusRipple
                        variant="text"
                        onClick={toggleDrawer}
                    >
                        <Close />
                    </IconButton> */}
                </Box>
                <div className={classes.transactionContainer}>
                    <Typography variant="body2" component="p" color="primary">Transaction ID</Typography>
                    <Typography variant="body2" component="p">
                        . . .{returnLastThreeCharacters(bid.id)}
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
                    <li><Typography variant="body2" component="p">Transfer the NGN to the {`${listing.listedBy}'s`} account below</Typography></li>
                    <li><Typography variant="body2" component="p">Click on NGN Payment Made</Typography></li>
                </ol>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Seller Account Details</Typography>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        disabled={_.isEmpty(account) ? false : true}
                        onClick={getSellerAccount}
                    >
                        Show Account Details
                    </Button>
                    {!_.isEmpty(account) && 
                        <section className={classes.accountDetailsContainer}>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Name</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accountName}</Typography>
                            </div>
                            <div className={classes.accountContainer}>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Number</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accountNumber}</Typography>
                                </section>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.bankName}</Typography>
                                </section>
                            </div>
                            {/* <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Hello FXBLOOMS money</Typography>
                            </div> */}
                        </section>
                    }                   
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        disableFocusRipple
                        className={classes.button}
                        disabled={loading || buttonDisabled || !isEmpty(errors) ? true : false}
                        onClick={handleMadpayment}
                    >
                        {loading ? 'One Moment . . .' : 'NGN Payment Made'}
                    </Button>
                </Grid>
            </Drawer>
        </>
	);
};

TransferNGNDrawer.propTypes = {
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    listing: PropTypes.object.isRequired,
    madePayment: PropTypes.object.isRequired
};

export default connect(undefined, { madePayment, getAccount })(TransferNGNDrawer);