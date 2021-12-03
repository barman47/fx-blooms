import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
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
import { COLORS } from '../../../utils/constants';
import validateAddBankAccount from '../../../utils/validation/bankAccount/add';

import SuccessModal from '../../../components/common/SuccessModal';
import { SET_ACCOUNT_MSG } from '../../../actions/types';

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
  

const AddAccountDrawer = ({ addAccount, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = theme.breakpoints.down('md');

    const { customerId, firstName, lastName } = useSelector(state => state.customer);
    const { msg } = useSelector(state => state.bankAccounts);

    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState(`${firstName} ${lastName}`);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);

    const successModal = useRef();

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (msg) {
            setBankName('');
            setAccountNumber('');
            setLoading(false);
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [msg]);

    const dismissAction = () => {
        dispatch({
            type: SET_ACCOUNT_MSG,
            payload: null
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            bankName,
            accountName,
            accountNumber,
            currency: value === 0 ? 'NGN' : 'EUR',
            customerId
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
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={loading ? true : open} onClose={toggleDrawer}>
                <Typography variant="h6" className={classes.header}>Add Account</Typography>
                <Typography variant="subtitle2" component="small" className={classes.info}>Please note that you will only be paid via a linked account number.</Typography>
                <Tabs value={value} onChange={handleChange} aria-label="fund-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth" className={classes.tabs}>
                    <Tab 
                        label={<Typography variant="subtitle1" component="p" className={classes.tabLabel}>NGN Account</Typography>} 
                        {...a11yProps(0)} 
                        disableRipple
                        disabled={loading ? true : false}
                    />
                    <Tab 
                        label={<Typography variant="subtitle1" component="p" className={classes.tabLabel}>EUR Account</Typography>} 
                        {...a11yProps(1)} 
                        disableRipple
                        disabled={loading ? true : false}
                    />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container direction="column" spacing={matches ? 3 : 2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Add your NGN receiving account</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Bank Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    helperText={errors.bankName}
                                    fullWidth
                                    required
                                    error={errors.bankName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Account Number</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Number"
                                    helperText={errors.accountNumber}
                                    fullWidth
                                    required
                                    error={errors.accountNumber ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Account Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    helperText={errors.accountName}
                                    fullWidth
                                    required
                                    error={errors.accountName ? true : false}
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
                <TabPanel value={value} index={1}>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container direction="column" spacing={matches ? 3 : 2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Add your NGN receiving account</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Bank Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    helperText={errors.bankName}
                                    fullWidth
                                    required
                                    error={errors.bankName ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">IBAN</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter IBAN"
                                    helperText={errors.accountNumber}
                                    fullWidth
                                    required
                                    error={errors.accountNumber ? true : false}
                                    disabled={loading ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Bank Name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    helperText={errors.accountName}
                                    fullWidth
                                    required
                                    error={errors.accountName ? true : false}
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
};

export default connect(undefined, { addAccount })(AddAccountDrawer);