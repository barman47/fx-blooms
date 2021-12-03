import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
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

import { getAccounts } from '../../../actions/bankAccounts';
import { addBid } from '../../../actions/listings';
import { ADD_ACCOUNT, COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import validateAddBid from '../../../utils/validation/listing/addBid';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';

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
        // border: '1px solid green',
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

    button: {
        margin: theme.spacing(2, 0),
    },
}));

const BuyEurDrawer = ({ addBid, listing, getAccounts, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();

    const { account, accounts } = useSelector(state => state.bankAccounts);
    const { customerId } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);

    const [Amount, setAmount] = useState('');
    const [receivingAccount, setReceivingAccount] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        if (accounts.length === 0) {
            getAccounts(customerId);
        }
        // eslint-disable-next-line
    }, [accounts]);

    useEffect(() => {
        setOpen(drawerOpen);
        if (!drawerOpen) {
            setErrors({});
        }
    }, [drawerOpen]);

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    // Display Add Account Drawer
    useEffect(() => {
        if (receivingAccount === ADD_ACCOUNT) {
            setAddAccountDrawerOpen(true);
            setReceivingAccount('');
        }
    }, [receivingAccount]);

    // Prevent user from entering amount less than minimum exchange amount
    useEffect(() => {
        if (Number(Amount) < Number(listing.minExchangeAmount.amount)) {
            setButtonDisabled(true);
            setErrors({  amount: `Amount must be greater than or equal to the minimum exchange amount (EUR ${formatNumber(listing.minExchangeAmount.amount)})` });
            setTransferAmount('');
        } else {
            setButtonDisabled(false);
            setErrors({});
        }
    }, [listing.minExchangeAmount.amount, Amount]);

    // Prevent user from entering amount greater than amount available
    useEffect(() => {
        if (Number(Amount) > Number(listing.amountAvailable.amount)) {
            setButtonDisabled(true);
            setErrors({  amount: `Amount must be less than or equal to the listing amount (EUR ${formatNumber(listing.amountAvailable.amount)})` });
            setTransferAmount('');
        } else {
            setButtonDisabled(false);
            setErrors({});
        }
    }, [listing.amountAvailable.amount, Amount]);

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
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} eur={true} />}
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={open} onClose={toggleDrawer}>
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
                                    <MenuItem value={ADD_ACCOUNT}>{ADD_ACCOUNT}</MenuItem>
                                    {accounts.map((account) => {
                                        if (account.currency === 'NGN') {
                                            return (
                                                <MenuItem key={account.id} value={account.bankName}>{account.bankName}</MenuItem>
                                            )
                                        }
                                        return null;
                                    })}
                                </Select>
                                <FormHelperText>{errors.receivingAccount}</FormHelperText>
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
                    </Grid>
                </form>
            </Drawer>
        </>
	);
};

BuyEurDrawer.propTypes = {
    getAccounts: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { addBid, getAccounts })(BuyEurDrawer);