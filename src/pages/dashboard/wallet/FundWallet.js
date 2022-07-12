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
    Select,
    TextField,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Security } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import { getCurrencies } from '../../../actions/currencies';
import { requestWalletFunding } from '../../../actions/wallets';
import { GET_ERRORS, SET_FUNDING_REQUEST, SET_INSTITUTIONS } from '../../../actions/types';

import handleSetValue from '../../../utils/handleSetValue';
import isEmpty from '../../../utils/isEmpty';
import { COLORS, CUSTOMER_CATEGORY, ID_STATUS } from '../../../utils/constants';
import getAccount from '../../../utils/getAccount';
import { SUPPORTED_FUNDING_INSTITUTIONS } from '../../../utils/institutions';
import validateFundWallet from '../../../utils/validation/wallets/fund';

import { BANK_ACCOUNTS } from '../../../routes';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import Spinner from '../../../components/common/Spinner';
import Toast from '../../../components/common/Toast';
import IDVerificationModal from '../idVerification/IDVerificationModal';
import PendingIdModal from '../idVerification/PendingIdModal';
import NoInsitutionModal from './NoInsitutionModal';
import UnsupportedInstitutionModal from './UnsupportedInstitutionModal';
import SupportedFundingInstitutionsModal from '../bankAccount/SupportedFundingInstitutionsModal';

import yapily from '../../../assets/img/yapily.png';
// import bankTransfer from '../../../assets/img/bank-transfer.png';
// import cardPayment from '../../../assets/img/card-logo.png';

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
        marginTop: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        },

        '& img': {
            width: theme.spacing(15),

            [theme.breakpoints.down('sm')]: {
                flexDirection: 'row',
                width: theme.spacing(10)
            },
        }
    },

    noteContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    icon: {
        color: COLORS.grey,
        margin: theme.spacing(0, 2)
    }
}));

