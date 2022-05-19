import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Radio,
    Select,
    TextField,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Security } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import { getCurrencies } from '../../../actions/currencies';
import { getInstitutions } from '../../../actions/institutions';
import { fundWallet } from '../../../actions/wallets';
import { GET_ERRORS, SET_FUNDING_DETAILS } from '../../../actions/types';

import handleSetValue from '../../../utils/handleSetValue';
import isEmpty from '../../../utils/isEmpty';
import { COLORS } from '../../../utils/constants';
import getAccountId from '../../../utils/getAccountId';
import validateFundWallet from '../../../utils/validation/wallets/fund';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';

import yapily from '../../../assets/img/yapily.png';
import bankTransfer from '../../../assets/img/bank-transfer.png';
import cardPayment from '../../../assets/img/card-payment.png';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 5, 2, 5),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0, 1, 1, 1),
        },

        '& form': {
            margin: '0 auto',
            width:'50%',

            [theme.breakpoints.down('md')]: {
                width: '90%'
            }
        }
    },

    paymentMethod: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(),

        '& img': {
            width: theme.spacing(15),

            [theme.breakpoints.down('sm')]: {
                width: theme.spacing(5)
            },
        }
    },

    textContainer: {
        marginLeft: theme.spacing(2)
    },

    pageTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(2),
            textAlign: 'center'
        }
    },

    title: {
        fontWeight: 600
    },

    option: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        '& img': {
            marginLeft: theme.spacing(2),
            width: theme.spacing(3),
        }
    },

    text: {
        color: COLORS.grey,
        fontWeight: 300,

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.2)
        }
    },

    soon: {
        color: COLORS.red,
        fontStyle: 'italic',
        fontWeight: 300,

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1)
        }
    },

    note: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing(3)
    },

    icon: {
        color: COLORS.grey,
        marginRight: theme.spacing(2)
    }
}));

