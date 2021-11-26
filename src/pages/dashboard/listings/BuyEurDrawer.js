import { useEffect, useState } from 'react';
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

import { COLORS } from '../../../utils/constants';

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

const BuyEurDrawer = ({ toggleDrawer, drawerOpen }) => {
	const classes = useStyles();

    const [amount, setAmount] = useState('');
    const [receivingAccount, setReceivingAccount] = useState('');
    // eslint-disable-next-line
    const [transferAmount, setTransferAmount] = useState('');
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    const onSubmit = (e) => {
        e.preventDefault();
    };

	return (
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
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="text"
                            variant="outlined" 
                            placeholder="Enter Amount"
                            helperText={errors.amount}
                            fullWidth
                            required
                            error={errors.amount ? true : false}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormHelperText className={classes.formHelperText}>Seller rate: NGN644 to 1EUR</FormHelperText>
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
                                <MenuItem value="" disabled selected>Select your receiving account</MenuItem>
                                {/* {accounts.length > 0 && accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>{account.bankName}</MenuItem>
                                ))} */}
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
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Azeez Iyanuoluwa Tahir</Typography>
                            </div>
                            <div className={classes.accountContainer}>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Number</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>0093884786</Typography>
                                </section>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>GTBank</Typography>
                                </section>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Hello FXBLOOMS money</Typography>
                            </div>
                        </section>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth disableFocusRipple className={classes.button}>I've Made Payment</Button>
                    </Grid>
                </Grid>
            </form>
        </Drawer>
	);
};

BuyEurDrawer.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

export default BuyEurDrawer;