import { useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
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
import { AlertOutline, Close, ContentCopy } from 'mdi-material-ui';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import copy from 'copy-to-clipboard';

import { addBid, madePayment } from '../../../actions/listings';
import { REMOVE_BID, SET_ACCOUNT, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';
import validateAddBid from '../../../utils/validation/listing/addBid';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
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

const PlaceBidDrawer = ({ addBid, getAccount, listing, madePayment, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { account, accounts } = useSelector(state => state.bankAccounts);
    const { addedBid, bid, msg } = useSelector(state => state.listings);
    const { customerId } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [Amount, setAmount] = useState('');
    const [receivingAccount, setReceivingAccount] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [reference, setReference] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showBid, setShowBid] = useState(true);
    const [currentBid, setCurrentBid] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const successModal = useRef();

    useEffect(() => {
        resumeTransaction();
        if (isEmpty(account)) {
            getAccount(listing.sellersAccountId);
        }
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

    const resumeTransaction = () => {
        for (const bid of listing.bids) {
            if (bid.status === 'IN_PROGRESS' && bid.customerId === customerId) {
                setShowBid(false);
                setCurrentBid(bid);
                setButtonDisabled(false);
                break;
            }
        }
    };

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setReceivingAccount('');
    };

    // Prevent user from entering invalid amounts
    useEffect(() => {
        if (Amount) {
             if (Number(Amount) < Number(listing.minExchangeAmount.amount)) {
            //  if (Number(Amount) < Number(listing.minExchangeAmount.amount) || Number(listing.amountAvailable.amount) > Number(listing.minExchangeAmount.amount)) {
                // Prevent user from entering amount less than minimum exchange amount
                setButtonDisabled(true);
                setErrors({ Amount: `Amount must be greater than or equal to the minimum exchange amount (EUR ${formatNumber(listing.minExchangeAmount.amount)})` });
                setTransferAmount('');
            } else if (Number(Amount) > Number(listing.amountAvailable.amount)) {
                // Prevent user from entering amount greater than amount available
                setButtonDisabled(true);
                setErrors({  Amount: `Amount must be less than or equal to the listing amount (EUR ${formatNumber(listing.amountAvailable.amount)})` });
                setTransferAmount('');
            } else {
                setErrors({});
            }
        }
    }, [listing.amountAvailable.amount, listing.minExchangeAmount.amount, Amount]);

    // Set transfer amount when user enters amount he wants to buy
    useEffect(() => {
        if (Amount) {
            setTransferAmount(`NGN ${formatNumber(Number(Amount) * Number(listing.exchangeRate), 2)}`);
        } else {
            setTransferAmount('');
        }
    }, [Amount, listing.exchangeRate]);

    useEffect(() => {
        if (Amount && receivingAccount) {
            setButtonDisabled(false);
        }
    }, [Amount, receivingAccount]);

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const getAccountId = (account) => {
        const bank = accounts.find(item => item.bankName === account);
        return bank.accountID;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            Amount,
            receivingAccount
        };
        const { errors, isValid } = validateAddBid(data);

        if (!isValid) {
            return setErrors({ msg: 'Invalid information provided', ...errors });
        }

        setLoading(true);
        setErrors({});
        addBid({
            amount: {
                currencyType: 'NGN',
                amount: Number(Amount)
            },
            listingId: listing.id,
            accountId: getAccountId(receivingAccount),
            reference
        });
    };

    useEffect(() => {
        setLoading(false);
        if (addedBid) {
            setShowBid(false)
        }
    }, [addedBid]);

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
        // setButtonDisabled(true);
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
            bidId: bid ? bid.id : currentBid.id,
            listingId: listing.id,
        });
    };

    const getSellerAccount = () => getAccount(listing.sellersAccountId);

    const handleCopyTransactionId = () => {
        copy(bid.id);
        toast.success('Transaction ID Copied!');
    };

    return (
        <>
            {showBid ? 
                <>
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
                        onClose={toggleDrawer}
                    >
                        <Box component="header">
                            <Typography variant="h6" className={classes.header}>Buy EUR - Place a Bid</Typography>
                            <IconButton 
                                color="primary" 
                                disableFocusRipple
                                variant="text"
                                onClick={toggleDrawer}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        <Grid container direction="row">
                            <Grid item xs={5}>
                                <Typography variant="h6" color="primary">Actions Required</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <AlertOutline style={{ color: '#F67171', position: 'relative', top: 3 }} />
                            </Grid>
                        </Grid>
                        <ol>
                            <li><Typography variant="body2" component="p">Input the EUR amount you wish to buy</Typography></li>
                            <li><Typography variant="body2" component="p">Select/add the receiving account</Typography></li>
                            <li><Typography variant="body2" component="p">Click on "Place a Bid"</Typography></li>
                        </ol>
                        <form onSubmit={onSubmit} noValidate>
                            <Grid container direction="row" spacing={1}>
                                <Grid item xs={3} >
                                    <Typography variant="subtitle2" component="span" className={classes.helperText}>I want</Typography>
                                    <TextField 
                                        value="EUR"
                                        type="text"
                                        variant="outlined" 
                                        disabled
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <br />
                                    <TextField 
                                        style={{ marginTop: '2px' }}
                                        value={Amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Amount"
                                        helperText={errors.Amount}
                                        fullWidth
                                        required
                                        error={errors.Amount ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormHelperText className={classes.formHelperText}>Seller rate: NGN{listing.exchangeRate} to 1EUR</FormHelperText>
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
                                                        <MenuItem key={account.accountID} value={account.bankName}>{account.bankName}</MenuItem>
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
                                <Grid item xs={12} className={classes.exchangeAmountContainer}>
                                    <Typography variant="subtitle1" component="p" color="primary">NGN Amount to Transfer</Typography>
                                    <Typography variant="subtitle1" component="p" color="primary">{transferAmount}</Typography>
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
                                    >
                                        {loading ? 'One Moment . . .' : 'Place a Bid'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Drawer>
                </>
                :
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
                                    {/* <div className={classes.accountContainer}> */}
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
                                {loading ? 'One Moment . . .' : `${formatNumber((bid?.bidAmount?.amount * listing?.exchangeRate) || (currentBid?.bidAmount?.amount * listing?.exchangeRate), 2)} NGN Payment Made`}
                            </Button>
                        </Grid>
                    </Drawer>
                </>
            }
        </>
    );
};

PlaceBidDrawer.propTypes = {
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    listing: PropTypes.object.isRequired,
    madePayment: PropTypes.object.isRequired
};

export default connect(undefined, { addBid, getAccount, madePayment })(PlaceBidDrawer);