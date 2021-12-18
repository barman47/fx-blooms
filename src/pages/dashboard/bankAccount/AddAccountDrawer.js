import { useCallback, useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    CircularProgress,
    Grid,
    Drawer,
    Tab,
    Tabs,
    TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { addAccount } from '../../../actions/bankAccounts';
import { GET_ERRORS, SET_ACCOUNT, SET_ACCOUNT_MSG } from '../../../actions/types';
import { COLORS } from '../../../utils/constants';
import validateAddBankAccount from '../../../utils/validation/bankAccount/add';

import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(4),
        width: '35vw',

        [theme.breakpoints.down('md')]: {
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '80vw'
        }
    },

    tabs: {
        borderBottom: `1px solid ${COLORS.borderColor}`,
        marginTop: theme.spacing(4),
    },

    header: {
        color: theme.palette.primary.main,
    },

    info: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.main,
        marginTop: theme.spacing(2),
        padding: theme.spacing(1)
    },

    tabLabel: {
        fontWeight: 600,
        textTransform: 'capitalize'
    },

        progress: {
        color: COLORS.darkGrey,
        position: 'relative',
        top: '5px'
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box p={3}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `fund-tabs-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  

const AddAccountDrawer = ({ addAccount, toggleDrawer, drawerOpen, eur, ngn }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = theme.breakpoints.down('md');

    const { customerId, firstName, lastName } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { msg } = useSelector(state => state.bankAccounts);

    const [BankName, setBankName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');
    const [AccountName, setAccountName] = useState(`${firstName} ${lastName}`);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);

    const successModal = useRef();
    const toast = useRef();

    const setReceivingAccountType = useCallback(() => {
        if (eur && ngn) {
            setValue(0);
        } else if (eur) {
            setValue(0);
        } else if (ngn) {
            setValue(0);
        }
    }, [eur, ngn]);

    useEffect(() => {
        setOpen(drawerOpen);
        if (drawerOpen) {
            setReceivingAccountType();
        }
    }, [drawerOpen, setReceivingAccountType]);

    useEffect(() => {
        if (!isEmpty(errorsState)) {
            setErrors(errorsState);
        }
    }, [errorsState]);

    useEffect(() => {
        if (!isEmpty(errors) && !isEmpty(errorsState)) {
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errors, errorsState]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            
        }
    }, [dispatch, errorsState, errors]);

    useEffect(() => {
        if (msg) {
            setBankName('');
            setAccountNumber('');
            setLoading(false);
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [msg]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSetCurrency = () => {
        if (eur && ngn) {
            if (value === 0) {
                return'NGN';
            } else {
                return 'EUR';
            }
        } else if (eur) {
            return 'EUR';
        } else if (ngn) {
            return'NGN';
        }
    };

    const dismissAction = () => {
        setOpen(false);
        batch(() => {
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
            dispatch({
                type: SET_ACCOUNT_MSG,
                payload: null
            });
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            BankName,
            AccountName,
            AccountNumber,
            Currency: handleSetCurrency(),
            CustomerId: customerId
        };

        const { errors, isValid } = validateAddBankAccount(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid account information' });
        }

        setErrors({});
        setLoading(true);
        addAccount(data)
    };

	return (
        <>
            {msg && <SuccessModal ref={successModal} dismissAction={dismissAction} /> }
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={loading ? true : open} onClose={toggleDrawer}>
                <Typography variant="h6" className={classes.header}>Add Account</Typography>
                <Typography variant="subtitle2" component="small" className={classes.info}>Please note that you will only be paid via a linked account number.</Typography>
                <Tabs value={value} onChange={handleChange} aria-label="fund-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth" className={classes.tabs}>
                    {ngn && 
                        <Tab 
                            label={<Typography variant="subtitle1" component="p" className={classes.tabLabel}>NGN Account</Typography>} 
                            {...a11yProps(ngn && eur ? 0 : ngn && !eur ? 0 : 1)} 
                            disableRipple
                            disabled={loading ? true : false}
                        />
                    }
                    {eur && 
                        <Tab 
                            label={<Typography variant="subtitle1" component="p" className={classes.tabLabel}>EUR Account</Typography>} 
                            {...a11yProps(ngn && eur ? 1 : !ngn && eur ? 0 : 1)} 
                            disableRipple
                            disabled={loading ? true : false}
                        />
                    }
                </Tabs>
                <TabPanel value={value} index={ngn && eur ? 0 : ngn && !eur ? 0 : 1}>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container direction="column" spacing={matches ? 3 : 2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Add your NGN receiving account</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Bank Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={BankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    helperText={errors.BankName}
                                    fullWidth
                                    required
                                    error={errors.BankName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Account Number</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={AccountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Number"
                                    helperText={errors.AccountNumber}
                                    fullWidth
                                    required
                                    error={errors.AccountNumber ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Account Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={AccountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    helperText={errors.AccountName}
                                    fullWidth
                                    required
                                    error={errors.AccountName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    disableFocusRipple
                                    disabled={loading ? true : false}
                                >
                                    {loading ? <span>Adding Account. . .&nbsp;&nbsp;&nbsp;<CircularProgress size={20} className={classes.progress} /></span> : 'Add Account'}
                                </Button>            
                            </Grid>
                        </Grid>
                    </form>
                </TabPanel>
                <TabPanel value={value} index={ngn && eur ? 1 : !ngn && eur ? 0 : 1}>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container direction="column" spacing={matches ? 3 : 2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Add your EUR receiving account</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Bank Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={BankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    helperText={errors.BankName}
                                    fullWidth
                                    required
                                    error={errors.BankName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">IBAN</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={AccountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter IBAN"
                                    helperText={errors.AccountNumber}
                                    fullWidth
                                    required
                                    error={errors.AccountNumber ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Account Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={AccountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    helperText={errors.AccountName}
                                    fullWidth
                                    required
                                    error={errors.AccountName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    disableFocusRipple
                                    disabled={loading ? true : false}
                                >
                                    {loading ? <span>Adding Account. . .&nbsp;&nbsp;&nbsp;<CircularProgress size={20} className={classes.progress} /></span> : 'Add Account'}
                                </Button>            
                            </Grid>
                        </Grid>
                    </form>
                </TabPanel>
            </Drawer>
        </>
	);
};

AddAccountDrawer.propTypes = {
    addAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    eur: PropTypes.bool.isRequired,
    ngn: PropTypes.bool.isRequired
};

export default connect(undefined, { addAccount })(AddAccountDrawer);