const FundWallet = ({ getCurrencies, requestWalletFunding, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const errorsState = useSelector(state => state.errors);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { idStatus } = useSelector(state => state.customer.stats);
    const { currencies, customer } = useSelector(state => state);
    const { wallet } = useSelector(state => state.wallets);

    const [currency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [sourceAccount, setSourceAccount] = useState('');
    const [toastTitle, setToastTitle] = useState('');
    const [checked, setChecked] = useState(false);
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);

    const [showPendingIdModal, setShowPendingIdModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const idVerificationModal = useRef();
    const noInstitutionModal = useRef();
    const toast = useRef();
    const supportedInstitutions = useRef();
    const unsupportedInstitutionModal = useRef();

    const { APPROVED, NOT_SUBMITTED } = ID_STATUS;
    const { PENDING, REJECTED } = CUSTOMER_CATEGORY;

    useEffect(() => {
        handleSetTitle('Fund Wallet');

        if (idStatus !== APPROVED) {
            checkIdStatus();
        }

        if (currencies.length === 0) {
            getCurrencies()
        }

        dispatch({
            type: SET_FUNDING_REQUEST,
            payload: {}
        });

        return () => {
            dispatch({
                type: SET_INSTITUTIONS,
                payload: []
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (errors.notSupported) {
            unsupportedInstitutionModal.current.openModal();
        }
    }, [errors]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setToastTitle('ERROR');
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    // Check if selected account supports instant payment when selected
    useEffect(() => {
        if (checked) {
            let supportsFunding = false;
            const account = getAccount(sourceAccount, accounts);
            const customerInstitution = SUPPORTED_FUNDING_INSTITUTIONS.find(institution => institution.id === account.institutionId);

            if (customerInstitution.features.includes('INITIATE_DOMESTIC_SINGLE_INSTANT_PAYMENT')) {
                supportsFunding = true;
            }

            if (!supportsFunding || customerInstitution.fullName === 'Revolut EU') {
                // Show not supported message and clear the bank state
                setToastTitle('Not Supported');
                setErrors({ msg: 'Institution does not support instant payment', sourceAccount: 'Your selected institution does not support instant payment' });
                setChecked(false);
            }
        }
    }, [accounts, checked, errors, sourceAccount]);

    const handleShowSupportedInstitutions = () => {
        setErrors({});
        supportedInstitutions.current.openModal();
    };

    const checkIdStatus = () => {
        switch (idStatus) {
            case APPROVED:
                break;

            case PENDING:
                setShowPendingIdModal(true);
                break;

            case REJECTED:
                idVerificationModal.current.openModal();
                break;

            case NOT_SUBMITTED:
                idVerificationModal.current.openModal();
                break;

            default:
                break;
        }
    };

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setSourceAccount('');
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const handleClosePendingIdModal = () => {
        setShowPendingIdModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        
        const { accountID, accountName, accountNumber, bankName, institutionId } = getAccount(sourceAccount, accounts);
        const data = {
            institutionId,
            institution: bankName,
            fullName: `${customer.firstName} ${customer.lastName}`,
            type: 1,
            amount: amount ? Number(amount) : '',
            walletId: wallet.id,
            accountId: sourceAccount ? accountID : '',
            accountName: sourceAccount ? accountName : '',
            accountNumber: sourceAccount ? accountNumber : '',
            useInstantPayment: false,
            reference: "FXBLOOMS"
        };

        if (!data.institutionId) {
            return noInstitutionModal.current.openModal();
        }

        const { errors, isValid } = validateFundWallet(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid funding data!' });
        }

        if (idStatus !== APPROVED) {
            return checkIdStatus();
        }

        setLoading(true);
        requestWalletFunding(data, navigate);
    };

    const dismissAction = () => {
        navigate(BANK_ACCOUNTS);
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title={toastTitle || 'ERROR'}
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <IDVerificationModal ref={idVerificationModal} />
            <NoInsitutionModal ref={noInstitutionModal} dismissAction={dismissAction} />
            <UnsupportedInstitutionModal ref={unsupportedInstitutionModal} dismissAction={handleShowSupportedInstitutions} />
            <SupportedFundingInstitutionsModal ref={supportedInstitutions} />
            {showPendingIdModal && <PendingIdModal open={showPendingIdModal} handleCloseModal={handleClosePendingIdModal} />}
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} ngn={currency === 'NGN' ? true : false} eur={currency === 'EUR' ? true : false} />}
            <Box component="section" className={classes.root}>
                <Typography variant="h6" color="primary" className={classes.pageTitle}>Select a suitable medium of payment</Typography>
                <form onSubmit={handleFormSubmit} noValidate>
                    <Typography variant="subtitle2" component="span" className={classes.helperText}>Amount to fund wallet with</Typography>
                    <Grid className={classes.inputs} container direction="row" alignItems="center" spacing={1}>
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
                                    // onChange={(e) => setCurrency(e.target.value)}
                                
                                >
                                    {/* <MenuItem value="" disabled>Select Currency</MenuItem> */}
                                    <MenuItem value={currency} selected>{currency}</MenuItem>
                                    {/* {currencies.length > 0 && currencies.map((currency, index) => (
                                        <MenuItem key={index} value={currency.value}>{currency.value}</MenuItem>
                                    ))} */}
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
                        {/* <Grid item xs={12}>
                            <FormHelperText>Transaction Fee, &#8364;1</FormHelperText>
                        </Grid> */}
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
                        {/* <Grid item xs={12}>
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
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Use Instant Payment</Typography>
                            <br />
                            <Checkbox
                                color="primary"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={sourceAccount ? false : true}
                            />
                            <Typography variant="subtitle2" component="span" color="secondary">Please note: Instant payment may come with additional charges from your bank.</Typography>
                        </Grid> */}
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
                        <img src={yapily} alt="Yapily Logo" />
                        <Box className={classes.noteContent}>
                            <Security className={classes.icon} />
                            <Typography variant="subtitle2" component="span" className={classes.text}>This service is powered by Yapily (Safe Connect) UAB. Your information is used for payment processing only, and will be kept secure by Safe Connect UAB.</Typography>
                        </Box>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

FundWallet.propTypes = {
    getCurrencies: PropTypes.func.isRequired,
    requestWalletFunding: PropTypes.func.isRequired
};

export default connect(undefined, { requestWalletFunding, getCurrencies })(FundWallet);