const FundWallet = ({ getCurrencies, fundWallet, getInstitutions, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const errorsState = useSelector(state => state.errors);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { institutions, currencies, customer } = useSelector(state => state);
    const { wallet } = useSelector(state => state.wallets);

    const [currency, setCurrency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [sourceAccount, setSourceAccount] = useState('');
    const [institution, setInstitution] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Fund Wallet');
        if (currencies.length === 0) {
            getCurrencies()
        }
        if (institutions.length === 0) {
            getInstitutions()
        }

        dispatch({
            type: SET_FUNDING_DETAILS,
            payload: {}
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
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
        }
    }, [dispatch, errorsState, errors]);

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setSourceAccount('');
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            institutionId: institution,
            fullName: `${customer.firstName} ${customer.lastName}`,
            type: 1,
            amount: amount ? Number(amount) : '',
            walletId: wallet.id,
            accountId: sourceAccount ? getAccountId(sourceAccount, accounts) : '',
            reference: "WALLET FUNDING"
        };

        const { errors, isValid } = validateFundWallet(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid funding data!' });
        }
        setLoading(true);
        fundWallet(data, navigate);
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} ngn={currency === 'NGN' ? true : false} eur={currency === 'EUR' ? true : false} />}
            <Box component="section" className={classes.root}>
                <Typography variant="h6" color="primary" className={classes.pageTitle}>Select a suitable medium of payment</Typography>
                <form onSubmit={handleFormSubmit} noValidate>
                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Amount to fund wallet with</Typography>
                    <Grid className={classes.inputs} container direction="row" alignItems="center" spacing={2}>
                        <Grid item xs={4} lg={3}>
                            <FormControl 
                                variant="outlined" 
                                error={errors.AvailableCurrency ? true : false } 
                                fullWidth 
                                required
                                disabled={loading ? true : false}
                            >
                                <Select
                                    labelId="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                
                                >
                                    <MenuItem value="" disabled>Select Currency</MenuItem>
                                    {currencies.length > 0 && currencies.map((currency, index) => (
                                        <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.AvailableCurrency}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} lg={9}>
                            <TextField
                                className={classes.input}
                                value={amount}
                                onChange={(e) => {
                                    handleSetValue(e.target.value, setAmount);
                                }}
                                placeholder="Enter amount"
                                type="text"
                                variant="outlined" 
                                required
                                error={errors.amount ? true : false}
                                disabled={loading}
                                fullWidth 
                                helperText={errors.amount}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Select Source Account</Typography>
                            <FormControl 
                                variant="outlined" 
                                error={errors.sourceAccount ? true : false } 
                                fullWidth 
                                required
                                disabled={loading ? true : false}
                            >
                                <Select
                                    labelId="sourceAccount"
                                    value={sourceAccount}
                                    onChange={(e) => setSourceAccount(e.target.value)}
                                >
                                    <MenuItem value="" disabled>Select your receiving account</MenuItem>
                                    {currency === 'EUR' ?
                                        accounts.map((account) => {
                                            if (account.currency === 'EUR') {
                                                return (
                                                    <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                                );
                                            }
                                            return null;
                                        })
                                        :
                                        accounts.map((account) => {
                                            if (account.currency === 'NGN') {
                                                return (
                                                    <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                                );
                                            }
                                            return null;
                                        })
                                    }
                                </Select>
                                <FormHelperText>{errors.sourceAccount}</FormHelperText>
                            </FormControl>
                            <Button variant="text" color="primary" onClick={handleAddAccount} className={classes.addAccountButton}>Add New Account</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Financial Institution</Typography>
                            <Autocomplete
                                id="country-select"
                                options={institutions}
                                autoHighlight
                                disableClearable
                                getOptionLabel={(option) => {
                                    setInstitution(option.id);
                                    return option.fullName;
                                }}
                                renderOption={(option) => (
                                    <>
                                        <div className={classes.option}>
                                            <span>{option.fullName}</span>
                                            <img src={option.media[0].source} alt={`${institution.fullName} Logo`} />
                                        </div>
                                    </>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        error={errors.institution ? true : false}
                                        helperText={errors.institution}
                                        {...params}
                                        variant="outlined"
                                        inputProps={{
                                            ...params.inputProps,
                                            // autoComplete: 'new-password',
                                        }}
                                        // onChange={(e) => setCountryCode(e.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box component="section" className={classes.paymentMethod}>
                                <Radio
                                    color="primary"
                                    checked={true}
                                    onChange={() => {}}
                                    value="open-banking"
                                    name="payment-method"
                                    inputProps={{ 'aria-label': 'Open Banking' }}
                                />
                                <img src={yapily} alt="Yapily Logo" />
                                <Box component="div" className={classes.textContainer}>
                                    <Typography variant="body2" component="p" className={classes.title}>Open Banking</Typography>
                                    <Typography variant="body2" component="p" className={classes.text}>Fund your wallet using Yapily</Typography>
                                </Box>
                            </Box>
                            <Box component="section" className={classes.paymentMethod}>
                                <Radio
                                    color="primary"
                                    disabled
                                    onChange={() => {}}
                                    value="open-banking"
                                    name="payment-method"
                                    inputProps={{ 'aria-label': 'Open Banking' }}
                                />
                                <img src={bankTransfer} alt="SEPA Logo" />
                                <Box component="div" className={classes.textContainer}>
                                    <Typography variant="body2" component="p" className={classes.title}>Bank Transfer</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.text}>Account to account transfer</Typography>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle2" component="span" className={classes.soon}>Coming soon</Typography>
                                </Box>
                            </Box>
                            <Box component="section" className={classes.paymentMethod}>
                                <Radio
                                    color="primary"
                                    disabled
                                    onChange={() => {}}
                                    value="open-banking"
                                    name="payment-method"
                                    inputProps={{ 'aria-label': 'Open Banking' }}
                                />
                                <img src={cardPayment} alt="Card Payment Logo" />
                                <Box component="div" className={classes.textContainer}>
                                    <Typography variant="body2" component="p" className={classes.title}>Card payment</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.text}>Fund with debit or credit card</Typography>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle2" component="span" className={classes.soon}>Coming soon</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={12} md={6}>
                            <Button 
                                variant="outlined" 
                                size="large"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                onClick={() => navigate(-1)}
                            >
                                Go Back
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button 
                                type="submit"
                                size="large"
                                variant="contained" 
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                Continue
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.note}>
                        <Security className={classes.icon} />
                        <Typography variant="subtitle2" component="span" className={classes.text}>This service is powered by Yapily. Your information is used for indetity verification only and will be kept secure by Yapily.</Typography>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

FundWallet.propTypes = {
    getCurrencies: PropTypes.func.isRequired,
    getInstitutions: PropTypes.func.isRequired,
    fundWallet: PropTypes.func.isRequired
};

export default connect(undefined, { fundWallet, getCurrencies, getInstitutions })(FundWallet);