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
// import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

import { getWallets, requestWithdrawal } from '../../../actions/wallets';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../../actions/types';

import handleSetValue from '../../../utils/handleSetValue';
import isEmpty from '../../../utils/isEmpty';
import getAccountId from '../../../utils/getAccount';
import validateRequestWithdrawal from '../../../utils/validation/wallets/withdraw';
import moveToNextField from '../../../utils/moveToNextField';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import Spinner from '../../../components/common/Spinner';
import AlertModal from '../../../components/common/AlertModal';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import formatNumber from '../../../utils/formatNumber';
import { DASHBOARD_HOME, PIN } from '../../../routes';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(0, 5, 2, 5),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0)
        },

        '& form': {
            margin: '0 auto',
            width:'50%',

            [theme.breakpoints.down('md')]: {
                width: '90%'
            }
        }
    },

    subTitle: {
        marginBottom: theme.spacing(2)
    },

    alert: {
        marginBottom: theme.spacing(2)
    },

    pageTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(2),
            textAlign: 'center'
        }
    }
}));

const RequestWithdrawal = ({ getWallets, handleSetTitle, requestWithdrawal }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const errorsState = useSelector(state => state.errors);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { customerId, hasSetPin, firstName, lastName, msg } = useSelector(state => state.customer);
    const { wallet } = useSelector(state => state.wallets);

    const [currency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [sourceAccount, setSourceAccount] = useState('');
    const [reference, setReference] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    // eslint-disable-next-line
    const [withdrawalFee, setWithdrawalFee] = useState(0);
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const firstField = useRef();
    const secondField = useRef();
    const thirdField = useRef();
    const fourthField = useRef();

    const alertModal = useRef();
    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Request Withdrawal');
        handleSetPin();
        // eslint-disable-next-line
    }, []);

    // Set withdrawal fee when user enters amount
    // useEffect(() => {
    //     if (amount) {
    //         setWithdrawalFee(((1/100) * amount).toFixed(2));
    //     }
    // }, [amount]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [msg]);

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

    const handleSetPin = () => {
        if (!hasSetPin) {
            alertModal.current.setModalText('Security PIN is required for all withdrawals. Kindly set up your PIN first.');
            alertModal.current.openModal();   
        }
    };

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setSourceAccount('');
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            fullName: `${firstName} ${lastName}`,
            type: 2,
            amount: amount ? Number(amount) : '',
            walletId: wallet.id,
            accountId: sourceAccount ? getAccountId(sourceAccount, accounts).accountID : '',
            reference,
            first,
            second,
            third,
            fourth
        };

        const { errors, isValid } = validateRequestWithdrawal(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid withdrawal data!' });
        }

        if (data.amount > wallet.balance.available) {
            return setErrors({ ...errors, amount: `Wallet balance (EUR ${formatNumber(wallet.balance.available, 2)}) not enough for withdrawal`, msg: 'Insufficient wallet balance!' });
        }
        setLoading(true);
        requestWithdrawal(data);
    };

    const dismissAction = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
        getWallets(customerId);
        navigate(DASHBOARD_HOME);
    };

    const dismissAlertModal = () => {
        alertModal.current.closeModal();
        navigate(PIN);
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
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <AlertModal ref={alertModal} dismissAction={dismissAlertModal} />
            <Box component="section" className={classes.root}>
                <form onSubmit={handleFormSubmit} noValidate>
                    <Typography variant="h6" color="primary" className={classes.pageTitle}>Request Withdrawal</Typography>
                    <Typography variant="body2" component="p" className={classes.subTitle}>Input your PIN to authenticate a withdrawal request to your bank account.</Typography>
                    {/* <Alert className={classes.alert} severity="info">Please note that you will be chanrged 1% of the withdrawal fee.</Alert> */}
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span">Select Receiving Account</Typography>
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
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Amount</Typography>
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
                            {/* <FormHelperText>Withdrawal fee: EUR {formatNumber(withdrawalFee, 2)}</FormHelperText> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.helperText}>Withdrawal Reference (OPTIONAL)</Typography>
                            <TextField
                                className={classes.input}
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Enter the reference to add to your withdrawal request"
                                type="text"
                                variant="outlined" 
                                disabled={loading}
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="p">Enter PIN</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={first}
                                onChange={(e) => {
                                    handleSetValue(e.target.value, setFirst);
                                }}
                                onKeyUp={(e) => moveToNextField(e.target, secondField.current, null)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                required
                                error={errors.first ? true : false}
                                ref={firstField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={second}
                                onChange={(e) => setSecond(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, thirdField.current, firstField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={errors.second ? true : false}
                                ref={secondField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={third}
                                onChange={(e) => setThird(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, fourthField.current, secondField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={errors.third ? true : false}
                                ref={thirdField}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                className={classes.input}
                                value={fourth}
                                onChange={(e) => setFourth(e.target.value)}
                                onKeyUp={(e) => moveToNextField(e.target, null, thirdField.current)}
                                type="text"
                                variant="outlined" 
                                inputProps={{
                                    maxLength: 1
                                }}
                                max={1}
                                required
                                error={errors.fourth ? true : false}
                                ref={fourthField}
                                disabled={loading}
                            />
                        </Grid>
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
                                Send Request
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

RequestWithdrawal.propTypes = {
    getWallets: PropTypes.func.isRequired,
    requestWithdrawal: PropTypes.func.isRequired
};

export default connect(undefined, { getWallets, requestWithdrawal })(RequestWithdrawal);