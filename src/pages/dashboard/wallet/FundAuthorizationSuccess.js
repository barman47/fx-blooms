import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const FundAuthorizationSuccess = ({ getCurrencies, fundWallet, getInstitutions, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const errorsState = useSelector(state => state.errors);
    const { accounts } = useSelector(state => state.bankAccounts);
    const { institutions, currencies, customer } = useSelector(state => state);
    const { wallet } = useSelector(state => state.wallets);

    const [currency, setCurrency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [sourceAccount, setSourceAccount] = useState('');
    const [institution, setInstitution] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Authorization Success');
        console.log(location);
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
            <Box component="section" className={classes.root}>
                <Typography variant="h6" color="primary" className={classes.pageTitle}>Select a suitable medium </Typography>
                
            </Box>
        </>
    );
};

FundAuthorizationSuccess.propTypes = {
    getCurrencies: PropTypes.func.isRequired,
    getInstitutions: PropTypes.func.isRequired,
    fundWallet: PropTypes.func.isRequired
};

export default connect(undefined, { fundWallet, getCurrencies, getInstitutions })(FundAuthorizationSuccess);