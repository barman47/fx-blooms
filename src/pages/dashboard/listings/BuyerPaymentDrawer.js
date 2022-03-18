import { useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    Collapse,
    Drawer,
    Grid,
    FormControl,
    FormHelperText,
    IconButton,
    Select,
    MenuItem,
    TextField,
    Tooltip,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { AlertOutline, Close, ContentCopy } from 'mdi-material-ui';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

import { cancelBid, madePayment } from '../../../actions/listings';
import { MAKE_LISTING_OPEN, SET_ACCOUNT, SET_BID, SET_LISTING, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import CircularProgressWithLabel from '../../../components/common/CircularProgressWithLabel';
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

const BuyerPaymentDrawer = ({ cancelBid, getAccount, madePayment, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { account, accounts } = useSelector(state => state.bankAccounts);
    const { firstName } = useSelector(state => state.customer);
    const { bid, listing, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [receivingAccount, setReceivingAccount] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [reference, setReference] = useState('');

    const [timerMinutes, setTimerMinutes] = useState('00');
    const [timerSeconds, setTimerSeconds] = useState('00');
    const [timerValue, setTimerValue] = useState(100);

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const FIVE_MINUTES = 300000; // 5 minutes in milliseconds

    const interval = useRef();
    const successModal = useRef();

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

    useEffect(() => {
        // Automatically select newly added account
        if (accounts.length > 0 && accounts[0].currency === 'EUR') {
            setReceivingAccount(accounts[0].bankName);
        }
    }, [accounts]);

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

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setReceivingAccount('');
    };

    useEffect(() => {
        if (receivingAccount) {
            setButtonDisabled(false);
        }
    }, [receivingAccount]);

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

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    const startExpiryTimer = () => {
        const countDownTime = new Date(bid.datePlaced).getTime() + (FIVE_MINUTES - 22000); // Remove 22 Seconds from the timer. I don't know wjy but when it starts there's an additional 22 seconds
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
        madePayment({
            bidId: bid.id,
            listingId: listing.id,
            accountId: getAccountId(receivingAccount),
            reference
        });
    };

    const getSellerAccount = () => getAccount(listing.sellersAccountId);

    const getAccountId = (account) => {
        const bank = accounts.find(item => item.bankName === account || item.nicKName === account);
        return bank.accountID;
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
                    <Typography variant="h6" className={classes.header}>Buy EUR - Transfer the NGN</Typography>
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
                    <li><Typography variant="body2" component="p">Transfer the NGN to the {`${listing?.listedBy?.toLowerCase()}'s`} account below</Typography></li>
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
                    <Collapse in={!_.isEmpty(account)}>
                        <section className={classes.accountDetailsContainer}>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Name</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accountName}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Number</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.accountNumber}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{account.bankName}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>{listing.reference ? listing.reference : 'N/A'}</Typography>
                            </div>
                        </section>
                    </Collapse>              
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" component="span">Receiving Account</Typography>
                    <FormControl 
                        variant="outlined" 
                        error={errors.receivingAccount ? true : false } 
                        fullWidth 
                        required
                        disabled={loading ? true : false}
                    >
                        <Select
                            labelId="ReceivingAccount"
                            value={receivingAccount}
                            onChange={(e) => setReceivingAccount(e.target.value)}
                        >
                            <MenuItem value="" disabled>Select your receiving account</MenuItem>
                            {accounts.map((account) => {
                                if (account.currency === 'EUR') {
                                    return (
                                        // <MenuItem key={account.accountID} value={account.bankName}>{account.bankName}</MenuItem>
                                        <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                    )
                                }
                                return null;
                            })}
                        </Select>
                        <FormHelperText>{errors.receivingAccount}</FormHelperText>
                        <Button variant="text" color="primary" align="right" onClick={handleAddAccount} className={classes.addAccountButton}>Add New Account</Button>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" component="span">Payment Reference (OPTIONAL)</Typography>
                    <TextField 
                        value={reference}
                        placeholder="Enter Payment Reference"
                        onChange={(e) => setReference(e.target.value)}
                        disabled={loading ? true : false}
                        type="text"
                        variant="outlined" 
                        fullWidth
                    />
                    <FormHelperText>Enter the reference you want added to the payment</FormHelperText>
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
                    {isEmpty(account) && <Alert severity="error">Click the "Show Account Details" button first</Alert>}
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        disableFocusRipple
                        className={classes.button}
                        disabled={loading || buttonDisabled || !isEmpty(errors)  || isEmpty(account) ? true : false}
                        onClick={handleMadepayment}
                    >
                        {loading ? 'One Moment . . .' : `NGN${formatNumber((listing?.amountAvailable?.amount * listing?.exchangeRate), 2)} Payment Made`}
                    </Button>
                </Grid>
            </Drawer>
        </>
    );
};

BuyerPaymentDrawer.propTypes = {
    cancelBid: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    madePayment: PropTypes.func.isRequired
};

export default connect(undefined, { cancelBid, getAccount, madePayment })(BuyerPaymentDrawer);