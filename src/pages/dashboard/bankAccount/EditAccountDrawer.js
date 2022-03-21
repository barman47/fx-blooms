import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    CircularProgress,
    Grid,
    IconButton,
    Drawer,
    TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Close } from 'mdi-material-ui';

import { editAccount } from '../../../actions/bankAccounts';

import { COLORS } from '../../../utils/constants';
import validateEditAccount from '../../../utils/validation/bankAccount/edit';

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
        },

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
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

        progress: {
        color: COLORS.darkGrey,
        position: 'relative',
        top: '5px'
    }
}));

const EditAccountDrawer = ({ editAccount, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const theme = useTheme();
    const matches = theme.breakpoints.down('md');

    const { account, msg } = useSelector(state => state.bankAccounts);
    const errorsState = useSelector(state => state.errors);

    const [accountId, setAccountId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    // const [nickName, setNickName] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    useEffect(() => {
        if (errorsState) {
            setErrors(errorsState);
        }
    }, [errorsState]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            setOpen(false);
        }
    }, [msg]);

    useEffect(() => {
        if (account) {
            setAccountId(account.accountID);
            setBankName(account.bankName);
            setAccountNumber(account.accountNumber);
            setAccountName(account.accountName);
        }
    }, [account]);

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const data = {
            bankName,
            accountName,
            accountNumber,
            // nickName
            // currency:
        };

        const { errors, isValid } = validateEditAccount(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid account information' });
        }

        setErrors({});
        setLoading(true);
        editAccount(data, accountId)
    };

	return (
        <>
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={loading ? true : open} onClose={toggleDrawer}>
                <Box component="header">
                    <Typography variant="h6" className={classes.header}>Edit Account</Typography>
                    <IconButton color="primary" onClick={toggleDrawer}>
                        <Close />
                    </IconButton>
                </Box>
                <Typography variant="subtitle2" component="small" className={classes.info}>Please note that you will only be paid via a linked account number.</Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container direction="column" spacing={matches ? 3 : 2}>
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
                        {/* <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span">Account Alias</Typography>
                            <TextField 
                                className={classes.input}
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Account Alias"
                                helperText={errors.nickName || 'An alias to identify your account'}
                                fullWidth
                                required
                                error={errors.nickName ? true : false}
                                disabled={loading ? true : false}
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                disableFocusRipple
                                disabled={loading ? true : false}
                            >
                                {loading ? <span>Updating Account. . .&nbsp;&nbsp;&nbsp;<CircularProgress size={20} className={classes.progress} /></span> : 'Update Account'}
                            </Button>            
                        </Grid>
                    </Grid>
                </form>
            </Drawer>
        </>
	);
};

EditAccountDrawer.propTypes = {
    editAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired
};

export default connect(undefined, { editAccount })(EditAccountDrawer);