import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
	Button,
    Drawer,
    Grid,
    FormControl,
    FormHelperText,
    Select,
    MenuItem,
    TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { addBid } from '../../../actions/listings';
import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import validateAddBid from '../../../utils/validation/listing/addBid';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import SuccessModal from '../../../components/common/SuccessModal';
import { SET_LISTING_MSG } from '../../../actions/types';

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

    form: {
        marginTop: theme.spacing(2)
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

    addAccountButton: {
        alignSelf: 'flex-end'
    },

    button: {
        margin: theme.spacing(2, 0),
    },
}));

const BuyEurDrawer = ({ addBid, listing, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { account, accounts } = useSelector(state => state.bankAccounts);
    const { msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);

    const [Amount, setAmount] = useState('');
    const [receivingAccount, setReceivingAccount] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const successModal = useRef();

    useEffect(() => {
        setOpen(drawerOpen);
        if (!drawerOpen) {
            setErrors({});
        }
    }, [drawerOpen]);

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

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setReceivingAccount('');
    };

    // Prevent user from entering invalid amounts
    useEffect(() => {
        if (Amount) {
            if (Number(Amount) < Number(listing.minExchangeAmount.amount)) {
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
                setButtonDisabled(false);
                setErrors({});
            }
        }
    }, [listing.amountAvailable.amount, listing.minExchangeAmount.amount, Amount]);

    // Set transfer amount when user enters amount he wants to buy
    useEffect(() => {
        if (Amount) {
            setTransferAmount(`NGN ${formatNumber(Number(Amount) * Number(listing.exchangeRate), 2)}`);
        }
    }, [Amount, listing.exchangeRate]);

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const getAccountId = (account) => {
        const bank = accounts.find(item => item.bankName === account);
        return bank.accountID;
    };

    const dismissSuccessModal = () => {
        successModal.current.openModal();
        toggleDrawer();
        dispatch({
            type: SET_LISTING_MSG,
            payload: null
        });
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
            accountId: getAccountId(receivingAccount)
        });
    };

	return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} eur={true} />}
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={loading ? true : open} onClose={toggleDrawer}>
                <Typography variant="h6" className={classes.header}>Buy EUR</Typography>
                <Typography variant="body1" component="p" className={classes.text}>Check how much you need to send to seller below and make a transfer to the account details provided below.</Typography>
                <form onSubmit={onSubmit} noValidate className={classes.form}>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={3} >
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>I want to Buy</Typography>
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
                                <Button variant="text" color="primary" align="right" onClick={handleAddAccount} className={classes.addAccountButton}>Add Receiving Account</Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span">I Will Send</Typography>
                            <TextField 
                                className={classes.transferAmount}
                                classes={{ root: classes.transferAmount }}
                                value={transferAmount}
                                // disabled
                                type="text"
                                variant="outlined" 
                                disabled
                                fullWidth
                                required
                            />
                        </Grid>
                        {!buttonDisabled && 
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Seller Account Details</Typography>
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
                                        <div>
                                            <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                            <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Hello FXBLOOMS money</Typography>
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
                                        disabled={loading || buttonDisabled ? true : false}
                                    >
                                        {loading ? 'One Moment . . .' : `I've Made Payment ${transferAmount && 'of'} ${transferAmount}`}
                                    </Button>
                                </Grid>
                            </>
                        }
                    </Grid>
                </form>
            </Drawer>
        </>
	);
};

BuyEurDrawer.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { addBid })(BuyEurDrawer);