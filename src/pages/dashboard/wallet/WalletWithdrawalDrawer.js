import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
	Button,
    Drawer,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: [[theme.spacing(2), theme.spacing(7)]],
        width: '30vw',
        overflowY: 'auto',

        [theme.breakpoints.down('md')]: {
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
        marginTop: theme.spacing(4)
    },

    notice: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.primary.main,
        padding: theme.spacing(2),
    },

    withdrawalFee: {
        backgroundColor: 'rgba(81, 103, 103, 1)',
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        
        '& .MuiInputBase-root': {
            color: COLORS.offWhite
        }
    }
}));
  
const WalletWithdrawalDrawer = ({ toggleDrawer, drawerOpen }) => {
	const classes = useStyles();

    const [receivingAccount, setReceivingAccount] = useState('');
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    const closeModal = () => {
        setOpen(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

	return (
        <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={open} onClose={toggleDrawer}>
            <Typography variant="h6" className={classes.header}>Request Withdrawal</Typography>
            <form onSubmit={onSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.text}>Input your PIN to authenticate your  withdrawal request to your bank account.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.notice}>Please note that you will be charged 1.5% of your withdrawal amount.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" component="span" className={classes.helperText}>Receiving Account</Typography>
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
                                <MenuItem value="" disabled selected>Select your receiving account</MenuItem>
                            </Select>
                            <FormHelperText>{errors.receivingAccount}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" component="span" className={classes.label}>Amount</Typography>
                        <TextField 
                            className={classes.input}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="text"
                            variant="outlined" 
                            placeholder="EUR"
                            helperText={errors.amount}
                            fullWidth
                            required
                            error={errors.amount ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" component="span" className={classes.label}>Withdrawal Fee</Typography>
                        <TextField 
                            className={classes.withdrawalFee}
                            classes={{ root: classes.withdrawalFee }}
                            value="EUR 0.00"
                            // onChange={(e) => setAmount(e.target.value)}
                            type="text"
                            variant="outlined" 
                            // placeholder="EUR 0.00"
                            // helperText={errors.amount}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={closeModal} variant="contained" color="primary" fullWidth disableFocusRipple className={classes.button}>Submit Request</Button>
                    </Grid>
                </Grid>
            </form>
        </Drawer>
	);
};

WalletWithdrawalDrawer.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

export default WalletWithdrawalDrawer;